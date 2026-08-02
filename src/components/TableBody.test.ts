export const examples = [
    { name: "A1: 表体", code: `A1
<Table><TableBody><TableRow><TableCell>内容</TableCell></TableRow></TableBody></Table>`, expected: { render: "渲染 tbody。", layout: "行连续排列。", interaction: "承载行 hover。", performance: "无额外状态。", responsive: "跟随 Table。" }, logic: ["Body"] },
    { name: "A2: 首次加载 Skeleton rows", code: `A2
<Table>
    <TableHeader><TableRow><TableHead>名称</TableHead><TableHead as="actions">操作</TableHead></TableRow></TableHeader>
    <TableBody loading />
</Table>`, expected: { render: "无法读取分页行数时渲染默认 10 行 Skeleton。", layout: "使用真实 tr/td 保持表格几何；actions 列只占位。", interaction: "Skeleton 行不可交互。", performance: "不扫描 DOM，由 TableHead 显式注册列语义。", responsive: "沿用表头列宽与对齐方式。" }, logic: ["Loading", "SkeletonRows", "ColumnRegistration", "DefaultPageSize"] },
    { name: "A3: 已有数据加载 Spinner", code: `A3
<Table><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody loadingSpinner><TableRow><TableCell>SnowUI</TableCell></TableRow></TableBody></Table>`, expected: { render: "保留业务行并在末尾追加 Spinner 行。", layout: "Spinner 单元格跨越全部已注册列并居中，默认尺寸 16×16px。", interaction: "Spinner 通过 role=status 表达加载状态。", performance: "复用 SnowUI Spinner。", responsive: "加载行宽度跟随整张表格。" }, logic: ["LoadingSpinner", "ColumnSpan", "DefaultSpinnerSize"] },
    { name: "A4: parts 统一配置加载子组件", code: `A4
<Table><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody loading parts={{ TableRow: { class: "opacity-100" }, TableCell: { align: "center" } }} /></Table>`, expected: { render: "加载行继续由内置 TableRow/TableCell 生成。", layout: "所有直接 TableCell 统一居中。", interaction: "Skeleton 行不可交互。", performance: "parts 不递归穿透 TableCell 内部。", responsive: "保持表格布局。" }, logic: ["Parts", "DirectOwnership"] },
    { name: "A5: 连续 Hover 与关闭开关", code: `A5
<Table><TableBody><TableRow><TableCell>One</TableCell></TableRow><TableRow><TableCell>Two</TableCell></TableRow></TableBody></Table>
<Table><TableBody continuousHover={false}><TableRow><TableCell>No background</TableCell></TableRow></TableBody></Table>`, expected: { render: "默认表体在合法 viewport 中只生成一个共享背景层。", layout: "背景匹配整行几何与圆角；单元格自身保持透明。", interaction: "数据行间连续移动；Skeleton 与 Spinner 行跳过；false 关闭全部行背景。", performance: "tbody 使用 direct 几何模式，不登记逐行 ResizeObserver，pointermove 只测当前命中行。", responsive: "横向滚动和活动行尺寸变化后重新定位。" }, logic: ["ContinuousHover", "SingleVisualLayer", "DirectGeometry", "SemanticOverlayHost", "OptOut"] },
];
