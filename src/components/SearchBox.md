# SearchBox (搜索框触发器)

> **版本**: v1.0.3
> **职责**: 提供 PRO 搜索入口触发器；点击整个搜索框打开搜索浮层。

`SearchBox` 是搜索浮层的触发器，交互类似 `Select`。它不是原生输入框，整个组件都是可点击区域；视觉颜色、hover、focus、清除 X、内部布局参考 `Input`，并通过 `FramePro` 接通 PRO Frame 能力。

## 功能概览

- 两种样式：`gray` 与 `outline`
- 默认 leading 图标为 `Search`
- 外置 `Kbd` 由使用者通过 children 放入 trailing，不默认集成
- 有值时显示清除 X，视觉规则参考 `Input`
- 点击整块触发器打开浮层
- 不显示焦点外圈；鼠标点击、Escape 等键盘操作后的视觉状态一致

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| variant | `"gray" \| "outline"` | `"gray"` | 搜索框样式 |
| value | `string \| number` | — | 当前搜索文本或展示值 |
| placeholder | `string` | `"Search"` | 占位文本 |
| open | `boolean` | — | 浮层打开状态，支持 `bind:open` |
| disabled | `boolean` | `false` | 禁用触发器 |
| readonly | `boolean` | `false` | 只读触发器，不响应打开 |
| showSearchIcon | `boolean` | `true` | 是否渲染默认搜索图标 |
| clearable | `boolean` | `true` | 有值时是否显示清除按钮 |
| children | `Snippet` | — | 外置 leading/trailing，如 `Kbd` |
| onOpenChange | `(open: boolean) => void` | — | 打开状态变化回调 |
| onClear | `() => void` | — | 清除回调 |

### 使用示例

```svelte
<SearchBox placeholder="Search">
  <Kbd as="trailing">/</Kbd>
</SearchBox>
```

```svelte
<SearchBox variant="outline" bind:open>
  <Kbd as="trailing">⌘K</Kbd>
</SearchBox>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 布局模型

主布局模型：**槽位宿主布局**。定义见 `../../../specs/LayoutProtocol.md`。

`SearchBox` 使用 `FramePro row` 固定启用自动布局协议：

- Leading：默认 `Search`，或外部 `data-as="leading"` 替换。
- Content：文本内容，Fill，`min-width: 0`。
- Trailing：外置 `Kbd` 或内建清除 X。

### 样式数值

样式数值登记在 `../../../specs/ComponentStyleSheet.md`。

默认触发器数值来自 Figma：

- padding-y: 4px
- padding-x: 8px
- gap: 8px
- radius: 16px
- icon: 16px
- text: 14px / 20px

颜色与状态参考 `Input` / `Field` CSS 行为，但 `SearchBox` 是搜索浮层触发器，不是文本输入框，因此不显示 Field focus ring，也屏蔽全局 `focus-visible` outline；点击后、按 Escape 关闭后都应保持无焦点外圈。

### Frame 能力

根节点使用 `FramePro`，必须显式传入：

- `enableResponsive`
- `enableContext`
- `enableScaleObserver`

`...rest` 透传到根 `FramePro`，保留状态、动效、Skeleton、响应式、样式编排等 PRO 能力。

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| SearchBox | [SearchBox.svelte](./SearchBox.svelte) | 搜索触发器 |

### 关联关系

- **依赖**: FramePro、Icon、Search
- **协作组件**: SearchPopup、Kbd
- **包归属**: PRO

---

## 更新日志 (Changelog)

### v1.0.3 (2026-05-09)

#### 修复

- 屏蔽 SearchBox 根节点的全局 `focus-visible` outline，避免点击打开后按 Escape 重新出现灰色焦点外圈。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增 PRO 搜索框触发器，支持灰底和边框样式。
