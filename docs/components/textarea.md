# Textarea

Enter multi-line descriptions, notes, or longer content with native form attributes and field feedback.



Package: `@snowui-design-system/components`. Import: `import { Textarea } from '@snowui-design-system/components';`. Source fingerprint: `32e3fb6e2dfcb48dc6c72f338b111700ad13fef9383c590be91fba26fe9e185b`.

## Usage choices

With required, empty submission focuses the first invalid field and briefly pulses its red border, keeping the original ring color. It restores the original state without empty-field text. Reduced motion only focuses the field. Browser bubbles are suppressed while invalid submissions remain blocked. Nonempty format and business errors retain text; editing or reset clears feedback.

Native validation failures suppress browser bubbles and still block invalid submission. Empty required fields only pulse a red border briefly, show no text, and return to their original state. Nonempty type, length, and format errors display validationMessage below the component. Focus goes to the first invalid field; editing updates feedback and reset clears it. Business validation uses invalid and error; native errors take precedence. Native message language is controlled by the browser. Client validity does not imply server acceptance.

Use Textarea for multiple lines of text; use Input for one line. Compose it with Field for a label, help, and error. Do not use a read-only input as a layout substitute for ordinary display text.

- bind:value synchronizes text. defaultValue is only a fallback when value is undefined. Restore the bound value on form reset.
- resize controls allowed directions. readonly, disabled, or resize="none" removes the resize handle. name participates in form submission.

## Read as needed

- [API](./textarea/api.md): Public Props and defaults
- [Types and states](./textarea/types.md): Public type declarations and binding rules
- [Full reference](./textarea/reference.md): Composition and interaction boundaries
- [Styles](./textarea/styles.md): Registered public overrides
- [Examples](./textarea/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/textarea/images.json): Use only if appearance remains uncertain
- [Changelog](./textarea/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
