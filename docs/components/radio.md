# Radio

Choose one option from a mutually exclusive group when all choices should remain visible.



Package: `@snowui-design-system/components`. Import: `import { Radio } from '@snowui-design-system/components';`. Source fingerprint: `5859a59d09f3168d7dd00249686b8f29925001b3a72e29eb827ba707c5178000`.

## Usage choices

Use matching name and bind:group for a native required group. Selecting any item satisfies the constraint.

Use Radio to choose one option from a group. Use Checkbox for multiple selections and Segmented for segmented parameter choices. Give the group and each option an accessible name.

- Bind the same group state and give each Radio a distinct, stable value. Use null when there is no initial selection.
- The current option can be deselected, which writes undefined. Do not assume a selected option can never be cleared. Provide a readable label.

## Read as needed

- [API](./radio/api.md): Public Props and defaults
- [Types and states](./radio/types.md): Public type declarations and binding rules
- [Full reference](./radio/reference.md): Composition and interaction boundaries
- [Styles](./radio/styles.md): Registered public overrides
- [Examples](./radio/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/radio/images.json): Use only if appearance remains uncertain
- [Changelog](./radio/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
