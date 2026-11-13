export const examples = [
    {
        name: "TTB-01: DataTable 工具栏",
        code: `TTB-01
<DataTable rows={[]}>
    <TableToolbar searchPlaceholder="名称、邮箱或记录 ID" parts={{ SearchInput: { error: "" } }} />
    <Table />
</DataTable>`,
        expected: {
            render: "DataTable 内渲染搜索、排序与筛选工具栏。",
            layout: "工具栏及筛选/排序按钮显式使用Frame singleLine，SSR首屏到加载完成保持图文同排；工具栏占满DataTable宽度；搜索填充剩余空间，单独筛选以及排序加筛选都靠右，替换as=search时保持相同规则；内置搜索存在错误提示外层时也填满剩余空间，不按内容宽度裁切。",
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
    {
        name: "TTB-03: 外部查询和筛选同步",
        code: `TTB-03
<script lang="ts">
let query = $state("");
let filters = $state<Record<string, string>>({});
</script>
<Button as="action" onclick={() => { query = "Alpha"; filters = {status:"active"}; }}>Apply preset</Button>
<Button as="action" onclick={() => { query = ""; filters = {}; }}>Reset</Button>
<DataTable rows={[]} bind:query bind:filters>
<TableToolbar sort={false} filterKey="status" filterOptions={[{value:"active",label:"Active"}]} />
<Table />
</DataTable>`,
        expected: {interaction:"外部预设和重置立即同步搜索文字与筛选选中值；工具栏操作继续写回DataTable，不反向覆盖外部状态。"},
        logic:["Context","ControlledState"],
    },
] as const;
