# TableRow API

来源指纹：e030a93771eb6c0e。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| rowId | `string \| number` | — | 稳定行身份；DataTable 选择和预览按该 id 查找记录，应与 DataTable rowKey 一致。 |
| active | `boolean` | false | 由使用方或外部条件写入的持久激活背景；不会触发行选中或 Checkbox 选中 |
| children | `Snippet` | — | 当前行的 TableCell 或 TableHead，无参数；保持合法 tr 子结构。 |
| onclick | `(event: MouseEvent) => void` | — | 行点击先调用此回调，参数为 MouseEvent；preventDefault 可阻止后续内置选择命中与行预览。交互子元素不会触发行预览。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
