/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
