# TableCell API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columnId` | `string` | — | Column identity shared with the header for width alignment. |
| `lines` | `false \| 1 \| 2 \| 3` | 1 | Number of lines before truncation; false disables truncation. |
| `tooltip` | `TooltipProp` | true | Show full content or a custom hint after overflow. |
| `onTruncate` | `(isTruncated: boolean) => void` | — | Callback when actual overflow state changes. |
| `align` | `"start" \| "center" \| "end"` | "start" | Content alignment; defaults to start. |
| `roleLayout` | `TableRoleLayout` | — | Override role-column layout for this role cell. Ignored by ordinary cells. Defaults to Table context. |
| `nowrap` | `boolean` | — | Prevent text wrapping. With row, also prevent flex children from wrapping. Defaults to true, except for lines=2 or 3. |
| `singleLine` | `boolean` | false | Apply the shared single-line contract to internal content while retaining native td layout. Enable row, nowrap, one line and at least 4 CSS px spacing. Use Text lines=1 for shrinkable labels and full-text hints. |
| `skeleton` | `boolean` | false | Internal TableBody Skeleton-row protocol. Render a noninteractive placeholder and disable truncation. |
| `children` | `Snippet` | — | Cell content with no parameters. Explicit children replace default actions in an actions role; DataTable still owns selection-role behavior. |
| `parts` | `ComponentPartsOf<{ Tooltip: typeof Tooltip; Checkbox: typeof Checkbox; }>` | — | Configure the built-in truncation Tooltip and selection Checkbox, only for default instances owned by this cell. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
