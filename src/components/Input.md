# Input

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.2.0
> **职责**: 提供单行输入，支持文本、搜索、密码、数字、日期时间与颜色，可组合标签、图标和校验反馈。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

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
| required | `boolean` | `false` | 参与浏览器原生必填校验；不自动产生业务错误文案。 |
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
| error | `string \| Snippet` | — | invalid 时生成下方内置错误 Text；字符串为文案，Snippet 无参数并提供错误内容，默认不生成。 |
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

<a id="2026-04-04-表单样式规则"></a>

### 表单组合与间距

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Input` 单独使用时：组件自身带 `12 / 16` padding 和 `8` gap
- icon 位置由 `Input` 自己控制：leading / trailing icon 到最近可见内边界默认都是 `16px`
- `type="password"` 默认在 trailing 提供显示／隐藏密码的眼睛按钮，不提供清除 X；调用方提供 trailing 内容时由调用方接管该区域。密码强度提示单独使用 `PasswordStrength`，不强制所有密码框显示。
- 错误态内建 warning icon 也走同一条 trailing icon 规则，不额外使用 overlay 偏移
- 放进 `Field` 后，先看有没有 `as="segment"`
- 没有 `as="segment"`：由外层 `Field` 负责 `12 / 16` padding 与 `8` gap；`Input` 去掉自身 padding，但保留自身 gap
- 有 `as="segment"`：这是连续字段表面的一段；保留 `Input` 自身的 padding 与 gap，同时继续由 `Input` 保证 icon 到边框 / 分割线的距离为 `16px`
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description / error` 不负责 padding、gap、分割线，它们只是内容元素
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`

<a id="组件定位"></a>

### 组件定位

`Input` 现在的推荐定位是字段宿主，而不是完整字段外壳：

- 单独使用时，仍可保持兼容性的默认输入框表现
- 放进 `Field` 容器后，未标 `segment` 时由外层 `Field` 接管 padding 与 gap；只有标记为 `segment` 时才保留 `Input` 自身留白
- 因此 `Input` 可以和 `Icon / Text / Checkbox / Switch / Badge / Frame as="row"` 一起组合成更复杂的表单表面
- 其中 `text` 直接使用可见原生 `<input>`；`date` / `color` 仍保留“可见展示层 + 隐藏原生宿主同步值”的结构

<a id="frame-能力继承"></a>

### Frame 能力继承

`Input` 仍然通过外层 `Frame` 承接通用能力，因此可以继续使用：

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

`Input` 的职责不是替代 `Frame`，而是在 `Frame` 外壳内承接输入协议。
对于 `text`，组件直接复用原生 `<input>` 的可见渲染与事件链路；对于 `date` / `color`，组件会把“值同步、表单归属、picker 打开”交给隐藏原生宿主，把“可见文本/颜色展示”交给自定义展示层。

### 错误反馈 Shake

`invalid` 表示稳定错误视觉：红色边框、`aria-invalid` 与内建 warning icon。输入错误时的一次性 shake 已默认接入，消费方不需要传额外 prop，也不需要知道内部 CSS 类名。

推荐写法保持为普通错误态：

```svelte
<Input
    invalid
    placeholder="name@example.com"
/>
```

独立 `Input` 遇到 `invalid / aria-invalid` 会自动播放 shake。进入 `Field` 后，`Input` 不单独抖动，由外层 `Field` 汇总错误态并整体反馈，避免嵌套位移叠加。

错误态与 shake 不会自动聚焦，也不会模拟 `focus-within`；焦点态只来自用户真实聚焦、显式 `autofocus` 或业务代码主动调用 `focus()`。

<a id="组件特有属性-component-specific-props"></a>

### 组件特有属性 (Component-Specific Props)

下表逐项对应具名 Props；未重新声明的通用能力见 [Frame](Frame.md)。

<a id="宿主协议"></a>

### 布局模型

主布局模型：**槽位宿主布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.3](../../../docs/standards/LayoutProtocol.md)。

根宿主固定采用单行内容协议，Leading / Control / Trailing 之间的有效间距至少为 4 CSS px；显式 gap={0}、根字号或间距缩放不会压低该下限，较大的原有首选间距保持。Field 只编排外部区域与连续字段表面，不改写 Input 自己的内部布局或附件间距。日期分段、颜色文本与绘制结构的内部零间距不受影响。

Input 的根布局固定按 Leading / Control / Trailing 三段组织：

- 根节点是 `Frame row`，并在组件内部固定启用 `enableAutoLayout`；外部传入 `enableAutoLayout={false}` 不关闭 Input 的内部槽位协议。
- 直系 `as="leading"` / `as="trailing"` 支持复杂结构，Leading 与 Trailing 为 Hug。
- 原生 `<input>` 或自定义 date/color 可见层是 Content，负责 Fill，必须保持 `min-width: 0`。
- 自定义 trailing 存在时替换默认日期/清除等末位槽；内建 warning icon 仍按组件内部 trailing 规则处理。
- 进入 `Field` 后，Field 只接管字段表面、padding 与分割线；Input 内部 icon / control 的最终落列仍由 Input 自己维护。

<a id="浮层搜索输入模式"></a>

### 浮层搜索输入模式

将 `<Input as="search">` 放入任意提供 header portal 的浮层容器(`<Listbox>` / `<Popover>`)内,Input 自动:

1. 通过 `LISTBOX_HEADER_PORTAL_KEY` context 读取 headerEl,挂载后 `appendChild` 到固定头部(不参与下方滚动);
2. 应用紧凑浮层规格(`padding/gap/radius`);
3. `:focus-within` 时关闭外扩 focus ring(`--snowui-field-focus-ring-width: 0rem`);
4. 未显式 `maxlength` 时默认 100。

`Listbox` 场景额外接通 `ListboxOwnerContext.setFilterText` 过滤逻辑(由 `listboxOwner` 派生量 `isListboxSearch` 控制);`Popover` 场景仅承担"固定头部输入框"的视觉与移位,无过滤副作用。

样式选择器统一为 `:where(.snowui-quick-action-panel-header > .snowui-input, .snowui-listbox-header > .snowui-input, .snowui-listbox > .snowui-input, ...)`,避免各浮层重复覆盖。

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `as` | `"search"` | - | 标识为浮层搜索输入;存在 header portal 时自动移入固定头部,Listbox 场景下额外接通 `setFilterText` |

### 行为说明

- 搜索文本通过 `oninput` 实时写入 `ListboxOwnerContext.filterText`，由 Select 的 `filteredOptions` derived 做大小写不敏感过滤
- 自定义项（`allowCustomValue` 添加的）**不参与过滤**，始终显示
- Listbox 关闭时 Input 值与 filterText 同步清零
- 自定义项 hover 时，✔ 图标位置替换为 × 圆形删除按钮（复用 Input 的清除按钮 SVG）；点击 × 删除该自定义项，若该项为当前选中值则同时清空选中

### 使用示例

```svelte
<!-- 仅过滤，不允许自定义 -->
<Select placeholder="请选择城市">
    <Listbox>
        <Input as="search" placeholder="搜索..." />
        <MenuItem value="shanghai">Shanghai</MenuItem>
        <MenuItem value="hangzhou">Hangzhou</MenuItem>
    </Listbox>
