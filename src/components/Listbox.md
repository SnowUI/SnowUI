# Listbox

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.3.5
> **职责**: 在浮层中展示可选择的选项，支持搜索过滤与键盘操作，可作为 Select 的选择面板。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

在浮层中展示可选择的选项，支持搜索过滤与键盘操作，可作为 Select 的选择面板。

## 使用选择

<!-- usage-guide:start -->
用于有选项、键盘导航和选择语义的列表面板，通常由 Select 承载。通知、联系人、活动流是内容列表，不使用 Listbox。

- items 的 value 必须唯一，label 用于显示和搜索；children 存在时替换 items。
- 显式选项使用 MenuItem as="item"；显式搜索使用 Input as="search" 并关闭内置 search，避免重复输入框。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Listbox, Select, Text } from '@snowui-design-system/components';
	const pages = ['Accordion', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'Card', 'Checkbox', 'Chip', 'Dialog', 'Field', 'Input', 'Listbox', 'MenuItem', 'Popover', 'Select', 'Tooltip'].map(label => ({ value: label, label }));
	let page = $state('Button');
</script>

<div style="display: flex; flex-direction: column; gap: var(--gap-4); width: min(100%, 22rem); min-width: 0;">
<Select bind:value={page} ariaLabel="Component documentation" style="width: 100%;">
    <Listbox search items={pages} parts={{ Input: { placeholder: 'Find a component…', 'aria-label': 'Find a component' } }} />
</Select>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| children | `Snippet` | — | 无参数的显式选项内容；传入后不生成 `items`。选项使用 `MenuItem as="item"` 并提供唯一 `value`；外置搜索使用 `Input as="search"`，同时设置 `search={false}` 避免重复内置搜索框。 |
| items | `ListboxItem[]` | `[]` | 默认内置选项数组；每项包含必填且唯一的字符串 `value`、显示及搜索使用的 `label`、可选 `disabled`。有 children 时忽略；运行时自定义项由宿主另行管理。 |
| parts | `ComponentPartsOf<{ Input: typeof Input; MenuItem: typeof MenuItem; }>` | — | 配置默认内置 Input 和 MenuItem 的公开 Props，例如搜索 placeholder、allowCustomValue 或选项 showCheck；显式子项需自行配置。parts.MenuItem.showCheck 优先于 Listbox 的 showCheck。 |
| search | `boolean` | — | 是否生成固定在面板顶部的 Input；依次读取显式值、宿主配置并回退 true。Select 默认向 Listbox 提供 false；需要搜索时显式开启。 |
| maxHeight | `number \| string` | — | 面板最大高度，数字为 px，字符串为 CSS 长度；受可用视口约束。未设置时最多完整显示 10 项，空间不足时至少保留实际选项中的前 2 项。 |
| minWidth | `number \| string` | — | 面板最小宽度，数字为 px，字符串为 CSS 长度；未设置时搜索开启取 160px，否则取 0。内容与视口约束仍参与最终宽度计算。 |
| scrollbar | `boolean` | `true` | 溢出时显示浮层滚动条；false 仅隐藏轨道，仍可通过滚轮和键盘滚动。 |
| matchTriggerWidth | `boolean` | `true` | true 时以锚点实测宽度加固定 2px 为宽度基准，左右各覆盖 1px，内容需要更宽时允许扩展；false 时按选项内容 Hug，不添加补偿，仍受 minWidth 与视口约束。 |
| placementMode | `"selected" \| "bottom"` | `"selected"` | selected 将选中项中心对齐触发器；bottom 从触发器下方展开。最终定位与高度受可用视口约束。 |
| align | `"start" \| "end"` | `"start"` | 面板相对锚点左边缘或右边缘对齐；Hug 面板与锚点宽度不同时差异明显，最终位置受视口约束。 |
| showCheck | `boolean` | `false` | 为选中项预留并显示 trailing 勾选；Select 默认提供 true。显式 MenuItem 可用自身 showCheck 覆盖，自定义 trailing 替换默认勾选。 |
| continuousHover | `boolean` | `true` | 在直接 MenuItem 之间移动同一个高亮背景，键盘 active 共用该背景；false 恢复逐项即时背景，禁用和过滤项不作为目标。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="默认内置模式-显式组合模式"></a>

