<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 数据表格工具栏：内置搜索、批量操作、排序与筛选。文档: ./TableToolbar.md -->
<script lang="ts">
  // Shared capability: Frame.singleLine; contract: docs/standards/LayoutProtocol.md §4.6.

  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import CopyButton from "./CopyButton.svelte";
    import Separator from "./Separator.svelte";
    import Spinner from "./Spinner.svelte";
    import SearchInput from "./SearchInput.svelte";
    import Select from "./Select.svelte";
    import Listbox from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import Tooltip from "./Tooltip.svelte";
    import {useOverlayScrollbar} from "../lib/overlay-scrollbar.svelte";
    import { getTableContext, type TableSortDirection } from "../lib/table-context.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import { useLocale } from "../i18n/locale.svelte";

    export interface TableToolbarFilterOption {
        label: string;
        value: string | number | undefined;
    }

    export interface TableToolbarSortOption {
        columnId: string;
        label?: string;
    }

    interface Props extends Omit<FrameProps, "children"> {
        ariaLabel?: string;
        search?: boolean;
        bulkActionsEnabled?: boolean;
        sort?: boolean;
        /** 自定义排序字段；未指定时读取表头，显式列表替换自动列表。 */
        sortOptions?: TableToolbarSortOption[];
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
        ariaLabel = undefined,
        search = true,
        bulkActionsEnabled = true,
        sort = true,
        sortOptions = undefined,
        filter = true,
        searchPlaceholder = undefined,
        searchAriaLabel = undefined,
        sortLabel = undefined,
        filterLabel = undefined,
        filterKey = undefined,
        filterOptions = [],
        selectedCount = undefined,
        showClearAction = true,
        showCopyAction = true,
        showDeleteAction = true,
        clearLabel = undefined,
        copyLabel = undefined,
        deleteLabel = undefined,
        selectionLabel = undefined,
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

    const locale = useLocale();
    const resolvedAriaLabel = $derived(ariaLabel ?? locale.t("tableToolbar.name"));
    const resolvedSearchPlaceholder = $derived(searchPlaceholder ?? locale.t("tableToolbar.search"));
    const resolvedSearchAriaLabel = $derived(searchAriaLabel ?? locale.t("tableToolbar.search"));
    const resolvedSortLabel = $derived(sortLabel ?? locale.t("tableToolbar.sort"));
    const resolvedFilterLabel = $derived(filterLabel ?? locale.t("tableToolbar.filter"));
    const resolvedClearLabel = $derived(clearLabel ?? locale.t("tableToolbar.clear"));
    const resolvedCopyLabel = $derived(copyLabel ?? locale.t("tableToolbar.copy"));
    const resolvedDeleteLabel = $derived(deleteLabel ?? locale.t("tableToolbar.delete"));
    const resolvedDeletingLabel = $derived(deleteLabel === undefined ? locale.t("tableToolbar.deleting") : `${deleteLabel}…`);
    const resolvedSelectionLabel = $derived(selectionLabel ?? ((count: number) => locale.t("tableToolbar.selected", { count })));
    const table = getTableContext();
    type DefaultBulkAction = "copy" | "delete";
    let pendingAction = $state<DefaultBulkAction | undefined>();
    const query = $derived(table.getQuery());
    const sortValue = $derived.by(() => {
        const current = table.getSort();
        return current ? `${current.columnId}:${current.direction}` : "default";
    });

    function resolveInitialFilterValue() {
        return filterKey && table.getFilters()[filterKey] !== undefined
            ? String(table.getFilters()[filterKey])
            : "default";
    }

    const filterValue = $derived(resolveInitialFilterValue());

    const resolvedSelectedCount = $derived(
        selectedCount ?? table.getSelectedRowIds().length,
    );
    const hasSelection = $derived(resolvedSelectedCount > 0);
    const columns = $derived(sortOptions ?? table.getColumns().filter((column) =>
        column.columnId && column.sortable && !column.role,
    ));
    const hasBulkItems = $derived(showCopyAction || showDeleteAction || bulkActions !== undefined);
    const builtInBareEmphasis = $derived(parts?.Button?.emphasis ?? "muted");
    const pickerParts = $derived({
        Button: {
            ...parts?.Button,
            emphasis: builtInBareEmphasis,
            singleLine: true,
        },
    });

    let toolbarElement = $state<HTMLElement>();
    let toolbarTrackElement = $state<HTMLElement>();
    const toolbarScrollbar = useOverlayScrollbar(() => toolbarElement, () => toolbarTrackElement, "horizontal");
    function syncToolbarThumb(node: HTMLElement) {
        $effect(() => {
            node.style.width = `${toolbarScrollbar.thumbSize}px`;
            node.style.transform = `translate3d(${toolbarScrollbar.thumbOffset}px,0,0)`;
        });
    }

    function setQuery(value: string) {
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

<Frame bind:element={toolbarElement} tag="div" role="toolbar" aria-label={resolvedAriaLabel}
    class={`snowui-table-toolbar snowui-rounded-rectangle snowui-overlay-scrollbar-host snowui-overlay-scrollbar-viewport ${userClass}`} data-bulk-pending={pendingAction}
    data-horizontal-track-position="self" data-horizontal-overflow={toolbarScrollbar.hasOverflow ? "true" : undefined}
    aria-busy={pendingAction !== undefined ? "true" : undefined} singleLine gap={2}
    enableResponsive={enableResponsive} enableContext={enableContext}
    enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {#if search}
        <SearchInput class="snowui-table-toolbar-built-in snowui-table-toolbar-search"
            as="search" variant="borderless" value={query} placeholder={resolvedSearchPlaceholder}
            aria-label={resolvedSearchAriaLabel} oninput={(event: Event & { currentTarget: HTMLInputElement }) => setQuery(event.currentTarget.value)} />
    {/if}

    {#if bulkActionsEnabled && hasSelection}
        <span class="snowui-table-toolbar-built-in snowui-table-toolbar-bulk" data-as="bulk">
            <span class="snowui-table-toolbar-selection" aria-live="polite">{resolvedSelectionLabel(resolvedSelectedCount)}</span>
            {#if showClearAction}<Button bare emphasis={builtInBareEmphasis} disabled={pendingAction !== undefined} onclick={() => onClearSelection ? onClearSelection(resolvedSelectedCount) : table.clearSelection()}>{resolvedClearLabel}</Button>{/if}
            {#if showClearAction && hasBulkItems}<Separator column length={12} />{/if}
            {#if showCopyAction}
                <span class="snowui-table-toolbar-bulk-action" data-pending={pendingAction === "copy" ? "true" : undefined}>
                    <CopyButton bare showText={false} emphasis={builtInBareEmphasis}
                        ariaLabel={resolvedCopyLabel} disabled={pendingAction === "delete"}
                        writeText={() => runDefaultBulkAction("copy")}>
                        {#snippet icon()}
                            <ComponentIcon name="copy" aria-hidden="true" />
                            <Tooltip as="tooltip">{resolvedCopyLabel}</Tooltip>
                        {/snippet}
                    </CopyButton>
                </span>
            {/if}
            {#if showDeleteAction}
                <span class="snowui-table-toolbar-bulk-action" data-pending={pendingAction === "delete" ? "true" : undefined}>
                    {#if pendingAction === "delete"}
                        <Spinner size={12} aria-label={resolvedDeletingLabel} />
                    {/if}
                        <Button class="snowui-table-toolbar-delete-button" data-pending={pendingAction === "delete" ? "true" : undefined} bare emphasis={builtInBareEmphasis} aria-label={resolvedDeleteLabel} disabled={pendingAction !== undefined} onclick={() => void runDefaultBulkAction("delete")}>
                            <ComponentIcon name="trash" aria-hidden="true" />
                            <Tooltip as="tooltip">{resolvedDeleteLabel}</Tooltip>
                        </Button>
                </span>
            {/if}
            {#if bulkActions}<span class="snowui-table-toolbar-extra-bulk-actions" inert={pendingAction !== undefined}><ComponentPartsBoundary>{@render bulkActions(resolvedSelectedCount)}</ComponentPartsBoundary></span>{/if}
        </span>
        {#if sort || filter || children}<Separator class="snowui-table-toolbar-built-in snowui-table-toolbar-resident-separator" column length={12} />{/if}
    {/if}

    {#if sort}
        <Select class="snowui-table-toolbar-built-in snowui-table-toolbar-picker" as="sort"
            bind:value={() => sortValue, setSort} buttonTrigger buttonBare ariaLabel={resolvedSortLabel} parts={pickerParts}>
            {#snippet triggerContent()}
                <ComponentIcon name="arrows-down-up" aria-hidden="true" />
                <Tooltip as="tooltip">{resolvedSortLabel}</Tooltip>
            {/snippet}
            <Listbox matchTriggerWidth={false} placementMode="bottom" align="end">
                <MenuItem as="item" value="default">{locale.t("tableToolbar.defaultSort")}</MenuItem>
                {#each columns as column (column.columnId)}
                    <MenuItem as="item" value={`${column.columnId}:ascending`}>{column.label ?? column.columnId} · {locale.t("tableToolbar.ascending")}</MenuItem>
                    <MenuItem as="item" value={`${column.columnId}:descending`}>{column.label ?? column.columnId} · {locale.t("tableToolbar.descending")}</MenuItem>
                {/each}
            </Listbox>
        </Select>
    {/if}

    {#if filter}
        <Select class="snowui-table-toolbar-built-in snowui-table-toolbar-picker" as="filter"
            bind:value={() => filterValue, setFilter} buttonTrigger buttonBare ariaLabel={resolvedFilterLabel} parts={pickerParts}
            data-placeholder-visible={filterValue === "default" ? "true" : undefined}>
            {#snippet triggerContent()}
                <ComponentIcon name="funnel-simple" aria-hidden="true" />
                <Tooltip as="tooltip">{resolvedFilterLabel}</Tooltip>
            {/snippet}
            <Listbox matchTriggerWidth={false} placementMode="bottom" align="end">
                <MenuItem as="item" value="default">{locale.t("tableToolbar.defaultFilter")}</MenuItem>
                {#each filterOptions as option (String(option.value))}
                    <MenuItem as="item" value={String(option.value)}>{option.label}</MenuItem>
                {/each}
            </Listbox>
        </Select>
    {/if}

    {#if children}<ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>{/if}
    <div bind:this={toolbarTrackElement} class="snowui-table-toolbar-built-in snowui-table-toolbar-scrollbar snowui-overlay-scrollbar" data-axis="horizontal" data-visible={toolbarScrollbar.hasOverflow ? "true" : "false"} style={`--snowui-overlay-scrollbar-scroll-offset:${toolbarScrollbar.scrollOffset}px`} aria-hidden="true">
        <div class="snowui-overlay-scrollbar-thumb" use:syncToolbarThumb></div>
    </div>
</Frame>

<style>
    :global(:where(.snowui-table-toolbar)) { box-sizing:border-box; width:100%; min-width:0; height:calc(var(--size-10,2.5rem) + var(--snowui-overlay-scrollbar-layout-space,0px)); position:relative; padding:var(--snowui-table-toolbar-padding-override,var(--padding-1,.25rem) var(--padding-3,.75rem)); overflow-x:auto; overflow-y:hidden; border:0; border-radius:var(--snowui-table-toolbar-radius-override,var(--radius-3,.75rem)); background:var(--snowui-table-toolbar-background-override,var(--black-4,#0000000a)); }
    :global(:where(.snowui-table-toolbar > :not(.snowui-table-toolbar-scrollbar))) { margin-block-end:var(--snowui-overlay-scrollbar-layout-space,0px); }
    :global(:where(.snowui-table-toolbar-scrollbar)) { z-index:1; }
    :global(.snowui-table-toolbar > [data-as="search"]),
    :global(.snowui-table-toolbar > .snowui-input-error-layout:has(> [data-as="search"])) { order:0; flex:1 1 0; min-width:0; margin-inline-end:auto; }
    :global(:where(.snowui-table-toolbar-bulk)) { order:1; display:inline-flex; align-items:center; gap:max(4px,var(--gap-2)); flex:0 0 auto; }
    :global(:where(.snowui-table-toolbar-resident-separator)) { order:2; }
    :global(:where(.snowui-table-toolbar-picker)), :global(:where(.snowui-table-toolbar)>:not(.snowui-table-toolbar-built-in):not([data-as="search"]):not([data-as="bulk"])) { order:3; flex:0 0 auto; }
    :global(:where(.snowui-table-toolbar-selection)) { color:var(--black-60,#0009); font-size:var(--text-12); line-height:var(--leading-12); white-space:nowrap; }
    :global(:where(.snowui-table-toolbar-bulk-action)) { display:inline-flex; align-items:center; justify-content:center; }
    :global(:where(.snowui-table-toolbar-delete-button[data-pending="true"])) { display:none; }
    :global(:where(.snowui-table-toolbar-picker)) { overflow:visible; }
    :global(.snowui-table-toolbar > .snowui-table-toolbar-picker) { margin-inline-start:auto; }
    :global(.snowui-table-toolbar > .snowui-table-toolbar-picker ~ .snowui-table-toolbar-picker) { margin-inline-start:0; }
    :global(:where(.snowui-table-toolbar-picker[data-as="filter"]:not([data-placeholder-visible="true"]))) { color:var(--black-100,#000); }
    :global(:where(.snowui-table-toolbar):has(>[data-as="search"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-search),
    :global(:where(.snowui-table-toolbar):has(>[data-as="bulk"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-bulk),
    :global(:where(.snowui-table-toolbar):has(>[data-as="sort"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-picker[data-as="sort"]),
    :global(:where(.snowui-table-toolbar):has(>[data-as="filter"]:not(.snowui-table-toolbar-built-in))>.snowui-table-toolbar-picker[data-as="filter"]) { display:none; }
</style>
