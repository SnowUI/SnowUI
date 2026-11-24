# Button

> **版本**: v2.21.0
> **职责**: 触发操作或导航，支持文字、图标、加载与禁用状态，适合从主要操作到轻量工具按钮的不同场景。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-22

按钮根与内容动效层默认复用 Frame `singleLine`，图文组合不换行；间距保留组件首选值并遵守4 CSS px下限。无需使用者额外包裹 Frame。

## 组件介绍

触发操作或导航，支持文字、图标、加载与禁用状态，适合从主要操作到轻量工具按钮的不同场景。

## 使用选择

<!-- usage-guide:start -->
用于触发操作。无外壳图标操作用 bare；有内边距的纯图标按钮显式声明 iconOnly 并提供 aria-label。bare 需要透明度 hover 时用 emphasis="muted"。内容切换用 Tab，互斥参数选择用 Segmented。

- 无上下文时默认 gray、sm；显式 variant / size 优先于组配置。
- 纯图标必须提供可访问名称；bare 去掉外壳，iconOnly 保留按钮外壳，组件不会根据内容自动判断。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Button variant="filled">Filled</Button>
	<Button variant="gray">Gray</Button>
	<Button variant="outline">Outline</Button>
	<Button variant="borderless">Borderless</Button>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| variant | `"gray" \| "filled" \| "outline" \| "borderless"` | — | 按钮变体；显式值优先，其次嵌入 ButtonGroup 或 Breadcrumb 的上下文，无上下文时回退 gray。 |
