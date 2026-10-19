# ScrollArea

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.4.1
> **职责**: 为内容提供可滚动区域与统一的滚动条，适合长列表、面板和受限空间中的正文。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-20

## 组件介绍

为内容提供可滚动区域与统一的滚动条，适合长列表、面板和受限空间中的正文。

## 使用选择

<!-- usage-guide:start -->
用于需要独立滚动的区域。页面不应无意创建多层嵌套滚动；表格的局部横向滚动优先沿用 Table。

- axis 选择滚动方向；内容或宿主需要有限尺寸才能形成滚动区域。
- bind:viewport 获取实际滚动元素，onscroll 接收滚动事件；用 ariaLabel 描述区域用途。
- 滚动viewport默认名称随LocaleProvider更新，显式ariaLabel优先；children保持调用方内容。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { ScrollArea } from '@snowui-design-system/components';
</script>

<ScrollArea axis="vertical" ariaLabel="SnowUI documentation guide" style="width: min(100%, 30rem); height: 220px;">
	<article style="display: flex; flex-direction: column; gap: var(--gap-4); padding: var(--padding-3); font-size: var(--text-14); line-height: var(--leading-14);">
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Getting started</h3>
			<p>Install SnowUI in a Svelte 5 project and load the component stylesheet once at the application root.</p>
		</section>
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Choose a component</h3>
			<p>Start with the public components. Read their usage and API reference before adding custom layout or behavior.</p>
		</section>
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Build with tokens</h3>
			<p>Use the same typography, spacing, and color tokens across the SnowUI website and component documentation.</p>
		</section>
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Compose the page</h3>
			<p>Keep navigation, content, and supporting information in clear sections that remain readable on narrow screens.</p>
		</section>
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Check interactions</h3>
			<p>Try keyboard navigation, loading states, and disabled controls. Give every action a clear accessible name.</p>
		</section>
		<section>
			<h3 style="font-size: var(--text-14); font-weight: 600;">Review the result</h3>
			<p>Compare the rendered page with its source, then verify light and dark themes before sharing the documentation.</p>
		</section>
	</article>
</ScrollArea>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| axis | `ScrollAreaAxis` | `"vertical"` | 允许滚动的方向 |
| horizontalTrackPosition | `ScrollAreaHorizontalTrackPosition` | `"container"` | 横向轨道停靠在容器底边，或在长容器经过页面视口时贴近视口底部 |
| horizontalScrollbarVisibility | `"always" \| "hover"` | `"always"` | 横向滚动条在内容溢出时常显，或仅在鼠标移入区域时显示 |
| ariaLabel | `string` | `locale 文案` | viewport 的无障碍标签；省略时随LocaleProvider更新，显式ariaLabel优先；viewport 使用 `role="region"` |
| viewport | `HTMLElement` | — | 暴露内部可滚动 viewport，供读取或设置原生滚动位置 |
| onscroll | `(event: Event) => void` | — | viewport 原生 scroll 事件 |
| children | `Snippet` | — | 任意可滚动内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="功能概览"></a>

### 功能概览

- 支持纵向、横向和双轴滚动
- 隐藏浏览器原生滚动条
- 内容溢出时启用对应 SnowUI overlay scrollbar；纵向条在鼠标移入区域时使用 Frame 默认动效渐显、移出时渐隐，横向条默认常显并可配置为随区域 hover 显隐
- 鼠标进入整条轨道（包括滑块外的空白区）即触发 Thumb hover；移出轨道后恢复，拖动期间保持 hover。
- 点击轨道空白处将 Thumb 中心定位到点击处，到达边缘时夹到滚动起点或终点；按住可继续拖动。直接拖动 Thumb 保留原抓取位置，并与原生滚动位置同步。
- 横向 Thumb 始终为 8px；纵向 Thumb 默认视觉宽 4px、hover 视觉宽 8px，整条轨道热区宽 16px，包含展开宽度 8px、靠边间距 4px 和内侧额外 4px；横向热区同样向上、下各扩展 4px
- 长内容可把横向轨道贴近当前视口底部，容器离开视口后轨道仍收回到自身底边
- 继承 Frame 的布局、状态、动效、响应式和属性透传能力

---

<a id="api-参考"></a>




### 基础用法

```svelte
<ScrollArea style="height: 20rem;">
    <Frame column>...</Frame>
</ScrollArea>
```

### 双轴滚动

```svelte
<ScrollArea axis="both" style="width: 100%; height: 100dvh;">
    <Frame width="max-content" minWidth="100%">...</Frame>
</ScrollArea>
```

### 长内容保持横向轨道可达

```svelte
<ScrollArea axis="horizontal" horizontalTrackPosition="viewport">
    <Frame width="max-content">...</Frame>
</ScrollArea>
```

`viewport` 只改变横向轨道的停靠位置，不把内容最小宽度传播给页面，也不创建第二个滚动容器。轨道在 ScrollArea 穿过当前页面视口时贴近视口底部；到达 ScrollArea 底端后回到容器底边。

