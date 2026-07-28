<!-- Sidebar PRO Block v1.4.1. 文档: ./Sidebar.md -->
<script lang="ts">
    import { onMount, setContext, tick, untrack, type Snippet } from "svelte";
    import {
        Button,
        Indicator,
        ScrollArea,
        SnowUILogo,
        type FrameProps,
    } from "@snowui-design-system/components";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import {
        SIDE_PANEL_APPEAR_MOTION,
        SIDE_PANEL_DISAPPEAR_MOTION,
    } from "@snowui-design-system/components/motion/presets/effects";
    import { resolveMotionCssTiming } from "@snowui-design-system/components/motion/spring";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
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
        activeItemId?: string;
        ariaLabel?: string;
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
        activeItemId = undefined,
        ariaLabel = "Primary navigation",
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
    let rootElement = $state<HTMLElement>();
    let headerElement = $state<HTMLElement>();
    let bodyViewport = $state<HTMLElement>();
    let navigationElement = $state<HTMLElement>();
    let footerElement = $state<HTMLElement>();
    let hasExternalLogo = $state(false);
    let hasExternalFooter = $state(false);
    let resizing = $state(false);
    let footerMeasureFrame = 0;
    let resizeEndFrame = 0;
    let logoPlacementFrame = 0;
    const resolvedWidth = $derived(
        Math.min(Math.max(Number(width) || 220, minWidth), maxWidth),
    );
    const widthMotionTiming = $derived(
        isCollapsed ? sidebarCollapseTiming : sidebarExpandTiming,
    );
    const rootStyle = $derived(
        [
            `--snowui-sidebar-width: ${resolvedWidth}px`,
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
            return activeItemId;
        },
        select(itemId: string) {
            onActiveItemChange?.(itemId);
        },
    };
    setContext(SIDEBAR_CONTEXT_KEY, context);

    function toggleCollapsed() {
        const next = !isCollapsed;
        internalCollapsed = next;
        collapsed = next;
        onCollapsedChange?.(next);
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
            const collapseButton = headerElement?.querySelector<HTMLElement>(
                ':scope > .snowui-sidebar-collapse-button',
            );
            if (
                headerElement &&
                logo?.isConnected &&
                logo.nextElementSibling !== collapseButton
            ) {
                headerElement.insertBefore(logo, collapseButton ?? null);
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
        const nextHeight = `${footerHeight}px`;
        if (
            rootElement.style.getPropertyValue(
                "--snowui-sidebar-footer-measured-height",
            ) !== nextHeight
        ) {
            rootElement.style.setProperty(
                "--snowui-sidebar-footer-measured-height",
                nextHeight,
            );
        }
    }

    function scheduleFooterSafeAreaSync() {
        cancelAnimationFrame(footerMeasureFrame);
        footerMeasureFrame = requestAnimationFrame(syncFooterSafeArea);
    }

    function syncBodyScrollMask() {
        if (!bodyViewport) return;
        bodyViewport.classList.add("snowui-scroll-mask");
        if (bodyViewport.scrollTop > 1) {
            bodyViewport.dataset.scrollMask = "top";
        } else {
            bodyViewport.removeAttribute("data-scroll-mask");
        }
    }

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
        const resizeObserver = new ResizeObserver(() => {
            syncBodyScrollMask();
            syncFooterSafeArea();
        });
        if (navigationElement) observer.observe(navigationElement, { childList: true });
        if (headerElement) observer.observe(headerElement, { childList: true });
        if (footerElement) observer.observe(footerElement, { childList: true });
        if (bodyViewport) resizeObserver.observe(bodyViewport);
        if (navigationElement) resizeObserver.observe(navigationElement);
        if (footerElement) resizeObserver.observe(footerElement);
        scheduleFooterSafeAreaSync();
        return () => {
            cancelAnimationFrame(footerMeasureFrame);
            cancelAnimationFrame(resizeEndFrame);
            cancelAnimationFrame(logoPlacementFrame);
            observer.disconnect();
            resizeObserver.disconnect();
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
    data-navigation-variant={navigationVariant}
    data-resizing={resizing ? "true" : undefined}
    data-has-footer={hasExternalFooter ? "true" : undefined}
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
        <Button
            size="sm"
            class="snowui-sidebar-collapse-button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onclick={toggleCollapsed}
        >
            <ResourceIcon name="rightbar" collection="snowui" size={16} aria-hidden="true" />
        </Button>
    </header>

    <ScrollArea
        bind:viewport={bodyViewport}
        class="snowui-sidebar-body"
        ariaLabel={ariaLabel}
        onscroll={syncBodyScrollMask}
    >
        <nav bind:this={navigationElement} class="snowui-sidebar-navigation" aria-label={ariaLabel}>
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

    {#if !isCollapsed}
        <Indicator
            {...parts?.Indicator}
            target={rootElement}
            revealTarget={rootElement}
            axis="width"
            edge="end"
            pinOffset="var(--snowui-sidebar-resize-indicator-offset-override, var(--padding-1))"
            hitAreaPadding="var(--padding-1)"
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

<style>
    :global(:where(.snowui-sidebar)) {
        --snowui-sidebar-width: 220px;
        --snowui-sidebar-collapsed-width: 60px;
        --snowui-sidebar-padding-x: var(--padding-3);
        --snowui-sidebar-padding-y: var(--padding-4);
        --snowui-sidebar-gap: var(--gap-3);
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
    :global(:where(.snowui-sidebar[data-resizing="true"])) {
        transition: none;
    }
    :global(:where(.snowui-sidebar-header)) {
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
    :global(:where(.snowui-sidebar-navigation > [data-as="logo"])) {
        display: none;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"] .snowui-sidebar-navigation > :not(.snowui-sidebar-item):not(.snowui-sidebar-section):not(.snowui-separator):not([data-as="logo"]))) {
        display: none;
    }
    :global(:where(.snowui-sidebar-collapse-button)) {
        flex: 0 0 auto;
        visibility: hidden;
        pointer-events: none;
    }
    :global(:where(.snowui-sidebar:hover, .snowui-sidebar:focus-within) .snowui-sidebar-collapse-button) {
        visibility: visible;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar[data-collapsed="true"][data-navigation-variant="text"] .snowui-sidebar-collapse-button)) {
        margin-inline: auto;
        visibility: visible;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar-body)) {
        --snowui-scroll-mask-top-size-override: var(
            --snowui-sidebar-logo-scroll-mask-size-override,
            var(--padding-1)
        );
        --snowui-scroll-mask-top-solid-ratio-override: 0;
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
        display: flex;
        min-width: 0;
        box-sizing: border-box;
        flex-direction: column;
        gap: var(--snowui-sidebar-navigation-gap-override, var(--gap-1));
    }
    :global(:where(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-navigation)) {
        padding-bottom: calc(
            var(--snowui-sidebar-footer-measured-height, 0px) +
                var(--gap-3)
        );
    }
    :global(:where(.snowui-sidebar[data-has-footer="true"]:not([data-collapsed="true"]) .snowui-sidebar-body > .snowui-scroll-area-viewport)) {
        scroll-padding-bottom: calc(
            var(--snowui-sidebar-footer-measured-height, 0px) +
                var(--gap-3)
        );
    }
    :global(:where(.snowui-sidebar-footer)) {
        position: absolute;
        z-index: 1;
        display: flex;
        bottom: var(--snowui-sidebar-padding-y-override, var(--snowui-sidebar-padding-y));
        left: var(--snowui-sidebar-padding-x-override, var(--snowui-sidebar-padding-x));
        width: calc(
            var(--snowui-sidebar-width-override, var(--snowui-sidebar-width)) -
                var(
                    --snowui-sidebar-padding-x-override,
                    var(--snowui-sidebar-padding-x)
                ) -
                var(
                    --snowui-sidebar-padding-x-override,
                    var(--snowui-sidebar-padding-x)
                )
        );
        box-sizing: border-box;
        align-items: flex-start;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-footer-gap-override, var(--gap-2));
        padding: var(
                --snowui-sidebar-footer-padding-y-override,
                var(--padding-2)
            )
            var(
                --snowui-sidebar-footer-padding-x-override,
                var(--padding-2)
            );
        overflow: hidden;
        border-radius: var(
            --snowui-sidebar-footer-radius-override,
            var(--radius-3)
        );
        background: transparent;
        -webkit-backdrop-filter: blur(
            var(--snowui-sidebar-footer-background-blur-override, 20px)
        );
        backdrop-filter: blur(
            var(--snowui-sidebar-footer-background-blur-override, 20px)
        );
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
