/**
 * NumericText.test.ts
 * v1.0.0
 *
 * 覆盖文字变化、数字格式化、方向控制、统一排版与 SnowUI 样式继承。
 */
// motionColor 的全文索引、回落顺序及快速更新由 Playground text-motion-color-sequence 浏览器回归验证。
export const examples = [
    {
        name: "A1: 基础文字与数字",
        code: `A1
<Frame row class="gap-16 items-center">
    <NumericText value="Ready" class="text-16 text-black" />
    <NumericText value={12840} class="text-24 font-semibold text-blue" />
</Frame>`,
        expected: {
            render: "显示 Ready 与 12840，内容变化时按 NumericText 动效过渡",
            layout: "两个实例以内联方式排列，字体与颜色来自外部类",
        },
        logic: ["Text", "Motion"],
    },
    {
        name: "A2: 数字格式化",
        code: `A2
<Frame column class="gap-8">
    <NumericText
        value={9824.5}
        locales="en-US"
        format={{ style: "currency", currency: "USD" }}
        class="text-24 font-semibold text-green"
    />
    <NumericText
        value={0.736}
        locales="en-US"
        format={{ style: "percent", maximumFractionDigits: 1 }}
        class="text-16 text-purple"
    />
</Frame>`,
        expected: {
            render: "显示货币与百分比格式化结果",
            layout: "纵向排列，保持单行文本宽度",
        },
        logic: ["Format", "Token"],
    },
    {
        name: "A3: 方向与 motionColor",
        code: `A3
<Frame row class="gap-16 items-center">
    <NumericText value="Build 42" trend={1} motionColor="Primary" class="text-20 text-black" />
    <NumericText value="Build 12" trend={-1} motionColor="Purple" class="text-20 text-red" />
</Frame>`,
        expected: {
            render: "两个文本分别使用固定向上与向下趋势",
            interaction: "外部更新 value 时按各自趋势播放，并从 motionColor 回到最终文字颜色",
        },
        logic: ["Trend", "Transition"],
    },
    {
        name: "A4: 组合与 as 角色",
        code: `A4
<Button variant="outline">
    <Text as="leading" interactive={false}>Status</Text>
    <NumericText value="Online" as="trailing" class="text-14 text-primary" />
</Button>`,
        expected: {
            render: "按钮中显示 Status 与 Online",
            layout: "NumericText 作为 trailing 角色参与外层槽位布局",
        },
        logic: ["Composition", "Frame"],
    },
    {
        name: "A5: 固定宽度对齐",
        code: `A5
<Frame column class="gap-8" style="width: 16rem;">
    <NumericText value="Left 42" align="left" class="w-full text-16 text-black" />
    <NumericText value="Center 42" align="center" class="w-full text-16 text-blue" />
    <NumericText value="Right 42" align="right" class="w-full text-16 text-purple" />
</Frame>`,
        expected: {
            render: "三行文本分别左对齐、居中、右对齐",
            layout: "align 只在组件具备明确宽度时产生可见效果",
        },
        logic: ["Align", "Layout"],
    },
    {
        name: "A6: 统一排版与 label 角色",
        code: `A6
<Field>
    <NumericText
        value="Revenue"
        as="label"
        font="--font-mono"
        size="--text-12"
        weight={600}
        lineHeight="--leading-12"
        color="Primary"
        motionColor="Indigo"
    />
    <Input value="$12,840" />
</Field>`,
        expected: {
            render: "NumericText 使用统一排版 Props 显示 Revenue",
            layout: "组件通过 as=label 接入 Field 标签角色",
        },
        logic: ["Typography", "motionColor", "as"],
    },
] as const;
