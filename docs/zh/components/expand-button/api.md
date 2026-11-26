# ExpandButton API

来源指纹：fddd0e47352262dd。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| expanded | `boolean` | — | 当前展开状态，支持 bind:expanded；未定义时使用 defaultExpanded。点击后写入新布尔值；内容区域由调用方显示或隐藏。 |
| defaultExpanded | `boolean` | false | expanded 未定义时的回退状态；首次点击后使用组件写入的 expanded，不再由此值驱动。 |
| ariaLabel | `string` | — | 未展开时按钮的可访问名称，应描述将要执行的展开动作；默认随 LocaleProvider 使用中文“展开”或英文“Expand”。 |
| collapseAriaLabel | `string` | — | 已展开时按钮的可访问名称，应描述将要执行的收起动作；默认随 LocaleProvider 使用中文“收起”或英文“Collapse”。 |
| icon | `Snippet` | —（arrows-out-simple） | 未展开时的自定义图标；只替换图形，展开状态与 aria-expanded 仍由组件管理。 |
| collapseIcon | `Snippet` | —（arrows-in-simple） | 已展开时的自定义图标；使用组件现有内容替换动效。 |
| children | `Snippet` | — | 图标后的自定义内容；不提供时启用 Button.iconOnly。组件不自动创建或控制展开面板。 |
| onExpandedChange | `(expanded: boolean) => void` | — | 点击切换后接收新状态，先于 onclick 调用；外部赋值不会触发。 |
| onclick | `(event: MouseEvent) => void` | — | 状态写入及 onExpandedChange 之后调用，不能取消已经完成的切换；禁用时不调用。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