| size | `"sm" \| "md" \| "lg"` | — | 控制按钮字号、内边距、圆角及子图标尺寸；显式值优先，其次 ButtonGroup/集合及父级尺寸上下文，无上下文时为 sm。 |
| iconOnly | `boolean` | `false` | 有 padding 的纯图标按钮模式，专门控制只有图标时的对称 padding 和图标大小；sm/md/lg 图标为 16/20/24px。无外壳图标按钮直接使用 bare。缺少 aria-label、aria-labelledby 或 title 时开发环境警告。 |
| bare | `boolean` | `false` | 无外壳按钮，以图标操作为主，也可包含文字或其他内容。忽略 variant，移除 padding、radius、背景、边框和 hover overlay，保留内容 gap。无需叠加 iconOnly；同 size 的图标与 iconOnly 一致，为 16/20/24px，子图标显式 size 优先。默认 100% 不透明，emphasis="muted" 启用 40% → hover 100%。 |
| emphasis | `"normal" \| "muted"` | `"normal"` | bare 模式的视觉强调级别。`normal` 常态与 hover 均为 100%；`muted` 常态为 40%，hover 提升到 100%。非 bare 模式下不改变现有 variant 视觉。 |
| gap | `number` | — | 兼容间距编号，映射原gap Token；图文／独立文字内容间距至少4 CSS px，0按下限处理，保留更大首选值。无需另包Frame。 |
| backgroundBlur | `boolean` | `false` | 是否模糊按钮背后的内容。开启时使用与 BarChart 模糊浮层一致的 `backdrop-filter: blur(1.25rem)`。 |
| scaleOnHover | `boolean` | — | 是否同时启用 Button 内置背景层 hover 放大及配套点击缩回 / 恢复动效。独立动作默认开启；内容默认跟随缩放，命中区和布局不变。复合控件容器可提供 `false` 默认值，子 Button 显式传 `true` 可重新开启。bare 没有背景层，因此无视觉效果；本 Prop 不覆盖显式 `whileHover`。 |
| contentScaleOnHover | `boolean` | 跟随背景缩放 | 是否让文字、Icon、Spinner 等内容作为整体跟随内置背景 hover 与点击缩放。`false` 仅关闭内容缩放；`true` 仍要求背景缩放生效，不能绕过 scaleOnHover=false、bare、disabled 或显式 whileHover 接管。 |
| toggle | `boolean` | `false` | Toggle 模式语法糖。内部自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`；Active 状态下由 Frame 自动暴露的 `data-state="Active"` 触发 Brand 配色（gray / outline / borderless 生效，filled 排除）；`aria-pressed` 由 Frame 自动输出。消费方可继续传 `Click` / `whileClick` 显式覆盖。 |
| holdRepeat | `boolean` | `false` | 开启指针按住连发；仅对未禁用的 button 宿主主按钮按压生效。按下立即触发一次 click，等待后周期触发，松开或取消停止；不为链接或键盘增加连发。 |
| holdRepeatDelay | `number` | `260` | 开始周期连发前的等待时间，单位 ms，负值按 0 处理；仅 holdRepeat=true 生效，第一次周期点击还需等待 holdRepeatInterval。 |
| holdRepeatInterval | `number` | `80` | 按住期间相邻周期 click 的间隔，单位 ms，最小按 1 处理；仅 holdRepeat=true 生效。 |
| tooltip | `TooltipProp` | — | 悬停／聚焦提示开关或配置（`boolean \| string \| Snippet \| TooltipConfig`）；默认关闭，为 `true` 时复用按钮的 `aria-label`，按需懒加载内置 `Tooltip`，支持消费父级 `ButtonTooltipContext` 并允许实例显式覆盖。 |
| parts | `ComponentPartsOf<{ Tooltip: typeof Tooltip }>` | — | 配置内置 `Tooltip`（仅作用于由 `tooltip` 属性生成的内置提示，通过 `ComponentPartsBoundary` 与调用方显式 `children` 隔离）。 |
| children | `Snippet` | — | 按钮内的文字、图标或其他内容；有外壳纯图标用法设置 iconOnly，无外壳用 bare；两者的纯图标用法均须提供可访问名称，组件不通过内容自动推断。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

禁用按钮及其内容使用普通鼠标指针；启用时使用手型指针。

## 使用边界与详细说明

<a id="组件特有属性-component-specific-props"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)。

Button 的内部布局不接入三槽位模型：

- 根节点保持 inline-level 外壳，内容整体 Hug。
- 内部图标、文本、Spinner等轻量内容通过共享单行间距解析自然排列，有效gap至少4 CSS px；根字号或gap-scale缩小时仍保持下限，已有更大间距不统一压到4px。纯图标不新增文字或空槽。
- 文字型 Button 默认 `white-space: nowrap`，保证按钮文案作为一个操作短语保持单行；特殊长文案可由使用方通过外部 style / class 显式覆盖。
- 默认宽度及最小宽度为 `max-content`，即“内容 + gap + padding”的 Hug 宽度；纵向 Flex / Grid 的默认 stretch 不会把 Button 拉满。只有显式 width / Fill 或组件声明的专属组合布局可以拉宽，不能把 Button 压到吞掉默认 padding。
- Button 自身负责 padding / gap / radius / font-size / line-height，并通过 `--snowui-button-*-override` 变量允许外部覆盖。
- gray / filled / outline / borderless 通过共享 `.snowui-rounded-rectangle` 消费 `--corner-shape-rounded-rectangle: superellipse(1.1)`；该曲线只比普通 `round` 略微平滑，同时不改变 `--snowui-button-radius` 或 `--snowui-button-radius-override` 解析出的根 corner area。独立 hover 背景伪元素显式继承同一 `border-radius` 与 `corner-shape`，并随背景 transform 等比放大；根 Button 的圆角和布局尺寸保持不变。`iconOnly` 只是内容布局，不建立圆形语义或圆角特例。不支持 `corner-shape` 时自然回退为现有 `border-radius`。bare 与 ButtonGroup 嵌入态的半径仍为 `0`，外壳所有权不变。
- `iconOnly` 是单视觉内容布局的唯一开关，默认 `false`；Button 不读取 children 的 DOM 类型推断该状态。内容可以是 Icon、Logo 或其他单一视觉原子。
- `as="leading"` / `as="trailing"` 只表示 Button 作为 Field / Input 等外层槽位宿主的配件；不会改变 Button 内部布局模型。
- `as="item"` 表示 Button 作为 Breadcrumb 的路径片段；当前页不可交互规则由 Breadcrumb 标记 `aria-current="page"` 后触发。Button 未显式写 `variant` 时可继承 Breadcrumb 的 `variant`，显式 Button `variant` 优先。
- `as="current"` / `as="page"` / `as="prev"` / `as="next"` 放入 Pagination 时表示角色样式模板；真实页码、可点击性与边界状态由 Pagination 生成和管理。
- `bare` 是不限制内容类型的无外壳特化：保持当前字号 / 行高与普通内容 gap，固定清零 padding / radius，并默认使用 `currentColor × opacity: 1`；仅 `emphasis="muted"` 使用 `0.4 -> 1` 表达次级操作。
- `as="pageSize"` 可作为 Pagination 的每页条数视觉模板；Pagination 会注入当前数值和 `ArrowLineDown`，并用内置 Listbox 接管交互。Icon 作为 Button 普通内容，不使用 `as="trailing"`，间距由 Button 内容 gap 控制。
- `bare` 自动注入与 iconOnly 一致的 1/1.25/1.5rem 图标上下文（标准根字号下16/20/24px），无需 iconOnly；子图标显式 size 优先。兼容的 bare iconOnly 组合仍保留透明热区。
- 当 Button 作为 `ButtonGroup` 的直系子项时，自动进入嵌入态：保留独立点击、链接、状态与内容 gap，退掉自身背景、边框和圆角，并接收 ButtonGroup 分配的单元格 padding。

布局变量链：


<a id="使用示例"></a>

### 使用示例

```svelte
<!-- Basic button -->
<Button>Click me</Button>

