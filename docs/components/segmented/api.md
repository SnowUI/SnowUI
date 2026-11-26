# Segmented API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Unique value of the current option; supports bind:value and updates when an option is activated by click or arrow key. A missing or unmatched value visually falls back to the first available option without writing back to the binding. Initialize it explicitly in forms. |
| `name` | `string` | — | When nonempty, outputs a hidden field of the same name for native FormData. An undefined value submits as an empty string. Place it inside the form; restore the bound initial business value in reset handling. |
| `children` | `Snippet` | — | Explicit option content with no parameters. Use Button as="item" and a unique value for each option. Takes priority over items and allows Button Props to be set per option. |
| `class` | `string` | "" | External class merged onto the real Tab root while retaining the Segmented marker. Does not affect the hidden form field. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure Buttons generated in items mode through parts.Button, such as scaleOnHover. Does not override explicit child options and does not expose parts.Tab. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
