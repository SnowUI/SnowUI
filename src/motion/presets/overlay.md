# overlay.ts 文档

> **版本**: v1.0.0
> **职责**: 提供 dropdown overlay 组件族出现 / 消失 preset。

`DROPDOWN_OVERLAY_APPEAR_MOTION` 与 `DROPDOWN_OVERLAY_DISAPPEAR_MOTION` 用于 Popover、Listbox、Menu dropdown 等轻量浮层，只保留 opacity，不包含 scale。

## 来源

出现与退出均仅使用 fade，具体时序由 `motion/tokens.ts` 提供。

## 使用规则

1. Popover、Listbox 等组件必须引用本 preset。
2. 组件不得复制本 preset 的 duration / easing / scale。
3. 退出延迟卸载时间必须从 disappear preset 推导。

## 变更记录

- v1.1.0 (2026-07-01): Popover、Listbox、Menu dropdown 统一移除默认 scale 通道，仅保留 opacity。
- v1.0.0 (2026-06-18): 新增 dropdown overlay preset。
