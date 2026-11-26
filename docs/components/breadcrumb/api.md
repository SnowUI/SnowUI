# Breadcrumb API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Accessible name for the root navigation. When omitted, follows LocaleProvider; an explicit value takes priority. |
| `gap` | `number` | — | Inherited Frame gap token index for preferred row and column spacing between path elements. Omit it to retain existing preferences. Effective spacing stays at least 4 CSS px, including zero and font/gap scaling. Larger spacing preferences are preserved. The root keeps path segments on one line by default. |
| `variant` | `BreadcrumbVariant` | "borderless" | Default Button variant for internal Button as="item". parts or an explicit child Button variant can override it. |
| `children` | `Snippet` | — | Explicit Button as="item" and Text as="separator" children, replacing generated items and separator. The last item still becomes the current page. |
| `items` | `BreadcrumbItem[]` | [] | Path data containing a label and optional href or disabled for each item. Generates Buttons and separator Text; the last item is a noninteractive current page. Ignored when children is provided. |
| `separator` | `string` | "/" | Text between generated path items in items mode. Declare as="separator" yourself when composing explicit children. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text }>` | — | Configure Button and separator Text generated in items mode. Does not affect explicit children; Breadcrumb still owns current-page and role semantics. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
