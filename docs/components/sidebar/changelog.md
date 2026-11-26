# Sidebar changelog

Reviewed against Chinese source SHA-256 `f35813ccaca0d1b8dd09890e8a1bfcd19bdf5a24e5ea928c56bb5c3675852c2e`. For version differences, check the installed package as well.

<a id="v196-2026-11-25"></a>

### v1.9.6 (2026-11-25)

- Aligned with the Workshop `17244:26322` design: Header default vertical padding is now `0px` with a `24px` minimum height, and the default Logo wordmark scales proportionally by `10/12` (`59x10`) with a `5px` gap so the expanded Logo sits `16px` from both the top and left Sidebar edges.

<a id="v195-2026-10-23"></a>

### v1.9.5 (2026-10-23)

- 2026-10-23: The existing Tags Test reuses Frame single-line layout and local ScrollArea horizontal scrolling, keeping at least 4px between tags without changing Sidebar runtime behavior or internal Tag spacing.

- Explicit singleLine footer content retains a 4 CSS px horizontal gap and larger public overrides; ordinary footer layout, default Logo artwork, collapse and scroll fades remain unchanged.
- Custom brand-name and footer avatar/name examples reuse Frame single-line layout and Text truncation with complete accessible text, retaining the existing logo-icon and leading roles.

- 2026-10-20: Default navigation and scroll-region names and built-in collapse controls, including the floating expand button in text mode, follow LocaleProvider. An explicit ariaLabel takes priority over Provider messages.

<a id="v193-2026-10-14"></a>

### v1.9.3 (2026-10-14)

- Fixed a stale stored Section ID expanding a category after refresh when the current active item is uncategorized. An externally supplied active item takes precedence over history; Section collapse state remains restorable.

<a id="v192-2026-10-12"></a>

### v1.9.2 (2026-10-12)

- Collapsed state and width now use local reactive state to receive bindable inputs and interaction callbacks, fixing stale derived values during repeated actions with unbound or explicit initial values. External binding, default collapse, and keyboard focus restoration retain their contracts.
- Moved the generic vertical scroll mask below the shared fallback layer so style injection order can no longer override the measured fade curves for Sidebar Logo and Footer.

<a id="v191-2026-10-12"></a>

### v1.9.1 (2026-10-12)

- Separator composition placeholders retain vertical padding and actual line width through minimum height, preventing lines from disappearing when CSS injection order differs between source and package modes. Built-in and explicit separators and thickness overrides stay aligned.

- 2026-09-28: Footer measured height is maintained jointly by component state and root styles; widening the Sidebar no longer briefly loses reserved space below the scroll area.

- 2026-09-28: Footer spans the full width and sits at the bottom, with 12px top, 16px bottom, and 20px horizontal padding. The updated design fades overlay opacity at 0% / 80% / 100% within the Footer height and removes rounded corners.

- 2026-09-28: The built-in Indicator uses the full edge as its hit area. Removed transparent-color special handling and aligned resting and hover appearance.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v190-2026-09-18"></a>

### v1.9.0 (2026-09-18)

- Iconless `text` mode collapses completely without retaining a 60px rail. The expand button floats independently at the top-left of the visible area, retaining the Sidebar's 12px left spacing Token.
- Retained the 60px collapsed rail in icon mode and ensured hidden content cannot receive focus, overlays are cleaned up, and keyboard focus is restored.

<a id="v180-2026-08-25"></a>

### v1.8.0 (2026-08-25)

<a id="交互变更"></a>

#### Interaction changes

- The entire right border is now draggable for width adjustment; Pointer hits are no longer limited to a short bar.
- Removed the visible resize bar while keeping a transparent Indicator interaction layer for Pointer, keyboard, ARIA, and scrollbar avoidance.

<a id="v173-2026-08-17"></a>

### v1.7.3 (2026-08-17)

<a id="优化"></a>

#### Improvements

- Removed the extra displacement of the expanded-state collapse button. Its position follows the centering of the `--size-6` hit host and `ResourceSize` 16 icon; the icon stays inside the right edge of Header/navigation content with a nominal 4px gap.

