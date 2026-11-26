# Indicator

Provide a draggable resize handle for panels and content areas, with mouse and keyboard support.



Package: `@snowui-design-system/components`. Import: `import { Indicator } from '@snowui-design-system/components';`. Source fingerprint: `4ade8041457a30a52e2c19043dbe7cbd39660be4a9ca00b242814b1e8ca8fbc1`.

## Usage choices

Use Indicator for a public resize handle or size indication. On an application page, prefer built-in resizing in Sidebar, SidePanel, or table columns rather than copying their drag behavior.

- target defaults to the direct parent, but can point to another element. minSize and maxSize constrain the dimension.
- applySize controls whether Indicator writes the size directly; onSizeChange reports updates. step and largeStep control keyboard increments.

## Read as needed

- [API](./indicator/api.md): Public Props and defaults
- [Types and states](./indicator/types.md): Public type declarations and binding rules
- [Full reference](./indicator/reference.md): Composition and interaction boundaries
- [Styles](./indicator/styles.md): Registered public overrides
- [Examples](./indicator/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/indicator/images.json): Use only if appearance remains uncertain
- [Changelog](./indicator/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
