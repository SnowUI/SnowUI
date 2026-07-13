import { getContext, setContext } from "svelte";

export interface TableRowContext {
    getRowId: () => string | number | undefined;
}

const TABLE_ROW_CONTEXT_KEY = Symbol.for("snowui.table-row");

export function provideTableRowContext(context: TableRowContext) {
    setContext(TABLE_ROW_CONTEXT_KEY, context);
    return context;
}

export function getTableRowContext() {
    return getContext<TableRowContext | undefined>(TABLE_ROW_CONTEXT_KEY);
}
