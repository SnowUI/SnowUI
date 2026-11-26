# SearchBox

> **版本**: v1.2.0
> **职责**: 提供打开搜索浮层的入口，整块区域均可点击，可组合快捷键提示，适合全局搜索。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

提供打开搜索浮层的入口，整块区域均可点击，可组合快捷键提示，适合全局搜索。

## 使用选择


用于打开全局搜索浮层的可点击入口，并非直接编辑查询的输入框。工具栏或列表直接输入查询用 SearchInput。

- 这是可点击搜索入口；bind:open 同步浮层状态，value 用于展示当前查询。
- 通过 children 组合浮层或快捷键提示；需要直接编辑查询时使用 SearchInput。
- 默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { SearchBox } from '@snowui-design-system/components';
	import { Kbd, Popover, SearchInput, MenuItem, Icon, Avatar } from '@snowui-design-system/components';
	import { MagnifyingGlass, AvatarByewind } from '@snowui-design-system/resource-svelte';
</script>

<Popover template id="search-box-usage-popup" size="md" closeOnSelect={false} style="width: 20rem;">
    <SearchInput placeholder="Search" />
    <MenuItem value="overview" closeOnSelect={true}>
        <Icon as="leading"><MagnifyingGlass /></Icon>
        搜索历史：Overview
    </MenuItem>
    <MenuItem value="contact-byewind" closeOnSelect={true}>
        <Avatar src={AvatarByewind} size={24} as="leading" />
        联系人：Byewind
    </MenuItem>
</Popover>

<SearchBox data-popover-target="search-box-usage-popup" style="width: 10rem;" placeholder="搜索">
    <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">⌘K</Kbd>
</SearchBox>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置内部生成的清除 Button；显式子内容不消费该默认配置。 |
| variant | `"gray" \| "outline"` | `"gray"` | 搜索框样式 |
| gap | `number` | — | 继承 Frame 的间距 token 索引；省略时保留原首选间距，显式值覆盖首选间距；有效图文间距至少为 4 CSS px，显式零、根字号或间距缩放不压低下限。 |
| value | `string \| number` | — | 当前搜索文本或展示值 |
| placeholder | `string` | — | 占位文本；未传时使用 searchBox.placeholder，zh-CN 为“搜索”、en-US 为“Search”；显式空字符串保留 |
| open | `boolean` | `false` | 浮层打开状态，支持 `bind:open` |
| disabled | `boolean` | `false` | 禁用触发器 |
| readonly | `boolean` | `false` | 只读触发器，不响应打开 |
| showSearchIcon | `boolean` | `true` | 是否渲染默认搜索图标 |
| collapseBelow | `number` | — | 当组件自身宽度小于或等于该 px 阈值时，仅保留 leading 搜索图标；未传时不启用 |
| clearable | `boolean` | `true` | 有值时是否显示清除按钮 |
| children | `Snippet` | — | 外置 leading/trailing，如 `Kbd` |
| onOpenChange | `(open: boolean) => void` | — | 打开状态变化回调 |
| onClear | `() => void` | — | 清除回调 |
| onclick | `(event: MouseEvent) => void` | — | 入口点击后调用，参数为原始 MouseEvent；非 disabled、非 readonly 时组件先打开搜索层，回调不能取消已执行的打开。 |
| onkeydown | `(event: KeyboardEvent) => void` | — | 处理 Escape 关闭及 Enter/Space 打开后调用，接收原始 KeyboardEvent；不能撤销已经发生的状态变化。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="功能概览"></a>

### 功能概览

- 两种样式：`gray` 与 `outline`
- 默认 leading 图标为 `Search`
- 外置 `Kbd` 由使用者通过 children 放入 trailing，不默认集成
- 有值时显示清除 X，视觉规则参考 `Input`
- 点击整块触发器打开浮层
- 可通过 `collapseBelow` 在自身宽度不足时只保留 leading 搜索图标；最小宽度由左右实际 padding + leading Icon 固有宽度组成
- 不显示焦点外圈；鼠标点击、Escape 等键盘操作后的视觉状态一致

---

<a id="api-参考"></a>


### 使用示例

```svelte
<SearchBox placeholder="Search">
  <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">/</Kbd>
</SearchBox>
```

```svelte

<SearchBox collapseBelow={80} placeholder="Search" />
```

```svelte
<script lang="ts">
  import { Kbd } from '@snowui-design-system/components';
  import { SearchBox } from '@snowui-design-system/components';
  let open = $state(false);
</script>

<SearchBox variant="outline" bind:open>
  <Kbd as="trailing" variant="solid" style="background-color: var(--surface-3);">⌘K</Kbd>
</SearchBox>
```


---


### 2026-11-13 行为同步

默认搜索图标使用不透明主题色；静止opacity为0.2，hover或有值时为0.4。图标颜色覆盖应提供不透明颜色，避免与opacity叠加。颜色变淡不作用于整个输入框。
