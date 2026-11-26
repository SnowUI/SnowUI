# Badge API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"filled" \| "border"` | "filled" | Appearance variant. border matches the default border appearance of Kbd: transparent background, inset outline, inherited text color, 0×4px padding, and 6px corners. |
| `count` | `number \| string` | — | Badge number or text. Numbers above max render as max+; ordinary strings remain unchanged. Zero and the string "0" are hidden unless showZero is set. A matching stateCount overrides this value. |
| `stateCount` | `StateValueMap<number \| string>` | — | Map the nearest parent Frame state to a count for declarative Badge visibility. |
| `dot` | `boolean` | — | true forces dot mode; false uses content mode. When omitted, dot mode is automatic only when the resolved count is undefined and there are no children. |
| `max` | `number` | 99 | Maximum displayed number in numeric mode; larger values render as max+. |
| `showZero` | `boolean` | false | false hides numeric zero, the string "0", and empty non-dot badges; true keeps them. Dot and loading visibility are unaffected. |
| `color` | `SnowUIColor \| string` | "Brand" | Fill color for filled and dot modes. Accepts PascalCase semantic colors or CSS color values. filled keeps white text; border content mode remains transparent with inherited text color. |
| `size` | `ResourceSize` | — | Supports 12, 16, 20, 24, 28, 32, 40, 48, and 80. When omitted, reads parent size context. Border content mode hugs the text; Avatar and Icon badge sizes follow the host badge protocol. |
| `children` | `Snippet` | — | Custom Badge content, shown before count. Children select content mode when dot is omitted; dot=true suppresses this content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
