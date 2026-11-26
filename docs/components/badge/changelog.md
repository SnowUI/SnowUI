# Badge changelog

Reviewed against Chinese source SHA-256 `542b60510e7d7b3ba950af8ddbb252429c4975ecd0c2be215a62646441cecb5b`. For version differences, check the installed package as well.

<a id="v133-2026-09-02"></a>

### v1.3.3 (2026-09-02)

- 2026-10-05: Changed the former default Indigo palette to Brand (`--brand`), retaining opacity, states, and override behavior.
- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.
- Expanded the per-property descriptions, default fallbacks, and usage boundaries to match the existing source. Runtime behavior is unchanged.

<a id="v132-2026-08-28"></a>

### v1.3.2 (2026-08-28)

- Grid now centers the content layer at its natural width and allows symmetric overflow around the geometric center of fixed 16px / 12px Badges, correcting the optical offset of text labels and rightward offset of small numbers.

<a id="v131-2026-07-30"></a>

### v1.3.1 (2026-07-30)

- The text layer inside the Border variant now inherits a 16px line height, preventing the shared morph-item style from compressing its actual height to 12px. The New label now matches Kbd’s default border height.

<a id="v130-2026-07-30"></a>

### v1.3.0 (2026-07-30)

<a id="新功能"></a>

#### New features

- Added `variant="border"`, reusing the Tokens, padding, corner radius, font size, and line height of Kbd’s default outlined appearance for status and category labels such as New and updated. Default `filled` behavior is unchanged.

- **Badge-Motion.2026-06-18** Recreated the default motion with the two-layer structure of the transitions.dev Notification badge: the Frame root enters from the lower left while the full visual surface scales, fades, and blurs from its center. On exit the whole surface shrinks, rather than only the numeric content.
- **Badge-Motion.2026-06-30** Unified the semantics of the full visual channel for `while*`: an explicit object no longer shallow-merges Badge’s default x / y / scale / opacity; it inherits only default timing and dynamics.

- **Badge-Docs.2026-05-25** Archived the historical changelog at the top of the source file. Subsequent changes go in this document’s changelog; the source header retains only responsibilities, current key architecture, and the documentation path.

<a id="v128-2026-06-18"></a>

### v1.2.8 (2026-06-18)

<a id="动效还原"></a>

#### Motion restoration

- **BD-Motion.1** Adopted a positioned root and visual surface as two layers, matching the parallel slide / pop motion of the Notification badge.
- **BD-Motion.2** Entrance uses 260ms movement, 500ms scale/blur, and 400ms opacity; exit uses 180ms scale/opacity/blur and shrinks the entire Badge toward its center.
- **BD-Color.1** Added the `color` Prop, using the shared SnowUI PascalCase semantic-color resolver for numbers, text, and Dot-mode fill.

<a id="v127-2026-04-28"></a>

### v1.2.7 (2026-04-28)

<a id="调整"></a>

#### Adjustments

- **BD-Layout.1** Removed the component’s internal `margin` chain under the inline shell layout protocol. Parent layout now manages outside spacing for Dot mode.

<a id="v126-2026-03-07"></a>

### v1.2.6 (2026-03-07)

<a id="架构重构"></a>

#### Architecture refactor

- Freed the `whileLoad` keyword: Badge now uses `loading` for local loading state and passes `whileLoad` back to `Frame` as loading-state motion configuration.

<a id="v124-2026-02-18"></a>

### v1.2.4 (2026-02-18)

<a id="调整-1"></a>

#### Adjustments

- **BD-Typography.1** Standardized internal line height as `line-height: 1` for base styles and morph items.

<a id="v123-2026-02-05"></a>

### v1.2.3 (2026-02-05)

<a id="样式优化"></a>

#### Style improvements

- **BD-Style.2** Fixed numeric content color to white (`--static-white-100`).
- **BD-Doc.1** Moved every in-component style definition to the document’s `UserDefined` section.

<a id="v123-2026-02-05-1"></a>

### v1.2.3 (2026-02-05)

<a id="修复"></a>

#### Fixes

- **BD-Fix.2** Fixed numbers not being centered at large sizes by removing a forced `line-height`.

<a id="v122-2026-02-05"></a>

### v1.2.2 (2026-02-05)

<a id="架构重构-1"></a>

#### Architecture refactor

- **Size Context**: Added support for reading `size` from Frame context. Role-aware inheritance keeps the Badge at the right visual proportion in different use cases.

<a id="v120-initial"></a>

### v1.2.0 (Initial)

- Initial release

[Component guide](../badge.md) · [Full reference](./reference.md)
