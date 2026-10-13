<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 Popover 浮层容器
 v3.1.1

 职责:三种模式
 - 面板模式 (Panel) 默认: <Popover>...</Popover> 直接渲染为内联面板(SP-02 风格)
 - 内嵌模式 (Inline): <Button>...<Popover as="popover">...</Popover></Button>
   自动发现宿主父元素作为 anchor;无需 id;触发器事件按 trigger 自动绑定(click / hover)
 - 模版模式 (Template): <Popover template id="X">...</Popover> 全局注册,
   通过 showPopover(id, anchorEl) 或 [data-popover-target="X"] 跨组件激活

 共同能力:
 - 三档尺寸 sm/md/lg(默认 sm);padding/radius: 12/16, 16/24, 24/32
 - 默认 column + gap=0;复用 .snowui-quick-action-panel 共享视觉基类
 - click 触发 / hover 触发(600ms 延迟,与 Tooltip 首次 hover 延迟统一)
 - 默认外部点击关闭;closeOn="manual" 仅由内部按钮关闭;Esc 始终可关闭
 - 距触发器 8px;支持配置方位 + 自动视口避让

 文档: ./Popover.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { tick, onMount, onDestroy, setContext, type Snippet } from "svelte";
    import SnowFrame, { type FrameProps } from "./Frame.svelte";
    import { getSize } from "../context";
    import { LISTBOX_HEADER_PORTAL_KEY } from "../keys";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import { useOverlayPresence } from "../logic/overlay-presence.svelte";
    import {
        DROPDOWN_OVERLAY_APPEAR_MOTION,
        DROPDOWN_OVERLAY_DISAPPEAR_MOTION,
    } from "../motion/presets/overlay";
    import { getMotionTotalDurationMs } from "../motion/presets/utils";
    import {
        registerPopoverTemplate,
        unregisterPopoverTemplate,
        popoverStore,
        showPopover,
        hidePopover,
        togglePopover,
        cancelHidePopover,
        scheduleHidePopover,
        type PopoverCloseMode,
        type PopoverPlacement,
        type PopoverSize,
        type PopoverTrigger,
    } from "../logic/popover.svelte";
    import { ContinuousHoverController } from "../logic/continuous-hover.svelte";
    import { CONTINUOUS_HOVER_MOTION_STYLE } from "../motion/presets/continuous-hover";

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    }

    interface Props extends Omit<FrameProps, "children"> {
        id?: string;
        template?: boolean;
        size?: PopoverSize;
        trigger?: PopoverTrigger;
        placement?: PopoverPlacement;
        offset?: number;
        closeOn?: PopoverCloseMode;
        closeOnEscape?: boolean;
        closeOnSelect?: boolean;
        /** 直接 MenuItem 间是否使用容器级连续 hover 背景。 */
        continuousHover?: boolean;
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        /** as="popover" 启用内嵌模式:自动发现宿主父元素为 anchor */
        as?: "popover" | undefined;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        id = undefined,
        template = false,
        size = "sm",
        trigger = "click",
        placement = "bottom",
        offset = 8,
        closeOn = "outside",
        closeOnEscape = true,
        closeOnSelect = undefined,
        continuousHover = true,
        /** 面板模式默认 open=true 直接渲染;模版 / 内嵌模式 open 不参与控制 */
        open = $bindable(true),
        onOpenChange = undefined,
        as = undefined,
        children,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    /* ── 三模式判定 ───────────────────────────────────────────────────── */
    type PopoverMode = "panel" | "inline" | "template";
    const mode = $derived<PopoverMode>(
        template ? "template" : as === "popover" ? "inline" : "panel",
    );

    /* ── 内嵌模式自动生成 id;模版模式用 props.id ───────────────────── */
    const internalId = `popover-inline-${Math.random().toString(36).substring(2, 11)}`;
    const effectiveId = $derived(
        mode === "inline" ? internalId : mode === "template" ? id : undefined,
    );

    const contextSize = getSize();
    const resolvedSize = $derived<PopoverSize>(
        (size ?? (contextSize as PopoverSize | undefined) ?? "sm") as PopoverSize,
    );

    /** sm 默认随 QuickAction 关闭;md/lg 默认沿用 SearchPopup 不关闭 */
    const resolvedCloseOnSelect = $derived(
        closeOnSelect ?? (resolvedSize === "sm"),
    );

    const VIEWPORT_PADDING = 8;

    /* ── 模版 / 内嵌模式:注册到 store ──────────────────────────────── */
    $effect(() => {
        if (mode === "panel") return;
        const eid = effectiveId;
        if (!eid) return;
        registerPopoverTemplate(eid, {
            trigger,
            placement,
            offset,
            size: resolvedSize,
            closeOn,
            closeOnEscape,
            closeOnSelect: resolvedCloseOnSelect,
        });
        return () => unregisterPopoverTemplate(eid);
    });

    /* ── 模版 / 内嵌模式:订阅活跃状态 ────────────────────────────── */
    const activeAnchor = $derived.by(() => {
        if (mode === "panel") return undefined;
        if (!effectiveId) return undefined;
        return popoverStore.active.find((p) => p.id === effectiveId)?.anchorEl;
    });
    const triggerOpen = $derived(activeAnchor !== undefined);

    /* ── 三模式 isOpen ────────────────────────────────────────────── */
    const panelOpen = $derived(mode === "panel" && open);
    const isOpen = $derived(mode === "panel" ? panelOpen : triggerOpen);
    const presence = useOverlayPresence(
        () => isOpen,
        getMotionTotalDurationMs(DROPDOWN_OVERLAY_DISAPPEAR_MOTION),
    );

    let panelEl = $state<HTMLElement | undefined>(undefined);
    let placeholderRef = $state<HTMLElement | undefined>(undefined);
    let coords = $state({ top: 0, left: 0 });
    let resolvedPlacement: PopoverPlacement = $state("bottom");
    let portalPositionReady = $state(false);
    const canPlayPresenceMotion = $derived(
        mode === "panel" || portalPositionReady || presence.closing,
    );

    // header 区域 DOM 引用:Input as="search" 通过 context 读取此元素并将自身移入
    let headerEl = $state<HTMLElement | undefined>(undefined);
    setContext(LISTBOX_HEADER_PORTAL_KEY, {
        get el() {
            return headerEl;
        },
    });

    // ── 自定义浮层滚动条:仅作用于 body,不进入 header ──
    let scrollViewportEl = $state<HTMLElement | undefined>(undefined);
    let scrollbarEl = $state<HTMLDivElement | undefined>(undefined);
    const continuousHoverController = new ContinuousHoverController();
    $effect(() => {
        if (!scrollViewportEl) return;
        return continuousHoverController.attach(scrollViewportEl, {
            selector: ":scope > .snowui-menu-item",
            layerClass: "snowui-popover-continuous-hover-layer",
            axis: "y",
            enabled: continuousHover,
        });
    });
    $effect(() => continuousHoverController.setEnabled(continuousHover));
    const sb = useOverlayScrollbar(
        () => scrollViewportEl,
        () => scrollbarEl,
    );

    /* ── 内嵌模式:onMount 时绑定父元素为 anchor 与触发源 ─────────── */
    let inlineAnchor: HTMLElement | null = null;
    let originalCursor = "";

    function handleInlineClick(e: MouseEvent) {
        if (!inlineAnchor || !effectiveId) return;
        e.stopPropagation();
        togglePopover(effectiveId, inlineAnchor);
    }
    function handleInlineMouseEnter() {
        if (!inlineAnchor || !effectiveId) return;
        showPopover(effectiveId, inlineAnchor);
    }
    function handleInlineMouseLeave() {
        if (!effectiveId) return;
        hidePopover(effectiveId);
    }

    onMount(() => {
        if (mode !== "inline") return;
        if (!placeholderRef) return;
        inlineAnchor = placeholderRef.parentElement;
        if (!inlineAnchor) return;
        originalCursor = inlineAnchor.style.cursor;
        inlineAnchor.style.cursor = "pointer";
        if (trigger === "click") {
            inlineAnchor.addEventListener("click", handleInlineClick);
        } else {
            inlineAnchor.addEventListener("mouseenter", handleInlineMouseEnter);
            inlineAnchor.addEventListener("mouseleave", handleInlineMouseLeave);
        }
    });

    onDestroy(() => {
        if (!inlineAnchor) return;
        inlineAnchor.style.cursor = originalCursor;
        inlineAnchor.removeEventListener("click", handleInlineClick);
        inlineAnchor.removeEventListener("mouseenter", handleInlineMouseEnter);
        inlineAnchor.removeEventListener("mouseleave", handleInlineMouseLeave);
    });

    function setStaticOpen(next: boolean) {
        if (open === next) return;
        open = next;
        onOpenChange?.(next);
    }

    function requestClose() {
        if (mode === "panel") {
            setStaticOpen(false);
        } else if (effectiveId) {
            hidePopover(effectiveId);
        }
    }

    /* ── 视口避让定位算法 ─────────────────────────────────────────── */
    function getPositionCoords(
        pos: PopoverPlacement,
        triggerRect: DOMRect,
        popoverRect: DOMRect,
    ) {
        switch (pos) {
            case "top":
                return {
                    top: triggerRect.top - popoverRect.height - offset,
                    left:
                        triggerRect.left +
                        triggerRect.width / 2 -
                        popoverRect.width / 2,
                };
            case "bottom":
                return {
                    top: triggerRect.bottom + offset,
                    left:
                        triggerRect.left +
                        triggerRect.width / 2 -
                        popoverRect.width / 2,
                };
            case "left":
                return {
                    top:
                        triggerRect.top +
                        triggerRect.height / 2 -
                        popoverRect.height / 2,
                    left: triggerRect.left - popoverRect.width - offset,
                };
            case "right":
                return {
                    top:
                        triggerRect.top +
                        triggerRect.height / 2 -
                        popoverRect.height / 2,
                    left: triggerRect.right + offset,
                };
        }
    }

    function getOppositePlacement(pos: PopoverPlacement): PopoverPlacement {
        switch (pos) {
            case "top":
                return "bottom";
            case "bottom":
                return "top";
            case "left":
                return "right";
            case "right":
                return "left";
        }
    }

    function isOutsideViewport(
        top: number,
        left: number,
        width: number,
        height: number,
    ) {
        return (
            top < VIEWPORT_PADDING ||
            left < VIEWPORT_PADDING ||
            top + height > window.innerHeight - VIEWPORT_PADDING ||
            left + width > window.innerWidth - VIEWPORT_PADDING
        );
    }

    function clampCoords(top: number, left: number, rect: DOMRect) {
        const minTop = VIEWPORT_PADDING;
        const minLeft = VIEWPORT_PADDING;
        const maxTop = window.innerHeight - rect.height - VIEWPORT_PADDING;
        const maxLeft = window.innerWidth - rect.width - VIEWPORT_PADDING;
        return {
            top: Math.max(minTop, Math.min(maxTop, top)),
            left: Math.max(minLeft, Math.min(maxLeft, left)),
        };
    }

    function updatePosition() {
        if (!panelEl) return;
        if (mode === "panel") return;
        if (!activeAnchor) return;

        const triggerRect = activeAnchor.getBoundingClientRect();
        const popoverRect = panelEl.getBoundingClientRect();
        const placements: PopoverPlacement[] = [
            placement,
            getOppositePlacement(placement),
            ...(placement === "top" || placement === "bottom"
                ? (["right", "left"] as const)
                : (["bottom", "top"] as const)),
        ];

        const firstCoords = getPositionCoords(
            placements[0],
            triggerRect,
            popoverRect,
        );
        let bestPlacement = placements[0];
        let bestCoords = clampCoords(
            firstCoords.top,
            firstCoords.left,
            popoverRect,
        );

        for (const item of placements) {
            const candidate = getPositionCoords(item, triggerRect, popoverRect);
            if (
                !isOutsideViewport(
                    candidate.top,
                    candidate.left,
                    popoverRect.width,
                    popoverRect.height,
                )
            ) {
                bestPlacement = item;
                bestCoords = clampCoords(
                    candidate.top,
                    candidate.left,
                    popoverRect,
                );
                break;
            }
        }

        resolvedPlacement = bestPlacement;
        coords = bestCoords;
        portalPositionReady = true;
    }

    /* ── 模版 / 内嵌模式:定位、滚动 / resize 跟随 ───────────────── */
    $effect(() => {
        if (mode === "panel") return;
        if (!triggerOpen) {
            portalPositionReady = false;
            return;
        }
        void activeAnchor;
        portalPositionReady = false;
        tick().then(updatePosition);

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
        return () => {
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    });

    /* ── 外部点击关闭 ──────────────────────────────────────────── */
    $effect(() => {
        if (!presence.present) return;
        if (closeOn !== "outside") return;

        const handler = (event: PointerEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (panelEl?.contains(target)) return;
            if (mode !== "panel" && activeAnchor?.contains(target)) return;
            requestClose();
        };
        document.addEventListener("pointerdown", handler, true);
        return () => document.removeEventListener("pointerdown", handler, true);
    });

    /* ── Escape 关闭 ────────────────────────────────────────────── */
    $effect(() => {
        if (!presence.present) return;
        if (!closeOnEscape) return;

        const handler = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            requestClose();
        };
        document.addEventListener("keydown", handler, true);
        return () => document.removeEventListener("keydown", handler, true);
    });

    /* ── MenuItem 选择 → 是否关闭(closeOnSelect) ─────────────── */
    $effect(() => {
        if (!panelEl) return;
        if (!presence.present) return;
        const node = panelEl;

        const handler = (event: Event) => {
            const detail = (event as CustomEvent<{ closeOnSelect?: boolean }>)
                .detail;
            const shouldClose = detail?.closeOnSelect ?? resolvedCloseOnSelect;
            if (shouldClose) requestClose();
        };
        node.addEventListener("snowui-menu-item-select", handler);
        return () =>
            node.removeEventListener("snowui-menu-item-select", handler);
    });

    /* ── hover 触发模式:鼠标进入 / 离开浮层本体管理关闭 ─────── */
    function handlePanelMouseEnter() {
        if (mode === "panel") return;
        if (trigger !== "hover" || !effectiveId) return;
        cancelHidePopover(effectiveId);
    }
    function handlePanelMouseLeave() {
        if (mode === "panel") return;
        if (trigger !== "hover" || !effectiveId) return;
        scheduleHidePopover(effectiveId);
    }

    const panelStyle = $derived(
        mode !== "panel"
            ? `position: fixed; top: ${coords.top}px; left: ${coords.left}px; z-index: 1000;${portalPositionReady ? "" : " visibility: hidden; pointer-events: none;"}${userStyle ? " " + userStyle : ""}`
            : userStyle || undefined,
    );

    const panelClass = $derived(
        [
            "snowui-popover",
            "snowui-quick-action-panel",
            "snowui-rounded-rectangle",
            mode === "panel" ? "snowui-popover-panel" : "snowui-popover-portal",
            userClass,
        ]
            .filter(Boolean)
            .join(" "),
    );
</script>

{#if mode === "inline"}
    <span
        bind:this={placeholderRef}
        style="display: none;"
        aria-hidden="true">&#8203;</span
    >
{/if}

{#if presence.present}
    <SnowFrame
        bind:element={panelEl}
        use={mode !== "panel" ? [portal] : undefined}
        tag="div"
        column
        enableAutoLayout={false}
        currentState={presence.closing ? "Disappear" : canPlayPresenceMotion ? "Appear" : "Idle"}
        whileAppear={DROPDOWN_OVERLAY_APPEAR_MOTION}
        whileDisappear={DROPDOWN_OVERLAY_DISAPPEAR_MOTION}
        data-size={resolvedSize}
        data-placement={mode !== "panel" ? resolvedPlacement : undefined}
        data-open={presence.closing ? undefined : "true"}
        data-closing={presence.closing ? "true" : undefined}
        class={panelClass}
        style={panelStyle}
        onmouseenter={handlePanelMouseEnter}
        onmouseleave={handlePanelMouseLeave}
        enableResponsive={enableResponsive}
        enableContext={enableContext}
        enableScaleObserver={enableScaleObserver}
        {...rest}
        renderHints={{
            variant: rest.renderHints?.variant ?? "rect",
            width: rest.renderHints?.width ?? "7rem",
            height: rest.renderHints?.height ?? "5rem",
            radius: rest.renderHints?.radius ?? "var(--radius-3)",
            rows: rest.renderHints?.rows,
        }}
    >
        <div
            bind:this={headerEl}
            class="snowui-popover-header snowui-quick-action-panel-header"
        ></div>
        <div class="snowui-popover-body snowui-quick-action-panel-scroll-body snowui-overlay-scrollbar-host">
            <div
                bind:this={scrollViewportEl}
                class="snowui-popover-scroll-content snowui-overlay-scrollbar-viewport"
                style={CONTINUOUS_HOVER_MOTION_STYLE}
            >
                {@render children?.()}
            </div>
            <div
                bind:this={scrollbarEl}
                class="snowui-popover-scrollbar snowui-overlay-scrollbar"
                data-visible={sb.hasOverflow ? "true" : undefined}
                aria-hidden="true"
            >
                <div
                    class="snowui-overlay-scrollbar-thumb"
                    style="height: {sb.thumbHeight}px; transform: translate3d(0, {sb.thumbY}px, 0);"
                ></div>
            </div>
        </div>
    </SnowFrame>
{/if}

<style>
    /* gap 强制 0;padding / radius 按 size 切档(覆盖共享基类默认值) */
    :global(:where(.snowui-popover)) {
        --snowui-popover-overlay-transform-origin: top left;
        gap: 0;
        overflow: clip;
        transform-origin: var(--snowui-popover-overlay-transform-origin);
        will-change: transform, opacity;
        font-size: var(--snowui-popover-font-size-override, var(--text-14));
        line-height: var(
            --snowui-popover-line-height-override,
            var(--leading-14)
        );
        padding: var(--snowui-popover-padding-override, var(--padding-3));
        border-radius: var(--snowui-popover-radius-override, var(--radius-4));
        max-height: inherit;
    }

    :global(:where(.snowui-popover[data-closing="true"])) {
        pointer-events: none;
    }
    :global(:where(.snowui-popover-scroll-content > .snowui-menu-item)) {
        position: relative;
        z-index: 1;
    }
    :global(:where(.snowui-popover-continuous-hover-layer)) {
        border-radius: var(--snowui-menu-item-radius-override, var(--radius-3, 0.75rem));
        background: var(--black-4, #0000000a);
    }

    :global(:where(.snowui-popover[data-placement="top"])) {
        --snowui-popover-overlay-transform-origin: bottom center;
    }

    :global(:where(.snowui-popover[data-placement="bottom"])) {
        --snowui-popover-overlay-transform-origin: top center;
    }

    :global(:where(.snowui-popover[data-placement="left"])) {
        --snowui-popover-overlay-transform-origin: center right;
    }

    :global(:where(.snowui-popover[data-placement="right"])) {
        --snowui-popover-overlay-transform-origin: center left;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-popover)) {
            transition: none;
        }
    }

    :global(:where(.snowui-popover)[data-size="md"]) {
        padding: var(--snowui-popover-padding-override, var(--padding-4));
        border-radius: var(
            --snowui-popover-radius-override,
            calc(var(--radius-3) * 2)
        );
    }

    :global(:where(.snowui-popover)[data-size="lg"]) {
        padding: var(--snowui-popover-padding-override, var(--padding-6));
        border-radius: var(
            --snowui-popover-radius-override,
            calc(var(--radius-4) * 2)
        );
    }

    /* body:填充剩余高度,内部 viewport 独立滚动 */
    :global(:where(.snowui-popover .snowui-popover-body)) {
        flex: 1;
        min-height: 0;
    }

    /* 滚动 viewport:column flex,继承面板字号/行高 */
    :global(:where(.snowui-popover .snowui-popover-scroll-content)) {
        display: flex;
        flex-direction: column;
        gap: 0;
        width: 100%;
        min-height: 0;
        /* 滚动行为与原生滚动条隐藏由 .snowui-overlay-scrollbar-viewport 承接 */
        overflow-x: hidden;
    }

    /* 浮层滚动条:仅覆盖 body 区域,thumb 右边缘距面板右边框 4px。
     * scrollbar 在 body 内绝对定位,body.right = panel.right - panel.padding,
     * 故 scrollbar 需向右偏移 (panel.padding - 4) 才能让 thumb 落在 panel.right - 4。
     * sm padding = 12 → right: -8;md padding = 16 → right: -12;lg padding = 24 → right: -20。
     */
    :global(:where(.snowui-popover .snowui-popover-scrollbar)) {
        top: 0;
        bottom: 0;
        right: -8px;
        z-index: 10;
    }
    :global(:where(.snowui-popover[data-size="md"] .snowui-popover-scrollbar)) {
        right: -12px;
    }
    :global(:where(.snowui-popover[data-size="lg"] .snowui-popover-scrollbar)) {
        right: -20px;
    }
</style>
