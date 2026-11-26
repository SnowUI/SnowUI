# Listbox

Present selectable options in a popup with search filtering and keyboard support, including Select panels.



Package: `@snowui-design-system/components`. Import: `import { Listbox } from '@snowui-design-system/components';`. Source fingerprint: `ac953ec17d2f93478591c5f2fa8114fb7c23e784b0fe04a776cb5b1ab0c032a0`.

## Usage choices

Use Listbox for an option panel with keyboard navigation and selection semantics, usually hosted by Select. Notifications, contacts, and activity feeds are content lists and do not use Listbox.

- Each item needs a unique value; label provides display text and search text. children replaces the generated items.
- For explicit options, use MenuItem as="item". For an explicit search field, use Input as="search" and disable built-in search to avoid duplicate inputs.
- The generated search placeholder follows LocaleProvider through listbox.search. Explicit parts.Input.placeholder values, including an empty string, and native aria-label values retain priority. Configure explicit Input children yourself; query text and option content are not translated.

## Read as needed

- [API](./listbox/api.md): Public Props and defaults
- [Types and states](./listbox/types.md): Public type declarations and binding rules
- [Full reference](./listbox/reference.md): Composition and interaction boundaries
- [Styles](./listbox/styles.md): Registered public overrides
- [Examples](./listbox/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/listbox/images.json): Use only if appearance remains uncertain
- [Changelog](./listbox/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
