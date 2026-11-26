# Blocks

<a id="snowui-可复用区块"></a>

# Reusable SnowUI blocks

`components/src/blocks/` houses reusable product-region blocks composed from primitive and composite components, layout protocols, and section-level logic while pages retain routing, data fetching, permissions, and business side effects.

Read [LICENSE](../../LICENSE) before using, modifying, or delivering SnowUI. Import all components and blocks from `@snowui-design-system/components`.

<a id="使用入口"></a>

## Entry points

- [Sidebar](../components/sidebar/reference.md): Application navigation shell with collapse, drawer, and width resizing.
- [SidebarSection](../components/sidebar-section/reference.md): Sidebar navigation group with collapsible items and optional header actions.
- [SidebarItem](../components/sidebar-item/reference.md): Sidebar navigation item with active state, icons, nested hierarchy lines, and status indicators.
- [SearchPopup](../components/search-popup/reference.md): Composable search panel unifying search input, optional headings, grouped results, and spacing.

Compose navigation and search regions from these exported blocks rather than inferring unexported names; import from `@snowui-design-system/components` and configure public Props, Snippets, events, and `parts`.
