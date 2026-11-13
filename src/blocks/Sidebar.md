# Sidebar

> **版本**: v1.9.5
> **职责**: 组织应用的品牌入口、分组导航与底部操作，支持折叠和独立滚动，适合多页面应用。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

组织应用的品牌入口、分组导航与底部操作，支持折叠和独立滚动，适合多页面应用。

## 使用选择

<!-- usage-guide:start -->
用于应用左侧分组导航，组合 SidebarSection 与 SidebarItem。页面负责路由和内容；公开 logo / footer 角色可替换内置内容，普通右侧信息列不使用 Sidebar。

- sections 提供导航数据；children 与 sections 同时渲染，并非替换关系。
- 直属 as="logo" 替换标识，as="footer" 进入固定底部；宽度和折叠状态可绑定，默认启用持久化。
- 导航及滚动区默认名称、内置折叠按钮（含text浮层展开按钮）随LocaleProvider更新；显式ariaLabel优先于Provider消息。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Avatar, Button, Icon, Separator } from '@snowui-design-system/components';
	import { AvatarByewind, Github } from '@snowui-design-system/resource-svelte';
	import { Sidebar, SidebarItem, SidebarSection } from '@snowui-design-system/components';
	let collapsed = $state(false);
	let activeItemId = $state('components');
</script>

<div style="display: flex; align-items: flex-start; justify-content: center; width: min(100%, 24rem); height: 24rem; min-width: 0;">
    <Sidebar bind:collapsed activeItemId={activeItemId} onActiveItemChange={(id: string) => activeItemId = id} persistence={false} resizable={false} ariaLabel="SnowUI documentation" navigationVariant="icon">
        <SidebarItem id="introduction" label="Introduction" icon="book" iconCollection="phosphor" />
        <SidebarItem id="quick-start" label="Quick Start" icon="rocket" iconCollection="phosphor" updated />
        <Separator />
        <SidebarSection id="library" title="Library">
            <SidebarItem id="components" label="Components" icon="squares-four" iconCollection="phosphor" />
            <SidebarItem id="charts" label="Charts" icon="stack" iconCollection="phosphor" />
        </SidebarSection>
        <div data-as="footer" style="display: flex; align-items: center; gap: var(--gap-3);">
            <Button bare iconOnly href="https://byewind.com" target="_blank" rel="noopener noreferrer" aria-label="SnowUI maintainer"><Avatar src={AvatarByewind} size={24} dataName="SnowUI maintainer" /></Button>
            <Button bare iconOnly href="https://github.com/SnowUI" target="_blank" rel="noopener noreferrer" aria-label="SnowUI on GitHub"><Icon size={24}><Github /></Icon></Button>
        </div>
    </Sidebar>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| sections | `SidebarSectionData[]` | `[]` | 分类数组，每项必填唯一 id，可选 title、collapsible、defaultCollapsed、actions、items、content；content 优先于 items。items 使用 SidebarItemData 的 id、label、icon、href 等字段。 |
