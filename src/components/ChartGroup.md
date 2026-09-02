# ChartGroup 图表组合容器

> **版本**: v0.3.0
> **状态**: 已实现(PRO)
> **包归属**: `@snowui/components-pro`
> **职责**: 承载多个 Chart 原子组件，并协调共享分类单元格 hover、统一叠加画布和单坐标轴组合。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableResponsive=true`, `enableContext=true`, `enableScaleObserver=false`, `enableDefaultMotion=true`。

---

## 1. 设计原则

- **PRO Chart 组合宿主**: `ChartGroup` 负责跨多个 Chart 原子组件的坐标语义与交互状态协调，不替代 `BarChart` / `LineChart` 的绘图职责。
- **子图表保持原子**: 子图表仍独立传入自身数据、颜色、轴线与出现动效配置；`ChartGroup` 不复制 BarChart / LineChart 的几何绘制算法。
- **单元格 hover**: 当 `hoverMode="cell"` 时，容器在顶层绘制分类 cell 命中层；每个 cell 以分类中心为基准，左右各半个单元宽度，鼠标进入该区域即可触发共享 `activeCellIndex`。
- **坐标轴控制**: `ChartGroup` 可统一下发坐标轴显示、网格、辅助线、X/Y label 抽稀、Y 轴 domain / ticks / formatter 与 LineChart 的 `xAxisMode`。子图表显式传入同名 prop 时优先使用子图表自身配置。
- **响应式画布**: 根层观察最终显示尺寸；`width="100%"` / `height="100%"` 时共享命中层和 hover panel bounds 使用真实画布尺寸。
- **完整分类语义**: ChartGroup 始终把完整 `xLabels` 和完整分类 cell 下发给子图表；抽稀只由实际绘制坐标轴的子图表执行，不减少共享命中 cell 或 active index 范围。
- **共享垂直边界**: 顶部使用内容感知安全区；ChartGroup 收集 BarChart / LineChart 子图的图形、marker 与 Y 轴需求并取最大值，使所有叠加图层和共享命中层使用同一顶边。hover 数值不增加共享顶部高度，仍保持在图形上方 `4px`，必要时可溢出绘图区顶边。底部仅保留 X 轴 `8px` 间距和 `16px` 标签高度。
- **叠加画布**: 根层是 `position: relative` 的固定尺寸画布，子图表可通过 `class="absolute top-0 left-0"` 叠加。
- **单坐标轴**: 组合图表推荐只让一个子图表渲染坐标轴，其余子图表关闭坐标轴、网格和辅助线。
- **无内置业务外壳**: 不内置标题、卡片背景、legend 或 toolbar；这些由外部 Frame / Card 组合。

---

## 2. API

### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `width` | `number \| string` | `800` | 根画布宽度；数字按 px 语义转换为 CSS 长度，字符串支持百分比等 CSS 长度。共享命中区与面板以最终实测尺寸计算；子图仍须自行设置 width，叠加时通常都传 100%。 |
| `height` | `number \| string` | `400` | 根画布高度；支持数字或 CSS 长度。百分比高度要求父容器有确定高度。此值不自动配置子图高度；关闭 X 轴的叠加子图需扣除唯一 X 轴占用的 24px。 |
| `xLabels` | `string[]` | `[]` | 完整分类标签，数组顺序就是共享 activeCellIndex 的索引；同时作为子图未指定 xLabels 时的回退。抽稀不改变此数组和命中数量；空数组仍保留一个回退命中单元格。 |
| `yMin` | `number` | — | 向子图下发 Y 轴下界；未传时各子图按自身数据计算。组合图需显式统一上下界，ChartGroup 不汇总所有子图的数据 domain。子图显式值优先。 |
| `yMax` | `number` | — | 向子图下发 Y 轴上界；未传时各子图分别按自身数据计算最大值，可能产生不同标尺。比较同单位数据时显式设置共同上界；子图显式值优先。 |
| `yTicks` | `number[]` | — | 向子图下发显式数值刻度数组，用于替代自动 ticks；显示数量仍可抽稀，子图显式 yTicks 优先。 |
| `yTickCount` | `number` | `6` | 自动刻度的目标数量，非保证精确数量；实际刻度由子图 domain、nice step 和标签抽稀共同决定。显式 yTicks 优先。 |
| `yTickFormatter` | `(value: number) => string` | — | 将每个数值刻度转换为显示字符串；只改变轴文案，不改变原始数值、domain 或悬浮值。子图显式 formatter 优先，未传时使用子图默认格式。 |
| `showXAxis` | `boolean` | `true` | 下发 X 轴显示默认值，包括轴线和标签；ChartGroup 自身不绘制坐标轴。叠加组合只让一个子图开启，其他子图显式关闭。 |
| `showYAxis` | `boolean` | `false` | 下发 Y 轴标签显示默认值，并参与组级顶部安全区计算。子图显式值优先；左右轴留白由各子图自行测量，容器不自动对齐不同的 Y 轴标签宽度。 |
| `showGrid` | `boolean` | `false` | 下发网格线显示默认值，网格由子图绘制并跟随可见 Y ticks；叠加时只保留一个网格绘制者。子图显式值优先。 |
| `showGuides` | `boolean` | `false` | 下发辅助线开关；LineChart 可绘制数据点辅助线，BarChart 当前没有额外 guide 图形。子图显式配置优先。 |
| `xAxisMode` | `"edge" \| "cell"` | `"edge"` | 下发 LineChart 点位模型：edge 将首尾点放在绘图区两端，cell 放在分类格中心。BarChart 叠加折线时使用 cell；容器共享命中区域始终按分类格划分。 |
| `xLabelAutoCull` | `boolean` | `true` | 下发 X 轴标签自动抽稀开关，依据子图实测文字与可用宽度减少可见标签；不删除数据、路径、分类格或共享索引。子图显式值优先。 |
| `xMaxLabelCount` | `number` | — | 下发 X 轴可见标签数量上限，子图可因空间不足显示更少标签；不改变完整分类和可悬浮数据，子图显式值优先。 |
| `yLabelAutoCull` | `boolean` | `true` | 下发 Y 轴标签自动抽稀开关，空间不足时减少可见标签；实际布局由各子图处理，子图显式值优先。 |
| `yMaxLabelCount` | `number` | — | 下发 Y 轴可见标签数量上限；未提供 yTicks 时也参与子图自动刻度数量计算，子图显式值优先。 |
| `plotBounds` | `{ top?: number; right?: number; bottom?: number; left?: number }` | `{}` | 相对根画布的绘图区内缩，字段 top/right/bottom/left 均为 px 数字。用于共享命中与面板 bounds；top 只能增加所有子图的最大安全区。其余边不改写子图自身几何，关闭全部 X 轴时可显式设 bottom: 0。 |
| `hoverMode` | `"item" \| "cell"` | `"cell"` | cell 协调同一分类的共享 hover；item 不创建组级 cell 命中层，保留子图自身命中。此值也作为子图 hoverMode 的回退；子图显式值优先。 |
| `activeCellIndex` | `number \| null` | — | 受控分类索引，按 xLabels 从 0 开始；null 明确表示没有激活项，undefined 使用内部非受控状态。非 bindable；受控调用方需在 onCellHoverChange 中回写值。 |
| `defaultActiveCellIndex` | `number \| null` | `null` | 仅初始化内部非受控索引，后续修改不重置状态；activeCellIndex 有定义时此值不参与当前选择。null 表示初始无激活项。 |
| `onCellHoverChange` | `(index: number \| null) => void` | — | 共享索引发生变化时接收新索引或 null；由指针、分类格焦点及子图交互触发。内部交互将有限数值限制在有效分类范围内；受控模式只通知，不替调用方改值，无取消返回值。 |
| `showHitLayer` | `boolean` | `true` | 控制组级 SVG 分类命中层；仅在 hoverMode=cell 且 showHoverPanel=false 时渲染。开启共享面板后改由根层指针坐标与子图命中处理，false 不等于禁用子图交互。 |
| `adaptiveContrast` | `boolean` | `false` | 自适应黑白对比：按纯色宿主背景与同原点叠加柱体的明暗切换黑色数值和默认黑白节点、黑色折线；子图显式值优先，彩色序列与彩色节点不改色。明暗分界为 sRGB 灰度 0.5，随当前柱体形状和透明度变化；不支持背景图片或跨图坐标变换。默认关闭；由 OSS Adaptive Contrast 共享能力实现。 |
| `showHoverPanel` | `boolean` | `true` | 将子图上报的数据合并为唯一共享面板；cell 模式下根层指针位置更新当前分类。默认开启；关闭时不显示共享面板，子图按自身 showHoverPanel 配置显示独立面板；若需要数值标签，可同时关闭子图面板或显式设置 showHoverLabel；空数据没有面板。 |
| `showHoverLabel` | `boolean` | — | 统一控制子图数值标签；未传时沿用子图配置并根据共享面板推导默认显示。显式 true/false 优先于子图同名配置；true 允许数值标签与共享面板同时显示。 |
| `alwaysShowHoverLabel` | `boolean` | `false` | 为子图开启数值标签常显；与子图自身 alwaysShowHoverLabel 按逻辑或合并，因此组级 false 不关闭子图显式常显。仍受最终 showHoverLabel 控制。 |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | 唯一共享面板的外观：light 为浅色，dark 为深色，surface 为带背景模糊的表面；不修改柱体、折线或子图数值标签颜色。 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"pointer"` | 共享面板定位：anchor-side 跟随数据图形侧边，anchor-top 对齐最高数据锚点，pointer 跟随指针；pin-* 固定在绘图区对应方位。面板碰撞处理由共享 ChartHoverPanel 完成。 |
| `showHoverPanelLabel` | `boolean` | `false` | 在共享面板顶部显示当前分类名称；优先读取 xLabels 中的激活项，没有对应标签时回退到首个子图面板 label。 |
| `children` | `Snippet` | — | 显式组合子图的无参数 Snippet；不会自动生成 BarChart、LineChart、标题或图例。子图通过各自 width/height 和根定位样式共享同一画布。 |
| `loading` | `boolean` | — | 透传根 Frame 的 loading 状态，只控制组合宿主的加载呈现，不负责数据请求或子图出现时间轴。 |
| `skeleton` | `boolean` | — | 透传根 Frame 的骨架呈现开关；须配合 loading 才进入加载占位，单独设 true 不会隐藏图表。未传时沿用 Frame 的继承与默认值，骨架形状来自 renderHints。 |
| `renderHints` | `RenderHints` | — | 配置根骨架的 variant、width、height、radius；未指定字段分别回退为 rect、画布宽高和 0.75rem。不能替代真实画布 width/height。 |
| `enableResponsive` | `boolean` | `true` | 是否开启根 Frame 的响应能力；图表画布的实测尺寸监听独立存在，百分比 width/height 不依赖此开关。 |
| `enableContext` | `boolean` | `true` | 是否开启根 Frame 通用 Context 能力；不关闭 ChartGroup 为子图提供的共享分类、轴和悬浮协议。 |
| `enableScaleObserver` | `boolean` | `false` | 根 Frame scale observer 的兼容开关，默认关闭；不控制图表自身实测尺寸监听。 |
| `enableDefaultMotion` | `boolean` | `true` | 是否启用根 Frame 的默认动效；不会统一开启或关闭子图自身 appearance 动效，子图使用各自公开动效 Props 和实例方法。 |
| `class` | `string` | `""` | 附加到根 Frame 的 class，与内部根类名合并；不下发给子图表。 |
| `style` | `string` | `""` | 根 Frame 的追加 inline style，位于画布尺寸变量声明之后；用于宿主定位等公开覆盖，不下发给子图内部。 |

