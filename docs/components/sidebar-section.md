# SidebarSection

Group Sidebar items under a heading with expand, collapse, and optional actions.



Package: `@snowui-design-system/components`. Import: `import { SidebarSection } from '@snowui-design-system/components';`. Source fingerprint: `3627995671eecbbd68a717c8c82fecc2655f33e6990ed699fee0add8d4380f04`.

## Usage choices

Use SidebarSection for a titled navigation group inside Sidebar. Do not add a second Separator when the group already provides one. Use SidebarItem for its entries.

- id identifies the group, title names it, and children contains navigation items.
- collapsible and collapsed control closing the group, while defaultCollapsed is its initial state. actions supplies group-level operations.
- Built-in expand/collapse accessible names follow LocaleProvider. The caller owns title and action.label; the component preserves their text.

## Read as needed

- [API](./sidebar-section/api.md): Public Props and defaults
- [Types and states](./sidebar-section/types.md): Public type declarations and binding rules
- [Full reference](./sidebar-section/reference.md): Composition and interaction boundaries
- [Styles](./sidebar-section/styles.md): Registered public overrides
- [Examples](./sidebar-section/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/sidebar-section/images.json): Use only if appearance remains uncertain
- [Changelog](./sidebar-section/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
