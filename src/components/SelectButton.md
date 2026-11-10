# SelectButton

> **版本**: v1.0.2
> **职责**: 以按钮形式提供单项下拉选择，适合工具栏、筛选入口和需要紧凑展示的选项切换。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以按钮形式提供单项下拉选择，适合工具栏、筛选入口和需要紧凑展示的选项切换。

## 使用选择

<!-- usage-guide:start -->
用于按钮触发的选择或命令菜单。表单字段式单选用 Select；多项操作随宽度收纳用 OverflowActions。

- options 提供唯一字符串 value；label 定制触发按钮文字，children 用来替换列表。
- action 模式不更新 value 或触发 onchange；根级 Props 配置按钮，parts 不提供 Button 入口。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { SelectButton } from '@snowui-design-system/components';
	const componentOptions = [
		{ value: 'button', label: 'Button' },
		{ value: 'button-group', label: 'ButtonGroup' },
		{ value: 'copy-button', label: 'CopyButton' },
		{ value: 'select-button', label: 'SelectButton' }
	];
</script>

<SelectButton
	placeholder="Select"
	ariaLabel="Select a component"
	options={componentOptions}
/>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `SelectValue` | — | 当前选中值（string、number 或 undefined），支持 bind:value；优先于 defaultValue，实际选项选择写入字符串。action 模式不保存选择。 |
| defaultValue | `SelectValue` | — | value 未定义时的回退选中值；仅 persistent 模式用于选择显示，首次选择后由 value 驱动。 |
| options | `SelectOption[]` | `[]` | 选项数据：每项包含字符串 value、label 及可选 disabled；默认生成 MenuItem。显式 children 提供列表时使用其选项注册。 |
| placeholder | `string` | — | 未选中时的提示文字；action 模式触发器始终显示该文字。没有 label、选项文字或 placeholder 时触发器文字为空。 |
| name | `string` | — | 表单字段名；仅提供非空 name 时创建 hidden input，提交当前选中值的字符串形式。 |
| form | `string` | — | hidden input 所属表单的 id，可关联组件外部表单；仅设置 name 生成输入后生效。 |
| required | `boolean` | `false` | 传入 Select 的必填标记；当前实现未将其接入原生约束校验，也不会阻止空值提交，业务需自行验证。 |
| disabled | `boolean` | `false` | 禁用触发按钮并阻止打开或切换选项；当前 hidden input 不随该标记禁用，已有值仍可随表单提交。 |
| readonly | `boolean` | `false` | 阻止用户通过触发器打开或改变选项，保留显示与外部 value 更新；不会禁用 hidden input。 |
| invalid | `boolean` | `false` | 将无效状态传给 Select wrapper；当前 Button 触发器不自动增加错误边框或 aria-invalid，不能代替业务校验与错误说明。 |
| ariaLabel | `string` | — | 触发 Button 的可访问名称；不提供可见 label 时应设置。 |
| showIndicator | `boolean` | `true` | 显示下拉指示器；false 时连同自定义 indicator 一起隐藏，选择能力不受影响。 |
| search | `boolean` | `false` | 开启默认 Listbox 内置搜索；parts.Listbox.search 可覆盖。显式 children 模式应在自己的 Listbox 上配置搜索。 |
| selectionMode | `"persistent" \| "action"` | `"persistent"` | persistent 保存选中值并显示选项文字；action 只触发 onAction、关闭列表且保持 placeholder，不更新 value 或触发 onchange。 |
| label | `Snippet<[SelectButtonLabelContext]>` | — | 替换触发器文字；参数包含 value、option、label、placeholder，保留指示器和按钮交互。 |
| indicator | `Snippet<[SelectButtonIndicatorContext]>` | — | 替换指示图形，参数为 open、disabled；仅 showIndicator=true 时渲染。 |
| children | `Snippet` | — | 显式 Listbox/MenuItem 内容，替换默认列表；不作为按钮文字使用，文字定制请用 label。 |
| parts | `ComponentPartsOf<{ Listbox: typeof Listbox; Input: typeof Input; MenuItem: typeof MenuItem; }>` | — | 配置默认内建列表、搜索输入和选项；不提供 parts.Button，按钮样式在根级传入。显式 children 自行配置所属子项。 |
| onchange | `(event: Event) => void` | — | persistent 模式选中不同值后调用，参数为 change Event；用 bind:value 读取新值，重复选择与 action 模式不触发。 |
| onAction | `(value: string) => void` | — | 仅 action 模式在执行选项后接收其 value；列表随后保持关闭，组件不保存选中值。 |
| onclick | `(event: MouseEvent) => void` | — | 触发器完成打开或关闭后调用；disabled/readonly 时不调用，不能通过 preventDefault() 撤销已执行的切换。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 组件处理方向键、Enter、Escape 等选择键盘逻辑后调用；readonly 分支也会转交按键，不能据此取消已发生的内部操作。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="使用"></a>

