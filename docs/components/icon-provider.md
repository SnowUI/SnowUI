# IconProvider

Replace SnowUI functional icons for an application or subtree while retaining defaults for unconfigured icons.



Package: `@snowui-design-system/components`. Import: `import { IconProvider } from '@snowui-design-system/components';`. Source fingerprint: `d37cefb801bcf222b1622a1d3009c5badc61a53d46af8caf8faa001f617a4d48`.

## Usage choices

Use IconProvider to share icon configuration with its descendants. It does not display an icon itself; Icon or a resource component renders the actual graphic.

- icons maps stable semantic names to icon components. resolver looks up an icon by name.
- The provider affects only descendant icon lookup and renders children in place. It adds no visible graphic or layout wrapper.

## Read as needed

- [API](./icon-provider/api.md): Public Props and defaults
- [Types and states](./icon-provider/types.md): Public type declarations and binding rules
- [Full reference](./icon-provider/reference.md): Composition and interaction boundaries
- [Styles](./icon-provider/styles.md): Registered public overrides
- [Examples](./icon-provider/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/icon-provider/images.json): Use only if appearance remains uncertain
- [Changelog](./icon-provider/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