<!-- Filled variant -->
<Button variant="filled">Submit</Button>

<!-- Link-styled button navigation -->
<Button href="/about">About</Button>

<!-- Bare button with custom content -->
<Button bare>Random</Button>
<Button bare><Icon><Shuffle /></Icon>Random</Button>
<Button iconOnly aria-label="展开"><ArrowLineDown /></Button>
<Button bare aria-label="展开"><ArrowLineDown size={16} /></Button>
<Button bare emphasis="muted" aria-label="次级操作"><ArrowLineDown size={16} /></Button>
<Button backgroundBlur>背景模糊按钮</Button>

<!-- Date picker trigger -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- Loading state (inherited from Frame) -->
<Button loading>Loading...</Button>
```


<a id="hover-尺寸补偿"></a>

### Hover 尺寸补偿

内置背景动效由 `getButtonBackgroundScale(resolvedSize)` 解析，保留 `BUTTON_HOVER_SCALE_UP_MOTION` 的时序及纵向默认 / sm 基线。以标准高度 `Hsm / Hsize` 为补偿系数 `k`：hover 终点为 `1 + (sm 终点 - 1) × k`；Borderless 隐藏起点为 `1 + (sm 隐藏起点 - 1) × k`；点击中点为 `1 + (当前 hover 终点 - 1) / 2`。

当前 sm / md / lg 标准高度为 24 / 36 / 48（16px 根字号名义值），对应 hover 终点 1.06 / 1.04 / 1.03，Borderless 起点 0.84 / 约 0.893333 / 0.92。标准高度按钮的上下边缘各外扩约 0.72px，Borderless 完整展开行程也保持一致；数值以 [preset catalog](../motion/presets/README.md) 为准。

采用最终解析的 size（显式 Prop 优先于 Context）。横向总扩张量由 preset 限制为最多 0.25rem（16px 根字号下左右各 2px），纵向保持原比例；Borderless 隐藏起点与点击缩回同步使用横向补偿。仅启用默认背景动效时复用共享 resizeManager，初始化、尺寸变化和交互开始时刷新几何，不逐帧测量。根字号变化时上限随 rem 缩放；圆角随背景分轴缩放。自定义高度 / padding 不重新做纵向补偿。命中区、布局、颜色和时序不变。内容默认使用相同分轴比例整体缩放，可通过 `contentScaleOnHover={false}` 保留原尺寸。

<a id="hover-配套点击动效"></a>

### Hover 配套点击动效

启用内置 hover 放大时，每次 click（包括键盘激活）从背景当前显示大小缩回当前尺寸标准 hover 区间的中点，再恢复到 hover 放大大小。所有变体（包括 Borderless）的纵向共享同一规则，横向同步按上述上限补偿：sm 为 `1.06 → 1.03 → 1.06`，md 为 `1.04 → 1.02 → 1.04`，lg 为 `1.03 → 1.015 → 1.03`；具体值以 preset catalog 为准。Borderless 隐藏背景的起点仅用于 hover，不参与点击缩回。缩回与恢复两段各使用 `BUTTON_HOVER_SCALE_UP_MOTION` 一半的时长，保持相同 easing；当前 hover 为 200ms，点击为 100ms 缩回 + 100ms 恢复。文字、Icon、Spinner 作为整体默认同步缩回 / 恢复；关闭内容缩放时保持原尺寸。命中区与布局保持原尺寸，点击回调、链接和 Toggle 状态立即生效，不等待动效。

`scaleOnHover={false}`、复合控件的默认关闭值、bare、disabled 或显式 `whileHover` 接管时，都不运行这份配套动效。作为其他组件的子 Button 时，同样遵循宿主传递的开关；关闭 hover 放大就同时关闭点击缩放。显式重新开启复合控件子 Button 的 hover 放大时，点击效果也随之开启。连续点击从当前背景尺寸重新播放，不排队；点击结束后按实际 hover 状态恢复背景。减少动效模式直接保留当前 hover / idle 视觉，不播放点击缩放。

内容视觉层以 `data-tooltip-anchor-decoration` 声明不改变外层 Tooltip 锚点，避免 hover 缩放中断连续提示。内容使用一个稳定的视觉宿主承载文字、图标及其间距，复用根的对齐与布局设置；开关变化不重建 children。启用内容缩放时通过 `will-change: transform` 保持动画前后的合成层，避免结束时文字重新栅格化产生下移感。背景与内容以按钮中心为缩放原点，复用同一 preset，避免各个叶子独立放大。Borderless 内容从原尺寸开始，背景仍保留隐藏起点，两者同时收敛到相同 hover 比例。减少动效时直接提交最终比例，无过渡或点击缩放。

启用内置缩放且未设置减少动效时，基础背景与 hover 叠层保留各自合成层，避免反复移入 / 移出时图层重建与边缘重绘；代价是保留背景合成层的内存占用。文字继续使用原有 transform 合成动画，不改为逐帧重绘。

有效点击只读取背景与内容各自当前 transform，连续点击从当前画面接管；不增加 Observer、定时器或逐帧 JS 任务。SSR 不读取浏览器 API。

```svelte
<Button>内容默认跟随背景</Button>
<Button contentScaleOnHover={false}>仅背景放大</Button>
<Button scaleOnHover={false}>背景与内容均不放大</Button>
```

<a id="buttongroup-嵌入态"></a>

### ButtonGroup 嵌入态

Button 放入 ButtonGroup 后不需要写额外 prop，ButtonGroup 默认在相邻单元格之间绘制分割线：

```svelte
<ButtonGroup>
  <Button as="item" onclick={copy}>
    <Icon><Copy /></Icon>
    <Text>Copy</Text>
  </Button>
  <Button as="item" onclick={openMore}>
    <Icon><ArrowLineDown /></Icon>
    <Text>More</Text>
  </Button>
