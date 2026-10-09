# BarChart

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.4.1
> **职责**: 用柱状图比较不同类别的数据，支持横向、纵向、分组与堆叠展示，以及坐标轴和交互提示。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

用柱状图比较不同类别的数据，支持横向、纵向、分组与堆叠展示，以及坐标轴和交互提示。

## 使用选择

<!-- usage-guide:start -->
用于比较类别数据。连续时间趋势可选 LineChart，占比可选 CircularChart；数值轴和颜色使用图表公开 API，不手写页面 SVG。

- 传入业务 data；省略 data 会显示内置示例数据。mode 控制单柱、分组、堆叠等形态，具体结构见 API 与数据结构。
- loading 保留图表占位并暂停数据交互；HoverPanel 默认开启。图表颜色通过 colors / colorMode 配置。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Frame } from '@snowui-design-system/components';
	import { BarChart } from '@snowui-design-system/components';
	let monthlyCoverageChart: any;
</script>

<Frame column style="align-items: center; gap: var(--gap-5); width: 100%;">
	<BarChart
		bind:this={monthlyCoverageChart}
		width="100%"
		barWidth={32}
		groupGap={4}
		showYAxis
		showGrid
		hoverMode="cell"
		showHoverLabel={true}
		showHoverPanel={true}
		alwaysShowHoverLabel={true}
		hoverPanelPlacement="pointer"
		hoverPanelVariant="dark"
		data={[
			{ name: 'Jan', value: 82.6 },
			{ name: 'Feb', value: 84.1 },
			{ name: 'Mar', value: 83.4 },
			{ name: 'Apr', value: 85.7 },
			{ name: 'May', value: 86.2 },
			{ name: 'Jun', value: 84.9 },
			{ name: 'Jul', value: 87.3 },
			{ name: 'Aug', value: 86.8 },
			{ name: 'Sep', value: 88.1 },
			{ name: 'Oct', value: 87.6 },
			{ name: 'Nov', value: 89.2 },
			{ name: 'Dec', value: 88.7 }
		]}
	/>
	<div style="display: flex; justify-content: center; gap: var(--gap-2); width: 100%;">
		<Button onclick={() => monthlyCoverageChart?.replay?.()}>Replay animation</Button>
		<Button onclick={() => monthlyCoverageChart?.reverseAppearance?.()}>Reverse animation</Button>
	</div>
