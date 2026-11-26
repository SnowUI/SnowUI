# SelectButton API

来源指纹：8e54631002b72b14。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `SelectValue` | — | 当前选中值（string、number 或 undefined），支持 bind:value；优先于 defaultValue，实际选项选择写入字符串。action 模式不保存选择。 |
| defaultValue | `SelectValue` | — | value 未定义时的回退选中值；仅 persistent 模式用于选择显示，首次选择后由 value 驱动。 |
| options | `SelectOption[]` | [] | 选项数据：每项包含字符串 value、label 及可选 disabled；默认生成 MenuItem。显式 children 提供列表时使用其选项注册。 |
| placeholder | `string` | — | 未选中时的提示文字；action 模式触发器始终显示该文字。没有 label、选项文字或 placeholder 时触发器文字为空。 |
| name | `string` | — | 表单字段名；仅提供非空 name 时创建 hidden input，提交当前选中值的字符串形式。 |
| form | `string` | — | hidden input 所属表单的 id，可关联组件外部表单；仅设置 name 生成输入后生效。 |
| required | `boolean` | false | 传入 Select 的必填标记；持久选择模式阻止空值提交并短暂红边闪动，无文字；action 模式不要求保留选中值。 |
| disabled | `boolean` | false | 禁用触发按钮并阻止打开或切换选项；当前 hidden input 不随该标记禁用，已有值仍可随表单提交。 |
| readonly | `boolean` | false | 阻止用户通过触发器打开或改变选项，保留显示与外部 value 更新；不会禁用 hidden input。 |
| invalid | `boolean` | false | 将无效状态传给 Select wrapper；当前 Button 触发器不自动增加错误边框或 aria-invalid，不能代替业务校验与错误说明。 |
| ariaLabel | `string` | — | 触发 Button 的可访问名称；不提供可见 label 时应设置。 |
| showIndicator | `boolean` | true | 显示下拉指示器；false 时连同自定义 indicator 一起隐藏，选择能力不受影响。 |
| search | `boolean` | false | 开启默认 Listbox 内置搜索；parts.Listbox.search 可覆盖。显式 children 模式应在自己的 Listbox 上配置搜索。 |
| selectionMode | `"persistent" \| "action"` | "persistent" | persistent 保存选中值并显示选项文字；action 只触发 onAction、关闭列表且保持 placeholder，不更新 value 或触发 onchange。 |
| label | `Snippet<[SelectButtonLabelContext]>` | — | 替换触发器文字；参数包含 value、option、label、placeholder，保留指示器和按钮交互。 |
| indicator | `Snippet<[SelectButtonIndicatorContext]>` | — | 替换指示图形，参数为 open、disabled；仅 showIndicator=true 时渲染。 |
| children | `Snippet` | — | 显式 Listbox/MenuItem 内容，替换默认列表；不作为按钮文字使用，文字定制请用 label。 |
| parts | `ComponentPartsOf<{ Listbox: typeof Listbox; Input: typeof Input; MenuItem: typeof MenuItem; Tooltip: typeof Tooltip; }>` | — | 配置默认内建列表、搜索输入、选项与触发按钮内置 Tooltip；不提供 parts.Button，按钮样式与 `tooltip` 开关在根级传入。显式 children 自行配置所属子项。 |
| onchange | `(event: Event) => void` | — | persistent 模式选中不同值后调用，参数为 change Event；用 bind:value 读取新值，重复选择与 action 模式不触发。 |
| onAction | `(value: string) => void` | — | 仅 action 模式在执行选项后接收其 value；列表随后保持关闭，组件不保存选中值。 |
| onclick | `(event: MouseEvent) => void` | — | 触发器完成打开或关闭后调用；disabled/readonly 时不调用，不能通过 preventDefault() 撤销已执行的切换。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 组件处理方向键、Enter、Escape 等选择键盘逻辑后调用；readonly 分支也会转交按键，不能据此取消已发生的内部操作。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
