# Progress API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | 0 | Percentage progress, automatically clamped to 0–100. |
| `variant` | `ProgressVariant` | "line" | Line or circular appearance. |
| `size` | `number \| string` | 16 | Circle width and height, sharing the default size with Spinner. |
| `thickness` | `number \| string` | — | Line height or ring thickness. Circle and indeterminate appearances align with Spinner ring width. Defaults to 4 for a determinate line, or 15% of size for circle and indeterminate (2.4px at size=16). |
| `background` | `SnowUIColor \| string` | "Black4" | Track background color. |
| `color` | `SnowUIColor \| string` | "Primary" | Fill color. |
| `isIndeterminate` | `boolean` | false | Show an indeterminate state when completion is unknown. |
| `showLabel` | `boolean` | false | Only applies to circle. In a determinate state, generates an internal Text label showing the current value. |
| `loopMotion` | `LoopMotionConfig` | — | Override looping timing for the indeterminate animation. |
| `children` | `Snippet` | — | Explicit label composition; replaces the generated circle label when present. |
| `parts` | `ComponentPartsOf<{ Text: typeof Text }>` | — | Configure the generated circle Text label. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
