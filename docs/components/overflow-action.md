# OverflowAction

Define an action in OverflowActions that moves between a toolbar and its More menu as space changes.



Package: `@snowui-design-system/components`. Import: `import { OverflowAction } from '@snowui-design-system/components';`. Source fingerprint: `cc00ad49dad42313cd8c9342b7de30d4d53469be5e4a7d2de4349ea34f01e610`.

## Usage choices

Use OverflowAction for one action inside OverflowActions, with a stable identity. Use Separator for structural dividers rather than treating a divider as an executable action.

- A direct child declares as="item" and provides a unique id and a readable label.
- children replaces only the visible button content. The overflow menu still takes its label and icon from the corresponding props.
- For a dedicated control, provide control as a Snippet and connect its run callback to that control’s onclick. The menu executes the same action; bind state through the dedicated control’s public API.

## Read as needed

- [API](./overflow-action/api.md): Public Props and defaults
- [Types and states](./overflow-action/types.md): Public type declarations and binding rules
- [Full reference](./overflow-action/reference.md): Composition and interaction boundaries
- [Styles](./overflow-action/styles.md): Registered public overrides
- [Examples](./overflow-action/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/overflow-action/images.json): Use only if appearance remains uncertain
- [Changelog](./overflow-action/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
