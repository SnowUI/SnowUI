/**
 * SearchBox.test.ts
 * v1.1.0
 *
 * 测试覆盖：SearchBox.md 定义的 variant、外置 Kbd、清除 X、禁用态、点击弹出 SearchPopup。
 */
export const examples = [
    {
        name: "SB-01：灰底搜索框 + 外置 Kbd",
        code: `SB-01
<SearchBox style="width: 10rem;" placeholder="搜索">
    <Kbd as="trailing">/</Kbd>
</SearchBox>`,
        logic: ["Variant", "Kbd"],
    },
    {
        name: "SB-02：边框搜索框",
        code: `SB-02
<SearchBox variant="outline" style="width: 10rem;">
    <Kbd as="trailing">⌘K</Kbd>
</SearchBox>`,
        logic: ["Variant"],
    },
    {
        name: "SB-03：有值 + 清除 X",
        code: `SB-03
<SearchBox value="Typing" variant="outline" style="width: 10rem;" />`,
        logic: ["Value", "Clear"],
    },
    {
        name: "SB-04：禁用态",
        code: `SB-04
<SearchBox disabled placeholder="Search" style="width: 10rem;" />`,
        logic: ["Disabled"],
    },
    {
        name: "SB-05：点击弹出 Popover(中尺寸,SearchPopup 已合并入 Popover)",
        code: `SB-05
<Popover template id="sb-05-popup" size="md" closeOnSelect={false} style="width: 20rem;">
    <SearchInput placeholder="Search" />
    <MenuItem value="overview" active closeOnSelect={false}>
        <Icon as="leading"><Resource.MagnifyingGlass /></Icon>
        搜索历史：Overview
    </MenuItem>
    <MenuItem value="contact-byewind" closeOnSelect={true}>
        <Avatar src={AvatarByewind} size={24} as="leading" />
        联系人：Byewind
    </MenuItem>
</Popover>

<SearchBox data-popover-target="sb-05-popup" placeholder="Search" style="width: 14rem;">
    <Kbd as="trailing">⌘K</Kbd>
</SearchBox>`,
        expected: {
            render: "点击 SearchBox 后弹出中尺寸 Popover,视觉与 Listbox 一致(padding 16px / radius 24px)",
            interaction: "点击搜索历史默认不关闭(closeOnSelect={false}),点击联系人通过 closeOnSelect={true} 关闭",
        },
        logic: ["Template", "Popover", "Click", "CloseOnSelect"],
    },
    {
        name: "SB-06：窄宽度退化为搜索图标",
        code: `SB-06
<SearchBox
    collapseBelow={80}
    placeholder="Search"
    aria-label="Search"
    style="width: 1rem;"
/>`,
        expected: {
            render: "仅保留 leading Search 图标，文本和 trailing 不占布局",
            interaction: "图标态仍保持整个 SearchBox 可点击和可键盘打开",
            responsive: "组件自身宽度不大于 80px 时进入 icon 退化态；即使外部 width 更小，最小宽度仍为左右实际 padding + leading Icon",
        },
        logic: ["ResponsiveCollapse", "Search", "Keyboard"],
    },
] as const;
