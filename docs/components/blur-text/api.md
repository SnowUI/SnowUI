# BlurText API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string \| number` | "" | Final plain text, preserving spaces and line breaks. |
| `animated` | `boolean` | true | When false, show the final text immediately and clean up internal animation. |
| `speed` | `number` | 1.5 | Finite positive character start rate. Stagger is 30ms / speed; each character lasts 600ms. Invalid values fall back to 1.5. |
| `playOnMount` | `boolean` | true | Play on the first mount after the visibility gate allows it. |
| `replayKey` | `string \| number` | 0 | Replay the current full text when this value changes. |
| `respectMotionPreference` | `boolean` | true | Follow the system reduced-motion setting; enabling it during playback also finishes immediately. |
| `font` | `string` | — | Font family or font token. |
| `size` | `string \| number` | — | Font size or font-size token. |
| `weight` | `string \| number` | — | Font weight. |
| `lineHeight` | `string \| number` | — | Line-height token, CSS length, or unitless multiplier. |
| `color` | `SnowUIColor \| string` | — | Final text color, including PascalCase semantic colors. |
| `align` | `TextMotionAlign` | — | Text alignment; inherits by default. |
| `motionColor` | `TextMotionColor` | — | Optional temporary per-character color, including chromatic(); returns to the final color afterward. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
