<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 
 Radio 组件：单选按钮控件
 v1.3.17

 1. 核心能力:
    - 支持单选和分组模式
    - 双向绑定 checked 和 group 状态
    - 支持自定义尺寸
    - 支持 outline 和 filled 两种变体
    - 继承 Frame 组件的通用能力

 2. 视觉设计:
    - 圆形外框 + 内部选中点
    - Hover 状态反馈
    - 平滑的选中动画
    - 补齐 Frame 能力开关显式传参
    - 内部变量命名对齐 snowui 规范
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import Frame, { type FrameProps } from "./Frame.svelte";
    import {
        getImage,
        getSizeContext,
        getSize,
        type ResourceSize,
    } from "../context";
    import {
        DEFAULT_RESOURCE_SIZE_TOKEN,
        resolveResourceSizeToken,
    } from "../logic/resource-size";
    import type { Snippet } from "svelte";

    interface Props extends Omit<FrameProps, "size"> {
        checked?: boolean;
        group?: any;
        value?: any;
        size?: ResourceSize | number;
        disabled?: boolean;
        variant?: "outline" | "filled";
        children?: Snippet;
        enableResponsive?: boolean;
        enableContext?: boolean;
        [key: string]: any;
    }

    let {
        // Component props
        checked = $bindable(false),
        group = $bindable(),
        value,
        size = undefined,
        disabled = false,
        variant = "filled",
        children,
        as = undefined,
        class: userClass,
        style: userStyle,
        renderHints: userRenderHints = undefined,

        // Capability Props (Capability Rules)
        enableResponsive = false,
        enableContext = false,

        // Rest props
        ...rest
    }: Props = $props();

    // 读取父级尺寸上下文
    getSize();
    const sizeCtx = getSizeContext();
    const imageCtx = getImage();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined ? sizeCtx.iconSize : sizeCtx?.size,
    );
    // 优先使用 prop size，其次使用 context size
    const resolvedSize = $derived(size ?? contextSize ?? 16);
    const resolvedSizeToken = $derived(resolveResourceSizeToken(resolvedSize));
    const DEFAULT_RADIO_SIZE_TOKEN = DEFAULT_RESOURCE_SIZE_TOKEN;
    const radioSizeStyle = $derived(
        resolvedSizeToken !== DEFAULT_RADIO_SIZE_TOKEN
            ? `--snowui-radio-size: ${resolvedSizeToken}`
            : "",
    );
    const hostStyle = $derived(
        as === "badge" && imageCtx ? imageCtx.badgeStyle : "",
    );
    const radioRootStyle = $derived.by(() => {
        const styles = [hostStyle, radioSizeStyle, userStyle]
            .filter(Boolean)
            .join("; ");
        return styles || undefined;
    });
    const layoutAs = $derived(
        as === "badge" && imageCtx ? imageCtx.badgeAs || as : as,
    );
    const radioRenderHints = $derived({
        variant: userRenderHints?.variant ?? "circle",
        width: userRenderHints?.width ?? resolvedSizeToken,
        height: userRenderHints?.height ?? resolvedSizeToken,
    });

    let isGrouped = $state(group !== undefined);

    $effect(() => {
        if (group !== undefined) {
            isGrouped = true;
        }
    });

    // Group Management: 从 group 同步到 checked
    $effect(() => {
        if (isGrouped) {
            checked = group === value;
        }
    });

    // Group Management: 从 checked 同步到 group
    $effect(() => {
        if (isGrouped) {
            if (checked && group !== value) {
                group = value;
            } else if (!checked && group === value) {
                group = undefined;
            }
        }
    });

    // 手动同步 checked 到 DOM input (因为 Svelte 不允许 Radio 用 bind:checked)
    let inputRef = $state<HTMLInputElement>();
    $effect(() => {
        if (inputRef) {
            inputRef.checked = checked;
        }
    });

    function applySelection(nextChecked: boolean) {
        if (disabled) return;
        checked = nextChecked;
        if (isGrouped) {
            group = nextChecked ? value : undefined;
        }
    }

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        event.preventDefault();
        applySelection(!checked);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (disabled) return;
        if (event.key !== " " && event.code !== "Space") return;
        event.preventDefault();
        applySelection(!checked);
    }

</script>

<Frame
    tag="label"
    class={`snowui-radio${userClass ? ` ${userClass}` : ""}`}
    as={layoutAs}
    data-variant={variant}
    data-checked={checked ? "true" : undefined}
    data-disabled={disabled ? "true" : undefined}
    {disabled}
    style={radioRootStyle}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
    renderHints={radioRenderHints}
    {...rest}
