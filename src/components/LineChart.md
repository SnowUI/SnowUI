# LineChart (折线图)

> **版本**: v1.3.1
> **状态**: 已实现(PRO)
> **包归属**: `@snowui-design-system/components-pro`
> **职责**: 渲染带横坐标、纵坐标、网格线、实线 / 虚线、Area 填充、多序列、圆角转折线与可定制节点点样式的折线图。
> **参考**: Figma Workshop 节点 `12617:1780`。

---

## 1. 设计原则

- **PRO Chart 原子组件**: `LineChart` 只负责折线图本体，不内置标题、卡片背景、legend 或 toolbar。
- **无内置示例数据**: `LineChart` 不在组件内部模拟业务数据；示例、业务页面或外层组合组件必须显式传入 `series` 与 `xLabels`。
- **Area 不拆分**: Area 是 `LineChart` 的序列填充形态；通过 `series[].area` 开启，不单独拆 `AreaChart`。
- **多序列**: 一张图可同时渲染实线、虚线、ChartSpec 默认色序和不同 marker 策略。
- **坐标轴内建**: 横坐标、纵坐标、网格线属于 LineChart 形态能力，放在组件内。
- **分类轴点位模型**: 横坐标默认使用 `edge` 模式，首尾数据点与首尾 label 中心都对齐到绘图区两端；也可切换为 `cell` 模式让节点位于等宽分类 cell 中心。label 放不下时按当前点位模式重新计算并自动减少中间坐标和数据点，至少保留首尾。
- **节点可定制**: 序列和单点都可配置 marker；单点配置优先级高于序列配置。
- **hover label**: 默认 hover / focus 节点时在点上方 4px 显示数值 label，同时节点反色并在节点后方显示 0.5px 黑色竖线；字号 12px，常规体，颜色为 Black/100%（`var(--black-100)`），数字格式消费 `NumberFormats.md`，默认非整数显示 2 位小数。`alwaysShowHoverLabel` 可让数值 label 常显。
- **圆角转折线**: LineChart 只保留圆角转折线；主体保持直线，只在折点处按 `cornerRadius` 生成局部圆角，`cornerRadius=0` 时为直线。
- **Chart 通用出现动效**: 每条序列自身绘制时长固定为 `1000ms`，与 CircularChart 一致；线与 Area 从左到右缓出揭示。多序列按 `360ms` 延迟依次启动，每条序列拥有独立缓出时间轴；marker 在线条 reveal 到对应点位时立即出现，不做透明度缓动。

---

## 2. API

### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `series` | `LineChartSeries[]` | `[]` | 图表序列数据；组件不内置模拟数据 |
| `xLabels` | `string[]` | `[]` / 继承 `ChartGroup` | 横坐标标签；未传时使用 `ChartGroup.xLabels` 或按数据点索引生成内部坐标标签 |
| `width` | `number \| string` | `800` | 图表整体宽度；数字按 px 语义转为 rem |
| `height` | `number \| string` | `400` | 图表整体高度；数字按 px 语义转为 rem |
| `yMin` | `number` | 自动 / 继承 `ChartGroup` | 纵坐标最小值；未传时根据数据生成 nice domain，正数数据默认包含 `0` |
| `yMax` | `number` | 自动 / 继承 `ChartGroup` | 纵坐标最大值；未传时根据数据生成 nice domain |
| `yTicks` | `number[]` | 自动 nice ticks / 继承 `ChartGroup` | 纵坐标刻度 |
| `yTickCount` | `number` | `6` / 继承 `ChartGroup` | 未传 `yTicks` 时用于生成 nice ticks 的目标刻度数量 |
| `yTickFormatter` | `(value: number) => string` | K 格式 / 继承 `ChartGroup` | 纵坐标格式化 |
| `showXAxis` | `boolean` | `true` / 继承 `ChartGroup` | 是否显示横坐标 |
| `showYAxis` | `boolean` | `false` / 继承 `ChartGroup` | 是否显示纵坐标 |
| `showGrid` | `boolean` | `false` / 继承 `ChartGroup` | 是否显示水平网格线 |
| `showGuides` | `boolean` | `false` / 继承 `ChartGroup` | 是否允许序列绘制节点垂直辅助线 |
| `showHoverLabel` | `boolean` | 按 `showHoverPanel` 推导 | hover / focus 节点时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 |
| `alwaysShowHoverLabel` | `boolean` | `false` | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| `showHoverPanel` | `boolean` | `false` | 是否开启 Chart hover 面板，内容按当前节点 / cell 自动生成；默认关闭时 hover / focus 显示 hover label |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | hover 面板视觉样式 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"anchor-top"` | hover 面板定位；支持 anchor / pointer / pin 位置 |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在 hover 面板顶部显示当前分类 label |
| `hoverMode` | `"item" \| "cell"` | `"cell"` / 继承 `ChartGroup` | hover 命中模式；`cell` 时按分类点位中心左右半格生成整格命中区，并响应共享 hover |
| `activeCellIndex` | `number \| null` | - | 受控当前 hover 分类点位；未传时可继承 `ChartGroup` |
| `onCellHoverChange` | `(index: number \| null) => void` | - | 分类点位 hover 变化回调 |
| `valueFormat` | `NumberFormatOptions` | NumberFormats 默认 | 节点数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 |
| `labelFormatter` | `(value, context) => string` | - | 节点数值 label 自定义格式化；优先级高于全局、组件、序列和点级 `valueFormat` |
| `xAxisMode` | `"cell" \| "edge"` | `"edge"` / 继承 `ChartGroup` | 横坐标点位模式；`edge` 表示首尾数据点与首尾 label 中心都对齐到绘图区两端，`cell` 为分类 cell 中心 |
| `xLabelAutoCull` | `boolean` | `true` / 继承 `ChartGroup` | 是否根据 label 宽度自动减少横坐标 label 与对应数据点 |
| `xMaxLabelCount` | `number` | - / 继承 `ChartGroup` | 横坐标最多显示 label 数量；始终保留首尾，并按等步数减少中间 label 与对应数据点 |
| `yLabelAutoCull` | `boolean` | `true` / 继承 `ChartGroup` | 是否根据纵向空间自动减少纵坐标 label |
| `yMaxLabelCount` | `number` | - / 继承 `ChartGroup` | 纵坐标最多显示 label 数量；未传 `yTicks` 时也会作为生成 nice ticks 的上限 |
| `cornerRadius` | `number \| string` | `8` | 圆角转折线的转角圆角半径；`0` 时为直线 |
| `colors` | `(LineChartColor \| undefined)[]` | - | 调色板；空项回退当前 `colorMode` |
| `colorMode` | `"sequence" \| "monochromeFade" \| "monochrome"` | `"sequence"` | Chart 通用颜色模式：默认色序、单色渐浅、单色 |
| `color` | `LineChartColor` | - | 单色模式主色；传入后同时作为 `monochromeFade` 与 `monochrome` 的默认颜色 |
| `monochromeColor` | `LineChartColor` | `"Primary"` | `monochromeFade` 的单色来源；第一条序列为 100%，最后一条序列为 20%，中间按序列数量均匀递减 |
| `mutedMonochromeColor` | `LineChartColor` | `"Black4"` | `monochrome` 的单色来源；默认所有未自定义序列为 4% 黑色本体颜色，描边透明度保持 100% |
| `appearMotion` | `boolean` | `true` | 是否启用出现动效 |
| `appearOnView` | `boolean` | `true` | 是否在触发锚点进入视口默认位置时自动播放出现动效 |
| `appearanceProgress` | `number` | - | 受控出现进度，范围 `0..1`；传入后组件只根据该进度渲染，不自行播放 |
| `defaultAppearanceProgress` | `number` | `0` | 非受控初始出现进度 |
| `appearanceDuration` | `number` | - | 自动播放总时长覆盖；未设置时每条序列自身绘制时长固定为 `1000ms`，多序列总完成时间会随 `360ms` stagger 增加 |
| `appearAnchorId` | `string` | - | 动效触发锚点元素 ID；不传时使用图表自身根元素 |
| `appearAnchorPoint` | `"top" \| "center" \| "bottom"` | `"top"` | 使用锚点元素的顶端、中间或底部作为触发点 |
| `appearViewportPoint` | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置；`0.7` 表示视口高度 70% |
| `scrollAppearance` | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动条时间轴控制出现动效 |
| `scrollAppearanceDistance` | `number \| string` | `320` | 滚动时间轴从 `0` 到 `1` 对应的滚动距离 |
| `onAppearanceProgressChange` | `(progress: number) => void` | - | 出现进度变化回调 |
| `loading` | `boolean` | - | Frame loading 协议 |
| `skeleton` | `boolean` | - | Frame skeleton 协议 |
| `renderHints` | `RenderHints` | - | 骨架屏渲染提示 |
| `enableResponsive` | `boolean` | `true` | 是否启用 Frame responsive 能力 |
| `enableContext` | `boolean` | `true` | 是否启用 Frame context 能力 |
| `enableScaleObserver` | `boolean` | `false` | 是否启用 Frame scale observer |
| `enableDefaultMotion` | `boolean` | `true` | 是否启用 Frame 默认动效 |
| `class` | `string` | `""` | 根层附加 class |
| `style` | `string` | `""` | 根层附加 style |

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

- 未传 `yTicks` 时，组件根据 `series` 数据值自动生成 nice ticks。
- 正数数据默认包含 `0` 作为纵轴起点；存在负数时使用数据最小值参与计算。
- 步长按 `1 / 2 / 5 × 10^n` 取整，目标刻度数量由 `yTickCount` 控制。
- `yMaxLabelCount` 会限制纵坐标 label 数量；未传 `yTicks` 时优先以 `min(yTickCount, yMaxLabelCount)` 生成 nice ticks，传入大量 `yTicks` 时再按等步数抽稀显示。
- `yMin` / `yMax` 可作为 domain 边界提示；`yTicks` 显式传入时优先级最高。
- `yMin` / `yMax` 不会把超出范围的数据夹到边界；超出 domain 的折线与 Area 会先按 Y domain 生成可见片段，边界处保留圆头端点，marker 与 guide 仅在点值位于当前 Y domain 内时显示。
- `showGrid && showXAxis` 时，水平线总数默认为 `yTickCount=6`，其中最底下一条由 x 轴基线承担，避免底线重复绘制。

Area 填充说明：

- `area: true` 使用当前序列线色生成纵向渐变，顶部透明度固定为 `0.08`，底部渐变到 `0`。
- Area 不提供颜色、透明度、渐变或 baseline 自定义；需要变化时通过线色或纵轴 domain 间接影响。
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

## 3. 样式 Token 详表

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
| `--snowui-line-chart-hover-label-color-override` | hover label 颜色 |

---

## 4. 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区。
- 尺寸由 `width` / `height` 与 SVG 坐标算法决定；作为外部布局子项时表现为 Hug。
- 横向分类轴按 `max(xLabels.length, ...series.data.length)` 计算点位数量；`cell` 模式节点位置为 `bounds.left + (plotWidth / count) * (index + 0.5)`，`edge` 模式节点位置为 `bounds.left + (plotWidth / (count - 1)) * index`，单点时居中。
- X 轴 label 使用当前点位间距作为 cell 宽度，文字居中且单行省略；整体高度为 `16px`。
- `edge` 模式下首尾 label 的中心与首尾数据点同 x 坐标，label cell 允许向绘图区外侧延伸。
- X 轴 label 自动显示规则：按每个 label 的估算显示宽度与当前 `xAxisMode` 下的 label cell 宽度判断；若完整 label 放不进 cell，或设置了 `xMaxLabelCount`，则按同一索引自动减少中间 label 和数据点。保留索引必须形成等差步数，若当前显示数量无法让原始步数均分，则继续减少显示数量；例如 20 个点限制最多 5 个时，因为 `20 - 1 = 19` 无法被 `5 - 1`、`4 - 1`、`3 - 1` 整除，所以只保留首尾。每次抽稀后按当前 `xAxisMode` 重新计算 label cell，直到布局稳定，并始终保留首尾 label。ellipsis 只作为极端兜底，不作为抽稀后的正常结果。
- Y 轴 label 抽稀规则：自动生成刻度时优先通过 `yTickCount` / `yMaxLabelCount` 生成合适数量；显式传入 `yTicks` 或纵向空间不足时，按首尾保留、等步数的规则减少显示 label，水平网格线跟随可见 Y label。
- X 轴 label cell 顶部到最下面 x 轴基线的间距为 `8px`。
- Y 轴 label 右边缘到绘图区线段起点的间距为 `12px`。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.7](../../../specs/LayoutProtocol.md)。

---

## 5. 无障碍与 Frame 集成

- 根层使用 `role="img"` 和 `aria-label="折线图"`。
- 每个 marker 使用独立 `aria-label`，内容包含序列名、横坐标标签和值。
- marker 内部包含透明命中圆，保证键盘焦点与鼠标命中不只依赖可见圆点半径。
- marker 可见层不接管 pointer events，白色中心、黑色外圈与透明命中圆统一由命中圆触发；默认命中区域不小于 `16x16`。
- 独立使用或接入 `ChartGroup` 时均支持 `hoverMode="cell"`；cell 命中区按分类点位中心左右半格覆盖绘图区，对应分类点位的 marker 响应 hover，marker 自身命中区仍独立保留。
- 支持 `loading`、`skeleton`、`renderHints`。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

## 6. 图层与动效

SVG 图层从下到上为：

1. `defs`: 颜色渐变、Area 渐变、序列 reveal clipPath。
2. grid / axis layer: 水平网格线和 x 轴基线。
3. base layer: 完整 Area 与折线路径的同色 4% 占位层，不参与出现动效。
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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| LineChart | [./LineChart.svelte](./LineChart.svelte) | 主组件 |
| LineChart 示例 | [./LineChart.test.ts](./LineChart.test.ts) | Test 示例 |
| Chart 共享逻辑 | [../lib/chart/](../lib/chart/) | 颜色、渐变、基础几何 helper、appearance timeline |

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

## 更新日志 (Changelog)

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
- 横坐标支持 `cell` / `edge` 两种点位模型；`edge` 下首尾数据点、辅助线和首尾 label 中心都对齐到绘图区两端；label 过长时按当前点位模式重新计算并自动抽稀坐标和数据点，保留索引必须形成等差步数，至少保留首尾。
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
