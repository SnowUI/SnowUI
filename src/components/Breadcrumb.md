# Breadcrumb

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；全部组件使用统一运行包，源码权益以许可为准。

> **版本**: v1.2.0
> **职责**: 展示当前页面的层级路径，帮助用户理解所在位置并返回上级页面。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

展示当前页面的层级路径，帮助用户理解所在位置并返回上级页面。

## 使用选择

<!-- usage-guide:start -->
用于表达当前页面的层级路径。平级内容切换用 Tab，应用导航用 Sidebar；路由跳转由页面处理。

- items 生成路径，最后一项自动成为不可交互的当前页。
- 显式 children 使用 `Button as="item"` 与 `Text as="separator"`，会替换 items；parts 仅配置默认生成的内容。
- 根导航默认名称随LocaleProvider更新，显式ariaLabel优先；路径文字与业务内容保持调用方原文。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Breadcrumb } from '@snowui-design-system/components';
</script>

<Breadcrumb
	ariaLabel="SnowUI component page path"
	items={[
		{ label: 'Components' },
		{ label: 'Navigation' },
		{ label: 'Breadcrumb' }
	]}
/>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| ariaLabel | `string` | `locale 文案` | 根导航区域的无障碍标签；省略时随LocaleProvider更新，显式ariaLabel优先 |
| gap | `number` | — | 继承 Frame 的间距 token 索引，设置路径元素的首选行／列间距；省略保留原首选值，有效间距至少为 4 CSS px，显式零与根字号／间距缩放不压低下限；更大首选间距及根容器原换行合同保留。 |
| variant | `BreadcrumbVariant` | `"borderless"` | 内部 `Button as="item"` 的默认 Button 变体；parts 与子级 Button 显式 `variant` 可覆盖 |
| children | `Snippet` | — | 显式声明 Button as="item" 与 Text as="separator"，替换内建 items 与 separator；最后一个 item 仍自动成为当前页。 |
| items | `BreadcrumbItem[]` | `[]` | 内建路径数据，每项含 label、可选 href/disabled；自动生成 Button 与分隔 Text，最后一项为不可交互的当前页。children 存在时忽略此数组。 |
| separator | `string` | `"/"` | 内建路径项之间的分隔文字；仅在 items 模式使用，显式组合时自行声明 as="separator"。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text }>` | — | 配置 items 模式生成的 Button 与分隔 Text；不作用于显式 children，当前页及角色语义仍由 Breadcrumb 接管。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="功能概览"></a>

### 功能概览

- 默认 items API + 显式组合高级 API。
- 最后一个 `as="item"` 自动作为当前页面。
- 可通过 `variant` 给内部 `Button as="item"` 提供默认 Button 变体。
- 非当前 item 默认整体透明度 40%，hover 时恢复 100%。
- item 属于同一导航复合控件，默认关闭 Button hover 放大；显式 `scaleOnHover={true}` 可按实例重新开启。
- 当前页面 item 输出 `aria-current="page"`，不可 hover、不可点击、不可键盘激活。
- separator 默认使用 `14px / 20px` 与 `black/10%`。

---

<a id="api-参考"></a>




### 子级角色

| 角色 | 推荐写法 | 描述 |
| :--- | :--- | :--- |
| item | `<Button as="item">...</Button>` | 一个面包屑路径片段 |
| separator | `<Text as="separator">/</Text>` | 分隔符；显式组合自行声明，默认 items 模式可用 separator prop |

SnowUI 组件使用 `as="item"` / `as="separator"`；原生元素使用 `data-as="item"` / `data-as="separator"`。

<a id="使用示例"></a>


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

<a id="行为规则"></a>

### 行为规则

1. 当前页面固定为 Breadcrumb 内最后一个 `as="item"` / `data-as="item"`。
2. 不提供 `currentIndex`，不支持指定任意一项为当前页。
3. 当前项自动设置 `aria-current="page"`、`data-current="page"`、`tabindex="-1"`。
4. 当前项不会触发 Button hover、click、Enter 或 Space。
5. separator 自动设置 `aria-hidden="true"`。
6. Breadcrumb 的 `variant` 只影响 `Button as="item"` 的默认 Button 变体，且不覆盖子级显式 `variant`。
7. Breadcrumb 为 item 提供 `scaleOnHover=false` 默认值；子级 Button 的显式值优先。

<a id="布局模型"></a>

### 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../docs/standards/LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)。

- Breadcrumb 根是 `nav` 容器，内部内容整体 Hug。
- 根容器使用 `inline-flex`，允许换行。
- 子级 Button 保留自身内联外壳布局。
- 子级 Text 保留自身文本流布局。
- Breadcrumb 只管理根 gap、separator 样式、非当前透明度与最后一项当前态。
- 路径元素之间的有效行／列间距至少为 4 CSS px；显式 gap={0}、根字号或间距缩放不压低下限，较大首选间距保持。根容器继续允许路径片段换行，不把整条导航强制改成 singleLine；各 Button 内部的图文单行仍由 Button 拥有。

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




## AI Zone

> **设计稿**: [Workshop / Breadcrumb](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12046-1772&t=nY2VC3oisn12OH01-4)

Breadcrumb 支持两种模式：

- 默认内置模式（推荐）：`items` 自动生成 Button 与 Text separator，使用 `parts.Button` / `parts.Text` 配置隐藏实例。
- 显式组合模式：直接书写 `Button as="item"` 和 `Text as="separator"`，用于复杂内容和逐项差异。
- Breadcrumb 的默认组合样式为 Button `borderless`、separator `opacity: 0.5`；常规使用无需传 parts，parts 只用于覆盖默认值。

<a id="开发者指南-ai"></a>

### 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-breadcrumb` | Breadcrumb 根节点 |
| CSS 类名 | `snowui-breadcrumb-item` | 由 Breadcrumb 标记到 item 子级 |
| CSS 类名 | `snowui-breadcrumb-separator` | 由 Breadcrumb 标记到 separator 子级 |
| data 属性 | `data-as="item"` | item 角色 |
| data 属性 | `data-as="separator"` | separator 角色 |
| data 属性 | `data-current="page"` | 当前页面 item |

