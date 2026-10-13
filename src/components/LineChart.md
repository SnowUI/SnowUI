# LineChart

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.6.1
> **职责**: 用折线展示数据变化趋势，支持多序列、面积填充、实线与虚线，以及坐标轴、网格和节点样式。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

用折线展示数据变化趋势，支持多序列、面积填充、实线与虚线，以及坐标轴、网格和节点样式。

## 使用选择

<!-- usage-guide:start -->
用于连续数据或时间趋势。类别比较用 BarChart；数据点、轴、提示与颜色通过公开图表配置声明。

- 通过 series 提供数据；组件不生成示例数据，xLabels 与数据点应保持对应。
- loading 保留轴与画布，等待结束后展示数据；HoverPanel 默认开启，颜色和格式使用图表公开配置。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Frame } from '@snowui-design-system/components';
	import { LineChart } from '@snowui-design-system/components';
</script>

<LineChart series={[{ name: 'Component pages', data: [1280, 1460, 1390, 1720, 1880, 2140, 2360], color: 'Primary', strokeWidth: 3 }, { name: 'Quick Start', data: [620, 710, 680, 840, 920, 1040, 1180], color: 'var(--secondary-purple)', strokeStyle: 'dashed' }]} xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} width="100%" height={280} yTicks={[0, 500, 1000, 1500, 2000, 2500]} yTickFormatter={(value) => value < 1000 ? String(value) : `${value / 1000}K`} showYAxis showGrid showHoverPanel hoverPanelVariant="surface" />
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| series | `LineChartSeries[]` | `[]` | 图表序列数据；组件不内置模拟数据 |
| xLabels | `string[]` | — | 横坐标标签；未传时使用 `ChartGroup.xLabels` 或按数据点索引生成内部坐标标签 |
| width | `number \| string` | `800` | 图表整体宽度；支持 `100%`，内部按根层最终实测宽度重算几何 |
| height | `number \| string` | `400` | 图表整体高度；数字按 px 语义转为 rem |
| yMin | `number` | — | 纵坐标最小值；未传时根据数据生成 nice domain，正数数据默认包含 `0` 默认行为：自动 / 继承 `ChartGroup`。 |
| yMax | `number` | — | 纵坐标最大值；自动时等于实际最大数据值，不向上取整 默认行为：自动 / 继承 `ChartGroup`。 |
| yTicks | `number[]` | — | 纵坐标刻度 默认行为：自动 nice ticks / 继承 `ChartGroup`。 |
| yTickCount | `number` | — | 未传 `yTicks` 时用于生成 nice ticks 的目标刻度数量 |
| yTickFormatter | `(value: number) => string` | — | 纵坐标格式化 默认行为：K 格式 / 继承 `ChartGroup`。 |
| showXAxis | `boolean` | — | 是否显示横坐标 |
| showYAxis | `boolean` | — | 是否显示纵坐标 |
| showGrid | `boolean` | — | 是否显示水平网格线 |
| showGuides | `boolean` | — | 是否允许序列绘制节点垂直辅助线 |
| showHoverLabel | `boolean` | — | hover / focus 节点时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 默认行为：按 `showHoverPanel` 推导。 |
| alwaysShowHoverLabel | `boolean` | `false` | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| adaptiveContrast | `boolean` | — | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值和默认黑白节点、黑色折线；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认开启，可显式关闭；由 Adaptive Contrast 共享能力实现。 默认行为：继承 ChartGroup，否则 `true`。 |
| showHoverPanel | `boolean` | `true` | 是否开启 Chart hover 面板，内容按当前节点 / cell 自动生成；默认开启，hover / focus 时显示面板；设为 false 时回到数值 hover label，显式 showHoverLabel 优先 |
| hoverPanelVariant | `ChartHoverPanelVariant` | `"light"` | hover 面板视觉样式 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | `"pointer"` | hover 面板定位；支持 anchor / pointer / pin 位置 |
| showHoverPanelLabel | `boolean` | `false` | 是否在 hover 面板顶部显示当前分类 label |
| hoverMode | `ChartGroupHoverMode` | — | hover 命中模式；`cell` 时按分类点位中心左右半格生成整格命中区，并响应共享 hover |
| activeCellIndex | `number \| null` | — | 受控当前 hover 分类点位；未传时可继承 `ChartGroup` |
| onCellHoverChange | `(index: number \| null) => void` | — | 分类点位 hover 变化回调 |
| valueFormat | `NumberFormatOptions` | — | 节点数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 默认行为：NumberFormats 默认。 |
| labelFormatter | `( value: number, context: { series: LineChartSeries; point: NormalizedPoint; seriesIndex: number; pointIndex: number; }, ) => string` | — | 节点数值 label 自定义格式化；优先级高于全局、组件、序列和点级 `valueFormat` |
| xAxisMode | `LineChartXAxisMode` | — | 横坐标点位模式；`edge` 表示首尾数据点与首尾 label 中心都对齐到绘图区两端，`cell` 为分类 cell 中心 |
| xLabelAutoCull | `boolean` | — | 是否根据完整 label 实测宽度自动减少横坐标 label；不删除数据点、路径或命中 cell |
| xMaxLabelCount | `number` | — | 横坐标最多显示 label 数量；始终保留首尾，并按等步数减少中间 label 与对应数据点 默认行为：- / 继承 `ChartGroup`。 |
| yLabelAutoCull | `boolean` | — | 是否根据纵向空间自动减少纵坐标 label |
| yMaxLabelCount | `number` | — | 纵坐标最多显示 label 数量；未传 `yTicks` 时也会作为生成 nice ticks 的上限 默认行为：- / 继承 `ChartGroup`。 |
| cornerRadius | `number \| string` | `8` | 圆角转折线的转角圆角半径；`0` 时为直线 |
| colors | `(LineChartColor \| undefined)[]` | — | 调色板；空项回退当前 `colorMode` |
| colorMode | `LineChartColorMode` | `"sequence"` | Chart 通用颜色模式：默认色序、单色渐浅、单色 |
| color | `LineChartColor` | — | 单色模式主色；传入后同时作为 `monochromeFade` 与 `monochrome` 的默认颜色 |
| monochromeColor | `LineChartColor` | `"Primary"` | `monochromeFade` 的单色来源；第一条序列为 100%，最后一条序列为 20%，中间按序列数量均匀递减 |
| mutedMonochromeColor | `LineChartColor` | `"Black4"` | `monochrome` 的单色来源；默认所有未自定义序列为 4% 黑色本体颜色，描边透明度保持 100% |
| showBaseLayer | `boolean` | `false` | 是否显示最终尺寸的同色轮廓（影子 / 占位底层），默认不渲染；开启后以 4% 不透明度绘制，不参与出现动效，不改变真实图形、命中区域或时间轴。同时控制完整折线及 Area 底层，不关闭真实 Area 渐变。 |
| appearMotion | `boolean` | `true` | 是否启用出现动效 |
| appearOnView | `boolean` | `true` | 是否在触发锚点进入视口默认位置时自动播放出现动效；同源 iframe 中按最外层同源页面的真实位置判断 |
| appearanceProgress | `number` | — | 受控出现进度，范围 `0..1`；传入后组件只根据该进度渲染，不自行播放 |
| defaultAppearanceProgress | `number` | `0` | 非受控初始出现进度 |
| appearanceDuration | `number` | — | 自动播放总时长覆盖；未设置时每条序列自身绘制时长固定为 `1000ms`，多序列总完成时间会随 `360ms` stagger 增加 |
| appearAnchorId | `string` | — | 动效触发锚点元素 ID；不传时使用图表自身根元素 |
| appearAnchorPoint | `AnchorPoint` | `"top"` | 使用锚点元素的顶端、中间或底部作为触发点 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置；`0.7` 表示视口高度 70% |
| scrollAppearance | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动条时间轴控制出现动效；同源 iframe 同时响应外层页面滚动 |
| scrollAppearanceDistance | `number \| string` | `320` | 滚动时间轴从 `0` 到 `1` 对应的滚动距离 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 出现进度变化回调 |
| loading | `boolean` | — | 数据等待状态。保持声明的画布尺寸、坐标轴和网格，将折线、面积和 marker 固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文。 |
| children | `Snippet` | — | 图表主体后的自定义内容，无参数；不会替换坐标轴或数据系列。 |
| class | `string` | `""` | 根层附加 class |
| style | `string` | `""` | 根层附加 style |
| enableResponsive | `boolean` | `true` | 是否启用 Frame responsive 能力 |
| enableContext | `boolean` | `true` | 是否启用 Frame context 能力 |
| enableScaleObserver | `boolean` | `false` | 是否启用 Frame scale observer |
| enableDefaultMotion | `boolean` | `true` | 是否启用 Frame 默认动效 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="1-设计原则"></a>

