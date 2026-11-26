# TableBody API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | — | During initial loading, hide business children and render Skeleton rows for the registered column structure. Default behavior comes from Table Context. |
| `rowCount` | `number` | — | Known number of data rows. During initial loading, render this many Skeleton rows; zero produces no placeholder rows. Omitted by default. |
| `loadingSpinner` | `boolean` | — | Keep business children and append a centered Spinner loading row spanning the columns. Default behavior comes from Table Context. |
| `continuousHover` | `boolean` | true | Use one container-level continuous hover movement layer. When disabled, no row background is shown. |
| `children` | `Snippet` | — | Normal data rows, not rendered during initial Skeleton loading. |
| `parts` | `ComponentPartsOf<{ TableRow: typeof TableRow; TableCell: typeof TableCell; Spinner: typeof Spinner; }>` | — | Configure generated TableRow, TableCell, and Spinner components, mainly for loading placeholders and the loading row. Configure explicit data rows themselves. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
