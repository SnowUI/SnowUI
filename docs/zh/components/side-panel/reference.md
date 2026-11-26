# SidePanel

> **版本**: v1.4.3
> **职责**: 从页面右侧展示详情或辅助内容，支持浮层与内嵌两种形态，让用户保留主页面上下文。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

从页面右侧展示详情或辅助内容，支持浮层与内嵌两种形态，让用户保留主页面上下文。

## 使用选择


用于可打开、关闭的详情或辅助面板，支持浮动与内嵌。一直显示的通知、活动、联系人栏可用页面 aside，不因位置在右侧就使用此组件。

- bind:open 控制显示，placement 选择浮动或内嵌，width 可绑定并受最小/最大值限制。
- children 是滚动内容；内嵌位移动效按 inlineMotionOwner 指定唯一负责方，避免页面与组件重复移动。
- 未传 title 时，工具栏标题与面板名称随 LocaleProvider 切换；显式 title（含空字符串）及业务内容保持原样。


## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。


```svelte
<script lang="ts">
	import { Badge, Button, Frame, Input, Text, Textarea } from '@snowui-design-system/components';
	import { SidePanel, createSidePanelLayoutMotionStyle, type SidePanelPlacement } from '@snowui-design-system/components';
	type ComponentRecord = { name: string; category: 'Basic' | 'Composite'; packageName: string; description: string; notes: string; };
	let componentRecords = $state<ComponentRecord[]>([
		{ name: 'DataTable', category: 'Composite', packageName: '@snowui-design-system/components', description: 'Sort, select, and manage records.', notes: 'Review responsive columns.' },
		{ name: 'SidePanel', category: 'Composite', packageName: '@snowui-design-system/components', description: 'View and edit record details.', notes: 'Check floating and inline layouts.' },
		{ name: 'Button', category: 'Basic', packageName: '@snowui-design-system/components', description: 'Actions for SnowUI products.', notes: 'Variants ready for release.' }
	]);
	let panelOpen = $state(false);
	let panelPlacement = $state<SidePanelPlacement>('floating');
	let activeIndex = $state(0);
	let panelWidth = $state(420);
	let activity = $state('');
	const activeComponent = $derived(componentRecords[activeIndex]);
	const inlineLayoutActive = $derived(panelOpen && panelPlacement === 'inline');
	const sidePanelLayoutStyle = $derived(createSidePanelLayoutMotionStyle(inlineLayoutActive, panelWidth));
	function openComponent(index: number) { activeIndex = index; panelOpen = true; activity = ''; }
	function setPanelOpen(next: boolean) { panelOpen = next; }
	function showPrevious() { activeIndex = (activeIndex - 1 + componentRecords.length) % componentRecords.length; activity = ''; }
	function showNext() { activeIndex = (activeIndex + 1) % componentRecords.length; activity = ''; }
	async function copyActive() { try { await navigator.clipboard?.writeText(activeComponent.name); activity = 'Copied ' + activeComponent.name + '.'; } catch { activity = 'Copy unavailable.'; } }
	function deleteActive() { if (componentRecords.length === 1) { activity = 'Keep one component.'; return; } const removed = activeComponent.name; componentRecords = componentRecords.filter((_, index) => index !== activeIndex); activeIndex = Math.min(activeIndex, componentRecords.length - 1); activity = 'Removed ' + removed + '.'; }
</script>

<div data-side-panel-layout style={sidePanelLayoutStyle}>
	<div data-side-panel-main style="display: flex; flex-direction: column; align-items: stretch; gap: var(--gap-3); width: min(100%, 28rem); margin-inline: auto;">
		<Text style="color: var(--black-40);">Components</Text>
		<div style="display: grid; gap: var(--gap-2);">
			{#each componentRecords as component, index (component.name)}
				<Button variant={index === activeIndex ? 'gray' : 'outline'} onclick={() => openComponent(index)}>{component.name} · {component.category}</Button>
			{/each}
		</div>
	</div>
	<div data-side-panel-layer aria-hidden={inlineLayoutActive ? undefined : 'true'}>
		<div data-side-panel-rail>
			<SidePanel
				bind:open={panelOpen}
				bind:placement={panelPlacement}
				bind:width={panelWidth}
				inlineMotionOwner="layout"
				minWidth={320}
				maxWidth={560}
				title={activeComponent.name}
				editable
				onOpenChange={setPanelOpen}
				onPrevious={showPrevious}
				onNext={showNext}
				onCopy={copyActive}
				onDelete={deleteActive}
				style={panelPlacement === 'inline' ? 'height: 100%;' : undefined}
			>
				<Frame column gap={4} style="min-width: 0; width: 100%;">
					<Frame singleLine><Text lines={1} size={20} weight={600}>{activeComponent.name}</Text><Badge as="trailing" count={activeComponent.category} color={activeComponent.category === 'Composite' ? 'Indigo' : 'Blue'} /></Frame>
					<Text style="color: var(--black-40);">{activeComponent.description}</Text>
					<Input value={activeComponent.packageName} aria-label="Package name" />
					<Textarea value={activeComponent.notes} aria-label="Release note" style="height: 8rem;" />
				</Frame>
			</SidePanel>
		</div>
	</div>
</div>

<style>
	[data-side-panel-layout] { position: relative; box-sizing: border-box; width: 100%; min-width: 0; padding-right: var(--snowui-side-panel-layout-space, 0px); transition: padding-right var(--snowui-side-panel-layout-motion-duration, 500ms) var(--snowui-side-panel-layout-motion-easing, ease-out); }
	[data-side-panel-main] { min-width: 0; }
	[data-side-panel-layer] { position: fixed; inset: 0; overflow: hidden; pointer-events: none; z-index: 40; }
	[data-side-panel-rail] { position: absolute; top: var(--padding-4); right: var(--padding-4); bottom: var(--padding-4); box-sizing: border-box; width: var(--snowui-side-panel-layout-panel-width, 420px); transform: translateX(var(--snowui-side-panel-layout-rail-translate-x, 436px)); transition: transform var(--snowui-side-panel-layout-motion-duration, 500ms) var(--snowui-side-panel-layout-motion-easing, ease-out); pointer-events: auto; }
	@media (prefers-reduced-motion: reduce) { [data-side-panel-layout], [data-side-panel-rail] { transition: none; } }
</style>
```


## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| open | `boolean` | `false` | 是否显示面板，支持 `bind:open` |
| placement | `SidePanelPlacement` | `"floating"` | 浮层或内嵌到页面右侧，支持 `bind:placement` |
| width | `number` | `460` | 面板宽度，支持 `bind:width` |
| minWidth | `number` | `320` | 拖动调整面板宽度时允许的最小宽度。 |
| maxWidth | `number` | `720` | 拖动调整面板宽度时允许的最大宽度。 |
| inlineMotionOwner | `"component" \| "layout"` | `"component"` | 内嵌位移动效归属。组件级 fallback 为 `component`；采用本文默认浮动停靠集成时必须传 `layout`，并配合 layout helper 与常驻 rail。 |
| showTopToolbar | `boolean` | `true` | 是否显示上工具栏（内容固定，不可换按钮） |
| editable | `boolean` | `false` | 内容可编辑；`true` 时自动显示下工具栏默认按钮 |
| showBottomToolbar | `boolean` | — | 显式覆盖下栏显隐；默认 = `editable` 或任一下栏自定义 |
| bottomLeading | `Snippet` | — | 下栏左侧整组显式替换；传入即显示下栏 |
| bottomTrailing | `Snippet` | — | 下栏右侧整组显式替换；传入即显示下栏 |
| bottomLeadingActions | `SidePanelToolbarAction[]` | — | 数据内置；传入即显示下栏；有 `bottomLeading` 时忽略 默认行为：可编辑时默认 copy/delete。 |
| bottomTrailingActions | `SidePanelToolbarAction[]` | — | 数据内置；传入即显示下栏；有 `bottomTrailing` 时忽略 默认行为：可编辑时默认 取消/保存。 |
| title | `string` | — | 上工具栏右侧标题及面板无障碍名称；未传时使用 sidePanel.title，zh-CN 为“详情”、en-US 为“Details”；显式空字符串保留 |
| showTitle | `boolean` | `false` | 是否显示工具栏标题；关闭后保留无障碍名称与工具栏按钮 |
| backdrop | `DialogBackdrop \| false` | `false` | 浮层背景，复用 Dialog 共享遮罩；内嵌模式忽略 |
| closeOnEscape | `boolean` | `true` | Escape 关闭 |
| closeOnOutside | `boolean` | `true` | 点击 SidePanel 外区域关闭 |
| onOpenChange | `(open: boolean) => void` | — | 面板打开状态变化后回调。 |
| onPlacementChange | `(placement: SidePanelPlacement) => void` | — | 浮层与内嵌位置切换后回调。 |
| onPrevious | `() => void \| Promise<void>` | — | 点击上工具栏“上一项”后回调。 |
| onNext | `() => void \| Promise<void>` | — | 点击上工具栏“下一项”后回调。 |
| onCopy | `() => void \| Promise<void>` | — | 点击默认下工具栏复制操作后回调。 |
| onDelete | `() => void \| Promise<void>` | — | 点击默认下工具栏删除操作后回调。 |
| onClose | `() => void \| Promise<void>` | — | 关闭前回调 |
| children | `Snippet` | — | 面板滚动内容区，由调用方提供详情或编辑内容。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Indicator: typeof Indicator; }>` | — | 仅配置内置工具栏 Button 与整边调宽交互层；class / style 等完整 part Props 进入默认实例，children、bottomLeading、bottomTrailing 的显式子组件不继承。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="下工具栏替换"></a>

### 下工具栏替换

优先级：`bottomLeading` / `bottomTrailing` Snippet **>** 对应 actions 数组 **>** 默认内置。

```svelte
<script lang="ts">
  import { Frame, Button } from '@snowui-design-system/components';
  import { SidePanel } from '@snowui-design-system/components';
  let open = $state(true);
