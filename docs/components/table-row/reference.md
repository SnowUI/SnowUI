# TableRow full reference

Reviewed against Chinese source SHA-256 `aefd3dc06e6894dee9868a3904d0fdf02b3c9d3caba32d705a732c2bdc45b0f6`.

<a id="tablerow"></a>

# TableRow

<a id="组件介绍"></a>

## Overview

Organize a row of header or data cells with consistent hover and interaction feedback, suitable for browsable and actionable records.

<a id="使用选择"></a>

## When to use it

Organize a table row. In DataTable, pass a rowId that matches rowKey. Declare row preview through DataTable onRowPreview; do not assume clicking any content selects the row.

- Use TableCell or TableHead as children to preserve a valid row structure.
- In DataTable, rowId must match rowKey. active is a visual state; configure click handling and selection separately.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { TableRow, Chip, Table, TableHeader, TableHead, TableBody, TableCell, Button } from '@snowui-design-system/components';
</script>

<Table ariaLabel="Component review queue" minWidth={540}>
	<TableHeader><TableRow><TableHead columnId="component">Component</TableHead><TableHead columnId="owner">Owner</TableHead><TableHead columnId="status">Status</TableHead></TableRow></TableHeader>
	<TableBody>
		<TableRow rowId="data-table"><TableCell columnId="component">DataTable</TableCell><TableCell columnId="owner">Site team</TableCell><TableCell columnId="status"><Chip variant="background" style="color: var(--secondary-indigo);">In review</Chip></TableCell></TableRow>
		<TableRow rowId="pagination"><TableCell columnId="component">Pagination</TableCell><TableCell columnId="owner">Components team</TableCell><TableCell columnId="status"><Chip variant="background" style="color: var(--secondary-indigo);">Queued</Chip></TableCell></TableRow>
	</TableBody>
</Table>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| rowId | `string \| number` | — | Stable row identity. DataTable selection and preview find the record by this ID, which should match DataTable rowKey. |
| active | `boolean` | `false` | Persistent active background set by the consumer or an external condition. It does not select the row or its Checkbox. |
| children | `Snippet` | — | TableCell or TableHead content for the current row, with no arguments. Preserve a valid `tr` child structure. |
| onclick | `(event: MouseEvent) => void` | — | Called first on row click with MouseEvent. preventDefault can stop subsequent built-in selection hits and row preview. Interactive descendants do not trigger row preview. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="keyword"></a>

<a id="keyword-1"></a>

### Keyword

| Keyword | Description |
| --- | --- |
| component | Current public component contract |

- Row active is an externally controlled visual state; selected comes only from Table Context. Neither state implies the other.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
