export const examples = [
    {
        name: "TTB-01: PRO DataTable 工具栏",
        code: `TTB-01
<DataTable rows={[]}>
    <TableToolbar />
    <Table />
</DataTable>`,
        expected: {
            render: "DataTable 内渲染搜索、排序与筛选工具栏。",
            layout: "工具栏占满 DataTable 宽度。",
            interaction: "读写 DataTable 的查询、排序、筛选和选择状态。",
            performance: "通过共享 Context 协调，不扫描 DOM。",
            responsive: "窄宽度保持单行并收缩搜索区域。",
        },
        logic: ["DataTable", "Context", "Toolbar"],
    },
] as const;
