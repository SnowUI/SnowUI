# Kbd

Display shortcuts or keyboard hints as compact keycaps.



Package: `@snowui-design-system/components`. Import: `import { Kbd } from '@snowui-design-system/components';`. Source fingerprint: `fd6978b6b307422185f97e91804a5b670e50e0cf6b97035291b822ae5dbc2854`.

## Usage choices

Use Kbd to display a key or shortcut hint. It does not register shortcuts; the component or page that owns the action handles the keyboard event.

- children represents the key label only. variant chooses an outlined or filled appearance.
- Place the shortcut hint beside its action. Register the shortcut in the page or component that owns that action.
- When several keys form one shortcut, use Frame singleLine to keep them on one line with at least 4 CSS px between them. An outer horizontal ScrollArea retains the complete keys in very narrow containers.

## Read as needed

- [API](./kbd/api.md): Public Props and defaults
- [Types and states](./kbd/types.md): Public type declarations and binding rules
- [Full reference](./kbd/reference.md): Composition and interaction boundaries
- [Styles](./kbd/styles.md): Registered public overrides
- [Examples](./kbd/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/kbd/images.json): Use only if appearance remains uncertain
- [Changelog](./kbd/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
