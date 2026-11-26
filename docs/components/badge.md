# Badge

Show unread counts and status with compact numbers, text, or dots alongside buttons, avatars, and navigation items.



Package: `@snowui-design-system/components`. Import: `import { Badge } from '@snowui-design-system/components';`. Source fingerprint: `22290ea3f809a9af90ad9efee965dd43c398a1aec3c4e36db20093e9b8334050`.

## Usage choices

Use Badge for a short status or count. Use Button when the user must trigger an action, and choose Chip or Tag for an interactive label inside an input.

- children takes priority over count. Explicit dot mode shows only a dot and no content.
- Counts cap at 99 by default and zero is hidden by default; use max and showZero to change this. Use as="badge" for a badge on Avatar or Icon.

## Read as needed

- [API](./badge/api.md): Public Props and defaults
- [Types and states](./badge/types.md): Public type declarations and binding rules
- [Full reference](./badge/reference.md): Composition and interaction boundaries
- [Styles](./badge/styles.md): Registered public overrides
- [Examples](./badge/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/badge/images.json): Use only if appearance remains uncertain
- [Changelog](./badge/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
