# SidebarItem API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Stable navigation identity. |
| `label` | `string` | required | Visible text and accessible name in the collapsed state. |
| `icon` | `string \| Snippet` | — | ResourceIcon name or custom leading content. |
| `iconCollection` | `string` | — | ResourceIcon collection for icon. Pass "snowui" when a SnowUI icon shares its name with another collection. |
| `depth` | `0 \| 1` | 0 | Navigation depth. 1 denotes a second-level item; the component draws an L-shaped hierarchy connector in the leading slot instead of the ordinary Icon. |
| `href` | `string` | — | The main action uses Button; href renders link semantics. |
| `updated` | `boolean` | false | Built-in Badge dot. In expanded mode it follows external tags; in collapsed mode it follows the leading icon. |
| `tags` | `Snippet` | — | Custom state or category tags after label and before updated. Badge variant="border" is recommended. |
| `disabled` | `boolean` | false | Disable the primary action. |
| `actions` | `SidebarActionData[] \| Snippet` | [] | Zero or more trailing actions. An array generates bare Buttons. |
| `onSelect` | `(id: string) => void` | — | Callback when this item is selected. |
| `parts` | `ComponentPartsOf<{ Badge: typeof Badge; Button: typeof Button }>` | — | Configure generated Badge and data-generated Buttons. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
