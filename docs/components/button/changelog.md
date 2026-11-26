# Button changelog

Reviewed against Chinese source SHA-256 `82e570545e67188ec6d0a5d7981d8f7eec39ae07a61f106b0542bc1851205a26`. For version differences, check the installed package as well.

<a id="v2210-2026-11-24"></a>

### v2.21.0 (2026-11-24)

- Added opt-in `tooltip` (disabled by default) and `parts.Tooltip` (isolated from explicit `children` via `ComponentPartsBoundary`), lazily loading the built-in `Tooltip` and consuming `ButtonTooltipContext`; all host-specialized button components inherit this automatically.
- Deferred hover background width-factor measurement to first hover, focus, or click to eliminate synchronous mount-time layout thrashing and default `ResizeObserver` subscriptions.

<a id="v2200-2026-10-22"></a>

### v2.20.0 (2026-10-22)

- Reused the shared single-line minimum spacing floor while preserving Hug sizing, size/padding, icon sizing, motion, and events; updated the default active color from Indigo to Brand (`--brand`) on 2026-10-05.

<a id="v2190-2026-09-27"></a>

### v2.19.0 (2026-09-27)

- Added `contentScaleOnHover` so content scales together with the background and can be disabled independently; fixed end-frame text shift after hover scaling; unified documentation and API table entrypoints on 2026-09-21.

<a id="v2181-2026-09-12"></a>

### v2.18.1 (2026-09-12)

- Capped total horizontal hover background expansion at 0.25rem while retaining the vertical ratio. Borderless hidden starting state and click shrink compensate by axis, so expansion no longer grows without bound with button width. Shared size observation is reused; content, layout, and timing remain.

<a id="v2180-2026-09-04"></a>

### v2.18.0 (2026-09-04)

- Compensated md / lg hover endpoints, Borderless hidden starting points, and click midpoints inversely to standard height; default / sm appearance is unchanged. Retained proportional background transforms, colors, timing, content, and composition switches. Final appearance awaits Owner visual acceptance.

<a id="v2171-2026-09-02"></a>

### v2.17.1 (2026-09-02)

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v2170-2026-08-27"></a>

### v2.17.0 (2026-08-27)

- **BTN-Hover.14** Restored the background-layer ratio scheme approved by the Owner on 2026-08-19, replacing the current effect of BTN-Hover.9–13: gray / filled / outline use `1 → 1.06`; Borderless uses a hidden `0.84 → 1.06`; background transform uses `200ms ease`, color uses shared `150ms ease-out`. Content, hit area, layout, and composite-control disabling rules remain.

<a id="v2160-2026-08-19"></a>

### v2.16.0 (2026-08-19)

- **BTN-Hover.13** Hover color opacity and background inset/radius now share `150ms ease-in-out`, starting and finishing together on entry and exit; final color and geometry endpoints remain.

<a id="v2150-2026-08-19"></a>

### v2.15.0 (2026-08-19)

<a id="动效稳定性"></a>

#### Motion stability

- **BTN-Hover.12** Frame-by-frame browser inspection of the real Test A2 sm `Small` filled Button confirmed stable root layout. Perceived jitter came from high-contrast edge repaint at subpixels under `200ms ease` and staggered geometry/color completion. Geometry changed to `150ms ease-in-out` to shorten repaint and soften entry/exit; color retained a gentle `300ms ease-in-out` transition.

<a id="v2140-2026-08-19"></a>

### v2.14.0 (2026-08-19)

<a id="动效几何"></a>

#### Motion geometry

- **BTN-Hover.11** Independent hover background radius became the Button's resolved root radius plus current expansion, sharing `200ms ease` with inset. For sm / md / lg, iconOnly and text Buttons gain 1px of radius when expanding 1px per edge; root size, content, and continuous-corner curve remain.

<a id="v2130-2026-08-19"></a>

### v2.13.0 (2026-08-19)

<a id="视觉架构"></a>

#### Visual architecture

- **BTN-Corner.2** Replaced Button's hardcoded continuous corners with the shared cross-component rounded-rectangle primitive in `tokens.css` and `layout.css`. The hover background explicitly inherits the root curve; existing radius values, variants, bare mode, and ButtonGroup embedding remain.

