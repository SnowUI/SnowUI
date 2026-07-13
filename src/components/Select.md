# Select.svelte 文档

## 默认内置模式 / 显式组合模式

- 默认内置模式（推荐）：传入 `options`，Select 自动生成 Listbox 与 MenuItem；搜索框默认关闭，通过 `parts.Listbox.search=true` 开启；通过 `parts.Button`、`parts.Listbox`、`parts.Input`、`parts.MenuItem` 配置隐藏实例。
- 显式组合模式：显式书写 Listbox / Input / MenuItem，用于复杂内容或逐项差异；子组件 Props 直接写在实例上。
- 显式 children 存在时替换默认内置 Listbox，不同时激活两套选项。

Select 内的 Listbox 默认 `search=false`。显式组合时使用 `<Listbox search>` 开启；默认内置模式使用 `parts={{ Listbox: { search: true } }}` 开启。独立 Listbox 的默认值不受影响。

```svelte
<Select
    options={[{ value: "a", label: "A" }]}
/>
```

> **版本**: v3.2.1
> **职责**: 自定义下拉选择组件；默认根据 options 内置 Listbox / MenuItem，高级场景支持显式组合，两种模式共用 `ListboxOwnerContext`。

`buttonTrigger` 可将字段型 trigger 切换为真正的 bare `Button`；优先使用 `triggerContent` snippet，未提供时依次回退到选中项、`placeholder`、`ariaLabel`。适合 TableToolbar 的排序、筛选等图标操作。按钮保持 `aria-haspopup="listbox"`、`aria-expanded`、键盘导航和选中后焦点恢复。

**2026-04-20 更新**: 新增搜索 + 自定义值支持 — `filterText` / `customOptions` 状态由 Select 持有，内嵌 `<Input as="search">` 可连接过滤逻辑；`allowCustomValue` prop 允许用户添加自定义选项。`Combobox` 已废弃。

**2026-04-18 架构升级**: Select v3.0.0 — Listbox 拆分为独立组件，API 从 `<option>` 切换到 `<Listbox>` + `<MenuItem>` 组合模式，表单提交改用 hidden `<input>`，不再依赖隐藏 `<select>` + MutationObserver。

**2026-04-04 补充**: 参考 Figma `9996:17631`，`Select` 单独使用时默认保持 `12 / 16` padding 与 `8px` gap；进入 `Field` 后，只看有没有 `as="segment"`。未标 `segment` 时由外层 `Field` 处理 `12 / 16` 与 `gap = 8`，`Select` 去掉自身 padding，但保留自身 gap；标了 `segment` 时保留 `Select` 自身的 padding 与 gap，并作为连续字段表面的一段参与分割线。

