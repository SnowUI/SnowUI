# Indicator（尺寸指示手柄）

> **版本**: v1.2.0
> **更新**: 2026-07-28
> **职责**: 提供宿主 hover 显示、Pointer / 键盘拖动与统一视觉反馈的通用尺寸手柄
> **布局模型**: Pin 布局
> **文档**: ./Indicator.md

Indicator 将原 WidthIndicator、HeightIndicator 与 ResizeHandle 合并为一个可交互组件。它默认调整直接父元素，也可以通过 `target` 显式关联任意祖先宿主。鼠标位于 reveal host 的任意普通后代上时，Indicator 都会显示；只有进入 Indicator **命中带**时才会加深、变粗并开始拖动。

**命中带（line）**：视觉条与命中区分层。默认情况下 line **不使用 pin 居中**，根节点从**物理边缘 0** 起铺满全高/全宽，命中厚度 = `pinOffset + 8px`（含边框线，可从最外缘拖动）；视觉短条中心落在 `pinOffset`（SidePanel 为 4px），默认 2×16 / 16×2。消费方可传 `hitAreaPadding`，将沿边命中范围收窄为“视觉长度 + 两端 padding”；例如 Sidebar 传 4px 后，16px 视觉条只有上下各 4px、合计 24px 的纵向激活范围。corner 仍用 `pin-bottom-right` + 局部命中。

Indicator 会在准备显示时检查同一 resize target 内可见的 SnowUI overlay scrollbar。宿主 hover 仍是 Indicator 的默认显示条件；若 Indicator 命中区与实际 scrollbar Thumb 发生矩形重叠，则滚动条优先，Indicator 整体隐藏并关闭 Pointer、hover、拖拽与键盘命中。检测只在宿主 hover、Indicator focus 或 dragging 期间启用，并响应 ScrollArea pointer enter / leave、viewport scroll、Thumb 拖动 / 位移和 scrollbar opacity transition；结束后清理全部监听与观察器。

## API 参考

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `axis` | `"width" \| "height" \| "both"` | line 为 `"width"`；corner 为 `"height"` | 调整宿主宽度、高度或同时调整；`both` 只用于 corner |
| `edge` | `"start" \| "end" \| "top" \| "bottom"` | 根据 axis 推导 | 拖动方向与默认定位边缘 |
| `appearance` | `"line" \| "corner"` | `"line"` | 线形或右下角图标视觉 |
| `hitAreaPadding` | `number \| string` | — | line 沿边命中范围两端相对视觉条增加的 padding；未传时继续铺满整条边 |
| `target` | `HTMLElement` | 直接父元素 | resize target；可显式关联页面中的任意元素，不要求 Indicator 是其 DOM 后代 |
| `revealTarget` | `HTMLElement` | target | 控制显隐的 hover 宿主 |
| `value` | `number` | 实测 target 尺寸 | 当前受控尺寸基线，并同步为 ARIA 当前值 |
| `minSize` / `maxSize` | `number` | `0 / Infinity` | 尺寸边界 |
| `minWidth` / `maxWidth` | `number` | - | width / both 模式的独立宽度边界，优先于 minSize / maxSize |
| `minHeight` / `maxHeight` | `number` | - | height / both 模式的独立高度边界，优先于 minSize / maxSize |
| `step` / `largeStep` | `number` | `8 / 32` | 键盘普通步长与 Shift 步长 |
| `applySize` | `boolean` | `true` | 是否直接写入 target 的 width / height |
| `disabled` | `boolean` | `false` | 禁止 Pointer 和键盘调整 |
| `ariaLabel` | `string` | `"调整宽度" / "调整高度"` | 无障碍名称 |
| `onResizeStart` | `(size: number) => void` | - | 开始调整回调 |
| `onSizeChange` | `(size: number) => void` | - | 尺寸变化回调 |
| `onResizeEnd` | `(size: number) => void` | - | 结束调整回调 |
| `...rest` | `FrameProps` | - | 透传到根 Frame |

## 视觉状态

- 颜色与 overlay 滚动条 thumb 一致：默认 `Black/10`，hover / focus / dragging 为 `Black/20`。
- line + width：命中带 = 父级全高 × 8px（`top/bottom:0`）；视觉默认 2px × **16px**，hover / focus / dragging 时视觉宽变为 4px；沿边长度可用 `--snowui-indicator-visual-length` 覆盖。
- line + height：命中带 = 父级全宽 × 8px（`left/right:0`）；视觉默认 **16px** × 2px，hover / focus / dragging 时视觉高变为 4px；沿边长度同上变量。
- line 与 Scrollbar 一致通过实际 width / height 变化而非 transform 缩放，使用 `var(--radius-full, 9999px)`，端点始终为完整胶囊圆角。
- corner：固定 16px 视觉盒；图形作为 Indicator 私有内置 SVG，使用单条 round cap / round join stroke，避免小尺寸实心复合路径的内外沿子像素不一致，不依赖资源包 RoundedCorner。宿主 hover 时为 1px、Black/20%，自身 hover / focus-visible / dragging 时为 2px、Black/40%。
- corner 固定在右下角；默认 `axis="height"`，使用 `ns-resize` 上下双箭头并只调整高度。
- corner 显式 `axis="both"` 时使用 `nwse-resize` 对角双箭头，同时调整宽度和高度。
- 定位：line 自管 absolute 贴边（不用 pin 居中）；corner 默认 `as="pin-bottom-right"` + `pinOffset="var(--padding-1)"` + `z-index: 4`。
- 默认隐藏；宿主 hover、focus-visible 或 dragging 时显示；与同一 target 内可见 overlay scrollbar Thumb 重叠时继续隐藏，并禁用 Pointer、hover、拖拽与键盘命中。
- 视觉与命中区分层；line 命中带铺满所在边缘全高/全宽。
- 动效消费与 overlay scrollbar 相同的 Frame color motion bridge。

## 示例

```svelte
<Frame style="position: relative; width: 16rem; height: 10rem;">
    内容
    <Indicator axis="width" />
</Frame>
```

```svelte
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

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

- 根层使用 OSS Frame，拖动算法复用 `lib/resizable.ts`。
- Indicator 将 handle 元素直接交给 resizable；pointerdown / keyboard 从手柄本身起始，并使用 pointer capture + window capture 持续跟踪 move / up / cancel。禁止父组件复制 pointer / keyboard 算法。
- resizable action 的创建 effect 只跟踪 target / handle / axis；`value`、边界和 callback 使用独立 effect 调用 `action.update()`。创建时必须使用 `untrack()` 读取 options，禁止尺寸写回触发 action destroy，导致拖拽在第一次 pointermove 后中断。
- width 对应 resizable horizontal axis 与 ARIA vertical orientation；height 对应相反组合。
- corner 使用 resource-svelte RoundedCorner；hover 通过 path stroke 扩粗，不缩放图标。
- 不接入 Skeleton：手柄没有加载占位意义。

## 更新日志 (Changelog)

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
