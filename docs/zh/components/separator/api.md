# Separator API

来源指纹：668fbc6c31ac51ea。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| row | `boolean` | false | 横向分割线；与 Frame 写法统一 |
| column | `boolean` | false | 纵向分割线；与 Frame 写法统一 |
| length | `string \| number` | — | 主轴长度；数字按 px 处理 |
| thickness | `string \| number` | — | 线宽；未传时默认 0.5px（等价 `var(--border-1)`） |
| rounded | `boolean` | true | 端点是否圆角；默认圆角 |
| decorative | `boolean` | true | 是否为装饰分割线；默认输出 `aria-hidden="true"` |
| children | `Snippet` | — | 预留给带文字的分割线场景 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
