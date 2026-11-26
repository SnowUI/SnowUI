# TableToolbar API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | Accessible name of the toolbar role. Defaults to a LocaleProvider message; give distinct names to multiple toolbars. |
| `search` | `boolean` | true | Show the built-in SearchInput and write its value to the DataTable query. An explicit as="search" item can replace it. |
| `bulkActionsEnabled` | `boolean` | true | Show the selected count and bulk action area when rows are selected. Disabling it does not clear the selection. |
| `sort` | `boolean` | true | Show the built-in sort picker using sortOptions or sortable table headers. |
| `sortOptions` | `TableToolbarSortOption[]` | — | Sort menu fields and order, including fields not displayed as columns. An explicit list replaces automatic header options; an empty list leaves only Default sort. Omit to use sortable headers. |
| `filter` | `boolean` | true | Show the built-in filter picker. Actual filtering requires filterKey and filterOptions. |
| `searchPlaceholder` | `string` | — | Placeholder of the built-in search input. Defaults to a LocaleProvider message. |
| `searchAriaLabel` | `string` | — | Accessible name of the built-in search input. Defaults to a LocaleProvider message. |
| `sortLabel` | `string` | — | Accessible name and tooltip of the sort picker. Defaults to a LocaleProvider message. |
| `filterLabel` | `string` | — | Accessible name and tooltip of the filter picker. Defaults to a LocaleProvider message. |
| `filterKey` | `string` | — | Field name written to DataTable filters. Without it, choosing a filter does not change the data filtering condition. |
| `filterOptions` | `TableToolbarFilterOption[]` | [] | Filter choices with label and value. The value may be a string, number, or undefined. Selection matches its string representation, then writes back the original value. |
| `selectedCount` | `number` | — | Explicit selected count. If omitted, reads the number of selected DataTable row IDs. It changes only the display and callback argument, not the selected set. |
| `showClearAction` | `boolean` | true | Show the Clear selection button in the bulk action area. |
| `showCopyAction` | `boolean` | true | Show the built-in CopyButton in the bulk action area. onCopy performs the actual copy. |
| `showDeleteAction` | `boolean` | true | Show the Delete button in the bulk action area. onDelete performs the actual deletion. |
| `clearLabel` | `string` | — | Text of the Clear selection button. Defaults to a LocaleProvider message. |
| `copyLabel` | `string` | — | Accessible name and tooltip of the Copy action. Defaults to a LocaleProvider message. |
| `deleteLabel` | `string` | — | Accessible name and tooltip of the Delete action. Defaults to a LocaleProvider message. |
| `selectionLabel` | `(count: number) => string` | — | Returns display text from the selected count. Defaults to a LocaleProvider message. |
| `onClearSelection` | `(count: number) => void` | — | Receives the selected count when Clear is clicked. Overrides the default clearSelection behavior, so the caller must clear the selection. |
| `onCopy` | `(count: number) => void \| Promise<void>` | — | Receives the selected count and may return a Promise. Its callback performs the copy; pending work prevents repeated bulk actions. |
| `onDelete` | `(count: number) => void \| Promise<void>` | — | Receives the selected count and may return a Promise. Its callback performs the delete; pending work shows loading feedback and prevents repeated bulk actions. |
| `bulkActions` | `Snippet<[number]>` | — | Additional bulk actions receiving the selected count. Shown only with a selection when bulk actions are enabled; temporarily inert during a built-in action. |
| `children` | `Snippet` | — | Explicit toolbar content without arguments. as="search", "bulk", "sort", and "filter" replace their built-in regions; other content becomes additional actions. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Separator: typeof Separator; Spinner: typeof Spinner; SearchInput: typeof SearchInput; Select: typeof Select; Listbox: typeof Listbox; MenuItem: typeof MenuItem; }>` | — | Configure the toolbar-owned Button, Separator, Spinner, SearchInput, Select, Listbox, and MenuItem instances. Explicit child components are not taken over recursively. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
