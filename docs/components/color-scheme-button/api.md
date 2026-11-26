# ColorSchemeButton API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `scheme` | `ColorScheme` | — | Current color scheme; supports bind:scheme. When systemPreference=false, takes priority over defaultScheme on mount. A click updates it, and it also follows root-attribute changes while document synchronization is active. |
| `defaultScheme` | `ColorScheme` | — | Initial uncontrolled scheme when systemPreference=false; scheme takes priority. If neither is set, reads the page root. With applyToDocument=false, falls back to light. |
| `applyToDocument` | `boolean` | true | Synchronize current state to document.documentElement with theme="dark", removing theme for light. false disables reading, writing, and observing that page attribute; the caller owns the theme target. Cookie persistence is controlled separately by systemPreference. |
| `systemPreference` | `boolean` | true | Follow the operating system without a valid manual preference; save manual choices for 365 days and resume system following on expiry. Cookie/system values take priority over initial values. false disables system reading and preference cookie reads/writes. |
| `ariaLabel` | `string` | — | Override the accessible Button name. By default, describes the state that clicking will switch to and follows LocaleProvider. |
| `lightIcon` | `Snippet` | — (built-in graphic) | Replace the Sun icon shown while the current scheme is light. Changes graphics only, not switching logic. |
| `darkIcon` | `Snippet` | — (built-in graphic) | Replace the Moon icon shown while the current scheme is dark. Changes graphics only, not switching logic. |
| `children` | `Snippet` | — | Custom content after the state icon. Without it, the host Button uses iconOnly layout automatically. |
| `disabled` | `boolean` | false | Disable the Button action without preventing synchronization of an external binding or page attribute. |
| `onSchemeChange` | `(scheme: ColorScheme) => void` | — | Receive the new value after a user click. Initialization, external assignments, and observed page-attribute changes do not call it. |
| `onclick` | `(event: MouseEvent) => void` | — | Called before the state switches on a valid click. In the current implementation, preventDefault() does not cancel the subsequent switch. Not called when disabled. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
