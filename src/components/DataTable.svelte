<!-- PRO 数据表格状态与组合外壳。文档: ./DataTable.md -->
<script lang="ts">
    import { onDestroy, tick, type Snippet } from "svelte";
    import {
        provideTableContext,
        type TableColumnRegistration,
        type TableContext,
        type TableRoleLayout,
        type TableRoleOverlayBlurMode,
        type TableSortState,
    } from "@snowui-design-system/components/lib/table-context.svelte";
    import type { FrameProps } from "@snowui-design-system/components/logic/frame-types";
    import FramePro from "./FramePro.svelte";
    import {
        paginateDataTableRows,
        sortDataTableRows,
    } from "../lib/data-table";

    export type DataTableMode = "client" | "server";
    export interface DataTableLoadMoreRequest {
        offset: number;
        limit: number;
        signal: AbortSignal;
    }
    export type DataTableLoadMoreSource<T> = Iterable<T> | AsyncIterable<T>;
    export type DataTableLoadMore<T> = (
        request: DataTableLoadMoreRequest,
    ) => DataTableLoadMoreSource<T> | Promise<DataTableLoadMoreSource<T>>;
    export interface DataTableRenderState<T = unknown> {
        rows: T[];
        sourceRows: T[];
        query: string;
        sort?: TableSortState;
        page: number;
        pageSize: number;
        totalRows: number;
        totalPages: number;
        loading: boolean;
        refreshing: boolean;
        loadingMore: boolean;
        hasMore: boolean;
        loadMoreSize: number;
        filters: Record<string, unknown>;
        error?: unknown;
        getRowKey: (row: T, index: number) => string | number;
        loadMore: () => Promise<void>;
    }

    type Sorter<T> = (row: T) => unknown;
    type Searcher<T> = (row: T, query: string) => boolean;
    type Filterer<T> = (row: T, filters: Record<string, unknown>) => boolean;
    export type DataTableLoadMoreMode = "manual" | "auto";
    const LOAD_MORE_ROW_APPEAR_DURATION_MS = 2000;
    const LOAD_MORE_ROW_REVEAL_INTERVAL_MS = 20;
    const DEFAULT_LOAD_MORE_THRESHOLD_PX = 80;
    const DEFAULT_LOAD_MORE_THROTTLE_MS = 500;
    const EMPTY_SELECTION_STATE = {
        all: false,
        some: false,
        rowIds: [] as Array<string | number>,
    };
    export type DataTableVariant = "striped" | "divided";
    export interface DataTableActionItem {
        type?: "action";
        id: string;
        label: string;
        icon?: string | Snippet;
        disabled?: boolean;
        href?: string;
        onAction?: () => void;
    }
    export interface DataTableActionSeparatorItem {
        type: "separator";
        id: string;
    }
    export type DataTableActionsItem =
        | DataTableActionItem
        | DataTableActionSeparatorItem;
    export interface DataTableActionEvent<T> {
        row: T;
        rowId: string | number;
        actionId: string;
        item?: DataTableActionItem;
        state: DataTableRenderState<T>;
    }
    export interface DataTableActionsConfig<T> {
        items: (row: T, state: DataTableRenderState<T>) => DataTableActionsItem[];
        onAction?: (event: DataTableActionEvent<T>) => void;
        compact?: "auto" | "none";
        overflow?: "all" | "progressive";
        overflowFrom?: "start" | "end";
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        resizable?: boolean;
    }
    interface DataTableActionsContextExtension {
        getRowActions: (rowId: string | number) => DataTableActionsItem[];
        runRowAction: (event: {
            rowId: string | number;
            actionId: string;
            item?: DataTableActionItem;
        }) => void;
        getActionsCompact: () => "auto" | "none";
        getActionsOverflow: () => "all" | "progressive";
        getActionsOverflowFrom: () => "start" | "end";
        getActionsColumnWidth: () => number;
        getActionsMinWidth: () => number;
        getActionsMaxWidth: () => number;
        isActionsResizable: () => boolean;
    }
    interface Props<T = any> extends Omit<FrameProps, "children" | "variant"> {
        rows?: T[];
        mode?: DataTableMode;
        sorters?: Record<string, Sorter<T>>;
        searcher?: Searcher<T>;
        filterer?: Filterer<T>;
        rowKey?: (row: T, index: number) => string | number;
        sort?: TableSortState;
        defaultSort?: TableSortState;
        query?: string;
        filters?: Record<string, unknown>;
        page?: number;
        pageSize?: number;
        totalRows?: number;
        loading?: boolean;
        refreshing?: boolean;
        loadMore?: DataTableLoadMore<T>;
        loadMoreSize?: number;
        loadMoreMode?: DataTableLoadMoreMode;
        loadMoreThreshold?: number;
        loadMoreThrottleMs?: number;
        hasMore?: boolean;
        error?: unknown;
        resetPageOnQuery?: boolean;
        onSortChange?: (sort: TableSortState | undefined) => void;
        onQueryChange?: (query: string) => void;
        onPageChange?: (page: number) => void;
        onPageSizeChange?: (pageSize: number) => void;
        onStateChange?: (state: DataTableRenderState<T>) => void;
        state?: DataTableRenderState<T>;
        variant?: DataTableVariant;
        selectedRowIds?: Array<string | number>;
        /** 是否显示 checkbox 选择列，默认 false */
        selection?: boolean;
        /** 是否显示操作按钮列，默认 false */
        actions?: boolean | DataTableActionsConfig<T>;
        horizontalScroll?: boolean;
        roleLayout?: TableRoleLayout;
        roleOverlayLayers?: number;
        roleOverlayBlurMode?: TableRoleOverlayBlurMode;
        roleOverlayUniformFeather?: number;
        onRowPreview?: (row: T, state: DataTableRenderState<T>, event: MouseEvent) => void;
        onSelectedRowIdsChange?: (rowIds: Array<string | number>) => void;
        children?: Snippet<[DataTableRenderState<T>]>;
        [key: string]: any;
    }

    let {
        rows = [],
        mode = "client",
        sorters = {},
        searcher = undefined,
        filterer = undefined,
        rowKey = (_row, index) => index,
        defaultSort = undefined,
        sort = $bindable<TableSortState | undefined>(defaultSort),
        query = $bindable(""),
        filters = $bindable({}),
        page = $bindable(1),
        pageSize = $bindable(10),
        totalRows: totalRowsProp = undefined,
        loading = false,
        refreshing = false,
        loadMore: loadMoreSource = undefined,
        loadMoreSize = 5,
        loadMoreMode = "manual",
        loadMoreThreshold = DEFAULT_LOAD_MORE_THRESHOLD_PX,
        loadMoreThrottleMs = DEFAULT_LOAD_MORE_THROTTLE_MS,
        hasMore: hasMoreProp = undefined,
        error = undefined,
        resetPageOnQuery = true,
        onSortChange,
        onQueryChange,
        onPageChange,
        onPageSizeChange,
        onStateChange,
        state: boundState = $bindable(undefined),
        variant = "divided",
        selectedRowIds = $bindable([]),
        selection = false,
        actions = false,
        horizontalScroll = true,
        roleLayout = "auto",
        roleOverlayLayers = 4,
        roleOverlayBlurMode = "progressive",
        roleOverlayUniformFeather = 0.3,
        onRowPreview = undefined,
        onSelectedRowIdsChange,
        children,
        class: userClass = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    let appendedRows = $state<any[]>([]);
    // Registrations are removed by object identity; deep proxies would differ
    // from the original registration object and trigger Svelte's
    // state_proxy_equality_mismatch warning.
    let registeredColumns = $state.raw<TableColumnRegistration[]>([]);
    let registeredRowIds = $state<Array<string | number>>([]);
    const registeredRowIdSet = new Set<string | number>();
    let rowRegistrationCommitQueued = false;
    let loadingMore = $state(false);
    let showLoadingSpinner = $state(false);
    let inferredHasMore = $state(true);
    let loadMoreError = $state<unknown>();
    let appearingRowIds = $state<Set<string | number>>(new Set());
    let autoLoadSentinel = $state<HTMLElement>();
    let lastAutoLoadAt = 0;
    let loadMoreController: AbortController | undefined;
    const resolvedLoadMoreSize = $derived(
        Math.max(1, Math.floor(Number(loadMoreSize) || 5)),
    );
    const actionsConfig = $derived(
        typeof actions === "object" ? actions : undefined,
    );
    const actionsColumnWidth = $derived(
        actionsConfig
            ? Math.max(40, Number(actionsConfig.width) || 160)
            : 40,
    );
    function scheduleRowRegistrationCommit() {
        if (rowRegistrationCommitQueued) return;
        rowRegistrationCommitQueued = true;
        queueMicrotask(() => {
            rowRegistrationCommitQueued = false;
            registeredRowIds = Array.from(registeredRowIdSet);
        });
    }
    function updateSelectedRowIds(next: Array<string | number>) {
        selectedRowIds = next;
        onSelectedRowIdsChange?.(next);
    }
    const sourceRows = $derived(
        appendedRows.length === 0 ? rows : [...rows, ...appendedRows],
    );
    const resolvedLoadMoreThreshold = $derived(
        Math.max(0, Number(loadMoreThreshold) || 0),
    );
    const resolvedLoadMoreThrottleMs = $derived(
        Math.max(0, Number(loadMoreThrottleMs) || 0),
    );

    const resolvedSorter = $derived.by(() => {
        if (!sort) return undefined;
        const columnId = sort.columnId;
        if (sorters[columnId]) return sorters[columnId];
        return (row: any) => row?.[columnId];
    });
    function defaultSearch(row: any, normalized: string) {
        if (!normalized) return true;
        if (row == null || typeof row !== "object") {
            return String(row).toLocaleLowerCase().includes(normalized);
        }
        return Object.values(row).some((item) =>
            (typeof item === "string" || typeof item === "number")
            && String(item).toLocaleLowerCase().includes(normalized),
        );
    }
    function defaultFilter(row: any, entries: Array<[string, unknown]>) {
        return entries.every(([key, expected]) => {
            if (expected === undefined || expected === null || expected === "") return true;
            if (Array.isArray(expected)) return expected.includes(row?.[key]);
            return row?.[key] === expected;
        });
    }
    const normalizedQuery = $derived(query.trim().toLocaleLowerCase());
    const filterEntries = $derived(Object.entries(filters));
    const filteredRows = $derived.by(() => {
        if (mode !== "client") return sourceRows;
        if (!searcher && !filterer && !normalizedQuery && filterEntries.length === 0) {
            return sourceRows;
        }
        const runSearch = searcher
            ? (row: any) => searcher(row, query)
            : (row: any) => defaultSearch(row, normalizedQuery);
        const runFilter = filterer
            ? (row: any) => filterer(row, filters)
            : (row: any) => defaultFilter(row, filterEntries);
        // 搜索与筛选在同一轮完成，避免为中间结果再分配一次数组。
        return sourceRows.filter((row) => runSearch(row) && runFilter(row));
    });
    const sortedRows = $derived(
        mode === "client" && sort && resolvedSorter
            ? sortDataTableRows(filteredRows, sort, resolvedSorter)
            : filteredRows,
    );
    const resolvedPageSize = $derived(Math.max(1, Math.floor(Number(pageSize) || 10)));
    const clientPageState = $derived(paginateDataTableRows(sortedRows, page, resolvedPageSize));
    const resolvedTotalRows = $derived(
        mode === "client"
            ? clientPageState.totalRows
            : totalRowsProp === undefined
                ? sourceRows.length
                : Math.max(0, Number(totalRowsProp) || 0),
    );
    const totalPages = $derived(mode === "client" ? clientPageState.totalPages : Math.max(1, Math.ceil(resolvedTotalRows / resolvedPageSize)));
    const resolvedPage = $derived(mode === "client" ? clientPageState.page : Math.min(totalPages, Math.max(1, Math.floor(Number(page) || 1))));
    const visibleRows = $derived(mode === "client" ? clientPageState.rows : sourceRows);
    const selectedRowIdSet = $derived(new Set(selectedRowIds));
    const resolvedHasMore = $derived(
        hasMoreProp
        ?? (totalRowsProp === undefined
            ? inferredHasMore
            : sourceRows.length < resolvedTotalRows),
    );
    const renderState = $derived<DataTableRenderState<any>>({
        rows: visibleRows,
        sourceRows,
        query,
        sort,
        page: resolvedPage,
        pageSize: resolvedPageSize,
        totalRows: resolvedTotalRows,
        totalPages,
        loading,
        refreshing,
        loadingMore,
        hasMore: resolvedHasMore,
        loadMoreSize: resolvedLoadMoreSize,
        filters,
        error: error ?? loadMoreError,
        getRowKey: rowKey,
        loadMore: runLoadMore,
    });

    function waitForNextRow(signal: AbortSignal) {
        return new Promise<void>((resolve) => {
            const timer = window.setTimeout(resolve, LOAD_MORE_ROW_REVEAL_INTERVAL_MS);
            signal.addEventListener("abort", () => {
                window.clearTimeout(timer);
                resolve();
            }, { once: true });
        });
    }

    async function runLoadMore() {
        if (!loadMoreSource || loadingMore || !resolvedHasMore) return;
        const controller = new AbortController();
        loadMoreController?.abort();
        loadMoreController = controller;
        loadingMore = true;
        showLoadingSpinner = visibleRows.length > 0;
        loadMoreError = undefined;
        // 先让后代 Table 捕获并锁定当前自然列宽，再开始读取服务器数据。
        // 这样同步 Iterable 也不会抢在列宽锁定前提交第一条新行。
        await tick();
        const offset = sourceRows.length;
        let received = 0;
        try {
            const stream = await loadMoreSource({
                offset,
                limit: resolvedLoadMoreSize,
                signal: controller.signal,
            });
            for await (const row of stream) {
                if (controller.signal.aborted) break;
                const rowIndex = offset + received;
                const rowId = rowKey(row, rowIndex);
                // 第一条新行开始渐显时立即隐藏 Spinner；各行渐显彼此独立且可重叠。
                if (received === 0) showLoadingSpinner = false;
                appearingRowIds = new Set([...appearingRowIds, rowId]);
                appendedRows = [...appendedRows, row];
                received += 1;
                if (received >= resolvedLoadMoreSize) break;
                if (LOAD_MORE_ROW_REVEAL_INTERVAL_MS > 0) {
                    await waitForNextRow(controller.signal);
                }
            }
            if (!controller.signal.aborted && hasMoreProp === undefined && totalRowsProp === undefined) {
                inferredHasMore = received >= resolvedLoadMoreSize;
            }
        } catch (nextError) {
            if (!controller.signal.aborted) loadMoreError = nextError;
        } finally {
            if (loadMoreController === controller) loadMoreController = undefined;
            showLoadingSpinner = false;
            loadingMore = false;
        }
    }

    function findVerticalScrollRoot(node: HTMLElement): HTMLElement | null {
        let current = node.parentElement;
        while (current && current !== document.body && current !== document.documentElement) {
            const overflowY = window.getComputedStyle(current).overflowY;
            if (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }

    $effect(() => {
        const node = autoLoadSentinel;
        const enabled = loadMoreMode === "auto"
            && loadMoreSource !== undefined
            && resolvedHasMore
            && !loadingMore
            && error === undefined
            && loadMoreError === undefined;
        const throttleMs = resolvedLoadMoreThrottleMs;
        if (!node || !enabled) return;

        let pendingTimer: number | undefined;
        const clearPendingTimer = () => {
            if (pendingTimer === undefined) return;
            window.clearTimeout(pendingTimer);
            pendingTimer = undefined;
        };
        const triggerLoad = () => {
            clearPendingTimer();
            if (loadingMore || !resolvedHasMore) return;
            lastAutoLoadAt = Date.now();
            void runLoadMore();
        };
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) {
                    clearPendingTimer();
                    return;
                }
                const remainingThrottle = Math.max(
                    0,
                    throttleMs - (Date.now() - lastAutoLoadAt),
                );
                // 首次进入触发区预留完整确认窗口，后续仍按连续请求的剩余节流时间处理。
                // 首次触发不能绕过这段等待，否则滚动惯性
                // 尚未结束时插入 Spinner / 新行会扩展滚动高度，让页面继续带着表格缓动。
                // 离开触发区时上方分支会清除计时器；throttleMs=0 仍可显式关闭等待。
                const confirmationDelay = lastAutoLoadAt === 0
                    ? throttleMs
                    : remainingThrottle;
                if (confirmationDelay === 0) {
                    triggerLoad();
                    return;
                }
                if (pendingTimer === undefined) {
                    pendingTimer = window.setTimeout(triggerLoad, confirmationDelay);
                }
            },
            {
                root: findVerticalScrollRoot(node),
                rootMargin: "0px",
            },
        );
        observer.observe(node);
        return () => {
            clearPendingTimer();
            observer.disconnect();
        };
    });

    onDestroy(() => loadMoreController?.abort());

    let registeredDefaultSort = $state<TableSortState | undefined>();
    let registeredDefaultSortActive = $state(false);
    const resolvedDefaultSort = $derived(registeredDefaultSort ?? defaultSort);
    const resolvedDefaultSortActive = $derived(
        registeredDefaultSort ? registeredDefaultSortActive : false,
    );

    function registerDefaultSort(
        columnId: string,
        direction: "ascending" | "descending",
        active: boolean,
    ) {
        const next = { columnId, direction } as TableSortState;
        if (
            registeredDefaultSort
            && (registeredDefaultSort.columnId !== columnId || registeredDefaultSort.direction !== direction)
        ) {
            console.warn(
                `[SnowUI DataTable] 只能有一个 TableHead 声明 defaultSort；已保留 ${registeredDefaultSort.columnId}。`,
            );
            return () => {};
        }
        const shouldApply = sort === undefined
            || (defaultSort !== undefined
                && sort?.columnId === defaultSort.columnId
                && sort.direction === defaultSort.direction);
        registeredDefaultSort = next;
        registeredDefaultSortActive = active;
        if (shouldApply) sort = next;
        return () => {
            if (
                registeredDefaultSort?.columnId === columnId
                && registeredDefaultSort.direction === direction
            ) {
                registeredDefaultSort = undefined;
                registeredDefaultSortActive = false;
            }
        };
    }

    function toggleSort(columnId: string) {
        const isDefaultColumn = resolvedDefaultSort?.columnId === columnId;
        const defaultDirection = isDefaultColumn ? resolvedDefaultSort.direction : "ascending";
        const reverseDirection = defaultDirection === "ascending" ? "descending" : "ascending";
        if (!sort || sort.columnId !== columnId) sort = { columnId, direction: defaultDirection };
        else if (sort.direction === defaultDirection) sort = { columnId, direction: reverseDirection };
        else sort = (isDefaultColumn && !resolvedDefaultSortActive
            ? { columnId, direction: defaultDirection }
            : undefined) as TableSortState | undefined;
        page = 1;
        onSortChange?.(sort);
        onPageChange?.(page);
    }

    function findRowById(rowId: string | number) {
        for (let index = 0; index < visibleRows.length; index += 1) {
            const row = visibleRows[index];
            if (rowKey(row, index) === rowId) return row;
            if (row && typeof row === "object" && "id" in row && (row as any).id === rowId) {
                return row;
            }
        }
        return undefined;
    }

    const tableContext: Partial<TableContext> & DataTableActionsContextExtension = {
        isDataTable: () => true,
        getRoleLayout: () => roleLayout,
        getHorizontalScroll: () => horizontalScroll,
        getRoleOverlayLayers: () => roleOverlayLayers,
        getRoleOverlayBlurMode: () => roleOverlayBlurMode,
        getRoleOverlayUniformFeather: () => roleOverlayUniformFeather,
        isSelectionEnabled: () => selection,
        isActionsEnabled: () => actions !== false,
        getColumnWidth: (columnId) =>
            columnId === "__actions" ? actionsColumnWidth : undefined,
        getRowActions: (rowId: string | number) => {
            if (!actionsConfig) return [];
            const row = findRowById(rowId);
            return row === undefined
                ? []
                : actionsConfig.items(row, renderState as DataTableRenderState<any>);
        },
        runRowAction: ({ rowId, actionId, item }: {
            rowId: string | number;
            actionId: string;
            item?: DataTableActionItem;
        }) => {
            if (!actionsConfig?.onAction) return;
            const row = findRowById(rowId);
            if (row === undefined) return;
            actionsConfig.onAction({
                row,
                rowId,
                actionId,
                item,
                state: renderState as DataTableRenderState<any>,
            });
        },
        getActionsCompact: () => actionsConfig?.compact ?? "auto",
        getActionsOverflow: () => actionsConfig?.overflow ?? "all",
        getActionsOverflowFrom: () => actionsConfig?.overflowFrom ?? "end",
        getActionsColumnWidth: () => actionsColumnWidth,
        getActionsMinWidth: () => Math.max(40, Number(actionsConfig?.minWidth) || 40),
        getActionsMaxWidth: () => Math.max(
            actionsColumnWidth,
            Number(actionsConfig?.maxWidth) || 320,
        ),
        isActionsResizable: () => actionsConfig?.resizable === true,
        getVariant: () => variant,
        getLoading: () => loading && visibleRows.length === 0,
        getLoadingMore: () => loadingMore,
        getLoadingRowCount: () => resolvedPageSize,
        getLoadingSpinner: () => showLoadingSpinner || ((loading || refreshing) && visibleRows.length > 0),
        hasRowPreview: () => onRowPreview !== undefined,
        openRowPreview: (rowId, event) => {
            if (!onRowPreview) return;
            const row = findRowById(rowId);
            if (row === undefined) return;
            onRowPreview(row, renderState as DataTableRenderState<any>, event);
        },
        getRowAppearMotion: (rowId) => appearingRowIds.has(rowId)
            ? {
                opacity: [0, 1],
                duration: LOAD_MORE_ROW_APPEAR_DURATION_MS,
            }
            : undefined,
        getSort: () => sort,
        getDefaultSort: () => resolvedDefaultSort,
        getDefaultSortActive: () => resolvedDefaultSortActive,
        registerDefaultSort,
        isSortable: (columnId) => Boolean(sorters[columnId])
            || sourceRows.some((row: any) => row != null && typeof row === "object" && columnId in row),
        toggleSort,
        registerColumn: (column) => {
            registeredColumns = [...registeredColumns, column];
            return () => {
                registeredColumns = registeredColumns.filter((item) => item !== column);
            };
        },
        getColumns: () => registeredColumns,
        registerRow: (rowId) => {
            registeredRowIdSet.add(rowId);
            scheduleRowRegistrationCommit();
            return () => {
                registeredRowIdSet.delete(rowId);
                scheduleRowRegistrationCommit();
            };
        },
        isRowSelected: (rowId) => selection && selectedRowIdSet.has(rowId),
        setRowSelected: (rowId, selected) => updateSelectedRowIds(selected
            ? Array.from(new Set([...selectedRowIds, rowId]))
            : selectedRowIds.filter((id) => id !== rowId)),
        getSelectionState: () => {
            if (!selection) return EMPTY_SELECTION_STATE;
            let selectedCount = 0;
            for (const id of registeredRowIds) {
                if (selectedRowIdSet.has(id)) selectedCount += 1;
            }
            return {
                all: registeredRowIds.length > 0 && selectedCount === registeredRowIds.length,
                some: selectedCount > 0 && selectedCount < registeredRowIds.length,
                rowIds: registeredRowIds,
            };
        },
        setAllRowsSelected: (selected) => {
            const visible = new Set(registeredRowIds);
            updateSelectedRowIds(selected
                ? Array.from(new Set([...selectedRowIds, ...registeredRowIds]))
                : selectedRowIds.filter((id) => !visible.has(id)));
        },
        getSelectedRowIds: () => selectedRowIds,
        clearSelection: () => updateSelectedRowIds([]),
        setSort: (nextSort) => {
            sort = nextSort as TableSortState | undefined;
            page = 1;
            onSortChange?.(sort);
            onPageChange?.(page);
        },
        getQuery: () => query,
        setQuery: (nextQuery) => {
            query = nextQuery;
        },
        getFilters: () => filters,
        setFilters: (nextFilters) => {
            filters = nextFilters;
            page = 1;
            onPageChange?.(page);
        },
    };
    provideTableContext(tableContext);

    $effect(() => {
        if (page === resolvedPage) return;
        page = resolvedPage;
        onPageChange?.(page);
    });
    let previousQuery: string | undefined;
    $effect(() => {
        const nextQuery = query;
        if (previousQuery === undefined) {
            previousQuery = nextQuery;
            return;
        }
        if (previousQuery === nextQuery) return;
        previousQuery = nextQuery;
        if (resetPageOnQuery && page !== 1) {
            page = 1;
            onPageChange?.(1);
        }
        onQueryChange?.(nextQuery);
    });
    let previousPageSize: number | undefined;
    $effect(() => {
        const nextPageSize = resolvedPageSize;
        if (previousPageSize === undefined) {
            previousPageSize = nextPageSize;
            return;
        }
        if (previousPageSize === nextPageSize) return;
        previousPageSize = nextPageSize;
        if (page !== 1) {
            page = 1;
            onPageChange?.(1);
        }
        onPageSizeChange?.(nextPageSize);
    });
    $effect(() => {
        boundState = renderState as DataTableRenderState<any>;
        onStateChange?.(renderState as DataTableRenderState<any>);
    });
</script>

<FramePro
    class={`snowui-data-table snowui-data-table-${variant} ${userClass}`}
    column
    contentFill
    gap={3}
    data-loading={loading ? "true" : undefined}
    data-refreshing={refreshing ? "true" : undefined}
    data-loading-more={loadingMore ? "true" : undefined}
    data-error={error === undefined && loadMoreError === undefined ? undefined : "true"}
    aria-busy={loading || refreshing || loadingMore ? "true" : "false"}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {...rest}
>
    {#if children}{@render children(renderState)}{/if}
    {#if loadMoreMode === "auto" && loadMoreSource !== undefined && resolvedHasMore}
        <span
            bind:this={autoLoadSentinel}
            class="snowui-data-table-auto-load-sentinel"
            aria-hidden="true"
            style:bottom={`${-resolvedLoadMoreThreshold}px`}
        ></span>
    {/if}
</FramePro>

<style>
    :global(:where(.snowui-data-table)) { position: relative; width: 100%; min-width: 0; gap: var(--gap-3, .75rem); }
    :global(:where(.snowui-data-table-auto-load-sentinel)) { position: absolute; right: 0; bottom: 0; left: 0; height: 1px; pointer-events: none; }
</style>
