# Slider

Choose one value or a range by dragging, with horizontal, vertical, stepped, and filled styles.



Package: `@snowui-design-system/components`. Import: `import { Slider } from '@snowui-design-system/components';`. Source fingerprint: `8614bf5338b4ddb7c06d49cdf94c1c45d8fd28edbc8d43293111d3773c673671`.

## Usage choices

Use Slider for continuous value or range adjustment. Use Segmented or Select for discrete choices. Set clear minValue, maxValue, step, and accessible names.

- With bind:value, a number represents one thumb and an array represents a two-thumb range. minValue and maxValue set the bounds.
- step sets the increment and ariaLabel supplies an accessible name. An explicit Text child with as="label" replaces a generated label.
- The default bar title in solid and soft variants follows LocaleProvider. Explicit titles, including an empty string, ariaLabel values, numeric values, and explicit labels remain unchanged. The title does not replace an accessible name.

## Read as needed

- [API](./slider/api.md): Public Props and defaults
- [Types and states](./slider/types.md): Public type declarations and binding rules
- [Full reference](./slider/reference.md): Composition and interaction boundaries
- [Styles](./slider/styles.md): Registered public overrides
- [Examples](./slider/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/slider/images.json): Use only if appearance remains uncertain
- [Changelog](./slider/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
