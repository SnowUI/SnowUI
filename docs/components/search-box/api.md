# SearchBox API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `parts` | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure the internally generated Clear button. Explicit child content does not consume this default configuration. |
| `variant` | `"gray" \| "outline"` | "gray" | Search box appearance variant. |
| `gap` | `number` | — | Inherited Frame gap token index. Omit it to retain the preferred component gap; explicit values override that preference. Effective graphics/text spacing remains at least 4 CSS px, including zero, root-font scaling and gap scaling. |
| `value` | `string \| number` | — | Current search text or display value. |
| `placeholder` | `string` | — | Placeholder text. When omitted, searchBox.placeholder provides the localized placeholder (“Search” in en-US). An explicit empty string is preserved. |
| `open` | `boolean` | false | Whether the popup is open; supports bind:open. |
| `disabled` | `boolean` | false | Disable the trigger. |
| `readonly` | `boolean` | false | Make the trigger read-only so it does not open the popup. |
| `showSearchIcon` | `boolean` | true | Whether to render the default search icon. |
| `collapseBelow` | `number` | — | At or below this component-width threshold in pixels, retain only the leading search icon. Omit to disable collapsing. |
| `clearable` | `boolean` | true | Whether to show a Clear button when value is present. |
| `children` | `Snippet` | — | Additional leading or trailing content, such as Kbd. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when the open state changes. |
| `onClear` | `() => void` | — | Callback when the value is cleared. |
| `onclick` | `(event: MouseEvent) => void` | — | Called after clicking the entry with the original MouseEvent. When enabled and not readonly, SearchBox opens first; the callback cannot undo that opening. |
| `onkeydown` | `(event: KeyboardEvent) => void` | — | Called with the original KeyboardEvent after Escape closes or Enter/Space opens the popup. It cannot undo a state change that already occurred. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
