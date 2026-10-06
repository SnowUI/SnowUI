export const examples = [
    {
        name: "A1: DataTable 排序与列宽",
        code: `A1
<Table><TableHeader><TableRow><TableHead columnId="price" defaultSort="descending" defaultSortActive minWidth={64}>价格</TableHead></TableRow></TableHeader></Table>`,
        expected: { render: "渲染 th 与 aria-sort；defaultSortActive 使默认方向也显示激活态和图标；ascending 使用 ArrowsUp，descending 使用 ArrowsDown。", layout: "图标 16px、与文间距 0；右侧 Indicator 为 1px × 16px 居中。", interaction: "defaultSortActive 列按默认 → 反向 → none → 默认；其他列按 none → ascending → descending → none。", performance: "排序状态由上层 context 持有。", responsive: "受 min/max 限制。" },
        logic: ["Sort", "Resize"],
    },
    {
        name: "A2: 独立受控排序",
        code: `A2
<TableHead columnId="price" sortDirection="ascending" onSortChange={(next) => console.log(next)}>价格</TableHead>`,
        expected: { render: "按 sortDirection 同步 aria-sort。", layout: "不依赖 DataTable 外壳。", interaction: "点击后通过 onSortChange 发出下一排序方向。", performance: "只发出排序意图。", responsive: "不改变列宽。" },
        logic: ["ControlledSort"],
    },
    {
        name: "A3: 固定静态列头",
        code: `A3
<Table><TableHeader><TableRow><TableHead columnId="note" resizable={false}>备注</TableHead></TableRow></TableHeader></Table>`,
        expected: { render: "渲染静态 th，不渲染排序按钮或改宽 Indicator。", layout: "保持表头文字排版。", interaction: "无 hover、点击、排序或改宽交互。", performance: "不注册排序交互。", responsive: "跟随 Table。" },
        logic: ["Static"],
    },
    {
        name: "A4: 选择与行动表头角色",
        code: `A4
<Table><TableHeader><TableRow><TableHead as="selection" /><TableHead as="actions">操作</TableHead></TableRow></TableHeader></Table>`,
        expected: { render: "selection 渲染内置全选 Checkbox；actions 可选渲染标题。", layout: "全选 Checkbox 默认 17px，与行 Checkbox 一致；角色列使用各自定向 padding。", interaction: "全选仅在 Table hover/focus-within 时显示；两列均无排序态。", performance: "选择状态来自 Table Context。", responsive: "保持窄角色列。" },
        logic: ["Selection", "Actions"],
    },
    {
        name: "A5: 覆盖式角色表头",
        code: `A5
<Table roleLayout="overlay"><TableHeader><TableRow><TableHead as="selection" /><TableHead columnId="name">名称</TableHead><TableHead as="actions" /></TableRow></TableHeader></Table>`,
        expected: { render: "角色表头仍为 th。", layout: "selection/actions 宽度归零并 sticky 到左右边缘，覆盖块使用反向透明模糊渐变遮罩。", interaction: "selection 全选可见规则不变，actions 不参与排序。", performance: "布局来自 Table Context，可被单个 TableHead roleLayout 覆盖。", responsive: "不制造独立视觉列。" },
        logic: ["Selection", "Actions", "OverlayRoleLayout"],
    },
    {
        name: "A6: parts 配置表头内置组件",
        code: `A6
<Table><TableHeader><TableRow><TableHead as="selection" parts={{ Checkbox: { size: 20 }, Indicator: { appearance: "corner" } }} /><TableHead columnId="name" resizable>名称</TableHead></TableRow></TableHeader></Table>`,
        expected: { render: "内置 Checkbox/Indicator 使用各自 part。", layout: "表头结构保持不变。", interaction: "全选和拖拽仍走原协议。", performance: "同类型直接实例统一配置。", responsive: "保持列布局。" },
        logic: ["Parts", "Checkbox", "Indicator"],
    },
    {
        name: "A7: 双击列宽恢复",
        code: `A7
<Table columnWidths={{ price: 80, note: 160 }}>
    <TableHeader><TableRow><TableHead columnId="price" minWidth={64} maxWidth={240}>Price</TableHead><TableHead columnId="note">Note</TableHead></TableRow></TableHeader>
    <TableBody><TableRow><TableCell columnId="price">$1,234.56</TableCell><TableCell columnId="note" nowrap={false} lines={false}>A long note that can wrap across multiple lines.</TableCell></TableRow></TableBody>
</Table>`,
        expected: {
            interaction: "调整 Price 后双击手柄，宽度适合内容且处于64到240之间；调整 Note 后双击恢复160px；双击不改变排序。",
            responsive: "默认列不换行；Note 显式允许换行。",
        },
        logic: ["Resize", "AutoFit", "Wrap"],
    },
    {
        name: "A8: 全选与行 Checkbox 退出无残影",
        code: `A8
<DataTable rows={[{id: 'one'}]} rowKey={(row) => row.id} selection roleLayout="overlay">
<Table><TableHeader><TableRow><TableHead as="selection"/><TableHead columnId="name">订阅</TableHead></TableRow></TableHeader>
<TableBody><TableRow rowId="one"><TableCell as="selection"/><TableCell columnId="name">SnowUI Pro</TableCell></TableRow></TableBody></Table>
</DataTable>`,
        expected: { render: "全选与行内 Checkbox 保留渐显，退出与内容遮罩同步，无残影。", interaction: "可通过键盘 Tab 聚焦；行勾选后移出保持显示，取消后正常隐藏。", responsive: "宽窄表格均保持相同退出规则；两处渐隐从 Checkbox 实际右边缘向右延伸固定名义 20px。" },
        logic: ["Selection", "OverlayRoleLayout", "Focus"],
    },
];
