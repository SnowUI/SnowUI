# ScrollArea API

来源指纹：80574e40e8bbeb38。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| axis | `ScrollAreaAxis` | "vertical" | 允许滚动的方向 |
| horizontalTrackPosition | `ScrollAreaHorizontalTrackPosition` | "container" | 横向轨道停靠在容器底边，或在长容器经过页面视口时贴近视口底部 |
| horizontalScrollbarVisibility | `"always" \| "hover"` | "always" | 横向滚动条在内容溢出时常显，或仅在鼠标移入区域时显示 |
| ariaLabel | `string` | — | viewport 的无障碍标签；省略时随LocaleProvider更新，显式ariaLabel优先；viewport 使用 `role="region"` |
| viewport | `HTMLElement` | — | 暴露内部可滚动 viewport，供读取或设置原生滚动位置 |
| onscroll | `(event: Event) => void` | — | viewport 原生 scroll 事件 |
| children | `Snippet` | — | 任意可滚动内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
