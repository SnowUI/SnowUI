# OverflowAction API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Stable action identifier, unique within the group. |
| `label` | `string` | required | Visible button and menu text, and the accessible name for an icon-only button. |
| `icon` | `OverflowActionIcon` | — | Resource icon name or custom icon; the menu reuses the same content. |
| `disabled` | `boolean` | false | Disable both the visible button and its corresponding MenuItem. |
| `href` | `string` | — | Render a link while visible and navigate to the same address when activated from the menu. |
| `iconOnly` | `boolean` | false | Show only the icon in the built-in visible Button, using label as its accessible name. The menu still shows label. |
| `tooltip` | `TooltipProp` | — | Tooltip toggle or configuration for the built-in Button and descendant Button controls inside control. Disabled by default (inherits parent OverflowActions.tooltip when omitted); applies to iconOnly/compact built-in buttons and propagates via shared ButtonTooltipContext to any Button-based child control with explicit child props taking priority. |
| `onclick` | `(event?: MouseEvent) => void` | — | Action callback shared by the visible button and overflow menu. |
| `children` | `Snippet` | — | Replace visible button content. The menu still takes label and icon from the explicit props; the default is Icon plus label. |
| `control` | `Snippet<[(event?: MouseEvent) => void, boolean]>` | — | Replace the visible Button with a dedicated control. The Snippet receives run and the final disabled value; wire them to the control’s actual onclick and disabled. The menu still executes onclick. The component measures the dedicated control directly instead of cloning a hidden stateful instance. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Tooltip: typeof Tooltip; }>` | — | Configure this action’s built-in Button and Tooltip (isolated from explicit control children via ComponentPartsBoundary). Direct props take priority, followed by this setting, then parent group defaults. The parent does not use it to infer the More button style. |
| `as` | `string` | — | Set to "item" for a direct OverflowActions child so it registers measurement, overflow behavior, and menu execution. An unregistered action cannot participate in the parent’s responsive action management. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
