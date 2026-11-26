# TableHead full reference

Reviewed against Chinese source SHA-256 `f849b0388ce23249c387bcb91db7b889d9106a5124962f24c41a37481a158e28`.

<a id="tablehead"></a>

# TableHead

Sortable header labels and icons use Frame singleLine and stay together during refresh and column resizing.

<a id="组件介绍"></a>

## Overview

Define Table column headers, with optional sorting and column resizing to help users understand and organize data.

<a id="使用选择"></a>

## When to use it

Use it for header cells in Table or DataTable. DataTable coordinates data sorting; resizing and sorting are separate capabilities, so `resizable` does not imply sortable.

- `columnId` identifies the column; `resizable` controls width adjustment. Independent `sortDirection` and `onSortChange` express sorting state.
- The selection role uses DataTable’s select-all control. `parts` configures generated Indicator and Checkbox; configure an explicit title directly.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { TableHead, Table, TableHeader, TableRow, TableBody, TableCell, Button } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Recently updated component documentation" minWidth={560}>
	<TableHeader><TableRow>
		<TableHead columnId="component">Component</TableHead>
		<TableHead columnId="updated" defaultSort="descending" defaultSortActive>Updated</TableHead>
		<TableHead columnId="coverage" align="end" resizable={false}>API coverage</TableHead>
	</TableRow></TableHeader>
	<TableBody>
		<TableRow rowId="dialog"><TableCell columnId="component">Dialog</TableCell><TableCell columnId="updated">2026-08-28</TableCell><TableCell columnId="coverage" align="end">100%</TableCell></TableRow>
		<TableRow rowId="table"><TableCell columnId="component">Table</TableCell><TableCell columnId="updated">2026-08-27</TableCell><TableCell columnId="coverage" align="end">96%</TableCell></TableRow>
	</TableBody>
</Table>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| responsiveHide | `boolean` | `true` | When horizontal scrolling is off, allow ordinary columns to hide automatically; `false` keeps them visible. The first ordinary column and role columns never hide. |
| columnId | `string` | — | Stable column ID. Role columns use built-in IDs; ordinary columns must declare one. |
| label | `string` | — | Readable column name for the TableToolbar sorting list and the column-width handle. Without it, the sorting list falls back to `columnId`, while the handle uses a localized generic name and never announces the internal ID. |
| sortDirection | `"ascending" \| "descending"` | — | Independently controlled sorting direction; otherwise derived from Table context. |
| defaultSort | `"ascending" \| "descending"` | — | Declare this column as the table’s default ascending or descending sort, while keeping it sortable. |
| defaultSortActive | `boolean` | `false` | Show active styling and an icon even in the `defaultSort` direction, adding an unsorted state to the interaction cycle. |
| roleLayout | `TableRoleLayout` | — | Override role-column layout for this role header. Ordinary headers ignore it; default comes from Table context. |
| onSortChange | `(direction: "ascending" \| "descending" \| undefined) => void` | — | Three-state sort callback for standalone use. |
| resizable | `boolean` | — | Show a resize handle; an explicit value overrides Table context. Defaults: Table `false`, DataTable `true`. |
| minWidth | `number` | `64` | Minimum resized width in CSS px; applies only when resizing is enabled. |
| maxWidth | `number` | `Infinity` | Maximum resized width in CSS px; `Infinity` adds no upper limit. |
| align | `"start" \| "center" \| "end"` | `"start"` | Align header content at start, center, or end without changing sorting. |
| children | `Snippet` | — | Parameterless header content: text, icons, resource icons, or other components. Sortable headers add a built-in sort button; the selection role uses its built-in select-all control. |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator; Checkbox: typeof Checkbox; }>` | — | Configure generated resize Indicator and select-all Checkbox; explicit children are configured directly. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="图标与组件标题"></a>

### Icon and component title

Table and DataTable share TableHead. `children` is the title slot; no extra icon or header Prop is needed. Resource icons, Icons, Chips, or custom display components participate in native width measurement, alignment, and responsive column collection. Static titles use inline boxes; block-level content and built-in sort buttons follow the column alignment too.

```svelte
<script lang="ts">
    import { TableHead, Chip } from '@snowui-design-system/components';
    import { CurrencyDollar } from '@snowui-design-system/resource-svelte';
