/**
 * BarChart.test.ts
 * v1.0.1
 *
 * 覆盖:BarChart 默认形态、多段无间隔、多段有间隔、双层相叠、多柱并排、横向柱状图、出现动效和坐标轴。
 * 示例不引用任何 --snowui-*-override / 设计 Token。
 */
export const examples = [
    {
        name: "BC-01: 默认纵向柱状图",
        code: `<script lang="ts">
    let bc01Chart: any;
</script>

BC-01
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc01Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc01Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
    <BarChart
        bind:this={bc01Chart}
        showYAxis
        showGrid
      hoverMode="cell"
showHoverLabel={true}
     showHoverPanel={true}
alwaysShowHoverLabel={true}
hoverPanelPlacement="pointer"
      hoverPanelVariant="dark"
        data={[
            { name: "Jan", value: 85.3 },
            { name: "Feb", value: 85.3 },
            { name: "Mar", value: 85.3 },
            { name: "Apr", value: 85.3 },
            { name: "May", value: 85.3 },
            { name: "Jun", value: 85.3 },
            { name: "Jul", value: 85.3 },
            { name: "Aug", value: 85.3 },
            { name: "Sep", value: 85.3 },
            { name: "Oct", value: 85.3 },
            { name: "Nov", value: 85.3 },
            { name: "Dec", value: 85.3 }
        ]}
    />
</Frame>`,
        expected: {
            render: "800x400 纵向柱状图;包含 12 根月度柱;每个分类单元中一根 32px 宽柱;默认圆角 8px;柱色默认为 Primary;横坐标显示 Jan 到 Dec;自动 domain 上限等于实际最大数据值,纵坐标 nice ticks 只生成到不高于最大值的最后一个易读刻度并与网格线对齐;Y 轴标签区宽度等于最宽可见刻度的实际渲染宽度且刻度右边缘与绘图区固定保留 12px;BC-01 同时显示 Y 轴与顶部数值 label,绘图区顶部与不显示数值 label 时一致为 16px,label 始终保持柱顶上方 4px 且必要时可溢出绘图区顶边,底部只保留 8px 横轴标签间距和 16px 标签高度,标签底边与组件底部对齐;出现动效初始显示目标高度的 80%,随后从左到右逐柱升高到完整高度且柱间启动间隔固定;整条时间轴带 easeOut 缓动,单柱升高使用 Frame morph 默认 300ms 基准时长且每根柱独立 easeOut 缓动,越靠右的柱子升高速度越慢;BC-01 让 12px 常规体 label 一直显示,数值最多显示小数点后 2 位且颜色默认为 Black/100%",
            interaction: "点击重新播放动效按钮时，所有柱先回到 80% 高度再从左到右升高到完整高度,常显 label 数值实时跟随当前柱高比例从 80% 对应值补到完整值;点击反转动效按钮时，柱体沿同一时间轴回退到 80% 高度;每根柱命中区可获得键盘焦点并暴露分类和值的 aria-label;hover 或 focus 柱体时在柱体上方 4px 显示数值 label;100% 实心柱 hover 使用 filled Button 同款 StaticWhite/20% overlay;alwaysShowHoverLabel=true 时数值 label 常显",
        },
        logic: ["Default", "Vertical", "Axis", "Grid", "Replay"],
    },
    {
        name: "BC-02: 多段式无间隔",
        code: `<script lang="ts">
    let bc02Chart: any;
</script>

BC-02
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc02Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc02Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
<BarChart
    bind:this={bc02Chart}
    mode="stack"
    hoverMode="cell"
    segmentGap={0}
    showYAxis
    showGrid
  showHoverPanel={true}
alwaysShowHoverLabel={true}
hoverPanelPlacement="anchor-top"
    data={[
        { name: "A", segments: [{ name: "Core", value: 36 }, { name: "Plus", value: 24 }, { name: "Extra", value: 18 }] },
        { name: "B", segments: [{ name: "Core", value: 42 }, { name: "Plus", value: 18 }, { name: "Extra", value: 28 }] },
        { name: "C", segments: [{ name: "Core", value: 26 }, { name: "Plus", value: 32 }, { name: "Extra", value: 16 }] },
        { name: "D", segments: [{ name: "Core", value: 52 }, { name: "Plus", value: 14 }, { name: "Extra", value: 22 }] }
    ]}
/>
</Frame>`,
        expected: {
            render: "每个分类单元为一根连续多段柱并与分类 label 居中对齐;segmentGap=0 时中间无间隔;分段默认使用 Primary 的单色透明度梯度;整根柱只有底段底部圆角和顶段顶部圆角;出现动效按分类单元整体调度,同一单元内所有分段共享同一进度并从各自 80% 高度一起升高,分段不各自独立启动;hover 顶段时底部仍保持直角",
            interaction: "深色段 hover 使用 filled Button 同款 StaticWhite/20% overlay;浅色段 hover 使用 Black/4% overlay;重播和反转动效的启动间隔与缓动都按分类单元计算",
        },
        logic: ["Stack", "SegmentGapZero", "MonochromeFade"],
    },
    {
        name: "BC-03: 多段式有间隔",
        code: `<script lang="ts">
    let bc03Chart: any;
</script>

BC-03
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc03Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc03Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
<BarChart
    bind:this={bc03Chart}
    mode="stack"
    hoverMode="item"
    segmentGap={2}
    cornerRadius={12}
    alwaysShowHoverLabel
    valueFormat={{ fractionDigits: 2 }}
    showYAxis
    data={[
        { name: "North", segments: [{ name: "A", value: 28 }, { name: "B", value: 32 }, { name: "C", value: 18 }, { name: "D", value: 12 }] },
        { name: "South", segments: [{ name: "A", value: 42 }, { name: "B", value: 24 }, { name: "C", value: 16 }, { name: "D", value: 20 }] },
        { name: "West", segments: [{ name: "A", value: 22 }, { name: "B", value: 38 }, { name: "C", value: 26 }, { name: "D", value: 14 }] }
    ]}
/>
</Frame>`,
        expected: {
            render: "segmentGap=2 时每个分段之间始终透出固定 2px 间隔,动效过程中间距不随高度变化;每段都按 12px 独立圆角渲染;多段数量不限于三段;出现动效按分类单元整体调度,同一单元内所有分段共享同一进度并从各自 80% 高度一起升高,不分别启动独立变高动效;数值 label 只在最顶段显示一次,内容为全部分段总和并保留 2 位小数",
            interaction: "hover 任意 stack 分段都显示最顶段上方的整柱总值 label,颜色默认为 Black/100%",
        },
        logic: ["Stack", "SegmentGap", "SegmentRadius"],
    },
    {
        name: "BC-04: 双层相叠",
        code: `<script lang="ts">
    let bc04Chart: any;
</script>

BC-04
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc04Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc04Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
<BarChart
    bind:this={bc04Chart}
    mode="overlay"
    showYAxis
  showHoverPanel={true}
alwaysShowHoverLabel={true}
hoverPanelPlacement="anchor-top"
    data={[
        { name: "Design", value: 72, backgroundValue: 100 },
        { name: "Code", value: 58, backgroundValue: 100 },
        { name: "QA", value: 84, backgroundValue: 100 },
        { name: "Ship", value: 46, backgroundValue: 100 }
    ]}
/>
</Frame>`,
        expected: {
            render: "每个单元后层柱透明度为 10%;前层柱为 100%;双层同轴相叠且都使用同一圆角",
            interaction: "后层 10% 柱 hover 使用 Black/4% overlay;前层 100% 柱 hover 使用 filled Button 同款 StaticWhite/20% overlay",
        },
        logic: ["Overlay", "BackgroundOpacity", "ForegroundOpacity"],
    },
    {
        name: "BC-05: 双圆柱和多圆柱",
        code: `<script lang="ts">
    let bc05Chart: any;
</script>

BC-05
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc05Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc05Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
<BarChart
    bind:this={bc05Chart}
    mode="group"
    barGap={4}
    showYAxis
    showGrid
    showHoverPanel={true}
    showHoverPanelLabel={true}
    showHoverLabel={true}
    data={[
        { name: "Q1", bars: [{ name: "Actual", value: 52 }, { name: "Plan", value: 68 }] },
        { name: "Q2", bars: [{ name: "Actual", value: 74 }, { name: "Plan", value: 82 }] },
        { name: "Q3", bars: [{ name: "Actual", value: 66 }, { name: "Plan", value: 78 }] },
        { name: "Q4", bars: [{ name: "Actual", value: 88 }, { name: "Plan", value: 92 }] }
    ]}
/>
</Frame>`,
        expected: {
            render: "每个分类单元内两根 32px 柱左右并排;柱间距为 4px;颜色使用 Chart 默认色序，可扩展为更多 bars",
        },
        logic: ["Group", "BarGap", "SequenceColor"],
    },
    {
        name: "BC-06: 横向多柱",
        code: `<script lang="ts">
    let bc06Chart: any;
</script>

BC-06
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => bc06Chart?.replay?.()}>
            重新播放动效
        </Button>
        <Button onclick={() => bc06Chart?.reverseAppearance?.()}>
            反转动效
        </Button>
    </Frame>
<BarChart
    bind:this={bc06Chart}
    orientation="horizontal"
    mode="group"
    width={720}
    height={360}
    showYAxis
    showGrid
  alwaysShowHoverLabel={true}
    data={[
        { name: "Search", bars: [{ name: "2025", value: 62 }, { name: "2026", value: 84 }] },
        { name: "Social", bars: [{ name: "2025", value: 44 }, { name: "2026", value: 58 }] },
        { name: "Direct", bars: [{ name: "2025", value: 78 }, { name: "2026", value: 92 }] },
        { name: "Email", bars: [{ name: "2025", value: 36 }, { name: "2026", value: 48 }] }
    ]}
/>
</Frame>`,
        expected: {
            render: "横向模式下分类 label 位于左侧;数值轴位于底部;同一单元内两根柱上下并排;所有圆柱类型在横向下仍可用",
        },
        logic: ["Horizontal", "Group", "Axis"],
    },
    {
        name: "BC-07: hover 面板",
        code: `BC-07
<BarChart
    showHoverPanel
    hoverPanelVariant="light"
    showHoverPanelLabel
    mode="stack"
hoverPanelPlacement="anchor-side"
    data={[
        { name: "Jan", segments: [{ name: "Product", value: 8400 }, { name: "Service", value: 600 }, { name: "Other", value: 200 }] },
        { name: "Feb", segments: [{ name: "Product", value: 7200 }, { name: "Service", value: 900 }, { name: "Other", value: 320 }] }
    ]}
/>`,
        expected: {
            render: "showHoverPanel 开启后默认隐藏原 hover label;hover 面板使用 light 样式,圆角 12px,上下 6px 左右 8px padding,圆点 6x6,名称列和值列按最长内容对齐,圆点与名称间距 4px,名称与数值间距 8px;showHoverPanelLabel=true 时顶部显示当前分类 label,label 与数值行区域间距为 2px",
            interaction: "hover 或 focus 柱体 / cell 时,面板根据当前分类下的分段数据自动生成名称和值",
        },
        logic: ["HoverPanel", "HoverPanelLabel", "Stack"],
    },
    {
        name: "BC-08: hover 面板与 label 共存",
        code: `BC-08
<BarChart
    showHoverPanel
    showHoverLabel={true}
    alwaysShowHoverLabel
    hoverPanelVariant="surface"
    hoverPanelPlacement="pin-top-right"
    data={[
        { name: "North", value: 64, color: "#75b7ff" },
        { name: "South", value: 48, color: "#69dbcf" },
        { name: "West", value: 72, color: "#b899eb" }
    ]}
/>`,
        expected: {
            render: "显式 showHoverLabel=true 且 alwaysShowHoverLabel=true 时,hover 面板与原数值 label 同时显示;hoverPanelVariant=surface 使用 Listbox / Quick Action 背景和阴影;pin-top-right 相对于 plot area 固定在右上角并保持 8px 边距",
            interaction: "hover 或 focus 不同柱子时,面板位置保持固定,内容更新为当前柱数据",
        },
        logic: ["HoverPanel", "SurfaceVariant", "PinPlacement", "HoverLabelCoexist"],
    },
];
