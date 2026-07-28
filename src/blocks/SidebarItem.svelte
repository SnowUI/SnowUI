<!-- SidebarItem PRO Block v1.0.1. 文档: ./SidebarItem.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import {
        Badge,
        Button,
        Link,
        Tooltip,
        type FrameProps,
    } from "@snowui-design-system/components";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import FramePro from "../components/FramePro.svelte";
    import { getSidebarContext, type SidebarActionData } from "./sidebar-context.svelte";

    interface Props extends Omit<FrameProps, "children" | "id"> {
        id: string;
        label: string;
        icon?: string | Snippet;
        iconCollection?: string;
        href?: string;
        updated?: boolean;
        disabled?: boolean;
        actions?: SidebarActionData[] | Snippet;
        onSelect?: (id: string) => void;
        parts?: ComponentPartsOf<{ Badge: typeof Badge; Button: typeof Button }>;
        [key: string]: any;
    }

    let {
        id,
        label,
        icon = undefined,
        iconCollection = undefined,
        href = undefined,
        updated = false,
        disabled = false,
        actions = [],
        onSelect = undefined,
        parts = undefined,
        class: userClass = "",
        ...rest
    }: Props = $props();

    const sidebar = getSidebarContext();
    const collapsed = $derived(sidebar?.collapsed ?? false);
    const active = $derived(sidebar?.activeItemId === id);
    const iconSnippet = $derived(typeof icon === "function" ? icon : undefined);
    const iconName = $derived(typeof icon === "string" ? icon : undefined);
    const actionList = $derived(Array.isArray(actions) ? actions : []);
    const actionsSnippet = $derived(typeof actions === "function" ? actions : undefined);

    function select(event: MouseEvent) {
        if (disabled) {
            event.preventDefault();
            return;
        }
        onSelect?.(id);
        sidebar?.select(id);
    }

    function runAction(event: MouseEvent, action: SidebarActionData) {
        event.stopPropagation();
        action.onSelect?.(id);
    }
</script>

<FramePro
    tag="div"
    row
    enableAutoLayout={false}
    class={["snowui-sidebar-item", userClass].filter(Boolean).join(" ")}
    data-active={active ? "true" : "false"}
    data-collapsed={collapsed ? "true" : "false"}
    data-disabled={disabled ? "true" : undefined}
    {...rest}
