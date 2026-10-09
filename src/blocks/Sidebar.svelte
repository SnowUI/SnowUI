<!-- Sidebar PRO Block v1.7.3. 文档: ./Sidebar.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { onDestroy, onMount, setContext, tick, untrack, type Snippet } from "svelte";
    import {
        Button,
        Indicator,
        ScrollArea,
        SnowUILogo,
        ContinuousHoverController,
        resizeManager,
        type FrameProps,
    } from "../index";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {
        SIDE_PANEL_APPEAR_MOTION,
        SIDE_PANEL_DISAPPEAR_MOTION,
    } from "../motion/presets/effects";
    import { resolveMotionCssTiming } from "../motion/spring";
    import { CONTINUOUS_HOVER_MOTION_STYLE } from "../motion/presets/continuous-hover";
    import { ComponentIcon } from "../internal/component-icon/index";
    import FramePro from "../components/FramePro.svelte";
    import SidebarSection from "./SidebarSection.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import {
        SIDEBAR_CONTEXT_KEY,
        type SidebarActionData,
        type SidebarContext,
        type SidebarItemData,
    } from "./sidebar-context.svelte";

    export interface SidebarSectionData {
        id: string;
        title?: string;
        collapsible?: boolean;
        defaultCollapsed?: boolean;
        actions?: SidebarActionData[];
        items?: SidebarItemData[];
        content?: Snippet;
    }

    interface PersistedSidebarState {
        version: 1;
        activeItemId?: string;
        activeItemSectionId?: string;
        collapsedSections: Record<string, boolean>;
    }

    const sidebarExpandTiming = resolveMotionCssTiming(
        SIDE_PANEL_APPEAR_MOTION,
    );
    const sidebarCollapseTiming = resolveMotionCssTiming(
        SIDE_PANEL_DISAPPEAR_MOTION,
    );

    interface Props extends Omit<FrameProps, "children" | "width"> {
        sections?: SidebarSectionData[];
        navigationVariant?: "icon" | "text";
        collapsed?: boolean;
        defaultCollapsed?: boolean;
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        /** 是否允许通过右侧边缘调整展开宽度。 */
        resizable?: boolean;
        activeItemId?: string;
        /** 是否记忆 active item 与 Section 折叠状态。 */
        persistence?: boolean;
        /** localStorage 实例命名空间；多实例应提供不同值。 */
        persistenceKey?: string;
        ariaLabel?: string;
        /** 导航项之间是否使用容器级连续 hover 背景。 */
        continuousHover?: boolean;
        onCollapsedChange?: (collapsed: boolean) => void;
        onWidthChange?: (width: number) => void;
        onActiveItemChange?: (itemId: string) => void;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Indicator: typeof Indicator;
            SnowUILogo: typeof SnowUILogo;
            SidebarSection: typeof SidebarSection;
            SidebarItem: typeof SidebarItem;
        }>;
        [key: string]: any;
    }

    let {
        sections = [],
        navigationVariant = "icon",
        collapsed = $bindable<boolean | undefined>(undefined),
        defaultCollapsed = false,
        width = $bindable(220),
        minWidth = 160,
        maxWidth = 480,
        resizable = true,
        activeItemId = undefined,
        persistence = true,
        persistenceKey = "default",
        ariaLabel = "Primary navigation",
        continuousHover = true,
        onCollapsedChange = undefined,
        onWidthChange = undefined,
        onActiveItemChange = undefined,
        children,
        parts = undefined,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();

    let internalCollapsed = $state(untrack(() => defaultCollapsed));
    const isCollapsed = $derived(collapsed ?? internalCollapsed);
    const fullyCollapsed = $derived(isCollapsed && navigationVariant === "text");
    let floatingToggleHost: HTMLElement | undefined;
    let restoreToggleFocus = $state(false);

    // 脱离侧栏的布局与裁切；支持时进入浏览器顶层，按钮仍由 Sidebar 拥有。
    function floatingToggle(node: HTMLElement) {
        floatingToggleHost = node;
        document.body.appendChild(node);
        if (typeof node.showPopover === "function") node.showPopover();
        if (restoreToggleFocus) node.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
        return { destroy() {
            if (typeof node.hidePopover === "function" && node.matches(":popover-open")) node.hidePopover();
            node.remove();
            floatingToggleHost = undefined;
        } };
    }
    let internalActiveItemId = $state<string | undefined>(undefined);
    let activeItemSectionId = $state<string | undefined>(undefined);
    const resolvedActiveItemId = $derived(
        activeItemId ?? internalActiveItemId,
    );
    let collapsedSections = $state<Record<string, boolean>>({});
    let persistenceReady = $state(false);
    let rootElement = $state<HTMLElement>();
    let headerElement = $state<HTMLElement>();
    let previousFullyCollapsed: boolean | undefined;
    let toggleMove: Animation | undefined;
    let toggleMoveRevision = 0;

    // 在 Header 与顶层浮动按钮交接前保留可见位置，复用侧栏宽度动效的时间曲线。
    $effect.pre(() => {
        const next = fullyCollapsed;
        const previous = previousFullyCollapsed;
        previousFullyCollapsed = next;
        if (previous === undefined || previous === next) return;
        const origin = (next
            ? headerElement?.querySelector<HTMLElement>(".snowui-sidebar-collapse-button-host")
            : floatingToggleHost)?.getBoundingClientRect();
        const revision = ++toggleMoveRevision;
        toggleMove?.cancel();
        toggleMove = undefined;
        const enabled = untrack(() => enableDefaultMotion && navigationVariant === "text");
        if (!origin || !enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        void tick().then(() => {
            if (revision !== toggleMoveRevision) return;
            const target = next ? floatingToggleHost
                : headerElement?.querySelector<HTMLElement>(".snowui-sidebar-collapse-button-host");
            if (!target) return;
            const destination = target.getBoundingClientRect();
            const timing = next ? sidebarCollapseTiming : sidebarExpandTiming;
            toggleMove = target.animate([
                { transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px)` },
                { transform: "translate(0px, 0px)" },
            ], { duration: timing.duration, easing: timing.easing });
        });
    });
    onDestroy(() => {
        toggleMoveRevision++;
        toggleMove?.cancel();
    });

    let bodyViewport = $state<HTMLElement>();
    let navigationElement = $state<HTMLElement>();
    const continuousHoverController = new ContinuousHoverController();
    $effect(() => {
        if (!navigationElement) return;
        return continuousHoverController.attach(navigationElement, {
            selector: ".snowui-sidebar-item",
            layerClass: "snowui-sidebar-continuous-hover-layer snowui-rounded-rectangle",
            axis: "y",
            enabled: continuousHover,
            blockedSelector: ".snowui-sidebar-section-header",
        });
    });
    $effect(() => continuousHoverController.setEnabled(continuousHover));
    let footerElement = $state<HTMLElement>();
    let hasExternalLogo = $state(false);
    let hasExternalFooter = $state(false);
    let resizing = $state(false);
    let measuredFooterHeight = $state(0);
    let measuredHeaderHeight = $state(0);
    let footerMeasureFrame = 0;
    let resizeEndFrame = 0;
    let logoPlacementFrame = 0;
    let activeRevealFrame = 0;
    let activeRevealTimer = 0;
    const resolvedWidth = $derived(
        Math.min(Math.max(Number(width) || 220, minWidth), maxWidth),
    );
    const widthMotionTiming = $derived(
        isCollapsed ? sidebarCollapseTiming : sidebarExpandTiming,
    );
    const rootStyle = $derived(
        [
            `--snowui-sidebar-width: ${resolvedWidth}px`,
            `--snowui-sidebar-footer-measured-height: ${measuredFooterHeight}px`,
            `--snowui-sidebar-header-measured-height: ${measuredHeaderHeight}px`,
            `--snowui-sidebar-width-motion-duration: ${enableDefaultMotion ? widthMotionTiming.duration : 0}ms`,
            `--snowui-sidebar-width-motion-easing: ${widthMotionTiming.easing}`,
            userStyle,
        ].filter(Boolean).join("; "),
    );

    const context: SidebarContext = {
        get collapsed() {
            return isCollapsed;
        },
        get activeItemId() {
            return resolvedActiveItemId;
        },
        select(itemId: string) {
            internalActiveItemId = itemId;
            activeItemSectionId = findItemSectionId(itemId);
            onActiveItemChange?.(itemId);
        },
        getSectionCollapsed(sectionId: string) {
            return collapsedSections[sectionId];
        },
        setSectionCollapsed(sectionId: string, nextCollapsed: boolean) {
            if (
                nextCollapsed &&
                resolvedActiveItemId &&
                findItemSectionId(resolvedActiveItemId) === sectionId
            ) {
                activeItemSectionId = sectionId;
            }
            collapsedSections = {
                ...collapsedSections,
                [sectionId]: nextCollapsed,
            };
        },
    };
    setContext(SIDEBAR_CONTEXT_KEY, context);

    async function toggleCollapsed() {
        restoreToggleFocus = !!(rootElement?.contains(document.activeElement) || floatingToggleHost?.contains(document.activeElement));
        const next = !isCollapsed;
        internalCollapsed = next;
        collapsed = next;
        onCollapsedChange?.(next);
        await tick();
        if (!next && restoreToggleFocus) {
            headerElement?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
            restoreToggleFocus = false;
        }
    }

    function handleWidthChange(next: number) {
        const resolved = Math.min(Math.max(Math.round(next), minWidth), maxWidth);
        width = resolved;
        onWidthChange?.(resolved);
    }

    function startWidthResize() {
        cancelAnimationFrame(resizeEndFrame);
        resizing = true;
    }

    async function finishWidthResize(next: number) {
        handleWidthChange(next);
        await tick();
        cancelAnimationFrame(resizeEndFrame);
        rootElement?.getBoundingClientRect();
        resizeEndFrame = requestAnimationFrame(() => {
            resizing = false;
        });
    }

    function syncExternalLogo() {
        if (!headerElement || !rootElement) return;
        let logo = headerElement.querySelector<HTMLElement>(
            ':scope > [data-as="logo"]:not(.snowui-sidebar-default-logo)',
        );
        if (!logo && navigationElement) {
            logo = navigationElement.querySelector<HTMLElement>(
                ':scope > [data-as="logo"]',
            );
        }
        hasExternalLogo = !!logo;
        if (!logo || logo.parentElement === headerElement) return;

        cancelAnimationFrame(logoPlacementFrame);
        logoPlacementFrame = requestAnimationFrame(() => {
            const collapseButtonHost = headerElement?.querySelector<HTMLElement>(
                ':scope > .snowui-sidebar-collapse-button-host',
            );
            if (
                headerElement &&
                logo?.isConnected &&
                logo.nextElementSibling !== collapseButtonHost
            ) {
                headerElement.insertBefore(logo, collapseButtonHost ?? null);
            }
        });
    }

    function syncExternalFooter() {
        if (!footerElement || !navigationElement) return;
        let footer = footerElement.querySelector<HTMLElement>(
            ':scope > [data-as="footer"]',
        );
        if (!footer) {
            footer = navigationElement.querySelector<HTMLElement>(
                ':scope > [data-as="footer"]',
            );
            if (footer) footerElement.appendChild(footer);
        }
        hasExternalFooter = !!footer;
    }

    function syncFooterSafeArea() {
        if (!rootElement || !footerElement) return;
        const footerHeight = footerElement.getBoundingClientRect().height;
        measuredHeaderHeight = headerElement?.getBoundingClientRect().height ?? 0;
        // 与宽度共用声明式 style，避免拖宽重写根样式时清掉底部预留高度。
        if (measuredFooterHeight !== footerHeight) {
            measuredFooterHeight = footerHeight;
            if (persistenceReady && resolvedActiveItemId) {
                scheduleActiveItemReveal();
            }
        }
    }

    function scheduleFooterSafeAreaSync() {
        cancelAnimationFrame(footerMeasureFrame);
        footerMeasureFrame = requestAnimationFrame(syncFooterSafeArea);
    }

    function syncBodyScrollMask() {
        if (!bodyViewport) return;
        bodyViewport.classList.add("snowui-scroll-mask");
        const top = bodyViewport.scrollTop > 1;
        const bottom = hasExternalFooter && !isCollapsed;
        if (top || bottom) {
            bodyViewport.dataset.scrollMask = top && bottom ? "both" : top ? "top" : "bottom";
        } else {
            bodyViewport.removeAttribute("data-scroll-mask");
        }
    }

    function getPersistenceStorageKey() {
        return persistence && persistenceKey
            ? `snowui:sidebar:${persistenceKey}`
            : undefined;
    }

    function findItem(itemId: string) {
        if (!navigationElement) return undefined;
        return Array.from(
            navigationElement.querySelectorAll<HTMLElement>(
                "[data-sidebar-item-id]",
            ),
        ).find((item) => item.dataset.sidebarItemId === itemId);
    }

    function findItemSectionId(itemId: string) {
        return findItem(itemId)?.closest<HTMLElement>(
            "[data-sidebar-section-id]",
        )?.dataset.sidebarSectionId;
    }

    function expandActiveItemSection(itemId: string) {
        const item = findItem(itemId);
        const section = item?.closest<HTMLElement>(
            "[data-sidebar-section-id]",
        );
        const sectionId = section?.dataset.sidebarSectionId;
        if (!sectionId || collapsedSections[sectionId] !== true) return;
        collapsedSections = {
            ...collapsedSections,
            [sectionId]: false,
        };
    }

    function revealActiveItem() {
        if (!bodyViewport || !resolvedActiveItemId) return;
        const item = findItem(resolvedActiveItemId);
        if (!item || bodyViewport.scrollHeight <= bodyViewport.clientHeight + 1) {
            return;
        }

        const viewportRect = bodyViewport.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const headerOcclusion = parseFloat(getComputedStyle(navigationElement!).paddingTop) || 0;
        const visibleHeight = Math.max(itemRect.height, viewportRect.height - headerOcclusion - (hasExternalFooter && !isCollapsed ? measuredFooterHeight : 0));
        const itemCenterInContent =
            bodyViewport.scrollTop +
            itemRect.top -
            viewportRect.top +
            itemRect.height / 2;
        const maxScroll = Math.max(
            0,
            bodyViewport.scrollHeight - bodyViewport.clientHeight,
        );
        bodyViewport.scrollTop = Math.min(
            maxScroll,
            Math.max(0, itemCenterInContent - headerOcclusion - visibleHeight / 2),
        );
        syncBodyScrollMask();
    }

    function scheduleActiveItemReveal() {
        cancelAnimationFrame(activeRevealFrame);
        window.clearTimeout(activeRevealTimer);
        activeRevealFrame = requestAnimationFrame(() => {
            revealActiveItem();
            activeRevealTimer = window.setTimeout(revealActiveItem, 550);
        });
    }

    async function restorePersistedState() {
        const storageKey = getPersistenceStorageKey();
        if (!storageKey) return;
        let restored: PersistedSidebarState | undefined;
        try {
            const raw = window.localStorage.getItem(storageKey);
            if (raw) restored = JSON.parse(raw) as PersistedSidebarState;
        } catch {
            restored = undefined;
        }

        if (restored?.version === 1) {
            const restoredCollapsedSections =
                restored.collapsedSections ?? {};
            collapsedSections = restoredCollapsedSections;
            if (
                restored.activeItemId &&
                restored.activeItemSectionId &&
                collapsedSections[restored.activeItemSectionId] === true
            ) {
                collapsedSections = {
                    ...collapsedSections,
                    [restored.activeItemSectionId]: false,
                };
            }
            await tick();
            if (restored.activeItemId && findItem(restored.activeItemId)) {
                internalActiveItemId = restored.activeItemId;
                activeItemSectionId =
                    findItemSectionId(restored.activeItemId) ??
                    restored.activeItemSectionId;
                onActiveItemChange?.(restored.activeItemId);
                await tick();
                expandActiveItemSection(restored.activeItemId);
            } else {
                collapsedSections = restoredCollapsedSections;
            }
        }
        persistenceReady = true;
        await tick();
        scheduleActiveItemReveal();
    }

    $effect(() => {
        const storageKey = getPersistenceStorageKey();
        if (!storageKey || !persistenceReady) return;
        const persistedState: PersistedSidebarState = {
            version: 1,
            activeItemId: resolvedActiveItemId,
            activeItemSectionId: resolvedActiveItemId
                ? findItemSectionId(resolvedActiveItemId) ?? activeItemSectionId
                : undefined,
            collapsedSections,
        };
        try {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify(persistedState),
            );
        } catch {
            // localStorage 不可用时保持组件功能，不阻断导航。
        }
    });

    onMount(() => {
        syncExternalLogo();
        syncExternalFooter();
        syncBodyScrollMask();
        const observer = new MutationObserver(() => {
            syncExternalLogo();
            syncExternalFooter();
            syncBodyScrollMask();
            scheduleFooterSafeAreaSync();
        });
        const handleResize = () => {
            syncBodyScrollMask();
            syncFooterSafeArea();
        };
        if (navigationElement) observer.observe(navigationElement, { childList: true });
        if (headerElement) observer.observe(headerElement, { childList: true });
        if (footerElement) observer.observe(footerElement, { childList: true });
        const resizeCleanups = [bodyViewport, navigationElement, footerElement, headerElement]
            .filter((element): element is HTMLElement => Boolean(element))
            .map((element) => resizeManager.watch(element, handleResize));
        scheduleFooterSafeAreaSync();
        void restorePersistedState();
        return () => {
            cancelAnimationFrame(footerMeasureFrame);
            cancelAnimationFrame(resizeEndFrame);
            cancelAnimationFrame(logoPlacementFrame);
            cancelAnimationFrame(activeRevealFrame);
            window.clearTimeout(activeRevealTimer);
            observer.disconnect();
            resizeCleanups.forEach((cleanup) => cleanup());
        };
    });
</script>

<FramePro
    bind:element={rootElement}
    tag="aside"
    column
    enableAutoLayout={false}
    class={["snowui-sidebar", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    data-collapsed={isCollapsed ? "true" : "false"}
    aria-hidden={fullyCollapsed ? "true" : undefined}
    inert={fullyCollapsed}
    data-navigation-variant={navigationVariant}
    data-restore-toggle-focus={!isCollapsed && restoreToggleFocus ? "true" : undefined}
    data-resizable={resizable ? "true" : "false"}
    data-resizing={resizing ? "true" : undefined}
    data-has-footer={hasExternalFooter ? "true" : undefined}
    data-persistence-ready={persistence && persistenceKey && persistenceReady
        ? "true"
        : undefined}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    {...rest}
>
    <header bind:this={headerElement} class="snowui-sidebar-header">
        {#if !hasExternalLogo}
            <div
                data-as="logo"
                class="snowui-sidebar-default-logo"
                role="img"
                aria-label="SnowUI"
            >
                <SnowUILogo
                    {...parts?.SnowUILogo}
                    as="logo-icon"
                    variant="icon"
                    decorative
                />
                <SnowUILogo
                    {...parts?.SnowUILogo}
                    as="logo-wordmark"
                    variant="text"
                    decorative
                />
            </div>
        {/if}
        <span class="snowui-sidebar-collapse-button-host">
            <Button
                iconOnly
                size="sm"
                class="snowui-sidebar-collapse-button"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onclick={toggleCollapsed}
            >
                <ComponentIcon name="rightbar" aria-hidden="true" />
            </Button>
        </span>
    </header>

    <ScrollArea
        bind:viewport={bodyViewport}
        class="snowui-sidebar-body"
        ariaLabel={ariaLabel}
        onscroll={syncBodyScrollMask}
    >
        <nav bind:this={navigationElement} class="snowui-sidebar-navigation" style={CONTINUOUS_HOVER_MOTION_STYLE} aria-label={ariaLabel}>
            {#each sections as section (section.id)}
                <SidebarSection
                    {...parts?.SidebarSection}
                    id={section.id}
                    title={section.title}
                    collapsible={section.collapsible}
                    defaultCollapsed={section.defaultCollapsed}
                    actions={section.actions}
                >
                    {#if section.content}
                        {@render section.content()}
                    {:else}
                        {#each section.items ?? [] as item (item.id)}
                            <SidebarItem {...parts?.SidebarItem} {...item} />
                        {/each}
                    {/if}
                </SidebarSection>
            {/each}
            {#if children}
                {@render children()}
            {/if}
        </nav>
    </ScrollArea>

    <footer
        bind:this={footerElement}
        class="snowui-sidebar-footer"
        data-has-footer={hasExternalFooter ? "true" : undefined}
        aria-hidden={isCollapsed ? "true" : undefined}
        inert={isCollapsed}
    ></footer>

    {#if !isCollapsed && resizable}
        <Indicator
            {...parts?.Indicator}
            target={rootElement}
            revealTarget={rootElement}
            axis="width"
            edge="end"
            pinOffset="var(--snowui-sidebar-resize-indicator-offset-override, var(--padding-1))"
            class="snowui-sidebar-resize-indicator"
            value={resolvedWidth}
            minSize={minWidth}
            maxSize={maxWidth}
            applySize={false}
            ariaLabel="调整侧边栏宽度"
            onResizeStart={startWidthResize}
            onSizeChange={handleWidthChange}
            onResizeEnd={(next: number) => void finishWidthResize(next)}
        />
    {/if}
</FramePro>

{#if fullyCollapsed}
    <div use:floatingToggle popover="manual" class="snowui-sidebar-floating-toggle">
        <Button iconOnly size="sm" aria-label="Expand sidebar" onclick={toggleCollapsed}>
            <ComponentIcon name="rightbar" aria-hidden="true" />
        </Button>
    </div>
{/if}

<style>
    :global(:where(.snowui-sidebar)) {
        --snowui-sidebar-width: 220px;
        --snowui-sidebar-collapsed-width: 60px;
        --snowui-sidebar-padding-x: var(--padding-3);
        --snowui-sidebar-padding-y: var(--padding-4);
        --snowui-sidebar-gap: var(--gap-3);
        --snowui-sidebar-separator-padding-x: var(--padding-2);
        --snowui-sidebar-separator-padding-y: var(--padding-2);
        position: relative;
        display: flex;
        width: var(--snowui-sidebar-width-override, var(--snowui-sidebar-width));
        height: 100%;
        min-height: 0;
        box-sizing: border-box;
        flex-direction: column;
        gap: var(--snowui-sidebar-gap-override, var(--snowui-sidebar-gap));
        padding: var(--snowui-sidebar-padding-y-override, var(--snowui-sidebar-padding-y))
            var(--snowui-sidebar-padding-x-override, var(--snowui-sidebar-padding-x));
        color: var(--black-100, #000);
        background: transparent;
        transition: width
            var(--snowui-sidebar-width-motion-duration, 500ms)
            var(--snowui-sidebar-width-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"])) {
        width: var(--snowui-sidebar-collapsed-width-override, var(--snowui-sidebar-collapsed-width));
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"])) {
        width: 0;
        min-width: 0;
        padding: 0;
        gap: 0;
        flex-shrink: 0;
    }
    :global(:where(.snowui-sidebar-floating-toggle)) {
        position: fixed;
        inset: var(--padding-4) auto auto var(--padding-3);
        width: var(--size-6);
        height: var(--size-6);
        margin: 0;
        padding: 0;
        border: 0;
        overflow: visible;
        background: transparent;
        color: var(--black-100);
        z-index: 1000;
    }
    :global(:where(.snowui-sidebar-floating-toggle:popover-open)),
    :global(:where(.snowui-sidebar-floating-toggle:not(:popover-open))) {
        align-items: center;
        justify-content: center;
    }
    :global(:where(.snowui-sidebar-floating-toggle:popover-open)) {
        display: flex;
    }
    @supports not selector(:popover-open) {
        :global(:where(.snowui-sidebar-floating-toggle)) { display: flex; }
    }
    :global(:where(.snowui-sidebar[data-resizing="true"])) {
        transition: none;
    }
    :global(:where(.snowui-sidebar-header)) {
        position: relative;
        z-index: 1;
        flex-shrink: 0;
        display: flex;
        width: 100%;
        min-height: 28px;
        box-sizing: border-box;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-collapsed-header-gap-override, var(--gap-1));
        overflow: visible;
        padding-block: var(
            --snowui-sidebar-logo-padding-y-override,
            var(--padding-1)
        );
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-header)) {
        display: none;
    }
    :global(:where(.snowui-sidebar-header > [data-as="logo"])) {
        max-width: 100%;
        min-width: var(
            --snowui-sidebar-collapsed-logo-slot-width-override,
            36px
        );
        box-sizing: border-box;
        flex: 1 1 auto;
        flex-wrap: nowrap;
        overflow: hidden;
        white-space: nowrap;
        padding-inline: var(
            --snowui-sidebar-logo-padding-x-override,
            var(--padding-1)
        );
    }
    :global(:where(.snowui-sidebar-default-logo)) {
        display: inline-flex;
        align-items: center;
        gap: var(
            --snowui-sidebar-default-logo-gap-override,
            calc(var(--gap-1) * 1.5)
        );
    }
    :global(:where(.snowui-sidebar-header > [data-as="logo"] > :not([data-as="logo-icon"]))) {
        opacity: 1;
        transition: opacity
            var(--snowui-sidebar-width-motion-duration, 500ms)
            var(--snowui-sidebar-width-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="icon"] .snowui-sidebar-header > [data-as="logo"] > :not([data-as="logo-icon"]))) {
        opacity: 0;
        pointer-events: none;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="icon"] .snowui-sidebar-header > [data-as="logo"] > [data-as="logo-icon"])) {
        flex: 0 0 auto;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-header > [data-as="logo"])) {
        display: none;
    }
    :global(.snowui-sidebar-navigation > [data-as="logo"]) {
        display: none;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"] .snowui-sidebar-navigation > :not(.snowui-sidebar-item):not(.snowui-sidebar-section):not(.snowui-separator):not(.snowui-continuous-hover-layer):not([data-as="logo"]))) {
        display: none;
    }
    :global(:where(.snowui-sidebar-collapse-button-host)) {
        display: inline-flex;
        width: var(--size-6);
        height: var(--size-6);
        flex: 0 0 var(--size-6);
        align-items: center;
        justify-content: center;
    }
    :global(:where(.snowui-sidebar[data-collapsed="false"] .snowui-sidebar-collapse-button-host)) {
        margin-right: var(--padding-1);
    }
    :global(:where(.snowui-sidebar-collapse-button)) {
        flex: 0 0 auto;
        visibility: hidden;
        pointer-events: none;
    }
    :global(:where(.snowui-sidebar:hover, .snowui-sidebar:focus-within, .snowui-sidebar[data-restore-toggle-focus="true"], .snowui-sidebar-collapse-button-host:hover) .snowui-sidebar-collapse-button) {
        visibility: visible;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-collapse-button-host)) {
        margin-inline: auto;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-collapse-button)) {
        visibility: visible;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar-body)) {
        --snowui-sidebar-header-region-height: calc(
            var(--snowui-sidebar-header-measured-height, 0px) +
            var(--snowui-sidebar-padding-y-override, var(--snowui-sidebar-padding-y)) +
            var(--snowui-sidebar-gap-override, var(--snowui-sidebar-gap)));
        margin-top: calc(-1 * var(--snowui-sidebar-header-region-height));
        isolation: isolate;
        width: 100%;
        flex: 1 1 auto;
        min-height: 0;
        overflow: visible;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-body)) {
        display: none;
    }
    :global(:where(.snowui-sidebar-body > .snowui-scroll-area-scrollbar[data-axis="vertical"])) {
        right: calc(
            var(--snowui-scrollbar-edge-gap) -
                var(
                    --snowui-sidebar-padding-x-override,
                    var(--snowui-sidebar-padding-x)
                )
        );
    }
    :global(:where(.snowui-sidebar-navigation)) {
        padding-top: var(--snowui-sidebar-header-region-height);
        display: flex;
        min-width: 0;
        box-sizing: border-box;
        flex-direction: column;
        gap: var(--snowui-sidebar-navigation-gap-override, var(--gap-1));
    }
    :global(:where(.snowui-sidebar) :where(.snowui-separator-row)) {
        display: block;
        width: 100%;
        height: calc(
            var(
                    --snowui-separator-thickness-override,
                    var(--snowui-separator-thickness, 0.03125rem)
                ) +
                var(
                    --snowui-sidebar-separator-padding-y-override,
                    var(--snowui-sidebar-separator-padding-y)
                ) +
                var(
                    --snowui-sidebar-separator-padding-y-override,
                    var(--snowui-sidebar-separator-padding-y)
                )
        );
        box-sizing: border-box;
        padding: var(
                --snowui-sidebar-separator-padding-y-override,
                var(--snowui-sidebar-separator-padding-y)
            )
            var(
                --snowui-sidebar-separator-padding-x-override,
                var(--snowui-sidebar-separator-padding-x)
            );
        background-clip: content-box;
        line-height: 0;
    }
    :global(:where(.snowui-sidebar-navigation .snowui-sidebar-item)) {
        z-index: 1;
    }
    :global(:where(.snowui-sidebar-continuous-hover-layer)) {
        border-radius: var(--snowui-sidebar-item-radius-override, var(--radius-3));
        background: var(--snowui-sidebar-item-background-override, var(--black-4, #0000000a));
    }
    :global(:where(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-body)) {
        /* 滚动内容延伸至底部，由 alpha 遮罩按 Footer 高度逐渐隐去。 */
        margin-bottom: calc(-1 * var(--snowui-sidebar-padding-y-override, var(--snowui-sidebar-padding-y)));
        isolation: isolate;
    }
    :global(:where(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-navigation)) {
        padding-bottom: calc(var(--snowui-sidebar-footer-measured-height, 0px) + var(--gap-3));
    }
    :global(:where(.snowui-sidebar-body > .snowui-scroll-area-viewport)) {
        --snowui-sidebar-mask-top: var(--snowui-sidebar-logo-scroll-mask-size-override, var(--snowui-sidebar-header-region-height));
        --snowui-sidebar-mask-bottom: 0px;
        /* 两端互为镜像：进入固定区 20% 后仅余 20% 可见度，40% 后完全隐藏。 */
        --snowui-sidebar-edge-mask: linear-gradient(to bottom,
            transparent calc(var(--snowui-sidebar-mask-top) * 0.6),
            rgb(0 0 0 / 0.2) calc(var(--snowui-sidebar-mask-top) * 0.8),
            #000 var(--snowui-sidebar-mask-top),
            #000 calc(100% - var(--snowui-sidebar-mask-bottom)),
            rgb(0 0 0 / 0.2) calc(100% - var(--snowui-sidebar-mask-bottom) * 0.8),
            transparent calc(100% - var(--snowui-sidebar-mask-bottom) * 0.6));
        mask-image: var(--snowui-sidebar-edge-mask);
        -webkit-mask-image: var(--snowui-sidebar-edge-mask);
    }
    :global(:where(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-body > .snowui-scroll-area-viewport)) {
        --snowui-sidebar-mask-bottom: var(--snowui-sidebar-footer-measured-height, 0px);
    }
    :global(:where(.snowui-sidebar-footer)) {
        position: absolute;
        z-index: 1;
        display: flex;
        bottom: 0;
        left: 0;
        width: var(--snowui-sidebar-width-override, var(--snowui-sidebar-width));
        box-sizing: border-box;
        align-items: flex-start;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-footer-gap-override, var(--gap-2));
        padding: var(--snowui-sidebar-footer-padding-y-override, var(--padding-3))
            var(--snowui-sidebar-footer-padding-x-override, var(--padding-5))
            var(--snowui-sidebar-footer-padding-y-override, var(--padding-4));
        overflow: hidden;
        border-radius: 0;
        background: transparent;
        opacity: 1;
        transition: opacity
            var(--snowui-sidebar-width-motion-duration, 500ms)
            var(--snowui-sidebar-width-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-footer > [data-as="footer"])) {
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-footer-gap-override, var(--gap-2));
    }
    :global(:where(.snowui-sidebar-footer:not([data-has-footer="true"]))) {
        display: none;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"] .snowui-sidebar-footer)) {
        opacity: 0;
        pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-sidebar)),
        :global(:where(.snowui-sidebar-header > [data-as="logo"] > :not([data-as="logo-icon"]))),
        :global(:where(.snowui-sidebar-footer)) {
            transition: none;
        }
    }
</style>
