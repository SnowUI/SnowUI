# BarChart (柱状图)

> **版本**: v1.0.4
> **状态**: 已实现(PRO)
> **包归属**: `@snowui/components-pro`
> **职责**: 渲染支持纵向 / 横向、单柱、多段、相叠、多柱并排与坐标轴的柱状图。

---

## 1. 设计原则

- **PRO Chart 原子组件**: `BarChart` 只负责柱状图本体，不内置标题、卡片背景、legend 或 toolbar。
- **单元模型**: 一个分类项是一个 **bar unit**。单元统一控制柱粗细、圆角、方向和分类坐标；单元内部可以渲染单柱、多段、相叠柱或多根并排柱。
- **多段式统一规则**: 三段式是多段式的特例。`mode="stack"` 使用 `segments` 渲染任意段数；`segmentGap={0}` 表示中间无间隔，`segmentGap>0` 表示分段之间有透明间隔且每段独立圆角。
- **相叠规则**: `mode="overlay"` 使用 `value` 作为前层，`backgroundValue` 作为后层。后层透明度固定为 10%，前层为 100%，二者同轴相叠。
- **并排规则**: `mode="group"` 使用 `bars` 在同一单元内并排。默认柱间距 `barGap=4`，颜色使用 Chart 默认色序，可扩展为多柱。
- **方向规则**: `orientation="vertical"` 为纵向柱状图，分类轴在横向；`orientation="horizontal"` 为横向条形图，分类轴在纵向。所有柱模式都支持两个方向。
- **坐标轴内建**: 坐标轴、刻度、网格线属于 BarChart 形态能力，放在组件内。
- **Y 轴自适应宽度**: Y 轴不使用固定预留宽度；标签区宽度等于当前最宽可见标签的实际渲染宽度，标签右边缘与绘图区起点固定保留 `12px`。纵向数值轴和横向分类轴使用同一 Chart 共享测量入口；标签变宽时仅按实际增加的宽度压缩绘图区。
- **动态顶部安全区**: 普通柱距组件顶部至少 `8px`；纵向图显示 Y 轴时最小为 `16px`；显示顶部数值 label 时为 `28px`。显示 X 轴时底部仅保留 `8px` 标签间距和 `16px` 标签高度，标签底边与组件底部对齐；隐藏 X 轴时绘图区延伸到组件底部。
- **hover 规则**: 柱体 hover 使用 `StyleSpec.md §2.4` 的 overlay 机制，不改写柱体本身颜色。视觉透明度为 40% 及以上的实心柱按 filled Button hover 规则叠加 `StaticWhite/20%`；视觉透明度低于 40% 的浅透明柱按浅黑 hover 档位叠加 `Black/4%`。`overlay` 后层 10% 与多段式浅色段都会走 `Black/4%` overlay。
- **hover label**: 默认 hover / focus 柱体时在柱体上方 4px 显示数值 label；字号 12px，常规体，颜色为 Black/100%（`var(--black-100)`），数字格式消费 `NumberFormats.md`，默认非整数显示 2 位小数。`stack` 分段柱中只有最上方分段 label 使用该颜色，其余分段 label 使用 `StaticWhite/100%`。`alwaysShowHoverLabel` 可让数值 label 常显；出现动效播放时，label 数值跟随当前柱高比例实时变化，从 `80%` 对应值变化到完整值。
- **出现动效**: 所有分类单元共享一条 BarChart 出现动效时间轴；柱体初始显示为目标高度 / 宽度的 `80%`，再从左到右依次升高到 `100%`。相邻分类单元的启动间隔固定；整条时间轴应用 `easeOut` 缓动；单柱升高使用 Frame 默认 morph 时长 `300ms` 作为基准，每个分类单元的变高进度单独应用 `easeOut` 缓动，并且越靠右的单元升高时长越长。`stack` 模式把一个分类单元内的所有分段看作同一个动效整体：同一单元内的所有分段共享同一局部进度，从各自 `80%` 高度一起升高到 `100%`，不分别启动独立变高动效；`segmentGap` 在动效过程中保持固定像素间距，`segmentGap=0` 时始终无间距。

---

## 2. API

### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `data` | `BarChartItem[]` | 内置默认数据 | 分类单元数据 |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | 图表方向 |
| `mode` | `"single" \| "stack" \| "overlay" \| "group"` | `"single"` | 单元内部柱模式 |
| `width` | `number \| string` | `800` | 图表整体宽度 |
| `height` | `number \| string` | `400` | 图表整体高度 |
| `barWidth` | `number \| string` | `32` | 单根柱粗细；纵向时为宽度，横向时为高度 |
| `barGap` | `number \| string` | `4` | `group` 模式中同一单元内相邻柱间距 |
| `groupGap` | `number \| string` | `20` | 分类单元内容与 cell 边缘的预留间距 |
| `segmentGap` | `number \| string` | `0` | `stack` 模式中分段间隔；`0` 表示无间隔 |
| `cornerRadius` | `number \| string` | `8` | 柱圆角大小 |
| `roundedStart` | `boolean` | `true` | 是否保留起点端圆角；纵向为底部，横向为左侧 |
| `roundedEnd` | `boolean` | `true` | 是否保留终点端圆角；纵向为顶部，横向为右侧 |
| `xLabels` | `string[]` | `[]` / 继承 `ChartGroup` | 分类 label 覆盖；未传时使用 `ChartGroup.xLabels` 或 `data[].name` |
| `yMin` | `number` | 自动 / 继承 `ChartGroup` | 数值轴 domain 最小值 |
| `yMax` | `number` | 自动 / 继承 `ChartGroup` | 数值轴 domain 最大值；自动时等于实际最大数据值，不向上取整 |
| `yTicks` | `number[]` | 自动 nice ticks / 继承 `ChartGroup` | 数值轴刻度 |
| `yTickCount` | `number` | `6` / 继承 `ChartGroup` | 自动 tick 目标数量 |
| `yTickFormatter` | `(value: number) => string` | K 格式 / 继承 `ChartGroup` | 数值轴 label 格式化 |
| `showXAxis` | `boolean` | `true` / 继承 `ChartGroup` | 是否显示底部轴线与底部 label |
| `showYAxis` | `boolean` | `false` / 继承 `ChartGroup` | 是否显示左侧 label |
| `showGrid` | `boolean` | `false` / 继承 `ChartGroup` | 是否显示网格线 |
| `showGuides` | `boolean` | `false` / 继承 `ChartGroup` | 保留 Chart API 命名；当前不绘制额外 guide |
| `showHoverLabel` | `boolean` | 按 `showHoverPanel` 推导 | hover / focus 柱体时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 |
| `alwaysShowHoverLabel` | `boolean` | `false` | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| `showHoverPanel` | `boolean` | `false` | 是否开启 Chart hover 面板，内容按当前柱 / cell 自动生成；默认关闭时 hover / focus 显示 hover label |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | hover 面板视觉样式 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"anchor-top"` | hover 面板定位；支持 anchor / pointer / pin 位置 |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在 hover 面板顶部显示当前分类 label |
| `hoverMode` | `"item" \| "cell"` | `"cell"` / 继承 `ChartGroup` | hover 命中模式；`cell` 时按分类中心左右半格生成整格命中区，同一分类单元内的所有柱 / 分段一起响应 |
| `activeCellIndex` | `number \| null` | - | 受控当前 hover 分类单元；未传时可继承 `ChartGroup` |
| `onCellHoverChange` | `(index: number \| null) => void` | - | 分类单元 hover 变化回调 |
| `valueFormat` | `NumberFormatOptions` | NumberFormats 默认 | 柱体数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 |
| `labelFormatter` | `(value, context) => string` | - | 柱体数值 label 自定义格式化；优先级高于全局、组件和数据项 `valueFormat` |
| `xLabelAutoCull` | `boolean` | `true` / 继承 `ChartGroup` | 是否自动减少分类 label 和对应数据 |
| `xMaxLabelCount` | `number` | - / 继承 `ChartGroup` | 分类 label 最大显示数量 |
| `yLabelAutoCull` | `boolean` | `true` / 继承 `ChartGroup` | 是否自动减少数值轴 label |
| `yMaxLabelCount` | `number` | - / 继承 `ChartGroup` | 数值轴 label 最大显示数量 |
| `colors` | `(BarChartColor \| undefined)[]` | - | 调色板；空项回退当前 `colorMode` |
| `colorMode` | `"sequence" \| "monochromeFade" \| "monochrome"` | `"sequence"` | Chart 通用颜色模式 |
| `color` | `BarChartColor` | - | 单色模式主色 |
| `monochromeColor` | `BarChartColor` | `"Primary"` | 单色渐浅来源 |
| `mutedMonochromeColor` | `BarChartColor` | `"Black4"` | 单色来源 |
| `appearMotion` | `boolean` | `true` | 是否启用出现动效 |
| `appearOnView` | `boolean` | `true` | 是否进入视口后自动播放 |
| `appearanceProgress` | `number` | - | 受控出现进度 |
| `defaultAppearanceProgress` | `number` | `0` | 非受控初始出现进度 |
| `appearanceDuration` | `number` | - | 自动播放总时长覆盖 |
| `appearAnchorId` | `string` | - | 动效触发锚点 ID |
| `appearAnchorPoint` | `"top" \| "center" \| "bottom"` | `"top"` | 锚点触发位置 |
| `appearViewportPoint` | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置 |
| `scrollAppearance` | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动时间轴 |
| `scrollAppearanceDistance` | `number \| string` | `320` | 滚动映射距离 |
| `onAppearanceProgressChange` | `(progress: number) => void` | - | 出现进度变化回调 |
| `loading` | `boolean` | - | Frame loading 协议 |
| `skeleton` | `boolean` | - | Frame skeleton 协议 |
| `renderHints` | `RenderHints` | - | 骨架屏渲染提示 |
| `enableResponsive` | `boolean` | `true` | 是否启用 Frame responsive |
| `enableContext` | `boolean` | `true` | 是否启用 Frame context |
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
type BarChartOrientation = "vertical" | "horizontal";
type BarChartMode = "single" | "stack" | "overlay" | "group";

interface BarChartSegment {
  name?: string;
  value: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
}

interface BarChartBar {
  name?: string;
  value: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
}

interface BarChartItem {
  name: string;
  value?: number;
  color?: BarChartColor;
  valueFormat?: NumberFormatOptions;
  segments?: BarChartSegment[];
  bars?: BarChartBar[];
  backgroundValue?: number;
}
```