### 多语言

根导航默认名称随LocaleProvider更新，显式ariaLabel优先；路径文字与业务内容保持调用方原文。 通过useLocale读取`breadcrumb.navigation`，Provider messages可覆盖完整消息；未增加公开文案Prop。

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Breadcrumb | [Breadcrumb.svelte](Breadcrumb.svelte) | 根容器、角色识别、当前态标记、样式 |
| Button | [Button.svelte](Button.svelte) | item 可交互外壳；补充当前态不可交互契约 |
| Text | [Text.svelte](Text.svelte) | separator 推荐承载组件 |

### 关键字映射

| 关键字 | 处理方式 | 说明 |
| :--- | :--- | :--- |
| ariaLabel | `aria-label` | 透出到根 `nav` |
| variant | Breadcrumb context | 作为子级 `Button as="item"` 的默认 variant |
| `children` | `Snippet` | — | 显式声明 Button as="item" 与 Text as="separator"，替换内建 items 与 separator；最后一个 item 仍自动成为当前页。 |
| as="item" | DOM `data-as="item"` | Frame runtime 翻译；Breadcrumb action 识别 |
| as="separator" | DOM `data-as="separator"` | Frame runtime 翻译；Breadcrumb action 识别 |

### 关联关系

- **父组件**: 无
- **依赖**: Frame、Button、Text
- **规范**: [../../../docs/standards/LayoutProtocol.md](../../../docs/standards/LayoutProtocol.md)、[../../../docs/reference/ComponentStyleSheet.md](../../../docs/reference/ComponentStyleSheet.md)

---

## 更新日志

### v1.2.0 (2026-10-23)

- 路径元素首选间距复用共享 token 解析，有效行／列间距至少为 4 CSS px，显式零与字号／间距缩放不压低下限。
- 保留普通路径换行、子 Button 所有权、当前页事件保护及分隔符可访问性；更正旧文档称不提供 separator prop 的事实错误，现有 API 不变。

### v1.1.3 (2026-10-20)

- 根导航默认名称随LocaleProvider更新，显式ariaLabel优先；路径文字与业务内容保持调用方原文。

### v1.1.2 (2026-10-14)

- 显式 children 不再继承 `parts.Button` / `parts.Text`；items 模式的默认子项仍使用 parts。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v1.1.1 (2026-09-02)

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.1.0 (2026-08-19)

- Breadcrumb item 作为复合导航项默认关闭 Button hover 放大，并允许子 Button 显式重新开启。

### v1.0.1 (2026-08-16)

- item 的透明度与 hover overlay 过渡不再受共享样式注入顺序影响。

### v1.0.0 (2026-05-25)

#### 新功能
- 新增 Breadcrumb 组件，采用容器组合式 API。
- 支持最后一个 item 自动作为当前页面。
- 支持非当前 item 40% → hover 100% 透明度规则。
