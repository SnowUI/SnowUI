# Slider API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| number[]` | 0 | Current value. An array represents a two-thumb range slider. Supports bind:value. |
| `minValue` | `number` | 0 | Minimum allowed value. |
| `maxValue` | `number` | 100 | Maximum allowed value. |
| `step` | `number` | 1 | Value increment. |
| `orientation` | `SliderOrientation` | "horizontal" | Track orientation. |
| `variant` | `SliderVariant` | "default" | solid is a high-contrast bar; soft is a low-contrast bar that adapts to the theme through Black tokens. |
| `title` | `string` | — | Left-side built-in title for solid and soft variants. When omitted, slider.title provides the localized title (“Text” in en-US). An explicit empty string hides it. This is not a label and does not replace ariaLabel. |
| `showSteps` | `boolean` | false | Divide the track and fill at each step with transparent 1px gaps. |
| `showLabel` | `boolean` | false | Generate a Text label that follows each thumb. A horizontal bar range combines both values into one label; other range layouts generate two. |
| `thickness` | `number \| string` | — | Track thickness; controls overall height for bar variants. |
| `background` | `SnowUIColor \| string` | "Black4" | Track background color. |
| `color` | `SnowUIColor \| string` | — | Fill color. An explicit value overrides the variant default. |
| `thumbColor` | `SnowUIColor \| string` | "StaticWhite80" | Thumb color. |
| `disabled` | `boolean` | false | Disable interaction. |
| `name` | `string` | — | Native form field name. |
| `ariaLabel` | `string \| string[]` | — | Accessible name for one value. A range can supply separate names for its two thumbs. |
| `oninput` | `(event: Event) => void` | — | Called after pointer dragging or native input updates with the corresponding Event, a PointerEvent for pointer input. value has already been normalized to range and step, and this callback cannot cancel the update. |
| `onchange` | `(event: Event) => void` | — | Called at the end of pointer dragging or on native change with the corresponding Event. Read bound value for the committed result. |
| `children` | `Snippet` | — | Explicit composition point. One or two direct Text children with as="label" replace generated labels. |
| `parts` | `ComponentPartsOf<{ Text: typeof Text }>` | — | Configure all generated Text instances, including the title and showLabel values; explicit labels remain independent. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
