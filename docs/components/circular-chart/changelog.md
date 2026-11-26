# CircularChart changelog

Reviewed against Chinese source SHA-256 `b64ad0bc5340db74c8308e54f6c6ff3d2a270eba1d4884cd46fad6cca4bd8439`. For version differences, check the installed package as well.

<a id="v145-2026-10-23"></a>

### v1.4.5 (2026-10-23)

- Retain a 4 CSS px floor for the shared HoverPanel dot-to-name and name-to-value gaps in LTR and RTL. Preserve the default 4px / 8px gaps, larger tokens, chart geometry, and center annotations.

<a id="v144-2026-10-20"></a>

### v1.4.4 (2026-10-20)

- Localized the built-in root accessible name through the shared locale protocol. Fixed explicit aria-label values being overwritten by the default; business names and numeric formatting remain unchanged.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v142-2026-09-05"></a>

### v1.4.2 (2026-09-05)

- Sector appearance now computes one linear timeline per frame. HoverPanel pointer and cell-hit coordinates share one root measurement per render frame. Public API, sector paths, motion duration, visuals, and interaction semantics are unchanged.

<a id="v141-2026-09-04"></a>

### v1.4.1 (2026-09-04)

- Zero-gap sectors now paint color once through an alpha paint mask while retaining seam cover, reducing antialiasing gaps and eliminating dark edges caused by overlapping translucent fill and stroke.

<a id="v140-2026-09-03"></a>

### v1.4.0 (2026-09-03)

- Added `minWidth`, default `"40px"`. Setting it equal to chart width prevents responsive shrinking; numeric dimensions follow the same unit rules.

<a id="v131-2026-09-03"></a>

### v1.3.1 (2026-09-03)

- Default responsiveness supports the remaining width in side-by-side flex layouts, with a fixed 40px minimum visible width. No manual opt-in is needed; disabling it retains declared dimensions.

<a id="v130-2026-09-03"></a>

### v1.3.0 (2026-09-03)

- The chart and all center content scale down proportionally with available width by default and return to declared size when space recovers. `enableResponsive=false` retains declared size.
- HoverPanel keeps its size, while pointer / focus positioning follows the actual displayed chart size.

<a id="v123-2026-09-03"></a>

### v1.2.3 (2026-09-03)

- Persistent center labels can explicitly reuse default center typography through direct-child `segment-value` / `segment-name` roles. Callers still own their content; other custom center content is unaffected.
- Both role lines use default centered alignment and continue to support public class / style and label overrides.

<a id="v122-2026-09-03"></a>

### v1.2.2 (2026-09-03)

- Fixed role detection not resynchronizing after center nodes remount from Loading / Skeleton or center visibility changes. Default hover labels no longer overlay a restored persistent center label.
- Center-role detection follows actual node lifecycles and supports direct loading or loading from a parent Frame.

<a id="v121-2026-09-03"></a>

### v1.2.1 (2026-09-03)

- Completed descriptions for all 44 named Properties against existing source: purpose, default resolution, numeric units, callbacks, center composition, and data-fallback boundaries. Runtime behavior is unchanged.

<a id="v120-2026-09-03"></a>

### v1.2.0 (2026-09-03)

- Added `showBaseLayer=false` to enable same-color outlines at final size on demand. Real graphics and entrance motion retain their behavior.

<a id="v110-2026-06-04"></a>

### v1.1.0 (2026-06-04)

- Added shared Chart `colorMode`: `sequence`, `monochromeFade`, and `monochrome`.
- Added primary `color` plus separate `monochromeColor` / `mutedMonochromeColor` entries. With `color`, both monochromeFade and monochrome modes now default to that primary color.
- All three color modes support per-sector custom colors through `data[i].color` and `colors[i]`.

<a id="v102-2026-05-31"></a>

### v1.0.2 (2026-05-31)

- Gaps now use `padAngle + padRadius` during path construction, replacing the post-render gap mask and radial short-line mask.
- The fill layer now uses a complete padded path with a local `revealPath` mask, fixing misalignment between animated fill and placeholder sectors.
- Corner rounding now uses d3-shape throughout, fixing ineffective large radii, missing corners on short arcs, and clipping on hover.
- Added an official ECharts example, local source reference, and records of this round’s issues and solutions.
- For opaque zero-gap sectors, added a `0.5px` same-color seam cover and a stroke-only `blur(0.5px)` seam.

<a id="v101-2026-05-28"></a>

### v1.0.1 (2026-05-28)

- Completed feature documentation for data shapes, sector drawing, color, motion, accessible interaction, and Frame integration.
- Clarified that `cornerRadius` / `separatorWidth` are design values at a 160×160 baseline and scale by `size / 160`.
- Clarified color support for CSS variables, `linear-gradient(...)` strings, and gradient objects. Sectors without a defined color fall back to the default sequence.
- Documented the 4% same-color placeholder layer, transparent gaps, reverse-rewind timeline, and component methods.

<a id="v100-2026-05-22"></a>

### v1.0.0 (2026-05-22)

- Initial CircularChart implementation.
- Supports adjustable overall size, ring thickness, corner radius, separators, and outward thickening on hover.
- Supports center hover labels, up to 10 items, and SnowUI’s `primary + secondary-*` color sequence.
- Integrated a Frame root, Skeleton, Test examples, and standards registration.

[Component guide](../circular-chart.md) · [Full reference](./reference.md)
