# Pagination full reference

Reviewed against Chinese source SHA-256 `4fc2cd82e1a1f34e8378f52cca466d7831c7664beba2bc1579f2fbfaeb4c6f3f`.

<a id="pagination"></a>

# Pagination

<a id="组件介绍"></a>

## Overview

Provide page navigation for paged tables, lists, and search results.

<a id="使用选择"></a>

## When to use it

Use it for navigation between pages of content. DataTable can bind to its page state; the page or data layer remains responsible for fetching data.

- Pages are numbered from 1. `total` is the number of pages, not the number of rows; use `onPageChange` to update page state. Pagination is hidden when total is at most 1 or the table is empty.
- The default is outline with fill width across the container and centered content. Table consumers should not override the width with fit-content.
- `pageSizeOptions` configures page-size choices and `pageSize` can be bound. The page or DataTable fetches data and calculates the total number of pages.
- The default navigation name follows LocaleProvider; an explicit ariaLabel takes priority. Page numbers, page size and responsibility for business requests are unchanged.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

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

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| page | `number` | `1` | Current page, starting from 1 |
| total | `number` | `1` | Total number of pages |
| disabled | `boolean` | `false` | Disable the whole Pagination |
| disabledPages | `number[]` | `[]` | Disable the specified page number; the previous page/next page will skip the continuous disabled page and point to the nearest available page in this direction. |
| ariaLabel | `string` | `Locale message` | Accessible name for the root navigation. When omitted, follows LocaleProvider; an explicit ariaLabel takes priority. |
| variant | `PaginationVariant` | `"outline"` | The button style of the ordinary page and the front and back pages; the current page uses the corresponding emphasis matching |
| responsive | `PaginationResponsive` | `"auto"` | `auto` automatically selects the full page number, omitted page number and the minimum front and back page according to the width of the container; `none` keeps the static page number window and the original line break behavior |
| widthMode | `PaginationWidthMode` | `"fill"` | `auto` judges according to the remaining space when the full page number can be accommodated, `hug` maintains the width of the content, and `fill` always fills in equally; the fill mode also fills the available width when it contains an ellipsis; hug maintains the width of the content |
| gap | `string \| number` | — | Preferred spacing between page numbers and previous/next controls. Numeric values are pixels, with a 4 CSS px effective floor and larger values preserved. Defaults to gap-1. |
| pageSize | `number` | `20` | The current number of bars per page; after selection, the component will update the binding value by itself, and the selector will only be displayed when `pageSizeOptions` is not free. |
| pageSizeOptions | `number[]` | `[]` | The number of bars per page can be selected; non-positive numbers will be ignored, and duplicate items will be removed. |
| pageSizeGap | `string \| number` | `16` | Separate preferred spacing between pageSize and the page-button group. Numeric values are pixels, with a 4 CSS px effective floor and larger values preserved. |
| pageSizeAriaLabel | `string` | `LocaleProvider` | Accessible name for the page-size selector; LocaleProvider supplies the default in English or Chinese. |
| onPageChange | `(page: number) => void` | — | It can be triggered when the page number changes. |
| onPageSizeChange | `(pageSize: number) => void` | — | Triggered when the number of bars per page changes |
| children | `Snippet` | — | Character style template |
| parts | `ComponentPartsOf<{ Button: typeof Button; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | Uniform configuration of the built-in page number button, listbox and options per page; the explicit children role template does not read parent parts and configures Props by itself. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Built-in component dual mode

- `parts.Button`: Configure the default built-in button templates.
- `parts.Listbox`: Configure the page-size Listbox owned by Pagination.
- `parts.MenuItem`: Configure the page-size options.
- Use the existing `as` templates or an external selector for structural changes. Explicit Props on a template take precedence over `parts`.

Pagination defaults to the built-in Button role template, and generates real page numbers according to `page` and `total`. The explicit children can replace the default template.

Pagination is a basic navigation component. Its scope is its own `nav`, direct role templates, and generated items; it does not manage the layout of surrounding components (design reference: [Figma Pagination](https://www.figma.com/design/391NQa4yf4NJIyuZ5vHbvc/Workshop?node-id=12078-21567&t=nY2VC3oisn12OH01-4)).

<a id="功能概览"></a>

<a id="功能概览-1"></a>

### Feature overview

- Default built-in mode: the current page uses gray Button, and the ordinary page, the previous page and the next page use the outline Button.
- The pageSize is located on the left side by default and keeps Hug; the page button group is located on the right side, with a default interval of 16px from pageSize.
- In the default fill mode, current, page, prev and next always fill in the remaining space with equal widths; the ellipsis remains Hug.
- Explicit composition mode: Child Buttons define the style of each role; they do not represent individual data pages.
- Based on `page`, `total`, and available width, show all page numbers when possible or insert `…` automatically. There is no manual window-size Prop.
- Use the built-in default arrow when the `prev` / `next` template is missing.
- The clickability of the current page, the boundary prev / next, the whole disabled, and the single page disabled are all managed by Pagination.
- Pagination does not control the variant / size / hover color / border / background of the user's Button template; as a composite navigation control, only the button hover of the item is enlarged and turned off by default, and the template can be overwritten by `scaleOnHover={true}`.
- Pagination supports three clear width modes: `auto`, `hug` and `fill`.
- With `responsive="auto"`, show all page numbers when possible. As space decreases, insert ellipses, hide the page-size selector, then reduce the page-number window. Previous and next controls remain available.
- When `pageSizeOptions` and `Button as="pageSize"` are provided, show the page-size selector.
- The declaration order of the `pageSize` template in children determines whether the selector is on the left or right side of the page number.
- Pagination only provides a group of `variant` matching; the size, color, hover, border and other visuals of a single character are still configured through the Button template.
- The default page number and front and back pages of Pagination use the built-in Button template; ellipsis use internal text, and arrows use built-in ComponentIcon.

---

<a id="api-参考"></a>

<a id="子级角色"></a>

### Sub-level role

| Role | Recommended writing method | Description |
| --- | --- | --- |
| current | `<Button as="current" />` | Current page style template |
| page | `<Button as="page" />` | Non-current page style template |
| prev | `<Button as="prev">...</Button>` | The style template of the previous page can be omitted. |
| next | `<Button as="next">...</Button>` | Next page style template, can be omitted |
| pageSize | `<Button as="pageSize" variant="borderless" />` | The visual template of the number of strips per page selector; the declaration position determines the layout order |

The `current` / `page` template does not need to write the content. When Pagination renders, the real page number will be injected, and there is no need to write `value` or `data-page`.

Template rules:

- What is written in Pagination is equivalent to defining a style for the role.
- When there are multiple direct templates in the same role, only the first one is used.
- When the `current` template is missing, use the built-in current page Button with `variant`.
- When the `page` template is missing, use the built-in ordinary page Button specified by `variant`.
- When the `prev` / `next` template is missing, use the built-in Button specified by `variant` and the default `ArrowLineLeft/Right` icon.
- The custom Button template retains its own variant, size, padding, radius, hover, focus, border and background.
- The Button generated by Pagination defaults to `scaleOnHover=false`; the template reserves the amplification feedback when the template explicitly transmits `scaleOnHover={true}`.
- Pagination only takes over the generated width mode, page number text, clickability and accessibility status.

<a id="使用示例"></a>

<a id="基础用法"></a>

### Basic usage

```svelte
<Pagination page={1} total={5} />
```

The default style is Hug pageSize on the left (displayed when `pageSizeOptions` is provided) and Fill page group on the right; the current page is gray, and the rest of the button is outline.

<a id="按钮样式搭配"></a>

### Button style matching

`variant` describes the normal style of the normal page, previous page and next page buttons. Pagination will automatically select an emphasis style with sufficient distinction for the current page:

| variant | Ordinary page / front and back pages | Current page |
| --- | --- | --- |
| `outline` (default) | outline | gray |
| `gray` | gray | filled |
| `borderless` | borderless | gray |

```svelte
<Pagination page={2} total={6} variant="outline" />
<Pagination page={2} total={6} variant="gray" />
<Pagination page={2} total={6} variant="borderless" />
```

The explicitly provided `current`, `page`, `prev` or `next` Button templates are still subject to the template's own `variant`, which is suitable for scenes that need to be separated from the built-in matching.

<a id="响应式收缩"></a>

### Responsive contraction

`responsive="auto"` enables content measurement strategies similar to OverflowActions by default. Fill mode reads the width of Pagination itself; Auto / Hug mode reads the real available width of the parent container, multi-column Grid only uses the width of the track where Pagination is located, and horizontal Flex deducts the same-level content and Gap. Therefore, after shrinkage, it can still be restored step by step with the continuous expansion of the outer layer, and will not borrow the space of adjacent titles or controls. The strategy does not rely on the viewport breakpoint and shrinks step by step in the following order:

1. **Full page number**: Try to display all page numbers from `1` to `total` first. When the number of pages is small and there is enough space, `fill` / `auto` can make the button width full; the button shrinks to the lower limit of its own content width without changing the size, padding, font size or click height.
2. **Contents of front and back pages**: If the `prev` / `next` template contains Icon and ordinary text or Text at the same time, hide the text first and switch to icon-only padding when there is not enough space; `aria-label` keeps "previous page" or "next page".
3. **Anchored ellipses**: When all numbers do not fit, keep the first, last, and nearby current pages, inserting non-interactive ellipses between gaps.
4. **Hide pageSize**: If there is a page number selector, hide it first in the next stage, and leave the available width to the paging navigation.
5. **Current-page navigation**: When the anchored layout is still too wide, remove the first and last anchors and ellipses, keeping current, previous, and next.
6. **Minimum navigation**: Finally hide the current page, leaving only previous and next. Natural overflow is allowed below their physical minimum width.

The pageSize Listbox freezes the current response stage during the opening period to avoid the reconstruction of the floating layer anchor point in the operation; refresh according to the latest width after the floating layer is closed. When the width is restored, the above stages are restored in reverse order. Size monitoring unified resizeManager sharing `resizeManager`; `responsive="none"` can turn off dynamic compression and retain static windows and traditional line breaks.

```svelte
<Pagination page={11} total={24} responsive="auto" widthMode="fill" />
```

<a id="每页条数选择"></a>

### Select the number of bars per page

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

`pageSize` is on the left when written before the page number template; on the right side when written after the page number template:

```svelte
<Pagination pageSize={20} pageSizeOptions={[10, 20, 50]}>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>
```

Pagination clones the Button template as a Listbox trigger, so the visual is controlled by Button's `variant`, size and style, and the option panel, keyboard navigation, Portal and selection status are managed by the built-in Listbox service. The selector is not rendered when `Button as="pageSize"` is not declared or `pageSizeOptions` is not passed.

The default arrow of pageSize uses the Components semantics `arrow-line-down` icon. It uses the same `--snowui-pagination-icon-size` size entrance as `arrow-line-left` / `arrow-line-right`; the Icon wrapper, Icon Frame and internal SVG of pageSize all converge to this size to avoid Icon default size overflow. Icon is the ordinary content of Button, not marked with `as="trailing"`; the horizontal centering and spacing of the text and Icon inherits Button's own content layout and gap. The pageSize shell and Button template are always Hug, and do not participate in the Fill allocation of the page number button.

Pagination internally organizes the page number and prev / next into a page button group. `pageSizeGap` only controls the spacing between pageSize and this button group, and the ordinary `column-gap` of Pagination is still used inside the button group:

```svelte
<Pagination pageSizeGap={16} ...>
    <Button as="current" />
    <Button as="page" />
    <Button as="pageSize" variant="borderless" />
