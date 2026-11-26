# TableToolbar changelog

Reviewed against Chinese source SHA-256 `0100cf0948fe05332c75bfe269c7f09746e0d8578de0e7a4d8c99a7d5fc3bf10`. For version differences, check the installed package as well.

<a id="v301-2026-10-23"></a>

### v3.0.1 (2026-10-23)

- Selection counts and bulk actions retain a 4 CSS px gap. Shared horizontal scrolling keeps complete controls reachable when they no longer fit. Direct as-role replacement, search shrinking, and business callbacks remain unchanged. During deletion, the original Button stays mounted and hidden while Spinner shows progress, avoiding a synchronous blur that reads destroyed properties.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- 2026-09-20: Added `sortOptions` so the built-in menu can sort by an undisplayed source field or a derived value.

- 2026-08-09: Adapted to Button bare defaulting to 100% width; built-in toolbar actions now explicitly use `emphasis="muted"`.

- 2026-07-13: Added internal Tooltips to the built-in copy, delete, sort, and filter icon buttons.

- 2026-07-08: Changed the default gap between built-in items and bulk actions to 8px, following the default gap for multiple Icon buttons.

- 2026-07-07: Standardized that gap at 12px.

- 2026-07-07: Clear, copy, delete, sort, and filter buttons in built-in mode now use the bare Button appearance.

- 2026-07-05: v3.0.0 became a composition component used only by DataTable and was removed from the package’s public entry point.

[Component guide](../table-toolbar.md) · [Full reference](./reference.md)
