# SnowUILogo 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-snow-ui-logo-gap-override` | 组合间距（默认 horizontal 6px，vertical 15px） |
| `--snowui-snow-ui-logo-icon-size-override` | 图标尺寸（默认 horizontal/icon 28px，vertical 60px） |
| `--snowui-snow-ui-logo-wordmark-height-override` | 字标高度（默认 12px，vertical 20px） |
| `--snowui-snow-ui-logo-wordmark-width-override` | 字标宽度（默认 71px，vertical 119px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
