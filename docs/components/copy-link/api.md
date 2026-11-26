# CopyLink API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | required | Address for display, navigation, and copying. Pass a full URL when an absolute address must be copied. |
| `target` | `string` | "_blank" | Link navigation target. |
| `rel` | `string` | "noopener noreferrer" | Link relationship attribute. |
| `disabled` | `boolean` | false | Disable both navigation and copying. |
| `parts` | `ComponentPartsOf<{ Link: typeof Link; CopyButton: typeof CopyButton }>` | — | Configure public Props of generated children, such as Link.color or underline and CopyButton.ariaLabel, writeText, or feedbackDuration. The parent owns the address, disabled state, and layout. |
| `onCopy` | `(text: string) => void` | — | Receives the complete address after a successful copy. |
| `onCopyError` | `(error: unknown) => void` | — | Callback when copying fails. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
