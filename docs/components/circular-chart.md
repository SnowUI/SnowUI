# CircularChart

Show proportions as a ring or pie with segments, rounded ends, ring thickness, and hover emphasis.



Package: `@snowui-design-system/components`. Import: `import { CircularChart } from '@snowui-design-system/components';`. Source fingerprint: `0326972d00d0c7abdd9b65ba97dea494566541ca911e4b248f2ee5ceba0d97ef`.

## Usage choices

Use CircularChart for category proportions in a ring or pie. For goal completion, choose GaugeChart or Progress according to the meaning. Configure colors and labels through public Props.

- Each data item needs a name and finite positive value. Only the first maxItems valid items appear, and their sum is the percentage denominator. An explicit empty array shows an empty chart.
- Prefer numeric size. String geometry parses only the numeric portion, so percentages and CSS variables do not provide reliable responsive geometry. Use public center-label, segment-value, and segment-name roles for center content.
- The default root accessible name follows LocaleProvider through `circularChart.name`; an explicit `aria-label` takes priority. Business names, data values, and numeric formatting remain controlled by the caller.

## Read as needed

- [API](./circular-chart/api.md): Public Props and defaults
- [Types and states](./circular-chart/types.md): Public type declarations and binding rules
- [Full reference](./circular-chart/reference.md): Composition and interaction boundaries
- [Styles](./circular-chart/styles.md): Registered public overrides
- [Examples](./circular-chart/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/circular-chart/images.json): Use only if appearance remains uncertain
- [Changelog](./circular-chart/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
