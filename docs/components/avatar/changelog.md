# Avatar changelog

Reviewed against Chinese source SHA-256 `125d21236b392fc0645e725fde038ac7f7080e038a5bdaa044d8a7b12bef3a94`. For version differences, check the installed package as well.

<a id="v2125-2026-09-02"></a>

### v2.12.5 (2026-09-02)

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- Expanded per-Prop descriptions, default fallbacks, and usage boundaries based on the current source. Runtime behavior is unchanged.

<a id="v2124-2026-08-28"></a>

### v2.12.4 (2026-08-28)

- Added six named default Gradient palettes through `fallbackColor` and stable identity mapping through `fallbackSeed`. Pass `user.id` when possible; the same seed keeps its color across refreshes.
- Default color priority is explicit color, stable seed, name fallback, then fixed `blue`. A fully anonymous avatar no longer depends on the component instance ID.

<a id="v2123-2026-08-15"></a>

### v2.12.3 (2026-08-15)

- Default Gradient hover now mounts one of four module-cached prerasterized SVG layers on demand instead of creating runtime filter DOM. The active Gradient also inherits shared viewport pausing.

<a id="v2122-2026-08-15"></a>

### v2.12.2 (2026-08-15)

- Registered Avatar hover alpha art colors separately from the canvas art colors of Gradient and GradientMotion. Avatar's own exception covers only six-color hover tinting for images and ordinary component fallbacks.

<a id="v2121-2026-08-15"></a>

### v2.12.1 (2026-08-15)

- Registered default Gradient and six-color image/ordinary-component Avatar hover as professional art-color exceptions, bounded by StyleSpec §2.1.3.

<a id="v2120-2026-08-06"></a>

### v2.12.0 (2026-08-06)

- At rest, default Gradient fallback renders a shared static image instead of creating a full Gradient component, instance ID, hover state, and responsive derivation chain for each Avatar.
- On hover, mount full Gradient ripples and a five-color Overlay on demand, then release them 0.5 seconds after exit. Explicit `gradientMotion` still keeps full Gradient mounted.
- The static image uses native lazy loading, asynchronous decoding, and low fetch priority so long tables prioritize avatars near the viewport.

<a id="v2111-2026-08-03"></a>

### v2.11.1 (2026-08-03)

- Fixed externally supplied Badge/Icon children being shadowed by Frame's internal `children` snippet of the same name and never entering the DOM.
- Avatar root boxes use `vertical-align: middle` so empty, image, and Gradient avatars align vertically on the same line.

<a id="v2110-2026-08-03"></a>

### v2.11.0 (2026-08-03)

- The four base ripple layers in default Gradient fallback now use seven-segment asymmetric closed paths to avoid an obvious A→B→A reversal.
- Each hover randomly chooses one of six phase/direction combinations without repeating the previous one, without adding active layers, filters, or per-frame JavaScript.

<a id="v2100-2026-08-02"></a>

### v2.10.0 (2026-08-02)

- Default Gradient Avatar keeps its cached static image at rest. On hover, Gradient fades in four independently cycling ripple deformations; leaving releases live SVG and filters.
- `gradientMotion` now means only “run continuously”; it no longer prevents on-demand ripples on default hover.

<a id="v291-2026-08-02"></a>

### v2.9.1 (2026-08-02)

- Disabled the four base vector deformations of default Gradient fallback and added an explicit `gradientMotion` opt-in.
- Gradient's approved five-color Overlay hover remains unaffected by the base-deformation switch.

<a id="v290-2026-08-02"></a>

### v2.9.0 (2026-08-02)

- Restored the approved original conditions for default Gradient avatars: `.snowui-media-hoverable`, `.snowui-media-hoverable-has-visual`, and `.snowui-media-hoverable-visual`.
- Gradient returned inside the ordinary visual container and regains old `brightness(0.92)` feedback. It still skips Avatar's current monochrome alpha filter; images, Logos, and other fallbacks are unchanged.

<a id="v280-2026-08-02"></a>

### v2.8.0 (2026-08-02)

- Default Gradient fallback switched to a dedicated direct-render path, bypassing ordinary `.snowui-avatar-visual` and Avatar's monochrome SVG filter composition.
- Gradient directly fills the circular clipping container. Avatar owns only size, outer clipping, hover state, and Badge; Gradient owns SVG, color order, and its two Overlay layers.
- Images, Logos, and other component fallbacks retain Avatar's existing visual/alpha-filter hover, unaffected by the Gradient branch.