### 使用

```svelte
<script lang="ts">
  import { SelectButton } from "@snowui-design-system/components";
  let value = $state<string | number | undefined>(undefined);
</script>

<SelectButton
  bind:value
  variant="borderless"
  options={[{ value: "recent", label: "最近更新" }]}
  parts={{ Input: { placeholder: "搜索" } }}
/>
```

Button 的兼容 Props 在根级平铺；Button 是宿主，不提供 `parts.Button`。Select 只提供无视觉 wrapper，不额外绘制字段边框、背景或圆角，因此 SelectButton 的最终视觉始终由真实 Button 宿主及其公开 Props 决定。默认辅助子树为 Listbox → Input + MenuItem，通过 `parts.Listbox/Input/MenuItem` 配置。存在显式 children 时替换默认 Listbox。

默认 label 显示当前选项或 placeholder；`label` snippet 只替换 label。默认 indicator 使用 `arrow-line-down`，可用 `showIndicator={false}` 隐藏或用 `indicator` snippet 替换。

`selectionMode="persistent"` 是默认持续选择模式：trigger 显示当前选中项。`selectionMode="action"` 是命令执行模式：trigger 始终显示 placeholder，点击选项只触发 `onAction(value)`，不保存选中值。因此无需另设 MenuButton。

SelectButton 默认不显示搜索框，使用 `search` 开启。其 Listbox 默认以最长选项决定固定宽度，其他选项全部 fill，并且不显示选中 check。搜索 placeholder、搜索时 160px 最小宽度和打开后锁宽由 Listbox 统一提供。`bare` 与 `emphasis` 直接传给宿主 Button；因此 bare 默认 100%，需要次级触发器时显式使用 `emphasis="muted"`。

<a id="api"></a>


### 数据与 Snippet 参数

`SelectValue = string | number | undefined`。`SelectOption` 为 `{ value: string; label: string; disabled?: boolean }`；选项 value 应稳定且唯一。

`SelectButtonLabelContext` 为 `{ value: SelectValue; option: SelectOption | undefined; label: string; placeholder: string | undefined }`；`label` 已按选项文字 → placeholder → 空字符串解析。`SelectButtonIndicatorContext` 为 `{ open: boolean; disabled: boolean }`。

表单提交和选择行为复用 [Select](Select.md)，按钮视觉 Props 参见 [Button](Button.md)。`required` 与 `invalid` 的当前限制见各自属性说明，不能据字段名推断已实现原生校验。

> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## 提交与反馈

持久选择模式继承 Select 的 required、name、form 与组件内置必填提示；action 模式不要求保留选中值。

## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

| 关键字 | 说明 |
| --- | --- |
| Button host | 根级兼容 Props 的真实视觉宿主 |
| parts | Listbox / Input / MenuItem 默认内置辅助子树 |
| selectionMode | `persistent` 持续选择；`action` 执行命令 |
| search | 是否显示搜索框，默认 false |

- 主布局模型：宿主组件特化 + 复合管理布局。
- 宿主：Button；状态控制器：Select。
- 作为复合控件触发器，Button 宿主默认关闭 hover 背景放大；调用方仍可用 `scaleOnHover={true}` 显式开启。
- 受控字段：children、as、value、disabled、id、trigger 事件与 ARIA。
- 无视觉 wrapper 由 Select 提供；Button 仍是真实交互节点。
- 依赖：Select、Button、Listbox、Input、MenuItem 与 Components 内置语义图标协议。

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.0.2 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.1 (2026-08-29)

- 移除按钮触发模式外层误命中的 Field 边框，恢复真实 Button 宿主对完整视觉的唯一所有权。
- SelectButton 默认关闭 Button 宿主的 hover 背景放大，保留颜色反馈与 `scaleOnHover={true}` 显式开启能力。

### v1.0.0 (2026-07-03)

- 首次实现宿主组件特化、默认内置和显式组合模式。
