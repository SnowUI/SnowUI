# Spinner API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `SpinnerVariant` | "circle" | Appearance of the animated indicator. |
| `size` | `ResourceSize` | — | Size; supports 12, 16, 20, 24, 28, 32, 40, 48, or 80. Inherits parent iconSize or size when omitted, and defaults to 16 without context. |
| `speed` | `number` | 1 | Positive animation speed multiplier. The base cycle is 1000 ms for circle and 800 ms for spokes or pills, divided by this value. Nonfinite or nonpositive values fall back to 1. An explicit loopMotion timeline takes priority. |
| `loopMotion` | `LoopMotionConfig` | — | Override the default looping animation bridge. Takes priority over the duration derived from speed. When passed a preset, Spinner uses only its timing fields so the Frame root does not rotate a second time. |
| `children` | `Snippet` | — | Present for Frame type compatibility. Spinner draws its built-in animated graphic and does not render child content. Compose text outside the component. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
