# SearchPopup

> **版本**: v1.0.0
> **职责**: 统一搜索面板的输入、可选标题、分组与结果间距。
> **包归属**: PRO Blocks
> **源码策略**: 付费源码开放
> **区块类型**: Composite Block

## 组件介绍

可组合的搜索面板，内置 SearchInput 和可选数据结果，支持无分组、分组标题与显式复杂内容。运行时依赖 @snowui/components-pro 和 Components；不包含搜索算法、最近浏览、热度或业务路由规则。

## 使用选择

<!-- usage-guide:start -->
用于复用搜索输入与结果的标准布局。SearchBox 是打开入口；SearchPopup 是面板，默认静态呈现。设置 backdrop 可启用共享模态遮罩；无遮罩时，锚定触发器使用继承的 Popover 模版或内嵌模式。

- items 生成文字或链接结果，group 可选；showGroupTitles 控制分组标题。
- children 替换全部内置结果；显式标题用 Text as="group-title"，项用 MenuItem as="item"。
- search=false 后可显式提供 SearchInput as="content"；该输入直接配置，不消费 parts。
<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
    import { SearchPopup } from '@snowui/components-pro';
</script>
<SearchPopup items={[{ value: 'button', label: 'Button', href: '/components/button', group: 'Recommended components' }]} />
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| backdrop | `BackdropVariant \| false` | `false` | false 保持原静态或锚定模式；opaque、blur、transparent 启用 Dialog 共享模态遮罩。 |
| closeOnOutside | `boolean` | `true` | 模态模式点击遮罩关闭；与遮罩视觉独立。 |
| value | `string \| number` | `''` | 搜索输入值，支持 bind:value；过滤由消费方负责。 |
| search | `boolean` | `true` | 是否生成默认 SearchInput；显式输入时关闭。 |
| title | `string` | — | 可选面板标题，位于结果区顶部；children 模式由显式内容接管。 |
| showGroupTitles | `boolean` | `true` | 是否生成 items 的来源分组标题；不改变顺序。 |
| items | `SearchPopupItem[]` | `[]` | value、label、href 必填；group、disabled 可选；按输入顺序呈现，连续相同 group 只显示一次。 |
| children | `Snippet` | — | 替换全部默认结果与标题；不再读取 items / title / showGroupTitles。 |
| parts | `ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>` | — | 配置实际生成的输入、结果和标题；value、children、身份、disabled 由所属数据控制。 |

兼容属性继承 Popover；默认 size=md、closeOn=manual，标准静态搜索面板宽度名义 480px。显式使用浮层时设置 template/id 或 as="popover"，并按需要设置 closeOn。外层 class 和 style 透传真实 Popover 宿主。模态模式复用 Dialog，不新增模态、定位、滚动和动效系统；class/style 与 parts 仍作用于内部搜索面板，模态外壳使用面板默认宽度。

## 使用边界与详细说明

默认内置模式生成 SearchInput、Text、MenuItem。parts 不改写显式 children。Input 可通过 parts.SearchInput 配置 placeholder、ARIA 与 autofocus；内置文字沿用 SearchInput 的 locale 默认值，本组件不新增固定业务文案。默认结果 href 使用原生链接；默认数据结果必须提供 href；命令操作等非导航内容使用 children 显式组合具备键盘语义的 Button。

按 [Figma SearchPopup](https://www.figma.com/design/eDqeDtsitne9fCi9yA0ltz/SnowUI-Design-System?node-id=35426-172964) 的垂直间距：默认 md 面板上下 padding 为 16px，搜索区上 4px、下 16px；结果区域距输入分隔线 16px。结果按单列排列，标题与 item、相邻 item 之间为 gap-1（4px）；后续分组标题增加 gap-3（12px）上间距，与行间距合计 16px。首个标题不额外叠加 margin；无标题时首项同样距分隔线 16px。标题垂直 padding 为 0、水平 8px，item 上下 padding 为 8px。公开角色 group-title 是多项角色，允许 Text 或原生 data-as；仅控制标题的颜色与间距，不改写业务内容。as=item 保留 MenuItem 自身语义，不创建 Listbox 选择 owner。

标题和分组可省略；显式复杂内容可以组合 Avatar、Icon、MenuItem。设置 backdrop 时由内部 Dialog 管理共享遮罩、渐入渐出、反向接续、减少动效、焦点圈定与恢复、背景滚动锁定。closeOnEscape 控制 Escape 关闭，closeOnOutside 控制遮罩关闭。使用 bind:open 控制显隐；template/id 模式使用 data-dialog-target、data-dialog-close 或 showDialog/hideDialog；as="popover" 在此模式下使用 Dialog 内联触发。不要再包外层 Dialog，避免双重遮罩。模态时内部 Popover 不自行关闭；closeOn/closeOnSelect 仅用于无遮罩模式。默认链接结果会关闭 Dialog；显式结果可使用 data-dialog-close。静态面板 SSR 不访问浏览器全局，动效及 reduced-motion 继承 Popover。不开启定位模式时不新增定位监听器。

## AI Zone

主布局为复合管理布局，主要宿主为真实 Popover（内部 Frame），启用 backdrop 时组合 Dialog，不额外包装 FramePro。输入与结果共同使用 Popover 的滚动 body，显式 as="content" 不进入固定搜索 header。results wrapper 拥有分隔线下方间距，group-title 拥有组间间距。根 class snowui-search-popup；私有结果 class 不作为外部接口，显式组合只按公开 as 角色识别。

公开 override：--snowui-search-popup-results-gap-override、--snowui-search-popup-group-gap-override；默认分别为 gap-4 与 gap-3（后者加行间距 gap-1 后形成 16px 组间距）。根几何继承 Popover 的覆盖入口，不复制。输入与项的默认视觉只通过公开组件 class 传入自有样式，不穿透其私有 DOM。

## 更新日志

- 2026-10-07：以 PRO Composite Block 提供搜索面板组合；原 SearchPopup 浮层容器的历史删除仍成立，新的区块不恢复旧浮层实现。

内置搜索图标复用 ComponentIcon 的 search，24px 画布，原始资源 resource-base/raw-assets/icons/snowui/Search.svg；viewBox 0 0 32 32，未改路径、留白或比例；可由 IconProvider 统一替换。
