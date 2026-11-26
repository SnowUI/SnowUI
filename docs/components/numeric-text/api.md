# NumericText API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `NumericTextValue` | "" | Content to display. |
| `locales` | `string` | "en-US" | Locale or locales used to format numbers. |
| `format` | `Intl.NumberFormatOptions` | — | Options used to format numbers. |
| `animated` | `boolean` | true | Animate content changes. |
| `trend` | `NumericTextTrend` | 0 | Movement trend: decrease, automatic, or increase. |
| `direction` | `NumericTextDirection` | "normal" | Semantic direction. normal follows the shared trend; reverse inverts movement for text, numbers, timers, and countdowns. |
| `motionRole` | `TextMotionRole` | "auto" | Semantic role of the content. text explicitly disables numeric inference; other values identify ordinary numbers, timers, or countdowns. |
| `transition` | `Partial<TextMotionTransition>` | — | Motion timing configuration shared with numeric-text-main. Demo Slow Mode uses { duration: 550, easing: reference } as its example. |
| `respectMotionPreference` | `boolean` | true | Follow the system reduced-motion setting by default, consistent with numeric-text-main. |
| `font` | `string` | — | Font family. |
| `size` | `string \| number` | — | Rendered font size. |
| `weight` | `string \| number` | — | Font weight. |
| `lineHeight` | `string \| number` | — | Line height. |
| `color` | `SnowUIColor \| string` | — | Final text color. |
| `align` | `TextMotionAlign` | — | Text alignment; inherits the parent by default. |
| `motionColor` | `TextMotionColor` | — | Temporary color while target characters settle from left to right. Does not change color by default; supports per-character gradients through chromatic(). |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
