# SidebarSection API

来源指纹：44b947403def1ac3。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | 必填 | 稳定分类标识 |
| title | `string` | — | 内置分类标题；未传时不渲染标题行 |
| collapsible | `boolean` | — | 是否提供内置展开/收起按钮 默认行为：有标题时 `true`。 |
| collapsed | `boolean` | — | 传入布尔值时控制分类折叠状态；省略时由分类内部状态及 Sidebar 持久化状态管理 |
| defaultCollapsed | `boolean` | false | 非受控初始状态 |
| onCollapsedChange | `(collapsed: boolean) => void` | — | 分类折叠变化回调 |
| actions | `SidebarActionData[] \| Snippet` | [] | 0～多个标题操作；数组生成 `Button bare` |
| children | `Snippet` | — | 分类内容 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; }>` | — | 配置数据生成的 Button 与内置 Separator |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
