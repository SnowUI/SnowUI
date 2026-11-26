# Button 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-background-override` | 背景（默认值见组件源码） |
| `--snowui-button-border-color-override` | 边框颜色（默认值见组件源码） |
| `--snowui-button-border-width-override` | 边框宽度（默认值见组件源码） |
| `--snowui-button-color-override` | color（默认值见组件源码） |
| `--snowui-button-font-size-override` | font-size（默认值见组件源码） |
| `--snowui-button-gap-override` | gap |
| `--snowui-button-group-cell-gap-override` | Button 单元格内部 gap |
| `--snowui-button-group-cell-padding-override` | 统一覆盖单元格 padding；默认由首/中/尾位置自动分配 |
| `--snowui-button-height-override` | 高度（默认值见组件源码） |
| `--snowui-button-icon-only-padding-override` | icon-only 模式 padding（sm=4px md=8px lg=12px） |
| `--snowui-button-line-height-override` | line-height（默认值见组件源码） |
| `--snowui-button-min-height-override` | 最小高度（默认值见组件源码） |
| `--snowui-button-min-width-override` | 最小宽度（默认 max-content） |
| `--snowui-button-opacity-override` | 不透明度（默认值见组件源码） |
| `--snowui-button-padding-override` | padding y+x |
| `--snowui-button-radius-override` | border-radius |
| `--snowui-button-width-override` | 宽度（默认值见组件源码） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
