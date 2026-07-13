/**
 * SearchInput.test.ts
 * v1.2.0
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
] as const;
