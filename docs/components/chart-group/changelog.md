# ChartGroup changelog

Reviewed against Chinese source SHA-256 `93b925303f6c8272381e9cab966006cc64c0d94a13c3b5b5ce9b8af944feeb79`. For version differences, check the installed package as well.

<a id="v043-2026-10-23"></a>

### v0.4.3 (2026-10-23)

- Retain a 4 CSS px floor for the shared HoverPanel dot-to-name and name-to-value gaps in LTR and RTL. Preserve the default 4px / 8px gaps, larger tokens, chart geometry, and center annotations.

<a id="v042-2026-10-20"></a>

### v0.4.2 (2026-10-20)

- Localized the built-in root accessible name and data-cell group name and the fallback cell-name template through the shared locale protocol. Explicit aria-label values retain priority; business names and numeric formatting remain unchanged.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v041-2026-09-05"></a>

### v0.4.1 (2026-09-05)

- Shared pointer tracking and cell resolution now commit the latest coordinates once per frame; raw events no longer read layout synchronously. The inverted-surface list is now a reactive cache. Public API, hit area, panel position, visuals, and interaction semantics are unchanged.

<a id="v040-2026-09-03"></a>

### v0.4.0 (2026-09-03)

- `adaptiveContrast` is enabled by default; explicit disabling and child-chart overrides remain available.

<a id="v030-2026-09-03"></a>

### v0.3.0 (2026-09-03)

- `adaptiveContrast` now uses the shared adaptive black-and-white contrast capability. Toggle defaults, colored foregrounds, hit testing, and node-state semantics remain, while the chart-private experimental implementation was removed.

<a id="v023-2026-09-02"></a>

### v0.2.3 (2026-09-02)

- HoverPanel now defaults to `pointer` positioning and follows the mouse. Area hover still defaults to `cell`; explicit placement / hoverMode settings take precedence.

<a id="v022-2026-09-02"></a>

### v0.2.2 (2026-09-02)

- Fixed a busy loop caused by child charts repeatedly registering effects while sharing the top safety area. Registration and cleanup no longer subscribe to the internal version; each child chart still updates its dynamic safety area through a reactive resolver.
- Documented behavior, precedence, and limits for all named Properties, including showHoverLabel and alwaysShowHoverLabel; updated the realistic combined Site example.

<a id="v021-2026-09-02"></a>

### v0.2.1 (2026-09-02)

- The shared top safety area no longer grows when hover values rise. Child-chart value labels stay `4px` above the graphic and may overflow the shared plot area’s top edge when needed.

<a id="v012-2026-08-31"></a>

### v0.1.2 (2026-08-31)

- The top area is now a content-aware safety region. It takes the maximum requirement across all BarChart / LineChart children; the shared hit layer and overlay layers retain the same plot-area top edge.

<a id="v011-2026-08-31"></a>

### v0.1.1 (2026-08-31)

- Removed extra top and bottom padding from the default plot area. Default bounds are now `top: 0` and `bottom: 24`.

<a id="v010-2026-06-09"></a>

### v0.1.0 (2026-06-09)

- Added `ChartGroup` with shared category-cell hover, overlaid canvases, and context propagation.

[Component guide](../chart-group.md) · [Full reference](./reference.md)