### 默认内置模式 / 显式组合模式

- 默认内置模式（推荐）：`items` 自动生成 `<MenuItem as="item">`；设置 `search` 可生成固定搜索框。未设置 `maxHeight` 时，面板高度按实际可见 MenuItem 的高度计算：默认最多完整显示 10 项，超过后显示浮层滚动条；通过 `parts.Input` / `parts.MenuItem` 配置内置组件。
- 显式组合模式：显式书写 MenuItem，用于复杂内容或逐项 Props 差异；存在 children 时不再生成 items。

Select 默认提供 `search=false`；默认内置模式可用 `search` 开启、`search={false}` 隐藏搜索框、`maxHeight` 显式修改最大高度、`scrollbar={false}` 隐藏浮层滚动条。搜索框默认 placeholder 为“搜索”，有搜索框时面板默认最小宽度为 160px。显式组合模式使用 `search` 时同样自动插入 Input；不设置时也可设置 `search={false}` 并手动书写 `<Input as="search">`。`maxHeight` 与 `scrollbar` 始终作为 Listbox 面板能力生效。

未设置 `maxHeight` 时，可用视口空间只改变完整可见的 Item 数量，不产生半项高度：面板在 2～10 项之间选择能够容纳的完整项数；即使触发器下方空间不足，也至少为现有选项中的前 2 项保留完整高度。少于 2 项时按实际项数 Hug。显式 `maxHeight` 继续按调用方给定的长度与视口可用高度取较小值。

> **版本**: v1.3.5
> **状态**: 已实现
> **更新日志 (2026-04-28)**: 标注主布局模型为复合管理布局；补充关键字表格、用户定义区与更新日志，以满足组件开发链路检查。
> **职责**: 浮层选项列表面板，作为 Select 的下拉面板。Portal 到 body，position:fixed 定位，选中项中心对齐 Trigger，遵循 Quick Action 视觉规范。支持内嵌 `<Input as="search">` 搜索/过滤。

**2026-04-24 更新（v1.2.0）**: 滚动条间距规范化 — `.snowui-listbox` 使用 `overflow-y: scroll` + `scrollbar-width: none` 隐藏原生滚动条，并通过 `.snowui-listbox-body` 内的自定义浮层滚动条显示滚动位置。MenuItem 背景左右间距保持 8px；滚动条覆盖在右侧，不占布局宽度，右边缘距面板右边框 4px。带搜索 Input 时，滚动条只出现在 Input 下方的 MenuItem 滚动区域。Thumb 支持鼠标拖拽；打开定位用选中项相对 portal 的真实视觉中心计算，兼容有无顶部 Input 的结构。

**2026-04-20 更新**: 搜索/自定义值支持 — `<Input as="search">` 放入 `<Listbox>` 可自动接入过滤逻辑；`allowCustomValue` 允许添加自定义项并支持 hover 删除。移除 Combobox 依赖，`Combobox.svelte` 已废弃。

**自动布局协议**: Listbox 外层 portal anchor 只负责 `position:fixed` 定位与尺寸注入；真正的浮层面板由内层 `Frame column` 承担，使用 `.snowui-quick-action-panel` 共享视觉基类，并显式引用 `DROPDOWN_OVERLAY_APPEAR_MOTION` / `DROPDOWN_OVERLAY_DISAPPEAR_MOTION`。该 preset 只包含 opacity，不包含 scale；具体 duration / easing 以 motion preset catalog 为准，关闭时保留面板到 disappear preset 完成后再卸载。portal 通过 `LISTBOX_HEADER_PORTAL_KEY` context 暴露 `headerEl` 引用；`Input as="search"` 挂载后自动移入 `headerEl`（`.snowui-listbox-header.snowui-quick-action-panel-header`），不参与滚动。Listbox 与 QuickAction 共用同一套 `header + scroll-body` 结构与间距规则；唯一视觉差异只保留在外层面板 padding。为避免 `Frame column` 的 auto-layout 默认 `gap: 8px` 干扰浮层布局，Listbox 根层和 QuickAction 一样显式覆盖为 `gap: 0`。MenuItem 留在 `.snowui-listbox-body.snowui-quick-action-panel-scroll-body > .snowui-listbox`（flex:1; min-height:0; overflow-y:scroll; scrollbar-width:none）独立滚动。自定义浮层滚动条挂载在 `.snowui-listbox-body` 内，定位只覆盖实际滚动的 MenuItem 区域，不进入 Input 区域；滚动条覆盖在右侧，不占布局宽度。间距分工明确：面板 padding 定位 Input 与列表外边距，共享 header 规则负责搜索框与列表的内部衔接，MenuItem 自身 padding 定位选项背景和内容间距。无重复，无冲突。浮层滚动条默认可见宽 4px、距面板右边框 4px、thumb hover 时可见宽 8px 并从右向左增粗。