</Select>

<!-- 过滤 + 允许自定义输入 -->
<Select placeholder="请选择或输入">
    <Listbox>
        <Input as="search" allowCustomValue placeholder="搜索或输入新选项..." />
        <MenuItem value="tag-a">Tag A</MenuItem>
        <MenuItem value="tag-b">Tag B</MenuItem>
    </Listbox>
</Select>

<!-- 限制高度 -->
<Select placeholder="请选择城市">
    <Listbox style="max-height: 120px;">
        <Input as="search" placeholder="搜索..." />
        ...
    </Listbox>
</Select>
```

<a id="原生能力边界"></a>

### 原生能力边界

`Input` 负责：

- 原生 `<input>` 属性透传
- `value / defaultValue` 解析
- `bind:value` 同步
- `aria-invalid` 与组件 `invalid` 汇总

`Input` 不负责：

- label / description 的完整字段排版（可组合 Field）；error 可由公开 error 属性生成内置反馈
- 自动补全数据源生成
- 表单规则中心
- 业务级错误文案

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- 推荐：放入 Field -->
<Field>
  <Input placeholder="请输入内容" />
</Field>

<!-- 组合 leading / trailing -->
<Field>
  <Icon as="leading"><Search /></Icon>
  <Input placeholder="搜索内容" />
  <Button as="trailing" size="sm">搜索</Button>
</Field>

<!-- 日期输入 + 自定义 trailing 触发器（简单场景自动推断） -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- 日期输入 + 自定义 trailing 触发器（复杂场景使用局部 row） -->
<Field>
  <Frame as="row" row>
    <Input type="date" />
    <Button bare as="trailing" aria-label="打开日期选择">
      <ArrowLineDown size={16} />
    </Button>
  </Frame>
</Field>

<!-- 邮箱输入 -->
<Input type="email" name="email" autocomplete="email" />

<!-- 必填 + 原生校验 -->
<Input required minlength={3} maxlength={20} pattern="[a-zA-Z0-9_]+" />

<!-- 与表单联动 -->
<form>
  <Input name="username" defaultValue="snowui" />
</form>

<!-- 通过 form 属性归属外部表单 -->
<form id="CSS 行为-form"></form>
<Input form="CSS 行为-form" name="displayName" />

<!-- 继承 Frame 能力 -->
<Input
  Click={{ Idle: "Active", Active: "Idle" }}
  stateStyle={{
    Idle: "--snowui-input-background: var(--surface-1, #ffffffcc);",
    Active:
      "--snowui-input-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
  }}
  value="点击输入框触发 Frame 状态"
/>
```

<a id="与通用逻辑的关系"></a>

### 展示可打开、可复制的链接

“链接输入框 / 链接 input / 可复制链接”不是可编辑输入。使用 [CopyLink](CopyLink.md)，无边框和输入框 hover 动效；链接文字 hover 显示下划线、点击在新标签页打开，其余区域点击复制。完整组合约定见 [自然语言映射](../../../docs/reference/NaturalLanguageToSnowUI.md)。Input 保留给需要编辑地址或只读选择值的场景。

### 无障碍与表单建议

- 需要自动填充时，优先传 `name + autocomplete`
- 需要原生建议列表时，使用 `list` 关联 `datalist`
- 需要错误提示时，外部通过 `aria-describedby` 指向 `Field` 内的描述/错误节点
- 需要 schema/业务校验时，应在 `Field` 或表单层处理，再把结果回传为 `invalid` 或 `aria-invalid`

---



## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 宿主协议

`Input` 有两种工作模式：

