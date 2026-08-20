# tooltip-overlay.ts

> **版本**: v1.4.0
> **职责**: 协调页面内非受控 Tooltip 共用一个 Portal 外框。
> **依赖方**: [`../components/Tooltip.svelte`](../components/Tooltip.svelte)

## 行为

| 场景 | 行为 |
| :--- | :--- |
| 首次 hover Tooltip | 由 `tooltip-delay.ts` 决定显示延迟，显示后写入共享 overlay state |
| 从一个 Tooltip 触发器切到另一个 | 立即把最新目标写入共享状态；视觉层从当前画面重定向连续裁切，不排队、不等待，也不按切换频率禁用动效 |
| 离开触发器后未进入新 Tooltip | 默认在共享 `300ms` skip-delay 窗口结束后清空 overlay state；期间进入新 Tooltip 会取消隐藏并复用外框 |
| 受控 `open` 模式 | 不使用本模块，继续由 Tooltip 本地 Portal 渲染 |

## 公开 API

| API | 说明 |
| :--- | :--- |
| `tooltipOverlay` | 当前共享 Tooltip 状态 store |
| `showTooltipOverlay(state)` | 清理隐藏计时并显示/更新共享外框 |
| `updateTooltipOverlay(state)` | 当前 active Tooltip 自身 props 变化时同步共享状态 |
| `scheduleTooltipOverlayHide(id, delayMs?)` | 仅当前 active Tooltip 可安排隐藏，并按实际 `delayMs` 执行；非 active 触发器不得清除已有计时；`delayMs=0` 时立即隐藏，默认值与 `TOOLTIP_SKIP_DELAY_DURATION_MS` 相同 |
| `hideTooltipOverlay(id)` | 当前 active Tooltip 卸载或禁用时立即隐藏 |

## 职责边界

- 本模块只管理“同一个外框是否复用”和 active Tooltip 的渲染参数。
- 首次延迟、快速切换窗口与冷却恢复仍由 [`tooltip-delay.ts`](./tooltip-delay.md) 管理。
- 视觉样式与 Frame 动效仍在 [`Tooltip.svelte`](../components/Tooltip.svelte) 内消费。
- 本模块不读取 `performance.now()` 或指针速度，不拥有视觉收敛策略；不得恢复 document `pointermove`、逐实例 pointer 监听或逐帧速度采样。

## 问题与修复记录

### 2026-08-12：Test Footer 相邻按钮间 Tooltip 偶发先消失再出现

- **问题位置**：Playground Test Sidebar Footer 的 StyleButton、ColorSchemeButton、刷新 Button；共享实现 `tooltip-overlay.ts` 与 PRO 注册入口 `pro/src/lib/tooltip-enhancement.ts`。
- **触发条件**：第一个 Tooltip 已显示后，指针从按钮移入 12px 间隙并停留超过约 130ms，再进入相邻按钮。
- **现象与证据**：快速移动能复用 Portal；在 gap 停留 150ms 时 Portal 已完全卸载，进入下一按钮 20ms 后 Foreground 从 opacity 约 `0.18` 重新出现。行为取决于移动速度。
- **根因**：PRO 外框只保留 80ms，短于已定义的 300ms skip-delay；加上 50ms退出后，约 130ms 即卸载。另有实现错误：`scheduleTooltipOverlayHide(id, delayMs)` 对任意正值都忽略实参，固定使用 80ms。
- **修改内容**：PRO `switchHideDelayMs` 与 overlay 默认值统一引用 `TOOLTIP_SKIP_DELAY_DURATION_MS`（300ms）；隐藏计时器改为使用实际 `delayMs`。OSS 默认行为仍显式传入 0 并立即隐藏。
- **影响面**：PRO 非受控 Tooltip 在触发器之间的连续切换，以及所有显式传入正 hide delay 的调用方；首次 450ms 延迟、受控模式和立即动效关闭不变。
- **验证方式**：Test Footer 先显示 StyleButton Tooltip，在 gap 停留 150ms 后进入 ColorSchemeButton，再进入刷新 Button；Portal 必须持续挂载、Foreground opacity 保持 1、内容和尺寸直接更新。离开全部按钮超过 300ms 后仍正常退出。
- **回退约束**：共享外框保留窗口不得再次短于 skip-delay，也不得在定时器内忽略 `delayMs` 实参。若未来调整窗口，必须从 overlay trigger timing 单一来源同步，并复测不同 gap 与移动速度。

## 变更记录

- v1.4.0 (2026-08-21): 删除 180ms burst 直达判断；每个 warm 目标立即写入状态，由 Tooltip 有界、可打断的时间线从当前画面重定向。
- v1.3.0 (2026-08-21): 连续裁切触发改为切换节奏判断；首次切换始终执行，180ms burst 内后续目标直达，并删除 pointermove 热路径。
- v1.2.1 (2026-08-20): 非 active 触发器离开时不再清除当前 Tooltip 的隐藏计时，避免延迟显示期间经过其他触发器后外框残留。
- v1.2.0 (2026-08-20): 共享 Portal、300ms 保留窗口和连续切换迁为 OSS 默认能力；视觉切换改由 Tooltip 的二维裁切窗口承接。
- v1.1.0 (2026-08-12): 外框保留时间统一为 300ms skip-delay；修复正 `delayMs` 被固定 80ms 覆盖的问题。
- v1.0.1 (2026-07-28): 新增立即动效关闭 revision。
