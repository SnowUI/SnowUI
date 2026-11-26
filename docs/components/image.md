# Image

Display images and placeholders with badges, actions, and preview entry points.



Package: `@snowui-design-system/components`. Import: `import { Image } from '@snowui-design-system/components';`. Source fingerprint: `1f2975700ea47e8923dbde83ab4a801a42a10ebeda80d8050cb9adac5dad22aa`.

## Usage choices

Use Image to show an image and its public loading and preview behavior. Prefer Avatar for identities, ImageGroup for multiple images, and ImageViewer for focused viewing.

- Provide src and meaningful alt text. Attachments with as="icon" or as="badge" do not replace the image.
- Configure previews with previewMode. ImageGroup can share size and preview policy across images; ImageViewer hosts the full viewer.

## Read as needed

- [API](./image/api.md): Public Props and defaults
- [Types and states](./image/types.md): Public type declarations and binding rules
- [Full reference](./image/reference.md): Composition and interaction boundaries
- [Styles](./image/styles.md): Registered public overrides
- [Examples](./image/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/image/images.json): Use only if appearance remains uncertain
- [Changelog](./image/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
