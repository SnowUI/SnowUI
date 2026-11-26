# ScrambleText API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string \| number` | "" | Final text. |
| `charset` | `ScrambleTextCharset` | "glyphs" | Preset replacement character set. |
| `customSequence` | `string` | — | Custom replacement sequence, up to 64 graphemes. |
| `mode` | `ScrambleTextMode` | "cascade" | Discrete animation mode. |
| `respectMotionPreference` | `boolean` | false | When explicitly enabled, follow the system reduced-motion setting. |
| `font` | `string` | — | Font family. |
| `size` | `string \| number` | — | Size of the rendered text. |
| `weight` | `string \| number` | — | Weight of the rendered text. |
| `color` | `SnowUIColor \| string` | — | Color of the final readable text. |
| `lineHeight` | `string \| number` | — | Line height of the rendered text. |
| `align` | `TextMotionAlign` | — | Text alignment; inherits the parent by default. |
| `motionColor` | `TextMotionColor` | — | Temporary color used as target characters settle from left to right. Accepts semantic colors, CSS colors, or a per-character resolver. Does not change color by default. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