- **Avatar-Docs.2026-05-25** Archived the historical changelog from the source header. New changes belong in this document's changelog; the source header retains only its role, current key architecture, and documentation path.

<a id="v270-2026-08-02"></a>

### v2.7.0 (2026-08-02)

- Removed automatic initials. Without an explicit image, fallback, or fallbackText, Avatar defaults to a Gradient colored by name or instance seed.
- Added `variant="empty"` for the previous gray background and user-icon empty-avatar appearance.
- Monochrome randomized Avatar hover now uses SVG flood plus alpha composite, tinting only nontransparent pixels actually drawn by the image or ordinary component.
- Gradient fallback regained its own multicolor cycle; Avatar skips the monochrome filter for it to avoid double composition.

<a id="v260-2026-08-02"></a>

### v2.6.0 (2026-08-02)

- Simplified default hover from a continuous five-color two-layer cycle to one Overlay. Each pointer entry picks one of six colors, fixed for that hover.
- Each pointer entry independently selects one of six colors with equal probability and keeps it fixed until exit.
- Default initials, fallbackText, and user icon sit above the Overlay so text and icons are not tinted.
- Removed ten opacity animations, retaining one 0.5s opacity transition layer.

<a id="v250-2026-08-02"></a>

### v2.5.0 (2026-08-02)

- Moved the Gradient avatar-image hover implementation into Avatar as the default hover for all Avatar visual states.
- Stopped Avatar consuming the shared media-hoverable brightness/background-darkening branches to avoid duplicate feedback.
- Avatar now owns randomized five colors, two Overlay layers, a 10s cycle, 0.5s entry buffering, disabled behavior, and reduced-motion handling.

<a id="v2419-2026-06-10"></a>

### v2.4.19 (2026-06-10)

<a id="新功能"></a>

#### New features

- Added the `fallback` component entry, allowing visual components such as `GradientMotion` as the default avatar.
- Documented the `as="avatar-image"` composition role: an avatar image layer can replace the default fallback while retaining the Badge overlay.

<a id="v2418-2026-03-15"></a>

### v2.4.18 (2026-03-15)

<a id="修复"></a>

#### Fixes

- **AV-Docs.1** Aligned code header, document header, and changelog version at `v2.4.18`.
- **AV-Style.8** Removed Avatar's internal definition of `--snowui-frame-hover-image-override`, disabled background composition through its own hover rules, and added template `data-disabled` output to align disabled selectors with markup.

<a id="v2412-2026-03-06"></a>

### v2.4.12 (2026-03-06)

<a id="调整"></a>

#### Changes

- **AV-Hover.1** Restored old Avatar hover layers: darken `.snowui-avatar-visual` in image mode, darken `.snowui-avatar-background` in initials mode, and only transition background color for default fallback.
- **AV-Hover.2** Kept `.snowui-hoverable` semantics and disabled the default hover overlay declaratively through `--snowui-avatar-hover-image-override`.
- **AV-Hover.3** Excluded disabled state from all hover rules so `disabled` adds no hover feedback.

<a id="v2410-2026-02-18"></a>

### v2.4.10 (2026-02-18)

<a id="调整-1"></a>

#### Changes

- **AV-Typography.1** Set fallback text, initials, and root line height to `line-height: 1`, retaining the font-size ratio chain.
- **AV-HTML.1** Root style variables are injected only as needed; component CSS provides default `container/text` size factors, so the default state no longer emits inline `style`.

<a id="v248-2026-02-13"></a>

### v2.4.8 (2026-02-13)

<a id="优化"></a>

#### Improvements

- **AV-Style.6** Tightened Badge proportions: `DOT_SIZE_RATIO` is now `0.28` and `DOT_BORDER_RATIO` is `0.1`.
- **AV-Style.7** Completed ratio-based geometry: Badge size, cutout center, and offsets all derive from ratio constants across Avatar sizes.
- **AV-Refactor.6** Reformatted code, improving CSS locking-class declarations.

<a id="v237-2026-02-13"></a>

### v2.3.7 (2026-02-13)

<a id="修复-1"></a>

#### Fixes

