# Separator API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `row` | `boolean` | false | Horizontal separator, matching the Frame orientation syntax. |
| `column` | `boolean` | false | Vertical separator, matching the Frame orientation syntax. |
| `length` | `string \| number` | — | Length along the main axis; numeric values are treated as pixels. |
| `thickness` | `string \| number` | — | Line width, defaulting to 0.5px (equivalent to var(--border-1)). |
| `rounded` | `boolean` | true | Whether the line ends are rounded; rounded by default. |
| `decorative` | `boolean` | true | Whether the separator is decorative; by default it outputs aria-hidden="true". |
| `children` | `Snippet` | — | Reserved for a separator that includes text. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
