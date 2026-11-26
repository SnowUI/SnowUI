# Link 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-icon-size-override` | 整体尺寸（尺寸 px，默认值见组件源码） |
| `--snowui-link-color-override` | 常态颜色（默认 Black40；自动 hover 规则使用 Link color Prop） |
| `--snowui-link-decoration-hover-opacity-override` | trailing 箭头 / Icon hover 透明度（默认 1） |
| `--snowui-link-decoration-opacity-override` | trailing 箭头 / Icon 常态透明度（默认 0.4） |
| `--snowui-link-font-size-override` | font-size（默认 var(--text-14) = 14px） |
| `--snowui-link-gap-override` | 内部内容与 leading / trailing 间距（首选 var(--gap-1)，有效值至少 4 CSS px） |
| `--snowui-link-icon-size-override` | 内置 ArrowUpRight / ArrowSquareOut 尺寸（默认 var(--size-3) = 12px；不覆盖外置 Icon） |
| `--snowui-link-line-height-override` | line-height（默认 var(--leading-14) = 20px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