</ButtonGroup>
```

- Button 仍然是独立 `button` / `a`，事件、`href`、状态机和无障碍属性都由 Button 自己处理。
- Button 的 size / variant / disabled 默认继承 ButtonGroup；实例显式传 `size` / `variant` 可覆盖。
- 嵌入态不绘制 Button 自己的外壳，避免与 ButtonGroup 外壳叠加。
- 嵌入态会接收 ButtonGroup 分配的单元格 padding，让 hover / 点击响应覆盖完整单元格，而不是只覆盖内部图标和文字。
- 单元格首尾位置由 ButtonGroup 自动标记，不需要在 Button 上手写 `as="first"` / `as="last"`。
- 不需要分割线时在 ButtonGroup 上设置 `showSeparator={false}`；无需手工插入 Separator。
- 嵌入态仍保留 `href` / `target` / `rel`、状态机、动效与 `aria-*` 等 Button 既有能力。
- 纯图标单元格必须在 Button 上显式声明 `iconOnly`；ButtonGroup 嵌入态会覆盖 icon-only padding，确保图标单元格的点击和 hover 区域与普通单元格一致。

<a id="toggle-与瞬时反馈-声明式"></a>

### Toggle 与瞬时反馈 (声明式)

**Button 不提供 `pressed` / `feedback` 等独立 Props**,也**不使用 `stateContent` snippet 切换内容**。Toggle 与瞬时反馈两类模式都通过 Frame 现有的**状态机 + `stateStyle`** 声明式实现 —— 内容固定不变,仅按状态应用 inline-style。

### Toggle:两态来回切换

**推荐写法 — `toggle` 语法糖**：

```svelte
<Button toggle>
    <Icon><Bell /></Icon>
    通知