### 选择原则

- 页面或普通容器需要 SnowUI 自建滚动条：使用 ScrollArea。
- Table 已内置同源的局部横向 viewport 与视口贴底轨道：直接使用 Table，不再外包 ScrollArea。
- 只需要浏览器原生滚动：直接使用 `overflow`，无需 ScrollArea。
- 组件内部有特殊 Portal、固定头部或 Pin 区域时，可以继续直接复用 `useOverlayScrollbar`；不得复制滚动条算法或视觉 CSS。

---




## AI Zone

> **更新**: 2026-09-18

> **布局模型**: 复合管理布局
> **文档**: ./ScrollArea.md

ScrollArea 封装可滚动 viewport、横向/纵向轨道、Thumb 尺寸同步与拖动交互。页面和普通容器只需要声明滚动方向，不需要手写滚动条 DOM 或调用底层 hook。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 根类 | `snowui-scroll-area` | 根 Frame |
| CSS 宿主类 | `snowui-overlay-scrollbar-host` | 控制纵向滚动条的区域 hover 显隐 |
| CSS viewport | `snowui-scroll-area-viewport` | 隐藏原生滚动条的实际滚动元素 |
| CSS 共享类 | `snowui-overlay-scrollbar*` | 轨道与 Thumb 共享视觉 |
| 通用逻辑 | `useOverlayScrollbar` | 尺寸、位置、滚动同步和拖动 |

### 多语言

滚动viewport默认名称随LocaleProvider更新，显式ariaLabel优先；children保持调用方内容。 通过useLocale读取`scrollArea.content`，Provider messages可覆盖完整消息；未增加公开文案Prop。

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| ScrollArea | [ScrollArea.svelte](ScrollArea.svelte) | 声明式组件结构与双轴轨道布局 |
| Overlay scrollbar | [overlay-scrollbar.svelte.ts](../lib/overlay-scrollbar.svelte.ts) | 跨组件共享滚动逻辑 |
| Scrollbar styles | [scrollbar.css](../styles/scrollbar.css) | 跨组件共享视觉 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| `axis` | `data-scroll-axis` + 条件轨道 | 控制 viewport overflow 与渲染的轨道 |
| `horizontalTrackPosition` | `data-horizontal-track-position` | `viewport` 使用 sticky 轨道保持长内容中的横向控制可达 |
| `horizontalScrollbarVisibility` | 横向轨道 `data-visibility` | `hover` 由共享宿主 hover 规则控制显隐 |
| `ariaLabel` | viewport ARIA | 输出 `role="region"` 与 `aria-label` |
| `viewport` | `$bindable` | 绑定内部滚动元素 |
| `onscroll` | viewport 事件 | 不挂到根 Frame |
| `...rest` | Frame 透传 | 根组件继续承接 Frame 能力 |

### Frame 集成

- 根层使用 Frame。
- `enableResponsive=true`、`enableContext=true`、`enableScaleObserver=false`、`enableDefaultMotion=true` 均显式设置。
- 根 Frame 只管理组件级外层状态与动效；滚动 Thumb 属于共享专项内部能力。
- ScrollArea 不使用三槽位布局，不创建 padding、gap 或 radius 默认值。

### 关联关系

- **依赖**: Frame、`useOverlayScrollbar`、`scrollbar.css`
- **同类参考**: Card、Textarea、Listbox、CodeBlock

---

## 更新日志

### v1.4.1 (2026-10-20)

- 滚动viewport默认名称随LocaleProvider更新，显式ariaLabel优先；children保持调用方内容。

- 2026-10-08：整条 Overlay 轨道触发 hover；点击空白轨道定位滑块中心并支持继续拖动，取消捕获和卸载时清理交互。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.4.0 (2026-09-18)

- 新增 `horizontalScrollbarVisibility`；横向滚动条可选择仅在 ScrollArea hover 时显示，默认仍为溢出时常显。

### v1.3.0 (2026-09-01)

- 新增 `horizontalTrackPosition="viewport"`，长横向内容经过页面视口时保持横向轨道可达，同时仍由当前 ScrollArea 独占横向滚动。

### v1.2.0 (2026-07-22)

- 纵向 Thumb 保持常态 4px 视觉宽度，同时将常态 hover 命中宽度扩大到 hover 状态的 8px，降低指针命中难度。

### v1.1.0 (2026-06-21)

- 纵向滚动条默认隐藏，鼠标移入 ScrollArea 区域时使用 Frame 默认动效渐显、移出时渐隐；横向滚动条保持溢出时常显。

### v1.0.0 (2026-06-21)

#### 新功能

- 新增纵向、横向和双轴 SnowUI 自建滚动区域。
- 将页面/容器使用所需的 viewport、轨道、Thumb 和拖动逻辑封装为声明式组件。
