# SlotText API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string \| number` | "" | Final text to display. |
| `direction` | `SlotTextDirection` | — | Semantic direction for text and numbers. normal uses the shared trend direction; reverse inverts it completely. |
| `trend` | `SlotTextTrend` | 0 | Numeric trend. 0 infers direction: increasing values move up and decreasing values move down. |
| `motionRole` | `SlotTextMotionRole` | "auto" | Semantic role of the content. text disables numeric inference; other values describe ordinary numbers, timers, or countdowns. |
| `skipUnchanged` | `boolean` | true | Skip characters that did not change. |
| `interrupt` | `boolean` | true | Whether new content interrupts the current animation. true transitions from the current frame to the latest text; false waits until the current run ends. |
| `replayKey` | `string \| number` | 0 | Changing this value while text stays the same replays from empty slots. A text change runs the normal difference animation. |
| `playOnMount` | `boolean` | false | Replay from empty slots after mounting. |
| `animated` | `boolean` | true | Enable animated text changes. |
| `respectMotionPreference` | `boolean` | false | Follow the system reduced-motion setting only when explicitly enabled. |
| `transition` | `Partial<SlotTextTransition>` | — | Timing override for debugging or demos; does not change the default motion baseline. Refer to the project defaults. |
| `font` | `string` | — | Font family; accepts SnowUI tokens. |
| `size` | `string \| number` | — | Font size; accepts SnowUI tokens. |
| `weight` | `string \| number` | — | Font weight. |
| `color` | `SnowUIColor \| string` | — | Final text color; accepts PascalCase semantic colors. |
| `lineHeight` | `string \| number` | — | Line height; accepts SnowUI tokens. |
| `align` | `TextMotionAlign` | — | Text alignment; inherits the parent by default. |
| `motionColor` | `TextMotionColor` | — | Temporary color as target characters settle from left to right. Defaults to no color change and supports per-character gradients through chromatic(). |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
