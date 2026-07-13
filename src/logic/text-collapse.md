# text-collapse.svelte.ts 文档

> **版本**: v1.2.1
> **职责**: 管理文本折叠/展开的测量和样式计算。

## 依赖关系

- **被依赖**: Text.svelte

## 导出

| 名称 | 类型 | 描述 |
| :--- | :--- | :--- |
| collapse | Svelte Action | 监测文本溢出并计算截断样式 |
| CollapseLines | Type | 行数类型 (0-10) |
| CollapseInfo | Interface | 折叠状态信息 |

## 功能

- ResizeObserver 实时监测容器尺寸
- 计算 line-clamp 样式
- 支持展开/收起模式
- 固定行数模式的高度样式由真实截断内容层消费；仅 `lines=0` 查找外部高度约束宿主
