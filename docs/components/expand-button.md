# ExpandButton

Switch between expanded and collapsed states with consistent button feedback.



Package: `@snowui-design-system/components`. Import: `import { ExpandButton } from '@snowui-design-system/components';`. Source fingerprint: `94cd7cfef23257ce9c0ebf69e2b9bc6c9134abf9ed359277bcc09cb55680b5f7`.

## Usage choices

Use ExpandButton to expand or restore content. When a host such as CodeBlock already offers the action, configure that host instead of maintaining two expansion states.

- Receive state through bind:expanded or onExpandedChange; defaultExpanded supplies the initial value.
- The component only provides the expand action. The page connects its state to the actual content; it does not create or control the panel.

## Read as needed

- [API](./expand-button/api.md): Public Props and defaults
- [Types and states](./expand-button/types.md): Public type declarations and binding rules
- [Full reference](./expand-button/reference.md): Composition and interaction boundaries
- [Styles](./expand-button/styles.md): Registered public overrides
- [Examples](./expand-button/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/expand-button/images.json): Use only if appearance remains uncertain
- [Changelog](./expand-button/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