其余未声明属性会透传给根层 `Frame`。

### 2.2 子图表协议

`ChartGroup` 通过 context 向后代 Chart 暴露：

```ts
type ChartGroupHoverMode = "item" | "cell";

interface ChartGroupContext {
  hoverMode: () => ChartGroupHoverMode;
  activeCellIndex: () => number | null;
  setActiveCellIndex: (index: number | null) => void;
  xLabels: () => string[];
  yMin: () => number | undefined;
  yMax: () => number | undefined;
  yTicks: () => number[] | undefined;
  yTickCount: () => number;
  yTickFormatter: () => ((value: number) => string) | undefined;
  showXAxis: () => boolean;
  showYAxis: () => boolean;
  showGrid: () => boolean;
  showGuides: () => boolean;
  xAxisMode: () => "edge" | "cell";
  xLabelAutoCull: () => boolean;
  xMaxLabelCount: () => number | undefined;
  yLabelAutoCull: () => boolean;
  yMaxLabelCount: () => number | undefined;
  plotTopInset: () => number;
  registerPlotTopInset?: (source: string, resolveInset: () => number) => () => void;
  showHoverPanel?: () => boolean;
  showHoverLabel?: () => boolean | undefined;
  setHoverPanelData?: (source: string, data: ChartHoverPanelData | null) => void;
}
```

