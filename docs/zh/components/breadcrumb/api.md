# Breadcrumb API

来源指纹：a6c4301e8f698b5d。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| ariaLabel | `string` | — | 根导航区域的无障碍标签；省略时随LocaleProvider更新，显式ariaLabel优先 |
| gap | `number` | — | 继承 Frame 的间距 token 索引，设置路径元素的首选行／列间距；省略保留原首选值，有效间距至少为 4 CSS px，显式零与根字号／间距缩放不压低下限；更大首选间距及默认单行布局保留。 |
| variant | `BreadcrumbVariant` | "borderless" | 内部 `Button as="item"` 的默认 Button 变体；parts 与子级 Button 显式 `variant` 可覆盖 |
| children | `Snippet` | — | 显式声明 Button as="item" 与 Text as="separator"，替换内建 items 与 separator；最后一个 item 仍自动成为当前页。 |
| items | `BreadcrumbItem[]` | [] | 内建路径数据，每项含 label、可选 href/disabled；自动生成 Button 与分隔 Text，最后一项为不可交互的当前页。children 存在时忽略此数组。 |
| separator | `string` | "/" | 内建路径项之间的分隔文字；仅在 items 模式使用，显式组合时自行声明 as="separator"。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text }>` | — | 配置 items 模式生成的 Button 与分隔 Text；不作用于显式 children，当前页及角色语义仍由 Breadcrumb 接管。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
