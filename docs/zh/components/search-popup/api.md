# SearchPopup API

来源指纹：ab1ef495b0037294。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| backdrop | `BackdropVariant \| false` | false | false 保持原静态或锚定模式；opaque、blur、transparent 启用 Dialog 共享模态遮罩。 |
| closeOnOutside | `boolean` | true | 模态模式点击遮罩关闭；与遮罩视觉独立。 |
| value | `string \| number` | "" | 搜索输入值，支持 bind:value；过滤由消费方负责。 |
| search | `boolean` | true | 是否生成默认 SearchInput；显式输入时关闭。 |
| title | `string` | — | 可选面板标题，位于结果区顶部；children 模式由显式内容接管。 |
| showGroupTitles | `boolean` | true | 是否生成 items 的来源分组标题；不改变顺序。 |
| items | `SearchPopupItem[]` | [] | value、label、href 必填；group、disabled 可选；按输入顺序呈现，连续相同 group 只显示一次。 |
| children | `Snippet` | — | 替换全部默认结果与标题；不再读取 items / title / showGroupTitles。 |
| parts | `ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>` | — | 配置实际生成的输入、结果和标题；value、children、身份、disabled 由所属数据控制。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
