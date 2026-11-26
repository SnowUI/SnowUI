# Select

> **版本**: v3.3.1
> **职责**: 在下拉列表中选择选项，可由数据直接生成面板，也可自定义选项组合，支持搜索与键盘操作。
> **包归属**: `@snowui-design-system/components`

## 组件介绍

在下拉列表中选择选项，可由数据直接生成面板，也可自定义选项组合，支持搜索与键盘操作。

## 使用选择


用于下拉单选。默认传 options 生成 Listbox / MenuItem；显式 children 替换默认选项面板。命令菜单优先 SelectButton；不是任意多选或自由输入控件。

- options 默认生成列表；显式 children 提供 Listbox / MenuItem 后替换默认列表。
- persistent 保存选择；action 只调用 onAction 并关闭，不保存本次选择。默认子项用 parts，显式子项直接配置。
- 列表通过 Escape 关闭后，字段型与 buttonTrigger／SelectButton 模式均恢复真实触发按钮焦点；搜索头关闭行为由共享 Listbox 管理。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Select, Listbox, MenuItem, Text, Button } from '@snowui-design-system/components';
</script>

<Select placeholder="请选择城市" style="width: 20rem; max-width: 100%;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| gap | `number` | — | 继承 Frame 的间距 token 索引；省略时保留组件原首选间距，显式值覆盖首选间距，有效图文间距仍至少为 4 CSS px；显式零和根字号／间距缩放不压低下限。 |
| value | `SelectValue` | — | 当前值，支持 `bind:value` |
| defaultValue | `SelectValue` | — | 初始值 |
| placeholder | `string` | — | 空值占位文字，显示在 Trigger 中 |
| name | `string` | — | 表单提交字段名 |
| disabled | `boolean` | `false` | 禁用状态 |
| readonly | `boolean` | `false` | 只读状态 |
| required | `boolean` | `false` | 必填状态 |
| form | `string` | — | 指定外部表单归属 |
| autofocus | `boolean` | — | 首次渲染自动聚焦 |
| tabindex | `number` | — | Tab 顺序 |
| title | `string` | — | 原生提示 |
| id | `string` | — | 原生 id |
| invalid | `boolean` | `false` | 组件级无效态 |
| children | `Snippet` | — | `<Listbox>` + `<MenuItem>` 组合内容 |
| options | `SelectOption[]` | `[]` | 默认内置列表数据，字段遵循 ListboxItem；传入显式 children 时不渲染该默认列表。 |
| triggerContent | `Snippet<[SelectTriggerContext]>` | — | buttonTrigger 开启时替换触发按钮内容；接收 value、option、label、placeholder、open、disabled。 |
| buttonTrigger | `boolean` | `false` | 使用 Button 代替字段型触发器；保留展开、选择与焦点恢复协议。 |
| buttonBare | `boolean` | `true` | 只在 buttonTrigger 模式生效，控制内置 Button 是否为无外壳 bare 外观。 |
| selectionMode | `"persistent" \| "action"` | `"persistent"` | persistent 保存选择值；action 只执行 onAction、关闭面板并恢复触发器焦点，不保存本次选项。 |
| onAction | `(value: string) => void` | — | action 模式选择选项后调用，参数为字符串选项值；此时面板已关闭，返回值不参与选择。 |
| parts | `SelectParts` | — | 配置默认 Listbox、Input、MenuItem、Tooltip 与按钮触发器；显式 child 不消费父级 parts。 |
| ariaLabel | `string` | — | 触发器的可访问名称；按钮触发模式无自定义内容时也作为后备显示内容。 |
| onclick | `(event: MouseEvent) => void` | — | 非 disabled、非 readonly 的触发器点击切换展开状态后调用，接收原始 MouseEvent。 |
| oninput | `(event: Event) => void` | — | persistent 模式选择了不同值时调用，接收隐藏表单输入派发的 change Event；实际新值从绑定 value 读取，不是原生文本输入过程。 |
| onchange | `(event: Event) => void` | — | persistent 模式选择值改变后调用，接收同一次 change Event；相同值与 action 模式不触发。 |
| onfocus | `(event: FocusEvent) => void` | — | 字段型触发器取得焦点时调用，接收 FocusEvent；按钮触发模式不使用此直接处理器。 |
| onblur | `(event: FocusEvent) => void` | — | 字段型触发器失去焦点时调用，接收 FocusEvent；按钮触发模式不使用此直接处理器。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 触发器的内置方向键、Enter/Space 和 Escape 处理后调用，接收 KeyboardEvent；不能撤销已处理的动作。 |
| onkeyup | `(event: KeyboardEvent) => void` | — | 字段型触发器松开按键时调用，接收 KeyboardEvent；按钮触发模式不使用此直接处理器。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

### 尺寸边界

