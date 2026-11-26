# Image API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string \| Component` | — | Image or video URL, or a resource-svelte image component. |
| `size` | `ImageSize` | — | Image size. When omitted, inherits size context from ImageGroup automatically. |
| `alt` | `string` | — | Alternative text for the image. |
| `mediaLoading` | `MediaLoading` | — | Native loading policy for string image URLs. Explicit values override the nearest provideMediaLoading() default; the fallback is lazy. Separate from Frame visual loading. |
| `previewMode` | `PreviewMode` | — | Explicit preview method. When omitted, uses a shared ImageViewer if one exists on the page; otherwise string media opens in a new window. |
| `onOpen` | `(event?: MouseEvent \| KeyboardEvent) => void` | — | Called when a click or keyboard action opens the image. Providing it takes over the default Viewer or new-window action; the caller must perform the opening behavior. |
| `badgePosition` | `"top" \| "bottom"` | "top" | Corner badge position: top is upper right and bottom is lower right. |
| `children` | `Snippet` | — | Media attachments. A child as="icon" is centered, while as="badge" is positioned at a corner. Neither replaces the media content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
