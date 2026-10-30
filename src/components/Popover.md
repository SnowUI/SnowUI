# Popover

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v3.1.1
> **职责**: 在触发器附近展示补充内容或操作，支持不同尺寸与触发方式，适合快捷操作和轻量交互面板。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

在触发器附近展示补充内容或操作，支持不同尺寸与触发方式，适合快捷操作和轻量交互面板。

## 使用选择

<!-- usage-guide:start -->
用于与触发锚点相关的浮层内容。短文本提示用 Tooltip，需要对话框焦点流程用 Dialog；关闭行为使用公开 closeOn。

- as="popover" 放在触发宿主内可自动关联锚点；静态模式可用 bind:open 手动控制。
- trigger 控制触发方式，closeOn 控制关闭策略；需要持续显示的交互示例可设置 closeOn="manual"。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Kbd, MenuItem, Popover, SearchInput, Text } from '@snowui-design-system/components';
	const actions = [
		{ value: 'copy-import', label: 'Copy import', shortcut: '⌘ C' },
		{ value: 'open-figma', label: 'Open in Figma', shortcut: '' },
		{ value: 'view-source', label: 'View source', shortcut: '' }
	];
	let query = $state('');
	const filteredActions = $derived(actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase())));
</script>

<Popover size="md" closeOn="manual">
	<SearchInput as="search" bind:value={query} placeholder="Search…" aria-label="Search component actions" />
	{#each filteredActions as action}
		<MenuItem as="item" value={action.value}>{action.label}{#if action.shortcut}<Kbd as="trailing">{action.shortcut}</Kbd>{/if}</MenuItem>
	{:else}
		<Text style="padding: var(--padding-3); color: var(--black-40);">No matching actions</Text>
	{/each}
</Popover>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| id | `string` | — | 模版模式的唯一标识 |
| template | `boolean` | `false` | 模版模式;不直接渲染,通过 `showPopover(id)` 激活 |
| size | `PopoverSize` | `"sm"` | 尺寸档位 |
| trigger | `PopoverTrigger` | `"click"` | 触发方式;模版模式生效 |
| placement | `PopoverPlacement` | `"bottom"` | 优先弹出方位,视口空间不足时自动翻转 |
| offset | `number` | `8` | 浮层与触发器距离,单位 px |
| closeOn | `PopoverCloseMode` | `"outside"` | 关闭方式:`outside` 点击空白关闭,`manual` 仅由 Popover 内按钮关闭 |
| closeOnEscape | `boolean` | `true` | Escape 是否关闭;两种 closeOn 模式都默认支持 |
| closeOnSelect | `boolean` | — | 点击内部 `MenuItem` 是否关闭;单个 `MenuItem closeOnSelect` 可覆盖 默认行为：`true` (sm) / `false` (md/lg)。 |
| continuousHover | `boolean` | `true` | 直接 `MenuItem` 之间是否使用容器级连续 hover 背景 |
| open | `boolean` | `true` | 静态模式手动控制显示,支持 `bind:open` |
| onOpenChange | `(open: boolean) => void` | — | 打开状态变化回调 |
| as | `"popover" \| undefined` | — | `as="popover"` 启用**内嵌模式**:自动发现宿主父元素为 anchor 和触发源 |
| children | `Snippet` | — | 面板内容 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="三种模式-modes"></a>

### 三种模式 (Modes)

Popover 同时支持三种使用模式:**面板模式 (Panel)**、**内嵌模式 (Inline)**、**模版模式 (Template)**。

### 1. 面板模式 (Panel Mode) — 默认

不带 `as` 也不带 `template`,Popover 直接作为面板渲染。适用于自由组合搜索浮层、菜单浮层等场景(SP-02 风格)。

```svelte
<Popover size="md" style="width: 30rem;">
    <SearchInput placeholder="Search" />
    <MenuItem>Result A</MenuItem>
</Popover>
```

### 2. 内嵌模式 (Inline Mode) — 推荐用于"按钮即触发"场景

`as="popover"` 标记后放入任意宿主元素(Button / Frame / Icon 等)内,Popover 自动:
- 找到父元素作为 anchor
- 按 `trigger="click|hover"` 绑定父元素事件
- Portal 渲染浮层到 body,带 8px offset 和视口避让

无需 `id`,无需 `data-popover-target`,无需手写事件回调。参考 Tooltip A1 写法。

```svelte
<Button>
    更多
    <Popover as="popover">
        <MenuItem>通知</MenuItem>
        <MenuItem>收藏</MenuItem>
    </Popover>
</Button>

<!-- 任意宿主 -->
<Frame row class="p-8 bg-black-4">
    点击我
    <Popover as="popover" trigger="hover" size="md">
        <Text>悬停说明</Text>
    </Popover>
</Frame>
```

### 3. 模版模式 (Template Mode) — 用于跨组件激活 / 多触发器共享

通过 `template` + `id` 注册,再用 `showPopover(id, anchorEl)` 或声明式属性 `data-popover-target="id"` 激活。触发按钮独立于 Popover,通过 ID 关联(参考 Toast TS-10)。

```svelte
<Popover template id="pop-01">
    <Text>Popover Content</Text>
</Popover>

<!-- 多个触发器共享同一份内容 -->
<Button data-popover-target="pop-01">触发器 1</Button>
<Button data-popover-target="pop-01">触发器 2</Button>

<!-- 或命令式触发 -->
<Button onclick={(e) => showPopover("pop-01", e.currentTarget)}>Click Me</Button>
```

### 模式选择速查

| 场景 | 推荐模式 |
|:---|:---|
| 一个按钮 + 一个浮层(95% 用例) | **内嵌 `as="popover"`** |
| 多个触发器共享一份内容 / 命令式激活 / 跨组件 | **模版 `template + id`** |
| 不当浮层,直接当面板组合内容(如 SP-02) | **面板**(默认) |

---

<a id="布局模型"></a>

### 布局模型

主布局模型:复合管理布局。

- 模版模式:仅承载注册和 Portal 浮层渲染;触发器由调用方独立提供。
- 静态模式:Popover 作为面板自身渲染。
- 面板内容默认 `column` 纵向排列,`gap: 0`,由用户自由组合内容(MenuItem、Text、Frame 等)。
- 浮层位置、层级、显隐、视口碰撞避让属于组件私有管理逻辑。

### 浮层结构(固定头部 + 独立滚动 body)

Popover 与 Listbox 共用同一套 `header + scroll-body` 结构,所有浮层视觉与滚动行为保持一致:

```
.snowui-popover .snowui-quick-action-panel
├── .snowui-popover-header.snowui-quick-action-panel-header   ← Input/SearchInput 自动移入,不参与滚动
└── .snowui-popover-body.snowui-quick-action-panel-scroll-body
    ├── .snowui-popover-scroll-content.snowui-overlay-scrollbar-viewport   ← 用户 children 渲染于此,独立滚动
    └── .snowui-popover-scrollbar.snowui-overlay-scrollbar                ← 自定义 Thumb
```

- 通过 `LISTBOX_HEADER_PORTAL_KEY` context 暴露 `headerEl`;`<Input as="search">` 与 `<SearchInput>`(默认 `as="search"`)挂载后由 Input 自身的 `$effect` 自动 `appendChild` 至 header,不参与下方滚动。
- 浮层根 `SnowFrame` 显式传 `enableAutoLayout={false}`:面板自身负责 `display:flex; flex-direction:column; gap:0`,不接入 `[data-auto-layout]` 的默认 `gap-2`,确保 header→body 间距完全由 header `padding-bottom` 控制(4px)。
- header 内有内容时由共享基类 `.snowui-quick-action-panel-header:not(:empty)` 提供 `padding-bottom: var(--padding-1)`(4px),作为搜索框与列表的视觉间距;**禁止**在组件内再写 `margin`/`gap` 复制该 4px。
- body `flex: 1; min-height: 0`,滚动 viewport 复用 `.snowui-overlay-scrollbar-viewport`(`overflow:scroll + scrollbar-width:none`);Thumb 通过 `useOverlayScrollbar` hook 计算位置。
- 头部输入框样式:Input 内统一选择器 `:where(.snowui-quick-action-panel-header > .snowui-input, ...)` 注入紧凑 `padding/gap/radius` 并在 `:focus-within` 关闭外环(`--snowui-field-focus-ring-width: 0rem`);用户无需在外部覆盖。
- 浮层滚动条 thumb 右边缘距面板内边框 4px(滚动条规范)。由于 scrollbar 在 body 内绝对定位且面板 `box-sizing: border-box`,offset 需抵消面板自身 `padding`:`sm padding=12 → right:-8px`、`md padding=16 → right:-12px`、`lg padding=24 → right:-20px`。三档 size 已在组件内分别声明,新增 size 时需同步。

---

<a id="关键字-props"></a>


---

<a id="尺寸"></a>

### 尺寸

| size | padding | border-radius | 典型用途 |
| :--- | :--- | :--- | :--- |
| `sm`(默认) | `12px` (`--padding-3`) | `16px` (`--radius-4`) | 替代旧 QuickAction;快捷操作菜单 |
| `md` | `16px` (`--padding-4`) | `24px` (`calc(--radius-3 * 2)`) | 替代旧 SearchPopup;搜索浮层、信息卡片 |
| `lg` | `24px` (`--padding-6`) | `32px` (`calc(--radius-4 * 2)`) | 大型信息浮层、复杂表单 |

---

<a id="交互"></a>


### 触发(模版模式)

- **click**(默认):点击触发器切换 Popover 显隐
- **hover**:hover 触发器后延迟 `450ms` 出现;移出触发器和浮层后 `80ms` 关闭。首次 hover 延迟与 Tooltip 统一;Popover 不参与 Tooltip 的 `300ms` 快速切换窗口。

### 关闭

- **`closeOn="outside"`**(默认):点击 Popover 外区域关闭
- **`closeOn="manual"`**:仅由 Popover 内按钮调用 `hidePopover(id)` 或 `bind:open=false` 关闭
- **Escape**:`closeOnEscape={true}`(默认)时无论哪种关闭模式都可按 Escape 关闭

---

<a id="定位"></a>

### 定位

默认首选方位 `bottom`,距触发器 `8px`。未配置 `placement` 或发生视口碰撞时,按 **首选 → 相反方向 → 垂直/水平候选** 顺序选择可见方位,确保浮层不会出现在可视区域外。

---

<a id="命令式-api"></a>

### 命令式 API

定义在 `../logic/popover.svelte.ts`,完整文档见 [`../logic/popover.md`](../logic/popover.md)。

```ts
import { showPopover, hidePopover, togglePopover } from "@snowui-design-system/components";

showPopover("pop-01", buttonEl);   // 显示(hover 模式带 450ms 延迟)
hidePopover("pop-01");             // 关闭(hover 模式带 80ms 延迟)
togglePopover("pop-01", buttonEl); // 切换
```

---

<a id="使用示例"></a>


### 模版 + 点击触发

```svelte
<Popover template id="pop-menu">
    <MenuItem>通知</MenuItem>
    <MenuItem>收藏</MenuItem>
    <MenuItem>分享</MenuItem>
</Popover>

<Button data-popover-target="pop-menu">更多</Button>
```

### 模版 + hover 触发 + 中尺寸

```svelte
<Popover template id="pop-info" trigger="hover" size="md">
    <Text>详细说明文案</Text>
</Popover>

<Button data-popover-target="pop-info">悬停查看</Button>
```

### 模版 + 手动关闭

```svelte
<Popover template id="pop-settings" closeOn="manual" size="lg">
    <Text>设置项</Text>
    <Button onclick={() => hidePopover("pop-settings")}>完成</Button>
</Popover>

<Button data-popover-target="pop-settings">打开设置</Button>
```

### 静态模式(SP-02 风格搜索浮层组合)

```svelte
<Popover size="md" style="width: 30rem;">
    <SearchInput placeholder="Search" />
    <Frame column class="gap-4">
        <Text class="text-black-40">Recent</Text>
        <MenuItem>Landing page</MenuItem>
        <MenuItem>ByeWind</MenuItem>
    </Frame>
</Popover>
```

---

<a id="合并说明"></a>

### 合并说明

| 旧组件 | 新等价写法 |
| :--- | :--- |
| `<QuickAction>...</QuickAction>` | `<Popover size="sm">...</Popover>`(静态)或 `<Popover template id="..." size="sm">...</Popover>`(模版) |
| `<SearchPopup>...</SearchPopup>` | `<Popover size="md">...</Popover>` |

QuickAction 与 SearchPopup 源码组件已删除;SP-02 示例迁移到 组件示例中保留为搜索浮层组合参考。

2026-10-07 新增的 [区块 SearchPopup](../blocks/SearchPopup.md) 是基于 Popover 的搜索输入与分组结果组合，不恢复旧 SearchPopup 浮层实现；SP-02 现在消费该区块。

<a id="规范-spec"></a>


### 1. 模版宿主(模版模式)
- `<Popover template id="X">` 不渲染任何 DOM,仅向 store 注册配置和内容
- 通过 `showPopover(id, anchorEl)` 或 `data-popover-target="id"` 激活
- 同一 id 同时只能有一个活跃实例;后续 show 调用替换 anchor

### 2. 浮层面板 `.snowui-popover`
- 复用 `.snowui-quick-action-panel`
- `position: fixed`,`z-index: 1000`
- `gap: 0`,内容由用户自由组合
- `padding` / `border-radius` 按 size 切档

### 3. 触发器约定
- 触发器为任意可交互元素(Button、Icon、Frame 等),不再由 Popover 包裹
- 通过 `data-popover-target="id"` 或 `onclick={() => showPopover(id, e.currentTarget)}` 关联

---


<a id="连续-hover"></a>

### 连续 Hover

`continuousHover` 默认 `true`，作用于滚动内容区的直接 `MenuItem`。单一背景层在
菜单项之间连续移动；`false` 恢复 MenuItem 原有逐项 hover。嵌套 Listbox 使用自己
最近的连续 hover 容器，不由 Popover 越界接管。



## AI Zone

> **2026-09-10 浮层内边框**：面板复用共享浮层视觉，在原有投影上叠加 `var(--border-2)`（16px 根字号下 1px）、`var(--surface-1)` 的 inset 内边框，不占用布局尺寸。共享契约见 [StyleSpec §2.13](../../../docs/standards/StyleSpec.md#213-quick-action-共享浮层视觉强制)。


> **更新日志 (2026-05-15)**: 旧 Popover 定义全部废弃,合并 QuickAction(小尺寸)、取代 SearchPopup(中尺寸)。
> **新增 (2026-05-15) v3.1.0**: 内嵌模式 `as="popover"`(Tooltip 风格):放入宿主子节点即自动绑定。


**继承**: 浮层根使用 Frame;内嵌 / 模版模式下通过 Portal 渲染到 `document.body`;面板复用 `.snowui-quick-action-panel` 共享视觉基类,出现 / 消失动效使用 `DROPDOWN_OVERLAY_APPEAR_MOTION` / `DROPDOWN_OVERLAY_DISAPPEAR_MOTION`。动效只包含 opacity，具体 duration / easing 以 motion preset catalog 为准,关闭时保留面板到 disappear preset 完成后再卸载。

---

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Popover 组件**: [./Popover.svelte](Popover.svelte)
- **命令式 API + 模版注册**: [../logic/popover.svelte.ts](../logic/popover.svelte.ts) · 文档 [../logic/popover.md](../logic/popover.md)
- **共享浮层基类**: [../styles/layout.css](../styles/layout.css) `.snowui-quick-action-panel`

---

## 更新日志

- 2026-10-23：任意Frame宿主Test中的图标与短标签改用公开单行组合，保留4px间距与全文缩略；父宿主触发及Popover运行实现不变，仅文档与示例修订。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v3.1.1 (2026-06-02)
- Popover hover 显示延迟调整为 `450ms`,与 Tooltip 首次 hover 延迟统一。
- Popover 直接复用 Tooltip 的首次延迟常量,但不参与 Tooltip 的 `300ms` 快速切换窗口。

### v3.1.0 (2026-05-15)
- 新增**内嵌模式** `as="popover"`:Tooltip 风格的零配置组合,Popover 放入任意宿主子节点即自动绑定父元素为 anchor 和触发源
- 三模式正式命名:**面板模式 (Panel) / 内嵌模式 (Inline) / 模版模式 (Template)**
- 新增 POP-30~POP-33 示例覆盖内嵌模式 click / hover / 任意宿主 / 手动关闭场景

### v3.0.0 (2026-05-15)
- 旧 Popover 定义全部废弃,改为"模版 + ID 激活"模式(参考 Toast TS-10)
- 合并 QuickAction(小尺寸)、取代 SearchPopup(中尺寸);源码组件删除
- 触发按钮不再放入 Popover 内部,通过 `data-popover-target` 或 `showPopover(id, anchorEl)` 关联
- 新增命令式 API `showPopover` / `hidePopover` / `togglePopover` 落地于 `../logic/popover.svelte.ts`
- 三档尺寸:`sm` (12/16) / `md` (16/24) / `lg` (24/32);默认 `sm`
- `closeOnOutsideClick` 重命名为 `closeOn: "outside" | "manual"` 更直观
- 保留静态模式以承接 SP-02 风格自由组合

### v2.0.0 (2026-05-15)(已废弃)
- 改为 QuickAction 风格的通用浮层容器,触发器包裹模式

### v1.1.1 (2026-02-03)
- 初始版本
