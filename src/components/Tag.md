# Tag

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.2.3
> **职责**: 以可交互标签表达标记、筛选条件或路径片段，适合组织内容与收敛选择范围。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-21

## 组件介绍

以可交互标签表达标记、筛选条件或路径片段，适合组织内容与收敛选择范围。

## 使用选择

<!-- usage-guide:start -->
用于带边界的标签内容及公开的关闭操作。关闭和选中是不同语义；需要独立按钮或选择控件时使用对应组件。

- closable 显示关闭操作，onClose 通知页面移除数据；关闭不会替页面修改列表。
- variant、shape 和 toggle 分别控制外观、形状与切换能力；parts 仅配置默认关闭按钮。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Tag, Button } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Tag toggle>Design</Tag>
	<Tag toggle>Engineering</Tag>
	<Tag toggle>Product</Tag>
</div>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置组件生成的关闭 Button；不影响显式 children 内的按钮。 |
| variant | `"default" \| "active"` | `"default"` | 视觉变体。`default` = Black/4% 背景；`active` = Brand 10% 背景 + Brand 文字 |
| toggle | `boolean` | `false` | Toggle 模式语法糖。内部自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`；Active 状态由 Frame 输出的 `data-state="Active"` 触发 Brand 激活态；`aria-pressed` 自动输出。消费方可继续传 `Click` / `whileClick` 显式覆盖。 |
| closable | `boolean` | `false` | 是否显示内置删除 X（hover Tag 时显形） |
| shape | `"default" \| "left-arrow" \| "right-arrow"` | `"default"` | 外壳形状，用于路径 / 面包屑片段 |
| onClose | `(event: MouseEvent) => void` | — | 点击 X 时回调（不直接销毁 Tag，移除逻辑由消费方决定） |
| children | `Snippet` | — | 标签显示内容，由 Frame 的 children 渲染协议承接；关闭按钮由组件另行管理。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="设计形态"></a>

### 设计形态

设计稿中的 Tag 形态统一收敛为以下能力组合：

| 形态 | 组件表达 | 说明 |
| :--- | :--- | :--- |
| `Tag` | `<Tag>Label</Tag>` | 仅文字 |
| `Tag ×` | `<Tag closable>Label</Tag>` | 文字 + 内置关闭 X |
| `● Tag` | 外部 `<Icon as="leading">` + Tag | 左侧 Dot 不内置，由消费方显式传入 |
| `● Tag ×` | 外部 leading Icon + `closable` | Icon、文字、X 走同一内联外壳布局 |
| 品牌色 `● Tag ×` | `variant="active"` 或 `toggle` 切到 Active | Brand 激活态 |
| `< Tag` | `shape="left-arrow"` | 路径 / 面包屑片段 |
| `Tag >` | `shape="right-arrow"` | 路径 / 面包屑片段 |

设计稿中的左侧 Dot 仅作组合展示，Tag 不内置 leading Icon；X 由 `closable` 内置提供。设计稿内 X 与文字紧贴，组件默认 `gap=0`，外部覆盖 `--snowui-tag-gap` 或传 `gap` 时会同步影响 Icon、文字与 X 的间距。

<a id="与-chip-badge-的区分"></a>

### 与 Chip / Badge 的区分

| 维度 | Tag | Chip | Badge |
| :--- | :--- | :--- | :--- |
| 内置 leading Dot | 否 | 是 | — |
| 删除 X | 内置（`closable`） | 否 | — |
| 激活态 | 内置（`variant="active"`） | 否（外部 class 控制颜色） | — |
| 箭头外壳 | 内置（`shape`） | 否 | — |
| 尺寸档位 | 单一尺寸 | sm / lg | 多档 |
| 主要语义 | 用户标记 / 筛选 / 路径片段 | 状态 / 分类展示 | 数字 / 圆点徽标 |
| 布局 | 内联外壳（同 Button） | 三槽位 | 内联外壳 |

<a id="组件特有属性-component-specific-props"></a>

### 组件特有属性 (Component-Specific Props)

> **不提供 `size` 属性**：设计稿只有单一尺寸。

<a id="关键字-keyword"></a>

### 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| as | `'leading' \| 'trailing'` | - | 角色化：作为外部容器（Field 等）的槽位 |

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**（与 Button 一致）。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

- 子元素通过 `gap` 自然排列；外部覆盖 `--snowui-tag-gap` 或传 `gap` 即可同步影响所有子元素间距（包括内置 X 与文字、外部 Icon 与文字）。
- **不内置 leading Icon**；需要 Dot 由消费方显式传入 `<Icon as="leading">`。
- 删除 X 由 `closable={true}` 自动渲染在末尾；视觉与 hover 复用 `Button bare emphasis="muted"`（默认图标为 Components 自有语义 `close`，其包内形状快照来源为 `close-regular.svg`）；默认 `width: 0`、`min-width: 0` 不占位，hover Tag 时显形，hover X 自身时透明度提升到 1。激活态下 X 颜色源切到 Brand：未 hover X 时 40%，hover X 时 100%。
- **边距按元素类型决定**（与 Figma 对齐）：文字与边的间距 8px、Icon / X 与边的间距 4px。组件通过 MutationObserver 检测**真实**首/末位节点（包含文本节点），按节点类型写到 `data-edge-left` / `data-edge-right`（`"icon"` / `"text"`），CSS `[data-edge-*="icon"]` 把对应侧 padding 从 8px 收紧到 4px。**纯 CSS `:first-child` / `:last-child` 只看元素节点，无法识别"末位文字"的情况**，因此走 JS。closable 的 X 不计入边距检测（X 由 `[data-closable]:hover` 单独管理右 padding）。
- 箭头形状（`left-arrow` / `right-arrow`）由内部 SVG 背景路径实现，不进入子元素布局；组件用 ResizeObserver 获取当前宽高并生成完整外轮廓，所有拐点都通过二次贝塞尔圆角化，尽量复原 Workshop `node-id=11951-40471`。

<a id="无障碍-accessibility"></a>

### 无障碍 (Accessibility)

与 Button 一致，自动输出 `aria-pressed`：

- 当 `variant="active"`（映射到 `currentState="Active"`）或通过 `toggle` / `Click={{ Idle: "Active", Active: "Idle" }}` 切到 Active 时，根节点输出 `aria-pressed="true"`；处于 Idle 时输出 `aria-pressed="false"`。
- 消费方显式传入 `aria-pressed` 或 `aria-selected` 时**外部值优先**，用于列表选择语境改用 `aria-selected`。
- 删除 X 渲染为 `<button type="button" aria-label="Close tag">`，键盘可达，屏幕阅读器可识别。
- 删除 X 点击时组件内部会 `stopPropagation()`，避免误触 Tag 根节点的 `onclick`；移除逻辑仍由消费方在 `onClose` 中决定。

<a id="布局变量链"></a>

### 布局变量链

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-tag-padding-block` | `calc(var(--padding-1, 4px) / 2)`（= 2px） | 外壳纵向内边距 |
| `--snowui-tag-padding-inline` | `var(--padding-2, 8px)` | 外壳横向内边距 |
| `--snowui-tag-padding-inline-leading` | `var(--padding-1, 4px)` | 含 leading 子节点时左侧 padding |
| `--snowui-tag-padding-inline-trailing` | `var(--padding-1, 4px)` | 含 trailing（X）时右侧 padding |
| `--snowui-tag-gap` | `0` | 子元素间距；可被外部 `gap` 覆盖 |
| `--snowui-tag-radius` | `var(--radius-3, 8px)`；箭头形状由 SVG path 内部圆角控制 | 外壳圆角 |
| `--snowui-tag-font-size` | `var(--text-12, 12px)` | 文字字号 |
| `--snowui-tag-line-height` | `var(--leading-12, 16px)` | 文字行高 |
| `--snowui-button-icon-size` | `var(--size-4)`（标准根字号16px） | 内置 X 尺寸 |
| `--snowui-tag-bg` | `var(--black-4, rgba(0,0,0,0.04))` | 背景 |
| `--snowui-tag-color` | `inherit` | 文字颜色 |

