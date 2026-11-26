# ButtonGroup API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonGroupVariant` | "gray" | Appearance variant for the group shell. |
| `size` | `ButtonGroupSize` | — | Controls density of the shell and nested Buttons. An explicit value takes priority, followed by parent size context, then sm. A child Button can override the inherited size explicitly. |
| `disabled` | `boolean` | false | Disable the entire ButtonGroup and pass disabled to Buttons embedded in the group. |
| `showSeparator` | `boolean` | true | Show built-in decorative dividers between adjacent Button cells. false removes every divider without changing button actions or group layout. |
| `children` | `Snippet` | — | Explicit, independently actionable Button children. Direct Button children become group cells and inherit group configuration. Dividers are built in; no manual Separator is needed. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
