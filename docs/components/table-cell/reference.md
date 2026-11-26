# TableCell full reference

Reviewed against Chinese source SHA-256 `081646aa3c082428e91df8db869fb7cd901032d6fdcc601de27f6f77a00eabce`.

<a id="tablecell"></a>

# TableCell

<a id="组件介绍"></a>

## Overview

Show text, components, or custom content in a Table data cell. Long content truncates to one line by default.

<a id="使用选择"></a>

## When to use it

Use inside TableRow. Selection and actions roles apply only when their corresponding DataTable features are enabled; explicit cell content replaces the default.

- Place inside TableRow and align with a column using `columnId`; `lines` / `tooltip` control long content.
- DataTable enables selection and actions columns. Explicit `children` in an actions cell replace the default actions.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { TableCell, Badge, Link, Table, TableHeader, TableHead, TableBody, TableRow, Chip } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Component documentation details" minWidth={620} columnWidths={{ component: 160 }}>
	<TableHeader><TableRow><TableHead columnId="component">Component</TableHead><TableHead columnId="summary">Summary</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
	<TableBody><TableRow rowId="data-table">
		<TableCell columnId="component" singleLine><Link onclick={(event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); }} onauxclick={(event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); }} href="/components/data-table">DataTable</Link><Badge count="New" variant="border" /></TableCell>
		<TableCell columnId="summary" lines={2} tooltip>Coordinates search, filtering, sorting, selection, responsive row actions, and pagination while keeping table composition explicit.</TableCell>
		<TableCell columnId="status" align="end"><Chip variant="background" style="color: var(--secondary-indigo);">Review</Chip></TableCell>
	</TableRow></TableBody>
</Table>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| columnId | `string` | — | Share the column width with the table header |
| lines | `false \| 1 \| 2 \| 3` | `1` | Number of truncation lines; `false` disables truncation. |
| tooltip | `TooltipProp` | `true` | Show full or custom tooltip content on overflow. |
| onTruncate | `(isTruncated: boolean) => void` | — | Actual overflow state changes. |
| align | `"start" \| "center" \| "end"` | `"start"` | Content alignment. Default: `start`. |
| roleLayout | `TableRoleLayout` | — | Override the role-column layout for this role cell; ignored by ordinary cells. Default: Table context. |
| singleLine | `boolean` | `false` | Apply the single-line preset to internal content without changing native td table layout. Enables row, nowrap, one line and at least 4px spacing. Use Text lines={1} for shrinkable labels and full-text hints. |
| nowrap | `boolean` | — | Prevent text wrapping; with `row`, also prevent flex children wrapping. Default: `true` (false with `lines=2/3`). |
| skeleton | `boolean` | `false` | Internal TableBody Skeleton-row protocol: render non-interactive placeholder content and disable truncation. |
| children | `Snippet` | — | Parameterless cell content. Explicit actions content replaces default actions; DataTable still manages the selection role. |
| parts | `ComponentPartsOf<{ Tooltip: typeof Tooltip; Checkbox: typeof Checkbox; }>` | — | Configure this cell’s generated truncation Tooltip and selection Checkbox only. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Two modes for generated components

- `parts.Tooltip` configures the truncation hint.
- `parts.Checkbox` configures the selection-role Checkbox.
- Skeleton is loading infrastructure, not a public part.

Cells default to 40px height with 8px vertical padding. Horizontal padding follows the nearest Table container between 4px and 12px; common narrow widths reach 4px per side and wide tables restore 12px. The outside edge of each first and last visible cell retains at least 8px. Native adjacent columns have no extra gap; neighboring cell padding provides at least 8px between content. Internal content defaults to an 8px gap and accepts row, gap and nowrap without an extra Frame. Horizontal content is vertically centered without inline-baseline descender space. Combining row with single-line truncation preserves horizontal layout; narrow text fitting must not turn it into block text flow or discard graphics/text spacing.

Without explicit fixed column width, a cell’s intrinsic min-content affects Table automatic sizing: wrappable content keeps its longest unbreakable word or fragment, while `lines={1}` or `nowrap` keeps the whole line. Explicit `columnWidths`, dragged widths, or other fixed widths take precedence; `lines` / tooltip rules still truncate.

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| row | `boolean` | `false` | The internal content uses horizontal flex layout, and the root `<td>` semantics remains unchanged. |
| gap | `number` | `2` | Internal content spacing, default 8px, corresponding to `--gap-{n}` token |
| as | `selection \| actions` | - | Explicit role column; role mode disables default truncation. |

```svelte
<TableCell columnId="name">Text of unknown length</TableCell>
<TableCell lines={false}><Avatar /> Any composed content</TableCell>
<TableCell row gap={1} nowrap>$19.9 <Question /></TableCell>
<TableCell as="selection" />
<TableCell as="actions"><Button bare>More</Button></TableCell>
```

