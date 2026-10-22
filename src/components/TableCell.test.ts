export const examples = [
    {name:"A9: 图文组合保持横排",code:`A9
<Table horizontalScroll={false}><TableHeader><TableRow><TableHead>Store</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell row><Icon as="leading" icon={Resource.Check} size={20}/><Text as="truncation-owner" lines={1}>SnowUI Store with a very long name</Text></TableCell></TableRow></TableBody></Table>`,expected:{render:"单行截断不替换横排布局。",layout:"图文gap至少4px，附件保持尺寸。",interaction:"Text为最近截断owner。",responsive:"收窄及恢复均保持同排，必要时局部滚动。"},logic:["row","nowrap","Text"]},
    {
        name: "A1: 默认单行截断",
        code: `A1
<Table><TableBody><TableRow><TableCell>未知长度的原始文字内容</TableCell></TableRow></TableBody></Table>`,
        expected: { render: "溢出时显示省略号和 Tooltip。", layout: "默认 lines=1；上下 padding 8px。", interaction: "hover 后可查看完整文本。", performance: "共享 ResizeObserver。", responsive: "列宽变化后重测；左右 padding 按 Table 容器宽度在 4px 到 12px 之间响应。" },
        logic: ["Truncate", "Tooltip"],
    },
    {
        name: "A2: 显式 Text 成为截断 owner",
        code: `A2
<Table><TableBody><TableRow><TableCell><Text as="truncation-owner" lines={2}>由 Text 控制的长文字</Text></TableCell></TableRow></TableBody></Table>`,
        expected: { render: "只由 Text 渲染截断 Tooltip。", layout: "Text 显式 lines 覆盖 Cell 默认策略。", interaction: "不会出现两个 Tooltip。", performance: "仍共享 TruncationController。", responsive: "宽度变化后由共享 observer 重测。" },
        logic: ["NearestOwner", "Text"],
    },
    {
        name: "A3: 任意复合内容",
        code: `A3
<Table><TableBody><TableRow><TableCell lines={false} row><Avatar /><Chip>Pro</Chip><Button size="sm" variant="outline">操作</Button></TableCell></TableRow></TableBody></Table>`,
        expected: { render: "保留 SnowUI 复合组件。", layout: "lines=false 关闭整体裁剪；row 让内容横向排列并垂直居中。", interaction: "内部 Button 可独立操作，hover 外扩时上下边框不被裁切。", performance: "不转换 children。", responsive: "由内容与列宽共同决定布局。" },
        logic: ["ArbitraryContent", "NoTruncate"],
    },
    {
        name: "A4: 选择与行动单元格角色",
        code: `A4
<Table selectedRowIds={["one"]}><TableBody><TableRow rowId="one"><TableCell as="selection" /><TableCell as="actions"><Button bare emphasis="muted">更多</Button></TableCell></TableRow></TableBody></Table>`,
        expected: { render: "selection 内置行 Checkbox；actions 渲染调用方按钮。", layout: "selection Checkbox 默认 17px，在奇数高度行内上下留白对称；actions 横向排列且 gap 8px。", interaction: "Checkbox 在 hover/focus/selected 时显示；actions 只在 hover 时显示。", performance: "无 DOM 身份猜测。", responsive: "角色列保持窄宽。" },
        logic: ["Selection", "Actions"],
    },
    {
        name: "A5: 覆盖式角色单元格",
        code: `A5
<Table roleLayout="overlay" selectedRowIds={["one"]}><TableBody><TableRow rowId="one"><TableCell as="selection" /><TableCell>SnowUI</TableCell><TableCell as="actions"><Button bare emphasis="muted">更多</Button></TableCell></TableRow></TableBody></Table>`,
        expected: { render: "selection/actions 仍保持合法 td。", layout: "角色 td 宽度归零，17px Checkbox 在覆盖块内垂直居中，覆盖块 sticky 到行左右边缘并用透明模糊渐变柔化后方内容。", interaction: "已选行 Checkbox 保持显示，actions 仍只在行 hover 时显示。", performance: "选择状态直接来自 rowId + Table Context，不创建逐单元格 MutationObserver。", responsive: "不改变普通内容列宽。" },
        logic: ["Selection", "Actions", "OverlayRoleLayout"],
    },
    {
        name: "A6: Skeleton 单元格",
        code: `A6
<Table><TableBody><TableRow aria-hidden="true"><TableCell skeleton /><TableCell as="actions" skeleton /></TableRow></TableBody></Table>`,
        expected: { render: "普通列渲染 line Skeleton，actions 列仅保留单元格占位。", layout: "保持 td 高度、宽度与内边距。", interaction: "不渲染 Checkbox、按钮或 Tooltip。", performance: "跳过文本截断测量。", responsive: "Skeleton 宽度受单元格可用宽度约束。" },
        logic: ["Skeleton", "RolePlaceholder"],
    },
    {
        name: "A7: parts 配置内置 Checkbox",
        code: `A7
<Table selectedRowIds={["one"]}><TableBody><TableRow rowId="one"><TableCell as="selection" parts={{ Checkbox: { size: 20 } }} /><TableCell>SnowUI</TableCell></TableRow></TableBody></Table>`,
        expected: { render: "selection 单元格使用内置 Checkbox。", layout: "Checkbox 使用 parts 指定尺寸。", interaction: "选择行为仍由 Table 管理。", performance: "不复制 Checkbox 实现。", responsive: "角色列保持原布局。" },
        logic: ["Parts", "Checkbox"],
    },
    {
        name: "A8: 窄表操作浮层跨列渐隐",
        code: `A8
<div style="width: 100%; max-width: 400px;">
<DataTable rows={[{ id: "one" }]} rowKey={(row) => row.id} selection actions roleLayout="overlay">
<Table columnWidths={{ name: 240, status: 120, note: 64 }}>
<TableHeader><TableRow><TableHead as="selection" /><TableHead columnId="name">订阅</TableHead><TableHead columnId="status">状态</TableHead><TableHead columnId="note">备注</TableHead><TableHead as="actions" /></TableRow></TableHeader>
<TableBody><TableRow rowId="one"><TableCell as="selection" /><TableCell columnId="name">SnowUI Pro</TableCell><TableCell columnId="status"><Chip>Active</Chip></TableCell><TableCell columnId="note">New</TableCell><TableCell as="actions"><Button size="sm">Edit</Button><Button size="sm">Help</Button><Button size="sm">More</Button></TableCell></TableRow></TableBody>
</Table></DataTable></div>`,
        expected: { render: "操作按钮覆盖到 Status 时，Status 与 Note 连续渐隐，按钮下方完全隐藏，左侧保留固定 20px Token 柔和过渡。", layout: "浮层固定到可见表格右边缘，不越过横向滚动视口。", interaction: "hover 显示操作，移出后操作浮层立即隐藏、内容恢复且无残影；已选行保留左侧遮罩。", performance: "只在已激活行批量读取各内容坐标，不增加逐 Cell Observer。", responsive: "横向滚动及宽窄变化后，渐隐仍与按钮对齐；行内 Checkbox 按实际右边缘向右固定过渡 20px。" },
        logic: ["Actions", "OverlayRoleLayout", "EdgeFade"],
    },
];
