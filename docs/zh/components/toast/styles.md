# Toast 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-opacity-override` | 不透明度（默认值见组件源码） |
| `--snowui-icon-height-override` | 高度（默认值见组件源码） |
| `--snowui-icon-width-override` | 宽度（默认值见组件源码） |
| `--snowui-toast-font-size-override` | default 变体 font-size（默认 md=var(--text-14) / sm=var(--text-12)） |
| `--snowui-toast-gap-override` | gap（默认 md=var(--gap-2)=8px / sm=var(--gap-1)=4px） |
| `--snowui-toast-line-height-override` | default 变体 line-height（默认 md=var(--leading-14) / sm=var(--leading-12)） |
| `--snowui-toast-padding-override` | rich 变体整体 padding（默认 var(--padding-3) = 12px） |
| `--snowui-toast-padding-x-override` | default 变体 padding-x（默认 md=var(--padding-3)=12px / sm=var(--padding-2)=8px） |
| `--snowui-toast-padding-y-override` | default 变体 padding-y（默认 md=var(--padding-2)=8px / sm=var(--padding-1)=4px） |
| `--snowui-toast-radius-override` | border-radius（默认 var(--radius-4) = 16px） |
| `--snowui-toast-success-color-override` | 内置 success 图标颜色（默认 var(--secondary-green) = #71DD8C） |
| `--snowui-toast-warning-color-override` | 内置 warning 图标颜色（默认 var(--secondary-yellow) = #FFCC00） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