---

<a id="布局模型"></a>

### 布局模型

主布局模型：复合管理布局。

- Listbox 的区域结构为 portal anchor / panel / header / scroll body / option list / overlay scrollbar。
- Header 与滚动体复用 QuickAction 的面板区域规范；选项行优先复用 `MenuItem` 的槽位宿主布局。
- `Input as="search"` 只作为固定 header 内容移入，不参与滚动列表布局。
- Listbox 不注册为三槽位宿主，也不把 Portal 定位、滚动条和搜索区抽象成通用布局；这些都属于复合组件私有管理逻辑。

<a id="架构"></a>

### 与宿主的关系

| 宿主 | Context 提供者 | 通信方式 |
| :--- | :--- | :--- |
| Select | Select 通过 `setContext(LISTBOX_OWNER_CONTEXT_KEY, ...)` | `ListboxOwnerContext` |

---

<a id="组件-props"></a>

### 组件 Props

继承 [FrameProps](Frame.md)，排除 `children` / `tag`。Listbox 必须置于 Select 等提供选择上下文的宿主内；展开、当前值和选择事件由宿主拥有，不支持独立 `open`、`value`、`options`、`multiple` 或 `placement` 属性。


等宽模式使用锚点实测宽度加固定 2px，左右各外扩 1px，覆盖下层字段边框；保留小数定位精度。该固定 CSS px 补偿不随根字号缩放，适用于所有 Listbox 宿主；Hug 模式不增加补偿，更大的 minWidth / 内容扩展继续生效。规范例外见 [StyleSpec §2.1](../../../specs/StyleSpec.md#21-token-使用规范) 的 USER-LISTBOX-WIDTH-001。

<a id="宿主协议"></a>

### 键盘交互

| 按键 | 行为 |
| :--- | :--- |
| `↑` / `↓` | 上下移动高亮选项（含自定义项） |
| `Enter` / `Space` | 确认选择高亮项并关闭 |
| `Enter`（搜索框无匹配 + `allowCustomValue`） | 添加当前输入为自定义项并选中 |
| `Escape` | 关闭浮层，焦点还原至 Trigger |
| `Tab` | 关闭浮层 |

---

<a id="aria"></a>

### ARIA

| 元素 | 属性 |
| :--- | :--- |
| 浮层容器 | `role="listbox"`, `aria-labelledby={triggerId}` |
| 每个选项 | `role="option"`, `aria-selected` |
| 高亮项 | `data-highlighted="true"` |

---

<a id="使用示例"></a>


### 默认内置模式（推荐）

```svelte
<Select placeholder="请选择框架">
  <Listbox
    search
    items={[
      { value: "svelte", label: "Svelte" },
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" }
    ]}
    parts={{ Input: { placeholder: "搜索框架..." } }}
  />
</Select>
```

### 基础用法（在 Select 中）

```svelte
<script lang="ts">
  import { Select, Listbox, MenuItem } from '@snowui-design-system/components';
  let country = $state('us');
</script>

<Select bind:value={country} name="country">
  <Listbox>
    <MenuItem as="item" value="us">United States</MenuItem>
    <MenuItem as="item" value="cn">China</MenuItem>
    <MenuItem as="item" value="jp">Japan</MenuItem>
  </Listbox>
</Select>
```

### 带搜索过滤

```svelte
<Select placeholder="请选择城市">
  <Listbox search={false}>
    <Input as="search" placeholder="搜索..." />
    <MenuItem as="item" value="beijing">北京</MenuItem>
    <MenuItem as="item" value="shanghai">上海</MenuItem>
    <MenuItem as="item" value="hangzhou">杭州</MenuItem>
  </Listbox>
</Select>
```

### 搜索 + 允许自定义输入

```svelte
<Select placeholder="请选择或输入">
  <Listbox search={false}>
    <Input as="search" allowCustomValue placeholder="搜索或输入新选项..." />
    <MenuItem as="item" value="tag-a">Tag A</MenuItem>
    <MenuItem as="item" value="tag-b">Tag B</MenuItem>
  </Listbox>
</Select>
```

---


- Listbox 面板视觉与 QuickAction 对齐，但外层 padding 保持 8px。
- 搜索框固定在 header；选项滚动区域单独承载 overlay scrollbar。



<a id="连续-hover"></a>

### 连续 Hover

`continuousHover` 默认 `true`。开启时 Listbox 只使用一个容器级背景层在直接
`MenuItem` 之间移动，键盘 active 项也复用该层；关闭后恢复 MenuItem 原有的即时
hover / active 背景。disabled、filtered 项不会成为目标。


## AI Zone

以下章节保留源码维护约束，不属于应用接入步骤。

### 架构

Listbox 是纯 UI 浮层组件，不感知 `name` / `form` / `required` 等表单属性。通过 `ListboxOwnerContext`（由 Select 通过 `setContext` 提供）获取展开状态、定位锚点、选项数据等信息。

```
Portal anchor div (position:fixed; width/max-height only)
└── Frame column (.snowui-listbox-portal .snowui-quick-action-panel, dropdown overlay preset)
    ├── .snowui-listbox-header .snowui-quick-action-panel-header  ← Input 挂载后自动移入此处，不参与滚动
    └── .snowui-listbox-body .snowui-quick-action-panel-scroll-body
        ├── Frame column (snowui-listbox, flex:1, min-height:0, overflow-y:scroll, scrollbar-width:none)
        │   ├── MenuItem (role="option")
        │   ├── MenuItem (role="option")
        │   └── ...（用户自定义项排在静态项之后）
        └── .snowui-listbox-scrollbar (position:absolute; top:0; bottom:0)
```


### 定位逻辑

- Portal 到 `document.body`，`position: fixed` 逃出 overflow:hidden
- 宽度：至少与锚点（Field 或 Select 容器）等宽，必要时按内容扩展
- `matchTriggerWidth={false}` 时不继承锚点宽度，浮层按最长选项 Hug；所有选项在确定的面板宽度内 fill
- 垂直：选中项中心与 Trigger 中心对齐（无选中值时取中间项）；计算基于 `getBoundingClientRect()` 的真实视觉位置，兼容有无搜索 Input
- 最大高度：未设置 `maxHeight` 时按实际 Item 高度完整显示最多 10 项，并在视口收窄时至少保留 2 个完整项；通过 `maxHeight` 配置，并继续兼容 inline `style="max-height: ..."` 覆盖
- 每次打开前重新计算位置；本次展开中保留初始选中项对齐位置，搜索、清空与自定义项变化只更新列表高度，不再按过滤后的选项重新对齐。视口高度限制继续生效。


### 宿主协议

下表为组件内部通信说明，不是 Listbox 的公开 Props。


### ListboxOwnerContext 字段

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `open` | `boolean` | 浮层是否展开 |
| `selectedValue` | `string \| undefined` | 当前选中值 |
| `activeIndex` | `number` | 当前高亮项索引 |
| `showCheck` | `boolean \| undefined` | 宿主要求的选中勾选显示状态；Select 默认为 `true` |
| `triggerEl` | `HTMLElement \| null` | Trigger 按钮元素（焦点还原目标） |
| `anchorEl` | `HTMLElement \| null` | 定位锚点元素（宽度对齐目标） |
| `listboxId` | `string` | `id`，用于 `aria-controls` |
| `triggerId` | `string` | Trigger `id`，用于 `aria-labelledby` |
| `options` | `ListboxOptionRegistration[]` | 过滤后的静态选项列表（filterText 为空时为全量） |
| `filterText` | `string` | 当前搜索过滤文本（由 `Input as="search"` 写入） |
| `customOptions` | `ListboxOptionRegistration[]` | 用户通过 `allowCustomValue` 添加的自定义选项 |
| `registerOption(reg)` | `function` | 静态选项注册回调（MenuItem onMount 调用） |
| `unregisterOption(value)` | `function` | 静态选项注销回调（MenuItem onDestroy 调用） |
| `selectOption(value)` | `function` | 选中某选项 |
| `setActiveIndex(index)` | `function` | 设置高亮索引 |
| `setOpen(open)` | `function` | 控制展开/关闭 |
| `setShowCheck(showCheck)` | `function` | Listbox 将最终勾选配置同步给宿主，供显式组合 MenuItem 读取 |
| `setFilterText(v)` | `function` | 更新搜索文本（由 `Input as="search"` 的 oninput 调用） |
| `addCustomOption(value)` | `function` | 添加自定义选项（由 `Input allowCustomValue` 的 Enter 调用） |
| `removeCustomOption(value)` | `function` | 删除自定义选项（由 MenuItem 的删除按钮调用） |

---

<a id="键盘交互"></a>



> **内置图标统一（2026-09-11）**：复用Input与MenuItem的Button bare操作与图标规则。通过搜索新增的自定义选项由默认列表渲染，并支持hover删除；不重复注册为固定选项。

> **2026-09-10 浮层内边框**：面板复用共享浮层视觉，在原有投影上叠加 `var(--border-2)`（16px 根字号下 1px）、`var(--surface-1)` 的 inset 内边框，不占用布局尺寸。共享契约见 [StyleSpec §2.13](../../../specs/StyleSpec.md#213-quick-action-共享浮层视觉强制)。

<a id="样式规范"></a>

### 样式规范

### 浮层容器 (Quick Action 规范)

| 属性 | 值 |
| :--- | :--- |
| 背景 | `rgba(255,255,255,0.72)` / dark `rgba(30,30,30,0.72)` + `backdrop-filter: blur(1.25rem)` |
| 圆角 | `radius-4` (16px) |
| 阴影 | `0 8px 32px rgba(0,0,0,0.12)` |
| 边框 | `none` |
| padding | portal：`8px`，四周统一；header：底部 `4px` |
| 滚动 | `.snowui-listbox` 使用 `overflow-y: scroll` + `scrollbar-width: none` 隐藏原生滚动条 |
| 最大高度 | 默认按实际 Item 高度完整显示最多 10 项；JS 按可用视口高度收窄到完整项数且至少保留 2 项；显式 `maxHeight` 保持长度上限；inline `style="max-height:">` 可覆盖 |
| 滚动条样式 | 自定义浮层滚动条（透明轨道，默认 4px，hover 后 8px 并向左增粗，支持拖拽），挂载在 `.snowui-listbox-body`，不覆盖 Input 区域 |
| 宽度 | 与锚点元素等宽 |

### 选项 Item

| 属性 | 值 |
| :--- | :--- |
| padding | `8px` |
| 圆角 | `radius-3` (12px) |
| 字号 / 行高 | `14px / 20px` |
| hover 背景 | `Black/4%` |
| 选中标记 | Listbox 默认不渲染；`showCheck=true` 时使用 trailing check icon 16px，`opacity: 0` → `1` |
| 禁用状态 | `opacity: 0.4; pointer-events: none` |
| 过滤隐藏 | `data-filtered="true"` → `display: none` |

### 自定义项删除按钮

hover 自定义项（`data-custom="true"`）时，✔ 图标位置替换为 × 圆形按钮（复用 Input 清除按钮的 SVG），点击删除该自定义项。

### 搜索框间距

`.snowui-listbox-header` 直接复用 `../styles/layout.css` 的 `.snowui-quick-action-panel-header`，与 QuickAction 保持完全一致。搜索框与下方 MenuItem 的内部间距不再由 Listbox 私有规则控制；根因是 Listbox 根层先前漏掉了对 auto-layout 默认 `gap: 8px` 的覆盖，修复后与 QuickAction 一样由共享 header 规则接管。

---

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引

| 文件 | 说明 |
| :--- | :--- |
| `Listbox.svelte` | 浮层容器 — portal + fixed 定位 + Frame column + scrollbar |
| `MenuItem.svelte` | 选项 — Frame row + label fill + check/delete trailing |
| `../context.ts` | `ListboxOwnerContext` / `getListboxOwner()` |
| `../keys.ts` | `LISTBOX_OWNER_CONTEXT_KEY` |

### 参考实现
- **W3C 规范**: [ARIA Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)
- **shadcn-ui**: `@radix-ui/react-select` — portal + 自定义浮层
- **HeroUI**: `react-aria-components` Select primitive

### 关联关系
- **父级布局**: [Frame.svelte](Frame.svelte) — 使用 `<Frame column>` 作为内容容器
- **子组件**: [MenuItem.svelte](MenuItem.svelte)
- **宿主组件**: [Select.svelte](Select.svelte)、[Pagination.svelte](Pagination.svelte)
- **自动布局协议**: [../../../specs/LayoutProtocol.md](../../../specs/LayoutProtocol.md)
- **关联规范**: [../../../specs/HTMLSpec.md](../../../specs/HTMLSpec.md)

## 更新日志

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.3.5（2026-09-17）

- Listbox Portal 的最终水平位置使用共享浮层夹取能力限制在视口 8px 安全边距内，并限制面板最大宽度，修复靠近左右边缘时选项面板越出视口的问题。

### v1.3.4（2026-09-12）

- 打开期间跟随触发器状态动效更新定位和等宽尺寸，动效结束或取消时同步最终位置；关闭后取消跟踪。避免 Select 点击缩放恢复后，面板仍保留缩小时的宽度。

### v1.3.3（2026-09-12）

- 按用户要求移除横向取整，等宽 Listbox 总宽度增加固定 2px、左右各覆盖 1px；保留背景、模糊与内边框，固定 px 已登记规范例外。

### v1.3.2 (2026-09-12)

- 每次打开时记录选中项对齐位置；搜索、无匹配、清空与自定义项变化不再依据隐藏选项的零尺寸矩形重定位。
- 初始对齐与 active 项滚动只读取当前可见选项，保留完整项高度与视口约束。


### v1.3.1 (2026-09-03)

- Quick Action 与 overlay scrollbar 共享默认进入已登记的低优先级 CSS layer，组件 padding / 轨道定位不再被后加载的共享样式覆盖。
- 轨道定位抵消实际面板 padding；根字号缩放或公开 padding override 后，滚动条右缘仍距面板右缘 4px。

### v1.3.0 (2026-09-01)

#### 调整
- 未显式设置 `maxHeight` 时，面板改为按实际可见 Item 高度完整显示最多 10 项；视口空间不足时按完整项数收窄，并至少保留 2 项高度，避免末项只显示一部分后在 hover / 键盘高亮时触发自动滚动。
- 显式 `maxHeight` 与调用方 inline `max-height` 覆盖保持兼容。

### v1.2.2 (2026-07-05)

#### 修复
- `matchTriggerWidth` 改为“至少与触发器等宽”；当触发器过窄时，Listbox 按最长选项文字、勾选槽、gap 与 padding 的完整宽度扩展，避免文字、勾选重叠或右侧间距消失。

### v1.2.1 (2026-07-05)

#### 修复
- Portal 浮层隔离外层 Field Context，避免 Select 位于 Field 内时，搜索 Input 被误判为 embedded host 而丢失独立背景、边框、padding 与圆角。

### v1.2.0 (2026-04-24)

#### 调整
- 滚动条间距规范化，Listbox 与 QuickAction 对齐 header + scroll body 区域结构。
- 外部点击判断统一使用 `ListboxOwnerContext` 的 `triggerEl` / `anchorEl`，不再依赖 Select 私有 class，因此 Pagination 等其他 owner 也能复用同一套 Listbox。
- 默认出现 / 消失动效与 Popover、Menu 共用 opacity-only dropdown preset，移除 scale 通道。
