# Badge 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-badge-dot-size-override` | dot 模式尺寸（尺寸 px，默认值见组件源码） |
| `--snowui-badge-font-size-override` | font-size（默认值见组件源码） |
| `--snowui-badge-height-override` | 高度（默认值见组件源码） |
| `--snowui-badge-line-height-override` | line-height（filled 默认 1；border 默认 var(--leading-12)） |
| `--snowui-badge-min-width-override` | 最小宽度（默认值见组件源码） |
| `--snowui-badge-padding-override` | padding y+x（filled 默认 calc(--padding-1 * 0.75) calc(--padding-1 * 1.5)；border 默认 0 var(--padding-1)） |
| `--snowui-badge-radius-override` | border-radius（filled 默认 var(--radius-full)；border 默认 calc(var(--radius-1) * 1.5)） |
| `--snowui-badge-size-override` | 整体尺寸（尺寸 px，默认值见组件源码） |
| `--snowui-badge-width-override` | 宽度（默认值见组件源码） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
