# Input

> **版本**: v1.2.0
> **职责**: 提供单行输入，支持文本、搜索、密码、数字、日期时间与颜色，可组合标签、图标和校验反馈。
> **包归属**: `@snowui-design-system/components`

## 组件介绍

提供单行输入，支持文本、搜索、密码、数字、日期时间与颜色，可组合标签、图标和校验反馈。

## 使用选择

<!-- usage-guide:start -->
用于单行文本输入。搜索用 SearchInput，多行输入用 Textarea；需要 label、帮助和错误时组合 Field。

- `bind:value` 同步编辑值，显式 value 优先于 defaultValue；数字类型输入后的值仍需业务自行转换。
- name 用于表单提交，受控表单重置时恢复绑定初值；bind:element 得到外层元素，不能当作原生 input。
- file / range 不提供上传或滑杆能力；附件用 leading / trailing 角色，清除按钮可接管 trailing。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Input, Button } from '@snowui-design-system/components';
	let submitted = $state(false);
	function login(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
	}
</script>

<form onsubmit={login} oninput={() => submitted = false} style="display: flex; flex-direction: column; gap: var(--gap-4); width: min(100%, 22.5rem); min-width: 0;">
	<Input type="email" name="email" aria-label="Email" placeholder="Email" autocomplete="username" required />
	<Input type="password" name="password" aria-label="Password" placeholder="Password" autocomplete="current-password" required />
	<Button type="submit" variant="filled" size="md">Log in</Button>
