<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 右侧详情弹出窗。共享 Dialog 面板视觉、右侧浮层 / 内嵌双模式、内置上下工具栏。文档: ./SidePanel.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import {tick, type Snippet} from "svelte";
    import {Button, Indicator, Tooltip, useLocale, type FrameProps, type DialogBackdrop} from "../index";
    import {useOverlayPresence} from "../logic/overlay-presence.svelte";
    import {resizeManager} from "../logic/observer.svelte";
    import {useOverlayScrollbar} from "../lib/overlay-scrollbar.svelte";
    import {SIDE_PANEL_APPEAR_MOTION, SIDE_PANEL_DISAPPEAR_MOTION} from "../motion/presets/effects";
    import {DIALOG_BACKDROP_MOTION_STYLE} from "../motion/presets/dialog";
    import {getMotionTotalDurationMs} from "../motion/presets/utils";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {provideComponentParts} from "../logic/component-parts.svelte";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import {ComponentIcon} from "../internal/component-icon/index";
    import type { SidePanelPlacement, SidePanelToolbarAction } from "../lib/side-panel";
    import Frame from "./Frame.svelte";

    interface Props extends Omit<FrameProps, "children" | "width"> {
        open?: boolean;
        placement?: SidePanelPlacement;
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        /** 内嵌位移动效归属；layout 由页面常驻 rail 统一驱动，以同步兄弟内容收缩 */
        inlineMotionOwner?: "component" | "layout";
        showTopToolbar?: boolean;
        /**
         * 内容是否可编辑。默认 `false`（只读）不显示下工具栏；
         * `true` 时自动显示下工具栏默认按钮（左 copy/delete，右 取消/保存）。
         * 只读时若传入 bottomLeading(Actions)/bottomTrailing(Actions) 仍会显示下工具栏。
         */
        editable?: boolean;
        /** 强制显示/隐藏下工具栏；默认按 editable 与下栏自定义自动推导 */
        showBottomToolbar?: boolean;
        /** 下栏左侧整组替换（显式）：如 Frame 内多个 Button。优先于 bottomLeadingActions */
        bottomLeading?: Snippet;
        /** 下栏右侧整组替换（显式）：如 Frame 内多个 Button。优先于 bottomTrailingActions */
        bottomTrailing?: Snippet;
        /** 下栏左侧数据内置替换；未传 bottomLeading 时生效；传入即令下工具栏出现 */
        bottomLeadingActions?: SidePanelToolbarAction[];
        /** 下栏右侧数据内置替换；未传 bottomTrailing 时生效；传入即令下工具栏出现 */
        bottomTrailingActions?: SidePanelToolbarAction[];
        title?: string;
        /** 是否显示上工具栏标题；不影响面板无障碍名称。 */
        showTitle?: boolean;
        /** 浮层背景；false 保留页面交互，内嵌模式不显示遮罩。 */
        backdrop?: DialogBackdrop | false;
        closeOnEscape?: boolean;
        /** 点击 SidePanel 外区域是否关闭，默认 true */
        closeOnOutside?: boolean;
        onOpenChange?: (open: boolean) => void;
        onPlacementChange?: (placement: SidePanelPlacement) => void;
        onPrevious?: () => void | Promise<void>;
        onNext?: () => void | Promise<void>;
        onCopy?: () => void | Promise<void>;
        onDelete?: () => void | Promise<void>;
        onClose?: () => void | Promise<void>;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Button: typeof Button;
            Indicator: typeof Indicator;
        }>;
        [key: string]: any;
    }

    let {
        open = $bindable(false),
        placement = $bindable("floating"),
        width = $bindable(460),
        minWidth = 320,
        maxWidth = 720,
        inlineMotionOwner = "component",
        showTopToolbar = true,
        editable = false,
        showBottomToolbar = undefined,
        bottomLeading = undefined,
        bottomTrailing = undefined,
        bottomLeadingActions = undefined,
        bottomTrailingActions = undefined,
        title = undefined,
        showTitle = false,
        backdrop = false,
        closeOnEscape = true,
        closeOnOutside = true,
        onOpenChange = undefined,
        onPlacementChange = undefined,
        onPrevious = undefined,
        onNext = undefined,
        onCopy = undefined,
        onDelete = undefined,
        onClose = undefined,
        children,
        parts = undefined,
        class: userClass = "",
        style: userStyle = "",
        enableDefaultMotion = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    provideComponentParts(() => parts);
    const locale = useLocale();
    const resolvedTitle = $derived(title ?? locale.t("sidePanel.title"));

    let panelEl = $state<HTMLElement | undefined>();
    let viewportEl = $state<HTMLElement | undefined>();
    let scrollbarEl = $state<HTMLElement | undefined>();
    let showTopFade = $state(false);
    let showBottomFade = $state(false);
    const presence = useOverlayPresence(
        () => open,
        getMotionTotalDurationMs(SIDE_PANEL_DISAPPEAR_MOTION),
    );
    const bodyScrollbar = useOverlayScrollbar(
        () => viewportEl,
        () => scrollbarEl,
    );

    function updateScrollFade() {
        if (!viewportEl) {
            showTopFade = false;
            showBottomFade = false;
            return;
        }
        const { scrollTop, clientHeight, scrollHeight } = viewportEl;
        showTopFade = scrollTop > 1;
        showBottomFade = scrollTop + clientHeight < scrollHeight - 1;
        bodyScrollbar.refresh();
    }

    function resolveScrollMask(showTop: boolean, showBottom: boolean) {
        if (showTop && showBottom) return "both";
        if (showTop) return "top";
        if (showBottom) return "bottom";
        return undefined;
    }

    $effect(() => {
        const el = viewportEl;
        if (!el || !open) {
            showTopFade = false;
            showBottomFade = false;
            return;
        }
        updateScrollFade();
        el.addEventListener("scroll", updateScrollFade, { passive: true });
        const unwatch = resizeManager.watch(el, updateScrollFade);
        return () => {
            el.removeEventListener("scroll", updateScrollFade);
            unwatch();
        };
    });

    const resolvedWidth = $derived(
        Math.min(Math.max(Number(width) || 460, minWidth), maxWidth),
    );
    const layoutOwnsInlineMotion = $derived(
        placement === "inline" && inlineMotionOwner === "layout",
    );
    const basePanelStyle = $derived(
        [
            `--snowui-side-panel-width: ${resolvedWidth}px`,
            userStyle,
        ].filter(Boolean).join("; "),
    );
    const panelClass = $derived(
        [
            "snowui-side-panel",
            "snowui-rounded-rectangle",
            placement === "inline" ? "snowui-quick-action-panel" : "",
            "snowui-overlay-scrollbar-host",
            placement === "inline" ? "snowui-side-panel-inline" : "snowui-side-panel-floating",
            userClass,
        ].filter(Boolean).join(" "),
    );

    /** 上工具栏固定默认内置，不支持外部替换 */
    const topActions = $derived<SidePanelToolbarAction[]>([
        {
            role: "placement",
            icon: placement === "floating" ? "rightbar-mode" : "windowed",
            ariaLabel: placement === "floating"
                ? locale.t("sidePanel.placement.toInline")
                : locale.t("sidePanel.placement.toFloating"),
        },
        { role: "previous", icon: "arrow-line-up", ariaLabel: locale.t("sidePanel.previous"), onClick: () => onPrevious?.() },
        { role: "next", icon: "arrow-line-down", ariaLabel: locale.t("sidePanel.next"), onClick: () => onNext?.() },
    ]);

    const hasBottomLeadingCustom = $derived(
        bottomLeading != null || bottomLeadingActions !== undefined,
    );
    const hasBottomTrailingCustom = $derived(
        bottomTrailing != null || bottomTrailingActions !== undefined,
    );
    /** 可编辑，或任一侧下栏被自定义时，显示下工具栏 */
    const resolvedShowBottomToolbar = $derived(
        showBottomToolbar ??
            (editable || hasBottomLeadingCustom || hasBottomTrailingCustom),
    );

    const defaultBottomLeadingActions = $derived<SidePanelToolbarAction[]>([
        { role: "copy", icon: "copy", ariaLabel: locale.t("sidePanel.copy"), onClick: () => onCopy?.() },
        { role: "delete", icon: "trash", ariaLabel: locale.t("sidePanel.delete"), onClick: () => onDelete?.() },
    ]);
    /** 默认：取消 borderless + 保存 gray；组内 gap 随工具栏 8px */
    const defaultBottomTrailingActions = $derived<SidePanelToolbarAction[]>([
        { role: "close", label: locale.t("sidePanel.cancel"), variant: "borderless", onClick: () => void closePanel() },
        { role: "custom", label: locale.t("sidePanel.save"), variant: "gray" },
    ]);
    // 可编辑：缺省侧用默认按钮；只读仅自定义一侧时，另一侧为空
    const resolvedBottomLeadingActions = $derived<SidePanelToolbarAction[]>(
        bottomLeadingActions ??
            (editable || !hasBottomTrailingCustom ? defaultBottomLeadingActions : []),
    );
    const resolvedBottomTrailingActions = $derived<SidePanelToolbarAction[]>(
        bottomTrailingActions ??
            (editable || !hasBottomLeadingCustom ? defaultBottomTrailingActions : []),
    );

    /**
     * 在浮层与内嵌模式之间迁移同一个渲染宿主。
     * 保留原位 marker，避免切换 placement 时销毁 / 重建面板子树。
     */
    function portal(node: HTMLElement, enabled: boolean) {
        const home = node.parentNode;
        const marker = document.createComment("side-panel-render-home");
        home?.insertBefore(marker, node);

        function place(nextEnabled: boolean) {
            if (nextEnabled) {
                document.body.appendChild(node);
                return;
            }
            marker.parentNode?.insertBefore(node, marker.nextSibling);
        }

        place(enabled);
        return {
            update(nextEnabled: boolean) {
                place(nextEnabled);
            },
            destroy() {
                node.remove();
                marker.remove();
            },
        };
    }

    function setOpen(next: boolean) {
        if (open === next) return;
        open = next;
        onOpenChange?.(next);
    }

    async function closePanel() {
        await onClose?.();
        setOpen(false);
    }

    function togglePlacement() {
        placement = placement === "floating" ? "inline" : "floating";
        onPlacementChange?.(placement);
        tick().then(() => panelEl?.focus());
    }

    function handleAction(action: SidePanelToolbarAction, event: MouseEvent) {
        if (action.disabled) return;
        if (action.role === "placement") {
            togglePlacement();
            return;
        }
        if (action.role === "close") {
            void closePanel();
            return;
        }
        void action.onClick?.(event);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!closeOnEscape || event.key !== "Escape") return;
        event.preventDefault();
        void closePanel();
    }

    // Remember actual open/switch triggers, without requiring consumer-only selectors.
    const previewTriggers = new WeakSet<Element>();
    let outsideClickTimer: ReturnType<typeof setTimeout> | undefined;

    async function afterClick() {
        clearTimeout(outsideClickTimer);
        // Native events may flush microtasks between capture and target listeners.
        await new Promise<void>((resolve) => { outsideClickTimer = setTimeout(resolve, 0); });
        await tick();
    }

    function contentSnapshot() {
        if (!panelEl) return "";
        return JSON.stringify([
            panelEl.textContent,
            [...panelEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select")]
                .map((field) => field.value),
        ]);
    }

    async function handleOutsideClick(event: MouseEvent) {
        if (event.button !== 0) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const trigger = target.closest("button, a, [role='button'], [role='row']") ?? target;
        if (!open) {
            await afterClick();
            if (open) previewTriggers.add(trigger);
            return;
        }
        if (!closeOnOutside || !panelEl || panelEl.contains(target)) return;
        if (target.closest(".snowui-table-row") || previewTriggers.has(trigger)) return;
        const panel = panelEl;
        const before = contentSnapshot();
        // Let the consumer's click update the record before deciding to dismiss.
        await afterClick();
        if (!open || panelEl !== panel) return;
        if (contentSnapshot() !== before) {
            previewTriggers.add(trigger);
            return;
        }
        void closePanel();
    }

    $effect(() => {
        if (!open) return;
        document.addEventListener("keydown", handleKeydown, true);
        return () => document.removeEventListener("keydown", handleKeydown, true);
    });

    $effect(() => {
        document.addEventListener("click", handleOutsideClick, true);
        return () => {
            document.removeEventListener("click", handleOutsideClick, true);
            clearTimeout(outsideClickTimer);
        };
    });

    function handleWidthChange(next: number) {
        width = Math.round(next);
    }
</script>

{#snippet actionButton(action: SidePanelToolbarAction)}
    {#if !action.hidden}
        <Button
            bare={action.bare ?? !action.label}
            iconOnly={!(action.bare ?? !action.label) && !!action.icon && !action.label}
            emphasis={parts?.Button?.emphasis ?? "muted"}
            size="sm"
            variant={action.variant ?? "gray"}
            disabled={action.disabled}
            aria-label={action.ariaLabel ?? action.label}
            class="snowui-side-panel-toolbar-button"
            onclick={(event: MouseEvent) => handleAction(action, event)}
        >
            {#if action.icon}
                <ComponentIcon name={action.icon} aria-hidden="true" />
            {/if}
            {#if action.label}<span>{action.label}</span>{/if}
            {#if action.icon && !action.label && (action.ariaLabel ?? action.label)}
                <Tooltip as="tooltip">{action.ariaLabel ?? action.label}</Tooltip>
            {/if}
        </Button>
    {/if}
{/snippet}

{#snippet panelContent()}
    <Frame
        tag="div"
        enableAutoLayout={false}
        currentState={layoutOwnsInlineMotion
            ? "Idle"
            : presence.closing ? "Disappear" : "Appear"}
        whileAppear={layoutOwnsInlineMotion ? false : SIDE_PANEL_APPEAR_MOTION}
        whileDisappear={layoutOwnsInlineMotion ? false : SIDE_PANEL_DISAPPEAR_MOTION}
        class={placement === "floating"
            ? "snowui-side-panel-motion-shell snowui-quick-action-panel snowui-rounded-rectangle"
            : "snowui-side-panel-motion-shell snowui-rounded-rectangle"}
        enableResponsive={false}
        enableDefaultMotion={enableDefaultMotion}
        enableContext={false}
        enableScaleObserver={false}
    >
        <Frame
            bind:element={panelEl}
            tag="aside"
            column
            enableAutoLayout={false}
            role="dialog"
            aria-modal={placement === "floating" ? "true" : undefined}
            aria-label={resolvedTitle}
            tabindex="-1"
            data-placement={placement}
            data-inline-motion-owner={placement === "inline" ? inlineMotionOwner : undefined}
            data-open={open ? "true" : undefined}
            data-closing={presence.closing ? "true" : undefined}
            data-top-toolbar={showTopToolbar ? "true" : undefined}
            data-bottom-toolbar={resolvedShowBottomToolbar ? "true" : undefined}
            data-editable={editable ? "true" : undefined}
            class={panelClass}
            style={basePanelStyle}
            enableResponsive={enableResponsive}
            enableDefaultMotion={enableDefaultMotion}
            enableContext={enableContext}
            enableScaleObserver={enableScaleObserver}
            componentParts={parts}
            {...rest}
        >
            {#if showTopToolbar}
                <div class="snowui-side-panel-toolbar snowui-side-panel-toolbar-top">
                    <div class="snowui-side-panel-toolbar-group">
                        {#each topActions as action, index (action.id ?? `${action.role ?? "top"}-${index}`)}
                            {@render actionButton(action)}
                        {/each}
                    </div>
                    <div class="snowui-side-panel-title-group">
                        {#if showTitle}<span class="snowui-side-panel-title">{resolvedTitle}</span>{/if}
                        <Button
                            bare
                            emphasis={parts?.Button?.emphasis ?? "muted"}
                            size="sm"
                            aria-label={locale.t("sidePanel.close")}
                            class="snowui-side-panel-toolbar-button snowui-side-panel-close"
                            onclick={() => void closePanel()}
                        >
                            <ComponentIcon name="close" aria-hidden="true" />
                            <Tooltip as="tooltip">{locale.t("sidePanel.close")}</Tooltip>
                        </Button>
                    </div>
                </div>
            {/if}

            <div class="snowui-side-panel-scroll-shell">
                <div
                    bind:this={viewportEl}
                    class="snowui-side-panel-body snowui-overlay-scrollbar-viewport snowui-scroll-mask"
                    data-scroll-mask={resolveScrollMask(showTopFade, showBottomFade)}
                >
                    {#if children}<ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>{/if}
                </div>
            </div>

            {#if resolvedShowBottomToolbar}
                <div class="snowui-side-panel-toolbar snowui-side-panel-toolbar-bottom">
                    <div class="snowui-side-panel-toolbar-group">
                        {#if bottomLeading}
                            <ComponentPartsBoundary>{@render bottomLeading()}</ComponentPartsBoundary>
                        {:else}
                            {#each resolvedBottomLeadingActions as action, index (action.id ?? `${action.role ?? "bottom-leading"}-${index}`)}
                                {@render actionButton(action)}
                            {/each}
                        {/if}
                    </div>
                    <div class="snowui-side-panel-toolbar-group snowui-side-panel-toolbar-group-trailing">
                        {#if bottomTrailing}
                            <ComponentPartsBoundary>{@render bottomTrailing()}</ComponentPartsBoundary>
                        {:else}
                            {#each resolvedBottomTrailingActions as action, index (action.id ?? `${action.role ?? "bottom-trailing"}-${index}`)}
                                {@render actionButton(action)}
                            {/each}
                        {/if}
                    </div>
                </div>
            {/if}

            <div
                bind:this={scrollbarEl}
                class="snowui-side-panel-scrollbar snowui-overlay-scrollbar"
                data-visible={bodyScrollbar.hasOverflow ? "true" : undefined}
                aria-hidden="true"
            >
                <div
                    class="snowui-overlay-scrollbar-thumb"
                    style="height: {bodyScrollbar.thumbHeight}px; transform: translate3d(0, {bodyScrollbar.thumbY}px, 0);"
                ></div>
            </div>

            <Indicator
                target={panelEl}
                revealTarget={panelEl}
                axis="width"
                edge="start"
                pinOffset="var(--padding-1)"
                class="snowui-side-panel-resize-indicator"
                value={resolvedWidth}
                minSize={minWidth}
                maxSize={maxWidth}
                applySize={false}
                ariaLabel={locale.t("sidePanel.resize")}
                onSizeChange={handleWidthChange}
            />
        </Frame>
    </Frame>
{/snippet}

{#if presence.present}
    <div
        use:portal={placement === "floating"}
        class={placement === "floating"
            ? "snowui-side-panel-layer"
            : "snowui-side-panel-inline-layer"}
        aria-hidden={open ? undefined : "true"}
    >
        {#if placement === "floating" && backdrop}
            <div
                class="snowui-side-panel-backdrop snowui-backdrop"
                data-backdrop={backdrop}
                data-closing={presence.closing ? "true" : undefined}
                style={DIALOG_BACKDROP_MOTION_STYLE}
                aria-hidden="true"
            ></div>
        {/if}
        {@render panelContent()}
    </div>
{/if}

<style>
    :global(:where(.snowui-side-panel-backdrop)) {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: auto;
    }

    :global(:where(.snowui-side-panel-layer)) {
        position: fixed;
        inset: var(--padding-4) var(--padding-4) var(--padding-4) auto;
        z-index: var(--snowui-side-panel-z-index-override, 50);
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        pointer-events: none;
    }

    :global(:where(.snowui-side-panel-inline-layer)) {
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        width: fit-content;
        max-width: 100%;
        height: 100%;
        min-width: 0;
        flex: 0 0 auto;
        pointer-events: none;
    }

    :global(:where(.snowui-side-panel-motion-shell)) {
        height: 100%;
        display: flex;
        align-items: stretch;
        justify-content: flex-end;
        overflow: hidden;
        padding: 0;
        gap: 0;
        border-radius: var(--snowui-side-panel-radius-override, var(--radius-5));
        pointer-events: none;
        will-change: transform;
    }

    :global(:where(.snowui-side-panel)) {
        --su-motion-transform: none;
        width: min(
            var(--snowui-side-panel-width, calc(var(--size-4) * 115 / 4)),
            calc(100vw - var(--size-8))
        );
        max-width: calc(100vw - var(--size-8));
        height: 100%;
        min-height: 0;
        overflow: hidden;
        position: relative;
        pointer-events: auto;
        box-sizing: border-box;
        padding: 0;
        border-radius: inherit;
        corner-shape: inherit;
        font-size: var(--snowui-side-panel-font-size-override, var(--text-14));
        line-height: var(--snowui-side-panel-line-height-override, var(--leading-14));
        --snowui-side-panel-toolbar-height: var(--size-12);
        --snowui-side-panel-bottom-toolbar-height: var(--size-14);
        --snowui-side-panel-toolbar-padding: var(--padding-4);
        --snowui-side-panel-toolbar-gap: var(--gap-2);
        --snowui-side-panel-body-padding: var(--padding-4);
        /* 通过 .snowui-scroll-mask 变量注入 Figma 模拟曲线（见 layout.css） */
        --snowui-scroll-mask-top-size-override: var(
            --snowui-side-panel-scroll-mask-top-size-override,
            var(--padding-4)
        );
        /* 底遮罩默认 16px（无下栏时与左右 padding 对齐）；有下栏时再抬到工具栏高 */
        --snowui-scroll-mask-bottom-size-override: var(
            --snowui-side-panel-scroll-mask-bottom-size-override,
            var(--padding-4)
        );
        /* 上/下均对齐 Figma：0–80% 实心 / 80–100% 过渡（内容侧 0%→20% 淡入） */
        --snowui-scroll-mask-top-solid-ratio-override: 0.8;
        --snowui-scroll-mask-bottom-solid-ratio-override: 0.8;
        --snowui-side-panel-body-padding-top: var(--snowui-scroll-mask-top-size-override);
        --snowui-side-panel-body-padding-bottom: var(--snowui-scroll-mask-bottom-size-override);
    }

    /* 浮层的 glass 由带 transform 的 motion shell 承载，避免 backdrop 采样被祖先隔离。 */
    :global(:where(.snowui-side-panel-floating)) {
        background-color: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
        border: none;
    }

    :global(:where(.snowui-side-panel[data-top-toolbar="true"])) {
        --snowui-scroll-mask-top-size-override: var(
            --snowui-side-panel-scroll-mask-top-size-override,
            var(--snowui-side-panel-toolbar-height)
        );
        --snowui-side-panel-body-padding-top: var(--snowui-scroll-mask-top-size-override);
    }

    :global(:where(.snowui-side-panel[data-bottom-toolbar="true"])) {
        --snowui-scroll-mask-bottom-size-override: var(
            --snowui-side-panel-scroll-mask-bottom-size-override,
            var(--snowui-side-panel-bottom-toolbar-height)
        );
        --snowui-side-panel-body-padding-bottom: var(--snowui-scroll-mask-bottom-size-override);
    }

    /* 内嵌：无外阴影；真实边框保证圆角边缘连续可见；高度可用 style/class 或变量覆盖。 */
    :global(:where(.snowui-side-panel-inline)) {
        border: var(--border-1) solid var(--black-10, #0000001a);
        box-shadow: none;
        height: var(
            --snowui-side-panel-height-override,
            calc(100dvh - var(--size-8))
        );
        align-self: stretch;
        flex: 0 0 auto;
    }

    :global(:where(.snowui-side-panel-toolbar)) {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: var(--snowui-side-panel-toolbar-padding);
        gap: var(--snowui-side-panel-toolbar-gap);
        color: var(--black-100, #000000);
        pointer-events: none;
    }

    :global(:where(.snowui-side-panel-toolbar > *)) {
        pointer-events: auto;
    }

    :global(:where(.snowui-side-panel-toolbar-top)) {
        top: 0;
        min-height: var(--snowui-side-panel-toolbar-height);
    }

    :global(:where(.snowui-side-panel-toolbar-bottom)) {
        bottom: 0;
        min-height: var(--snowui-side-panel-bottom-toolbar-height);
    }

    :global(:where(.snowui-side-panel-toolbar-group)) {
        display: flex;
        align-items: center;
        gap: var(--snowui-side-panel-toolbar-gap);
        min-width: 0;
    }

    :global(:where(.snowui-side-panel-toolbar-group-trailing)) {
        justify-content: flex-end;
    }

    :global(:where(.snowui-side-panel-toolbar-button)) {
        flex: 0 0 auto;
    }

    :global(:where(.snowui-side-panel-title-group)) {
        display: flex;
        align-items: center;
        max-width: 50%;
        min-width: 0;
        gap: var(--snowui-side-panel-toolbar-gap);
        flex: 0 1 auto;
    }

    :global(:where(.snowui-side-panel-title)) {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--black-20, #00000033);
        pointer-events: none;
        user-select: none;
    }

    :global(:where(.snowui-side-panel-close)) {
        flex: 0 0 auto;
    }

    :global(:where(.snowui-side-panel-scroll-shell)) {
        position: absolute;
        inset: 0;
        min-height: 0;
    }

    /* 上下滚动渐隐：.snowui-scroll-mask + data-scroll-mask；曲线/高度由面板根 CSS 变量注入。 */
    :global(:where(.snowui-side-panel-body)) {
        height: 100%;
        min-height: 0;
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        padding: var(--snowui-side-panel-body-padding-top)
            var(--snowui-side-panel-body-padding)
            var(--snowui-side-panel-body-padding-bottom);
        overscroll-behavior: contain;
        overscroll-behavior-y: contain;
    }

    /* 内容在内容盒内换行，避免长文案顶破右侧 16px padding */
    :global(:where(.snowui-side-panel-body > *)) {
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
        overflow-wrap: anywhere;
    }

    :global(:where(.snowui-side-panel-scrollbar)) {
        position: absolute;
        top: calc(var(--snowui-side-panel-body-padding-top) + var(--padding-1));
        right: var(--padding-1);
        bottom: calc(var(--snowui-side-panel-body-padding-bottom) + var(--padding-1));
        z-index: 3;
    }





    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-side-panel)) {
            transition: none;
        }
    }
</style>
