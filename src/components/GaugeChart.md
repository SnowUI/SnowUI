# GaugeChart

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.7.5
> **职责**: 用半环或半饼展示多项数据占比，支持分段、渐变、环厚与出现动效，适合比例概览。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

用半环或半饼展示多项数据占比，支持分段、渐变、环厚与出现动效，适合比例概览。

## 使用选择

<!-- usage-guide:start -->
用于半环形比例数据展示。当前数据模型与 CircularChart 一样以各项之和计算占比；任务完成进度使用 Progress。

- 当前组件展示半环形比例数据，并非 min/max 单指标仪表；data 每项使用 name 和正 value，占比按有效显示项之和计算。
- 省略 data 会显示示例数据，空数组展示空图；中心文案与内容用 centerTitle、centerSubtitle 或公开角色配置。
- 根默认可访问名称随 LocaleProvider 切换，使用 `gaugeChart.name`；显式 `aria-label` 优先。业务名称、数据值与数字格式保持调用方内容。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Frame, Icon, Text } from '@snowui-design-system/components';
	import { DotCircle } from '@snowui-design-system/resource-svelte';
	import { GaugeChart } from '@snowui-design-system/components';
	// Sample data for this week’s documentation review.
	const channels = [
	    { name: 'Ready', value: 72, color: 'var(--primary)' },
	    { name: 'Review', value: 18, color: 'var(--secondary-purple)' },
	    { name: 'Planned', value: 10, color: 'var(--secondary-orange)' }
	];
	let trafficChart: { replay: () => void; reverseAppearance: () => void } | undefined;
</script>

