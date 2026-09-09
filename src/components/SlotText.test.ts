/**
 * SlotText.test.ts
 * v1.1.0
 *
 * 覆盖槽位滚动、Replay、方向、数字趋势、排版 Token、颜色 Token 与组合场景。
 */
// motionColor 的全文索引、回落顺序及快速更新由 Playground text-motion-color-sequence 浏览器回归验证。
export const examples = [
    {
        name: "A1: 基础槽位滚动",
        code: `A1
<Frame column class="gap-12">
    <SlotText
        text="Slot Text"
        size="--text-48"
        lineHeight="--leading-48"
        color="Black100"
        motionColor="Primary"
        align="center"
        class="w-full font-semibold"
    />
    <SlotText
        text="SnowUI Motion"
        direction="reverse"
        size="--text-32"
        lineHeight="--leading-32"
        color="Blue"
        motionColor="Purple"
        class="font-semibold"
    />
</Frame>`,
        expected: {
            render: "显示两行 SlotText，挂载时直接显示最终文字。",
            layout: "字号、行高、颜色都由 SnowUI Token props 控制。",
            interaction: "第一行使用 normal 方向，第二行使用 reverse 方向。",
        },
        logic: ["SlotText", "Token", "Direction"],
    },
    {
        name: "A2: replayKey 重播动效",
        code: `A2
<script lang="ts">
    let replayKey = $state(0);
    let value = $state("Token Driven");
</script>

<Frame column class="gap-12">
    <SlotText
        text={value}
        replayKey={replayKey}
        skipUnchanged={false}
        size="--text-48"
        lineHeight="--leading-48"
        color="Black100"
        motionColor="Green"
        align="center"
        class="w-full font-semibold"
    />
    <Frame row class="gap-8">
        <Button onclick={() => (replayKey += 1)}>Replay</Button>
        <Button variant="outline" onclick={() => {
            value = value === "Token Driven" ? "Launch Ready" : "Token Driven";
        }}>
            Toggle Text
        </Button>
    </Frame>
</Frame>`,
        expected: {
            render: "显示大号文字与 Replay / Toggle Text 两个按钮。",
            interaction: "点击 Replay 时即使文字不变也重新播放 SlotText 动效；Toggle Text 会切换内容并播放。",
            layout: "文字居中，占满父容器宽度。",
        },
        logic: ["Replay", "replayKey", "skipUnchanged"],
    },
    {
        name: "A3: 排版与对齐 Token",
        code: `A3
<Frame column class="gap-12" style="width: min(100%, 40rem);">
    <SlotText
        text="LEFT MONO"
        font="--font-mono"
        size="--text-24"
        lineHeight="--leading-24"
        color="Primary"
        align="left"
        class="w-full font-semibold"
    />
    <SlotText
        text="CENTER FIGTREE"
        font="--font-figtree"
        size="--text-32"
        lineHeight="--leading-32"
        color="Purple"
        align="center"
        class="w-full font-semibold"
    />
    <SlotText
        text="RIGHT NUNITO"
        font="--font-nunito"
        size="--text-24"
        lineHeight="--leading-24"
        color="Red"
        align="right"
        class="w-full font-semibold"
    />
</Frame>`,
        expected: {
            render: "三行文字分别使用不同字体、字号、行高与颜色 Token。",
            layout: "在明确宽度下分别左对齐、居中、右对齐。",
        },
        logic: ["font", "size", "lineHeight", "color", "align"],
    },
    {
        name: "A4: 组合与 as 角色",
        code: `A4
<Button variant="outline">
    <Text as="leading" interactive={false}>Deploy</Text>
    <SlotText
        text="Ready"
        as="trailing"
        size="--text-14"
        lineHeight="--leading-14"
        color="Green"
        motionColor="Primary"
        direction="reverse"
        class="font-semibold"
    />
</Button>`,
        expected: {
            render: "按钮中显示 Deploy 与 Ready。",
            layout: "SlotText 作为 trailing 角色接入 Button 三槽位布局。",
            interaction: "按钮自身交互不影响 SlotText 的挂载动效。",
        },
        logic: ["Composition", "Frame", "as"],
    },
    {
        name: "A5: 多动效集合对照",
        code: `A5
<Frame column class="gap-12">
    <SlotText
        text="Slot Motion"
        size="--text-32"
        lineHeight="--leading-32"
        color="Black100"
        motionColor="Primary"
        class="font-semibold"
    />
    <NumericText
        value={9828}
        locales="en-US"
        format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
        class="text-24 font-semibold text-blue"
    />
    <ScrambleText
        text="SCRAMBLE READY"
        charset="symbols"
        font="--font-mono"
        color="Purple"
        lineHeight="--leading-24"
        class="text-24 font-semibold"
    />
</Frame>`,
        expected: {
            render: "同一测试卡中展示 SlotText、NumericText、ScrambleText 三种文字动效。",
            layout: "三种动效纵向排列，便于视觉对照。",
        },
        logic: ["SlotText", "NumericText", "ScrambleText"],
    },
    {
        name: "A6: Frame 外层动效组合",
        code: `A6
<FramePro
    whileAppear={{ opacity: [0, 1], y: [8, 0] }}
    class="gap-16"
    column
>
    <SlotText text="SLOT READY" />
    <NumericText value={12840} />
    <ScrambleText text="SCRAMBLE READY" />
    <FlowText value={2048} />
</FramePro>`,
        expected: {
            render: "父级 FramePro 整体渐现和位移时，四个文字动效组件一起响应，同时各自保留内部字符或数位动画。",
            interaction: "父级 Frame 动效与内部文字动效并行，内部动画不会覆盖外层 opacity 与 transform。",
            layout: "四个组件按 column 排列并保持各自的内联文字布局。",
        },
        logic: ["FramePro", "whileAppear", "TextMotion"],
    },
    {
        name: "A7: 数字趋势与数位顺序",
        code: `A7
<Frame row class="gap-24 items-center">
    <SlotText text={12840} trend={1} class="text-32 font-semibold text-green" />
    <SlotText text={9824} trend={-1} class="text-32 font-semibold text-red" />
</Frame>`,
        expected: {
            render: "两个数字分别按增加和减少趋势播放槽位滚动。",
            interaction: "trend=1 向上、trend=-1 向下，变化数位从低位到高位依次启动。",
            layout: "两个 SlotText 保持内联排列。",
        },
        logic: ["trend", "NumericDirection", "DigitOrder"],
    },
] as const;
