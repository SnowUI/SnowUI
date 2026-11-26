# Button

Trigger actions or navigation with text, icons, loading, and disabled states, from primary actions to compact tools.



Package: `@snowui-design-system/components`. Import: `import { Button } from '@snowui-design-system/components';`. Source fingerprint: `0d15c2b02d46f5a62191af759eee974ebc7a6f60c22480b9415d752876b8a3fc`.

## Usage choices

For asynchronous form submission, use loading with skeleton=false to show a centered Spinner and disable the button while retaining its dimensions and accessible name.

Use Button to trigger an action. Use bare for an icon action without a button shell. For a padded icon-only button, set iconOnly and provide an aria-label. Use emphasis="muted" for opacity feedback on a bare button. Use Tab to switch content, and Segmented to choose between mutually exclusive values.

- Without a context, the defaults are gray and sm. Explicit variant and size values take priority over group settings.
- An icon-only button needs an accessible name. bare removes the shell; iconOnly keeps it. The component does not infer either mode from its children.

The button root and content motion layer use Frame singleLine by default. Icons and text stay on one line, retaining the preferred component gap with a 4 CSS px minimum. No additional Frame wrapper is needed.

## Read as needed

- [API](./button/api.md): Public Props and defaults
- [Types and states](./button/types.md): Public type declarations and binding rules
- [Full reference](./button/reference.md): Composition and interaction boundaries
- [Styles](./button/styles.md): Registered public overrides
- [Examples](./button/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/button/images.json): Use only if appearance remains uncertain
- [Changelog](./button/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
