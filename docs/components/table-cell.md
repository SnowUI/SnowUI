# TableCell

Display text, components, or custom content in a Table cell, truncating long content by default.



Package: `@snowui-design-system/components`. Import: `import { TableCell } from '@snowui-design-system/components';`. Source fingerprint: `5f22316b1cfab7651f367f7b0a57a056deaf4e0864711ac0595de75affed3042`.

## Usage choices

Use TableCell as a data cell in TableRow. Selection and action column roles apply only in a DataTable with those capabilities enabled. Explicit content replaces the default content for that cell.

- Place it inside TableRow and use columnId to align columns. lines and tooltip control long-content display.
- DataTable enables selection and action columns. Explicit children in an actions cell replace the default actions.

## Read as needed

- [API](./table-cell/api.md): Public Props and defaults
- [Types and states](./table-cell/types.md): Public type declarations and binding rules
- [Full reference](./table-cell/reference.md): Composition and interaction boundaries
- [Styles](./table-cell/styles.md): Registered public overrides
- [Examples](./table-cell/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/table-cell/images.json): Use only if appearance remains uncertain
- [Changelog](./table-cell/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
