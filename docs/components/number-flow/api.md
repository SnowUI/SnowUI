# NumberFlow API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | — | Current number. An unparseable string is treated as 0. |
| `locales` | `string` | "en-US" | Locale or locales passed to Intl.NumberFormat. |
| `format` | `Intl.NumberFormatOptions` | {} | Number formatting options. |
| `trend` | `TrendResolver` | 0 | Explicit change trend. At 0, infer it from the previous and next numeric values. |
| `motionRole` | `TextMotionRole` | "auto" | Semantic role used to classify the numeric trend. |
| `transition` | `NumberFlowTransition` | — | Override the wheel transition duration. |
| `digits` | `Record<number, { max?: number }>` | — | Set a cycling limit for specified digit positions, such as the tens position in a timer. |
| `numberPosition` | `"left" \| "right"` | "right" | Position of children relative to the number. |
| `rollDirection` | `RollDirection` | "normal" | Interpret the trend in its normal or reversed direction. |
| `loading` | `boolean` | — | Show a Skeleton sized from the current text width. |
| `skeleton` | `boolean` | — | Connect to Skeleton Context. |
| `renderHints` | `RenderHints` | — | Override Skeleton shape and size hints. |
| `respectMotionPreference` | `boolean` | false | When true, honor reduced motion and show the final number immediately. |
| `font` | `string` | — | Font family for digits; inherits the container font when omitted. |
| `size` | `string \| number` | — | Font size for digits. Numbers become pixels; strings may use SnowUI tokens or CSS values. |
| `weight` | `string \| number` | — | Font weight for digits; inherits the container when omitted. |
| `lineHeight` | `string \| number` | — | Line height of the root layout. The inner wheel retains its own clipped 1em window. |
| `color` | `SnowUIColor \| string` | — | Final text color; inherits the container when omitted. |
| `align` | `TextMotionAlign` | — | Alignment inside the number. |
| `motionColor` | `TextMotionColor` | — | Temporary color as all target characters settle from left to right. chromatic() spans every digit, retained digit, separator, and formatted currency symbol, without affecting children. |
| `children` | `Snippet` | — | Additional content to the left or right of the number. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