数值格式优先级：`labelFormatter → segment/bar.valueFormat → item.valueFormat → 组件 valueFormat → NumberFormatContext → NumberFormats 默认值`。

颜色优先级：

- `single`: `data[i].color → colors[i] → colorMode`。
- `stack`: `segments[j].color → data[i].color → monochromeFade`；未自定义时使用同一颜色的透明度梯度。
- `overlay`: 后层和前层默认使用同一颜色，后层透明度固定为 `0.1`。
- `group`: `bars[j].color → data[i].color → colors[j] → colorMode`。

颜色支持 SnowUI 语意色、普通 CSS 颜色、CSS 变量、`linear-gradient(...)` 字符串和渐变对象。

---

## 3. 样式 Token 详表

| 属性 | 默认值 | Token / 变量 |
| :--- | :--- | :--- |
| 整体宽度 | 800px | `--snowui-bar-chart-width` |
| 整体高度 | 400px | `--snowui-bar-chart-height` |
| 柱粗细 | 32px | `--snowui-bar-chart-bar-width` |
| 并排柱间距 | 4px | `--snowui-bar-chart-bar-gap` |
| 分类单元预留间距 | 20px | `--snowui-bar-chart-group-gap` |
| 多段间隔 | 0px | `--snowui-bar-chart-segment-gap` |
| 柱圆角 | 8px | `--snowui-bar-chart-corner-radius` |
| 坐标轴字号 | 12px | `--snowui-bar-chart-axis-font-size` |
| 坐标轴行高 | 16px | `--snowui-bar-chart-axis-line-height` |
| 坐标轴颜色 | 40% 黑色 | `--snowui-bar-chart-axis-color` |
| 网格线颜色 | 10% 黑色 | `--snowui-bar-chart-grid-color` |
| x 轴基线颜色 | 40% 黑色 | `--snowui-bar-chart-axis-line-color` |
| hover label 颜色 | Black/100% | `--snowui-bar-chart-hover-label-color` |

### 3.1 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-bar-chart-width-override` | 整体宽度 |
| `--snowui-bar-chart-height-override` | 整体高度 |
| `--snowui-bar-chart-axis-font-size-override` | 坐标轴标签字号 |
| `--snowui-bar-chart-axis-color-override` | 坐标轴标签颜色 |
| `--snowui-bar-chart-grid-color-override` | 网格线颜色 |
| `--snowui-bar-chart-axis-line-color-override` | x 轴基线颜色 |
| `--snowui-bar-chart-hover-label-color-override` | hover label 颜色 |

---

## 4. 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区。
- 尺寸由 `width` / `height` 与 SVG 坐标算法决定；作为外部布局子项时表现为 Hug。
- `orientation="vertical"` 时分类轴为横向 cell，柱位于 cell 中心；`orientation="horizontal"` 时分类轴为纵向 cell。
- Y 轴标签区宽度由全部可见 Y label 中最宽文本的实际 SVG 渲染宽度决定，不使用固定 bounds 或字符数量估算；label 右边缘与绘图区起点间距固定为 `12px`。
- 自动 domain 上限直接使用当前数据最大值；nice ticks 只生成到不高于该值的最后一个易读刻度。最高柱可以高于最后一条网格线，顶部仅由 `8px / 16px / 28px` 内容安全区控制。显式 `yMax` 或 `yTicks` 不受此自动规则改写。
- 绘图区顶部由共享内容感知规则计算：普通柱 `8px`，纵向数值 Y 轴 `16px`，顶部数值 label `28px`；三者取最大值。横向柱的数值 label 位于柱右侧，不额外增加顶部安全区。有 X 轴时 `bottom=24px`，只包含 `8px` label 间距和 `16px` label 高度；无 X 轴时 `bottom=0`。
- 单元内部规则：
  - `single`: 一个单元一根柱。
  - `stack`: 一个单元一根多段柱；`segmentGap=0` 时中间段无间隔并只在整体首尾保留圆角；`segmentGap>0` 时每段独立圆角。
  - `overlay`: 一个单元两层同轴柱，后层 10%，前层 100%。
  - `group`: 一个单元多根并排柱，粗细统一，颜色可逐根定义。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.7](../../../specs/LayoutProtocol.md)。

