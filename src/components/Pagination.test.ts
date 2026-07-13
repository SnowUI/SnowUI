/**
 * Pagination.test.ts
 * v1.3.0
 * 变更记录 (2026-05-26): 新增 Pagination 角色模板式示例。
 */
export const examples = [
    {
        name: "A1: 短页数",
        code: `A1
<Pagination page={1} total={5}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染 1 2 3 4 5 和内置 prev / next 箭头。",
            layout: "Pagination 为 Hug 宽度时，所有元素保持 Hug。",
            interaction: "当前页和上一页不可点击，其余页码和下一页可点击。",
            performance: "只使用 current / page 两个模板生成全部页码。",
            responsive: "内容过长时允许换行。",
        },
        logic: ["Template", "Short", "DefaultControls"],
    },
    {
        name: "A2: 长页数首页",
        code: `A2
<Pagination page={1} total={22}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染 1 2 3 ... 22 和内置箭头。",
            layout: "省略符与页码共享 4px 间距。",
            interaction: "上一页不可点击，下一页可跳转到第 2 页。",
            performance: "隐藏中间页码，只生成可见窗口。",
            responsive: "省略符不参与焦点。",
        },
        logic: ["Ellipsis", "Start"],
    },
    {
        name: "A3: 长页数中间页",
        code: `A3
<Pagination page={11} total={22}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染 1 ... 10 11 12 ... 22。",
            layout: "双省略符分别位于当前页窗口两侧。",
            interaction: "当前页不可点击，左右页码可触发页码变化。",
            performance: "页码窗口由 page / total 计算。",
            responsive: "长分页允许换行。",
        },
        logic: ["Ellipsis", "Middle"],
    },
    {
        name: "A4: 长页数末页",
        code: `A4
<Pagination page={22} total={22}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染 1 ... 20 21 22。",
            layout: "末页窗口贴近尾部边界。",
            interaction: "下一页不可点击，上一页可点击。",
            performance: "末页窗口不渲染无效页码。",
            responsive: "尾部页码保持连续。",
        },
        logic: ["Ellipsis", "End"],
    },
    {
        name: "A5: 自定义前后按钮",
        code: `A5
<Pagination page={2} total={5}>
    <Button as="current" variant="filled" />
    <Button as="page" variant="outline" />
    <Button as="prev">上一页</Button>
    <Button as="next">下一页</Button>
</Pagination>`,
        expected: {
            render: "使用使用方提供的 prev / next Button 模板。",
            layout: "自定义 Button 保持 Button 自己的 padding、边框和 hover。",
            interaction: "Pagination 接管点击目标页。",
            performance: "不新增 PageButton 组件。",
            responsive: "自定义模板仍参与自动换行。",
        },
        logic: ["CustomTemplate", "Controls"],
    },
    {
        name: "A6: 固定宽度自动 Fill",
        code: `A6
<Pagination page={1} total={5} style="width: 21.25rem;">
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "在固定宽度中渲染完整短分页。",
            layout: "可见页码、prev、next 等宽填满容器；省略符保持 Hug。",
            interaction: "宽度模式不改变可点击规则。",
            performance: "无需 buttonWidth prop。",
            responsive: "容器宽度变化时可重新判断 Hug / Fill。",
        },
        logic: ["Width", "Fill"],
    },
    {
        name: "A7: 整体禁用",
        code: `A7
<Pagination page={3} total={5} disabled>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "所有生成项处于不可点击状态。",
            layout: "禁用状态不改变页码窗口。",
            interaction: "不触发 onPageChange。",
            performance: "统一由 Pagination disabled 管理。",
            responsive: "禁用状态不影响换行。",
        },
        logic: ["Disabled"],
    },
    {
        name: "A8: 某一页禁用",
        code: `A8
<Pagination page={1} total={5} disabledPages={[3]}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染 1 2 3 4 5，其中第 3 页处于不可点击状态。",
            layout: "单页禁用不改变页码窗口和 4px 间距。",
            interaction: "点击第 3 页不触发 onPageChange，其他可用页仍可点击。",
            performance: "禁用页由 Pagination 统一管理。",
            responsive: "禁用页在换行时保持原有尺寸策略。",
        },
        logic: ["DisabledPage"],
    },
    {
        name: "A9: 设计稿样式还原",
        code: `A9
<Pagination page={1} total={22} style="width: 21.25rem;">
    <Button as="current" variant="gray" />
    <Button as="page" variant="outline" />
    <Button as="prev" variant="outline" bare>
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M20.68 7.293a.943.943 0 0 1 0 1.414l-7.18 6.586a.943.943 0 0 0 0 1.414l7.18 6.586a.943.943 0 0 1 0 1.414c-.425.39-1.116.39-1.541 0l-7.181-6.586c-1.277-1.171-1.277-3.07 0-4.242l7.18-6.586a1.16 1.16 0 0 1 1.543 0" clip-rule="evenodd" /></svg>
    </Button>
    <Button as="next" variant="outline" bare>
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M11.32 24.707a.943.943 0 0 1 0-1.414l7.18-6.586a.943.943 0 0 0 0-1.414l-7.18-6.586a.943.943 0 0 1 0-1.414 1.16 1.16 0 0 1 1.541 0l7.181 6.586c1.277 1.171 1.277 3.07 0 4.242l-7.18 6.586c-.427.39-1.117.39-1.543 0" clip-rule="evenodd" /></svg>
    </Button>
</Pagination>`,
        expected: {
            render: "使用 Button 模板还原设计稿中的当前页灰底、普通页描边和前后箭头按钮。",
            layout: "固定宽度下所有按钮等宽填满容器，省略符保持 Hug。",
            interaction: "第一页时上一页不可点击，其他页码与下一页可点击。",
            performance: "样式由模板复用，页码仍由 Pagination 生成。",
            responsive: "固定宽度变化时重新判断 Fill。",
        },
        logic: ["Design", "Template", "Fill"],
    },
    {
        name: "A10: 完全默认样式",
        code: `A10
<Pagination page={1} total={22} pageSize={20} pageSizeOptions={[10, 20, 50]} />`,
        expected: {
            render: "不提供模板时，pageSize 位于左侧，当前页使用 gray Button，其余分页与前后页使用 outline Button。",
            layout: "pageSize 保持 Hug，与右侧等宽 Fill 分页组间隔 16px。",
            interaction: "页数选择、页码与前后页均使用内置交互。",
            performance: "默认模板由 Pagination 内部统一生成。",
            responsive: "分页组填满 pageSize 之外的剩余宽度。",
        },
        logic: ["DefaultStyle", "BuiltInMode", "PageSize", "Fill"],
    },
    {
        name: "A11: 显式 Fill，省略符 Hug",
        code: `A11
<Pagination widthMode="fill" page={11} total={22}>
    <Button as="current" />
    <Button as="page" />
    <Button as="prev" />
    <Button as="next" />
</Pagination>`,
        expected: {
            render: "渲染双省略符、全部当前窗口按钮，以及空 prev / next 模板自动注入的默认箭头。",
            layout: "current/page/prev/next 等宽填充；两个省略符保持 Hug。",
            interaction: "宽度模式不改变页码行为。",
            performance: "显式 Fill 不启动 ResizeObserver 测量。",
            responsive: "按钮遵守最小点击尺寸，空间不足时允许换行。",
        },
        logic: ["WidthMode", "Fill", "EllipsisHug"],
    },
    {
        name: "A12: 显式 Hug",
        code: `A12
<Pagination widthMode="hug" page={1} total={5}>
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "渲染短分页。",
            layout: "根与全部生成项保持内容宽度。",
            interaction: "宽度模式不改变页码行为。",
            performance: "显式 Hug 不启动 ResizeObserver 测量。",
            responsive: "外部容器变宽时不拉伸。",
        },
        logic: ["WidthMode", "Hug"],
    },
    {
        name: "A13: 每页条数选择",
        code: `A13
<Pagination
    widthMode="fill"
    page={1}
    total={5}
    gap={4}
    pageSize={20}
    pageSizeOptions={[10, 20, 50]}
    pageSizeGap={16}
    onPageSizeChange={(pageSize) => console.log("pageSize", pageSize)}
>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>`,
        expected: {
            render: "分页最右侧显示当前值 20 和 ArrowLineDown。",
            layout: "每页条数选择器保持 Hug，与分页按钮组间距 16px；组内按钮仍使用 Pagination 默认 gap。",
            interaction: "点击后通过 Listbox 选择 10、20 或 50，并触发 onPageSizeChange。",
            performance: "未传 pageSizeOptions 时不渲染选择器。",
            responsive: "空间不足时选择器与页码区域可以换行。",
        },
        logic: ["PageSize", "Listbox", "Fill", "Right"],
    },
    {
        name: "A14: 每页条数选择置于左侧",
        code: `A14
<Pagination
    widthMode="fill"
    page={1}
    total={5}
    pageSize={20}
    pageSizeOptions={[10, 20, 50]}
>
    <Button as="pageSize" variant="borderless" />
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "每页条数选择器显示在页码之前。",
            layout: "pageSize 模板的声明顺序决定选择器位于左侧。",
            interaction: "Button 触发内置 Listbox，键盘、鼠标与触屏均可选择。",
            performance: "只复用一个 pageSize Button 模板。",
            responsive: "整体仍遵守 Pagination 的换行与 Fill 策略。",
        },
        logic: ["PageSize", "TemplateOrder", "Left"],
    },
    {
        name: "A15: inline gap 覆盖 pageSizeGap",
        code: `A15
<Pagination
    widthMode="fill"
    page={1}
    total={5}
    gap={4}
    pageSize={20}
    pageSizeOptions={[10, 20, 50]}
    pageSizeGap={16}
    style="gap: 24px;"
>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>`,
        expected: {
            render: "渲染页码按钮组与右侧 pageSize。",
            layout: "inline style gap=24px 覆盖 pageSizeGap=16px；按钮组内部仍使用 gap=4px。",
            interaction: "pageSize 继续通过 Listbox 选择。",
            performance: "间距映射不新增观察器。",
            responsive: "Fill 模式下 pageSize 保持 Hug。",
        },
        logic: ["Gap", "InlineStylePriority", "PageSize"],
    },
    {
        name: "A16: 无 pageSize 的 inline gap",
        code: `A16
<Pagination page={1} total={5} gap={4} style="gap: 12px;">
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        expected: {
            render: "只渲染页码与 prev / next。",
            layout: "没有 pageSize 时，inline style gap=12px 覆盖普通 gap=4px。",
            interaction: "页码行为保持不变。",
            performance: "不渲染 pageSize 与 Listbox。",
            responsive: "Hug / Fill 判断保持原行为。",
        },
        logic: ["Gap", "InlineStylePriority", "NoPageSize"],
    },
    {
        name: "A15: parts 统一配置内置选择项",
        code: `A15
<Pagination
    page={1}
    total={5}
    pageSize={20}
    pageSizeOptions={[10, 20, 50]}
    parts={{
        Listbox: { matchTriggerWidth: false },
        MenuItem: { showCheck: false },
    }}
>
    <Button as="pageSize" variant="borderless" />
    <Button as="current" />
    <Button as="page" />
</Pagination>`,
        logic: ["Parts", "Listbox", "MenuItem"],
    },
] as const;