- 独立模式：`.snowui-field-bordered`，兼容历史用法，自己带默认字段外壳
- 容器模式：检测到 `Field` 上下文后，切到 host 模式，只保留输入宿主，不再重复渲染边框、背景和 focus ring

嵌入态的根及原生输入控件保持透明。Field 与独立 Input 的默认背景均为 `surface-1`；只读输入通过 `data-field-control="input"` 与 `data-readonly` 暴露状态，由 Field 自己绘制 `surface-2` 背景，Input 不再反向定义父容器样式。

容器模式下：

- 根节点会带上 `.snowui-field-host`
- 根节点会退化为 `.snowui-field-host`，不再携带 `.snowui-field-bordered`
- 未标 `segment` 时，`Input` 去掉自身 padding（由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap），但保留自身 gap
- 标了 `segment` 时，保留 `Input` 自身的 padding 与 gap，作为连续字段表面的一段
- 不论是否处于 `Field` 中，leading / trailing icon 的最终落点都由 `Input` 自身维护；`segment` 场景下 icon 到最近边框或分割线仍保持 `16px`
- `invalid / readonly / disabled` 仍会透出给容器汇总

<a id="布局模型"></a>


### 与通用逻辑的关系

`Input` 当前优先复用以下通用逻辑，而不是在组件内平行实现：

- [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)：拆分 `Frame props` 与宿主 props
- [../logic/frame-field-control.ts](../logic/frame-field-control.ts)：统一值解析、无效态归一和值同步
- [../context.ts](../context.ts)：检测 `Field` 上下文，切换宿主/独立模式

后续 `SearchField / Combobox / PasswordField` 应优先复用这条链路，而不是重新写一套 host 分发逻辑。

<a id="无障碍与表单建议"></a>



> **2026-09-12 v1.1.4**：输入表面显式使用 `align-content: center`。带 leading / trailing 的单行 Grid 在指定 height / min-height 时整体垂直居中，避免通用自动布局的 flex-start 将剩余空间堆到下方；SearchInput 同步继承此修复，默认自适应高度不变。

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。`parts.Button` 配置默认内置操作按钮（包含 size、class、style），功能事件、ARIA和角色仍由父组件控制。


> **2026-09-11 修复**：分段键盘输入保留未完成草稿，组件自产的 input 通知不重新解析为空值；默认 loading 骨架使用输入表面的完整高度，不重复叠加内容 padding。




**2026-04-27 补充**: 内建清除 X 恢复为焦点态交互：只有输入内容非空且 `Input` 处于 `focus-within` 时显示；失焦后隐藏且不为隐藏 X 预留额外 gap。

**2026-04-25 补充**: 独立 `Input` 只有内建清除按钮时，未显示 X 的隐藏态不应为按钮预留 `gap`；左右可输入区域应保持同一套 `16px` 内边距。焦点态显示 X 时再恢复 `8px` gap 与按钮列。

**2026-04-20 新增**: `as="search"` — 放入 `<Listbox>` 内时自动接入过滤逻辑；配合 `allowCustomValue` prop 可在无匹配时按 Enter 将输入内容作为自定义选项添加并选中。

**2026-04-09 图标规则补充**: `Input` 内建 error trailing icon，以及放在 `Input` 里的前置 / 后置 icon，位置优先由 `Input` 自身控制。默认要求是 icon 到最近可见内边界保持 `16px`；进入 `Field` 后仍沿用这条规则。若 `Input as="segment"` 处于连续字段表面中，icon 到最近边框或分割线的距离仍保持 `16px`，不因为 `Field` 组合而改成新的偏移规则。
**2026-04-09 补充**: 根据需求文档中 F-01 的期望 HTML，`type="text"` 已回收为可见原生 `<input>`，不再额外渲染自定义 editor / placeholder 覆盖层；`Field > Input` 的结构收敛为 `div > input`，placeholder 与输入内容共同走浏览器原生单行输入排版。
**2026-08-12 更正**: `Input` 单独使用时的源码默认 padding 为 `12 / 16`；此前文档中的 `12 / 12` 为记录错误。进入 `Field` 后仍由 Field 的既有 `12 / 16` 规则接管。
**2026-03-29 补充**: 当 `type="text"` 同时声明 `list` 时，`Input` 会回退为可见原生 `<input>`，以保留浏览器原生 `datalist` 建议项。
**2026-03-29 补充**: `type="file"` 已从 `Input` 组件支持范围中移除；传入该类型时会回退为普通 `text` 输入，不再透传浏览器原生文件上传器。
**2026-03-28 补充**: `type="range"` 已从 `Input` 组件支持范围中移除；传入该类型时会回退为普通 `text` 输入，不再直接透传浏览器原生滑杆。
**2026-03-24 补充**: `type="number"` 的默认 stepper 现在与 `Button bare` 单 Icon 版本共享同一档 `sm` 级按钮高度基准；默认上下箭头不再比自定义 bare 方案更高。
**2026-03-25 补充**: `type="color"` 默认会显示 Figma 对应的“色点 + # + HEX”展示层，真实值仍由隐藏原生 color input 负责同步。

**继承**: 复用 Frame.svelte 的所有通用能力（状态、动效、响应式、Skeleton、样式编排）。
**推荐容器**: `Field.svelte`。
**默认能力开关**: `enableResponsive=true`, `enableContext=true`, `enableScaleObserver=false`。

可见原生 `<input>` 显式接入 `layout.css` 的 `.snowui-native-control`，只归一化 box sizing、margin 并继承消费环境的字体与颜色；Input 自身字号、行高、Padding、边框和状态视觉不依赖可选的 `snowui-base.css`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. 基础几何

