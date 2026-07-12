/**
 * NumberFlow.test.ts
 * v1.1.0
 *
 * 变更记录 (2026-03-05):
 * - 移除示例中的 script 标签与导入语句，符合 ComponentGuidelines §13.3 规范。
 * - 示例仅包含纯模板代码，依赖由测试环境自动注入。
 */
export const examples = [
    {
        name: "1: 基础数字显示",
        code: `1
<NumberFlow value={42} />`,
        expected: {
            render: "显示数字 42，带滚轮动效",
        },
        logic: ["Motion"],
    },
    {
        name: "2: 带前缀与趋势感知方向",
        code: `2
<NumberFlow value={100} numberPosition="right" rollDirection="normal">
    <Text weight="bold" interactive={false}>$</Text>
</NumberFlow>`,
        expected: {
            render: "显示 $100，数值增加时向上滚动",
            layout: "$ 在左侧，数字在右侧",
        },
        logic: ["Motion", "Composition"],
    },
    {
        name: "3: 反向滚动语义",
        code: `3
<Frame row class="gap-24 items-center">
    <NumberFlow value={12840} rollDirection="reverse" class="text-24 font-semibold text-green" />
    <NumberFlow value={-2840} rollDirection="reverse" class="text-24 font-semibold text-red" />
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
    <NumberFlow
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
            layout: "NumberFlow 作为 Field 的 label 角色参与布局",
        },
        logic: ["Typography", "motionColor", "as"],
    },
] as const;
