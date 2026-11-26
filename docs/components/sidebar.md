# Sidebar

Organize brand entry, grouped navigation, and footer actions with collapse and independent scrolling.



Package: `@snowui-design-system/components`. Import: `import { Sidebar } from '@snowui-design-system/components';`. Source fingerprint: `abbe68d1104bc58593b9834dff59abaa26d3043f46e813221749cfd323808fc6`.

## Usage choices

Use Sidebar for grouped navigation on the left side of an application, composed from SidebarSection and SidebarItem. The page owns routing and content. Public logo and footer roles can replace built-in content. Do not use Sidebar for an ordinary right-side information column.

- sections supplies navigation data. children renders alongside sections rather than replacing it.
- A direct child with as="logo" replaces the logo; as="footer" goes to the fixed bottom area. Width and collapse state can be bound, and persistence is enabled by default.
- Default navigation and scroll-region names and built-in collapse controls, including the floating expand button in text mode, follow LocaleProvider. An explicit ariaLabel takes priority over Provider messages.

Persist collapsed, active item and section states under persistenceKey. Read saved state before the first browser render. The component also writes the snowui-sidebar-collapsed-<encoded key> layout cookie (1/0); SSR hosts can read it and pass collapsed to avoid an expanded skeleton flash. Hosts own the section URL and establish Sidebar height before loading. The footer Snippet renders in place during SSR and takes priority over legacy as="footer" relocation. Entering the sidebar or toggle area fades in the toggle. After a click, it attempts to fade out after one second, remains visible while hovered, and hides after leaving. Shared color motion duration and reduced-motion settings apply.

Icon-mode collapsed width derives from item and outer padding (56px by default). Icons retain their horizontal position; the toggle sits outside header content without covering the logo.

The scrollbar track spans the navigation area between measured fixed header and visible footer regions. Logo text, item labels and section titles share one fade clock; width starts simultaneously, and vertical item movement starts immediately after text fades out.

## Read as needed

- [API](./sidebar/api.md): Public Props and defaults
- [Types and states](./sidebar/types.md): Public type declarations and binding rules
- [Full reference](./sidebar/reference.md): Composition and interaction boundaries
- [Styles](./sidebar/styles.md): Registered public overrides
- [Examples](./sidebar/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/sidebar/images.json): Use only if appearance remains uncertain
- [Changelog](./sidebar/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
