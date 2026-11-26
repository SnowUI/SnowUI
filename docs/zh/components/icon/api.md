# Icon API

来源指纹：1216a8993e89d40e。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| src | `string` | — | 图标图片 URL |
| icon | `Component<any>` | — | 直接渲染 resource-svelte 图标组件。 |
| stateIcon | `StateValueMap<Component<any> \| null>` | — | 根据最近父级 Frame 的 `currentState` 解析图标。未命中当前状态时回退 `Idle`，再回退 `icon` / `src` / children；状态值为 `null` 时隐藏 Icon。 |
| size | `IconSize` | — | 图标尺寸。未显式设置时，自动继承父级 `Frame` 提供尺寸上下文。 |
| background | `boolean` | false | 是否显示背景 |
| weight | `string` | — | 透传给图标资源的视觉权重；资源支持时可用 thin、light、regular、bold、fill、duotone。未设置时由资源或上下文决定，不会凭空生成资源缺少的变体。 |
| as | `\| "badge" \| "icon" \| "prev" \| "next" \| "close" \| (string & {})` | "icon" | 角色：作为独立图标、徽标、图片中央图标或 Viewer 控制图标 |
| children | `Snippet` | — | 图标内容与角标组合；仅当 src 和解析后的 icon 均未命中时渲染；可同时放入资源图标与 Badge as="badge"，角标由宿主定位。 |
| badgePosition | `"top" \| "bottom"` | "top" | 作为角标宿主时的位置：top 为右上，bottom 为右下。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
