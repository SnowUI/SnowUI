# Slider changelog

Reviewed against Chinese source SHA-256 `17e3f27329ad218f39cf1247b3630095eea02515407284411bef68e8145161b9`. For version differences, check the installed package as well.

<a id="v144-2026-10-23"></a>

### v1.4.4 (2026-10-23)

- Give horizontal solid/soft titles and values separate single-line space with a 4 CSS px floor and full-title access. Per-glyph color boundaries stay aligned with the full Slider canvas and RTL. All generated Text instances use parts.Text; generated values render reactively, while explicit labels and ordinary/vertical track annotations keep their existing contracts.

<a id="v143-2026-10-20"></a>

### v1.4.3 (2026-10-20)

- The default bar title in solid and soft variants follows LocaleProvider. Explicit titles, including an empty string, ariaLabel values, numeric values, and explicit labels remain unchanged. The title does not replace an accessible name.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v142-2026-09-12"></a>

### v1.4.2 (2026-09-12)

- For horizontal `solid` / `soft` ranges, default labels now combine into one percentage range to avoid overlap at the right edge. Callers still control explicit label content.
- Both range-end markers move inward toward the fill. Narrow ranges cap each offset at half the range, and track-edge spacing remains the same as for single values, even at `0%–0%` and `100%–100%`. Single-value positioning is unchanged.

<a id="v141-2026-08-06"></a>

### v1.4.1 (2026-08-06)

- `solid` / `soft` step dots no longer render at the 0% and 100% endpoints. Interior dots always use `Black/10%`, unchanged on hover or when covered by fill.

<a id="v140-2026-08-06"></a>

### v1.4.0 (2026-08-06)

- Renamed `filled` to the more precise `solid` and added `soft`, which shares the same bar geometry.
- `soft` uses `Black/10%` fill by default. Title, value label, and indicator use a `Black/100%` base to adapt to light and dark themes.
- Renamed the bar-radius override from `--snowui-slider-filled-radius-override` to `--snowui-slider-bar-radius-override`.

<a id="v130-2026-08-06"></a>

### v1.3.0 (2026-08-06)

- The `filled` title and value label now split their colors at the live fill boundary, pixel by pixel: white over black fill and black outside it. The text boundary shares the live percentage at the fill’s right edge and moves continuously while dragging.

<a id="v124-2026-08-06"></a>

### v1.2.4 (2026-08-06)

- Raised the resting `filled` value-label opacity from 20% to 40%, and hover, focus, and drag opacity from 40% to 80%, improving white-label legibility at 100% fill.

<a id="v123-2026-08-06"></a>

### v1.2.3 (2026-08-06)

- Reduced the `filled` indicator height from 12px to 8px, retaining 2px width, fully rounded corners, scaling on both axes from its center, and the generic Frame preset duration and easing.

<a id="v122-2026-08-06"></a>

### v1.2.2 (2026-08-06)

- Changed the `filled` indicator to a fully rounded 2px × 12px capsule, fixed to `Static White/100%` inside black fill.
- The indicator appears by scaling from 50% width and height around its center to full size; it narrows, shortens, and fades on exit.

<a id="v121-2026-08-06"></a>

### v1.2.1 (2026-08-06)

- Added a configurable built-in `title` to `filled` (default `"Text"`) and unified the right-side percentage with the existing `showLabel` / `parts.Text` / explicit-label protocol.
- The default `filled` `thickness` is 32px and can be customized through the same prop or CSS override as other variants.
- The fill’s right edge retains an 8px radius. The indicator sits 4px inside that edge, or 4px inside the Slider’s left border at zero.

<a id="v120-2026-08-06"></a>

### v1.2.0 (2026-08-06)

- Added the horizontal `filled` variant with a 32px height, 8px radius, full-height fill, left label, and live right-side percentage.
- The indicator appears at the fill edge on hover, focus, and drag. Entrance and exit reuse the generic Frame preset’s opacity, scale, duration, and easing, with reduced-motion support.
- Added 2px circular step dots for `filled + showSteps`.

<a id="v111-2026-08-06"></a>

### v1.1.1 (2026-08-06)

- Updated the default Thumb background to `Static White/80%` (`--static-white-80`) and added a `0.5px` white Inside Stroke (inset shadow) plus `blur(2px)` backdrop blur.
- The existing drop shadow remains unchanged.

<a id="v110-2026-07-04"></a>

### v1.1.0 (2026-07-04)

- Label became a built-in mode, disabled by default and enabled through `showLabel`.
- A single-value Slider creates one Text automatically; Range creates two. Built-in instances are configured through `parts.Text`.
- Explicit `<Text as="label">` remains available for custom content; the default font size stays 12px.

<a id="v103-2026-06-02"></a>

### v1.0.3 (2026-06-02)

- Consolidated the steps mask onto a fixed-size track, fixing cut lines moving with the Thumb and fill being clipped incorrectly.

<a id="v102-2026-06-02"></a>

### v1.0.2 (2026-06-02)

- An empty `as="label"` receives the corresponding Thumb’s live value automatically. Default label typography changed to 12px / 16px.

<a id="v101-2026-06-02"></a>

### v1.0.1 (2026-06-02)

- Updated the Thumb to `20px × 14px` with a fully rounded white background and `0 1px 2px rgba(0, 0, 0, 0.4)` shadow, matching updated Figma node `12550:576`.

<a id="v100-2026-06-01"></a>

### v1.0.0 (2026-06-01)

- Added single-value and Range modes, horizontal and vertical orientations, steps, free-form labels, semantic colors, form integration, and keyboard support.

[Component guide](../slider.md) · [Full reference](./reference.md)
