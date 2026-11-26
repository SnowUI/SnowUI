# AccordionItem API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — (required) | Stable identity of this item, unique within its Accordion. Matches the parent value or defaultValue; it is not an independently bound expanded boolean. |
| `disabled` | `boolean` | false | Disable the item title and collapse interaction. A disabled parent Accordion also disables this item and cannot be overridden by setting disabled=false here. |
| `children` | `Snippet` | — | Declare direct Frame as="title" and Frame as="content" children. A direct as="trailing" child in the title can replace the default expansion icon. Must be used inside Accordion. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