</Pagination>
```

<a id="gap-与-inline-style-优先级"></a>

### Gap and inline style priority

The public spacing API does not require the use of Token or CSS variables:

```svelte
<Pagination gap={4} pageSizeGap={16} />
```

- `gap`: Spacing within the page-button group.
- `pageSizeGap`: Spacing between the page-size selector and the button group.
- Numbers are parsed as pixels; CSS lengths such as "0.75rem" and "clamp(...)" are also supported. Both effective gaps retain at least 4 CSS px, including explicit zero and small root font sizes. Larger values are preserved.

The root node inline style follows the highest priority of Level 6 of StyleSpec §2.6 and is mapped to the current valid area by Pagination:

```svelte

<Pagination gap={4} pageSizeGap={16} style="gap: 24px;" ... />


<Pagination gap={4} style="gap: 12px;" ... />
```

Within the 4 CSS px floor, preferred spacing retains this priority: `inline style gap > corresponding explicit prop > Pagination default`. With pageSize present, inline gap does not replace the internal group gap because the two control different levels.

Pagination only recognizes the direct role template. Do not use `div` to wrap `Button as="current"` / `Button as="page"` to create a left and right layout; the nested template will be ignored and returned to the default page number. Adjusting the left and right positions of pageSize should directly change the order of the direct template.

<a id="完全外置与复杂布局"></a>

### Completely external and complex layout

The number of bars per page can also be completely managed by the page. Pagination does not require the selector to be its own sub-item:

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

This way of writing is suitable for pages that are divided into columns, arranged up and down, or where the selector does not belong to the paging navigation area.

Eventually, it will render close to `1 2 3 4 5 < >`. When `prev` / `next` is not provided, Pagination uses the built-in default arrow.

<a id="fill-按钮宽度"></a>

### Fill button width

```svelte
<Pagination widthMode="fill" page={11} total={22}>
    <Button as="current" />
    <Button as="page" />
    <Button as="prev" />
    <Button as="next" />
