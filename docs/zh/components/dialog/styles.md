# Dialog 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-opacity-override` | 不透明度（默认值见组件源码） |
| `--snowui-dialog-font-size-override` | font-size（默认 var(--text-14)=14px） |
| `--snowui-dialog-line-height-override` | line-height（默认 var(--leading-14)=20px） |
| `--snowui-dialog-max-width-override` | max-width（默认 sm=320px md=448px lg=640px） |
| `--snowui-dialog-padding-override` | padding（默认 sm var(--padding-4)=16px；md/lg var(--padding-6)=24px） |
| `--snowui-dialog-radius-override` | border-radius（默认 sm var(--radius-6)=24px；md/lg calc(var(--radius-4)*2)=32px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