<a id="v2120-2026-08-19"></a>

### v2.12.0 (2026-08-19)

<a id="视觉"></a>

#### Visuals

- **BTN-Corner.1** Added `corner-shape: superellipse(1.1)` to gray / filled / outline / borderless root shells and independent hover backgrounds for mild continuous-corner smoothing close to ordinary rounding. Existing sm / md / lg radii, public radius overrides, bare mode, and ButtonGroup embedded ownership remain; unsupported browsers fall back to `border-radius`.

<a id="v2110-2026-08-19"></a>

### v2.11.0 (2026-08-19)

<a id="动效"></a>

#### Motion

- **BTN-Hover.10** Restored the hover color layer's opacity transition at `300ms ease-in-out`, slower than `200ms ease` background expansion for softer color entry and exit. Both commit their final state immediately under reduced motion.

<a id="v2100-2026-08-19"></a>

### v2.10.0 (2026-08-19)

<a id="动效-1"></a>

#### Motion

- **BTN-Hover.9** Using the real Test A2 sm `Small` Button at `54.78125 × 24px`, old `scale(1.05)` added `2.739px` total width and `1.2px` total height. Rounded each to the nearest 2px multiple, `2px`. Default hover then added 2px total width and height in all three sizes rather than proportional scaling by Button size or content width.

<a id="v290-2026-08-19"></a>

### v2.9.0 (2026-08-19)

<a id="动效-2"></a>

#### Motion

- **BTN-Hover.8** Changed the lg hover background endpoint from `1.01` to `1.015`. Removed opacity transition from the Button hover background color layer so entry and exit switch immediately; scale motion remains.

<a id="v280-2026-08-19"></a>

### v2.8.0 (2026-08-19)

<a id="动效-3"></a>

#### Motion

- **BTN-Hover.7** Hover background endpoint now follows final resolved size: sm `1.05`, md `1.03`, lg `1.01`. Size Context and explicit `size` retain Button's existing priority.

<a id="v272-2026-08-19"></a>

### v2.7.2 (2026-08-19)

<a id="动效-4"></a>

#### Motion

- **BTN-Hover.6** Changed `BUTTON_HOVER_SCALE_UP_MOTION` background endpoint from `1.06` to `1.05`; content, layout dimensions, color feedback, and composite-control disabling remain.

<a id="v271-2026-08-19"></a>

### v2.7.1 (2026-08-19)

<a id="性能"></a>

#### Performance

- **BTN-Hover.5** Separated base background from the hover color overlay. Scaling updates only the background `transform`, while color feedback updates only the overlay `opacity`; `color-mix()` background is no longer recomputed each frame during scale. Outline's existing border-color transition remains.

<a id="v270-2026-08-19"></a>

### v2.7.0 (2026-08-19)

<a id="动效-5"></a>

#### Motion

- **BTN-Hover.3** Moved built-in hover scale from the Button root to an independent background layer; text, Icon, Spinner, state content, and hit area retain their size.
- **BTN-Hover.4** Gray / filled / outline / borderless retain base background plus overlay color composition. Borderless background expands from `0.84` to `1.06`; bare has no background layer and does not run built-in enlargement.

<a id="v260-2026-08-19"></a>

### v2.6.0 (2026-08-19)

<a id="动效-6"></a>

#### Motion

- **BTN-Hover.1** Standalone action Buttons defaulted to enlarging the component root visual channel to `1.06` without changing layout size. Borderless kept Light 4% / Dark 10% hover color and expanded an independent background from `0.84` to full size; bare remained without background.
- **BTN-Hover.2** `scaleOnHover` controls the built-in default independently. Composite-control owners disable it by default but instances may explicitly opt in. Explicit `whileHover` takes over default scaling; disabled Buttons do not scale, and reduced motion commits the final ratio directly.

<a id="v251-2026-08-16"></a>

### v2.5.1 (2026-08-16)

- Restored Static White text and icon colors for Filled; the host baseline's inherited color no longer depends on CSS injection order to override the component foreground.
- Existing priority of external classes and inline styles remains unchanged.

- **Button-Docs.2026-05-25** Archived the historical changelog from the source header. New changes belong in this document's changelog; the source header retains only its role, current key architecture, and documentation path.

