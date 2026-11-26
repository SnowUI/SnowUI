# Toast

Show brief feedback for results or status changes, with icons, actions, and rich content.



Package: `@snowui-design-system/components`. Import: `import { Toast } from '@snowui-design-system/components';`. Source fingerprint: `1522e3267141f1a9bd3eededc655ea054c3b3e5ca860ee902909605f25ed41ab`.

## Usage choices

Use Toast for brief feedback about an action, with Toaster managing display. Use a persistent content list for notification history or activity records rather than Toast.

- Call toast for brief feedback and let Toaster manage the queue. When rendering Toast independently, the page removes it after dismissal.
- as="toast" can connect a parent click trigger. Compose attachments with leading and trailing roles; parts configures only the default close Button. Use inherited singleLine with Text lines={1} for short labels. Internal gaps keep at least 4 CSS px; rich multiline content retains its layout.

Simple notifications use Frame singleLine by default. Rich notifications retain their multiline body layout instead of forcing the entire notification onto one line.

## Read as needed

- [API](./toast/api.md): Public Props and defaults
- [Types and states](./toast/types.md): Public type declarations and binding rules
- [Full reference](./toast/reference.md): Composition and interaction boundaries
- [Styles](./toast/styles.md): Registered public overrides
- [Examples](./toast/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/toast/images.json): Use only if appearance remains uncertain
- [Changelog](./toast/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
