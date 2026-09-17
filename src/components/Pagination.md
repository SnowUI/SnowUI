# Pagination (分页)

> **内置图标统一（2026-09-11）**：功能图标的资源比例、尺寸优先级和按钮宿主遵循 [ComponentGuidelines §2.7](../../../specs/ComponentGuidelines.md#27-组件内置-icon-规范)。内置无外壳操作复用 Button bare；有padding的纯图标操作使用 iconOnly。尺寸从所属宿主继承，显式覆盖优先。


## 内置组件双模式

- `parts.Button`：统一配置 Pagination 默认内置的角色模板。
- `parts.Listbox`：统一配置 Pagination 直接拥有的 pageSize Listbox。
- `parts.MenuItem`：统一配置 pageSize 选项。
- 具体结构差异继续通过现有 `as` 模板/外置选择器协议完成；外置显式 Props 高于 part。

> **版本**: v1.5.0
> **职责**: 提供页码导航容器。
> **设计稿**: [Workshop / Pagination](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12078-21567&t=nY2VC3oisn12OH01-4)

Pagination 默认内置 Button 角色模板，并根据 `page` 和 `total` 生成真实页码。显式 children 可替换默认模板。

Pagination 属于 OSS 基础导航原语。它的作用半径只覆盖自身 `nav` 容器、直系角色模板和内部生成项，不引入 PRO 编排能力，也不新增专用 PageButton 组件。

## 功能概览

- 默认内置模式：当前页使用 gray Button，普通页、上一页、下一页使用 outline Button。
- pageSize 默认位于左侧并保持 Hug；分页按钮组位于右侧，默认与 pageSize 间隔 16px。
- current、page、prev、next 默认等宽 Fill；省略符与 pageSize 保持 Hug。
- 显式组合模式：子级 Button 定义角色样式，不代表每一页数据。
- 根据 `page` / `total` 自动生成页码和 `...`。
- 缺少 `prev` / `next` 模板时使用内置默认箭头。
- 当前页、边界 prev / next、整体 disabled、单页 disabled 都由 Pagination 管理可点击性。
- Pagination 不控制使用方 Button 模板的 variant / size / hover 颜色 / border / background；作为复合导航控件，只将 item 的 Button hover 放大默认关闭，模板可用 `scaleOnHover={true}` 覆盖。
- Pagination 支持 `auto`、`hug`、`fill` 三种明确宽度模式。
- 传入 `pageSizeOptions` 并声明 `Button as="pageSize"` 时，显示每页条数选择器。
- `pageSize` 模板在 children 中的声明顺序决定选择器位于页码左侧或右侧。
- Pagination 只提供成组的 `variant` 搭配；单个角色的 size、color、hover、border 等视觉仍通过 Button 模板配置。
- Pagination 的默认页码与前后页使用内置 Button 模板；省略符使用内部文字，箭头使用内置 ComponentIcon。

---

## API 参考

### 核心属性

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| page | `number` | `1` | 当前页，从 1 开始 |
| total | `number` | `1` | 总页数 |
| siblingCount | `number` | `1` | 当前页两侧保留页码数量 |
| boundaryCount | `number` | `1` | 首尾边界保留页码数量 |
| disabled | `boolean` | `false` | 禁用整个 Pagination |
| disabledPages | `number[]` | `[]` | 禁用指定页码 |
| ariaLabel | `string` | `"Pagination"` | 根导航区域的无障碍标签 |
| variant | `"outline" \| "gray" \| "borderless"` | `"outline"` | 普通页与前后页的按钮样式；当前页使用对应的强调搭配 |
| widthMode | `"auto" \| "hug" \| "fill"` | `"fill"` | `auto` 按容器空间判断；`hug` 保持内容宽度；`fill` 让所有按钮等宽填充，省略符保持 Hug |
| gap | `string \| number` | `4px` | 页码、prev、next 之间的间距；数字按 px 处理 |
| pageSize | `number`（bindable） | `20` | 当前每页条数；选择后组件自行更新绑定值，仅在 `pageSizeOptions` 非空时显示选择器 |
| pageSizeOptions | `number[]` | `[]` | 可选的每页条数；非正数会被忽略，重复项会被去重 |
| pageSizeGap | `string \| number` | `16` | pageSize 与分页按钮组之间的独立间距；数字按 px 处理 |
| pageSizeAriaLabel | `string` | `"每页条数"` | 每页条数选择器的无障碍名称 |
| onPageChange | `(page: number) => void` | - | 可点击页码变化时触发 |
| onPageSizeChange | `(pageSize: number) => void` | - | 每页条数变化时触发 |
| children | `Snippet` | - | 角色样式模板 |
| parts | `{ Button?, Listbox?, MenuItem? }` | - | 统一配置内置页码按钮、每页条数 Listbox 与选项；显式角色模板 Props 优先 |

`total` 会被归一化为至少 `1`。`page` 会被归一化到 `[1, total]`，避免渲染越界页码。

### 子级角色

| 角色 | 推荐写法 | 描述 |
| :--- | :--- | :--- |
| current | `<Button as="current" />` | 当前页样式模板 |
| page | `<Button as="page" />` | 非当前页样式模板 |
| prev | `<Button as="prev">...</Button>` | 上一页样式模板，可省略 |
| next | `<Button as="next">...</Button>` | 下一页样式模板，可省略 |
| pageSize | `<Button as="pageSize" variant="borderless" />` | 每页条数选择器的视觉模板；声明位置决定布局顺序 |

`current` / `page` 模板不需要写内容。Pagination 渲染时会注入真实页码，不需要写 `value` 或 `data-page`。

模板规则：

- Pagination 内写什么，就相当于给该角色定义一种样式。
- 同一角色出现多个直系模板时，只使用第一个。
- 缺失 `current` 模板时，使用与 `variant` 搭配的内置当前页 Button。
- 缺失 `page` 模板时，使用 `variant` 指定的内置普通页 Button。
- 缺失 `prev` / `next` 模板时，使用 `variant` 指定的内置 Button 与默认 `ArrowLineLeft/Right` 图标。
- 自定义 Button 模板保留自己的 variant、size、padding、radius、hover、focus、border 和背景。
- Pagination 生成的 Button 默认 `scaleOnHover=false`；模板显式传 `scaleOnHover={true}` 时保留放大反馈。
- Pagination 只接管生成后的宽度模式、页码文本、可点击性和无障碍状态。

## 使用示例

### 基础用法

```svelte
<Pagination page={1} total={5} />
```

默认样式即为左侧 Hug pageSize（提供 `pageSizeOptions` 时显示）与右侧 Fill 分页组；当前页 gray，其余按钮 outline。

### 按钮样式搭配

`variant` 描述普通页、上一页和下一页按钮的常态样式。Pagination 会为当前页自动选择具有足够区分度的强调样式：

| variant | 普通页 / 前后页 | 当前页 |
| :--- | :--- | :--- |
| `outline`（默认） | outline | gray |
| `gray` | gray | filled |
| `borderless` | borderless | gray |

```svelte
<Pagination page={2} total={6} variant="outline" />
<Pagination page={2} total={6} variant="gray" />
<Pagination page={2} total={6} variant="borderless" />
```

显式提供的 `current`、`page`、`prev` 或 `next` Button 模板仍以模板自己的 `variant` 为准，适合需要脱离内置搭配的场景。

### 每页条数选择

```svelte
<Pagination
    page={1}
    total={5}
    pageSize={20}
    pageSizeOptions={[10, 20, 50]}
    pageSizeGap={16}
    onPageSizeChange={(pageSize) => console.log(pageSize)}
>
    <Button as="pageSize" variant="borderless" />
    <Button as="current" />
    <Button as="page" />
</Pagination>
```

`pageSize` 写在页码模板之前时位于左侧；写在页码模板之后时位于右侧：

```svelte
<Pagination pageSize={20} pageSizeOptions={[10, 20, 50]}>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>
```

Pagination 克隆 Button 模板作为 Listbox trigger，因此视觉由 Button 的 `variant`、尺寸和样式控制，选项面板、键盘导航、Portal 与选择状态由内置 Listbox 服务管理。未声明 `Button as="pageSize"` 或未传 `pageSizeOptions` 时不渲染选择器。

pageSize 的默认箭头使用 Components 语义 `arrow-line-down` 图标。它与 `arrow-line-left` / `arrow-line-right` 使用相同的 `--snowui-pagination-icon-size` 尺寸入口；pageSize 的 Icon wrapper、Icon Frame 与内部 SVG 三层都收敛到该尺寸，避免 Icon 默认尺寸溢出。Icon 是 Button 的普通内容，不标记 `as="trailing"`；文字与 Icon 的水平居中及间距继承 Button 自己的内容布局与 gap。pageSize 外壳和 Button 模板始终为 Hug，不参与页码按钮的 Fill 分配。

Pagination 内部将页码与 prev / next 组织为一个分页按钮组。`pageSizeGap` 只控制 pageSize 与这个按钮组之间的间距，按钮组内部仍使用 Pagination 的普通 `column-gap`：

```svelte
<Pagination pageSizeGap={16} ...>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>
```

### Gap 与 inline style 优先级

公开间距 API 不要求使用方传 Token 或 CSS 变量：

```svelte
<Pagination gap={4} pageSizeGap={16} />
```

- `gap`：页码、prev、next 的组内间距。
- `pageSizeGap`：pageSize 与整个分页按钮组之间的间距。
- 数字按 px 解析；也可传 `"0.75rem"`、`"clamp(...)"` 等 CSS 长度。

根节点 inline style 遵循 [StyleSpec §2.6](../../../specs/StyleSpec.md) 的 Level 6 最高优先级，并由 Pagination 映射到当前有效区域：

```svelte
<!-- 有 pageSize：style gap 覆盖 pageSizeGap，组内 gap 仍为 4px -->
<Pagination gap={4} pageSizeGap={16} style="gap: 24px;" ... />

<!-- 无 pageSize：style gap 覆盖普通 gap -->
<Pagination gap={4} style="gap: 12px;" ... />
```

因此间距优先级为：`inline style gap > 对应显式 Prop > Pagination 默认值`。有 pageSize 时 inline gap 不覆盖组内 `gap`，因为两者控制不同层级。

Pagination 只识别直系角色模板。不要用 `div` 包裹 `Button as="current"` / `Button as="page"` 来制造左右布局；嵌套模板会被忽略并回退到默认页码。调整 pageSize 左右位置应直接改变直系模板顺序。

### 完全外置与复杂布局

每页条数也可以完全由页面管理，Pagination 不要求选择器必须成为自己的子项：

```svelte
<Frame row justify="between" width="100%">
    <Pagination page={1} total={5}>
        <Button as="current" />
        <Button as="page" />
    </Pagination>

    <Select bind:value={pageSize}>
        <Listbox>
            <MenuItem value={10} showCheck={false}>10</MenuItem>
            <MenuItem value={20} showCheck={false}>20</MenuItem>
            <MenuItem value={50} showCheck={false}>50</MenuItem>
        </Listbox>
    </Select>
</Frame>
```

这种写法适合分栏、上下排列或选择器不属于分页导航区域的页面。

最终会渲染接近 `1 2 3 4 5 < >`。未提供 `prev` / `next` 时，Pagination 使用内置默认箭头。

### Fill 按钮宽度

```svelte
<Pagination widthMode="fill" page={11} total={22}>
    <Button as="current" />
    <Button as="page" />
    <Button as="prev" />
    <Button as="next" />
</Pagination>
```

current、page、prev、next 会均分省略符之外的剩余宽度；自动生成的 `...` 始终保持 Hug。
空的 `Button as="prev"` / `Button as="next"` 只定义角色外观，Pagination 会注入默认左右箭头；若模板内已有文字、SVG 或 Icon，则保留使用方内容。

### 强制 Hug

```svelte
<Pagination widthMode="hug" page={1} total={5}>
    <Button as="current" />
    <Button as="page" />
</Pagination>
```

### 自定义角色模板

```svelte
<Pagination page={2} total={22}>
    <Button as="current" variant="filled" />
    <Button as="page" variant="outline" />
    <Button as="prev">上一页</Button>
    <Button as="next">下一页</Button>
</Pagination>
```

Pagination 只复制模板的外观属性并替换页码文本；点击和可用性由 Pagination 管理。

### 单页禁用

```svelte
<Pagination page={1} total={5} disabledPages={[3]}>
    <Button as="current" />
    <Button as="page" />
</Pagination>
```

第 3 页会被标记为不可点击，其他非当前页仍可触发 `onPageChange`。

### 设计稿样式还原

```svelte
<Pagination page={1} total={22} style="width: 21.25rem;">
    <Button as="current" variant="gray" />
    <Button as="page" variant="outline" />
    <Button as="prev" variant="outline" bare iconOnly aria-label="上一页">
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M20.68 7.293a.943.943 0 0 1 0 1.414l-7.18 6.586a.943.943 0 0 0 0 1.414l7.18 6.586a.943.943 0 0 1 0 1.414c-.425.39-1.116.39-1.541 0l-7.181-6.586c-1.277-1.171-1.277-3.07 0-4.242l7.18-6.586a1.16 1.16 0 0 1 1.543 0" clip-rule="evenodd" /></svg>
    </Button>
    <Button as="next" variant="outline" bare iconOnly aria-label="下一页">
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M11.32 24.707a.943.943 0 0 1 0-1.414l7.18-6.586a.943.943 0 0 0 0-1.414l-7.18-6.586a.943.943 0 0 1 0-1.414 1.16 1.16 0 0 1 1.541 0l7.181 6.586c1.277 1.171 1.277 3.07 0 4.242l-7.18 6.586c-.427.39-1.117.39-1.543 0" clip-rule="evenodd" /></svg>
    </Button>
</Pagination>
```

这个例子用 Button 的 `variant` 和设计稿同源 `ArrowLineLeft/Right` SVG 还原 Figma 中的灰底当前页、描边普通页和描边箭头按钮。

### 完全默认样式

```svelte
<Pagination page={1} total={22} />
```

完全不传子级模板时，Pagination 会使用内置 Button 与箭头图标生成全部可见项。

### 受控页码

```svelte
<script lang="ts">
    let page = $state(1);
</script>

<Pagination page={page} total={22} onPageChange={(next) => (page = next)}>
    <Button as="current" />
    <Button as="page" />
    <Button as="prev">上一页</Button>
    <Button as="next">下一页</Button>
</Pagination>
```

`onPageChange` 只会在目标页可点击时触发。当前页、禁用页、越界页、第一页的 prev、最后一页的 next 都不会触发回调。

## 行为规则

1. `total <= 可完整展示数量` 时展示全部页码，不插入 `...`。
2. 长页数自动保留首尾 `boundaryCount` 个页码、当前页附近 `siblingCount` 个页码，并在断点处插入 `...`。
3. 当前页输出 `aria-current="page"`、`data-current="page"`、`aria-disabled="true"`，不可点击。
4. `page <= 1` 时 prev 不可点击。
5. `page >= total` 时 next 不可点击。
6. `disabledPages` 中的页码不可点击，指向禁用页的 prev / next 也不可点击。
7. `disabled={true}` 时所有生成项不可点击。
8. 省略符不可点击，不进入焦点序列。
9. `widthMode="fill"` 只拉伸 `.snowui-pagination-item`；省略符始终保持 Hug。

页码窗口补偿规则：

- 当前页靠近首页时，前段展示更多连续页码，例如 `1 2 3 ... 22`。
- 当前页在中间时，两侧同时出现省略符，例如 `1 ... 10 11 12 ... 22`。
- 当前页靠近末页时，尾段展示更多连续页码，例如 `1 ... 20 21 22`。

点击与禁用规则：

| 项 | 规则 |
| :--- | :--- |
| page | 目标页在 `[1, total]`、不是当前页、未被禁用时可点击 |
| current | 不触发 `onPageChange`，不触发用户点击逻辑 |
| prev | 目标页为 `page - 1`，第一页或目标页禁用时不可点击 |
| next | 目标页为 `page + 1`，末页或目标页禁用时不可点击 |
| disabledPages | 命中的页码不可点击 |
| disabled | 所有生成项不可点击 |

禁用优先级：`disabled` > 页码越界 > prev / next 边界 > `disabledPages` > 当前页。

无障碍规则：

- 根元素语义为 `nav`，默认 `aria-label="Pagination"`。
- 当前页必须输出 `aria-current="page"`。
- 不可点击项输出 `aria-disabled="true"`，不进入正常 Tab 序列。
- 自动插入的 `...` 使用 `aria-hidden="true"`，不参与焦点。

## 默认样式

角色模板缺失时，Pagination 优先使用所选 `variant` 的内置 Button 模板。以下 `snowui-pagination-default-*` 规则只作为模板节点不可用时的防御性回退：

| 默认项 | 样式 |
| :--- | :--- |
| current 文字 | `black/100% × opacity: 1` |
| page 文字 | `black/100% × opacity: 0.4`，hover 到 `opacity: 1` |
| prev / next Icon | 内置 SVG，`black/100% × opacity: 0.4`，hover 到 `opacity: 1` |
| 省略符 | `12px / 16px`，`black/40%` |
| 点击区域 | padding-y `4px`，padding-x `8px` |
| 圆角 | `var(--radius-3)` |
| 默认项尺寸 | 不设置最小宽高，由内容、padding 或 Button 模板决定 |

无底色文字 / Icon hover 统一遵循 [../../../specs/StyleSpec.md §2.4.5](../../../specs/StyleSpec.md)：`black/100% × opacity: 0.4 -> 1`，不使用背景叠加。

Figma 对照：

| 设计稿记录 | Pagination 对应 |
| :--- | :--- |
| 根 gap `4px` | `--snowui-pagination-row-gap` / `--snowui-pagination-column-gap` |
| 文本 `12px / 16px` | `--snowui-pagination-font-size` / `--snowui-pagination-line-height` |
| 当前页灰底 | 由默认搭配或显式 `Button as="current"` 模板提供 |
| 非当前页描边 | 由默认搭配或显式 `Button as="page"` 模板提供 |
| `ArrowLineLeft/Right` | 内置 SVG 路径来自 `resource-base` 同名图标 |

## 布局模型

主布局模型：**内联外壳布局**。定义见 [../../../specs/LayoutProtocol.md §12.4](../../../specs/LayoutProtocol.md)。

- 根容器是 `nav`。
- 根使用 `inline-flex`，允许换行。
- 默认 gap 为 `4px`。
- `widthMode="auto"`：Pagination 自身为 Hug 宽度时内部按钮 Hug；被固定宽度或拉伸时按钮自动等宽 Fill。
- `widthMode="hug"`：根宽度为 fit-content，按钮和省略符均保持 Hug。
- `widthMode="fill"`：根宽度为 100%，所有按钮等宽均分剩余空间，省略符保持 Hug。
- 无法稳定判断 auto 模式时，优先回退 Hug，避免在内容宽度容器里意外拉伸。

结构模型：

```text
Root Frame(nav)
  hidden templates:
    Button as="current"
    Button as="page"
    Button as="prev"
    Button as="next"
  visible items:
    generated page buttons
    generated ellipsis
    generated prev / next
```

布局变量链：

| 变量 | 默认值 | 用途 |
| :--- | :--- | :--- |
| `--snowui-pagination-row-gap` | `var(--gap-1)` | 换行时的行间距 |
| `--snowui-pagination-column-gap` | `var(--gap-1)` | item 列间距 |
| `--snowui-pagination-font-size` | `var(--text-12)` | 默认文字字号 |
| `--snowui-pagination-line-height` | `var(--leading-12)` | 默认文字行高 |
| `--snowui-pagination-padding-y` | `var(--padding-1)` | 默认文字 / Icon 垂直 padding |
| `--snowui-pagination-padding-x` | `var(--padding-2)` | 默认文字 / Icon 水平 padding |
| `--snowui-pagination-radius` | `var(--radius-3)` | 默认圆角 |
| `--snowui-pagination-idle-opacity` | `0.4` | 默认非当前项透明度 |
| `--snowui-pagination-hover-opacity` | `1` | 默认 hover 透明度 |

## 样式边界

- Pagination 不通过 context 改写使用方 Button 模板的 variant。
- Pagination 不重写使用方 Button 模板的 hover、active、focus、disabled、border、background、padding、radius。
- Pagination 只允许控制生成后元素的宽度模式、可点击性，以及根容器 gap / wrap / align。
- 当前页、非当前页、上一页、下一页的自定义视觉差异由角色模板表达。
- 自动省略符是 Pagination 自身内容，可通过 Pagination 变量定义字体、行高、颜色和宽度策略。
- CSS selector 使用 `:global(:where(...))` 降权。
- transition 消费 Frame bridge 变量，避免硬编码组件私有动画时序。

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 开发者关键字

| 类别 | 关键字 | 描述 |
| :--- | :--- | :--- |
| CSS 类名 | `snowui-pagination` | Pagination 根节点 |
| CSS 类名 | `snowui-pagination-items` | 生成后的可见页码区域 |
| CSS 类名 | `snowui-pagination-controls` | 页码、prev、next 的内部按钮组 |
| CSS 类名 | `snowui-pagination-templates` | 隐藏模板区域 |
| CSS 类名 | `snowui-pagination-default` | 内置默认项 |
| CSS 类名 | `snowui-pagination-current` | 当前页生成项 |
| CSS 类名 | `snowui-pagination-page` | 普通页生成项 |
| CSS 类名 | `snowui-pagination-unavailable` | Pagination 判定不可点击的生成项 |
| CSS 类名 | `snowui-pagination-ellipsis` | 自动省略符 |
| CSS 类名 | `snowui-pagination-page-size` | 每页条数选择器外壳 |
| CSS 类名 | `snowui-pagination-page-size-template` | Listbox trigger 的 Button 视觉模板 |
| data 属性 | `data-as="current"` | 当前页模板 / 生成项 |
| data 属性 | `data-as="page"` | 非当前页模板 / 生成项 |
| data 属性 | `data-as="prev"` | 上一页模板 / 生成项 |
| data 属性 | `data-as="next"` | 下一页模板 / 生成项 |
| data 属性 | `data-as="pageSize"` | 每页条数 Button 模板 / 生成项 |
| data 属性 | `data-page` | 生成页码 |
| data 属性 | `data-current="page"` | 当前页标记 |
| data 属性 | `data-disabled="true"` | 不可点击标记 |
| data 属性 | `data-width-mode="auto\|hug\|fill"` | 当前宽度策略 |

### 测试覆盖

| 示例 | 覆盖点 |
| :--- | :--- |
| A1 | 短页数展示全部页码 |
| A2 | 长页数首页省略符 |
| A3 | 长页数中间页双省略符 |
| A4 | 长页数末页省略符 |
| A5 | 自定义 prev / next Button 模板 |
| A6 | 固定宽度自动 Fill |
| A7 | 整体禁用 |
| A8 | 指定页禁用 |
| A9 | 设计稿样式还原 |
| A10 | 完全默认样式 |
| A10-1 | 三种内置按钮样式搭配与显式模板优先级 |
| A11 | 显式 Fill，省略符 Hug |
| A12 | 显式 Hug |
| A13 | pageSize 模板置于最右侧、Listbox 选择与 Fill 剩余宽度布局 |
| A14 | pageSize 模板置于页码左侧 |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Pagination | [Pagination.svelte](./Pagination.svelte) | 页码窗口、模板读取、默认项生成、可点击性 |
| Button | [Button.svelte](./Button.svelte) | 使用方自定义角色模板 |

### 关联关系

- **父组件**: 无
- **依赖**: Frame、Button 模板 DOM
- **规范**: [../../../specs/LayoutProtocol.md](../../../specs/LayoutProtocol.md)、[../../../specs/ComponentStyleSheet.md](../../../specs/ComponentStyleSheet.md)、[../../../specs/StyleSpec.md](../../../specs/StyleSpec.md)

---

## 更新日志 (Changelog)

### v1.5.0 (2026-09-17)

- 新增 `variant="outline" | "gray" | "borderless"`，分别内置 gray、filled、gray 当前页搭配；默认保持 outline 常态与 gray 当前页。
- 显式角色 Button 模板继续优先，缺失角色由所选 variant 的内置模板补齐。

### v1.4.0 (2026-08-19)

- Pagination 内部 Button 作为复合导航项默认关闭 hover 放大，模板可显式重新开启；其余 hover 颜色和视觉 Props 保持由 Button 拥有。

### v1.3.3 (2026-07-08)

- 修复空 `Button as="prev"` / `Button as="next"` 模板只渲染空按钮的问题；prev / next 模板为空时自动注入 Pagination 默认箭头，已有文字、SVG 或 Icon 的自定义模板保持不变。

### v1.3.2 (2026-07-08)

- 移除 fill 模式下分页项的 `min-width: 0` 压缩规则；自定义 Button 模板保留自身 intrinsic 最小宽度，避免文字 nowrap 后视觉上吞掉默认 padding。空间足够时仍按 fill 变宽，空间不足时由 Pagination 换行承接。

### v1.3.1 (2026-07-08)

- 移除默认项与 pageSize trigger 的最小尺寸约束；默认尺寸由内容、padding 或外部 Button 模板决定。
- 清理文档示例中 prev / next bare Button 的内联尺寸外壳。
- 移除默认项最小宽高覆盖入口。

### v1.3.0 (2026-07-04)

- 默认内置 Button 模板改为 Table-Demo 表格二样式：pageSize 左置 Hug，当前页 gray，普通页与前后页 outline。
- 默认 `widthMode="fill"`，current/page/prev/next 等宽填充；默认 `pageSizeGap=16px`。
- 显式 children 继续作为自定义模板入口。

### v1.2.0 (2026-06-30)

- 新增 `pageSize`、`pageSizeOptions`、`pageSizeAriaLabel` 与 `onPageSizeChange`。
- 新增 `Button as="pageSize"` 视觉模板；模板声明顺序控制选择器位于页码左侧或右侧。
- 使用内置 Listbox 承接选项、键盘、Portal 和选择交互，Button 模板负责视觉。
- 默认箭头通过 `ComponentIcon name="arrow-line-down"` 解析；内置回退随 Components 交付，应用可通过 IconProvider 切库，Icon 透明度沿用 Pagination 左右箭头的 `0.4 → 1` hover 规则。
- 新增 `pageSizeGap`，独立控制 pageSize 与分页按钮组的间距；组内 Pagination gap 保持不变。
- 新增普通 `gap` Prop，直接控制页码、prev、next 的组内间距；公开数字按 px 处理。
- 根节点 `style="gap:…"` 按是否存在 pageSize 映射到 pageSize 外层间距或普通组内间距，并保持 inline style 高于对应 Prop。
- pageSize Icon 尺寸改为复用左右箭头的 `--snowui-pagination-icon-size`，Button 负责文字与 Icon 的居中及内容 gap。
- 修正 ArrowLineDown 仅约束外层 wrapper、内部 Icon Frame 仍使用默认尺寸的问题；三个 Pagination 箭头现在共享同一最终边界尺寸。
- 三个箭头统一设为不可 flex shrink，避免 Fill 模式在 pageSize 与外层 gap 占用空间后压缩 prev / next SVG。
- pageSize Listbox 选项使用 MenuItem 的默认 label 槽渲染数值，确保 label 与选中 check 之间消费 MenuItem 默认 8px gap。

### v1.1.0 (2026-06-20)

- 新增 `widthMode="auto | hug | fill"`。
- Fill 模式只让可点击按钮等宽填充，省略符始终保持 Hug。

### v1.0.0 (2026-05-26)

#### 新功能
- 新增 Pagination 组件，采用角色样式模板 API。
- 支持自动页码窗口和省略符。
- 支持缺省 prev / next 内置箭头。
- 支持自动 Hug / Fill 宽度模式。
- 支持指定页禁用。
