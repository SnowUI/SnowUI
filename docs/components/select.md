# Select

Choose from a dropdown built from data or custom options, with search and keyboard support.



Package: `@snowui-design-system/components`. Import: `import { Select } from '@snowui-design-system/components';`. Source fingerprint: `a0f6e30cc29520e55acf7a1eb2d267eebbc05918d52f55add87da58f54853436`.

## Usage choices

Persistent selection supports native required validation with component feedback and focus on the visible trigger; action mode does not require a retained value.

Use Select for a single choice from a dropdown. options creates Listbox and MenuItem entries by default; explicit children replaces that panel. For a command menu, prefer SelectButton. Select is not an arbitrary multiselect or free-entry control.

- options generates the default list. Supply Listbox and MenuItem through children to replace it.
- persistent saves the choice; action only calls onAction and closes without retaining it. Use parts for generated items and configure explicit children directly.
- After the list closes with Escape, field and buttonTrigger/SelectButton modes restore focus to the real trigger button. The shared Listbox handles closing from its search header.

## Read as needed

- [API](./select/api.md): Public Props and defaults
- [Types and states](./select/types.md): Public type declarations and binding rules
- [Full reference](./select/reference.md): Composition and interaction boundaries
- [Styles](./select/styles.md): Registered public overrides
- [Examples](./select/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/select/images.json): Use only if appearance remains uncertain
- [Changelog](./select/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
