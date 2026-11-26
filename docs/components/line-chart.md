# LineChart

Plot trends with multiple series, area fill, solid or dashed lines, axes, grids, and point styling.



Package: `@snowui-design-system/components`. Import: `import { LineChart } from '@snowui-design-system/components';`. Source fingerprint: `8320d49552ab3b9cf4fb695879e6567fddb9acf23abeac1507678596401ea762`.

## Usage choices

Use LineChart for continuous data or trends over time. For category comparison, use BarChart. Declare points, axes, hints, and colors through the public chart settings.

- Supply data through series. LineChart does not create sample data; keep xLabels aligned with data points.
- loading retains the axes and canvas while waiting, then reveals data. HoverPanel is enabled by default; use public chart settings for colors and formats.
- The default root accessible name follows LocaleProvider through `lineChart.name`; an explicit `aria-label` takes priority. The data-cell group uses `lineChart.cells`. Business names, data values, and numeric formatting remain controlled by the caller.

## Read as needed

- [API](./line-chart/api.md): Public Props and defaults
- [Types and states](./line-chart/types.md): Public type declarations and binding rules
- [Full reference](./line-chart/reference.md): Composition and interaction boundaries
- [Styles](./line-chart/styles.md): Registered public overrides
- [Examples](./line-chart/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/line-chart/images.json): Use only if appearance remains uncertain
- [Changelog](./line-chart/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
