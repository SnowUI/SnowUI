export const examples = [
    {
        name: "CB-01: Button 全部变体",
        code: `CB-01
<CopyButton text="SnowUI" variant="gray" size="sm" />
<CopyButton text="SnowUI" variant="filled" size="sm" />
<CopyButton text="SnowUI" variant="outline" size="sm" />
<CopyButton text="SnowUI" variant="borderless" size="sm" showText={false} />`,
        logic: ["HostSpecialization", "Variant", "Clipboard"],
    },
    {
        name: "CB-02: 无文字模式与图标替换动效",
        code: `CB-02
<CopyButton
    text="SnowUI"
    showText={false}
    variant="gray"
    ariaLabel="复制 SnowUI"
    bare
/>`,
        expected: {
            interaction: "点击后仅 Copy 图标替换为 Check；反馈结束前再次点击无变化、无缩放、无闪动，且按钮不显示 disabled/toggle 视觉",
        },
        logic: ["IconOnly", "StateContent", "ReplacementMotion"],
    },
] as const;
