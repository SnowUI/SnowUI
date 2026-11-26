# SearchBox changelog

Reviewed against Chinese source SHA-256 `951648a3b8222e386b558ccd468255477e057dd2dc90cede74a3b2052426a684`. For version differences, check the installed package as well.

<a id="v120-2026-10-23"></a>

### v1.2.0 (2026-10-23)

- The search trigger reuses shared single-line layout and gap resolution. Zero and font/gap scaling retain at least 4 CSS px; larger preferred gaps and the original icon-only collapse state are preserved.
- Keep the documented internal three-slot contract when responsive direction changes or external auto layout is disabled. Clear, keyboard, disabled/readonly, external shortcuts and popup behavior remain unchanged.

<a id="v112-2026-10-20"></a>

### v1.1.2 (2026-10-20)

- The default placeholder and clear action follow LocaleProvider. Explicit placeholder values, including an empty string, and aria-label take priority; the query remains unchanged.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v111-2026-08-14"></a>

### v1.1.1 (2026-08-14)

- The SearchBox root now defaults to the same `backdrop-filter: blur(1.25rem)` as Tooltip and exposes `--snowui-search-box-background-blur-override`.

<a id="v110-2026-08-10"></a>

### v1.1.0 (2026-08-10)

- Added `collapseBelow`, which reduces the control to its leading search icon when its own width is insufficient. In icon mode, minimum width equals actual left and right padding plus the intrinsic width of the leading Icon.
- Size observation reuses the global Components `resizeManager`; the page only allocates width and chooses the threshold.

<a id="v103-2026-05-09"></a>

### v1.0.3 (2026-05-09)

<a id="修复"></a>

#### Fixes

- Suppressed the global `focus-visible` outline on the SearchBox root so a gray outer focus ring does not reappear after clicking to open and pressing Escape.

<a id="v100-2026-05-08"></a>

### v1.0.0 (2026-05-08)

<a id="新功能"></a>

#### New features

- Added the search-box trigger with gray-background and bordered styles.

[Component guide](../search-box.md) · [Full reference](./reference.md)
