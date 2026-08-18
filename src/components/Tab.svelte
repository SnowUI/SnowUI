<!--
  Tab 视图切换组件 (PRO)
  v1.1.1 (2026-06-23)

  职责:在多个互斥选项之间切换"视图/内容区"。子项使用 Button,激活态视觉
  由 Tab 容器通过 CSS override Button 的桥接变量接管。Tab size 决定容器的
  padding / radius / gap，并作为 Item Button 的默认 size；Button 仍拥有各档位定义。
  Item 尺寸样式优先级保持 CSS 契约：style > class > Button size > Tab size。

  5 个 variant:
    - pill       (样式1, 默认):容器有 black/4% 背景, 激活项白底 + shadow
    - solid      (样式2)       :容器无背景, 激活项 black/4% 背景, 无 shadow
    - underline  (样式3)       :无容器背景, 激活项底部 2px 下划线
    - icon-toggle(样式4)       :未激活只显示图标, 激活显示图标+文字
    - bare                       :无容器/Item 外壳和 indicator，仅用 opacity 表达状态

  动效:共享 indicator 元素(.snowui-tab-indicator)绝对定位,跟随激活 Button
  在容器内通过 transform/width/height 平滑过渡;消费 Frame 的 transform / color /
  size motion bridge 变量。

  文档: ./Tab.md
-->

