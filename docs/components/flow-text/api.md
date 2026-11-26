# FlowText API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `FlowTextValue` | — | Target text or numeric value. |
| `locales` | `string` | "en-US" | Locale or locales used for number formatting. |
| `format` | `Intl.NumberFormatOptions` | — | Number formatting options. |
| `trend` | `FlowTextTrend` | 0 | Numeric trend. 0 uses the shared classification behavior to infer it. |
| `motionRole` | `TextMotionRole` | "auto" | Semantic role of the content for motion classification. |
| `transition` | `FlowTextTransition` | — | Override timing. Main animation and layout default to 550ms, with per-digit intervals consistent with NumericText. |
| `digits` | `Record<number, { max?: number }>` | — | Modulo definition for a segmented timer; used only by shared trend classification. |
| `textPosition` | `"left" \| "right"` | "right" | Position of FlowText content relative to children. |
| `rollDirection` | `FlowTextRollDirection` | "normal" | Vertical flow direction for all characters. normal follows the shared trend direction; reverse inverts it completely. |
| `loading` | `boolean` | — | Loading state. Show a skeleton when skeleton is also enabled; when omitted, follow container state. |
| `skeleton` | `boolean` | — | Control skeleton visibility; follows the container skeleton state when omitted. |
| `renderHints` | `RenderHints` | — | Hints for skeleton shape and size. |
| `respectMotionPreference` | `boolean` | false | Follow the system reduced-motion setting only when explicitly enabled. |
| `font` | `string` | — | Font family; inherits the container when omitted. |
| `size` | `string \| number` | — | Font size; inherits the container when omitted. |
| `weight` | `string \| number` | — | Font weight; inherits the container when omitted. |
| `lineHeight` | `string \| number` | — | Line height; inherits the container when omitted. |
| `color` | `SnowUIColor \| string` | — | Final text color; inherits the container when omitted. |
| `align` | `TextMotionAlign` | — | Text alignment. |
| `motionColor` | `TextMotionColor` | — | Temporary color for every target character during a content change, including retained characters. Resolver index and total refer to graphemes in the full target text; the final text color returns when motion ends. |
| `children` | `Snippet` | — | Content before or after the text. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
