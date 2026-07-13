export const examples = [{
    name: "A1: 普通 OSS 数据表格",
    code: `A1
<Table minWidth={960} ariaLabel="订阅记录">
    <TableHeader>
        <TableRow>
            <TableHead columnId="date">Date</TableHead>
            <TableHead columnId="store">Stores</TableHead>
            <TableHead columnId="subscriber">Subscriber</TableHead>
            <TableHead columnId="affiliate">Affiliate</TableHead>
            <TableHead columnId="plan">Plan</TableHead>
            <TableHead columnId="term">Term</TableHead>
            <TableHead columnId="price" align="end">Price</TableHead>
            <TableHead columnId="status">Status</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
            <TableCell columnId="date">Just now</TableCell>
            <TableCell columnId="store"><Frame row contentHug><Avatar src={SnowLogo} size={24} />SnowUI Pro</Frame></TableCell>
            <TableCell columnId="subscriber">Natali Craig</TableCell>
            <TableCell columnId="affiliate">—</TableCell>
            <TableCell columnId="plan"><Chip variant="background" class="text-purple">Monthly $19.9</Chip></TableCell>
            <TableCell columnId="term">First</TableCell>
            <TableCell columnId="price" align="end">$19.90</TableCell>
            <TableCell columnId="status"><Chip variant="background" class="text-green">Active</Chip></TableCell>
        </TableRow>
        <TableRow>
            <TableCell columnId="date">1 min ago</TableCell>
            <TableCell columnId="store"><Frame row contentHug><Avatar src={Gradient01} size={24} />My illustration world</Frame></TableCell>
            <TableCell columnId="subscriber">Kate Morrison</TableCell>
            <TableCell columnId="affiliate">Kate Morrison</TableCell>
            <TableCell columnId="plan"><Chip variant="background" class="text-purple">Affiliate Yearly $189</Chip></TableCell>
            <TableCell columnId="term">Renewal</TableCell>
            <TableCell columnId="price" align="end">$189.00</TableCell>
            <TableCell columnId="status"><Chip variant="background" class="text-green">Active</Chip></TableCell>
        </TableRow>
        <TableRow>
            <TableCell columnId="date">Yesterday</TableCell>
            <TableCell columnId="store">Magic 3D Store</TableCell>
            <TableCell columnId="subscriber">Drew Cano</TableCell>
            <TableCell columnId="affiliate">—</TableCell>
            <TableCell columnId="plan"><Chip variant="background" class="text-purple">Monthly $19.9</Chip></TableCell>
            <TableCell columnId="term">First</TableCell>
            <TableCell columnId="price" align="end">$9.95</TableCell>
            <TableCell columnId="status"><Chip variant="background" class="text-black-40">Expired</Chip></TableCell>
        </TableRow>
    </TableBody>
</Table>`,
    expected: {
        render: "渲染只含表头和业务数据行的原生语义表格。",
        layout: "八个普通数据列展示 Table-Demo 表格一的订阅内容，不含 checkbox 列和按钮列。",
        interaction: "仅保留普通数据行的默认 hover；没有搜索、排序、筛选、分页或加载更多交互。",
        performance: "静态数据直接由 OSS Table 语义组件渲染，不创建 PRO 数据状态。",
        responsive: "最小宽度为 960px，超出窄容器时由页面滚动容器承接。",
    },
    logic: ["Semantic", "DisplayOnly", "OSSBoundary"],
}, {
    name: "A4: 已有数据加载 Spinner",
    code: `A4
<Table loadingSpinnerSize={24}><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody loadingSpinner><TableRow><TableCell>SnowUI</TableCell></TableRow></TableBody></Table>`,
    expected: { render: "数据行后追加一个跨越全部列的 Spinner 状态行。", layout: "Spinner 在 40px 行内水平、垂直居中，尺寸为 24px。", interaction: "加载行不可 hover 或选择。", performance: "复用通用 Spinner，不创建独立动画实现。", responsive: "colspan 跟随已注册表头列数。" },
    logic: ["LoadingSpinner", "ColumnSpan", "SpinnerSize"],
}];
