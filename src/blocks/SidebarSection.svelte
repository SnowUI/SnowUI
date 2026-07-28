<!-- SidebarSection PRO Block v1.0.0. 文档: ./SidebarSection.md -->
<script lang="ts">
    import { untrack, type Snippet } from "svelte";
    import { Button, Text, Tooltip, type FrameProps } from "@snowui-design-system/components";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import FramePro from "../components/FramePro.svelte";
    import { getSidebarContext, type SidebarActionData } from "./sidebar-context.svelte";

    interface Props extends Omit<FrameProps, "children" | "id"> {
        id: string;
        title?: string;
        collapsible?: boolean;
        collapsed?: boolean;
        defaultCollapsed?: boolean;
        onCollapsedChange?: (collapsed: boolean) => void;
        actions?: SidebarActionData[] | Snippet;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        [key: string]: any;
    }

    let {
        id,
        title = undefined,
        collapsible = undefined,
        collapsed = $bindable<boolean | undefined>(undefined),
        defaultCollapsed = false,
        onCollapsedChange = undefined,
        actions = [],
        children,
        parts = undefined,
        class: userClass = "",
        ...rest
    }: Props = $props();

    const sidebar = getSidebarContext();
    let internalCollapsed = $state(untrack(() => defaultCollapsed));
    const isCollapsed = $derived(collapsed ?? internalCollapsed);
    const canCollapse = $derived(collapsible ?? !!title);
    const contentId = $derived(`snowui-sidebar-section-${id}-content`);
    const actionList = $derived(Array.isArray(actions) ? actions : []);
    const actionsSnippet = $derived(typeof actions === "function" ? actions : undefined);

    function toggle() {
        if (!canCollapse) return;
        const next = !isCollapsed;
        internalCollapsed = next;
        collapsed = next;
        onCollapsedChange?.(next);
    }
</script>

<FramePro
    tag="section"
    column
    enableAutoLayout={false}
    class={["snowui-sidebar-section", userClass].filter(Boolean).join(" ")}
    data-collapsed={isCollapsed ? "true" : "false"}
    data-sidebar-collapsed={sidebar?.collapsed ? "true" : "false"}
    {...rest}
>
    {#if title && !sidebar?.collapsed}
        <div class="snowui-sidebar-section-header">
            {#if canCollapse}
                <Button
                    bare
                    size="sm"
                    class="snowui-sidebar-section-toggle"
                    aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
                    aria-expanded={!isCollapsed}
                    aria-controls={contentId}
                    onclick={toggle}
                >
                    <Text class="snowui-sidebar-section-title">{title}</Text>
                    <span class="snowui-sidebar-section-toggle-icon">
                        <ResourceIcon name="arrow-line-down" collection="snowui" size={12} aria-hidden="true" />
                    </span>
                    <Tooltip as="tooltip">{isCollapsed ? `Expand ${title}` : `Collapse ${title}`}</Tooltip>
                </Button>
            {:else}
                <Text class="snowui-sidebar-section-title snowui-sidebar-section-static-title">
                    {title}
                </Text>
            {/if}
            {#if actionsSnippet || actionList.length}
                <div class="snowui-sidebar-section-actions">
                    {#if actionsSnippet}
                        {@render actionsSnippet()}
                    {:else}
                        {#each actionList as action (action.id)}
                            <Button
                                {...parts?.Button}
                                bare
                                size="sm"
                                disabled={action.disabled}
                                aria-label={action.label}
                                onclick={() => action.onSelect?.(id)}
                            >
                                <ResourceIcon name={action.icon} collection={action.iconCollection} size={12} aria-hidden="true" />
                                <Tooltip as="tooltip">{action.label}</Tooltip>
                            </Button>
                        {/each}
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
    <div
        id={contentId}
        class="snowui-sidebar-section-content"
        aria-hidden={isCollapsed ? "true" : undefined}
    >
        {#if !isCollapsed}{@render children?.()}{/if}
    </div>
</FramePro>

<style>
    :global(:where(.snowui-sidebar-section)) {
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        gap: var(--snowui-sidebar-section-gap-override, var(--gap-1));
    }
    :global(:where(.snowui-sidebar-section-header)) {
        display: flex;
        min-height: var(--size-6);
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-1);
    }
    :global(:where(.snowui-sidebar-section-title)) {
        font-size: var(--snowui-sidebar-section-title-font-size-override, var(--text-12));
        line-height: var(--snowui-sidebar-section-title-line-height-override, var(--leading-12));
        color: inherit;
    }
    :global(:where(.snowui-sidebar-section-static-title)) {
        color: var(--black-40, #0006);
    }
    :global(:where(.snowui-sidebar-section-toggle-icon)) {
        display: inline-flex;
        opacity: 0;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            transform var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-section-actions)) {
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-section:hover, .snowui-sidebar-section:focus-within) .snowui-sidebar-section-toggle-icon),
    :global(:where(.snowui-sidebar-section:hover, .snowui-sidebar-section:focus-within) .snowui-sidebar-section-actions) {
        opacity: 1;
    }
    :global(:where(.snowui-sidebar-section:hover, .snowui-sidebar-section:focus-within) .snowui-sidebar-section-actions) {
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar-section[data-collapsed="true"]) .snowui-sidebar-section-toggle-icon) {
        transform: rotate(-90deg);
    }
    :global(:where(.snowui-sidebar-section-actions)) {
        display: flex;
        align-items: center;
        gap: var(--gap-2);
    }
    :global(:where(.snowui-sidebar-section-content)) {
        display: flex;
        width: 100%;
        min-width: 0;
        flex-direction: column;
        gap: var(--snowui-sidebar-section-gap-override, var(--gap-1));
    }
    :global(:where(.snowui-sidebar-section[data-sidebar-collapsed="true"] .snowui-sidebar-section-content > :not(.snowui-sidebar-item):not(.snowui-sidebar-section):not(.snowui-separator))) {
        display: none;
    }
</style>
