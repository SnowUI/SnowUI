# Icon API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Image URL for the icon. |
| `icon` | `Component<any>` | — | resource-svelte icon component rendered directly. |
| `stateIcon` | `StateValueMap<Component<any> \| null>` | — | Resolve an icon from the nearest parent Frame currentState. When the state has no match, fall back to Idle, then icon, src, or children. Hide Icon when the state value is null. |
| `size` | `IconSize` | — | Icon size. When omitted, inherits size context from the parent Frame. |
| `background` | `boolean` | false | Whether to show a background. |
| `weight` | `string` | — | Visual weight passed through to the icon resource. When supported, use thin, light, regular, bold, fill, or duotone. Otherwise the resource or context decides; this does not create variants the resource lacks. |
| `as` | `\| "badge" \| "icon" \| "prev" \| "next" \| "close" \| (string & {})` | "icon" | Role as a standalone icon, logo, central icon in an image, or Viewer control icon. |
| `children` | `Snippet` | — | Icon content and badge composition. Rendered only when both src and the resolved icon are absent. A resource icon and Badge as="badge" can be provided together; the host positions the badge. |
| `badgePosition` | `"top" \| "bottom"` | "top" | Badge position when hosting a corner badge: top is upper right and bottom is lower right. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
