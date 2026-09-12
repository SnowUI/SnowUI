/**
 * Listbox.test.ts
 * v1.1.0
 * 变更记录 (2026-04-20): 移除 Combobox 示例（组件已废弃）；新增 LB-06/LB-07 覆盖
 *   Input as="search" 搜索过滤与 allowCustomValue 自定义选项功能。
 *
 * 覆盖：Listbox 作为 Select 宿主的下拉面板；内嵌 Input as="search" 启用搜索过滤。
 * 注意：Listbox 本身无独立 Props，所有状态通过 ListboxOwnerContext 从宿主获取，
 *       示例须嵌套在 Select 内使用。
 */
export const examples = [
    {
        name: "LB-01：嵌套在 Select 内（基础渲染）",
        code: `LB-01
<Select placeholder="请选择城市" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "点击 Select 后，Listbox 浮层出现，带 Quick Action 背景色、毛玻璃模糊、圆角和阴影",
            layout: "浮层宽度与 Select 等宽，选中项中心对齐 Trigger",
            interaction: "点击选项后浮层收起，Select 显示选中项文本",
        },
        logic: ["Basic", "Portal"],
    },
    {
        name: "LB-02：内嵌搜索框过滤",
        code: `LB-02
<Select placeholder="请选择城市" style="width: 20rem;">
    <Listbox>
        <Input as="search" placeholder="搜索城市..." />
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
        <MenuItem as="item" value="beijing">Beijing</MenuItem>
        <MenuItem as="item" value="guangzhou">Guangzhou</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层顶部显示搜索输入框，输入文字后实时过滤选项",
            interaction: "匹配的选项保留，不匹配的隐藏；选中项被过滤、无匹配及清空时搜索框与面板顶部保持打开时的位置；关闭后搜索框自动清空，再次打开重新对齐",
        },
        logic: ["Filter", "Search"],
    },
    {
        name: "LB-03：默认完整显示十项后滚动",
        code: `LB-03
<Select placeholder="请选择" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="1">Option 1</MenuItem>
        <MenuItem as="item" value="2">Option 2</MenuItem>
        <MenuItem as="item" value="3">Option 3</MenuItem>
        <MenuItem as="item" value="4">Option 4</MenuItem>
        <MenuItem as="item" value="5">Option 5</MenuItem>
        <MenuItem as="item" value="6">Option 6</MenuItem>
        <MenuItem as="item" value="7">Option 7</MenuItem>
        <MenuItem as="item" value="8">Option 8</MenuItem>
        <MenuItem as="item" value="9">Option 9</MenuItem>
        <MenuItem as="item" value="10">Option 10</MenuItem>
        <MenuItem as="item" value="11">Option 11</MenuItem>
        <MenuItem as="item" value="12">Option 12</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层按实际 Item 高度完整显示十项，第十一、十二项进入滚动区域",
            layout: "默认高度不会裁出半个 Item；选项列表可滚动，面板圆角和阴影不受裁切",
        },
        logic: ["Scroll", "DefaultVisibleItems", "WholeItemHeight"],
    },
    {
        name: "LB-04：含默认值时选中项对齐 Trigger",
        code: `LB-04
<Select defaultValue="hangzhou" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层打开后，选中项（Hangzhou）垂直方向与 Trigger 中心对齐",
            interaction: "选中项左侧显示 check 图标",
        },
        logic: ["Positioning", "SelectedAlignment"],
    },
    {
        name: "LB-05：键盘导航",
        code: `LB-05
<Select placeholder="键盘操作" style="width: 20rem;">
    <Listbox>
        <MenuItem as="item" value="apple">Apple</MenuItem>
        <MenuItem as="item" value="banana">Banana</MenuItem>
        <MenuItem as="item" value="cherry">Cherry</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            interaction: "↑↓ 移动高亮，Enter 确认，Escape 关闭并还原焦点到 Trigger，Tab 关闭",
        },
        logic: ["Keyboard", "ARIA"],
    },
    {
        name: "LB-06：搜索过滤 + 自定义最大高度",
        code: `LB-06
<Select placeholder="请选择框架" style="width: 20rem;">
    <Listbox maxHeight={200}>
        <Input as="search" placeholder="搜索..." />
        <MenuItem as="item" value="svelte">Svelte</MenuItem>
        <MenuItem as="item" value="react">React</MenuItem>
        <MenuItem as="item" value="vue">Vue</MenuItem>
        <MenuItem as="item" value="solid">Solid</MenuItem>
        <MenuItem as="item" value="qwik">Qwik</MenuItem>
        <MenuItem as="item" value="angular">Angular</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层高度限制在 200px，超出时滚动；顶部搜索框固定可见",
            interaction: "输入 'r' 后只显示 React；清空后恢复全部",
        },
        logic: ["Filter", "Search", "MaxHeight", "Scroll"],
    },
    {
        name: "LB-07：搜索 + allowCustomValue 自定义选项",
        code: `LB-07
<Select placeholder="选择或输入标签" style="width: 20rem;">
    <Listbox>
        <Input as="search" allowCustomValue placeholder="搜索或输入新标签..." />
        <MenuItem as="item" value="design">Design</MenuItem>
        <MenuItem as="item" value="engineering">Engineering</MenuItem>
        <MenuItem as="item" value="product">Product</MenuItem>
    </Listbox>
</Select>`,
        expected: {
            render: "浮层顶部显示搜索框；输入已有选项名可过滤",
            interaction: "输入无匹配文本后按 Enter，新增自定义选项并选中；自定义项 hover 时显示 X 可删除",
        },
        logic: ["Filter", "Search", "CustomValue"],
    },
    {
        name: "LB-08：items 默认内置 MenuItem",
        code: `LB-08
<Select placeholder="选择框架">
    <Listbox
        items={[
            { value: "svelte", label: "Svelte" },
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" }
        ]}
    />
</Select>`,
        expected: {
            render: "无需显式书写 Input / MenuItem；默认显示搜索框，面板按实际 Item 高度完整显示最多 10 项，溢出时显示浮层滚动条",
        },
        logic: ["BuiltInMode", "Input", "MenuItem"],
    },
    {
        name: "LB-09：默认内置模式配置",
        code: `LB-09
<Select placeholder="选择框架" style="width: 20rem;">
    <Listbox
        items={[
            { value: "svelte", label: "Svelte" },
            { value: "react", label: "React" },
            { value: "vue", label: "Vue" },
            { value: "solid", label: "Solid" },
            { value: "qwik", label: "Qwik" },
            { value: "angular", label: "Angular" }
        ]}
        maxHeight={160}
        scrollbar={true}
        parts={{
            Input: { placeholder: "搜索框架..." }
        }}
    />
</Select>`,
        expected: {
            render: "内置搜索框固定在顶部，列表最大高度为 160px；选项溢出后显示浮层滚动条",
            interaction: "搜索框过滤内置 items；可用 search={false} 或 scrollbar={false} 分别关闭对应能力",
        },
        logic: ["BuiltInMode", "Parts", "Search", "MaxHeight", "Scroll"],
    },
    {
        name: "B14：连续 Hover 与关闭开关",
        code: `B14
<Listbox items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
<Listbox continuousHover={false} items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />`,
        expected: {
            render: "默认实例生成一个共享背景层，关闭实例使用 MenuItem 原有背景。",
            layout: "背景匹配直接 MenuItem 的宽高和圆角。",
            interaction: "指针跨过项间隙时背景连续移动；disabled / filtered 项被跳过。",
            performance: "容器级 rAF 与共享 ResizeObserver。",
            responsive: "滚动和尺寸变化时重新测量。",
        },
        logic: ["ContinuousHover", "OptOut"],
    },
] as const;
