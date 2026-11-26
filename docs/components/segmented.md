# Segmented

Switch quickly among a small set of exclusive filters or parameters, with keyboard and form support.



Package: `@snowui-design-system/components`. Import: `import { Segmented } from '@snowui-design-system/components';`. Source fingerprint: `7623a48b1478d9e8cb56f02cbefc2a87d28a34f905422df039b7f3e37b6db39c`.

## Usage choices

Use Segmented to choose one of several mutually exclusive parameters or filters. It uses radiogroup semantics. Use Tab when switching between content panels or views.

- Bind a stable option value with bind:value. If the value is missing or does not match, the first option is only a visual fallback; it does not write to the binding. Initialize the value explicitly for forms.
- For explicit children, use Button as="item". A nonempty name adds a hidden form field. The application restores its business value on form reset.

## Read as needed

- [API](./segmented/api.md): Public Props and defaults
- [Types and states](./segmented/types.md): Public type declarations and binding rules
- [Full reference](./segmented/reference.md): Composition and interaction boundaries
- [Styles](./segmented/styles.md): Registered public overrides
- [Examples](./segmented/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/segmented/images.json): Use only if appearance remains uncertain
- [Changelog](./segmented/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
