# Sidebar API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sections` | `SidebarSectionData[]` | [] | Array of navigation groups. Each needs a unique id and may set title, collapsible, defaultCollapsed, actions, items, and content. content takes precedence over items. Items use SidebarItemData fields such as id, label, icon, and href. |
| `navigationVariant` | `"icon" \| "text"` | "icon" | Navigation structure variant. text has no icons; when collapsed, the root width and padding become zero, leaving only an expand button at the upper left of the visible page. It does not infer icons by scanning content. |
| `collapseMode` | `"compact" \| "hidden"` | "hidden" | Defaults to hidden: slides the entire sidebar out and retains a floating expand button. Set compact explicitly to preserve the icon rail. |
| `collapsed` | `boolean` | — | Controlled collapsed state; supports bind:collapsed. When omitted, internal state starts from defaultCollapsed. |
| `defaultCollapsed` | `boolean` | false | Initial collapsed state when uncontrolled. |
| `width` | `number` | 220 | Expanded width; supports bind:width and updates live while the right edge is dragged. |
| `minWidth` | `number` | 160 | Lower bound for the draggable expanded width. |
| `maxWidth` | `number` | 480 | Upper bound for the draggable expanded width. |
| `resizable` | `boolean` | true | Enable the hit area on the right edge for resizing. |
| `activeItemId` | `string` | — | Externally controlled selected item id. When omitted, uses internal selection or a restored persistent value. Controls selection only; the host owns routing. |
| `persistence` | `boolean` | true | Persist collapsed state, active item and section collapsed states. |
| `persistenceKey` | `string` | "default" | Namespace for this instance in localStorage. Set distinct values when a page contains multiple Sidebars. |
| `ariaLabel` | `string` | — | Accessible name for navigation and its scroll region. When omitted, follows LocaleProvider; an explicit value takes priority. Distinguish multiple instances with different names. |
| `continuousHover` | `boolean` | true | Move a shared hover background between available navigation items. When disabled, each item handles its own hover; selection is unaffected. |
| `onCollapsedChange` | `(collapsed: boolean) => void` | — | Called after the user toggles collapse with the built-in button. Receives the new state and cannot cancel the toggle. |
| `onWidthChange` | `(width: number) => void` | — | Called during user resizing. Receives an integer pixel width clamped to minWidth and maxWidth. |
| `onActiveItemChange` | `(itemId: string) => void` | — | Called when navigation selects an item or restores a valid persisted selection. Receives the selected id; the host handles content and routing. |
| `children` | `Snippet` | — | Explicit content without parameters, rendered alongside sections. A direct as="logo" child replaces the Header Logo, as="footer" enters the fixed Footer, and other content enters navigation. |
| `footer` | `Snippet` | — | Fixed footer Snippet rendered in place during SSR, taking priority over as=footer content. |
| `parts` | `ComponentPartsOf<{ Indicator: typeof Indicator; SnowUILogo: typeof SnowUILogo; SidebarSection: typeof SidebarSection; SidebarItem: typeof SidebarItem; }>` | — | Configure the resizing Indicator and generated SnowUILogo, SidebarSection, and SidebarItem. Indicator retains its default state visuals. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
