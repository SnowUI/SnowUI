# Table

Display structured data in a semantic table with adaptive columns, local horizontal scrolling, and loading states.



Package: `@snowui-design-system/components`. Import: `import { Table } from '@snowui-design-system/components';`. Source fingerprint: `c312278e5f123ab82c9ae79d6f25cab8b1ac50228f85820f9ada079aece7afef`.

## Usage choices

Use Table to display structured data with TableHeader, TableBody, TableRow, TableHead, and TableCell. When searching, sorting, selection, action columns, or pagination are needed, let DataTable coordinate them rather than duplicating data management around Table.

- Preserve valid table hierarchy with TableHeader, TableBody, TableRow, and related components.
- columnWidths stores widths and columnId aligns a column across rows. Leave querying, selection, and pagination to DataTable.

All variants reuse the TableBody empty state when there is no data or no search result. Empty tables retain a Black 20 header divider and hide pagination. Body dividers remain Black 10.

## Read as needed

- [API](./table/api.md): Public Props and defaults
- [Types and states](./table/types.md): Public type declarations and binding rules
- [Full reference](./table/reference.md): Composition and interaction boundaries
- [Styles](./table/styles.md): Registered public overrides
- [Examples](./table/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table/images.json): Use only if appearance remains uncertain
- [Changelog](./table/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