### 设计原则

- **Chart 原子组件**: `LineChart` 只负责折线图本体，不内置标题、卡片背景、legend 或 toolbar。
- **无内置示例数据**: `LineChart` 不在组件内部模拟业务数据；示例、业务页面或外层组合组件必须显式传入 `series` 与 `xLabels`。
- **Area 不拆分**: Area 是 `LineChart` 的序列填充形态；通过 `series[].area` 开启，不单独拆 `AreaChart`。
- **多序列**: 一张图可同时渲染实线、虚线、ChartSpec 默认色序和不同 marker 策略。
- **坐标轴内建**: 横坐标、纵坐标、网格线属于 LineChart 形态能力，放在组件内。
- **Y 轴自适应宽度**: Y 轴不使用固定预留宽度；标签区宽度等于当前最宽可见标签的实际渲染宽度，标签右边缘与绘图区起点固定保留 `12px`。标签变宽时仅按实际增加的宽度压缩绘图区。
- **动态顶部安全区**: 线条或 marker 的最高可见边缘距组件顶部至少 `8px`；显示 Y 轴时至少 `16px`。顶部数值 label 不额外增加安全区，仍保持在节点上方 `4px`，必要时可溢出绘图区顶边；marker 半径的安全区不依赖是否显示数值 label。显示 X 轴时底部仅保留 `8px` 标签间距和 `16px` 标签高度。
- **分类轴点位模型**: 横坐标默认使用 `edge` 模式，首尾数据点与首尾 label 中心都对齐到绘图区两端；也可切换为 `cell` 模式让节点位于等宽分类 cell 中心。label 放不下时按当前点位模式重新计算并自动减少中间坐标和数据点，至少保留首尾。
- **节点可定制**: 序列和单点都可配置 marker；单点配置优先级高于序列配置。
- **hover label**: 默认 hover / focus 节点时在点上方 4px 显示数值 label，不因触及绘图区顶边改变位置；同时节点反色并在节点后方显示 0.5px 黑色竖线。字号 12px、常规体，默认 Black/100%。数字格式消费 `NumberFormats.md`，默认非整数显示 2 位小数。`alwaysShowHoverLabel` 可让数值 label 常显。
- **圆角转折线**: LineChart 只保留圆角转折线；主体保持直线，只在折点处按 `cornerRadius` 生成局部圆角，`cornerRadius=0` 时为直线。
- **Chart 通用出现动效**: 每条序列自身绘制时长固定为 `1000ms`，与 CircularChart 一致；线与 Area 从左到右缓出揭示。多序列按 `360ms` 延迟依次启动，每条序列拥有独立缓出时间轴；marker 在线条 reveal 到对应点位时立即出现，不做透明度缓动。