</Button>
```

`toggle=true` 内部自动注入：

- `Click={{ Idle: "Active", Active: "Idle" }}`
- `whileClick=false`

Active 状态下由 Frame 自动暴露的 `data-state="Active"` 触发 **Brand 配色**（背景 10% + 文字 / Icon `--brand`），`aria-pressed` 由 Frame 自动输出。消费方零样板。

**等价完整写法 — 适合需要自定义状态机的场景**：

```svelte
<Button
    whileClick={false}
    Click={{ Idle: "Active", Active: "Idle" }}
>
    <Icon><Bell /></Icon>
    通知
</Button>
```

Active 配色仍由 `data-state="Active"` 自动生效，与 `toggle` 完全一致。

**自定义 Active 视觉**：

如需 Brand 之外的配色，消费方通过 `stateClass` / `stateStyle` 覆盖，`data-state` 的默认 Brand 选择器在样式优先级上可被普通 class / inline style 覆盖：

```svelte
<Button
    toggle
    stateClass={{ Active: "bg-red-10 text-red" }}
>
    <Icon><Trash /></Icon>
    危险开关
</Button>
```

> **激活态配色统一规则(v1.5.0)**：Button 与 Tag 共用一套激活态规则：
> - 路径：Frame `currentState === "Active"` → DOM 注入 `data-state="Active"` → 组件 CSS `[data-state="Active"]` 套色
> - 配色：背景 `color-mix(var(--brand) 10%, transparent)` + 文字 `var(--brand)`
> - 范围：Button 对 gray / outline / borderless 生效，filled / link 排除避免冲突；Tag 单一变体全适用
> - 消费方**无需引用任何内部 class**

### 瞬时反馈:点击后自动回弹

```svelte
<Button
    whileClick={false}
    Click="Active"
    Active={["Idle", "auto"]}
    whileActive={{ duration: 2000 }}
>
    <Icon><Paperclip /></Icon>
    复制内容
</Button>
```

- `Click="Active"` 点击进入 Active
- `Active={["Idle", "auto"]}` 自动回弹至 Idle
- `whileActive={{ duration: 2000 }}` **只用作 Active 停留时长**(未声明任何动效属性)
- 副作用(如剪贴板写入)挂在 `onclick`;状态切换与回弹由 Frame 统一接管
- Active 期间配色由 `data-state="Active"` 自动套 Brand，无需手写 stateClass

### 与 `aria-pressed` / `aria-selected`(v1.5.0)

Button **自动输出 `aria-pressed`**:

- 当 `currentState === "Active"` 时根节点输出 `aria-pressed="true"`;`currentState === "Idle"` 时输出 `aria-pressed="false"`。
- 仅在状态机声明里出现 `Idle` ↔ `Active` 的 toggle 字典(如 `Click={{ Idle:"Active", Active:"Idle" }}`)时启用;无 toggle 语义的普通 Button 不输出。
- 消费方显式传入 `aria-pressed` 或 `aria-selected` 时,**外部值优先**,组件不再覆盖(用于 Button 处于 listbox / tab 等列表选择语境)。

> 同一规则同步落地于 Tag,详见 [Tag.md 无障碍](Tag.md)。

<a id="与-field-date-input-的组合"></a>

### 与 Field / Date Input 的组合

`Button` 现在只保留一层日期触发规则：

- 当 `Button as="trailing"` 与唯一的同层 `Input type="date"` 处在同一个可识别局部容器中时，会自动代理日期选择器，并隐藏原生日期 icon
- 当前可识别容器仅包括：
  - `Field` 直系子节点
  - `Frame as="row"` 这类 `.snowui-role-row` 容器
- 不再支持通过额外行为 prop 显式声明日期触发器

```svelte
<!-- Direct slot composition -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- Nested row container for multi-control segment -->
<Field>
  <Frame as="row" row>
    <Input type="date" />
    <Button bare as="trailing" aria-label="打开日期选择">
      <ArrowLineDown size={16} />
    </Button>
  </Frame>
