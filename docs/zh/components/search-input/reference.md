# SearchInput

> **版本**: v1.3.1
> **职责**: 提供带搜索图标的单行输入框，适合列表过滤、页面搜索和工具栏中的查询输入。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

提供带搜索图标的单行输入框，适合列表过滤、页面搜索和工具栏中的查询输入。

## 使用选择


用于直接输入查询文本，例如列表搜索。全局搜索浮层的入口用 SearchBox；查询如何筛选数据由宿主处理，DataTable 工具栏优先 TableToolbar。

- bind:value 同步输入，查询如何过滤业务数据由页面决定。
- 默认 as="search" 可接入 Listbox / Popover 的搜索区域；已有外壳时可选 borderless，避免重复表面。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { SearchInput, Icon } from '@snowui-design-system/components';
</script>

<SearchInput placeholder="Search" style="width: 20rem; max-width: 100%; height: var(--size-12); flex: none;" />
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| type | `InputProps["type"]` | `"search"` | 原生输入类型；默认使用搜索输入 |
| value | `string \| number` | — | 当前值，支持 `bind:value` |
| element | `HTMLElement` | — | 绑定根元素引用，用于读取实例或聚焦相关内容；不是输入值。 |
| defaultValue | `string \| number` | — | 初始值 |
| showSearchIcon | `boolean` | `true` | 是否渲染默认搜索图标 |
| collapseBelow | `number` | — | 当组件自身宽度小于或等于该 px 阈值时，在空值且未聚焦状态退化为仅搜索图标；未传时不启用 |
| variant | `"default" \| "borderless"` | `"default"` | 外观变体；`borderless` 移除自身边框、背景、圆角、padding 和 focus ring，在 Flex / Block 宿主中填满可用空间，并在 shrink-to-fit 宿主中保持稳定固有宽度，适合嵌入已有表面的工具栏或面板 |
| as | `InputProps["as"]` | `"search"` | 角色关键字;默认透传给内部 `Input`,使 SearchInput 放入 `<Popover>` / `<Listbox>` 时自动移入固定 header,行为与 `<Input as="search">` 一致。可显式覆盖。 |
| class | `string` | `""` | 追加到 SearchInput 根宿主的 class，保留组件自身样式类。 |
| children | `Snippet` | — | 外置 leading / trailing / 其他 Input 子内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="宿主组件特化模式"></a>

### 宿主组件特化模式

- `SearchInput` 以真实 `Input` 为主要视觉与交互宿主，直接平铺 `Input` 的兼容 Props，不提供 `parts.Input`。
- Props 类型由 `ComponentProps<typeof Input>` 推导；`value`、`defaultValue`、`type`、`as`、`class` 与 `children` 由 SearchInput 接管后显式传给宿主。
- `Input` 继续拥有原生输入事件、ARIA、disabled/readonly/invalid、Frame 能力与基础视觉；SearchInput 只拥有默认搜索语义、默认搜索图标和 `borderless` 特化样式。
- 组件无额外 wrapper，真实 `Input` 仍是根宿主；事件只由该宿主触发一次。
- `Input` 自身隐藏生成的错误 `Text` 仍可通过平铺后的 `parts.Text` 配置。


`SearchInput` 是 `Input` 的搜索场景变体。除默认 `type="search"` 和默认 leading 图标为 `Search` 外，其颜色、hover/focus、清除 X、三槽位布局、Frame 能力与 `Input` 保持一致。

<a id="功能概览"></a>

### 功能概览

- 默认使用语义名 `search` 的 Components 内置图标；可由应用级 `IconProvider` 或外置 leading 替换
- 内置默认 `Search` 静止态为 Black/20，输入激活态为 Black/40；该颜色规则只属于 `SearchInput`
- 支持外置 leading 替换默认图标
- 可通过 `collapseBelow` 在自身宽度不足时退化为仅搜索图标；最小宽度由左右实际 padding + leading Icon 固有宽度组成，空值且未聚焦时折叠，聚焦或已有值时恢复输入内容
- 清除 X、hover、focus、disabled、readonly、invalid 与默认错误 shake 等行为继承 `Input`
- 根能力通过内部 `Input` 接通 `Frame`

---

<a id="api-参考"></a>


### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| placeholder | `string` | — | 占位文本 |
| 其余兼容 Props | `ComponentProps<typeof Input>` | 同 Input | 平铺至真实 Input 宿主；包括 size、style、disabled、readonly、invalid、事件、ARIA、Frame Props 与 `parts.Text` |

### 浮层场景

`SearchInput` 默认 `as="search"`。放入 `<Popover>` / `<Listbox>` 内时,内部 Input 通过 `LISTBOX_HEADER_PORTAL_KEY` context 自动移入浮层 header(紧凑样式 + 无 focus 外环 + 不参与下方滚动)。Listbox 场景下因 SearchInput 不接管过滤,如需 Listbox 过滤逻辑请直接使用 `<Input as="search">`。

### 使用示例

```svelte
<SearchInput placeholder="Search" />
```

```svelte

<SearchInput collapseBelow={80} placeholder="Search" />
```

```svelte

<SearchInput variant="borderless" placeholder="Search" />
```

```svelte
<SearchInput placeholder="Search">
  <Icon as="leading"><SearchIcon2 /></Icon>
</SearchInput>
```


---


### 2026-11-13 行为同步

默认搜索图标静止opacity为0.2，focus时为0.4；颜色为不透明主题色，通过所属图标的公开style传入，避免Input通用leading附件的20%色再次叠加。外置leading图标不受此规则影响。`--snowui-search-input-icon-color-override`可覆盖默认图标颜色，应传入不透明颜色；透明度仍由组件状态控制。
