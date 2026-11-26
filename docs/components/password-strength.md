# PasswordStrength

Evaluate password strength locally with a four-segment indicator and labels; the component does not persist, send, or submit passwords.



Package: `@snowui-design-system/components`. Import: `import { PasswordStrength } from '@snowui-design-system/components';`. Source fingerprint: `0ebeaab56fdc573748cffa6ae02d42e76231e555d633f6622f3e2fec2e21bbdb`.

## Usage choices

Pass the current password value from an input. The default heuristic considers length and character categories; minimumLength defaults to 8 and optional character requirements have independent guidance. It does not check breached or common passwords and does not guarantee security. Override evaluate and labels for your own policy and wording.

## Read as needed

- [API](./password-strength/api.md): Public Props and defaults
- [Types and states](./password-strength/types.md): Public type declarations and binding rules
- [Full reference](./password-strength/reference.md): Composition and interaction boundaries
- [Styles](./password-strength/styles.md): Registered public overrides
- [Examples](./password-strength/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/password-strength/images.json): Use only if appearance remains uncertain
- [Changelog](./password-strength/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
