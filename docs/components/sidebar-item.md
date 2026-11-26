# SidebarItem

Show a Sidebar navigation item with active state, icon, hierarchy, and status hints.



Package: `@snowui-design-system/components`. Import: `import { SidebarItem } from '@snowui-design-system/components';`. Source fingerprint: `f3d741ca5539bdcef17b2e2fe565db35d457f2b95efae2f78b82eabd4910e734`.

## Usage choices

Use SidebarItem as a navigation entry with stable identity, icon, text, and target address. Active state does not perform business routing automatically.

- Provide a stable id and label. href is the navigation address; onSelect reports the selection.
- disabled prevents navigation. actions configures entry actions, and parts configures built-in Badge and action Buttons.
- The built-in updated dot name follows LocaleProvider. The caller owns label, tags and actions. Existing decorative and accessibility-tree behavior in collapsed mode is unchanged.

Collapsed mode hides text, attachments and their spacing after the icon, retaining only the centered icon layout. Expanded mode preserves the original content composition.

The main navigation host always uses Button, preserving href link semantics. Collapsed iconOnly mode retains item padding and the original icon axis while content fades.

## Read as needed

- [API](./sidebar-item/api.md): Public Props and defaults
- [Types and states](./sidebar-item/types.md): Public type declarations and binding rules
- [Full reference](./sidebar-item/reference.md): Composition and interaction boundaries
- [Styles](./sidebar-item/styles.md): Registered public overrides
- [Examples](./sidebar-item/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/sidebar-item/images.json): Use only if appearance remains uncertain
- [Changelog](./sidebar-item/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
