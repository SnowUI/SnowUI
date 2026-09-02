# ButtonGroup.svelte 文档

> **版本**: v1.2.1
> **职责**: 提供带内置可选分割线的多 Button 拆分按钮容器。

**继承**: 复用 Frame.svelte 的通用能力。
**默认能力开关**: `enableAutoLayout=false`, `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。ButtonGroup 是内联外壳布局，`row` 只提供方向类，不接入三槽位默认 gap。

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `'gray' \| 'filled' \| 'outline' \| 'borderless'` | `'gray'` | 外壳视觉变体 |
| `size` | `"sm" \| "md" \| "lg"` | —（最终回退 "sm"） | 控制外壳和嵌入 Button 的密度；显式值优先，其次父级尺寸上下文，再回退 sm。子 Button 的显式 size 可覆盖继承值。 |
| disabled | `boolean` | `false` | 禁用整个 ButtonGroup，并传递给内部嵌入态 Button |
| `showSeparator` | `boolean` | `true` | 显示相邻 Button 单元格之间的内置装饰分割线；false 关闭全部分割线，不改变各按钮的操作与分组布局。 |
| `children` | `Snippet` | — | 显式放置可独立操作的 Button；直系 Button 自动成为分组单元格并继承组配置，分割线由组内建，无需手写 Separator。 |
| ...rest | `FrameProps` | - | 透传到根 Frame，保留状态、动效、事件、`data-*` 等能力 |

## 组件边界

- ButtonGroup 属于 OSS 组件，作用半径只覆盖自身一个 Frame 容器，不依赖 PRO 的跨 Frame 编排能力。
- `variant` 对齐 Button 的 `gray` / `filled` / `outline` / `borderless`。初版不开放 `link`，因为 link 形态没有稳定按钮外壳，不适合承载分割线。
- ButtonGroup 不内置 Popover / Menu 行为。需要菜单时，消费方把 Popover 触发器或菜单图标放入某个 Button 单元格。
- ButtonGroup 不提供专用 Cell 组件。单元格直接复用 Button，避免平行维护第二套按钮事件、链接、状态、图标尺寸与无障碍逻辑。
- ButtonGroup 不改变 Button 的 `bare` 无外壳语义；单 Icon 的尺寸上下文与透明点击热区继续由 Button 自动处理。
- ButtonGroup 中多个 Button 共同构成一个复合控件，item 默认 `scaleOnHover=false`，避免相邻单元格互相覆盖；子 Button 可显式传 `scaleOnHover={true}` 重新开启。

## 结构规则

单元格直接使用 `Button`，相邻 item 之间默认由 ButtonGroup 绘制装饰性分割线：

```svelte
<ButtonGroup>
  <Button as="item" onclick={copy}>
    <Icon><Copy /></Icon>
    <Text>Copy</Text>
  </Button>
  <Button as="item" onclick={openMore}>
    <Icon><ChevronDown /></Icon>
    <Text>More</Text>
  </Button>
</ButtonGroup>
```

不需要分割线时关闭内置显示：

```svelte
<ButtonGroup showSeparator={false}>
  <Button as="item">Previous</Button>
  <Button as="item">Next</Button>
