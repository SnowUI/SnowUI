# Pagination

> **版本**: v1.6.4
> **职责**: 提供页码导航，帮助用户在多页数据之间切换，适合表格、列表和搜索结果。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

提供页码导航，帮助用户在多页数据之间切换，适合表格、列表和搜索结果。

## 使用选择

<!-- usage-guide:start -->
用于多页内容导航。DataTable 场景与其渲染状态连接；页码变化与数据请求是不同责任，不能假定组件自动发请求。

- page 从 1 开始，total 表示总页数，不是数据条数；onPageChange 连接页面状态。总页数不超过 1 时不显示分页，表格空态同样隐藏。
- 默认使用 outline 样式与 fill 宽度，撑满所在容器；分页内容默认居中。表格消费方不应覆盖为 fit-content。
- pageSizeOptions 配置每页条数选择，pageSize 可绑定；数据请求和总页数计算由页面或 DataTable 负责。
- 根导航默认名称随LocaleProvider更新，显式ariaLabel优先；不改变页码、每页条数与业务请求责任。
<!-- usage-guide:end -->

## 快速开始

以下示例展示推荐的基本组合。更多场景与组合限制见后文。

<!-- quick-start:generated -->
```svelte
<script lang="ts">
	import { Button, Pagination, Text } from '@snowui-design-system/components';
	const totalItems = 156;
	let page = $state(3);
	let pageSize = $state(20);
	const totalPages = $derived(Math.ceil(totalItems / pageSize));
	const firstItem = $derived((page - 1) * pageSize + 1);
	const lastItem = $derived(Math.min(page * pageSize, totalItems));
	function setPage(nextPage: number) { page = nextPage; }
	function setPageSize(nextPageSize: number) { pageSize = nextPageSize; page = 1; }
</script>

<div class="pagination-example-centered" style="display: flex; justify-content: center; width: 100%; min-width: 0;">
	<Pagination
		page={page}
		total={totalPages}
		onPageChange={setPage}
		{pageSize}
		onPageSizeChange={setPageSize}
		pageSizeOptions={[10, 20, 50]}
		pageSizeAriaLabel="Components per page"
		ariaLabel="Component catalog pages"
		widthMode="fill"
	/>
</div>

<style>
	.pagination-example-centered :global(.snowui-pagination-items) { justify-content: center; }
</style>
```
<!-- /quick-start:generated -->

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| page | `number` | `1` | 当前页，从 1 开始 |
| total | `number` | `1` | 总页数 |
| disabled | `boolean` | `false` | 禁用整个 Pagination |
| disabledPages | `number[]` | `[]` | 禁用指定页码；上一页 / 下一页会跳过连续禁用页，指向该方向最近的可用页 |
| ariaLabel | `string` | `locale 文案` | 根导航区域的无障碍标签；省略时随LocaleProvider更新，显式ariaLabel优先 |
| variant | `PaginationVariant` | `"outline"` | 普通页与前后页的按钮样式；当前页使用对应的强调搭配 |
| responsive | `PaginationResponsive` | `"auto"` | `auto` 根据容器宽度自动选择完整页码、省略页码与最小前后页；`none` 保持静态页码窗口与原有换行行为 |
| widthMode | `PaginationWidthMode` | `"fill"` | `auto` 在完整页码可容纳时按剩余空间判断，`hug` 保持内容宽度，`fill` 始终等宽填充；fill 模式含省略号时也填满可用宽度；hug 保持内容宽度 |
| gap | `string \| number` | — | 页码、prev、next 之间的首选间距；数字按 px 处理，有效下限为 4 CSS px，较大值保留。默认使用 gap-1。 |
| pageSize | `number` | `20` | 当前每页条数；选择后组件自行更新绑定值，仅在 `pageSizeOptions` 非空时显示选择器 |
| pageSizeOptions | `number[]` | `[]` | 可选的每页条数；非正数会被忽略，重复项会被去重 |
| pageSizeGap | `string \| number` | `16` | pageSize 与分页按钮组之间的独立首选间距；数字按 px 处理，有效下限为 4 CSS px，较大值保留 |
| pageSizeAriaLabel | `string` | `LocaleProvider` | 每页条数选择器的无障碍名称；默认随 LocaleProvider 使用中文“每页条数”或英文“Items per page” |
| onPageChange | `(page: number) => void` | — | 可点击页码变化时触发 |
| onPageSizeChange | `(pageSize: number) => void` | — | 每页条数变化时触发 |
| children | `Snippet` | — | 角色样式模板 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | 统一配置内置页码按钮、每页条数 Listbox 与选项；显式 children 角色模板不读取父级 parts，自行配置 Props。 |

未重新声明的继承能力请查所属基础组件文档；本表只列本组件源码具名公开属性。

## 使用边界与详细说明

<a id="内置组件双模式"></a>

### 内置组件双模式

