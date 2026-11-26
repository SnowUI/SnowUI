# OTPInput API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Supports `bind:value`; partial values preserve empty positions as spaces, while complete values contain only digits. External changes update the display. |
| `defaultValue` | `string` | — | Initial value when value is omitted, and the native form reset baseline. When both are supplied, value controls the current display and defaultValue controls reset. |
| `length` | `OTPLength` | 6 | Number of code digits. Changing it immediately truncates the value to the new length and rebuilds the visual slots. |
| `name` | `string` | — | Native field name. FormData collects the normalized complete or partial value when enabled. |
| `form` | `string` | — | Associate the input with an external form by its id. |
| `disabled` | `boolean` | false | Prevent focus and editing, and exclude the field from FormData. |
| `readonly` | `boolean` | false | Allow focus, selection, and submission while preventing editing. |
| `required` | `boolean` | false | Enable native required-field validation. |
| `autocomplete` | `HTMLInputAttributes["autocomplete"]` | "one-time-code" | Use the SMS one-time-code autofill semantic by default. |
| `autofocus` | `boolean` | — | Request initial focus. Avoid competing with other autofocus controls. |
| `tabindex` | `number` | — | Native keyboard focus order. |
| `id` | `string` | — | The real input id, usable by an associated label's `for` attribute. |
| `title` | `string` | — | Native tooltip text; does not replace an accessible name. |
| `invalid` | `boolean` | false | Persistent caller-controlled error state, with aria-invalid and Input's border, focus ring, error text, and shake. The internal two-second timer does not clear this Prop. |
| `success` | `boolean` | false | Caller-controlled verification success visual state; supports binding, hides the active state, and resets after two seconds without preventing editing or submission. |
| `error` | `string \| Snippet` | Locale message | Error text or content. An explicit value takes precedence over the default locale message. |
| `oncomplete` | `(value: string) => void` | — | Called when user entry produces a new complete value; initialization, external assignment, and unchanged repeated values do not trigger it. |
| `oninput` | `(event: Event) => void` | — | Called after user entry is normalized or an accepted paste is written. Rejected paste does not trigger it. |
| `onchange` | `(event: Event) => void` | — | Forward the real input's native change event. |
| `onfocus` | `(event: FocusEvent) => void` | — | Called after the real input gains focus and the active slot is synchronized. |
| `onblur` | `(event: FocusEvent) => void` | — | Called after the real input loses focus and the active indicator is hidden. |
| `onkeydown` | `(event: KeyboardEvent) => void` | — | Called before native key handling; preventDefault can cancel the browser default action. |
| `onpaste` | `(event: ClipboardEvent) => void` | — | Called before paste validation; preventDefault cancels the component's entire paste handling. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
