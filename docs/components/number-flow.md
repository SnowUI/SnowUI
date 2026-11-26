# NumberFlow

Animate changing numbers digit by digit with width transitions while preserving currency, grouping, and decimals.



Package: `@snowui-design-system/components`. Import: `import { NumberFlow } from '@snowui-design-system/components';`. Source fingerprint: `9c2043d262efb53c7b1883a594e2af6c502a934d215682bd575454ab5317e1a2`.

## Usage choices

Use NumberFlow for scrolling number transitions. Compare NumericText when you need a different numeric transition. Use Text for static values without starting animation.

- value supplies the number; an unparseable string displays as 0. locales and format control number formatting.
- children supplies content before or after the number. Explicitly enable respectMotionPreference when the animation should follow the system reduced-motion setting.

## Read as needed

- [API](./number-flow/api.md): Public Props and defaults
- [Types and states](./number-flow/types.md): Public type declarations and binding rules
- [Full reference](./number-flow/reference.md): Composition and interaction boundaries
- [Styles](./number-flow/styles.md): Registered public overrides
- [Examples](./number-flow/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/number-flow/images.json): Use only if appearance remains uncertain
- [Changelog](./number-flow/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
