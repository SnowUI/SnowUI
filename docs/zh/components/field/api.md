# Field API

来源指纹：1855d0d738134a63。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| invalid | `boolean` | false | 容器级无效态，强制显示错误边框 |
| readonly | `boolean` | false | 容器级只读态 |
| label | `string \| Snippet` | — | 生成内置 `<Text as="label">`；默认不生成。 |
| error | `string \| Snippet` | — | `invalid=true` 时生成内置 `<Text as="error">`；默认不生成。 |
| parts | `ComponentPartsOf<{ Text: typeof Text }>` | — | 配置内置 label / error Text。 |
| children | `Snippet` | — | 自由组合的字段内容 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
