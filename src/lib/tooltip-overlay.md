# tooltip-overlay.ts

> **版本**: v1.0.1
> **职责**: 协调页面内非受控 Tooltip 共用一个 Portal 外框。
> **依赖方**: [`../components/Tooltip.svelte`](../components/Tooltip.svelte)

## 行为

| 场景 | 行为 |
| :--- | :--- |
| 首次 hover Tooltip | 由 `tooltip-delay.ts` 决定显示延迟，显示后写入共享 overlay state |
| 从一个 Tooltip 触发器切到另一个 | 保留共享 Portal 外框，替换内容、触发器、位置与外观参数；具体移动 / 直达策略由 `Tooltip.svelte` 根据距离判定 |
| 离开触发器后未进入新 Tooltip | `80ms` 后清空共享 overlay state |
| 受控 `open` 模式 | 不使用本模块，继续由 Tooltip 本地 Portal 渲染 |

## 公开 API

| API | 说明 |
| :--- | :--- |
| `tooltipOverlay` | 当前共享 Tooltip 状态 store |
| `showTooltipOverlay(state)` | 清理隐藏计时并显示/更新共享外框 |
| `updateTooltipOverlay(state)` | 当前 active Tooltip 自身 props 变化时同步共享状态 |
| `scheduleTooltipOverlayHide(id, delayMs?)` | 离开触发器后隐藏；`delayMs=0` 时立即隐藏，PRO 增强可传入短延迟以承接相邻 Tooltip 切换 |
| `hideTooltipOverlay(id)` | 当前 active Tooltip 卸载或禁用时立即隐藏 |

## 职责边界

- 本模块只管理“同一个外框是否复用”和 active Tooltip 的渲染参数。
- 首次延迟、快速切换窗口与冷却恢复仍由 [`tooltip-delay.ts`](./tooltip-delay.md) 管理。
- 视觉样式与 Frame 动效仍在 [`Tooltip.svelte`](../components/Tooltip.svelte) 内消费。