**继承**: 复用 Frame.svelte 的所有通用能力（状态、动效、响应式、Skeleton、样式编排）。
**推荐容器**: `Field.svelte`。
**默认能力开关**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`。
**自动布局协议**: Select 根元素为 `<Frame row>`，trigger（content/fill）+ indicator（trailing/hug）由自动布局协议管理。

**2026-04-27 更新**: Select v3.1.0 — 支持直系复杂 `leading` / `trailing` 槽位；自定义 trailing 替换默认 indicator。

## 2026-04-27 v3.1.0 复杂槽位规则

- 直系 `Frame as="leading" row` / `Frame as="trailing" row` 支持复杂结构。
- Select 根布局为 `leading: auto`、`trigger: minmax(0, 1fr)`、`trailing: auto`。
- 存在自定义直系 `as="trailing"` 时，默认 indicator 隐藏，由自定义 trailing 替换末位槽。

### 复杂槽位变更（v3.1.0，2026-04-27）

- 支持直系复杂 `leading` / `trailing` 槽位。
- 自定义 trailing 替换默认 indicator。

## 2026-04-04 表单样式规则

- 基础节奏统一：`Field` 默认 `padding = 12 / 16`，`gap = 8`
- `Select` 单独使用时：组件自身带 `12 / 16` padding 和 `8` gap
- 放进 `Field` 后，先看有没有 `as="segment"`
- 没有 `as="segment"`：由外层 `Field` 负责 `12 / 16` padding 与 `8` gap；`Select` 去掉自身 padding，但保留自身 gap
- 有 `as="segment"`：这是连续字段表面的一段；保留 `Select` 自身的 padding 与 gap
- `segment` 之间才有分割线：横向是左右分割线，纵向是上下分割线
- 相邻 `segment` 之间只能有一条分割线，不能重复画线
- `label / description / error` 不负责 padding、gap、分割线，它们只是内容元素
- 普通 `label + host + error`：不作为 padding、gap 的判断依据，只负责文字内容
- `Field row` 或 `Field column` 里，如果是连续输入段，子项要显式写 `as="segment"`

## 组件定位

`Select` 是自定义下拉选择框，采用 **Trigger + Listbox 组合架构**：

- 自身渲染 Trigger 按钮 + `ArrowLineUpDown` 指示器
- 子内容为 `<Listbox>` + `<MenuItem>` 组合，Listbox 自行 portal 到 body
- 通过 `ListboxOwnerContext`（setContext）与子组件通信
- 表单提交通过 hidden `<input type="hidden">` 桥接
- 标签、错误提示与连续字段段逻辑建议通过 `Field` 容器组合完成
- 单独使用时可保持兼容性的默认输入框表现

### 架构图

```
Select (Frame row)
├── <input type="hidden">        ← 表单提交
├── <button role="combobox">    ← Trigger（content/fill）
│   └── <span>选中值/placeholder</span>
├── <Icon as="trailing">        ← 指示器（trailing/hug）
│   └── ArrowLineUpDown
└── children slot
    └── <Listbox>                  ← portal 到 body
        ├── <Input as="search">   ← 可选搜索框
        ├── <MenuItem value="a">A</MenuItem>
        └── <MenuItem value="b">B</MenuItem>
```
        └── <MenuItem value="b">B</MenuItem>
```

## Frame 能力继承

`Select` 仍然通过外层 `Frame` 继承：

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

因此 `Select` 不是一个单纯的裸 `<select>`，而是 `Frame + 原生 select host`。

## 组件特有属性 (Component-Specific Props)

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| value | `string \| number` | - | 当前值，支持 `bind:value` |
| defaultValue | `string \| number` | - | 初始值 |
| placeholder | `string` | - | 空值占位文字，显示在 Trigger 中 |
| name | `string` | - | 表单提交字段名 |
| disabled | `boolean` | `false` | 禁用状态 |
| readonly | `boolean` | `false` | 只读状态 |
| required | `boolean` | `false` | 必填状态 |
| invalid | `boolean` | `false` | 组件级无效态 |
| form | `string` | - | 指定外部表单归属 |
| autofocus | `boolean` | `false` | 首次渲染自动聚焦 |
| tabindex | `number` | - | Tab 顺序 |
| title | `string` | - | 原生提示 |
| id | `string` | - | 原生 id |
| children | `Snippet` | - | `<Listbox>` + `<MenuItem>` 组合内容 |
| onclick / oninput / onchange / onfocus / onblur / onkeydown / onkeyup | `function` | - | 事件回调 |

## 宿主协议

`Select` 同样遵循 `Field` 容器协议：

- 独立使用时保留兼容性的字段外壳
- 进入 `Field` 后退化为 `.snowui-field-host`
- 默认箭头由 `Select` 自己负责渲染
- 直系 `as="leading"` / `as="trailing"` 支持复杂结构；`leading` 为 Hug，trigger 为 Fill，`trailing` 为 Hug
- 存在自定义直系 `as="trailing"` 时，默认箭头 indicator 被隐藏，自定义 trailing 替换默认 trailing 槽
- 标签、错误提示与容器外壳继续交给 `Field`
- 未标 `segment` 时，`Select` 去掉自身 padding（由外层 `Field` 统一负责 `12 / 16` padding 与 `8` gap），但保留自身 gap
- 标了 `segment` 时，保留 `Select` 自身的 padding 与 gap，作为连续字段表面的一段

