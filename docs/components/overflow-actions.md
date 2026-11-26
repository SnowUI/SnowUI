# OverflowActions

Keep actions accessible in limited space by moving those that do not fit into a More menu.



Package: `@snowui-design-system/components`. Import: `import { OverflowActions } from '@snowui-design-system/components';`. Source fingerprint: `16f1161bc2bef8036138e0ca98385540438ace21b566bcd2373a40521137e425`.

## Usage choices

Use OverflowActions when a group of actions should move into a More menu as available width shrinks. Compose OverflowAction and Separator; keep width measurement and menu allocation inside the component.

- items contains action or separator entries with unique IDs. Explicit children replaces items.
- For explicit composition, use OverflowAction as="item" and Separator as="separator". compact, overflow, and overflowFrom control how actions are moved.

## Read as needed

- [API](./overflow-actions/api.md): Public Props and defaults
- [Types and states](./overflow-actions/types.md): Public type declarations and binding rules
- [Full reference](./overflow-actions/reference.md): Composition and interaction boundaries
- [Styles](./overflow-actions/styles.md): Registered public overrides
- [Examples](./overflow-actions/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/overflow-actions/images.json): Use only if appearance remains uncertain
- [Changelog](./overflow-actions/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
