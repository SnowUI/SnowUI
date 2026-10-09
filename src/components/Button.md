# Button

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v2.19.0
> **职责**: 触发操作或导航，支持文字、图标、加载与禁用状态，适合从主要操作到轻量工具按钮的不同场景。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-28

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
| backgroundBlur | `boolean` | `false` | 是否模糊按钮背后的内容。开启时使用与 BarChart 模糊浮层一致的 `backdrop-filter: blur(1.25rem)`。 |
| scaleOnHover | `boolean` | — | 是否同时启用 Button 内置背景层 hover 放大及配套点击缩回 / 恢复动效。独立动作默认开启；内容默认跟随缩放，命中区和布局不变。复合控件容器可提供 `false` 默认值，子 Button 显式传 `true` 可重新开启。bare 没有背景层，因此无视觉效果；本 Prop 不覆盖显式 `whileHover`。 |
| contentScaleOnHover | `boolean` | 跟随背景缩放 | 是否让文字、Icon、Spinner 等内容作为整体跟随内置背景 hover 与点击缩放。`false` 仅关闭内容缩放；`true` 仍要求背景缩放生效，不能绕过 scaleOnHover=false、bare、disabled 或显式 whileHover 接管。 |
| toggle | `boolean` | `false` | Toggle 模式语法糖。内部自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`；Active 状态下由 Frame 自动暴露的 `data-state="Active"` 触发 Brand 配色（gray / outline / borderless 生效，filled 排除）；`aria-pressed` 由 Frame 自动输出。消费方可继续传 `Click` / `whileClick` 显式覆盖。 |
| holdRepeat | `boolean` | `false` | 开启指针按住连发；仅对未禁用的 button 宿主主按钮按压生效。按下立即触发一次 click，等待后周期触发，松开或取消停止；不为链接或键盘增加连发。 |
| holdRepeatDelay | `number` | `260` | 开始周期连发前的等待时间，单位 ms，负值按 0 处理；仅 holdRepeat=true 生效，第一次周期点击还需等待 holdRepeatInterval。 |
| holdRepeatInterval | `number` | `80` | 按住期间相邻周期 click 的间隔，单位 ms，最小按 1 处理；仅 holdRepeat=true 生效。 |
| children | `Snippet` | — | 按钮内的文字、图标或其他内容；有外壳纯图标用法设置 iconOnly，无外壳用 bare；两者的纯图标用法均须提供可访问名称，组件不通过内容自动推断。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="组件特有属性-component-specific-props"></a>

### 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| href | string | undefined | 链接地址 (渲染为 a 标签) |
| target | string | undefined | 链接打开方式 |
| rel | string | undefined | 链接关系 |

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| as | `'more' \| 'badge' \| 'icon' \| 'prev' \| 'next' \| 'close' \| 'item' \| 'current' \| 'page' \| 'leading' \| 'trailing'` | - | 角色化：作为 Text 展开按钮、Breadcrumb item、Pagination 模板，或接入 Image / ImageViewer / Field 宿主定位协议；进入 Image / ImageViewer 宿主时会翻译为对应 `pin-*` 方位 |

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

Button 的内部布局不接入三槽位模型：

- 根节点保持 inline-level 外壳，内容整体 Hug。
- 内部图标、文本、Spinner 等轻量内容通过 `gap` 自然排列。
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

| 变量 | 默认来源 | 用途 |
| :--- | :--- | :--- |
| `--snowui-button-padding-block` | size 档位 | 外壳纵向内边距 |
| `--snowui-button-padding-inline` | size 档位 | 外壳横向内边距 |
| `--snowui-button-padding` | `padding-block` + `padding-inline` | 外壳内边距 |
| `--snowui-button-icon-only-padding` | size 档位 | 单图标按钮内边距 |
| `--snowui-button-gap` | size 档位 | 图标 / 文本 / Spinner 间距 |
| `--snowui-button-radius` | size 档位 | 外壳圆角 |
| `--snowui-button-font-size` | size 档位 | 文本字号 |
| `--snowui-button-line-height` | size 档位 | 文本行高 |

<a id="使用示例"></a>

### 使用示例

```svelte
<!-- 基础按钮 -->
<Button>Click me</Button>

<!-- 填充样式 -->
<Button variant="filled">Submit</Button>

