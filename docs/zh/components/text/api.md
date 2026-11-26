# Text API

来源指纹：b7c7beb5eac488a4。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| tag | `string` | — | 根节点标签。 默认行为：span。 |
| stateText | `StateValueMap<string \| number>` | — | 根据最近父级 Frame 的 `currentState` 渲染文本；未命中当前状态时回退 `Idle`，再回退 children。 |
| interactive | `boolean` | false | 是否启用 Text hover 动效；显式传 `true` 时开启，默认关闭。 |
| lines | `0 \| 1 \| 2 \| 3` | — | 文本截断模式：`0`=可展开，`1/2/3`=固定行数。 |
| more | `boolean` | false | `lines=0` 时生成内置展开 Button；默认样式为示例 6 的 ArrowLineDown 按钮。 |
| tooltip | `TooltipProp` | — | Tooltip 配置。支持自动推导、固定文本、Snippet，或传对象仅覆写 Tooltip 位置/偏移等配置。 |
| onTruncate | `(isTruncated: boolean) => void` | — | 截断状态变化回调。 |
| children | `Snippet<[any]>` | — | 默认文字或自定义内容，接收含 breakpoint 的渲染上下文；stateText 命中时以对应状态文本替代。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Tooltip: typeof Tooltip; }>` | — | 仅配置内置 Button 与 Tooltip；显式 children 中的同名组件不继承。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