<a id="v172-2026-08-17"></a>

### v1.7.2 (2026-08-17)

<a id="修复"></a>

#### Fixes

- After placing a custom `as="logo"` into Header, the source node restored by Svelte in the navigation area remains hidden. Host utilities such as `flex` no longer override that structural boundary and reveal a duplicate Logo.

<a id="v171-2026-08-17"></a>

### v1.7.1 (2026-08-17)

<a id="修复-1"></a>

#### Fixes

- Moved size observation for Footer, Navigation, and the scroll area into shared `resizeManager`, aligning SSR, degraded capability, per-frame delivery, and cleanup boundaries.

<a id="v170-2026-08-15"></a>

### v1.7.0 (2026-08-15)

<a id="新功能"></a>

#### New features

- Made the Site Sidebar separator appearance the default for all horizontal Separators inside Sidebar. Built-in and external separators share 8px padding on all sides, zero line height, and the same public padding override.

<a id="v161-2026-08-12"></a>

### v1.6.1 (2026-08-12)

<a id="变更"></a>

#### Changes

- Changed the Header collapse/expand button from Button's default appearance to `bare`. Icon-only and sm sizing, transparent hit host, ARIA, visibility, and movement animation remain unchanged, aligning again with SidebarRequirement.

<a id="v160-2026-08-09"></a>

### v1.6.0 (2026-08-09)

<a id="新功能-1"></a>

#### New features

- Persistence is enabled by default: after refresh, restore Section expansion/collapse and the last active item, then scroll to that Item. Set `persistence={false}` to disable it; multiple instances are isolated with `persistenceKey`.
- Added `resizable`. In data mode, `SidebarItemData` now supports a `tags` Snippet and Snippet Icon so the Site adapter need not rebuild SidebarItem.

<a id="v152-2026-08-06"></a>

### v1.5.2 (2026-08-06)

<a id="修复-2"></a>

#### Fixes

- The collapsed state no longer incorrectly hides the continuous hover background; Item hover has the same background effect as expanded state.
- Added a transparent hit host for the collapse button, making it appear when the pointer moves directly to the expected button position.

<a id="v151-2026-08-06"></a>

### v1.5.1 (2026-08-06)

<a id="修复-3"></a>

#### Fixes

- Section headings interrupt continuous hover both on direct hits and in neighboring gaps when determining the nearest Item, preventing the area between collapsed headings from highlighting the Table below.

<a id="v150-2026-08-06"></a>

### v1.5.0 (2026-08-06)

<a id="新功能-2"></a>

#### New features

- Added optional `persistenceKey` to remember the active item and Section collapse states across refresh; the Section containing the active item opens automatically.
- When restoring a long list, position the active item near the visible center after excluding Footer coverage, and correct its position after the layout animation.

<a id="修复-4"></a>

#### Fixes

- Hovering a Section heading interrupts nearest-item inference for continuous hover, so a SidebarItem below a collapsed heading does not incorrectly show hover background.

<a id="v142-2026-07-28"></a>

### v1.4.2 (2026-07-28)

<a id="修复-5"></a>

#### Fixes

- Hover anywhere in Sidebar still reveals the width Indicator. When it overlaps a visible scrollbar Thumb, the Indicator fully withdraws from Pointer, hover, drag, and keyboard hits so only the scrollbar responds.

<a id="v141-2026-07-28"></a>

### v1.4.1 (2026-07-28)

<a id="修复-6"></a>

#### Fixes

- During collapse/expand, Footer keeps its expanded-state position and width and only fades opacity. This removes the compression, misalignment, and jumps from SB-01; the collapsed Footer also leaves interaction and accessibility focus.

<a id="v140-2026-07-28"></a>

### v1.4.0 (2026-07-28)

<a id="变更-1"></a>

#### Changes

- Narrowed the vertical hit range of the right-side width Indicator to 4px above and below the visible bar; it hides automatically where it overlaps an overlay scrollbar.
- Changed the Header collapse button to Button's default icon-only appearance and anchored it to the right of the Logo host's allocated area.

