<!--
 Listbox 组件：浮层选项列表面板
 v1.2.2

 职责：
 - 作为 Select / Combobox 的浮层下拉面板
 - Portal 到 document.body，逃出 overflow:hidden 裁切
 - 使用 position:fixed 定位，选中项中心对齐 Trigger
 - 处理键盘导航（↑↓ / Enter / Escape / Home / End / type-ahead）
 - 遵循 Quick Action 视觉规范（毛玻璃、圆角 16px、阴影）

 使用方式：
 由 Select 提供 ListboxOwnerContext，Listbox 读取上下文获取
 展开状态、定位锚点、选项数据等信息。
 子选项使用 MenuItem 组件（context 自动注册，compact padding）。

 变更记录 (2026-04-24):
 - 方案B自定义浮层滚动条：参考 Radix UI / bits-ui ScrollArea 实现原理。
   Viewport（Frame）设 overflow:scroll + scrollbar-width:none 隐藏原生滚动条。
   在 Portal 内绝对定位自定义 Scrollbar 元素，通过 useOverlayScrollbar hook 管理。
   ResizeObserver 通过 resizeManager 共享单例（规范 §10）。
   滚动位置通过 translate3d 同步，不触发 reflow。
 - 滚动条规格：默认视觉宽 4px，hover 从右向左展至 8px，距面板右边框 4px。
 - 搜索 Input 固定在 header，滚动条挂载到列表 body，仅覆盖实际滚动的 MenuItem 区域。
 - 内容区宽度完全不受滚动条影响（scrollbar-width: none 模式）。
 - transition 使用 Frame bridge 变量，禁止硬编码时序（规范 §3.4）。

 文档: ./Listbox.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { tick, setContext } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Input from "./Input.svelte";
    import MenuItem from "./MenuItem.svelte";
    import { getListboxOwner, LISTBOX_HEADER_PORTAL_KEY } from "../context";
    import { FIELD_CONTEXT_KEY } from "../keys";
    import { splitFrameHostProps } from "../logic/frame-prop-filter";
    import { useOverlayPresence } from "../logic/overlay-presence.svelte";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import {
        DROPDOWN_OVERLAY_APPEAR_MOTION,
        DROPDOWN_OVERLAY_DISAPPEAR_MOTION,
    } from "../motion/presets/overlay";
    import { getMotionTotalDurationMs } from "../motion/presets/utils";
    import {
        mergeComponentPartProps,
        type ComponentPartsOf,
        useComponentPart,
    } from "../logic/component-parts.svelte";
    import { ContinuousHoverController } from "../logic/continuous-hover.svelte";
    import { CONTINUOUS_HOVER_MOTION_STYLE } from "../motion/presets/continuous-hover";

    export interface ListboxItem {
        value: string;
        label: string;
        disabled?: boolean;
    }

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        /** 子内容（MenuItem 组件） */
        children?: Snippet;
        /** 默认内置模式：根据稳定业务数据生成 MenuItem。 */
        items?: ListboxItem[];
        /** 默认内置 Input / MenuItem 的统一 Props。 */
        parts?: ComponentPartsOf<{
            Input: typeof Input;
            MenuItem: typeof MenuItem;
        }>;
        /** 默认内置模式是否生成固定在顶部的搜索框。 */
        search?: boolean;
        /** 面板最大高度；数字按 px 处理。 */
        maxHeight?: number | string;
        /** 面板最小宽度；数字按 px 处理。 */
        minWidth?: number | string;
        /** 内容溢出时是否显示浮层滚动条。 */
        scrollbar?: boolean;
        /** 浮层是否至少与触发锚点等宽；内容所需宽度更大时允许扩展。关闭时按选项内容 Hug。 */
        matchTriggerWidth?: boolean;
        /** selected：选中项与 trigger 居中；bottom：从 trigger 下方展开。 */
        placementMode?: "selected" | "bottom";
        /** 浮层相对锚点的水平对齐方式。 */
        align?: "start" | "end";
        /** 是否为选中项预留并显示勾选图标。 */
        showCheck?: boolean;
        /** 选项间是否使用容器级连续 hover 背景。 */
        continuousHover?: boolean;
        [key: string]: any;
    }

    const inheritedListboxPart = useComponentPart<Props>("Listbox");
    let explicitProps: Props = $props();
    let {
        class: userClass = "",
        style: userStyle = "",
        children,
        items = [],
        parts = undefined,
        search = undefined,
        maxHeight = 200,
        minWidth = undefined,
        scrollbar = true,
        matchTriggerWidth = true,
        placementMode = "selected",
        align = "start",
        showCheck = false,
        continuousHover = true,
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedListboxPart.current, explicitProps),
    );
    const resolvedParts = $derived({
        ...parts,
        Input: {
            placeholder: "搜索",
            ...parts?.Input,
        },
        MenuItem: {
            showCheck,
            ...parts?.MenuItem,
        },
    });
    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const frameRestProps = $derived(splitProps.frameProps);
    const configuredMaxHeight = $derived(
        typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
    );
    const owner = getListboxOwner();
    // Listbox 浮层即使在组件树中位于 Field 内，实际也已 Portal 到 body。
    // 截断 Field Context，避免浮层搜索 Input 误进入 embedded 模式而丢失独立外壳。
    setContext(FIELD_CONTEXT_KEY, undefined);
    const resolvedSearch = $derived(search ?? owner?.search ?? true);
    const resolvedMinWidth = $derived(minWidth ?? (resolvedSearch ? 160 : 0));
    const configuredMinWidth = $derived(
        typeof resolvedMinWidth === "number"
            ? `${resolvedMinWidth}px`
            : resolvedMinWidth,
    );

    $effect(() => {
        owner?.setShowCheck?.(showCheck);
    });
    const presence = useOverlayPresence(
        () => !!owner?.open,
        getMotionTotalDurationMs(DROPDOWN_OVERLAY_DISAPPEAR_MOTION),
    );

    // header 区域 DOM 引用：Input as="search" 通过 context 读取此元素并将自身移入
    let headerEl = $state<HTMLElement | undefined>(undefined);
    setContext(LISTBOX_HEADER_PORTAL_KEY, {
        get el() {
            return headerEl;
        },
    });

    // DOM ref
    let listboxEl = $state<HTMLDivElement | undefined>(undefined);
    let scrollListboxEl = $state<HTMLElement | undefined>(undefined);
    let scrollbarEl = $state<HTMLDivElement | undefined>(undefined);
    const continuousHoverController = new ContinuousHoverController();

    $effect(() => {
        if (!scrollListboxEl) return;
        return continuousHoverController.attach(scrollListboxEl, {
            selector: ":scope > .snowui-menu-item",
            layerClass: "snowui-listbox-continuous-hover-layer",
            axis: "y",
            enabled: continuousHover,
            followActive: true,
        });
    });

    $effect(() => continuousHoverController.setEnabled(continuousHover));

    // ── 自定义浮层滚动条（通用 hook，内部使用 resizeManager） ──────────────
    const sb = useOverlayScrollbar(
        () => (scrollbar ? scrollListboxEl : undefined),
        () => (scrollbar ? scrollbarEl : undefined),
    );

    // ── 定位状态 ──────────────────────────────────────────────────────
    type ListboxPlacement = "bottom" | "top";
    let listboxPlacement = $state<ListboxPlacement>("bottom");
    let listboxTop = $state(0);
    let listboxLeft = $state(0);
    let listboxWidth = $state(0);
    let listboxMaxHeight = $state(100000);
    const hasLockedWidth = $derived(listboxWidth !== 0);

    // content 模式在每次打开时测量一次最长项宽度并锁定。
    // 搜索框 focus、输入和过滤都不应让浮层横向跳动。
    $effect(() => {
        if (!owner?.open && !matchTriggerWidth) listboxWidth = 0;
    });

    const LISTBOX_VIEWPORT_GAP = 8;
    const LISTBOX_TRIGGER_GAP = 4;
    // Portal action：将节点挂到 document.body
    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                node.remove();
            },
        };
    }

    // 计算 Listbox 定位
    function updatePosition() {
        if (!owner || !listboxEl || !owner.open) return;

        const triggerEl = owner.triggerEl;
        const anchorEl = owner.anchorEl;
        if (!anchorEl || !triggerEl) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const triggerRect = triggerEl.getBoundingClientRect();
        if (matchTriggerWidth && listboxWidth !== anchorRect.width) {
            listboxWidth = anchorRect.width;
            tick().then(updatePosition);
            return;
        } else if (listboxWidth === 0) {
            listboxWidth = listboxEl.offsetWidth;
        }
        const resolvedWidth = listboxEl.offsetWidth;
        listboxLeft = align === "end" ? anchorRect.right - resolvedWidth : anchorRect.left;

        if (placementMode === "bottom") {
            listboxPlacement = "bottom";
            listboxTop = triggerRect.bottom + LISTBOX_TRIGGER_GAP;
            listboxMaxHeight = Math.max(
                0,
                window.innerHeight -
                    triggerRect.bottom -
                    LISTBOX_VIEWPORT_GAP -
                    LISTBOX_TRIGGER_GAP,
            );
            return;
        }

        // 选中项对齐模式
        const selectedItemEl = listboxEl.querySelector(
            '[aria-selected="true"]',
        ) as HTMLElement | null;
        const allOptionEls = listboxEl.querySelectorAll('[role="option"]');
        const midIndex =
            allOptionEls.length > 0
                ? Math.floor((allOptionEls.length - 1) / 2)
                : -1;
        const alignItemEl = (selectedItemEl ??
            (midIndex >= 0 ? allOptionEls[midIndex] : null) ??
            null) as HTMLElement | null;

        // 如果没找到要对齐的元素，使用简单定位（Trigger 下方）
        // 规范：无选中值时应与中间项对齐，但如果找不到任何选项，则使用下方定位作为后备
        if (!alignItemEl) {
            listboxPlacement = "bottom";
            listboxTop = triggerRect.bottom + LISTBOX_TRIGGER_GAP;
            listboxMaxHeight = Math.max(
                0,
                window.innerHeight -
                    triggerRect.bottom -
                    LISTBOX_VIEWPORT_GAP -
                    LISTBOX_TRIGGER_GAP,
            );
            return;
        }

        // 先 scrollIntoView 使 alignItem 滚入可视区域，再读取它相对 portal 的视觉位置。
        // header/body 拆分后不能再用 offsetTop 手算，否则有无 Input 时参考坐标会不同。
        alignItemEl.scrollIntoView({ block: "nearest" });

        const triggerCenterY = triggerRect.top + triggerRect.height / 2;
        const portalRect = listboxEl.getBoundingClientRect();
        const itemRect = alignItemEl.getBoundingClientRect();
        const itemCenterOffset =
            itemRect.top - portalRect.top + itemRect.height / 2;
        const idealTop = triggerCenterY - itemCenterOffset;

        // 用 offsetHeight（实际渲染高度，已受 max-height 约束）替代 scrollHeight
        // scrollHeight 在 overflow:clip 下可能超过 max-height，导致 clampedTop 计算偏大
        const portalHeight = listboxEl.offsetHeight;
        const clampedTop = Math.max(
            LISTBOX_VIEWPORT_GAP,
            Math.min(
                window.innerHeight - portalHeight - LISTBOX_VIEWPORT_GAP,
                idealTop,
            ),
        );

        listboxPlacement = "bottom";
        listboxTop = clampedTop;
        listboxMaxHeight = Math.max(
            0,
            window.innerHeight - clampedTop - LISTBOX_VIEWPORT_GAP,
        );
    }

    // 展开时计算定位
    $effect(() => {
        if (owner?.open) {
            tick().then(() => {
                // 多次 tick 确保 children（MenuItem）完全渲染到 portal 中
                return tick().then(() => {
                    updatePosition();
                });
            });
        }
    });

    $effect(() => {
        if (!owner?.open) return;
        owner.options.length;
        owner.customOptions.length;
        owner.filterText;
    });

    // 滚动活跃选项到可视区域
    $effect(() => {
        if (!owner?.open || !listboxEl) return;
        const idx = owner.activeIndex;
        const optEls = listboxEl.querySelectorAll('[role="option"]');
        (optEls[idx] as HTMLElement | undefined)?.scrollIntoView({
            block: "nearest",
        });
    });

    // 点击外部关闭
    $effect(() => {
        if (!owner?.open) return;
        const handler = (e: PointerEvent) => {
            const target = e.target as Node;
            const triggerEl = owner.triggerEl;
            const anchorEl = owner.anchorEl;
            if (
                !triggerEl?.contains(target) &&
                !anchorEl?.contains(target) &&
                !listboxEl?.contains(target)
            ) {
                owner.setOpen(false);
            }
        };
        document.addEventListener("pointerdown", handler, true);
        return () => document.removeEventListener("pointerdown", handler, true);
    });

    // 键盘导航
    function handleKeydown(e: KeyboardEvent) {
        if (!owner) return;
        const opts = [...owner.options, ...owner.customOptions];
        const len = opts.length;
        if (len === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                owner.setActiveIndex(Math.min(owner.activeIndex + 1, len - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                owner.setActiveIndex(Math.max(owner.activeIndex - 1, 0));
                break;
            case "Home":
                e.preventDefault();
                owner.setActiveIndex(0);
                break;
            case "End":
                e.preventDefault();
                owner.setActiveIndex(len - 1);
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (
                    owner.activeIndex >= 0 &&
                    !opts[owner.activeIndex]?.disabled
                ) {
                    owner.selectOption(opts[owner.activeIndex].value);
                }
                break;
            case "Escape":
                e.preventDefault();
                owner.setOpen(false);
                owner.triggerEl?.focus();
                break;
            case "Tab":
                owner.setOpen(false);
                break;
        }
    }
</script>

{#if presence.present}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        use:portal
        bind:this={listboxEl}
        class="snowui-listbox-portal-anchor"
        style="top: {listboxTop}px; left: {listboxLeft}px; width: max-content; min-width: {matchTriggerWidth && hasLockedWidth
            ? `max(${configuredMinWidth}, ${listboxWidth}px)`
            : configuredMinWidth}; --snowui-listbox-max-height: {configuredMaxHeight}; --snowui-listbox-available-height: {listboxMaxHeight}px; max-height: min(var(--snowui-listbox-max-height, 200px), var(--snowui-listbox-available-height));{userStyle
            ? ` ${userStyle}`
            : ''}"
        data-placement={listboxPlacement}
        data-width-mode={matchTriggerWidth ? "trigger" : "content"}
    >
        <Frame
            tag="div"
            column
            currentState={presence.closing ? "Disappear" : "Appear"}
            whileAppear={DROPDOWN_OVERLAY_APPEAR_MOTION}
            whileDisappear={DROPDOWN_OVERLAY_DISAPPEAR_MOTION}
            data-open={presence.closing ? undefined : "true"}
            data-closing={presence.closing ? "true" : undefined}
            class="snowui-listbox-portal snowui-quick-action-panel"
            style="width: max-content; min-width: 100%; max-height: inherit;"
            contentFill
            {enableAutoLayout}
            enableResponsive={enableResponsive}
            enableContext={enableContext}
            enableScaleObserver={enableScaleObserver}
            {...frameRestProps}
        >
            <div
                bind:this={headerEl}
                class="snowui-listbox-header snowui-quick-action-panel-header"
            >
                {#if resolvedSearch}
                    <Input {...resolvedParts.Input} as="search" />
                {/if}
            </div>
            <div
                class="snowui-listbox-body snowui-quick-action-panel-scroll-body snowui-overlay-scrollbar-host"
            >
                <Frame
                    bind:element={scrollListboxEl}
                    tag="div"
                    column
                    class={`snowui-listbox snowui-overlay-scrollbar-viewport${userClass ? ` ${userClass}` : ""}`}
                    style={CONTINUOUS_HOVER_MOTION_STYLE}
                    id={owner?.listboxId}
                    role="listbox"
                    tabindex={-1}
                    aria-labelledby={owner?.triggerId}
                    onkeydown={handleKeydown}
                    contentFill
                    {enableAutoLayout}
                    enableResponsive={enableResponsive}
                    enableContext={enableContext}
                    enableScaleObserver={enableScaleObserver}
                    componentParts={{ MenuItem: resolvedParts.MenuItem }}
                >
                    {#if children}
                        {@render children()}
                    {:else}
                        {#each items as item (item.value)}
                            <MenuItem as="item" value={item.value} disabled={item.disabled}>
                                {item.label}
                            </MenuItem>
                        {/each}
                    {/if}
                </Frame>

                <!-- 自定义浮层滚动条：只覆盖实际滚动的列表 body，不进入搜索 Input 区域 -->
                <!-- aria-hidden：屏幕阅读器通过原生滚动访问，此装饰元素不应被读取 -->
                {#if scrollbar}
                    <div
                        bind:this={scrollbarEl}
                        class="snowui-listbox-scrollbar snowui-overlay-scrollbar"
                        data-visible={sb.hasOverflow ? "true" : undefined}
                        aria-hidden="true"
                    >
                        <div
                            class="snowui-overlay-scrollbar-thumb"
                            style="height: {sb.thumbHeight}px; transform: translate3d(0, {sb.thumbY}px, 0);"
                        ></div>
                    </div>
                {/if}
            </div>
        </Frame>
    </div>
{:else}
    <!-- 关闭时始终挂载 children，让 MenuItem 可注册选项标签 -->
    <!-- aria-hidden 将其从无障碍树中隐藏 -->
    <div style="display:none;" aria-hidden="true">
        {#if children}
            {@render children()}
        {:else}
            {#each items as item (item.value)}
                <MenuItem as="item" value={item.value} disabled={item.disabled}>
                    {item.label}
                </MenuItem>
            {/each}
        {/if}
    </div>
{/if}

<style>
    /* ── Portal 外壳：只负责 fixed 定位与尺寸约束 ── */
    :global(:where(.snowui-listbox-portal-anchor)) {
        position: fixed;
        z-index: 1000;
    }

    /* ── 可见浮层面板：视觉样式由 .snowui-quick-action-panel 承载，出入场显式使用 dropdown overlay preset ── */
    :global(:where(.snowui-listbox-portal.snowui-quick-action-panel)) {
        --snowui-listbox-overlay-transform-origin: top center;
        overflow: clip;
        border: none;
        display: flex;
        flex-direction: column;
        transform-origin: var(--snowui-listbox-overlay-transform-origin);
        will-change: transform, opacity;
        padding: var(--snowui-listbox-padding-override, var(--padding-2));
        border-radius: var(--snowui-listbox-radius-override, var(--radius-4));
        gap: 0;
        max-height: inherit;
    }

    :global(:where(.snowui-listbox-portal.snowui-quick-action-panel[data-closing="true"])) {
        pointer-events: none;
    }

    :global(:where(.snowui-listbox-portal-anchor[data-placement="top"] .snowui-listbox-portal.snowui-quick-action-panel)) {
        --snowui-listbox-overlay-transform-origin: bottom center;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-listbox-portal.snowui-quick-action-panel)) {
            transition: none;
        }
    }

    /* ── Listbox 列表容器：填充剩余高度，独立滚动，隐藏原生滚动条 ── */
    :global(:where(.snowui-listbox)) {
        --snowui-listbox-background: transparent;
        gap: 0;
        background: var(
            --snowui-listbox-background-override,
            var(--snowui-listbox-background)
        );
        overflow-x: hidden;
        /* 滚动行为与原生滚动条隐藏由 .snowui-overlay-scrollbar-viewport 承接 */
        flex: 1;
        min-height: 0;
    }
    :global(:where(.snowui-listbox > [data-as="item"])) {
        position: relative;
        z-index: 1;
        width: 100%;
        white-space: nowrap;
    }
    :global(:where(.snowui-listbox-continuous-hover-layer)) {
        border-radius: var(--snowui-menu-item-radius-override, var(--radius-3, 0.75rem));
        background: var(--black-4, #0000000a);
    }
    /* 组件只声明轨道定位；视觉样式由 scrollbar.css 的 .snowui-overlay-scrollbar 承接。 */
    :global(:where(.snowui-listbox-scrollbar)) {
        top: 0;
        bottom: 0;
        right: -4px; /* thumb 右边缘距面板右边框 4px */
        z-index: 10;
    }
</style>
