# MetricCard

Display one dashboard metric and an optional change; the application supplies the data and calculates comparisons.



Package: `@snowui-design-system/components`. Import: `import { MetricCard } from '@snowui-design-system/components';`. Source fingerprint: `5cdd72799a06f051a4f9c849e94e9b0893279ad8bff4f91c126312c17811780c`.

## Usage choices

Arrange multiple MetricCard components for a dashboard; use Card for general content. The caller provides values and comparisons. Use emphasis to select the primary value and trend to describe its direction.

Card is the actual host. Callers own layout and formatted values. Empty values display "-", real zero remains visible, and omitting change removes its region. The default background is Background/3, configurable through --snowui-metric-card-background-override. With emphasis="change", change is on the left and the current value on the right. Include a sign or text to convey direction without color alone. MetricCard does not fetch data or calculate comparisons and supports SSR.

## Read as needed

- [API](./metric-card/api.md): Public Props and defaults
- [Types and states](./metric-card/types.md): Public type declarations and binding rules
- [Full reference](./metric-card/reference.md): Composition and interaction boundaries
- [Styles](./metric-card/styles.md): Registered public overrides
- [Examples](./metric-card/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/metric-card/images.json): Use only if appearance remains uncertain
- [Changelog](./metric-card/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