</Frame>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| data | `BarChartItem[]` | `DEFAULT_DATA` | 分类数据；overlay 推荐用每类 bars 的前两项表示后层与前层，名称、数值、颜色和数字格式分别配置，详见数据结构。 默认行为：内置默认数据。 |
| orientation | `BarChartOrientation` | `"vertical"` | 图表方向 |
| mode | `BarChartMode` | `"single"` | 单元内部柱模式 |
| width | `number \| string` | `800` | 图表整体宽度；支持 `100%`，内部按最终显示宽度重算几何 |
| height | `number \| string` | `400` | 图表整体高度；内部按最终显示高度重算几何 |
| barWidth | `number \| string` | `32` | 单根柱粗细；纵向时为宽度，横向时为高度；响应式下限 `2px` |
| barGap | `number \| string` | `4` | `group` 模式中同一单元内相邻柱间距；下限 `4px` |
| groupGap | `number \| string` | `20` | 分类单元内容与 cell 边缘的预留间距；下限 `4px` |
| segmentGap | `number \| string` | `0` | `stack` 模式中分段间隔；`0` 表示无间隔 |
| cornerRadius | `number \| string` | `8` | 柱圆角大小 |
| roundedStart | `boolean` | `true` | 是否保留起点端圆角；纵向为底部，横向为左侧 |
| roundedEnd | `boolean` | `true` | 是否保留终点端圆角；纵向为顶部，横向为右侧 |
| xLabels | `string[]` | — | 分类 label 覆盖；未传时使用 `ChartGroup.xLabels` 或 `data[].name` |
| yMin | `number` | — | 数值轴 domain 最小值 默认行为：自动 / 继承 `ChartGroup`。 |
| yMax | `number` | — | 数值轴 domain 最大值；自动时等于实际最大数据值，不向上取整 默认行为：自动 / 继承 `ChartGroup`。 |
| yTicks | `number[]` | — | 数值轴刻度 默认行为：自动 nice ticks / 继承 `ChartGroup`。 |
| yTickCount | `number` | — | 自动 tick 目标数量 |
| yTickFormatter | `(value: number) => string` | — | 数值轴 label 格式化 默认行为：K 格式 / 继承 `ChartGroup`。 |
| showXAxis | `boolean` | — | 是否显示底部轴线与底部 label |
| showYAxis | `boolean` | — | 是否显示左侧 label |
| showGrid | `boolean` | — | 是否显示网格线 |
| showGuides | `boolean` | — | 保留 Chart API 命名；当前不绘制额外 guide |
| showHoverLabel | `boolean` | — | hover / focus 柱体时是否显示数值 label；当 `showHoverPanel=true` 且未显式传入时实际渲染默认关闭 默认行为：按 `showHoverPanel` 推导。 |
| alwaysShowHoverLabel | `boolean` | `false` | 是否让数值 label 一直显示；与 `showHoverPanel` 同时开启时允许同时显示 |
| adaptiveContrast | `boolean` | — | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认开启，可显式关闭；由 Adaptive Contrast 共享能力实现。 默认行为：继承 ChartGroup，否则 `true`。 |
| showHoverPanel | `boolean` | `true` | 是否开启 Chart hover 面板，内容按当前柱 / cell 自动生成；默认开启，hover / focus 时显示面板；设为 false 时回到数值 hover label，显式 showHoverLabel 优先 |
| hoverPanelVariant | `ChartHoverPanelVariant` | `"light"` | hover 面板视觉样式 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | `"pointer"` | hover 面板定位；支持 anchor / pointer / pin 位置 |
| showHoverPanelLabel | `boolean` | `false` | 是否在 hover 面板顶部显示当前分类 label |
| hoverMode | `ChartGroupHoverMode` | — | hover 命中模式；`cell` 时按分类中心左右半格生成整格命中区，同一分类单元内的所有柱 / 分段一起响应 |
| activeCellIndex | `number \| null` | — | 受控当前 hover 分类单元；未传时可继承 `ChartGroup` |
| onCellHoverChange | `(index: number \| null) => void` | — | 分类单元 hover 变化回调 |
| valueFormat | `NumberFormatOptions` | — | 柱体数值 label 的组件级数字格式；可设置 `notation: "auto"` / `"compact"` 使用英文 `k/m/b/t` 缩写 默认行为：NumberFormats 默认。 |
| labelFormatter | `( value: number, context: BarChartValueLabelContext, ) => string` | — | 柱体数值 label 自定义格式化；优先级高于全局、组件和数据项 `valueFormat` |
| xLabelAutoCull | `boolean` | — | 按最终显示尺寸减少分类 label；完整文字间距最小 `4px`，首尾仍放不下时全部隐藏；不删除柱体、坐标轴或命中 cell |
| xMaxLabelCount | `number` | — | 分类 label 最大显示数量 默认行为：- / 继承 `ChartGroup`。 |
| valueLabelAutoCull | `boolean` | `true` | `alwaysShowHoverLabel` 常驻数值是否按最终显示尺寸自动抽稀；hover / focus 数值不受影响 |
| valueMaxLabelCount | `number` | — | 常驻顶部数值最大显示数量 |
| yLabelAutoCull | `boolean` | — | 是否自动减少数值轴 label |
| yMaxLabelCount | `number` | — | 数值轴 label 最大显示数量 默认行为：- / 继承 `ChartGroup`。 |
| colors | `(BarChartColor \| undefined)[]` | — | 调色板；空项回退当前 `colorMode` |
| colorMode | `BarChartColorMode` | `"sequence"` | Chart 通用颜色模式 |
| color | `BarChartColor` | — | 单色模式主色 |
| monochromeColor | `BarChartColor` | `"Primary"` | 单色渐浅来源 |
| mutedMonochromeColor | `BarChartColor` | `"Black4"` | 单色来源 |
| showBaseLayer | `boolean` | `false` | 是否显示最终尺寸的同色轮廓（影子 / 占位底层），默认不渲染；开启后以 4% 不透明度绘制，不参与出现动效，不改变真实图形、命中区域或时间轴。与 overlay 的后层数据柱无关；横向柱按最终宽度绘制。 |
| appearMotion | `boolean` | `true` | 是否启用出现动效 |
| appearOnView | `boolean` | `true` | 是否进入视口后自动播放；同源 iframe 中按最外层同源页面的真实位置判断 |
| appearanceProgress | `number` | — | 受控出现进度 |
| defaultAppearanceProgress | `number` | `0` | 非受控初始出现进度 |
| appearanceDuration | `number` | — | 自动播放总时长覆盖 |
| appearAnchorId | `string` | — | 动效触发锚点 ID |
| appearAnchorPoint | `AnchorPoint` | `"top"` | 锚点触发位置 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置 |
| scrollAppearance | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动时间轴；同源 iframe 同时响应外层页面滚动 |
| scrollAppearanceDistance | `number \| string` | `320` | 滚动映射距离 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 出现进度变化回调 |
| loading | `boolean` | — | 数据等待状态。保持声明的画布尺寸、坐标轴和网格，将柱体固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文。 |
| children | `Snippet` | — | 图表主体后的自定义内容，无参数；不会替换坐标轴或数据系列。 |
| class | `string` | `""` | 根层附加 class |
| style | `string` | `""` | 根层附加 style |
| enableResponsive | `boolean` | `true` | 是否启用 Frame responsive |
| enableContext | `boolean` | `true` | 是否启用 Frame context |
| enableScaleObserver | `boolean` | `false` | 是否启用 Frame scale observer |
| enableDefaultMotion | `boolean` | `true` | 是否启用 Frame 默认动效 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="1-设计原则"></a>

