# CircularChart (圆形图表)

> **版本**: v1.2.0
> **状态**: 已实现(PRO)
> **包归属**: `@snowui/components-pro`
> **职责**: 渲染可调圆角、环厚、隔断、整体尺寸的圆环/饼形比例图。Hover 动效参考 Apache ECharts `pie-borderRadius` 示例的强调反馈，并按 SnowUI 规范改为外侧增厚。
> **参考**: ECharts [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 官方示例，以及本地 ECharts `src/chart/pie/pieLayout.ts`、`src/chart/helper/sectorHelper.ts` 源码。

---

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
- 自动过滤无效数据：`value <= 0` 或非数字项不参与渲染；全部数据无效时回退内置示例数据。
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
- 根节点使用 `role="img"` 和 `aria-label="圆形图表"`；每个命中扇区使用独立 `aria-label` 暴露名称与百分比。
- 扇区命中层可获得键盘焦点，focus 行为与 hover 一致；中心标签使用 `aria-live="polite"`。

### 2.6 Frame 集成

- 根层使用 `Frame`，支持 `loading`、`skeleton`、`renderHints` 骨架屏协议。
- 支持 `enableResponsive`、`enableContext`、`enableScaleObserver`、`enableDefaultMotion` 透传到 Frame。
- `class`、`style` 和其余未声明属性会透传给根层 Frame。
- 图表尺寸由 SVG 几何算法决定，作为外部布局子项时表现为 Hug。

---

## 3. API

### 3.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `data` | `CircularChartItem[]` | 内置 5 项示例数据 | 图表数据 |
| `size` | `number \| string` | `240` | 图表整体尺寸；数字按 px 语义转为 rem |
| `ringThickness` | `number \| string` | `32` | 圆环粗细；等于外半径与内半径差。大于等于外半径时，内半径归零，图表变为实心饼图 |
| `cornerRadius` | `number \| string \| "auto"` | `"auto"` | 扇区端部圆角半径；数值表示 160x160 图表下的设计基准值，并按 `size / 160` 等比缩放；`auto` 等同基准值 `4` |
| `separatorWidth` | `number \| string \| "auto"` | `"auto"` | 扇区之间的隔断粗细；数值表示 160x160 图表下的设计基准值，并按 `size / 160` 等比缩放；`auto` 等同基准值 `2` |
| `colors` | `(CircularChartColor \| undefined)[]` | - | 自定义调色板；支持普通颜色、CSS 变量和 `linear-gradient(...)` 字符串，也支持渐变对象；数组留空项回退当前 `colorMode`。不支持直接传入背景工具类名 |
| `colorMode` | `"sequence" \| "monochromeFade" \| "monochrome"` | `"sequence"` | Chart 通用颜色模式：默认色序、单色渐浅、单色 |
| `color` | `CircularChartColor` | - | 单色模式主色；传入后同时作为 `monochromeFade` 与 `monochrome` 的默认颜色 |
| `monochromeColor` | `CircularChartColor` | `"Primary"` | `monochromeFade` 的单色来源；第一个扇区为 100%，最后一个扇区为 20%，中间按扇区数量均匀递减 |
| `mutedMonochromeColor` | `CircularChartColor` | `"Black4"` | `monochrome` 的单色来源；默认所有未自定义扇区为 4% 黑色本体颜色，填充透明度保持 100% |
| `hoverThicknessGrowth` | `number \| string` | `4` | hover 强调时扇区向外增厚的距离；内半径不变，扇区不位移 |
| `startDirection` | `"top" \| "top-right" \| "right" \| "bottom-right" \| "bottom" \| "bottom-left" \| "left" \| "top-left"` | `"top"` | 出现动效起始方向；从圆心向该方向发射线，命中的扇区作为第一个播放扇区 |
| `showBaseLayer` | `boolean` | `false` | 是否显示最终尺寸的同色轮廓（影子 / 占位底层），默认不渲染；开启后以 4% 不透明度绘制，不参与出现动效，不改变真实图形、命中区域或时间轴。 |
| `appearMotion` | `boolean` | `true` | 是否启用出现动效 |
| `appearOnView` | `boolean` | `true` | 是否在触发锚点进入视口默认位置时自动播放出现动效 |
| `appearanceProgress` | `number` | - | 受控出现进度，范围 `0..1`；传入后组件只根据该进度渲染，不自行播放 |
| `defaultAppearanceProgress` | `number` | `0` | 非受控初始出现进度；自动播放场景默认从边框态播放到完整态 |
| `appearanceDuration` | `number` | - | 自动播放总时长覆盖；未设置时 CircularChart 固定为 `1000ms`，不随扇区数量变化 |
| `appearAnchorId` | `string` | - | 动效触发锚点元素 ID；不传时使用图表自身根元素 |
| `appearAnchorPoint` | `"top" \| "center" \| "bottom"` | `"top"` | 使用锚点元素的顶端、中间或底部作为触发点 |
| `appearViewportPoint` | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置；`0.7` 表示视口高度 70% |
| `scrollAppearance` | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动条时间轴控制出现动效 |
| `scrollAppearanceDistance` | `number \| string` | `320` | 滚动时间轴从 `0` 到 `1` 对应的滚动距离 |
| `onAppearanceProgressChange` | `(progress: number) => void` | - | 出现进度变化回调 |
| `hoverScaleSize` | `number \| string` | - | 已废弃别名；兼容旧调用，建议改用 `hoverThicknessGrowth` |
| `maxItems` | `number` | `10` | 最多显示项数，内部上限固定为 10 |
| `showCenterLabel` | `boolean` | `true` | hover / focus 时是否显示中心标签；设为 `false` 可关闭中间扇区信息 |
| `hoverMode` | `"cell" \| "item"` | `"cell"` | hover 命中模式；`cell` 使用整图角度命中，扇区间隔处也保持当前扇区，`item` 仅命中可见扇区图形 |
| `showHoverPanel` | `boolean` | `true` | 是否开启 Chart hover 面板，内容按当前扇区自动生成；默认开启并保留中心 hover label；无静态 center-label 时可设为 false 关闭面板，有静态 center-label 时仍自动开启 |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | hover 面板视觉样式 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"pointer"` | hover 面板定位；所有图表都可使用 `pointer` |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在 hover 面板顶部显示当前扇区名称 |
| `percentFormat` | `NumberFormatOptions` | NumberFormats 百分比默认 | 中心标签与扇区 `aria-label` 百分比数字格式；默认保留 1 位小数，可被单个数据项 `percentFormat` 覆盖 |
| `labelFormatter` | `(item, percent) => string` | - | 中心标签格式化，支持用 `\n` 分两行；第一行是数值样式，第二行是名称样式 |
| `loading` | `boolean` | - | Frame loading 协议 |
| `skeleton` | `boolean` | - | Frame skeleton 协议 |
| `renderHints` | `RenderHints` | - | 骨架屏渲染提示 |
| `enableResponsive` | `boolean` | `true` | 是否启用 Frame responsive 能力 |
| `enableContext` | `boolean` | `true` | 是否启用 Frame context 能力 |
| `enableScaleObserver` | `boolean` | `false` | 是否启用 Frame scale observer |
| `enableDefaultMotion` | `boolean` | `true` | 是否启用 Frame 默认动效能力 |
| `class` | `string` | `""` | 根层附加 class |
| `style` | `string` | `""` | 根层附加 style |

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

`value <= 0` 或非数字项会被过滤；全部无效时回退到内置示例数据。

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

中心常驻内容可通过 `<Frame as="center-label">...</Frame>` 声明。`center-label` 不套用默认中心 hover label 的字号、颜色和缩放规则；未写样式时继承父级容器文字样式。出现 `center-label` 时，默认中心 hover 信息转由 hover 面板承载。

### 4.3 圆环到实心饼图

`ringThickness` 会向内吞掉空心区域。当 `ringThickness >= outerRadius` 时，组件将内半径压到 `0`，中间空心圆消失，扇区以圆心闭合，形成实心饼图。

---

## 5. 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区 + 中心标签层。
- 图表尺寸由 `size` 与 SVG 几何算法决定；作为外部布局子项时表现为 Hug。
- 不接入三槽位协议，不承担通用子元素排列。

详见 [LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

---

## 6. 动效

| 场景 | 实现 | bridge 变量 |
| :--- | :--- | :--- |
| 首次登场 / 滚动出现 | 所有扇区先显示完整同色 0.5px 内描边；再从 `startDirection` 命中的扇区起始边界开始，按顺时针方向逐扇区执行。默认总时长固定为 `1000ms`，不随扇区数量变化；下一个扇区只在上一个扇区填充完成后启动，不等待上一个扇区透明度补齐完成；填充方向为扇区起点到终点；整张图表使用图表级缓出时间分配，前段时长接近，越靠后的扇区时长越长；单个扇区内部填充保持线性；滚动时间轴由 `appearanceProgress` 直接反推同一时间轴，天然可逆 | 组件内部确定性时间轴；`appearanceProgress` 控制总进度 |
| 扇区顺序与速度 | 第一个扇区立即启动；第 2 个扇区在第 1 个扇区填充完成后启动，第 3 个扇区在第 2 个扇区填充完成后启动，以此类推。CC-01 五扇区时前三段时长接近，后两段逐步变长，形成整张图表级别的缓出 | 组件内部时间轴 |
| 填充透明度 | 单扇区填充路径叠加透明度遮罩。扇区启动时左侧透明度为 0%、中段为 62%、右侧扫描头为 100%；透明度与填充同时启动，并在 0.75s 内线性补齐到整段 100% 不透明。反向时间轴会按相同规则回退 | `appearanceProgress` 直接渲染 |
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
- **填充层**:fill layer 始终绘制与占位层相同的完整 padded path。出现动效只使用局部 `revealPath` mask 逐步揭示颜色，不使用局部圆角扇区替代填充几何。
- **透明度层**:每个填充 path 套用独立 `linearGradient + mask`。启动瞬间尾部透明度为 `0%`、中段为 `62%`、扫描头为 `100%`；随后尾部和中段在 `0.75s` 内线性补齐到 `100%`。透明度时间轴与填充时间轴同时启动，但不决定下一个扇区何时启动。
- **无可见分隔层**:扇区未填充时不绘制白色 outline、独立 separator path 或后置 gap mask。间隔直接存在于 path 几何中。
- **零间隔 seam cover**:多扇区且 `separatorWidth=0` 时，相邻 SVG path 的独立抗锯齿可能让背景从共边处透出发丝缝。base layer 与 fill layer 增加 `0.5px` 同色描边覆盖该亚像素接缝，并叠加一层只画描边的 `blur(0.5px)` 同色 seam；base layer 两层描边都保持 `4%` 透明度。显式透明间隔场景不启用该描边。
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
| `separatorWidth={0}` 的实心饼图仍有约 1px 发丝缝 | SVG 会对相邻 path 分别做边缘抗锯齿；即使几何完全共边，背景仍可能从亚像素覆盖不足处透出。ECharts doughnut 官网示例默认使用 Canvas，不会呈现同样的 SVG 接缝 | 仅在多扇区且零间隔时，为 base layer 与 fill layer 增加 `0.5px` 同色 seam cover，并叠加只画描边的 `blur(0.5px)` seam；显式间隔保持原有 padding 几何 |

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
- 零间隔多扇区增加 `0.5px` 同色 seam cover 与只画描边的 `blur(0.5px)` seam，修复 SVG 抗锯齿产生的发丝缝。

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
