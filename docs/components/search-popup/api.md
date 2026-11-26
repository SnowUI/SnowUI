# SearchPopup API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `backdrop` | `BackdropVariant \| false` | false | false keeps the static or anchored mode. opaque, blur, or transparent enables the shared Dialog modal backdrop. |
| `closeOnOutside` | `boolean` | true | Close the modal when its backdrop is clicked, independently of the backdrop appearance. |
| `value` | `string \| number` | "" | Search input value; supports bind:value. The consuming application performs filtering. |
| `search` | `boolean` | true | Whether to generate a built-in SearchInput. Disable when providing an explicit input. |
| `title` | `string` | — | Optional panel heading above results. In children mode, explicit content owns the heading. |
| `showGroupTitles` | `boolean` | true | Whether to generate source group headings for items without changing item order. |
| `items` | `SearchPopupItem[]` | [] | Results in input order. value, label, and href are required; group and disabled are optional. Consecutive entries in the same group show its heading once. |
| `children` | `Snippet` | — | Replace all built-in results and headings; items, title, and showGroupTitles are no longer used. |
| `parts` | `ComponentPartsOf<{ SearchInput: typeof SearchInput; MenuItem: typeof MenuItem; Text: typeof Text }>` | — | Configure generated input, results, and headings. Their data controls value, children, identity, and disabled state. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
