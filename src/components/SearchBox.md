# SearchBox

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.2.0
> **职责**: 提供打开搜索浮层的入口，整块区域均可点击，可组合快捷键提示，适合全局搜索。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

提供打开搜索浮层的入口，整块区域均可点击，可组合快捷键提示，适合全局搜索。

## 使用选择

<!-- usage-guide:start -->
用于打开全局搜索浮层的可点击入口，并非直接编辑查询的输入框。工具栏或列表直接输入查询用 SearchInput。

- 这是可点击搜索入口；bind:open 同步浮层状态，value 用于展示当前查询。
- 通过 children 组合浮层或快捷键提示；需要直接编辑查询时使用 SearchInput。
- 默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
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
<!-- /quick-start:generated -->

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
<!-- 容器收窄到 80px 以下时只保留搜索图标 -->
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


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---




## AI Zone

### 内置文案与语言

使用现有 `useLocale()`，key：`searchBox.placeholder`、`searchBox.clear`。默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。Provider messages 可覆盖缺省文案。


> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。`parts.Button` 配置默认内置操作按钮（包含 size、class、style），功能事件、ARIA和角色仍由父组件控制。





`SearchBox` 是搜索浮层的触发器，交互类似 `Select`。它不是原生输入框，整个组件都是可点击区域；视觉颜色、hover、focus、清除 X、内部布局参考 `Input`，并通过 `Frame` 接通 Frame 能力。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 布局模型

主布局模型：**槽位宿主布局**。定义见 `../../../docs/standards/LayoutProtocol.md`。

`SearchBox` 使用 `Frame row singleLine` 固定启用内部自动布局协议；外部 `enableAutoLayout={false}` 不关闭该搜索触发器的三槽位布局。图标、内容与快捷键／清除附件之间的有效间距至少为 4 CSS px，根字号或间距缩放和 gap={0} 不压低下限，较大的首选间距保留。单行内容不响应 column 方向降级；图标退化态仍只显示原有 leading，不插入文字或空槽。原始文本流继续保留完整可访问名称，外置 children 与弹层仍由原组合协议拥有：

- Leading：默认 `Search`，或外部 `data-as="leading"` 替换。
- Content：文本内容，Fill，`min-width: 0`。
- Trailing：外置 `Kbd` 或内建清除 X。

`collapseBelow` 复用 Components 包公开的 `resizeManager` 监听真实根宿主，不创建组件私有 `ResizeObserver`。命中阈值后仅由 SearchBox 隐藏 Content / Trailing 并收敛网格；页面仍负责给组件分配宽度以及决定具体阈值。

### 样式数值

样式数值登记在 `../../../docs/reference/ComponentStyleSheet.md`。

默认触发器数值来自 Figma：

- padding-y: 4px
- padding-x: 8px
- gap: 8px
- radius: 16px
- icon: 16px
- text: 14px / 20px
- 外置 `as="trailing"`：默认 `Black/20%`；内建清除 X 继续使用共享清除按钮颜色规则
- 快捷键 Kbd 由使用方显式传入 `variant="solid"` 与 `style="background-color: var(--surface-3);"`，无边框，背景为 Surface/3；不改变 Kbd 的全局默认样式。
- 背景模糊：`blur(1.25rem)`（20px，与 Tooltip 一致），可通过 `--snowui-search-box-background-blur-override` 覆盖

颜色与状态参考 `Input` / `Field` CSS 行为，但 `SearchBox` 是搜索浮层触发器，不是文本输入框，因此不显示 Field focus ring，也屏蔽全局 `focus-visible` outline；点击后、按 Escape 关闭后都应保持无焦点外圈。

### Frame 能力

根节点使用 `Frame`，必须显式传入：

- `enableResponsive`
- `enableContext`
- `enableScaleObserver`

`...rest` 透传到根 `Frame`，保留状态、动效、Skeleton、响应式、样式编排等共享能力。

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| SearchBox | [SearchBox.svelte](SearchBox.svelte) | 搜索触发器 |

### 关联关系

- **依赖**: Frame、Icon、Search
- **协作组件**: SearchPopup、Kbd
- **包归属**: @snowui-design-system/components

---

## 更新日志

### v1.2.0 (2026-10-23)

- 搜索触发器复用共享单行与间距解析，显式零和字号／间距缩放后仍至少为 4 CSS px，保留较大首选间距与原图标退化态。
- 固定内部三槽位布局，避免响应式 column 或外部关闭 auto layout 破坏已声明的宿主合同；清除、键盘、禁用／只读、外置快捷键与搜索浮层协议不变。

### v1.1.2 (2026-10-20)

- 默认占位和清除名称随 LocaleProvider 切换；显式 placeholder（含空字符串）与 aria-label 优先，查询值保持原样。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.1.1 (2026-08-14)

- SearchBox 根组件默认增加与 Tooltip 一致的 `backdrop-filter: blur(1.25rem)`，并提供 `--snowui-search-box-background-blur-override`。

### v1.1.0 (2026-08-10)

- 新增 `collapseBelow`，可在自身宽度不足时退化为仅 leading 搜索图标；图标态最小宽度等于左右实际 padding + leading Icon 固有宽度。
- 尺寸监听复用 Components 全局 `resizeManager`，页面只负责分配宽度与选择阈值。

### v1.0.3 (2026-05-09)

#### 修复

- 屏蔽 SearchBox 根节点的全局 `focus-visible` outline，避免点击打开后按 Escape 重新出现灰色焦点外圈。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增 搜索框触发器，支持灰底和边框样式。