<!-- 按钮式跳转 -->
<Button href="/about">About</Button>

<!-- 无外壳按钮，可包含任意内容 -->
<Button bare>Random</Button>
<Button bare><Icon><Shuffle /></Icon>Random</Button>
<Button iconOnly aria-label="展开"><ArrowLineDown /></Button>
<Button bare aria-label="展开"><ArrowLineDown size={16} /></Button>
<Button bare emphasis="muted" aria-label="次级操作"><ArrowLineDown size={16} /></Button>
<Button backgroundBlur>背景模糊按钮</Button>

<!-- 日期选择触发器 -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- 加载状态 (继承自 Frame) -->
<Button loading>Loading...</Button>
```

> **更新日志 (2026-09-12)**：横向外扩增加 rem 上限，纵向比例不变；Borderless 起点与点击缩回同步分轴补偿。

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

OSS Button **自动输出 `aria-pressed`**:

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
<!-- 简单场景：自动推断 -->
<Field>
  <Input type="date" />
  <Button bare as="trailing" aria-label="打开日期选择">
    <ArrowLineDown size={16} />
  </Button>
</Field>

<!-- 复杂场景：局部 row 容器 -->
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

- `bare`：无外壳按钮，以图标操作为主，适合轻量工具与行内动作；也允许文字。
- `iconOnly`：有 padding 的特殊图标按钮，用于只有图标时控制对称 padding 和图标大小；外壳样式由 variant 决定。
- 两者同 size 的图标大小一致；文字按钮配图标仍使用 12/16/20px。精确尺寸见下表。
- 历史记录中的 bare 12/16/20px 及纯图标统一叠加 iconOnly 的要求，已由 2026-09-11 用户定义取代。



## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。



> **更新日志 (2026-09-04)**: hover 改为标准高度反比补偿；默认 / sm 保持原效果，md / lg 的背景放大与 Borderless 隐藏起点同步减弱，点击继续缩回当前尺寸放大量的一半。计算规则见下文，具体数值以 preset catalog 为准。
> **更新日志 (2026-08-27)**: 恢复 Owner 在 2026-08-19 确认的背景层比例放大方案：gray / filled / outline 从 `1` 放大到 `1.06`，Borderless 从隐藏的 `0.84` 背景显示并放大到 `1.06`，最终颜色保持 Light 4% / Dark 10%；文字、Icon、Spinner、命中区和布局不变。背景缩放使用 `BUTTON_HOVER_SCALE_UP_MOTION` 的 `200ms ease`，颜色使用通用 `150ms ease-out`。
> **更新日志 (2026-08-19)**: Button hover 的背景颜色与背景外扩统一使用 `150ms ease-in-out`，进入和退出时同时开始、同时结束；固定 `1px` 外扩、radius 同步、内容与布局尺寸均不变。
> **更新日志 (2026-08-19)**: Button 背景 inset 与 radius 的几何动效由 `200ms ease` 优化为 `150ms ease-in-out`，减少 filled 高对比边缘停留在亚像素重绘状态的时间，并缓和 hover 进入 / 退出首段的视觉抖动；固定 `1px` 外扩、radius 同步、`300ms ease-in-out` 颜色渐变、内容与布局尺寸均不变。
> **更新日志 (2026-08-19)**: Button 的独立 hover 背景每边外扩 `1px` 时，背景圆角半径同步增加 `1px`，并与 inset 共用当前 `150ms ease-in-out` 几何动效。该规则同时作用于 `iconOnly` 与普通圆角矩形 Button；`iconOnly` 不建立圆形语义或独立曲线分支，根圆角、连续角、内容和布局尺寸保持不变。
> **更新日志 (2026-08-19)**: Button 外壳接入 `layout.css` 的 `.snowui-rounded-rectangle` 共享视觉类，曲线值统一来自 `tokens.css` 的 `--corner-shape-rounded-rectangle`；独立 hover 背景层显式继承根曲线。sm / md / lg 与公开 override 的 `border-radius` 数值不变，不支持该实验 CSS 属性的浏览器继续使用现有普通圆角；bare 与 ButtonGroup 嵌入态仍保持 `radius: 0`。
> **更新日志 (2026-08-19)**: 独立动作 Button 默认使用 `BUTTON_HOVER_BACKGROUND_GROWTH_MOTION` 固定扩张背景层；sm / md / lg 以及不同内容宽度的背景总宽、总高统一增加 `2px`（四边各外扩 `1px`），文字、Icon 与命中区保持原尺寸。背景颜色与外扩统一使用 `150ms ease-in-out`。`scaleOnHover` 作为兼容 Prop 名可独立关闭，ButtonGroup、Tab/Segmented、Pagination、Breadcrumb 等复合控件项由容器默认关闭。Borderless 使用同一固定像素扩张与颜色渐现；bare 没有背景，因此不执行内置放大。
> **性能说明 (2026-08-19)**: 有背景的 Button 将基础背景与 hover 颜色叠层分开；放大阶段只动画绝对定位背景层的 `inset`，不会改变 Button 或父容器布局。hover 背景颜色仅动画预计算颜色叠层的 `opacity`，不在扩张或渐现期间逐帧重算 `color-mix()` 背景。Outline 原有边框颜色过渡继续保留。
> **更新日志 (2026-08-16)**: SnowUI 宿主基线改为固定低优先级层，`filled` 的 Static White 前景色不再因动态模块加载顺序被 Frame `color: inherit` 覆盖。
> **更新日志 (2026-08-11)**: 新增显式 `iconOnly` 布局声明，默认 `false`；移除基于 children DOM 的自动推断，并为缺少可访问名称的 icon-only Button 提供开发警告。
> **更新日志 (2026-08-09)**: `bare` 默认改为 100% 不透明；新增 `emphasis="muted"` 显式启用 40% → hover 100% 的弱化交互。
> **更新日志 (2026-07-08)**: Button 默认最小宽度改为 `max-content`，保留“文字 + gap + padding”的自然下限，避免 fill 布局吞掉默认 padding。
> **更新日志 (2026-07-08)**: 文字型 Button 默认 `white-space: nowrap`，避免在 Pagination 等压缩布局中被中文逐字换行。
> **更新日志 (2026-06-01)**: 移除 `variant="link"`；文字链接统一迁移到独立 [Link.svelte](Link.svelte)。
> **更新日志 (2026-05-21)**: 自动输出 `aria-pressed`；Toggle 激活态配色统一为 Brand（`.snowui-button-active`），与 Tag `variant="active"` 一致。


**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`。