>
    <span class="snowui-control-inset">
        <input
            bind:this={inputRef}
            type="radio"
            class="snowui-radio-sr-only"
            {checked}
            {value}
            {disabled}
            onclick={handleClick}
            onkeydown={handleKeyDown}
            tabindex={disabled ? -1 : 0}
        />
        <span class="snowui-radio-visual">
            <span class="snowui-radio-active-ring"></span>
            <span class="snowui-radio-hover-layer"></span>
            {#if variant === "outline"}
                <span class="snowui-radio-dot"></span>
            {/if}
        </span>
    </span>
    {#if children}
        <span class="snowui-radio-label">
            {@render children()}
        </span>
    {/if}
</Frame>

<style>
    /* Level 2: Component Base (降权为 0) */
    :global(:where(.snowui-radio)) {
        display: inline-flex;
        align-items: center;
        gap: var(--snowui-radio-gap-override, var(--snowui-radio-gap));
        vertical-align: middle;
        user-select: none;
        cursor: var(--snowui-state-cursor, pointer);
        position: relative;

        --snowui-radio-gap: var(--gap-1);
        --snowui-radio-size: var(--size-4);
        --snowui-radio-size-resolved: var(
            --snowui-radio-size-override,
            var(--snowui-radio-size)
        );
        --snowui-radio-radius: var(--radius-full);
        --snowui-radio-radius-resolved: var(
            --snowui-radio-radius-override,
            var(--snowui-radio-radius)
        );
        --snowui-radio-border-width: calc(
            var(--snowui-radio-size-resolved) * 0.0625
        );
        --snowui-radio-border-width-resolved: var(
            --snowui-radio-border-width-override,
            var(--snowui-radio-border-width)
        );
        --snowui-radio-dot-size: calc(var(--snowui-radio-visual-size) * 0.5);
        --snowui-radio-dot-size-resolved: var(
            --snowui-radio-dot-size-override,
            var(--snowui-radio-dot-size)
        );
        --snowui-radio-filled-border: calc(
            var(--snowui-radio-visual-size) * 0.3
        );
        --snowui-radio-filled-border-resolved: var(
            --snowui-radio-filled-border-override,
            var(--snowui-radio-filled-border)
        );
        --snowui-control-inset: calc(var(--snowui-radio-size-resolved) / 16);
        --snowui-radio-visual-size: calc(var(--snowui-radio-size-resolved) * 0.875);
        --snowui-radio-color: var(--primary, var(--black-100, #000));
        --snowui-radio-color-resolved: var(
            --snowui-radio-color-override,
            var(--snowui-radio-color)
        );
        --snowui-radio-primary: var(
            --snowui-radio-primary-override,
            currentColor
        );
        --snowui-radio-base-border-color-current: color-mix(
            in srgb,
            var(--black-100, #000) 20%,
            transparent
        );
        --snowui-radio-active-ring-width-current: 0px;
        --snowui-radio-active-ring-color-current: transparent;
        --snowui-radio-background-current: var(--background-3, #fff);
        --snowui-radio-motion-duration: min(
            var(--snowui-frame-control-motion-duration, 300ms),
            150ms
        );
        --snowui-radio-motion-duration-resolved: var(
            --snowui-radio-motion-duration-override,
            var(--snowui-radio-motion-duration)
        );
        --snowui-radio-motion-easing: var(
            --snowui-frame-control-motion-easing,
            ease-out
        );
        --snowui-radio-motion-easing-resolved: var(
            --snowui-radio-motion-easing-override,
            var(--snowui-radio-motion-easing)
        );
        --snowui-radio-border-motion-duration: min(
            var(
                --snowui-frame-border-motion-duration,
                var(--snowui-radio-motion-duration-resolved)
            ),
            150ms
        );
        --snowui-radio-border-motion-duration-resolved: var(
            --snowui-radio-border-motion-duration-override,
            var(--snowui-radio-border-motion-duration)
        );
        --snowui-radio-border-motion-easing: var(
            --snowui-frame-border-motion-easing,
            var(--snowui-radio-motion-easing-resolved)
        );
        --snowui-radio-border-motion-easing-resolved: var(
            --snowui-radio-border-motion-easing-override,
            var(--snowui-radio-border-motion-easing)
        );
        color: var(--snowui-radio-color-resolved);
    }

    :global(:where(.snowui-radio[data-as^="pin-"])) {
        position: absolute;
    }

    /* 原生 input 覆盖整个 label 区域，透明但可点击 */
    :global(:where(.snowui-radio-sr-only)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        opacity: 0;
        cursor: inherit;
        z-index: 1;
    }

    :global(:where(.snowui-radio-visual)) {
        box-sizing: border-box;
        width: var(--snowui-radio-visual-size);
        height: var(--snowui-radio-visual-size);
        border-radius: var(--snowui-radio-radius-resolved);
        box-shadow: inset 0 0 0 var(--snowui-radio-border-width-resolved)
            var(--snowui-radio-base-border-color-current);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--snowui-radio-background-current);
        background-image: none;
        flex-shrink: 0;
        transition:
            box-shadow var(--snowui-radio-border-motion-duration-resolved)
                var(--snowui-radio-border-motion-easing-resolved),
            background-color var(--snowui-radio-motion-duration-resolved)
                var(--snowui-radio-motion-easing-resolved);
    }

    :global(:where(.snowui-radio-active-ring)),
    :global(:where(.snowui-radio-hover-layer)) {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
    }

    :global(:where(.snowui-radio-active-ring)) {
        box-shadow: inset 0 0 0 var(--snowui-radio-active-ring-width-current)
            var(--snowui-radio-active-ring-color-current);
        transition: box-shadow var(--snowui-radio-border-motion-duration-resolved)
            var(--snowui-radio-border-motion-easing-resolved);
    }

    :global(:where(.snowui-radio-hover-layer)) {
        opacity: 0;
        transition: opacity var(--snowui-radio-motion-duration-resolved)
            var(--snowui-radio-motion-easing-resolved);
    }

    /* Level 2 Extension: Internal dots */
    :global(:where(.snowui-radio-dot)) {
        position: relative;
        z-index: 1;
        width: var(--snowui-radio-dot-size-resolved);
        height: var(--snowui-radio-dot-size-resolved);
        border-radius: var(--snowui-radio-radius-resolved);
        background-color: var(--snowui-radio-primary);
        transform: scale(0);
        transition:
            transform var(--snowui-radio-motion-duration-resolved)
                var(--snowui-radio-motion-easing-resolved),
            background-color var(--snowui-radio-motion-duration-resolved)
                var(--snowui-radio-motion-easing-resolved);
    }

    /* Level 4: Component Variants & State (标准权重胜过 Utilities) */

    /* Outline Variant: 选中时显示内部 Dot */
    :global(
            .snowui-radio[data-variant="outline"][data-checked="true"]
                .snowui-radio-dot
        ) {
        transform: scale(1);
    }

    /* Variant: Filled (Hollow Center) */
    /* 选中: 边框变粗且变色，背景透明 */
    :global(
            .snowui-radio[data-variant="filled"][data-checked="true"]
        ) {
        --snowui-radio-background-current: var(--background-3, #fff);
        --snowui-radio-active-ring-width-current: var(
            --snowui-radio-filled-border-resolved
        );
        --snowui-radio-active-ring-color-current: var(
            --snowui-radio-primary
        );
    }

    /* ========== Hover State (Level 2 Extension) ========== */

    /* Unchecked Hover: 独立覆盖层只加深基础边框，保持填充不变 */
    :global(
            .snowui-radio:not([data-disabled="true"]):not([data-checked="true"]):hover
                .snowui-radio-hover-layer
        ) {
        opacity: 1;
        box-shadow: inset 0 0 0 var(--snowui-radio-border-width-resolved)
            color-mix(in srgb, var(--black-100, #000) 20%, transparent);
    }

    /* Outline checked Hover: 外框叠加 Black20，Dot 按 Black100 规则叠加 White20 */
    :global(
            .snowui-radio:not([data-disabled="true"])[data-variant="outline"][data-checked="true"]:hover
                .snowui-radio-hover-layer
        ) {
        opacity: 1;
        box-shadow: inset 0 0 0 var(--snowui-radio-border-width-resolved)
            color-mix(in srgb, var(--black-100, #000) 20%, transparent);
    }

    :global(
            .snowui-radio:not([data-disabled="true"])[data-variant="outline"][data-checked="true"]:hover
                .snowui-radio-dot
        ) {
        background-color: color-mix(
            in srgb,
            var(--static-white-100, #fff) 20%,
            var(--snowui-radio-primary)
        );
    }

    /* Filled checked Hover: 只覆盖粗黑选中环，中间白色孔保持不变 */
    :global(
            .snowui-radio:not([data-disabled="true"])[data-variant="filled"][data-checked="true"]:hover
                .snowui-radio-hover-layer
        ) {
        opacity: 1;
        box-shadow: inset 0 0 0 var(--snowui-radio-filled-border-resolved)
            color-mix(
                in srgb,
                var(--static-white-100, #fff) 20%,
                transparent
            );
    }

    /* Label Styling */
    :global(:where(.snowui-radio-label)) {
        font-size: var(--snowui-radio-label-font-size-override, inherit);
        line-height: var(--snowui-radio-label-line-height-override, inherit);
    }

    /* Focus Visible */
    :global(:where(.snowui-radio-sr-only)):focus-visible
        + :global(:where(.snowui-radio-visual)) {
        box-shadow: 0 0 0 var(--border-8)
            color-mix(in srgb, currentColor 4%, transparent);
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-radio-visual)),
        :global(:where(.snowui-radio-active-ring)),
        :global(:where(.snowui-radio-hover-layer)),
        :global(:where(.snowui-radio-dot)) {
            transition: none;
        }
    }
</style>
