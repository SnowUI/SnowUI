# Text

Render text with typography and truncation options for content, labels, and constrained areas.



Package: `@snowui-design-system/components`. Import: `import { Text } from '@snowui-design-system/components';`. Source fingerprint: `12e06e348032598347999227d1846a76bf9229e62bc461b41de9194a219d152f`.

## Usage choices

Use Text for text semantics, truncation, expansion, and hints. Hover motion is off by default. Ordinary static text can use semantic HTML; choose a motion component for animated values or text transitions.

- tag selects text semantics, lines controls truncation, and more or tooltip provides expansion or a supplemental hint.
- Hover interaction is off by default. stateText can replace copy by state, and parts configures generated Button or Tooltip children.
- With lines=1, shortened visible text retains its complete accessible name, including when used inside a button, link or native label.

## Read as needed

- [API](./text/api.md): Public Props and defaults
- [Types and states](./text/types.md): Public type declarations and binding rules
- [Full reference](./text/reference.md): Composition and interaction boundaries
- [Styles](./text/styles.md): Registered public overrides
- [Examples](./text/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/text/images.json): Use only if appearance remains uncertain
- [Changelog](./text/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
