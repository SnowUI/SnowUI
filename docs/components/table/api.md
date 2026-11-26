# Table API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columnWidths` | `Record<string, number>` | {} | Controlled column widths; supports bind:columnWidths. |
| `horizontalScroll` | `boolean` | — | Keep all columns and scroll horizontally by default. When false, hide eligible columns from right to left first, then scroll if the remaining columns still overflow. |
| `roleLayout` | `TableRoleLayout` | — | auto chooses between a persistent column and a hover overlay according to available space. Explicit column or overlay fixes the layout. |
| `minWidth` | `number \| string` | — | Explicitly increase table minimum width. Without it, minimum width is derived from each column’s min-content plus Cell padding. Overflow stays inside Table’s local horizontal viewport. |
| `ariaLabel` | `string` | — | Business accessible name for the table, kept as supplied. The horizontal scroll region adds a localized scroll hint; without a name, it uses a localized generic label. |
| `loadingSpinnerSize` | `ResourceSize` | 16 | Size of the centered Spinner at the end of the body when more data loads while existing data stays visible. |
| `onColumnWidthsChange` | `(widths: Record<string, number>) => void` | — | Complete column-width snapshot after a drag. |
| `children` | `Snippet` | — | Semantic table content with no parameters. Compose TableHeader and TableBody; an outer DataTable provides data management. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
