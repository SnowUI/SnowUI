# Progress changelog

Reviewed against Chinese source SHA-256 `c63520a03a5754d600cfe952bac659017f0daa0c6cf9c12e12ecfbb4fc7ca256`. For version differences, check the installed package as well.

<a id="v112-2026-07-12"></a>

### v1.1.2 (2026-07-12)

- 2026-10-23: Side-by-side status and percentage examples use Frame single-line composition and Text truncation with full-text access. Progress updates, circles and indeterminate states remain unchanged; documentation and examples only.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- For circle and indeterminate states, the default size and thickness now match Spinner: 16px and 15% of size (2.4px). Determinate line thickness remains 4px.

<a id="v111-2026-07-12"></a>

### v1.1.1 (2026-07-12)

- Thickness was briefly unified at 4px; v1.1.2 then reverted circle and indeterminate states to Spinner geometry.

<a id="v110-2026-07-04"></a>

### v1.1.0 (2026-07-04)

- Circle gained a built-in `showLabel` mode, disabled by default. It generates Text internally with default typography of 12px / 16px.
- Added `parts.Text`; explicit children replace the built-in label.
- Line retains explicit label composition so the layout semantics of a title, status, and percentage remain open.
- The default circle indeterminate size and thickness match Spinner circle: 16px and a 15% ring width.

<a id="v101-2026-06-02"></a>

### v1.0.1 (2026-06-02)

- An empty direct child `as="label"` displays the live value automatically.
- Default label typography changed to 12px / 16px.

<a id="v100-2026-06-01"></a>

### v1.0.0 (2026-06-01)

- Added linear and circular Progress, flexible sizes, shared thickness, flexible labels, semantic colors, and indeterminate motion.
- The linear label area fills available width by default. For content at opposite ends, an external label Frame must explicitly use `row class="justify-between"`.

[Component guide](../progress.md) · [Full reference](./reference.md)