</Pagination>
```

Current, page, previous, and next buttons divide the space left after ellipses; generated ellipses keep their content width. Empty `Button as="prev"` and `Button as="next"` templates define only appearance.

<a id="强制-hug"></a>

### Forced Hug

```svelte
<Pagination widthMode="hug" page={1} total={5}>
    <Button as="current" />
    <Button as="page" />
</Pagination>
```

<a id="自定义角色模板"></a>

### Custom role template

```svelte
<Pagination page={2} total={22}>
    <Button as="current" variant="filled" />
    <Button as="page" variant="outline" />
    <Button as="prev">Previous page</Button>
    <Button as="next">Next page</Button>
</Pagination>
```

Pagination only copies the appearance attributes of the template and replaces the page number text; clicks and availability are managed by Pagination.

<a id="单页禁用"></a>

### Single-page disabled

```svelte
<Pagination page={1} total={5} disabledPages={[3]}>
    <Button as="current" />
    <Button as="page" />
</Pagination>
```

Page 3 will be marked as unclickable, and other non-current pages can still trigger `onPageChange`.

<a id="设计稿样式还原"></a>

### Design draft style restoration

```svelte
<Pagination page={1} total={22} style="width: 21.25rem;">
    <Button as="current" variant="gray" />
    <Button as="page" variant="outline" />
    <Button as="prev" variant="outline" bare iconOnly aria-label="Previous page">
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M20.68 7.293a.943.943 0 0 1 0 1.414l-7.18 6.586a.943.943 0 0 0 0 1.414l7.18 6.586a.943.943 0 0 1 0 1.414c-.425.39-1.116.39-1.541 0l-7.181-6.586c-1.277-1.171-1.277-3.07 0-4.242l7.18-6.586a1.16 1.16 0 0 1 1.543 0" clip-rule="evenodd" /></svg>
    </Button>
    <Button as="next" variant="outline" bare iconOnly aria-label="Next page">
        <svg viewBox="0 0 32 32"><path fill="currentColor" fill-rule="evenodd" d="M11.32 24.707a.943.943 0 0 1 0-1.414l7.18-6.586a.943.943 0 0 0 0-1.414l-7.18-6.586a.943.943 0 0 1 0-1.414 1.16 1.16 0 0 1 1.541 0l7.181 6.586c1.277 1.171 1.277 3.07 0 4.242l-7.18 6.586c-.427.39-1.117.39-1.543 0" clip-rule="evenodd" /></svg>
    </Button>