| navigationVariant | `"icon" \| "text"` | `"icon"` | 导航结构变体；`text` 表示无图标导航，折叠后根宽度与 padding 为零，只保留位于当前页面可视区域左上方的展开按钮；不自动扫描内容推断图标 |
| collapseMode | `"compact" \| "hidden"` | `"compact"` | compact保留原折叠轨道；hidden整体滑出并保留浮动展开按钮，内部导航不压缩。 |
| collapsed | `boolean` | — | 受控折叠状态，支持 bind:collapsed；未传时从 defaultCollapsed 初始化内部状态。 |
| defaultCollapsed | `boolean` | `false` | 非受控初始折叠状态 |
| width | `number` | `220` | 展开宽度，支持 `bind:width`；拖拽右侧边框时实时更新 |
| minWidth | `number` | `160` | 可拖拽展开宽度下限 |
| maxWidth | `number` | `480` | 可拖拽展开宽度上限 |
| resizable | `boolean` | `true` | 是否启用右侧边框调宽命中层 |
| activeItemId | `string` | — | 外部控制的选中项 id；未传时使用内部选择或恢复的持久化值。仅选择状态，不自动替宿主进行路由。 |
| persistence | `boolean` | `true` | 是否记忆侧栏折叠、active item 与各 Section 折叠状态 |
| persistenceKey | `string` | `"default"` | localStorage 实例命名空间；同一页面存在多个 Sidebar 时必须分别设置 |
| ariaLabel | `string` | `locale 文案` | 导航及其滚动区域的可访问名称；省略时随 LocaleProvider 更新，显式值优先，多实例应提供可区分的名称。 |
| continuousHover | `boolean` | `true` | 是否在可用导航项之间移动共享 hover 背景；关闭后恢复逐项 hover，选中状态不受影响。 |
| onCollapsedChange | `(collapsed: boolean) => void` | — | 用户点击内置按钮切换后调用，参数为新折叠状态，不可取消。 |
| onWidthChange | `(width: number) => void` | — | 用户调宽时调用，参数为夹取到 minWidth/maxWidth 的整数像素宽度。 |
| onActiveItemChange | `(itemId: string) => void` | — | 导航选择或恢复合法持久化选中项时调用，参数为选中项 id；宿主处理内容与路由。 |
| footer | `Snippet` | — | 固定底部内容，SSR原位渲染，优先于as="footer"内容。 |
| children | `Snippet` | — | 无参数显式内容，与 sections 同时渲染；直属 as="logo" 替换 Header Logo，as="footer" 放入固定 Footer，其余内容进入导航区。 |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator; SnowUILogo: typeof SnowUILogo; SidebarSection: typeof SidebarSection; SidebarItem: typeof SidebarItem; }>` | — | 配置调宽交互层使用的 Indicator，以及默认生成的 SnowUILogo / SidebarSection / SidebarItem；Indicator 复用默认状态视觉 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 尺寸边界

默认 Logo 图形为 24×24（16px 根字号），字标与其他布局保持原值。

## 使用边界与详细说明

<a id="api-参考"></a>

### API 参考

默认 Logo 的 host 为 `as="logo"`，内部以 `SnowUILogo as="logo-icon" variant="icon"` 与 `SnowUILogo as="logo-wordmark" variant="text"` 明确区分图形和字标。直接子节点 `as="logo"` 会被安置到 Header 并完整替换默认 Logo；自定义 Logo 同样必须用它的直接子节点 `as="logo-icon"` 标记折叠后保留的图形，其余直接子节点视为展开态文字或字标并在折叠时隐藏。直接子节点 `as="footer"` 会被安置到底部覆盖 Footer。它们不抑制 `sections` 生成的 Body 内容，其余显式子节点会与 `sections` 依次渲染在 Body。第三方内容不支持 `as` 时，用对应角色的 `Frame` 包裹。Sidebar 根输出 `data-collapsed`，并提供 Sidebar Context。

```svelte
<Sidebar activeItemId="dashboard" persistenceKey="workspace-primary">
  <Frame as="logo" singleLine>
    <BrandIcon as="logo-icon" />
    <Text lines={1}>Brand</Text>
  </Frame>
  <SidebarItem id="dashboard" label="Dashboard" icon="dashboard" updated />
  <Separator />
  <SidebarSection id="page" title="Page">
    <SidebarItem id="social" label="Social media" icon="chat" />
  </SidebarSection>
  <Text as="footer">© 2026 SnowUI</Text>
