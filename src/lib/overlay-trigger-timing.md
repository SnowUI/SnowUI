# overlay-trigger-timing.ts 文档

> **版本**: v1.0.0
> **职责**: 统一管理 Tooltip / Popover 等浮层延迟触发时间。

触发延迟属于交互行为，不属于 appear / disappear 视觉 MotionConfig。本文件只保存“何时触发”的 timing token。

| token | 默认值 | 使用场景 |
| :--- | :--- | :--- |
| `OVERLAY_TRIGGER_HOVER_DELAY_MS` | `450ms` | Tooltip 首次 hover；Popover 延迟触发 |
| `OVERLAY_TRIGGER_SKIP_DELAY_DURATION_MS` | `300ms` | Tooltip 快速切换暖场窗口 |

## 变更记录

- v1.0.0 (2026-06-18): 新增浮层触发延迟 token。