<a id="v250-2026-08-11"></a>

### v2.5.0 (2026-08-11)

<a id="破坏性变更"></a>

#### Breaking changes

- **BTN-IconOnly.2** Added explicit `iconOnly`, default `false`. Button no longer infers single-visual-content layout from children DOM.
- **BTN-IconOnly.3** `iconOnly=true` emits `data-icon-only="true"` to coordinate symmetric padding, size context, bare minimum hit area, and render hints.
- **BTN-A11y.2** In development, an icon-only Button warns if it lacks `aria-label`, `aria-labelledby`, or `title`.
- **BTN-IconOnly.4** ColorSchemeButton, StyleButton, CopyButton, ExpandButton, and icon-only Button usages in the repository now declare `iconOnly` explicitly.

<a id="v240-2026-08-09"></a>

### v2.4.0 (2026-08-09)

<a id="调整"></a>

#### Changes

- **BTN-Bare.2** `bare` now defaults to `emphasis="normal"`, retaining 100% opacity at rest and hover. Secondary actions explicitly use `emphasis="muted"` for 40% to 100% on hover. Disabled state still has priority through global `--snowui-state-opacity`.
- **BTN-Bare.3** CopyButton feedback inherits its host Button's resting bare emphasis rather than unconditionally returning to 40%.

<a id="v232-2026-07-08"></a>

### v2.3.2 (2026-07-08)

<a id="修复"></a>

#### Fixes

- **BTN-Text.2** Default `--snowui-button-min-width` is now `max-content`, retaining the natural text + gap + padding minimum in outer flex-fill layouts such as Pagination `widthMode="fill"`. The outer layout can still stretch it when space permits, or handle wrapping/overflow when space is insufficient.

<a id="v231-2026-07-08"></a>

### v2.3.1 (2026-07-08)

<a id="修复-1"></a>

#### Fixes

- **BTN-Text.1** Text Buttons now default to `white-space: nowrap`, preventing short labels such as “Previous / Next” from wrapping character by character in compressed layouts such as Pagination `widthMode="fill"`.

<a id="v230-2026-07-04"></a>

### v2.3.0 (2026-07-04)

<a id="新功能"></a>

#### New features

- **BTN-Blur.1** Added opt-in `backgroundBlur`, reusing BarChart overlay blur at `backdrop-filter: blur(1.25rem)`.
- **BTN-Blur.2** Added `--snowui-button-background-blur-override` to control blur strength.

<a id="v220-2026-06-23"></a>

### v2.2.0 (2026-06-23)

<a id="破坏性变更-1"></a>

#### Breaking changes

- **BTN-Bare.3** Consolidated shell-free Button behavior into `bare` without a parallel entry. Bare retains normal content gap; for a single Icon it injects 12/16/20px size context and provides a transparent hit area of at least 16×16px.
- **BTN-Bare.4** Exact Icon size now comes from child Icon's `size`; Button no longer accepts a numeric size through shell-free mode.

<a id="v210-2026-06-22"></a>

### v2.1.0 (2026-06-22)

<a id="新功能-1"></a>

#### New features

- **BTN-Bare.1** Initially introduced shell-free `bare` mode for text, Icon, and other content, without padding, radius, background, or border. It used `currentColor × opacity: 0.4 -> 1` at the time; since 2026-08-09 that appearance requires explicit `emphasis="muted"`, while bare defaults to 100%.
- **BTN-Bare.2** When bare is placed in Tab, Tab's `--snowui-button-opacity-override` controls opacity on the same Button root, without multiplying two opacity layers.

<a id="v200-2026-06-01"></a>

### v2.0.0 (2026-06-01)

<a id="破坏性变更-2"></a>

#### Breaking changes

- **BTN-Link.1** Removed `variant="link"` without a compatibility alias. Text links use a separate `<Link>`; button-style navigation continues to use `<Button href>`.

<a id="v151-2026-05-25"></a>

### v1.5.1 (2026-05-25)

<a id="新功能-2"></a>

#### New features