>
    {#snippet mainContent()}
        {#if iconSnippet || iconName}
            <span data-as="leading" class="snowui-sidebar-item-leading" aria-hidden="true">
                {#if iconSnippet}
                    {@render iconSnippet()}
                {:else if iconName}
                    <ResourceIcon name={iconName} collection={iconCollection} size={20} />
                {/if}
                {#if updated && collapsed}
                    <Badge
                        {...parts?.Badge}
                        as="badge"
                        dot
                        class="snowui-sidebar-item-badge-collapsed"
                        aria-label="Updated"
                    />
                {/if}
            </span>
        {/if}
        {#if !collapsed}
            <span class="snowui-sidebar-item-content">
                <span class="snowui-sidebar-item-label">{label}</span>
                {#if updated}
                    <Badge
                        {...parts?.Badge}
                        as="badge"
                        dot
                        class="snowui-sidebar-item-badge"
                        aria-label="Updated"
                    />
                {/if}
            </span>
        {/if}
        {#if collapsed}<Tooltip as="tooltip" position="right">{label}</Tooltip>{/if}
    {/snippet}

    {#if href}
        <Link
            href={disabled ? undefined : href}
            disabled={disabled}
            hoverColor={false}
            style="--snowui-link-color: inherit;"
            row
            enableAutoLayout={true}
            contentFill
            wrap={false}
            class="snowui-sidebar-item-main"
            aria-label={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            onclick={select}
        >
            {@render mainContent()}
        </Link>
    {:else}
        <Button
            bare
            size="sm"
            disabled={disabled}
            row
            enableAutoLayout={true}
            contentFill
            wrap={false}
            class="snowui-sidebar-item-main"
            aria-label={collapsed ? label : undefined}
            aria-current={active ? "page" : undefined}
            onclick={select}
        >
            {@render mainContent()}
        </Button>
    {/if}

    {#if !collapsed && (actionsSnippet || actionList.length)}
        <div class="snowui-sidebar-item-actions">
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
                        onclick={(event: MouseEvent) => runAction(event, action)}
                    >
                        <ResourceIcon name={action.icon} collection={action.iconCollection} size={16} aria-hidden="true" />
                        <Tooltip as="tooltip">{action.label}</Tooltip>
                    </Button>
                {/each}
            {/if}
        </div>
    {/if}
</FramePro>

<style>
    :global(:where(.snowui-sidebar-item)) {
        position: relative;
        display: flex;
        width: 100%;
        min-width: 0;
        min-height: var(--size-9);
        align-items: center;
        border-radius: var(--snowui-sidebar-item-radius-override, var(--radius-3));
        color: var(--black-100, #000);
        --snowui-sidebar-item-content-opacity: 1;
    }
    :global(:where(.snowui-sidebar-item[data-disabled="true"])) { opacity: 0.2; }
    :global(:where(.snowui-sidebar-item-main)) {
        width: 100%;
        min-width: 0;
        min-height: var(--size-9);
        box-sizing: border-box;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-sidebar-item-gap-override, var(--gap-2));
        padding: var(--snowui-sidebar-item-padding-y-override, var(--padding-2))
            var(--snowui-sidebar-item-padding-x-override, var(--padding-2));
        border-radius: inherit;
        color: inherit;
        --snowui-button-opacity-override: 1;
        text-decoration: none;
    }
    :global(:where(.snowui-sidebar-item):not([data-disabled="true"]):hover),
    :global(:where(.snowui-sidebar-item[data-active="true"])) {
        background: var(--snowui-sidebar-item-background-override, var(--black-4, #0000000a));
    }
    :global(:where(.snowui-sidebar-item-leading)) {
        position: relative;
        display: inline-flex;
        width: var(--size-5);
        height: var(--size-5);
        flex: 0 0 var(--size-5);
        align-items: center;
        justify-content: center;
        opacity: var(--snowui-sidebar-item-content-opacity);
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-item-content)) {
        display: inline-flex;
        min-width: 0;
        align-items: center;
        gap: var(--snowui-sidebar-item-gap-override, var(--gap-2));
        opacity: var(--snowui-sidebar-item-content-opacity);
    }
    :global(:where(.snowui-sidebar-item-label)) {
        display: block;
        min-width: 0;
        overflow: hidden;
        font-size: var(--snowui-sidebar-item-font-size-override, var(--text-14));
        line-height: var(--snowui-sidebar-item-line-height-override, var(--leading-14));
        text-overflow: ellipsis;
        white-space: nowrap;
        color: inherit;
    }
    :global(:where(.snowui-sidebar-item-badge)) {
        flex: 0 0 auto;
        align-self: center;
    }
    :global(:where(.snowui-sidebar-item-badge-collapsed)) {
        position: absolute;
        top: -2px;
        right: -2px;
    }
    :global(:where(.snowui-sidebar-item-actions)) {
        position: absolute;
        right: var(--padding-2);
        display: flex;
        align-items: center;
        gap: var(--gap-1);
        opacity: 0;
        pointer-events: none;
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-sidebar-item:hover, .snowui-sidebar-item:focus-within) .snowui-sidebar-item-actions) {
        opacity: 1;
        pointer-events: auto;
    }
    :global(:where(.snowui-sidebar-item[data-collapsed="true"] .snowui-sidebar-item-main)) {
        justify-content: center;
        padding-inline: var(--padding-2);
    }
    :global(:where(.snowui-sidebar-item[data-collapsed="true"] .snowui-sidebar-item-leading)) {
        opacity: var(--snowui-sidebar-item-content-opacity);
    }
</style>
