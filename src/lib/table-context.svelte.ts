import { getContext, setContext } from "svelte";
import type { ResourceSize } from "../context";
import type { MotionConfig } from "../logic/motion-config";

export type TableSortDirection = "ascending" | "descending";
export type TableRoleLayout = "column" | "overlay";
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

export interface TableContext {
    isDataTable: () => boolean;
    getColumnWidth: (columnId: string) => number | undefined;
    setColumnWidth: (columnId: string, width: number) => void;
    getSort: () => TableSortState | undefined;
    getDefaultSort: () => TableSortState | undefined;
    getDefaultSortActive: () => boolean;
    getRoleLayout: () => TableRoleLayout;
    getRoleOverlayLayers: () => number;
    getRoleOverlayBlurMode: () => TableRoleOverlayBlurMode;
    getRoleOverlayUniformFeather: () => number;
    /** DataTable 是否显示 checkbox 选择列；非 DataTable 时无意义 */
    isSelectionEnabled: () => boolean;
    /** DataTable 是否显示操作按钮列；非 DataTable 时无意义 */
    isActionsEnabled: () => boolean;
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
}

export const TABLE_CONTEXT_KEY = Symbol.for("snowui.table");

const fallback: TableContext = {
    isDataTable: () => false,
    getColumnWidth: () => undefined,
    setColumnWidth: () => {},
    getSort: () => undefined,
    getDefaultSort: () => undefined,
    getDefaultSortActive: () => false,
    getRoleLayout: () => "column",
    getRoleOverlayLayers: () => 4,
    getRoleOverlayBlurMode: () => "progressive",
    getRoleOverlayUniformFeather: () => 0.3,
    isSelectionEnabled: () => true,
    isActionsEnabled: () => true,
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
