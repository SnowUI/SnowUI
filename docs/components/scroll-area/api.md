# ScrollArea API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `axis` | `ScrollAreaAxis` | "vertical" | Allowed scroll direction. |
| `horizontalTrackPosition` | `ScrollAreaHorizontalTrackPosition` | "container" | Anchor the horizontal track to the container bottom, or keep it near the viewport bottom as a tall container passes through the page viewport. |
| `horizontalScrollbarVisibility` | `"always" \| "hover"` | "always" | Show the horizontal scrollbar whenever content overflows, or only while the pointer is inside the region. |
| `ariaLabel` | `string` | — | Accessible name for the scroll viewport. When omitted, follows LocaleProvider; an explicit value takes priority. |
| `viewport` | `HTMLElement` | — | Exposed internal scrolling viewport for reading or setting native scroll position. |
| `onscroll` | `(event: Event) => void` | — | Native scroll event from the viewport. |
| `children` | `Snippet` | — | Any scrollable content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
