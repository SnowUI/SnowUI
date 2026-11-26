# Spinner

Indicate ongoing loading with a rotating ring, spokes, or capsule shape.



Package: `@snowui-design-system/components`. Import: `import { Spinner } from '@snowui-design-system/components';`. Source fingerprint: `741ec2e0ded900c178ad2e0e5833a0c595072e5927a0c0c416363c2351be9de7`.

## Usage choices

Use Spinner for a continuing wait state. Use Progress when completion can be measured. Prefer the built-in Spinner of a loading Button or table when available.

- variant chooses the waiting graphic. size takes priority over parent size and defaults to 16 without context.
- Spinner does not render children. Compose a loading label outside it. Use Progress when a completion ratio is known.
- The default loading status name follows LocaleProvider; an explicit aria-label takes priority. External loading descriptions remain caller-owned text.

## Read as needed

- [API](./spinner/api.md): Public Props and defaults
- [Types and states](./spinner/types.md): Public type declarations and binding rules
- [Full reference](./spinner/reference.md): Composition and interaction boundaries
- [Styles](./spinner/styles.md): Registered public overrides
- [Examples](./spinner/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/spinner/images.json): Use only if appearance remains uncertain
- [Changelog](./spinner/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
