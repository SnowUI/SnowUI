# CopyLink

Show a link that opens from its text and copies its address from the rest of the control.



Package: `@snowui-design-system/components`. Import: `import { CopyLink } from '@snowui-design-system/components';`. Source fingerprint: `7c2ce70efa1f0ee9ea08794bf09186aa98a145ce4a5ab629d13050aa87959c86`.

## Usage choices

Use CopyLink for share addresses, invitation links, and AI documentation entries. It belongs to the link family with Link.

- Use Link for ordinary text navigation, CopyLink when the address should be copied, and Input when it should be edited.
- href is the complete address used for display, navigation, and copying. Long addresses are truncated only on screen, never in the copied value.
- Hover underlines the text; navigation opens a new tab by default. Clicking whitespace or the icon on the right copies the URL; CopyButton owns success feedback.

## Read as needed

- [API](./copy-link/api.md): Public Props and defaults
- [Types and states](./copy-link/types.md): Public type declarations and binding rules
- [Full reference](./copy-link/reference.md): Composition and interaction boundaries
- [Styles](./copy-link/styles.md): Registered public overrides
- [Examples](./copy-link/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/copy-link/images.json): Use only if appearance remains uncertain
- [Changelog](./copy-link/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
