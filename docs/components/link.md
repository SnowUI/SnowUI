# Link

Provide clear text links in content, descriptions, and navigation, with optional directional indicators.



Package: `@snowui-design-system/components`. Import: `import { Link } from '@snowui-design-system/components';`. Source fingerprint: `91afd0effc6b478f4faa4e692205b418498ac1b951cb8fe44e536a1b0bf80413`.

## Usage choices

Use Link to navigate to an address or resource. Use Button for an immediate action. Supply a real href rather than a placeholder address that makes a link behave like a button.

- Supply a real href. target and rel control how the destination opens; disabled marks the link unavailable.
- lines, tooltip, and onTruncate control truncation feedback. parts configures only the built-in Tooltip.

The link root uses Frame singleLine by default. Leading content, text, and trailing content remain on one line without waiting for mounted icon detection.

Frame singleLine emits data-auto-layout and reuses the three-slot layout in auto-layout.css (source: components/src/styles/auto-layout.css). Text is Content; the external variant's built-in ArrowSquareOut is trailing content. Direct external as="leading" and as="trailing" snippet children are projected to the Link root, preserving grid slots, centering, and shared gaps. The Link root owns its data-auto-layout gap, with at least 4 CSS px and a preferred var(--gap-1). Links use Frame singleLine by default; explicitly disable singleLine for multiline prose. Use lines={1} for long labels to reuse truncation and full-text access. External icons retain their dimensions and default to 16px when size is omitted.

## Read as needed

- [API](./link/api.md): Public Props and defaults
- [Types and states](./link/types.md): Public type declarations and binding rules
- [Full reference](./link/reference.md): Composition and interaction boundaries
- [Styles](./link/styles.md): Registered public overrides
- [Examples](./link/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/link/images.json): Use only if appearance remains uncertain
- [Changelog](./link/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
