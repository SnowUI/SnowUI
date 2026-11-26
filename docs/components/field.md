# Field

Combine an input, label, icon, and validation feedback into a consistent form field.



Package: `@snowui-design-system/components`. Import: `import { Field } from '@snowui-design-system/components';`. Source fingerprint: `52216701c62473a4183e2c8563d81ceabcf01a9abf62659036cae37a705f0846`.

## Usage choices

Use Field to combine a label, input, help, and error. When Input, Select, or Textarea is placed inside Field, Field owns the related surfaces. Use as="segment" for adjoining field segments; avoid duplicate borders and error regions.

- label and error provide default copy; invalid and readonly express field state.
- Use children to compose Input, Select, Textarea, and attachments. parts configures generated label and error content; set Props directly on explicit child components.

Leading and trailing accessories are part of one field, not separate segments, and have no segment dividers. Validated date inputs remain on the same row as external accessories.

## Read as needed

- [API](./field/api.md): Public Props and defaults
- [Types and states](./field/types.md): Public type declarations and binding rules
- [Full reference](./field/reference.md): Composition and interaction boundaries
- [Styles](./field/styles.md): Registered public overrides
- [Examples](./field/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/field/images.json): Use only if appearance remains uncertain
- [Changelog](./field/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
