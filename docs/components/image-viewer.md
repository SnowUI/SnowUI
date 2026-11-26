# ImageViewer

Preview images or videos at page level with previous, next, and close controls.



Package: `@snowui-design-system/components`. Import: `import { ImageViewer } from '@snowui-design-system/components';`. Source fingerprint: `c724d15ba3e7630f6a71d9ec59af7ec5297b10ca95237a272bc6b699371a9f19`.

## Usage choices

Use ImageViewer to enlarge images and navigate a group. Use Image for ordinary in-page display. Reuse the existing zoom, close, and keyboard interactions rather than rebuilding them.

- Omit open, items, and index together for page-wide automatic mode. In manual mode, provide the preview list and current item explicitly.
- children replaces every default control Button. Use parts when only changing their appearance so close and previous/next controls remain available.

## Read as needed

- [API](./image-viewer/api.md): Public Props and defaults
- [Types and states](./image-viewer/types.md): Public type declarations and binding rules
- [Full reference](./image-viewer/reference.md): Composition and interaction boundaries
- [Styles](./image-viewer/styles.md): Registered public overrides
- [Examples](./image-viewer/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/image-viewer/images.json): Use only if appearance remains uncertain
- [Changelog](./image-viewer/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
