# AvatarGroup API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `max` | `number` | — | With no value, row has no count limit while stack has at most four positions. row shows up to max avatars plus a +N badge; stack includes the +N position within max and never shows more than four positions. Explicit values are floored and clamped at zero; count text is capped at +99. |
| `layout` | `AvatarGroupLayout` | "row" | row overlaps avatars horizontally; stack piles them within a circular container with up to four positions. The two modes interpret size and max differently. |
| `size` | `ResourceSize` | — | Supports 12, 16, 20, 24, 28, 32, 40, 48, and 80. In row, this is the size of one avatar; in stack, it is the group container size and avatar size is derived from max. Inherits parent size context when omitted. |
| `enableResponsive` | `boolean` | true | Enable responsive behavior on the root Frame. AvatarGroup still owns its avatar layout and overflow count; disabling this does not disable overflow behavior. |
| `enableContext` | `boolean` | true | Whether to provide size context to child Avatar, Icon, and Badge components. |
| `children` | `Snippet` | — | Ordered direct children with as="item", usually Avatars. These items participate in layout, hiding, and the +N count; other content is not counted. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
