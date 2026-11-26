# OTPInput

Enter a configurable 4–8 digit one-time code with full-code paste, SMS autofill, and native form submission and reset.



Package: `@snowui-design-system/components`. Import: `import { OTPInput } from '@snowui-design-system/components';`. Source fingerprint: `3083bba6a986b6c2da2a2fb8c7241f67b6c6cc9dceb8ccdcac7ab8c915ac99b1`.

## Usage choices

Native validation failures suppress browser bubbles and still block invalid submission. Empty required fields only pulse a red border briefly, show no text, and return to their original state. Nonempty type, length, and format errors display validationMessage below the component. Focus goes to the first invalid field; editing updates feedback and reset clears it. Business validation uses invalid and error; native errors take precedence. Native message language is controlled by the browser. Client validity does not imply server acceptance.

Enter a numeric one-time code already sent by an application or identity provider. This component handles entry; the application sends and verifies codes and owns any countdown.

- Defaults to 6 digits; supports 4, 5, 6, 7, or 8. Any slot can be selected; spaces preserve empty positions in partial values. Paste is validated strictly as described below.
- `oncomplete` runs only when user entry produces a new complete value. Initialization, external assignment, and repeated synchronization of the same complete value do not trigger it.
- `name`, `form`, `required`, `disabled`, `readonly`, and `autocomplete="one-time-code"` are applied to the real input.

## Read as needed

- [API](./otp-input/api.md): Public Props and defaults
- [Types and states](./otp-input/types.md): Public type declarations and binding rules
- [Full reference](./otp-input/reference.md): Composition and interaction boundaries
- [Styles](./otp-input/styles.md): Registered public overrides
- [Examples](./otp-input/examples.md): Code and preview links
- [Image index](https://snowui.dev/llms/components/otp-input/images.json): Use only if appearance remains uncertain
- [Changelog](./otp-input/changelog.md): Version history reviewed in English

[Design guide](../guides/design-system.md) · [Styling guide](../guides/styling.md)
