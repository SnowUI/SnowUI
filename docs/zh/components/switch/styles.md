# Switch 样式覆盖

优先用组件公开 Props 匹配合适样式，尽可能保留原有视觉。确需改写时按 [样式选择与改写顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 使用自己的 class（含项目已有 Tailwind）或实例 style。以下名称来自源码实际消费的公开 override；先核对目标作用域，不修改私有 DOM。采用 SnowUI Token 时选择正确类别，外部应用不被要求安装一方 utilities。

| 变量 | 用途与默认参考 |
| --- | --- |
| `--snowui-switch-color-override` | color（默认值见组件源码） |
| `--snowui-switch-gap-override` | gap（默认 var(--gap-1) = 4px） |
| `--snowui-switch-height-override` | 高度（默认值见组件源码） |
| `--snowui-switch-label-font-size-override` | label font-size（默认值见组件源码） |
| `--snowui-switch-label-line-height-override` | label line-height（默认值见组件源码） |
| `--snowui-switch-motion-duration-override` | 动效时长（默认值见组件源码） |
| `--snowui-switch-motion-easing-override` | 动效曲线（默认值见组件源码） |
| `--snowui-switch-overlay-color-override` | 覆盖层颜色（默认值见组件源码） |
| `--snowui-switch-overlay-opacity-override` | 覆盖层不透明度（默认值见组件源码） |
| `--snowui-switch-primary-override` | 主色（默认值见组件源码） |
| `--snowui-switch-radius-override` | border-radius（默认值见组件源码） |
| `--snowui-switch-size-override` | 整体尺寸（尺寸 px，默认值见组件源码） |
| `--snowui-switch-thumb-gap-override` | thumb 间距（默认值见组件源码） |
| `--snowui-switch-thumb-size-override` | thumb 尺寸（尺寸 px，默认值见组件源码） |
| `--snowui-switch-width-override` | 宽度（默认值见组件源码） |

[设计指南](../../guides/design-system.md) · [Token](../../reference/tokens.md) · [组合边界](./reference.md)
