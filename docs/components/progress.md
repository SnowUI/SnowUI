# Progress

Show determinate or indeterminate progress with a bar or circle for uploads, processing, and loading.



Package: `@snowui-design-system/components`. Import: `import { Progress } from '@snowui-design-system/components';`. Source fingerprint: `83ec748505cda3ecc166438360e5581d34bcab812acf15d662dc8b97a82a82ad`.

## Usage choices

Use Progress to show known or unknown completion. Set isIndeterminate when progress is unknown. Spinner can represent a simple wait, while GaugeChart can show a business metric.

- value is a percentage from 0 to 100. Do not replace an unknown value with an invented percentage; use isIndeterminate.
- variant selects line or circle. showLabel generates a circle label; explicit children replace the default label.

## Read as needed

- [API](./progress/api.md): Public Props and defaults
- [Types and states](./progress/types.md): Public type declarations and binding rules
- [Full reference](./progress/reference.md): Composition and interaction boundaries
- [Styles](./progress/styles.md): Registered public overrides
- [Examples](./progress/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/progress/images.json): Use only if appearance remains uncertain
- [Changelog](./progress/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
