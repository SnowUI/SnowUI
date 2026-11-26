# Skeleton changelog

Reviewed against Chinese source SHA-256 `9afde6e4b177d4c8e2b3ea1e161cc81bf743805e4085d7a2651d44e69c1d9a62`. For version differences, check the installed package as well.

<a id="v140-2026-08-15"></a>

### v1.4.0 (2026-08-15)

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- Components now self-register through `renderHints` on their root Frame; a centralized class mapping no longer needs maintenance.
- The first-level Frame probe collects only children with `data-skeleton-registered="true"`.
- `renderHints.radius` now flows through the DOM bridge, probe, and final Skeleton styles.
- The old `COMPONENT_CLASS_MAPPING` remains for compatibility but no longer accepts registrations for new SnowUI components.

<a id="v139-2026-07-30"></a>

### v1.3.9 (2026-07-30)

- After Gradient was fully rewritten, the default Skeleton fallback size changed to `360 × 360`; explicit `renderHints` still take priority.

<a id="v138-2026-07-21"></a>

### v1.3.8 (2026-07-21)

- The default Skeleton fallback for Gradient changed to a `355 × 355` square; explicit `renderHints` still take priority.

<a id="v137-2026-07-20"></a>

### v1.3.7 (2026-07-20)

- Registered the Gradient root class and default rectangular layout. Gradient’s `renderHints` override the actual loading dimensions.

<a id="v136-2026-03-14"></a>

### v1.3.6 (2026-03-14)

<a id="样式"></a>

#### Styles

- The default Input Skeleton height changed to `1.25rem` (20px), representing the content area. Together with Frame’s 12px top and bottom padding, total height remains 44px.

<a id="v135-2026-03-07"></a>

### v1.3.5 (2026-03-07)

<a id="文档"></a>

#### Documentation

- Completed documentation of all current Skeleton rules, covering:
  - shape aliases
  - default sizes
  - corner radius and animation rules
  - component mapping table
  - multi-line `Text` Skeleton layout and final-line width
  - first-level component rendering rules
  - `renderHints` and size inheritance rules

<a id="v134-2026-03-07"></a>

### v1.3.4 (2026-03-07)

<a id="文本骨架布局"></a>

#### Text Skeleton layout

- Multiple `Text` Skeleton lines now stack vertically instead of appearing side by side.
- For multiple `Text` Skeleton lines, preceding lines fill the text container by default; the last line is fixed at `30%` of the container width.

<a id="尺寸约束"></a>

#### Size constraints

- Rounded-rectangle Skeletons still prioritize the final width and height provided by component `renderHints` instead of being compressed to a generic short-width style.

<a id="v133-2026-03-07"></a>

### v1.3.3 (2026-03-07)

<a id="渲染逻辑"></a>

#### Rendering logic

- Skeleton rendering now considers only first-level components.
- In Skeleton state, `Frame` first renders Skeletons for direct child components. It falls back to its own text Skeleton only when the first level has no components.
- In Skeleton state, `Text` now counts first-level block paragraphs, creates one text Skeleton per paragraph, and fills the text container width by default.

<a id="v132-2026-03-07"></a>

### v1.3.2 (2026-03-07)

<a id="样式调整"></a>

#### Style adjustments

- All Skeletons except circles now use a default corner radius of `12`.
- `text / line` Skeletons now default to `20px` (`1.25rem`) in height.

<a id="v131-2026-03-07"></a>

### v1.3.1 (2026-03-07)

<a id="样式调整-1"></a>

#### Style adjustments

- The rectangular Skeleton default radius is explicitly `12` (`--radius-3`, fallback `0.75rem`).

<a id="v130-2026-03-07"></a>

### v1.3.0 (2026-03-07)

<a id="架构重构"></a>

#### Architecture refactor

- Freed the `whileLoad` keyword: Skeleton now uses `loading` for visibility, separating it from Frame’s `loading / skeleton / whileLoad` protocol.

<a id="v121-2026-03-07"></a>

### v1.2.1 (2026-03-07)

<a id="新功能"></a>

#### New features

- Added Skeleton mapping and layout declarations for `frame / test`, enabling standards checks to verify complete Skeleton coverage across the component directory.

<a id="v120-2026-03-07"></a>

### v1.2.0 (2026-03-07)

<a id="架构重构-1"></a>

#### Architecture refactor

- Skeleton became an independent primitive without a `Frame` dependency, shared by Frame’s default loading protocol and test examples.
- Skeleton shapes were consolidated into `line / circle / rect`.
- Added centralized Skeleton assignment based on component root class names.

[Component guide](../skeleton.md) · [Full reference](./reference.md)
