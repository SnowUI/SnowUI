export const examples = [
    {name:"操作数量与容器预算",code:`<DataTable rows={[{id:'one'}]} rowKey={row => row.id} actions={{maxVisible:3, items:()=>Array.from({length:6},(_,i)=>({id:String(i),label:'操作 '+i}))}}><Table><TableHeader><TableRow><TableHead columnId="name">记录</TableHead><TableHead as="actions"/></TableRow></TableHeader><TableBody><TableRow rowId="one"><TableCell columnId="name">SnowUI</TableCell><TableCell as="actions"/></TableRow></TableBody></Table></DataTable>`,expected:{render:"六个操作按数量与本表可见宽度共同收纳。",interaction:"更多菜单保持全部操作可达。",responsive:"先保数据，极窄保留More并局部滚动。"},logic:["ActionsBudget","MaxVisible"]},
    {
        name: "A0: 两种行视觉",
        code: `A0
<DataTable rows={[{ name: "SnowUI" }, { name: "Figma" }]} variant="striped">
    {#snippet children(state)}striped：{state.rows.length} 行{/snippet}
</DataTable>
<DataTable rows={[{ name: "SnowUI" }, { name: "Figma" }]} variant="divided">
    {#snippet children(state)}divided：{state.rows.length} 行{/snippet}
</DataTable>`,
        expected: { render: "striped 第一行使用 Surface/3；divided 使用表头和数据行分割线。", layout: "三区域默认 gap 为 12px。", interaction: "divided hover 行上下分割线隐藏。", performance: "仅通过 CSS variant 切换，不复制数据。", responsive: "不改变列宽协议。" },
        logic: ["Striped", "Divided", "Gap"],
    },
    {
        name: "A1: 客户端排序与分页",
        code: `A1
<DataTable rows={[{ name: "B" }, { name: "A" }]} defaultSort={{ columnId: "name", direction: "ascending" }} pageSize={1}>
    {#snippet children(state)}
        <Table><TableHeader><TableRow><TableHead columnId="name">名称</TableHead></TableRow></TableHeader><TableBody>{#each state.rows as row}<TableRow><TableCell>{row.name}</TableCell></TableRow>{/each}</TableBody></Table>
        <Pagination page={state.page} total={state.totalPages} />
    {/snippet}
</DataTable>`,
        expected: { render: "渲染排序并分页后的数据。", layout: "Table 与 Pagination 可自由组合。", interaction: "表头循环升序、降序、无排序。", performance: "稳定排序 rows 副本，不修改原数组。", responsive: "Table 自行处理横向溢出；表头与数据 Cell 左右 padding 按内部 Table 容器宽度在 4px 到 12px 之间响应。" },
        logic: ["ClientSort", "DefaultFieldSorter", "Stable", "Pagination"],
    },
    {
        name: "A2: 服务端受控状态",
        code: `A2
<DataTable
    mode="server"
    rows={[{ name: "当前页数据" }]}
    totalRows={320}
    page={2}
    query="SnowUI"
    filters={{ status: "active" }}
    onStateChange={() => {}}
>
    {#snippet children(state)}<Table aria-busy={state.loading}>服务端当前页</Table>{/snippet}
</DataTable>`,
        expected: { render: "原样渲染服务端当前页 rows。", layout: "可省略 Toolbar 和 Pagination，不产生空位。", interaction: "状态变化通过 onStateChange 交给页面数据层。", performance: "不在组件内发请求或重排当前页。", responsive: "保持相同组合协议。" },
        logic: ["Server", "Controlled", "OptionalRegions"],
    },
    {
        name: "A3: 加载与后台刷新",
        code: `A3
<DataTable rows={[]} loading pageSize={3}>
    {#snippet children()}
        <Table><TableHeader><TableRow><TableHead>名称</TableHead><TableHead as="actions">操作</TableHead></TableRow></TableHeader><TableBody /></Table>
    {/snippet}
</DataTable>
<DataTable rows={[{ name: "SnowUI" }]} refreshing>
    {#snippet children(state)}
        <Table><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody>{#each state.rows as row}<TableRow><TableCell>{row.name}</TableCell></TableRow>{/each}</TableBody></Table>
    {/snippet}
</DataTable>`,
        expected: { render: "首次加载按 pageSize 自动渲染 3 行 Skeleton；后台刷新保留已有 rows 并追加 Spinner 行。", layout: "Skeleton 使用表头列结构；Spinner 跨越整张表格并居中。", interaction: "根节点同步 aria-busy，加载占位不提供行交互。", performance: "Skeleton 与 Spinner 都只复用 通用组件。", responsive: "状态不改变表格宽度协议。" },
        logic: ["Loading", "SkeletonRows", "LoadingSpinner", "Refreshing", "Error"],
    },
    {
        name: "A4: 内部流式加载更多",
        code: `A4
<DataTable
    mode="server"
    rows={[{ id: 1, name: "SnowUI" }]}
    rowKey={(row) => row.id}
    totalRows={3}
    loadMoreSize={2}
    loadMore={async function* ({ offset }) {
        yield { id: offset + 1, name: "Figma" };
        yield { id: offset + 2, name: "Svelte" };
    }}
>
    {#snippet children(state)}
        <Table><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody>{#each state.rows as row, index}<TableRow rowId={state.getRowKey(row, index)}><TableCell>{row.name}</TableCell></TableRow>{/each}{#if state.hasMore && !state.loadingMore}<TableRow><TableCell><Button onclick={() => void state.loadMore()}>加载更多</Button></TableCell></TableRow>{/if}</TableBody></Table>
    {/snippet}
</DataTable>`,
        expected: { render: "组件内部逐条追加 async generator 返回的数据。", layout: "请求阶段使用跨列 Spinner 行，数据行保持原表格结构；首次加载前锁定当前自然列宽。", interaction: "state.loadMore() 防止并发；第一条新行开始渐显时隐藏 Spinner；selection/actions 控件保持完整 opacity。", performance: "按内部展示间隔挂载行，普通 TableCell 独立执行纯 Frame opacity 动效且不缩放，不等待上一行动效完成；间隔为 0 时同批提交；新内容不重排已有列宽。", responsive: "增量行沿用锁定列宽，显式 columnWidths 仍优先。" },
        logic: ["LoadMore", "AsyncIterable", "ColumnWidthLock", "ProgressiveRows", "RowAppear", "Abort"],
    },
    {
        name: "A5: 组件内自动加载",
        code: `A5
<Frame style="height:240px;overflow-y:auto;">
    <DataTable
        mode="server"
        rows={[{ id: 1, name: "SnowUI" }]}
        rowKey={(row) => row.id}
        totalRows={3}
        loadMoreMode="auto"
        loadMoreSize={2}
        loadMore={({ offset }) => [
            { id: offset + 1, name: "Figma" },
            { id: offset + 2, name: "Svelte" },
        ]}
    >
        {#snippet children(state)}
            <Table><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody>{#each state.rows as row, index}<TableRow rowId={state.getRowKey(row, index)}><TableCell>{row.name}</TableCell></TableRow>{/each}</TableBody></Table>
        {/snippet}
    </DataTable>
</Frame>`,
        expected: { render: "DataTable 内部渲染位于表格底部下方的非布局表尾哨兵。", layout: "自动加载沿用最近纵向滚动容器，不创建新的滚动区。", interaction: "默认越过表格底部后继续滚动 80px，首次再停留 500ms 才加载；首次等待期间上滚离开触发区则取消，页面无需 Observer。", performance: "首次确认等待避免滚动惯性期间扩展滚动高度；后续请求保持最小间隔，loadingMore 防止并发，hasMore=false 后移除哨兵并停止观察。", responsive: "阈值不改变表格尺寸与列宽协议。" },
        logic: ["AutoLoad", "InternalSentinel", "ScrollThreshold", "TriggerConfirmation", "RequestThrottle"],
    },
    {
        name: "A6: 默认响应式操作列",
        code: `A6
<DataTable
    rows={[{ id: 1, name: "SnowUI" }]}
    rowKey={(row) => row.id}
    actions={{
        width: 120,
        minWidth: 40,
        maxWidth: 240,
        resizable: true,
        overflow: "progressive",
        overflowFrom: "end",
        items: () => [
            { id: "edit", label: "编辑", icon: "pencil-simple" },
            { type: "separator", id: "danger" },
            { id: "delete", label: "删除", icon: "trash" },
        ],
    }}
>
    {#snippet children(state)}
        <Table>
            <TableHeader><TableRow><TableHead columnId="name">名称</TableHead><TableHead as="actions">操作</TableHead></TableRow></TableHeader>
            <TableBody>{#each state.rows as row}<TableRow rowId={row.id}><TableCell>{row.name}</TableCell><TableCell as="actions" /></TableRow>{/each}</TableBody>
        </Table>
    {/snippet}
</DataTable>`,
        expected: { render: "actions 配置自动在空 actions Cell 中渲染 OverflowActions。", layout: "column 模式使用 120px 初始列宽，拖动后通过共享列宽上下文更新。", interaction: "可见 Button 与 More 菜单都通过 DataTable onAction 返回 row 与 actionId；菜单展开期间行操作保持可见。", performance: "DataTable 直接下发列宽，不为每个操作单元格新增 ResizeObserver。", responsive: "先统一 Icon-only，再从末端逐项进入菜单；Separator 不会单独留在首尾。" },
        logic: ["Actions", "OverflowActions", "ResizableColumn", "RowAction", "NoCellObserver"],
    },
    {
        name: "响应式：常驻角色列、浮层与收列",
        code: `
<DataTable rows={[{id:'one'}]} rowKey={(row) => row.id} selection actions horizontalScroll={false} variant="striped">
<Table ariaLabel="响应式订阅记录"><TableHeader><TableRow><TableHead as="selection"/><TableHead columnId="name">订阅</TableHead><TableHead columnId="owner">负责人</TableHead><TableHead columnId="note">备注</TableHead><TableHead as="actions"/></TableRow></TableHeader>
<TableBody><TableRow rowId="one"><TableCell as="selection"/><TableCell columnId="name">SnowUI Professional</TableCell><TableCell columnId="owner">Natali Craig</TableCell><TableCell columnId="note">Annual subscription renewal</TableCell><TableCell as="actions"><Button>编辑订阅</Button></TableCell></TableRow></TableBody></Table>
</DataTable>`,
        expected: { render: "宽容器常驻显示 Checkbox 与操作。", responsive: "缩窄先转 hover 浮层，再缩左右间距，再从右向左收列；第一普通列和角色功能始终保留。", interaction: "宽窄切换保留选择与键盘操作；当前可见末列接管圆角。" },
        logic: ["Responsive", "Selection", "OverlayRoleLayout"],
    },
];
