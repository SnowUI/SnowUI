# GaugeChart (仪表图)

> **版本**: v1.3.0
> **状态**: 已实现(PRO)
> **包归属**: `@snowui/components-pro`
> **职责**: 渲染可调圆角、环厚、透明间隔、渐变颜色、4% 同色占位层与顺序出现动效的半圆仪表比例图。颜色、几何与出现时间轴能力与 CircularChart 保持同类心智。
> **参考**: ECharts [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 官方示例，以及本地 ECharts `src/chart/pie/pieLayout.ts`、`src/chart/helper/sectorHelper.ts` 源码。

---

## 1. 设计原则

- **PRO 组件**:图表属于付费高级展示组件，放在 `pro/src/components/`。
- **最多 10 项**:默认 `maxItems=10`。颜色序列与 CircularChart 完全一致，10 项后仍按序循环。
- **颜色优先级**:`data[i].color → colors[i] → colorMode 对应回退色`。单项颜色只影响当前扇区，不会传递给后续扇区。
- **尺寸基准**:`cornerRadius` 与 `separatorWidth` 都表示 320px 宽仪表图下的设计基准值。组件内部统一按 `width / 320` 等比缩放，数字和字符串数字都按基准值理解。
- **透明间隔**:扇区间隔在 path 几何阶段通过 `padAngle + padRadius` 生成，贯穿内外圆弧并透出真实背景；不绘制固定白色 stroke，也不使用后置 gap mask。
- **图层结构**:base layer 常驻 4% 同色占位层；fill layer 负责真实填充与出现动效；hit layer 使用完整扇区 path 负责 hover / focus / aria。
- **Hover 强调**:每个扇区独立排队执行进入与离开动画；hover / focus 时扇区不位移，仅外半径缓动增加 `hoverThicknessGrowth`；中心标签上方显示百分比，下方显示当前项名称。

共享纯逻辑位于 `pro/src/lib/chart/`：颜色、渐变、几何基准缩放、圆环扇区 path 与出现时间轴。GaugeChart 自身保留半圆圆心、起始方向、中心标签和 hover 状态管理。

---

## 2. API

### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `data` | `GaugeChartItem[]` | 内置 5 项示例数据 | 图表数据 |
| `width` | `number \| string` | `320` | 图表整体宽度；数字按 px 语义转为 rem |
| `height` | `number \| string` | `160` | 图表整体高度；数字按 px 语义转为 rem |
| `ringThickness` | `number \| string` | `32` | 半圆环粗细；等于外半径与内半径差 |
| `cornerRadius` | `number \| string \| "auto"` | `"auto"` | 320px 基准下的扇区圆角；`auto` 等同基准 4px，实际值为 `base * width / 320` |
| `separatorWidth` | `number \| string \| "auto"` | `"auto"` | 320px 基准下的透明间隔粗细；`auto` 等同基准 2px，实际值为 `base * width / 320` |
| `colors` | `(GaugeChartColor \| undefined)[]` | - | 自定义调色板；空项回退当前 `colorMode`；支持普通颜色、CSS 变量、`linear-gradient(...)` 字符串和渐变对象 |
| `colorMode` | `"sequence" \| "monochromeFade" \| "monochrome"` | `"sequence"` | Chart 通用颜色模式：默认色序、单色渐浅、单色 |
| `color` | `GaugeChartColor` | - | 单色模式主色；传入后同时作为 `monochromeFade` 与 `monochrome` 的默认颜色 |
| `monochromeColor` | `GaugeChartColor` | `"Primary"` | `monochromeFade` 的单色来源；第一个扇区为 100%，最后一个扇区为 20%，中间按扇区数量均匀递减 |
| `mutedMonochromeColor` | `GaugeChartColor` | `"Black4"` | `monochrome` 的单色来源；默认所有未自定义扇区为 4% 黑色本体颜色，填充透明度保持 100% |
| `hoverThicknessGrowth` | `number \| string` | `4` | hover 强调时扇区向外增厚的距离；内半径不变，扇区不位移 |
| `startDirection` | `"left" \| "right"` | `"left"` | 出现动效起始方向；只影响填充顺序和扫描方向，不旋转数据排布 |
| `appearMotion` | `boolean` | `true` | 是否启用出现动效；关闭时直接显示完整填充层，占位层仍存在 |
| `appearOnView` | `boolean` | `true` | 锚点进入视口默认位置时自动播放出现动效 |
| `appearanceProgress` | `number` | - | 受控出现进度，范围 `0..1`；传入后组件只渲染外部进度 |
| `defaultAppearanceProgress` | `number` | `0` | 非受控初始出现进度 |
| `appearanceDuration` | `number` | - | 自动播放总时长覆盖；未设置时 GaugeChart 与 CircularChart 一致，固定为 `1000ms`，不随扇区数量变化 |
| `appearAnchorId` | `string` | - | 动效触发锚点元素 ID；不传时使用图表根元素 |
| `appearAnchorPoint` | `"top" \| "center" \| "bottom"` | `"top"` | 使用锚点的顶端、中间或底部作为触发点 |
| `appearViewportPoint` | `number \| "top" \| "center" \| "bottom"` | `0.7` | 视口触发位置 |
| `scrollAppearance` | `boolean \| { distance?: number \| string }` | `false` | 是否启用滚动条时间轴控制出现进度 |
| `scrollAppearanceDistance` | `number \| string` | `320` | 滚动时间轴从 0 到 1 对应的滚动距离 |
| `onAppearanceProgressChange` | `(progress: number) => void` | - | 非受控进度变化回调 |
| `maxItems` | `number` | `10` | 最多显示项数，内部上限固定为 10 |
| `showCenterLabel` | `boolean` | `true` | hover / focus 时是否显示中心标签 |
| `hoverMode` | `"cell" \| "item"` | `"cell"` | hover 命中模式；`cell` 使用整图角度命中，扇区间隔处也保持当前扇区，`item` 仅命中可见扇区图形 |
| `showHoverPanel` | `boolean` | `false` / 有 `center-label` 时自动开启 | 是否开启 Chart hover 面板，内容按当前扇区自动生成；默认关闭时 hover / focus 显示中心 hover label |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | hover 面板视觉样式 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"pointer"` | hover 面板定位；所有图表都可使用 `pointer` |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在 hover 面板顶部显示当前扇区名称 |
| `percentFormat` | `NumberFormatOptions` | NumberFormats 百分比默认 | 中心标签与扇区 `aria-label` 百分比数字格式；默认保留 1 位小数，可被单个数据项 `percentFormat` 覆盖 |
| `labelFormatter` | `(item, percent) => string` | - | 中心标签格式化，支持用 `\n` 分两行；第一行是数值样式，第二行是名称样式 |
| `loading` | `boolean` | - | Frame loading 协议 |
| `skeleton` | `boolean` | - | Frame skeleton 协议 |
| `renderHints` | `RenderHints` | - | 骨架屏渲染提示 |

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

`value <= 0` 或非数字项会被过滤；全部无效时回退到内置示例数据。不支持直接传入 `.bg-gradient-blue` 这类背景工具类名，因为 SVG path 消费的是 `fill`。

---

## 3. 样式 Token 详表

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

中心常驻内容可通过 `<Frame as="center-label">...</Frame>` 声明。`center-label` 不套用默认中心 hover label 的字号、颜色和缩放规则；未写样式时继承父级容器文字样式。出现 `center-label` 时，默认中心 hover 信息转由 hover 面板承载。

中心标签可传入直接子元素 `<Text as="segment-value" />` / `<Text as="segment-name" />` 自定义样式模板；组件会自动写入当前扇区的真实百分比和名称，出现任一角色子元素时不渲染默认中心标签。`showCenterLabel={false}` 会同时关闭默认标签和外部写入的中心标签角色内容。

---

## 4. 布局模型

主布局模型:**内禀原子布局**。

- 根层为 `Frame`，内部为单个 SVG 绘图区 + 中心标签层。
- 图表尺寸由 `width` / `height` 与 SVG 几何算法决定；作为外部布局子项时表现为 Hug。
- 不接入三槽位协议，不承担通用子元素排列。
- 根层显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`，并透传 `class`、`style` 与未声明属性。

详见 [LayoutProtocol.md §12.7](../../../specs/LayoutProtocol.md)。

---

## 5. 动效

| 场景 | 实现 | bridge 变量 |
| :--- | :--- | :--- |
| 顺序出现 | 与 CircularChart 一致，默认总时长固定为 `1000ms`，不随扇区数量变化；整张图表使用图表级缓出时间分配：前段时长接近，越靠后的扇区时长越长；单段内部线性填充；透明度跟随填充进度完成；反向进度沿同一公式回退 | 组件内部确定性时间轴 |
| 滚动出现 | `scrollAppearance` 按锚点与视口触发线距离映射到 `appearanceProgress` | 组件内部滚动监听 |
| 扇区 hover 强调 | 每个扇区独立排队执行进入与离开动画；进入时外半径从 `R` 缓动到 `R + hoverThicknessGrowth`，离开时缓动回 `R`；内半径不变，扇区不位移 | 组件内部 `requestAnimationFrame + cubicOut` |
| 扇区亮度反馈 | `filter: brightness(1.04)` | `--snowui-frame-color-motion-*` |
| 中心标签进入 | `opacity + scale` | `--snowui-frame-appear-motion-*` / `--snowui-frame-control-motion-*` |

### 5.1 ECharts 参考与 SnowUI 实现细则

本组件与 CircularChart 共用同一套扇区几何。参考来源与职责分别是：

- 官网 [`pie-borderRadius`](https://echarts.apache.org/examples/zh/editor.html?c=pie-borderRadius) 示例用于确认目标视觉：半圆扇区同样需要同时保留清晰间隔和端部圆角。
- 本地 `[项目目录]/repos/echarts-master/src/chart/pie/pieLayout.ts` 用于确认间隔原则：ECharts 在布局阶段通过 `padAngle` 收缩实际扇区角度。
- 本地 `[项目目录]/repos/echarts-master/src/chart/helper/sectorHelper.ts` 用于确认圆角原则：`borderRadius` 属于扇区自身几何。
- SnowUI 最终在共享 `pro/src/lib/chart/arc-path.ts` 中使用 d3-shape 实现对应原则，没有直接复制 ECharts 渲染代码。

落地规则：

- `separatorWidth` 先按 GaugeChart 的 320px 宽基准缩放，再换算为 d3-shape 的 `padAngle`；`padRadius` 使内外圆弧共同收缩。
- `cornerRadius` 在收缩后的扇区 path 上生效。间隔贯穿环厚后，端部圆角仍然保留。
- base layer、fill layer 与 hit layer 复用同一套完整 padded path。
- fill layer 始终绘制完整扇区；出现动效只使用局部 `revealPath` mask 揭示颜色，因此扫描过程中不会偏离 4% 占位层。
- hover / focus 只增加外半径，内半径和圆心不变；外扩后的 path 不受后置 gap mask 裁切。
- 多扇区且 `separatorWidth=0` 时，base layer 与 fill layer 使用 `0.5px` 同色 seam cover 覆盖相邻 SVG path 独立抗锯齿产生的亚像素接缝，并叠加一层只画描边的 `blur(0.5px)` 同色 seam；base layer 两层 seam 保持 `4%` 透明度。显式透明间隔不启用该描边。

### 5.2 本轮问题与解决方法

| 问题 | 根因 | 最终解决方法 |
| :--- | :--- | :--- |
| 动效填充没有与下方占位扇区重合 | 局部圆角扇区会随扫描角度变化轮廓 | fill layer 固定使用完整 padded path；局部 `revealPath` mask 只负责揭示 |
| 移除旧 mask 后透明间隔消失 | 间隔依赖后置 mask，没有进入几何 | 在共享 `arc-path.ts` 中使用 `separatorWidth → padAngle + padRadius` |
| 间隔没有贯穿环厚，大圆角下短线分隔不稳定 | 径向短线 mask 需要根据圆角缩进，圆角越大越容易缩短 | 淘汰径向短线 mask；改用几何 padding |
| 较大的圆角设置不生效，短扇区圆角消失 | 旧 path 有额外半径限制，并在短弧下退化 | 改用 d3-shape `arc().cornerRadius()`，只遵守真实几何上限 |
| hover 扇区外扩后被裁切 | 旧 mask 或 SVG 范围没有覆盖外扩 path | 统一按外扩范围生成 path 与视口；不再让 gap mask 参与裁切 |
| `separatorWidth={0}` 时仍出现约 1px 发丝缝 | SVG 相邻 path 分别做抗锯齿，共边处可能透出背景 | 仅在多扇区且零间隔时，为 base layer 与 fill layer 增加 `0.5px` 同色 seam cover，并叠加只画描边的 `blur(0.5px)` seam |

---

## 6. 使用示例

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
  colors={[undefined, "var(--secondary-blue)", "linear-gradient(135deg, #111 0%, #7DBBFF 100%)"]}
  data={[
    { name: "Done", value: 62, color: "var(--secondary-mint)" },
    { name: "Doing", value: 24 },
    { name: "Remain", value: 14 }
  ]}
/>
```

```svelte
<script lang="ts">
  let chart: any;
</script>

<Button onclick={() => chart?.replay?.()}>重新填充</Button>
<Button onclick={() => chart?.reverseAppearance?.()}>反向回退</Button>
<GaugeChart bind:this={chart} startDirection="right" />
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
  <Text as="segment-value" class="text-24 font-bold text-black-100" />
  <Text as="segment-name" class="text-18 text-black-40" />
</GaugeChart>
```

---

## 7. 更新日志 (Changelog)

### v1.3.0 (2026-06-04)

- 新增 Chart 通用 `colorMode`：`sequence`、`monochromeFade`、`monochrome`。
- 新增 `color` 主色以及 `monochromeColor` / `mutedMonochromeColor` 细分入口；三种颜色模式均支持 `data[i].color` 与 `colors[i]` 指定扇区自定义颜色。

### v1.2.0 (2026-05-31)

- 间隔改为 path 几何阶段的 `padAngle + padRadius`，淘汰后置 gap mask 与径向短线 mask。
- fill layer 改为完整 padded path 加局部 `revealPath` mask，修复动效填充与占位扇区不重合。
- 圆角统一使用 d3-shape，修复大圆角无效、短弧圆角消失与 hover 裁切问题。
- 补充 ECharts 官网示例、本地源码参考以及本轮问题与解决方法。
- 零间隔多扇区增加 `0.5px` 同色 seam cover 与只画描边的 `blur(0.5px)` seam，修复 SVG 抗锯齿产生的发丝缝。

### v1.1.0 (2026-05-28)

- 默认颜色序列同步 CircularChart。
- 支持 `colors` 调色板、每扇区颜色、CSS 变量、`linear-gradient(...)` 字符串与渐变对象。
- 圆角和透明间隔统一按 320px 基准等比缩放。
- 新增 4% 同色占位层、真实填充层、透明命中层与透明间隔。
- 新增出现动效、受控进度、滚动时间轴、重新填充与反向回退方法。
- 抽离图表颜色、渐变、几何、圆环 path 与出现时间轴纯逻辑到 `pro/src/lib/chart/`。

### v1.0.0 (2026-05-22)

- 初始实现 PRO 仪表图组件。
- 支持整体宽高、环厚、圆角、隔断、hover 外侧增厚可调。
- 支持中心 hover 标签、最多 10 项、SnowUI `primary + secondary-*` 颜色序列。
- 接入 Frame 根层、Skeleton、Test 示例与规范登记。
