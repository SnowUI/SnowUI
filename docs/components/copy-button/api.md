# CopyButton API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Fixed text to copy. getText takes precedence when provided; if neither is supplied, the component copies an empty string. |
| `getText` | `() => string \| Promise<string>` | — | Resolve the text when clicked; may return a Promise. Takes precedence over text. Evaluation and clipboard writing both occur in the pending state, and failures call onCopyError. |
| `writeText` | `(text: string) => void \| Promise<void>` | writeClipboardText | Replace the clipboard write operation. Success appears after its Promise resolves; a thrown error produces failure feedback. Use this for an existing application clipboard callback to avoid writing twice. The default uses the built-in clipboard writer. |
| `feedbackDuration` | `number` | 1600 | Time in milliseconds before the button returns to idle after success or failure. Negative values count as zero. Additional clicks are ignored while pending or showing feedback. |
| `showText` | `boolean` | true | Show children or the default Copy label beside the icon. When false, show only the status icon; non-bare variants use Button.iconOnly. |
| `ariaLabel` | `string` | — | Override the accessible name. In icon-only mode, the default follows the Copy or Copied status through LocaleProvider; with text, the content provides the name. |
| `disabled` | `boolean` | false | Prevent new copy operations. An asynchronous operation already in progress is not canceled. |
| `children` | `Snippet` | — (Copy) | Replace the label beside the icon when showText=true. The supplied content remains during success and is ignored when showText=false. |
| `icon` | `Snippet` | — (Copy icon) | Replace the icon before success. The pending and error states also use this icon. |
| `successIcon` | `Snippet` | — (Check icon) | Replace the icon shown after a successful copy. Takes precedence over successContent and appears through the internal state transition. |
| `successContent` | `Snippet` | — | Alternative content for the success icon area when successIcon is absent. Does not replace the button label. |
| `onCopy` | `(text: string) => void` | — | Receive the text actually copied after a successful clipboard write. The component is already in the success state. |
| `onCopyError` | `(error: unknown) => void` | — | Receive an error when resolving dynamic text or writing to the clipboard fails. The component enters error and resets after the feedback period. |
| `onclick` | `(event: MouseEvent) => void` | — | Called before resolving text and copying, only while idle and enabled. preventDefault() does not cancel copying; clicks during feedback do not call this handler. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
