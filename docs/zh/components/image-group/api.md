# ImageGroup API

来源指纹：c879f78c54a6b6b0。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| size | `ImageGroupSize` | — | 统一控制组内图片尺寸 |
| layout | `ImageGroupLayout` | "row" | 布局模式 |
| previewMode | `PreviewMode` | — | 作为组内 Image 的显式预览模式；省略时由页面共享 Viewer 是否存在自动决定 |
| enableResponsive | `boolean` | true | 启用 Frame 响应式能力，按公开响应式配置调整集合布局。 |
| enableContext | `boolean` | true | 是否向 Frame 子组件提供通用上下文；Image 的组尺寸和预览策略仍通过专属组上下文提供。 |
| children | `Snippet` | — | 组内图片内容；Image 自动注册媒体并继承组尺寸与预览策略，显式子项设置优先。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
