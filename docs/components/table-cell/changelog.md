# TableCell changelog

Reviewed against Chinese source SHA-256 `43f36969349742f777066a9ca40ec0d9f876d7fc52c59139c137e3b88a690632`. For version differences, check the installed package as well.

<a id="v1130-2026-10-22"></a>

### v1.13.0 (2026-10-22)

- Added an internal singleLine preset while preserving native td semantics. Fixed clamp and narrow-container overrides that broke row spacing or split attachments and labels. Ordinary text truncation and explicit multiline content remain available.

<a id="v1120-2026-10-21"></a>

### v1.12.0 (2026-10-21)

- Generated and explicit action groups share the layout budget. Restoring focus to an action trigger keeps it visible without changing mouse checkbox exit behavior.

- 2026-10-07: When horizontal scrolling is disabled, columns pending hiding fade with the container width; the full rule is defined by Table responsiveness.

- 2026-10-07: Standardized an 8px minimum at the table's outer edges and between adjacent column contents (4px internal space on each side); redistribute edge spacing after columns collapse.

- 2026-10-07: Persistent action columns allow button hover backgrounds to overflow their content boxes so the animation is not clipped by the text truncation container; overlay actions remain clipped to the row range.

- 2026-10-07: Increased responsive cell minimum padding from 2px to 4px on each side, giving adjacent column contents at least 8px of space.

- 2026-10-07: v1.11.0, alongside Table's automatic role layout and responsive hiding, persistent controls remain visible; corner radii follow the first and last visible cells, while overlays keep a fixed fade and keyboard entry point.

- 2026-10-07: v1.10.3, row and header Checkboxes position the transparent region from the actual right edge with a fixed `--size-5` (nominally 20px) soft transition to the right. This follows control size and responsive spacing instead of stretching with column width; explicit start and end overrides remain available.

- 2026-10-07: Fixed the fading remnant after an overlay action layer loses hover; remove it together with the content mask while retaining the entry fade and fixed transition range.

- 2026-10-07: v1.10.2, fixed content failing to fade when overlay action buttons crossed columns and fixed actions escaping the viewport when a narrow table scrolled horizontally. Mask coordinates now follow the visible row edge and retain the selection mask. The default covers the button's actual left edge with a fixed 20px Token transition to the left, keeping fades consistent across button group widths.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- 2026-09-20: v1.10.1, `lines={false}` on a normal cell also disables content-layer clipping, preserving the full hover background and border of a child Button. Default single-line and multiline truncation, role overlays, and Skeleton clipping are unchanged.

- 2026-09-01: v1.10.0, without an explicit fixed column width, cell min-content contributes to Table's automatic total minimum width; wrappable content retains its longest unbreakable segment.