</form>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| element | `HTMLElement` | — | 外层 Frame 根元素引用，支持 bind:element；不是原生 input 引用。 |
| type | `HTMLInputAttributes["type"]` | `"text"` | 选择单行输入类型；支持 text、search、email、password、url、tel、number、date、time、datetime-local、month、week、color。日期时间和颜色具有组件展示层及原生值宿主；file / range 会回退为 text，不提供上传或滑杆。 |
| gap | `number` | — | 继承 Frame 的间距 token 索引；省略时保留组件原首选间距，显式值覆盖首选间距，有效图文间距仍至少为 4 CSS px；显式零和根字号／间距缩放不压低下限。 |
| value | `InputValue` | — | 当前值，支持 bind:value 双向同步；显式 value 优先于 defaultValue。原生编辑和内置清除事件同步 input.value 字符串；number 可使用数字初值，业务计算需自行转换。 |
| defaultValue | `InputValue` | — | 未传 value 时的初始值；输入后的值由组件同步管理；表单重置若需恢复业务初值，应在 onreset 中显式恢复绑定值。 |
| placeholder | `string` | — | 空输入的提示文字，不替代可访问标签；日期时间输入保留分段占位。 |
| name | `string` | — | 原生表单字段名；FormData 使用该名称收集字段。 |
| disabled | `boolean` | `false` | 禁止用户输入与交互，原生禁用字段不参与表单提交。 |
| readonly | `boolean` | `false` | 保留聚焦、选择与提交，禁止编辑并隐藏清除入口；自定义 trailing 聚焦后仍保留，使用只读视觉。 |
| clearable | `boolean` | `true` | 是否允许显示内置清除 X；false 时不渲染 X，不改变编辑、校验或自定义 trailing。密码输入使用显示／隐藏按钮，不显示清除 X。适用于普通及 Field 内嵌 Input。 |
| required | `boolean` | `false` | 参与原生必填校验；空值提交仅短暂红色边框闪动，不显示文字，结束恢复原态，保留聚焦光圈颜色。 |
| autocomplete | `HTMLInputAttributes["autocomplete"]` | — | 透传浏览器自动填充字段语义，如 username、email、new-password；候选来自浏览器已有数据。 |
| minlength | `number` | — | 适用文本输入的最小字符长度，由浏览器在适用的用户编辑和表单校验路径执行。 |
| maxlength | `number` | — | 适用文本输入的最大字符长度；浮层 as="search" 未显式设置时回退为 100。 |
| pattern | `string` | — | 适用文本输入的原生校验正则，不包含斜杠；需要整体匹配，空值是否有效由 required 决定。 |
| min | `number \| string` | — | 数字或日期时间输入的最小值；数字按输入数值，日期时间按对应原生格式表达。 |
| max | `number \| string` | — | 数字或日期时间输入的最大值；数字按输入数值，日期时间按对应原生格式表达。 |
| step | `number \| string` | — | 原生步进约束；number 以数值单位步进，日期时间使用浏览器对应类型的步进单位。 |
| inputmode | `HTMLInputAttributes["inputmode"]` | — | 向设备提示软键盘类型，如 numeric、decimal、tel；不执行输入过滤或校验。 |
| enterkeyhint | `HTMLInputAttributes["enterkeyhint"]` | — | 向软键盘提示回车动作，如 next、search、done；不自动执行导航或提交。 |
| spellcheck | `boolean` | — | 透传拼写检查开关；未指定时遵循浏览器与继承环境。 |
| list | `string` | — | 关联原生 datalist 的 id，候选与浏览器呈现由调用方和浏览器提供。 |
| accept | `string` | — | 保留的原生属性透传入口；Input 不支持 file，不能通过此属性获得文件类型限制或上传能力。 |
| multiple | `boolean` | — | 原生多值提示，适用于 email 多邮箱等浏览器支持的输入；Input 不支持多文件上传。 |
| capture | `boolean \| "user" \| "environment"` | — | 保留的原生采集属性；由于 file 会回退为 text，在 Input 中不提供相机或文件采集能力。 |
| form | `string` | — | 按 id 关联外部 form；原生提交与重置包含该字段，不要求字段位于 form 内。 |
| autofocus | `boolean` | — | 普通输入透传原生自动聚焦提示，浏览器可能保留已有焦点；日期时间展示层在首次挂载主动聚焦首段。避免页面加载抢焦点。 |
| tabindex | `number` | — | 透传原生焦点顺序；0 使用自然顺序，-1 退出顺序导航，正数定义显式顺序。常规表单推荐自然顺序。 |
| title | `string` | — | 原生提示文字；日期时间与颜色输入同时为展示层提供相应提示，不替代 label。 |
| id | `string` | — | 原生输入标识，可供 label 的 for 与原生关联属性引用。 |
| invalid | `boolean` | `false` | 与 aria-invalid 汇总无效态，显示错误视觉；独立输入自动错误反馈，Field 内由 Field 汇总。 |
| error | `string \| Snippet` | — | 业务 invalid 时生成下方内置错误 Text；原生校验失败无需手工传入 error；字符串为文案，Snippet 无参数并提供错误内容，默认不生成。 |
| parts | `ComponentPartsOf<{ Text: typeof Text; Button: typeof Button }>` | — | 通过 Text / Button 键配置内置错误文案或操作按钮的公开 Props，仅对组件生成的 Text 生效；显式子项自行声明 Props。 |
| onclick | `(event: MouseEvent) => void` | — | 单击原生输入或相应展示层时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| ondblclick | `(event: MouseEvent) => void` | — | 双击时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| oninput | `(event: Event) => void` | — | 用户输入以及组件清除、步进等输入同步时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onchange | `(event: Event) => void` | — | 原生提交值变化或组件发出 change 同步时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onfocus | `(event: FocusEvent) => void` | — | 输入获得焦点时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onblur | `(event: FocusEvent) => void` | — | 输入失去焦点时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 按下键盘按键时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onkeyup | `(event: KeyboardEvent) => void` | — | 释放键盘按键时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onkeypress | `(event: KeyboardEvent) => void` | — | 浏览器触发已弃用的 keypress 时；新代码推荐 onkeydown回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| onpaste | `(event: ClipboardEvent) => void` | — | 粘贴时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| oncopy | `(event: ClipboardEvent) => void` | — | 复制时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| oncut | `(event: ClipboardEvent) => void` | — | 剪切时回调，参数为对应事件，无返回值；可取消的浏览器默认行为使用 event.preventDefault()，回调不用于撤销已经执行的组件内部值同步。 |
| children | `Snippet` | — | 无参数显式子内容，用 as="leading" / as="trailing" 组合图标或附件；清除可见时接管 trailing 位置。 |
| allowCustomValue | `boolean` | `false` | 仅 as="search" 位于 Listbox 时生效；无匹配时 Enter 将输入添加为自定义项并选中，支持删除自定义项。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

### 原生表单校验反馈与尺寸边界

原生校验失败时取消浏览器气泡，并保持无效提交拦截。空值必填只短暂闪动红边、不显示文字，结束恢复原态；非空类型、长度和格式错误将 `validationMessage` 显示在组件下方。首个无效字段获得焦点；输入修正后更新反馈，表单重置清除反馈。调用方业务校验继续使用 `invalid` 与 `error`，原生错误存在时优先显示原生反馈。

最小宽度按内容区、附件、间距与内边距计算；内容区至少保留 1em。fill 在下限以上生效，父容器不足时需调整布局或提供横向滚动。

### 表单组合、间距与布局模型

主布局模型：**槽位宿主布局**（见 [LayoutProtocol.md](../../../docs/standards/LayoutProtocol.md)）。根节点为固定单行 `Frame row`（`Leading` / `Control` / `Trailing`），有效图文间距至少 `4 CSS px`。