### 设计原则

- **Chart 原子组件**: `BarChart` 只负责柱状图本体，不内置标题、卡片背景、legend 或 toolbar。
- **单元模型**: 一个分类项是一个 **bar unit**。单元统一控制柱粗细、圆角、方向和分类坐标；单元内部可以渲染单柱、多段、相叠柱或多根并排柱。
- **多段式统一规则**: 三段式是多段式的特例。`mode="stack"` 使用 `segments` 渲染任意段数；`segmentGap={0}` 表示中间无间隔，`segmentGap>0` 表示分段之间有透明间隔且每段独立圆角。hover / focus / 常显数值只在最顶段上方显示一次，值为全部分段之和。
- **相叠规则**: `mode="overlay"` 使用 `bars` 的前两项有效数据，第一项为后层、第二项为前层；两层各自独立命名和取值，共享零基线同轴相叠，不累加。后层为 10% 不透明度、前层为 100%；前层可高于后层。
- **并排规则**: `mode="group"` 使用 `bars` 在同一单元内并排。默认柱间距 `barGap=4`，颜色使用 Chart 默认色序，可扩展为多柱。
- **方向规则**: `orientation="vertical"` 为纵向柱状图，分类轴在横向；`orientation="horizontal"` 为横向条形图，分类轴在纵向。所有柱模式都支持两个方向。
- **坐标轴内建**: 坐标轴、刻度、网格线属于 BarChart 形态能力，放在组件内。
- **响应式密度**: BarChart 直接观察根层最终显示尺寸并以实测宽高重算 SVG 几何，不要求页面自行创建 ResizeObserver。柱粗细可随分类 cell 收窄，但不得小于 `2px`；同一分类内并排柱和相邻分类柱的视觉间距不得小于 `4px`。
- **横向密度**: 横向柱高沿用柱粗细下限 `2px`，上下相邻柱间距沿用 `4px`；分类 Y label 按最终绘图区高度、`16px` 行高与 `4px` 上下间距抽稀，首尾仍放不下时全部隐藏。
- **标签抽稀**: `xLabelAutoCull` 只减少纵向图的分类轴 label，不删除柱体、坐标轴、命中 cell 或数据；横向图的底部数值刻度按绘图区实际宽度自动抽稀。空字符串 label 不参与候选数量和首尾判定，稀疏月份等标签按非空项等步抽稀。可见 label 必须完整显示且相邻文字至少保留 `4px`；空间不足时保留首尾非空项并等步抽稀，若首尾两个完整 label 仍放不下则隐藏全部横轴 label。常驻顶部数值使用独立的 `valueLabelAutoCull` / `valueMaxLabelCount`，按最终数值文本宽度抽稀；被省略的数值仍会在对应柱 hover / focus 时显示。
- **Y 轴自适应宽度**: Y 轴不使用固定预留宽度；标签区宽度等于当前最宽可见标签的实际渲染宽度，标签右边缘与绘图区起点固定保留 `12px`。纵向数值轴和横向分类轴使用同一 Chart 共享测量入口；标签变宽时仅按实际增加的宽度压缩绘图区。
- **动态顶部安全区**: 普通柱距组件顶部至少 `8px`；纵向图显示 Y 轴时最小为 `16px`；顶部数值 label 不额外增加安全区，仍保持在柱顶上方 `4px`，必要时可溢出绘图区顶边。显示 X 轴时底部仅保留 `8px` 标签间距和 `16px` 标签高度，标签底边与组件底部对齐；隐藏 X 轴时绘图区延伸到组件底部。
- **hover 规则**: 柱体 hover 使用 `StyleSpec.md §2.4` 的 overlay 机制，不改写柱体本身颜色。视觉透明度为 40% 及以上的实心柱按 filled Button hover 规则叠加 `StaticWhite/20%`；视觉透明度低于 40% 的浅透明柱按浅黑 hover 档位叠加 `Black/4%`。`overlay` 后层 10% 与多段式浅色段都会走 `Black/4%` overlay。
- **hover label**: 默认 hover / focus 柱体时在柱体上方 4px 显示数值 label，不因触及绘图区顶边改变位置。字号 12px、常规体，颜色默认为 Black/100%。`stack` 只在最顶段显示整根堆叠柱的总值，hover 任意分段都指向这一份总值；其他模式仍显示对应柱值。数字格式消费 `NumberFormats.md`，默认非整数显示 2 位小数。`alwaysShowHoverLabel` 可让数值 label 常显；出现动效播放时，label 数值跟随当前整柱高度比例实时变化，从 `80%` 对应值变化到完整值。
- **hover panel**: 面板 label 与下方数值行区域固定保留 `2px` 间距；各行使用圆点、名称、数值三列布局，圆点与名称间距为 `4px`，名称与数值间距为 `8px`。
- **出现动效**: 所有分类单元共享一条 BarChart 出现动效时间轴；柱体初始显示为目标高度 / 宽度的 `80%`，再从左到右依次升高到 `100%`。相邻分类单元的启动间隔固定；整条时间轴应用 `easeOut` 缓动；单柱升高使用 Frame 默认 morph 时长 `300ms` 作为基准，每个分类单元的变高进度单独应用 `easeOut` 缓动，并且越靠右的单元升高时长越长。`stack` 模式把一个分类单元内的所有分段看作同一个动效整体：同一单元内的所有分段共享同一局部进度，从各自 `80%` 高度一起升高到 `100%`，不分别启动独立变高动效；`segmentGap` 在动效过程中保持固定像素间距，`segmentGap=0` 时始终无间距。

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
  backgroundName?: string;
}
```

`mode="overlay"` 的推荐数据是 `data[].bars`，每个分类传入两项真实数据柱：

| 字段 | 默认 / 规则 | 描述 |
| --- | --- | --- |
| `data[].name` | 必填 | 分类名称，例如流量来源或月份；`xLabels` 可覆盖轴标签。 |
| `data[].bars` | 未提供时兼容旧字段 | 按输入顺序取前两项有限数值数据，第一项后层、第二项前层；两者从同一零基线开始。传空数组则没有柱体，不回退旧字段；只有一项有效数据时作为 100% 不透明度的单柱显示。多余有效项不绘制，也不参与 domain。 |
| `bars[].name` | 回退 `data[].name` | 数据系列名称，例如上一季度 / 本季度；用于 HoverPanel、hover 描述与读屏，不按绘制层硬编码名称。 |
| `bars[].value` | 必填 | 原始数值，支持 `0`；前后层独立参与自动 domain。后层不固定高度，前层可大于后层，不相加、不互相钳制。 |
| `bars[].color` | 回退分类颜色与图表调色板 | 当前数据柱的颜色；两层可同色或独立指定颜色，后层仍为 10% 不透明度。 |
| `bars[].valueFormat` | 继承分类与组件数字格式 | 当前数据柱的数字格式，同时用于 hover 数值、HoverPanel 和读屏描述。 |

旧字段 `value/backgroundValue/backgroundName` 仅在未传 `bars` 时生效：`backgroundValue` 指定真实后层值，名称使用 `backgroundName ?? name`；`value` 指定前层值，名称使用 `name`。未传 `backgroundValue` 时只渲染前层，不再复制前层值生成一根虚构后层。新代码应使用 `bars`；其他模式忽略 `backgroundValue/backgroundName`。

```svelte
<BarChart mode="overlay" data={[
  { name: 'Organic search', bars: [{ name: 'Previous quarter', value: 8400 }, { name: 'Current quarter', value: 10200 }] },
  { name: 'Direct traffic', bars: [{ name: 'Previous quarter', value: 7600 }, { name: 'Current quarter', value: 6800 }] },
  { name: 'Referrals', bars: [{ name: 'Previous quarter', value: 4200 }, { name: 'Current quarter', value: 5100 }] }
]} />
```

数值格式优先级：`labelFormatter → segment/bar.valueFormat → item.valueFormat → 组件 valueFormat → NumberFormatContext → NumberFormats 默认值`。

颜色优先级：

- `single`: `data[i].color → colors[i] → colorMode`。
- `stack`: `segments[j].color → data[i].color → monochromeFade`；未自定义时使用同一颜色的透明度梯度。
- `overlay`: 后层和前层默认使用同一颜色，后层透明度固定为 `0.1`。
- `group`: `bars[j].color → data[i].color → colors[j] → colorMode`。

颜色支持 SnowUI 语意色、普通 CSS 颜色、CSS 变量、`linear-gradient(...)` 字符串和渐变对象。

---

<a id="4-布局模型"></a>

### 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区。
- 根层 CSS 尺寸由 `width` / `height` 决定，SVG 坐标算法使用根层最终实测尺寸；`width="100%"` 可直接 Fill，无需页面监听容器后回传像素宽度。
- `orientation="vertical"` 时分类轴为横向 cell，柱位于 cell 中心；`orientation="horizontal"` 时分类轴为纵向 cell。
- Y 轴标签区宽度由全部可见 Y label 中最宽文本的实际 SVG 渲染宽度决定，不使用固定 bounds 或字符数量估算；label 右边缘与绘图区起点间距固定为 `12px`。
- 自动 domain 上限直接使用当前数据最大值；nice ticks 只生成到不高于该值的最后一个易读刻度。最高柱可以高于最后一条网格线，顶部仅由 `8px / 16px` 内容安全区控制。显式 `yMax` 或 `yTicks` 不受此自动规则改写。
- 绘图区顶部由共享内容感知规则计算：普通柱 `8px`，纵向数值 Y 轴 `16px`；二者取最大值。数值 label 不增加该值，继续保持柱顶上方 `4px` 的位置，必要时可溢出绘图区顶边。横向柱的数值 label 位于柱右侧，同样不额外增加顶部安全区。有 X 轴时 `bottom=24px`，只包含 `8px` label 间距和 `16px` label 高度；无 X 轴时 `bottom=0`。
- 单元内部规则：
  - `single`: 一个单元一根柱。
  - `stack`: 一个单元一根多段柱；`segmentGap=0` 时中间段无间隔并只在整体首尾保留圆角；`segmentGap>0` 时每段独立圆角；数值 label 只属于最顶段，内容为所有分段总和。
  - `overlay`: 一个单元两层同轴柱，后层 10%，前层 100%。
  - `group`: 一个单元多根并排柱，粗细统一，颜色可逐根定义。
- 响应式收窄时先压缩柱粗细至 `2px`；同分类并排柱间距和相邻分类柱间距都保留至少 `4px`。横坐标和常驻顶部数值分别按自身文本需求抽稀，柱体数量、数据 domain、命中 cell 和动效顺序保持完整。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.7](../../../specs/LayoutProtocol.md)。

---

<a id="5-无障碍与-frame-集成"></a>

### 无障碍与 Frame 集成

- 根层使用 `role="img"` 和 `aria-label="柱状图"`。
- 每根柱 / 每个分段有独立透明命中层，使用 `role="button"`、`tabindex="0"` 和包含名称与数值的 `aria-label`。
- 独立使用或接入 `ChartGroup` 时均支持 `hoverMode="cell"`；cell 命中区按分类中心左右半格覆盖绘图区，同一分类单元的所有单柱、多段、相叠层或并排柱一起响应 hover。
- `loading` 保留完整画布与坐标结构，只把柱体恢复到出现动效起点；根 Frame 明确关闭 Skeleton。显式空 `data={[]}` 不回退默认演示数据，可配合 `xLabels`、`yMin`、`yMax` 先建立最终坐标。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

<a id="6-图层与动效"></a>

### 图层与动效

SVG 图层从下到上为：

1. `defs`: 颜色渐变。
2. grid / axis layer: 网格线和 x 轴基线。
3. base layer: `showBaseLayer=true` 时绘制最终尺寸占位柱，`fill-opacity=0.04`；默认不渲染。
4. series layer: 真实柱体。
5. hit layer: 完整命中区域。
6. axis label layer: X / Y 轴文本。

出现动效 API 与 `ChartSpec.md §9` 保持一致。所有柱共享同一张图表级时间轴，分类单元按顺序启动；单元内部的并排柱、堆叠段或相叠层使用同一局部进度。柱体出现形式为高度 / 宽度补齐：纵向柱先显示目标高度的 `80%`，再从顶部向上补齐到 `100%`；横向柱先显示目标宽度的 `80%`，再向右补齐到 `100%`。相邻分类单元的启动间隔固定；整条时间轴先应用 `easeOut` 缓动；单元升高持续时长按分类顺序逐步拉长，让越靠右的单元升高速度越慢。`stack` 模式中，一个分类单元内的所有分段共享同一个局部进度，因此 BC-02 / BC-03 不会出现每段分别启动的节奏；在任意时刻，底段 / 中段 / 顶段都按各自目标高度的同一比例同步变高。`segmentGap` 只作用在相邻分段边界上，动效过程中保持固定像素值；`segmentGap=0` 时相邻分段始终贴合无间距。`appearanceDuration` 仍可覆盖整段时间轴的播放速度。常显或 hover label 的数值直接使用当前柱高比例计算；`stack` 使用整柱总值，从总值的当前比例补到最终总值。

---

<a id="7-共享逻辑边界"></a>


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 共享逻辑边界

来自 `components/src/lib/chart/`：

- `colors.ts`: Chart 默认色序、SnowUI 语意色解析、单色透明度梯度。
- `gradients.ts`: CSS `linear-gradient(...)` 与渐变对象解析。
- `geometry.ts`: 数值、CSS 长度与 clamp。
- `axis.ts`: Y 轴可见标签实际渲染宽度测量。
- Frame 默认 morph 时序: BarChart 出现动效的单柱升高基准时长来源。
- `pointer.ts`: HoverPanel 指针坐标按绘制帧合并，每帧最多读取一次根层布局。

保留在组件内：

- 纵向 / 横向坐标映射。
- 单元内部 `single` / `stack` / `overlay` / `group` 几何。
- 矩形圆角 path 与起点 / 终点圆角规则。
- 坐标轴 label、网格线与命中层 SVG 结构。

---

<a id="自适应黑白对比接入"></a>


### 自适应黑白对比接入

使用 [Adaptive Contrast](../lib/adaptive-contrast.md) 共享入口。组件保留前景形状、数值和交互；ChartGroup 协调同原点表面数据。本组件默认开启 `adaptiveContrast`，可通过 `adaptiveContrast={false}` 关闭，不穿透私有 SVG。




> **状态**: 已实现



---

<a id="3-样式-token-详表"></a>

### 样式 Token 详表

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
| `--snowui-bar-chart-hover-label-color-override` | 强制覆盖 hover label 的默认 Black/100% 颜色 |

---

<a id="8-ai-zone"></a>


### User Notes

- 保留。

数值标签按所在位置的实际背景明暗显示静态黑色或白色；主题切换刷新背景遮罩，跨越重叠柱体时按覆盖区域反白。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.4.1 (2026-09-05)

- 出现时间轴的分类起始偏移改为常量时间计算；HoverPanel pointer 原始事件不再同步读取布局，坐标换算按绘制帧合并。公开 API、柱体几何、时长、视觉和交互语义不变。

### v1.4.0 (2026-09-03)

- 新增 `showBaseLayer=false`，按需开启最终尺寸的同色轮廓；真实图形和出现动效保持原有行为。
- `adaptiveContrast` 改为默认开启，保留显式关闭与子图覆盖。

### v1.3.0 (2026-09-03)

- `adaptiveContrast` 接入 自适应黑白对比共享能力；保留开关默认值、彩色前景、命中和节点状态语义，移除图表私有试验实现。

### v1.2.0 (2026-09-02)

- overlay 复用 `bars` 表达两项独立对比数据，自动 domain、颜色、数字格式、命中和面板统一消费相同数据；支持后层逐项变化和前层超过后层。
- 保留旧字段兼容，未命名后层回退分类名，移除 `Background` 硬编码；缺少后层值时不再复制前层数据。

### v1.1.4 (2026-09-02)

- 新增可选的 `data[].backgroundName`，用于业务化命名 overlay 后层；未提供时保留原名称，几何、颜色与 hover 行为不变。

### v1.1.3 (2026-09-02)

- HoverPanel 默认定位改为 `pointer`，随鼠标移动；区域 hover 默认保持 `cell`，显式的 placement / hoverMode 配置继续优先。

- 2026-09-02 — HoverPanel 改为默认开启，默认外观保持 light。
- 2026-09-02 v1.1.2 — `stack` 数值 label 改为仅在最顶段显示一次并展示全部分段总和，颜色恢复默认 Black/100%；稀疏 X label 自动忽略空项抽稀；HoverPanel 保留 label 与数值行区域 `2px` 间距，名称与数值间距改为 `8px`。
- 2026-09-02 v1.1.1 — 顶部数值 label 不再把安全区增至 `28px`，仍保持柱顶上方 `4px` 并允许溢出绘图区顶边。
- 2026-09-01 v1.1.0 — BarChart 改为按根层最终显示尺寸自行响应；柱宽下限为 `2px`，柱间距下限为 `4px`；修复短横坐标 label 在 cell 小于 `20px` 时仍被误判为可容纳的问题；横坐标抽稀不再删除柱体，并为常驻顶部数值增加独立自动抽稀。
- 2026-09-01 v1.0.4 — 自动 domain 上限改为实际最大数据值，最高 nice tick 不再超过最大值；无 Y 轴场景也不再因向上取整的 domain 产生额外顶部空白。
- 2026-08-31 v1.0.3 — 顶部改为内容感知安全区，并收紧自动 nice domain，避免最高柱、Y 轴顶刻度或数值 label 贴边，同时减少过大的标尺上方空白。
- 2026-08-31 v1.0.2 — 移除笛卡尔绘图区顶部和底部的额外留白；底部仅保留 X 轴标签自身所需的 `24px`。
- 2026-08-31 v1.0.1 — Y 轴改为按最宽可见标签的实际渲染宽度自适应，标签与绘图区之间固定保留 `12px`。
- 2026-06-05 v1.0.0 — 新增 BarChart，支持纵向 / 横向、单柱、多段、相叠、多柱并排、坐标轴与 Chart 出现动效；出现动效采用 80% 初始高度、固定分类间隔、Frame morph 基准时长与单柱独立缓动的逐柱升高形式，label 数值可随柱高补间变化。
