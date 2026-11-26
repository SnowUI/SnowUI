# TableHead

Define a Table column heading with optional sorting and resizing.



Package: `@snowui-design-system/components`. Import: `import { TableHead } from '@snowui-design-system/components';`. Source fingerprint: `7bf93e896276fb0e25c58234b45911a5a179199c35223039fd31b9227b3f8ccc`.

## Usage choices

Use TableHead for a title cell in a table header row. DataTable coordinates data sorting. Column resizing and data sorting are independent capabilities; resizable does not imply sortable.

- columnId aligns the column, resizable controls width adjustment, and separate sortDirection and onSortChange express sort state.
- The selection role uses the DataTable select-all control. parts configures generated Indicator and Checkbox components; configure an explicit title yourself.

Columns register during SSR before TableBody renders, so skeleton rows retain the final column count and layout. All variants retain a Black 20 header divider when empty or without search results; this is an exception to the general Black 10 divider rule.

Sortable header labels and icons use Frame singleLine and stay together during refresh and column resizing.

## Read as needed

- [API](./table-head/api.md): Public Props and defaults
- [Types and states](./table-head/types.md): Public type declarations and binding rules
- [Full reference](./table-head/reference.md): Composition and interaction boundaries
- [Styles](./table-head/styles.md): Registered public overrides
- [Examples](./table-head/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table-head/images.json): Use only if appearance remains uncertain
- [Changelog](./table-head/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
