# CodeBlock

Display copyable code with syntax highlighting, line numbers, fullscreen viewing, and resizing.



Package: `@snowui-design-system/components`. Import: `import { CodeBlock } from '@snowui-design-system/components';`. Source fingerprint: `1fc04b68b8850f06e961068f1287e61a5afd92c190d814c22632ea94eea5a5e6`.

## Usage choices

Use CodeBlock to display copyable code with built-in copy and fullscreen actions. Check the supported scope before using it for editable code; this display component is not an editor.

- Supply code for display. Copy and fullscreen buttons appear by default; visibleLines sets the initial number of visible lines.
- singleLine displays one line without a language label, line numbers, fullscreen panel, or vertical scrolling. A child with as="trailing" replaces the right action area.

The copy button has independent 20px (1.25rem) backdrop blur by default. This does not change the global Button default.

## Read as needed

- [API](./code-block/api.md): Public Props and defaults
- [Types and states](./code-block/types.md): Public type declarations and binding rules
- [Full reference](./code-block/reference.md): Composition and interaction boundaries
- [Styles](./code-block/styles.md): Registered public overrides
- [Examples](./code-block/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/code-block/images.json): Use only if appearance remains uncertain
- [Changelog](./code-block/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
