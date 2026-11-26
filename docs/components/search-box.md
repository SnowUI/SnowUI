# SearchBox

Open a search popup from a fully clickable search entry, optionally with a shortcut hint.



Package: `@snowui-design-system/components`. Import: `import { SearchBox } from '@snowui-design-system/components';`. Source fingerprint: `953fb6bd4c4fb603ee89ae63f3b26c878d5b1d8850173e548ce96a99d4d33274`.

## Usage choices

Use SearchBox as a clickable entry that opens global search. It is not an editable query input; use SearchInput for direct entry in a toolbar or list.

- This is a clickable search entry. bind:open synchronizes the popup state; value displays the current query.
- Use children for a popup or keyboard-shortcut hint. Use SearchInput when the user must edit a query directly.
- The default placeholder and clear action follow LocaleProvider. Explicit placeholder values, including an empty string, and aria-label take priority; the query remains unchanged.

Default search icons use an opaque theme color with opacity 0.2 at rest and 0.4 on hover or when a value is present. Color overrides should be opaque to avoid multiplying alpha. Dimming applies to the icon, not the whole input.

## Read as needed

- [API](./search-box/api.md): Public Props and defaults
- [Types and states](./search-box/types.md): Public type declarations and binding rules
- [Full reference](./search-box/reference.md): Composition and interaction boundaries
- [Styles](./search-box/styles.md): Registered public overrides
- [Examples](./search-box/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/search-box/images.json): Use only if appearance remains uncertain
- [Changelog](./search-box/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