---

<a id="2-api"></a>


### 2.1 Props


其余未声明属性会透传给根层 `Frame`。

### 2.2 组件方法

| 方法 | 描述 |
| :--- | :--- |
| `replay()` | 非受控出现动效从 `0` 重新播放到 `1` |
| `resetAppearance()` | 非受控出现动效立即重置到 `0` |
| `reverseAppearance()` | 非受控出现动效先进入完成态，再沿同一时间轴从 `1` 反向回退到 `0` |

### 2.3 数据结构

```ts
type LineChartColor = ChartColor;
type LineChartStrokeStyle = "solid" | "dashed";
type LineChartXAxisMode = "cell" | "edge";

interface LineChartMarkerConfig {
  size?: number | string;
  color?: LineChartColor | "line";
}

interface LineChartPointMarkerConfig {
  size?: number | string;
}

interface LineChartPoint {
  label?: string;
  value: number;
  marker?: boolean | LineChartPointMarkerConfig;
  valueFormat?: NumberFormatOptions;
}

interface LineChartSeries {
  name: string;
  data: (number | LineChartPoint)[];
  color?: LineChartColor;
  strokeWidth?: number | string;
  strokeStyle?: LineChartStrokeStyle;
  cornerRadius?: number | string;
  markers?: boolean | LineChartMarkerConfig;
  guides?: boolean;
  area?: boolean;
  valueFormat?: NumberFormatOptions;
}
```

