# Tab 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-background-override` | 背景（默认值见组件源码） |
| `--snowui-button-border-color-override` | 边框颜色（默认值见组件源码） |
| `--snowui-button-color-override` | color（默认值见组件源码） |
| `--snowui-button-icon-only-padding-override` | icon-only 模式 padding（sm=4px md=8px lg=12px） |
| `--snowui-button-opacity-override` | 不透明度（默认值见组件源码） |
| `--snowui-button-padding-override` | padding y+x |
| `--snowui-button-radius-override` | border-radius |
| `--snowui-tab-background-blur-override` | 容器背景模糊(默认 pill/icon-toggle=1.25rem=20px;其他变体=none) |
| `--snowui-tab-background-override` | 容器背景(默认 pill/icon-toggle=var(--black-4);solid/underline/bare=transparent) |
| `--snowui-tab-gap-override` | 容器子项间距(默认 sm=calc(var(--gap-1)/2)=2px;md/lg=var(--gap-1)=4px;underline/bare 时 sm/md/lg=var(--gap-3/4/5)=12/16/20) |
| `--snowui-tab-hover-opacity-override` | 未激活 item hover 透明度(默认 1) |
| `--snowui-tab-inactive-opacity-override` | 未激活 item 透明度(默认 0.4) |
| `--snowui-tab-padding-override` | 容器 padding(默认 sm=calc(var(--padding-1)/2)=2px;md/lg=var(--padding-1)=4px;solid/underline/bare 时为 0) |
| `--snowui-tab-radius-override` | 容器 radius(默认 sm=var(--radius-4)=16;md=var(--radius-5)=20;lg=var(--radius-6)=24;underline/bare=0) |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
