# Tag

Use an interactive label for markers, filters, or path segments.



Package: `@snowui-design-system/components`. Import: `import { Tag } from '@snowui-design-system/components';`. Source fingerprint: `140aab537c6cdc54dcad15d83b04f8bbe7e53b2a12b48db4ade24db869c7419a`.

## Usage choices

Use Tag for bounded label content with a public close action. Closing and selection have different meanings; use a separate Button or selection control when that is the intended interaction.

- closable displays the close action, and onClose asks the page to remove the data. Closing does not modify the page’s list automatically.
- variant, shape, and toggle control appearance, shape, and toggle behavior respectively. parts configures only the generated close Button.
- The built-in close button name follows LocaleProvider and supports Provider messages overrides. The caller still owns tag content and removal after onClose.

The tag root uses Frame singleLine by default and retains its internal zero-gap exception. External icon-label combinations still use the general 4 CSS px minimum.

## Read as needed

- [API](./tag/api.md): Public Props and defaults
- [Types and states](./tag/types.md): Public type declarations and binding rules
- [Full reference](./tag/reference.md): Composition and interaction boundaries
- [Styles](./tag/styles.md): Registered public overrides
- [Examples](./tag/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/tag/images.json): Use only if appearance remains uncertain
- [Changelog](./tag/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
