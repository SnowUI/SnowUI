# Dialog API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Unique identifier in template mode. |
| `template` | `boolean` | false | Register a template without displaying it immediately. |
| `as` | `"dialog" \| undefined` | — | Marker for embedded mode. |
| `open` | `boolean` | false | Visibility in panel mode; supports bind:open. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when panel-mode visibility changes. |
| `backdrop` | `DialogBackdrop` | "opaque" | Backdrop variant. Shares backdrop visuals with ImageViewer; Dialog still manages closing and motion. |
| `size` | `DialogSize` | "md" | Panel size. |
| `closeOnOutside` | `boolean` | true | Close when the backdrop outside the panel is clicked. false prevents this; empty space inside the panel never closes it. Consider false for unsaved forms or choices that require explicit confirmation. |
| `closeOnEscape` | `boolean` | true | Whether Escape closes the dialog. |
| `pinOffset` | `number` | — | Shared offset in pixels for built-in and external Pin. When omitted, a token scaled with the root font supplies 16px for every size. |
| `pinOffsetX` | `number` | — | Override the horizontal offset for built-in and external Pin. Takes precedence over pinOffset. |
| `pinOffsetY` | `number` | — | Override the vertical offset for built-in and external Pin. Takes precedence over pinOffset. |
| `role` | `"dialog" \| string` | "dialog" | Accessible role of the panel. |
| `title` | `string` | — | Generate a built-in text title. Ignored when an external child with as="title" exists. |
| `separator` | `boolean` | — | Control the divider under the title. None is generated without a title. Defaults to false for sm and true for md/lg. |
| `showCloseButton` | `boolean` | true | Show the built-in close button in the upper right; does not hide an external close-role child. |
| `closeLabel` | `string` | LocaleProvider close message | Accessible name of the built-in close button, defaulting to the current LocaleProvider close message. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text; Separator: typeof Separator }>` | — | Configure only the actual built-in close Button, title Text, and Separator. Does not affect explicit children or footer components; Dialog owns title id, children, and ARIA wiring. |
| `children` | `Snippet` | — | Dialog content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
