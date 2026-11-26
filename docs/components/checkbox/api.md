# Checkbox API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | false | Selected state; supports two-way binding. |
| `group` | `any[]` | — | Array of selected values for a group; bind it together with each option’s value. |
| `value` | `any` | — | Value used in form submission and group selection. |
| `size` | `ResourceSize \| number` | — | Component size in pixels, following the Icon size scale: 12, 16, 20, 24, 28, 32, 40, 48, or 80. |
| `required` | `boolean` | false | Participates in native required validation. Empty submission briefly pulses the red border without text, then restores the original state and keeps the focus ring color. |
| `name` | `string` | — | Native input name; use matching names for a radio group. |
| `form` | `string` | — | Associated form element id. |
| `disabled` | `boolean` | false | Disable user interaction. |
| `indeterminate` | `boolean` | false | Partially selected state; supports two-way binding. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Callback after the native checked state changes. |
| `ariaLabel` | `string` | — | Accessible name when no visible label is provided. |
| `children` | `Snippet` | — | Visible label content. |
| `singleLine` | `boolean` | true | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} for a full-text tooltip. |
| `gap` | `number` | — | Inherited Frame gap token index. Omit it for the original component gap; explicit values override the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| `enableResponsive` | `boolean` | false | Enable responsive behavior. |
| `enableContext` | `boolean` | false | Enable component context. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
