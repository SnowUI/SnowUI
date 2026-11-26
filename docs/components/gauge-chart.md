# GaugeChart

Show several proportions in a semicircle or half pie with segments, gradients, ring thickness, and reveal motion.



Package: `@snowui-design-system/components`. Import: `import { GaugeChart } from '@snowui-design-system/components';`. Source fingerprint: `14a248183c63ffa42a88d0459aaf55ff94fac7cbbcabd532c60fa63dbb81c944`.

## Usage choices

Use GaugeChart for half-ring proportions. Like CircularChart, its current data model calculates shares from the sum of categories. Use Progress for task completion.

- GaugeChart shows proportional half-ring categories, not a single min/max gauge. Each data item has a name and positive value; shares use the sum of valid visible items.
- Omitting data shows demonstration values; an empty array shows an empty chart. Set centerTitle, centerSubtitle, or public content roles for center copy.
- The default root accessible name follows LocaleProvider through `gaugeChart.name`; an explicit `aria-label` takes priority. Business names, data values, and numeric formatting remain controlled by the caller.

## Read as needed

- [API](./gauge-chart/api.md): Public Props and defaults
- [Types and states](./gauge-chart/types.md): Public type declarations and binding rules
- [Full reference](./gauge-chart/reference.md): Composition and interaction boundaries
- [Styles](./gauge-chart/styles.md): Registered public overrides
- [Examples](./gauge-chart/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/gauge-chart/images.json): Use only if appearance remains uncertain
- [Changelog](./gauge-chart/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