</Pagination>
```

This example uses the `variant` of the Button and the design draft `ArrowLineLeft/Right` SVG to restore the gray background current page, the stroke ordinary page and the stroke arrow button in Figma.

<a id="完全默认样式"></a>

### Completely default style

```svelte
<Pagination page={1} total={22} />
```

When the sub-level template is not passed at all, Pagination will use the built-in Button and arrow icon to generate all the visible items.

<a id="受控页码"></a>

### Controlled page number

```svelte
<script lang="ts">
    let page = $state(1);
</script>

<Pagination page={page} total={22} onPageChange={(next) => (page = next)}>
    <Button as="current" />
    <Button as="page" />
    <Button as="prev">Previous page</Button>
    <Button as="next">Next page</Button>
</Pagination>
```

`onPageChange` will only be triggered when the target page can be clicked. The current page, disabled page, cross-bound page, the prev of the first page, and the next of the last page will not trigger the callback.

<a id="行为宽度与布局规则"></a>

### Behavior, width modes, and layout rules

Primary layout model: **inline shell layout** (source reference: `docs/standards/LayoutProtocol.md` section 12.4). The root is `nav` (`inline-flex`, `min-width: 0`, default group `gap=4px`). Both standalone and inside Table / DataTable, Pagination hides automatically when empty or `total <= 1`, rendering only when more than one page exists.

- **Width modes**: `widthMode="fill"` (default) sets root width to `100%` and distributes remaining width evenly across page and prev/next buttons while keeping ellipses and `pageSize` at content width; `widthMode="hug"` keeps content width; `widthMode="auto"` fills fixed or stretched containers and falls back to Hug otherwise.
- **Click, disabled, and skip rules**: Disable precedence is `disabled` > no available page in `prev / next` direction > `disabledPages` > `current`. `prev / next` skip consecutive `disabledPages` to target the nearest enabled page; the current page emits `aria-current="page"`, `data-current="page"`, and `aria-disabled="true"`; ellipses emit `aria-hidden="true"` and stay out of tab order.
- **Styling boundaries**: Pagination controls only generated item width mode, page labels, interactivity, and ARIA state without rewriting explicit Button template `variant`, size, radius, or hover/focus visuals; selectors use low-specificity `:global(:where(...))` and Frame timing variables.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
