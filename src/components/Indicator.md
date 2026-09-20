# Indicator

> **版本**: v1.3.0
> **职责**: 提供可拖动的尺寸调整手柄，支持鼠标与键盘操作，可用于面板和内容区域的大小调整。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

提供可拖动的尺寸调整手柄，支持鼠标与键盘操作，可用于面板和内容区域的大小调整。

## 使用选择

<!-- usage-guide:start -->
用于组件公开的指示或拖动调节能力。业务页面先使用已经内置该能力的 Sidebar、SidePanel 或表格列，不复制它们的拖动逻辑。

- target 默认是直接父元素，也可显式关联其他元素；minSize / maxSize 限制尺寸范围。
- applySize 控制是否直接应用尺寸，onSizeChange 提供更新值；键盘步长使用 step / largeStep。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Frame, Indicator, Text } from '@snowui-design-system/components';
	let width = $state(280);
</script>

<Frame style="position: relative; box-sizing: border-box; width: 280px; max-width: 100%; min-height: 120px; padding: var(--padding-6); border-radius: var(--radius-4); background: var(--background-1);"><Text>SnowUI documentation preview</Text><Indicator axis="width" minWidth={200} maxWidth={520} onSizeChange={(next) => width = next} ariaLabel="Resize documentation preview" /></Frame>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| axis | `IndicatorAxis` | line 为 `"width"`；corner 为 `"height"` | 调整宿主宽度、高度或同时调整；`both` 只用于 corner |
| edge | `IndicatorEdge` | `根据 axis 推导` | 拖动方向与默认定位边缘 |
| appearance | `IndicatorAppearance` | `"line"` | 线形或右下角图标视觉 |
| hitAreaPadding | `number \| string` | — | line 沿边命中范围两端相对视觉条增加的 padding；未传时继续铺满整条边 |
| target | `HTMLElement` | `直接父元素` | resize target；可显式关联页面中的任意元素，不要求 Indicator 是其 DOM 后代 |
| revealTarget | `HTMLElement` | `target` | 控制显隐的 hover 宿主 |
| value | `number` | `实测 target 尺寸` | 当前受控尺寸基线，并同步为 ARIA 当前值 |
| minSize | `number` | `0` | 当前调整轴允许的最小尺寸，单位 px。 |
| maxSize | `number` | `Infinity` | 当前调整轴允许的最大尺寸，单位 px。 |
| minWidth | `number` | — | width / both 的宽度下限，优先于 minSize。 |
| maxWidth | `number` | — | width / both 的宽度上限，优先于 maxSize。 |
| minHeight | `number` | — | height / both 的高度下限，优先于 minSize。 |
| maxHeight | `number` | — | height / both 的高度上限，优先于 maxSize。 |
| step | `number` | `8` | 方向键每次调整的像素数。 |
| largeStep | `number` | `32` | 按住 Shift 时方向键每次调整的像素数。 |
| applySize | `boolean` | `true` | 是否直接写入 target 的 width / height |
| disabled | `boolean` | `false` | 禁止 Pointer 和键盘调整 |
| ariaLabel | `string` | `"调整宽度" / "调整高度"` | 无障碍名称 |
| onResizeStart | `(value: number, axis: "width" \| "height") => void` | — | 开始调整回调 |
| onSizeChange | `(value: number, axis: "width" \| "height") => void` | — | 尺寸变化回调 |
| onResizeEnd | `(value: number, axis: "width" \| "height") => void` | — | 结束调整回调 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="api-参考"></a>

### API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `pinOffset` | `number \| string` | `var(--padding-1)` | line 可见短条外缘到宿主物理边缘的距离；hover / focus / dragging 加粗向内生长，间距不变。corner 保持 Pin 角点偏移语义。 |
| `enableResponsive` | `boolean` | `false` | 启用根 Frame 响应式能力；默认关闭以保持手柄几何。 |
| `enableContext` | `boolean` | `false` | 是否向子内容提供 Frame 通用上下文。 |
| `enableScaleObserver` | `boolean` | `false` | 是否启用根 Frame 尺寸观察；默认不新增观察。 |
| `enableDefaultMotion` | `boolean` | `true` | 启用 Frame 默认交互动效；手柄颜色仍复用共享颜色动效。 |
| `...rest` | `FrameProps` | - | 透传到根 Frame |

<a id="视觉状态"></a>

### 视觉状态

- 颜色与 overlay 滚动条 thumb 一致：默认 `Black/10`，hover / focus / dragging 为 `Black/20`。
- line + width：命中带 = 父级全高 × (pinOffset + 8px)（`top/bottom:0`）；视觉默认 2px × **16px**，hover / focus / dragging 时视觉宽变为 4px；沿边长度可用 `--snowui-indicator-visual-length` 覆盖。
- line + height：命中带 = 父级全宽 × (pinOffset + 8px)（`left/right:0`）；视觉默认 **16px** × 2px，hover / focus / dragging 时视觉高变为 4px；沿边长度同上变量。
- line 与 Scrollbar 一致通过实际 width / height 变化而非 transform 缩放，使用 `var(--radius-full, 9999px)`，端点始终为完整胶囊圆角。
- corner：使用 1rem 视觉盒，通过 ComponentIcon 复用 rounded-corner；图形与外框比例以 raw-assets/icons/snowui/RoundedCorner.svg 为准。显示时为 Black/10，自身 hover / focus-visible / dragging 时为 Black/20；各状态保持原图比例，不额外加粗或缩放。
- corner 固定在右下角；默认 `axis="height"`，使用 `ns-resize` 上下双箭头并只调整高度。
- corner 显式 `axis="both"` 时使用 `nwse-resize` 对角双箭头，同时调整宽度和高度。
- 定位：line 自管 absolute 贴边（不用 pin 居中）；corner 默认 `as="pin-bottom-right"` + `pinOffset="var(--padding-1)"` + `z-index: 4`。
- 默认隐藏；宿主 hover、focus-visible 或 dragging 时显示；与同一 target 内 overlay scrollbar Thumb 重叠时保持显示及 Pointer、键盘命中。
- 视觉与命中区分层；line 命中带铺满所在边缘全高/全宽。
- 动效消费与 overlay scrollbar 相同的 Frame color motion bridge。

