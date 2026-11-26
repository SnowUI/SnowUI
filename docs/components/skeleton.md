# Skeleton

Show a placeholder outline while content loads, previewing structure and keeping layout stable.



Package: `@snowui-design-system/components`. Import: `import { Skeleton } from '@snowui-design-system/components';`. Source fingerprint: `418744dd55563e79f9632a9750c32fe2f78bd888700fda6476f72f596448611e`.

## Usage choices

Use Skeleton as a loading placeholder. When an existing component supports loading or skeleton, set that state so it can provide the correct shape rather than redrawing its skeleton in the page.

- loading=false renders real children. During loading, variant, width, height, or renderHints controls the placeholder.
- Prefer a component’s own loading shape. For a standalone Skeleton, use design-system Tokens for dimensions and corner radius.

## Read as needed

- [API](./skeleton/api.md): Public Props and defaults
- [Types and states](./skeleton/types.md): Public type declarations and binding rules
- [Full reference](./skeleton/reference.md): Composition and interaction boundaries
- [Styles](./skeleton/styles.md): Registered public overrides
- [Examples](./skeleton/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/skeleton/images.json): Use only if appearance remains uncertain
- [Changelog](./skeleton/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
