# Checkbox API

来源指纹：107fe9d2b81f1985。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | false | 选中状态（双向绑定） |
| group | `any[]` | — | 多选值数组，配合 value 双向绑定 |
| value | `any` | — | 表单值 |
| size | `ResourceSize \| number` | — | 组件尺寸（像素，梯度与 Icon 一致：12/16/20/24/28/32/40/48/80） |
| required | `boolean` | false | 是否必须选中；空值提交仅短暂红边闪动，不显示文字。 |
| name | `string` | — | 内部原生 input 的表单字段名；Radio 使用同名分组。 |
| form | `string` | — | 关联表单元素的 id。 |
| disabled | `boolean` | false | 禁用状态 |
| indeterminate | `boolean` | false | 不确定状态（双向绑定） |
| onCheckedChange | `(checked: boolean) => void` | — | 原生复选状态变化后的回调 |
| ariaLabel | `string` | — | 无可见 label 时的无障碍名称 |
| children | `Snippet` | — | 标签内容 |
| singleLine | `boolean` | true | 默认标签与控件保持单行，附件不压缩；窄宽时原始标签可省略显示并保留完整可访问名称，不复制 children。复杂多行内容可显式设为 false，由该内容拥有布局。需要全文提示时组合 Text lines={1}。 |
| gap | `number` | — | 继承 Frame 的间距 Token 序号；省略时使用原组件间距，显式值覆盖组件间距。有效间距至少 4 CSS px，包含零值、根字号及 gap-scale 缩放；较大首选值保留。 |
| enableResponsive | `boolean` | false | 启用响应式 |
| enableContext | `boolean` | false | 启用上下文 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
