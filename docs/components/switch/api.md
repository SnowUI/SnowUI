# Switch API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | false | Switch state; supports bind:checked. Clicking the label or pressing Space while focused toggles it. The bound variable, visible track, and native input stay in sync. Disabled user input cannot change it. |
| `value` | `any` | — | Value passed to the internal native checkbox. It does not determine switch state or create a selection group. Other attributes such as name and form currently go to the outer label, so value alone does not create a named form entry. |
| `size` | `ResourceSize \| number` | — | Nominal visible track height in pixels at a 16px root font size, with outer spacing counted separately. Accepts 12, 16, 20, 24, 28, 32, 40, 48, 80, or another finite positive number. Without an explicit value, reads iconSize then size from parent size context, then falls back to 16. Invalid numbers use the default size token. Explicit values take priority and scale with the root font size. |
| `required` | `boolean` | false | Participates in native required validation. Empty submission briefly pulses the red border without text, then restores the original state and keeps the focus ring color. |
| `name` | `string` | — | Native input name; use matching names for a radio group. |
| `form` | `string` | — | Associated form element id. |
| `disabled` | `boolean` | false | Disable the native input and user toggling while preserving the current state and label. Removes it from the Tab order. External updates to checked still apply. |
| `children` | `Snippet` | — | Label content displayed after the track. Omit it to show no visible label. The label text gives the internal switch an accessible name and can contain composed text snippets. |
| `singleLine` | `boolean` | true | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} for a full-text tooltip. |
| `gap` | `number` | — | Inherited Frame gap token index. Omit it for the original component gap; explicit values override the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| `enableResponsive` | `boolean` | false | Pass through to the root Frame to enable its container adaptation observer. Does not change the standard Switch size range. See [Frame capability switches](../frame/reference.md). |
| `enableContext` | `boolean` | false | Pass through to the root Frame to control the context it provides to children for state, loading, and motion. Does not control how Switch reads parent size context. See [Frame capability switches](../frame/reference.md). |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