---

## 5. 无障碍与 Frame 集成

- 根层使用 `role="img"` 和 `aria-label="柱状图"`。
- 每根柱 / 每个分段有独立透明命中层，使用 `role="button"`、`tabindex="0"` 和包含名称与数值的 `aria-label`。
- 独立使用或接入 `ChartGroup` 时均支持 `hoverMode="cell"`；cell 命中区按分类中心左右半格覆盖绘图区，同一分类单元的所有单柱、多段、相叠层或并排柱一起响应 hover。
- 支持 `loading`、`skeleton`、`renderHints`。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

## 6. 图层与动效

SVG 图层从下到上为：

1. `defs`: 颜色渐变。
2. grid / axis layer: 网格线和 x 轴基线。
3. base layer: 常驻占位柱，默认 `fill-opacity=0.04`。
4. series layer: 真实柱体。
5. hit layer: 完整命中区域。
6. axis label layer: X / Y 轴文本。

出现动效 API 与 `ChartSpec.md §9` 保持一致。所有柱共享同一张图表级时间轴，分类单元按顺序启动；单元内部的并排柱、堆叠段或相叠层使用同一局部进度。柱体出现形式为高度 / 宽度补齐：纵向柱先显示目标高度的 `80%`，再从顶部向上补齐到 `100%`；横向柱先显示目标宽度的 `80%`，再向右补齐到 `100%`。相邻分类单元的启动间隔固定；整条时间轴先应用 `easeOut` 缓动；单元升高持续时长按分类顺序逐步拉长，让越靠右的单元升高速度越慢。`stack` 模式中，一个分类单元内的所有分段共享同一个局部进度，因此 BC-02 / BC-03 不会出现每段分别启动的节奏；在任意时刻，底段 / 中段 / 顶段都按各自目标高度的同一比例同步变高。`segmentGap` 只作用在相邻分段边界上，动效过程中保持固定像素值；`segmentGap=0` 时相邻分段始终贴合无间距。`appearanceDuration` 仍可覆盖整段时间轴的播放速度。常显或 hover label 的数值直接使用当前柱高比例计算，从当前柱高对应值补到最终值。

---

## 7. 共享逻辑边界

来自 `pro/src/lib/chart/`：

- `colors.ts`: Chart 默认色序、SnowUI 语意色解析、单色透明度梯度。
- `gradients.ts`: CSS `linear-gradient(...)` 与渐变对象解析。
- `geometry.ts`: 数值、CSS 长度与 clamp。
- `axis.ts`: Y 轴可见标签实际渲染宽度测量。
- Frame 默认 morph 时序: BarChart 出现动效的单柱升高基准时长来源。

保留在组件内：

- 纵向 / 横向坐标映射。
- 单元内部 `single` / `stack` / `overlay` / `group` 几何。
- 矩形圆角 path 与起点 / 终点圆角规则。
- 坐标轴 label、网格线与命中层 SVG 结构。

---

## 8. AI Zone

### Changelog

- 2026-09-01 v1.0.4 — 自动 domain 上限改为实际最大数据值，最高 nice tick 不再超过最大值；无 Y 轴场景也不再因向上取整的 domain 产生额外顶部空白。
- 2026-08-31 v1.0.3 — 顶部改为内容感知安全区，并收紧自动 nice domain，避免最高柱、Y 轴顶刻度或数值 label 贴边，同时减少过大的标尺上方空白。
- 2026-08-31 v1.0.2 — 移除笛卡尔绘图区顶部和底部的额外留白；底部仅保留 X 轴标签自身所需的 `24px`。
- 2026-08-31 v1.0.1 — Y 轴改为按最宽可见标签的实际渲染宽度自适应，标签与绘图区之间固定保留 `12px`。
- 2026-06-05 v1.0.0 — 新增 BarChart，支持纵向 / 横向、单柱、多段、相叠、多柱并排、坐标轴与 Chart 出现动效；出现动效采用 80% 初始高度、固定分类间隔、Frame morph 基准时长与单柱独立缓动的逐柱升高形式，label 数值可随柱高补间变化。

### User Notes

- 保留。
