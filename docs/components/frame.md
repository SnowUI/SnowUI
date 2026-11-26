# Frame

Coordinate layout, state, loading, and motion across components through explicit configuration.



Package: `@snowui-design-system/components`. Import: `import { Frame } from '@snowui-design-system/components';`. Source fingerprint: `d5c3be7beea8a64bd9fa7d7fa38ec2e9260cc70894c538e58e303830e0a8f947`.

## Usage choices

Use Frame as a general host when layout, state, context, loading, skeleton, or motion capabilities are needed. Ordinary page structure may use semantic HTML.

- row, column, or grid selects layout; as declares a composition role; bind:element gives access to the root element.
- Use singleLine for one-line labels and row firstLine for prose that may wrap. Prefer tokens and public class or style for colors, spacing, and radius.
- Frame owns orchestrate*, target/action, and styles. For motion across components, establish context with initMotion().
- Without style configuration or Motion context, Frame creates no cross-component registry or motion subscription.

## Read as needed

- [API](./frame/api.md): Public Props and defaults
- [Types and states](./frame/types.md): Public type declarations and binding rules
- [Full reference](./frame/reference.md): Composition and interaction boundaries
- [Styles](./frame/styles.md): Registered public overrides
- [Examples](./frame/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/frame/images.json): Use only if appearance remains uncertain
- [Changelog](./frame/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
