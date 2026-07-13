# Resize Motion Preset

> **版本**: v1.2.0
> **职责**: 提供组件尺寸变化的统一动效时序。

## 导出

| 名称 | 描述 |
| :--- | :--- |
| `RESIZE_MOTION` | 组件尺寸变化的默认时序配置。 |
| `RESIZE_MOTION_STYLE` | 将 preset 注入 Frame size motion bridge 变量。 |

## 适用范围

- Accordion / AccordionItem 展开与收起。
- 卡片、面板或列表项的明确宽高变化。

动效来源：transitions.dev Card resize。

## 变更记录

- v1.2.0 (2026-06-18): 删除旧 Card 限定兼容导出，只保留通用命名。
- v1.1.0 (2026-06-18): 将 Card 限定命名提升为通用 `RESIZE_MOTION`。
