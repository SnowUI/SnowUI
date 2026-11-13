export const examples = [
    {
        name: "SB-01: 默认内置与宿主样式",
        code: `SB-01
<SelectButton
    variant="borderless"
    size="sm"
    placeholder="选择框架"
    bare
    options={[
        { value: "svelte", label: "Svelte" },
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" }
    ]}
/>`,
        logic: ["HostSpecialization", "BuiltInMode"],
    },
    {
        name: "SB-02: Input parts 与紧凑 Listbox",
        code: `SB-02
<SelectButton
    variant="outline"
    options={[
        { value: "10", label: "10" },
        { value: "20", label: "20" },
        { value: "50", label: "50" }
    ]}
    parts={{
        Input: { placeholder: "搜索数量..." },
        Listbox: { search: false, matchTriggerWidth: false }
    }}
/>`,
        logic: ["Parts", "Listbox"],
    },
    {
        name: "SB-03: 显式组合模式",
        code: `SB-03
<SelectButton placeholder="选择">
    <Listbox search={false}>
        <MenuItem as="item" value="a">选项 A</MenuItem>
        <MenuItem as="item" value="b">选项 B</MenuItem>
    </Listbox>
</SelectButton>`,
        expected: {
            layout: "选项文字单行显示，各项 fill Listbox 锁定宽度",
            render: "选中项不显示 check 图标",
            interaction: "Button 宿主 hover 默认不放大背景",
        },
        logic: ["ExplicitComposition", "ScaleOnHoverDefaultOff"],
    },
    {
        name: "SB-04: Input placeholder 回归",
        code: `SB-04
<SelectButton
    search
    placeholder="选择框架"
    options={[{ value: "svelte", label: "Svelte" }]}
    parts={{ Input: { placeholder: "搜索框架..." } }}
/>`,
        logic: ["Parts", "Input", "Regression"],
    },
    {
        name: "SB-05: PageSize 紧凑形态",
        code: `SB-05
<SelectButton
    variant="borderless"
    defaultValue="20"
    options={[{ value: "10", label: "10" }, { value: "20", label: "20" }]}
    parts={{ Listbox: { search: false, matchTriggerWidth: false } }}
/>`,
        logic: ["Compact", "Pagination"],
    },
    {
        name: "SB-06: 长触发器与选中项恢复",
        code: `SB-06
<SelectButton
    defaultValue="updated"
    options={[{ value: "created", label: "创建时间" }, { value: "updated", label: "最近更新" }, { value: "name", label: "名称" }]}
>
    {#snippet label({ option, placeholder })}
        {option ? \`排序：\${option.label}\` : placeholder}
    {/snippet}
</SelectButton>`,
        expected: { layout: "面板不窄于按钮，水平居中；选中项中心对齐触发器，视口不足时避让。", interaction: "选择另一项再打开，恢复该项高亮与滚动定位；定制label不丢失value。" },
        logic: ["LabelSnippet", "SelectionRestore"],
    },
    {
        name: "SB-07: Indicator 控制",
        code: `SB-07
<SelectButton showIndicator={false} placeholder="无箭头" options={[]} />
<SelectButton placeholder="自定义箭头" options={[]}>
    {#snippet indicator()}
        <Icon><ArrowLineDown /></Icon>
    {/snippet}
</SelectButton>`,
        logic: ["Indicator"],
    },
    {
        name: "SB-08: Button 宿主变体",
        code: `SB-08
<SelectButton variant="gray" size="sm" placeholder="Gray" options={[]} />
<SelectButton variant="filled" size="md" placeholder="Filled" options={[]} />
<SelectButton variant="outline" size="lg" placeholder="Outline" options={[]} />
<SelectButton bare placeholder="Bare" options={[]} />`,
        expected: {
            render: "每个实例只显示真实 Button 宿主的 variant，不出现 Select Field 外层边框。",
            layout: "无视觉 wrapper 与 Button 宿主同尺寸，不额外增加 padding、border 或圆角。",
        },
        logic: ["HostSpecialization", "Variant", "Size", "VisualWrapper"],
    },
    {
        name: "SB-09: 禁用与 ARIA",
        code: `SB-09
<SelectButton disabled ariaLabel="禁用选择器" placeholder="不可选择" options={[]} />`,
        logic: ["Disabled", "ARIA"],
    },
    {
        name: "SB-10: 表单提交",
        code: `SB-10
<form>
    <SelectButton
        name="framework"
        defaultValue="svelte"
        options={[{ value: "svelte", label: "Svelte" }]}
    />
</form>`,
        logic: ["Form", "Value"],
    },
    {
        name: "SB-11: Action 模式",
        code: `SB-11
<SelectButton
    selectionMode="action"
    search={false}
    placeholder="操作"
    options={[
        { value: "copy", label: "复制" },
        { value: "rename", label: "重命名这个项目" }
    ]}
    onAction={(value) => console.log(value)}
/>`,
        expected: {
            layout: "Listbox 按最长选项确定固定宽度，所有选项 fill",
            interaction: "执行命令后 trigger 始终显示操作，不保存选中值",
        },
        logic: ["Action", "ContentWidth", "MenuItem"],
    },
] as const;
