<!-- 数据表格工具栏：内置搜索、批量操作、排序与筛选。文档: ./TableToolbar.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import Separator from "./Separator.svelte";
    import Spinner from "./Spinner.svelte";
    import SearchInput from "./SearchInput.svelte";
    import Select from "./Select.svelte";
    import Listbox from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import Tooltip from "./Tooltip.svelte";
    import { getTableContext, type TableSortDirection } from "../lib/table-context.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    export interface TableToolbarFilterOption {
        label: string;
        value: string | number | undefined;
    }

    interface Props extends Omit<FrameProps, "children"> {
        ariaLabel?: string;
        search?: boolean;
        bulkActionsEnabled?: boolean;
        sort?: boolean;
        filter?: boolean;
        searchPlaceholder?: string;
        searchAriaLabel?: string;
        sortLabel?: string;
        filterLabel?: string;
        filterKey?: string;
        filterOptions?: TableToolbarFilterOption[];
        selectedCount?: number;
        showClearAction?: boolean;
        showCopyAction?: boolean;
        showDeleteAction?: boolean;
        clearLabel?: string;
        copyLabel?: string;
        deleteLabel?: string;
        selectionLabel?: (count: number) => string;
        onClearSelection?: (count: number) => void;
        onCopy?: (count: number) => void | Promise<void>;
        onDelete?: (count: number) => void | Promise<void>;
        bulkActions?: Snippet<[number]>;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Button: typeof Button;
            Separator: typeof Separator;
            Spinner: typeof Spinner;
            SearchInput: typeof SearchInput;
            Select: typeof Select;
            Listbox: typeof Listbox;
            MenuItem: typeof MenuItem;
        }>;
        [key: string]: any;
    }

    let {
        ariaLabel = "表格工具栏",
        search = true,
        bulkActionsEnabled = true,
        sort = true,
        filter = true,
        searchPlaceholder = "搜索",
        searchAriaLabel = "搜索",
        sortLabel = "排序",
        filterLabel = "筛选",
        filterKey = undefined,
        filterOptions = [],
        selectedCount = undefined,
        showClearAction = true,
        showCopyAction = true,
        showDeleteAction = true,
        clearLabel = "清除",
        copyLabel = "复制",
        deleteLabel = "删除",
        selectionLabel = (count) => `已选择 ${count} 项`,
        onClearSelection,
        onCopy,
        onDelete,
        bulkActions,
        children,
        parts = undefined,
        class: userClass = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    const table = getTableContext();
    type DefaultBulkAction = "copy" | "delete";
    let pendingAction = $state<DefaultBulkAction | undefined>();
    const initialSort = table.getSort();
    let query = $state(table.getQuery());
    let sortValue = $state(initialSort ? `${initialSort.columnId}:${initialSort.direction}` : "default");

    function resolveInitialFilterValue() {
        return filterKey && table.getFilters()[filterKey] !== undefined
            ? String(table.getFilters()[filterKey])
            : "default";
    }

    let filterValue = $state(resolveInitialFilterValue());

    const resolvedSelectedCount = $derived(
        selectedCount ?? table.getSelectedRowIds().length,
    );
    const hasSelection = $derived(resolvedSelectedCount > 0);
    const columns = $derived(table.getColumns().filter((column) =>
        column.columnId && column.sortable && !column.role,
    ));
    const hasBulkItems = $derived(showCopyAction || showDeleteAction || bulkActions !== undefined);
    const builtInBareEmphasis = $derived(parts?.Button?.emphasis ?? "muted");
    const pickerParts = $derived({
        Button: {
            ...parts?.Button,
            emphasis: builtInBareEmphasis,
        },
    });

    $effect(() => setSort(sortValue));
    $effect(() => setFilter(filterValue));

    function setQuery(value: string) {
        query = value;
        table.setQuery(value);
    }

    function setSort(value: string | number | undefined) {
        const nextValue = String(value ?? "default");
        if (nextValue === "default") {
            const nextSort = table.getDefaultSort();
            const current = table.getSort();
            if (current?.columnId === nextSort?.columnId && current?.direction === nextSort?.direction) return;
            table.setSort(nextSort);
            return;
        }
        const splitAt = nextValue.lastIndexOf(":");
        const nextSort = {
            columnId: nextValue.slice(0, splitAt),
            direction: nextValue.slice(splitAt + 1) as TableSortDirection,
        };
        const current = table.getSort();
        if (current?.columnId === nextSort.columnId && current.direction === nextSort.direction) return;
        table.setSort(nextSort);
    }

    function setFilter(value: string | number | undefined) {
        const nextValue = String(value ?? "default");
        if (!filterKey) return;
        const current = table.getFilters();
        const option = filterOptions.find((item) => String(item.value) === nextValue);
        const expected = nextValue === "default" ? undefined : option?.value;
        if (current[filterKey] === expected) return;
        const next = { ...current };
        if (expected === undefined) delete next[filterKey];
        else next[filterKey] = expected;
        table.setFilters(next);
    }

    async function runDefaultBulkAction(action: DefaultBulkAction) {
        if (!hasSelection || pendingAction) return;
        pendingAction = action;
        try {
            await (action === "copy" ? onCopy : onDelete)?.(
                resolvedSelectedCount,
            );
        } finally {
            pendingAction = undefined;
        }
    }
</script>

<Frame tag="div" role="toolbar" aria-label={ariaLabel}
    class={`snowui-table-toolbar snowui-rounded-rectangle ${userClass}`} data-bulk-pending={pendingAction}
    aria-busy={pendingAction !== undefined ? "true" : undefined} row gap={2}
    enableResponsive={enableResponsive} enableContext={enableContext}
    enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {#if search}
        <SearchInput class="snowui-table-toolbar-built-in snowui-table-toolbar-search"
            as="search" variant="borderless" value={query} placeholder={searchPlaceholder}
            aria-label={searchAriaLabel} oninput={(event: Event & { currentTarget: HTMLInputElement }) => setQuery(event.currentTarget.value)} />
    {/if}

    {#if bulkActionsEnabled && hasSelection}
        <span class="snowui-table-toolbar-built-in snowui-table-toolbar-bulk" data-as="bulk">
            <span class="snowui-table-toolbar-selection" aria-live="polite">{selectionLabel(resolvedSelectedCount)}</span>
            {#if showClearAction}<Button bare emphasis={builtInBareEmphasis} disabled={pendingAction !== undefined} onclick={() => onClearSelection ? onClearSelection(resolvedSelectedCount) : table.clearSelection()}>{clearLabel}</Button>{/if}
            {#if showClearAction && hasBulkItems}<Separator column length={12} />{/if}
            {#if showCopyAction}
                <span class="snowui-table-toolbar-bulk-action" data-pending={pendingAction === "copy" ? "true" : undefined}>
                    {#if pendingAction === "copy"}
                        <Spinner size={12} aria-label={`${copyLabel}中`} />
                    {:else}
                        <Button bare emphasis={builtInBareEmphasis} aria-label={copyLabel} disabled={pendingAction !== undefined} onclick={() => void runDefaultBulkAction("copy")}>
                            <ComponentIcon name="copy" aria-hidden="true" />
                            <Tooltip as="tooltip">{copyLabel}</Tooltip>
                        </Button>
                    {/if}
                </span>
            {/if}
            {#if showDeleteAction}
                <span class="snowui-table-toolbar-bulk-action" data-pending={pendingAction === "delete" ? "true" : undefined}>
                    {#if pendingAction === "delete"}
                        <Spinner size={12} aria-label={`${deleteLabel}中`} />
                    {:else}
                        <Button bare emphasis={builtInBareEmphasis} aria-label={deleteLabel} disabled={pendingAction !== undefined} onclick={() => void runDefaultBulkAction("delete")}>
                            <ComponentIcon name="trash" aria-hidden="true" />
                            <Tooltip as="tooltip">{deleteLabel}</Tooltip>
                        </Button>
                    {/if}
                </span>
            {/if}
            {#if bulkActions}<span class="snowui-table-toolbar-extra-bulk-actions" inert={pendingAction !== undefined}>{@render bulkActions(resolvedSelectedCount)}</span>{/if}
        </span>
        {#if sort || filter || children}<Separator class="snowui-table-toolbar-built-in snowui-table-toolbar-resident-separator" column length={12} />{/if}
    {/if}

    {#if sort}
        <Select class="snowui-table-toolbar-built-in snowui-table-toolbar-picker" as="sort"
            bind:value={sortValue} buttonTrigger buttonBare ariaLabel={sortLabel} parts={pickerParts}>
            {#snippet triggerContent()}
                <ComponentIcon name="arrows-down-up" aria-hidden="true" />
                <Tooltip as="tooltip">{sortLabel}</Tooltip>
            {/snippet}
            <Listbox matchTriggerWidth={false} placementMode="bottom" align="end">
                <MenuItem as="item" value="default">默认排序</MenuItem>
                {#each columns as column (column.columnId)}
                    <MenuItem as="item" value={`${column.columnId}:ascending`}>{column.label ?? column.columnId} · 升序</MenuItem>
                    <MenuItem as="item" value={`${column.columnId}:descending`}>{column.label ?? column.columnId} · 降序</MenuItem>
                {/each}
            </Listbox>
        </Select>
    {/if}

    {#if filter}
        <Select class="snowui-table-toolbar-built-in snowui-table-toolbar-picker" as="filter"
            bind:value={filterValue} buttonTrigger buttonBare ariaLabel={filterLabel} parts={pickerParts}
            data-placeholder-visible={filterValue === "default" ? "true" : undefined}>
            {#snippet triggerContent()}
                <ComponentIcon name="funnel-simple" aria-hidden="true" />
                <Tooltip as="tooltip">{filterLabel}</Tooltip>
            {/snippet}
            <Listbox matchTriggerWidth={false} placementMode="bottom" align="end">
                <MenuItem as="item" value="default">默认筛选</MenuItem>
                {#each filterOptions as option (String(option.value))}
                    <MenuItem as="item" value={String(option.value)}>{option.label}</MenuItem>
                {/each}
            </Listbox>
        </Select>
    {/if}

    {#if children}{@render children()}{/if}
</Frame>

<style>
    :global(:where(.snowui-table-toolbar)) { box-sizing:border-box; display:flex; flex-flow:row nowrap; align-items:center; width:100%; min-width:0; height:var(--size-10,2.5rem); padding:var(--snowui-table-toolbar-padding-override,var(--padding-1,.25rem) var(--padding-3,.75rem)); overflow:hidden; border:0; border-radius:var(--snowui-table-toolbar-radius-override,var(--radius-3,.75rem)); background:var(--snowui-table-toolbar-background-override,var(--black-4,#0000000a)); }
    :global(:where(.snowui-table-toolbar-search)) { order:0; flex:1 1 0; min-width:0; }
    :global(:where(.snowui-table-toolbar-bulk)) { order:1; display:inline-flex; align-items:center; gap:var(--gap-2); flex:0 0 auto; }
    :global(:where(.snowui-table-toolbar-resident-separator)) { order:2; }
    :global(:where(.snowui-table-toolbar-picker)), :global(:where(.snowui-table-toolbar)>:not(.snowui-table-toolbar-built-in):not([data-as="search"]):not([data-as="bulk"])) { order:3; flex:0 0 auto; }
    :global(:where(.snowui-table-toolbar-selection)) { color:var(--black-60,#0009); font-size:var(--text-12); line-height:var(--leading-12); white-space:nowrap; }
    :global(:where(.snowui-table-toolbar-bulk-action)) { display:inline-flex; align-items:center; justify-content:center; }
    :global(:where(.snowui-table-toolbar-picker)) { overflow:visible; }
    :global(:where(.snowui-table-toolbar-picker[data-as="filter"]:not([data-placeholder-visible="true"]))) { color:var(--black-100,#000); }
    :global(:where(.snowui-table-toolbar):has(>[data-as="search"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-search),
    :global(:where(.snowui-table-toolbar):has(>[data-as="bulk"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-bulk),
    :global(:where(.snowui-table-toolbar):has(>[data-as="sort"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-picker[data-as="sort"]),
    :global(:where(.snowui-table-toolbar):has(>[data-as="filter"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-picker[data-as="filter"]) { display:none; }
</style>