<script lang="ts">
    import { setContext, type Component, type Snippet } from "svelte";
    import { Button, Frame, Icon, Text, resizeManager, type FrameProps } from "@snowui-design-system/components";
    import { BUTTON_SIZE_CONTEXT_KEY } from "@snowui-design-system/components/keys";
    import { TAB_INDICATOR_MOTION_STYLE } from "@snowui-design-system/components/motion/presets/tab";
    import {
        mergeComponentPartProps,
        provideComponentParts,
        type ComponentPartsOf,
        useComponentPart,
    } from "@snowui-design-system/components/logic/component-parts.svelte";

    export type TabVariant = "pill" | "solid" | "underline" | "icon-toggle" | "bare";
    export type TabSize = "sm" | "md" | "lg";
    export interface TabItem {
        value: string;
        label: string;
        icon?: Component;
        disabled?: boolean;
    }

    interface Props extends Omit<FrameProps, "children" | "value"> {
        /** 当前激活值;支持 bind: */
        value?: string;
        /** variant: pill / solid / underline / icon-toggle / bare */
        variant?: TabVariant;
        /** size: 控制 Tab 容器，并作为 Item Button 的默认 SM/MD/LG 档位 */
        size?: TabSize;
        /** 横向排列；与 Frame 写法统一 */
        row?: boolean;
        /** 纵向排列；与 Frame 写法统一 */
        column?: boolean;
        /** Figma fill 宽度:容器有显式宽度时,横向子项等宽填满 */
        fill?: boolean;
        /** 切换回调 */
        onChange?: (value: string) => void;
        /** 方向键是否直接激活(Tab 默认 false 仅切焦点 + Enter 激活;Segmented 默认 true 直切) */
        selectionFollowsFocus?: boolean;
        /** ARIA role:Tab 默认 tablist;Segmented 传入 radiogroup */
        role?: string;
        /** 子项 ARIA role:tablist→tab(Button 自身已是 button);radiogroup→radio */
        itemRole?: string;
        /** 子项(直接放 Button,Button 上声明 value="...") */
        children?: Snippet;
        /** 默认内置模式：根据 items 生成 Button as="item"。 */
        items?: TabItem[];
        parts?: ComponentPartsOf<{
            Button: typeof Button;
            Icon: typeof Icon;
            Text: typeof Text;
        }>;
        [key: string]: any;
    }

    const inheritedTabPart = useComponentPart<Props>("Tab");
    let {
        value = $bindable(),
        ...explicitProps
    }: Props = $props();
    let {
        variant = "pill",
        size = "sm",
        row = false,
        column = false,
        fill = false,
        onChange,
        selectionFollowsFocus = false,
        role = "tablist",
        itemRole = undefined,
        children,
        items = [],
        parts = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        class: userClass = "",
        style: userStyle = "",
        ...rest
    }: Omit<Props, "value"> = $derived(
        mergeComponentPartProps(
            inheritedTabPart.current as Partial<Omit<Props, "value">>,
            explicitProps,
        ),
    );
    provideComponentParts(() => parts);

    let rootEl = $state<HTMLElement>();
    let indicatorEl = $state<HTMLElement | null>(null);
    let initialized = $state(false);
    const resolvedDirection = $derived(row || !column ? "row" : "column");

    setContext(BUTTON_SIZE_CONTEXT_KEY, {
        present: true,
        get size() {
            return size;
        },
        scaleOnHover: false,
    });

    /** 获取容器内所有"项 Button" */
    function getItems(root: HTMLElement): HTMLElement[] {
        return Array.from(
            root.querySelectorAll<HTMLElement>(
                ':scope > [data-as="item"][value]',
            ),
        );
    }

    function moveIndicator(active: HTMLElement, animate: boolean) {
        if (!rootEl || !indicatorEl) return;
        const left = active.offsetLeft;
        const top = active.offsetTop;
        const width = active.offsetWidth;
        const height = active.offsetHeight;
        const next =
            variant === "underline" && resolvedDirection === "row"
                ? {
                      transform: `translate(${left}px, ${rootEl.clientHeight - 2}px)`,
                      width: `${width}px`,
                      height: "2px",
                  }
                : variant === "underline" && resolvedDirection === "column"
                  ? {
                        transform: `translate(0px, ${top}px)`,
                        width: "2px",
                        height: `${height}px`,
                    }
                  : {
                        transform: `translate(${left}px, ${top}px)`,
                        width: `${width}px`,
                        height: `${height}px`,
                    };

        if (!animate) {
            const previousTransition = indicatorEl.style.transition;
            indicatorEl.style.transition = "none";
            indicatorEl.style.transform = next.transform;
            indicatorEl.style.width = next.width;
            indicatorEl.style.height = next.height;
            void indicatorEl.offsetWidth;
            indicatorEl.style.transition = previousTransition;
            return;
        }

        indicatorEl.style.transform = next.transform;
        indicatorEl.style.width = next.width;
        indicatorEl.style.height = next.height;
    }

    /** 计算指示器位置并设置每个 Item 的 data-active */
    function syncActive(animate = true) {
        if (!rootEl) return;
        const items = getItems(rootEl);
        if (items.length === 0) return;

        // 找出第一个匹配 value 的 Item;未匹配则取第一个非 disabled
        const active =
            items.find((el) => el.getAttribute("value") === value) ??
            items.find((el) => !el.hasAttribute("disabled")) ??
            items[0];

        for (const el of items) {
            const isActive = el === active;
            el.setAttribute("data-active", isActive ? "true" : "false");
            // roving tabindex: 只有激活项 tabindex=0
            el.setAttribute("tabindex", isActive ? "0" : "-1");
            // 同步 aria-selected / aria-checked
            if (itemRole === "radio") {
                el.setAttribute("aria-checked", isActive ? "true" : "false");
            } else {
                el.setAttribute("aria-selected", isActive ? "true" : "false");
            }
            if (itemRole) el.setAttribute("role", itemRole);
            if (variant === "icon-toggle" && !isActive) {
                el.setAttribute("data-composition-content", "hidden");
            } else {
                el.removeAttribute("data-composition-content");
            }
        }

        moveIndicator(active, animate);
    }

    /** 设置 value 并触发 onChange */
    function setValue(next: string) {
        if (next === value) return;
        value = next;
        onChange?.(next);
    }

    /** 容器级点击委托:走到最近的 [value] Button */
    function handleClick(e: MouseEvent) {
        const target = e.target as HTMLElement | null;
        if (!target || !rootEl) return;
        const btn = target.closest<HTMLElement>('[data-as="item"][value]');
        if (!btn || !rootEl.contains(btn)) return;
        if (btn.hasAttribute("disabled")) return;
        const v = btn.getAttribute("value");
        if (v !== null) setValue(v);
    }

    /** 键盘:ArrowLeft/Right(row)或 ArrowUp/Down(column) */
    function handleKeydown(e: KeyboardEvent) {
        if (!rootEl) return;
        const isHoriz = resolvedDirection === "row";
        const prevKey = isHoriz ? "ArrowLeft" : "ArrowUp";
        const nextKey = isHoriz ? "ArrowRight" : "ArrowDown";
        const homeKey = "Home";
        const endKey = "End";

        if (![prevKey, nextKey, homeKey, endKey].includes(e.key)) return;

        const items = getItems(rootEl).filter(
            (el) => !el.hasAttribute("disabled"),
        );
        if (items.length === 0) return;

        const currentIdx = items.findIndex(
            (el) => el.getAttribute("value") === value,
        );
        let nextIdx = currentIdx;

        if (e.key === prevKey) nextIdx = (currentIdx - 1 + items.length) % items.length;
        else if (e.key === nextKey) nextIdx = (currentIdx + 1) % items.length;
        else if (e.key === homeKey) nextIdx = 0;
        else if (e.key === endKey) nextIdx = items.length - 1;

        e.preventDefault();
        const target = items[nextIdx];
        const v = target.getAttribute("value");
        if (v !== null) {
            target.focus();
            if (selectionFollowsFocus) setValue(v);
        }
    }

    // Observer 仅在 rootEl 挂载/卸载时创建/销毁
    $effect(() => {
        if (!rootEl) return;
        const obs = new MutationObserver(() => syncActive(false));
        obs.observe(rootEl, { childList: true, subtree: false });
        const unwatchResize = resizeManager.watch(rootEl, () => syncActive(initialized));
        queueMicrotask(() => {
            syncActive(false);
            initialized = true;
        });
        return () => {
            obs.disconnect();
            unwatchResize();
        };
    });

    // value / variant / size / direction 变化时重新同步
    $effect(() => {
        void value;
        void variant;
        void size;
        void resolvedDirection;
        if (rootEl) syncActive(initialized);
    });
