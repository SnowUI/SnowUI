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
用于复用搜索输入与结果的标准布局。SearchBox 是打开入口；SearchPopup 是面板，默认静态呈现。需要遮罩时由 Dialog 包裹，锚定触发器时使用继承的 Popover 模版或内嵌模式。

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
| value | `string \| number` | `''` | 搜索输入值，支持 bind:value；过滤由消费方负责。 |
| search | `boolean` | `true` | 是否生成默认 SearchInput；显式输入时关闭。 |
| title | `string` | — | 可选面板标题，位于结果区顶部；children 模式由显式内容接管。 |
| showGroupTitles | `boolean` | `true` | 是否生成 items 的来源分组标题；不改变顺序。 |
| items | `SearchPopupItem[]` | `[]` | value、label、href 必填；group、disabled 可选；按输入顺序呈现，连续相同 group 只显示一次。 |
| children | `Snippet` | — | 替换全部默认结果与标题；不再读取 items / title / showGroupTitles。 |
| parts | `ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>` | — | 配置实际生成的输入、结果和标题；value、children、身份、disabled 由所属数据控制。 |

兼容属性继承 Popover；默认 size=md、closeOn=manual，标准静态搜索面板宽度名义 480px。显式使用浮层时设置 template/id 或 as="popover"，并按需要设置 closeOn。外层 class 和 style 透传真实 Popover 宿主。没有新增模态、定位、滚动和动效系统。

## 使用边界与详细说明

默认内置模式生成 SearchInput、Text、MenuItem。parts 不改写显式 children。Input 可通过 parts.SearchInput 配置 placeholder、ARIA 与 autofocus；内置文字沿用 SearchInput 的 locale 默认值，本组件不新增固定业务文案。默认结果 href 使用原生链接；默认数据结果必须提供 href；命令操作等非导航内容使用 children 显式组合具备键盘语义的 Button。

结果区域距输入分隔线 8px；第一个标题不重复叠加，后续分组标题前增加 8px；无标题时第一项仍距分隔线 8px。标题自身沿用 4px 垂直、8px 水平 padding。公开角色 group-title 是多项角色，允许 Text 或原生 data-as；仅控制标题的颜色与间距，不改写业务内容。as=item 保留 MenuItem 自身语义，不创建 Listbox 选择 owner。

标题和分组可省略；显式复杂内容可以组合 Avatar、Icon、MenuItem。模态场景放入 Dialog，Dialog 管理 opaque 遮罩、焦点圈定、关闭与恢复；SearchPopup 不管理这些行为。静态面板 SSR 不访问浏览器全局，动效及 reduced-motion 继承 Popover。不开启定位模式时不新增定位监听器。

## AI Zone

主布局为复合管理布局，主要宿主为真实 Popover（内部 Frame），不额外包装 FramePro。输入与结果共同使用 Popover 的滚动 body，显式 as="content" 不进入固定搜索 header。results wrapper 拥有分隔线下方间距，group-title 拥有组间间距。根 class snowui-search-popup；私有结果 class 不作为外部接口，显式组合只按公开 as 角色识别。

公开 override：--snowui-search-popup-results-gap-override、--snowui-search-popup-group-gap-override；默认均为 gap-2。根几何继承 Popover 的覆盖入口，不复制。输入与项的默认视觉只通过公开组件 class 传入自有样式，不穿透其私有 DOM。

## 更新日志

- 2026-10-07：以 PRO Composite Block 提供搜索面板组合；原 SearchPopup 浮层容器的历史删除仍成立，新的区块不恢复旧浮层实现。

内置搜索图标复用 ComponentIcon 的 search，24px 画布，原始资源 resource-base/raw-assets/icons/snowui/Search.svg；viewBox 0 0 32 32，未改路径、留白或比例；可由 IconProvider 统一替换。