`as="selection"` provides a built-in row Checkbox and requires stable `rowId` from the parent TableRow. In permanent `column` layout, it is always visible and uses responsive Table padding. In `overlay`, it appears on row hover, keyboard focus, or selection.

`as="actions"` has no built-in default buttons; `children` can provide any action buttons. In permanent `column` layout they remain visible; in `overlay` they appear on row hover, keyboard focus, or an open menu. Inner layout is horizontal with 8px gap and responsive Table padding.

When `roleLayout="overlay"`, the selection/actions cell's own width is zero and sticky to the left and right edges of the table. The real `<td>` of selection only retains the table semantics and positioning anchors; Checkbox and progressive fuzzy layers are placed in `.snowui-table-selection-control`, and are synchronized by runtime as `position: fixed`, fixed to the upper left corner of the current line. Checkbox uses `calc(var(--size-4) + 0.0625rem)` (17px) by default, leaving 16px up and down within the current odd pixel row height; the fixed increment has been registered as a special case of Table selection, and does not borrow the border Token, nor does it change the 16px default value of the independent Checkbox. The cover block does not push away the content of the first column, but directly presses on the first column. The positioning of the overlay block is retained when the selection is canceled; when the visible conditions are no longer met, it is synchronously hidden with the mask and does not produce transverse displacement. The transparent area of the first data column covers the actual right edge of the Checkbox, and uses the fixed `--size-5` (nominal 20px) to the right to transition; according to the actual control size and responsive spacing positioning, do not scale according to the column width. The fade mask is synchronized with the visible state of Checkbox: line hover, keyboard focus, selected or force-hover are all effective; remove the mouse after selecting and keep the mask. When it is not selected and there is no visible focus on the keyboard, after leaving the hover, the Checkbox and the mask will be withdrawn in the same frame, and the fading aftergow will not be retained; the fade and the focus of the keyboard will remain unchanged.

The selection overlay must sit above first-column content using the highest `z-index`; consumers should not raise links or icons in that column above it. The Checkbox is interactive: `onCheckedChange` writes Table selection and stops propagation. TableRow also handles clicks in the leftmost 32px so a hit on underlying first-column content toggles row selection before a link can navigate.

The selection `.snowui-table-role-blur-layer` shares a container with Checkbox and uses the general Progressive Blur in `components/src/lib/progressive-blur.ts`. `width` sets visible blur width, `sampleExtension` adds a transparent sampling area, and `maxBlur` uses `--snowui-table-role-overlay-blur-override`. Selection is strongest at left and clears to the right; actions reverse that direction. The layer has `pointer-events: none` and `aria-hidden`, appearing only on row hover, focus-within, or selection.

Actions anchor to the visible row’s right edge and remain inside the Table viewport during horizontal scroll. Content fade depends continuously on actual button-group width and each content block’s distance from that edge; when buttons cover multiple columns, all covered ordinary content fades. The transparent area reaches the left edge of the leftmost button, with a fixed `--size-5` (nominal 20px) transition to the left. It scales only with global tokens, not button width or responsive padding. Selection and actions masks may overlap without covering the controls.

Actions appear as a right-side overlay. Its container ignores pointer events; only visible inner buttons accept them, so a fixed row-wide layer cannot block the left Checkbox or middle links. On hover exit without an open action menu, hide the entire actions overlay immediately alongside its content mask, avoiding fade remnants over restored text. Entry still fades in; selected-row visibility remains independent.

Ordinary TableCells consume DataTable incremental-row entry motion together, fading their opacity. Selection/actions role cells stay fully opaque so hover controls are not multiplied by row opacity. Explicit `whileAppear` / `currentState` on TableCell takes precedence.

Row click protocol: links, buttons, inputs, labels, and ARIA buttons/checkboxes do not toggle selection. Clicking non-interactive blank space toggles the current row; clicking again deselects it.

<a id="keyword"></a>

<a id="keyword-1"></a>

### Keyword

| Keyword | Description |
| --- | --- |
| component | Current public component contract |

- Default one-line truncation registers with the current Table’s `TableTruncationManager`. Observe only the viewport/table, never reinstate per-cell ResizeObservers.
- Ordinary cells use a native `<td>` fast path without advanced Frame features, falling back to full Frame when such features are declared.
- A child Text with explicit `lines` becomes the nearest truncation owner; Cell does not generate another Tooltip.

<a id="响应式操作布局"></a>

### Responsive action layout

DataTable action cells provide generated and explicit OverflowActions with the same layout budget, default maxVisible=3, and progressive overflow. Explicit groups retain their own limit, compact, overflow, and style settings; availableWidth cannot bypass the table budget. Cells do not define button variants, and the menu is not clipped to the row budget.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
