# IconProvider API

来源指纹：6386ac80725975b6。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| icons | `ComponentIconMap` | {} | 稳定语义名到外部 Svelte 图标组件的映射 |
| resolver | `ComponentIconResolver` | — | 按 `{ name, weight }` 解析图标；优先于同层 `icons` |
| children | `Snippet` | — | 原样渲染的子树 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
