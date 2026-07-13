# replacement.ts 文档

> **版本**: v1.1.0
> **职责**: 提供内容替换类进入 preset。

`REPLACEMENT_APPEAR_MOTION` 用于 Icon / Text / CodeBlock 等内容替换场景，避免这些组件隐式继承 overlay 语义。

## 使用规则

1. 内容替换类组件优先引用本 preset。
2. 不用于 Popover、Listbox、Tooltip、Dialog。
3. 后续如内容替换需要独立于 generic 的数值，可只调整本 preset。
4. 本 preset 复用 `GENERIC_SCALE_APPEAR_MOTION` 的 opacity + scale + 标准时序；generic appear 收敛为仅 opacity 后，内容替换视觉保持不变。

## 变更记录

- v1.2.0 (2026-06-30): 改为复用显式 generic scale opt-in preset，减少重复通道组合。
- v1.1.0 (2026-06-30): 显式声明 replacement scale，不再依赖 generic appear 的旧缩放通道。
- v1.0.0 (2026-06-18): 新增 replacement preset。