- **AV-Fix.13** Found and fixed size multiplication: calculating Avatar size with both `--text-scale` and `--size-scale` enlarged it. Normalized calculations now cancel global factors.
- **AV-Fix.14** With a pure Token implementation, ensured `size` matches actual container size while retaining a single proportional text relationship.

<a id="根因说明"></a>

#### Root-cause explanation

- `--size` uses `em`, which depends on component `font-size`; `--text` and `--size` also have separate global scale factors.
- In the old Avatar chain, container size implicitly multiplied global factors and appeared about 3× larger.

<a id="v238-2026-02-13"></a>

### v2.3.8 (2026-02-13)

<a id="修复-2"></a>

#### Fixes

- **AV-Fix.15** Identified the actual cause as specificity conflict: inline `width/height` on Avatar root (Level 6) overrode `.snowui-avatar-lock-size` normalization (Level 4), defeating size locking.
- Inline styles now output only component variables, not `width/height`; component CSS computes both dimensions so the locking class works under StyleSpec priority.

<a id="v239-2026-02-13"></a>

### v2.3.9 (2026-02-13)

<a id="修复-3"></a>

#### Fixes

- **AV-Fix.16** Corrected the `lock-size` condition: follow scale only for valid numeric `sizeRatio/avatarSizeRatio`, avoiding absent or null values omitting the locking class.
- **AV-Fix.17** Locked `min/max width/height` with width/height in lock mode, preventing external minimum constraints from enlarging the Avatar container.

<a id="v2310-2026-02-13"></a>

### v2.3.10 (2026-02-13)

<a id="修复-4"></a>

#### Fixes

- **AV-Fix.18** Switched the main container-size chain from `--size(em)` to normalized `--text` length so `em` cannot multiply with font size in complex contexts.
- **AV-Fix.19** Fallback text and initials also use normalized `--text`, maintaining one ratio to the container (about 0.375).

<a id="说明"></a>

#### Explanation

- Because base Token `--size` is defined in `em`, its computed value depends on final `font-size`; external styles or cascade overrides can shift the intended ratio.
- This remained a pure Token approach without px constants, but used a more stable normalized length base to preserve Avatar's semantic container size.

<a id="v240-2026-02-13"></a>

### v2.4.0 (2026-02-13)

<a id="修复-5"></a>

#### Fixes

- **AV-Fix.20** Finally converged on fixed-size semantic Tokens: Avatar container became `var(--size-fixed) * factor`, and text became `var(--text-fixed) * factor`.
- **AV-Fix.21** Added `--size-fixed` (4px) and `--text-fixed` (16px) in `tokens.css` as absolute semantic component bases to prevent Avatar size increasing with host `html font-size`.

<a id="关键说明为何此前纯-token-链路无法稳定"></a>

#### Key explanation of why the previous pure Token chain was unstable

- Existing base Tokens use `em` for `--size` and `rem` for `--text`. Increasing root font size on the host scales the nominal fixed-pixel Avatar sizes such as 16/20/24.
- A Token-level absolute semantic base was therefore needed for Avatar without returning to hardcoded px inside the component.

<a id="v241-2026-02-13"></a>

### v2.4.1 (2026-02-13)

<a id="修复-6"></a>

#### Fixes

- **AV-Fix.22** Added inline hard locks for dimensions, still using Token variables: root emits `font-size/width/height/min/max` inline so external cascade cannot alter Avatar's semantic size.

<a id="调试标记"></a>

#### Debug marker

- Added `data-avatar-version="2.4.1-inline-lock"` on root to confirm that a page loaded the latest Avatar implementation.

<a id="v242-2026-02-13"></a>

### v2.4.2 (2026-02-13)

<a id="规范回归"></a>

#### Standards regression

- **AV-Refactor.3** Removed temporary inline size hard locks and version marker, returning size ownership to component CSS (Level 2/4) under StyleSpec priority.
- Retained the Token semantic approach: container and text still derived from fixed semantic bases (`--size-fixed` / `--text-fixed`) in `tokens.css` at this stage.

<a id="v243-2026-02-13"></a>

### v2.4.3 (2026-02-13)

<a id="规范修正"></a>

#### Standards correction

- **AV-Refactor.4** Removed `--size-fixed` / `--text-fixed` and returned to standard `--size` / `--text` Tokens.
- Kept normalized calculation to cancel `--size-scale` / `--text-scale` and the `lock-size` strategy for stable size under StyleSpec.

