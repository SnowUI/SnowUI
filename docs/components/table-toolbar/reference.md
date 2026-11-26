# TableToolbar full reference

Reviewed against Chinese source SHA-256 `bb5598588abcf8cbbb3c50425cd3f8c658d968d219f389ed49c3884709387f88`.

<a id="tabletoolbar"></a>

# TableToolbar

The toolbar and its icon-label actions use Frame singleLine. The search field wrapper, including its error-layout wrapper, fills the remaining width and keeps filters on the right without unnecessarily clipping placeholder text.

<a id="组件介绍"></a>

## Overview

Provide DataTable search, sorting, filtering, and batch actions while showing selection state, for data-management interfaces.

<a id="使用选择"></a>

## When to use it

Use only with DataTable for search, sorting, filtering, and batch actions, not as a standalone toolbar for ordinary Table. Use built-in items or explicit public `as` roles; business code owns copy and delete actions.

- Requires DataTable state. `search`, `sort`, and `filter` enable built-in tools; `sortOptions` declares menu choices explicitly.
- Direct `as="search"` / `"bulk"` / `"sort"` / `"filter"` children replace those regions. Business code implements `onCopy` / `onDelete`.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { DataTable, TableToolbar, type DataTableRenderState } from '@snowui-design-system/components';
	import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@snowui-design-system/components';
	type DocRow = { id: number; component: string; category: 'Basic' | 'Composite'; status: string };
	const docs: DocRow[] = [
		{ id: 1, component: 'Button', category: 'Basic', status: 'Published' },
		{ id: 2, component: 'DataTable', category: 'Composite', status: 'Review' },
		{ id: 3, component: 'Tooltip', category: 'Basic', status: 'Published' }
	];
	let tableState = $state<DataTableRenderState<DocRow>>();
	let selectedRowIds = $state<(string | number)[]>([2]);
	function getRowKey(row: DocRow) { return row.id; }
	function copySelection() { /* Copy selected component names. */ }
	function clearSelection() { selectedRowIds = []; }
</script>

