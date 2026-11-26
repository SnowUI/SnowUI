# TableRow API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rowId` | `string \| number` | — | Stable row identity. DataTable uses this id to find the record for selection and preview; it should match DataTable rowKey. |
| `active` | `boolean` | false | Persistent active background set by the consumer or an external condition. Does not select the row or its Checkbox. |
| `children` | `Snippet` | — | TableCell or TableHead children for this row, with no parameters. Preserve valid tr children. |
| `onclick` | `(event: MouseEvent) => void` | — | Called before built-in selection hit testing and row preview, with a MouseEvent. preventDefault blocks those later actions. Interactive child elements do not trigger row preview. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
