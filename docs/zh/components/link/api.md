# Link API

来源指纹：ba0af21edc32c274。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `LinkVariant` | "default" | 链接视觉变体 |
| color | `SnowUIColor \| string` | "Black40" | 常态颜色；Black100 / Black（或 `var(--black-100)`）自动 hover 为 Black40，其他颜色自动 hover 为 Black100。 |
| href | `string` | — | 链接地址 |
| target | `string` | — | 链接打开方式 |
| rel | `string` | — | 链接关系 |
| disabled | `boolean` | false | 禁用状态；禁用后不响应 hover |
| hoverColor | `SnowUIColor \| string \| false` | — | hover 文字颜色。未传时使用 color 对应的自动 hover 色；`false` 表示 hover 不变色。trailing 装饰仍按规范执行 `opacity: 0.4 -> 1` |
| underline | `LinkUnderline` | "none" | 下划线显示策略。下划线只覆盖 Link 文字，不覆盖 trailing 装饰或 Icon |
| lines | `false \| 1` | false | 单行截断开关；启用后文字超出 Link 可用宽度时显示省略号 |
| tooltip | `TooltipProp` | — | 截断 Tooltip。默认仅在真实截断时显示完整文字；`false` 关闭；字符串 / Snippet 自定义内容；对象透传 Tooltip 配置 |
| onTruncate | `(isTruncated: boolean) => void` | — | 真实截断状态变化回调 |
| children | `Snippet` | — | 链接文字与可选外置槽位 |
| parts | `ComponentPartsOf<{ Tooltip: typeof Tooltip }>` | — | 配置默认内置 Tooltip；显式声明的 Tooltip 子项自行传入属性。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
