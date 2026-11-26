# LocaleProvider

Set the language of built-in SnowUI interface messages for an application or subtree, with custom overrides.



Package: `@snowui-design-system/components`. Import: `import { LocaleProvider } from '@snowui-design-system/components';`. Source fingerprint: `9224009e32c4e866705e5160660e7323bead1223b1d1a5ec925f2b7269f5747a`.

## Usage choices

Set built-in UI language or override messages for descendant components. The application remains responsible for its own titles and data. Explicit component text takes precedence, and LocaleProvider adds no visible wrapper.

- locale selects a built-in language, while messages overrides individual component messages. Explicit text on a component takes priority.
- children renders in place without an extra wrapper. The application still translates its business titles and data.

## Read as needed

- [API](./locale-provider/api.md): Public Props and defaults
- [Types and states](./locale-provider/types.md): Public type declarations and binding rules
- [Full reference](./locale-provider/reference.md): Composition and interaction boundaries
- [Styles](./locale-provider/styles.md): Registered public overrides
- [Examples](./locale-provider/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/locale-provider/images.json): Use only if appearance remains uncertain
- [Changelog](./locale-provider/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
