# SearchInput

Provide a single-line search field with an icon for filtering lists, pages, and toolbar content.



Package: `@snowui-design-system/components`. Import: `import { SearchInput } from '@snowui-design-system/components';`. Source fingerprint: `2fc0308035cbe4e422841665820115c691f0e86ecd4768968f3235dcd583c308`.

## Usage choices

Use SearchInput for direct query entry, such as searching a list. Use SearchBox to open a global search popup. The host filters the data. For DataTable, prefer the TableToolbar search control.

- bind:value keeps the input text in sync; the page decides how that query filters application data.
- The default as="search" role can place it in the search region of Listbox or Popover. Inside an existing surface, borderless avoids a second border and background.

Default search icons use opacity 0.2 at rest and 0.4 on focus with an opaque theme color. The owned icon public style prevents the generic Input leading color from multiplying alpha. --snowui-search-input-icon-color-override accepts an opaque color; state opacity still applies. External leading icons are unaffected.

## Read as needed

- [API](./search-input/api.md): Public Props and defaults
- [Types and states](./search-input/types.md): Public type declarations and binding rules
- [Full reference](./search-input/reference.md): Composition and interaction boundaries
- [Styles](./search-input/styles.md): Registered public overrides
- [Examples](./search-input/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/search-input/images.json): Use only if appearance remains uncertain
- [Changelog](./search-input/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
