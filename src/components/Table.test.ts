export const examples = [{
    name: "A1: 普通 数据表格",
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
        render: "渲染只含表头和业务数据行的原生语义表格；表格名为订阅记录，滚动区域中文名称为“订阅记录，可横向滚动”。",
        layout: "八个普通数据列展示 Table-Demo 表格一的订阅内容，不含 checkbox 列和按钮列。",
        interaction: "仅保留普通数据行的默认 hover；没有搜索、排序、筛选、分页或加载更多交互。",
        performance: "静态数据直接由 Table 语义组件渲染，不创建 DataTable 数据状态。",
        responsive: "显式最小宽度为 960px，超出窄容器时由 Table 内置局部横向 viewport 承接，同一轨道贴近视口底部；未声明 minWidth / columnWidths 时由各列 min-content 与 Cell padding 自动汇总整表最小宽度。表头与数据 Cell 左右 padding 按 Table 容器宽度在 4px 到 12px 之间响应，窄容器收敛到每侧 4px，使相邻列最小间距为 8px。",
    },
    logic: ["Semantic", "DisplayOnly", "OSSBoundary"],
}, {
    name: "A4: 已有数据加载 Spinner",
    code: `A4
<Table loadingSpinnerSize={24}><TableHeader><TableRow><TableHead>名称</TableHead></TableRow></TableHeader><TableBody loadingSpinner><TableRow><TableCell>SnowUI</TableCell></TableRow></TableBody></Table>`,
    expected: { render: "数据行后追加一个跨越全部列的 Spinner 状态行。", layout: "Spinner 在 40px 行内水平、垂直居中，尺寸为 24px。", interaction: "加载行不可 hover 或选择。", performance: "复用通用 Spinner，不创建独立动画实现。", responsive: "colspan 跟随已注册表头列数。" },
    logic: ["LoadingSpinner", "ColumnSpan", "SpinnerSize"],
}, {
    name: "A5: 响应式收列与保留列",
    code: `A5
<Table horizontalScroll={false} ariaLabel="订阅列表">
<TableHeader><TableRow><TableHead columnId="name">订阅</TableHead><TableHead columnId="owner">负责人</TableHead><TableHead columnId="status" responsiveHide={false}>状态</TableHead><TableHead columnId="note">备注</TableHead></TableRow></TableHeader>
<TableBody><TableRow><TableCell columnId="name">SnowUI Professional</TableCell><TableCell columnId="owner">Natali Craig</TableCell><TableCell columnId="status">Active</TableCell><TableCell columnId="note">Annual subscription renewal</TableCell></TableRow></TableBody>
</Table>`,
    expected: { render: "纯 Table 根据自身容器宽度响应。", responsive: "先缩左右间距，再隐藏备注和负责人；名称与状态保留。仍超宽时局部滚动，变宽恢复全部列。", interaction: "隐藏列退出焦点顺序，hover 圆角跟随可见首尾。" },
    logic: ["Responsive", "ColumnVisibility", "ScrollFallback"],
}, {
        name: "最后一列长文本",
        code: `<Table horizontalScroll={false}><TableHeader><TableRow><TableHead>订阅</TableHead><TableHead>备注</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell nowrap lines={false}>SnowUIProfessionalAnnualSubscriptionRenewal</TableCell><TableCell>Annual renewal</TableCell></TableRow></TableBody></Table>`,
        expected: { responsive: "备注随宽度逐渐淡出再隐藏；停留 1s 后保留列恢复原透明度，再次缩窄从当前透明度接续；只剩订阅仍放不下时省略显示，hover 查看全文。表格外缘至少 8px，相邻列内容间至少 8px。" },
        logic: ["Responsive", "Truncation"],
    },
];