<a id="v244-2026-02-13"></a>

### v2.4.4 (2026-02-13)

<a id="规范修正-1"></a>

#### Standards correction

- **AV-Refactor.5** Removed direct `--size-scale` / `--text-scale` calculations from Avatar, leaving only standard base Tokens `--size` / `--text` in size and font-size calculations.

<a id="v245-2026-02-13"></a>

### v2.4.5 (2026-02-13)

<a id="修复-7"></a>

#### Fixes

- **AV-Fix.23** Adjusted Avatar Badge context's default dot size so `<Badge as="badge" />` matches Badge's standalone default dot size.

<a id="v246-2026-02-13"></a>

### v2.4.6 (2026-02-13)

<a id="修复-8"></a>

#### Fixes

- **AV-Fix.24** `Badge as="badge"` inside Avatar now scales with container size; default `badgeSize` became `containerSize * ratio` instead of a fixed value.
- **AV-Fix.25** Updated Avatar dot cutout mask radius and positioning together so Badge and cutout align after scaling.

<a id="v247-2026-02-13"></a>

### v2.4.7 (2026-02-13)

<a id="修复-9"></a>

#### Fixes

- **AV-Fix.26** Restored cutout border weight: dot border thickness scales with dot size using the old ratio (`0.04 / 0.25 = 0.16`).
- **AV-Fix.27** `badgeStyle` top/right inset and cutout radius now share one border-ratio chain, avoiding thin-looking borders on large Avatars.

<a id="v236-2026-02-13"></a>

### v2.3.6 (2026-02-13)

<a id="重构"></a>

#### Refactoring

- **AV-Refactor.1** Returned to pure Tokens on request: removed px size variables and restored Token calculations for `width/height/font-size`.
- **AV-Refactor.2** Retained `size` as Avatar container size with one text ratio of about `0.375`.

<a id="v235-2026-02-13"></a>

### v2.3.5 (2026-02-13)

<a id="修复-10"></a>

#### Fixes

- **AV-Fix.12** Further isolated global scale: Avatar container and fallback text switched to px variables so `--size-scale`/`--text-scale` would not multiply size.
- **Ratio preservation**: Container and text still follow a single ratio of about `0.375`, meeting the approximate-proportion requirement.

<a id="说明-1"></a>

#### Explanation

- In SnowUI, `--size`/`--text` Tokens scale with global factors. If a theme or container changes `--size-scale`/`--text-scale`, pure Token mapping scales proportionally by design.
- If Avatar must always equal incoming `size` in absolute pixels, use internal absolute dimension variables as this historical approach did, or add a Token exempt from global scaling.

<a id="v234-2026-02-13"></a>

### v2.3.4 (2026-02-13)

<a id="修复-11"></a>

#### Fixes

- **AV-Fix.11** Initially bypassed Scale for diagnosis by outputting root width/height as inline styles, blocking cascade from a parent Frame with `scale apply`.
- **Specification note**: Inline styles were limited to dynamic `width/height`, an allowed StyleSpec.md §2.9 case.

<a id="v233-2026-02-13"></a>

### v2.3.3 (2026-02-13)

<a id="修复-12"></a>

#### Fixes

- **AV-Fix.10** Fixed Avatar growing through cascade when parent `Frame` used `scale apply`; default container size locking preserves `size` meaning.
- **Compatibility**: Explicit `sizeRatio` or `avatarSizeRatio` still allows Avatar to follow the Scale chain.

<a id="v232-2026-02-13"></a>

### v2.3.2 (2026-02-13)

<a id="修复-13"></a>

#### Fixes

- **AV-Fix.8** Fixed abnormal Avatar container growth of about 3× by mapping `size` directly to Token factor (`size / 4`).
- **AV-Fix.9** Unified Avatar/text ratio chain: internal text and default icon use one ratio variable (about `0.375`).
- **Semantic clarification**: `size` means Avatar container size, not source-image resolution.

<a id="v231-2026-02-13"></a>

### v2.3.1 (2026-02-13)

<a id="修复-14"></a>

#### Fixes

- **AV-Fix.7** Corrected a ratio-factor error in Token linkage, resolving the persistent 3× drift.
- **Standards adaptation**: Removed inline `font-size: 1rem` and anchored through CSS to comply with StyleSpec.md §2.9.