在 Dialog 的直系 `as="footer"` 操作区内，直系 `Button as="item"` 通过尺寸 Context 接收 sm/md/md 默认值（对应 Dialog sm/md/lg）；显式 `size` 优先。正文与嵌套容器中的 Button 不受该默认值影响。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. Dimensions (尺寸规范)

| Size | Min Width/Height | Padding (常规) | Padding (仅 1 个 icon) | Gap | Corner Radius | Font Size | Line Height | Icon Size |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **sm** | `24px` | `var(--padding-1) var(--padding-3)` | `var(--padding-1)` | `var(--gap-1)` | `var(--radius-3)` | `var(--text-12)` | `var(--leading-12)` | `var(--size-3)` (12) |
| **md** | `36px` | `var(--padding-2) var(--padding-4)` | `var(--padding-2)` | `calc((var(--gap-1) + var(--gap-2)) / 2)` | `var(--radius-4)` | `var(--text-14)` | `var(--leading-14)` | `var(--size-4)` (16) |
| **lg** | `48px` | `var(--padding-3) var(--padding-5)` | `var(--padding-3)` | `var(--gap-2)` | `var(--radius-5)` | `var(--text-16)` | `var(--leading-16)` | `var(--size-5)` (20) |

> **备注**:
> 1. 常规按钮包含文字时，挂载的 `Icon` 等资源尺寸会优先等比缩小一号（`sm: 12`, `md: 16`, `lg: 20`）以匹配文本字号。
> 2. 当按钮显式声明 `iconOnly=true` 时，内部挂载的视觉资源使用放大一级的上下文：`sm: 16`, `md: 20`, `lg: 24`。
> 3. `bare` 与 `iconOnly` 的图标尺寸一致：sm/md/lg 为 16/20/24px；子图标显式 size 优先。bare 不依赖 iconOnly。兼容已有 bare iconOnly 写法时仍由 bare 去掉外壳与 padding，不作为推荐组合。

### 1.1 Bare 模式

