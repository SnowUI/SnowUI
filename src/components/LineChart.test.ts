/**
 * LineChart.test.ts
 * v1.0.0
 *
 * 覆盖:LineChart 默认形态、实线/虚线、Area 填充、出现动效、横纵坐标、直线/圆角转折线、marker 定制、网格和辅助线。
 * 示例不引用任何 --snowui-*-override / 设计 Token。
 */
export const examples = [
    {
        name: "LC-01: Workshop 默认折线图",
        code: `<script lang="ts">
    let lc01Chart: any;
</script>

LC-01
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={() => lc01Chart?.replay?.()}>
            重新播放动效
        </Button>
    </Frame>
    <LineChart
        bind:this={lc01Chart}
      hoverMode="cell"
        showHoverPanel={true}
showHoverLabel={true}
alwaysShowHoverLabel={true}
      hoverPanelPlacement="anchor-side"
        showYAxis
        showGrid
        showGuides
        xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
        series={[
            {
                name: "Actual",
                color: "Primary",
                strokeStyle: "solid",
                markers: true,
                guides: true,
                data: [45000, 16000, 30000, 36000, 48000, 66000, 85000, 95000, 70000, 83000, 67000, 82000]
            },
            {
                name: "Forecast",
                strokeStyle: "dashed",
                area: true,
                markers: false,
                data: [18000, 39000, 48000, 62000, 70000, 20000, 20000, 50000, 43000, 94000, 88000, 94000]
            }
        ]}
    />
</Frame>`,
        expected: {
            render: "800x400 折线图;纵坐标刻度根据数据自动生成;Y 轴标签区宽度等于最宽可见刻度的实际渲染宽度且刻度右边缘与绘图区固定保留 12px;绘图区顶部与组件顶部对齐,底部只保留 8px 横轴标签间距和 16px 标签高度,标签底边与组件底部对齐;开启横线时默认 6 条横线且包含最底部 x 轴线;底部显示 Jan 到 Dec;横坐标默认 edge 模式，首尾数据点与首尾 label 中心都对齐到绘图区两端;默认线形为 8px 圆角转折线;主序列为 ChartSpec 第 1 色 1px 实线并显式开启 12x12 两层圆形节点;节点由下层 12x12 Black/100% 圆和上层 6x6 White/100% 圆组成，分别使用 var(--black-100) 与 var(--white-100)，且无阴影;辅序列为 ChartSpec 第 2 色 1px 虚线;主序列节点下方有 10% 黑色垂直辅助线;每条线自身绘制时长为 1000ms;多序列出现动效按 360ms 延迟依次启动且各自为缓出;线条 reveal 到节点位置时 marker 立即出现,不做透明度缓动;默认准备 12px 常规体 hover label,颜色为 Black/100%",
            interaction: "点击重新播放动效按钮时，LineChart 从 0 重新播放到 1;marker 可获得键盘焦点并暴露序列名、月份和值的 aria-label;hover 或 focus marker 时节点下层圆变为 White/100%、上层圆变为 Black/100%，节点后方显示 0.5px Black/100% 圆头竖线，并在点上方 4px 显示数值 label;alwaysShowHoverLabel=true 时数值 label 常显",
        },
        logic: ["Default", "Axis", "SolidLine", "DashedLine", "Markers", "Guides", "Replay"],
    },
    {
        name: "LC-02: 实线与虚线多序列",
        code: `LC-02
<LineChart
    series={[
        {
            name: "Revenue",
            color: "Primary",
            strokeStyle: "solid",
            markers: true,
            guides: true,
            data: [12000, 24000, 32000, 48000, 52000, 67000]
        },
        {
            name: "Target",
            strokeStyle: "dashed",
            markers: false,
            data: [18000, 28000, 36000, 44000, 62000, 76000]
        }
    ]}
    xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
    yMax={80000}
    yTickCount={9}
/>`,
        expected: {
            render: "一条黑色实线和一条紫色虚线共享同一坐标系;横坐标为 6 个月份;纵坐标到 80K",
        },
        logic: ["Series", "SolidLine", "DashedLine", "Axis"],
    },
    {
        name: "LC-03: 圆角转折与直线对照",
        code: `LC-03
<Frame class="flex-col gap-24">
    <LineChart
        width={520}
        height={260}
        cornerRadius={8}
        xAxisMode="cell"
        series={[
            {
                name: "Rounded",
                color: "Primary",
                markers: true,
                data: [18000, 52000, 26000, 76000, 42000, 90000]
            }
        ]}
        xLabels={["A", "B", "C", "D", "E", "F"]}
        yMax={100000}
    />
    <LineChart
        width={520}
        height={260}
        cornerRadius={0}
        series={[
            {
                name: "Straight",
                color: "var(--secondary-blue, #7DBBFF)",
                markers: true,
                data: [18000, 52000, 26000, 76000, 42000, 90000]
            }
        ]}
        xLabels={["A", "B", "C", "D", "E", "F"]}
        yMax={100000}
    />
</Frame>`,
        expected: {
            render: "上方折线主体为直线段且转折处有 8px 圆角;下方 cornerRadius=0 时为普通直线折线",
        },
        logic: ["CornerRadius", "RoundedTurn", "StraightLine"],
    },
    {
        name: "LC-04: 节点点大小与颜色定制",
        code: `LC-04
<LineChart
    width={640}
    height={320}
    series={[
        {
            name: "Custom Marker",
            color: "Mint",
            markers: {
                size: 14,
                color: "line"
            },
            data: [
                { value: 20000 },
                { value: 52000, marker: { size: 22 } },
                { value: 38000 },
                { value: 82000 },
                { value: 62000, marker: false },
                { value: 96000 }
            ]
        }
    ]}
    xLabels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
    yMax={100000}
/>`,
        expected: {
            render: "同一条线上的 marker 颜色保持一致并跟随线色;第二个点只允许放大为 22x22;第五个点不显示 marker",
        },
        logic: ["MarkerScale", "MarkerColor", "PointMarkerOverride"],
    },
    {
        name: "LC-05: 关闭坐标与网格",
        code: `LC-05
<LineChart
    width={420}
    height={220}
    showXAxis={false}
    showYAxis={false}
    showGrid={false}
    showGuides={false}
    series={[
        {
            name: "Minimal",
            color: "Primary",
            markers: false,
            data: [12, 22, 18, 36, 30, 48]
        }
    ]}
    yMax={60}
/>`,
        expected: {
            render: "只显示一条无坐标、无网格、无 marker 的极简折线",
        },
        logic: ["HideAxis", "HideGrid", "HideGuides"],
    },
    {
        name: "LC-06: 与 Text 组合",
        code: `LC-06
<Frame class="flex-col gap-12">
    <Frame class="flex-col gap-4">
        <Text class="text-18">Monthly Usage</Text>
        <Text class="text-14 text-gray">LineChart 作为原子图表与外部标题说明组合。</Text>
    </Frame>
    <LineChart
        width={640}
        height={320}
        xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        series={[
            {
                name: "Usage",
                color: "Primary",
                markers: true,
                guides: true,
                data: [12000, 36000, 28000, 64000, 52000, 88000]
            }
        ]}
        yMax={90000}
    />
</Frame>`,
        expected: {
            render: "标题和说明来自外部 Frame/Text;LineChart 只承担图表本体",
        },
        logic: ["Combination", "ChartPrimitiveBoundary"],
    },
    {
        name: "LC-07: 虚线与 Area 填充组合",
        code: `LC-07
<LineChart
    width={800}
    height={400}
    showYAxis
    showGrid
    showGuides
    series={[
        {
            name: "Actual",
            color: "Primary",
            strokeStyle: "solid",
            markers: {
                size: 20,
                color: "line"
            },
            guides: true,
            area: true,
            data: [45000, 16000, 30000, 36000, 48000, 66000, 85000, 95000, 70000, 83000, 67000, 82000]
        },
        {
            name: "Forecast",
            strokeStyle: "dashed",
            markers: false,
            area: true,
            data: [18000, 39000, 48000, 62000, 70000, 20000, 20000, 50000, 43000, 94000, 88000, 94000]
        }
    ]}
/>`,
        expected: {
            render: "主序列和辅序列都开启 Area;Area 固定使用各自线色并从 8% 透明度渐变到 0%;Area 不提供颜色或透明度自定义",
        },
        logic: ["Area", "DashedLine", "SolidLine", "GradientFill"],
    },
    {
        name: "LC-08: 受控出现进度",
        code: `LC-08
<Frame class="flex-col gap-24">
    <LineChart
        width={640}
        height={320}
        appearanceProgress={0.45}
        series={[
            {
                name: "Actual",
                color: "Primary",
                markers: true,
                guides: true,
                data: [12000, 36000, 28000, 64000, 52000, 88000]
            },
            {
                name: "Forecast",
                strokeStyle: "dashed",
                markers: false,
                area: true,
                data: [18000, 30000, 42000, 52000, 70000, 82000]
            }
        ]}
        xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        yMax={90000}
    />
    <LineChart
        width={640}
        height={320}
        appearMotion={false}
        series={[
            {
                name: "Complete",
                color: "var(--secondary-blue, #7DBBFF)",
                markers: true,
                area: true,
                data: [16000, 44000, 32000, 76000, 58000, 86000]
            }
        ]}
        xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        yMax={90000}
    />
</Frame>`,
        expected: {
            render: "上方图表按 45% 总时间轴只揭示部分序列;下方关闭出现动效并显示完整面积折线",
        },
        logic: ["AppearanceProgress", "AppearMotion", "Area", "DashedLine"],
    },
    {
        name: "LC-09: 直线段与圆角转折",
        code: `LC-09
<LineChart
    width={800}
    height={400}
    cornerRadius={8}
    appearMotion={false}
    showYAxis
    showGrid
    showGuides
    xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
    series={[
        {
            name: "Actual",
            color: "Primary",
            strokeStyle: "solid",
            markers: true,
            guides: true,
            data: [45000, 16000, 30000, 36000, 48000, 66000, 85000, 95000, 70000, 83000, 67000, 82000]
        },
        {
            name: "Forecast",
            strokeStyle: "dashed",
            area: true,
            markers: false,
            data: [18000, 39000, 48000, 62000, 70000, 20000, 20000, 50000, 43000, 94000, 88000, 94000]
        }
    ]}
/>`,
        expected: {
            render: "完整月度坐标图;横坐标默认 edge 模式，首尾数据点顶到绘图区两端;实线和虚线均为 1px;主体为直线段;每个中间转角处有 8px 局部圆角;端点保持直线收尾;虚线仍带跟随线色的 Area",
        },
        logic: ["RoundedTurn", "CornerRadius", "StraightSegments", "Axis", "DashedLine", "Area"],
    },
    {
        name: "LC-10: 横坐标过多自动抽稀",
        code: `LC-10
<Frame class="flex-col gap-24">
    <LineChart
        width={800}
        height={240}
        appearMotion={false}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"]}
        series={[
            {
                name: "Dense 800",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72]
            }
        ]}
        yMax={80}
    />
    <LineChart
        width={200}
        height={160}
        xAxisMode="cell"
        appearMotion={false}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"]}
        series={[
            {
                name: "Dense 200",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72]
            }
        ]}
        yMax={80}
    />
    <LineChart
        width={100}
        height={160}
        appearMotion={false}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"]}
        series={[
            {
                name: "Dense 100",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72]
            }
        ]}
        yMax={80}
    />
</Frame>`,
        expected: {
            render: "同一示例中展示 20 个横坐标在 800px edge、200px cell 和 100px edge 宽图表下自动抽稀;首尾坐标始终保留;中间坐标、折线节点、marker 和辅助线按同一索引同步减少;保留索引必须形成等差步数;每次抽稀后按当前 xAxisMode 重新计算点位间距",
        },
        logic: ["XAxisLabelCull", "DenseXAxis", "ResponsiveWidth", "PointCull"],
    },
    {
        name: "LC-11: 奇数横坐标自动抽稀",
        code: `LC-11
<Frame class="flex-col gap-24">
    <LineChart
        width={800}
        height={240}
        appearMotion={false}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20", "Item 21"]}
        series={[
            {
                name: "Odd 800",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72, 76]
            }
        ]}
        yMax={80}
    />
    <LineChart
        width={200}
        height={160}
        appearMotion={false}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20", "Item 21"]}
        series={[
            {
                name: "Odd 200",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72, 76]
            }
        ]}
        yMax={80}
    />
</Frame>`,
        expected: {
            render: "同一示例中展示 21 个横坐标在 800px 和 200px 宽图表下自动抽稀;保留索引形成等差步数;4px 圆头线两端不被裁切",
        },
        logic: ["XAxisLabelCull", "OddDenseXAxis", "EqualStepCull", "StrokeClip"],
    },
    {
        name: "LC-12: 坐标 label 数量限制",
        code: `LC-12
<Frame class="flex-col gap-24">
    <LineChart
        width={800}
        height={260}
        appearMotion={false}
        showYAxis
        showGrid
        xMaxLabelCount={5}
        yMaxLabelCount={4}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20"]}
        series={[
            {
                name: "Limit 20",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72]
            }
        ]}
        yMax={80}
    />
    <LineChart
        width={800}
        height={260}
        appearMotion={false}
        showYAxis
        showGrid
        xMaxLabelCount={5}
        yMaxLabelCount={4}
        xLabels={["Item 01", "Item 02", "Item 03", "Item 04", "Item 05", "Item 06", "Item 07", "Item 08", "Item 09", "Item 10", "Item 11", "Item 12", "Item 13", "Item 14", "Item 15", "Item 16", "Item 17", "Item 18", "Item 19", "Item 20", "Item 21"]}
        series={[
            {
                name: "Limit 21",
                color: "Primary",
                strokeWidth: 4,
                data: [12, 18, 15, 24, 21, 32, 28, 36, 34, 44, 40, 48, 45, 56, 52, 60, 58, 68, 64, 72, 76]
            }
        ]}
        yMax={80}
    />
</Frame>`,
        expected: {
            render: "xMaxLabelCount 限制横坐标最多显示数量并保持首尾;20 个点限制 5 个时因原始步数无法均分只保留首尾;21 个点限制 5 个时保留 1/6/11/16/21;yMaxLabelCount 限制纵坐标 label 数量并影响网格线数量",
        },
        logic: ["XAxisLabelLimit", "YAxisLabelLimit", "EqualStepCull"],
    },
    {
        name: "LC-13: BarChart 与 LineChart 叠加组合",
        code: `<script lang="ts">
    let lc13BarChart: any;
    let lc13LineChart: any;

    function replayLC13() {
        lc13BarChart?.replay?.();
        lc13LineChart?.replay?.();
    }

    function reverseLC13() {
        lc13BarChart?.reverseAppearance?.();
        lc13LineChart?.reverseAppearance?.();
    }
</script>

LC-13
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={replayLC13}>
            重新播放动效
        </Button>
        <Button onclick={reverseLC13}>
            反转动效
        </Button>
    </Frame>
    <Frame class="bg-white rounded-24 p-28 shadow-drop-1">
        <ChartGroup
            width={800}
            height={400}
            xLabels={["Feb 2", "Feb 3", "Feb 4", "Feb 5", "Feb 6", "Feb 7", "Feb 8", "Feb 9", "Feb 10", "Feb 11", "Feb 12", "Feb 13"]}
        >
            <BarChart
                bind:this={lc13BarChart}
                class="absolute top-0 left-0 z-0"
                width={800}
                height={400}
                barWidth={12}
                cornerRadius={999}
                showYAxis={false}
                showGrid={false}
                showHoverLabel={false}
                yMax={100}
                data={[
                    { name: "Feb 2", value: 24, color: "#3d7cff" },
                    { name: "Feb 3", value: 52, color: "#3d7cff" },
                    { name: "Feb 4", value: 30, color: "#3d7cff" },
                    { name: "Feb 5", value: 66, color: "#3d7cff" },
                    { name: "Feb 6", value: 20, color: "#3d7cff" },
                    { name: "Feb 7", value: 42, color: "#3d7cff" },
                    { name: "Feb 8", value: 24, color: "#3d7cff" },
                    { name: "Feb 9", value: 52, color: "#3d7cff" },
                    { name: "Feb 10", value: 30, color: "#3d7cff" },
                    { name: "Feb 11", value: 66, color: "#3d7cff" },
                    { name: "Feb 12", value: 20, color: "#3d7cff" },
                    { name: "Feb 13", value: 42, color: "#3d7cff" }
                ]}
            />
            <LineChart
                bind:this={lc13LineChart}
                class="absolute top-0 left-0 z-10"
                width={800}
                height={376}
                showXAxis={false}
                showYAxis={false}
                showGrid={false}
                showGuides={false}
                showHoverLabel={false}
                xAxisMode="cell"
                yMax={100}
                xLabels={["Feb 2", "Feb 3", "Feb 4", "Feb 5", "Feb 6", "Feb 7", "Feb 8", "Feb 9", "Feb 10", "Feb 11", "Feb 12", "Feb 13"]}
                series={[
                    {
                        name: "Actual",
                        color: "#2f75ff",
                        strokeStyle: "solid",
                        markers: true,
                        area: true,
                        data: [42, 48, 22, 32, 44, 40, 72, 90, 68, 78, 58, 66]
                    },
                    {
                        name: "Forecast",
                        color: "#b754ff",
                        strokeStyle: "dashed",
                        markers: false,
                        data: [28, 42, 48, 38, 62, 28, 28, 50, 44, 92, 86, 94]
                    }
                ]}
            />
        </ChartGroup>
    </Frame>
</Frame>`,
        expected: {
            render: "ChartGroup 提供同一个 800x400 组合画布和共享分类单元格命中层;BarChart 位于底层,负责浅色柱背景、蓝色圆柱和唯一横坐标 label;LineChart 位于上层,关闭自身横纵坐标、网格和辅助线,使用 xAxisMode=cell 与柱中心对齐;LineChart 高度设为 376px,让其绘图区高度与 BarChart 仅扣除 24px X 轴标签空间后的绘图区一致;蓝色实线带面积填充和 marker,紫色虚线无 marker;两个图表各自播放出现动效",
            interaction: "点击重新播放动效按钮时 BarChart 和 LineChart 同步从 0 播放到完整状态;点击反转动效按钮时两个图表同步回退;鼠标移入任一分类 cell 的绘图区时 ChartGroup 同步下发 activeCellIndex,BarChart 当前分类柱与 LineChart 当前分类 marker 一起响应;只使用 BarChart 的坐标轴,LineChart 不渲染坐标轴",
        },
        logic: ["Combination", "ChartGroup", "CellHover", "SingleAxis", "ChartPrimitiveBoundary", "Replay"],
    },
    {
        name: "LC-14: hover 面板",
        code: `LC-14
<LineChart
    showHoverPanel
    hoverPanelVariant="dark"
    xLabels={["Jan", "Feb", "Mar", "Apr"]}
    series={[
        { name: "Actual", color: "#75b7ff", markers: true, data: [8400, 7200, 8600, 9300] },
        { name: "Target", color: "#b899eb", markers: true, data: [8000, 8000, 8800, 9200] }
    ]}
/>`,
        expected: {
            render: "showHoverPanel 开启后默认隐藏原 hover label;hover 面板使用 dark 样式,每条序列在当前点位生成一行,名称列为 series.name,值列为格式化后的数据值",
            interaction: "hover 或 focus marker / cell 时,面板跟随当前点位并显示多序列数据",
        },
        logic: ["HoverPanel", "Series"],
    },
    {
        name: "LC-15: pointer 与 pin hover 面板",
        code: `LC-15
<Frame class="flex-col gap-24">
    <LineChart
        showHoverPanel
        hoverPanelPlacement="pointer"
        hoverPanelVariant="light"
        xLabels={["Jan", "Feb", "Mar", "Apr"]}
        series={[
            { name: "Actual", color: "#75b7ff", markers: true, data: [42, 58, 46, 72] },
            { name: "Forecast", color: "#b899eb", markers: true, data: [38, 54, 62, 68] }
        ]}
    />
    <LineChart
        showHoverPanel
        hoverPanelPlacement="pin-bottom"
        hoverPanelVariant="surface"
        xLabels={["Jan", "Feb", "Mar", "Apr"]}
        series={[
            { name: "Actual", color: "#75b7ff", markers: true, data: [42, 58, 46, 72] },
            { name: "Forecast", color: "#b899eb", markers: true, data: [38, 54, 62, 68] }
        ]}
    />
</Frame>`,
        expected: {
            render: "pointer 定位在鼠标右下角并做边缘避让;pin-bottom 相对于 plot area 底部固定显示且边距为 8px;surface 样式复用 Listbox / Quick Action 背景和阴影",
            interaction: "所有 LineChart 都可使用 pointer;pin 定位时不同节点共用同一面板位置但内容随当前点变化",
        },
        logic: ["HoverPanel", "PointerPlacement", "PinPlacement", "SurfaceVariant"],
    },
    {
        name: "LC-16: 长纵轴刻度自适应",
        code: `LC-16
<LineChart
    showYAxis
    showGrid
    yTicks={[0, 20000, 40000, 60000, 80000, 100000]}
    yTickFormatter={(value) => String(value)}
    xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
    series={[
        { name: "Revenue", markers: true, data: [18000, 32000, 54000, 68000, 82000, 100000] }
    ]}
/>`,
        expected: {
            render: "Y 轴显示 0 到 100000 的完整数值;标签区宽度等于最宽可见标签 100000 的实际渲染宽度;标签右边缘与绘图区起点固定保留 12px;相较短刻度只按新增文本宽度压缩右侧绘图区",
        },
        logic: ["Axis", "YAxisAutoWidth", "LongTickLabel", "AxisGap"],
    },
] as const;