</Sidebar>
```

<a id="布局与行为"></a>

### 布局与行为

- 展开默认宽度 `220px`，有图标模式折叠宽度由两侧外 padding、Item 横向 padding 与图标宽度计算（默认 `56px`），text 模式折叠宽度 `0px`，高度 `100%`。`resizable={true}` 时，右侧边框全高均可在默认 `160px`～`480px` 范围内拖拽调整展开宽度，并通过 `width` / `bind:width` 与 `onWidthChange` 对外同步；边缘显示 Indicator 默认宽度调整指示器。设为 `false` 时不渲染整边调宽命中层。
- 折叠与展开以 Sidebar 根宽度为主时间轴：展开宽度 → 折叠宽度（icon 默认 56px，text 为 0px）使用 `SIDE_PANEL_DISAPPEAR_MOTION` 的临界阻尼 spring timing，折叠宽度 → 上次展开宽度使用 `SIDE_PANEL_APPEAR_MOTION` 的同系 timing；该 timing 复用 Frame 默认 move spring。拖拽期间临时关闭宽度 transition，使边缘与指针同步；`enableDefaultMotion={false}` 与系统 reduced motion 均关闭该过渡。
- 右侧整边调宽命中层仅在 `resizable={true}` 且展开态存在，沿 Sidebar 右侧边框全高铺开，渲染 Indicator 默认短条。命中层与 Sidebar 的可见 overlay scrollbar Thumb 重叠时遵守 Indicator 的滚动条优先规则。折叠不会覆盖已调整的展开宽度，再次展开时恢复该宽度。
- 根容器默认 padding 为左右 `12px`（`var(--padding-3)`）、上下 `16px`（`var(--padding-4)`）；这是 Sidebar 组件默认值，不由使用方重复补 class 或 style。
- 纵向滚动条轨道仅覆盖固定Header与可见Footer之间的导航区域，边界随两者实测高度更新，沿用ScrollArea的轨道测量与拖拽；内容遮罩保持不变。
- Header 与 Footer 均为非滚动区；Footer 全宽贴底，`ScrollArea` 独立滚动并延伸至底部，在 Footer 区域内按设计渐隐。Sidebar 根的 Header / Body 默认 gap 为 `var(--gap-3)`（12px），即 Logo 区域与下方导航区域之间的默认间距；它与 Body 内相邻导航内容的 4px gap 是两个独立层级。
- Body 纵向 overlay scrollbar 根据根横向 padding 自动外移，轨道右边缘始终距 Sidebar 右边框 `4px`；默认 12px 横向 padding 时其 `right` 偏移为 `-8px`。
- Logo 所在 Header 区域使用 `4px` 上下 padding；滚动视口延伸到 Logo 区域背后，并以 Header 实测高度、顶部 padding 和 Header/Body gap 组成的固定区高度实现反向渐隐：从下往上进入区域 20% 时保留 20% 可见度，到 40% 时完全消失。Logo 本身不参与遮罩，列表顶部保留对应空间。
- Body 导航内容默认使用 `var(--gap-1)`（4px）间距，直接组合的 SidebarItem 与 SidebarSection 内部列表保持一致。
- `SidebarItemData.depth={1}` 与显式 `SidebarItem depth={1}` 使用同一二级导航视觉：组件在 leading 槽绘制等长双臂、1px Black/40% 密集点线、4px 圆角的 L 形层级连接线，并以该连接线替换普通 Icon。竖线中心与一级 Item Icon 中心同列，横线中心与二级文字中心同轴。
- Sidebar 内所有横向 Separator 使用同一默认样式，不区分 SidebarSection 自动生成或调用方显式组合：上下与左右 padding 均为 `8px`（`var(--padding-2)`）、`line-height: 0`、分割线本体保持 Separator 默认 `0.5px` 与 Black/10%。节点自身使用 content-box 背景裁切表达 padding，不要求外部 wrapper 或 class；横向与纵向 padding 分别通过 `--snowui-sidebar-separator-padding-x-override`、`--snowui-sidebar-separator-padding-y-override` 覆盖。每个 SidebarSection 的分类内容末尾内置该 Separator，调用方无需为分类手动补分割线。
- 状态记忆默认开启，未传 `persistenceKey` 时使用 `snowui:sidebar:default` 保存 active item 与各 Section 的折叠状态。刷新后自动恢复标题展开 / 折叠状态与最后 active item；恢复时若当前 active item 位于已折叠 Section，Sidebar 强制展开该 Section，并将修正后的展开状态重新保存。外部传入的 `activeItemId` 优先于旧存储记录；可见的无分类 active item 不得继承旧分类 ID 并误展开该分类。同一 origin 存在多个 Sidebar 时，宿主必须提供稳定且唯一的 `persistenceKey`；不需要状态记忆时显式设置 `persistence={false}`。
- 恢复 active item 后，仅当 Body 确实存在纵向溢出时才定位：以“active item 中心 = Body 实际可视区域中心”为目标，首尾位置按可滚动边界夹紧。恢复后立即定位一次，并在默认 Section 布局动效结束后再次校正，避免折叠布局变化造成偏移。
- active 视觉状态由 Sidebar 管理；宿主仍通过 `activeItemId` / `onActiveItemChange` 持有实际导航与内容切换。恢复合法的持久化 active item 时，Sidebar 会调用 `onActiveItemChange` 通知宿主。
- 默认与自定义 `as="logo"` host 均使用 `4px` 左右 padding，使 Logo 图形与 SidebarItem 图标垂直对齐。
- Header 在展开 / 折叠状态使用同一套起始对齐结构，Logo Icon 保持固定 leading slot；Test 示例以固定宽度左对齐宿主承载 Sidebar，避免居中宿主在根宽度变化时带动整个 Logo 位移。Logo host 强制保持单行，wordmark 通过 host 裁切与透明度收起，不会在窄宽度下换行并撑高 Logo，也不在动效起点直接切换整体 Header 对齐。
- 折叠按钮是内置默认样式 `<Button iconOnly size="sm">`，与 Logo 位于同一 Header 水平线上，并始终位于 Logo host 分配区域的右边。透明命中 host 使用 `--size-6`，展开时由 Header flex 安置；折叠 icon 模式脱离正常流，位于 Header 内容右侧 `var(--gap-1)` 处并垂直居中，不挤压或遮挡 Logo；展开态增加 `var(--padding-1)`（4px）右侧 margin，使按钮相对原位置左移 4px，折叠态不增加该间距。`ResourceSize` 16 图标在 host 内居中；展开态图标不得越过 Header 与导航项共用的内容右边界，在 16px 名义根字号下与该边界保持 `8px` 间距。不得用页面补偿或非 Token 偏移改变此位置。Logo host 填充按钮之前的剩余 Header 宽度，只设置稳定的 36px 最小 leading slot；按钮会跟随 Sidebar 宽度以 Frame 默认 move spring 从 Logo 区域右侧平移到折叠位置，不发生瞬移。按钮外层保留同尺寸透明命中 host，因此鼠标进入 Sidebar，或直接进入按钮应出现的位置（包括折叠态超出根视觉边界的部分）时都能显示按钮。默认 `navigationVariant="icon"` 时按上述 hover / focus-within 规则显形；`navigationVariant="text"` 的折叠态隐藏 Logo、Body 和 Footer，根宽度、padding 与 gap 收到零；展开按钮脱离根布局，挂载到 body 并在支持时进入浏览器 top layer，保持可见、可点击。按钮命中盒距当前可视区域左边 var(--padding-3)（名义 12px），上边 var(--padding-4)（名义 16px）；采用 fixed 定位保证页面滚动不改变边距。旧浏览器回退为 body 浮层。按钮保留原有图形与尺寸；Header 与顶层按钮交接时从当前可见位置连续移动，复用侧栏展开/收起的 spring timing，快速反向操作从当前动画位置接续；reduced motion 或 enableDefaultMotion={false} 时直接定位；键盘操作后焦点在内置按钮与浮层按钮间恢复，隐藏侧栏 inert 且 aria-hidden。
- 折叠开始时，Sidebar 宽度、Item 文字与 Section 标题同时开始变化：宽度收窄，Logo文字、Item文字和标题共用Sidebar根解析的Frame color bridge渐隐时钟；Item leading Icon 保持原横向位置。标题透明度归零后，标题高度、padding 与 Section gap 才消费 Frame size bridge 收起，Item 随后上移。展开时按同一组 bridge 平滑恢复。
- 折叠按钮不内置 Tooltip，通过随状态更新的 `aria-label` 保留“展开 / 折叠侧边栏”可访问名称。其余内置 Tooltip（折叠态 Item label、Item action、Section action）统一位于对应元素右侧（`position="right"`）。Section 标题默认可折叠但不显示 Tooltip。
- 默认不设置背景色。
- Footer 只内置底部覆盖区域，不内置业务文案；区域默认使用 Figma Auto Layout 的 Align top left：内容整体位于容器左上方，内部横向排列并在同一水平线上垂直居中，内容 gap 为 `8px`；显式`singleLine`的Footer内容组合保留至少4 CSS px横向间距，较大现有覆盖保持；普通Footer间距不改。区域全宽贴底，内边距上 `12px`、下 `16px`、左右 `20px`。区域无圆角，不绘制背景色，也不使用背景模糊，避免覆盖宿主边框及拖宽时的模糊重绘。直接子节点 `as="footer"` 提供业务内容。折叠 / 展开期间 Footer 固定使用展开态内容宽度与底部位置，不跟随根宽度收缩或位移，只使用与 Sidebar 宽度时间轴一致的 opacity 渐隐 / 渐显；折叠态通过 `inert`、`aria-hidden` 与 `pointer-events: none` 退出交互。
- 存在 Footer 时，Sidebar 通过共享 `resizeManager` 跟踪 Footer 实际高度；滚动内容延伸至 Sidebar 底部，使用 alpha 遮罩还原 Footer 覆盖渐变：Footer 顶部内容保留 100%，向下 20% 高度时保留 20%，到 40% 时完全不可见。Footer 自身内容不参与遮罩，深浅主题均不需要叠加背景色。导航尾部保留 Footer 高度 + 12px 安全区，保证滚到底时最后一项完整位于 Footer 上方。高度由声明式样式维护，拖宽时不中断；Logo 区域使用同一曲线的垂直镜像。

---


<a id="连续-hover"></a>

### 连续 Hover

`continuousHover` 默认 `true`。导航容器拥有唯一背景层，在所有可用
SidebarItem（包括 Section 内项目）之间连续移动。active 项的持久背景不被替换，
hover 到 active 项时两个背景叠加形成更深颜色。Section 标题属于明确阻断区域：
pointer 位于标题时共享层隐藏，不把标题当作相邻 Item 间隙。设为 `false` 恢复逐项 hover。



### 2026-11-13 行为同步

折叠状态与选中项、分组折叠状态一同按persistenceKey保存。浏览器初次渲染读取保存状态；组件同时写入snowui-sidebar-collapsed-<编码后的key>布局Cookie（1/0），SSR宿主可读取并传入collapsed以避免骨架先展开后收起。页面路由仍由宿主拥有，应同步URL中的当前分区。footer Snippet在SSR时原位渲染固定底部内容，优先于旧as="footer"移动方式。Sidebar高度由宿主在加载前确定。鼠标进入侧栏或折叠按钮所在位置时渐显；点击后1秒尝试渐隐，鼠标仍悬停按钮时保持显示，离开后隐藏。复用共享颜色动效时长与减少动效设置。

### 整体隐藏模式

`collapseMode="hidden"` 与默认compact二选一。隐藏时整体向左滑出并释放布局占位；展开按钮停在展开态Logo图形中心。自定义Logo必须以`as="logo-icon"`标记实际图形，不应标记整个图文组合。浮动按钮跟随面板移动后停住，支持键盘焦点交接与减少动效。

800px及以下使用独立移动端抽屉状态，初始隐藏，打开时有遮罩；点击遮罩、Escape或选择导航项关闭。不覆盖桌面持久化折叠状态。宿主无需另建重复展开按钮，仍需为Sidebar确定高度。

收起时序来自与SidePanel共享的PANEL_EXIT_TIMING；展开使用SIDEBAR_DRAWER_STYLE的入口时序。占位宽度与面板位移同步，Frame动效通道按实例隔离，子Frame不会继承面板位移。

## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../docs/standards/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。




> **归属**: Template Block

Sidebar 默认内置由 SnowUILogo `icon` / `text` 变体组成的 SnowUI Logo 与折叠按钮；导航内容既可由 `sections` 数据生成，也可显式组合 `SidebarItem`、`SidebarSection`、`Separator` 和自定义内容。每个 SidebarSection 在分类内容末尾内置 Separator，分类调用方无需手动添加。根容器默认透明。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
|:---|:---|:---|
| CSS 类名 | `snowui-sidebar` | 根节点 |
| Context Key | `SIDEBAR_CONTEXT_KEY` | 折叠与 active owner |
| 直接角色 | `logo` / `footer` | 替换默认 Logo / 安置固定 Footer 内容 |
| 布局模型 | Managed Composite | 固定 Header / ScrollArea / 覆盖 Footer 结构 |

### 多语言

导航及滚动区默认名称、内置折叠按钮（含text浮层展开按钮）随LocaleProvider更新；显式ariaLabel优先于Provider消息。 内置消息通过useLocale读取`sidebar.navigation`、`sidebar.expand`、`sidebar.collapse`、`sidebar.resize`，可用Provider messages覆盖；没有新增文案Prop。

### 模块索引

| 模块 | 文件 | 职责 |
|:---|:---|:---|
| Sidebar | [Sidebar.svelte](Sidebar.svelte) | 根组件与默认数据模式 |
| Context | [sidebar-context.svelte.ts](sidebar-context.svelte.ts) | 组件族共享状态 |
| SidebarSection | [SidebarSection.svelte](SidebarSection.svelte) | 分类块 |
| SidebarItem | [SidebarItem.svelte](SidebarItem.svelte) | 导航项 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
|:---|:---|:---|
| `collapsed` | Context + `data-collapsed` | 通过 SidePanel spring timing 控制根宽度与子组件折叠视觉 |
| `navigationVariant` | `data-navigation-variant` | `icon` 保留折叠图标轨；`text` 折叠后只保留展开按钮 |
| `width` | bindable + 透明 Indicator 交互层 | 右侧边框全高拖拽更新展开宽度；折叠后保留 |
| `resizable` | 透明 Indicator 交互层条件渲染 | 关闭时不搭建拖拽宽度能力 |
| `activeItemId` | Context | SidebarItem 推导 active |
| `persistence` / `persistenceKey` | localStorage + Context | 默认记忆 active 与 Section 折叠状态；可关闭或按实例隔离 |
| `SidebarItemData.tags` | 透传 SidebarItem Snippet | 数据模式与显式组合模式共享任意标签能力 |
| `SidebarItemData.depth` | 透传 SidebarItem 层级 | `1` 使用内置 L 形层级连接线替换普通 Icon |
| `as="logo"` | 稳定 Header host | 替换默认 SnowUILogo |
| `as="logo-icon"` | 自定义 Logo 的直接子节点 | 折叠后唯一保留的 Logo 图形 |
| `as="footer"` | 稳定底部覆盖 Footer host | 折叠态自动隐藏 |
| `.snowui-scroll-mask` | 通用内容渐隐能力 | 根据滚动位置启用顶部 / 底部渐隐 |
| `sections` | 默认生成 | 生成 SidebarSection / SidebarItem |

### 关联关系

- **子组件**: SidebarSection、SidebarItem
- **依赖**: Frame、ScrollArea、SnowUILogo、Button、Indicator、ResourceIcon、SidePanel motion preset
- **规范**: `../../../docs/standards/LayoutProtocol.md`、`../../../docs/standards/ComponentGuidelines.md`

## 更新日志

- 2026-10-23：既有Tags集合Test复用Frame单行与ScrollArea局部横向滚动，外部标签间距至少4px；不改Sidebar运行行为或Tag内部间距。

### v1.9.5 (2026-10-23)
- 显式singleLine的Footer内容组合保留4 CSS px横向间距，保留较大公开覆盖；普通Footer布局、默认Logo图形及折叠／滚动渐隐不变。
- 自定义品牌名与底部头像姓名示例复用Frame单行和Text全文缩略，沿用既有logo-icon／leading角色。

- 2026-10-20：导航及滚动区默认名称、内置折叠按钮（含text浮层展开按钮）随LocaleProvider更新；显式ariaLabel优先于Provider消息。

### v1.9.3 (2026-10-14)
- 修复当前 active item 已在无分类位置时，旧存储的分类 ID 导致该分类刷新后被错误展开；外部 active item 优先于历史记录，分类折叠状态仍可恢复。

### v1.9.2 (2026-10-12)
- 折叠与宽度以本地响应状态承接可绑定输入及交互回传，修复非绑定和显式初值连续操作时的派生值停滞；外部绑定、默认折叠及键盘焦点恢复保持原有契约。
- 通用纵向滚动遮罩降至共享回退层，Sidebar 的 Logo / Footer 实测渐隐曲线不再被样式注入顺序覆盖。

### v1.9.1 (2026-10-12)
- 分隔线组合占位使用最小高度保留上下 padding 与实际线宽，消除源码模式和运行包 CSS 注入顺序差异导致的线条消失。内置、显式分隔线与厚度覆盖保持一致。

- 2026-09-28：Footer 实测高度由组件状态与根样式共同维护，拖宽时不再短暂丢失滚动区的底部预留空间。

- 2026-09-28：Footer 全宽贴底，内边距上 12px / 下 16px / 左右 20px；按更新设计在 Footer 高度内使用 0% / 80% / 100% 覆盖透明度渐隐，并移除圆角。

- 2026-09-28：内置 Indicator 使用整边命中，移除透明颜色特化，统一常态与 hover 视觉。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.9.0 (2026-09-18)

- 无图标 text 模式完全收起，不保留 60px 空栏；展开按钮独立浮于可视区域左上角，左侧沿用 Sidebar 12px 间距 Token。
- 保留有图标模式的 60px 折叠栏；补齐隐藏内容不可聚焦、浮层清理及键盘焦点恢复。


### v1.8.0 (2026-08-25)

#### 交互变更
- 右侧边框全高改为可拖拽调宽，不再把 Pointer 命中限制在短条附近。
- 移除可见宽度调整短条，保留透明 Indicator 交互层承接 Pointer、键盘、ARIA 与滚动条避让。

### v1.7.3 (2026-08-17)

#### 优化
- 展开态折叠按钮移除额外位移，由 `--size-6` 命中 host 与 `ResourceSize` 16 图标的居中关系确定位置；图标保持在 Header / 导航项内容右边界内侧，名义间距为 4px。

### v1.7.2 (2026-08-17)

#### 修复
- 自定义 `as="logo"` 被安置到 Header 后，导航区由 Svelte 补回的源节点始终保持隐藏；宿主的 `flex` 等 utility 不再覆盖该结构边界并显示重复 Logo。

### v1.7.1 (2026-08-17)

#### 修复
- Footer、Navigation 与滚动区域的尺寸监听迁入共享 `resizeManager`，统一 SSR、能力退化、按帧交付与资源释放边界。

### v1.7.0 (2026-08-15)

#### 新功能
- 将 Site Sidebar 的分割线视觉设为 Sidebar 内全部横向 Separator 的默认样式；内置与外置分割线统一使用四边 8px padding、零行高及同一公开 padding override。

### v1.6.1 (2026-08-12)

#### 变更
- Header 折叠 / 展开按钮从 Button 默认视觉改为 `bare` 模式；icon-only、sm 尺寸、透明命中 host、ARIA、显隐与位移动效保持不变，并与既有 SidebarRequirement 定义重新一致。

### v1.6.0 (2026-08-09)

#### 新功能
- 状态记忆改为默认开启：刷新后恢复 Section 展开 / 折叠与最后 active item，并定位到该 Item；`persistence={false}` 可关闭，多实例通过 `persistenceKey` 隔离。
- 新增 `resizable` 开关；数据模式的 `SidebarItemData` 补齐 `tags` Snippet 与 Snippet Icon 能力，避免站点薄适配层重建 SidebarItem。

### v1.5.2 (2026-08-06)

#### 修复
- 折叠态不再误隐藏 continuous hover 背景层，Item hover 与展开态保持相同背景效果。
- 折叠按钮新增透明命中 host；鼠标直接移动到按钮预期位置时也会显示按钮。

### v1.5.1 (2026-08-06)

#### 修复
- Section 标题除了直接命中会阻断连续 hover，在标题相邻空隙中也参与最近距离判断，避免两个折叠标题之间的鼠标位置错误点亮下方 Table。

### v1.5.0 (2026-08-06)

#### 新功能
- 新增可选 `persistenceKey`：记忆 active item 与 Section 折叠状态，刷新后恢复；active 所在 Section 强制展开。
- 长列表恢复时将 active item 尽量定位到扣除 Footer 覆盖后的可视中心，并在布局动效结束后校正。

#### 修复
- Section 标题被 hover 时阻断连续 hover 最近项推断，避免已折叠标题下方的 SidebarItem 错误出现 hover 背景。

### v1.4.2 (2026-07-28)

#### 修复
- Sidebar 任意区域 hover 继续显示宽度 Indicator；与可见 scrollbar Thumb 重叠时，Indicator 完全退出 Pointer、hover、拖拽和键盘命中，只允许滚动条响应。

### v1.4.1 (2026-07-28)

#### 修复
- Footer 在折叠 / 展开期间固定展开态几何位置与宽度，只做 opacity 渐隐 / 渐显，消除 SB-01 中的压缩错位和跳动；折叠态同步退出交互与无障碍焦点。

### v1.4.0 (2026-07-28)

#### 变更
- 右侧宽度 Indicator 的纵向命中范围收窄为视觉条上下各 4px；与 overlay scrollbar 重叠时由 Indicator 自动隐藏。
- Header 折叠按钮改用 Button 默认 icon-only 形态，并固定在 Logo host 分配区域的右边。

### v1.3.1 (2026-07-28)

#### 变更
- 移除 Header 折叠 / 展开按钮的内置 Tooltip，继续通过动态 `aria-label` 保留可访问名称。

### v1.3.0 (2026-07-28)

#### 动效优化
- 折叠按钮跟随 Sidebar 宽度，以 Frame 默认 move spring 平移到折叠位置。
- Sidebar 收窄、Item 文字与 Section 标题渐隐同时开始；Item leading Icon 保持横向位置。
- Section 标题完全渐隐后才收起标题占位与 gap，使 Item 在第二阶段上移。

### v1.2.1 (2026-07-28)

#### 修复
- Logo host 在折叠和展开动效期间保持单行，避免透明 wordmark 在窄宽度下换行、撑高容器并造成 Logo 垂直错位。

### v1.2.0 (2026-07-28)

#### 新功能
- 新增 `navigationVariant="icon|text"`；`text` 折叠态只保留始终可见的展开按钮，不扫描动态 children 推断 Icon。

#### 修复
- Header 改为稳定的起始对齐结构，Logo Icon 使用固定 leading slot；Test 示例使用固定宽度左对齐宿主，消除宽度收起时的 Logo 跳动。
- 显式 `as="logo"` 的 DOM 安置延后到下一帧，先让默认 Logo 条件分支稳定卸载，避免移动 Svelte 管理节点时破坏 Test 页面渲染。
- Sidebar 全部内置 Tooltip 统一位于元素右侧；标题默认可折叠但移除 Tooltip。
- 折叠按钮 Tooltip 由 Tooltip 的动效感知能力在宽度动效开始时立即关闭。

### v1.1.0 (2026-07-28)

#### 新功能
- 折叠 / 展开改为根宽度 spring 动效，复用 SidePanel 进退场的临界阻尼 timing。
- 展开态右边缘新增 Indicator，可在 160px～480px 范围拖拽并通过 `width` / `bind:width` / `onWidthChange` 同步；折叠后保留上次展开宽度。

### v1.0.5 (2026-07-28)

#### 变更
- 确认 Sidebar 根 Header / Body 默认 gap 为 12px，并将折叠态 SidebarItem Tooltip 的默认位置设为 Icon 右侧。

### v1.0.4 (2026-07-28)

#### 修复
- 根据 Footer 实际高度动态增加滚动末端安全区，最后一个 Item 与 Footer 固定保持 12px，不受外部列表 gap 覆盖影响。

### v1.0.3 (2026-07-28)

#### 变更
- Footer 四边默认 padding 统一为 8px；内容整体采用 Align top left，内部横向排列并沿同一水平线居中。

### v1.0.2 (2026-07-28)

#### 变更
- Footer 默认采用左上对齐与 8px 内容间距；SB-04 移除 Footer 节点的全部自定义布局样式。

### v1.0.1 (2026-07-28)

#### 变更
- 明确根组件默认 padding 为左右 12px、上下 16px，并将 Body 纵向滚动条对齐到距 Sidebar 右边框 4px。

### v1.0.0 (2026-07-23)

#### 新功能
- 初始 区块 版本：默认 Logo、`as="logo"` 替换、整体折叠、数据/显式组合、覆盖 Footer 与滚动 Body。
