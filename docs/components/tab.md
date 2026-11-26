# Tab

Switch between views or content panels, with generated or custom tabs and keyboard navigation.



Package: `@snowui-design-system/components`. Import: `import { Tab } from '@snowui-design-system/components';`. Source fingerprint: `43d8beea203f58c4e21f223af3f7037859154a3b4e38b3bb4167f01f819aae5f`.

## Usage choices

Use Tab to switch content panels or views within the same region. The underline variant matches underlined tabs. Use Segmented when changing only a filter parameter.

- items provides unique values and labels. Explicit Button as="item" children replace items.
- bind:value synchronizes the current item. A missing or unmatched value causes a visual fallback only; it does not write back. The page renders the panel for the current value.

## Read as needed

- [API](./tab/api.md): Public Props and defaults
- [Types and states](./tab/types.md): Public type declarations and binding rules
- [Full reference](./tab/reference.md): Composition and interaction boundaries
- [Styles](./tab/styles.md): Registered public overrides
- [Examples](./tab/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/tab/images.json): Use only if appearance remains uncertain
- [Changelog](./tab/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