- **独立使用**：Input 自带 `12px / 16px` 内边距与 `8px` 间距。
- **嵌入 `Field`（无 `as="segment"`）**：由外层 `Field` 统一提供 `12px / 16px` 内边距与外框，Input 去除自身内边距并保留内部槽位间距；前置／后置图标直接作为 `Field` 子项声明 `as="leading"` / `as="trailing"`；错误反馈作为 `Field` 独立整行呈现，并由 `Field` 汇总播放错误 shake。
- **连续分段（`Input as="segment"`）**：保留自身 `12px / 16px` 内边距，附件直接放入 `Input` 内部，相邻 `segment` 共享单条分割线。
- **类型与尾部图标优先级**：`type="password"` 默认提供显示／隐藏切换按钮（无清除 X）；文字系输入在 `clearable=true`、非空且 `focus-within` 时显示内置清除 X，优先级高于内置 Warning 图标与外置 `trailing`；`type="number"` 右侧显示内置上下步进器；`type="color"` 与日期时间类型采用可见展示层同步隐藏原生宿主。
- **浮层搜索模式（`as="search"`）**：放入 `Listbox` 或 `Popover` 时自动移入固定头部并关闭外扩聚焦环，默认 `maxlength=100`；在 `Listbox` 内实时驱动 `filterText`，配合 `allowCustomValue` 可按 `Enter` 添加自定义项。
- **可复制链接提示**：展示不可编辑的可打开／可复制 URL 请使用 [CopyLink](CopyLink.md)，不要用只读 Input 模拟。

### 使用示例

```svelte
<!-- Recommended: inside Field with leading / trailing -->
<Field>
  <Icon as="leading"><Search /></Icon>
  <Input placeholder="搜索内容" />
  <Button as="trailing" size="sm">搜索</Button>
</Field>

<!-- Date input with custom trailing trigger -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- Associate with an external form via form id -->
<form id="external-form"></form>
<Input form="external-form" name="displayName" />

<!-- Search filter inside Select Listbox -->
<Select placeholder="请选择或输入">
  <Listbox>
    <Input as="search" allowCustomValue placeholder="搜索或输入新选项..." />
    <MenuItem value="tag-a">Tag A</MenuItem>
  </Listbox>
</Select>

<!-- Complex leading + trailing attachments -->
<ScrollArea axis="horizontal" ariaLabel="Input with attachments" width="100%">
<Input minWidth={240} as="segment">
  <Frame as="leading" singleLine>
    <Icon as="leading"><Search /></Icon>
    <Text lines={1}>Filter</Text>
  </Frame>
  <Frame as="trailing" singleLine>
    <Text class="text-black-40" lines={1}>Ctrl K</Text>
    <Icon as="trailing"><XCircle /></Icon>
  </Frame>
</Input>
</ScrollArea>
```

## AI Zone

- **实现与共享逻辑**：位于 [Input.svelte](Input.svelte)，继承 [Frame.svelte](Frame.svelte)（`enableResponsive=true`、`enableContext=true`、`enableScaleObserver=false`），复用 [frame-prop-filter.ts](../logic/frame-prop-filter.ts)、[frame-field-control.ts](../logic/frame-field-control.ts) 与 [context.ts](../context.ts)。
- **宿主与视觉契约**：独立模式挂载 `.snowui-field-bordered`（默认 `var(--surface-1)`，只读 `var(--surface-2)` 无边框）；`Field` 嵌入模式切换为 `.snowui-field-host` 并通过 `data-field-control="input"` 与 `data-readonly` 向父容器上报状态。可见原生 `<input>` 接入 `.snowui-native-control`。

## 更新日志

### v1.2.0 (2026-10-23)

- 2026-10-23：复杂附件中的图形／短标签示例复用 Frame 单行与 Text 全文缩略；仅文档修订，宿主、清除和选择协议保持。
- 内部单行图文间距统一解析，包含嵌入 Field 的实际网格宿主；显式零与缩放保持 4 CSS px 下限，保留日期分段和绘制结构的内部间距。
- 由 Input 提供实际内容状态，供 SearchInput 折叠使用；清除按钮的可用状态仍独立遵守 disabled、readonly 和 clearable。

### v1.1.5 (2026-09-27)

- 2026-10-05：日期分段聚焦与选中背景、全局文字与输入选区统一使用 Brand 40%，保留原有前景色与交互。
- 只读与禁用输入不再进入清除接管状态，避免聚焦只读输入时误隐藏自定义 trailing 复制按钮。
- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

### v1.1.4 (2026-09-12)

- 修复带附件的 Input 在固定高度下内容偏上：单行 Grid 使用 `align-content: center`，SearchInput 同步继承；默认自适应高度不变。

完整历史见 [更新日志归档](../../docs/history/changelogs/Input.history.md)。
