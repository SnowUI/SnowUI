# ButtonGroup 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-group-background-override` | 背景 |
| `--snowui-button-group-border-color-override` | 边框颜色 |
| `--snowui-button-group-border-width-override` | 边框宽度 |
| `--snowui-button-group-color-override` | color |
| `--snowui-button-group-font-size-override` | font-size |
| `--snowui-button-group-gap-override` | 单元格内容到 Separator 的间距；默认 sm 8 / md 12 / lg 16 |
| `--snowui-button-group-line-height-override` | line-height |
| `--snowui-button-group-radius-override` | border-radius |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
