# Accordion API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `AccordionType` | "single" | single expands one item at a time; multiple allows several expanded items. Determines the value shape for value, defaultValue, and onValueChange. |
| `value` | `AccordionValue` | — | Current expanded value; supports bind:value and takes priority over internal state. single uses a string and multiple an array. An empty string in single means every item is closed. |
| `defaultValue` | `AccordionValue` | — | Initial uncontrolled expanded value, read only when initializing internal state. value takes priority. items mode uses stringified indices; explicit AccordionItem children use their own value. |
| `collapsible` | `boolean` | true | In single mode, allow clicking the expanded item to close it. |
| `variant` | `AccordionVariant` | "filled" | filled uses separate panels with backgrounds; divided uses separators between items. Both share expansion state and interaction. |
| `size` | `AccordionSize` | — | Density. Explicit size takes priority, followed by parent size context, then md. Controls titles, bodies, spacing, and child sizes together. |
| `disabled` | `boolean` | false | Disable the entire Accordion. |
| `continuousHover` | `boolean` | false | Deprecated compatibility Prop. No value enables the former hover background. |
| `indicatorVariant` | `"cross" \| "minus"` | "cross" | cross rotates the same plus sign 45° into an X; minus switches plus and minus with a half-turn. A custom trailing child replaces the default indicator. |
| `role` | `string` | "presentation" | ARIA role for the root container. By default it is only a presentation group; AccordionItem still owns trigger and content-region semantics. |
| `items` | `AccordionEntry[]` | [] | Data for the generated mode. Internal values are stringified array indices. |
| `children` | `Snippet` | — | Explicitly composed content; replaces generated items when present. |
| `parts` | `ComponentPartsOf<{ AccordionItem: typeof AccordionItem; Frame: typeof Frame; Text: typeof Text; }>` | — | Configure generated AccordionItem, title/body Frames and title Text in items mode. Explicit children do not read this generated-child configuration. |
| `onValueChange` | `(value: AccordionValue) => void` | — | Called after the user toggles expansion. single returns the current item string or an empty string when all are closed; multiple returns an array of expanded items. Can be paired with bind:value for page state. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
