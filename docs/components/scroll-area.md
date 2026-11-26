# ScrollArea

Provide scrollable content with a consistent scrollbar for long lists, panels, and constrained spaces.



Package: `@snowui-design-system/components`. Import: `import { ScrollArea } from '@snowui-design-system/components';`. Source fingerprint: `241a3cac9671d3f335238999eee51027490f4223ea486b3ae8cb916ea56a5cef`.

## Usage choices

Use ScrollArea for a region that needs independent scrolling. Avoid accidental layers of nested page scrolling. Prefer Table’s own local horizontal viewport for tables.

- axis chooses the scroll direction. The content or host needs a finite size for scrolling to occur.
- bind:viewport exposes the actual scrolling element and onscroll receives its events. Use ariaLabel to describe the region.
- The default scroll viewport name follows LocaleProvider; an explicit ariaLabel takes priority. Children remain caller-owned content.

## Read as needed

- [API](./scroll-area/api.md): Public Props and defaults
- [Types and states](./scroll-area/types.md): Public type declarations and binding rules
- [Full reference](./scroll-area/reference.md): Composition and interaction boundaries
- [Styles](./scroll-area/styles.md): Registered public overrides
- [Examples](./scroll-area/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/scroll-area/images.json): Use only if appearance remains uncertain
- [Changelog](./scroll-area/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
