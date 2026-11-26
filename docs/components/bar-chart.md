# BarChart

Compare categories with horizontal, vertical, grouped, or stacked bars, axes, and interactive details.



Package: `@snowui-design-system/components`. Import: `import { BarChart } from '@snowui-design-system/components';`. Source fingerprint: `5e0427a58fddca0be3f8eb4c3b7b81c1fb78bb7462dcccc1db5290d9f2deabea`.

## Usage choices

Use BarChart to compare categories. Use LineChart for a continuous time trend or CircularChart for proportions. Configure numeric axes and color through public chart APIs rather than drawing page-level SVG.

- Pass business data; omitting data displays built-in sample values. mode selects single, grouped, stacked, or other bar layouts. See the API and data model for exact structure.
- loading preserves the chart while pausing data interactions. HoverPanel is enabled by default. Configure color with colors and colorMode.
- The default root accessible name follows LocaleProvider through `barChart.name`; an explicit `aria-label` takes priority. The data-cell group uses `barChart.cells`. Business names, data values, and numeric formatting remain controlled by the caller.

## Read as needed

- [API](./bar-chart/api.md): Public Props and defaults
- [Types and states](./bar-chart/types.md): Public type declarations and binding rules
- [Full reference](./bar-chart/reference.md): Composition and interaction boundaries
- [Styles](./bar-chart/styles.md): Registered public overrides
- [Examples](./bar-chart/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/bar-chart/images.json): Use only if appearance remains uncertain
- [Changelog](./bar-chart/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
