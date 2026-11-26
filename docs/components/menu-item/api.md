# MenuItem API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `parts` | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure public Props such as size, class, and style on the built-in Delete button. Its event, accessible name, and role remain controlled by MenuItem; external children are unaffected. |
| `value` | `string` | — | Option value. Required and unique within a Listbox when using as="item". When standalone, it identifies the selection intent in events. |
| `singleLine` | `boolean` | true | Use the shared Frame single-line preset for ordinary labels, preserving attachment sizes and at least 4 CSS px spacing. Defaults to true. Explicitly disable for complex multiline children; use Text lines=1 for label truncation and full-text access. |
| `selected` | `boolean` | false | Whether this standalone item is selected. A Listbox host overrides it for as="item". |
| `active` | `boolean` | false | Whether this standalone item is highlighted. A Listbox host overrides it for as="item". |
| `disabled` | `boolean` | false | Disable activation and render at 20% opacity. |
| `showCheck` | `boolean` | — | Show the trailing check slot. When omitted, it defaults on only for a selected standalone item, off in Listbox, and on in Select. |
| `closeOnSelect` | `boolean` | — | Whether activation requests the parent popup to close. If omitted, the parent popup decides its default policy. |
| `children` | `Snippet` | — | Item content without arguments. Direct as="leading" and as="trailing" children participate in the root three-slot layout. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
