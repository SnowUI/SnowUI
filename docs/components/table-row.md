# TableRow

Group header or data cells into one row with consistent hover and interaction feedback.



Package: `@snowui-design-system/components`. Import: `import { TableRow } from '@snowui-design-system/components';`. Source fingerprint: `3601ab96abe870c76bb0c570a7c712a882eb0311484032dce910ab1128e205db`.

## Usage choices

Use TableRow to organize table cells. In DataTable, pass a rowId that matches rowKey. Declare row previews with DataTable onRowPreview; clicking arbitrary row content does not automatically select the row.

- Use TableCell or TableHead children to keep a valid table row structure.
- In DataTable, rowId must match rowKey. active is visual state; configure click handling and selection behavior separately.

## Read as needed

- [API](./table-row/api.md): Public Props and defaults
- [Types and states](./table-row/types.md): Public type declarations and binding rules
- [Full reference](./table-row/reference.md): Composition and interaction boundaries
- [Styles](./table-row/styles.md): Registered public overrides
- [Examples](./table-row/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table-row/images.json): Use only if appearance remains uncertain
- [Changelog](./table-row/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
