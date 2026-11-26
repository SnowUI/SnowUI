# Sidebar 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-button-opacity-override` | 不透明度（默认值见组件源码） |
| `--snowui-separator-thickness-override` | 分割线粗细 |
| `--snowui-sidebar-collapsed-header-gap-override` | 折叠态 Logo host 与折叠按钮间距（默认 var(--gap-1)） |
| `--snowui-sidebar-collapsed-logo-slot-width-override` | icon 变体折叠态 Logo leading slot 宽度（默认 36px） |
| `--snowui-sidebar-collapsed-width-override` | Collapsed width (derived from padding and icon width; default 56px) |
| `--snowui-sidebar-default-logo-gap-override` | 默认 Logo icon / wordmark 间距（默认 calc(var(--gap-1) * 1.25) = 5px） |
| `--snowui-sidebar-footer-gap-override` | Footer 内容间距（默认 var(--gap-2) = 8px） |
| `--snowui-sidebar-footer-padding-x-override` | 覆盖 Footer 横向 padding（默认 var(--padding-5) = 20px） |
| `--snowui-sidebar-footer-padding-y-override` | 覆盖 Footer 纵向 padding（默认上 12px、下 16px） |
| `--snowui-sidebar-gap-override` | 根级 Header / Body 间距（默认 var(--gap-3) = 12px） |
| `--snowui-sidebar-item-background-override` | hover / active 背景（默认 var(--black-4)） |
| `--snowui-sidebar-item-padding-x-override` | 导航项横向 padding（默认 var(--padding-2)） |
| `--snowui-sidebar-item-radius-override` | 导航项圆角（默认 var(--radius-3)） |
| `--snowui-sidebar-logo-padding-x-override` | 默认/自定义 Logo host 横向 padding（默认 var(--padding-1)） |
| `--snowui-sidebar-logo-padding-y-override` | Logo 所在 Header 区域纵向 padding（默认 0px） |
| `--snowui-sidebar-logo-scroll-mask-size-override` | Logo 区域反向渐隐高度（默认 Header 实测高度 + 顶部 padding + Header/Body gap） |
| `--snowui-sidebar-navigation-gap-override` | Body 相邻导航内容间距（默认 var(--gap-1)） |
| `--snowui-sidebar-padding-x-override` | 根横向 padding（默认 var(--padding-3) = 12px；Body 滚动条据此保持距 Sidebar 右边框 4px） |
| `--snowui-sidebar-padding-y-override` | 根纵向 padding（默认 var(--padding-4) = 16px） |
| `--snowui-sidebar-resize-indicator-offset-override` | 展开态右侧宽度 Indicator 视觉中心距右边缘（默认 var(--padding-1) = 4px） |
| `--snowui-sidebar-separator-padding-x-override` | Sidebar 内全部横向 Separator 的横向 padding（默认 var(--padding-2) = 8px） |
| `--snowui-sidebar-separator-padding-y-override` | Sidebar 内全部横向 Separator 的纵向 padding（默认 var(--padding-2) = 8px） |
| `--snowui-sidebar-width-override` | 展开宽度（默认 220px） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
