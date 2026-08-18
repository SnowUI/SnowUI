# Breadcrumb (面包屑)

> **版本**: v1.1.0
> **职责**: 提供页面层级路径导航容器。
> **设计稿**: [Workshop / Breadcrumb](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12046-1772&t=nY2VC3oisn12OH01-4)

Breadcrumb 支持两种模式：

- 默认内置模式（推荐）：`items` 自动生成 Button 与 Text separator，使用 `parts.Button` / `parts.Text` 配置隐藏实例。
- 显式组合模式：直接书写 `Button as="item"` 和 `Text as="separator"`，用于复杂内容和逐项差异。
- Breadcrumb 的默认组合样式为 Button `borderless`、separator `opacity: 0.5`；常规使用无需传 parts，parts 只用于覆盖默认值。

## 功能概览

- 默认 items API + 显式组合高级 API。
- 最后一个 `as="item"` 自动作为当前页面。
- 可通过 `variant` 给内部 `Button as="item"` 提供默认 Button 变体。
- 非当前 item 默认整体透明度 40%，hover 时恢复 100%。
- item 属于同一导航复合控件，默认关闭 Button hover 放大；显式 `scaleOnHover={true}` 可按实例重新开启。
- 当前页面 item 输出 `aria-current="page"`，不可 hover、不可点击、不可键盘激活。
- separator 默认使用 `14px / 20px` 与 `black/10%`。

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| ariaLabel | `string` | `"Breadcrumb"` | 根导航区域的无障碍标签 |
| variant | `'gray' \| 'filled' \| 'outline' \| 'borderless'` | `'borderless'` | 内部 `Button as="item"` 的默认 Button 变体；parts 与子级 Button 显式 `variant` 可覆盖 |
| children | `Snippet` | - | 子内容。推荐只放 `Button as="item"` 与 `Text as="separator"` |

### 子级角色

| 角色 | 推荐写法 | 描述 |
| :--- | :--- | :--- |
| item | `<Button as="item">...</Button>` | 一个面包屑路径片段 |
| separator | `<Text as="separator">/</Text>` | 分隔符；Breadcrumb 不提供 separator prop |

SnowUI 组件使用 `as="item"` / `as="separator"`；原生元素使用 `data-as="item"` / `data-as="separator"`。

## 使用示例

### 基础用法

```svelte
<Breadcrumb>
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item">Default</Button>
</Breadcrumb>
```

### 统一 Button 变体

```svelte
<Breadcrumb variant="borderless">
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item" variant="outline">Custom</Button>
    <Text as="separator">/</Text>
    <Button as="item">Default</Button>
</Breadcrumb>
```

`Breadcrumb variant` 只作为 item Button 的默认值：未写 `variant` 的 item 使用 Breadcrumb 的 `variant`，显式写了 `variant` 的 Button 保持自己的变体。若 Breadcrumb 不写 `variant`，Button 继续使用 Button 默认变体。

### 多级路径

```svelte
<Breadcrumb>
    <Button as="item" href="/">Home</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/dashboards/default">Default</Button>
</Breadcrumb>
```

最后一个 item 会被自动标记为当前页，即使写了 `href` 也不会触发点击或跳转。

## 行为规则

1. 当前页面固定为 Breadcrumb 内最后一个 `as="item"` / `data-as="item"`。
2. 不提供 `currentIndex`，不支持指定任意一项为当前页。
3. 当前项自动设置 `aria-current="page"`、`data-current="page"`、`tabindex="-1"`。
4. 当前项不会触发 Button hover、click、Enter 或 Space。
5. separator 自动设置 `aria-hidden="true"`。
6. Breadcrumb 的 `variant` 只影响 `Button as="item"` 的默认 Button 变体，且不覆盖子级显式 `variant`。
7. Breadcrumb 为 item 提供 `scaleOnHover=false` 默认值；子级 Button 的显式值优先。

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

- Breadcrumb 根是 `nav` 容器，内部内容整体 Hug。
- 根容器使用 `inline-flex`，允许换行。
- 子级 Button 保留自身内联外壳布局。
- 子级 Text 保留自身文本流布局。
- Breadcrumb 只管理根 gap、separator 样式、非当前透明度与最后一项当前态。

布局变量链：

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-breadcrumb-row-gap` | `var(--gap-1)` | 换行时的行间距 |
| `--snowui-breadcrumb-column-gap` | `var(--gap-1)` | item 与 separator 的列间距 |
| `--snowui-breadcrumb-separator-font-size` | `var(--text-14)` | separator 字号 |
| `--snowui-breadcrumb-separator-line-height` | `var(--leading-14)` | separator 行高 |
| `--snowui-breadcrumb-separator-color` | `var(--black-10, rgba(0,0,0,0.1))` | separator 颜色 |
| `--snowui-breadcrumb-inactive-opacity` | `0.4` | 非当前 item 默认透明度 |
| `--snowui-breadcrumb-inactive-hover-opacity` | `1` | 非当前 item hover 透明度 |

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-breadcrumb` | Breadcrumb 根节点 |
| CSS 类名 | `snowui-breadcrumb-item` | 由 Breadcrumb 标记到 item 子级 |
| CSS 类名 | `snowui-breadcrumb-separator` | 由 Breadcrumb 标记到 separator 子级 |
| data 属性 | `data-as="item"` | item 角色 |
| data 属性 | `data-as="separator"` | separator 角色 |
| data 属性 | `data-current="page"` | 当前页面 item |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Breadcrumb | [Breadcrumb.svelte](./Breadcrumb.svelte) | 根容器、角色识别、当前态标记、样式 |
| Button | [Button.svelte](./Button.svelte) | item 可交互外壳；补充当前态不可交互契约 |
| Text | [Text.svelte](./Text.svelte) | separator 推荐承载组件 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| ariaLabel | `aria-label` | 透出到根 `nav` |
| variant | Breadcrumb context | 作为子级 `Button as="item"` 的默认 variant |
| children | Snippet | 原样渲染到根容器 |
| as="item" | DOM `data-as="item"` | Frame runtime 翻译；Breadcrumb action 识别 |
| as="separator" | DOM `data-as="separator"` | Frame runtime 翻译；Breadcrumb action 识别 |

### 关联关系

- **父组件**: 无
- **依赖**: Frame、Button、Text
- **规范**: [../../../specs/LayoutProtocol.md](../../../specs/LayoutProtocol.md)、[../../../specs/ComponentStyleSheet.md](../../../specs/ComponentStyleSheet.md)

---

## 更新日志 (Changelog)

### v1.1.0 (2026-08-19)

- Breadcrumb item 作为复合导航项默认关闭 Button hover 放大，并允许子 Button 显式重新开启。

### v1.0.1 (2026-08-16)

- item 的透明度与 hover overlay 过渡不再受共享样式注入顺序影响。

### v1.0.0 (2026-05-25)

#### 新功能
- 新增 Breadcrumb 组件，采用容器组合式 API。
- 支持最后一个 item 自动作为当前页面。
- 支持非当前 item 40% → hover 100% 透明度规则。
