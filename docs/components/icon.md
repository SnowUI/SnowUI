# Icon

Display SVG icons with consistent sizing and color in buttons, navigation, and content.



Package: `@snowui-design-system/components`. Import: `import { Icon } from '@snowui-design-system/components';`. Source fingerprint: `2a1443f9cb38dbe43d71b4a9a647ecb01dbadb1b8129e10ad5598d2bf13c3ace`.

## Usage choices

Use Icon as a consistent host for icons and their sizes. Prefer SnowUI resource icons. For an action, place the icon in Button and give the action an accessible name; do not present a decorative graphic as an action.

- Prefer a resource icon. children renders only when neither src nor the resolved icon matches.
- size can inherit parent size context. Use Badge as="badge" for a corner badge. Give the Button that owns an action its accessible name.
- Inside Accordion, Icon as="leading" inherits the Accordion icon size when size is omitted: 16/20/24 for sm/md/lg. Other Icons do not use this special inheritance, and an explicit size takes priority.

## Read as needed

- [API](./icon/api.md): Public Props and defaults
- [Types and states](./icon/types.md): Public type declarations and binding rules
- [Full reference](./icon/reference.md): Composition and interaction boundaries
- [Styles](./icon/styles.md): Registered public overrides
- [Examples](./icon/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/icon/images.json): Use only if appearance remains uncertain
- [Changelog](./icon/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
