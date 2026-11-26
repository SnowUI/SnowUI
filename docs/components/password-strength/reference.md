# PasswordStrength full reference

Reviewed against Chinese source SHA-256 `371fab3f455bd9494252fa101e0197f4e58fc8f0ecbf2d3b46f44698e169cd3f`.

<a id="passwordstrength"></a>

# PasswordStrength

<a id="组件介绍"></a>

## Introduction

Evaluate password strength immediately with a four-segment indicator and labels. The component does not persist or transmit passwords, write them to the DOM or event results, handle password input, enforce account policy, or submit forms.

<a id="使用选择"></a>

## Usage choices

Pass the current input value. The default heuristic returns 0 for an empty value and 1 below `minimumLength` (8 by default); at or above the minimum, it rates the four character categories from 1 to 4. The default requirement is only the minimum length; optional character requirements have specific guidance. It does not check breached or common passwords or guarantee security. Override `evaluate` and `labels` as needed.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
  import { Input, PasswordStrength } from '@snowui-design-system/components';
  let password = $state('');
</script>

<Input type="password" bind:value={password} aria-label="New password" aria-describedby="strength" />
<PasswordStrength id="strength" {password} labels={['Enter a password', 'Weak', 'Fair', 'Good', 'Perfect']} />
```

<a id="api"></a>

## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| password | `string` | `""` | Caller-managed value; not written to the DOM |
| evaluate | `PasswordStrengthEvaluator` | `evaluatePasswordStrength` | Synchronous evaluator; the caller must return a valid level |
| labels | `readonly [string, string, string, string, string]` | `Enter a password / Weak / Fair / Good / Perfect` | Labels for levels 0–4 respectively |
| minimumLength | `number` | `8` | Minimum character count for the length hint and default evaluation. |
| minimumLengthMessage | `(length: number) => string` | Current locale length message | Custom message shown first when a non-empty password is too short. |
| requireLowercase | `boolean` | `false` | Require at least one ASCII lowercase letter. |
| requireUppercase | `boolean` | `false` | Require at least one ASCII uppercase letter. |
| requireNumber | `boolean` | `false` | Require at least one digit `0–9`. |
| requireSymbol | `boolean` | `false` | Require at least one non-letter, non-digit, non-whitespace character; examples include `! @ # $ %`. |

Also exports evaluatePasswordStrength, PasswordStrengthLevel, and PasswordStrengthEvaluator. Other compatible Props are inherited from [Frame](../frame/reference.md); the component owns children, row, column, gap, and enableAutoLayout.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

By default only a minimum of eight characters is required. An empty value shows its level label. For non-empty values below `minimumLength`, show the length hint first; after it is reached, identify missing lowercase, uppercase, number, and symbol requirements before showing the strength label. These requirements do not replace server-side validation. Four segments are 4px high with 8px gaps; gap and radius use the public --snowui-password-strength-segment-gap-override and --snowui-password-strength-segment-radius-override variables. The indicator and text are inset 4px on each side; the caller provides a 16px gap from the input, labels the input, and associates the result with aria-describedby. The component has no interaction, timers, or motion and supports server rendering. Custom evaluators receive the password and must not persist or send it.

<a id="ai-对话使用"></a>

### Use in AI conversations

Use the public evaluator and labels to show strength; the host owns the input, state, and submission. The component does not read accounts or send requests. Do not ask AI for, log, or transmit real passwords. If the host cannot safely handle password input, use text guidance instead. Real conversation hosts have not been verified.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
