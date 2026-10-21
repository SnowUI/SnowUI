/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getContext, setContext } from "svelte";
import type { ResourceSize } from "../context";
import type { MotionConfig } from "../logic/motion-config";
import type { TableTruncationResult } from "./table-truncation";
import type { OverflowActionsItem } from "../components/OverflowActions.svelte";

export type TableSortDirection = "ascending" | "descending";
export type TableRoleLayout = "auto" | "column" | "overlay";
export type TableRoleOverlayBlurMode = "progressive" | "uniform";
export interface TableSortState {
    columnId: string;
    direction: TableSortDirection;
}

export interface TableColumnRegistration {
    readonly columnId?: string;
    readonly label?: string;
    readonly sortable?: boolean;
    readonly role?: "selection" | "actions";
    readonly align: "start" | "center" | "end";
}

export interface TableSelectionController {
    getSelectedRowIds: () => Array<string | number>;
    clearSelection: () => void;
}

export interface TableActionsActionEvent {
    rowId: string | number;
    actionId: string;
    item?: Exclude<OverflowActionsItem, { type: "separator" }>;
}

export interface TableContext {
    isDataTable: () => boolean;
    getColumnWidth: (columnId: string) => number | undefined;
    setColumnWidth: (columnId: string, width: number) => void;
    fitColumnWidth: (columnId: string, minWidth: number, maxWidth: number) => void;
    getSort: () => TableSortState | undefined;
    getDefaultSort: () => TableSortState | undefined;
    getDefaultSortActive: () => boolean;
    getRoleLayout: () => TableRoleLayout;
    getHorizontalScroll: () => boolean;
    getRoleOverlayLayers: () => number;
    getRoleOverlayBlurMode: () => TableRoleOverlayBlurMode;
    getRoleOverlayUniformFeather: () => number;
    /** DataTable 是否显示 checkbox 选择列；非 DataTable 时无意义 */
    isSelectionEnabled: () => boolean;
    /** DataTable 是否显示操作按钮列；非 DataTable 时无意义 */
    isActionsEnabled: () => boolean;
    getRowActions: (rowId: string | number) => OverflowActionsItem[];
    runRowAction: (event: TableActionsActionEvent) => void;
    getActionsCompact: () => "auto" | "none";
    getActionsOverflow: () => "all" | "progressive";
    getActionsOverflowFrom: () => "start" | "end";
    getActionsColumnWidth: () => number;
    getActionsMinWidth: () => number;
    getActionsMaxWidth: () => number;
    isActionsResizable: () => boolean;
    registerDefaultSort: (columnId: string, direction: TableSortDirection, active: boolean) => () => void;
    isSortable: (columnId: string) => boolean;
    toggleSort: (columnId: string) => void;
    setSort: (sort: TableSortState | undefined) => void;
    getQuery: () => string;
    setQuery: (query: string) => void;
    getFilters: () => Record<string, unknown>;
    setFilters: (filters: Record<string, unknown>) => void;
    getVariant: () => "striped" | "divided" | undefined;
    getLoading: () => boolean;
    getLoadingMore: () => boolean;
    getLoadingRowCount: () => number;
    getLoadingSpinner: () => boolean;
    getLoadingSpinnerSize: () => ResourceSize | undefined;
    getRowAppearMotion: (rowId: string | number) => MotionConfig | undefined;
    hasRowPreview: () => boolean;
    openRowPreview: (rowId: string | number, event: MouseEvent) => void;
    registerColumn: (column: TableColumnRegistration) => () => void;
    getColumns: () => readonly TableColumnRegistration[];
    registerRow: (rowId: string | number) => () => void;
    isRowSelected: (rowId: string | number) => boolean;
    setRowSelected: (rowId: string | number, selected: boolean) => void;
    getSelectionState: () => {
        all: boolean;
        some: boolean;
        rowIds: Array<string | number>;
    };
    setAllRowsSelected: (selected: boolean) => void;
    getSelectedRowIds: () => Array<string | number>;
    clearSelection: () => void;
    registerSelectionController: (
        controller: TableSelectionController,
    ) => () => void;
    registerTruncationTarget: (
        node: HTMLElement,
        target: {
            isEnabled: () => boolean;
            notify: (result: TableTruncationResult) => void;
        },
    ) => () => void;
    requestTruncationMeasure: () => void;
}

export const TABLE_CONTEXT_KEY = Symbol.for("snowui.table");

const fallback: TableContext = {
    isDataTable: () => false,
    getColumnWidth: () => undefined,
    setColumnWidth: () => {},
    fitColumnWidth: () => {},
    getSort: () => undefined,
    getDefaultSort: () => undefined,
    getDefaultSortActive: () => false,
    getRoleLayout: () => "auto",
    getHorizontalScroll: () => true,
    getRoleOverlayLayers: () => 4,
    getRoleOverlayBlurMode: () => "progressive",
    getRoleOverlayUniformFeather: () => 0.3,
    isSelectionEnabled: () => true,
    isActionsEnabled: () => true,
    getRowActions: () => [],
    runRowAction: () => {},
    getActionsCompact: () => "auto",
    getActionsOverflow: () => "all",
    getActionsOverflowFrom: () => "end",
    getActionsColumnWidth: () => 160,
    getActionsMinWidth: () => 40,
    getActionsMaxWidth: () => 320,
    isActionsResizable: () => false,
    registerDefaultSort: () => () => {},
    isSortable: () => false,
    toggleSort: () => {},
    setSort: () => {},
    getQuery: () => "",
    setQuery: () => {},
    getFilters: () => ({}),
    setFilters: () => {},
    getVariant: () => undefined,
    getLoading: () => false,
    getLoadingMore: () => false,
    getLoadingRowCount: () => 10,
    getLoadingSpinner: () => false,
    getLoadingSpinnerSize: () => 16,
    getRowAppearMotion: () => undefined,
    hasRowPreview: () => false,
    openRowPreview: () => {},
    registerColumn: () => () => {},
    getColumns: () => [],
    registerRow: () => () => {},
    isRowSelected: () => false,
    setRowSelected: () => {},
    getSelectionState: () => ({ all: false, some: false, rowIds: [] }),
    setAllRowsSelected: () => {},
    getSelectedRowIds: () => [],
    clearSelection: () => {},
    registerSelectionController: () => () => {},
    registerTruncationTarget: () => () => {},
    requestTruncationMeasure: () => {},
};

export function provideTableContext(context: Partial<TableContext>) {
    const parent = getContext<TableContext | undefined>(TABLE_CONTEXT_KEY);
    const value: TableContext = { ...fallback, ...parent, ...context };
    setContext(TABLE_CONTEXT_KEY, value);
    return value;
}

export function getTableContext() {
    return getContext<TableContext | undefined>(TABLE_CONTEXT_KEY) ?? fallback;
}
