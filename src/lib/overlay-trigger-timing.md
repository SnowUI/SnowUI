# overlay-trigger-timing.ts 文档

> **版本**: v1.4.0
> **职责**: 统一管理 Tooltip / Popover 等浮层延迟触发时间。

触发延迟属于交互行为，不属于 appear / disappear 视觉 MotionConfig。本文件只保存“何时触发”的 timing token。

| token | 默认值 | 使用场景 |
| :--- | :--- | :--- |
| `OVERLAY_TRIGGER_HOVER_DELAY_MS` | `450ms` | Tooltip 首次 hover；Popover 延迟触发 |
| `OVERLAY_TRIGGER_SKIP_DELAY_DURATION_MS` | `300ms` | Tooltip 快速切换暖场窗口 |

## 变更记录

- v1.3.0 (2026-08-21): 用 180ms 连续切换节奏替代瞬时指针速度；首次相邻切换始终保留裁切，burst 后续目标直达。
- v1.2.0 (2026-08-20): 用指针快速穿越阈值替代固定 100ms 意图延迟，保持 warm Tooltip 即时响应。
- v1.1.0 (2026-08-20): 新增 Tooltip 连续切换的 100ms 意图确认 token。
- v1.0.0 (2026-06-18): 新增浮层触发延迟 token。
- v1.4.0 (2026-08-21): 删除 Tooltip burst 直达窗口；连续切换改由可打断的有界视觉时间线处理，不再把视觉收敛策略放在触发 timing 中。