<DataTable rows={docs} rowKey={getRowKey} selection bind:state={tableState} bind:selectedRowIds>
	<TableToolbar
		ariaLabel="Component documentation controls"
		search
		sort
		filter
		searchPlaceholder="Search component docs…"
		searchAriaLabel="Search component documentation"
		filterKey="category"
		filterOptions={[{ label: 'Basic', value: 'Basic' }, { label: 'Composite', value: 'Composite' }]}
		copyLabel="Copy component names"
		deleteLabel="Remove from review queue"
		onCopy={copySelection}
		onDelete={clearSelection}
	/>
	<Table ariaLabel="Filtered component documentation">
		<TableHeader><TableRow><TableHead as="selection" /><TableHead columnId="component">Component</TableHead><TableHead columnId="category">Category</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
		<TableBody>{#each tableState?.rows ?? [] as row}<TableRow rowId={row.id}><TableCell as="selection" /><TableCell columnId="component">{row.component}</TableCell><TableCell columnId="category">{row.category}</TableCell><TableCell columnId="status">{row.status}</TableCell></TableRow>{/each}</TableBody>
	</Table>
</DataTable>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| ariaLabel | `string` | `LocaleProvider` | Accessible name for `role="toolbar"`. The default follows LocaleProvider; use distinct names when a page has multiple toolbars. |
| search | `boolean` | `true` | Show the default SearchInput and write its input to the DataTable query; an explicit `as="search"` child replaces it. |
| bulkActionsEnabled | `boolean` | `true` | With selected rows, show the default count and batch-action region. Disabling it does not clear selection. |
| sort | `boolean` | `true` | Show the default sort selector. Choices come from `sortOptions` or sortable headers. |
| sortOptions | `TableToolbarSortOption[]` | — | Customize sort fields and orders, including data fields not displayed as columns. An explicit list replaces automatic headers; an empty list leaves only the default-order option. |
| filter | `boolean` | `true` | Show the default filter selector; `filterKey` and `filterOptions` are required to filter data. |
| searchPlaceholder | `string` | `LocaleProvider` | Placeholder for the default search input; its default follows LocaleProvider. |
| searchAriaLabel | `string` | `LocaleProvider` | Accessible name for the default search input; its default follows LocaleProvider. |
| sortLabel | `string` | `LocaleProvider` | Accessible name and hint for the sort control; defaults follow LocaleProvider. |
| filterLabel | `string` | `LocaleProvider` | Accessible name and hint for the filter control; defaults follow LocaleProvider. |
| filterKey | `string` | — | DataTable filter field. Without it, choosing a filter does not change filter conditions. |
| filterOptions | `TableToolbarFilterOption[]` | `[]` | Filter options with `label` and `value`. Values may be string, number, or undefined; selection compares string forms and writes back the original value. |
| selectedCount | `number` | — | Explicit selected count. When omitted, read selected IDs from DataTable. This changes display and callback arguments only, not the selection set. |
| showClearAction | `boolean` | `true` | Show the clear-selection button in the batch-action region. |
| showCopyAction | `boolean` | `true` | Show the built-in CopyButton in the batch-action region; `onCopy` performs the copy. |
| showDeleteAction | `boolean` | `true` | Show the delete button in the batch-action region; `onDelete` performs deletion. |
| clearLabel | `string` | `LocaleProvider` | Label for the clear-selection button; its default follows LocaleProvider. |
| copyLabel | `string` | `LocaleProvider` | Accessible name and hint for copy; defaults follow LocaleProvider. |
| deleteLabel | `string` | `LocaleProvider` | Accessible name and hint for delete; defaults follow LocaleProvider. |
| selectionLabel | `(count: number) => string` | `LocaleProvider` | Receive selected count and return display text only; the default follows LocaleProvider. |
| onClearSelection | `(count: number) => void` | — | Called with current selection when Clear is clicked. If supplied, replaces default `clearSelection`; the caller must clear selection. |
| onCopy | `(count: number) => void \| Promise<void>` | — | Copy callback receives selected count and may return a Promise. Resolve after the actual copy succeeds and reject on failure. Duplicate batch actions are blocked while it runs. |
| onDelete | `(count: number) => void \| Promise<void>` | — | Delete callback receives selected count and may return a Promise. The callback performs deletion; loading feedback is shown and duplicate batch actions are blocked while it runs. |
| bulkActions | `Snippet<[number]>` | — | Additional batch actions receive selected count, appear only with a selection and enabled batch region, and cannot be used while a default action runs. |
| children | `Snippet` | — | Parameterless explicit toolbar content. Direct children with `as="search"`, `"bulk"`, `"sort"`, or `"filter"` replace the corresponding default regions; other children are action content. |
| parts | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; Spinner: typeof Spinner; SearchInput: typeof SearchInput; Select: typeof Select; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | Configure generated Button, Separator, Spinner, SearchInput, Select, Listbox, and MenuItem instances owned directly by the toolbar; explicit children are not configured recursively. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="组合模式"></a>

<a id="组合模式-1"></a>

### Combination mode

- Built-in mode generates SearchInput, Select, Listbox, MenuItem, Button, CopyButton, Separator, and Spinner from props.
- Explicit composition replaces direct regions with `children` and `as="search|bulk|sort|filter|action"`.
- `parts` configures directly generated children only, without recursing into their internals.
- The toolbar embeds Tooltip in built-in icon-only copy, delete, sort, and filter controls, reusing each label prop as its hint.
- Built-in clear, copy, delete, sort, and filter controls explicitly use `Button bare emphasis="muted"`, retaining the 40% to 100% hover treatment for secondary tools. Override them together through `parts.Button.emphasis`.

Selection counts and bulk actions keep at least 4 CSS px between them. The toolbar remains a single row; when space runs out, its shared local horizontal scrollbar keeps controls reachable. The track has separate space and does not cover controls. It hides again as width recovers or selection clears. Role replacements remain direct children of TableToolbar.

Built-in copy uses `CopyButton bare` and calls `onCopy` through `writeText`. Success feedback lasts 1600ms by default and suppresses duplicates during that time. Resolve the callback only after copying succeeds; reject on failure so errors are not shown as success.

The sort selector reads current DataTable sorting and writes only when the user chooses a new option, so stale toolbar state does not override header sorting.

<a id="排序选项"></a>

<a id="排序选项-1"></a>

### Sorting options

Without `sortOptions`, read sortable headers automatically. With it, each field creates ascending and descending options; names default to `columnId`, which should be unique. DataTable reads ordinary values from `row[columnId]` and derived values from `sorters[columnId]`. Menu configuration neither creates columns nor changes current sorting. The menu always includes “Default order” to restore DataTable’s default order. In server mode, the caller still handles sort requests.

```svelte
<TableToolbar sortOptions={[
  { columnId: 'component', label: 'Component' },
  { columnId: 'priority', label: 'Priority' }
]} />
```

<a id="2026-11-13-行为同步"></a>

### Behavior updates (2026-11-13)

Search and filters synchronize with their owning DataTable, including external query/filters updates. Search fills available space and filter tools align to the right. Do not duplicate query, refresh or count controls on the page.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