数值格式优先级：`labelFormatter → point.valueFormat → series.valueFormat → 组件 valueFormat → NumberFormatContext → NumberFormats 默认值`。

颜色优先级：`series[i].color → colors[i] → colorMode 对应回退色`。默认 `sequence` 色序与 ChartSpec 一致。`color` 可作为单色模式主色，传入后 `monochromeFade` 默认从该颜色 100% 均匀递减到最后一条序列 20%，`monochrome` 默认所有未自定义序列使用该颜色；未传 `color` 时，`monochromeFade` 默认 Primary，`monochrome` 默认 Black4。颜色支持 SnowUI 语意色、普通 CSS 颜色、CSS 变量、`linear-gradient(...)` 字符串和渐变对象。

纵坐标刻度说明：

- 未传 `yMax` / `yTicks` 时，domain 上限等于 `series` 的实际最大数据值，nice ticks 只生成到不高于该值的最后一个易读刻度；最高点可以高于最后一条网格线。
- 正数数据默认包含 `0` 作为纵轴起点；存在负数时使用数据最小值参与计算。
- 步长按 `1 / 2 / 5 × 10^n` 取整，目标刻度数量由 `yTickCount` 控制。
- `yMaxLabelCount` 会限制纵坐标 label 数量；未传 `yTicks` 时优先以 `min(yTickCount, yMaxLabelCount)` 生成 nice ticks，传入大量 `yTicks` 时再按等步数抽稀显示。
- `yMin` / `yMax` 可作为 domain 边界提示；`yTicks` 显式传入时优先级最高。
- `yMin` / `yMax` 不会把超出范围的数据夹到边界；超出 domain 的折线与 Area 会先按 Y domain 生成可见片段，边界处保留圆头端点，marker 与 guide 仅在点值位于当前 Y domain 内时显示。
- `showGrid && showXAxis` 时，水平线总数默认为 `yTickCount=6`，其中最底下一条由 x 轴基线承担，避免底线重复绘制。

Area 填充说明：

- `area: true` 在序列使用普通颜色时生成纵向渐变，顶部不透明度为 `0.04`（4%），底部渐变到 `0`（全透明）。序列 `color` 显式使用 CSS 渐变或 `ChartGradient` 对象时，Area 直接沿用其色标及透明度；两个相同颜色且不透明的色标可形成实色面积。
- Area 不提供独立于线条的颜色、透明度、渐变或 baseline 配置；通过序列 `color` 同时影响线条和面积，通过纵轴 domain 影响 baseline。
- `area` 与 `strokeStyle` 独立，可组合出“虚线 + 半透明面积填充”。

Marker 说明：

- marker 默认关闭；需要节点时通过 `series[].markers` 或 `point.marker` 显式开启。
- `markers: true` 使用 Figma Dot 结构：整体 `8x8`，由下层 Black/100% 圆与上层 White/100% 圆两层组成；下层圆为 `8x8`，上层圆为 `4x4`，分别使用 `var(--black-100)` 与 `var(--white-100)`。
- `markers.size` / `point.marker.size` 只做整体等比缩放。
- `markers.color` 只替换设计稿中的下层 Black/100%；可传任意颜色，也可传 `"line"` 跟随当前线色。
- 单点 `point.marker` 只允许改尺寸或关闭，不允许在同一条线上定义不同颜色的节点。
- marker hover / focus 时下层圆变为 White/100%（`var(--white-100)`），上层圆变为 Black/100%（`var(--black-100)`），并在节点后方显示一条贯穿绘图区的竖线；竖线粗细 `0.5px`、圆头、Black/100%。
- marker 其他结构、下层/上层比例与 hover 竖线不提供自定义。

线形说明：

- LineChart 只保留圆角转折线，主体为直线段，只在中间折点处按 `cornerRadius` 截短前后线段并生成局部圆角。
- `cornerRadius=0` 时不生成圆角，表现为普通直线折线。
- `strokeStyle="dashed"` 使用 Figma stroke 设置：dash `2`、gap `4`、round cap。

---

<a id="4-布局模型"></a>

