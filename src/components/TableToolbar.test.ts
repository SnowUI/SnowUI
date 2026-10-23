export const examples = [
    {
        name: "TTB-01: DataTable 工具栏",
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
    {
        name: "TTB-02: 选择计数、操作间距与窄宽滚动",
        code: `TTB-02
<script lang="ts">
let selected = $state<(string | number)[]>([1,2]);
let result = $state("Ready");
const rows = [{id:1,name:"Alpha"},{id:2,name:"Beta"}];
</script>
<Frame column style="width:100%;">
<DataTable {rows} rowKey={row=>row.id} selection bind:selectedRowIds={selected}>
<TableToolbar search={false} sort={false} filter={false} onCopy={()=>{result="Copied";}} onDelete={()=>{result="Delete requested";}} />
<Table><TableHeader><TableRow><TableHead columnId="name">Name</TableHead></TableRow></TableHeader><TableBody>{#each rows as row}<TableRow rowId={row.id}><TableCell columnId="name">{row.name}</TableCell></TableRow>{/each}</TableBody></Table>
</DataTable><Text>{result}</Text>
</Frame>`,
        expected: {render:"已选数量与操作之间至少4 CSS px，放不下时保留局部横向滚动和完整操作。",interaction:"复制／删除只记录一次请求，清除选择后收起批量操作与多余轨道。",responsive:"只缩小外部容器，图文不拆行；轨道不遮挡控件并随宽度恢复隐藏。"},
        logic:["ContentLine","Selection","SharedScrollbar"],
    },
] as const;
