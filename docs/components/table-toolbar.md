# TableToolbar

Add search, sort, filter, bulk actions, and selection status to DataTable.



Package: `@snowui-design-system/components`. Import: `import { TableToolbar } from '@snowui-design-system/components';`. Source fingerprint: `c77380e999e6e2b41558d746e511a4b312739092d02f27e18ae6526a7ae50a53`.

## Usage choices

Use TableToolbar with DataTable for search, sorting, filtering, and bulk actions. It is not a standalone toolbar for a plain Table. Use the built-in controls or replace them through public as roles. Application callbacks perform the actual copy and delete operations.

- TableToolbar requires DataTable state. search, sort, and filter control the built-in tools; sortOptions sets the available sort fields explicitly.
- Use as="search", "bulk", "sort", or "filter" directly to replace the corresponding region. Implement onCopy and onDelete for application behavior.

Search and filters synchronize with their owning DataTable, including external query/filters updates. Search fills available space and filter tools align to the right. Do not duplicate query, refresh or count controls on the page.

The toolbar and its icon-label actions use Frame singleLine. The search field wrapper, including its error-layout wrapper, fills the remaining width and keeps filters on the right without unnecessarily clipping placeholder text.

## Read as needed

- [API](./table-toolbar/api.md): Public Props and defaults
- [Types and states](./table-toolbar/types.md): Public type declarations and binding rules
- [Full reference](./table-toolbar/reference.md): Composition and interaction boundaries
- [Styles](./table-toolbar/styles.md): Registered public overrides
- [Examples](./table-toolbar/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table-toolbar/images.json): Use only if appearance remains uncertain
- [Changelog](./table-toolbar/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
