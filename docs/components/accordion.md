# Accordion

Organize related content into expandable sections for FAQs, settings, and step-by-step explanations, with single or multiple sections open.



Package: `@snowui-design-system/components`. Import: `import { Accordion } from '@snowui-design-system/components';`. Source fingerprint: `da7901353b78dda7a84d3a5427591350e07c67947435ad2a0c16c80962b3281e`.

## Usage choices

Use Accordion for FAQs, grouped settings, and collapsible explanations. Use Tab to switch content panels in the same region. Place AccordionItem inside Accordion.

- type="single" uses a string value and multiple uses an array. bind:value synchronizes expanded items; defaultValue supplies only the initial state.
- items mode uses stringified indices as values. Generated titles truncate on one line while retaining their complete accessible name; parts.Text configures that title text. Explicit children replace items and configure themselves rather than reading generated-child parts.
- Inside Accordion, Icon as="leading" inherits its icon size when size is omitted: 16/20/24 for sm/md/lg. Other Icons do not use this special inheritance; an explicit size takes priority.

## Read as needed

- [API](./accordion/api.md): Public Props and defaults
- [Types and states](./accordion/types.md): Public type declarations and binding rules
- [Full reference](./accordion/reference.md): Composition and interaction boundaries
- [Styles](./accordion/styles.md): Registered public overrides
- [Examples](./accordion/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/accordion/images.json): Use only if appearance remains uncertain
- [Changelog](./accordion/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
