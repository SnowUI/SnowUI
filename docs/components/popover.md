# Popover

Show supplementary content or actions near a trigger with size and trigger options.



Package: `@snowui-design-system/components`. Import: `import { Popover } from '@snowui-design-system/components';`. Source fingerprint: `562a440f2196c3fc4c2bcad0ab520be3af39700ef4341a970532d0480f385fd5`.

## Usage choices

Use Popover for floating content tied to a trigger anchor. Use Tooltip for a short text hint or Dialog when content needs dialog focus handling. Configure closing through the public closeOn prop.

- Place as="popover" inside the trigger host to associate it with the anchor automatically. In static mode, control visibility manually with bind:open.
- trigger selects the opening behavior and closeOn selects the closing policy. Use closeOn="manual" for an interactive example that must remain open.

## Read as needed

- [API](./popover/api.md): Public Props and defaults
- [Types and states](./popover/types.md): Public type declarations and binding rules
- [Full reference](./popover/reference.md): Composition and interaction boundaries
- [Styles](./popover/styles.md): Registered public overrides
- [Examples](./popover/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/popover/images.json): Use only if appearance remains uncertain
- [Changelog](./popover/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