<a id="示例"></a>

### 示例

```svelte
<Frame style="position: relative; width: 16rem; height: 10rem;">
    内容
    <Indicator axis="width" />
</Frame>
```

```svelte
<script lang="ts">
  import { Frame, Indicator } from '@snowui-design-system/components';
  let panel = $state<HTMLElement>();
</script>

<Frame bind:element={panel} style="position: relative;">
    内容
    <Indicator
        target={panel}
        axis="height"
        appearance="corner"
        minSize={60}
    />
</Frame>
```

---




## AI Zone

> **更新**: 2026-09-15

> **布局模型**: Pin 布局
> **文档**: ./Indicator.md

Indicator 将原 WidthIndicator、HeightIndicator 与 ResizeHandle 合并为一个可交互组件。它默认调整直接父元素，也可以通过 `target` 显式关联任意祖先宿主。鼠标位于 reveal host 的任意普通后代上时，Indicator 都会显示；只有进入 Indicator **命中带**时才会加深、变粗并开始拖动。

**命中带（line）**：视觉条与命中区分层。默认情况下 line **不使用 pin 居中**，根节点从**物理边缘 0** 起铺满全高/全宽，命中厚度 = `pinOffset + 8px`（含边框线，可从最外缘拖动）；视觉短条外缘距宿主边缘 `pinOffset`（默认 `var(--padding-1)`，基准 4px），默认 2×16 / 16×2。消费方可传 `hitAreaPadding`，将沿边命中范围收窄为“视觉长度 + 两端 padding”；例如 Sidebar 传 4px 后，16px 视觉条只有上下各 4px、合计 24px 的纵向激活范围。corner 仍用 `pin-bottom-right` + 局部命中。

Indicator 与同一 resize target 内的 overlay scrollbar 重叠时，Resize 命中区优先：手柄继续显示并接收 Pointer 与键盘操作，滚动条在未被手柄覆盖的区域继续响应拖动。组合宿主须保证手柄所在层高于滚动条，不以隐藏手柄或移除焦点来避让。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

- 根层使用 OSS Frame，拖动算法复用 `lib/resizable.ts`。
- Indicator 将 handle 元素直接交给 resizable；pointerdown / keyboard 从手柄本身起始，并使用 pointer capture + window capture 持续跟踪 move / up / cancel。禁止父组件复制 pointer / keyboard 算法。
- resizable action 的创建 effect 只跟踪 target / handle / axis；`value`、边界和 callback 使用独立 effect 调用 `action.update()`。创建时必须使用 `untrack()` 读取 options，禁止尺寸写回触发 action destroy，导致拖拽在第一次 pointermove 后中断。
- width 对应 resizable horizontal axis 与 ARIA vertical orientation；height 对应相反组合。
- corner 遵守 [内置 Icon 规范](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)，使用随包图形回退和可选 IconProvider；不在组件中复制或重画 path。
- 不接入 Skeleton：手柄没有加载占位意义。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.3.0 (2026-09-15)

- 按用户要求改为 Resize 优先，移除滚动条重叠检测及其观察器；以下旧版本的滚动条优先规则已被取代。

### v1.2.1 (2026-08-16)

- 将默认 Black/10 与交互态 Black/20 的颜色归属收敛到实际 visual 层，避免 Frame 根层 `color: inherit` 因样式加载顺序覆盖手柄颜色。
- 保持 `--snowui-indicator-color-override` 与 `--snowui-indicator-active-color-override` 的既有覆盖能力。

### v1.2.0 (2026-07-28)

- 保持 reveal host 任意区域 hover 即显示 Indicator。
- 重叠检测由整条 scrollbar 轨道改为实际 Thumb，并响应 ScrollArea hover、滚动、Thumb 拖动与 opacity transition。
- Indicator 与可见 Thumb 重叠时完全退出 Pointer、hover、拖拽和键盘命中，确保滚动条获得唯一交互优先级。

### v1.1.0 (2026-07-28)

- line 新增 `hitAreaPadding`，允许消费方把全边命中带收窄为视觉条附近的局部范围。
- Indicator 与同一 resize target 内的可见 SnowUI overlay scrollbar 重叠时自动隐藏并停止截获指针。

### v1.0.1 (2026-07-12)

- line 命中带默认铺满所在边缘全高（width）/ 全宽（height）：改为 absolute + top/bottom 或 left/right 贴边，不再用 pin 居中；视觉短条与命中带分层。

### v1.0.0 (2026-06-21)

- 合并 WidthIndicator、HeightIndicator 与 ResizeHandle。
- 新增宿主 hover 显隐、line / corner 视觉、Pointer / 键盘 / ARIA 完整协议。

### 2026-09-15 边缘间距修正

line 的默认 pinOffset 从 0 修正为 padding-1，并从短条中心定位改为外缘定位；显式 pinOffset 也按外缘计算。普通、hover、focus 和拖动均保持基准 4px 可见间距；命中带仍从物理边缘 0 开始。显式偏移的 line 消费方会比旧中心定位向内移动半个条宽；corner 不变。
