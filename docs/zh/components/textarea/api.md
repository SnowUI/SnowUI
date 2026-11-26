# Textarea API

来源指纹：e15bcdd0507a1736。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前文本，支持 `bind:value`。显式值优先于 defaultValue；输入与 change 时先同步绑定值，再调用对应事件回调。 |
| defaultValue | `string` | — | value 为 undefined 时的回退文本；首次输入后由 value 接管。它不是独立的原生 reset 协议；受控表单需要在 onreset 中恢复绑定初值。 |
| placeholder | `string` | — | 空值时的多行提示，可包含换行；不能代替可访问标签。 |
| maxCount | `number` | — | 建议字符上限，只驱动计数器和 exceeded，不阻止输入。以 JavaScript string.length 计数（UTF-16 代码单元）；hover 到组件时显示计数，不再使用 80% 阈值；严格超过上限时变红且持续显示。建议使用正整数；硬性输入限制另设 maxlength。 |
| exceeded | `boolean` | false | 由当前文本长度是否严格超过 maxCount 自动计算；支持 bind:exceeded 读取结果。未设置 maxCount 时为 false，传入值会被计算结果覆盖；不会自动设置 invalid。 |
| name | `string` | — | 原生表单字段名，提交时按此名称读取文本；禁用字段不进入 FormData。 |
| disabled | `boolean` | false | 禁用输入、原生表单提交与 Tab 聚焦，同时关闭缩放手柄；保留可见内容。 |
| readonly | `boolean` | false | 只读，保留聚焦、选择、复制与具名表单提交；关闭缩放手柄，忽略 rows，并使用只读内容布局。 |
| required | `boolean` | false | 启用原生必填校验；空值仅短暂红边闪动，无文字，结束恢复原态；业务文案使用 error。 |
| rows | `number` | 2 | 传给原生 textarea 的可见行数提示，使用正整数；readonly 时不传递。组件挂载、输入和外部值变化时还会按内容测高，因此它不锁定最终高度。 |
| cols | `number` | — | 传给原生 textarea 的字符列数提示，使用正整数；组件默认占满容器宽度，因此它不直接决定外壳宽度。配合 wrap="hard" 可影响提交时的换行。 |
| minlength | `number` | — | 原生最小文本长度约束，按 UTF-16 代码单元计数；不阻止输入。空值需要另设 required；原生 invalid 事件自动接入组件错误反馈。 |
| maxlength | `number` | — | 原生最大输入长度约束，按 UTF-16 代码单元计数；浏览器通常限制用户继续输入，但不会截断外部赋给 value / defaultValue 的文本。与 maxCount 分别控制输入限制和计数提示。 |
| wrap | `HTMLTextareaAttributes["wrap"]` | — | 原生换行策略：soft 在视觉上换行但不为提交补换行；hard 可按列宽为提交内容补换行；off 不自动折行。未设置使用浏览器默认 soft；组件未提供水平滚动条，长行编辑优先使用 soft。 |
| spellcheck | `boolean` | — | 传递浏览器拼写检查开关；未设置遵循浏览器与继承环境，实际词典由浏览器提供。 |
| autocomplete | `HTMLTextareaAttributes["autocomplete"]` | — | 原生自动填充提示，例如 street-address；候选依赖浏览器保存的数据，不由组件提供。 |
| enterkeyhint | `HTMLTextareaAttributes["enterkeyhint"]` | — | 移动端回车键标签提示，例如 done / enter / next；不绑定提交或跳转动作，呈现由输入法决定。 |
| inputmode | `HTMLTextareaAttributes["inputmode"]` | — | 软键盘模式提示，例如 text / numeric；不改变字符串值类型，也不自动校验输入格式。 |
| form | `string` | — | 关联同一文档内指定 id 的原生 form，使位于表单 DOM 外的文本域仍参与该表单提交。 |
| autofocus | `boolean` | — | 传给原生 textarea 的自动聚焦请求；是否执行由浏览器决定，建议在用户主动打开编辑区域时使用。 |
| tabindex | `number` | — | 原生 Tab 顺序；0 使用自然顺序，-1 跳过顺序导航但允许主动聚焦，正数指定优先级。普通表单建议保留自然顺序。 |
| title | `string` | — | 原生提示文本；浏览器决定如何显示，不替代可见标签或错误信息。 |
| id | `string` | — | 内部原生 textarea 的 id，用于 label for 和 ARIA 引用；同一文档内保持唯一。 |
| resize | `"none" \| "vertical" \| "horizontal" \| "both"` | "both" | 缩放方向：none 隐藏手柄，vertical 调整高度，horizontal 调整宽度，both 同时调整两者。readonly / disabled 强制使用 none；手柄默认最小宽 120px、高 60px。手动设置高度后停止自动内容测高。 |
| invalid | `boolean` | false | 业务错误态，与 aria-invalid 及原生校验反馈合并；仅设置本属性不触发校验或聚焦。maxCount 不触发原生校验，嵌入 Field 后由 Field 汇总视觉反馈。 |
| error | `string` | — | 业务校验错误文字，与 invalid 配合显示在输入框下方；原生校验反馈自动接入。 |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator }>` | — | 配置内置 Indicator，例如 step / largeStep 键盘步长、maxWidth / maxHeight 边界和 ariaLabel。只作用于组件生成的手柄；resize=none、readonly 或 disabled 时无手柄可配置。 |
| onclick | `(event: MouseEvent) => void` | — | 单击内部原生文本域时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| ondblclick | `(event: MouseEvent) => void` | — | 双击内部原生文本域时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oninput | `(event: Event) => void` | — | 用户输入改变内容时触发；调用前已同步绑定 value。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onchange | `(event: Event) => void` | — | 用户提交本次编辑时触发，通常在值改变后失焦；调用前已同步绑定 value。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onfocus | `(event: FocusEvent) => void` | — | 内部文本域获得焦点时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onblur | `(event: FocusEvent) => void` | — | 内部文本域失去焦点时触发。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 按下键盘按键时触发，可读取 key 等字段。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeyup | `(event: KeyboardEvent) => void` | — | 释放键盘按键时触发，可读取 key 等字段。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onkeypress | `(event: KeyboardEvent) => void` | — | 浏览器派发旧式 keypress 时触发；此原生事件已弃用，新代码优先使用 onkeydown。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| onpaste | `(event: ClipboardEvent) => void` | — | 粘贴时触发，可通过 clipboardData 读取此次剪贴板内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oncopy | `(event: ClipboardEvent) => void` | — | 复制选中文字时触发，可通过 clipboardData 设置此次复制内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |
| oncut | `(event: ClipboardEvent) => void` | — | 剪切选中文字时触发，可通过 clipboardData 设置此次剪切内容。参数为原生事件，currentTarget 为内部 textarea；返回值被忽略，需要取消可取消的默认行为时调用 event.preventDefault()。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
