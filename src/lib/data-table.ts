/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export type DataTableSortDirection = "ascending" | "descending";
export type DataTableSortState = {
    columnId: string;
    direction: DataTableSortDirection;
};

const ISO_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:?\d{2})$/;

export function compareDataTableValues(left: unknown, right: unknown) {
    if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime();
    if (typeof left === "number" && typeof right === "number") return left - right;
    if (
        typeof left === "string"
        && typeof right === "string"
        && ISO_DATE_TIME_PATTERN.test(left)
        && ISO_DATE_TIME_PATTERN.test(right)
    ) {
        return new Date(left).getTime() - new Date(right).getTime();
    }
    return String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base",
    });
}

/** 稳定单列排序；null / undefined 在升降序中始终位于末尾。 */
export function sortDataTableRows<T>(
    rows: readonly T[],
    sort: DataTableSortState | undefined,
    sorter: ((row: T) => unknown) | undefined,
) {
    if (!sort || !sorter) return [...rows];
    const sign = sort.direction === "ascending" ? 1 : -1;
    return rows
        .map((row, index) => ({ row, index, value: sorter(row) }))
        .sort((left, right) => {
            if (left.value == null && right.value == null) return left.index - right.index;
            if (left.value == null) return 1;
            if (right.value == null) return -1;
            return compareDataTableValues(left.value, right.value) * sign || left.index - right.index;
        })
        .map((entry) => entry.row);
}

export function paginateDataTableRows<T>(rows: readonly T[], page: number, pageSize: number) {
    const size = Math.max(1, Math.floor(Number(pageSize) || 1));
    const totalPages = Math.max(1, Math.ceil(rows.length / size));
    const currentPage = Math.min(totalPages, Math.max(1, Math.floor(Number(page) || 1)));
    return {
        rows: rows.slice((currentPage - 1) * size, currentPage * size),
        page: currentPage,
        pageSize: size,
        totalRows: rows.length,
        totalPages,
    };
}