<div style="display: flex; flex-direction: column; align-items: center; width: var(--size-full); gap: var(--gap-4) var(--gap-3);">
    <GaugeChart bind:this={trafficChart} data={channels} width={360} height={180} ringThickness={32}
        centerTitle="Docs" centerSubtitle="This week" appearOnView defaultAppearanceProgress={0}
        aria-label="Sample weekly documentation review" />
    <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);" aria-label="Review status legend">
        {#each channels as item}
            <Frame singleLine gap={0}><Icon as="leading" size={12} style={`color: ${item.color};`}><DotCircle weight="fill" /></Icon><Text lines={1} style="font-size: var(--text-14); line-height: var(--leading-14); color: var(--black-100);">{item.name}</Text></Frame>
        {/each}
    </div>
    <div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
        <Button onclick={() => trafficChart?.replay()}>Replay animation</Button>
        <Button onclick={() => trafficChart?.reverseAppearance()}>Reverse animation</Button>
    </div>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| data | `GaugeChartItem[]` | `DEFAULT_DATA` | 比例数据数组；每项必填 name（名称）与 value（有限正数），可选 color、percentFormat。按输入顺序过滤非正数和非法值，再取前 maxItems 项；百分比分母是实际显示项之和。省略 `data` 时使用内置示例数据；显式空数组或全部无效时保留最终尺寸并渲染空图表。 默认行为：内置 5 项示例数据。 |
| width | `number \| string` | `320` | 整体宽度，推荐正数（px 设计值转 rem）；字符串直接作为 CSS 长度，但 SVG 几何仅以 parseFloat 提取数值，不换算单位，不支持可靠的百分比、calc() 或 CSS 变量几何。 |
| minWidth | `number \| string` | ``${SECTOR_CHART_MIN_WIDTH}px`` | 响应式最小显示宽度；数字与 width 使用相同的 px 设计值转 rem 规则，字符串直接作为 CSS 长度。默认固定 40 CSS px；设为与 width 相同可阻止自动缩小，设为更小值允许缩到该下限。仅 enableResponsive=true 时生效。 |
| height | `number \| string` | `160` | 整体高度，推荐正数（px 设计值转 rem），通常为 width 的一半；改变高度会改变圆心与可用半径。字符串解析限制与 width 相同。 |
| ringThickness | `number \| string` | `32` | 环厚，推荐非负数字（px 设计值）；内半径为 max(0, 外半径 − 环厚)。外半径为 max(1, min(width / 2, height) − hoverThicknessGrowth − 1)，环厚达到它时形成实心半饼图。字符串仅提取数值，不换算单位。 |
| cornerRadius | `number \| string \| "auto"` | `"auto"` | 扇区端部圆角；非负数值或数字字符串表示 320px 宽基准的 px 设计值，按 width / 320 缩放；auto 使用基准值 4。最终受环厚和扇区角度限制；0 为直角。 |
| separatorWidth | `number \| string \| "auto"` | `"auto"` | 扇区间透明隔断；非负数值或数字字符串表示 320px 宽基准的 px 设计值，按 width / 320 缩放；auto 使用基准值 2，0 关闭间隔。通过路径几何留空，透出真实背景。 |
| colors | `(GaugeChartColor \| undefined)[]` | — | 按过滤后显示索引覆盖颜色；每项支持语义色、CSS 颜色/变量、linear-gradient 字符串或 { type?, angle?, stops } 渐变对象。undefined 空位回退当前 colorMode；数据项 color 优先于调色板。不支持背景 utility 类名。 |
| colorMode | `GaugeChartColorMode` | `"sequence"` | sequence 按 Primary 与 9 个 Secondary 色序循环；monochromeFade 使用同一主色从首项 100% 均匀降至末项 20%（单项为 100%）；monochrome 所有项使用同一颜色。三种模式均允许数据项和调色板逐项覆盖。 |
| color | `GaugeChartColor` | — | 同时覆盖 monochromeFade 与 monochrome 的回退主色，优先于 monochromeColor / mutedMonochromeColor；sequence 不使用它。支持与数据项 color 相同的纯色、语义色和渐变。 |
| monochromeColor | `GaugeChartColor` | `"Primary"` | 仅在 monochromeFade 且未传 color 时使用的回退主色；支持纯色和渐变。透明度从首项 100% 降到末项 20%，数据项 color 与 colors 仍优先。 |
| mutedMonochromeColor | `GaugeChartColor` | `"Black4"` | 仅在 monochrome 且未传 color 时使用的回退色；默认 Black4 是主题自适应的低对比色，扇区填充自身不再降低透明度。数据项 color 与 colors 仍优先。 |
| hoverThicknessGrowth | `number \| string` | `4` | hover / focus 时向外增厚的非负 px 设计值；内半径与圆心不变，0 关闭几何增厚但保留数据提示。字符串只提取数值，不按 width / 320 缩放；没有 hoverScaleSize 别名。 |
| startDirection | `StartDirection` | `"left"` | left 从左端开始向右揭示，right 从右端开始向左揭示；只改变出现顺序和扫描方向，不旋转数据排布。 |
| showBaseLayer | `boolean` | `false` | 是否显示最终几何的同色 4% 透明度底层；默认不渲染。开启后底层不参与出现动效与命中，便于观察填充进度；不改变真实扇区和数据。 |
| appearMotion | `boolean` | `true` | 是否启用图形出现动效；false 时直接显示完整填充，并使 replay / reverseAppearance 不播放。此开关不关闭独立的 hover 增厚反馈。 |
| appearOnView | `boolean` | `true` | 非受控模式中，锚点到达指定视口位置时自动播放一次；同源 iframe 中按最外层同源页面的真实位置判断。false 可改用实例方法播放。appearanceProgress 优先；scrollAppearance 开启时由滚动驱动。 |
| appearanceProgress | `number` | — | 受控填充进度，数值限制到 0..1；提供后显示由调用方决定，自动播放和实例播放方法不改变受控画面。appearMotion=false 仍直接完整显示；外部进度变化不会触发 onAppearanceProgressChange。 |
| defaultAppearanceProgress | `number` | `0` | 非受控模式首次初始化的进度，限制到 0..1，只读取一次；后续改变此属性不重置动画。有 appearanceProgress 时不决定画面；默认 0 为描边态。 |
| appearanceDuration | `number` | — | 实例播放与自动出现的总时长，单位 ms；未传时固定 1000，不随扇区数改变。非正数在下一动画帧直接到终点；不改变滚动或受控进度映射。 |
| appearAnchorId | `string` | — | 页面内触发锚点元素的 id；未传时使用图表根元素，传入不存在的 id 不回退根元素。仅用于自动出现或滚动时间轴，不改变图表位置。 |
| appearAnchorPoint | `AnchorPoint` | `"top"` | 选用锚点的 top（顶部）、center（垂直中心）或 bottom（底部）与视口触发线比较；不影响扇区绘制方向。 |
| appearViewportPoint | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发线：数字限制到 0..1，或使用 top=0、center=0.5、bottom=1。默认 0.7 为视口高度 70%；配合 appearAnchorPoint 决定触发/滚动起点。 |
| scrollAppearance | `boolean \| { distance?: number \| string }` | `false` | true 开启 window 滚动驱动的非受控时间轴；同源 iframe 同时响应外层页面滚动。对象可用 distance 覆盖滚动距离。锚点越过触发线后进度由距离决定，向回滚动会逆向恢复。不监听嵌套 ScrollArea；appearanceProgress / appearMotion=false 优先。 |
| scrollAppearanceDistance | `number \| string` | `320` | 滚动进度从 0 到 1 所需的 CSS px 距离；数字或数字字符串，最低按 1 处理。scrollAppearance.distance 优先；只在滚动时间轴开启时生效，不换算字符串单位。 |
| onAppearanceProgressChange | `(progress: number) => void` | — | 内部进度写入时接收 progress（0..1），包括初始化中的直接完成、自动播放、实例方法与滚动更新；可同步外部进度读数。默认值初始化本身不通知；不用于监听外部 appearanceProgress，返回值被忽略，不能取消更新。 |
| maxItems | `number` | `10` | 过滤后保留的前 N 项数量，不排序、不自动合并 Other；取整并限制到 1..28，0 / NaN 回退 10。百分比只基于保留项，超过 28 类的业务应先聚合小类以保留总量；全无效时渲染空图表。 |
| showCenterLabel | `boolean` | `true` | 是否渲染中心内容区域；false 同时隐藏默认动态标签、segment-value / segment-name 模板与静态 center-label。隐藏中心不关闭显式启用的 HoverPanel。 |
| centerTitle | `string` | `""` | 无 hover / focus 项时显示的中心标题，复用默认数值行排版；悬停或聚焦扇区时被百分比或 labelFormatter 第一行替换，离开后恢复。空字符串不占标题行；showCenterLabel=false 隐藏，静态 center-label 优先。 |
| centerSubtitle | `string` | `""` | 无 hover / focus 项时显示的中心副标题，复用默认名称行排版；悬停或聚焦时被当前项名称或 labelFormatter 第二行替换，离开后恢复。可单独设置；不生成 HoverPanel 数据。 |
| hoverMode | `ChartHoverMode` | `"cell"` | cell 按环带角度命中，跨过透明隔断仍保持所属扇区，排除中心空洞与图外；item 只响应扇区路径命中。两种模式均保留扇区键盘 focus 提示。 |
| showHoverPanel | `boolean` | `true` | 默认根据当前 hover / focus 扇区显示结构化面板，同时保留动态中心标签。false 关闭面板；但存在可见静态 center-label 时组件自动启用面板承载扇区信息。 |
| hoverPanelVariant | `ChartHoverPanelVariant` | `"light"` | 面板视觉：light 为默认浅色玻璃样式，dark 为深色样式，surface 为主题表面样式；仅改变面板外观，不改变数据和命中。 |
| hoverPanelPlacement | `ChartHoverPanelPlacement` | `"pointer"` | 面板位置：pointer 跟随指针；anchor-top / anchor-side 相对当前指针点定位（键盘焦点使用图心）；pin-top-left / pin-top / pin-top-right / pin-right / pin-bottom-right / pin-bottom / pin-bottom-left / pin-left / pin-center 固定在图表对应位置，边缘保留 8px 并参与视口碰撞处理。 |
| showHoverPanelLabel | `boolean` | `false` | 是否在面板行数据上方额外显示当前扇区名称；false 只显示数据行。仅面板开启且存在当前项时有可见效果。 |
| percentFormat | `NumberFormatOptions` | — | 中心百分比、面板百分比与扇区 aria-label 的数字格式；支持 fractionDigits、locale 等 NumberFormatOptions。优先级为数据项 percentFormat → 本属性 → NumberFormatContext → 默认一位小数；labelFormatter 只覆盖中心文本。 默认行为：NumberFormats 百分比默认。 |
| labelFormatter | `(item: GaugeChartItem, percent: number) => string` | — | hover / focus 时接收 item（当前有效数据项）与 percent（0..100 百分数），返回中心文字；以换行拆成数值行与名称行，最多使用两行。静态 center-label 或 showCenterLabel=false 时不调用；不改变面板和扇区 aria-label 的百分比。 |
| loading | `boolean` | — | 数据等待状态。保留 `width` / `height` 对应的最终占位和中心内容，将扇区固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文；显式空 `data={[]}` 不回退默认演示数据。 |
| children | `Snippet` | — | 无参数 Snippet，渲染在 showCenterLabel=true 的中心区域。直系 Text as="segment-value" / "segment-name" 是动态标签模板，由组件写入当前两行文字；直系 Frame as="center-label" 提供常驻内容并自动启用面板。静态内容不自动套用默认中心排版；只需默认文字时无需传 children。中心用于展示，不用于交互工具栏。 |
| class | `string` | `""` | 追加到图表根 Frame 的 class 字符串；不传时为空。仅表达调用方公开根样式，不穿透内部 SVG 和标签结构。 |
| style | `string` | `""` | 追加到根 Frame 的 inline style 字符串，在组件注入的变量之后合并。可表达外部布局；图表几何优先使用 width、height、ringThickness 等公开 Props。 |
| enableResponsive | `boolean` | `true` | 默认在容器放不下时等比缩小图表本体，支持 flex 并排收缩，最小显示宽度由 minWidth 决定（默认 40px），与图表宽度相同时不收缩；HoverPanel 不缩放；false 保留声明尺寸。也透传至 Frame。 |
| enableContext | `boolean` | `true` | 透传 Frame 的上下文能力开关；当前组件自己的 width、height、颜色与出现进度仍由对应 Props 决定。 |
| enableScaleObserver | `boolean` | `false` | 透传 Frame 的旧版尺寸观察兼容能力，默认关闭；不等同于百分比图表尺寸，不建议新示例依赖此迁移期入口。 |
| enableDefaultMotion | `boolean` | `true` | 透传 Frame 默认外层动效能力；不接管图表内部出现时间轴和扇区 hover 增厚，后者分别由 appearMotion / appearanceProgress 与 hoverThicknessGrowth 控制。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

HoverPanel 使用共享三列布局；圆点—名称优先 `--gap-1`，名称—数值优先 `--gap-2`，两处均至少保留 `4 CSS px`，并跟随 LTR / RTL 逻辑方向。默认 16px 根字号下仍为 4px / 8px，较大 Token 保留；面板纵向分区和图表中心注释不套用此下限。

<a id="1-设计原则"></a>

### 设计原则

- **专业图表组件**：当前维护位置为 `components/src/components/`；该目录是迁移期技术位置。运行包使用与原始源码交付按 [LICENSE](../../LICENSE) 执行，不再以高级功能划分付费运行权益。
- **默认 10 项，最多 28 项**:默认 `maxItems=10`。显式提高 `maxItems` 时最多显示 28 项，颜色序列与 CircularChart 完全一致，10 项后仍按序循环。
- **颜色优先级**:`data[i].color → colors[i] → colorMode 对应回退色`。单项颜色只影响当前扇区，不会传递给后续扇区。
- **尺寸基准**:`cornerRadius` 与 `separatorWidth` 都表示 320px 宽仪表图下的设计基准值。组件内部统一按 `width / 320` 等比缩放，数字和字符串数字都按基准值理解。
- **透明间隔**:扇区间隔在 path 几何阶段通过 `padAngle + padRadius` 生成，贯穿内外圆弧并透出真实背景；不绘制固定白色 stroke，也不使用后置 gap mask。
- **图层结构**:base layer 由 `showBaseLayer` 控制，默认关闭，开启时绘制 4% 同色占位层；fill layer 负责真实填充与出现动效；hit layer 使用完整扇区 path 负责 hover / focus / aria。
- **Hover 强调**:每个扇区从当前几何立即转向最新 hover / focus 目标，取消未完成的旧动画，不积压重播；hover / focus 时扇区不位移，仅外半径缓动增加 `hoverThicknessGrowth`；中心标签上方显示百分比，下方显示当前项名称。

共享纯逻辑位于 `components/src/lib/chart/`：颜色、渐变、几何基准缩放、圆环扇区 path 与出现时间轴。GaugeChart 自身保留半圆圆心、起始方向、中心标签和 hover 状态管理。

---

<a id="2-api"></a>


### 2.1 Props


其余未声明属性透传到根 Frame。根使用 `role="group"` 和 `aria-label="仪表图"`（zh-CN 默认，随 locale 切换）；SVG 不隐藏可聚焦扇区，每个扇区命中项以 `role="button"` 和包含名称、百分比的独立 `aria-label` 暴露给辅助技术。

### 2.2 方法

| 方法 | 描述 |
| :--- | :--- |
| `replay()` | 非受控出现动效从 0 重新播放到 1 |
| `resetAppearance()` | 非受控出现动效立即重置到 0 |
| `reverseAppearance()` | 非受控出现动效先进入完成态，再沿同一时间轴从 1 反向回退到 0 |

### 2.3 数据结构

```ts
type GaugeChartColor = string | GaugeChartGradient;

interface GaugeChartGradient {
  type?: "linear";
  angle?: number;
  stops: (string | { color: string; offset?: number | string; opacity?: number })[];
}

interface GaugeChartItem {
  name: string;
  value: number;
  color?: GaugeChartColor;
  percentFormat?: NumberFormatOptions;
}
```

百分比数字格式优先级：`labelFormatter`（中心标签）→ `item.percentFormat` → 组件 `percentFormat` → `NumberFormatContext` → `NumberFormats` 默认值。扇区命中层 `aria-label` 不使用 `labelFormatter`，但会消费 `percentFormat`。

`value <= 0` 或非数字项会被过滤；显式空数组或全部无效时渲染空图表，省略 `data` 才使用内置示例数据。不支持直接传入 `.bg-gradient-blue` 这类背景工具类名，因为 SVG path 消费的是 `fill`。

---

<a id="4-布局模型"></a>

### 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部本体层统一承载 SVG 绘图区与中心标签，负责等比缩放；HoverPanel 与本体层并列，保持原有尺寸。
- 图表尺寸由 `width` / `height` 与 SVG 几何算法决定；作为外部布局子项时表现为 Hug。
- 不接入三槽位协议，不承担通用子元素排列。
- 根层显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`，并透传 `class`、`style` 与未声明属性。

详见 [LayoutProtocol.md §12.7](../../../docs/standards/LayoutProtocol.md)。

---

<a id="5-动效"></a>

### 动效

| 场景 | 实现 | bridge 变量 |
| :--- | :--- | :--- |
| 顺序出现 | 与 CircularChart 一致，默认总时长固定为 `1000ms`，不随扇区数量变化；整张图表使用图表级缓出时间分配：前段时长接近，越靠后的扇区时长越长；单段内部线性填充；透明度跟随填充进度完成；反向进度沿同一公式回退 | 组件内部确定性时间轴 |
| 滚动出现 | `scrollAppearance` 按锚点与视口触发线距离映射到 `appearanceProgress` | 组件内部滚动监听 |
| 扇区 hover 强调 | 每个扇区从当前几何立即转向最新 hover / focus 目标，取消未完成的旧动画，不积压重播；进入时外半径从 `R` 缓动到 `R + hoverThicknessGrowth`，离开时缓动回 `R`；内半径不变，扇区不位移 | 组件内部 `requestAnimationFrame + cubicOut`，`300ms`；减少动效时直接到达最终状态 |
| 扇区亮度反馈 | `filter: brightness(1.04)` | `--snowui-frame-color-motion-*` |
| 中心标签进入 | `opacity + scale` | `--snowui-frame-appear-motion-*` / `--snowui-frame-control-motion-*` |

### 使用示例

```svelte
<GaugeChart centerTitle="Docs" centerSubtitle="This week"
  data={[{ name: "Ready", value: 72 }, { name: "Review", value: 18 }, { name: "Plan", value: 10 }]} />
```

```svelte
<GaugeChart
  data={[
    { name: "Primary", value: 32 },
    { name: "Growth", value: 24 },
    { name: "Support", value: 18 },
    { name: "Explore", value: 14 },
    { name: "Other", value: 12 }
  ]}
/>
```

```svelte
<GaugeChart
  colors={[undefined, "var(--secondary-blue)", "linear-gradient(135deg, var(--black-100) 0%, var(--secondary-blue) 100%)"]}
  data={[
    { name: "Done", value: 62, color: "var(--secondary-mint)" },
    { name: "Doing", value: 24 },
    { name: "Remain", value: 14 }
  ]}
/>
```

```svelte
<script lang="ts">
  let chart: { replay: () => void; reverseAppearance: () => void } | undefined;
</script>

<Button onclick={() => chart?.replay?.()}>重新填充</Button>
<Button onclick={() => chart?.reverseAppearance?.()}>反向回退</Button>
<GaugeChart bind:this={chart} startDirection="right" appearOnView={false} defaultAppearanceProgress={1} />
```

```svelte
<GaugeChart
  width={320}
  height={160}
  data={[
    { name: "Growth", value: 24 },
    { name: "Support", value: 18 }
  ]}
>
  <Text as="segment-value" />
  <Text as="segment-name" />
</GaugeChart>
```

---



## AI Zone

### 内置文案与语言

使用现有 `useLocale()`，key：`gaugeChart.name`。显式根 `aria-label` 保持优先；业务数据名、坐标标签与格式化数值不进入翻译表。


### 5.1 ECharts 参考与 SnowUI 实现细则

本组件与 CircularChart 共用同一套扇区几何。参考来源与职责分别是：

- 官网 [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 示例用于确认目标视觉：半圆扇区同样需要同时保留清晰间隔和端部圆角。
- ECharts 的 `src/chart/pie/pieLayout.ts` 用于确认间隔原则：ECharts 在布局阶段通过 `padAngle` 收缩实际扇区角度。
- ECharts 的 `src/chart/helper/sectorHelper.ts` 用于确认圆角原则：`borderRadius` 属于扇区自身几何。
- SnowUI 最终在共享 `components/src/lib/chart/arc-path.ts` 中使用 d3-shape 实现对应原则，没有直接复制 ECharts 渲染代码。

落地规则：

- `separatorWidth` 先按 GaugeChart 的 320px 宽基准缩放，再换算为 d3-shape 的 `padAngle`；`padRadius` 使内外圆弧共同收缩。
- `cornerRadius` 在收缩后的扇区 path 上生效。间隔贯穿环厚后，端部圆角仍然保留。
- base layer、fill layer 与 hit layer 复用同一套完整 padded path。
- 圆环形态的 fill layer 绘制完整扇区并用局部 `revealPath` mask 揭示；内半径为 `0` 的实心半饼图直接绘制局部 `revealPath`，避免 Chromium 对动态嵌套 SVG mask 不重绘。两种形态共享相同时间轴。
- hover / focus 只增加外半径，内半径和圆心不变；外扩后的 path 不受后置 gap mask 裁切。
- 多扇区且 `separatorWidth=0` 时，base layer 与 fill layer 分别用白色 alpha mask 合并完整 path、`0.5px` seam cover 和只描边的 `blur(0.5px)` seam，再让颜色或渐变只绘制一次；半透明色不会因 fill 与 stroke 重叠而形成深色毛边。base layer 在 mask 合并后统一使用 `4%` 透明度；显式透明间隔不启用该补偿。

### 5.2 本轮问题与解决方法

| 问题 | 根因 | 最终解决方法 |
| :--- | :--- | :--- |
| 动效填充没有与下方占位扇区重合 | 局部圆角扇区会随扫描角度变化轮廓 | fill layer 固定使用完整 padded path；局部 `revealPath` mask 只负责揭示 |
| 移除旧 mask 后透明间隔消失 | 间隔依赖后置 mask，没有进入几何 | 在共享 `arc-path.ts` 中使用 `separatorWidth → padAngle + padRadius` |
| 间隔没有贯穿环厚，大圆角下短线分隔不稳定 | 径向短线 mask 需要根据圆角缩进，圆角越大越容易缩短 | 淘汰径向短线 mask；改用几何 padding |
| 较大的圆角设置不生效，短扇区圆角消失 | 旧 path 有额外半径限制，并在短弧下退化 | 改用 d3-shape `arc().cornerRadius()`，只遵守真实几何上限 |
| hover 扇区外扩后被裁切 | 旧 mask 或 SVG 范围没有覆盖外扩 path | 统一按外扩范围生成 path 与视口；不再让 gap mask 参与裁切 |
| `separatorWidth={0}` 时仍出现约 1px 发丝缝，半透明色直接叠加同色描边又会形成深色毛边 | SVG 相邻 path 分别做抗锯齿，共边处可能透出背景；半透明 fill 与 stroke 分开绘制会在重叠边缘重复合成 alpha | 用包含完整 path、`0.5px` seam cover 与 `blur(0.5px)` seam 的白色 alpha mask 合并覆盖范围，再让颜色或渐变通过该 mask 只绘制一次；同时覆盖缝隙并避免同一扇区边缘重复叠色 |
| 实心半饼图出现后只剩径向细线，DOM 中的进度却已完成 | Chromium 没有稳定重绘随进度变化的实心 `revealPath` 嵌套 mask | 实心形态直接以 `revealPath` 作为填充或单层 seam mask；圆环形态继续使用透明尾迹 mask |

---

<a id="6-使用示例"></a>


> **状态**: 已实现


> **参考**: ECharts [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 官方示例，以及本地 ECharts `src/chart/pie/pieLayout.ts`、`src/chart/helper/sectorHelper.ts` 源码。


默认启用响应式，无需传入开关：容器无法完整容纳图表时（含 flex 并排布局扣除相邻内容后的剩余宽度），图表本体自动整体等比缩小，最小显示宽度由 `minWidth` 决定，默认 `"40px"`；容器不足下限时保持下限。将 `minWidth` 设为与图表宽度相同即可阻止自动缩小。恢复宽度后回到声明尺寸。环厚、透明间距、圆角、hover 增厚以及全部中心内容（含角色模板与静态 `center-label`）同比缩放；HoverPanel 保持原有大小。`enableResponsive={false}` 保留声明尺寸。尺寸字符串的既有单位解析限制不变，推荐数字尺寸。尺寸观察复用 `components/src/lib/chart/size.ts` 的 `watchSectorChartSize`，由 `resizeManager` 管理并在卸载时清理；无 ResizeObserver 时保留初次测量与核心交互。

---

<a id="3-样式-token-详表"></a>

### 样式 Token 详表

| 属性 | 默认值 | Token / 变量 |
| :--- | :--- | :--- |
| 整体宽度 | 320px | `--snowui-gauge-chart-width` |
| 整体高度 | 160px | `--snowui-gauge-chart-height` |
| 圆环粗细 | 32px | `--snowui-gauge-chart-ring-thickness` |
| 扇区圆角 | 320px 基准 4px | `--snowui-gauge-chart-corner-radius` |
| 透明间隔粗细 | 320px 基准 2px | `--snowui-gauge-chart-separator-width` |
| hover 外侧增厚 | 4px | `--snowui-gauge-chart-hover-thickness-growth` |
| 中心标签数值 | 320px 宽基准下 18px / Bold / 100% 黑色 | `--snowui-gauge-chart-label-value-font-size` |
| 中心标签名称 | 320px 宽基准下 14px / Regular / 40% 黑色 | `--snowui-gauge-chart-label-name-font-size` |
| 中心标签行高 | `1` | 内置 `line-height: 1` |
| 中心标签行间距 | 320px 宽基准下 2px，并随图表缩放 | `--snowui-gauge-chart-label-gap` |
| 中心标签底部距离 | 图表高度的 20%；320x160 时等于 32px | `--snowui-gauge-chart-label-bottom-offset` |

### 3.1 默认颜色序列

| 序号 | Token |
| :--- | :--- |
| 1 | `var(--primary, #111111)` |
| 2 | `var(--secondary-purple, #B899EB)` |
| 3 | `var(--secondary-cyan, #A0BCE8)` |
| 4 | `var(--secondary-mint, #6BE6D3)` |
| 5 | `var(--secondary-green, #71DD8C)` |
| 6 | `var(--secondary-indigo, #ADADFB)` |
| 7 | `var(--secondary-blue, #7DBBFF)` |
| 8 | `var(--secondary-yellow, #FFCC00)` |
| 9 | `var(--secondary-orange, #FFB55B)` |
| 10 | `var(--secondary-red, #FF4747)` |

### 3.2 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-gauge-chart-width-override` | 整体宽度 |
| `--snowui-gauge-chart-height-override` | 整体高度 |
| `--snowui-gauge-chart-label-font-size-override` | 中心标签字号 |
| `--snowui-gauge-chart-label-color-override` | 中心标签主色 |
| `--snowui-gauge-chart-label-muted-color-override` | 中心标签次色 |
| `--snowui-gauge-chart-label-font-weight-override` | 中心标签主行字重 |
| `--snowui-gauge-chart-label-muted-font-weight-override` | 中心标签次行字重 |

尺寸、环厚、圆角、隔断和 hover 外侧增厚优先通过 props 调整；props 会写入组件私有 CSS 变量。
扇区 hover 提示不使用浏览器原生 SVG `title`，避免不可控灰底提示；结构化提示使用内置 Chart hover 面板。

空闲中心内容使用 `centerTitle` / `centerSubtitle`，默认均为空。它们与 hover 文本使用同一个默认渲染器，字号、字重、颜色、行距和响应式缩放完全一致；hover 优先于 focus，所有交互结束后恢复空闲内容。标题变化会立即更新，无需重建组件；`labelFormatter` 只格式化活动数据项。动态角色模板同样接收空闲文字，静态 `center-label` 则优先保留调用方内容。

中心常驻内容可通过 `<Frame as="center-label">...</Frame>` 声明。`center-label` 不套用默认中心 hover label 的字号和颜色；其自定义排版随图表本体响应式缩放；未写样式时继承父级容器文字样式。出现 `center-label` 时，默认中心 hover 信息转由 hover 面板承载。

中心标签可传入直接子元素 `<Text as="segment-value" />` / `<Text as="segment-name" />` 自定义样式模板；组件会自动写入当前扇区的真实百分比和名称，出现任一角色子元素时不渲染默认中心标签。`showCenterLabel={false}` 会同时关闭默认标签和外部写入的中心标签角色内容。

---

## 更新日志

### v1.7.5 (2026-10-23)

- 共享 HoverPanel 的圆点—名称、名称—数值间距保留 4 CSS px 下限并支持 RTL；保持默认 4px / 8px、较大 Token、图表几何与中心注释。


### v1.7.4 (2026-10-20)

- 内置根名称接入统一 locale；修复显式 aria-label 被默认值覆盖，业务名称与数字格式保持原样。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.7.2 (2026-09-05)

- 扇区 appearance 每帧改为一次线性时间表计算；HoverPanel pointer 与 cell 命中坐标按绘制帧共用一次根层测量。公开 API、半圆 path、动效时长、视觉和交互语义不变。

### v1.7.1 (2026-09-04)

- 零间隔扇区改为通过 alpha paint mask 单次绘制颜色，同时保留 seam cover，减少抗锯齿缝隙并消除半透明 fill / stroke 重叠造成的深色边缘。

### v1.7.0 (2026-09-04)

- 新增可选空闲中心标题与副标题，复用默认 hover 排版，hover / focus 临时替换、离开恢复。
- 保留静态中心和动态角色模板的优先级，加载恢复及开关中心区域后同步角色内容。

### v1.6.1 (2026-09-04)

- 修复快速反复移入移出与切换扇区后 hover 动画积压重播；新目标从当前几何立即接管。
- 鼠标离开后保留仍在焦点中的扇区强调；减少动效时直接显示最终几何。

### v1.6.0 (2026-09-03)

- 新增 `minWidth`，默认 `"40px"`；与图表宽度相同即可阻止响应式收缩，数字尺寸使用相同单位规则。

### v1.5.1 (2026-09-03)

- 默认响应式支持 flex 并排布局剩余宽度，最小显示宽度固定为 40px；无需手动开启，关闭时保留声明尺寸。

### v1.5.0 (2026-09-03)

- 默认随可用宽度等比缩小图表本体与全部中心内容，空间恢复后回到声明尺寸；`enableResponsive=false` 保留声明尺寸。
- HoverPanel 保持大小，pointer / focus 定位与实际显示尺寸一致。

### v1.4.1 (2026-09-03)

- 审计全部公开属性，补齐 Frame 透传、数据空态、尺寸解析、格式优先级与受控动效边界。
- Site 示例改为 12 个完整场景：文档准备度、半环/半饼、尺寸、配色、聚合、格式、提示、命中、播放、受控进度与报告状态。
- 示例使用设计系统 Token 和组件默认中心文字；Code 与 Preview 从同一配方生成。

### v1.4.0 (2026-09-03)

- 新增 `showBaseLayer=false`，按需开启最终尺寸的同色轮廓；真实图形和出现动效保持原有行为。

### 2026-09-02

- HoverPanel 改为默认开启，默认外观保持 light。

### v1.3.0 (2026-06-04)

- 新增 Chart 通用 `colorMode`：`sequence`、`monochromeFade`、`monochrome`。
- 新增 `color` 主色以及 `monochromeColor` / `mutedMonochromeColor` 细分入口；三种颜色模式均支持 `data[i].color` 与 `colors[i]` 指定扇区自定义颜色。

### v1.2.0 (2026-05-31)

- 间隔改为 path 几何阶段的 `padAngle + padRadius`，淘汰后置 gap mask 与径向短线 mask。
- fill layer 改为完整 padded path 加局部 `revealPath` mask，修复动效填充与占位扇区不重合。
- 圆角统一使用 d3-shape，修复大圆角无效、短弧圆角消失与 hover 裁切问题。
- 补充 ECharts 官网示例、本地源码参考以及本轮问题与解决方法。
- 零间隔多扇区的不透明色增加 `0.5px` 同色 seam cover 与只画描边的 `blur(0.5px)` seam。

### v1.1.0 (2026-05-28)

- 默认颜色序列同步 CircularChart。
- 支持 `colors` 调色板、每扇区颜色、CSS 变量、`linear-gradient(...)` 字符串与渐变对象。
- 圆角和透明间隔统一按 320px 基准等比缩放。
- 新增 4% 同色占位层、真实填充层、透明命中层与透明间隔。
- 新增出现动效、受控进度、滚动时间轴、重新填充与反向回退方法。
- 抽离图表颜色、渐变、几何、圆环 path 与出现时间轴纯逻辑到 `components/src/lib/chart/`。

### v1.0.0 (2026-05-22)

- 初始实现 仪表图组件。
- 支持整体宽高、环厚、圆角、隔断、hover 外侧增厚可调。
- 支持中心 hover 标签、默认 10 项且可显式提高到 28 项、SnowUI `primary + secondary-*` 颜色序列。
- 接入 Frame 根层、Skeleton、Test 示例与规范登记。