</script>

<TableHead columnId="amount" label="Amount in USD" align="end" title="Amount in USD">
    <CurrencyDollar size={16} role="img" aria-label="Amount in USD" />
</TableHead>
<TableHead columnId="status" label="Payment status"><Chip>Payment status</Chip></TableHead>
```

An icon-only title needs an accessible name. `label` names the column in the TableToolbar sorting list and its column-width handle; it does not automatically name the header or sort button. Give the icon `role="img"` and `aria-label` so its title and enclosing sort button are meaningful. Sortable content is placed inside the built-in button, so use only noninteractive children; do not nest links, buttons, or inputs. Selection headers use the built-in select-all Checkbox.

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Generated component configuration

- `parts.Indicator` configures the generated resize Indicator.
- `parts.Checkbox` configures the selection header’s select-all Checkbox.
- Sorting, selection, and resize events remain owned by TableHead and cannot be overridden through `parts`.

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| as | `selection \| actions` | - | Set the role column. Role columns do not sort or resize. |
| minWidth / maxWidth | `number` | `64 / Infinity` | Resize constraints. |

Sort state maps to aria-sort. Only the default direction of the DataTable defaultSort column omits the active state and icon, unless defaultSortActive is enabled. Other sorted states show an icon. Following numeric direction, ascending (A→Z, 0→9, early→late) shows ArrowsUp; descending shows ArrowsDown. The icon is nominally 16px and stays at least 4 CSS px from title content as root font or gap scale shrinks. The icon does not shrink, and the title retains its one-line truncation.

Interactive cycle:

- `defaultSort` hit column: default direction (no icon) → reverse (with icon) → default direction (no icon).
- Other columns: no sorting → ascending (ArrowsUp) → descending (ArrowsDown) → no sorting.

Sortable headers follow the shared colorless text/Icon hover rule: keep Black/100% as the source and raise opacity from 0.4 to 1. Hover, keyboard focus, and active sort use opacity 1, matching the icon and text. Unsortable columns render no button or hover/click state.

No `sortable` Prop is needed. DataTable infers sortability from the matching raw row field or `sorters[columnId]`. Standalone TableHead enables sorting when `sortDirection` or `onSortChange` is declared. Columns without sorting rules render no button.

Ordinary Table columns do not resize by default; pass `resizable` to TableHead to enable it. DataTable ordinary columns with `columnId` resize by default; pass `resizable={false}` to disable. `as="selection"` and `as="actions"` role columns never resize. Use `resizable={false}` for a fixed-width column. Headers and TableCells share responsive horizontal padding from 4px to 12px; a narrow screen commonly uses 4px per side for at least 8px between adjacent columns, with 8px vertical padding. First and last visible cells and role overlays retain at least 8px toward the outer edge.

Without a fixed column width, the header’s unwrapped min-content participates in Table auto sizing alongside same-column TableCells. A narrow host therefore does not break titles letter by letter. Explicit `columnWidths`, drag widths, and other fixed widths take precedence; overflow titles still use the header truncation rule.

Without `defaultSort`, TableHead does not treat the first column as implicitly sorted. When no column has active sorting, DataTable preserves the order of `rows` or `filteredRows` supplied by the parent.

<a id="双击列宽手柄"></a>

<a id="双击列宽手柄-1"></a>

### Double-click the resize handle

- Double-clicking Indicator on a default single-line column fits the widest currently rendered cell and header content, including icons, gaps, padding, and sort-icon space. It does not scan unloaded server data.
- If any same-column cell has explicit `nowrap={false}`, double-click restores the width from before the first drag. Prefer external `columnWidths` for that baseline; otherwise use the measured initial layout width to avoid unbounded growth from long text.
- Clamp the result to `minWidth`/`maxWidth` and preserve other columns. Update `columnWidths` binding and callback; Table may scroll horizontally if needed.
- Double-click does not sort and is unavailable with `resizable={false}`. Repeat double-click to measure current-page content again. Row changes retain the same initial baseline until Table remounts.

<a id="角色列"></a>

<a id="角色列-1"></a>

### Role column

- `as="selection"` renders the built-in select-all Checkbox. Its resident role-column layout always shows it; in overlay mode it appears on first-header hover, direct hover, or keyboard focus. Partial selection uses indeterminate. Table responsive rules set horizontal padding.
- `as="actions"` has no title or business button by default. Pass children for a custom title. Table responsive rules set horizontal padding.
- `roleLayout="overlay"` gives role headers zero width and sticks them to the left or right edge. Selection Checkbox and any actions title use responsive horizontal padding. Real first and last header cells keep square corners; floating controls may use a 12px radius. The control overlay defaults to one-third of its original width. Its blur layer starts hidden and becomes visible on header hover, using shared Progressive Blur from `components/src/lib/progressive-blur.ts` and a segmented mask. Selection fades from strong left to clear right; actions reverse that direction.
- The first real title behind a selection overlay starts its transparent region at the Checkbox’s actual right edge, then fades over `--size-5` (20px nominally) to the right, matching row Checkbox/button columns. Override with `--snowui-table-head-fade-start-override` and `--snowui-table-head-fade-end-override`.
- The overlay select-all Checkbox appears progressively. When pointer leaves the header and control with no keyboard focus inside, remove it in the same frame as the title mask to avoid an afterglow. Preserve focusable DOM without visibility hiding so keyboard access remains possible.
- Both roles use explicit combination contracts and do not guess the column identity through DOM scanning.

Each TableHead registers its public column structure (`columnId`, selection/actions role, and alignment) with the nearest Table Context. TableBody uses this order to generate Skeleton rows on first load. Registration does not expose or scan TableHead’s private DOM.

Only data headers adjacent to selection/actions role columns include fade sampling layout boxes. Other columns omit them so incremental loading does not lock width or create horizontal scroll from invisible masks. Sampling width comes from the role overlay width, not ordinary data-column width.

<a id="排序类型决策"></a>

<a id="排序类型决策-1"></a>

### Sort value type inference

TableHead **does not declare a content type** or expose `sortType="text | number | date"`. DataTable compares raw row fields:

- `Date` values compare by timestamp.
- `number` values compare numerically, so Unix timestamps sort in time order.
- ISO 8601 date-time strings with time zones are converted to timestamps before comparison.
- Other strings use localized, case-insensitive natural order with numeric segments.
- For derived display values, DataTable `sorters[columnId]` returns a comparable raw value.

This prevents formatted text such as `Just now` or `$1,299` from driving sort order and avoids redeclaring types already known to the data layer.

<a id="默认排序声明"></a>

<a id="默认排序声明-1"></a>

### Default sorting declaration

The default sorting is directly declared by the corresponding column header:

```svelte
<TableHead columnId="createdAt" defaultSort="descending">Date</TableHead>
```

One DataTable may have only one TableHead declaring `defaultSort`. It takes precedence over the legacy DataTable-level `defaultSort={{ columnId, direction }}` object, retained for compatibility.

In the default direction, the column normally has no active styling and cycles “default → reverse → default.” To show that state as active:

```svelte
<TableHead
    columnId="createdAt"
    defaultSort="descending"
    defaultSortActive
>
    Date
</TableHead>
```

`defaultSortActive` changes behavior as well as appearance: “default (active) → reverse (active) → unsorted → default (active).”

<a id="keyword"></a>

<a id="2026-11-13-行为同步"></a>

### Behavior updates (2026-11-13)

Columns register during SSR before TableBody renders, so skeleton rows retain the final column count and layout. All variants retain a Black 20 header divider when empty or without search results; this is an exception to the general Black 10 divider rule.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
