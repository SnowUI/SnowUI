# Text API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tag` | `string` | — | Root HTML tag. Defaults to span. |
| `stateText` | `StateValueMap<string \| number>` | — | Render text for the nearest parent Frame currentState. If the current state has no match, fall back to Idle, then children. |
| `interactive` | `boolean` | false | Enable Text hover motion when explicitly true; off by default. |
| `lines` | `0 \| 1 \| 2 \| 3` | — | Truncation mode: 0 allows expansion, while 1, 2, or 3 fixes the visible line count. |
| `more` | `boolean` | false | Generate an expansion Button when lines=0. The default appearance is the ArrowLineDown Button from example 6. |
| `tooltip` | `TooltipProp` | — | Tooltip configuration. Supports automatic derivation, fixed text, a Snippet, or an object overriding only placement, offset, and related settings. |
| `onTruncate` | `(isTruncated: boolean) => void` | — | Callback when truncation state changes. |
| `children` | `Snippet<[any]>` | — | Default text or custom content. Receives rendering context with breakpoint; matching stateText replaces it. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Tooltip: typeof Tooltip; }>` | — | Configure only the generated Button and Tooltip. Same-named components in explicit children do not inherit these settings. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