### 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区。
- 根层直接观察最终显示尺寸并重算 SVG 坐标；`width="100%"` / `height="100%"` 不要求页面回传容器尺寸。
- 横向分类轴按 `max(xLabels.length, ...series.data.length)` 计算点位数量；`cell` 模式节点位置为 `bounds.left + (plotWidth / count) * (index + 0.5)`，`edge` 模式节点位置为 `bounds.left + (plotWidth / (count - 1)) * index`，单点时居中。
- X 轴 label 使用当前点位间距作为 cell 宽度，文字居中且单行省略；整体高度为 `16px`。
- `edge` 模式下首尾 label 的中心与首尾数据点同 x 坐标，label cell 允许向绘图区外侧延伸。
- X 轴 label 自动显示规则：按最终字体实测完整文字宽度与当前 `xAxisMode` 的原始数据位置判断，相邻可见文字至少间隔 `4px`。抽稀只减少 label，不删除或重排数据点、折线路径、marker、guide 与命中 cell。保留索引必须形成等差步数；若首尾两个完整 label 仍放不下，则隐藏全部 X label。
- Y 轴 label 抽稀规则：自动生成刻度时优先通过 `yTickCount` / `yMaxLabelCount` 生成合适数量；显式传入 `yTicks` 或纵向空间不足时，按首尾保留、等步数的规则减少显示 label，水平网格线跟随可见 Y label。
- X 轴 label cell 顶部到最下面 x 轴基线的间距为 `8px`。
- 绘图区顶部由共享内容感知规则计算：线条宽度的一半或当前最大 marker 半径作为图形向上溢出量；普通图形保持 `8px` 安全距离，Y 轴顶刻度至少需要 `16px`。顶部数值 label 不增加该值，继续保持节点上方 `4px` 并可溢出绘图区顶边；marker 的溢出量始终计入，不依赖 label 是否显示。有 X 轴时 `bottom=24px`，只包含上述 `8px` 间距和 `16px` label 高度；无 X 轴时 `bottom=0`。
- Y 轴标签区宽度由全部可见 Y label 中最宽文本的实际 SVG 渲染宽度决定，不使用固定 bounds 或字符数量估算；label 右边缘到绘图区线段起点的间距固定为 `12px`。例如 formatter 输出 `100000` 时，绘图区只按该文本比短刻度新增的实际宽度缩小，固定间距不变。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.7](../../../specs/maintainers/LayoutProtocol.md)。

---

<a id="5-无障碍与-frame-集成"></a>

### 无障碍与 Frame 集成

- 根层使用 `role="img"` 和 `aria-label="折线图"`。
- 每个 marker 使用独立 `aria-label`，内容包含序列名、横坐标标签和值。
- marker 内部包含透明命中圆，保证键盘焦点与鼠标命中不只依赖可见圆点半径。
- marker 可见层不接管 pointer events，白色中心、黑色外圈与透明命中圆统一由命中圆触发；默认命中区域不小于 `16x16`。
- 独立使用或接入 `ChartGroup` 时均支持 `hoverMode="cell"`；cell 命中区按分类点位中心左右半格覆盖绘图区，对应分类点位的 marker 响应 hover，marker 自身命中区仍独立保留。
- `loading` 保留完整画布与坐标结构，只把折线、面积和 marker 恢复到出现动效起点；根 Frame 明确关闭 Skeleton。空 `series={[]}` 可配合 `xLabels`、`yMin`、`yMax` 先建立最终坐标。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

<a id="6-图层与动效"></a>

### 图层与动效

SVG 图层从下到上为：

1. `defs`: 颜色渐变、Area 渐变、序列 reveal clipPath。
2. grid / axis layer: 水平网格线和 x 轴基线。
3. base layer: `showBaseLayer=true` 时绘制完整 Area 与折线路径的同色 4% 占位层，不参与出现动效；默认不渲染。
4. area layer: 真实 Area 路径，按对应序列 clipPath 从左到右揭示。
5. guide layer: 节点垂直辅助线，跟随对应序列进度显隐。
6. series layer: 真实折线路径，按对应序列 clipPath 从左到右揭示。
7. marker layer: 节点点、hover 竖线与透明命中圆，在线条 reveal 到对应点位时立即显隐。
8. axis label layer: 横纵坐标文本。

