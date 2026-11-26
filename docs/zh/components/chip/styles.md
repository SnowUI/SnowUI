# Chip 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-chip-background-override` | 背景色（默认 color-mix(currentColor 10%, transparent)） |
| `--snowui-chip-font-size-override` | font-size（默认 sm=var(--text-12) lg=var(--text-14)） |
| `--snowui-chip-gap-override` | gap（默认 0） |
| `--snowui-chip-line-height-override` | line-height（默认 sm=var(--leading-12) lg=var(--leading-14)） |
| `--snowui-chip-padding-override` | background：sm=2px 8px，lg=4px 12px；图标侧 sm=4px、lg=8px |
| `--snowui-chip-radius-override` | border-radius（仅 background 生效，默认 9999px） |
| `--snowui-chip-shadow-override` | 描边 inset box-shadow（默认 0 0 0 0.5px color-mix(currentColor 20%, transparent)） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
