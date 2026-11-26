# Dialog

Present focused content or actions in a modal with a backdrop, focus management, and background scroll lock.



Package: `@snowui-design-system/components`. Import: `import { Dialog } from '@snowui-design-system/components';`. Source fingerprint: `c806f6bb9bf9cdd79734543dd0d92a20472dffa4e95356c021d218eb099aa1ec`.

## Usage choices

Use Dialog when content needs its own focus and closing flow. Use Popover for a small layer anchored to a button, or Tooltip for a brief hint. Compose titles and actions with the public roles.

- Control the panel with bind:open. Outside clicks and Escape close it by default.
- Only one Dialog stays open on a page at a time: opening a new Dialog automatically closes any open Dialog. Switch content within the same Dialog for multi-step flows; X or Escape closes the entire dialog rather than going back a step.
- Compose content with the public title, content, footer, and close roles. Configure explicit children directly; parts affects only the built-in title, separator, and close button.

## Read as needed

- [API](./dialog/api.md): Public Props and defaults
- [Types and states](./dialog/types.md): Public type declarations and binding rules
- [Full reference](./dialog/reference.md): Composition and interaction boundaries
- [Styles](./dialog/styles.md): Registered public overrides
- [Examples](./dialog/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/dialog/images.json): Use only if appearance remains uncertain
- [Changelog](./dialog/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
