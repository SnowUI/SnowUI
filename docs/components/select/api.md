# Select API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `SelectValue` | — | Current value; supports bind:value. |
| `gap` | `number` | — | Inherited Frame gap token index. Omit it to retain the original preferred gap. Explicit values override the preference; effective graphics/text spacing remains at least 4 CSS px, including zero, root font scaling and gap scaling. |
| `defaultValue` | `SelectValue` | — | Initial value. |
| `placeholder` | `string` | — | Text shown in the trigger while value is empty. |
| `name` | `string` | — | Field name used in form submission. |
| `disabled` | `boolean` | false | Disable the Select trigger and choices. |
| `readonly` | `boolean` | false | Make the trigger read-only. |
| `required` | `boolean` | false | Participates in native required validation. Empty submission briefly pulses the red border without text, then restores the original state and keeps the focus ring color. |
| `form` | `string` | — | Associate the field with an external form. |
| `autofocus` | `boolean` | — | Focus on the first render. |
| `tabindex` | `number` | — | Position in sequential Tab navigation. |
| `title` | `string` | — | Native title hint. |
| `id` | `string` | — | Native element ID. |
| `invalid` | `boolean` | false | Invalid state at the component level. |
| `children` | `Snippet` | — | Explicit Listbox and MenuItem composition. |
| `options` | `SelectOption[]` | [] | Data for the built-in list, following ListboxItem fields. Not rendered when explicit children is supplied. |
| `triggerContent` | `Snippet<[SelectTriggerContext]>` | — | In buttonTrigger mode, replace button content. Receives value, option, label, placeholder, open, and disabled. |
| `buttonTrigger` | `boolean` | false | Use Button instead of a field-style trigger while keeping expansion, selection, and focus restoration behavior. |
| `buttonBare` | `boolean` | true | Only in buttonTrigger mode, choose whether the built-in Button has an unframed bare appearance. |
| `selectionMode` | `"persistent" \| "action"` | "persistent" | persistent saves the selected value. action calls onAction, closes the panel, and restores trigger focus without retaining the choice. |
| `onAction` | `(value: string) => void` | — | Called in action mode with the string option value after the panel closes. Return value does not affect selection. |
| `parts` | `SelectParts` | — | Configure generated Listbox, Input, MenuItem, Tooltip, and button trigger. Explicit children do not consume parent parts. |
| `ariaLabel` | `string` | — | Accessible trigger name. In button-trigger mode without custom content, it is also fallback visible content. |
| `onclick` | `(event: MouseEvent) => void` | — | Called with the original MouseEvent after an enabled, writable trigger toggles the panel. |
| `oninput` | `(event: Event) => void` | — | Called with a change Event from the hidden form input when persistent mode selects a different value. Read the new value from the binding; this is not native text entry. |
| `onchange` | `(event: Event) => void` | — | Called with the same change Event after a persistent selection changes. Repeating the value or using action mode does not call it. |
| `onfocus` | `(event: FocusEvent) => void` | — | Called with a FocusEvent when the field-style trigger gains focus. Not used directly in button-trigger mode. |
| `onblur` | `(event: FocusEvent) => void` | — | Called with a FocusEvent when the field-style trigger loses focus. Not used directly in button-trigger mode. |
| `onkeydown` | `(event: KeyboardEvent) => void` | — | Called with a KeyboardEvent after built-in handling of arrow keys, Enter/Space, and Escape. It cannot undo completed actions. |
| `onkeyup` | `(event: KeyboardEvent) => void` | — | Called with a KeyboardEvent on key release in field-style trigger mode. Not used directly in button-trigger mode. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
