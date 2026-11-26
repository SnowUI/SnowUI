# Switch

Toggle a setting or feature that takes effect immediately.



Package: `@snowui-design-system/components`. Import: `import { Switch } from '@snowui-design-system/components';`. Source fingerprint: `806fb0d066749034730bcc54f66d9de74601797240b25e4beab42c81e563b340`.

## Usage choices

Use required only when an action explicitly requires the switch to be on. Ordinary switches remain optional.

Use Switch for a two-state setting that takes effect immediately. Use Checkbox for multiple form selections, or Radio or Segmented for a mutually exclusive parameter.

- Use bind:checked to keep the switch state in sync. value is only the internal input value and does not determine whether the switch is on.
- The current name and form attributes are not forwarded to the internal input. If native form submission is required, synchronize a field in the form layer. Provide a readable label.

## Read as needed

- [API](./switch/api.md): Public Props and defaults
- [Types and states](./switch/types.md): Public type declarations and binding rules
- [Full reference](./switch/reference.md): Composition and interaction boundaries
- [Styles](./switch/styles.md): Registered public overrides
- [Examples](./switch/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/switch/images.json): Use only if appearance remains uncertain
- [Changelog](./switch/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
