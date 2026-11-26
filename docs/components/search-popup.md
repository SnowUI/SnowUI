# SearchPopup

Compose a search panel with SearchInput and optional results, groups, and custom content; search logic and routing stay with the host.



Package: `@snowui-design-system/components`. Import: `import { SearchPopup } from '@snowui-design-system/components';`. Source fingerprint: `5713e2cba3543c9a401cce25ca8a415b90e229d7ca37bc46221d27913ab16065`.

## Usage choices

Use SearchPopup for a standard layout of search input and results. SearchBox opens it; SearchPopup is the panel and renders statically by default. Set backdrop for a shared modal overlay. Without a backdrop, an anchored trigger uses the inherited Popover template or inline mode.

- items creates text or link results, optionally grouped. showGroupTitles controls group headings.
- children replaces every built-in result. Use Text as="group-title" for explicit headings and MenuItem as="item" for explicit results.
- After setting search={false}, provide SearchInput as="content" explicitly. Configure that input directly; it does not consume parts.

## Read as needed

- [API](./search-popup/api.md): Public Props and defaults
- [Types and states](./search-popup/types.md): Public type declarations and binding rules
- [Full reference](./search-popup/reference.md): Composition and interaction boundaries
- [Styles](./search-popup/styles.md): Registered public overrides
- [Examples](./search-popup/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/search-popup/images.json): Use only if appearance remains uncertain
- [Changelog](./search-popup/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