function download() { /* Trigger application download */ }
</script>


<SidePanel bind:open title="Subscription">
  <Frame column gap={3}>…</Frame>
</SidePanel>


<SidePanel bind:open editable title="Subscription">
  <Frame column gap={3}>…</Frame>
</SidePanel>


<SidePanel
  bind:open
  bottomLeadingActions={[{ role: "custom", icon: "arrow-line-down", ariaLabel: "下载", onClick: download }]}
/>


<SidePanel bind:open editable>
  {#snippet bottomLeading()}
    <Frame row gap={2}>
      <Button bare iconOnly emphasis="muted" size="sm" aria-label="下载" onclick={download}>
        下载
      </Button>
    </Frame>
  {/snippet}
  …
</SidePanel>
```

上工具栏（预览切换 / 上一项 / 下一项 / 标题 / 关闭）**不可**通过 props 或 snippet 替换。

<a id="默认内嵌布局协议"></a>


### 效果定义

`placement="inline"` 的默认产品效果以 `SidePanel-Demo.svelte` 为基准，它不是把 SidePanel 放进普通文档流，而是采用**浮动停靠布局**：

1. SidePanel 由 fixed layer / rail 承载，始终浮在页面其他元素之上。
2. 页面对指定内容区同步增加右侧 `padding-right`，把这些内容向左挤压。
3. 未参与预留空间的页面区域保持原布局，SidePanel 打开后覆盖在这些区域上方。
4. 面板位移和内容收缩由同一个 `inlineActive` 状态、同一个 helper 和同一轮样式更新驱动，视觉速率保持一致。

因此，“内嵌”表示面板会参与页面可用空间分配，不表示面板进入普通文档流。SidePanel 的视觉层仍是浮层；被挤压范围由页面显式定义。

### 职责分界


### 页面如何定义挤压与覆盖

- **挤压整块主内容**：把 header、Table、分页等都放进 `data-side-panel-layout`，统一消费 `padding-right`。
- **只挤压 Table**：只让 Table 外层消费 `--snowui-side-panel-layout-space`；页面 header、左侧导航等放在该容器外，它们会保持宽度并可能被 SidePanel 覆盖。
- **覆盖悬浮控件**：控件不消费 layout-space，且其 `z-index` 低于 `data-side-panel-layer`。
- **控件保持在面板之上**：控件不消费 layout-space，并由页面设置高于 layer 的 `z-index`。这属于页面层级决策，不由 SidePanel 自动修改。

不要让 SidePanel 查询 Table、main 或 header，也不要在组件内部改写兄弟元素宽度。页面必须通过结构和 CSS 明确选择布局作用范围。

### 动效协调规则

RareUI 的参考实现让面板 `x` 与主内容 `paddingRight` 响应同一状态。SnowUI 沿用这套同步结构，但使用自己的 `SIDE_PANEL_APPEAR_MOTION` / `SIDE_PANEL_DISAPPEAR_MOTION`：临界阻尼 `300 / 34.6410161514 / 1`、500ms 轨迹窗口、无回弹，并保证完整退场距离。

默认内嵌集成必须满足：

1. `inlineActive` 固定为 `open && placement === "inline"`。
2. 只调用一次 `createSidePanelLayoutMotionStyle(inlineActive, panelWidth, 16)`，并把结果挂在协调容器上。
3. 被挤压区域的 `padding-right` 和 rail 的 `transform` 必须直接消费 helper 输出的变量，不得分别定义 duration 或 easing。
4. SidePanel 必须传 `inlineMotionOwner="layout"`，避免组件 transform 与 rail transform 叠加。
5. layer 与 rail 必须常驻 DOM；SidePanel 本体按 presence 挂载和卸载，保证退场完整。
6. `prefers-reduced-motion: reduce` 时同时关闭内容收缩和 rail 位移 transition。

helper 输出以下页面 bridge 变量：


### 默认完整写法

```svelte
<script lang="ts">
  import {
    SidePanel,
    createSidePanelLayoutMotionStyle,
  } from "@snowui-design-system/components";

  let open = $state(false);
  let placement = $state<"floating" | "inline">("floating");
  let panelWidth = $state(460);

  const inlineActive = $derived(open && placement === "inline");
  const sidePanelLayoutStyle = $derived(
    createSidePanelLayoutMotionStyle(inlineActive, panelWidth, 16),
  );
</script>


<div data-side-panel-layout style={sidePanelLayoutStyle}>
  <main data-side-panel-main>

  </main>


  <div data-side-panel-layer aria-hidden={inlineActive ? undefined : "true"}>
    <div data-side-panel-rail>
      <SidePanel
        bind:open
        bind:placement
        bind:width={panelWidth}
        inlineMotionOwner="layout"
        style={placement === "inline" ? "height: 100%;" : undefined}
      >

      </SidePanel>
    </div>
  </div>
</div>


<footer>...</footer>

<style>
  [data-side-panel-layout] {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding-right: var(--snowui-side-panel-layout-space, 0px);
    transition: padding-right
      var(--snowui-side-panel-layout-motion-duration, 500ms)
      var(--snowui-side-panel-layout-motion-easing, ease-out);
  }

  [data-side-panel-main] {
    min-width: 0;
  }

  [data-side-panel-layer] {
    position: fixed;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 40;
  }

  [data-side-panel-rail] {
    position: absolute;
    top: 16px;
    right: 16px;
    bottom: 16px;
    box-sizing: border-box;
    width: var(--snowui-side-panel-layout-panel-width, 460px);
    transform: translateX(
      var(--snowui-side-panel-layout-rail-translate-x, 476px)
    );
    transition: transform
      var(--snowui-side-panel-layout-motion-duration, 500ms)
      var(--snowui-side-panel-layout-motion-easing, ease-out);
    pointer-events: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    [data-side-panel-layout],
    [data-side-panel-rail] {
      transition: none;
    }
  }
</style>
```

### 高度与视口间距

SidePanel 本身提供高度能力，但页面负责决定它相对于哪个空间定位：

| 场景 | 推荐写法 | 结果 |
| --- | --- | --- |
| 默认内嵌停靠 | rail 使用 `top/right/bottom: 16px`；SidePanel 使用 `height: 100%` | 面板高度为当前视口高度减 32px；长页面不改变可视区域底部间距。 |
| 独立内嵌、无页面 rail | 不覆盖高度 | 使用组件默认 `calc(100dvh - 32px)`。 |
| 产品有固定 header | 页面调整 rail 的 `top`，例如 `top: calc(var(--header-height) + 16px)` | 面板避开 header；bottom 仍由页面定义。 |
| 面板随文档滚动 | 页面使用普通流或 sticky rail，并显式给出高度 | 高度和滚动边界跟随页面容器，不再保证固定视口间距。 |
| 特定容器内停靠 | 容器建立定位上下文，rail 改为 absolute，并定义 top/right/bottom | 面板高度由该容器决定。 |

默认内嵌模式不要同时使用组件默认 `100dvh - 32px` 和 rail 的 top/bottom 高度约束；应让 rail 决定高度，再以 `height: 100%` 传给 SidePanel。这样高度只有一个事实来源。

### 内嵌模式样式（公开入口）

| 目标 | 公开做法 |
| --- | --- |
| **宽度** | `width` / `bind:width` |
| **高度** | 根 `style` / `class`，或 `--snowui-side-panel-height-override` |
| **圆角** | 根 `border-radius` 或 `--snowui-side-panel-radius-override` |
| **边框 / 阴影** | 内嵌默认真实边框；浮层 quick-action 阴影 |

<a id="布局模型"></a>

### 布局模型

主布局模型：**复合管理布局**。定义见 ../../../docs/standards/LayoutProtocol.md §12.3。

<a id="user-zone"></a>


### 示例

```svelte
<script lang="ts">
  import { Frame, Text } from '@snowui-design-system/components';
  import { SidePanel } from '@snowui-design-system/components';
  let open = $state(true);
function download() { /* Trigger application download */ }
</script>

<SidePanel bind:open title="Subscription">
  <Frame column gap={3}>
    <Text>内容由调用方显式写入。</Text>
  </Frame>
</SidePanel>
```

### 浮层背景

默认无遮罩，保留背景记录切换。设置 `backdrop="opaque"` 使用 10% 黑色遮罩；`"blur"` 在同一遮罩上增加 `var(--size-5)`（20px）背景模糊；`"transparent"` 仅阻挡背景交互。视觉复用 共享的 `.snowui-backdrop`，淡入淡出复用 Dialog motion token，随 SidePanel presence 卸载。内嵌模式不显示遮罩。点击遮罩遵循 `closeOnOutside`，关闭按钮和 Escape 行为不变。

遮罩渐隐实现复用 共享 Backdrop，与 Dialog、ImageViewer 使用同一透明起点和减少动效规则。
