# Segmented API

来源指纹：9cc83718ae326e39。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前选项的唯一值，支持 `bind:value`；点击或方向键激活选项时更新。未指定或没有匹配项时，视觉回退到首个可用项，但不会自动写回绑定值；表单场景应显式初始化。 |
| name | `string` | — | 非空时输出同名隐藏字段，原生 FormData 读取当前 value；未定义值提交为空字符串。需置于表单内部；业务绑定初值的恢复由调用方在 reset 时处理。 |
| children | `Snippet` | — | 无参数的显式子项内容，使用 Button as="item" 与唯一 value；优先于 items，逐项直接配置 Button Props。 |
| class | `string` | "" | 合并到真实 Tab 根节点的外部 class，保留 Segmented 自身标识；不作用于隐藏表单字段。 |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 通过 parts.Button 批量配置 items 模式生成的 Button，例如 scaleOnHover；不覆盖显式 children 子项，不提供 parts.Tab。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
