# BarChart 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-bar-chart-axis-color-override` | 坐标轴标签颜色（默认 var(--black-40)） |
| `--snowui-bar-chart-axis-font-size-override` | 坐标轴标签字号（默认 12px） |
| `--snowui-bar-chart-axis-line-color-override` | x 轴基线颜色（默认 var(--black-40)） |
| `--snowui-bar-chart-grid-color-override` | 网格线颜色（默认 var(--black-10)） |
| `--snowui-bar-chart-height-override` | 整体高度（默认 400px） |
| `--snowui-bar-chart-hover-label-color-override` | hover label 颜色（默认 var(--black-100)） |
| `--snowui-bar-chart-width-override` | 整体宽度（默认 800px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
