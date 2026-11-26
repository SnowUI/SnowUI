# TableBody

Group Table data rows while preserving table body semantics.



Package: `@snowui-design-system/components`. Import: `import { TableBody } from '@snowui-design-system/components';`. Source fingerprint: `8e7a526331cb81b9d2e08fc8a1ef20c904ba8d7b55058dcb2ff653be69315b5f`.

## Usage choices

Use TableBody for the body region of a Table, containing TableRows. Use its existing loading protocol; do not put page-layout elements that are invalid inside tbody.

- Place normal data rows in children. During initial loading, hide them and show skeleton rows matching the registered columns.
- parts configures generated loading rows and Spinner, not explicitly supplied data rows.

When not loading and no data rows exist, a localized No data row spans all columns. It uses left-aligned 12px text, 40px row height and table padding. It does not participate in continuous hover and is hidden when real rows or loading indicators exist.

## Read as needed

- [API](./table-body/api.md): Public Props and defaults
- [Types and states](./table-body/types.md): Public type declarations and binding rules
- [Full reference](./table-body/reference.md): Composition and interaction boundaries
- [Styles](./table-body/styles.md): Registered public overrides
- [Examples](./table-body/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table-body/images.json): Use only if appearance remains uncertain
- [Changelog](./table-body/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
