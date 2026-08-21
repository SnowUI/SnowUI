# motion/tokens.ts 文档

> **版本**: v1.16.0
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
| `MOTION_DURATION_BUTTON_HOVER_MS` / `MOTION_DURATION_BUTTON_HOVER_COLOR_MS` | Button 背景像素外扩与颜色 opacity 渐现 / 渐隐统一为 150ms，使用同一时间线 |
| `MOTION_DURATION_*` / `MOTION_STAGGER_*` | 通用效果优先引用 250ms 基准；Badge、Tooltip、shake 等专项效果保留精确时长与 stagger |
| `MOTION_DISTANCE_TOOLTIP_APPEAR_PX` | Tooltip Foreground 根据最终 placement 从触发器方向反向滑入的距离 |
| `MOTION_EASING_*` | standard、JS motion 的 in-out / linear、Button hover 几何与颜色层 CSS `ease-in-out`，以及 Badge / Number / Check 各自精确 bounce 曲线 |
| `MOTION_SPRING_MOVE_*` | Frame 默认位移临界阻尼 spring：stiffness 300 / damping 34.6410161514 / mass 1；不会越过目标产生回弹 |
| `MOTION_DISTANCE_*` | Button hover 背景总宽 / 总高增加 2px，以及 text swap、page slide、panel reveal、Badge、Success check 等精确位移 |
| `MOTION_BLUR_*` | 2px、3px、10px 三档实际 blur 来源 |
| `MOTION_DURATION_TOOLTIP_*` | Tooltip Foreground 出现 / 消失，以及所有连续交接共用的 base / min / max / per-pixel 有界时程 |
| `MOTION_PROGRESS_TOOLTIP_CONTINUOUS_CONTENT_LAG` | Tooltip 所有连续交接共用的内容相位滞后；内容与外框在同一结束帧收敛 |
| `MOTION_DELAY_TOOLTIP_APPEAR_MS` | 兼容保留的旧 Tooltip 出现 delay；已标记 deprecated，默认 preset 不再消费 |
| `MOTION_SCALE_DROPDOWN_*` | Popover、Listbox、Menu dropdown |
| `MOTION_SCALE_TOOLTIP_*` | Tooltip Foreground 出现 / 消失 scale |
| `MOTION_SCALE_DIALOG_*` | Dialog / Modal 内容面板 |
| `MOTION_SCALE_GENERIC_*` | 显式 scale-in 原语、replacement 等需要缩放的 preset；generic appear 本身不再默认消费 |
| `MOTION_SCALE_ICON_SWAP_FROM` / `MOTION_SCALE_HOVER_*` | Icon 替换与 hover 放大 |

## 变更记录

- v1.16.0 (2026-08-21): 删除 Tooltip 快速重定向专属的 duration、per-pixel、content lag 和宽度时长兼容别名；所有连续改目标统一消费普通连续交接 token。
- v1.15.0 (2026-08-21): Tooltip Foreground 出现缩放起点由 `0.98` 调整为 `0.94`，出现时长收敛为 `110ms`，新增 `2px` placement 定向滑入距离。
- v1.14.0 (2026-08-21): Tooltip 连续交接调整为最初版本约 `0.75` 倍速度：稳定段使用 `160 / 180 / 360ms / 0.6ms/px`，retarget 使用 `60 / 90 / 160ms / 0.35ms/px`；内容相位关系不变。
- v1.13.0 (2026-08-21): Tooltip 稳定切换改为 `120 / 140 / 280ms / 0.45ms/px` 与 `0.08` 内容滞后；retarget 改为 `45 / 70 / 120ms / 0.25ms/px` 与 `0.02` 内容滞后。
- v1.12.0 (2026-08-21): 新增 Tooltip 连续交接快速重定向的 `60 / 90 / 160ms / 0.35ms/px` 时程与 `0.04` 内容相位滞后 token。
- v1.11.0 (2026-08-21): Tooltip 连续交接从外框 / 内容独立速度 token 改为 base、min、max、per-pixel 有界时程与内容相位滞后 token。
- v1.10.0 (2026-08-19): Button hover 颜色时长与背景像素外扩统一为 `150ms ease-in-out`，进入与退出时同时开始、同时结束。
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
