# Radio API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | false | For a standalone Radio, bind:checked controls selection. Clicking or pressing Space toggles it, and repeating the action clears it. Within a group, selection is determined by whether group strictly equals value. |
| `group` | `any` | — | Bind the same group state to each Radio and provide distinct values. Initialize it to a selected value or null for no selection. Deselecting the current option writes undefined; subsequent group synchronization still works. |
| `value` | `any` | — | Value for this option, compared with group using strict equality. Use a unique, stable value for every option in a group. |
| `size` | `ResourceSize \| number` | — | Control layout size. Accepts 12, 16, 20, 24, 28, 32, 40, 48, 80, or a custom number. Inherits size context when omitted; otherwise defaults to 16. The graphic takes 87.5% of this size without changing label text size. |
| `required` | `boolean` | false | Participates in native required validation. Empty submission briefly pulses the red border without text, then restores the original state and keeps the focus ring color. |
| `name` | `string` | — | Native input name; use matching names for a radio group. |
| `form` | `string` | — | Associated form element id. |
| `disabled` | `boolean` | false | Prevent clicks and keyboard toggling and remove the control from Tab order, while retaining its selection state. |
| `variant` | `"outline" \| "filled"` | "filled" | filled uses a thick selected ring; outline uses a thin outline and center dot. Both have the same selection behavior. |
| `children` | `Snippet` | — | Label beside the circular control; can combine a title and description. A readable label is recommended. |
| `singleLine` | `boolean` | true | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} for a full-text tooltip. |
| `gap` | `number` | — | Inherited Frame gap token index. Omit it for the original component gap; explicit values override the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| `enableResponsive` | `boolean` | false | Responsive capability passed to Frame; layout follows Frame’s responsive configuration. |
| `enableContext` | `boolean` | false | General context capability passed to Frame. It does not control how Radio reads its own size context or Image badge context. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
