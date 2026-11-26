# ImageViewer API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Control viewer visibility in manual mode. Omit together with items and index for page-wide automatic mode. |
| `items` | `ImageViewerItem[]` | — | Preview items in manual mode. When omitted, consumes page-wide preview state automatically. |
| `index` | `number` | — | Current displayed item index in manual mode. When omitted, consumes page-wide preview state automatically. |
| `dismissMode` | `"button" \| "backdrop"` | "backdrop" | Closing policy. backdrop hides the close Button and allows clicking empty space outside the media to close. button shows the close Button and disables empty-space dismissal. |
| `backdrop` | `BackdropVariant` | "opaque" | Shared Dialog backdrop appearance: opaque uses 10% black, blur adds background blur, and transparent has no tint. Does not change closing policy. |
| `children` | `Snippet` | — | Explicit control Buttons. When present, replaces every default built-in control. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button }>` | — | Bulk configuration for generated previous, next, and close Buttons. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
