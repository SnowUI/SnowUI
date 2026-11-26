# Toast API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `parts` | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure the appearance of the generated close Button. Toast still owns its events, dismissal semantics, and ARIA. |
| `id` | `string` | — | Pass through to the DOM id when used statically. In template mode, acts as the template id activated by showToast(id). |
| `template` | `boolean` | false | Template mode: register an imperative Toast template without rendering it immediately. Supports the pattern of one Toast declaration and one trigger Button. |
| `as` | `"toast" \| undefined` | — | Inline mode (v1.1.0): as="toast" finds the host parent and binds its click event to trigger Toast, following the three activation modes contract. |
| `positive` | `boolean` | — | Semantic indicator: true uses a positive CheckCircle, false uses a Warning icon, and omission shows no built-in icon. |
| `variant` | `ToastVariant` | "default" | Appearance variant. |
| `size` | `ToastSize` | "md" | Applies only to the default variant. |
| `position` | `ToastPosition` | "top" | Controls the entry and exit direction; does not directly position Toast. |
| `onDismiss` | `() => void` | — | Callback when the close X is clicked in the rich variant. |
| `children` | `Snippet` | — | Body and leading or trailing attachments. When used independently, the caller removes the Toast after dismissal. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