这意味着常规下拉场景不再需要额外手写 trailing `Icon`。

### 错误反馈 Shake

`Select invalid / aria-invalid` 默认自动播放错误 shake。单独使用时由 `Select` 自身反馈；进入 `Field` 后，嵌入态 `Select` 不单独抖动，由外层 `Field` 汇总后整体反馈。

错误态与 shake 不会自动聚焦，也不会模拟 `focus-within`；焦点态只来自用户真实聚焦、显式 `autofocus` 或业务代码主动调用 `focus()`。

## 布局模型

主布局模型：**槽位宿主布局**。定义见 [../../../specs/LayoutProtocol.md §12.3](../../../specs/LayoutProtocol.md)。

Select 的根布局固定按 Leading / Trigger / Trailing 三段组织：

- 根节点是 `Frame row`，并在组件内部固定启用 `enableAutoLayout`；外部传入 `enableAutoLayout={false}` 不关闭 Select 的内部槽位协议。
- trigger 是 Content / Fill 槽，负责显示选中值或 placeholder，必须保持 `min-width: 0` 与文本截断能力。
- 默认 indicator 是 Trailing / Hug 槽。
- 存在直系自定义 `as="trailing"` 时，默认 indicator 隐藏，由自定义 trailing 替换末位槽。
- Listbox / MenuItem 是 Select 的弹层内容协议，不参与 Select 根三槽位布局。

## 关键字 (Keyword)

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| value | `string \| number` | - | 当前值，支持 `bind:value` |
| defaultValue | `string \| number` | - | 初始值 |
| placeholder | `string` | - | 空值占位文字 |
| disabled | `boolean` | `false` | 禁用态 |
| readonly | `boolean` | `false` | 只读态 |
| required | `boolean` | `false` | 必填态 |
| invalid | `boolean` | `false` | 组件级无效态 |
| name | `string` | - | 表单字段名 |
| form | `string` | - | 指定外部表单归属 |
| autofocus | `boolean` | `false` | 首次渲染自动聚焦 |
| tabindex | `number` | - | Tab 顺序 |
| title | `string` | - | 原生提示 |
| id | `string` | - | 原生 id |
| children | `Snippet` | - | `<Listbox>` + `<MenuItem>` 组合内容 |

## 能力边界

`Select` 负责：

- 单选下拉选择（Trigger + Listbox 组合架构）
- `value / defaultValue` 解析
- ARIA combobox + listbox 完整语义
- 键盘导航（↑↓ / Enter / Space / Escape / Tab）
- 通过 hidden `<input>` 桥接表单提交
- 通过 `ListboxOwnerContext` 驱动子 Listbox / MenuItem
- 持有 `filterText` 与 `filteredOptions` 状态，为内嵌 `Input as="search"` 提供过滤能力
- 持有 `customOptions` 列表，支持用户在运行时添加 / 删除自定义选项

`Select` 不负责：

- 业务级选项获取与远程联想
- 多选模式（未来可扩展）

## 使用示例