<a id="用法示例"></a>

### 用法示例

```svelte
<!-- 默认（仅文字） -->
<Tag>Label</Tag>

<!-- 可关闭 -->
<Tag closable onClose={() => remove('foo')}>Label</Tag>

<!-- 文字 + 外部 leading Icon（非内置） -->
<Tag>
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Label
</Tag>

<!-- 激活态（自动输出 aria-pressed="true"） -->
<Tag variant="active" closable>
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Filtered
</Tag>

<!-- Toggle：点击进入激活态，再次点击回到常态 -->
<Tag toggle>Filter</Tag>

<!-- 外部覆盖 gap：所有子元素间距同步变为 4px -->
<Tag closable style="--snowui-tag-gap: 4px;">
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Label
</Tag>

<!-- 路径片段 -->
<Tag shape="right-arrow">Home</Tag>
<Tag shape="left-arrow">Settings</Tag>

<!-- 箭头形状可与删除正交组合 -->
<Tag shape="right-arrow" closable>Filters</Tag>

<!-- Toggle 等价完整写法（适合自定义状态机） -->
<Tag whileClick={false} Click={{ Idle: "Active", Active: "Idle" }}>
    Label
</Tag>

<!-- 列表选择语境：传 aria-selected 覆盖默认 aria-pressed -->
<Tag aria-selected={isSelected} variant={isSelected ? "active" : "default"}>
    Label
</Tag>
```



