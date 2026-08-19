# motion/tokens.ts 文档

> **版本**: v1.9.0
> **职责**: 保存 SnowUI 已转正动效 preset 共用的基础数值 token。

`tokens.ts` 是 motion 数值的最低层单一来源。组件不直接复制这些值；组件应优先引用 `motion/presets/` 中的语义 preset。

## 使用规则

1. 基础 duration、easing、scale 起止值先进入 `tokens.ts`。
2. 组件族 preset 再从 `tokens.ts` 组合出 MotionConfig 或组件背景层 CSS motion descriptor。
3. 组件 `.svelte` 引用 preset，不复制 token 数值。
4. 新数值只有被组件族复用或需要长期维护时才进入本文件。

## 现有 token 族

| token 族 | 使用场景 |
| :--- | :--- |
| `MOTION_DURATION_BASE_MS` | Frame 常规状态动效与组件通用 preset 的统一基础时长，当前为 250ms |
| `MOTION_DURATION_MOVE_MS` | Frame 默认 move spring 的轨迹窗口，当前为 500ms |
| `MOTION_DURATION_STANDARD_*` | dropdown overlay、generic fallback、dialog 等标准进入 / 退出节奏 |
| `MOTION_DURATION_RESIZE_MS` | Card、Accordion、Panel 等明确尺寸变化节奏 |
| `MOTION_DURATION_TAB_INDICATOR_MS` | Tab / Segmented indicator 位置与尺寸同步变化 |
| `MOTION_DURATION_CONTINUOUS_HOVER_MS` / `MOTION_DURATION_CONTINUOUS_HOVER_RESPONSE_MS` | 连续悬停背景移动 / 变形 60ms，首次显隐响应 0ms |
| `MOTION_DURATION_BUTTON_HOVER_MS` / `MOTION_DURATION_BUTTON_HOVER_COLOR_MS` | Button 背景像素外扩 150ms；颜色 opacity 渐现 / 渐隐 300ms，慢于几何变化 |
| `MOTION_DURATION_*` / `MOTION_STAGGER_*` | 通用效果优先引用 250ms 基准；Badge、Tooltip、shake 等专项效果保留精确时长与 stagger |
| `MOTION_EASING_*` | standard、JS motion 的 in-out / linear、Button hover 几何与颜色层 CSS `ease-in-out`，以及 Badge / Number / Check 各自精确 bounce 曲线 |
| `MOTION_SPRING_MOVE_*` | Frame 默认位移临界阻尼 spring：stiffness 300 / damping 34.6410161514 / mass 1；不会越过目标产生回弹 |
| `MOTION_DISTANCE_*` | Button hover 背景总宽 / 总高增加 2px，以及 text swap、page slide、panel reveal、Badge、Success check 等精确位移 |
| `MOTION_BLUR_*` | 2px、3px、10px 三档实际 blur 来源 |
| `MOTION_DURATION_TOOLTIP_*` | Tooltip Foreground 出现 / 消失节奏 |
| `MOTION_DELAY_TOOLTIP_APPEAR_MS` | 兼容保留的旧 Tooltip 出现 delay；已标记 deprecated，默认 preset 不再消费 |
| `MOTION_SCALE_DROPDOWN_*` | Popover、Listbox、Menu dropdown |
| `MOTION_SCALE_TOOLTIP_*` | Tooltip Foreground 出现 / 消失 scale |
| `MOTION_SCALE_DIALOG_*` | Dialog / Modal 内容面板 |
| `MOTION_SCALE_GENERIC_*` | 显式 scale-in 原语、replacement 等需要缩放的 preset；generic appear 本身不再默认消费 |
| `MOTION_SCALE_ICON_SWAP_FROM` / `MOTION_SCALE_HOVER_*` | Icon 替换与 hover 放大 |

## 变更记录

- v1.9.0 (2026-08-19): Button 背景像素外扩由 `200ms ease` 收敛为 `150ms ease-in-out`，减少 filled 高对比边缘停留在亚像素重绘状态的时间，并缓和 hover 进入 / 退出首段的视觉抖动；颜色仍为 `300ms ease-in-out`。
- v1.7.3 (2026-08-12): 分层后 Tooltip Foreground 恢复 appear duration / scale token；Portal / Backdrop 不消费这些 token。
- v1.7.2 (2026-08-12): Tooltip 出现 preset 清空视觉通道；旧 appear duration / scale token 为兼容直接引用者保留并标记 deprecated。
- v1.7.1 (2026-08-12): Tooltip 出现 preset 不再消费内部 delay；原 token 为兼容直接引用者暂时保留并标记 deprecated。
- v1.7.0 (2026-07-30): 新增连续悬停背景专项移动与响应时长 token，避免沿用偏慢的 250ms 基础节奏。
- v1.6.0 (2026-07-12): 默认位移 damping 从 Rare UI 基线 30 调为临界阻尼 `2 * sqrt(300 * 1) = 34.6410161514`，保留 spring 加减速并去除回弹；基线参数 300 / 30 / 1 保留于本记录供恢复。
- v1.5.0 (2026-07-12): 默认位移改为 Rare UI Sidebar 同参数 spring，新增 move duration 与 stiffness / damping / mass token。
- v1.4.0 (2026-07-12): 曾新增默认位移 cubic-bezier；v1.5.0 起由真实 spring 取代。
- v1.3.0 (2026-06-21): 新增 250ms 基础时长 token，统一 Frame 常规状态资源、尺寸变化、hover、panel 与 emphasis 节奏。
- v1.2.0 (2026-06-21): 新增 Tab indicator 专属 duration token。
- v1.1.0 (2026-06-18): 纳入 transitions.dev 精确 duration、easing、distance、blur 与 scale；不再用近似档位覆盖特殊值。
- v1.0.0 (2026-06-18): 新增 motion token 单一来源。
