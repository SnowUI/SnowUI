# TableHead API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `responsiveHide` | `boolean` | true | Allow this ordinary column to hide automatically when horizontal scrolling is off. false always keeps it. The first ordinary column and role columns do not hide. |
| `columnId` | `string` | — | Stable column identifier. Role columns use built-in identifiers; required for an ordinary column. |
| `label` | `string` | — | Readable column name for the TableToolbar sorting list and column-width handle. Without it, the list falls back to columnId while the handle uses a localized generic name and never announces the internal ID. |
| `sortDirection` | `"ascending" \| "descending"` | — | Independently controlled sort direction. Defaults to context-derived state. |
| `defaultSort` | `"ascending" \| "descending"` | — | Declare ascending or descending sorting of this column as the table default; also makes this column sortable. |
| `defaultSortActive` | `boolean` | false | Show the defaultSort direction as active with an icon and extend the interaction cycle so sorting can be cleared. |
| `roleLayout` | `TableRoleLayout` | — | Override role-column layout for this role header. Ignored by ordinary headers. Defaults to Table context. |
| `onSortChange` | `(direction: "ascending" \| "descending" \| undefined) => void` | — | Three-state sorting callback for independent use. |
| `resizable` | `boolean` | — | Show the column-width handle. An explicit setting takes priority over context. Defaults to false in Table and true in DataTable. |
| `minWidth` | `number` | 64 | Lower bound for column width adjustment in CSS pixels. Applies only when resizing is enabled. |
| `maxWidth` | `number` | Infinity | Upper bound for column width adjustment in CSS pixels. Infinity by default, meaning no additional limit. |
| `align` | `"start" \| "center" \| "end"` | "start" | Header content alignment: start, center, or end. Does not change data sorting. |
| `children` | `Snippet` | — | Header title content with no parameters, including text, Icon, resource icons, or composed components. When sortable it sits in the built-in sort Button; selection-role content is handled by the built-in select-all control. |
| `parts` | `ComponentPartsOf<{ Indicator: typeof Indicator; Checkbox: typeof Checkbox; }>` | — | Configure the built-in resize Indicator and select-all Checkbox, not explicit child content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