```svelte
<!-- 推荐：放入 Field -->
<Field>
  <Select placeholder="请选择状态">
    <Listbox>
      <MenuItem value="todo">待处理</MenuItem>
      <MenuItem value="doing">处理中</MenuItem>
      <MenuItem value="done">已完成</MenuItem>
    </Listbox>
  </Select>
</Field>

<!-- 带搜索过滤 -->
<Select placeholder="请选择城市">
  <Listbox>
    <Input as="search" placeholder="搜索..." />
    <MenuItem value="beijing">北京</MenuItem>
    <MenuItem value="shanghai">上海</MenuItem>
    <MenuItem value="hangzhou">杭州</MenuItem>
  </Listbox>
</Select>

<!-- 搜索 + 自定义输入 -->
<Select placeholder="请选择或输入">
  <Listbox>
    <Input as="search" allowCustomValue placeholder="搜索或输入新选项..." />
    <MenuItem value="tag-a">Tag A</MenuItem>
    <MenuItem value="tag-b">Tag B</MenuItem>
  </Listbox>
</Select>

<!-- 表单提交 -->
<Select name="priority" required placeholder="请选择优先级">
  <Listbox>
    <MenuItem value="low">低</MenuItem>
    <MenuItem value="medium">中</MenuItem>
    <MenuItem value="high">高</MenuItem>
  </Listbox>
</Select>

<!-- 复杂 leading / trailing；自定义 trailing 替换默认箭头 -->
<Select placeholder="Tags">
  <Frame as="leading" row>
    <Icon icon={Resource.Tag} />
    <span>Tags</span>
  </Frame>
  <Frame as="trailing" row>
    <span class="text-black-40">Multi-Select</span>
    <Icon icon={Resource.CaretRight} class="text-black-20" />
  </Frame>
  <Listbox>
    <MenuItem value="design">Design</MenuItem>
    <MenuItem value="code">Code</MenuItem>
  </Listbox>
</Select>
```

## 与通用逻辑的关系

`Select` 复用了：