</ButtonGroup>
```

旧代码中的直系 `Separator as="separator"` 会被 ButtonGroup 隐藏，避免升级后与内置分割线重复；应在迁移时删除这些手工 Separator。其他显式内容仍按普通容器内容渲染，不会被当作 ButtonGroup item。

内部 Button 作为 ButtonGroup 的直系子项时自动进入嵌入态：

- 保留独立 `onclick` / `href` / 状态机 / 动效 / 无障碍能力。
- 退掉自身背景、边框和圆角，但接收 ButtonGroup 分配的单元格 padding。
- 保留自身内容布局与单元格内 gap。
- 默认继承 ButtonGroup 的 `size` / `variant` / `disabled`，实例显式传值可覆盖 size / variant。
- ButtonGroup 会自动标记直系 Button 的单元格位置：`only` / `first` / `middle` / `last`，消费方不需要手写 `as="first"` / `as="last"`。

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

- ButtonGroup 根层管理外壳圆角、背景、边框与裁剪；视觉 padding 转交给嵌入态 Button，确保每个单元格的 hover / 点击热区覆盖自身完整单元格。
- ButtonGroup 根层显式关闭 Auto Layout；Button 单元格之间的布局 gap 恒为 `0`，内容到内置分割线的视觉距离只由相邻 Button 的内侧 padding 表达。Button hover 盒必须与分割线边界连续。
- 如果消费方在 ButtonGroup 根层追加 padding（例如 `class="p-40"` 或内联 `padding`），ButtonGroup 会把根层 padding 映射为首尾单元格 hover 覆盖的扩展区域；hover 仍然按单元格独立响应，并被根层圆角裁剪。
- ButtonGroup 与 Button 相同的视觉规则统一使用 Button token：`--snowui-button-padding-block` / `--snowui-button-padding-inline`、`--snowui-button-radius`、`--snowui-button-background`、`--snowui-button-color`、`--snowui-button-border-*`、`--snowui-button-font-size`、`--snowui-button-line-height`。ButtonGroup 只保留分组专属的内侧间距、Separator 长度与外部 padding 扩展变量。
- Button 管理单元格内部 Icon / Text / Spinner 的 gap。
- 内置分割线不占布局、不通过 margin 表达间距；单元格到分割线的空间由嵌入态 Button 的单元格 padding 承担。
- 外侧 padding 是单元格内容到 ButtonGroup 边缘的距离，沿用 Button 的 padding-x；内侧 padding 是单元格内容到 Separator 的距离，使用 ButtonGroup 的 gap。
- 首单元格左侧使用外侧 padding，右侧使用内侧 padding；尾单元格右侧使用外侧 padding，左侧使用内侧 padding；中间单元格两侧都使用内侧 padding。多个单元格按 DOM 顺序自动应用。
- ButtonGroup 根元素默认 `width: max-content` 且 `align-self: flex-start`，避免放在 `flex-col` 这类父容器中被 `align-items: stretch` 横向撑大。
- 默认单元格保持 Hug 内容，不做均分拉伸。
- Hover 状态由内部每个 Button 单元格分别响应，ButtonGroup 外壳不做整块 hover 变色；单元格 hover 颜色规则与 Button 对应 variant 保持一致。
- Disabled 状态由 ButtonGroup 外壳统一应用 `opacity: 0.2`；内部继承 disabled 的嵌入态 Button 只保留禁用语义，不重复衰减透明度。
- 内容不使用三槽位语义；`as="leading"` / `as="trailing"` 只表示 ButtonGroup 作为外层宿主的配件角色，不改变 ButtonGroup 内部排列。

## 样式规范

| Size | Padding Y | 外侧 Padding X | 内侧 Padding X | 单元格内 Gap | Radius | Font Size | Line Height | Separator 高度 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| sm | `var(--padding-1)` | `var(--padding-3)` | `var(--gap-2)` | `var(--gap-1)` | `var(--radius-3)` | `var(--text-12)` | `var(--leading-12)` | `var(--size-3)` |
| md | `var(--padding-2)` | `var(--padding-4)` | `var(--gap-3)` | `calc((var(--gap-1) + var(--gap-2)) / 2)` | `var(--radius-4)` | `var(--text-14)` | `var(--leading-14)` | `var(--size-4)` |
| lg | `var(--padding-3)` | `var(--padding-5)` | `var(--gap-4)` | `var(--gap-2)` | `var(--radius-5)` | `var(--text-16)` | `var(--leading-16)` | `var(--size-5)` |

内置分割线：

- 粗细：`var(--border-1)`，即 0.5px。
- filled 变体颜色：`var(--static-white-20)`。
- 非 filled 变体颜色：`var(--black-10)`。
- 默认圆角；作为纯装饰层不输出额外 DOM，也不进入无障碍树。

## 验收覆盖

测试示例至少覆盖：

- `sm` / `md` / `lg` 三个尺寸。
- `gray` / `filled` / `outline` / `borderless` 四个变体。
- 多个 Button 单元格、默认内置分割线、每个 Button 独立 `onclick`。
- `showSeparator={false}` 关闭全部内置分割线。
- ButtonGroup `disabled` 状态。


---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引

- **ButtonGroup 组件**: [./ButtonGroup.svelte](./ButtonGroup.svelte)
- **Button 嵌入态**: [./Button.svelte](./Button.svelte)

### 关键 CSS 类

| 类名 | 描述 |
| :--- | :--- |
| `.snowui-button-group` | 根元素 |
| `.snowui-button-group-sm/md/lg` | 尺寸档 |
| `.snowui-button-group-gray/filled/outline/borderless` | 视觉变体 |
| `.snowui-button-embedded-button-group` | Button 进入 ButtonGroup 嵌入态 |

### 关联关系

- **子组件**: Button；分割线由 ButtonGroup 自有装饰层绘制
- **依赖**: Frame、ButtonGroup Context

## 更新日志 (Changelog)

### v1.2.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.2.0 (2026-08-29)

- 相邻 Button 单元格默认显示 ButtonGroup 内置分割线，新增 `showSeparator` 公开开关并默认开启。
- 旧的直系 `Separator as="separator"` 仅保留无重复显示的迁移兼容，调用方不再需要手工插入分割线。

### v1.1.0 (2026-08-19)

- 复合控件内的 Button item 默认关闭 hover 放大，保留颜色反馈，并允许实例显式重新开启。

### v1.0.1 (2026-08-16)

- 根层关闭不属于该布局模型的 Auto Layout，保证 Button hover / 点击单元格与 Separator 无布局间隙。

### v1.0.0 (2026-05-19)

#### 新功能
- 初始版本，支持 Button 嵌入态、Separator 分割线、四种变体与三种尺寸。

