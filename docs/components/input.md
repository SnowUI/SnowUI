# Input

Provide single-line input for text, search, passwords, numbers, dates, times, and colors, with field feedback.



Package: `@snowui-design-system/components`. Import: `import { Input } from '@snowui-design-system/components';`. Source fingerprint: `53d72a5e6e3f3543fab9010b4f2a1fa7d015e4c8046df393f7ca47863205fa40`.

## Usage choices

Native validation failures suppress browser bubbles and still block invalid submission. Empty required fields only pulse a red border briefly, show no text, and return to their original state. Nonempty type, length, and format errors display validationMessage below the component. Focus goes to the first invalid field; editing updates feedback and reset clears it. Business validation uses invalid and error; native errors take precedence. Native message language is controlled by the browser. Client validity does not imply server acceptance.

Use Input for one-line text entry. Use SearchInput for search and Textarea for multiple lines. Compose it with Field when a label, help, or error is needed.

- bind:value synchronizes edits. An explicit value takes priority over defaultValue. Convert number input strings in application logic before using them in calculations.
- name participates in form submission. On a controlled form reset, restore the bound initial value. bind:element returns the outer element, not the native input.
- file and range do not provide upload or slider behavior. Use leading or trailing roles for attachments; the built-in clear control can take over trailing.

Inside Field, built-in validation renders the control directly and feedback as a separate full-width row. Standalone Input retains its measured error wrapper.

## Read as needed

- [API](./input/api.md): Public Props and defaults
- [Types and states](./input/types.md): Public type declarations and binding rules
- [Full reference](./input/reference.md): Composition and interaction boundaries
- [Styles](./input/styles.md): Registered public overrides
- [Examples](./input/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/input/images.json): Use only if appearance remains uncertain
- [Changelog](./input/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
