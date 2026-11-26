# Image API

来源指纹：94cbb77874e0683a。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| src | `string \| Component` | — | 图片 / 视频 URL，或 `resource-svelte` 图片组件 |
| size | `ImageSize` | — | 图片尺寸。未显式设置时自动继承 `ImageGroup` 提供的尺寸上下文。 |
| alt | `string` | — | 图片替代文本 |
| mediaLoading | `MediaLoading` | — | 字符串图片的原生加载策略；显式值优先于最近的 `provideMediaLoading()` 默认值。与 Frame 的视觉 `loading` 无关。 |
| previewMode | `PreviewMode` | — | 显式控制预览方式；未声明时，页面存在共享 ImageViewer 则接入 Viewer，否则字符串媒体回退为新窗口 |
| onOpen | `(event?: MouseEvent \| KeyboardEvent) => void` | — | 点击或键盘触发打开时调用；提供后接管默认 Viewer / 新窗口动作，调用方负责处理打开行为。 |
| badgePosition | `"top" \| "bottom"` | "top" | 角标位置：top 为右上，bottom 为右下。 |
| children | `Snippet` | — | 媒体挂件；子组件通过 as="icon" 居中或 as="badge" 定位，不替换媒体内容。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
