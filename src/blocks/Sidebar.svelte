<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Sidebar Block v1.9.5. 文档: ./Sidebar.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import {onDestroy, onMount, setContext, tick, untrack, type Snippet} from "svelte";
    import {Button, Indicator, ScrollArea, SnowUILogo, ContinuousHoverController, resizeManager, type FrameProps} from "../index";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    // Hidden-mode exit timing shares PANEL_EXIT_TIMING with SidePanel through this CSS adapter.
    // Sidebar owns slide geometry and toggle tracking; see MotionPresetSpec section 5.
    import {SIDEBAR_DRAWER_STYLE} from "../motion/presets/sidebar-drawer";
    import {SIDE_PANEL_APPEAR_MOTION, SIDE_PANEL_DISAPPEAR_MOTION} from "../motion/presets/effects";
    import {resolveMotionCssTiming} from "../motion/spring";
    import {CONTINUOUS_HOVER_MOTION_STYLE} from "../motion/presets/continuous-hover";
    import {ComponentIcon} from "../internal/component-icon/index";
    import Frame from "../components/Frame.svelte";
    import SidebarSection from "./SidebarSection.svelte";
    import SidebarItem from "./SidebarItem.svelte";
    import {SIDEBAR_CONTEXT_KEY, type SidebarActionData, type SidebarContext, type SidebarItemData} from "./sidebar-context.svelte";
    import { useLocale } from "../i18n/locale.svelte";

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
        collapsed?: boolean;
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
        /** Keep the compact rail, or slide the entire sidebar out of view. */
        collapseMode?: "compact" | "hidden";
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
        /** Render fixed footer content in place, including during SSR. */
        footer?: Snippet;
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
        collapseMode = "compact",
        collapsed = $bindable<boolean | undefined>(undefined),
        defaultCollapsed = false,
        width = $bindable(220),
        minWidth = 160,
        maxWidth = 480,
        resizable = true,
        activeItemId = undefined,
        persistence = true,
        persistenceKey = "default",
        ariaLabel = undefined,
        continuousHover = true,
        onCollapsedChange = undefined,
        onWidthChange = undefined,
        onActiveItemChange = undefined,
        children,
        footer: footerContent,
        parts = undefined,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();
    const localeContext = useLocale();

    // 可绑定 Prop 负责输入/回传，本地 state 保持连续交互时的显示状态。
    function readInitialCollapsed() {
        if (typeof window !== "undefined" && persistence && persistenceKey) {
            try {
                const stored = JSON.parse(window.localStorage.getItem(`snowui:sidebar:${persistenceKey}`) ?? "null") as PersistedSidebarState | null;
                if (stored?.version === 1 && typeof stored.collapsed === "boolean") return stored.collapsed;
            } catch { /* Keep the supplied initial state when storage is unavailable. */ }
        }
        return collapsed ?? defaultCollapsed;
    }
    let isCollapsed = $state(untrack(readInitialCollapsed));
    // Synchronize a bound value before the first client render.
    if (typeof window !== "undefined") collapsed = untrack(() => isCollapsed);
    $effect.pre(() => {
        if (collapsed !== undefined) isCollapsed = collapsed;
    });
    let narrow = $state(typeof window !== "undefined" && window.matchMedia("(max-width: 800px)").matches);
    let mobileOpen = $state(false);
    const contentCollapsed = $derived(collapseMode === "compact" && isCollapsed);
    const hidden = $derived(collapseMode === "hidden" && (narrow ? !mobileOpen : isCollapsed));
    const fullyCollapsed = $derived(hidden || (contentCollapsed && navigationVariant === "text"));
    onMount(() => {
        const media = window.matchMedia("(max-width: 800px)");
        const adapt = () => { narrow = media.matches; mobileOpen = false; };
        adapt();
        media.addEventListener("change", adapt);
        return () => media.removeEventListener("change", adapt);
    });
    let floatingToggleHost: HTMLElement | undefined;
    let restoreToggleFocus = $state(false);
    let toggleVisible = $state(false);
    let toggleHideTimer: ReturnType<typeof setTimeout> | undefined;
    function revealToggle() { toggleVisible = true; }
    function isToggleHovered() {
        return !!(headerElement?.querySelector('.snowui-sidebar-collapse-button-host')?.matches(':hover')
            || floatingToggleHost?.matches(':hover'));
    }
    function leaveToggleRegion() {
        if (toggleHideTimer === undefined && !isToggleHovered()) toggleVisible = false;
    }
    function revealFocusedToggle(event: FocusEvent) {
        if ((event.target as HTMLElement)?.matches(':focus-visible')) revealToggle();
    }


    // 脱离侧栏的布局与裁切；支持时进入浏览器顶层，按钮仍由 Sidebar 拥有。
    function floatingToggle(node: HTMLElement) {
        floatingToggleHost = node;
        document.body.appendChild(node);
        if (typeof node.showPopover === "function") node.showPopover();
        void tick().then(syncDrawerToggleStop);
        if (restoreToggleFocus) node.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
        return { destroy() {
            if (typeof node.hidePopover === "function" && node.matches(":popover-open")) node.hidePopover();
            node.remove();
            floatingToggleHost = undefined;
        } };
    }
    $effect(() => {
        if (collapseMode === "hidden" && fullyCollapsed && restoreToggleFocus) {
            void tick().then(() => floatingToggleHost?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }));
        }
    });
    let internalActiveItemId = $state<string | undefined>(undefined);
    let activeItemSectionId = $state<string | undefined>(undefined);
    const resolvedActiveItemId = $derived(
        activeItemId ?? internalActiveItemId,
    );
    let collapsedSections = $state<Record<string, boolean>>({});
    let persistenceReady = $state(false);
    let rootElement = $state<HTMLElement>();
    let headerElement = $state<HTMLElement>();
    let drawerSlot = $state<HTMLDivElement>();
    let previousFullyCollapsed: boolean | undefined;
    let toggleMove: Animation | undefined;
    let toggleMoveRevision = 0;
    let toggleFollowFrame = 0;
    let toggleFollowing = $state(false);

    // Anchor to the logo artwork's expanded center, including a translated drawer.
    function syncDrawerToggleStop() {
        if (collapseMode !== "hidden" || !rootElement || !floatingToggleHost) return;
        const icon = headerElement?.querySelector<HTMLElement>('[data-as="logo-icon"]');
        if (!icon) return;
        const rect = icon.getBoundingClientRect();
        const transform = getComputedStyle(rootElement).transform;
        const matrix = transform === "none" ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(transform);
        floatingToggleHost.style.left = `${rect.left + rect.width / 2 - matrix.m41 - floatingToggleHost.offsetWidth / 2}px`;
        floatingToggleHost.style.top = `${rect.top + rect.height / 2 - matrix.m42 - floatingToggleHost.offsetHeight / 2}px`;
    }

    // The slot owns layout space; Frame owns the panel transform. Both use one clock.
    function syncDrawerSlot() {
        if (!rootElement || !drawerSlot) return;
        const computed = getComputedStyle(rootElement);
        drawerSlot.style.setProperty("--snowui-sidebar-slot-width", `${rootElement.offsetWidth}px`);
        for (const name of ["duration", "easing", "close-duration", "close-easing"]) {
            const property = `--snowui-sidebar-drawer-${name}`;
            drawerSlot.style.setProperty(property, computed.getPropertyValue(property));
        }
    }

    // Follow the panel's actual transform, then clamp at the fixed reopen position.
    // This shares its velocity and easing, including interrupted transitions.
    function followDrawerToggle() {
        cancelAnimationFrame(toggleFollowFrame);
        const host = headerElement?.querySelector<HTMLElement>(".snowui-sidebar-collapse-button-host");
        const floating = floatingToggleHost;
        if (!host || !floating || !rootElement) return;
        floating.style.transform = "";
        syncDrawerToggleStop();
        const stop = floating.getBoundingClientRect();
        const timing = getComputedStyle(rootElement).getPropertyValue(hidden ? "--snowui-sidebar-drawer-close-duration" : "--snowui-sidebar-drawer-duration").trim();
        const duration = parseFloat(timing) * (timing.endsWith("ms") ? 1 : 1000);
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!enableDefaultMotion || reduced || !duration) { toggleFollowing = false; return; }
        toggleFollowing = true;
        const started = performance.now();
        const follow = () => {
            const position = host.getBoundingClientRect();
            floating.style.transform = `translateX(${Math.max(0, position.left - stop.left)}px)`;
            if (performance.now() - started < duration) {
                toggleFollowFrame = requestAnimationFrame(follow);
            } else {
                floating.style.transform = "";
                toggleFollowing = false;
                if (!fullyCollapsed && restoreToggleFocus) {
                    host.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
                    restoreToggleFocus = false;
                }
            }
        };
        follow();
    }

    // 在 Header 与顶层浮动按钮交接前保留可见位置，复用侧栏宽度动效的时间曲线。
    $effect.pre(() => {
        const next = fullyCollapsed;
        const previous = previousFullyCollapsed;
        previousFullyCollapsed = next;
        if (previous === undefined || previous === next) return;
        if (untrack(() => collapseMode === "hidden")) {
            untrack(followDrawerToggle);
            return;
        }
        const origin = (next
            ? headerElement?.querySelector<HTMLElement>(".snowui-sidebar-collapse-button-host")
            : floatingToggleHost)?.getBoundingClientRect();
        const revision = ++toggleMoveRevision;
        toggleMove?.cancel();
        toggleMove = undefined;
        const enabled = untrack(() => enableDefaultMotion && collapseMode === "compact" && navigationVariant === "text");
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
        if (typeof window !== "undefined") window.cancelAnimationFrame(toggleFollowFrame);
        toggleMove?.cancel();
        clearTimeout(toggleHideTimer);
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
    // 显示状态由本地 state 持有；外部 width 变化仍同步进入。
    let currentWidth = $state(untrack(() => width));
    $effect.pre(() => { currentWidth = width; });
    const resolvedWidth = $derived(
        Math.min(Math.max(Number(currentWidth) || 220, minWidth), maxWidth),
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
            // Resolve the shared fade clock on the Sidebar, before child Frame overrides.
            `--snowui-sidebar-content-fade-duration: ${enableDefaultMotion ? "var(--snowui-frame-color-motion-duration, 0.15s)" : "0s"}`,
            `--snowui-sidebar-content-fade-easing: var(--snowui-frame-color-motion-easing, ease-out)`,
            SIDEBAR_DRAWER_STYLE,
            !enableDefaultMotion ? "--snowui-sidebar-drawer-duration: 0ms; --snowui-sidebar-drawer-close-duration: 0ms" : "",
            userStyle,
        ].filter(Boolean).join("; "),
    );

    $effect(() => {
        rootStyle;
        drawerSlot;
        untrack(syncDrawerSlot);
    });

    const context: SidebarContext = {
        get collapsed() {
            return contentCollapsed;
        },
        get activeItemId() {
            return resolvedActiveItemId;
        },
        select(itemId: string) {
            if (collapseMode === "hidden" && narrow) mobileOpen = false;
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
        clearTimeout(toggleHideTimer);
        toggleVisible = true;
        toggleHideTimer = setTimeout(() => {
            toggleHideTimer = undefined;
            toggleVisible = isToggleHovered();
        }, 1000);
        restoreToggleFocus = !!(rootElement?.contains(document.activeElement) || floatingToggleHost?.contains(document.activeElement));
        const next = collapseMode === "hidden" ? !hidden : !isCollapsed;
        if (collapseMode === "hidden" && narrow) {
            mobileOpen = !next;
        } else {
            collapsed = next;
            isCollapsed = next;
            onCollapsedChange?.(next);
        }
        await tick();
        if (!next && restoreToggleFocus && !toggleFollowing) {
            headerElement?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
            restoreToggleFocus = false;
        }
    }

    function handleWidthChange(next: number) {
        const resolved = Math.min(Math.max(Math.round(next), minWidth), maxWidth);
        width = resolved;
        currentWidth = resolved;
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
        if (footerContent) return;
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
        const bottom = (footerContent || hasExternalFooter) && !contentCollapsed;
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
        const visibleHeight = Math.max(itemRect.height, viewportRect.height - headerOcclusion - ((footerContent || hasExternalFooter) && !contentCollapsed ? measuredFooterHeight : 0));
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
            if (typeof restored.collapsed === "boolean") {
                isCollapsed = restored.collapsed;
                collapsed = restored.collapsed;
                onCollapsedChange?.(restored.collapsed);
            }
            const restoredCollapsedSections =
                restored.collapsedSections ?? {};
            collapsedSections = restoredCollapsedSections;
            const targetItemId = activeItemId ?? restored.activeItemId;
            const targetItem = targetItemId ? findItem(targetItemId) : undefined;
            const targetSectionId = targetItemId
                ? targetItem
                    ? findItemSectionId(targetItemId)
                    : targetItemId === restored.activeItemId
                        ? restored.activeItemSectionId
                        : undefined
                : undefined;
            if (
                targetSectionId &&
                collapsedSections[targetSectionId] === true
            ) {
                collapsedSections = {
                    ...collapsedSections,
                    [targetSectionId]: false,
                };
            }
            await tick();
            if (!activeItemId && restored.activeItemId && findItem(restored.activeItemId)) {
                internalActiveItemId = restored.activeItemId;
                activeItemSectionId = findItemSectionId(restored.activeItemId);
                onActiveItemChange?.(restored.activeItemId);
                await tick();
                expandActiveItemSection(restored.activeItemId);
            } else if (activeItemId) {
                activeItemSectionId = findItem(activeItemId)
                    ? findItemSectionId(activeItemId)
                    : targetSectionId;
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
            collapsed: isCollapsed,
            activeItemId: resolvedActiveItemId,
            activeItemSectionId: resolvedActiveItemId
                ? findItem(resolvedActiveItemId)
                    ? findItemSectionId(resolvedActiveItemId)
                    : activeItemSectionId
                : undefined,
            collapsedSections,
        };
        // Mirror only layout state for hosts that render the initial shell on the server.
        document.cookie = `snowui-sidebar-collapsed-${encodeURIComponent(persistenceKey)}=${isCollapsed ? "1" : "0"}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
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
            syncDrawerSlot();
            if (!toggleFollowing) syncDrawerToggleStop();
        };
        if (navigationElement) observer.observe(navigationElement, { childList: true });
        if (headerElement) observer.observe(headerElement, { childList: true });
        if (footerElement) observer.observe(footerElement, { childList: true });
        const resizeCleanups = [rootElement, bodyViewport, navigationElement, footerElement, headerElement]
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

<svelte:window onkeydown={(event) => {
    if (event.key === "Escape" && collapseMode === "hidden" && narrow && mobileOpen) void toggleCollapsed();
}} />

{#snippet sidebarPanel()}
<Frame
    bind:element={rootElement}
    tag="aside"
    column
    enableAutoLayout={false}
    class={["snowui-sidebar", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    data-collapsed={contentCollapsed ? "true" : "false"}
    data-collapse-mode={collapseMode}
    data-hidden={hidden ? "true" : "false"}
    data-toggle-following={toggleFollowing ? "true" : undefined}
    data-mobile-open={mobileOpen ? "true" : "false"}
    aria-hidden={fullyCollapsed ? "true" : undefined}
    inert={fullyCollapsed}
    data-navigation-variant={navigationVariant}
    data-restore-toggle-focus={!isCollapsed && restoreToggleFocus ? "true" : undefined}
    data-resizable={resizable ? "true" : "false"}
    data-resizing={resizing ? "true" : undefined}
    data-has-footer={(footerContent || hasExternalFooter) ? "true" : undefined}
    data-persistence-ready={persistence && persistenceKey && persistenceReady
        ? "true"
        : undefined}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    {...rest}
    data-toggle-visible={toggleVisible ? "true" : undefined}
    onpointerenter={(event: PointerEvent) => { revealToggle(); rest.onpointerenter?.(event); }}
    onpointerleave={(event: PointerEvent) => { leaveToggleRegion(); rest.onpointerleave?.(event); }}
    onfocusin={(event: FocusEvent) => { revealFocusedToggle(event); rest.onfocusin?.(event); }}
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
                    scale={24 / 28}
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
        <span role="group" class="snowui-sidebar-collapse-button-host" onpointerenter={revealToggle} onpointerleave={leaveToggleRegion}>
            <Button
                iconOnly
                size="sm"
                class="snowui-sidebar-collapse-button"
                aria-label={localeContext.t((collapseMode === "hidden" ? hidden : isCollapsed) ? "sidebar.expand" : "sidebar.collapse")}
                onclick={toggleCollapsed}
            >
                <ComponentIcon name="rightbar" aria-hidden="true" />
            </Button>
        </span>
    </header>

    <ScrollArea
        bind:viewport={bodyViewport}
        class="snowui-sidebar-body"
        ariaLabel={ariaLabel ?? localeContext.t("sidebar.navigation")}
        onscroll={syncBodyScrollMask}
    >
        <nav bind:this={navigationElement} class="snowui-sidebar-navigation" style={CONTINUOUS_HOVER_MOTION_STYLE} aria-label={ariaLabel ?? localeContext.t("sidebar.navigation")}>
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
        data-has-footer={(footerContent || hasExternalFooter) ? "true" : undefined}
        aria-hidden={contentCollapsed ? "true" : undefined}
        inert={contentCollapsed}
    >{#if footerContent}{@render footerContent()}{/if}</footer>

    {#if !fullyCollapsed && !contentCollapsed && resizable && !(collapseMode === "hidden" && narrow)}
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
            ariaLabel={localeContext.t("sidebar.resize")}
            onResizeStart={startWidthResize}
            onSizeChange={handleWidthChange}
            onResizeEnd={(next: number) => void finishWidthResize(next)}
        />
    {/if}
</Frame>
{/snippet}

{#if collapseMode === "hidden"}
    <div bind:this={drawerSlot} class="snowui-sidebar-slot" data-hidden={hidden ? "true" : "false"}
        style={`--snowui-sidebar-slot-width: ${resolvedWidth}px; ${SIDEBAR_DRAWER_STYLE}; ${!enableDefaultMotion ? "--snowui-sidebar-drawer-duration: 0ms; --snowui-sidebar-drawer-close-duration: 0ms" : ""}`}>
        {@render sidebarPanel()}
    </div>
{:else}
    {@render sidebarPanel()}
{/if}

{#if fullyCollapsed || collapseMode === "hidden"}
    <div role="group" data-collapse-mode={collapseMode} data-visible={fullyCollapsed || toggleFollowing ? "true" : "false"} data-mobile-open={mobileOpen ? "true" : "false"} inert={!fullyCollapsed && !toggleFollowing} use:floatingToggle popover="manual" class="snowui-sidebar-floating-toggle" data-toggle-visible={toggleVisible ? "true" : undefined} onpointerenter={revealToggle} onpointerleave={leaveToggleRegion} onfocusin={revealFocusedToggle}>
        <Button iconOnly size="sm" class="snowui-sidebar-collapse-button" aria-label={localeContext.t("sidebar.expand")} onclick={toggleCollapsed}>
            <ComponentIcon name="rightbar" aria-hidden="true" />
        </Button>
    </div>
{/if}

{#if collapseMode === "hidden" && narrow && mobileOpen}
    <button class="snowui-sidebar-drawer-scrim" aria-label={localeContext.t("sidebar.collapse")} onclick={toggleCollapsed}></button>
{/if}

<style>
    :global(.snowui-sidebar[data-toggle-following="true"]) {
        --snowui-sidebar-toggle-host-visibility: hidden;
        --snowui-sidebar-toggle-host-pointer-events: none;
    }
    /* Frame's shared motion layer writes transform/transition (StyleSpec §2.14). */
    :global(.snowui-sidebar[data-collapse-mode="hidden"]) {
        --snowui-sidebar-root-transform: translateX(0);
        --snowui-sidebar-root-flex-shrink: 0;
        --snowui-sidebar-root-transition: transform var(--snowui-sidebar-drawer-duration) var(--snowui-sidebar-drawer-easing), visibility 0s;
    }
    :global(.snowui-sidebar[data-collapse-mode="hidden"][data-hidden="true"]) {
        --snowui-sidebar-root-transform: translateX(-100%);
        --snowui-sidebar-root-visibility: hidden;
        --snowui-sidebar-root-pointer-events: none;
        --snowui-sidebar-root-transition: transform var(--snowui-sidebar-drawer-close-duration) var(--snowui-sidebar-drawer-close-easing), visibility 0s var(--snowui-sidebar-drawer-close-duration);
    }
    :global(.snowui-sidebar-floating-toggle[data-collapse-mode="hidden"][data-visible="false"]) {
        --snowui-sidebar-floating-visibility: hidden;
        --snowui-sidebar-floating-pointer-events: none;
    }
    :where(.snowui-sidebar-slot) {
        position: relative;
        flex-shrink: 0;
        height: 100%;
        min-height: 0;
        width: var(--snowui-sidebar-slot-size, var(--snowui-sidebar-slot-width));
        transition: width var(--snowui-sidebar-slot-duration, var(--snowui-sidebar-drawer-duration)) var(--snowui-sidebar-slot-easing, var(--snowui-sidebar-drawer-easing));
    }
    .snowui-sidebar-slot[data-hidden="true"] {
        --snowui-sidebar-slot-size: 0px;
        --snowui-sidebar-slot-duration: var(--snowui-sidebar-drawer-close-duration);
        --snowui-sidebar-slot-easing: var(--snowui-sidebar-drawer-close-easing);
    }
    :where(.snowui-sidebar-drawer-scrim) {
        position: fixed; inset: 0; z-index: 25; border: 0;
        background: rgba(0, 0, 0, 0.16);
    }
    @media (max-width: 800px) {
        .snowui-sidebar-slot { --snowui-sidebar-slot-size: 0px; }
        :global(.snowui-sidebar[data-collapse-mode="hidden"]) {
            --snowui-sidebar-root-position: fixed;
            --snowui-sidebar-root-inset: 0 auto 0 0;
            --snowui-sidebar-root-z-index: 30;
            --snowui-sidebar-root-height: 100dvh;
            --snowui-sidebar-root-background: var(--background-1);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        :where(.snowui-sidebar-slot) { transition: none; }
    }

    :global(:where(.snowui-sidebar)) {
        --snowui-sidebar-width: 220px;
        /* Match the expanded icon axis: outer padding + item padding + half icon. */
        --snowui-sidebar-collapsed-width: calc(2 * var(--snowui-sidebar-padding-x-override, var(--snowui-sidebar-padding-x)) + 2 * var(--snowui-sidebar-item-padding-x-override, var(--padding-2)) + var(--size-4));
        --snowui-sidebar-padding-x: var(--padding-3);
        --snowui-sidebar-padding-y: var(--padding-4);
        --snowui-sidebar-gap: var(--gap-3);
        --snowui-sidebar-separator-padding-x: var(--padding-2);
        --snowui-sidebar-separator-padding-y: var(--padding-2);
        --snowui-frame-component-transform: var(--snowui-sidebar-root-transform, none);
        --snowui-frame-component-transition: var(--snowui-sidebar-root-transition, width var(--snowui-sidebar-width-motion-duration, 500ms) var(--snowui-sidebar-width-motion-easing, ease-out));
        position: var(--snowui-sidebar-root-position, relative);
        inset: var(--snowui-sidebar-root-inset, auto);
        z-index: var(--snowui-sidebar-root-z-index, auto);
        visibility: var(--snowui-sidebar-root-visibility, visible);
        pointer-events: var(--snowui-sidebar-root-pointer-events, auto);
        flex-shrink: var(--snowui-sidebar-root-flex-shrink, 1);
        display: flex;
        width: var(--snowui-sidebar-width-override, var(--snowui-sidebar-width));
        height: var(--snowui-sidebar-root-height, 100%);
        min-height: 0;
        box-sizing: border-box;
        flex-direction: column;
        gap: var(--snowui-sidebar-gap-override, var(--snowui-sidebar-gap));
        padding: var(--snowui-sidebar-padding-y-override, var(--snowui-sidebar-padding-y))
            var(--snowui-sidebar-padding-x-override, var(--snowui-sidebar-padding-x));
        color: var(--black-100, #000);
        background: var(--snowui-sidebar-root-background, transparent);
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"])) {
        /* The toggle extends beyond the rail and must remain above page headers. */
        z-index: 30;
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
        visibility: var(--snowui-sidebar-floating-visibility, visible);
        pointer-events: var(--snowui-sidebar-floating-pointer-events, auto);
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
    :global(.snowui-sidebar[data-resizing="true"]) {
        --snowui-sidebar-root-transition: none;
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
            var(--snowui-sidebar-content-fade-duration, 0.15s)
            var(--snowui-sidebar-content-fade-easing, ease-out);
    }
    /* Collapsed logo and navigation items share the center of the same content width. */
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="icon"] .snowui-sidebar-header > [data-as="logo"])) {
        position: relative;
        min-width: 0;
        justify-content: flex-start;
        gap: 0;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="icon"] .snowui-sidebar-header > [data-as="logo"] > :not([data-as="logo-icon"]))) {
        position: absolute;
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
        position: relative;
        z-index: 2;
        visibility: var(--snowui-sidebar-toggle-host-visibility, visible);
        pointer-events: var(--snowui-sidebar-toggle-host-pointer-events, auto);
        display: inline-flex;
        width: var(--size-6);
        height: var(--size-6);
        flex: 0 0 var(--size-6);
        align-items: center;
        justify-content: center;
    }
    /* The collapsed rail reserves its header width for the logo; the toggle sits outside it. */
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="icon"] .snowui-sidebar-collapse-button-host)) {
        position: absolute;
        inset-inline-start: calc(100% + var(--gap-1));
        top: 50%;
        transform: translateY(-50%);
    }
    :global(:where(.snowui-sidebar[data-collapsed="false"] .snowui-sidebar-collapse-button-host)) {
        margin-right: var(--padding-1);
    }
    :global(:where(.snowui-sidebar-collapse-button)) {
        flex: 0 0 auto;
        opacity: 0;
        --snowui-button-opacity-override: 0;
        pointer-events: none;
        --snowui-frame-component-transition: opacity var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar[data-toggle-visible="true"], .snowui-sidebar-floating-toggle[data-toggle-visible="true"]) .snowui-sidebar-collapse-button),
    :global(:where(.snowui-sidebar-floating-toggle[data-collapse-mode="hidden"]) .snowui-sidebar-collapse-button),
    :global(:where(.snowui-sidebar-collapse-button:focus-visible)) {
        opacity: 1;
        --snowui-button-opacity-override: 1;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-collapse-button-host)) {
        margin-inline: auto;
    }
    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-sidebar-collapse-button)) { --snowui-frame-component-transition: none; }
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
    /* Keep the track outside fixed regions, regardless of ScrollArea style injection order. */
    :global(.snowui-sidebar-body > :where(.snowui-scroll-area-scrollbar[data-axis="vertical"])) {
        top: calc(var(--snowui-sidebar-header-region-height) + var(--snowui-scrollbar-edge-gap));
        bottom: var(--snowui-scrollbar-edge-gap);
        right: calc(
            var(--snowui-scrollbar-edge-gap) -
                var(
                    --snowui-sidebar-padding-x-override,
                    var(--snowui-sidebar-padding-x)
                )
        );
    }
    :global(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-body > :where(.snowui-scroll-area-scrollbar[data-axis="vertical"])) {
        bottom: calc(var(--snowui-sidebar-footer-measured-height, 0px) + var(--snowui-scrollbar-edge-gap));
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
        /* 组合内边距是布局下限，不能被后注入的 Separator 基础 height 覆盖。 */
        min-height: calc(
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
    :global(:where(.snowui-sidebar-footer > [data-as="footer"][data-single-line="true"])) {
        column-gap: max(4px, var(--snowui-sidebar-footer-gap-override, var(--gap-2)));
    }
    :global(:where(.snowui-sidebar-footer:not([data-has-footer="true"]))) {
        display: none;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"] .snowui-sidebar-footer)) {
        opacity: 0;
        pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
        :global(.snowui-sidebar) {
            --snowui-sidebar-content-fade-duration: 0s !important;
        }
        :global(.snowui-sidebar .snowui-sidebar-section),
        :global(.snowui-sidebar .snowui-sidebar-section-header),
        :global(.snowui-sidebar .snowui-sidebar-item-content),
        :global(:where(.snowui-sidebar)),
        :global(:where(.snowui-sidebar-header > [data-as="logo"] > :not([data-as="logo-icon"]))),
        :global(:where(.snowui-sidebar-footer)) {
            transition: none;
        }
    }
</style>
