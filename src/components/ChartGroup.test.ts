/**
 * ChartGroup.test.ts
 * 覆盖:ChartGroup 组合画布、共享 cell hover、单坐标轴叠加与 item 模式。
 */

export const examples = [
    {
        name: "CG-01: BarChart 与 LineChart 共享单元格 hover",
        code: `<script lang="ts">
    let cg01BarChart: any;
    let cg01LineChart: any;

    function replayCG01() {
        cg01BarChart?.replay?.();
        cg01LineChart?.replay?.();
    }

    function reverseCG01() {
        cg01BarChart?.reverseAppearance?.();
        cg01LineChart?.reverseAppearance?.();
    }
</script>

CG-01
<Frame class="flex-col gap-12">
    <Frame class="flex-row gap-8">
        <Button onclick={replayCG01}>
            重新播放动效
        </Button>
        <Button onclick={reverseCG01}>
            反转动效
        </Button>
    </Frame>
    <Frame class="bg-white rounded-24 p-28 shadow-drop-1">
        <ChartGroup
            width={800}
            height={400}
          showHoverPanel={true}
          showHoverLabel={true}
            xLabels={["Feb 2", "Feb 3", "Feb 4", "Feb 5", "Feb 6", "Feb 7", "Feb 8", "Feb 9", "Feb 10", "Feb 11", "Feb 12", "Feb 13"]}
        >
            <BarChart
                bind:this={cg01BarChart}
                class="absolute top-0 left-0 z-0"
                width={800}
                height={400}
                barWidth={12}
                cornerRadius={999}
                showYAxis={false}
                showGrid={false}
              showHoverPanel={true}
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
                bind:this={cg01LineChart}
                class="absolute top-0 left-0 z-10"
                width={800}
                height={352}
                showXAxis={false}
                showYAxis={false}
                showGrid={false}
                showGuides={false}
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
            render: "ChartGroup 提供同一个 800x400 组合画布和共享分类单元格命中层;BarChart 位于底层,负责浅色柱背景、蓝色圆柱和唯一横坐标 label;LineChart 位于上层,关闭自身横纵坐标、网格和辅助线,使用 xAxisMode=cell 与柱中心对齐;LineChart 高度设为 352px,让其绘图区高度与 BarChart 扣除 x 轴后的绘图区一致;蓝色实线带面积填充和 marker,紫色虚线无 marker;两个图表各自播放出现动效",
            interaction: "点击重新播放动效按钮时 BarChart 和 LineChart 同步从 0 播放到完整状态;点击反转动效按钮时两个图表同步回退;鼠标移入任一分类 cell 的绘图区时 ChartGroup 同步下发 activeCellIndex,BarChart 当前分类柱与 LineChart 当前分类 marker 一起响应;只使用 BarChart 的坐标轴,LineChart 不渲染坐标轴",
        },
        logic: ["ChartGroup", "OverlayCharts", "CellHover", "SingleAxis", "Replay"],
    },
    {
        name: "CG-02: 多段 BarChart 单元格一起响应",
        code: `CG-02
<ChartGroup
    width={640}
    height={320}
    xLabels={["A", "B", "C", "D"]}
>
    <BarChart
        class="absolute top-0 left-0 z-0"
        width={640}
        height={320}
        mode="stack"
        segmentGap={2}
        yMax={100}
        showYAxis
        showHoverPanel={true}
        hoverPanelPlacement="anchor-top"
        showGrid
        data={[
            { name: "A", segments: [{ name: "Core", value: 28 }, { name: "Plus", value: 18 }, { name: "Extra", value: 20 }] },
            { name: "B", segments: [{ name: "Core", value: 36 }, { name: "Plus", value: 24 }, { name: "Extra", value: 16 }] },
            { name: "C", segments: [{ name: "Core", value: 22 }, { name: "Plus", value: 28 }, { name: "Extra", value: 24 }] },
            { name: "D", segments: [{ name: "Core", value: 42 }, { name: "Plus", value: 18 }, { name: "Extra", value: 30 }] }
        ]}
    />
</ChartGroup>`,
        expected: {
            render: "ChartGroup 只承载一个 stack BarChart 时仍提供共享 cell hit layer;BarChart 自身渲染纵轴、网格和横轴",
            interaction: "鼠标移入某个分类 cell 时,该分类下所有 stack 分段一起进入 hover 状态",
        },
        logic: ["ChartGroup", "CellHover", "StackBarHover"],
    },
    {
        name: "CG-03: item 模式保留子图表自身 hover",
        code: `CG-03
<ChartGroup
    width={640}
    height={320}
    hoverMode="item"
    showHitLayer={false}
    xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
>
    <LineChart
        class="absolute top-0 left-0 z-0"
        width={640}
        height={320}
        showYAxis
        showGrid
        xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
        series={[
            {
                name: "Actual",
                color: "Primary",
                markers: true,
                data: [42, 58, 36, 72, 54, 88]
            }
        ]}
    />
</ChartGroup>`,
        expected: {
            render: "ChartGroup 可关闭共享 hit layer,只提供组合画布",
            interaction: "hoverMode=item 时不触发容器 cell hover,LineChart marker 继续使用自身透明命中区触发 hover",
        },
        logic: ["ChartGroup", "ItemHover"],
    },
    {
        name: "CG-04: 统一控制坐标轴抽稀",
        code: `CG-04
<ChartGroup
    width={640}
    height={320}
    xLabels={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
    xAxisMode="cell"
    xMaxLabelCount={4}
  showHoverPanel={true}
  showHoverLabel={true}
  alwaysShowHoverLabel={true}
  showHoverPanelLabel={true}
    yMin={0}
    yMax={120}
    yTickCount={6}
    yMaxLabelCount={4}
    yTickFormatter={(value) => value + "k"}
    showYAxis
    showGrid
>
    <LineChart
        class="absolute top-0 left-0 z-0"
        width={640}
        height={320}
        series={[
            {
                name: "Revenue",
                color: "Primary",
                markers: true,
                data: [32, 48, 44, 58, 72, 66, 84, 78, 92, 88, 104, 112]
            }
        ]}
    />
</ChartGroup>`,
        expected: {
            render: "LineChart 未显式传坐标轴 prop 时继承 ChartGroup 的 xLabels、xAxisMode、xMaxLabelCount、yMin、yMax、yTickCount、yMaxLabelCount、yTickFormatter、showYAxis 和 showGrid;横坐标 label 按 ChartGroup 的数量限制抽稀,Y 轴 label 按最大数量抽稀并追加 k",
            interaction: "ChartGroup 仍提供默认 cell hover,鼠标移入分类 cell 时对应 marker 响应 hover",
        },
        logic: ["ChartGroup", "AxisControl", "AxisCull", "TickFormatter"],
    },
    {
        name: "CG-05: 共享 hover 面板",
        code: `CG-05
<ChartGroup
    width={640}
    height={320}
    showHoverPanel
    showHoverPanelLabel
  showHoverLabel={true}
  alwaysShowHoverLabel={true}
    xLabels={["Jan", "Feb", "Mar", "Apr"]}
>
    <BarChart
        class="absolute top-0 left-0 z-0"
        width={640}
        height={320}
        showHoverLabel={false}
        data={[
            { name: "Jan", value: 42 },
            { name: "Feb", value: 58 },
            { name: "Mar", value: 36 },
            { name: "Apr", value: 72 }
        ]}
    />
    <LineChart
        class="absolute top-0 left-0 z-10"
        width={640}
        height={272}
        showXAxis={false}
        showYAxis={false}
        showHoverLabel={false}
        xAxisMode="cell"
        xLabels={["Jan", "Feb", "Mar", "Apr"]}
        series={[{ name: "Trend", markers: true, data: [30, 62, 48, 88] }]}
    />
</ChartGroup>`,
        expected: {
            render: "ChartGroup 统一显示 hover 面板,默认 anchor-side 位于 plot area 左侧中线,左侧碰撞时改右侧;面板顶部显示当前分类 label",
            interaction: "子图表上报当前 hover 数据,ChartGroup 只显示一个共享面板",
        },
        logic: ["ChartGroup", "HoverPanel", "SharedHover"],
    },
    {
        name: "CG-06: 共享 hover 面板 pointer 定位",
        code: `CG-06
<ChartGroup
    width={640}
    height={320}
    showHoverPanel
    hoverPanelPlacement="pointer"
    hoverPanelVariant="dark"
    xLabels={["Jan", "Feb", "Mar", "Apr"]}
>
    <BarChart
        class="absolute top-0 left-0 z-0"
        width={640}
        height={320}
        showHoverLabel={true}
        data={[
            { name: "Jan", value: 42 },
            { name: "Feb", value: 58 },
            { name: "Mar", value: 36 },
            { name: "Apr", value: 72 }
        ]}
    />
    <LineChart
        class="absolute top-0 left-0 z-10"
        width={640}
        height={272}
        showXAxis={false}
        showYAxis={false}
        showHoverLabel={true}
        xAxisMode="cell"
        xLabels={["Jan", "Feb", "Mar", "Apr"]}
        series={[{ name: "Trend", markers: true, data: [30, 62, 48, 88] }]}
    />
</ChartGroup>`,
        expected: {
            render: "ChartGroup 开启共享 hover 面板后,根级 pointer move 根据 plot area 内的横向位置同步 active cell;hoverPanelPlacement=pointer 时共享面板跟随鼠标,显式 showHoverLabel=true 的子图表仍可同时显示原 hover label",
            interaction: "鼠标在组合图 plot area 内移动时,BarChart 与 LineChart 按当前 cell 上报数据,ChartGroup 合并为一个 dark hover 面板",
        },
        logic: ["ChartGroup", "HoverPanel", "PointerPlacement", "HoverLabelCoexist"],
    },
] as const;