| 项目 | 值 |
| :--- | :--- |
| 圆角 | `var(--radius-4)` |
| 左右内边距 | `var(--padding-4)` |
| 上下内边距 | `var(--padding-3)` |
| 默认间距 | `var(--gap-2)` |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14)` |
| 默认背景 | `var(--surface-1)` |
| 默认边框 | `inset 0 0 0 var(--border-1) var(--black-20)` |
| placeholder / 日期空态文案颜色 | `var(--black-20)` |

### 2. 视觉链路

| 状态 | 规则 |
| :--- | :--- |
| 默认 | `Background/3` + `Black/20%` 的 `0.5px` 内边框 |
| Hover | 通过 `field-bordered 工具类` 的 hover 链路生效，默认维持 `Black/20%` 内边框 |
| Focus Within | 通过 `field-bordered 工具类` 的 focus-within 链路生效，切到 `Black/40%` 内边框，并显示 `Black/4%` 的 `4px` focus ring |
| Invalid | 组件层改写为 `--secondary-red` 链路；共享 field-bordered 错误外壳的聚焦环使用同色 4% 透明度，Field 汇总子宿主错误时同样生效 |
| Disabled | 统一使用 Frame 的禁用态表现 |
| Readonly | 保留聚焦与文本选择能力，但改为 `Background/2` 且移除边框 |

### 3. 日期输入与自定义触发器

| 场景 | 规则 |
| :--- | :--- |
| 原生 `type="date"` | 默认保留浏览器原生 appearance，并显示内置日期 icon |
| 自定义 trailing 触发器绑定后 | 同时隐藏 `calendar-picker-indicator` 并用宿主右侧遮罩覆盖默认日期 icon 区域，把可见入口交给外部 `Button` |
| 简单结构 | `Field > Input[type="date"] + Button[as="trailing"]` 自动生效 |
| 复杂结构 | 只有进入真正的局部分段布局时才推荐使用 `Frame as="row"`；简单配件型结构优先直接写 `Field > leading + Input + trailing` |

### 4. 进入 Field 时的外壳规则

- `Input` 进入 `Field` 后，默认退掉自身外壳，由 `Field` 统一控制 padding、边框、背景和圆角
- 如果 `Field` 里还同时存在 `Text / Frame / Select / Textarea`，这些元素也应作为字段表面的组成部分，统一遵守外层留白规则
- 分割线只属于“多个输入宿主 / 显式分段”的连续字段表面；`Input` 前后配件不是分段输入，不应触发分割线

### 5. Placeholder 颜色修复方法

- `layout.css` 中统一定义全局与字段高亮变量：
  `--snowui-selection-bg = Brand 40%（var(--brand)）`
  `--snowui-selection-color = Black/100%`
  `--snowui-selection-radius = 8px`
- 普通页面文字（非原生表单控件内部文本）走全局 `::selection`
- `text` 输入框直接使用原生 `<input>`，由浏览器原生输入层消费 placeholder 与选中文本样式
- `date` 输入框走自定义分段编辑层（年 / 月 / 日），分段选区同样消费同一组高亮变量
- 字段宿主层继续暴露：
  `--snowui-field-selection-bg = var(--snowui-selection-bg)`（默认 Brand 40%）
  `--snowui-field-selection-color = Black/100%`
  `--snowui-field-selection-radius = 8px`
- 普通输入的 placeholder 颜色采用双层兜底：
  先覆盖 `::placeholder / ::-webkit-input-placeholder / ::-moz-placeholder / ::-ms-input-placeholder`
  再为 `:placeholder-shown` 的 input 本体补 `color` 和 `-webkit-text-fill-color`
- 这样即使浏览器没有正确命中 placeholder 伪元素，空态文本仍会保持 `Black/20%`
- `type="date"` 的空态文案单独走 `data-date-empty="true"` 链路：
  一层覆盖浏览器内部日期字段伪元素
  一层直接覆盖空值 date input 本体的 `color` 和 `-webkit-text-fill-color`
- 这两条链路组合的目标是统一保证：
  普通 placeholder 和日期空态文案都稳定输出 `var(--black-20)`

### 6. segment 嵌入态几何规范

| 项目 | 值 |
| :--- | :--- |
| 外层 div padding | `0`（`data-embedded="true"` 时统一去除，避免与内层 control 叠加） |
| 内层 control padding | `var(--snowui-input-padding-override, var(--padding-3) var(--padding-4))`，由 Field 在 segment 宿主模式下注入 `12px / 16px` |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14, 20px)` |
| placeholder 颜色 | `var(--black-20, rgba(0,0,0,0.2))` |

### 7. 外部 Icon / 复杂槽位规范

参考 Figma `10379-18362`（FM-02, FM-05）。图标到最近可见外边框始终为 **16px**。

> **放置原则**：Icon 或复杂 `leading` / `trailing` 结构的放置位置取决于谁持有 padding。
> - **非 segment**：Field 持有 padding，槽位放在 **Field 级**（不是 Input 内部）
> - **`as="segment"`**：Input 自持 padding，槽位放在 **Input 内部**

#### 非 segment 模式

Input 在 Field 中**未**标记 `as="segment"` 时，Field 注入 `--snowui-input-padding-override: 0`，Input 自身 padding 被清零。**不要**将 icon 放入 Input 内部，否则 icon 紧贴 Input 左/右边缘（0px 间距），请改用 Field 级 `as="leading"` / `as="trailing"`（见 Field.md §5）。

