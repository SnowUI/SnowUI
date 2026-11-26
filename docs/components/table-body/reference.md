# TableBody full reference

Reviewed against Chinese source SHA-256 `d92af4f8aa73e8be30542e9c00797771d8c03abd6ecb3049448e2163fcf7ecad`.

<a id="tablebody"></a>

# TableBody

<a id="组件介绍"></a>

## Overview

Organize Table data rows with native table-body semantics for records and custom row content.

<a id="使用选择"></a>

## When to use it

Use TableBody as the Table body containing TableRow. Use the existing loading protocol, and do not put invalid page-layout elements inside `<tbody>`.

- Place only normal business rows in `children`; hide them during initial loading and show column-shaped Skeleton rows.
- `parts` configures generated loading rows and Spinner, not explicit business rows.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { TableBody, Table, TableHeader, TableHead, TableRow, TableCell, Button } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Component documentation" >
<TableHeader><TableRow><TableHead columnId="0">Component</TableHead><TableHead columnId="1">Status</TableHead></TableRow></TableHeader>
<TableBody >
<TableRow ><TableCell columnId="0">Dialog</TableCell><TableCell columnId="1">Published</TableCell></TableRow>
<TableRow ><TableCell columnId="0">Table</TableCell><TableCell columnId="1">In review</TableCell></TableRow>
<TableRow ><TableCell columnId="0">Popover</TableCell><TableCell columnId="1">Draft</TableCell></TableRow>
</TableBody>
</Table>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| loading | `boolean` | — | During initial loading, hide business children and render Skeleton rows from registered column structure. Default: Table context. |
| rowCount | `number` | — | Known data-row count. During initial loading, render that many Skeleton rows; 0 yields none. Default: unspecified. |
| loadingSpinner | `boolean` | — | Keep business children and append a centered, spanning Spinner row. Default: Table context. |
| continuousHover | `boolean` | `true` | Use one container-level moving hover layer; disabling it removes row hover backgrounds. |
| children | `Snippet` | — | Normal data rows, not rendered during initial Skeleton loading. |
| parts | `ComponentPartsOf<{ TableRow: typeof TableRow; TableCell: typeof TableCell; Spinner: typeof Spinner; }>` | — | Configure generated TableRow, TableCell, and Spinner for placeholders and loading rows. Configure explicit business rows separately. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Two modes for generated components

- `parts.TableRow` / `parts.TableCell` configure rows and cells generated for initial loading.
- `parts.Spinner` configures the Spinner shown while existing data loads.
- `parts` does not recurse into TableCell; configure deeper children through their own parts.

```svelte
<TableBody><TableRow><TableCell>Content</TableCell></TableRow></TableBody>
```

<a id="首次加载协议"></a>

<a id="首次加载协议-1"></a>

### Initial loading protocol

TableBody reads columns explicitly registered by TableHead from the same Table context. During initial loading it generates real 40px TableRow/TableCell skeleton rows, using `Skeleton variant="line"` in ordinary content columns. Selection/actions columns retain valid cells and column geometry without interactive controls.

Skeleton lines stagger between 54% and 76% width across rows and columns. Override them at TableBody or an ancestor with `--snowui-table-body-skeleton-width-override`.

Independent Table can be directly declared:

```svelte
<Table>
    <TableHeader>...</TableHeader>
    <TableBody loading />
</Table>
```

Inside DataTable, do not pass `loading` again. DataTable enables it in context only during initial loading with no rows and uses normalized `pageSize` for Skeleton row count. A known `rowCount` overrides pagination context. Standalone Table estimates row count from the visible remaining height of the nearest external vertical scroll/clipping container, or the viewport otherwise. Divide by the default 40px (2.5rem) row height, round down, and render at least one row. Explicit `rowCount={0}` renders none. During loading, `children` are not rendered; the component does not mount and hide business content to guess row count.

<a id="已有数据加载-spinner"></a>

<a id="已有数据加载-spinner-1"></a>

### Loading Spinner with existing rows

When DataTable is `loading` or `refreshing` with visible rows, it enables `loadingSpinner` through context. TableBody retains those rows and appends a non-interactive loading row. Its cell spans the number of columns registered by TableHead and centers SnowUI `<Spinner size={16} />` horizontally and vertically. Set its size through outer `<Table loadingSpinnerSize={...}>`; default is 16 × 16px.

The Spinner row always has a transparent background and does not count for striped alternation, so adding or removing it does not change data-row striping.

Independent Table can explicitly declare `<TableBody loadingSpinner>`.

A page may place a manual load-more button after data rows as an ordinary TableBody child and call `DataTableRenderState.loadMore()`. The automatic sentinel is outside native table structure: DataTable positions it absolutely inside its root without taking layout space; the page sets `loadMoreMode="auto"`. During requests DataTable shows the TableBody Spinner. When new rows begin to fade in, it hides Spinner and ordinary TableCells obtain entry motion from context. The page need not maintain rows or set `whileAppear` manually.

<a id="keyword"></a>

<a id="keyword-1"></a>

### Keyword

| Keyword | Description |
| --- | --- |
| component | Current public component contract |

- The root node must maintain `tbody`, and TableCell with colspan can be used in the empty state.

<a id="连续-hover"></a>

<a id="连续-hover-1"></a>

### Continuous Hover

`continuousHover` defaults to `true`. Its visual layer lives in Table’s local horizontal scroll viewport and is clipped to the visible table; `<tbody>` owns measurement and interaction. It follows real rows only, skipping Skeleton and Spinner rows. Because Table rows have no gaps, direct geometry lets the pointer hit the current row without per-row ResizeObservers or scanning all rows on pointermove. TableRow/TableCell do not paint separate hover backgrounds; disabling `continuousHover` removes row backgrounds.

<a id="2026-11-13-行为同步"></a>

### Behavior updates (2026-11-13)

When not loading and no data rows exist, a localized No data row spans all columns. It uses left-aligned 12px text, 40px row height and table padding. It does not participate in continuous hover and is hidden when real rows or loading indicators exist.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
