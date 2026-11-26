# Breadcrumb

Show the current page hierarchy and provide paths back to parent pages.



Package: `@snowui-design-system/components`. Import: `import { Breadcrumb } from '@snowui-design-system/components';`. Source fingerprint: `e62cf1e5bb25434ca9f35ee526c8b44a9d842ecf47093c00b2277972ee86b55c`.

## Usage choices

Use Breadcrumb to show the current page hierarchy on one line by default. The host owns available width and overflow; path items are not automatically hidden. Use Tab for switching peer content and Sidebar for application navigation. The page owns route changes.

- items generates the path; the final item automatically becomes the noninteractive current page.
- Explicit Button as="item" and Text as="separator" children replace items. parts configures only generated content.
- The default navigation name follows LocaleProvider; an explicit ariaLabel takes priority. Path labels and business content remain unchanged.

When Button backdrop blur is configured, inactive items dim only their content, preserving the opacity of the button and blur layer. Hover restores content opacity. Separators use Black 10 without additional opacity.

## Read as needed

- [API](./breadcrumb/api.md): Public Props and defaults
- [Types and states](./breadcrumb/types.md): Public type declarations and binding rules
- [Full reference](./breadcrumb/reference.md): Composition and interaction boundaries
- [Styles](./breadcrumb/styles.md): Registered public overrides
- [Examples](./breadcrumb/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/breadcrumb/images.json): Use only if appearance remains uncertain
- [Changelog](./breadcrumb/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
