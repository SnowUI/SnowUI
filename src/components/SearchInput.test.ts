/**
 * SearchInput.test.ts
 * v1.3.0
 *
 * 测试覆盖：SearchInput.md 定义的默认 Search、外置 leading、清除 X、Input 宿主 Props 平铺。
 */
export const examples = [
    {
        name: "SI-01：基础搜索输入框",
        code: `SI-01
<SearchInput placeholder="Search" style="width: 20rem;" />`,
        logic: ["Basic", "Search"],
    },
    {
        name: "SI-02：有值 + 清除 X",
        code: `SI-02
<SearchInput value="Typing" style="width: 20rem;" />`,
        logic: ["Value", "Clear"],
    },
    {
        name: "SI-03：外置 leading 替换默认图标",
        code: `SI-03
<SearchInput placeholder="Search" style="width: 20rem;">
    <Icon as="leading" background size={16}>S</Icon>
</SearchInput>`,
        logic: ["Leading", "Override"],
    },
    {
        name: "SI-04：Frame 能力透传",
        code: `SI-04
<SearchInput
    placeholder="Search"
    style="width: 20rem;"
    Click={{ Idle: "Active", Active: "Idle" }}
    stateStyle={{
        Idle: "--snowui-input-background: var(--surface-1, #ffffffcc);",
        Active: "--snowui-input-background: var(--black-4, #0000000a);"
    }}
/>`,
        logic: ["Frame", "State"],
    },
    {
        name: "SI-05：无边框嵌入版本",
        code: `SI-05
<SearchInput variant="borderless" placeholder="Search" />`,
        logic: ["Borderless", "EmbeddedSurface"],
    },
    {
        name: "SI-06：平铺 Input 宿主 Props",
        code: `SI-06
<SearchInput
    placeholder="Search"
    size="sm"
    class="bg-surface-1"
    invalid
    error="请输入搜索内容"
    parts={{ Text: { size: "sm" } }}
/>`,
        logic: ["HostSpecialization", "InputProps", "PartsText"],
    },
    {
        name: "SI-07：窄宽度退化为搜索图标",
        code: `SI-07
<SearchInput
    collapseBelow={80}
    placeholder="Search"
    style="width: 1rem;"
/>`,
        expected: {
            render: "空值且未聚焦时仅显示水平居中的 Search 图标，左右间距相等",
            interaction: "点击或键盘聚焦后恢复真实输入控件；输入值存在时保持内容可见",
            responsive: "组件自身宽度不大于 80px 时进入 icon 退化态；即使外部 width 更小，最小宽度仍为左右实际 padding + leading Icon",
        },
        logic: ["ResponsiveCollapse", "Search", "Focus"],
    },
] as const;
