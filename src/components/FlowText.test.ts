/**
 * FlowText.test.ts
 * v2.0.0
 *
 * 变更记录 (2026-03-05):
 * - 移除示例中的 script 标签与导入语句，符合 ComponentGuidelines §13.3 规范。
 * - 示例仅包含纯模板代码，依赖由测试环境自动注入。
 */
export const examples = [
    {
        name: "1: 基础文本与数字显示",
        code: `1
<Frame row class="gap-16 items-center">
    <FlowText value="Deploy Ready" />
    <FlowText value={42} />
</Frame>`,
        expected: {
            render: "显示文本 Deploy Ready 与数字 42，均使用统一纵向 flow 与 opacity presence",
        },
        logic: ["Motion", "Text"],
    },
    {
        name: "2: 带前缀与趋势感知方向",
        code: `2
<FlowText value={100} textPosition="right" rollDirection="normal">
    <Text weight="bold" interactive={false}>$</Text>
</FlowText>`,
        expected: {
            render: "显示 $100，数值趋势使用公共分类能力",
            layout: "$ 在左侧，数字在右侧",
        },
        logic: ["Motion", "Composition"],
    },
    {
        name: "3: 反向滚动语义",
        code: `3
<Frame row class="gap-24 items-center">
    <FlowText value={12840} rollDirection="reverse" class="text-24 font-semibold text-green" />
    <FlowText value={-2840} rollDirection="reverse" class="text-24 font-semibold text-red" />
</Frame>`,
        expected: {
            render: "显示一个正数和一个负数。",
            interaction: "rollDirection=reverse 使用与 normal 相反的趋势方向。",
        },
        logic: ["Motion", "rollDirection", "NegativeNumber"],
    },
    {
        name: "4: 统一排版、颜色与 label 角色",
        code: `4
<Field>
    <FlowText
        value={12840}
        as="label"
        font="--font-mono"
        size="--text-12"
        weight={600}
        lineHeight="--leading-12"
        color="Primary"
        motionColor="Indigo"
    />
    <Input value="Revenue" />
</Field>`,
        expected: {
            render: "显示格式化数字并在变化时使用 Indigo 变化色",
            layout: "FlowText 作为 Field 的 label 角色参与布局",
        },
        logic: ["Typography", "motionColor", "as"],
    },
    {
        name: "5: 非数字共享字符过渡",
        code: `5
<FlowText value="SnowUI" motionColor="Indigo" />`,
        expected: {
            render: "从 SnowUl Motion 变化为 SnowUI 时显示最终文字 SnowUI",
            interaction:
                "变化字符使用 number-flow 的纵向数位流与 AnimatePresence opacity，剩余不变文字通过公共区段 FLIP 平移到最终位置",
        },
        logic: ["Motion", "TextDiff", "CharacterTransition", "FLIP"],
    },
] as const;