出现动效沿用 Chart 通用 API：

- `appearMotion={false}` 时直接显示完整图表。
- 默认进入视口后自动播放，播放顺序按 `series` 数组顺序。
- 每条序列使用 `appearance-timeline.ts` 的 `fillProgress` 与 `opacityProgress`。
- 每条序列自身绘制时长固定为 `1000ms`，与 CircularChart 一致。
- 多序列默认相隔 `360ms` 启动；第一条序列立即出现，后续序列依次延迟启动。
- `fillProgress` 控制从左到右的 reveal clip 宽度，并使用缓出；LineChart 当前使用 `easeOut` power `6`。
- `opacityProgress` 控制真实线、Area 和辅助线的透明度，并使用同一缓出。
- marker 不消费 `opacityProgress`；线条 reveal 边界到达该点 x 坐标时立即出现。
- 支持 `appearanceProgress` 受控时间轴、滚动时间轴和 `replay()` / `resetAppearance()` / `reverseAppearance()` 方法。

---


<a id="自适应黑白对比接入"></a>


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 自适应黑白对比接入

使用 [Adaptive Contrast](../lib/adaptive-contrast.md) 共享入口。组件保留前景形状、数值和交互；ChartGroup 协调同原点表面数据。本组件默认开启 `adaptiveContrast`，可通过 `adaptiveContrast={false}` 关闭，不穿透私有 SVG。




> **状态**: 已实现


> **参考**: Figma Workshop 节点 `12617:1780`。

---

<a id="3-样式-token-详表"></a>

### 样式 Token 详表

| 属性 | 默认值 | Token / 变量 |
| :--- | :--- | :--- |
| 整体宽度 | 800px | `--snowui-line-chart-width` |
| 整体高度 | 400px | `--snowui-line-chart-height` |
| 轴标签字号 | 12px | `--snowui-line-chart-axis-font-size` |
| 轴标签行高 | 16px | `--snowui-line-chart-axis-line-height` |
| 轴标签颜色 | 40% 黑色 | `--snowui-line-chart-axis-color` |
| 网格线颜色 | 10% 黑色 | `--snowui-line-chart-grid-color` |
| 垂直辅助线颜色 | 10% 黑色 | `--snowui-line-chart-guide-color` |
| x 轴基线颜色 | 40% 黑色 | `--snowui-line-chart-axis-line-color` |
| 默认线宽 | 1px | `--snowui-line-chart-stroke-width` |
| 默认 marker 尺寸 | 8px | `--snowui-line-chart-marker-size` |
| hover label 颜色 | Black/100% | `--snowui-line-chart-hover-label-color` |

### 3.1 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-line-chart-width-override` | 整体宽度 |
| `--snowui-line-chart-height-override` | 整体高度 |
| `--snowui-line-chart-axis-font-size-override` | 坐标轴标签字号 |
| `--snowui-line-chart-axis-color-override` | 坐标轴标签颜色 |
| `--snowui-line-chart-grid-color-override` | 网格线颜色 |
| `--snowui-line-chart-axis-line-color-override` | x 轴基线颜色 |
| `--snowui-line-chart-hover-label-color-override` | hover label 强制颜色 |

---

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| LineChart | [./LineChart.svelte](LineChart.svelte) | 主组件 |
| LineChart 示例 | [./LineChart.test.ts](LineChart.test.ts) | Test 示例 |
| Chart 共享逻辑 | [../lib/chart/](../lib/chart) | 颜色、渐变、基础几何 helper、Y 轴标签宽度测量、线性 appearance 时间表与逐帧 pointer 坐标合并 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `series` | SVG path + marker | 多序列折线 |
| `strokeStyle` | `stroke-dasharray` | solid / dashed |
| `cornerRadius` | rounded path 几何 | 0 时为直线 |
| `markers` / `point.marker` | SVG circle group | 序列控制颜色和尺寸；单点仅控制尺寸 / 显隐 |
| `area` | SVG closed path | 序列面积填充，可与虚线组合 |
| `appearMotion` / `appearanceProgress` | reveal clipPath + timeline | 复用 Chart appearance timeline |
| `xLabels` / `yTicks` | SVG text | 坐标轴标签 |

---

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.6.1 (2026-09-05)

