# GaugeChart 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-gauge-chart-height-override` | 整体高度（默认 160px） |
| `--snowui-gauge-chart-label-color-override` | 中心标签主色（默认 var(--black-100)） |
| `--snowui-gauge-chart-label-font-size-override` | 中心标签数值字号（320 宽基准默认 18px，随图表缩放） |
| `--snowui-gauge-chart-label-font-weight-override` | 中心标签主行字重（默认 700） |
| `--snowui-gauge-chart-label-muted-color-override` | 中心标签次色（默认 var(--black-40)） |
| `--snowui-gauge-chart-label-muted-font-weight-override` | 中心标签次行字重（默认 400） |
| `--snowui-gauge-chart-width-override` | 整体宽度（默认 320px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