最小宽度按内容区、附件、间距与内边距计算；选择内容至少保留 1em。长选项继续缩略，父容器不足时需调整布局或提供横向滚动。

<a id="默认内置模式-显式组合模式"></a>

### 默认内置模式 / 显式组合模式

- 默认内置模式（推荐）：传入 `options`，Select 自动生成 Listbox 与 MenuItem；搜索框默认关闭，通过 `parts={{ Listbox: { search: true } }}` 开启；通过 `parts.Button`、`parts.Listbox`、`parts.Input`、`parts.MenuItem` 配置内置子项。
- `options` 中同一 `value` 的 `label` 或 `disabled` 更新时，当前选择的显示标签、搜索与键盘选项按新数据更新。
- 显式组合模式：显式书写 `<Listbox>`、`<Input as="search">` 与 `<MenuItem>`，用于复杂内容或逐项差异；显式 `children` 替换默认内置 Listbox，不同时激活两套选项。内嵌 `<Input as="search" allowCustomValue />` 支持添加自定义选项（该属性归属 `Input`）。
- `buttonTrigger` 将字段型触发器切换为真实 `Button`（优先使用 `triggerContent`，否则回退选中项、`placeholder`、`ariaLabel`），保持 `aria-haspopup="listbox"`、`aria-expanded`、键盘导航与选中后焦点恢复，外层 wrapper 不渲染独立字段边框。

```svelte
<Select options={[{ value: "a", label: "A" }]} />
```

### 布局模型与槽位组合

主布局模型：**槽位宿主布局**（见 LayoutProtocol.md）。普通字段模式固定采用 `Frame row` 单行内容协议（`leading: auto`、`trigger: minmax(0, 1fr)`、`trailing: auto`），图标与标签有效间距至少 `4 CSS px`；存在直系自定义 `as="trailing"` 时自动隐藏默认下拉指示图标。

### Field 嵌入与留白规则

- **独立使用**：Select 自带 `12px / 16px` 内边距与 `8px` 间距。
- **嵌入 `Field`（无 `as="segment"`）**：由外层 `Field` 统一提供 `12px / 16px` 内边距与外层间距，Select 去除自身外框与内边距并保留内部槽位间距。
- **连续分段（`Select as="segment"`）**：保留 Select 自身 `12px / 16px` 内边距，与相邻 `segment` 之间共享单条分割线。
- **Placeholder 与可选清空**：`placeholder` 仅在无选中值时显示于触发器，不生成 Listbox 条目；非必填字段如需“清空选择”，由业务在 `options` 或 `MenuItem` 中提供显式空值项。

### 必填与错误反馈

显式设置 `required` 时，持久选择模式在空值提交时使首个无效字段聚焦并短暂闪动红边，不显示浏览器气泡或空值文字；`action` 模式不参与必填值保存校验。`invalid` / `aria-invalid` 在独立使用时由 Select 自身播放错误 shake，嵌入 `Field` 时由外层 `Field` 统一反馈。

<a id="使用示例"></a>

### 使用示例

```svelte

<Field>
  <Select placeholder="请选择状态">
    <Listbox>
      <MenuItem value="todo">待处理</MenuItem>
      <MenuItem value="doing">处理中</MenuItem>
      <MenuItem value="done">已完成</MenuItem>
    </Listbox>
  </Select>
</Field>


<Select placeholder="请选择或输入">
  <Listbox>
    <Input as="search" allowCustomValue placeholder="搜索或输入新选项..." />
    <MenuItem value="tag-a">Tag A</MenuItem>
    <MenuItem value="tag-b">Tag B</MenuItem>
  </Listbox>
</Select>


<ScrollArea axis="horizontal" ariaLabel="Select with attachments" width="100%">
<Select minWidth={240} placeholder="Tags">
  <Frame as="leading" singleLine>
    <Icon as="leading" icon={Resource.Tag} />
    <Text lines={1}>Tags</Text>
  </Frame>
  <Frame as="trailing" singleLine>
    <Text class="text-black-40" lines={1}>Multi-Select</Text>
    <Icon as="trailing" icon={Resource.CaretRight} class="text-black-20" />
  </Frame>
  <Listbox>
    <MenuItem as="item" value="design">Design</MenuItem>
    <MenuItem as="item" value="code">Code</MenuItem>
  </Listbox>
</Select>
</ScrollArea>
```

### 无障碍建议

- Trigger 使用 `role="combobox"` + `aria-haspopup="listbox"` + `aria-expanded` + `aria-controls`；Listbox 使用 `role="listbox"`，选项使用 `role="option"` + `aria-selected`，表单提交通过内部 `<input type="hidden">` 桥接。
- 键盘支持 `ArrowUp` / `ArrowDown` 移动焦点、`Enter` / `Space` 确认、`Escape` / `Tab` 关闭；内置搜索过滤通过 `Listbox search` 或内嵌 `<Input as="search" />` 开启。
