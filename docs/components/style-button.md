# StyleButton

Switch between SnowUI and Apple visual styles.



Package: `@snowui-design-system/components`. Import: `import { StyleButton } from '@snowui-design-system/components';`. Source fingerprint: `7a65c504ebec30c61e84871279cf945c9b1a10733058fca4d03f8d38c78f6f4c`.

## Usage choices

Use StyleButton to switch between supported visual styles. Use ColorSchemeButton for light and dark mode. It does not imply that a single Button can change arbitrary private component styles.

- Synchronize the style with bind:mode; defaultMode supplies the initial mode.
- It applies the mode to the document by default. Use applyToDocument=false for local control. Without children it uses icon-only layout.

## Read as needed

- [API](./style-button/api.md): Public Props and defaults
- [Types and states](./style-button/types.md): Public type declarations and binding rules
- [Full reference](./style-button/reference.md): Composition and interaction boundaries
- [Styles](./style-button/styles.md): Registered public overrides
- [Examples](./style-button/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/style-button/images.json): Use only if appearance remains uncertain
- [Changelog](./style-button/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