- **BTN-Breadcrumb.1** Added the `as="item"` composition role for Breadcrumb path segments.
- **BTN-Breadcrumb.2** When Breadcrumb marks `Button as="item"` with `aria-current="page"`, hover overlay, click, Enter, and Space activation are disabled, and Breadcrumb does not forcibly override Button size.
- **BTN-Breadcrumb.3** `Button as="item"` inherits Breadcrumb `variant` when Button does not specify one. An explicit Button variant takes priority; with no Breadcrumb variant, Button returns to its default.
- **BTN-Pagination.1** Added composition roles `as="current"` / `as="page"` / `as="prev"` / `as="next"` for Pagination role styling. Button does not calculate page numbers.

<a id="v150-2026-05-21"></a>

### v1.5.0 (2026-05-21)

<a id="新功能-3"></a>

#### New features

- **BTN-A11y.1** Emits `aria-pressed` automatically when the `Click` dictionary is an `Idle ↔ Active` toggle and `currentState ∈ {Idle, Active}`; the root reflects state as `aria-pressed="true|false"`.
- **BTN-A11y.2** Explicit external `aria-pressed` / `aria-selected` has highest priority and is no longer overwritten, supporting listbox/tab selection contexts.
- **BTN-Toggle.1** Added `toggle` syntax sugar. `<Button toggle>` injects `Click={{ Idle: "Active", Active: "Idle" }}` and `whileClick=false`, giving full toggle behavior (state transition, Indigo color, aria-pressed) with the active-state rule below. Consumers may still override `Click` / `whileClick` explicitly.

<a id="调整-1"></a>

#### Changes

- **BTN-Active.1** Active styling is driven by Frame's automatic `data-state="Active"`. The root applies Secondary/Indigo while Active; consumers need no internal class in `stateClass`. The earlier v1.5.0 proposal requiring `stateClass={{ Active: "snowui-button-active" }}` is obsolete.
- **BTN-Active.2** Automatic Indigo active styling applies to `gray` / `outline` / `borderless`, excluding `filled` to avoid conflict with variant colors. Consumers can customize filled activation through `stateClass` / `stateStyle`.

<a id="v144-2026-03-16"></a>

### v1.4.4 (2026-03-16)

<a id="调整-2"></a>

#### Changes

- **BTN-Role.4** Removed `control="date-picker"`; date triggers now use only the `as="trailing"` composition rule.
- **BTN-Role.5** A date trigger within a complex structure works only in a recognizable local container, such as a direct `Field` child or `Frame as="row"`.

<a id="v143-2026-03-15"></a>

### v1.4.3 (2026-03-15)

<a id="修复-2"></a>

#### Fixes

- **BTN-Role.3** Button now forwards `as` correctly to Frame role classes so `as="trailing"` participates in Field composition.

<a id="v1310-2026-03-10"></a>

### v1.3.10 (2026-03-10)

<a id="新功能-4"></a>

#### New features

- **BTN-Role.1** Button can join the `Image` host positioning protocol through `as="badge"` / `as="icon"`.
- **BTN-Role.2** Button can join the `ImageViewer` control-button positioning protocol through `as="prev"` / `as="next"` / `as="close"`.

<a id="v138-2026-02-26"></a>

### v1.3.8 (2026-02-26)

<a id="架构调整"></a>

#### Architecture changes

- **BTN-Refactor.1** Removed the specialized `stateText` feature; Button returns to generic children rendering.
- **BTN-Refactor.2** Frame's shared capabilities now own state variables, classes, and styles (`stateVars/stateClass/stateStyle`).

<a id="v136-2026-02-26"></a>

### v1.3.6 (2026-02-26)

<a id="新功能-5"></a>

#### New features

- **BTN-Feat.1** Button children now receive Frame's state object, including `currentState`, allowing declarative state-dependent labels through a `children` snippet.

<a id="v135-2026-02-25"></a>

### v1.3.5 (2026-02-25)

<a id="修复-3"></a>

#### Fixes

- **BTN-Fix.3** Injected `RESOURCE_ICON_CONTEXT_KEY` size context. At the time, direct resource Icons were detected from DOM and sized sm/md/lg => 16/20/24; since v2.5.0 this requires explicit `<Button iconOnly>`.

<a id="v134-2026-02-25"></a>

### v1.3.4 (2026-02-25)

<a id="修复-4"></a>

#### Fixes

