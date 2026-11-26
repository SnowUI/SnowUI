# ExpandButton API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `expanded` | `boolean` | — | Current expanded state; supports bind:expanded and falls back to defaultExpanded when undefined. Clicking writes the new boolean. The caller shows or hides the content region. |
| `defaultExpanded` | `boolean` | false | Fallback while expanded is undefined. After the first click, the component-written expanded state takes over. |
| `ariaLabel` | `string` | — | Accessible Button name while collapsed; should describe the expand action that will occur. Defaults to Expand in English; LocaleProvider supplies the corresponding Chinese label. |
| `collapseAriaLabel` | `string` | — | Accessible Button name while expanded; should describe the collapse action that will occur. Defaults to Collapse in English; LocaleProvider supplies the corresponding Chinese label. |
| `icon` | `Snippet` | —（arrows-out-simple） | Custom icon while collapsed. Only changes graphics; the component still owns expanded state and aria-expanded. |
| `collapseIcon` | `Snippet` | —（arrows-in-simple） | Custom icon while expanded, replacing the existing content transition. |
| `children` | `Snippet` | — | Custom content after the icon. Without it, Button.iconOnly is enabled. The component does not create or control the expanded panel. |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Receives the new state after a click, before onclick. External assignment does not trigger it. |
| `onclick` | `(event: MouseEvent) => void` | — | Called after state is written and onExpandedChange runs. Cannot cancel the completed toggle; not called when disabled. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
