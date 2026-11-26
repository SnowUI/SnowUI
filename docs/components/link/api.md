# Link API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `LinkVariant` | "default" | Visual variant of the link. |
| `color` | `SnowUIColor \| string` | "Black40" | Normal text color. Black100, Black, or var(--black-100) hover as Black40; other colors hover as Black100 by default. |
| `href` | `string` | — | Navigation destination. |
| `target` | `string` | — | Where to open the destination. |
| `rel` | `string` | — | Relationship between the current page and the destination. |
| `disabled` | `boolean` | false | Disable the link and its hover response. |
| `hoverColor` | `SnowUIColor \| string \| false` | — | Text color on hover. Defaults to the color-dependent hover value; false keeps the normal color. Trailing decoration still changes opacity from 0.4 to 1. |
| `underline` | `LinkUnderline` | "none" | When to show an underline. It covers link text but not trailing decoration or icons. |
| `lines` | `false \| 1` | false | Enable single-line truncation with an ellipsis when text exceeds the available link width. |
| `tooltip` | `TooltipProp` | — | Tooltip for truncated text. By default, show full text only when truncation actually occurs; false disables it. A string or Snippet supplies custom content, and an object passes Tooltip configuration. |
| `onTruncate` | `(isTruncated: boolean) => void` | — | Callback when actual truncation state changes. |
| `children` | `Snippet` | — | Link text and optional external slots. |
| `parts` | `ComponentPartsOf<{ Tooltip: typeof Tooltip }>` | — | Configure the built-in Tooltip. Explicit Tooltip children receive their own props directly. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