当前接入组件：

- `BarChart`: 同一 `groupIndex` 下的单柱、多段、相叠层或并排柱会一起响应 cell hover。
- `LineChart`: 同一 `pointIndex` 下的 marker 会响应 cell hover；marker 自身透明命中区仍独立保留。
- 开启 `showHoverPanel` 时，子图表只上报当前 hover 面板数据，由 `ChartGroup` 统一渲染一个共享面板；子图表默认隐藏自身 hover label，但显式 `showHoverLabel={true}` 时仍可同时显示。

---

## 3. 样式 Token 详表

| 属性 | 默认值 | Token / 变量 |
| :--- | :--- | :--- |
| 整体宽度 | 800px | `--snowui-chart-group-width` |
| 整体高度 | 400px | `--snowui-chart-group-height` |

### 3.1 Override 入口

| 变量 | 用途 |
| :--- | :--- |
| `--snowui-chart-group-width-override` | 整体宽度 |
| `--snowui-chart-group-height-override` | 整体高度 |

---

## 4. 布局模型

主布局模型:**复合管理布局**。

- 根层为 `Frame`，作为固定尺寸组合画布。
- 子图表由外部显式声明层级与定位，常见写法为 `absolute top-0 left-0`。
- 共享 cell hit layer 是容器内部绝对定位的 SVG 覆盖层，默认位于子图表上方；每个分类命中区域按分类中心左右半格计算。
- 不接入三槽位协议，不承担标题、说明、legend 或卡片排版。

