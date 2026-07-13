# frame-field-control.ts 文档

> **版本**: v1.0.0
> **职责**: 为 `Input / Textarea / Select` 这类“外层 Frame + 内层原生表单宿主元素”的组件提供共享字段桥接逻辑。

## 功能

- `resolveFrameFieldValue(value, defaultValue, options?)`
  - 统一解析 `value / defaultValue`
  - 支持按控件类型跳过不应绑定值的宿主类型（如 `input[type="file"]`）
- `resolveFrameFieldInvalid(invalid, hostProps?)`
  - 统一归一 `invalid` 与 `aria-invalid`
- `readFrameFieldValue(target, options?)`
  - 从原生宿主元素读取当前值
- `syncFrameFieldValue(target, assign, options?)`
  - 读取宿主值并写回组件绑定值

## 适用场景

- `Input`
- 后续 `Textarea`
- 后续 `Select`
- 其他以原生表单元素为宿主、但外层仍由 `Frame` 承担通用能力的复合组件

## 设计说明

- 这层逻辑不关心 `Frame` 的样式和状态机，只负责字段值与无效态桥接。
- `file` 输入这类“不应把值回写到组件绑定值”的宿主规则集中在这里，避免每个组件单独判断。
- 目标是让宿主型组件只负责：
  - props 声明
  - 样式
  - 原生结构

## 更新日志

### v1.0.0 (2026-03-14)

- 新增字段宿主桥接模块，统一 `value/defaultValue`、`invalid/aria-invalid` 与宿主值同步逻辑。
