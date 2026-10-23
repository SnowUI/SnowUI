// v1.4.1：首次连接的 SSR 节点保留与初始化后的重连由 scramble-text-initial-dom 浏览器回归验证。
// motionColor 的全文索引、回落顺序及快速更新由 Playground text-motion-color-sequence 浏览器回归验证。
export const examples = [
    {
        name: "文档宿主播放门禁",
        code: `<script>let released = $state(false);</script>
<Frame column class="gap-12">
    <div data-snowui-appearance-gated="true" data-snowui-appearance-ready={String(released)}>
        <ScrambleText text="Preview ready" />
    </div>
    <Button onclick={() => released = true}>Release appearance</Button>
</Frame>`,
        expected: {
            render: "预热期间完整静态内容已挂载，未开始播放。",
            interaction: "点击 Release appearance 后只放行一次；卸载清理观察。",
            responsive: "减少动效下保持稳定内容。",
        },
    },

    {
        name: "A1: 基础字符集",
        code: `A1
<Frame column class="gap-12">
    <ScrambleText text="DEPLOY READY" charset="glyphs" class="text-24 font-semibold text-black" />
    <ScrambleText text="SNOWUI DESIGN" charset="symbols" class="text-20 text-blue" />
    <ScrambleText text="2026.06.11" charset="numbers" class="text-20 text-purple" />
    <ScrambleText text="Text" mode="cascade" customSequence="a_&ぅ*" motionColor="Indigo" class="text-24 text-green" />
</Frame>`,
        expected: {
            render: "四行默认使用 cascade 模式，分别按 glyphs、symbols、numbers 与自定义序列循环后依次停在最终文本。",
            layout: "文本按 column 间距排列，字号与颜色由 snowui.css 工具类控制。",
            interaction: "挂载后自动播放一次扰动归位动效。",
            performance: "短文本逐帧更新，无额外布局容器抖动。",
            responsive: "随父容器宽度换行，保持文本流宽度约束。",
        },
        logic: ["charset", "defaultMotion", "class"],
    },
    {
        name: "B1: 自定义替换序列",
        code: `B1
<Frame column class="gap-8">
    <ScrambleText
        text="Cloud Console"
        customSequence="kloud"
        class="text-32 font-semibold text-primary"
    />
    <Text class="text-14 text-black-40">customSequence 会优先于 charset；默认 cascade 按输入顺序循环，scramble 将其作为随机字符池。</Text>
</Frame>`,
        expected: {
            render: "Cloud Console 在启动时按 k/l/o/u/d 顺序循环，再逐字符延迟归位。",
            layout: "标题与说明文字垂直排列，标题使用外部工具类控制字号、字重和颜色。",
            interaction: "挂载后自动播放，自定义序列最多读取 64 个字符。",
            performance: "自定义序列按 grapheme 截断，避免超长输入拖慢逐帧替换。",
            responsive: "父容器变窄时说明文字自然换行。",
        },
        logic: ["customSequence", "defaultMotion"],
    },
    {
        name: "C1: Props 排版 Token",
        code: `C1
<Frame column class="gap-12" style="width: min(100%, 32rem);">
    <ScrambleText
        text="PRIMARY MONO CENTER"
        font="--font-mono"
        size="--text-24"
        weight={600}
        color="Primary"
        motionColor="Indigo"
        lineHeight="--leading-24"
        align="center"
        class="font-semibold"
    />
    <ScrambleText
        text="Right aligned red output"
        color="Red"
        align="right"
        class="text-16"
    />
</Frame>`,
        expected: {
            render: "第一行使用 SnowUI 字体 Token、语意色和行高 Token；第二行使用 Red 语意色并右对齐。",
            layout: "组件宽度跟随父容器，align 控制 text-align 与 inline-flex 对齐。",
            interaction: "两行挂载后分别播放扰动归位动效。",
            performance: "排版 Props 只写 CSS 变量，不触发布局观察器。",
            responsive: "父容器宽度变化时 center/right 对齐保持稳定。",
        },
        logic: ["font", "color", "lineHeight", "align"],
    },
    {
        name: "D1: 组合与 as 角色",
        code: `D1
<Button variant="outline">
    <Text as="leading" interactive={false}>Build</Text>
    <ScrambleText
        text="Passing"
        as="trailing"
        customSequence="01"
        color="Green"
        class="text-14 font-semibold"
    />
</Button>`,
        expected: {
            render: "ScrambleText 作为 Button trailing 内容显示 Passing。",
            layout: "通过 as=\"trailing\" 接入父级三槽位协议。",
            interaction: "按钮自身交互不影响 ScrambleText 的挂载动效。",
            performance: "组合场景无额外 wrapper 破坏 Button 布局。",
            responsive: "Button 内容在窄宽度下保持 trailing 角色。",
        },
        logic: ["as", "composition", "color"],
    },
] as const;
