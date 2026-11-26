# StyleButton API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `SnowUIStyleMode` | — | Current visual style; supports bind:mode. Takes priority over defaultMode on mount. A click updates it, and it follows root-attribute changes while document synchronization is active. |
| `defaultMode` | `SnowUIStyleMode` | — | Initial uncontrolled mode on mount; mode takes priority. If neither is set, reads the page root. With applyToDocument=false, falls back to snowui. |
| `applyToDocument` | `boolean` | true | Synchronize current state to document.documentElement and body with mode="ios", removing mode for SnowUI. false disables reading, writing, and observing the page attribute; the caller owns the style target. Does not write storage. |
| `ariaLabel` | `string` | — | Override the accessible Button name. By default, describes the state that clicking will switch to and follows LocaleProvider. |
| `snowuiLogo` | `Snippet` | — (built-in graphic) | Replace the SnowUI Logo shown while the current mode is snowui. Changes graphics only, not switching logic. |
| `appleLogo` | `Snippet` | — (built-in graphic) | Replace the Apple Logo shown while the current mode is apple. Changes graphics only, not switching logic. |
| `children` | `Snippet` | — | Custom content after the state icon. Without it, the host Button uses iconOnly layout automatically. |
| `disabled` | `boolean` | false | Disable the Button action without preventing synchronization of an external binding or page attribute. |
| `onModeChange` | `(mode: SnowUIStyleMode) => void` | — | Receive the new value after a user click. Initialization, external assignments, and observed page-attribute changes do not call it. |
| `onclick` | `(event: MouseEvent) => void` | — | Called before the state switches on a valid click. In the current implementation, preventDefault() does not cancel the subsequent switch. Not called when disabled. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
