# PasswordStrength API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `password` | `string` | "" | The caller-managed password to evaluate; it is not written to the DOM. |
| `evaluate` | `PasswordStrengthEvaluator` | evaluatePasswordStrength | A synchronous function supplied by the caller that returns a strength level from zero to four. |
| `labels` | `readonly [string, string, string, string, string]` | ['Enter a password', 'Weak', 'Fair', 'Good', 'Perfect'] | Five labels corresponding to strength levels zero through four. |
| `minimumLength` | `number` | 8 | Minimum number of characters, also used by the default evaluation. |
| `minimumLengthMessage` | `(length: number) => string` | Current locale length message | Custom message shown first when a non-empty password is too short. |
| `requireLowercase` | `boolean` | false | Require at least one ASCII lowercase letter. |
| `requireUppercase` | `boolean` | false | Require at least one ASCII uppercase letter. |
| `requireNumber` | `boolean` | false | Require at least one digit from 0 through 9. |
| `requireSymbol` | `boolean` | false | Require at least one non-letter, non-digit, non-whitespace character; examples include ! @ # $ %. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
