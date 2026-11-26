# Slider 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-slider-background-override` | 轨道底色（默认 var(--black-4)） |
| `--snowui-slider-bar-radius-override` | solid / soft 容器圆角（默认 var(--radius-2) = 8px） |
| `--snowui-slider-color-override` | 填充颜色（默认 var(--primary)） |
| `--snowui-slider-label-gap-override` | label 与 thumb 间距（默认 calc(var(--gap-1) / 2) = 2px） |
| `--snowui-slider-thickness-override` | 轨道粗细 / 条形整体高度（默认 4px；solid / soft 默认 32px） |
| `--snowui-slider-thumb-color-override` | thumb 颜色（默认 var(--static-white-80)） |
| `--snowui-slider-thumb-shadow-override` | thumb 阴影（默认 0 1px 2px rgba(0, 0, 0, 0.4)） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
