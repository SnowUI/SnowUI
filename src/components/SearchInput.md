# SearchInput (简单搜索输入框)

## 宿主组件特化模式

- `SearchInput` 以真实 `Input` 为主要视觉与交互宿主，直接平铺 `Input` 的兼容 Props，不提供 `parts.Input`。
- Props 类型由 `ComponentProps<typeof Input>` 推导；`value`、`defaultValue`、`type`、`as`、`class` 与 `children` 由 SearchInput 接管后显式传给宿主。
- `Input` 继续拥有原生输入事件、ARIA、disabled/readonly/invalid、Frame 能力与基础视觉；SearchInput 只拥有默认搜索语义、默认搜索图标和 `borderless` 特化样式。
- 组件无额外 wrapper，真实 `Input` 仍是根宿主；事件只由该宿主触发一次。
- `Input` 自身隐藏生成的错误 `Text` 仍可通过平铺后的 `parts.Text` 配置。

> **版本**: v1.2.1
> **职责**: 提供与 `Input` 一致的 OSS 搜索输入框，默认内置 `Search`。

`SearchInput` 是 `Input` 的搜索场景变体。除默认 `type="search"` 和默认 leading 图标为 `Search` 外，其颜色、hover/focus、清除 X、三槽位布局、Frame 能力与 `Input` 保持一致。

## 功能概览

- 默认使用 `Search` 作为 leading 图标，图标来自 `@snowui-design-system/resource-svelte`
- 内置默认 `Search` 静止态为 Black/20，输入激活态为 Black/40；该颜色规则只属于 `SearchInput`
- 支持外置 leading 替换默认图标
- 清除 X、hover、focus、disabled、readonly、invalid 与默认错误 shake 等行为继承 `Input`
- 根能力通过内部 `Input` 接通 OSS `Frame`

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| type | `Input` 的 `type` | `"search"` | 原生输入类型；默认使用搜索输入 |
| value | `string \| number` | — | 当前值，支持 `bind:value` |
| defaultValue | `string \| number` | — | 初始值 |
| placeholder | `string` | — | 占位文本 |
| showSearchIcon | `boolean` | `true` | 是否渲染默认搜索图标 |
| variant | `"default" \| "borderless"` | `"default"` | 外观变体；`borderless` 移除自身边框、背景、圆角、padding 和 focus ring，在 Flex / Block 宿主中填满可用空间，并在 shrink-to-fit 宿主中保持稳定固有宽度，适合嵌入已有表面的工具栏或面板 |
| as | `"search" \| string` | `"search"` | 角色关键字;默认透传给内部 `Input`,使 SearchInput 放入 `<Popover>` / `<Listbox>` 时自动移入固定 header,行为与 `<Input as="search">` 一致。可显式覆盖。 |
| children | `Snippet` | — | 外置 leading / trailing / 其他 Input 子内容 |
| 其余兼容 Props | `ComponentProps<typeof Input>` | 同 Input | 平铺至真实 Input 宿主；包括 size、style、disabled、readonly、invalid、事件、ARIA、Frame Props 与 `parts.Text` |

### 浮层场景

`SearchInput` 默认 `as="search"`。放入 `<Popover>` / `<Listbox>` 内时,内部 Input 通过 `LISTBOX_HEADER_PORTAL_KEY` context 自动移入浮层 header(紧凑样式 + 无 focus 外环 + 不参与下方滚动)。Listbox 场景下因 SearchInput 不接管过滤,如需 Listbox 过滤逻辑请直接使用 `<Input as="search">`。

### 使用示例

```svelte
<SearchInput placeholder="Search" />
```

```svelte
<!-- 外层容器已经提供完整表面时，显式使用无边框版本 -->
<SearchInput variant="borderless" placeholder="Search" />
```

```svelte
<SearchInput placeholder="Search">
  <Icon as="leading"><SearchIcon2 /></Icon>
</SearchInput>
```


> 此区域的内容受保护。AI 在修改此区域前必须请求用户审查。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 布局模型

主布局模型：**槽位宿主布局**。定义见 `../../../specs/LayoutProtocol.md`。

`SearchInput` 直接复用 `Input` 的 Leading / Control / Trailing 三槽位结构。默认 `Search` 作为 leading 子项传入 `Input`，外部提供同角色 leading 时通过 CSS 隐藏默认图标。

### 样式数值

样式数值登记在 `../../../specs/ComponentStyleSheet.md`。`SearchInput` 默认与 `Input 标准` 保持一致，不另建通用颜色体系；内置默认 `Search` 作为搜索输入的专属视觉，静止态使用 Black/20，`:focus-within` 激活态使用 Black/40。该规则限定在 `.snowui-input.snowui-search-input .snowui-search-input-default-icon`，不影响通用 `Icon` 或外置 leading。

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-search-input` | 根部附加类名 |
| 默认图标类名 | `snowui-search-input-default-icon` | 默认 Search 包裹节点 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| SearchInput | [SearchInput.svelte](./SearchInput.svelte) | 主组件 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| showSearchIcon | 条件渲染 | `false` 时不渲染默认 Search |
| variant | 根 class | `borderless` 由 SearchInput 自己移除边框、背景、圆角、padding 和 focus ring；以 `flex: 1 1 0; width: auto; max-width: 100%` 填满确定容器的可用空间，并避免 shrink-to-fit 宿主因输入状态重算百分比宽度；父容器不得通过后代选择器改写这些视觉或布局 |
| children | 透传到 Input | 用于外置 leading/trailing 或其他组合内容 |

### 关联关系

- **依赖**: Input、Icon、Search
- **包归属**: OSS

---

## 更新日志 (Changelog)

### v1.2.1 (2026-07-05)

- 修复 `borderless` 在 shrink-to-fit 宿主中输入内容时宽度变化：以 `width: auto; max-width: 100%` 取代循环参与固有尺寸计算的百分比宽度，Flex / Block 宿主中的填充行为保持不变。
- `borderless` 有值时保持 Input control 原网格列，使预留的清除按钮列始终参与固有宽度计算；control 同时延伸覆盖 gap 与 X 列，维持文字贴近 X 的原有叠层和渐隐效果。

### v1.2.0 (2026-07-05)

- 改为 Input 宿主组件特化模式：兼容 Props 从 Input 类型推导并平铺，移除 `parts.Input`；DOM 与样式保持不变。

### v1.1.0 (2026-06-20)

- 新增 `variant="borderless"`，供 Toolbar、面板等已有表面的容器显式使用；组件默认填满剩余宽度，内部内容保持垂直居中。

### v1.0.1 (2026-05-09)

#### 调整

- SearchInput 内置默认 `Search` 在激活态变为 Black/40；样式限定在 SearchInput 组件内，不影响通用 Icon 样式。

### v1.0.0 (2026-05-08)

#### 新功能

- 新增简单搜索输入框，默认内置 `Search`，其余行为继承 `Input`。