- 多序列 appearance 每帧改为一次线性时间表计算；HoverPanel pointer 原始事件不再同步读取布局，坐标换算按绘制帧合并。公开 API、路径、marker、时长、视觉和交互语义不变。

### v1.6.0 (2026-09-03)

- 新增 `showBaseLayer=false`，按需开启最终尺寸的同色轮廓；真实图形和出现动效保持原有行为。
- `adaptiveContrast` 改为默认开启，保留显式关闭与子图覆盖。

### v1.5.0 (2026-09-03)

- `adaptiveContrast` 接入 自适应黑白对比共享能力；保留开关默认值、彩色前景、命中和节点状态语义，移除图表私有试验实现。

### v1.4.2 (2026-09-02)

- HoverPanel 默认定位改为 `pointer`，随鼠标移动；区域 hover 默认保持 `cell`，显式的 placement / hoverMode 配置继续优先。

### 2026-09-02

- HoverPanel 改为默认开启，默认外观保持 light。

### v1.4.1 (2026-09-02)

#### 调整
- 顶部数值 label 不再增加安全区，仍保持节点上方 `4px` 并可溢出绘图区顶边；默认颜色为 Black/100%。

### v1.3.5 (2026-09-01)

#### 调整
- 自动 domain 上限改为实际最大数据值，最高 nice tick 不再超过最大值；顶部只由内容安全区决定。

### v1.3.4 (2026-08-31)

#### 调整
- 顶部改为内容感知安全区，按 Y 轴、hover label、线宽和 marker 半径动态计算；自动 nice domain 同步收紧。

### v1.3.3 (2026-08-31)

#### 调整
- 移除笛卡尔绘图区顶部和底部的额外留白；底部仅保留 X 轴标签自身所需的 `24px`。

### v1.3.2 (2026-08-31)

#### 调整
- Y 轴改为按最宽可见标签的实际渲染宽度自适应，标签与绘图区之间固定保留 `12px`。

### v1.3.1 (2026-06-07)

#### 调整
- marker 改为两层圆结构：下层 8x8 Black/100% 圆，上层 4x4 White/100% 圆，并移除节点阴影。
- marker hover / focus 增加反色状态，并在节点后方显示 0.5px Black/100% 圆头竖线。

### v1.3.0 (2026-06-04)

#### 新功能
- 新增 Chart 通用 `colorMode`：`sequence`、`monochromeFade`、`monochrome`。
- 新增 `color` 主色以及 `monochromeColor` / `mutedMonochromeColor` 细分入口；三种颜色模式均支持 `series[i].color` 与 `colors[i]` 指定序列自定义颜色。

### v1.2.0 (2026-06-03)

#### 调整
- 移除组件内部示例数据默认值，`series` 与 `xLabels` 默认改为 `[]`。
- `LC-01` 与 `LC-09` 示例显式传入月度数据；`LC-09` 改为完整坐标图，展示真实图表形态下的圆角转折线。
- 横坐标支持 `cell` / `edge` 两种点位模型；`edge` 下首尾数据点和辅助线对齐到绘图区两端，首尾 label box 可向绘图区内部移动以完整显示。label 过长时只抽稀文字，全部数据点与交互仍位于原始索引位置。
- 只保留圆角转折线，删除 `curve` API；`cornerRadius=0` 时为直线。
- 纵坐标刻度改为根据数据自动生成 nice ticks；默认色序回到 ChartSpec；折线默认线宽改为 1px。
- Area API 收敛为 `area: boolean`，固定使用当前线色渐变到 0% 透明度；marker 默认尺寸改为 12px，单点不允许改色。

### v1.1.0 (2026-06-03)

#### 新功能
- 支持 Chart 通用出现动效 API、滚动时间轴、受控进度和 `replay()` / `resetAppearance()` / `reverseAppearance()` 方法。
- 补充完整 base layer 与 marker 透明命中圆，让图层和交互更贴近 ChartSpec。
- 支持 `cornerRadius`，实现直线段为主、折点局部圆角的线形；后续已收敛为唯一线形 API。

### v1.0.0 (2026-06-03)

#### 新功能
- 初始版本，支持多序列、实线 / 虚线、横坐标、纵坐标、水平网格与可定制 marker。
- 支持 `series[].area`，Area 填充可与实线 / 虚线组合。
