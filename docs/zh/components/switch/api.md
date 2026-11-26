# Switch API

来源指纹：dc77779e35699a63。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| checked | `boolean` | false | 开关状态，支持 `bind:checked`。点击标签或聚焦后按 Space 切换；绑定变量、可见轨道与原生输入状态同步。禁用时用户操作不改变状态。 |
| value | `any` | — | 传给内部原生 checkbox 的值，不决定开关状态，也不建立选择组。当前 `name` / `form` 等其余属性传给外层标签，不转发至内部 input，因此仅设置 `value` 不会产生具名表单提交项。 |
| size | `ResourceSize \| number` | — | 可见轨道高度，数字按根字号为 16px 时的名义 px 解析，外侧留白另计。支持 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 80 及其它有限正数；未传时依次读取父级尺寸 Context 的 `iconSize`、`size`，最后回退到 16。非法数字回退到默认尺寸 Token。显式值优先，随根字号缩放。 |
| required | `boolean` | false | 是否必须选中；空值提交仅短暂红边闪动，不显示文字。 |
| name | `string` | — | 内部原生 input 的表单字段名；Radio 使用同名分组。 |
| form | `string` | — | 关联表单元素的 id。 |
| disabled | `boolean` | false | 禁用原生输入及用户切换，保留当前开关值和标签，退出 Tab 顺序。外部仍可更新 `checked`。 |
| children | `Snippet` | — | 无参数标签内容，显示在轨道后；省略时不显示标签。标签文字同时为内部开关提供可访问名称，可通过内容 Snippet 组合文本。 |
| singleLine | `boolean` | true | 默认标签与控件保持单行，附件不压缩；窄宽时原始标签可省略显示并保留完整可访问名称，不复制 children。复杂多行内容可显式设为 false，由该内容拥有布局。需要全文提示时组合 Text lines={1}。 |
| gap | `number` | — | 继承 Frame 的间距 Token 序号；省略时使用原组件间距，显式值覆盖组件间距。有效间距至少 4 CSS px，包含零值、根字号及 gap-scale 缩放；较大首选值保留。 |
| enableResponsive | `boolean` | false | 传给根 Frame，启用其容器内容适配监听；不改变 Switch 的标准尺寸值域。通用行为见 [Frame 能力开关](../frame/reference.md)。 |
| enableContext | `boolean` | false | 传给根 Frame，控制向子组件提供状态、加载与动效等 Context；不控制 Switch 读取父级尺寸 Context。通用行为见 [Frame 能力开关](../frame/reference.md)。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
