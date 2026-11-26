# SearchInput API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `InputProps["type"]` | "search" | Native input type; defaults to search. |
| `value` | `string \| number` | — | Current input value; supports bind:value. |
| `element` | `HTMLElement` | — | Reference to the root element for instance access or focus. It is not the input value. |
| `defaultValue` | `string \| number` | — | Initial input value. |
| `showSearchIcon` | `boolean` | true | Whether to render the built-in search icon. |
| `collapseBelow` | `number` | — | Width threshold in pixels. At or below it, an empty unfocused input collapses to only the search icon. Omit to disable collapsing. |
| `variant` | `"default" \| "borderless"` | "default" | Appearance variant. borderless removes its own border, background, radius, padding, and focus ring. It fills available room in Flex or Block hosts while preserving intrinsic width in shrink-to-fit hosts. |
| `as` | `InputProps["as"]` | "search" | Role passed to the inner Input. search places SearchInput in the fixed header when used inside Popover or Listbox. Can be overridden explicitly. |
| `class` | `string` | "" | Additional class on the SearchInput root while retaining its component class. |
| `children` | `Snippet` | — | Additional Input content before or after the input. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