- [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- [../context.ts](../context.ts)

因此它和 `Input / Textarea` 共享同一套宿主分发、值同步和字段上下文协议。

## 样式规范 (Style Spec)

### 1. 基础几何

| 项目 | 值 |
| :--- | :--- |
| 圆角 | `var(--radius-4)` |
| 左右内边距 | `var(--padding-4)` |
| 上下内边距 | `var(--padding-3)` |
| 默认间距 | `var(--gap-2)` |
| 字号 | `var(--text-14)` |
| 行高 | `var(--leading-14)` |
| 默认背景 | `var(--surface-1)` |
| 默认边框 | `inset 0 0 0 var(--border-1) var(--black-20)` |
| 焦点态 | 仅保留内边框焦点色；Select 暂不显示 Field 通用外围焦点环，源码中保留注释便于恢复 |
| placeholder 颜色 | `var(--black-20)` |

### 2. segment 嵌入态几何规范

| 项目 | 值 |
| :--- | :--- |
| 外层 div padding | `var(--snowui-select-padding-override, var(--padding-3) var(--padding-4))`，由 Field 在 segment 宿主模式下注入 `12px / 16px` |
| 内层 select control padding | `0`（统一由外层 div 负责 padding） |
| 行高 | `var(--leading-14, 20px)` |
| placeholder 颜色 | `var(--black-20, rgba(0,0,0,0.2))` |

### 3. 下拉箭头（Indicator）规范

| 项目 | 值 |
| :--- | :--- |
| 图标 | `ArrowLineUpDown` |
| 尺寸 | `var(--size-4, 16px)` |
| 颜色 | `var(--black-40, rgba(0,0,0,0.4))` |
| 位置 | 内容行最右侧，与文本同行垂直居中 |
| padding | `0` |

**箭头交互状态规范：**

- Indicator 仅有 **hover 状态**（颜色加深至 `var(--black-100)`）
- **无点击态 / 打开态视觉变化**：下拉打开后箭头不旋转，不反映当前开关状态
- 保持静止有助于减少视觉噪声，用户通过 Listbox 的展开 / 收起感知下拉状态
- 自定义直系 `as="trailing"` 存在时，Indicator `display: none`，由自定义 trailing 承接末位槽

### 4. Listbox（Quick Action）样式规范

Listbox 浮层遵循 **Quick Action 通用样式规范**，与 Popover / ContextMenu 等浮动操作层共用同一套 CSS 变量。

| 项目 | 值 | CSS 变量 |
| :--- | :--- | :--- |
| 背景 | `rgba(255, 255, 255, 0.9)` / `Background/3` | `var(--snowui-background-quick-action)` |
| 圆角 | `16px` | `var(--radius-4)` |
| 内边距 | `8px` | `var(--padding-2)` |
| 阴影 | 参见 `../../../specs/StyleGuide.md` Quick Action 浮层风格规范 | `var(--snowui-shadow-quick-action)` |
| 边框 | `none` | `var(--snowui-border-quick-action)` |
| 毛玻璃模糊 | `blur(40px)` | `var(--snowui-backdrop-quick-action)` |
| 选项圆角 | `12px` | `var(--radius-3)` |
| 选项内边距 | `8px`（四周等距） | `var(--padding-2)` |
| 选项 hover | `rgba(0,0,0,0.04)` | `var(--black-4)` |

**Quick Action 变量定义位置**：`components/src/styles/layout.css` 中 `--snowui-shadow-quick-action` 等变量定义于 `:where(html)`，组件直接引用，不使用 `.shadow-glass-2` utility 类。

#### Listbox 动效规范

| 场景 | 动效 | 规格 |
| :--- | :--- | :--- |
| 展开（enter） | 淡入 | `opacity 0 → 1`，`150ms ease-out` |
| 收起（exit） | 淡出 | `opacity 1 → 0`，`100ms ease-out` |

> **规范来源**：此淡入淡出交互作为 Quick Action 类元素的标准动效，与 Frame 浮层类默认动效保持一致。不使用 `scaleY` 形变，避免视觉重心漂移。

#### Listbox 宽度规范

- **在 Field 内使用时**：Listbox 宽度与父级 `Field` 容器等宽（取 `.snowui-field` 的 `getBoundingClientRect().width`）
- **独立使用时**：Listbox 宽度与 `.snowui-select` 自身等宽
- 宽度通过 JS 计算后以 `inline style` 注入，不依赖 CSS 继承

#### Listbox 定位规范（下方/上方 + 智能翻转）

Listbox 使用 `position: fixed` portal 到 `document.body`，定位逻辑参考 shadcn-ui 基于 floating-ui 的实现方式：

| 属性 | 规则 |
| :--- | :--- |
| 水平位置 | `left` = 锚点（Field 或 Select）的 `getBoundingClientRect().left` |
| **垂直基准** | 以 **Trigger 按钮**（`.snowui-select-trigger`）的 `getBoundingClientRect()` 作为垂直中心基准，避免 Field 含 label 时中心偏移 |
| **展开方向** | Listbox 显示在 Trigger 下方或上方，不覆盖；与 Trigger 保持 `4px` 间距（参考 shadcn-ui `translate-y-1`） |
| 最大高度 | 由可用空间动态计算，最大不超过 `256px`，预留 `8px` 视口安全边距 |

**智能翻转逻辑**（以 triggerRect 为基准）：

```
spaceBelow = window.innerHeight - triggerRect.bottom - 8px
spaceAbove = triggerRect.top - 8px

if (spaceBelow >= 120px 或 spaceBelow >= spaceAbove):
    向下展开：top = triggerRect.bottom + 4px
else:
    向上展开：bottom = window.innerHeight - triggerRect.top + 4px
```

**对齐项规则**（选中项与 Trigger 中心对齐）：

| 场景 | 对齐目标 |
| :--- | :--- |
| 有选中值 | 选中项（`aria-selected="true"`）中心与 Trigger 中心对齐 |
| 无选中值（Placeholder 态） | 中间项：`Math.floor((选项总数 - 1) / 2)` 的选项与 Trigger 中心对齐 |

- Listbox 携带 `data-placement="bottom"` 或 `data-placement="top"` 以供 CSS / 消费者区分
- 每次打开前重新计算，确保动态布局（滚动、resize）后位置仍然正确

#### Listbox 选项内部布局（自动布局协议）

Listbox 选项采用 LayoutProtocol 水平自动布局（Row），展现左侧文字——右侧选中标记的两槽分局：

| 槽位 | 内容 | 尺寸策略 |
| :--- | :--- | :--- |
| Content（中间） | 选项文字 | Fill（`flex: 1 1 0`），超出省略 |
| Trailing | 选中标记（✓）图标 | Hug（`flex: 0 0 auto`） |

- 选中标记图标始终占展位置以保持布局稳定（未选中时 `opacity: 0`，选中时 `opacity: 1`）
- 模式参考 shadcn-ui `SelectItem`：`ItemIndicator` 控制可见性，布局不因选中状态变化而位移

#### Listbox 选中态规范

选中态**不再使用灰色背景**，改为右侧选中标记（✓）表示，对齐 shadcn-ui 和 macOS系统 Picker 读取模式。

| 状态 | 规则 |
| :--- | :--- |
| 未选中 | 选中标记 SVG `opacity: 0`，无背景色，文字颜色正常 |
| 选中态 | 文字颜色 `var(--black-100)`，选中标记 `opacity: 1`，颜色 `var(--black-60)` |
| hover / active | 背景色 `var(--black-4)`（选中态与非选中态同步 hover） |
| 禁用 | `opacity: 0.4`，点击无效 |

选中标记图标内置于组件内（Built-in），使用 Check 图标（Phosphor Icons regular 样式，16×16px）的 SVG 路径，不依赖外部 icon 库导入。

### 5. Placeholder 行为规范

> **参考依据**：Apple HIG 和 Google Material Design 均不推荐将 placeholder 作为下拉列表的第一个可选项。
> - **Apple**（Pop-up Buttons）：推荐"始终预设有意义的默认值"，未选择时显示开发者指定的默认项，不使用 "请选择..." 占位选项。
> - **Google**（Exposed Dropdown / Outlined TextField）：使用浮动 label 表示空状态，下拉列表中只展示真实选项，无占位条目。

| 场景 | 规则 |
| :--- | :--- |
| `placeholder` 在 Trigger 中 | 当无选中值时，Trigger 显示 placeholder 文字作为空状态提示 |
| `placeholder` 在 Listbox 中 | **永远不在 Listbox 中显示 placeholder 条目**，无论 `required` 状态如何 |
| 可选字段（`required=false`）需要"取消选择" | 应由业务层显式在 `children` 中添加代表"无"的真实 `<option>`（如 `value=""` + 标签"无"），不依赖 placeholder |

### 6. 外部 Icon 规范

参考 Figma `10379-18362`。Select（Listbox 实现）在 segment 和非 segment 模式下均支持 leading/trailing icon。图标尺寸不在组件层约束，由 Icon 组件自身默认尺寸决定。

#### segment 模式（Select 直接子项）

Select 有 `as="segment"` 时自持 `padding: 12px 16px`，icon 作为 Select 的直接子项。

| 项目 | Leading | Trailing |
| :--- | :--- | :--- |
| prop | `as="leading"` | `as="trailing"` |
| 到外边框距离 | **16px**（`Select padding-left`） | **16px**（`Select padding-right`） |
| 默认颜色 | `var(--black-20, rgba(0,0,0,0.2))`（CSS 显式，与 placeholder 同色） | `currentColor`（跟随选中值颜色） |
| ⚠️ trailing 与 Indicator | — | trailing 存在时，Indicator（`ArrowLineUpDown`）被 CSS 自动隐藏 |

**内部 grid 布局（CSS 自动切换）：**

| 图标配置 | `grid-template-columns` |
| :--- | :--- |
| 仅 leading | `auto 1fr` |
| 仅 trailing | `1fr auto` |
| leading + trailing | `auto 1fr auto` |

#### 非 segment 模式（Field 级）

当 Select 未标记 `as="segment"` 时，可在 Field 级添加 leading / trailing icon，16px 距离由 Field 的 `padding: 12px 16px` 保障。trailing 存在时 Select 的内建 `ArrowLineUpDown` 被 CSS 自动隐藏。

| 项目 | Leading | Trailing |
| :--- | :--- | :--- |
| prop | `as="leading"`（Field 直接子项） | `as="trailing"`（Field 直接子项） |
| 到外边框距离 | **16px**（`Field padding-left`） | **16px**（`Field padding-right`） |
| 默认颜色 | `var(--black-40)` — Field CSS 自动注入 | `var(--black-40)` — Field CSS 自动注入 |

用法示例：
```svelte
<!-- segment 模式 + leading -->
<Field row>
    <Select as="segment" name="type">
        <Icon as="leading"><Tag /></Icon>
        <Listbox>
            <MenuItem value="a">Option A</MenuItem>
        </Listbox>
    </Select>
</Field>

<!-- 非 segment 模式 + Field 级 leading -->
<Field>
    <Icon as="leading"><SomeIcon /></Icon>
    <Select name="country">
        <Listbox>
            <MenuItem value="us">United States</MenuItem>
        </Listbox>
    </Select>
</Field>
```

## 无障碍与表单建议

- Trigger 使用 `role="combobox"` + `aria-haspopup="listbox"` + `aria-expanded` + `aria-controls`
- Listbox 使用 `role="listbox"`，每个选项 `role="option"` + `aria-selected`
- 键盘导航完整支持：↑↓ 移动焦点，Enter/Space 确认，Escape 关闭，Tab 关闭
- 如果需要错误提示，建议通过 `aria-describedby` 关联 `Field` 内错误节点
- 如果需要搜索型下拉或异步联想，应使用 `Combobox` 组件

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **Select 组件**: [./Select.svelte](./Select.svelte)

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **子组件**: [Listbox.svelte](./Listbox.svelte)、[MenuItem.svelte](./MenuItem.svelte)
- **共享逻辑**: [../logic/frame-field-control.ts](../logic/frame-field-control.ts)
- **Props 分发**: [../logic/frame-prop-filter.ts](../logic/frame-prop-filter.ts)
- **字段上下文**: [../context.ts](../context.ts) — `ListboxOwnerContext`
- **Context Key**: [../keys.ts](../keys.ts) — `LISTBOX_OWNER_CONTEXT_KEY`
- **关联规范**: [../../../specs/HTMLSpec.md](../../../specs/HTMLSpec.md)
- **自动布局协议**: [../../../specs/LayoutProtocol.md](../../../specs/LayoutProtocol.md)

---

## 更新日志 (Changelog)

### v3.2.1 (2026-07-05)

- `buttonTrigger` 未提供 `triggerContent` 时依次回退到选中项、placeholder、ariaLabel，避免生成不可见的空 Button。
- Button trigger 补齐 trigger id，恢复 Listbox 的 `aria-labelledby` 关联。

### v3.2.0 (2026-07-02)

- 内置下拉指示图标改为 `ResourceIcon name="arrow-line-up-down"`，跟随 resource-svelte 图标库切换。
- 保持直系 trailing 槽位协议；自定义 trailing 继续替换默认指示图标。

- **Select-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v3.0.0 (2026-04-18)

#### 架构升级
- **SEL-Break.1** Listbox 拆分为独立组件（Listbox.svelte + MenuItem.svelte）
- **SEL-Break.2** API 从 `<option>` children 切换到 `<Listbox>` + `<MenuItem>` 组合模式
- **SEL-Break.3** 表单提交改用 hidden `<input type="hidden">`，移除隐藏 `<select>` + MutationObserver
- **SEL-Break.4** 通过 `ListboxOwnerContext`（setContext）驱动子组件通信
- **SEL-Break.5** 移除 `multiple`、`nativeSize`、`autocomplete` 属性
- **SEL-Feat.2** 新增 `readonly` 属性

### v2.0.0 (2026-04-13)

#### 架构升级
- **SEL-Feat.1** 从原生 `<select>` 升级到完全自定义架构（Trigger button + fixed Listbox）

### v1.0.0 (2026-03-15)

#### 新功能
- **SEL-Feat.0** 新增基于 `Frame` 的原生下拉选择组件
