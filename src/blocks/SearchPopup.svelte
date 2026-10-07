<!-- SearchPopup PRO Composite Block。文档: ./SearchPopup.md -->
<script module lang="ts">
    export type SearchPopupItem = { value: string; label: string; href: string; group?: string; disabled?: boolean };
</script>
<script lang="ts">
    import type { ComponentProps, Snippet } from "svelte";
    import { Dialog, Popover, SearchInput, MenuItem, Text } from "@snowui-design-system/components";
    import { ComponentIcon } from "@snowui-design-system/components/internal/component-icon";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import type { BackdropVariant } from "@snowui-design-system/components/lib/backdrop";
    interface Props extends Omit<ComponentProps<typeof Popover>, "children" | "title" | "value" | "parts"> {
        backdrop?: BackdropVariant | false;
        closeOnOutside?: boolean;
        value?: string | number;
        search?: boolean;
        title?: string;
        showGroupTitles?: boolean;
        items?: SearchPopupItem[];
        children?: Snippet;
        parts?: ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>;
    }
    let { backdrop = false, closeOnOutside = true, open = $bindable(true), onOpenChange, template = false, id, as, closeOnEscape = true, value = $bindable(''), search = true, title = undefined, showGroupTitles = true, items = [], children, parts = undefined, size = 'md', closeOn = 'manual', class: userClass = '', ...rest }: Props = $props();
    function handleOpenChange(next: boolean) {
        open = next;
        onOpenChange?.(next);
    }
</script>

{#snippet panel(modal: boolean)}
<Popover {...rest} {size} closeOn={modal ? "manual" : closeOn} closeOnSelect={modal ? false : rest.closeOnSelect} open={modal ? true : open} template={modal ? false : template} id={modal ? undefined : id} as={modal ? undefined : as} closeOnEscape={modal ? false : closeOnEscape} onOpenChange={modal ? undefined : handleOpenChange} class={`snowui-search-popup${userClass ? ` ${userClass}` : ''}`}>
    {#if search}
        <SearchInput {...parts?.SearchInput} as="content" showSearchIcon={false} bind:value class={`snowui-search-popup-input${parts?.SearchInput?.class ? ` ${parts.SearchInput.class}` : ''}`}><ComponentIcon as="leading" name="search" size={24} /></SearchInput>
    {/if}
    <div class="snowui-search-popup-results">
        {#if children}
            {@render children()}
        {:else}
            {#if title}<Text {...parts?.Text} as="group-title" class={parts?.Text?.class}>{title}</Text>{/if}
            {#each items as item, index (item.value)}
                {#if showGroupTitles && item.group && item.group !== items[index - 1]?.group}
                    <Text {...parts?.Text} as="group-title">{item.group}</Text>
                {/if}
                {#if item.href && !item.disabled}
                    <a href={item.href} data-dialog-close={modal ? "" : undefined} class="snowui-search-popup-link">
                        <MenuItem {...parts?.MenuItem} value={item.value} as="item">{item.label}</MenuItem>
                    </a>
                {:else}
                    <MenuItem {...parts?.MenuItem} value={item.value} disabled as="item">{item.label}</MenuItem>
                {/if}
            {/each}
        {/if}
    </div>
</Popover>
{/snippet}

{#if backdrop}
    <Dialog {id} {template} as={as === 'popover' ? 'dialog' : undefined} bind:open {onOpenChange} {size} {backdrop} {closeOnOutside} {closeOnEscape} showCloseButton={false} aria-label={rest['aria-label'] ?? parts?.SearchInput?.['aria-label']} class="snowui-search-popup-dialog">
        {@render panel(true)}
    </Dialog>
{:else}
    {@render panel(false)}
{/if}

<style>
    :global(:where(.snowui-search-popup-dialog)) {
        width: calc(var(--size-20) * 6);
        max-width: 100%;
        padding: var(--padding-0);
        gap: var(--gap-0);
    }
    :global(:where(.snowui-search-popup-dialog .snowui-search-popup)) { box-shadow: none; }

    :global(:where(.snowui-search-popup)) { width: calc(var(--size-20) * 6); max-width: 100%; }
    :global(:where(.snowui-search-popup-input)) {
        padding: var(--padding-1) var(--padding-2) var(--padding-4);
        border-radius: var(--radius-0);
        box-shadow: none;
        border-bottom: var(--border-1) solid var(--black-10, #0000001a);
        background: transparent;
        font-size: var(--text-18);
        line-height: var(--leading-18);
    }
    /* 输入与结果一起滚动，不使用 Popover 的固定搜索 header，避免其 4px 间距叠加。 */
    .snowui-search-popup-results {
        display: flex;
        flex-direction: column;
        gap: var(--gap-1);
        --snowui-search-popup-results-gap: var(--gap-3);
        padding-top: var(--snowui-search-popup-results-gap-override, var(--snowui-search-popup-results-gap));
    }
    :global(:where(.snowui-search-popup-results [data-as="group-title"])) {
        --snowui-search-popup-group-gap: var(--gap-2);
        margin-top: var(--snowui-search-popup-group-gap-override, var(--snowui-search-popup-group-gap));
        padding: var(--padding-0) var(--padding-2);
        color: var(--black-40, #00000066);
    }
    :global(:where(.snowui-search-popup-results > [data-as="group-title"]:first-child)) { margin-top: var(--gap-0); }
    :global(:where(.snowui-search-popup-results [data-as="item"])) { border-radius: var(--radius-3); }
    .snowui-search-popup-link { display: block; text-decoration: none; color: inherit; }
</style>
