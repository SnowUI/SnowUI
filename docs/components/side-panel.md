# SidePanel

Show details or supporting content from the right in overlay or inline mode while retaining page context.



Package: `@snowui-design-system/components`. Import: `import { SidePanel } from '@snowui-design-system/components';`. Source fingerprint: `d31fb5558bf3290d165ae6f93b2aa6ece49357a65eb50ab5c13000603264e63f`.

## Usage choices

Use SidePanel for details or supporting content that opens and closes, either floating or inline. For a permanently visible notifications, activity, or contacts column, use a page aside; its position on the right alone does not call for SidePanel.

- Bind open to control visibility and placement to choose floating or inline. width is bindable and constrained by minWidth and maxWidth.
- children provides the scrollable content. Set one owner for inline movement with inlineMotionOwner so the page and component do not both move the panel.
- When title is omitted, the toolbar title and panel accessible name follow LocaleProvider. An explicit title, including an empty string, and business content remain unchanged.

## Read as needed

- [API](./side-panel/api.md): Public Props and defaults
- [Types and states](./side-panel/types.md): Public type declarations and binding rules
- [Full reference](./side-panel/reference.md): Composition and interaction boundaries
- [Styles](./side-panel/styles.md): Registered public overrides
- [Examples](./side-panel/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/side-panel/images.json): Use only if appearance remains uncertain
- [Changelog](./side-panel/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
