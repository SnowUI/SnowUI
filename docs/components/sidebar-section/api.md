# SidebarSection API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Stable section identity. |
| `title` | `string` | — | Generated section heading; no heading row is rendered when omitted. |
| `collapsible` | `boolean` | — | Whether to provide a built-in expand/collapse Button. Defaults to true when a title exists. |
| `collapsed` | `boolean` | — | Control the section’s collapsed state when a boolean is supplied. When omitted, internal section state and persisted Sidebar state manage it. |
| `defaultCollapsed` | `boolean` | false | Initial uncontrolled collapsed state. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | Callback when section collapse state changes. |
| `actions` | `SidebarActionData[] \| Snippet` | [] | Zero or more heading actions. An array generates bare Buttons. |
| `children` | `Snippet` | — | Section content. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; }>` | — | Configure data-generated Buttons and the built-in Separator. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
