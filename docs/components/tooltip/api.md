# Tooltip API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `"top" \| "bottom" \| "left" \| "right"` | "top" | Preferred popup direction. When space is short, the panel flips or shifts within the viewport safe area and enters from its final direction. |
| `open` | `boolean` | — | Bindable controlled visibility. Without it, parent-trigger hover uses a shared Portal. Explicit true or false uses an independently controlled Portal without hover delay or pointer-speed sampling. |
| `offset` | `number` | 4 | Target gap from the trigger along the popup direction, in pixels. Viewport collision rules still constrain the final position. |
| `maxWidth` | `number` | 360 | Maximum outer bubble width in pixels, also limited by a 16px safe area on every visible viewport edge. |
| `variant` | `"dark" \| "light"` | "light" | Appearance variant, light by default or explicitly dark. |
| `dismissOnMotion` | `boolean` | true | In uncontrolled hover mode, hide immediately when the trigger or an ancestor starts motion, or a descendant starts a geometric transition. Decorative descendant animation and Button content scaling do not close it because the trigger anchor does not move. |
| `widthRebound` | `boolean` | false | Enable width overshoot and rebound while switching continuously between Tooltip targets. Off by default. |
| `rapidRetarget` | `boolean` | true | While a transition is running, use a fast 90–160ms cubic ease-out baseline for another target change. When off, use the usual coordinated 120–180ms baseline. Effective pointer speed may shorten either to 60ms. |
| `children` | `Snippet` | — | Hint content without arguments; text or public components. When omitted, reads text from the parent trigger. Tooltip is placed inside the trigger rather than wrapping it. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