| 项目 | 规则 |
| :--- | :--- |
| 背景 | 透明 |
| 边框 | 无 |
| 颜色来源 | 忽略 `variant`，回到默认按钮前景色 |
| 内容 | 可包含文字、Icon 或其他元素 |
| Padding / Radius | `0` |
| Gap | 保留当前 Button `size` 档位的普通内容 gap |
| 最小热区 | `iconOnly=true` 时至少 `16x16`，通过透明点击热区扩展，不改变可见尺寸 |
| 默认透明度 | `1`；`emphasis="muted"` 时为 `0.4` |
| Hover 透明度 | 默认保持 `1`；`emphasis="muted"` 时提升到 `1` |
| Hover 背景图层 | 关闭 `Surface` 默认 hover 叠加 |
| 图标尺寸 | 子图标显式 size > 与 iconOnly 共享的 sm/md/lg 16/20/24px |

### 2. Colors & Interaction (颜色与交互)

#### Color Definitions (颜色定义)
*   **Gray**:
    *   Bg: `var(--black-4, color-mix(in srgb, currentColor 4%, transparent))`
    *   Text: `var(--black-100, currentColor)`
*   **Outline**:
    *   Border: `var(--black-10, color-mix(in srgb, currentColor 10%, transparent))`
    *   Text: `var(--black-100, currentColor)`
*   **Borderless**:
    *   Text: `var(--black-100, currentColor)`
*   **Filled**:
    *   Bg: `var(--primary, #000000)`
    *   Text: `var(--static-white-100, #ffffff)`

#### Hover State (Hover 状态)