- 2026-09-01: v1.9.1, adjusted the response curve so common narrow containers use 2px padding on each side and specified a 4px minimum visual gap between adjacent columns.
- 2026-08-14: v1.9.0, horizontal padding of normal, selection, actions, and overlay role cells now responds to Table container width from 2px to 12px; vertical padding remains 8px.
- 2026-08-06: v1.8.0, normal Cells use the semantic fast path by default. Single-line truncation now batches reads and writes once per table frame instead of using a per-Cell TruncationController / ResizeObserver; Tooltip, onTruncate, and automatic fallback to advanced Frame remain.
- 2026-08-03: v1.7.5, changed the 1px selection Checkbox increment to a fixed `0.0625rem` exception, removing the semantic misuse of `--border-2` in size calculations.
- 2026-08-03: v1.7.4, the built-in selection Checkbox defaults to a Token-calculated 17px size and adds `--snowui-table-selection-checkbox-size-override`; an explicit `parts.Checkbox.size` still takes precedence.
- 2026-08-03: v1.7.3, removed TableCell's own row hover background and kept only divider avoidance. On striped-row hover, cells are transparent and TableBody's single continuous moving layer provides the color.
- 2026-08-02: v1.7.2, selection/actions overlay blocks consume responsive selection state directly, removing each role cell's `MutationObserver`; long tables no longer retain hundreds of attribute observers when idle.
- 2026-07-08: v1.7.1, corrected the source default gap for the actions button column from `--gap-3` to `--gap-2` (8px), matching the docs and multi-Icon button layout rule.
- 2026-07-01: v1.7.0, disabled per-cell MutationObservers for static TableCell text. Overlay role blocks observe size and scroll position only while the row is hovered, focused, selected, or force-hovered, reducing mount cost during large pageSize changes.
- 2026-06-30: v1.6.0, moved DataTable's new-row opacity fade into normal TableCells. Selection/actions overlays do not participate in the internal fade, fixing hover Checkboxes that were sometimes almost invisible during loading.
- 2026-06-30: v1.5.0, added the `skeleton` row placeholder protocol: normal content columns reuse Skeleton lines, while role columns retain only cell geometry and do not create Checkbox/actions controls.
- 2026-06-30: v1.4.3, default divided rows keep square corners at rest; first and last Cells gain 12px radii only on hover. An adjacent-row selector hides the divider above the hovered row; for the first row TableHead hides its bottom border.
- 2026-06-25: v1.4.2, documented the current overlay selection implementation: Checkbox and Progressive Blur share a fixed container covering the first column. Checkbox remains topmost and clickable; TableRow provides a fallback selection hit area over the leftmost 32px.
- 2026-06-24: v1.4.0, overlay blur reuses the shared `progressive-blur.ts` capability and removes the old narrow-strip implementation inside the component.
- 2026-06-24: v1.3.9, reduced overlay width back to about 35px, packed the strip distribution into the first 65%, and lowered blur radius so the blur ends before the block does.
- 2026-06-24: v1.3.8, halved the default overlay width again to about 26px and compressed later strips so the right-side transition ends earlier.
- 2026-06-24: v1.3.7, returned to narrow segmented Progressive Blur with the existing blur effect; removed the extra extended blur surface and restored coverage by a wide first strip followed by narrower strips.
- 2026-06-24: v1.3.8, added a real-text sampling extension to data-row overlays, separating the control block width from the `backdrop-filter` sampling width.
- 2026-06-24: v1.3.9, disabled the role cell's own blur for data rows, leaving only proxy blur in adjacent real data cells to avoid two progressive layers forming blocks.
- 2026-06-24: v1.4.1, data-row proxy blur uses a fixed `4rem` sampling guard and the shared Progressive Blur's overlapping feathered mask to reduce blockiness at narrow widths.
- 2026-06-24: v1.3.6, restored multilayer progressive backdrop blur using six full-width fading mask layers, preserving blur without hard segmented edges.
- 2026-06-24: v1.3.5, decoupled overlay control width from blur-surface width; the blur surface extends farther toward the content to sample adjacent text.
- 2026-06-24: v1.3.4, restored the default `.1%` invisible composite-triggering surface for blur and adjusted the alpha mask curve to restore `backdrop-filter` sampling.
- 2026-06-24: v1.3.3, changed overlay blur from multiple strips to one full-width blur surface plus alpha mask, eliminating color-block edges visible under magnification.
- 2026-06-24: v1.3.2, halved the default overlay width and strip size, and reset strip tint to zero to avoid a pale block on the actions side.
- 2026-06-24: v1.3.1, row progressive blur for `roleLayout="overlay"` appears only on hover, using eight strips: a wide first strip followed by overlapping narrow strips. Selection fades strongly on the left and clears to the right; actions reverse that direction.
- 2026-06-23: v1.3.0, added overlay layout for role columns with `roleLayout="overlay"`; actions are now visible only on row hover.
- 2026-06-23: v1.2.0, added selection/actions roles. Selection embeds Checkbox; actions allow custom content with hover/selected visibility rules.
- 2026-06-20: v1.1.0, added internal content layout capabilities for row, gap, and nowrap.
- 2026-06-19: v1.0.0, added `lines=1` as the default.

[Component guide](../table-cell.md) · [Full reference](./reference.md)
