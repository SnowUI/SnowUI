# Card API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `row` | `boolean` | false | Arrange direct ordinary content horizontally, following Frame syntax. |
| `column` | `boolean` | — | Arrange ordinary content vertically. When omitted, takes the inverse of row; row wins if both are true. |
| `wrap` | `boolean` | false | Allow ordinary content to wrap. Disabled by default. |
| `contentFill` | `boolean` | false | Fill the Card content area with ordinary child widths. Takes priority over contentHug. |
| `contentHug` | `boolean` | false | Shrink ordinary child widths to their content. |
| `selected` | `boolean` | false | Semantic alias for the active state, with the same effect as active. |
| `active` | `boolean` | false | Apply active appearance. |
| `interactive` | `boolean` | false | Add interactive appearance, pointer cursor, and hover border. The consumer still owns click effects; it does not navigate, select, or add button keyboard behavior automatically. |
| `scrollable` | `boolean` | true | Enable internal scrolling when content overflows. Without a height constraint, content grows naturally. |
| `children` | `Snippet` | — | Any custom content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