</Field>
```

<a id="与-breadcrumb-的组合"></a>

### 与 Breadcrumb 的组合

Button 放入 Breadcrumb 时使用 `as="item"`：

```svelte
<Breadcrumb>
  <Button as="item" href="/dashboards">Dashboards</Button>
  <Text as="separator">/</Text>
  <Button as="item">Default</Button>
</Breadcrumb>
```

- Breadcrumb 会把最后一个 `as="item"` 自动标记为当前页。
- 当前页 Button 会收到 `aria-current="page"` 与 `data-current="page"`。
- 当 Button 同时满足 `data-as="item"` 与 `aria-current="page"` 时，Button 不响应 hover、click、Enter 或 Space，也不显示 hover overlay。
- Button 不因 `as="item"` 改变 `size`；未写 `variant` 时可继承 Breadcrumb 的 `variant`，Breadcrumb 未写 `variant` 时继续使用 Button 默认值。

<a id="与-pagination-的组合"></a>

### 与 Pagination 的组合

Button 放入 Pagination 时使用角色模板：

```svelte
<Pagination page={1} total={5}>
  <Button as="current">1</Button>
  <Button as="page">2</Button>
</Pagination>
```

- Pagination 内的 Button 是角色样式模板，不是页码数据列表。
- `as="current"` 定义当前页模板；`as="page"` 定义非当前页模板。
- `as="prev"` / `as="next"` 可定义上一页 / 下一页模板；缺失时 Pagination 使用内置默认箭头。
- Pagination 会替换模板文本、生成真实页码并接管点击。

<a id="bare-与-icononly-的选择"></a>

### Bare 与 IconOnly 的选择

- `bare`：无外壳按钮，以图标操作为主，适合轻量工具与行内动作（也允许文字）；sm / md / lg 图标默认 16 / 20 / 24px，无需叠加 `iconOnly`。
- `iconOnly`：有对称 padding 的纯图标按钮，外壳样式由 `variant` 决定；sm / md / lg 图标同样为 16 / 20 / 24px（常规图文按钮内的图标缩小一号为 12 / 16 / 20px）。

### 提交与反馈

`loading={busy} skeleton={false}` 显示居中 Spinner 并禁止点击，保留原内容尺寸与可访问名称（未指定 `skeleton={false}` 时走默认骨架行为）。表单行动按钮初始保持可点，字段不完整由提交校验反馈。

## AI Zone

- **宿主与上下文**：[Button.svelte](Button.svelte) 基于 [Frame.svelte](Frame.svelte)（`enableResponsive=false`、`enableContext=true`）；Dialog `as="footer"` 直系 `as="item"` 继承 `sm/md/md` 尺寸（显式 `size` 优先）。
- **尺寸与变体基准**：`sm/md/lg` 最小高度 `24/36/48px`，padding `--padding-1 --padding-3` / `--padding-2 --padding-4` / `--padding-3 --padding-5`，圆角 `--radius-3/4/5`（`.snowui-rounded-rectangle`）；变体配色与 hover overlay 见 [StyleGuide.md §7.4](../../../docs/reference/StyleGuide.md#74-hover-背景色规则)。
- **性能**：分离基础背景与预计算 hover 叠层仅动画 transform/opacity；内容层挂 `data-tooltip-anchor-decoration` 稳定 Tooltip 锚点。

## 更新日志

### v2.21.0 (2026-11-24)

- 新增默认关闭的 `tooltip` 与 `parts.Tooltip`（显式 `children` 经 `ComponentPartsBoundary` 隔离），按需懒加载内置 `Tooltip` 并消费 `ButtonTooltipContext`；所有宿主特化按钮自动继承。
- 悬停宽度缩放系数改为首次悬停／聚焦／点击懒测量，消除挂载期同步回流与默认 `ResizeObserver`。

### v2.20.0 (2026-10-22)

- 复用共享单行间距下限，保留 Hug、size/padding、图标尺寸、动效和事件；2026-10-05 将默认激活色由 Indigo 调整为 Brand（`--brand`）。

### v2.19.0 (2026-09-27)

- 新增 `contentScaleOnHover` 使内容整体跟随背景缩放并可独立关闭；修复缩放尾帧文字视觉下移；2026-09-21 统一文档与 API 表入口。

完整历史见 [更新日志归档](../../docs/history/changelogs/Button.history.md)。
