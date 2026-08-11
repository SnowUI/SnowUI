<!-- SidebarSection PRO Block v1.3.0. 文档: ./SidebarSection.md -->
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
    const persistedCollapsed = $derived(sidebar?.getSectionCollapsed(id));
    const isCollapsed = $derived(
        collapsed ?? persistedCollapsed ?? internalCollapsed,
    );
    const canCollapse = $derived(collapsible ?? !!title);
    const contentId = $derived(`snowui-sidebar-section-${id}-content`);
    const actionList = $derived(Array.isArray(actions) ? actions : []);
    const actionsSnippet = $derived(typeof actions === "function" ? actions : undefined);

    function toggle() {
        if (!canCollapse) return;
        const next = !isCollapsed;
        internalCollapsed = next;
        collapsed = next;
        sidebar?.setSectionCollapsed(id, next);
        onCollapsedChange?.(next);
    }
</script>

<FramePro
    tag="section"
    column
    enableAutoLayout={false}
    class={["snowui-sidebar-section", userClass].filter(Boolean).join(" ")}
    data-sidebar-section-id={id}
    data-collapsed={isCollapsed ? "true" : "false"}
    data-sidebar-collapsed={sidebar?.collapsed ? "true" : "false"}
    {...rest}
>
    {#if title}
        <div
            class="snowui-sidebar-section-header"
            aria-hidden={sidebar?.collapsed ? "true" : undefined}
            inert={sidebar?.collapsed ? true : undefined}
        >
            {#if canCollapse}
                <Button
                    bare
                    emphasis={parts?.Button?.emphasis ?? "muted"}
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
                                iconOnly
                                emphasis={parts?.Button?.emphasis ?? "muted"}
                                size="sm"
                                disabled={action.disabled}
                                aria-label={action.label}
                                onclick={() => action.onSelect?.(id)}
                            >
                                <ResourceIcon name={action.icon} collection={action.iconCollection} size={12} aria-hidden="true" />
                                <Tooltip as="tooltip" position="right">{action.label}</Tooltip>
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
        transition: gap var(--snowui-frame-size-motion-duration, 0.25s)
            var(--snowui-frame-size-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-section-header)) {
        display: flex;
        max-height: var(--size-6);
        min-height: var(--size-6);
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-1);
        padding: var(
                --snowui-sidebar-section-title-padding-y-override,
                var(--padding-1)
            )
            var(
                --snowui-sidebar-section-title-padding-x-override,
                var(--padding-2)
            );
        overflow: hidden;
        opacity: 1;
        visibility: visible;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            max-height var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out),
            min-height var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out),
            padding-block var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out),
            visibility 0s linear;
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
    :global(:where(.snowui-sidebar-section[data-sidebar-collapsed="true"])) {
        gap: 0;
        transition-delay: var(--snowui-frame-color-motion-duration, 0.15s);
    }
    :global(:where(.snowui-sidebar-section[data-sidebar-collapsed="true"] .snowui-sidebar-section-header)) {
        max-height: 0;
        min-height: 0;
        padding-block: 0;
        overflow: hidden;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            max-height var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out)
                var(--snowui-frame-color-motion-duration, 0.15s),
            min-height var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out)
                var(--snowui-frame-color-motion-duration, 0.15s),
            padding-block var(--snowui-frame-size-motion-duration, 0.25s)
                var(--snowui-frame-size-motion-easing, ease-out)
                var(--snowui-frame-color-motion-duration, 0.15s),
            visibility 0s linear
                var(--snowui-frame-color-motion-duration, 0.15s);
    }
</style>
