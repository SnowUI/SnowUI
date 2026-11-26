# Toast changelog

Reviewed against Chinese source SHA-256 `ce167dd03f67f05fa5535db767d62be0d30ea0ff040d8c7ae252770ca28bd6a2`. For version differences, check the installed package as well.

<a id="v234-2026-11-23"></a>

### v2.3.4 (2026-11-23)

- Added a minimum 16x16 transparent hit host around the rich close X (matching the Sidebar collapse button): pointing directly at the X position, including outside the Toast corner radius, reveals and activates it without entering the Toast body first.
- Increased default auto-dismiss duration to 6 seconds (`DEFAULT_TOAST_DURATION = 6000`); removed `{#key}` remounting on exiting toasts in `Toaster`, slowed exit duration to 420ms (`cubic-bezier(0.32, 0.72, 0, 1)`), and faded opacity to 0 to eliminate abrupt exit jumps.
- Usage convention: stack a new notice via `toast()` when repeating the same feedback rather than dismissing and recreating the previous item.

<a id="v233-2026-10-23"></a>

### v2.3.3 (2026-10-23)

- Internal graphic/text and independent text regions keep at least 4 CSS px between them as root font and gap scale shrink, while preserving larger preferred gaps. Short labels can use inherited singleLine with Text lines={1} for truncation and full text. Rich multiline content does not automatically become a single line.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v232-2026-07-05"></a>

### v2.3.2 (2026-07-05)

<a id="修复"></a>

#### Fixes

- Follow the external Icon replacement protocol for direct `leading` children of Toast. When an external `as="leading"` child is present, the built-in CheckCircle / Warning is no longer rendered. This fixes TS-04 showing two icons at once.

<a id="v230-2026-06-18"></a>

### v2.3.0 (2026-06-18)

<a id="样式调整"></a>

#### Style adjustments

- Added `backdrop-filter: blur(var(--size-10))` and its WebKit prefix to the default variant, matching the blur level of shared overlay panels.
- The rich variant no longer overrides the Toaster idle layer with opaque `Background/1`. It retains the `Background/3 + blur(var(--size-10))` from `.snowui-quick-action-panel`. This favors the glass effect and allows a slight view of lower stacked content through the translucent background.
- Toaster no longer uses separate slot / measure wrappers for motion. The Toast root itself handles stack `translate` / `scale`, lifecycle `transform`, combined opacity, background, and `backdrop-filter`, so an external blur plate does not appear as a separate gray layer while content fades.
- In the single-layer structure, opacity is merged into the Frame fade configuration: appear uses `[80% × stackOpacity, stackOpacity]`, and disappear uses `[stackOpacity, 80% × stackOpacity]`. The default steady opacity is `0.8` for layer 2 and `0.6` for layer 3; their exit endpoints are `0.64 / 0.48`. This avoids using `filter`, which conflicts with Frame blur motion.
- Removed the unused `--snowui-toast-idle-background-override`.

<a id="v220-2026-05-15"></a>

### v2.2.0 (2026-05-15)

<a id="新增"></a>

#### Added

- **Inline mode `as="toast"`**: Toast, as a child of a host such as Button, finds its parent and binds the click trigger automatically. It needs neither an id nor a manual `showToast` call. This follows the three activation modes in ComponentGuidelines.md §5. Toast now supports panel, inline, and template modes.
- Added TS-30 / TS-31 examples for the default / rich variants in inline mode.

<a id="v210-2026-05-11"></a>

### v2.1.0 (2026-05-11)

<a id="修复-1"></a>

#### Fixes

- Hovering any visible Toast in a stack pauses the auto-dismiss timers of all visible layers at that position. Timers resume from their remaining time when hover ends; lower layers still do not show X.
- The Toaster measure layer now explicitly carries `--su-motion-transform` / `--su-motion-opacity`, fixing the missing translation in a normal exit animation.
- The rich background of the Toaster idle layer was made opaque with `--background-1` to prevent lower Toast content showing through. This historical policy was reversed in v2.3.0.
- When the stack exceeds `maxVisible`, the current last Toast enters `pushed-out`, moves farther in its entrance direction, and fades out, giving it a distinct pushed-out exit.
- Removed the Toaster `document.startViewTransition` update wrapper, so the browser transition queue no longer blocks repeated button clicks during motion.
- Toaster uses the outer slot for stack transform / opacity and the inner Frame for appearing and exiting, so appear/disappear transform does not override stack translation.
- The exit ghosting fix uses two transform layers: the inner Frame keeps a stable `translateY(±100%)` exit; the outer slot adds `index * gap + offset + 20px` of translation during `exiting / pushed-out`. Do not place `calc(±100% ± offset ± 20px)` in the inner `whileDisappear`.
- Changed the Toaster stack slot from a plain `div + animate:flip` to `Frame/Frame`, so stack transform / opacity transitions share Frame motion.
- `dismissToast()` first marks the item `exiting` and enters `Disappear`, then removes it after the exit animation, preventing instant disappearance.
- Frame added the controlled `currentState` entry, and its `Appear` / `Disappear` states now emit motion styles in Frame inline motion.
- Aligned the default dwell time, region width, stack gap, scale factor, hiding rules, and top/bottom slide directions with HeroUI.
- Added reusable motion atoms and composition presets without Toast-specific names: `slide` / `fade` / `scale` / `stackTranslate`. Toast composes them as `slideFromTop` / `slideToTop` and similar uses.

<a id="v200-2026-05-11"></a>

### v2.0.0 (2026-05-11)

<a id="破坏性变更"></a>

#### Breaking changes

- Removed the `title` / `description` / `icon` props from `<Toast>`; all text and slot structure now come from external children.
- Added the `positive?: boolean` prop to `<Toast>`: `true` shows CheckCircle (positive), `false` shows Warning (problem), and `undefined` shows no built-in icon.
- Updated the imperative `toast()` API from `title` / `description` / `icon` to `text` + `positive`. String syntax remains valid and is equivalent to `{ text }`.
- Removed the `ToastIconKind` type export.

<a id="修复-2"></a>

#### Fixes

- Fixed `.snowui-toast-builtin-icon` never matching: the Icon class is on an inner `.snowui-icon`, not a direct child. The selector now targets descendants instead of `>` and uses Icon's `--snowui-icon-width/height-override` to override the default 1rem size, so sm / md correctly differ at 16 / 20.
- Fixed external Icon replacement of the built-in icon. Following LayoutProtocol §4.1.5, the selector uses `:has(~) + :has(.builtin)` (as in SearchInput) to target the built-in wrapper precisely.

<a id="v100-2026-05-10"></a>

### v1.0.0 (2026-05-10)

<a id="新功能"></a>

#### New features

- Initial implementation: the `<Toast>` visual unit, global `<Toaster>` Portal, and imperative `toast()` API.
- Three slots: Leading / Content / Trailing. Built-in CheckCircle / Warning can be replaced by an external Icon.
- Two variants: default (dark glass pill, sm / md) and rich (white card reusing `.snowui-quick-action-panel`).
- Six positions (top / top-left / top-right / bottom / bottom-left / bottom-right), defaulting to top, 40px from the edge.
- Auto-dismiss (3 seconds by default), same-position stacking, and smooth advancement via `animate:flip` (historical implementation replaced by Frame slots in v2.1.0).
- Entrance and exit motion explicitly combines `slide + fade + scale`; Frame still owns lifecycle states `Appear / Disappear`.

[Component guide](../toast.md) · [Full reference](./reference.md)
