# Chip

Display a category, status, or short detail as a compact inline label alongside text, icons, and lists.



Package: `@snowui-design-system/components`. Import: `import { Chip } from '@snowui-design-system/components';`. Source fingerprint: `cc9afdb82e42afc0f386b66a2d3887f89a5dba8327690d82f261e8cd5b8e518e`.

## Usage choices

Use Chip for compact content identification and composition. Declare selection, removal, or click behavior through the public API; a display-only Chip is not automatically a button or checkbox.

- The default variant includes a dot. The background variant hides it by default; showDot can override either choice.
- An as="leading" child replaces the dot, and as="trailing" adds trailing content. Pass size explicitly when size changes dynamically.

Chip uses a default gap of 0px between its text and icons, including the built-in dot and external leading/trailing content. This is a registered exception to the minimum gap in LayoutProtocol section 4.6 (source: docs/standards/LayoutProtocol.md). It still uses singleLine and must not wrap. The exception does not apply to spacing between Chip and external text, icons, or other chips.

## Read as needed

- [API](./chip/api.md): Public Props and defaults
- [Types and states](./chip/types.md): Public type declarations and binding rules
- [Full reference](./chip/reference.md): Composition and interaction boundaries
- [Styles](./chip/styles.md): Registered public overrides
- [Examples](./chip/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/chip/images.json): Use only if appearance remains uncertain
- [Changelog](./chip/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
