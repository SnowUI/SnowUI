# Toaster API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `offset` | `number` | 16 | Distance from the viewport edge to the Toast region, in pixels. |
| `maxVisible` | `number` | 3 | Maximum number of visible layers in one position. Does not limit how many messages toast() can enqueue; when full, a new Toast pushes out the current last visible layer. |
| `gap` | `number` | 8 | Visual offset between Toasts in the same position, in pixels. |
| `scaleStep` | `number` | 0.05 | Scale reduction factor for each stacked layer. At index=1, the default scale is 0.95. |
| `stackOpacityStep` | `number` | 0.2 | Opacity reduction factor for each stacked layer. The second and third layers default to 0.8 and 0.6. |
| `stackMinOpacity` | `number` | 0.6 | Minimum opacity for a stacked entry. |
| `stackDuration` | `number` | 300 | Duration of the combined stacking animation, in milliseconds. |
| `stackEasing` | `string` | "ease" | Easing for the combined stacking animation. |
| `width` | `number \| string` | — | Width of the Toast region. By default it hugs content; an explicit value can fix the width. On narrow screens it is capped at calc(100vw - 2rem). |
| `parts` | `ComponentPartsOf<{ Toast: typeof Toast; Text: typeof Text }>` | — | Configure generated Toasts and Text labels for text strings. Text defaults to lines=1; explicit children do not read parts.Text. Toaster owns queue data, position, and dismissal; explicit notification Props take priority. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
