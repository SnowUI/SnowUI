# SnowUILogo API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `SnowUILogoVariant` | "horizontal" | Icon, wordmark, or either combined orientation. |
| `scale` | `number` | 1 | Scale icon, wordmark, and their spacing proportionally. Nonfinite or nonpositive values fall back to 1. |
| `compactProgress` | `number` | 0 | vertical only: 0 shows the full vertical mark, 1 shows the 28×28 icon, and intermediate values continuously collapse the wordmark and gap. Range 0–1; nonfinite values fall back to 0. Can combine with scale for a scroll-driven brand transition. |
| `idleMotion` | `boolean` | false | Enable idle rotation and vertical floating for the brand icon. Does not affect the hover greeting and does not play under reduced-motion preference. |
| `hoverMotion` | `boolean` | false | Enable the icon and wordmark hover cycle. Off by default; disabling restores the brand without changing idle motion or mouse events. |
| `textMotion` | `"greetings" \| "variants"` | "greetings" | Choose the text hover effect: the original multilingual greeting or the second SnowUI vector-letter rotation. Ignored by icon variant; icon Emoji rotation stays the same. |
| `decorative` | `boolean` | false | When true, hide the mark from the accessibility tree. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
