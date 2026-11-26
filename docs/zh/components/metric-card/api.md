# MetricCard API

来源指纹：e0bcf3fa664ecde8。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| label | `string` | 必填 | 指标名称 |
| value | `string` | 必填 | 已格式化的当前值 |
| change | `string` | — | 已格式化的变化值；省略时突出当前值 |
| emphasis | `'value' \| 'change'` | "change" | 选择主要显示当前值或变化值 |
| trend | `'positive' \| 'negative' \| 'neutral'` | "neutral" | 变化值首位正负号的视觉状态；数值及其含义由调用方提供 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
