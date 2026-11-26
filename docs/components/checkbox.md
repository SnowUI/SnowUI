# Checkbox

Select independent options with checked, unchecked, and indeterminate states in forms or bulk selection.



Package: `@snowui-design-system/components`. Import: `import { Checkbox } from '@snowui-design-system/components';`. Source fingerprint: `d69942708a9e6873583ba338a18aba725bdbd19adf5061f74ec48da802ed12a1`.

## Usage choices

Explicit required, name and form target the native input. Required applies to this checkbox, not an entire multi-selection group.

Use Checkbox for an independent option or for selecting multiple options. Use Radio for a mutually exclusive choice, Switch for a two-state setting that takes effect immediately, and the built-in selection protocol for a DataTable selection column.

- Bind an independent boolean with bind:checked. For multiple selections, use bind:group and give each option a stable value.
- Manage indeterminate separately from checked to represent a partial selection. Provide a label or ariaLabel, and use disabled when the option is unavailable.

## Read as needed

- [API](./checkbox/api.md): Public Props and defaults
- [Types and states](./checkbox/types.md): Public type declarations and binding rules
- [Full reference](./checkbox/reference.md): Composition and interaction boundaries
- [Styles](./checkbox/styles.md): Registered public overrides
- [Examples](./checkbox/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/checkbox/images.json): Use only if appearance remains uncertain
- [Changelog](./checkbox/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
