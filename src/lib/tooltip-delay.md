# tooltip-delay.ts

> **版本**: v1.0.1
> **职责**: 协调页面内所有 Tooltip 的 hover warmup / cooldown 时序。
> **依赖方**: [`../components/Tooltip.svelte`](../components/Tooltip.svelte)

## 行为

| 场景 | 行为 |
| :--- | :--- |
| 首次 hover Tooltip | 延迟 `450ms` 显示 |
| 任一 Tooltip 成功显示后，在 cooldown 窗口内 hover 其他 Tooltip | 立即显示 |
| 离开 Tooltip 触发器超过 cooldown 窗口 | 恢复首次 hover 的 `450ms` 延迟 |
| 首次 hover 未满 `450ms` 就移开 | 不进入立即显示模式 |

cooldown 窗口为 `300ms`。该规则参考 Radix Tooltip 的 `delayDuration` / `skipDelayDuration` 语义。
PRO 共享 Portal 的相邻切换保留窗口必须与该 `300ms` 值一致；窗口内进入另一 Tooltip 时，不卸载外框，也不重新执行出现动效。

## 公开 API

| API | 说明 |
| :--- | :--- |
| `TOOLTIP_HOVER_SHOW_DELAY_MS` | 首次 hover 显示延迟，来自 `OVERLAY_TRIGGER_HOVER_DELAY_MS`；Popover hover 延迟复用该值 |
| `TOOLTIP_SKIP_DELAY_DURATION_MS` | cooldown 窗口，固定为 `300` |
| `getTooltipHoverShowDelay()` | 返回当前应使用的显示延迟 |
| `markTooltipShown()` | Tooltip 成功显示后进入 warm 状态 |
| `scheduleTooltipWarmupReset()` | 离开触发器后开始 cooldown 计时 |
| `resetTooltipDelayState()` | 立即清理共享状态，供测试或宿主重置使用 |

## 约束

- 仅非受控模式参与共享延迟协调。
- `open` 受控模式由外部状态决定显隐，不读写 warmup / cooldown 状态。
- Popover 复用 `OVERLAY_TRIGGER_HOVER_DELAY_MS` / `TOOLTIP_HOVER_SHOW_DELAY_MS` 作为 hover 显示延迟，但不参与 Tooltip 的 warmup / cooldown 状态。

## 变更记录

- v1.0.1 (2026-08-12): 明确 PRO 共享 Portal 的保留窗口必须与 300ms skip-delay 一致，避免相邻触发器 gap 导致外框中断。
- v1.0.0 (2026-06-02): 建立 Tooltip warmup / cooldown 协调。