## AI Zone

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。`parts.Button` 配置默认内置操作按钮（包含 size、class、style），功能事件、ARIA和角色仍由父组件控制。



> **更新日志 (2026-09-20)**: 内置关闭按钮清除最小内容宽度，常态不占位；离开后先淡出 X，再收回宽度和 padding。键盘焦点位于 Tag 内时保持展开。
> **更新日志 (2026-08-30)**: 收起态内置 X 通过 Tag 直属规则完整覆盖共享按钮的 `flex` shorthand，确保视觉隐藏时不保留 12px 布局占位。
> **更新日志 (2026-05-22)**: `shape="left-arrow" / "right-arrow"` 改为内部 SVG 背景路径，根据当前 Tag 宽高生成完整圆角箭头轮廓；所有外角均圆角化，尽量复原 Workshop `node-id=11951-40471` 中的箭头 Tag。
> **更新日志 (2026-05-21)**: 激活态内置 X 颜色改为 Brand：未 hover X 时 40%，hover X 时 100%，不再使用黑色。
> **更新日志 (2026-08-16)**: 内置 X 改由 Components 自有 `ComponentIcon name="close"` 解析；无外部资源包时保持相同默认形状，应用级 `IconProvider` 可统一替换。
> **更新日志 (2026-08-16)**: Tag 自有颜色、padding 与 hover overlay 过渡稳定覆盖 Level 1 共享行为，不依赖 CSS 注入顺序。
> **更新日志 (2026-05-21)**: 新增 `toggle` 语法糖，与 Button 一致自动注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`；点击进入激活态，再次点击回到常态。

> **设计稿**: [Workshop / Tag](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=11841-21705&t=nY2VC3oisn12OH01-4)

**继承**: 复用 Frame.svelte 的所有通用能力 (交互、动效、响应式)。
**默认能力开关**: `enableResponsive=false`、`enableContext=true`、`enableScaleObserver=false`。

<a id="样式规范-style-spec"></a>

### 样式规范 (Style Spec)

### 1. 默认态 (variant=default)

| 属性 | 值 |
| :--- | :--- |
| Display | `inline-flex` |
| Align | `center` |
| Padding（无 leading、无 X） | `calc(var(--padding-1) / 2) var(--padding-2)`（= 2px 8px） |
| Padding（首位 Icon） | 左侧改为 `var(--padding-1)`（= 4px），由 JS 写入 `data-edge-left="icon"` 触发 |
| Padding（末位 Icon） | 右侧改为 `var(--padding-1)`（= 4px），由 JS 写入 `data-edge-right="icon"` 触发；X 不计入末位检测 |
| Padding（hover X） | closable Tag hover 时右侧改为 `var(--padding-1)`（= 4px），由 Frame 桥接动效平滑过渡 |
| Gap | `0`（可被外部覆盖） |
| Border Radius | `var(--radius-3)`（= 8px） |
| Background | `var(--black-4)`（= rgba(0,0,0,0.04)） |
| Color | `inherit` |
| Font | `var(--text-12) / var(--leading-12)` |

### 1.1 整体 Hover

| 属性 | 值 |
| :--- | :--- |
| 行为类 | 根节点始终挂 `.snowui-hoverable`，与 Button 共享 hover overlay 与 `cursor: pointer` 协议 |
| 默认态 hover | 在 `--black-4` 背景上额外叠加 currentColor hover overlay（浅色 4%，暗色 10%） |
| 激活态 hover | 在 Brand 10% 背景上额外叠加 currentColor hover overlay |
| X 显形 | hover 整个 Tag 时 X 从 `width: 0; opacity: 0` 展开到 `width: var(--snowui-button-icon-size); opacity: 0.4`，同时右侧 padding 从 8px 收紧到 4px |

### 2. 激活态 (variant=active)

| 属性 | 值 |
| :--- | :--- |
| Background | `color-mix(in srgb, var(--brand) 10%, transparent)` |
| Color | `var(--brand)` |
| Icon 颜色 | `currentColor`（自动继承 Brand） |
| X 颜色 | `var(--brand)` × opacity：未 hover X 时 40%，hover X 时 100% |

### 3. 箭头形状（SVG 圆角箭头）

| 属性 | 值 |
| :--- | :--- |
| 实现 | 内部 SVG 背景层：ResizeObserver 获取 Tag 当前宽高，按 `left-arrow` / `right-arrow` 生成一条完整 path；内容仍走原 inline-flex 布局 |
| 圆角来源 | Workshop `node-id=11951-40471`；主体四角为 8px，箭头尖端为 4px，均通过 path 的 `Q` 曲线处理 |
| 填充色 | SVG 主 path 填充 `--snowui-tag-bg` / `--snowui-tag-bg-override`；激活态切到 Brand 同步 |
| Hover | SVG 叠加一条同轮廓 overlay path，opacity 消费 `.snowui-hoverable` 同款 `--snowui-hover-opacity` / `--snowui-frame-hover-opacity` |
| 接缝 | 单条完整 path 覆盖整个箭头外壳，不再由 body + 伪元素拼接，因此没有直边接缝 |
| 内容间距 | 箭头尖端侧显式保持 `var(--padding-1)`（= 4px），加上 8px 尖端长度后，文字到尖端约 12px；非尖端侧保持 `var(--padding-2)`（= 8px）。Icon / X 边距收紧规则不再覆盖箭头形态，避免第一个 `left-arrow` 示例右侧间距丢失 |
| 布局空间 | Tag 根 `margin-left/right: var(--snowui-tag-arrow-width)`（= 8px）预留箭头尖端可见区；内部 SVG 显式 `max-width: none`，避免被全局 `svg { max-width: 100%; }` 截断尖端导致示例间距翻倍 |
| 动态尺寸 | path 随 Tag 宽高实时重算；外部内容、closable X 显隐、字号或 padding 变化后仍保持完整圆角轮廓 |
| 正交组合 | 箭头形状可与 `closable`、外部 leading Icon 自由组合；箭头只影响外壳几何，不参与子元素布局 |

### 4. 关闭 X

| 属性 | 值 |
| :--- | :--- |
| 实现 | 复用 `Button bare emphasis="muted"`；内部图标为 Components `ComponentIcon name="close"`（包内默认 regular 快照来自 `close-regular.svg` 与 Workshop 12×12 X） |
| Size | `1rem`（标准根字号16px） |
| Color | 默认态：`var(--black-100)` × opacity；激活态：`var(--brand)` × opacity |
| Opacity（默认） | `0.4` |
| Opacity（hover X 自身） | `1` |
| Width（默认） | `0` + `overflow: hidden` — 不占位，Tag 宽度等同于不含 X 的同内容 Tag |
| Width（hover Tag） | `var(--snowui-button-icon-size)` — 显形并撑出 Tag 宽度 |
| Opacity（默认） | `0` |
| 过渡动效 | `width` / `opacity` / `padding-right` 三项消费 Frame 桥接动效 `var(--snowui-frame-color-motion-duration)` + `var(--snowui-frame-color-motion-easing)`，hover 进出平滑过渡 |


---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 模块索引

- **Tag 组件**: [./Tag.svelte](Tag.svelte)
- **规范入口**: 本文件

### 关联关系

- **基础**：基于 Frame，复用内联外壳布局（同 Button）
- **aria-pressed 自动输出**：由 [frame-dom-runtime](../logic/frame-dom-runtime.svelte.ts) 统一注入，Button 同步受益
- **激活态配色路径**：与 Button 共用 Frame 自动暴露的 `data-state="Active"` → 组件 CSS `[data-state="Active"]` 路径，配色规则一致
- **hover 行为路径**：根节点始终挂 `.snowui-hoverable`，由共享行为类提供 hover overlay 与 pointer cursor；Tag 自身只补充 X 显隐、padding 与箭头几何

---

## 更新日志

- 2026-10-05：原 Indigo 默认配色改为 Brand（`--brand`），保留原有透明度、状态与覆盖机制。


- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.2.3 (2026-09-20)

- 关闭按钮清除最小内容宽度，常态不占位；退出时先淡出再收宽，键盘聚焦保持展开。

### v1.2.2 (2026-08-30)

- 修复 closable Tag 非 hover 时隐藏 X 被共享 `flex` shorthand 恢复为 12px 占位，造成右侧多余空间的问题。

### v1.2.1 (2026-08-16)

- 恢复 Tag 根与 closable 状态的完整 transition 通道，并显式保留 hover overlay 过渡。

### v1.2.0 (2026-05-22)

#### 修复
- **TAG-Shape.3** `shape="left-arrow" / "right-arrow"` 改为内部 SVG 背景 path，根据当前 Tag 宽高动态生成完整圆角箭头轮廓；所有外角均圆角化，避免原 body + 伪元素拼接方案在主体侧留下直角。

### v1.1.2 (2026-05-21)

#### 修复
- **TAG-Close.3** 内置 X 通过 `ComponentIcon name="close"` 使用 Components 随包 plain X 默认图标，并可由 IconProvider 统一替换；默认形状仍来源于 `close-regular.svg` 与 Workshop 12×12。
- **TAG-Close.4** 激活态内置 X 颜色源改为 `--secondary-indigo`：未 hover X 时 40%，hover X 时 100%，避免激活 Tag 内的 X hover 成黑色。

### v1.1.1 (2026-05-21)

#### 修复
- **TAG-Close.2** 内置 X 改为复用 `.snowui-clear-icon-btn` 共享基类与 `<XCircle weight="fill" />`，补齐 hover X 自身时 `opacity: 0.4 → 1` 的反馈。

### v1.1.0 (2026-05-21)

#### 新增
- **TAG-Toggle.1** 新增 `toggle` prop，与 Button 同款语法糖：默认注入 `Click={{ Idle: "Active", Active: "Idle" }}` 与 `whileClick=false`，点击在常态 / 激活态之间切换。

#### 修复
- **TAG-State.1** 默认 `variant="default"` 不再把 Frame 受控锁定到 `Idle`，显式 `Click` 状态机可正常驱动 `data-state="Active"`。

### v1.0.0 (2026-05-21)

#### 新增
- **TAG-Init.1** 创建 Tag 组件，支持 `default` / `active` 两种视觉变体。
- **TAG-Layout.1** 内联外壳布局（与 Button 一致），不内置 leading Icon。
- **TAG-Close.1** 内置 `closable` 关闭 X：hover Tag 时显形，颜色 currentColor、默认 opacity 0.4，hover X 自身时 1；点击触发 `onClose` 并 `stopPropagation`。
- **TAG-Shape.1** 支持 `shape="left-arrow" / "right-arrow"` 路径片段形态（CSS clip-path）。
- **TAG-Shape.2** 箭头 path 按 Workshop `node-id=11887-37739` 补齐圆角轮廓；继续使用纯 CSS 伪元素 + `clip-path: path()`，避免 SVG 与主体产生间距或叠加。
- **TAG-A11y.1** 与 Button 一致自动输出 `aria-pressed`（基于 currentState，由 frame-dom-runtime 注入）；外部 `aria-pressed` / `aria-selected` 优先。
- **TAG-Color.1** 激活态背景 `--secondary-indigo` 10% + 文字 `--secondary-indigo`，与 Button `.snowui-button-active` 完全一致。