<a id="重构-1"></a>

#### Refactoring

- **Token alignment**: Returned fully to the `tokens.css` system.
- **Standards adaptation**: Followed StyleSpec.md specificity, priority, and unit rules.
- **Anchor locking**: Fixed the persistent 3× drift by anchoring the `em` basis with `font-size: 1rem`.
- **Ratio refinement**: Set internal ratio to 32:12 (0.375).

<a id="v220-2026-02-12"></a>

### v2.2.0 (2026-02-12)

<a id="重构-2"></a>

#### Refactoring

- Added proportional scaling, locking Avatar-to-text ratio at 0.625.
- Used prescribed units: Avatar size in em, text size in rem.
- Removed hardcoded `sizeMap`.

<a id="v2125-2026-02-05"></a>

### v2.1.25 (2026-02-05)

<a id="样式优化"></a>

#### Style refinements

- **AV-Style.5** Default Avatar hover transitions only the background; the icon does not change color. The image filter runs only in image mode.

<a id="v2126-2026-02-05"></a>

### v2.1.26 (2026-02-05)

<a id="架构重构"></a>

#### Architecture refactoring

- **Size Context**: Reads `size` from Frame context when no explicit `size` prop is provided.
- **High-density resources**: Corrected size forwarding to Resource Components so 3× high-resolution assets load at their intended displayed size.

<a id="v2115-2026-02-03"></a>

### v2.1.15 (2026-02-03)

<a id="修复-15"></a>

#### Fixes

- **AV-Fix.6** Removed writes to internal variables owned by other components to prevent naming collisions.

<a id="v2114-2026-02-03"></a>

### v2.1.14 (2026-02-03)

<a id="修复-16"></a>

#### Fixes

- **AV-Fix.5** Aligned AvatarGroup-related internal variable names with SnowUI conventions.

<a id="v2113-2026-02-03"></a>

### v2.1.13 (2026-02-03)

<a id="修复-17"></a>

#### Fixes

- **AV-Fix.4** Writes the AvatarGroup size variable only when `size` is explicit, avoiding effects on spacing calculations.

<a id="v2112-2026-02-03"></a>

### v2.1.12 (2026-02-03)

<a id="修复-18"></a>

#### Fixes

- **AV-Fix.3** Fixed runtime recursion caused by size detection.

<a id="v2111-2026-02-03"></a>

### v2.1.11 (2026-02-03)

<a id="新功能-1"></a>

#### New features

- **AV-Feat.1** AvatarGroup `size` can be the default when Avatar receives no explicit `size`.

<a id="v2110-2026-02-03"></a>

### v2.1.10 (2026-02-03)

<a id="修复-19"></a>

#### Fixes

- **AV-Fix.2** Emits `style` only when there are styles, avoiding an empty attribute.

<a id="v219-2026-02-03"></a>

### v2.1.9 (2026-02-03)

<a id="修复-20"></a>

#### Fixes

- **AV-Fix.1** Changed size mapping to use `--size-*` Token variables.

<a id="v218-2026-02-03"></a>

### v2.1.8 (2026-02-03)

<a id="样式优化-1"></a>

#### Style refinements

- **AV-Style.4** Initials fallback uses one letter with the same font size as the default icon; background comes from secondary-color Tokens and text uses Static White.

<a id="v211-2026-02-03"></a>

### v2.1.1 (2026-02-03)

<a id="样式优化-2"></a>

#### Style refinements

- **AV-Style.3** Removed container base color in image mode; hover affects only the image.

<a id="v210-2026-02-03"></a>

### v2.1.0 (2026-02-03)

<a id="样式优化-3"></a>

#### Style refinements

- **AV-Style.2** Hover uses an image brightness filter to support irregular shapes.

<a id="v200-2026-02-03"></a>

### v2.0.0 (2026-02-03)

<a id="破坏性变更"></a>

#### Breaking changes

- **AV-Break.1** Removed `variant` / `alt` / `fallback` / `delayMs` Props; internal rules and external styles now control them.

<a id="样式优化-4"></a>

#### Style refinements

- **AV-Style.1** Set default border radius to `50%`, overridable through external styles.

<a id="文档完善"></a>

#### Documentation updates

- **AV-Doc.1** Updated styling and behavior documentation for the new API.

[Component guide](../avatar.md) · [Full reference](./reference.md)
