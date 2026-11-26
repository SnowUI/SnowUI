# NumericText

Animate only the changing portions of short text or numbers while preserving unchanged content.



Package: `@snowui-design-system/components`. Import: `import { NumericText } from '@snowui-design-system/components';`. Source fingerprint: `72360d0020390438f35f9a39169b829221d6eac3c9bede566afb0068eeab8073`.

## Usage choices

Use NumericText to animate changing numeric values. Use FlowText or SlotText for full text replacement. Configure styling and formatting through the public API.

- Update value to change the number; locales and format control its presentation. Set animated=false to show the result immediately.
- The default respects reduced-motion preferences. direction and trend control movement; use the public typography and color props for styling.

## Read as needed

- [API](./numeric-text/api.md): Public Props and defaults
- [Types and states](./numeric-text/types.md): Public type declarations and binding rules
- [Full reference](./numeric-text/reference.md): Composition and interaction boundaries
- [Styles](./numeric-text/styles.md): Registered public overrides
- [Examples](./numeric-text/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/numeric-text/images.json): Use only if appearance remains uncertain
- [Changelog](./numeric-text/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
