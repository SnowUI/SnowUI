# Tab changelog

Reviewed against Chinese source SHA-256 `ff7bbfdd5482bf70f930cf31e64301b53632948ef8c8dacb52f912d3844264f5`. For version differences, check the installed package as well.

<a id="v132-2026-10-22"></a>

### v1.3.2 (2026-10-22)

- Generated icon-toggle items retain their label as an accessible name when text is hidden. Segmented inherits this through Tab; spacing and interaction continue to use Button.

<a id="v131-2026-10-14"></a>

### v1.3.1 (2026-10-14)

- Buttons, Icons, and Text generated from default items receive their respective parts directly. Explicit children do not inherit these default configurations.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v123-2026-08-17"></a>

### v1.2.3 (2026-08-17)

- Moved Tab root size observation into shared `resizeManager`, standardizing SSR, unavailable-capability, per-frame delivery, and resource-release boundaries.

<a id="v122-2026-08-14"></a>

### v1.2.2 (2026-08-14)

- The `icon-toggle` variant now uses the same `blur(1.25rem)` background blur as pill and SearchBox.

<a id="v121-2026-08-14"></a>

### v1.2.1 (2026-08-14)

- Added `backdrop-filter: blur(1.25rem)` to the default `pill` variant, matching SearchBox, with `-webkit-backdrop-filter` as well.
- Added the public `--snowui-tab-background-blur-override`; other variants do not enable background blur by default.

<a id="v120-2026-07-06"></a>

### v1.2.0 (2026-07-06)

- Added optional `icon` to `TabItem`. Built-in mode can generate `Button + Icon + Text` and fully supports `variant="icon-toggle"`.

<a id="v111-2026-06-23"></a>

### v1.1.1 (2026-06-23)

<a id="item-尺寸覆盖契约"></a>

#### Item size override contract

- Clarified Item size-style precedence: `style > class > Button size > Tab size`. Tab size is only the composition default when no explicit size is supplied.

<a id="v110-2026-06-23"></a>

### v1.1.0 (2026-06-23)

<a id="新功能与尺寸契约"></a>

#### New features and size contract

- Added `variant="bare"`: neither container nor Item has a shell or indicator. It supports text, one Icon, or mixed content with 12/16/20px gaps and 0.4→1 opacity states.
- Tab `size` is passed to direct child `Button as="item"` through an explicit Button size context. Button remains the sole owner of size definitions; an explicit instance `size` takes precedence.

<a id="v108-2026-06-22"></a>

### v1.0.8 (2026-06-22)

<a id="组合能力"></a>

#### Composition

- Added shell-free Button Item composition. Tab’s `--snowui-button-opacity-override` and Button’s internal opacity variable share one root-node cascade, so inactive opacity remains 0.4 instead of multiplying to 0.16.

<a id="v107-2026-06-21"></a>

### v1.0.7 (2026-06-21)

<a id="动效归口"></a>

#### Motion ownership

- Added the `TAB_INDICATOR_MOTION` family preset, returning indicator transform, width, and height to the 250ms smooth-out of transitions.dev Tabs sliding.
- Movement now consumes the actual Frame control bridge and drops a nonexistent transform bridge name. Tab no longer misuses generic `RESIZE_MOTION`.

<a id="v106-2026-06-21"></a>

### v1.0.6 (2026-06-21)

<a id="动效修复"></a>

#### Motion fixes

- Fixed ResizeObserver synchronously overwriting indicator movement without animation after switching `variant="icon-toggle"`. After initialization, all size remeasurements continue to animate movement.
- The Tab root previously injected a generic resize preset; v1.0.7 replaced it with the Tab-specific indicator preset.

<a id="v105-2026-06-18"></a>

### v1.0.5 (2026-06-18)

<a id="动效还原"></a>

#### Motion restoration

- Fully aligned with transitions.dev Tabs sliding: indicator transform, width, and height all use 250ms and `cubic-bezier(0.22, 1, 0.36, 1)`, removing the mismatch between the former 200ms movement and 300ms resizing.
- Initial rendering and resize still snap the indicator into place; `prefers-reduced-motion` now disables indicator transitions.

<a id="v104-2026-06-13"></a>

### v1.0.4 (2026-06-13)

<a id="交互修正"></a>

#### Interaction fixes

- Aligned background movement with transitions.dev Tabs sliding. The indicator now writes DOM `transform / width / height` directly. Initial placement and resize temporarily disable transitions and force reflow to snap into place; only user switches slide.

<a id="v103-2026-05-31"></a>

### v1.0.3 (2026-05-31)

<a id="样式调整"></a>

#### Style adjustments

- Active Text / Icon color depends on variant: pill / icon-toggle retain `--static-black-100`, underline uses `--primary`, and solid keeps Button’s default color chain.
- Inactive Text / Icon consistently use `--black-100 × opacity: 0.4`.
- Added Icons to the examples for all four variants so Text / Icon color inheritance can be observed directly.

<a id="v102-2026-05-31"></a>

### v1.0.2 (2026-05-31)

<a id="样式调整-1"></a>

#### Style adjustments

- Corrected Item colors in both states: inactive Text / Icon retain Button’s default `--black-100`; active Text / Icon use `--static-black-100`.
- The inactive 40% appearance still comes only from overall `opacity: 0.4`; inactive hover and active states use `opacity: 1`.

<a id="v101-2026-05-31"></a>

### v1.0.1 (2026-05-31)

<a id="样式调整-2"></a>

#### Style adjustments

- Removed the 40% color-value path for inactive Items in favor of `opacity: 0.4`. Hover / active return to `opacity: 1`, matching `StyleSpec.md §2.4.5`.
- Added external override entries `--snowui-tab-inactive-opacity-override` / `--snowui-tab-hover-opacity-override`.

<a id="v100-2026-05-20"></a>

### v1.0.0 (2026-05-20)

<a id="新功能"></a>

#### New features

- Initial implementation: 4 variants (pill / solid / underline / icon-toggle) × 3 sizes (sm/md/lg) × 2 directions (row/column).
- Shared indicator position / size transitions, consuming Frame control / size motion bridge variables.
- Roving tabindex keyboard behavior with a `selectionFollowsFocus` mode switch.
- Supports Figma `fill` width, distributing horizontal Items evenly when the container has an explicit width.
- Added `FRAME_SIZE_MOTION_BRIDGE` to Frame alongside this work; see bridge.md changelog v1.3.0.

<a id="修正"></a>

#### Corrections

- The `variant="underline"` container now has a default corner radius of 0. The component calculates underline / vertical-line dimensions rather than relying on CSS to override inline dimensions.

[Component guide](../tab.md) · [Full reference](./reference.md)
