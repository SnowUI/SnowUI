# Tooltip

Show a short explanation on hover with collision handling and smooth switching.



Package: `@snowui-design-system/components`. Import: `import { Tooltip } from '@snowui-design-system/components';`. Source fingerprint: `0746e9f6e4704f73f8a670ca76c849e85aba8f30047ce91329e2e923e532ee4f`.

## Usage choices

Use Tooltip for a short supplemental hint on an existing control. Do not put essential content only in a Tooltip. For forms, menus, or complex content, prefer Popover or Dialog.

- Place Tooltip inside its trigger element; it does not wrap the trigger. When children is omitted, Tooltip reads the trigger text.
- Without an explicit open value, hover controls visibility. When open is explicitly true or false, the page controls it. Keep essential content and actions available outside the hint.

## Read as needed

- [API](./tooltip/api.md): Public Props and defaults
- [Types and states](./tooltip/types.md): Public type declarations and binding rules
- [Full reference](./tooltip/reference.md): Composition and interaction boundaries
- [Styles](./tooltip/styles.md): Registered public overrides
- [Examples](./tooltip/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/tooltip/images.json): Use only if appearance remains uncertain
- [Changelog](./tooltip/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
