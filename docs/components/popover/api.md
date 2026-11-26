# Popover API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Unique identifier in template mode. |
| `template` | `boolean` | false | Register a template without rendering it immediately; activate it with showPopover(id). |
| `size` | `PopoverSize` | "sm" | Size variant. |
| `trigger` | `PopoverTrigger` | "click" | Opening behavior in template mode. |
| `placement` | `PopoverPlacement` | "bottom" | Preferred placement; flips automatically when viewport space is insufficient. |
| `offset` | `number` | 8 | Distance in pixels between the floating panel and its trigger. |
| `closeOn` | `PopoverCloseMode` | "outside" | Closing policy: outside closes when blank space is clicked; manual closes only through a button inside Popover. |
| `closeOnEscape` | `boolean` | true | Whether Escape closes the Popover. Enabled by default for both closeOn modes. |
| `closeOnSelect` | `boolean` | — | Whether selecting an internal MenuItem closes the panel. An individual MenuItem closeOnSelect overrides it. Defaults to true for sm and false for md/lg. |
| `continuousHover` | `boolean` | true | Use a continuous container-level hover background across direct MenuItem children. |
| `open` | `boolean` | true | Manually control visibility in static mode; supports bind:open. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open state changes. |
| `as` | `"popover" \| undefined` | — | Set as="popover" for embedded mode, which discovers the parent host as the anchor and trigger source. |
| `children` | `Snippet` | — | Panel content. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
