# Pagination API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | 1 | Current page, starting at 1. |
| `total` | `number` | 1 | Total number of pages, not records. |
| `disabled` | `boolean` | false | Disable the entire Pagination control. |
| `disabledPages` | `number[]` | [] | Disable specified page numbers. Previous and next skip consecutive disabled pages to reach the nearest available page in that direction. |
| `ariaLabel` | `string` | — | Accessible name for the root navigation. When omitted, follows LocaleProvider; an explicit value takes priority. |
| `variant` | `PaginationVariant` | "outline" | Button variant for ordinary, previous, and next pages; the current page uses the corresponding emphasized pairing. |
| `responsive` | `PaginationResponsive` | "auto" | auto adapts between full page numbers, an ellipsis, and minimal previous/next controls as width shrinks. none retains the static page window and wrapping behavior. |
| `widthMode` | `PaginationWidthMode` | "fill" | auto considers remaining space when all pages fit; hug follows content width; fill distributes available width equally, including layouts with an ellipsis. |
| `gap` | `string \| number` | — | Preferred spacing between page numbers and previous/next controls. Numeric values are pixels, with a 4 CSS px effective floor and larger values preserved. Defaults to gap-1. |
| `pageSize` | `number` | 20 | Current items per page. Selection updates the bound value. The selector appears only when pageSizeOptions is nonempty. |
| `pageSizeOptions` | `number[]` | [] | Available items-per-page choices. Nonpositive numbers are ignored and duplicates removed. |
| `pageSizeGap` | `string \| number` | 16 | Separate preferred spacing between pageSize and the page-button group. Numeric values are pixels, with a 4 CSS px effective floor and larger values preserved. |
| `pageSizeAriaLabel` | `string` | — | Accessible name of the items-per-page selector. Defaults to the current LocaleProvider message. |
| `onPageChange` | `(page: number) => void` | — | Called when a clickable page selection changes. |
| `onPageSizeChange` | `(pageSize: number) => void` | — | Called when items per page changes. |
| `children` | `Snippet` | — | Role-specific visual templates for generated controls. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | Configure generated page Buttons, the items-per-page Listbox, and its options. Explicit children role templates configure their own props rather than reading parent parts. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
