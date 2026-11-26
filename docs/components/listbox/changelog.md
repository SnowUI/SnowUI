# Listbox changelog

Reviewed against Chinese source SHA-256 `d6b0d05cff7b9cb35ac346caf6d80d8d43ffab2d01c93c72803cece6eda26fed`. For version differences, check the installed package as well.

<a id="v140-2026-10-23"></a>

### v1.4.0 (2026-10-23)

- Default string labels reuse Text single-line typography and full-text access, with typed parts.Text. Explicit option content remains caller-owned.
- Constrain the inner panel within its existing outer viewport bounds so long labels cannot push check/delete attachments outside the visible area. Preserve short-content Hug width, full-text search, selection, registration and focus.

<a id="v137-2026-10-20"></a>

### v1.3.7 (2026-10-20)

- Connected the search header to shared Escape/Tab dismissal, including when no options match, while preserving native text editing and caller cancellation.
- Localized the generated search placeholder through the shared locale protocol. Explicit parts.Input configuration and explicit search children retain priority; query text, options, and selection behavior remain unchanged.

<a id="v136-2026-10-14"></a>

### v1.3.6 (2026-10-14)

- Explicit MenuItem children and generated default MenuItems are now resolved separately; explicit children do not read the parent’s parts.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v1352026-09-17"></a>

### v1.3.5（2026-09-17）

- The final horizontal position of the Listbox Portal now uses shared floating-layer clamping within an 8px viewport safety margin and caps panel width, preventing the options panel from extending beyond the viewport near either side.

<a id="v1342026-09-12"></a>

### v1.3.4（2026-09-12）

- While open, positioning and matched width follow trigger-state motion, then synchronize to the final position when animation ends or is canceled; tracking stops after close. This prevents the panel from retaining a shrunken width after Select click scaling recovers.

<a id="v1332026-09-12"></a>

### v1.3.3（2026-09-12）

- Removed horizontal rounding as requested. A matched-width Listbox is now 2px wider in total, covering 1px on each side. Background, blur, and inner border remain; the fixed pixel value is recorded as a standards exception.

<a id="v132-2026-09-12"></a>

### v1.3.2 (2026-09-12)

- On each open, records the alignment position of the selected item. Search, no matches, clearing, and custom-item changes no longer reposition from zero-size rectangles of hidden options.
- Initial alignment and scrolling to the active item only read currently visible options, retaining full item height and viewport constraints.

<a id="v131-2026-09-03"></a>

### v1.3.1 (2026-09-03)

- Quick Action and overlay scrollbar styles now share a registered low-priority CSS layer by default, so later-loaded shared styles no longer override component padding or track positioning.
- Track positioning compensates for actual panel padding. After root font-size scaling or a public padding override, the scrollbar’s right edge remains 4px from the panel’s right edge.

<a id="v130-2026-09-01"></a>

### v1.3.0 (2026-09-01)

<a id="调整"></a>

#### Adjustments

- Without an explicit `maxHeight`, the panel now displays up to 10 complete Items based on their actual visible height. When viewport space is insufficient, it reduces the count to whole Items while retaining room for at least two, avoiding a partly visible last Item that triggers autoscroll on hover or keyboard highlight.
- Explicit `maxHeight` and caller-supplied inline `max-height` overrides remain supported.

<a id="v122-2026-07-05"></a>

### v1.2.2 (2026-07-05)

<a id="修复"></a>

#### Fixes

- `matchTriggerWidth` now means “at least as wide as the trigger.” If the trigger is too narrow, Listbox expands to fit the longest option text, check slot, gap, and padding, preventing overlaps or a missing right gap.

<a id="v121-2026-07-05"></a>

### v1.2.1 (2026-07-05)

<a id="修复-1"></a>

#### Fixes

- The Portal floating layer now isolates outer Field Context, preventing the search Input from being mistaken for an embedded host when Select is inside Field and losing its own background, border, padding, and corner radius.

<a id="v120-2026-04-24"></a>

### v1.2.0 (2026-04-24)

<a id="调整-1"></a>

#### Adjustments

- Standardized scrollbar spacing and aligned Listbox with QuickAction’s header + scroll body structure.
- Outside-click detection now uses `triggerEl` / `anchorEl` from `ListboxOwnerContext` instead of a Select-private class, allowing other owners such as Pagination to reuse the same Listbox.
- Default entrance and exit motion now shares the opacity-only dropdown preset with Popover and Menu, with the scale channel removed.

[Component guide](../listbox.md) · [Full reference](./reference.md)
