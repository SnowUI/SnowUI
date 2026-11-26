# CopyButton

Copy text or code to the clipboard and briefly confirm success, useful for links, identifiers, and install commands.



Package: `@snowui-design-system/components`. Import: `import { CopyButton } from '@snowui-design-system/components';`. Source fingerprint: `f51b095c506711319a05068a7d6959073523a7dadd140a4615f636b7faf4414e`.

## Usage choices

With skeleton=false, pending asynchronous copying uses the Button Spinner and blocks repeated clicks until it completes or fails.

Use CopyButton to copy content and show brief feedback. Supply text or getText for the value, and use writeText when an application already has its own clipboard operation. The component manages the success state.

- Use text for a fixed value or getText for a value resolved at click time. writeText replaces the clipboard write operation.
- Handle business feedback with onCopy and onCopyError. Set showText=false for an icon-only button; feedbackDuration controls how long the result remains visible.

## Read as needed

- [API](./copy-button/api.md): Public Props and defaults
- [Types and states](./copy-button/types.md): Public type declarations and binding rules
- [Full reference](./copy-button/reference.md): Composition and interaction boundaries
- [Styles](./copy-button/styles.md): Registered public overrides
- [Examples](./copy-button/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/copy-button/images.json): Use only if appearance remains uncertain
- [Changelog](./copy-button/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
