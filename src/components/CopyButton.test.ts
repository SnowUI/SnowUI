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
    {
        name: "CB-03: 自定义异步复制",
        code: `CB-03
<CopyButton
    bare
    showText={false}
    text="SnowUI custom copy"
    writeText={async (text) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        await navigator.clipboard.writeText(text);
    }}
/>`,
        expected: {
            interaction: "等待业务复制完成后显示 Check 并保持 1600ms；等待及反馈期间重复点击不重复执行复制。复制失败时不显示 Check。",
        },
        logic: ["Clipboard", "Async", "Bare", "Feedback"],
    },
] as const;