</script>

<Frame
    bind:element={rootEl}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {role}
    row={resolvedDirection === "row"}
    column={resolvedDirection === "column"}
    data-variant={variant}
    data-size={size}
    data-direction={resolvedDirection}
    data-fill={fill ? "true" : "false"}
    data-initialized={initialized ? "true" : "false"}
    class={[
        "snowui-tab",
        `snowui-tab-${variant}`,
        `snowui-tab-${size}`,
        `snowui-tab-${resolvedDirection}`,
        fill ? "snowui-tab-fill" : "",
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    style={[TAB_INDICATOR_MOTION_STYLE, userStyle].filter(Boolean).join("; ")}
    onclick={handleClick}
    onkeydown={handleKeydown}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "rect",
        width: rest.renderHints?.width ?? "12rem",
        height: rest.renderHints?.height ?? "1.5rem",
        radius: rest.renderHints?.radius ?? "var(--radius-4)",
        rows: rest.renderHints?.rows,
    }}
>
    <div
        bind:this={indicatorEl}
        class="snowui-tab-indicator"
        aria-hidden="true"
    ></div>
    {#if children}
        {@render children()}
    {:else}
        {#each items as item (item.value)}
            <Button as="item" value={item.value} disabled={item.disabled}>
                {#if item.icon}
                    {@const ItemIcon = item.icon}
                    <Icon><ItemIcon /></Icon><Text>{item.label}</Text>
                {:else}
                    {item.label}
                {/if}
            </Button>
        {/each}
    {/if}
</Frame>

<style>
    /* ============================================================
       Tab 容器 (Level 2: 0,1,0 via :where())
       ============================================================ */
    :global(:where(.snowui-tab)) {
        position: relative;
        display: inline-flex;
        flex-direction: row;
        align-items: center;

        /* === 容器尺寸 / 排版 token (三层桥接) === */
        --snowui-tab-padding: var(--padding-1);
        --snowui-tab-radius: var(--radius-5);
        --snowui-tab-gap: var(--gap-1);
        --snowui-tab-backdrop-filter: none;

        /* === 颜色 === */
        --snowui-tab-background: var(--black-4, rgba(0, 0, 0, 0.04));
        --snowui-tab-indicator-background: var(
            --static-white-80,
            rgba(255, 255, 255, 0.8)
        );
        --snowui-tab-indicator-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        --snowui-tab-active-color: var(--static-black-100, #000000ff);
        --snowui-tab-inactive-color: var(--black-100, #000000ff);
        --snowui-tab-inactive-opacity: var(--snowui-tab-inactive-opacity-override, 0.4);
        --snowui-tab-hover-opacity: var(--snowui-tab-hover-opacity-override, 1);

        padding: var(--snowui-tab-padding-override, var(--snowui-tab-padding));
        gap: var(--snowui-tab-gap-override, var(--snowui-tab-gap));
        border-radius: var(--snowui-tab-radius-override, var(--snowui-tab-radius));
        background-color: var(
            --snowui-tab-background-override,
            var(--snowui-tab-background)
        );
        backdrop-filter: var(--snowui-tab-backdrop-filter);
        -webkit-backdrop-filter: var(--snowui-tab-backdrop-filter);
        box-sizing: border-box;
    }

    /* ============================================================
       Size 档位 (Level 4 - 复合 selector, specificity 0,2,0)
       ============================================================ */
    :global(:where(.snowui-tab).snowui-tab-sm) {
        --snowui-tab-padding: calc(var(--padding-1) / 2);
        --snowui-tab-radius: var(--radius-4);
        --snowui-tab-gap: calc(var(--gap-1) / 2);
    }

    :global(:where(.snowui-tab).snowui-tab-md) {
        --snowui-tab-padding: var(--padding-1);
        --snowui-tab-radius: var(--radius-5);
        --snowui-tab-gap: var(--gap-1);
    }

    :global(:where(.snowui-tab).snowui-tab-lg) {
        --snowui-tab-padding: var(--padding-1);
        --snowui-tab-radius: var(--radius-6);
        --snowui-tab-gap: var(--gap-1);
    }

    /* ============================================================
       Direction
       ============================================================ */
    :global(:where(.snowui-tab).snowui-tab-column) {
        flex-direction: column;
        align-items: stretch;
    }

    /* Figma fill:容器有显式宽度时,横向子项等宽填满可用空间 */
    :global(:where(.snowui-tab-fill.snowui-tab-row) > [data-as="item"]) {
        flex: 1 1 0;
        min-width: 0;
        justify-content: center;
    }

    /* ============================================================
       共享 indicator
       ============================================================ */
    :global(:where(.snowui-tab) > .snowui-tab-indicator) {
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        z-index: 0;
        background-color: var(--snowui-tab-indicator-background);
        box-shadow: var(--snowui-tab-indicator-shadow);
        border-radius: var(--snowui-tab-item-radius, var(--radius-3));
        will-change: transform, width, height;
        transition:
            transform var(--snowui-frame-control-motion-duration)
                var(--snowui-frame-control-motion-easing),
            width var(--snowui-frame-size-motion-duration)
                var(--snowui-frame-size-motion-easing),
            height var(--snowui-frame-size-motion-duration)
                var(--snowui-frame-size-motion-easing),
            background-color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            box-shadow
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* 初始化前不显示 indicator,避免从 (0,0) 飞过来 */
    :global(:where(.snowui-tab)[data-initialized="false"] > .snowui-tab-indicator) {
        opacity: 0;
    }

    /* 初始化后再过渡 transform/size,避免首次定位的"飞入"动效 */
    :global(:where(.snowui-tab)[data-initialized="true"] > .snowui-tab-indicator) {
        opacity: 1;
        transition-property: transform, width, height, background-color, box-shadow,
            opacity;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-tab) > .snowui-tab-indicator) {
            transition: none !important;
        }
    }

    /* 各 size 的 indicator radius 对应 Button 各档 radius */
    :global(:where(.snowui-tab-sm) > .snowui-tab-indicator) {
        --snowui-tab-item-radius: var(--radius-3);
    }
    :global(:where(.snowui-tab-md) > .snowui-tab-indicator) {
        --snowui-tab-item-radius: var(--radius-4);
    }
    :global(:where(.snowui-tab-lg) > .snowui-tab-indicator) {
        --snowui-tab-item-radius: var(--radius-5);
    }

    /* ============================================================
       Item (Button 子元素): 接管颜色/背景
       —— 通过 override Button 三层桥接变量
       ============================================================ */
    :global(:where(.snowui-tab) > [data-as="item"]) {
        position: relative;
        z-index: 1;
        /* 接管 Button 的背景为透明(激活态由 indicator 显示) */
        --snowui-button-background-override: transparent;
        --snowui-button-border-color-override: transparent;
        --snowui-button-color-override: var(--snowui-tab-inactive-color);
        --snowui-button-opacity-override: var(--snowui-tab-inactive-opacity);
        transition: opacity
            var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* hover 只提升整体透明度,不叠加 .snowui-hoverable 的背景 overlay。
       需在 :hover 选择器上声明才能压住 Button 自身 [data-variant]:hover 规则 */
    :global(
            :where(.snowui-tab)
                > [data-as="item"]:hover:not(:disabled):not(.snowui-disabled)
        ) {
        --snowui-hover-opacity: 0%;
        --snowui-hover-overlay-opacity: 0%;
        background-image: none;
    }

    /* pill / icon-toggle 激活项 Text / Icon 使用 Static Black/100，透明度恢复为 1 */
    :global(:where(.snowui-tab) > [data-as="item"][data-active="true"]) {
        --snowui-button-color-override: var(--snowui-tab-active-color);
        --snowui-button-opacity-override: 1;
    }

    /* hover 时仅提升整体透明度(未激活) */
    :global(
            :where(.snowui-tab)
                > [data-as="item"][data-active="false"]:hover:not(:disabled)
        ) {
        --snowui-button-opacity-override: var(--snowui-tab-hover-opacity);
    }

    /* ============================================================
       Variant: pill / icon-toggle (样式1 / 样式4)
       半透明背景使用与 SearchBox 相同的背景模糊。
       ============================================================ */
    :global(.snowui-tab-pill),
    :global(.snowui-tab-icon-toggle) {
        --snowui-tab-backdrop-filter: blur(
            var(--snowui-tab-background-blur-override, 1.25rem)
        );
    }

    /* ============================================================
       Variant: solid (样式2)
       注意: variant 类必须移出 :where(),否则 specificity 0,0,0 会被
       基础 size 规则 `:where(.snowui-tab).snowui-tab-sm` (0,1,0) 压住,
       导致 --snowui-tab-padding / --snowui-tab-background 不生效。
       ============================================================ */
    :global(.snowui-tab-solid) {
        --snowui-tab-padding: 0;
        --snowui-tab-background: transparent;
        --snowui-tab-indicator-shadow: none;
        --snowui-tab-indicator-background: var(--black-4, rgba(0, 0, 0, 0.04));
    }

    /* solid 激活项保持 Button 自身默认颜色链 */
    :global(:where(.snowui-tab-solid) > [data-as="item"][data-active="true"]) {
        --snowui-button-color-override: var(--snowui-button-color);
    }

    /* ============================================================
       Variant: underline (样式3)
       ============================================================ */
    :global(.snowui-tab-underline) {
        --snowui-tab-background: transparent;
        --snowui-tab-radius: 0;
        --snowui-tab-indicator-shadow: none;
        --snowui-tab-indicator-background: var(--primary, #000);
    }

    /* underline 激活项 Text / Icon 使用 Primary */
    :global(:where(.snowui-tab-underline) > [data-as="item"][data-active="true"]) {
        --snowui-button-color-override: var(--primary, #000000ff);
    }

    /* underline 子项间距 + 文字与下划线的上下呼吸距(padding-bottom);
       padding-top 留 0,padding-bottom 给 indicator 一点位置空间 */
    :global(.snowui-tab-underline.snowui-tab-sm) {
        --snowui-tab-gap: var(--gap-3);
        --snowui-tab-padding: 0 0 var(--padding-1) 0;
    }
    :global(.snowui-tab-underline.snowui-tab-md) {
        --snowui-tab-gap: var(--gap-4);
        --snowui-tab-padding: 0 0 var(--padding-1) 0;
    }
    :global(.snowui-tab-underline.snowui-tab-lg) {
        --snowui-tab-gap: var(--gap-5);
        --snowui-tab-padding: 0 0 var(--padding-1) 0;
    }

    /* underline 子项:去掉 Button 的 padding,让下划线对齐文本宽度 */
    :global(:where(.snowui-tab-underline) > [data-as="item"]) {
        --snowui-button-padding-override: 0;
        --snowui-button-radius-override: 0;
    }

    /* underline indicator 变成 2px 横向 line(row) */
    :global(
            :where(.snowui-tab-underline.snowui-tab-row)
                > .snowui-tab-indicator
        ) {
        border-radius: 999px;
    }

    /* underline column:左侧 2px 竖线 */
    :global(
            :where(.snowui-tab-underline.snowui-tab-column)
                > .snowui-tab-indicator
        ) {
        left: 0;
        border-radius: 999px;
    }

    /* underline column:
       不能用容器 padding-left(JS 通过 offsetLeft 同步 indicator transform,
       padding-left 会同时把 button 与 indicator 推开,无法形成间距);
       改用 Button 内部 padding-left 让文字相对 button 边框右移 4px,
       而 button 边框与 indicator 仍在 x=0,从而形成 4px 呼吸距 */
    :global(.snowui-tab-underline.snowui-tab-column) {
        --snowui-tab-padding: 0;
    }
    :global(.snowui-tab-underline.snowui-tab-column > [data-as="item"]) {
        --snowui-button-padding-override: 0 0 0 var(--padding-1);
    }

    /* ============================================================
       Variant: bare
       无容器/Item 外壳和 indicator，仅以 opacity 表达状态。
       ============================================================ */
    :global(.snowui-tab-bare) {
        --snowui-tab-padding: 0;
        --snowui-tab-radius: 0;
        --snowui-tab-background: transparent;
        --snowui-tab-indicator-background: transparent;
        --snowui-tab-indicator-shadow: none;
        --snowui-tab-active-color: var(--black-100, #000000ff);
    }

    :global(.snowui-tab-bare.snowui-tab-sm) {
        --snowui-tab-gap: var(--gap-3);
    }

    :global(.snowui-tab-bare.snowui-tab-md) {
        --snowui-tab-gap: var(--gap-4);
    }

    :global(.snowui-tab-bare.snowui-tab-lg) {
        --snowui-tab-gap: var(--gap-5);
    }

    :global(:where(.snowui-tab-bare) > [data-as="item"]) {
        --snowui-button-padding-override: 0;
        --snowui-button-icon-only-padding-override: 0;
        --snowui-button-radius-override: 0;
    }

    :global(:where(.snowui-tab-bare) > .snowui-tab-indicator) {
        display: none;
    }

    /* ============================================================
       Variant: icon-toggle (样式4)
       ============================================================ */
    /* icon-toggle item 宽度由内容驱动 */
    :global(:where(.snowui-tab-icon-toggle) > [data-as="item"]) {
        transition:
            color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            width var(--snowui-frame-size-motion-duration)
                var(--snowui-frame-size-motion-easing);
    }

    /* ============================================================
       Column underline 改 align;其他 variant 顶满
       ============================================================ */
    :global(:where(.snowui-tab-column) > [data-as="item"]) {
        justify-content: flex-start;
    }
</style>
