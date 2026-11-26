# SidebarItem API

来源指纹：48e974d9ecc6873a。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | 必填 | 稳定导航标识 |
| label | `string` | 必填 | 文字与折叠态可访问名称 |
| icon | `string \| Snippet` | — | ResourceIcon 名称或自定义 leading 内容 |
| iconCollection | `string` | — | `icon` 的 ResourceIcon collection；存在同名 SnowUI 图标时传入 `"snowui"` |
| depth | `0 \| 1` | 0 | 导航层级；`1` 表示二级 Item，由组件在 leading 槽绘制 L 形层级连接线并替换普通 Icon |
| href | `string` | — | 主操作统一使用 Button；存在时由 Button 输出链接语义 |
| updated | `boolean` | false | 内置 Badge dot；展开态位于外部 tags 之后，折叠态跟随 leading icon |
| tags | `Snippet` | — | label 后、updated 前的自定义状态/分类标签；推荐使用 `Badge variant="border"` |
| disabled | `boolean` | false | 禁用主操作 |
| actions | `SidebarActionData[] \| Snippet` | [] | 0～多个末尾操作；数组生成 `Button bare` |
| onSelect | `(id: string) => void` | — | 本项选择回调 |
| parts | `ComponentPartsOf<{ Badge: typeof Badge; Button: typeof Button }>` | — | 配置内置 Badge 与数据生成的 Button |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
