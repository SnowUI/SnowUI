# ButtonGroup API

来源指纹：52ab4b232e2e1f00。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `ButtonGroupVariant` | "gray" | 外壳视觉变体 |
| size | `ButtonGroupSize` | — | 控制外壳和嵌入 Button 的密度；显式值优先，其次父级尺寸上下文，再回退 sm。子 Button 的显式 size 可覆盖继承值。 |
| disabled | `boolean` | false | 禁用整个 ButtonGroup，并传递给内部嵌入态 Button |
| showSeparator | `boolean` | true | 显示相邻 Button 单元格之间的内置装饰分割线；false 关闭全部分割线，不改变各按钮的操作与分组布局。 |
| children | `Snippet` | — | 显式放置可独立操作的 Button；直系 Button 自动成为分组单元格并继承组配置，分割线由组内建，无需手写 Separator。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
