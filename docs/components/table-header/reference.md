# TableHeader full reference

Reviewed against Chinese source SHA-256 `8e7fc33818c577a464f2ecf1dcc78c6fa147913c1b691c4554ef4eefc2ecfcbb`.

<a id="tableheader"></a>

# TableHeader

<a id="组件介绍"></a>

## Overview

Organize the header row of a Table, identify each column, and retain native table header semantics.

<a id="使用选择"></a>

## When to use it

Use as the Table header region, containing a header TableRow and TableHead cells. Preserve native table semantics.

- Place inside Table and use TableRow to organize TableHead cells.
- This component provides only header-region semantics. Configure sorting, column width, and selection through the corresponding TableHead and DataTable.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { TableHeader, Table, TableBody, TableCell, TableRow, TableHead } from '@snowui-design-system/components';
</script>

<Table ariaLabel="SnowUI component catalog columns" minWidth={680}>
	<TableHeader><TableRow>
		<TableHead columnId="component">Component</TableHead>
		<TableHead columnId="package">Package</TableHead>
		<TableHead columnId="category">Category</TableHead>
		<TableHead columnId="updated">Last updated</TableHead>
		<TableHead columnId="status" align="end">Documentation</TableHead>
	</TableRow></TableHeader>
	<TableBody><TableRow rowId="button"><TableCell columnId="component">Button</TableCell><TableCell columnId="package">components</TableCell><TableCell columnId="category">Basic</TableCell><TableCell columnId="updated">Today</TableCell><TableCell columnId="status" align="end">Published</TableCell></TableRow></TableBody>
</Table>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| children | `Snippet` | — | Header-row content with no arguments. Compose TableRow and TableHead while preserving `thead` semantics. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="keyword"></a>

<a id="keyword-1"></a>

### Keyword

| Keyword | Description |
| --- | --- |
| component | Current public component contract |

- The root element must remain `thead`.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
