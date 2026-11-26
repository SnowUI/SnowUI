# Pagination

Navigate between pages of tabular data, lists, or search results.



Package: `@snowui-design-system/components`. Import: `import { Pagination } from '@snowui-design-system/components';`. Source fingerprint: `25f807ea01f4c7983dedd46b5308ce3fae38951bbd3ffa8da16b0a8ede576c0a`.

## Usage choices

Use Pagination to navigate multi-page content. Connect it to DataTable rendering state when used with a table. Changing a page and requesting data are separate responsibilities; Pagination does not fetch data.

- page starts at 1. total is the number of pages, not the number of records. Connect onPageChange to page state.
- pageSizeOptions supplies per-page choices, and pageSize can be bound. The page or DataTable owns data requests and total-page calculation.
- The default navigation name follows LocaleProvider; an explicit ariaLabel takes priority. Page numbers, page size and responsibility for business requests are unchanged.

Pagination hides when Table/DataTable data or filtered results are empty. Pagination only renders when total is greater than one. It defaults to outline buttons, fill width across its container, and centered content.

## Read as needed

- [API](./pagination/api.md): Public Props and defaults
- [Types and states](./pagination/types.md): Public type declarations and binding rules
- [Full reference](./pagination/reference.md): Composition and interaction boundaries
- [Styles](./pagination/styles.md): Registered public overrides
- [Examples](./pagination/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/pagination/images.json): Use only if appearance remains uncertain
- [Changelog](./pagination/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