| 项目 | 值 |
| :--- | :--- |
| icon / 复杂槽位放置位置 | Field 直接子项，**不在 Input 内部** |
| 到外边框距离（Field 级） | 16px（由 Field 自身 `padding: 12px 16px` 保障） |

#### segment 模式（`Input as="segment"`）

Input 有 `as="segment"` 时自持 `padding: 12px 16px`，icon 或复杂槽位作为 Input 的直接子项。图标尺寸不在组件层约束，由 Icon 组件自身默认尺寸决定。

| 项目 | Leading | Trailing |
| :--- | :--- | :--- |
| prop | `as="leading"` | `as="trailing"` |
| 到外边框距离 | **16px**（`Input padding-left`） | **16px**（`Input padding-right`） |
| 默认颜色 | `var(--black-20, rgba(0,0,0,0.2))`（CSS 显式设置，与 placeholder 同色，辅助提示用） | `currentColor`（跟随输入文字颜色，与用户输入内容保持一致） |
| invalid 时 trailing 行为 | — | 错误图标出现时，外部 trailing 被 CSS 自动隐藏（`display: none`），错误图标独占该位置；恢复正常态后 trailing 重新显示 |

**内部 grid 布局（CSS 根据子项自动切换，无需手动指定）：**

| 图标配置 | `grid-template-columns` | Leading 列 | Trailing 列 |
| :--- | :--- | :--- | :--- |
| 仅 leading | `auto 1fr` | 1 | — |
| 仅 trailing | `1fr auto` | — | 2 |
| leading + trailing | `auto 1fr auto` | 1 | 3 |

图形与短标签并排时使用 `Frame as="leading" singleLine` / `Frame as="trailing" singleLine`，标签使用 `Text lines={1}`；附件内部由 Frame 保持单行和至少 4 CSS px 间距，Input 只管理整个附件槽位。复杂多行内容按自身结构显式组合。

复杂附件需要为可编辑／可选内容保留宽度；下例显式设置最小240 CSS px，并用ScrollArea在更窄容器中局部横向滚动。

