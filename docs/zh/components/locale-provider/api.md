# LocaleProvider API

来源指纹：692febc8af0f0a07。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| locale | `string` | "zh-CN" | 当前语言标识；内置 zh-CN、en-US，未知语言按语言主标签再回退 zh-CN。 |
| messages | `SnowUIMessageOverrides` | {} | 仅覆盖当前 Provider 子树的内置 message key。 |
| children | `Snippet` | — | 当前 locale 和 messages 生效的子树，无参数；Provider 不添加 DOM 外壳。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
