# tooltip.ts 文档

> **版本**: v1.0.0
> **职责**: 提供 Tooltip 出现 / 消失 preset。

`TOOLTIP_APPEAR_MOTION` 与 `TOOLTIP_DISAPPEAR_MOTION` 专用于 Tooltip portal 内容，不与 dropdown overlay 或 Dialog 共用。

## 来源

参考 `transitions.dev-main` Tooltip：出现带短 delay 的 fade + scale，离开快速 fade + scale。

## 使用规则

1. Tooltip 出现 / 消失动效引用本 preset。
2. Tooltip 首次 hover 延迟不在本文件，归 `lib/overlay-trigger-timing.ts`。
3. 退出卸载时间使用 `TOOLTIP_DISAPPEAR_TOTAL_MS`。

## 变更记录

- v1.0.0 (2026-06-18): 新增 Tooltip preset。
