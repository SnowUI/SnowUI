# Tab API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Unique current item value; supports bind:value and updates on click or keyboard activation. Missing or unmatched values visually fall back to the first available item without writing back to the binding. |
| `variant` | `TabVariant` | "pill" | Tab appearance variant. |
| `size` | `TabSize` | "sm" | Controls container padding, radius, and gap and provides the default size to direct Button as="item" children. Item size priority is style > class > Button size > Tab size. |
| `row` | `boolean` | false | Explicit horizontal arrangement. It stays horizontal when both row and column are false; row wins when both are true. |
| `column` | `boolean` | false | Vertical arrangement, following Frame syntax. |
| `fill` | `boolean` | false | Figma fill width: when the container has an explicit width, distribute horizontal items equally to fill it. |
| `onChange` | `(value: string) => void` | — | Called with the new value after the user activates a different item. Activating the current item again does not call it; this callback cannot cancel selection. |
| `selectionFollowsFocus` | `boolean` | false | Whether arrow keys activate an item immediately. Tab defaults to false (move focus, then Enter activates); Segmented defaults to true. |
| `role` | `string` | "tablist" | ARIA role of the container. |
| `itemRole` | `string` | — | ARIA role written to child items. When omitted, Button semantics remain. Tab examples explicitly set tab; radio also synchronizes aria-checked, while other roles synchronize aria-selected. |
| `children` | `Snippet` | — | Explicit Button or CopyButton as="item" children with unique values; replaces items. |
| `items` | `TabItem[]` | [] | Generated item data. Each requires a unique value and readable label; an icon component and disabled state are optional. Icons generate Icon plus Text, and disabled items are skipped by keyboard selection. Ignored when children is present. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Icon: typeof Icon; Text: typeof Text; }>` | — | Bulk configuration for generated Button, Icon, and Text, such as parts.Button.scaleOnHover. Explicit children do not use this configuration. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