- `parts.Button`：统一配置 Pagination 默认内置的角色模板。
- `parts.Listbox`：统一配置 Pagination 直接拥有的 pageSize Listbox。
- `parts.MenuItem`：统一配置 pageSize 选项。
- 具体结构差异继续通过现有 `as` 模板/外置选择器协议完成；外置显式 Props 高于 part。


Pagination 默认内置 Button 角色模板，并根据 `page` 和 `total` 生成真实页码。显式 children 可替换默认模板。

Pagination 属于 基础导航原语。它的作用半径只覆盖自身 `nav` 容器、直系角色模板和内部生成项，不引入跨组件编排能力，也不新增专用 PageButton 组件（设计基准见 [Figma Pagination](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12078-21567&t=nY2VC3oisn12OH01-4)）。

<a id="功能概览"></a>

### 功能概览

- 默认内置模式：当前页使用 gray Button，普通页、上一页、下一页使用 outline Button。
- pageSize 默认位于左侧并保持 Hug；分页按钮组位于右侧，默认与 pageSize 间隔 16px。
- 默认 fill 模式下，current、page、prev、next 始终等宽填充剩余空间；省略符保持 Hug。
- 显式组合模式：子级 Button 定义角色样式，不代表每一页数据。
- 根据 `page` / `total` 与实际容器宽度自动决定展示完整页码或 `...`；省略策略没有手动窗口参数。
- 缺少 `prev` / `next` 模板时使用内置默认箭头。
- 当前页、边界 prev / next、整体 disabled、单页 disabled 都由 Pagination 管理可点击性。
- Pagination 不控制使用方 Button 模板的 variant / size / hover 颜色 / border / background；作为复合导航控件，只将 item 的 Button hover 放大默认关闭，模板可用 `scaleOnHover={true}` 覆盖。
- Pagination 支持 `auto`、`hug`、`fill` 三种明确宽度模式。
- 默认 `responsive="auto"`：优先展示完整页码；空间不足时自动生成 `...`，再依次隐藏 pageSize、`...` 和当前页；上一页与下一页始终保留。
- 传入 `pageSizeOptions` 并声明 `Button as="pageSize"` 时，显示每页条数选择器。
- `pageSize` 模板在 children 中的声明顺序决定选择器位于页码左侧或右侧。
- Pagination 只提供成组的 `variant` 搭配；单个角色的 size、color、hover、border 等视觉仍通过 Button 模板配置。
- Pagination 的默认页码与前后页使用内置 Button 模板；省略符使用内部文字，箭头使用内置 ComponentIcon。

---

<a id="api-参考"></a>


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

<a id="使用示例"></a>


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

### 响应式收缩

`responsive="auto"` 默认启用类似 OverflowActions 的内容测量策略。Fill 模式读取 Pagination 自身宽度；Auto / Hug 模式读取父容器的真实可用宽度，多列 Grid 只采用 Pagination 所在轨道的宽度，横向 Flex 则扣除同级内容与 Gap。因此收缩后仍能随外层连续扩宽逐级恢复，且不会借用相邻标题或控件的空间。该策略不依赖视口断点，并按以下顺序逐级收缩：

1. **完整页码**：先尝试展示从 `1` 到 `total` 的所有页码。页数少且空间充足时，`fill` / `auto` 可让按钮等宽占满；按钮先收缩到自身内容宽度下限，不改变 size、padding、字号或点击高度。
2. **前后页内容**：若 `prev` / `next` 模板同时包含 Icon 与普通文字或 Text，空间不足时先隐藏文字并切换到 icon-only padding；`aria-label` 保持“上一页”或“下一页”。
3. **带锚点省略**：完整页码仍放不下时，组件保留第一页、最后一页和当前页附近页码，并只在两个可见数字之间显示不可交互的 `...`。只有中间实际省略至少两个页码时才使用省略符；若只缺一个页码则直接显示该页。fill 模式下可见按钮均分剩余宽度，省略符保持 Hug；页码窗口不是公开配置项。
4. **隐藏 pageSize**：若有每页条数选择器，下一阶段先隐藏它，把可用宽度交给分页导航。
5. **当前页导航**：带首尾锚点的省略布局仍放不下时，直接移除首尾页与省略符，保留“当前页 + 上一页 + 下一页”。不会渲染缺少数字锚点的孤立 `...`。
6. **最小导航**：最后隐藏当前页，只留下上一页和下一页。两者在所有阶段都存在；容器窄于其物理最小宽度时允许自然溢出。

pageSize Listbox 打开期间冻结当前响应阶段，避免浮层锚点在操作中被重建；浮层关闭后再按最新宽度刷新。宽度恢复时，以上阶段按相反顺序恢复。尺寸监听统一复用共享 `resizeManager`；`responsive="none"` 可关闭动态压缩，并保留静态窗口和传统换行。

```svelte
<Pagination page={11} total={24} responsive="auto" widthMode="fill" />
```

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
- 数字按 px 解析；也可传 `"0.75rem"`、`"clamp(...)"` 等 CSS 长度。两处有效渲染间距至少 4 CSS px，显式 0 值与小根字号也不能移除下限；较大值保留。