<a id="v131-2026-07-28"></a>

### v1.3.1 (2026-07-28)

<a id="变更-2"></a>

#### Changes

- Removed the built-in Tooltip from the Header collapse/expand button while retaining an accessible name through a dynamic `aria-label`.

<a id="v130-2026-07-28"></a>

### v1.3.0 (2026-07-28)

<a id="动效优化"></a>

#### Motion improvements

- The collapse button follows Sidebar width and moves to its collapsed position with Frame's default move spring.
- Sidebar narrowing begins together with fading Item text and Section headings; leading Item Icons retain their horizontal position.
- Only after a Section heading fully fades do its placeholder and gap collapse, letting Items move up in the second phase.

<a id="v121-2026-07-28"></a>

### v1.2.1 (2026-07-28)

<a id="修复-7"></a>

#### Fixes

- The Logo host stays on one line throughout collapse and expansion, preventing the transparent wordmark from wrapping at narrow widths, enlarging the container, and vertically shifting the Logo.

<a id="v120-2026-07-28"></a>

### v1.2.0 (2026-07-28)

<a id="新功能-3"></a>

#### New features

- Added `navigationVariant="icon|text"`; collapsed `text` mode keeps only the always-visible expand button and does not scan dynamic children to infer Icons.

<a id="修复-8"></a>

#### Fixes

- Header now has a stable start-aligned structure with a fixed leading slot for the Logo Icon. The Test example uses a fixed-width left-aligned host to eliminate Logo jumps during width collapse.
- Defers DOM placement of explicit `as="logo"` to the next frame so the default Logo branch can unmount before a Svelte-managed node moves, preserving Test page rendering.
- All built-in Sidebar Tooltips now appear to the right of their elements. Headings remain collapsible by default but no longer have Tooltips.
- The collapse button Tooltip closes as soon as width animation begins through Tooltip's motion-aware behavior.

<a id="v110-2026-07-28"></a>

### v1.1.0 (2026-07-28)

<a id="新功能-4"></a>

#### New features

- Collapse/expand now animates root width with a spring, reusing the critically damped timing of SidePanel entry/exit.
- Added a right-edge Indicator in expanded state. Drag to resize from 160px to 480px, with `width`, `bind:width`, and `onWidthChange` synchronized; collapse preserves the last expanded width.

<a id="v105-2026-07-28"></a>

### v1.0.5 (2026-07-28)

<a id="变更-3"></a>

#### Changes

- Confirmed a 12px default gap between Sidebar root Header and Body, and set the collapsed SidebarItem Tooltip to appear on the Icon's right by default.

<a id="v104-2026-07-28"></a>

### v1.0.4 (2026-07-28)

<a id="修复-9"></a>

#### Fixes

- Dynamically extend end-of-scroll safe space using actual Footer height. The last Item stays 12px from Footer regardless of external list gap.

<a id="v103-2026-07-28"></a>

### v1.0.3 (2026-07-28)

<a id="变更-4"></a>

#### Changes

- Footer defaults to 8px padding on all sides. Content uses top-left alignment, with its internal row centered on the same horizontal line.

<a id="v102-2026-07-28"></a>

### v1.0.2 (2026-07-28)

<a id="变更-5"></a>

#### Changes

- Footer defaults to top-left alignment and 8px content spacing; SB-04 removed all custom layout styles from the Footer node.

<a id="v101-2026-07-28"></a>

### v1.0.1 (2026-07-28)

<a id="变更-6"></a>

#### Changes

- Specified root default padding of 12px horizontally and 16px vertically, and aligned the Body vertical scrollbar 4px from Sidebar's right border.

<a id="v100-2026-07-23"></a>

### v1.0.0 (2026-07-23)

<a id="新功能-5"></a>

#### New features

- Initial block release: default Logo, `as="logo"` replacement, whole-Sidebar collapse, data/explicit composition, overlay Footer, and scrollable Body.

[Component guide](../sidebar.md) · [Full reference](./reference.md)
