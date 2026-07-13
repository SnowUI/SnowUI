# generic.ts 文档

> **版本**: v1.2.0
> **职责**: 提供 Frame fallback 使用的通用出现 / 消失 preset。

`GENERIC_APPEAR_MOTION` 与 `GENERIC_DISAPPEAR_MOTION` 用于没有明确组件族语义的 Frame 生命周期动效。组件语义明确时，应优先使用对应组件族 preset。

`GENERIC_APPEAR_MOTION` 默认只包含 `opacity: [0, 1]` 与标准时序，不包含 scale。需要缩放进入的消费方必须显式声明 scale，或改用含 scale 的组件族 preset。

`GENERIC_SCALE_APPEAR_MOTION` 是显式 opt-in preset，完整保留旧 generic appear 的 `opacity + scale + 标准时序`。它用于没有更明确组件族语义、但迁移时必须保持既有缩放进入视觉的普通组件；不得重新作为 Frame 默认 fallback。

## 适用

- Frame fallback
- 普通内容进入 / 退出

## 不适用

- Popover / Listbox / Menu dropdown
- Tooltip
- Dialog / Modal

## 变更记录

- v1.2.0 (2026-06-30): 新增 `GENERIC_SCALE_APPEAR_MOTION`，显式承接旧 generic opacity + scale 组合并用于组件无损迁移。
- v1.1.0 (2026-06-30): generic appear 默认视觉收敛为仅 opacity，scale 改为显式 opt-in。
- v1.0.0 (2026-06-18): 新增 generic preset。