用法示例：
```svelte
<!-- 仅 leading -->
<Input as="segment">
    <Icon as="leading"><CreditCard /></Icon>
</Input>

<!-- leading + trailing -->
<Input as="segment">
    <Icon as="leading"><Search /></Icon>
    <Icon as="trailing"><XCircle /></Icon>
</Input>

<!-- 复杂 leading + trailing -->
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

### 8. type="number" 步进器规范

`type="number"` 会在 Input 右侧渲染内置步进器（上箭头 + 下箭头），原生浏览器步进器统一隐藏。

| 项目 | 值 |
| :--- | :--- |
| 步进器区域 padding | `var(--padding-3) var(--padding-4) var(--padding-3) 0`（12px 16px 12px 0） |
| 上下箭头排列 | `flex-direction: column`，**gap = 0**（两按钮紧密堆叠，无间距） |
| 单个按钮尺寸 | `--snowui-input-stepper-button-size`（= `var(--size-4)` = 16px） |
| 组件整体高度 | 由步进器列决定：`padding-top(12) + 上箭头(16) + gap(0) + 下箭头(16) + padding-bottom(12)` = **56px** |
| 上箭头禁用逻辑 | 当前值 ≥ `max` 时自动 `disabled`（同时受外层 `disabled` / `readonly` 控制） |
| 下箭头禁用逻辑 | 当前值 ≤ `min` 时自动 `disabled`（同时受外层 `disabled` / `readonly` 控制） |

### 9. 内置清除按钮（Clear / X）规范

紧凑组合字段可使用 `<Input type="tel" maxlength={2} clearable={false} />`。maxlength 复用浏览器文本输入长度限制；具体长度由消费场景设置，不适用于 number 的位数限制，也不会截断调用方程序赋值。

适用于所有**文字系**输入类型（`text`、`search`、`email`、`password`、`url`、`tel` 等）；以下类型**不渲染** X：`number`、`color`、日期/时间族（`date`、`time`、`month`、`week`、`datetime-local`）。`disabled`、`readonly` 或 `clearable={false}` 时同样不渲染。

| 项目 | 规则 |
| :--- | :--- |
| 图标 | `ComponentIcon name="x-circle" weight="fill"`，通过内置 Button bare 渲染 |
| 默认颜色 | `var(--black-40, #00000066)` |
| Hover 颜色 | `var(--black-100, #000000ff)` |
| 过渡 | `color`，时长/缓动与 Select 下拉箭头保持一致（`var(--snowui-frame-color-motion-duration) var(--snowui-frame-color-motion-easing)`） |
| 触发条件 | clearable=true、输入内容非空且 Input 处于焦点态 |
| 独立 Input 焦点检测 | `.snowui-input:not([data-embedded]):focus-within` |
| 嵌入 Field 时焦点检测 | `.snowui-input[data-embedded="true"]:focus-within` |
| 优先级规则 | X （内置）> 外置 trailing Icon；X 可见时，**同位置**的外置 trailing Icon 和内置 Warning 图标全部隐藏 |
| `data-has-value` | 宿主元素上的实时状态属性，`hasClearableValue = true` 时写入 `"true"`，供 CSS 选择器消费 |
| 点击行为 | `value = ""; input.focus(); emitSyntheticInput(); emitSyntheticChange()` |
| 尺寸 | `var(--size-4)` = 16px × 16px |
| Grid 位置 | X 位于 `grid-column: -2 / -1`；显示时 control 横跨至末列，X 以 overlay 方式覆盖文字，不占用文字宽度 |
| 内容渐隐 | 单行内容发生横向溢出后持续显示左右渐隐；X 显示时从 X 最右边缘直接套用 Table 表头 checkbox 的 `14px → 26px` 参数 |

**X 可见时的隐藏规则**（CSS 实现，无 JS 干预）：

```
.snowui-input[data-has-value="true"]:focus-within  →  .snowui-input-clear-btn { display: inline-flex }
                                                   →  > [data-as="trailing"]:not(.snowui-input-clear-btn) { display: none }
                                                   →  > .snowui-input-warning-icon { display: none }
```

**验证示例**（Demo I-10b / I-10c / I-10e）：

- I-10b：leading Icon + search input → 输入后聚焦，X 出现，leading icon 不受影响
- I-10c：trailing Icon + search input → 输入后聚焦，外置 trailing Icon 被 X 替代
- I-10e：Field 嵌入 + text input + trailing Icon → 输入后聚焦，X 替代 trailing Icon

### 10. Trailing 位置图标优先级规范

同一 trailing 位置同时存在多种图标时，按以下优先级从高到低决定谁可见，低优先级者自动隐藏：

| 优先级 | 图标 | 触发条件 | 不可见时机 |
| :---: | :--- | :--- | :--- |
| **1** | **内置 X（清除按钮）** | `hasClearableValue=true` + Input `focus-within` | 失焦 / 值为空 / `disabled` / `readonly` |
| **2** | **内置 Warning（错误图标）** | `invalid=true` + 无外置 trailing | X 可见时被 CSS 隐藏 |
| **3** | **外置 trailing 图标**（`data-as="trailing"`） | 用户放置 | X 可见时被 CSS 隐藏；`invalid=true` 时被 Warning 挤出 |
| **4** | **内置图标**（stepper 箭头、日期触发器） | 对应 `type` 下自动渲染 | 各自独立位置，不与 trailing 竞争 |

**实现方式（全部 CSS，无 JS 判断）**：

```
Input focus-within + data-has-value="true"
  → .snowui-input-clear-btn            { display: inline-flex }  ← X 显示
  → > [data-as="trailing"]:not(.clear) { display: none }          ← 外置 trailing 隐藏
  → > .snowui-input-warning-icon       { display: none }          ← Warning 隐藏

invalid=true + !hasCustomTrailing
  → .snowui-input-warning-icon 渲染（DOM 中存在）
  → X 不可见时 Warning 自然可见
```

**浏览器原生 `type="search"` 取消按钮**：使用 `-webkit-appearance: none; display: none; width: 0; height: 0` 组合彻底隐藏，防止与自定义 X 并排出现。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Input 组件**: [./Input.svelte](Input.svelte)

## 更新日志

- 2026-10-23：复杂附件中的图形／短标签示例复用Frame单行与Text全文缩略；仅文档修订，宿主、清除和选择协议保持。

### v1.2.0 (2026-10-23)

- 内部单行图文间距统一解析，包含嵌入 Field 的实际网格宿主；显式零与缩放保持 4 CSS px 下限，保留日期分段和绘制结构的内部间距。
- 由 Input 提供实际内容状态，供 SearchInput 折叠使用；清除按钮的可用状态仍独立遵守 disabled、readonly 和 clearable。

- 2026-10-05：日期分段聚焦与选中背景、全局文字与输入选区统一使用 Brand 40%，保留原有前景色与交互。

### v1.1.5 (2026-09-27)

- 只读与禁用输入不再进入清除接管状态，避免聚焦只读输入时误隐藏自定义 trailing 复制按钮。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

- **Input-Docs.2026-09-10** 补齐全部具名属性、事件与 Snippet 说明，明确原生多值与已移除文件类型的边界；同步 Site 拟真示例，不改变组件行为。

- **Input-Motion.2026-06-18** 新增默认错误反馈 shake：独立 `Input invalid / aria-invalid` 自动播放，嵌入 `Field` 时由 `Field` 汇总播放，消费方无需手动传类名或状态。
- **Input-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v1.1.4 (2026-09-12)

- 修复带附件的 Input 在固定高度下内容偏上：单行 Grid 使用 `align-content: center`，SearchInput 同步继承；默认自适应高度不变。

### v1.1.3 (2026-08-12)

- 更正独立 Input 标准态 padding 记录为源码实际值 `12px / 16px`；组件行为未改变。

### v1.1.2 (2026-08-10)

- 补齐从 Frame 继承的 `bind:element` 根宿主引用，使 SearchInput 等宿主特化组件无需 wrapper 或私有 DOM 查询即可复用根尺寸能力。
- 普通 Input 的 clear + leading 稳定宽度规则在 SearchInput 空值图标态时退出，避免隐藏 clear 的历史 gap 继续占据 Icon 右侧；聚焦或已有值后仍恢复原布局。

### v1.1.1 (2026-07-05)

#### 修复
- 修复有值 Input 位于 shrink-to-fit 宿主中时，聚焦显示清除 X 会改变组件宽度的问题。
- 内置清除 X 与 control 共用同一网格列，X 显隐不再新增轨道；保留原有文字渐隐和清除按钮叠层。

### v1.1.0 (2026-07-05)

#### 新功能
- 新增默认关闭的 `error` 内置模式；仅在 invalid 时显示 `<Text as="error">`，使用 12px/16px 红色样式及 8px 间距。
- 新增 `parts.Text`，显式 `<Text as="error">` 模式保持不变。

### v1.0.44 (2026-05-09)

- 字号 / 行高改为内层控件 `inherit` 外层 `.snowui-input` 的设置；外层 `class="text-18"` 等工具类可直接生效，placeholder 与输入文字同步放大。`--snowui-input-font-size-override` / `--snowui-input-line-height-override` 仍保留，仍由外层消费。

- **v1.0.36**: `type="color"` 默认改为 Figma 对应的“色点 + # + HEX”展示层，颜色值随原生 color picker 同步更新。
- **v1.0.35**: `readonly` 统一升级为“不能编辑”视觉态，独立模式与 `Field` 容器模式都改为 `Background/2` 背景且无边框。

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **共享逻辑**: [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- **Props 分发**: [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- **字段上下文**: [../context.ts](../context.ts)
- **关联规范**: [../../../docs/standards/HTMLSpec.md](../../../docs/standards/HTMLSpec.md)

---

### v1.0.43 (2026-05-09)

#### 调整
- **INP-Overlay.1** 将 Listbox / QuickAction 内搜索输入样式扩展为浮层搜索输入共享规则，覆盖 SearchPopup 内的 SearchInput，并统一移除外扩 focus ring。

### v1.0.42 (2026-04-25)

#### 修复
- **INP-Fix.8** 修复独立 `Input` 有值但未 hover 时右侧输入区域多出 `8px` 的问题：只有内建清除按钮时，隐藏态不再保留 grid gap，hover 显示 X 时再恢复按钮列间距。

### v1.0.40 (2026-04-02)

#### 调整
- **INP-Doc.1** 文档补充 `Input` 进入 `Field` 后的宿主规则：外层 `Field` 统一控制 padding、边框、背景、圆角和 `label` 间距，`Input` 自身退回输入宿主。
- **INP-Doc.2** 文档更新 `leading / trailing` 推荐写法：简单配件型结构直接使用 `Field > leading + Input + trailing`，并明确这类结构不属于带分割线的分段输入。

### v1.0.36 (2026-03-25)

#### 样式
- **INP-Style.5** `type="color"` 默认展示层升级为 Figma 对应的“色点 + # + HEX”结构，颜色点与 HEX 文本统一复用 Input 默认 14 / 20 排版、8 gap 与 12/16 padding。

#### 交互
- **INP-Interaction.1** 保留隐藏原生 `<input type="color">` 作为真实宿主，继续承接表单归属、focus、键盘交互与 `bind:value` 同步；可见展示层仅负责视觉呈现。

### v1.0.35 (2026-03-19)

#### 样式
- **INP-Style.4** `readonly` 统一改为“不能编辑”视觉态：独立模式与 `Field` 容器模式都使用 `Background/2` 背景，并移除默认边框。

### v1.0.34 (2026-03-19)

#### 修复
- **INP-Fix.7** 加强 `type="number"` 的浏览器兜底隐藏规则：原生上下箭头统一追加 `opacity: 0` 与 `pointer-events: none`，并将宿主 input 外观显式收敛为 `textfield`，避免 Playground 中原生步进器再次露出。

### v1.0.33 (2026-03-19)

#### 重构
- **INP-Refactor.7** 按组件规范对齐 `enableResponsive=true` 默认值，并将 `Frame` 的三个能力开关改为显式传参，保持代码与标准检查一致。

#### 样式
- **INP-Style.3** 收敛 stepper 相关选择器到 `:global(:where())`，移除强制优先级写法，补齐主题 token fallback，并把自身几何样式回收到 `--snowui-input-*` 命名空间。

### v1.0.31 (2026-03-16)

#### 重构
- **INP-Refactor.6** 历史上曾为统一普通文字、输入文字和日期分段的选中视觉，引入过 `text` / `date` 的自定义可见编辑层；当前仅 `date` 仍保留自定义 `年/月/日` 分段编辑层，`text` 已回收到原生 `<input>`。

### v1.0.30 (2026-03-16)

#### 调整
- **INP-Adjust.8** 修正 Chrome 日期分段高亮方案：移除无效的 `::-webkit-datetime-edit-*::selection` / 普通 input `::selection` 方案，改为对 `year/month/day-field:focus` 应用统一的 `Black/4% + Black/100% + 8px` 高亮变量。

### v1.0.29 (2026-03-16)

#### 调整
- **INP-Adjust.7** 统一字段文本选中态：`layout.css` 为 field-bordered 工具类 新增 `Black/4%` 背景、`Black/100%` 文字、`8px` 圆角的通用选中变量；`Input.svelte` 额外为日期 `year/month/day` 私有伪元素补齐同款 `::selection` 样式。

### v1.0.28 (2026-03-16)

#### 修复
- **INP-Fix.6** 为 `:placeholder-shown` 的普通输入本体追加 `Black/20%` 文本色，沿用日期空态的成功修复方式，避免浏览器未命中 `::placeholder` 时 placeholder 仍显示为正文色。

### v1.0.27 (2026-03-16)

#### 修复
- **IN-Date.8** 沿用 placeholder 的成功修复方式，把空值 `date input` 本体文字颜色也统一压到 `Black/20%`，避免仅依赖浏览器内部字段伪元素时颜色仍不稳定。

### v1.0.26 (2026-03-16)

#### 修复
- **IN-Date.7** `type="date"` 在空值时，浏览器内部的日期占位文本也统一压到 `Black/20%`，与普通 placeholder 保持一致。

### v1.0.25 (2026-03-16)

#### 修复
- **IN-Date.6** `type="date"` 在没有自定义 trailing 按钮时恢复浏览器原生 appearance，重新显示默认日期 icon；只有检测到 `Button as="trailing"` 时才切换到自定义隐藏链路。

### v1.0.24 (2026-03-16)

#### 修复
- **IN-Date.5** 恢复 `::-webkit-calendar-picker-indicator` 隐藏分支，并与宿主右侧遮罩共同组成日期 icon 修复链路；删除其中任一分支都会导致部分浏览器再次显示默认日期 icon。

### v1.0.23 (2026-03-16)

#### 清理
- **IN-Date.5撤回** 上一版把 `::-webkit-calendar-picker-indicator` 分支误判为无效代码，实际回归验证表明该分支仍参与生效，因此已在 `v1.0.24` 恢复。

### v1.0.22 (2026-03-16)

#### 修复
- **IN-Date.4** 日期输入隐藏原生日历 icon 的规则改为“双保险”：优先走 `::-webkit-calendar-picker-indicator` 隐藏，浏览器不接受该隐藏时再由宿主右侧遮罩覆盖默认 icon 区域。

### v1.0.21 (2026-03-16)

#### 修复
- **IN-Date.3** 日期 trigger 命中改为由 Input 运行时检测同一局部容器内的 direct trailing Button，并回写自身 `data-has-date-trigger`，避免复杂结构选择器漏判。

### v1.0.20 (2026-03-16)

#### 调整
- **IN-Date.2** 移除 `control="date-picker"` 依赖；日期输入的自定义触发器重新收敛为局部容器内的 `Button as="trailing"` 自动识别。

### v1.0.19 (2026-03-15)

#### 新功能
- **IN-Date.1** 新增自定义日期触发器桥接：当 `Field / row / 局部容器` 内的 Button 被绑定为日期选择触发器时，`Input type="date"` 会隐藏原生日期 icon，把交互入口交给外部组合按钮。

### v1.0.18 (2026-03-15)

#### 重构
- **INP-Refactor.1** 默认输入边框回归 `layout.css` 的 `.snowui-field-bordered`：基础态为 `Black/20%`，focus 为 `Black/40% + Black/4% ring`，组件内仅保留 `invalid / disabled / readonly` 等输入特有分支。
- **INP-Fix.1** placeholder 伪元素选择器拆分为标准 / WebKit / Mozilla / MS 独立规则，稳定输出 `Black/20%`。
- **INP-Refactor.2** 组件职责调整为字段宿主优先，推荐与 `Field.svelte` 容器组合使用；在容器上下文中只渲染无外壳的输入宿主。

### v1.0.17 (2026-03-14)

#### 重构
- **INP-Refactor.5** Input 默认 focus 变量桥接回归 `field-bordered 工具类` 的通用值，聚焦态改为 `Black/40%` 内边框 + `Black/4%` 的 `4px` 外层 ring。

### v1.0.16 (2026-03-14)

#### 修复
- **INP-Fix.5** placeholder 最终修复为拆分标准与浏览器私有伪元素选择器，分别设置 `color / -webkit-text-fill-color / opacity`，统一输出 `Black/20%`。

### v1.0.9 (2026-03-14)

#### 清理
- **INP-Cleanup.1** 移除为指针问题引入的 placeholder 覆盖层、焦点显隐状态与专项 cursor 兜底，回归原生 `<input>` + `field-bordered 工具类` 的最小实现。

### v1.0.3 (2026-03-14)

#### 重构
- **INP-Refactor.2** 抽离字段宿主桥接逻辑到 `../logic/frame-field-control.ts`，统一处理 `value/defaultValue`、`invalid/aria-invalid` 和 `input[type="file"]` 的值同步豁免。
- **INP-Refactor.3** 删除组件内重复的默认 hover/focus 规则，改为直接依赖 `.snowui-field-bordered` 的通用行为；移除冗余 `data-disabled` 标记链路。

### v1.0.4 (2026-03-14)

#### 重构
- **INP-Refactor.4** Input 默认边框、hover、focus 和文字光标改为通过 `.snowui-field-bordered` 变量桥接到 `layout.css`，统一控制输入型组件的基础交互表现。

### v1.0.2 (2026-03-14)

#### 重构
- **INP-Refactor.1** 移除组件内联的 `Frame prop` 白名单，改用 `../logic/frame-prop-filter.ts` 提供的共享 props 分发器，避免与 `Frame` 自身 DOM 过滤逻辑重复维护。

### v1.0.1 (2026-03-14)

#### 样式
- **INP-Style.1** 按 Figma 翻译更新 Input 默认样式：`14` 字号、`12/16` padding、`8` gap、`16` 圆角、`Black/20%` 的 `0.5px` 内边框、`Background/3` 背景。
- **INP-Style.2** 默认最小高度调整为 `44px` 推导值，并同步骨架高度与 focus 视觉链路。

### v1.0.0 (2026-03-13)

#### 新功能
- **INP-Feat.1** 新增基于 `Frame` 的单行输入组件，支持原生 `<input>` 属性透传、`bind:value`、Skeleton 与响应式能力。
- **INP-Feat.2** 新增 invalid / readonly / file / datalist 等基础样式链路，并约束 `Input` 仅负责原子输入控件本体。
