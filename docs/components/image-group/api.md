# ImageGroup API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `ImageGroupSize` | — | Shared size for images in the group. |
| `layout` | `ImageGroupLayout` | "row" | Group layout mode. |
| `previewMode` | `PreviewMode` | — | Explicit preview mode for Image children. When omitted, it is determined by whether the page has a shared Viewer. |
| `enableResponsive` | `boolean` | true | Enable Frame responsive behavior to adjust group layout through its public responsive configuration. |
| `enableContext` | `boolean` | true | Whether to provide general Frame context to children. Image group size and preview policy still use dedicated group context. |
| `children` | `Snippet` | — | Image content. Images register themselves in the media group and inherit group size and preview policy; explicit child settings take priority. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
