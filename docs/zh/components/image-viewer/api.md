# ImageViewer API

来源指纹：81663d2b641fa615。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| open | `boolean` | — | 手动模式下控制 Viewer 显示；与 `items/index` 一起省略时进入页面级自动模式 |
| items | `ImageViewerItem[]` | — | 手动模式下提供预览项列表；省略时自动消费页面级预览状态 |
| index | `number` | — | 手动模式下提供当前显示项索引；省略时自动消费页面级预览状态 |
| dismissMode | `"button" \| "backdrop"` | "backdrop" | 关闭策略：backdrop 隐藏关闭按钮并允许点击媒体外空白关闭；button 显示关闭按钮且禁用空白关闭 |
| backdrop | `BackdropVariant` | "opaque" | 与 Dialog 共用遮罩视觉：opaque 为 10% 黑色遮罩，blur 在其上模糊背景，transparent 透明；不改变关闭策略。 |
| children | `Snippet` | — | 显式组合控制按钮；提供后替换全部默认内置按钮 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 批量配置默认内置的 prev / next / close Button |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
