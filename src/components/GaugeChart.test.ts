/**
 * GaugeChart.test.ts
 * v1.1.0
 *
 * 覆盖:GaugeChart 默认形态、颜色/渐变、尺寸/圆角/透明间隔、4% 占位层、出现动效、中心标签与组合使用。
 * 示例不引用任何 --snowui-*-override / 设计 Token。
 */
export const examples = [
    {
        name: "GG-01: 默认半圆仪表图与出现动效",
        code: `<script lang="ts">
    let gg01Chart: any;
</script>

GG-01
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => gg01Chart?.replay?.()}>
            重新填充
        </Button>
        <Button variant="outline" onclick={() => gg01Chart?.reverseAppearance?.()}>
            反向回退
        </Button>
    </Frame>
    <GaugeChart
        bind:this={gg01Chart}
      showHoverPanel={true}
        data={[
            { name: "Primary", value: 32 },
            { name: "Growth", value: 24 },
            { name: "Support", value: 18 },
            { name: "Explore", value: 14 },
            { name: "Other", value: 12 }
        ]}
    />
</Frame>`,
        expected: {
            render: "320x160 半圆仪表图;填充前可见 4% 同色占位层;扇区有圆角与透明隔断;颜色序列与 CircularChart 一致",
            interaction: "点击重新填充时从左到右顺序填充;点击反向回退时先进入完成态再从 100% 回退到 0;hover 任意扇区时该扇区仅向外增厚 4px、不位移;快速反复移入移出或切换扇区时立即转向最新状态，不积压重播;鼠标离开后保留键盘焦点强调",
        },
        logic: ["Default", "Hover", "Replay", "ReverseAppearance", "BaseLayer"],
    },
    {
        name: "GG-02: 每扇区颜色与默认回退",
        code: `GG-02
<GaugeChart
    appearanceProgress={1}
    colors={[undefined, "#7DBBFF", undefined, "var(--secondary-yellow)"]}
    data={[
        { name: "Default A", value: 30 },
        { name: "Palette Blue", value: 24 },
        { name: "Item Mint", value: 18, color: "var(--secondary-mint, #6BE6D3)" },
        { name: "Palette Yellow", value: 16 },
        { name: "Default E", value: 12 }
    ]}
/>`,
        expected: {
            render: "第 1 项回退默认 primary;第 2 项使用调色板蓝色;第 3 项使用 data.color 薄荷色;第 4 项使用调色板黄色;第 5 项按自身 index 回退默认 green",
        },
        logic: ["Colors", "ItemColor", "PaletteFallback"],
    },
    {
        name: "GG-03: CSS 变量与渐变颜色",
        code: `GG-03
<GaugeChart
    appearanceProgress={1}
    data={[
        { name: "Variable", value: 42, color: "var(--secondary-purple, #B899EB)" },
        { name: "Gradient String", value: 34, color: "linear-gradient(135deg, #111111 0%, #7DBBFF 100%)" },
        {
            name: "Gradient Object",
            value: 24,
            color: {
                type: "linear",
                angle: 45,
                stops: [
                    { color: "#6BE6D3", offset: "0%" },
                    { color: "#FFCC00", offset: "100%", opacity: 0.9 }
                ]
            }
        }
    ]}
/>`,
        expected: {
            render: "三个扇区分别使用 CSS 变量、linear-gradient 字符串和渐变对象填充;占位层颜色与最终扇区一致",
        },
        logic: ["CssVariableColor", "LinearGradient", "GradientObject", "BaseLayer"],
    },
    {
        name: "GG-04: 320 / 480 / 640 几何等比缩放",
        code: `GG-04
<Frame class="flex-row gap-24 items-end">
    <GaugeChart width={320} height={160} ringThickness={40} appearanceProgress={1} />
    <GaugeChart width={480} height={240} ringThickness={56} appearanceProgress={1} />
    <GaugeChart width={640} height={320} ringThickness={72} cornerRadius={4} separatorWidth={2} appearanceProgress={1} />
</Frame>`,
        expected: {
            render: "320 宽默认圆角 4px、间隔 2px;480 宽 auto 圆角 6px、间隔 3px;640 宽传入 4/2 后按基准缩放为 8px/4px",
        },
        logic: ["Width", "Height", "ScaledCornerRadius", "ScaledSeparatorWidth"],
    },
    {
        name: "GG-05: 有色背景下透明间隔",
        code: `GG-05
<Frame
    class="p-24"
    style="background: linear-gradient(135deg, #F5E9FF 0%, #E4FFF8 100%); border-radius: 24px;"
>
    <GaugeChart
        width={420}
        height={210}
        separatorWidth={4}
        appearanceProgress={1}
    />
</Frame>`,
        expected: {
            render: "扇区之间透出外层渐变背景,不出现固定白边;占位层与填充层都被同一透明间隔 mask 裁切",
        },
        logic: ["TransparentSeparator", "GapMask", "ColoredBackground"],
    },
    {
        name: "GG-06: 默认 10 项颜色序列",
        code: `GG-06
<GaugeChart
    width={420}
    height={210}
    appearanceProgress={1}
    data={[
        { name: "A", value: 18 },
        { name: "B", value: 15 },
        { name: "C", value: 14 },
        { name: "D", value: 12 },
        { name: "E", value: 10 },
        { name: "F", value: 9 },
        { name: "G", value: 8 },
        { name: "H", value: 6 },
        { name: "I", value: 5 },
        { name: "J", value: 3 },
        { name: "K", value: 99 }
    ]}
/>`,
        expected: {
            render: "只显示前 10 项;颜色顺序为 primary、purple、cyan、mint、green、indigo、blue、yellow、orange、red",
        },
        logic: ["MaxItems", "ColorTokens"],
    },
    {
        name: "GG-07: 右侧起始方向与受控进度",
        code: `GG-07
<Frame class="flex-row gap-24 items-center">
    <GaugeChart startDirection="left" appearanceProgress={0.45} />
    <GaugeChart startDirection="right" appearanceProgress={0.45} />
</Frame>`,
        expected: {
            render: "左图从左向右填充到 45%;右图从右向左填充到 45%;未填充区域保留 4% 同色占位",
        },
        logic: ["StartDirection", "AppearanceProgress", "BaseLayer"],
    },
    {
        name: "GG-08: 两段仪表与中心标签",
        code: `GG-08
<GaugeChart
    ringThickness={48}
    appearanceProgress={1}
    data={[
        { name: "Done", value: 62 },
        { name: "Remain", value: 38 }
    ]}
/>`,
        expected: {
            render: "半圆由两段构成,适合进度仪表或状态比例展示",
            interaction: "hover 时中心标签第一行显示当前项百分比,第二行显示名称",
        },
        logic: ["TwoSegments", "CenterLabel"],
    },
    {
        name: "GG-09: 外部 Text 自定义中心标签",
        code: `GG-09
<GaugeChart
    width={320}
    height={160}
    data={[
        { name: "Growth", value: 24 },
        { name: "Support", value: 18 }
    ]}
>
    <Text as="segment-value" class="text-24 font-bold text-black-100" />
    <Text as="segment-name" class="text-18 text-black-40" />
</GaugeChart>`,
        expected: {
            render: "外部 Text 角色作为中心标签样式模板,组件自动写入当前扇区百分比与名称,并保持 GaugeChart 17.5% 高度的底部定位",
        },
        logic: ["CustomCenterLabel", "TextRole", "CenterLabel"],
    },
    {
        name: "GG-10: 与 Text 组合",
        code: `GG-10
<Frame class="flex-row gap-24 items-center">
    <GaugeChart width={320} height={160} appearanceProgress={1} />
    <Frame class="flex-col gap-8">
        <Text class="text-18">Capacity Gauge</Text>
        <Text class="text-14 text-gray">Hover chart segments to inspect each channel.</Text>
    </Frame>
</Frame>`,
        expected: {
            render: "GaugeChart 作为内禀原子 Hug 子项,与右侧文本组合排列",
        },
        logic: ["Combination", "Layout"],
    },
    {
        name: "GG-11: center-label 常驻中心信息与 hover 面板",
        code: `GG-11
<GaugeChart
    showHoverPanelLabel
    data={[
        { name: "Growth", value: 42 },
        { name: "Support", value: 28 },
        { name: "Other", value: 30 }
    ]}
>
    <Frame as="center-label" class="flex-col items-center gap-2 text-black-100">
        <Text class="text-20 font-bold">70%</Text>
        <Text class="text-12 text-black-40">Capacity</Text>
    </Frame>
</GaugeChart>`,
        expected: {
            render: "center-label 常驻显示在仪表图中心区域,不套用默认中心 hover label 的字号、颜色和缩放规则;出现 center-label 后默认中心 hover 信息由 hover 面板承载",
            interaction: "hover 或 focus 扇区时,中心常驻内容不变化,hover 面板显示当前扇区名称和百分比",
        },
        logic: ["CenterLabel", "HoverPanel", "PersistentCenterLabel"],
    },
    {
        name: "GG-12: pointer hover 面板与中心常驻信息",
        code: `GG-12
<GaugeChart
    hoverPanelPlacement="pointer"
    hoverPanelVariant="dark"
    showHoverPanelLabel
    data={[
        { name: "Growth", value: 42 },
        { name: "Support", value: 28 },
        { name: "Other", value: 30 }
    ]}
>
    <Frame as="center-label" class="flex-col items-center gap-2">
        <Text>70%</Text>
        <Text>Capacity</Text>
    </Frame>
</GaugeChart>`,
        expected: {
            render: "GaugeChart 有 center-label 时自动开启 hover 面板;pointer 定位默认跟随鼠标右下角并做边缘避让;dark 样式复用 Tooltip 默认背景与毛玻璃",
            interaction: "hover 或 focus 扇区时,中心常驻内容保持不变,hover 面板顶部显示当前扇区 label",
        },
        logic: ["CenterLabel", "HoverPanel", "PointerPlacement", "DarkVariant"],
    },
    {
        name: "GG-13: 默认开启亮色 HoverPanel",
        code: `GG-13
<GaugeChart data={[{ name: "Revenue", value: 42 }]} />`,
        expected: {
            render: "不传 showHoverPanel 时默认启用 light 面板；未 hover / focus 时不显示",
            interaction: "鼠标悬停或键盘聚焦数据项时显示面板；面板显示当前数据项的信息",
        },
        logic: ["HoverPanel", "Default", "LightVariant", "Keyboard"],
    },
    {
        name: "GG-14: 窄容器内图表本体等比缩小",
        code: `GG-14
<Frame column class="w-full gap-16">
    <GaugeChart width={480} height={240} ringThickness={48} cornerRadius={8} separatorWidth={6} />
    <GaugeChart width={480} height={240} ringThickness={48} cornerRadius={8} separatorWidth={6}>
        <Frame as="center-label" column class="items-center gap-4">
            <Text class="text-24">72%</Text>
            <Text>Capacity</Text>
        </Frame>
    </GaugeChart>
</Frame>`,
        expected: {
            render: "显示默认中心标签与常驻中心内容两种用法；HoverPanel 使用默认大小",
            responsive: "无需开启响应式；拖窄真实预览时，环厚、间隔、圆角、hover 增厚和中心内容同倍缩小至最小 40px；放宽恢复声明尺寸，不残留空白占位",
            interaction: "缩小后 pointer 与键盘 focus 命中当前扇区，面板位置跟随实际显示尺寸",
        },
        logic: ["Responsive", "CenterLabel", "HoverPanel", "Keyboard"],
    },
    {
        name: "GG-15: 默认响应式并排收缩与 40px 下限",
        code: `GG-15
<Frame row data-wrap="false" class="w-full gap-16">
    <GaugeChart width={320} height={160}>
        <Frame as="center-label"><Text>72%</Text></Frame>
    </GaugeChart>
    <GaugeChart width={320} height={160}>
        <Frame as="center-label"><Text>48%</Text></Frame>
    </GaugeChart>
</Frame>`,
        expected: {
            responsive: "无需传入 enableResponsive；两张图表按并排剩余宽度等比收缩，最小宽度 40px；空间恢复后回到声明尺寸",
            interaction: "中心内容同步缩放，HoverPanel 保持大小",
        },
        logic: ["Responsive", "MinWidth", "Flex", "HoverPanel"],
    },
    {
        name: "GG-16: 最小宽度等于图表宽度时不收缩",
        code: `GG-16
<Frame column class="w-full gap-16">
    <Text>默认：容器放不下时缩小至 40px</Text>
    <GaugeChart width={100} height={50} />
    <Text>最小宽度与图表宽度相同：保持 100</Text>
    <GaugeChart width={100} height={50} minWidth={100} />
</Frame>`,
        expected: {
            responsive: "第一张图表默认缩小至 40px；第二张图表 minWidth 与声明宽度相同，窄容器中仍保持声明尺寸",
            interaction: "两种尺寸策略下，hover 与 focus 均可显示未缩放的 HoverPanel",
        },
        logic: ["Responsive", "MinWidth", "HoverPanel"],
    },
    {
        name: "GG-17: 空闲中心标题与悬停替换",
        code: `GG-17
<Frame column class="gap-16">
    <GaugeChart centerTitle="Docs" centerSubtitle="This week" appearMotion={false}
        data={[{ name: 'Ready', value: 72 }, { name: 'Review', value: 18 }, { name: 'Plan', value: 10 }]} />
</Frame>`,
        expected: {
            render: "初始显示 Docs / This week，使用组件默认中心数值和名称两行排版",
            interaction: "hover / focus 替换为当前项，离开后恢复标题；加载恢复、showCenterLabel 和动态角色模板遵循同一状态",
        },
        logic: ["CenterLabel", "Hover", "Keyboard"],
    },
] as const;
