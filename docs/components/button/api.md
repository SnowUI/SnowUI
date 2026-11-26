# Button API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"gray" \| "filled" \| "outline" \| "borderless"` | — | Button appearance. An explicit value takes priority, followed by ButtonGroup or Breadcrumb context; without context, it falls back to gray. |
| `size` | `"sm" \| "md" \| "lg"` | — | Controls text size, padding, corner radius, and child icon size. An explicit value takes priority, followed by ButtonGroup or parent size context; without context, it defaults to sm. |
| `iconOnly` | `boolean` | false | Padded icon-only mode with symmetric padding and icon sizing. Icons are 16/20/24px at sm/md/lg. For an icon action without a shell, use bare. Development mode warns when aria-label, aria-labelledby, and title are all missing. |
| `bare` | `boolean` | false | Button without a shell, mainly for icon actions but also supports text or other content. Ignores variant and removes padding, radius, background, border, and hover overlay while keeping the content gap. Do not combine it with iconOnly. Icons are 16/20/24px at sm/md/lg unless a child icon specifies its own size. Normally fully opaque; emphasis="muted" changes opacity from 40% to 100% on hover. |
| `emphasis` | `"normal" \| "muted"` | "normal" | Visual emphasis for bare buttons. normal stays fully opaque at rest and on hover; muted changes from 40% at rest to 100% on hover. It does not alter the appearance of a non-bare variant. |
| `backgroundBlur` | `boolean` | false | Enable the shared 20px control background blur. Disabled by default; button content remains sharp. |
| `gap` | `number` | — | Content gap token index. Defaults to the size preset when omitted. Single-line graphics and independent text content retain at least 4 CSS px, including an explicit zero; larger preferred gaps are preserved. No outer Frame is required. |
| `scaleOnHover` | `boolean` | — | Enable the built-in background scale on hover and the related press/release animation. Enabled by default for standalone actions; content scales with the background while hit area and layout stay fixed. A composite container can default this to false, and a child Button can explicitly re-enable it. bare has no background layer, so this has no visual effect. This Prop does not override explicit whileHover behavior. |
| `contentScaleOnHover` | `boolean` | — | Scale text, Icon, Spinner, and other content as one unit with the built-in hover and press animation. false disables content scaling only. true still requires background scaling to be active and cannot bypass scaleOnHover=false, bare, disabled, or explicit whileHover behavior. |
| `toggle` | `boolean` | false | Shorthand for Toggle mode. Internally sets Click={{ Idle: "Active", Active: "Idle" }} and whileClick=false. In Active state, Frame exposes data-state="Active" for Brand colors on gray, outline, and borderless (not filled), and outputs aria-pressed. Explicit Click or whileClick values still take priority. |
| `holdRepeat` | `boolean` | false | Repeat while the pointer is held down on an enabled button host. Dispatches one click immediately, then periodic clicks after a delay, and stops on release or cancellation. Links and keyboard activation do not repeat. |
| `holdRepeatDelay` | `number` | 260 | Delay in milliseconds before periodic repetition starts. Negative values are treated as zero. Applies only when holdRepeat=true; the first periodic click also waits for holdRepeatInterval. |
| `holdRepeatInterval` | `number` | 80 | Interval in milliseconds between periodic clicks while held. The minimum is 1 ms. Applies only when holdRepeat=true. |
| `tooltip` | `TooltipProp` | — | Hover/focus tooltip toggle or configuration (`boolean \| string \| Snippet \| TooltipConfig`). Disabled by default; when true, reuses the button’s aria-label, lazily loads the built-in Tooltip, and reads parent ButtonTooltipContext with explicit instance props taking priority. |
| `parts` | `ComponentPartsOf<{ Tooltip: typeof Tooltip }>` | — | Configure the built-in Tooltip rendered when tooltip is enabled. Isolated from caller-explicit children through ComponentPartsBoundary. |
| `children` | `Snippet` | — | Text, icons, or other button content. Set iconOnly for a padded icon-only button or bare for an unframed one. Both icon-only patterns need an accessible name; the component does not infer one from its content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
