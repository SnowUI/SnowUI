export const examples = [
    {
        name: "STB-01: Button 全部变体与尺寸",
        code: `STB-01
<StyleButton variant="gray" size="sm" />
<StyleButton variant="filled" size="md" />
<StyleButton variant="outline" size="lg" />
<StyleButton variant="borderless" size="sm" />
<StyleButton bare size="sm" />`,
        expected: {
            interaction: "每个按钮点击后立即在 SnowUI 与 Apple 风格之间切换且没有替换动效",
            render: "SnowUI 状态使用 SnowUI Logo，Apple 状态使用 Apple 品牌 Logo；两者跟随 Button 尺寸并统一使用 icon-only padding",
        },
        logic: ["HostSpecialization", "Variant", "Size", "StyleMode"],
    },
    {
        name: "STB-02: 默认风格与禁用状态",
        code: `STB-02
<StyleButton defaultMode="apple" variant="gray" />
<StyleButton variant="outline" disabled />`,
        expected: {
            interaction: "页面从 Apple 风格开始；两个按钮同步显示当前风格，禁用按钮不改变风格",
        },
        logic: ["defaultMode", "Disabled", "AriaPressed"],
    },
    {
        name: "STB-03: Locale 与受控宿主",
        code: `STB-03
<LocaleProvider locale="en-US">
    <StyleButton mode="snowui" applyToDocument={false} bare>
        <Text>Style</Text>
    </StyleButton>
</LocaleProvider>`,
        expected: {
            render: "按钮使用英文切换名称和可见内容；显式状态不修改 document",
        },
        logic: ["LocaleProvider", "ExplicitMode", "children"],
    },
] as const;
