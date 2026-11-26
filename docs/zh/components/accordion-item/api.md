# AccordionItem API

来源指纹：4cfc63d25703bbbc。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | —（必填） | 当前折叠项的稳定标识，在同一 Accordion 内应唯一；与父级 value/defaultValue 匹配，不是可独立绑定的展开布尔值。 |
| disabled | `boolean` | false | 禁用当前项的标题和正文收起交互；父级 Accordion.disabled 也会禁用此项，不能由此处 false 解除。 |
| children | `Snippet` | — | 声明直系 Frame as="title" 与 Frame as="content"；标题内直系 as="trailing" 可替换默认展开图标。必须在 Accordion 内使用。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