> **参考规范**: [StyleGuide.md - 7.4 Hover 背景色规则](./../../../specs/StyleGuide.md#74-hover-背景色规则)

| Variant | Hover 规则 |
|:---|:---|
| **Filled** | 20% overlay (`currentColor`) |
| **Gray/Outline** | Light: 4% overlay, Dark: 10% overlay |
| **Borderless** | Light: 4%、Dark: 10%；独立背景层常态隐藏，起点和 hover 终点按上文尺寸补偿解析；背景与颜色时序沿用 Button preset 和通用颜色时间线，最终颜色不变 |

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引 (Module Index)

- **Button 组件**: [./Button.svelte](Button.svelte)

### 关联关系

- **父组件**: [Frame.svelte](Frame.svelte)
- **组合角色**: `more` (用于 [Text.svelte](Text.svelte) 的展开)、`item` (用于 [Breadcrumb.svelte](Breadcrumb.svelte) 的路径片段)、`current/page/prev/next` (用于 [Pagination.svelte](Pagination.svelte) 的角色模板)

---

## 更新日志

- 2026-10-05：原 Indigo 默认配色改为 Brand（`--brand`），保留原有透明度、状态与覆盖机制。


### 2026-09-28

- 稳定内置 hover 的背景合成层，消除反复移入 / 移出时的图层重建和背景重绘；保留文字缩放、现有比例、颜色与时序。

### v2.19.0 (2026-09-27)

- 新增 contentScaleOnHover，内容默认作为整体跟随背景 hover 与点击缩放；可独立关闭。背景不缩放时内容也不缩放，布局与命中区保持不变。
- 修复 hover 缩放结束时文字重绘造成的视觉下移；sm / md / lg 覆盖动画尾帧与结束帧的像素一致性回归。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v2.18.1 (2026-09-12)

- 背景横向总外扩限制为 0.25rem，纵向保持原比例；Borderless 隐藏起点与点击缩回同步补偿，长按钮不再随宽度无限增加外扩量。复用共享尺寸监听，内容、布局和时序保持不变。

### v2.18.0 (2026-09-04)

- 按标准高度反比补偿 md / lg 的 hover 终点、Borderless 隐藏起点与点击中点；默认 / sm 视觉不变。保留背景等比 transform、颜色、时序、内容和组合开关；最终效果待 Owner 视觉验收。

### 2026-09-03

- 为内置 hover 背景放大增加配套点击缩回 / 恢复，统一由 scaleOnHover 控制。

### v2.17.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v2.17.0 (2026-08-27)

- **BTN-Hover.14** 恢复 2026-08-19 Owner 已确认的背景层比例方案并取代 BTN-Hover.9–13 的现行效果：gray / filled / outline 为 `1 → 1.06`，Borderless 为隐藏的 `0.84 → 1.06`，背景 transform 使用 `200ms ease`，颜色使用通用 `150ms ease-out`；内容、命中区、布局和复合控件关闭规则不变。

### v2.16.0 (2026-08-19)

- **BTN-Hover.13** hover 颜色 opacity 与背景 inset / radius 统一使用 `150ms ease-in-out`，进入和退出时同时开始、同时结束；最终颜色与几何终点不变。

### v2.15.0 (2026-08-19)

#### 动效稳定性
- **BTN-Hover.12** filled 实际浏览器逐帧观察确认根布局稳定，抖动感来自高对比边缘在 `200ms ease` 亚像素重绘以及几何 / 颜色分段结束；几何改为 `150ms ease-in-out`，缩短重绘窗口并缓和进入 / 退出首段，颜色继续以 `300ms ease-in-out` 柔和变化。

### v2.14.0 (2026-08-19)

#### 动效几何
- **BTN-Hover.11** 独立 hover 背景的圆角半径改为“根 Button 最终解析半径 + 当前外扩量”，并与 inset 共用 `200ms ease`；sm / md / lg、`iconOnly` 与普通内容 Button 每边外扩 `1px` 时圆角同步增加 `1px`，根尺寸、内容和连续角曲线不变。

### v2.13.0 (2026-08-19)

#### 视觉架构
- **BTN-Corner.2** Button 从组件内硬编码连续角改为接入 `tokens.css` + `layout.css` 的跨组件圆角矩形共享视觉原语；hover 背景层显式继承根曲线，既有 radius 数值、variant、bare 与组合嵌入态不变。

### v2.12.0 (2026-08-19)

#### 视觉
- **BTN-Corner.1** gray / filled / outline / borderless 根外壳与独立 hover 背景层新增 `corner-shape: superellipse(1.1)`，以接近原普通圆角的视觉圆度表达轻微连续角平滑；保留 sm / md / lg、公开 radius override、bare 与 ButtonGroup 嵌入态的原有圆角数值和所有权，不支持时回退为普通 `border-radius`。

### v2.11.0 (2026-08-19)

#### 动效
- **BTN-Hover.10** hover 颜色层恢复 opacity 过渡，并改为 `300ms ease-in-out`；它慢于 `200ms ease` 背景外扩，使颜色进入与退出更柔和。reduced-motion 下两者都立即提交最终状态。

### v2.10.0 (2026-08-19)

#### 动效
- **BTN-Hover.9** 以真实 Test A2 sm `Small` Button 的 `54.78125 × 24px` 为基准：原 `scale(1.05)` 对应总宽增加 `2.739px`、总高增加 `1.2px`，分别按最近的 2px 倍数取整为 `2px`。默认 hover 改为三档背景总宽、总高统一增加 `2px`，不再按 Button 尺寸或内容宽度使用比例 scale。

### v2.9.0 (2026-08-19)

#### 动效
- **BTN-Hover.8** lg hover 背景层终点由 `1.01` 调整为 `1.015`；Button hover 背景颜色层移除 opacity transition，进入与移出均立即切换，scale 动效保持不变。

### v2.8.0 (2026-08-19)

#### 动效
- **BTN-Hover.7** hover 背景层终点比例改为按最终解析尺寸选择：sm `1.05`、md `1.03`、lg `1.01`；尺寸 Context 与显式 `size` 继续沿用 Button 原有优先级。

### v2.7.2 (2026-08-19)

#### 动效
- **BTN-Hover.6** `BUTTON_HOVER_SCALE_UP_MOTION` 的背景层终点比例由 `1.06` 调整为 `1.05`；内容、布局尺寸、颜色反馈和组合控件关闭规则不变。

### v2.7.1 (2026-08-19)

#### 性能
- **BTN-Hover.5** 基础背景与 hover 颜色叠层分离；缩放只更新背景层 `transform`，颜色反馈只更新独立叠层 `opacity`，不再在 scale 期间逐帧重算 `color-mix()` 背景。Outline 原有边框颜色过渡保持不变。

### v2.7.0 (2026-08-19)

#### 动效
- **BTN-Hover.3** 内置 hover scale 从 Button 根迁移到独立背景层；文字、Icon、Spinner、状态内容和命中区保持原尺寸。
- **BTN-Hover.4** gray / filled / outline / borderless 继续使用原有 base background + overlay 颜色合成；Borderless 背景从 `0.84` 扩张到 `1.06`，bare 因无背景层不执行内置放大。

### v2.6.0 (2026-08-19)

#### 动效
- **BTN-Hover.1** 独立动作 Button 默认通过组件根视觉通道放大到 `1.06`，不改变布局尺寸；Borderless 保留 Light 4% / Dark 10% 的原有 hover 颜色，并让独立背景层从 `0.84` 扩张到完整面积；bare 保持无背景。
- **BTN-Hover.2** `scaleOnHover` 独立控制内置默认，复合控件项由 owner 默认关闭并允许实例显式开启；显式 `whileHover` 接管默认缩放，disabled 不缩放，reduced-motion 直接提交最终比例。

### v2.5.1 (2026-08-16)

- Filled 的 Static White 文字与图标色恢复；宿主基线的继承色不再依赖 CSS 注入顺序覆盖组件自有前景色。
- 外部 class / inline style 的既有覆盖优先级保持不变。

- **Button-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v2.5.0 (2026-08-11)

#### 破坏性变更
- **BTN-IconOnly.2** 新增显式 `iconOnly` Prop，默认 `false`；Button 不再根据 children DOM 自动推断单视觉内容布局。
- **BTN-IconOnly.3** `iconOnly=true` 输出 `data-icon-only="true"`，统一控制对称 padding、尺寸上下文、bare 最小命中区域与 render hints。
- **BTN-A11y.2** 开发环境下，icon-only Button 缺少 `aria-label`、`aria-labelledby` 或 `title` 时输出警告。
- **BTN-IconOnly.4** ColorSchemeButton、StyleButton、CopyButton、ExpandButton 及仓库内纯图标 Button 消费点改为主动声明 `iconOnly`。

### v2.4.0 (2026-08-09)

#### 调整
- **BTN-Bare.2** `bare` 默认改为 `emphasis="normal"`，常态与 hover 均保持 100% 不透明；次级操作显式使用 `emphasis="muted"` 获得 40% → hover 100%。disabled 继续优先消费全局 `--snowui-state-opacity`。
- **BTN-Bare.3** CopyButton 反馈期继承宿主 Button 的 bare 静止强调级别，不再无条件回落到 40%。

### v2.3.2 (2026-07-08)

#### 修复
- **BTN-Text.2** Button 默认 `--snowui-button-min-width` 改为 `max-content`，让按钮在 Pagination `widthMode="fill"` 等外层 flex fill 场景中保留“文字 + gap + padding”的自然下限；空间充足时仍可被外层拉宽，空间不足时由外层换行或溢出策略承接。

### v2.3.1 (2026-07-08)

#### 修复
- **BTN-Text.1** 文字型 Button 默认增加 `white-space: nowrap`，避免在 Pagination `widthMode="fill"` 等压缩布局中把“上一页 / 下一页”等中文短文案逐字换行。

### v2.3.0 (2026-07-04)

#### 新功能
- **BTN-Blur.1** 新增默认关闭的 `backgroundBlur`，开启时复用 BarChart 模糊浮层的 `backdrop-filter: blur(1.25rem)`。
- **BTN-Blur.2** 提供 `--snowui-button-background-blur-override` 覆盖模糊强度。

### v2.2.0 (2026-06-23)

#### 破坏性变更
- **BTN-Bare.3** 无外壳按钮能力统一归入 `bare`，不保留平行入口。`bare` 保留普通内容 gap；单 Icon 时自动注入 12/16/20px 档位尺寸上下文并提供至少 16×16px 的透明点击热区。
- **BTN-Bare.4** 精确 Icon 尺寸改由子 Icon 的 `size` 声明，Button 不再通过无外壳模式接收数值尺寸。

### v2.1.0 (2026-06-22)

#### 新功能
- **BTN-Bare.1** 最初新增 `bare` 无外壳按钮模式：内容可包含文字、Icon 或其他元素；无 padding / radius / 背景 / 边框。当时使用 `currentColor × opacity: 0.4 -> 1`；2026-08-09 起该视觉改由 `emphasis="muted"` 显式启用，bare 默认 100%。
- **BTN-Bare.2** `bare` 放入 Tab 时由 Tab 的 `--snowui-button-opacity-override` 接管透明度；两者作用于同一 Button 根节点，不发生透明度叠乘。

### v2.0.0 (2026-06-01)

#### 破坏性变更
- **BTN-Link.1** 移除 `variant="link"`，不保留兼容入口。文字链接统一使用独立 `<Link>`；按钮式跳转继续使用 `<Button href>`。

### v1.5.1 (2026-05-25)

#### 新功能
- **BTN-Breadcrumb.1** 新增 `as="item"` 组合角色，用于 Breadcrumb 路径片段。
- **BTN-Breadcrumb.2** 当 `as="item"` 的 Button 被 Breadcrumb 标记为 `aria-current="page"` 时，禁用 hover overlay、click、Enter 与 Space 激活，并保持 Button 尺寸不被 Breadcrumb 强制覆盖。
- **BTN-Breadcrumb.3** `Button as="item"` 未显式写 `variant` 时可继承 Breadcrumb 的 `variant`；显式 Button `variant` 优先，Breadcrumb 未写 `variant` 时回到 Button 默认变体。
- **BTN-Pagination.1** 新增 `as="current"` / `as="page"` / `as="prev"` / `as="next"` 组合角色，用于 Pagination 角色样式模板；Button 自身不承担页码计算。

### v1.5.0 (2026-05-21)

#### 新功能
- **BTN-A11y.1** 自动输出 `aria-pressed`:当 `Click` 字典是 `Idle ↔ Active` toggle、且 `currentState ∈ {Idle, Active}` 时,根节点根据当前状态输出 `aria-pressed="true|false"`。
- **BTN-A11y.2** 外部显式传入 `aria-pressed` / `aria-selected` 时优先级最高,组件不再覆盖,以支持 listbox / tab 等列表选择语境。
- **BTN-Toggle.1** 新增 `toggle` prop 语法糖:`<Button toggle>` 内部自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`,配合下方激活态规则零样板得到完整 toggle 行为(状态切换 + Indigo 配色 + aria-pressed)。消费方仍可显式传 `Click` / `whileClick` 覆盖默认。

#### 调整
- **BTN-Active.1** 激活态视觉改用 Frame 自动暴露的 `data-state="Active"` 驱动:根节点在 Active 状态下自动套用 Secondary/Indigo 配色,**消费方无需在 `stateClass` 里引用任何内部 class**(此前 v1.5.0 早期方案要求消费方写 `stateClass={{ Active: "snowui-button-active" }}`,已废弃)。
- **BTN-Active.2** Indigo 自动激活态对 `gray` / `outline` / `borderless` 三类 variant 生效;`filled` 排除以避免与变体既有配色冲突。需在 filled 上做激活反馈时由消费方通过 `stateClass` / `stateStyle` 自定义。

### v1.4.4 (2026-03-16)

#### 调整
- **BTN-Role.4** 移除 `control="date-picker"` 行为协议；日期触发器重新收敛为纯 `as="trailing"` 组合规则。
- **BTN-Role.5** 复杂结构中的日期触发器仅在可识别的局部容器内生效，例如 `Field` 直系或 `Frame as="row"`。

### v1.4.3 (2026-03-15)

#### 修复
- **BTN-Role.3** Button 现在正确透传 `as` 给 Frame 角色类，`as="trailing"` 可参与 Field 组合协议。

### v1.3.10 (2026-03-10)

#### 新功能
- **BTN-Role.1** Button 现在可通过 `as="badge"` / `as="icon"` 接入 `Image` 宿主定位协议。
- **BTN-Role.2** Button 现在可通过 `as="prev"` / `as="next"` / `as="close"` 接入 `ImageViewer` 控制按钮定位协议。

### v1.3.8 (2026-02-26)

#### 架构调整
- **BTN-Refactor.1** 移除 `stateText` 特化能力，Button 回归通用 children 渲染。
- **BTN-Refactor.2** 状态变量、状态 class、状态 style 统一由 Frame 的通用能力承载（`stateVars/stateClass/stateStyle`）。

### v1.3.6 (2026-02-26)

#### 新功能
- **BTN-Feat.1** Button 子内容现在透传 Frame 的状态对象（含 `currentState`），可在 `<Button>` 内通过 `children` snippet 直接做声明式状态文案切换。

### v1.3.5 (2026-02-25)

#### 修复
- **BTN-Fix.3** 注入 `RESOURCE_ICON_CONTEXT_KEY` 尺寸上下文；当时直放资源图标会由 DOM 自动识别并使用 sm/md/lg => 16/20/24，v2.5.0 起改为 `<Button iconOnly>` 显式启用。

### v1.3.4 (2026-02-25)

#### 修复
- **BTN-Fix.2** `as="more"` 角色识别不再依赖 `TextContext`：只要声明 `as="more"` 即挂载 `snowui-text-expand-button` 样式类，确保在 `Text` 内容中声明后稳定可见；点击时仍在存在 `TextContext` 时触发展开联动。

### v1.3.3 (2026-02-25)

#### 修复
- **BTN-Fix.1** 调整 `as="more"` 渲染策略：不再由 `isCollapsed` 作为显隐条件，`Text` 容器中声明了 `<Button as="more">` 即参与渲染；保留点击后与 Text 展开逻辑联动。

### v1.3.2 (2026-02-23)

#### 架构调整
- **BT-Refactor.1** 移除 Button 内置文本截断能力（`buttonLines` + `truncate` action）。
- **BT-Refactor.2** 截断能力统一由 `Text` 组件提供，Button 保持交互与布局职责。

### v1.3.1 (2026-02-18)

#### 样式优化
- **BT-Bridge.1** Button 核心视觉属性（`width/height/padding/gap/radius/font-size/line-height/color/background/inner-border`）改为变量桥接链：`override -> internal -> token`。
- **BT-Bridge.2** `sm/md/lg` 与 `icon-only` 改为只覆写内部变量，不直接写视觉终值，便于宿主组合覆盖。
- **BT-Bridge.3** 变体状态改为通过桥接变量驱动，使用 `data-variant` 作为 Level 4 选择器入口，并保留禁用态 hover 排除。

### v1.3.0 (2026-02-18)

#### 调整
- **BT-Layout.1** 移除 `sm/md/lg` 所有按钮的 `min-width/min-height` 约束，按钮尺寸完全由内容与内边距决定。
- **BT-Style.2** 精简尺寸样式变量结构：默认档位改为 `sm`，仅在 `md/lg` 覆写差异变量；合并 `icon-only` 重复选择器。
- **BT-Spec.1** 对齐 Figma 按钮三档规格：`sm/md/lg` 的 `icon-size`、`padding`、`gap`、`radius` 更新为 `16/20/24`、`4x12/8x16/12x20`、`4/6/8`、`12/16/20`
- **BT-Typography.1** 字号与行高改为强配对：`sm=--text-12 + --leading-12`，`md=--text-14 + --leading-14`，`lg=--text-16 + --leading-16`
- **BT-IconOnly.1** 单图标按钮 `icon-only` 的 padding 与档位纵向内边距保持一致（`4/8/12`）

### v1.2.8 (2026-02-07)

#### 修复
- **BT-Fix.5** 修复 `icon + text` 被误判为 `icon-only` 的问题
- **BT-Fix.6** 当时将 `icon-only` 识别改为运行时精确检测（单图标元素 + 无文本节点）；该自动识别已由 v2.5.0 移除。

### v1.2.3 (2026-02-07)

#### 修复
- **BT-Fix.2** 修复 `Icon.svelte` 在 Button 中未按 `sm/md/lg` 自动匹配 `16/20/24` 的问题（通过 Frame Size Context 传递）
- **BT-Fix.3** 修复单图标按钮规则未命中 `Icon` 根节点（补充 `.snowui-icon-wrapper`）
- **BT-Fix.4** 修正 `link` 变体最小高度重置（`min-height: 0`）

### v1.2.2 (2026-02-07)

#### 新功能
- **BT-Size.1** 补齐 `sm/md/lg` 的最小宽高（`28/40/56`）
- **BT-Size.2** 增加 `Icon.svelte` 子组件尺寸与按钮尺寸联动（`16/20/24`）
- **BT-Size.3** 增加单图标按钮（仅 1 个 icon）的独立 padding 规则

#### 调整
- **BT-Style.1** `sm` 常规 padding 调整为 `左右 12 / 上下 4`

### v1.2.1 (2026-02-03)

#### 修复
- **BT-Fix.1** 补齐 Frame 能力开关显式传参

### v1.2.0 (Initial)
- 初始版本
