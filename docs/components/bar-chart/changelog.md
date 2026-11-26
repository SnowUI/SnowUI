# BarChart changelog

Reviewed against Chinese source SHA-256 `b11ab6da3b986674cc466c69962ed9b0bc52299f94f27ba9dd895aaf92bf462a`. For version differences, check the installed package as well.

<a id="v144-2026-10-23"></a>

### v1.4.4 (2026-10-23)

- Retain a 4 CSS px floor for the shared HoverPanel dot-to-name and name-to-value gaps in LTR and RTL. Preserve the default 4px / 8px gaps, larger tokens, chart geometry, and center annotations.

<a id="v143-2026-10-20"></a>

### v1.4.3 (2026-10-20)

- Localized the built-in root accessible name and data-cell group name through the shared locale protocol. Explicit aria-label values retain priority; business names and numeric formatting remain unchanged.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v141-2026-09-05"></a>

### v1.4.1 (2026-09-05)

- Category start offsets in the entrance timeline now use constant-time calculations. Raw HoverPanel pointer events no longer read layout synchronously; coordinate conversion is combined by render frame. Public API, bar geometry, duration, visuals, and interaction semantics are unchanged.

<a id="v140-2026-09-03"></a>

### v1.4.0 (2026-09-03)

- Added `showBaseLayer=false` to enable same-color outlines at their final size on demand. Real graphics and entrance motion retain their behavior.
- `adaptiveContrast` is enabled by default; explicit disabling and child-chart overrides remain available.

<a id="v130-2026-09-03"></a>

### v1.3.0 (2026-09-03)

- `adaptiveContrast` now uses shared adaptive black-and-white contrast. Toggle defaults, colored foregrounds, hit testing, and node-state semantics remain; the chart-private experimental implementation was removed.

<a id="v120-2026-09-02"></a>

### v1.2.0 (2026-09-02)

- Overlay now reuses `bars` to represent two independent comparison datasets. Automatic domain, color, number formatting, hit testing, and panel all consume the same data; the back layer can vary by item and the front layer can exceed it.
- Legacy fields remain compatible. An unnamed back layer falls back to the category name, the hard-coded `Background` label was removed, and missing back-layer values no longer duplicate front-layer data.

<a id="v114-2026-09-02"></a>

### v1.1.4 (2026-09-02)

- Added optional `data[].backgroundName` for business-specific naming of the overlay back layer. Without it, the previous name remains; geometry, color, and hover behavior are unchanged.

<a id="v113-2026-09-02"></a>

### v1.1.3 (2026-09-02)

- HoverPanel now defaults to `pointer` positioning and follows the mouse. Area hover still defaults to `cell`; explicit placement / hoverMode settings take precedence.

- 2026-09-02 — HoverPanel became enabled by default, retaining the light appearance.
- 2026-09-02 v1.1.2 — `stack` value labels now appear only once on the top segment and show the sum of all segments; color returns to default Black/100%. Sparse X labels ignore empty entries when thinning. HoverPanel keeps `2px` between the label and value-row regions and now uses `8px` between names and values.
- 2026-09-02 v1.1.1 — Top value labels no longer increase the safety area to `28px`; they remain `4px` above bar tops and may overflow the plot area’s top edge.
- 2026-09-01 v1.1.0 — BarChart now responds to the final displayed size of its root. Minimum bar width is `2px` and minimum bar gap is `4px`. Fixed short X-axis labels being incorrectly considered to fit cells under `20px`; X-axis thinning no longer removes bars, and persistent top values gain separate automatic thinning.
- 2026-09-01 v1.0.4 — Automatic domain upper bound now uses the actual maximum data value, so the highest nice tick no longer exceeds it. Charts without a Y axis no longer gain extra top whitespace from rounding the domain upward.
- 2026-08-31 v1.0.3 — The top is now a content-aware safety area, and automatic nice-domain selection is tighter. The highest bar, top Y-axis tick, and value label avoid the edge while excess whitespace above the scale is reduced.
- 2026-08-31 v1.0.2 — Removed extra top and bottom whitespace from the Cartesian plot area; only the `24px` needed by X-axis labels remains at the bottom.
- 2026-08-31 v1.0.1 — Y-axis width now adapts to the actual rendered width of the widest visible label, with a fixed `12px` gap to the plot area.
- 2026-06-05 v1.0.0 — Added BarChart with vertical / horizontal orientation, single bars, multiple segments, stacked and grouped bars, axes, and Chart entrance motion. Bars enter by rising from 80% initial height with fixed category intervals, Frame morph baseline duration, and independent easing per bar; value labels can interpolate with bar height.

[Component guide](../bar-chart.md) · [Full reference](./reference.md)
