export const examples = [
    {
        name: "CSB-01: Button 全部变体与尺寸",
        code: `CSB-01
<ColorSchemeButton variant="gray" size="sm" />
<ColorSchemeButton variant="filled" size="md" />
<ColorSchemeButton variant="outline" size="lg" />
<ColorSchemeButton variant="borderless" size="sm" />
<ColorSchemeButton bare size="sm" />`,
        expected: {
            interaction: "每个按钮点击后立即在亮色与暗色之间切换；图标同步切换且没有替换动效",
            render: "内置图标跟随 Button 尺寸：sm / md / lg 分别为 16 / 20 / 24px",
        },
        logic: ["HostSpecialization", "Variant", "Size", "ColorScheme"],
    },
    {
        name: "CSB-02: 默认方案与禁用状态",
        code: `CSB-02
<ColorSchemeButton defaultScheme="dark" variant="gray" />
<ColorSchemeButton variant="outline" disabled />`,
        expected: {
            interaction: "页面从暗色开始；两个按钮同步显示当前方案，禁用按钮不改变方案",
        },
        logic: ["defaultScheme", "Disabled", "AriaPressed"],
    },
    {
        name: "CSB-03: Locale 与受控宿主",
        code: `CSB-03
<LocaleProvider locale="en-US">
    <ColorSchemeButton scheme="light" applyToDocument={false} bare>
        <Text>Appearance</Text>
    </ColorSchemeButton>
</LocaleProvider>`,
        expected: {
            render: "按钮使用英文切换名称和可见内容；显式状态不修改 document",
        },
        logic: ["LocaleProvider", "ExplicitScheme", "children"],
    },
] as const;