- **BTN-Fix.2** `as="more"` no longer relies on `TextContext` for its role class. Declaring `as="more"` attaches `snowui-text-expand-button` and keeps it visible inside Text; clicking still expands Text when TextContext is present.

<a id="v133-2026-02-25"></a>

### v1.3.3 (2026-02-25)

<a id="修复-5"></a>

#### Fixes

- **BTN-Fix.1** Changed rendering of `as="more"`: it no longer depends on `isCollapsed` for visibility. `<Button as="more">` renders when declared inside Text and still coordinates expansion after click.

<a id="v132-2026-02-23"></a>

### v1.3.2 (2026-02-23)

<a id="架构调整-1"></a>

#### Architecture changes

- **BT-Refactor.1** Removed Button's built-in text truncation (`buttonLines` + `truncate` action).
- **BT-Refactor.2** Text now owns truncation; Button retains interaction and layout responsibilities.

<a id="v131-2026-02-18"></a>

### v1.3.1 (2026-02-18)

<a id="样式优化"></a>

#### Style refinements

- **BT-Bridge.1** Button core visual properties (`width/height/padding/gap/radius/font-size/line-height/color/background/inner-border`) now use the variable chain `override -> internal -> token`.
- **BT-Bridge.2** `sm/md/lg` and `icon-only` now override only internal variables, not final visual values, enabling host composition to override them.
- **BT-Bridge.3** Variant states now use bridge variables and `data-variant` as a Level 4 selector entry, while excluding disabled hover.

<a id="v130-2026-02-18"></a>

### v1.3.0 (2026-02-18)

<a id="调整-3"></a>

#### Changes

- **BT-Layout.1** Removed `min-width/min-height` constraints from sm/md/lg Buttons; content and padding alone determine size.
- **BT-Style.2** Simplified size style variables: sm is the default, md/lg override only differences, and duplicate icon-only selectors are merged.
- **BT-Spec.1** Aligned the three Button sizes with Figma: sm/md/lg `icon-size`, `padding`, `gap`, and `radius` are `16/20/24`, `4x12/8x16/12x20`, `4/6/8`, and `12/16/20`.
- **BT-Typography.1** Paired font size and line height: `sm=--text-12 + --leading-12`, `md=--text-14 + --leading-14`, `lg=--text-16 + --leading-16`.
- **BT-IconOnly.1** Single-Icon button `icon-only` padding matches each size's vertical padding (`4/8/12`).

<a id="v128-2026-02-07"></a>

### v1.2.8 (2026-02-07)

<a id="修复-6"></a>

#### Fixes

- **BT-Fix.5** Fixed `icon + text` being misidentified as `icon-only`.
- **BT-Fix.6** At the time, icon-only detection changed to exact runtime checks (one icon element and no text node); v2.5.0 removed this automatic inference.

<a id="v123-2026-02-07"></a>

### v1.2.3 (2026-02-07)

<a id="修复-7"></a>

#### Fixes

- **BT-Fix.2** Fixed `Icon.svelte` inside Button failing to follow sm/md/lg `16/20/24` automatically through Frame Size Context.
- **BT-Fix.3** Fixed the single-Icon rule missing the `Icon` root by including `.snowui-icon-wrapper`.
- **BT-Fix.4** Corrected minimum-height reset for the `link` variant (`min-height: 0`).

<a id="v122-2026-02-07"></a>

### v1.2.2 (2026-02-07)

<a id="新功能-6"></a>

#### New features

- **BT-Size.1** Added minimum width and height for sm/md/lg (`28/40/56`).
- **BT-Size.2** Linked child `Icon.svelte` size with Button size (`16/20/24`).
- **BT-Size.3** Added distinct padding for a single-Icon Button.

<a id="调整-4"></a>

#### Changes

- **BT-Style.1** Changed regular sm padding to `12` horizontally and `4` vertically.

<a id="v121-2026-02-03"></a>

### v1.2.1 (2026-02-03)

<a id="修复-8"></a>

#### Fixes

- **BT-Fix.1** Passed Frame capability switches explicitly.

<a id="v120-initial"></a>

### v1.2.0 (Initial)

- Initial release.

[Component guide](../button.md) · [Full reference](./reference.md)
