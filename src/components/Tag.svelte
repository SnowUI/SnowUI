<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Tag 组件：标签 v1.2.3

  布局模型：内联外壳布局（与 Button 一致），不接入三槽位。
  - 子元素通过 gap 自然排列；外部覆盖 `--snowui-tag-gap`（或传 gap）即可同步影响所有子元素之间的间距，包括内置 X 与文字、外部 Icon 与文字。
  - 内部不内置 leading Icon；需要 Dot 等 leading 元素由消费方显式传入。

  视觉变体：
    - default：Black/4% 背景；
    - active：Brand 10% 背景 + Brand 文字；X 使用 Brand 40%，hover X 时 Brand 100%。
      → 通过映射到 Frame 状态机 currentState="Active"，自动获得 aria-pressed="true"。
    - toggle：Button 同款语法糖，点击在 Idle / Active 间切换。

  closable：渲染内置 X（hover Tag 时显形）。X 颜色 currentColor + 默认透明度 40%，
            点击触发 onClose，不冒泡到 Tag 根 onclick。

  shape：default / left-arrow / right-arrow，用于路径 / 面包屑片段。

  详见：./Tag.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import { resizeManager } from "../logic/observer.svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";

    interface Props extends Omit<FrameProps, "size"> {
        /** 内置图标按钮配置；事件与角色由所属组件控制。 */
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        variant?: "default" | "active";
        toggle?: boolean;
        closable?: boolean;
        shape?: "default" | "left-arrow" | "right-arrow";
        onClose?: (event: MouseEvent) => void;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = "default",
        toggle = false,
        closable = false,
        shape = "default",
        onClose,
        class: className = "",
        currentState: userCurrentState,
        parts = undefined,
        children,
        ...rest
    }: Props = $props();

    // toggle 模式默认值注入：与 Button 一致，状态切换交给 Frame。
    // 消费方显式传 Click / whileClick 时保持外部优先。
    const toggleDefaults = $derived.by(() => {
        if (!toggle) return undefined;
        const out: Record<string, any> = {};
        if (rest.Click === undefined) out.Click = { Idle: "Active", Active: "Idle" };
        if (rest.whileClick === undefined) out.whileClick = false;
        return out;
    });

    // variant="active" → 映射到 Frame 状态机 currentState="Active"。
    // default / toggle 场景不写入受控 currentState，避免把 Frame 状态机锁回 Idle。
    // 消费方若显式传 currentState，则以消费方为准（用于自定义状态流）。
    const resolvedCurrentState = $derived(
        userCurrentState ?? (variant === "active" && !toggle ? "Active" : undefined),
    );

    // 检测首/末位真实节点（包含文本节点）是 Icon 还是文本。
    // 用于按"元素类型决定边距"的规则收紧 padding：Icon/X 距边 4px、文字距边 8px。
    // 排除内置 .snowui-tag-close（X 由 [data-closable]:hover 单独管理 padding）。
    let hostElement = $state<HTMLElement>();
    let edgeLeft = $state<"icon" | "text">("text");
    let edgeRight = $state<"icon" | "text">("text");
    let measuredWidth = $state(0);
    let measuredHeight = $state(0);
    let measuredArrowWidth = $state(8);

    const arrowPath = $derived(
        shape === "default"
            ? ""
            : buildArrowPath(shape, measuredWidth, measuredHeight, measuredArrowWidth),
    );

    function isIconElement(node: Node | undefined | null): boolean {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        const el = node as Element;
        return el.matches(".snowui-icon-wrapper, svg:not(.snowui-tag-arrow-shape)");
    }

    function isVisibleNode(node: Node, excludeClass: string): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
            return !!node.textContent?.trim();
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            const classList = (node as Element).classList;
            return !classList.contains(excludeClass)
                && !classList.contains("snowui-tag-arrow-shape");
        }
        return false;
    }

    function readPixelValue(value: string, fallback: number): number {
        const parsed = parseFloat(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function updateShapeMetrics(host: HTMLElement) {
        const style = getComputedStyle(host);
        measuredWidth = host.offsetWidth;
        measuredHeight = host.offsetHeight;
        measuredArrowWidth = readPixelValue(
            style.getPropertyValue("--snowui-tag-arrow-width"),
            8,
        );
    }

    $effect(() => {
        if (!hostElement) return;
        const host = hostElement;
        const update = () => {
            const visible = Array.from(host.childNodes).filter((n) =>
                isVisibleNode(n, "snowui-tag-close"),
            );
            edgeLeft = isIconElement(visible[0]) ? "icon" : "text";
            edgeRight = isIconElement(visible[visible.length - 1])
                ? "icon"
                : "text";
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(host, {
            childList: true,
            characterData: true,
            subtree: true,
        });
        return () => observer.disconnect();
    });

    $effect(() => {
        if (!hostElement) return;
        const host = hostElement;
        updateShapeMetrics(host);
        return resizeManager.watch(host, () => updateShapeMetrics(host));
    });

    function handleCloseClick(event: MouseEvent) {
        event.stopPropagation();
        onClose?.(event);
    }

    function roundedPolygonPath(points: Array<[number, number]>, radii: number[]) {
        if (points.length < 3) return "";
        const commands: string[] = [];

        const pointAtDistance = (
            from: [number, number],
            to: [number, number],
            distance: number,
        ): [number, number] => {
            const dx = to[0] - from[0];
            const dy = to[1] - from[1];
            const length = Math.hypot(dx, dy) || 1;
            const safeDistance = Math.min(distance, length / 2);
            return [
                from[0] + (dx / length) * safeDistance,
                from[1] + (dy / length) * safeDistance,
            ];
        };

        points.forEach((point, index) => {
            const previous = points[(index - 1 + points.length) % points.length];
            const next = points[(index + 1) % points.length];
            const radius = radii[index] ?? 0;
            const before = pointAtDistance(point, previous, radius);
            const after = pointAtDistance(point, next, radius);

            if (index === 0) {
                commands.push(`M ${before[0].toFixed(3)} ${before[1].toFixed(3)}`);
            } else {
                commands.push(`L ${before[0].toFixed(3)} ${before[1].toFixed(3)}`);
            }
            commands.push(
                `Q ${point[0].toFixed(3)} ${point[1].toFixed(3)} ${after[0].toFixed(3)} ${after[1].toFixed(3)}`,
            );
        });

        commands.push("Z");
        return commands.join(" ");
    }

    function buildArrowPath(
        direction: "left-arrow" | "right-arrow",
        width: number,
        height: number,
        arrowWidth: number,
    ) {
        if (width <= 0 || height <= 0) return "";
        const totalWidth = width + arrowWidth;
        const bodyRadius = Math.min(8, height / 2);
        const tipRadius = Math.min(4, height / 2, arrowWidth * 0.72);

        if (direction === "left-arrow") {
            return roundedPolygonPath(
                [
                    [arrowWidth, 0],
                    [totalWidth, 0],
                    [totalWidth, height],
                    [arrowWidth, height],
                    [0, height / 2],
                ],
                [bodyRadius, bodyRadius, bodyRadius, bodyRadius, tipRadius],
            );
        }

        return roundedPolygonPath(
            [
                    [0, 0],
                    [width, 0],
                    [totalWidth, height / 2],
                    [width, height],
                    [0, height],
            ],
            [bodyRadius, bodyRadius, tipRadius, bodyRadius, bodyRadius],
        );
    }
</script>

<Frame
    bind:element={hostElement}
    enableResponsive={false}
    enableContext={true}
    enableScaleObserver={false}
    currentState={resolvedCurrentState}
    data-variant={variant}
    data-shape={shape}
    data-closable={closable ? "true" : undefined}
    data-edge-left={edgeLeft}
    data-edge-right={edgeRight}
    class={[
        "snowui-tag",
        "snowui-rounded-rectangle",
        "snowui-hoverable",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    {...toggleDefaults}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? "3rem",
        height: rest.renderHints?.height ?? "1.25rem",
        radius: rest.renderHints?.radius ?? "var(--radius-3)",
        rows: rest.renderHints?.rows,
    }}
>
    {#if shape !== "default" && arrowPath}
        <svg
            class={[
                "snowui-tag-arrow-shape",
                shape === "left-arrow"
                    ? "snowui-tag-arrow-shape-left"
                    : "snowui-tag-arrow-shape-right",
            ].join(" ")}
            viewBox={`0 0 ${measuredWidth + measuredArrowWidth} ${measuredHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            style={`width: ${measuredWidth + measuredArrowWidth}px; height: ${measuredHeight}px;`}
        >
            <path class="snowui-tag-arrow-fill" d={arrowPath} />
            <path class="snowui-tag-arrow-overlay" d={arrowPath} />
        </svg>
    {/if}
    {@render children?.()}
    {#if closable}
        <Button bare emphasis="muted" size="sm" {...parts?.Button}
            type="button"
            class={`snowui-clear-icon-btn snowui-tag-close${parts?.Button?.class ? ` ${parts.Button.class}` : ""}`}
            aria-label="Close tag"
            onclick={handleCloseClick}
        >
            <ComponentIcon name="close" aria-hidden="true" />
        </Button>
    {/if}
</Frame>

<style>
    /* Level 2: 组件基类（specificity = 0） */
    :global(:where(.snowui-tag)) {
        /* 内部变量层 */
        --snowui-tag-padding: calc(var(--padding-1, 4px) / 2) var(--padding-2, 8px); /* 2px 8px */
        --snowui-tag-gap: 0;
        --snowui-tag-radius: var(--radius-3, 8px);
        --snowui-tag-font-size: var(--text-12, 12px);
        --snowui-tag-line-height: var(--leading-12, 16px);
        /* 箭头可见宽度；箭头形状由内部 SVG path 按当前尺寸重算 */
        --snowui-tag-arrow-width: 8px;
        --snowui-tag-bg: var(--black-4, rgba(0, 0, 0, 0.04));
        --snowui-tag-color: inherit;

        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        position: relative;
        white-space: nowrap;

        gap: var(--snowui-tag-gap-override, var(--snowui-tag-gap));
        padding: var(--snowui-tag-padding-override, var(--snowui-tag-padding));
        border-radius: var(--snowui-tag-radius-override, var(--snowui-tag-radius));
        font-size: var(--snowui-tag-font-size-override, var(--snowui-tag-font-size));
        line-height: var(--snowui-tag-line-height-override, var(--snowui-tag-line-height));
        background-color: var(--snowui-tag-bg-override, var(--snowui-tag-bg));
        color: var(--snowui-tag-color-override, var(--snowui-tag-color));
        --snowui-frame-component-transition:
            background-color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            --snowui-hover-overlay-opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* closable Tag 默认状态：padding-right 与非 closable 一致（8px），让宽度保持一致。
       挂载 padding-right 的 transition 在该作用域内声明，hover 状态变化时由消费 Frame 桥接动效平滑过渡。
       注：该选择器不会触发 check-standards §5.7.5 根类 transition 禁用规则（规则仅扫描 :global(:where(.snowui-tag)) 根块）。 */
    :global(:where(.snowui-tag)[data-closable="true"]) {
        --snowui-tag-close-collapse-delay: var(--snowui-frame-color-motion-duration, 0.15s);
        --snowui-frame-component-transition:
            background-color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            --snowui-hover-overlay-opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            padding-right var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out) var(--snowui-tag-close-collapse-delay);
    }

    /* 首/末位为 Icon → 对应侧 padding 收紧到 4px。
       首/末位的判定包含文本节点（CSS :first-child / :last-child 仅考虑元素，
       无法区分"末位是 Icon"和"Icon 后还有文本"），由 .svelte 的 MutationObserver
       检测真实首/末位并写到 data-edge-left / data-edge-right 上。 */
    :global(:where(.snowui-tag)[data-edge-left="icon"]) {
        padding-left: var(--padding-1, 4px);
    }
    :global(:where(.snowui-tag)[data-edge-right="icon"]) {
        padding-right: var(--padding-1, 4px);
    }

    /* 含内置 closable X 且 hover 时 → 右侧 padding 收紧到 4px（与 X 显形协同） */
    :global(:where(.snowui-tag)[data-closable="true"]:is(:hover, :focus-within)) {
        --snowui-tag-close-collapse-delay: 0s;
        padding-right: var(--padding-1, 4px);
    }

    /* Level 4: 激活态（由 Frame 自动暴露的 data-state="Active" 触发）
       — variant="active" 在 .svelte 中映射到 currentState="Active"，自动满足该选择器；
       — 消费方走 Click toggle 状态机时也会进入同一条样式路径，与 Button 完全一致。 */
    :global(:where(.snowui-tag)[data-state="Active"]) {
        --snowui-tag-bg: color-mix(
            in srgb,
            var(--brand, #33D1FFFF) 10%,
            transparent
        );
        --snowui-tag-color: var(--brand, #33D1FFFF);
        --snowui-tag-close-color: var(--brand, #33D1FFFF);
    }

    /* Level 4: 箭头形状（SVG 圆角箭头）
       背景由内部 SVG path 按当前宽高生成,所有外轮廓顶点统一圆角化。
       margin-left/right 预留箭头可见区的布局空间（已在 check-standards 登记）。 */
    :global(:where(.snowui-tag)[data-shape="left-arrow"]) {
        position: relative;
        margin-left: var(--snowui-tag-arrow-width);
        padding-left: var(--padding-1, 4px); /* 文字到箭头尖端: 8px 尖端 + 4px 间距 */
        padding-right: var(--padding-2, 8px);
        border-radius: 0;
        background-color: transparent;
        background-image: none;
    }
    :global(:where(.snowui-tag)[data-shape="right-arrow"]) {
        position: relative;
        margin-right: var(--snowui-tag-arrow-width);
        padding-left: var(--padding-2, 8px);
        padding-right: var(--padding-1, 4px); /* 文字到箭头尖端: 4px 间距 + 8px 尖端 */
        border-radius: 0;
        background-color: transparent;
        background-image: none;
    }

    :global(:where(.snowui-tag)[data-shape="left-arrow"][data-edge-left="icon"]) {
        padding-left: var(--padding-1, 4px);
    }

    :global(:where(.snowui-tag)[data-shape="left-arrow"][data-edge-right="icon"]) {
        padding-right: var(--padding-2, 8px);
    }

    :global(:where(.snowui-tag)[data-shape="right-arrow"][data-edge-left="icon"]) {
        padding-left: var(--padding-2, 8px);
    }

    :global(:where(.snowui-tag)[data-shape="right-arrow"][data-closable="true"]),
    :global(:where(.snowui-tag)[data-shape="right-arrow"][data-closable="true"]:hover),
    :global(:where(.snowui-tag)[data-shape="right-arrow"][data-edge-right="icon"]) {
        padding-right: var(--padding-1, 4px);
    }

    :global(:where(.snowui-tag-arrow-shape)) {
        position: absolute;
        top: 0;
        z-index: 0;
        height: 100%;
        max-width: none;
        overflow: visible;
        pointer-events: none;
    }

    :global(:where(.snowui-tag-arrow-shape-left)) {
        left: calc(-1 * var(--snowui-tag-arrow-width));
    }

    :global(:where(.snowui-tag-arrow-shape-right)) {
        left: 0;
    }

    :global(:where(.snowui-tag-arrow-fill)) {
        fill: var(--snowui-tag-bg-override, var(--snowui-tag-bg));
        transition:
            fill var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-tag-arrow-overlay)) {
        fill: var(--snowui-hover-color, currentColor);
        opacity: 0;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-tag)[data-shape="left-arrow"]:hover .snowui-tag-arrow-overlay),
    :global(:where(.snowui-tag)[data-shape="right-arrow"]:hover .snowui-tag-arrow-overlay) {
        opacity: var(--snowui-hover-opacity, var(--snowui-frame-hover-opacity, 4%));
    }

    /* 内置删除 X：视觉/hover 复用 Button bare；
       Tag 只补充自身显示时机：默认 width=0 + overflow:hidden 不占位，
       hover Tag 时 width 展开到 icon-size，由 Frame 桥接动效平滑过渡撑出 Tag 宽度。 */
    :global(:where(.snowui-tag) > .snowui-tag-close) {
        --snowui-button-color-override: var(--snowui-tag-close-color, var(--snowui-tag-color));
        --snowui-button-opacity-override: 0;

        width: 0;
        min-width: 0;
        min-inline-size: 0;
        pointer-events: none;
        flex: 0 0 0;
        overflow: hidden;
        transition:
            width var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out) var(--snowui-tag-close-collapse-delay),
            flex-basis var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out) var(--snowui-tag-close-collapse-delay),
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* Hover Tag 时 X 显形并撑出宽度 */
    :global(:where(.snowui-tag):is(:hover, :focus-within) > .snowui-tag-close) {
        --snowui-button-opacity-override: var(--snowui-button-opacity);

        pointer-events: auto;
        width: var(--snowui-button-icon-size, var(--size-4));
        flex: 0 0 var(--snowui-button-icon-size, var(--size-4));
    }
</style>
