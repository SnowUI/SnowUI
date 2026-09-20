# CircularChart (圆形图表)

> **版本**: v1.4.2
> **状态**: 已实现(PRO)
> **包归属**: `@snowui/components-pro`
> **职责**: 渲染可调圆角、环厚、隔断、整体尺寸的圆环/饼形比例图。Hover 动效参考 Apache ECharts `pie-borderRadius` 示例的强调反馈，并按 SnowUI 规范改为外侧增厚。
> **参考**: ECharts [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 官方示例，以及本地 ECharts `src/chart/pie/pieLayout.ts`、`src/chart/helper/sectorHelper.ts` 源码。


默认启用响应式，无需传入开关：容器无法完整容纳图表时（含 flex 并排布局扣除相邻内容后的剩余宽度），图表本体自动整体等比缩小，最小显示宽度由 `minWidth` 决定，默认 `"40px"`；容器不足下限时保持下限。将 `minWidth` 设为与图表宽度相同即可阻止自动缩小。恢复宽度后回到声明尺寸。环厚、透明间距、圆角、hover 增厚以及全部中心内容（含角色模板与静态 `center-label`）同比缩放；HoverPanel 保持原有大小。`enableResponsive={false}` 保留声明尺寸。尺寸字符串的既有单位解析限制不变，推荐数字尺寸。尺寸观察复用 `pro/src/lib/chart/size.ts` 的 `watchSectorChartSize`，由 OSS `resizeManager` 管理并在卸载时清理；无 ResizeObserver 时保留初次测量与核心交互。

---

## 组件介绍

用圆环或饼图展示数据占比，支持分段、圆角、环厚与悬停强调，适合构成分析和比例概览。

## 1. 设计原则

- **PRO 组件**:图表属于付费高级展示组件，不公开源码，放在 `pro/src/components/`。
- **最多 10 项**:默认 `maxItems=10`。颜色只使用 `primary` 与 9 个 `secondary-*` token，10 项后颜色会重复且图表辨识度下降，因此组件默认截断到 10 项。
- **颜色模式**:默认 `colorMode="sequence"` 按 `primary → secondary-purple → secondary-cyan → secondary-mint → secondary-green → secondary-indigo → secondary-blue → secondary-yellow → secondary-orange → secondary-red` 循环；`monochromeFade` 使用 Primary 从 100% 均匀递减到最后一项 20%；`monochrome` 默认所有扇区使用 Black4。每个数据项可通过 `color` 单独定义扇区颜色；`colors` 可作为按 index 的调色板覆盖入口，留空项回退当前颜色模式。
- **几何缩放**:`cornerRadius` 与 `separatorWidth` 的数值都是 160x160 图表下的设计基准值，组件会按实际 `size / 160` 等比缩放。`auto` 使用默认基准值：圆角 `4`、间隔 `2`。
- **Hover 强调**:hover / focus 当前项时，扇区不位移，仅外半径缓动增加 `hoverThicknessGrowth`，默认向外增厚 `4px`；中心标签上方显示百分比，下方显示当前项名称。

---

## 2. 特性总览

### 2.1 数据与形态

- 支持圆环图与实心饼图：`ringThickness` 小于外半径时为圆环，`ringThickness >= outerRadius` 时内半径归零并形成实心饼图。
- 支持最多 10 个扇区：`maxItems` 默认 `10`，内部上限固定为 `10`，超出项会被截断。
- 自动过滤无效数据：`value <= 0` 或非数字项不参与渲染；显式空数组或全部无效时渲染空图表，只有省略 `data` 时使用内置示例数据。
- 支持尺寸、环厚、圆角、隔断和 hover 外侧增厚调整：数字值按 px 语义写入组件私有 CSS 变量。
- 支持 160x160 基准几何缩放：`cornerRadius` 与 `separatorWidth` 的传入数值都是设计基准值，实际渲染按 `size / 160` 等比放大或缩小。

### 2.2 扇区绘制

- 扇区路径包含外圆弧、内圆弧和头尾切线圆角，圆角跟随真实扇区形状生成，不依赖后期裁切。
- 扇区之间的透明间隔在 path 几何阶段生成：`separatorWidth` 会换算为 d3-shape 的 `padAngle`，并配合 `padRadius` 收缩内外圆弧。不绘制白色分隔线，也不使用后置 gap mask 挖空扇区。
- 圆角仍由收缩后的扇区 path 生成，因此贯穿环厚的透明间隔与端部圆角可以同时成立。
- `showBaseLayer=true` 时底层绘制一层同色 `4%` 透明度占位扇区，默认不绘制，不参与出现动效；真实填充层在其上方播放。
- 最上层使用完整扇区 path 作为透明命中层，保证 hover / focus 的交互范围稳定。

### 2.3 颜色能力

- 默认颜色顺序为 Primary、Purple、Cyan、Mint、Green、Indigo、Blue、Yellow、Orange、Red。
- 每个扇区可通过 `data[i].color` 单独定义颜色；未定义颜色的扇区继续使用默认颜色序列。
- `colors` 可作为整组调色板覆盖入口，并允许数组项为 `undefined`，空项会回退当前 `colorMode` 对应颜色。
- 支持 Chart 通用三种颜色模式：`sequence` 默认色序、`monochromeFade` 单色渐浅、`monochrome` 单色。三种模式都支持 `data[i].color` 与 `colors[i]` 指定扇区自定义颜色。
- `color` 支持普通颜色、CSS 变量、`linear-gradient(...)` 字符串和渐变对象。
- 不直接支持 `.bg-gradient-blue` 这类背景工具类名；SVG 扇区使用 `fill`，背景类的 `background` / `background-image` 不会被 path 消费。

### 2.4 动效能力

- 支持首次进入视口自动播放出现动效，可通过 `appearOnView` 关闭。
- 支持 8 个出现起始方向：`top / top-right / right / bottom-right / bottom / bottom-left / left / top-left`。
- 支持滚动条时间轴：`scrollAppearance` 开启后，滚动距离直接映射到 `appearanceProgress`。
- 支持受控时间轴：外部传入 `appearanceProgress` 后，组件只根据该进度渲染，不自行播放。
- 支持非受控方法：`replay()` 重新填充，`resetAppearance()` 重置，`reverseAppearance()` 反向回退。
- 填充层与透明度层同时启动：填充完成后下一个扇区即可启动，透明度补齐独立继续，不阻塞后续扇区。
- 支持反向时间轴：`appearanceProgress` 从 `1` 回到 `0` 时，填充宽度与透明度按同一公式回退。

### 2.5 交互与无障碍

- hover / focus 当前扇区时，扇区外半径向外增厚，内半径不变，扇区不发生位移。
- hover / focus 当前扇区时，中心标签显示当前项百分比和名称，默认百分比在上、名称在下。
- `labelFormatter` 可自定义中心标签内容，并支持用 `\n` 拆成两行；第一行按数值样式渲染，第二行按名称样式渲染。
- 可传入直接子元素 `<Text as="segment-value" />` / `<Text as="segment-name" />` 自定义中心标签样式模板；组件会自动写入当前扇区的真实百分比和名称，出现任一角色子元素时不渲染默认中心标签。
- `showCenterLabel={false}` 可关闭中心标签，同时关闭外部写入的中心标签角色内容。
- 当前根默认使用 `role="img"` 和 `aria-label="圆形图表"`，命中扇区带独立 `aria-label`。这是 [ChartSpec §9.3](../../../specs/ChartSpec.md#93-已确认实现漂移) 已登记的无障碍实现限制：可聚焦扇区位于 `aria-hidden="true"` 的 SVG 中，仅透传 `role="group"` 不能解决读屏可达性；不得把键盘 focus 可用等同于完整读屏支持。
- 扇区命中层可获得键盘焦点，focus 行为与 hover 一致；中心标签使用 `aria-live="polite"`。

### 2.6 Frame 集成

- 根层使用 `Frame`；`loading` 保留声明尺寸和中心内容，将扇区固定在出现动效起点并暂停交互。图表根层明确关闭 Skeleton，也会读取上层 Frame 的 loading 上下文。
- 支持 `enableResponsive`、`enableContext`、`enableScaleObserver`、`enableDefaultMotion` 透传到 Frame。
- `class`、`style` 和其余未声明属性会透传给根层 Frame。
- 图表尺寸由 SVG 几何算法决定，作为外部布局子项时表现为 Hug。

---

## 3. API

### 3.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `data` | `CircularChartItem[]` | 内置 5 项示例数据 | 比例数据数组；每项必填 name（名称）与 value（有限正数），可选 color、percentFormat。按输入顺序过滤非正数和非法值，再取前 maxItems 项；百分比分母是实际显示项之和。省略 `data` 时使用内置示例数据；显式空数组或全部无效时保留最终尺寸并渲染空图表。 |
| `size` | `number \| string` | `240` | 图表正方形尺寸；推荐传正数，数字按 px 设计值转为 rem。字符串直接作为 CSS 长度，但 SVG 几何仅通过 parseFloat 取数，不进行单位换算，因此不支持可靠的百分比、calc() 或 CSS 变量自适应几何。 |
| `minWidth` | `number \| string` | `"40px"` | 响应式最小显示宽度；数字与 size 使用相同的 px 设计值转 rem 规则，字符串直接作为 CSS 长度。默认固定 40 CSS px；设为与 size 相同可阻止自动缩小，设为更小值允许缩到该下限。仅 enableResponsive=true 时生效。 |
| `ringThickness` | `number \| string` | `32` | 环厚，推荐非负数字（px 设计值）；内半径为 max(0, 外半径 − 环厚)。外半径为 size / 2 − hoverThicknessGrowth − 1，环厚达到它时形成实心饼图。字符串仅提取数值，不换算 CSS 单位。 |
| `cornerRadius` | `number \| string \| "auto"` | `"auto"` | 扇区端部圆角；非负数值或数字字符串表示 160×160 基准下的 px 设计值，按 size / 160 缩放；auto 使用基准值 4。最终圆角受环厚和扇区可容纳角度限制；0 为直角。 |
| `separatorWidth` | `number \| string \| "auto"` | `"auto"` | 扇区间透明隔断；非负数值或数字字符串表示 160×160 基准下的 px 设计值，按 size / 160 缩放；auto 使用基准值 2，0 关闭间隔。通过路径几何留空，透出真实背景。 |
| `colors` | `(CircularChartColor \| undefined)[]` | - | 按过滤后显示索引覆盖颜色；每项支持语义色、CSS 颜色/变量、linear-gradient 字符串或 { type?, angle?, stops } 渐变对象。undefined 空位回退当前 colorMode；数据项 color 优先于调色板。不支持背景 utility 类名。 |
| `colorMode` | `"sequence" \| "monochromeFade" \| "monochrome"` | `"sequence"` | sequence 按 Primary 与 9 个 Secondary 色序循环；monochromeFade 使用同一主色从首项 100% 均匀降至末项 20%（单项为 100%）；monochrome 所有项使用同一颜色。三种模式均允许数据项和调色板逐项覆盖。 |
| `color` | `CircularChartColor` | - | 同时覆盖 monochromeFade 与 monochrome 的回退主色，优先于 monochromeColor / mutedMonochromeColor；sequence 不使用它。支持与数据项 color 相同的纯色、语义色和渐变。 |
| `monochromeColor` | `CircularChartColor` | `"Primary"` | 仅在 monochromeFade 且未传 color 时使用的回退主色；支持纯色和渐变。透明度从首项 100% 降到末项 20%，数据项 color 与 colors 仍优先。 |
| `mutedMonochromeColor` | `CircularChartColor` | `"Black4"` | 仅在 monochrome 且未传 color 时使用的回退色；默认 Black4 是主题自适应的低对比色，扇区填充自身不再降低透明度。数据项 color 与 colors 仍优先。 |
| `hoverThicknessGrowth` | `number \| string` | —（解析后为 `4`） | hover / focus 时向外增厚的非负 px 设计值；内半径与圆心不变。未传时依次读取旧别名 hoverScaleSize、回退 4；0 关闭几何增厚但保留数据提示。字符串仅提取数值。 |
| `startDirection` | `"top" \| "top-right" \| "right" \| "bottom-right" \| "bottom" \| "bottom-left" \| "left" \| "top-left"` | `"top"` | 从 top、top-right、right、bottom-right、bottom、bottom-left、left、top-left 射线命中的扇区开始，按顺时针顺序播放；只选择首个播放扇区，不旋转数据排布。同一大扇区覆盖的多个方向可能产生相同顺序。 |
| `showBaseLayer` | `boolean` | `false` | 是否显示最终几何的同色 4% 透明度底层；默认不渲染。开启后底层不参与出现动效与命中，便于观察填充进度；不改变真实扇区和数据。 |
| `appearMotion` | `boolean` | `true` | 是否启用图形出现动效；false 时直接显示完整填充，并使 replay / reverseAppearance 不播放。此开关不关闭独立的 hover 增厚反馈。 |
| `appearOnView` | `boolean` | `true` | 非受控模式中，锚点到达指定视口位置时自动播放一次；同源 iframe 中按最外层同源页面的真实位置判断。false 可改用实例方法播放。appearanceProgress 优先；scrollAppearance 开启时由滚动驱动。 |
| `appearanceProgress` | `number` | - | 受控填充进度，数值限制到 0..1；提供后显示由调用方决定，自动播放和实例播放方法不改变受控画面。appearMotion=false 仍直接完整显示；外部进度变化不会触发 onAppearanceProgressChange。 |
| `defaultAppearanceProgress` | `number` | `0` | 非受控模式首次初始化的进度，限制到 0..1，只读取一次；后续改变此属性不重置动画。有 appearanceProgress 时不决定画面；默认 0 为描边态。 |
| `appearanceDuration` | `number` | - | 实例播放与自动出现的总时长，单位 ms；未传时固定 1000，不随扇区数改变。非正数在下一动画帧直接到终点；不改变滚动或受控进度映射。 |
| `appearAnchorId` | `string` | - | 页面内触发锚点元素的 id；未传时使用图表根元素，传入不存在的 id 不回退根元素。仅用于自动出现或滚动时间轴，不改变图表位置。 |
| `appearAnchorPoint` | `"top" \| "center" \| "bottom"` | `"top"` | 选用锚点的 top（顶部）、center（垂直中心）或 bottom（底部）与视口触发线比较；不影响扇区绘制方向。 |
| `appearViewportPoint` | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发线：数字限制到 0..1，或使用 top=0、center=0.5、bottom=1。默认 0.7 为视口高度 70%；配合 appearAnchorPoint 决定触发/滚动起点。 |
| `scrollAppearance` | `boolean \| { distance?: number \| string }` | `false` | true 开启 window 滚动驱动的非受控时间轴；同源 iframe 同时响应外层页面滚动。对象可用 distance 覆盖滚动距离。锚点越过触发线后进度由距离决定，向回滚动会逆向恢复。不监听嵌套 ScrollArea；appearanceProgress / appearMotion=false 优先。 |
| `scrollAppearanceDistance` | `number \| string` | `320` | 滚动进度从 0 到 1 所需的 CSS px 距离；数字或数字字符串，最低按 1 处理。scrollAppearance.distance 优先；只在滚动时间轴开启时生效，不换算字符串单位。 |
| `onAppearanceProgressChange` | `(progress: number) => void` | - | 内部进度写入时接收 progress（0..1），包括初始化中的直接完成、自动播放、实例方法与滚动更新；可同步外部进度读数。默认值初始化本身不通知；不用于监听外部 appearanceProgress，返回值被忽略，不能取消更新。 |
| `hoverScaleSize` | `number \| string` | - | 已废弃的增厚别名，单位和行为与 hoverThicknessGrowth 相同；仅后者未传时生效。新代码使用 hoverThicknessGrowth，不能把它理解为整体缩放比例。 |
| `maxItems` | `number` | `10` | 过滤后保留的前 N 项数量，不排序、不自动合并 Other；取整并限制到 1..10，0 / NaN 回退 10。百分比只基于保留项，超过 10 类的业务应先聚合小类以保留总量；全无效时渲染空图表。 |
| `showCenterLabel` | `boolean` | `true` | 是否渲染中心内容区域；false 同时隐藏默认动态标签、segment-value / segment-name 模板与静态 center-label。隐藏中心不关闭显式启用的 HoverPanel。 |
| `hoverMode` | `"cell" \| "item"` | `"cell"` | cell 按环带角度命中，跨过透明隔断仍保持所属扇区，排除中心空洞与图外；item 只响应扇区路径命中。两种模式均保留扇区键盘 focus 提示。 |
| `showHoverPanel` | `boolean` | `true` | 默认根据当前 hover / focus 扇区显示结构化面板，同时保留动态中心标签。false 关闭面板；但存在可见静态 center-label 时组件自动启用面板承载扇区信息。 |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | 面板视觉：light 为默认浅色玻璃样式，dark 为深色样式，surface 为主题表面样式；仅改变面板外观，不改变数据和命中。 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"pointer"` | 面板位置：pointer 跟随指针；anchor-top / anchor-side 相对当前指针点定位（键盘焦点使用图心）；pin-top-left / pin-top / pin-top-right / pin-right / pin-bottom-right / pin-bottom / pin-bottom-left / pin-left / pin-center 固定在图表对应位置，边缘保留 8px 并参与视口碰撞处理。 |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在面板行数据上方额外显示当前扇区名称；false 只显示数据行。仅面板开启且存在当前项时有可见效果。 |
| `percentFormat` | `NumberFormatOptions` | NumberFormats 百分比默认 | 中心百分比、面板百分比与扇区 aria-label 的数字格式；支持 fractionDigits、locale 等 NumberFormatOptions。优先级为数据项 percentFormat → 本属性 → NumberFormatContext → 默认一位小数；labelFormatter 只覆盖中心文本。 |
| `labelFormatter` | `(item, percent) => string` | - | hover / focus 时接收 item（当前有效数据项）与 percent（0..100 百分数），返回中心文字；以换行拆成数值行与名称行，最多使用两行。静态 center-label 或 showCenterLabel=false 时不调用；不改变面板和扇区 aria-label 的百分比。 |
| `loading` | `boolean` | - | 数据等待状态。保留 `size` 对应的最终占位和中心内容，将扇区固定在出现动效起点并暂停交互；变为 false 后按当前视口条件播放出现动效。图表不渲染 Skeleton，也会读取上层 Frame 的 loading 上下文；显式空 `data={[]}` 不回退默认演示数据。 |
| `enableResponsive` | `boolean` | `true` | 默认在容器放不下时等比缩小图表本体，支持 flex 并排收缩，最小显示宽度由 minWidth 决定（默认 40px），与图表宽度相同时不收缩；HoverPanel 不缩放；false 保留声明尺寸。也透传至 Frame。 |
| `enableContext` | `boolean` | `true` | 透传 Frame 的上下文能力开关；当前组件自己的 size、颜色与出现进度仍由对应 Props 决定。 |
| `enableScaleObserver` | `boolean` | `false` | 透传 Frame 的旧版尺寸观察兼容能力，默认关闭；不等同于百分比图表尺寸，不建议新示例依赖此迁移期入口。 |
| `enableDefaultMotion` | `boolean` | `true` | 透传 Frame 默认外层动效能力；不接管图表内部出现时间轴和扇区 hover 增厚，后者分别由 appearMotion / appearanceProgress 与 hoverThicknessGrowth 控制。 |
| `class` | `string` | `""` | 追加到图表根 Frame 的 class 字符串；不传时为空。仅表达调用方公开根样式，不穿透内部 SVG 和标签结构。 |
| `style` | `string` | `""` | 追加到根 Frame 的 inline style 字符串，在组件注入的变量之后合并。可表达外部布局；图表几何优先使用 size、ringThickness 等公开 Props。 |
| `children` | `Snippet` | — | 无参数 Snippet，渲染在 showCenterLabel=true 的中心区域。直系 Frame as="center-label" 提供常驻内容并自动启用面板，其内直系 Text as="segment-value" / "segment-name" 可复用默认中心排版且保留自定义文本；直系 Text as="segment-value" / "segment-name" 为动态标签样式模板，由组件写入两行文本。中心为展示区域，不用于交互工具栏。 |

其余未声明属性会透传给根层 `Frame`。

### 3.2 组件方法

| 方法 | 描述 |
| :--- | :--- |
| `replay()` | 非受控出现动效从 `0` 重新播放到 `1` |
| `resetAppearance()` | 非受控出现动效立即重置到 `0` |
| `reverseAppearance()` | 非受控出现动效先进入完成态，再沿同一时间轴从 `1` 反向回退到 `0` |

### 3.3 数据结构

```ts
interface CircularChartItem {
  name: string;
  value: number;
  color?: CircularChartColor;
  percentFormat?: NumberFormatOptions;
}
```

百分比数字格式优先级：`labelFormatter`（中心标签）→ `item.percentFormat` → 组件 `percentFormat` → `NumberFormatContext` → `NumberFormats` 默认值。扇区命中层 `aria-label` 不使用 `labelFormatter`，但会消费 `percentFormat`。

`value <= 0` 或非数字项会被过滤；显式空数组或全部无效时渲染空图表，省略 `data` 才使用内置示例数据。

```ts
type CircularChartColor = string | CircularChartGradient;

interface CircularChartGradient {
  type?: "linear";
  angle?: number;
  stops: (string | { color: string; offset?: number | string; opacity?: number })[];
}
```

颜色优先级：`data[i].color` → `colors[i]` → `colorMode` 对应回退色。未定义颜色的扇区不会受其它扇区自定义颜色影响，继续使用当前颜色模式。渐变字符串支持 `linear-gradient(135deg, #111111 0%, #6BE6D3 100%)` 形式；渐变对象支持用 `angle` 和 `stops` 显式声明。

---

## 4. 样式 Token 详表

| 属性 | 默认值 | Token / 变量 |
| :--- | :--- | :--- |
| 整体尺寸 | 240px | `--snowui-circular-chart-size` |
| 圆环粗细 | 32px | `--snowui-circular-chart-ring-thickness` |
| 扇区圆角 | `auto`（160x160 基准值为 4，并按 `size / 160` 等比缩放） | `--snowui-circular-chart-corner-radius` |
| 隔断粗细 | `auto`（160x160 基准值为 2，并按 `size / 160` 等比缩放） | `--snowui-circular-chart-separator-width` |
| hover 外侧增厚 | 4px | `--snowui-circular-chart-hover-thickness-growth` |
| 中心标签数值 | 160x160 基准下 14px / Semibold / 100% 黑色 | `--snowui-circular-chart-label-value-font-size` |
| 中心标签名称 | 160x160 基准下 12px / Regular / 40% 黑色 | `--snowui-circular-chart-label-name-font-size` |
| 中心标签行高 | `1` | 内置 `line-height: 1` |
| 中心标签行间距 | 160x160 基准下 2px，并随图表缩放 | `--snowui-circular-chart-label-gap` |

### 4.1 颜色序列

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

### 4.2 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-circular-chart-size-override` | 整体尺寸 |
| `--snowui-circular-chart-label-font-size-override` | 中心标签字号 |
| `--snowui-circular-chart-label-color-override` | 中心标签主色 |
| `--snowui-circular-chart-label-muted-color-override` | 中心标签次色 |
| `--snowui-circular-chart-label-font-weight-override` | 中心标签主行字重 |
| `--snowui-circular-chart-label-muted-font-weight-override` | 中心标签次行字重 |

尺寸、环厚、圆角、隔断和 hover 外侧增厚优先通过 props 调整；props 会写入组件私有 CSS 变量。
扇区 hover 提示不使用浏览器原生 SVG `title`，避免不可控灰底提示；结构化提示使用内置 Chart hover 面板。

中心常驻内容可通过 `<Frame as="center-label">...</Frame>` 声明。其直系 `Text as="segment-value"` / `Text as="segment-name"` 可显式复用图表默认的字号、颜色、行高、字重、居中与行间距；这些嵌套角色保留调用方文本，不写入悬停数据。`center-label` 的其它自定义内容不套用默认中心 hover label 的字号和颜色，但随图表本体响应式缩放；未写样式时继承父级容器文字样式。出现 `center-label` 时，默认中心 hover 信息转由 hover 面板承载。

### 4.3 圆环到实心饼图

`ringThickness` 会向内吞掉空心区域。当 `ringThickness >= outerRadius` 时，组件将内半径压到 `0`，中间空心圆消失，扇区以圆心闭合，形成实心饼图。

---

## 5. 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部本体层统一承载 SVG 绘图区与中心标签，负责等比缩放；HoverPanel 与本体层并列，保持原有尺寸。
- 图表尺寸由 `size` 与 SVG 几何算法决定；作为外部布局子项时表现为 Hug。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

---

## 6. 动效

| 场景 | 实现 | bridge 变量 |
| :--- | :--- | :--- |
| 首次登场 / 滚动出现 | 所有扇区先显示完整同色 0.5px 内描边；再从 `startDirection` 命中的扇区起始边界开始，按顺时针方向逐扇区执行。默认总时长固定为 `1000ms`，不随扇区数量变化；下一个扇区只在上一个扇区填充完成后启动，不等待上一个扇区透明度补齐完成；填充方向为扇区起点到终点；整张图表使用图表级缓出时间分配，前段时长接近，越靠后的扇区时长越长；单个扇区内部填充保持线性；滚动时间轴由 `appearanceProgress` 直接反推同一时间轴，天然可逆 | 组件内部确定性时间轴；`appearanceProgress` 控制总进度 |
| 扇区顺序与速度 | 第一个扇区立即启动；第 2 个扇区在第 1 个扇区填充完成后启动，第 3 个扇区在第 2 个扇区填充完成后启动，以此类推。CC-01 五扇区时前三段时长接近，后两段逐步变长，形成整张图表级别的缓出 | 组件内部时间轴 |
| 填充透明度 | 圆环扇区叠加透明度遮罩：启动时尾部透明度为 0%、中段为 62%、扫描头为 100%，并在 0.75s 内补齐。实心饼图直接绘制随进度增长的 `revealPath`，避免浏览器对动态嵌套 SVG mask 不重绘；两种形态都由同一进度时间轴驱动 | `appearanceProgress` 直接渲染 |
| 底层占位扇区 | `showBaseLayer=true` 时在真实填充层下方绘制一层同色 4% 透明度扇区，不参与出现动效；动效完成前也能看到完整图表结构 | 组件内部 base layer |
| 扇区分隔线 | 间隔由 `separatorWidth` 调整；其数值表示 160x160 图表下的设计基准值，组件按 `size / 160` 等比缩放。间隔在 path 几何阶段通过 `padAngle + padRadius` 生成，让真实背景自然透出 | `separatorWidth` |
| 扇区 hover 强调 | 每个扇区仅保留当前动画；hover / focus 目标改变时立即取消旧帧，从当前外半径向最新目标过渡，不排队或补播；进入时增厚到 `R + hoverThicknessGrowth`，离开且没有焦点时回到 `R`，保持原有 `300ms cubicOut`；内半径不变，扇区不位移，减少动效时直接到达目标 | 组件内部 `requestAnimationFrame + cubicOut` 几何动画 |
| 扇区亮度反馈 | `filter: brightness(1.04)` | `--snowui-frame-color-motion-*` |
| 中心标签进入 | `opacity + scale` | `--snowui-frame-appear-motion-*`（生命周期进入时序） / `--snowui-frame-control-motion-*` |

### 6.1 出现动效起始方向

`startDirection` 支持 8 个方向：`top / top-right / right / bottom-right / bottom / bottom-left / left / top-left`。

判定规则：

1. 从圆心向 `startDirection` 发出射线。
2. 找到该射线命中的扇区。
3. 不论射线落在该扇区的哪个位置，动效都从该扇区自身起始边界开始。
4. 后续按顺时针方向逐扇区填充，直到所有扇区完成。

### 6.2 ECharts 参考与 SnowUI 实现细则

本组件同时参考 ECharts 官网示例与本地源码：

- 官网 [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 示例用于确认目标视觉：扇区可以同时具有清晰间隔与端部圆角。
- 本地 `[项目目录]/repos/echarts-master/src/chart/pie/pieLayout.ts` 用于确认几何原则：ECharts 在布局阶段计算 `padAngle`，再收缩每个扇区的实际 `startAngle` / `endAngle`。
- 本地 `[项目目录]/repos/echarts-master/src/chart/helper/sectorHelper.ts` 用于确认圆角原则：`borderRadius` 属于扇区自身形状参数，并按环厚解析。
- SnowUI 没有直接复制 ECharts 渲染代码，而是在共享 `pro/src/lib/chart/arc-path.ts` 中使用 d3-shape 实现等价原则。

SnowUI 的最终实现为：

- **几何阶段透明间隔**:先按数据值计算完整扇区角度，再将 `separatorWidth` 换算为 d3-shape 的 `padAngle`；同时使用 `padRadius` 收缩内外圆弧。间隔属于最终扇区 path，贯穿环厚并透出真实背景。
- **完整扇区路径**:每个扇区按完整显示角度生成圆角 path，包含外圆弧、内圆弧、起止两端的切线圆角过渡。`cornerRadius` 的数值表示 160x160 图表下的设计基准值，组件按 `size / 160` 得到实际圆角；`cornerRadius="auto"` 等同基准值 `4`。最终路径会限制圆角不超过环厚的一半与当前扇区可容纳的角度。
- **底层占位扇区**:填充层下方先绘制同一组完整扇区 path，颜色与对应数据项一致，透明度固定为 `4%`，仅 `showBaseLayer=true` 时存在，不参与出现动效。
- **填充层**:圆环形态绘制完整 padded path，再用局部 `revealPath` mask 揭示；内半径为 `0` 的实心饼图直接绘制局部 `revealPath`，绕开 Chromium 对动态嵌套 SVG mask 的重绘缺陷。两种形态共享相同的顺序和进度时间轴。
- **透明度层**:圆环形态的每个填充 path 套用独立 `linearGradient + mask`。启动瞬间尾部透明度为 `0%`、中段为 `62%`、扫描头为 `100%`；随后尾部和中段在 `0.75s` 内线性补齐到 `100%`。实心形态以稳定完成为先，不叠加这层动态透明尾迹。
- **无可见分隔层**:扇区未填充时不绘制白色 outline、独立 separator path 或后置 gap mask。间隔直接存在于 path 几何中。
- **零间隔 seam cover**:多扇区且 `separatorWidth=0` 时，相邻 SVG path 的独立抗锯齿可能让背景从共边处透出发丝缝。base layer 与 fill layer 分别用白色 alpha mask 合并完整 path、`0.5px` seam cover 和只画描边的 `blur(0.5px)` seam，再让颜色或渐变通过该 mask 只绘制一次；半透明色不会因 fill 与 stroke 重叠而形成深色毛边。base layer 在合并后统一使用 `4%` 透明度；显式透明间隔不启用该补偿。
- **层级顺序**:从下到上依次为 4% 透明度占位层、动效填充层、透明命中层。占位层只表达完整结构；填充层负责扫描填充、透明度补齐、圆角和间隔；命中区域使用同一个完整扇区 path。
- **可逆时间轴**:`appearanceProgress` 是总时间轴的直接渲染结果，`0..1` 可任意反推。滚动控制或外部受控进度反向变化时，填充宽度与透明度都会按同一确定性公式回退。

顺序出现时间轴按扇区播放顺序计算：

```ts
totalFillDuration = 1000ms
tailWeight(order) = 1 + 0.75 * easeInCubic(order / (count - 1))
fillDuration(order) = totalFillDuration * tailWeight(order) / sum(tailWeight(0..count - 1))
startOffset(order) = sum(fillDuration(0..order - 1))
fillProgress = clamp((elapsed - startOffset) / fillDuration(order), 0, 1)
opacityProgress = clamp((elapsed - startOffset) / 750, 0, 1)
```

因此第 2 个扇区只在第 1 个扇区的填充完成后启动；如果第 1 个扇区透明度仍未补齐，它会继续独立完成，不阻塞后续扇区。

### 6.3 本轮问题与解决方法

| 问题 | 根因 | 最终解决方法 |
| :--- | :--- | :--- |
| 动效过程中填充没有与下方占位扇区重合 | 旧实现直接用当前进度构造局部圆角扇区；短弧圆角收敛后，局部 path 轮廓会偏离完整扇区 | fill layer 固定使用完整 padded path；动效只使用局部 `revealPath` mask 揭示填充 |
| 移除旧 gap mask 后示例没有间隔 | 间隔仍依赖后置 mask，没有进入扇区几何 | 在共享 `arc-path.ts` 中将 `separatorWidth` 换算为 `padAngle`，并设置 `padRadius` |
| 径向短线 mask 的间隔没有贯穿扇区，且大圆角时分隔长度不一致 | 短线需要根据圆角手工缩进，圆角越大，短线越短 | 淘汰径向短线 mask；改用几何 padding，让间隔贯穿内外圆弧 |
| `cornerRadius={80}` 时部分扇区圆角消失，或更大的圆角看不出变化 | 旧算法有额外 `innerRadius / 4` 限制，并在短弧下退化为无圆角 | 共享 path 改用 d3-shape `arc().cornerRadius()`；圆角仅受环厚一半和扇区真实角度容量限制 |
| hover 外扩后局部被切掉 | 外扩 path 与视口或旧 mask 范围不一致 | hover 只增加外半径；完整 path、占位层、填充层、命中层和 SVG 视口统一按外扩范围生成 |
| `separatorWidth={0}` 的实心饼图仍有约 1px 发丝缝，半透明色直接叠加同色描边又会形成深色毛边 | SVG 会对相邻 path 分别做边缘抗锯齿；即使几何完全共边，背景仍可能从亚像素覆盖不足处透出。半透明 fill 与 stroke 分开绘制还会在重叠边缘重复合成 alpha | 用包含完整 path、`0.5px` seam cover 与 `blur(0.5px)` seam 的白色 alpha mask 合并覆盖范围，再让颜色或渐变通过该 mask 只绘制一次；显式间隔继续使用原有 padding 几何 |
| 实心饼图出现后只剩径向细线，DOM 中的进度却已完成 | Chromium 没有稳定重绘随进度变化的实心 `revealPath` 嵌套 mask | 实心形态直接以 `revealPath` 作为填充或单层 seam mask；圆环形态继续使用透明尾迹 mask |

---

## 7. 使用示例

```svelte
<CircularChart
  data={[
    { name: "Search Engine", value: 1048 },
    { name: "Direct", value: 735 },
    { name: "Email", value: 580 },
    { name: "Union Ads", value: 484 },
    { name: "Video Ads", value: 300 }
  ]}
/>
```

```svelte
<CircularChart
  size={320}
  ringThickness={88}
  cornerRadius={16}
  separatorWidth={4}
  hoverThicknessGrowth={4}
/>
```

上例中的 `cornerRadius={16}` 与 `separatorWidth={4}` 表示 160x160 图表下的设计基准值。实际尺寸为 320 时，最终呈现为 32px 圆角与 8px 间隔。

```svelte
<CircularChart
  size={220}
  ringThickness={64}
  data={[
    {
      name: "Primary Gradient",
      value: 42,
      color: "linear-gradient(135deg, var(--primary, #111111) 0%, var(--secondary-mint, #6BE6D3) 100%)"
    },
    { name: "Default Purple", value: 30 },
    {
      name: "Object Gradient",
      value: 18,
      color: {
        angle: 45,
        stops: [
          "var(--secondary-purple, #B899EB) 0%",
          "var(--secondary-cyan, #A0BCE8) 100%"
        ]
      }
    },
    { name: "Default Mint", value: 10 }
  ]}
/>
```

```svelte
<CircularChart
  data={[
    { name: "Direct", value: 735 },
    { name: "Email", value: 580 }
  ]}
>
  <Text as="segment-value" class="text-18 font-bold text-black-100" />
  <Text as="segment-name" class="text-14 text-black-40" />
</CircularChart>
```

```svelte
<CircularChart
  bind:this={chart}
  startDirection="left"
  appearOnView={false}
/>

<Button onclick={() => chart.replay()}>重新填充</Button>
<Button onclick={() => chart.reverseAppearance()}>反向回退</Button>
```

```svelte
<!-- 环厚足够大时，中间空心圆消失，变为实心饼图 -->
<CircularChart
  size={220}
  ringThickness={140}
  cornerRadius={8}
  separatorWidth={3}
/>
```

---

## 8. 更新日志 (Changelog)

### v1.4.2 (2026-09-05)

- 扇区 appearance 每帧改为一次线性时间表计算；HoverPanel pointer 与 cell 命中坐标按绘制帧共用一次根层测量。公开 API、扇区 path、动效时长、视觉和交互语义不变。

### v1.4.1 (2026-09-04)

- 零间隔扇区改为通过 alpha paint mask 单次绘制颜色，同时保留 seam cover，减少抗锯齿缝隙并消除半透明 fill / stroke 重叠造成的深色边缘。

### v1.4.0 (2026-09-03)

- 新增 `minWidth`，默认 `"40px"`；与图表宽度相同即可阻止响应式收缩，数字尺寸使用相同单位规则。

### v1.3.1 (2026-09-03)

- 默认响应式支持 flex 并排布局剩余宽度，最小显示宽度固定为 40px；无需手动开启，关闭时保留声明尺寸。

### v1.3.0 (2026-09-03)

- 默认随可用宽度等比缩小图表本体与全部中心内容，空间恢复后回到声明尺寸；`enableResponsive=false` 保留声明尺寸。
- HoverPanel 保持大小，pointer / focus 定位与实际显示尺寸一致。

### v1.2.3 (2026-09-03)

- 常驻 center-label 支持通过直系 segment-value / segment-name 角色显式复用默认中心排版，内容仍由调用方维护；其它自定义内容不受影响。
- 两行角色使用默认居中对齐，并继续支持公开 class / style 和标签 override。

### v1.2.2 (2026-09-03)

- 修复 Loading / Skeleton 或中心显隐切换后，中心节点重新挂载未同步角色识别的问题；常驻 center-label 恢复后不再叠加默认 hover 标签。
- 中心角色识别跟随实际节点生命周期，兼容直接 loading 与上层 Frame 加载状态。

### v1.2.1 (2026-09-03)

- 按现有源码补齐全部 44 个具名 Property 的用途、默认解析、数值单位、回调、中心组合和数据回退边界；未改变运行时行为。

### 2026-09-03

- 修复快速反复 hover / focus 后积压动画重播的问题，按最新交互状态从当前几何位置接管；鼠标离开时保留仍有效的键盘焦点。

### v1.2.0 (2026-09-03)

- 新增 `showBaseLayer=false`，按需开启最终尺寸的同色轮廓；真实图形和出现动效保持原有行为。

### 2026-09-02

- HoverPanel 改为默认开启，默认外观保持 light。
- 修复单扇区占满整圆时的 pointer 命中，使默认面板可以正常显示。

### v1.1.0 (2026-06-04)

- 新增 Chart 通用 `colorMode`：`sequence`、`monochromeFade`、`monochrome`。
- 新增 `color` 主色以及 `monochromeColor` / `mutedMonochromeColor` 细分入口；传入 `color` 后，单色渐浅和单色模式的默认颜色都改为该主色。
- 三种颜色模式均支持 `data[i].color` 与 `colors[i]` 指定扇区自定义颜色。

### v1.0.2 (2026-05-31)

- 间隔改为 path 几何阶段的 `padAngle + padRadius`，淘汰后置 gap mask 与径向短线 mask。
- fill layer 改为完整 padded path 加局部 `revealPath` mask，修复动效填充与占位扇区不重合。
- 圆角统一使用 d3-shape，修复大圆角无效、短弧圆角消失与 hover 裁切问题。
- 补充 ECharts 官网示例、本地源码参考以及本轮问题与解决方法。
- 零间隔多扇区的不透明色增加 `0.5px` 同色 seam cover 与只画描边的 `blur(0.5px)` seam。

### v1.0.1 (2026-05-28)

- 补充完整特性文档：数据形态、扇区绘制、颜色、动效、交互无障碍与 Frame 集成。
- 明确 `cornerRadius` / `separatorWidth` 是 160x160 基准设计值，并按 `size / 160` 等比缩放。
- 明确颜色支持 CSS 变量、`linear-gradient(...)` 字符串和渐变对象；未定义颜色的扇区回退默认序列。
- 记录 4% 同色占位层、透明间隔、反向回退时间轴和组件方法。

### v1.0.0 (2026-05-22)

- 初始实现 PRO 圆形图表组件。
- 支持整体尺寸、环厚、圆角、隔断、hover 外侧增厚可调。
- 支持中心 hover 标签、最多 10 项、SnowUI `primary + secondary-*` 颜色序列。
- 接入 Frame 根层、Skeleton、Test 示例与规范登记。
