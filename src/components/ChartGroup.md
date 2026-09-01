# ChartGroup 图表组合容器

> **版本**: v0.2.1
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
| `width` | `number \| string` | `800` | 组合画布整体宽度 |
| `height` | `number \| string` | `400` | 组合画布整体高度 |
| `xLabels` | `string[]` | `[]` | 分类单元格标签；用于生成共享 cell hit layer、aria-label，并可下发给子图表作为横坐标 label |
| `yMin` | `number` | - | 共享 Y 轴 domain 最小值 |
| `yMax` | `number` | - | 共享 Y 轴 domain 最大值 |
| `yTicks` | `number[]` | - | 共享显式 Y 轴刻度 |
| `yTickCount` | `number` | `6` | 共享自动 Y 轴刻度目标数量 |
| `yTickFormatter` | `(value: number) => string` | - | 共享 Y 轴 label 格式化 |
| `showXAxis` | `boolean` | `true` | 下发给子图表的横轴显示开关 |
| `showYAxis` | `boolean` | `false` | 下发给子图表的纵轴显示开关 |
| `showGrid` | `boolean` | `false` | 下发给子图表的网格线显示开关 |
| `showGuides` | `boolean` | `false` | 下发给子图表的辅助线显示开关 |
| `xAxisMode` | `"edge" \| "cell"` | `"edge"` | 下发给 LineChart 的横坐标点位模型 |
| `xLabelAutoCull` | `boolean` | `true` | 共享 X 轴 label 自动抽稀开关 |
| `xMaxLabelCount` | `number` | - | 共享 X 轴最多显示 label 数量 |
| `yLabelAutoCull` | `boolean` | `true` | 共享 Y 轴 label 自动抽稀开关 |
| `yMaxLabelCount` | `number` | - | 共享 Y 轴最多显示 label 数量 |
| `plotBounds` | `{ top?: number; right?: number; bottom?: number; left?: number }` | `{ right: 0, bottom: 24, left: 0 }` + 动态 top | 共享 cell hit layer 覆盖的绘图区边界；`top` 只能增加子图计算出的安全区 |
| `hoverMode` | `"item" \| "cell"` | `"cell"` | 共享 hover 模式；`cell` 由容器命中层触发，`item` 不绘制共享 cell 命中层 |
| `activeCellIndex` | `number \| null` | - | 受控当前 hover cell index |
| `defaultActiveCellIndex` | `number \| null` | `null` | 非受控初始 hover cell index |
| `onCellHoverChange` | `(index: number \| null) => void` | - | hover cell 变化回调 |
| `showHitLayer` | `boolean` | `true` | 是否渲染顶层 cell 命中层 |
| `showHoverPanel` | `boolean` | `false` | 是否开启共享 Chart hover 面板；默认关闭时子图表使用自身 hover label |
| `hoverPanelVariant` | `"dark" \| "light" \| "surface"` | `"light"` | hover 面板视觉样式 |
| `hoverPanelPlacement` | `ChartHoverPanelPlacement` | `"anchor-side"` | hover 面板定位；默认位于 plot area 左侧中线，左侧碰撞时改右侧 |
| `showHoverPanelLabel` | `boolean` | `false` | 是否在 hover 面板顶部显示当前分类 label |
| `children` | `Snippet` | - | 子图表内容 |
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
- `hoverMode="cell"` 时，每个 cell hit rect 使用 `role="button"`、`tabindex="0"` 和分类 label 作为 `aria-label`。
- 支持 `loading`、`skeleton`、`renderHints`。
- 显式传入 `enableResponsive` / `enableContext` / `enableScaleObserver` / `enableDefaultMotion`。
- `class`、`style` 与未声明属性透传到根层 Frame。

---

## 6. 示例

```svelte
<ChartGroup width={800} height={400} xLabels={labels}>
  <BarChart class="absolute top-0 left-0 z-0" data={bars} />
  <LineChart
    class="absolute top-0 left-0 z-10"
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

## 更新日志 (Changelog)

### v0.2.1 (2026-09-02)

- 共享顶部安全区不再因 hover 数值增高；子图表的数值 label 保持图形上方 `4px`，必要时可溢出统一绘图区顶边。

### v0.1.2 (2026-08-31)

- 顶部改为内容感知安全区，并收集所有 BarChart / LineChart 子图需求取最大值；共享命中层与叠加图层保持同一绘图区顶边。

### v0.1.1 (2026-08-31)

- 移除默认绘图区的额外上下留白；默认边界改为 `top: 0`、`bottom: 24`。

### v0.1.0 (2026-06-09)

- 新增 `ChartGroup`，支持共享分类 cell hover、叠加画布和 context 下发。
