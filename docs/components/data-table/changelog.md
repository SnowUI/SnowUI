# DataTable changelog

Reviewed against Chinese source SHA-256 `4438b378bb1285cfc18af530156de7b014775d2c6be874559d850527257712a0`. For version differences, check the installed package as well.

<a id="v1150-2026-10-21"></a>

### v1.15.0 (2026-10-21)

- Configured action groups forward visible limits, group styles, and item styles. The action budget is allocated before responsive data columns.

- 2026-10-07: Increased minimum responsive cell padding on each side from 2px to 4px, giving adjacent columns at least 8px of content spacing.

- 2026-10-07: v1.14.0 added the horizontalScroll strategy and changed roleLayout to default to auto. Table now calculates all responsive layouts while retaining explicit column and overlay modes.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- 2026-08-14: v1.13.0 made combined TableHead / TableCell horizontal padding respond to the internal Table container width from 2px to 12px. Table cells remain the sole owners of this implementation.
- 2026-08-06: v1.12.0 reuses a stable empty selection state in the default read-only mode, skipping per-row Set lookups and select-all set scans. Enabling selection retains the full selection behavior.
- 2026-07-12: v1.11.0 added `selection` and `actions` (both default to false). Checkbox and action columns are hidden by default and can be enabled independently.
- 2026-07-08: v1.10.0 added the `onRowPreview` protocol for clicking empty space in a row to preview it. Without this callback, clicking empty space no longer toggles selection.

- 2026-07-07: Optimized the client data pipeline: search and filtering now share one pass; the original array is reused when no query, filter, sort, or incremental data applies; selection checks use a Set to reduce repeated linear searches in large tables.

- 2026-07-05: v3.0.0 made DataTable the sole owner of the checkbox selection column, button action column, selection state, and overlay layout. TableToolbar became specific to DataTable.

- 2026-07-01: v2.0.0 added built-in query and filters processing in client mode and provides TableToolbar with context for queries, filters, sorting, and sortable columns.
- 2026-07-01: v1.9.0 added two-way binding for `pageSize`. Changing rows per page automatically returns to page 1 and calls the new `onPageSizeChange` callback.
- 2026-06-30: v1.8.4 waits for Table to lock current natural column widths before reading the data source on the first incremental load. Wider incoming content can no longer trigger native column reflow that shifts initial rows sideways. Manual and automatic loading share this behavior.
- 2026-06-30: v1.8.3 applies the default 500ms confirmation delay on the first entry into the trigger area in auto mode and cancels it on exit. This prevents an inserted Spinner or new rows from extending scroll height and disturbing page motion during inertial scrolling.
- 2026-06-30: v1.8.2 moved the new-row opacity fade-in from TableRow to ordinary TableCell, excluding selection/actions overlays. This fixes a hovered Checkbox becoming too dim under two opacity layers during loading.
- 2026-06-30: v1.8.1 corrected the `loadMoreThreshold` direction: after moving the internal sentinel below the table, loading now requires scrolling 80px past the table end by default, instead of preloading through a positive rootMargin.
- 2026-06-30: v1.8.0 added built-in automatic loading with `loadMoreMode="auto"`, `loadMoreThreshold` (default 80px), and `loadMoreThrottleMs` (default 500ms). The component manages the end-of-table sentinel, nearest scrolling ancestor, request throttling, and cleanup, so pages no longer need to write an IntersectionObserver.
- 2026-06-30: v1.7.6 changed the page-level automatic-loading example to wait 500ms after downward entry into the trigger area. It loads if scrolling pauses or continues downward, and cancels if scrolling upward leaves the area.
- 2026-06-30: v1.7.5 adapted to Frame `while*` semantics for all visual channels and removed the temporary `scale: undefined` override. Experimental constant values remain unchanged.
- 2026-06-30: v1.7.4 explicitly removed scale from Frame’s general appear preset for new-row fade-in, leaving only the opacity transition.
- 2026-06-30: v1.7.3 skips `setTimeout` when the display interval is zero, so a zero-duration timer no longer splits rows into separate event-loop tasks. This clarifies the boundary between server arrival timing and component display timing.
- 2026-06-30: v1.7.2 fixed new rows receiving `whileAppear` configuration without entering Frame’s `Appear` state, which prevented the opacity fade-in. Per-item commit spacing returned to 100ms; each row still fades for 1000ms, with overlapping transitions allowed.
- 2026-06-30: v1.7.1 extended both the opacity fade-in and per-item consumption wait for internally streamed new rows to 1000ms to make the fade effect easier to verify.
- 2026-06-30: v1.7.0 added the actual built-in incremental loading pipeline: `loadMore / loadMoreSize / hasMore` and render-state `loadMore()`. It supports AsyncIterable streaming responses, merging rows one by one, hiding Spinner when the first row starts, automatic 250ms TableRow fade-in, and request cancellation.
- 2026-06-30: v1.6.0 added a trailing Spinner row for `loading` / `refreshing` states when rows already exist. Table controls its size through `loadingSpinnerSize`, which defaults to 16×16px.
- 2026-06-30: v1.5.1 removed `skeletonRows`. The number of skeleton rows on initial load now follows `pageSize`, falling back to 10 when pagination settings are unavailable.
- 2026-06-30: v1.5.0 added Skeleton rows for initial loading: when `loading && rows.length === 0`, the real header remains and TableBody generates skeleton rows from the columns registered by TableHead. It added `skeletonRows`; loading or refreshing existing rows does not replace their data.
- 2026-06-30: v1.4.3 keeps 12px corners on every striped data row. The divided hover background transitions only on entry and disappears immediately on exit, avoiding a visual afterimage while corners revert.
- 2026-06-30: v1.4.2 removed end corners from the header and static data rows in the default divided variant. Data rows gain 12px corners only on hover, and the divider above a hovered row is now hidden.
- 2026-06-22: v1.4.1 clarified that the first column is not sorted ascending by default when `defaultSort` is absent; `sort === undefined` always preserves the input rows / filteredRows order.
- 2026-06-22: v1.4.0 integrated TableHead `defaultSortActive` for an active default sort and a cancellable sort cycle. It reversed v1.3.1’s explicit `sortable` requirement, again enabling sorting automatically for matching source fields or a sorter.
- 2026-06-22: v1.3.1 required TableHead `sortable` / `defaultSort` to explicitly enable sorting; a matching data field alone no longer made the header interactive.
- 2026-06-22: v1.3.0 allowed TableHead `defaultSort` to register the default sort column and direction. The DataTable object prop of the same name remains as a compatibility fallback.
- 2026-06-22: v1.2.2 included the `defaultSort` direction in Table context. The default column cycles through default → reverse → default, allowing TableHead to distinguish their visuals.
- 2026-06-22: v1.2.1 documented region structure, local reuse, padding / gap, and scroll ownership for the composite management layout, and corrected the toolbar example name.
- 2026-06-20: v1.2.0 changed the default region gap to 12px and added striped and divided row styles.
- 2026-06-19: v1.1.0 added defaultSort and automatic sorting for matching fields, and restored free explicit composition of Toolbar / Table / Pagination.
- 2026-06-19: v1.0.0 added client-side sorting, pagination slicing, and the server-side boundary.

[Component guide](../data-table.md) · [Full reference](./reference.md)
