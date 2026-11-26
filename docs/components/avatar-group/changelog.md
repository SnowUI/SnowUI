# AvatarGroup changelog

Reviewed against Chinese source SHA-256 `5340050402a2b82cc1de82175ae31ab9a2525451ba718eaeab9722a3f78486cc`. For version differences, check the installed package as well.

<a id="v187-2026-09-02"></a>

### v1.8.7 (2026-09-02)

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- Expanded the per-property descriptions, default fallbacks, and usage boundaries to match the existing source. Runtime behavior is unchanged.

- **AvatarGroup-Docs.2026-05-25** Archived the historical changelog at the top of the source file. Subsequent changes go in this document’s changelog; the source header retains only responsibilities, current key architecture, and the documentation path.

<a id="v186-2026-04-25"></a>

### v1.8.6 (2026-04-25)

<a id="修复"></a>

#### Fixes

- **AG-Fix.10** Fixed broken hover styling with `layout="stack"`. Stack positioning and masks moved from child Avatar inline styles to instance-level CSS rules owned by AvatarGroup, so Frame rewriting a child Avatar’s `style` on hover cannot erase parent geometry.

<a id="v185-2026-02-13"></a>

### v1.8.5 (2026-02-13)

<a id="修复-1"></a>

#### Fixes

- **AG-Fix.8** Fixed `+N` count avatars differing in size from ordinary avatars. `.snowui-avatar-group` now sets `font-size: var(--text-16)` so its size chain matches Avatar children using the same `--size-*` scale Tokens.
- **AG-Fix.9** Changed the `+N` size fallback from `em` to `rem` so parent font size no longer affects the no-size case.

<a id="v181-2026-02-13"></a>

### v1.8.1 (2026-02-13)

<a id="修复-2"></a>

#### Fixes

- **AG-Fix.6** Corrected an erroneous Token multiplier in `sizeMap`, fixing AvatarGroup size drift.

<a id="破坏性变更"></a>

#### Breaking changes

- **AG-Breaking.1** Removed deprecated `groupSize` and `avatarSize` completely. `size` now drives both.

<a id="修复-3"></a>

#### Fixes

- **AG-Fix.4** **Alignment hardening**: Absolutely positioned the counter in `stack` mode and corrected the container baseline, fixing offsets below 48px.
- **AG-Fix.5** **Resource matching**: Applies `Math.round()` when passing `size` to resource children so subpixel values such as 36.36px still load a matching image resolution.

<a id="新功能"></a>

#### New features

- **AG-Feat.3** Made size propagation more flexible. The system accepts computed dimensions at arbitrary precision; the child `Avatar` adapts its `rem` styling automatically.

<a id="v170-2026-02-06"></a>

### v1.7.0 (2026-02-06)

<a id="新功能-1"></a>

#### New features

- **AG-Feat.2** Added a CSS Mask based “True Cutout” border effect.
- **AG-Style.5** **Size logic refactor**: Unified layout under the `size` Prop. In `stack` mode, `size` is the container size and Avatar proportions adapt automatically.
- **AG-Style.6** Corrected the fixed angle for `max=3` in `stack` mode.

<a id="v160-2026-02-05"></a>

### v1.6.0 (2026-02-05)

<a id="新功能-2"></a>

#### New features

- **AG-Feat.1** Added `layout`, `groupSize`, and `avatarSize` for linear and circular stacked layouts.

<a id="架构重构"></a>

#### Architecture refactor

- **AG-Refactor.1** Stack mode fixes three Avatars plus `+N`, with `avatarSize` able to enlarge `groupSize`.
- **AG-Refactor.2** Without `avatarSize`, stack mode derives the default Avatar size from `groupSize * 0.6`.
- **AG-Refactor.4** Default Avatar size in stack mode changed to a tiered ratio based on `max`.
- **AG-Refactor.5** Stack positions, angles, and layer order are fixed along a 45° diagonal.

<a id="v157-2026-02-05"></a>

### v1.5.7 (2026-02-05)

<a id="样式优化"></a>

#### Style improvements

- **AG-Style.4** Capped overflow counter `overflowText` at `+99`.
- **AG-Style.3** Standardized the overflow-counter background to the specified gray (#EDEDED) and updated the CSS fallback.

<a id="v156-2026-02-05"></a>

### v1.5.6 (2026-02-05)

<a id="架构重构-1"></a>

#### Architecture refactor

- **Size Context**: Moved size-context logic into Frame. AvatarGroup’s `size` now propagates automatically through Frame to all child components (Avatar, Icon, Badge).

<a id="v154-2026-02-03"></a>

### v1.5.4 (2026-02-03)

<a id="样式优化-1"></a>

#### Style improvements

- **AG-Style.1** Changed the stacked-border thickness baseline to `var(--border-2)` at size 32.

<a id="v153-2026-02-03"></a>

### v1.5.3 (2026-02-03)

<a id="修复-4"></a>

#### Fixes

- **AG-Fix.3** Completed explicit Frame capability-switch forwarding.

<a id="v152-2026-02-03"></a>

### v1.5.2 (2026-02-03)

<a id="修复-5"></a>

#### Fixes

- **AG-Fix.2** Aligned internal variable names with SnowUI conventions and removed unnecessary font-weight styling.

<a id="v151-2026-02-03"></a>

### v1.5.1 (2026-02-03)

<a id="修复-6"></a>

#### Fixes

- **AG-Fix.1** Standardized stacked-spacing calculations for overflow and ordinary Avatars.

<a id="v150-2026-02-03"></a>

### v1.5.0 (2026-02-03)

<a id="新功能-3"></a>

#### New features

- **AG2.1** Added `size` to control default dimensions of in-group Avatars. Explicit child Avatar sizes take precedence.

<a id="v143-2026-02-03"></a>

### v1.4.3 (2026-02-03)

<a id="修复-7"></a>

#### Fixes

- **AG1.5** Synchronized selector syntax to prevent style parsing errors and cleaned up example asset references.

<a id="v142-2026-02-03"></a>

### v1.4.2 (2026-02-03)

<a id="修复-8"></a>

#### Fixes

- **AG1.4** Synchronized documentation with the actual child-element marking rules.

<a id="v141-2026-02-03"></a>

### v1.4.1 (2026-02-03)

<a id="样式优化-2"></a>

#### Style improvements

- **AG1.3** Added border cutout, spacing, and overflow-avatar color rules.

<a id="v140-2026-02-03"></a>

### v1.4.0 (2026-02-03)

<a id="新功能-4"></a>

#### New features

- **AG1.1** Added `max` to show overflow counts as `+N`.
- **AG1.2** Applied stacking rules to every direct child with a border-cutout strategy.

<a id="v131-2026-02-03"></a>

### v1.3.1 (2026-02-03)

- Adapted to Avatar’s new API and removed alt / fallback examples.

[Component guide](../avatar-group.md) · [Full reference](./reference.md)
