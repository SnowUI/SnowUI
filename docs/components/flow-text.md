# FlowText

Animate changes in text or numbers for dynamic copy, counters, timers, and countdowns.



Package: `@snowui-design-system/components`. Import: `import { FlowText } from '@snowui-design-system/components';`. Source fingerprint: `104a4c8eec0dc40d681f22b37bff43abc7ffc66cfc7f5715125ca7fc0f2c87c7`.

## Usage choices

Use FlowText for a flowing transition when text content changes. Use Text for static copy. For numeric-only changes, compare NumericText and NumberFlow first.

- value is the target text or number. locales and format control numeric formatting; children supplies additional content.
- motionColor and transition configure public motion. Explicitly enable respectMotionPreference when the animation should follow the system reduced-motion setting.

## Read as needed

- [API](./flow-text/api.md): Public Props and defaults
- [Types and states](./flow-text/types.md): Public type declarations and binding rules
- [Full reference](./flow-text/reference.md): Composition and interaction boundaries
- [Styles](./flow-text/styles.md): Registered public overrides
- [Examples](./flow-text/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/flow-text/images.json): Use only if appearance remains uncertain
- [Changelog](./flow-text/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