详见 [LayoutProtocol.md §12.6](../../../specs/LayoutProtocol.md)。

---

## 5. 无障碍与 Frame 集成

- 根层使用 `role="group"` 和 `aria-label="组合图表"`。
- 未开启共享面板且 `hoverMode="cell"`、`showHitLayer=true` 时，每个 cell hit rect 使用 `role="button"`、`tabindex="0"` 和分类 label 作为 `aria-label`。
- 支持 `loading`、`skeleton`、`renderHints`。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

## 6. 示例

```svelte
<ChartGroup width="100%" height={400} xLabels={labels} xAxisMode="cell" yMin={0} yMax={120}>
  <BarChart style="position: absolute; inset: 0;" width="100%" height={400} data={bars} />
  <LineChart
    style="position: absolute; top: 0; left: 0; z-index: 1;"
    width="100%"
    height={376}
    showXAxis={false}
    showYAxis={false}
    showGrid={false}
    xAxisMode="cell"
    xLabels={labels}
    series={series}
  />
</ChartGroup>
```

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- **实现**: [./ChartGroup.svelte](./ChartGroup.svelte)
- **共享协议**: [../lib/chart/group-context.ts](../lib/chart/group-context.ts)
- **参考组件**:
  - `Field`: 宿主组件通过 context 协调后代组件。
  - `BarChart`: Chart 原子组件、坐标轴和出现动效 API。
  - `LineChart`: Chart 原子组件、marker hover 与出现动效 API。
  - `FramePro`: 根层 Frame 能力继承。
- **归属判断**: PRO。原因是 `ChartGroup` 协调多个 Chart 原子的 hover 与组合画布，属于跨组件协作能力。

## 自适应黑白对比接入

使用 [Adaptive Contrast](../../../components/src/lib/adaptive-contrast.md) 共享入口。组件保留前景形状、数值和交互；ChartGroup 协调同原点表面数据。应用通过本组件的 `adaptiveContrast` 开启，不穿透私有 SVG。

## 更新日志 (Changelog)

### v0.3.0 (2026-09-03)

- `adaptiveContrast` 接入 OSS 自适应黑白对比共享能力；保留开关默认值、彩色前景、命中和节点状态语义，移除图表私有试验实现。

### v0.2.3 (2026-09-02)

- HoverPanel 默认定位改为 `pointer`，随鼠标移动；区域 hover 默认保持 `cell`，显式的 placement / hoverMode 配置继续优先。

### 2026-09-02

- HoverPanel 改为默认开启，默认外观保持 light。

### v0.2.2 (2026-09-02)

- 修复多个子图注册顶部安全区时相互触发 effect 重注册，导致页面忙循环的问题；注册与清理不订阅内部版本，动态安全区仍由子图的响应式 resolver 更新。
- 补全全部具名 Property 的行为、优先级和限制，补充 showHoverLabel 与 alwaysShowHoverLabel；同步 Site 的拟真组合示例。

### v0.2.1 (2026-09-02)

- 共享顶部安全区不再因 hover 数值增高；子图表的数值 label 保持图形上方 `4px`，必要时可溢出统一绘图区顶边。

### v0.1.2 (2026-08-31)

- 顶部改为内容感知安全区，并收集所有 BarChart / LineChart 子图需求取最大值；共享命中层与叠加图层保持同一绘图区顶边。

### v0.1.1 (2026-08-31)

- 移除默认绘图区的额外上下留白；默认边界改为 `top: 0`、`bottom: 24`。

### v0.1.0 (2026-06-09)

- 新增 `ChartGroup`，支持共享分类 cell hover、叠加画布和 context 下发。