根节点 inline style 遵循 [StyleSpec §2.6](../../../docs/standards/StyleSpec.md) 的 Level 6 最高优先级，并由 Pagination 映射到当前有效区域：

```svelte
<!-- With pageSize: inline gap overrides pageSizeGap while item gap stays 4px -->
<Pagination gap={4} pageSizeGap={16} style="gap: 24px;" ... />

<!-- Without pageSize: inline gap overrides item gap -->
<Pagination gap={4} style="gap: 12px;" ... />
```

在上述 4 CSS px 下限内，首选间距优先级仍为：`inline style gap > 对应显式 Prop > Pagination 默认值`。有 pageSize 时 inline gap 不覆盖组内 `gap`，因为两者控制不同层级。

Pagination 只识别直系角色模板。不要用 `div` 包裹 `Button as="current"` / `Button as="page"` 来制造左右布局；嵌套模板会被忽略并回退到默认页码。调整 pageSize 左右位置应直接改变直系模板顺序。

### 完全外置与复杂布局

每页条数也可以完全由页面管理，Pagination 不要求选择器必须成为自己的子项：

```svelte
<script lang="ts">
  import { Frame, Pagination, Button, Select, Listbox, MenuItem } from '@snowui-design-system/components';
  let pageSize = $state('20');
</script>

<Frame row justify="between" width="100%">
    <Pagination page={1} total={5}>
        <Button as="current" />
        <Button as="page" />
    </Pagination>

    <Select bind:value={pageSize}>
        <Listbox>
            <MenuItem as="item" value="10" showCheck={false}>10</MenuItem>
            <MenuItem as="item" value="20" showCheck={false}>20</MenuItem>
            <MenuItem as="item" value="50" showCheck={false}>50</MenuItem>
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

### 行为、宽度与布局规则

主布局模型：**内联外壳布局**（详见 [LayoutProtocol.md §12.4](../../../docs/standards/LayoutProtocol.md)）。根容器为 `nav`（`inline-flex`、`min-width: 0`，默认组内 `gap=4px`）。作为 Table / DataTable 分页角色或独立使用时，无数据、`total <= 1` 时自动隐藏分页，仅在多于 1 页时显示。

- **宽度模式**：`widthMode="fill"`（默认）根宽 `100%`，页码与前后页按钮等宽均分剩余空间（自动省略符与 `pageSize` 保持 Hug）；`widthMode="hug"` 保持内容宽度；`widthMode="auto"` 在固定宽或被拉伸容器中自动 Fill，否则回退 Hug。
- **点击、禁用与跳过规则**：禁用优先级为 `disabled` > `prev / next` 方向无可用页 > `disabledPages` > `current`。`prev / next` 自动跳过连续 `disabledPages` 指向最近可用页；当前页输出 `aria-current="page"`、`data-current="page"`、`aria-disabled="true"`；自动省略符 `...` 输出 `aria-hidden="true"` 且不进入焦点序列。
- **样式边界**：Pagination 只控制生成项的宽度模式、页码文本、可点击性与无障碍状态，不通过 Context 改写使用方显式 Button 模板的 `variant`、尺寸、圆角或交互视觉；CSS 选择器使用 `:global(:where(...))` 降权并消费 Frame bridge 时序。

## AI Zone

- **架构与渲染结构**：[Pagination.svelte](Pagination.svelte) 内部包含隐藏模板读取区与生成项承载区（`.snowui-pagination-items` / `.snowui-pagination-controls` / `.snowui-pagination-page-size`）。更新页码或每页条数后若立即卸载，自动取消待执行的 `tick` 渲染与布局测量回调，避免销毁后读取派生值。
- **多语言**：通过 `useLocale()` 读取 `pagination.navigation` 与每页条数选择器默认无障碍文案；显式 `ariaLabel` / `pageSizeAriaLabel` 优先。

## 更新日志

### v1.6.4 (2026-10-23)

- 页码按钮组与 pageSize／按钮组间距保留 4 CSS px 下限，覆盖小根字号及显式零值；较大值和 inline 首选优先级保留，原收纳／展开冻结／页码与子按钮视觉不变。

### v1.6.3 (2026-10-22)

- 修复更新后立即卸载时，待执行的 `tick` 回调继续读取已销毁派生值的警告；失效轮次取消渲染及布局请求，公开 API、页码和视觉规则保持。
- 修复 prev / next 模板内容有包装层时，普通文字未随窄宽度压缩的问题；图标及前后页可访问名称保留，扩宽后恢复完整模板。

### v1.6.2 (2026-10-20)

- 根导航默认名称随LocaleProvider更新，显式ariaLabel优先；不改变页码、每页条数与业务请求责任。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

完整历史见 [更新日志归档](../../docs/history/changelogs/Pagination.history.md)。
