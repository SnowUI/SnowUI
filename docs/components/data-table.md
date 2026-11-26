# DataTable

Coordinate querying, sorting, and pagination with composable toolbar, table, and pagination controls.



Package: `@snowui-design-system/components`. Import: `import { DataTable } from '@snowui-design-system/components';`. Source fingerprint: `9a616fb7039e7c9ad6b2449663ed610cd6d5fb0b3b35276ed3a8543597203816`.

## Usage choices

Use DataTable for file or record lists that need search, filtering, sorting, pagination, selection, or action columns. It coordinates data state with TableToolbar, the Table family, and Pagination. Use Table for display only. Enable selection explicitly and use stable rowKey and matching TableRow.rowId; configure actions for action columns. The page owns requests and data formatting.

- client mode processes data locally; server mode receives page-provided requests and results. children receives the current render state.
- Enable selection and actions explicitly. rowKey defaults to an index; for sorting or data updates, use a stable business ID and match it in TableRow.rowId.
- Pages start at 1. Initial loading, background refreshing, and incremental loadMore are distinct states.

Manual incremental loading renders a centered outline Load more button internally; callers should not duplicate it. state.loadMore remains available for the same data source. Loading, refreshing, appending and exhausted states do not expose another clickable load button. TableBody owns localized empty and no-results states. Empty tables hide pagination and retain a Black 20 header divider in every variant; body dividers remain Black 10.

## Read as needed

- [API](./data-table/api.md): Public Props and defaults
- [Types and states](./data-table/types.md): Public type declarations and binding rules
- [Full reference](./data-table/reference.md): Composition and interaction boundaries
- [Styles](./data-table/styles.md): Registered public overrides
- [Examples](./data-table/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/data-table/images.json): Use only if appearance remains uncertain
- [Changelog](./data-table/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
