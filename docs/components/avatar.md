# Avatar

Display a person or team avatar with image, text, and gradient fallbacks for lists, comments, and member details.



Package: `@snowui-design-system/components`. Import: `import { Avatar } from '@snowui-design-system/components';`. Source fingerprint: `6e643e3df9a5c44632a02e68510d67f757f39d7c55d8a248679e5f56a360d583`.

## Usage choices

Use Avatar for a user or team identity. Use AvatarGroup for overlapping participants; compose Avatar with an ordinary list and text for a vertical contact list.

- Show an image with src and configure fallback or fallbackText for missing images. Provide a stable fallbackSeed for the same identity.
- Use as="badge" for a corner badge or as="avatar-image" to replace the visual. Explicit size takes priority, followed by parent avatar size.

## Read as needed

- [API](./avatar/api.md): Public Props and defaults
- [Types and states](./avatar/types.md): Public type declarations and binding rules
- [Full reference](./avatar/reference.md): Composition and interaction boundaries
- [Styles](./avatar/styles.md): Registered public overrides
- [Examples](./avatar/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/avatar/images.json): Use only if appearance remains uncertain
- [Changelog](./avatar/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
