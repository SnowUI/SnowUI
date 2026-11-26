# ChartGroup

Coordinate multiple charts in one area with shared category hover, layered rendering, and aligned axes.



Package: `@snowui-design-system/components`. Import: `import { ChartGroup } from '@snowui-design-system/components';`. Source fingerprint: `ccc03834c6171c9caf53fc355ea289fa90d70771e2390406b66f39eb5c34618f`.

## Usage choices

Use ChartGroup to combine charts under shared settings. Configure each chart through its own public data and visual APIs; do not modify internal marks from a page selector.

- ChartGroup supplies shared axes and interactions. It does not create charts, titles, or legends.
- Compose BarChart and LineChart explicitly, coordinating their width, height, and positioning to share a canvas.
- The default root accessible name follows LocaleProvider through `chartGroup.name`; an explicit `aria-label` takes priority. The data-cell group uses `chartGroup.cells`. When no corresponding xLabels entry is provided, `chartGroup.cell` uses the complete `{{index}}` template with one-based numbering; explicit category names remain unchanged. Business names, data values, and numeric formatting remain controlled by the caller.

## Read as needed

- [API](./chart-group/api.md): Public Props and defaults
- [Types and states](./chart-group/types.md): Public type declarations and binding rules
- [Full reference](./chart-group/reference.md): Composition and interaction boundaries
- [Styles](./chart-group/styles.md): Registered public overrides
- [Examples](./chart-group/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/chart-group/images.json): Use only if appearance remains uncertain
- [Changelog](./chart-group/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
