# Image changelog

Reviewed against Chinese source SHA-256 `d7bd14966f1d1e2445df23b4060616c05938115b4bcddde21318e9b4d2944c19`. For version differences, check the installed package as well.

<a id="v150-2026-10-20"></a>

### v1.5.0 (2026-10-20)

- Fixed SSR recursion caused by the external children Prop sharing the name of the internal Frame Snippet; media attachments keep their behavior.
- Added mediaLoading and public provideMediaLoading() scoped defaults. Defaults stay lazy, explicit Image Props override inheritance, and video and resource-component behavior remain unchanged.

- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

- **Image-Docs.2026-05-25** Archived the historical changelog from the source header. New changes now belong in this document's changelog; the source header retains only its role, current key architecture, and documentation path.

<a id="v140-2026-07-05"></a>

### v1.4.0 (2026-07-05)

<a id="调整"></a>

#### Changes

- When `previewMode` is not explicitly set, use the shared ImageViewer service if one exists on the page; otherwise fall back to `window`.
- An explicit `viewer`, `window`, or `none` always takes precedence over automatic routing.

<a id="v134-2026-05-20"></a>

### v1.3.4 (2026-05-20)

<a id="调整-1"></a>

#### Changes

- **IM-Behavior.5** String image and video sources remain clickable by default. Only interactive Images show a hover color change, pointer cursor, and button semantics; `previewMode="none"` without a click handler remains static.

<a id="v133-2026-03-13"></a>

### v1.3.3 (2026-03-13)

<a id="调整-2"></a>

#### Changes

- **IM-Adjust.9** String image and video sources now use an internal `Skeleton` placeholder during loading; show the media only after it finishes loading.

<a id="v132-2026-03-13"></a>

### v1.3.2 (2026-03-13)

<a id="调整-3"></a>

#### Changes

- **IM-Adjust.8** Extended the size scale with `56 / 64 / 72` and updated corner radii to `56→16px` and `64/72/80→20px`.

<a id="v131-2026-03-13"></a>

### v1.3.1 (2026-03-13)

<a id="调整-4"></a>

#### Changes

- **IM-Adjust.7** Removed the compatibility props `openable / disableImageViewer`; `previewMode` is now the sole control for opening behavior.

<a id="v130-2026-03-12"></a>

### v1.3.0 (2026-03-12)

<a id="调整-5"></a>

#### Changes

- **IM-Adjust.5** Added `previewMode="viewer" | "window" | "none"` and made `window` the default opening mode.
- **IM-Behavior.4** An `Image` no longer joins page-level preview merely because an `ImageViewer` exists; only explicit `previewMode="viewer"` enters the Viewer flow.

<a id="v122-2026-03-12"></a>

### v1.2.2 (2026-03-12)

<a id="修复"></a>

#### Fixes

- **IM-Fix.12** Added `Enter` key support to `openable`, completing the same keyboard opening behavior as `Space`.
- **IM-Behavior.3** With an automatic `ImageViewer` on the page, `Image` opens on click by default without an explicit `openable`; `disableImageViewer` can still force a new window.
- **IM-Fix.13** Restored forwarding of external `mouseenter / mouseleave` callbacks so video hover handling does not swallow page-level coordination.
- **IM-Fix.14** Removed the `!important` focus override, clearing the default outline only for `:focus-visible`; renamed internal hover override variables to `--snowui-image-*`.

<a id="v120-2026-03-10"></a>

### v1.2.0 (2026-03-10)

<a id="新功能"></a>

#### New features

- **IM-Feat.6** Added `disableImageViewer` to force this `Image` to open in a new window.
- **IM-Behavior.2** When an automatic `ImageViewer` exists on the page, `openable` joins that single page-level Viewer by default; otherwise it falls back to a new window.

<a id="v121-2026-03-11"></a>

### v1.2.1 (2026-03-11)

<a id="调整-6"></a>

#### Changes

- **IM-Adjust.4** String images now load directly with native `<img>` and update state through `load/error` events. Removed the extra `window.Image()` preloader to avoid duplicate loading in large image lists.

<a id="v1111-2026-03-10"></a>

### v1.1.11 (2026-03-10)

<a id="新功能-1"></a>

#### New features

- **IM-Feat.5** Added string video sources; `Image` can now render mp4/webm/ogg/mov.
- **IM-Behavior.1** A video thumbnail plays automatically on hover, then pauses and returns to its first frame when hover ends.

<a id="v106-2026-03-10"></a>

### v1.0.6 (2026-03-10)

<a id="修复-1"></a>

#### Fixes

- **IM-Fix.5** Image hover now darkens an internal visual overlay, avoiding cases where a filter alone produced little visible change.

<a id="v114-2026-03-10"></a>

### v1.1.4 (2026-03-10)

<a id="调整-7"></a>

#### Changes

- **IM-Adjust.3** Reduced the image hover overlay strength to match the existing `Avatar` hover appearance.

<a id="v113-2026-03-10"></a>

### v1.1.3 (2026-03-10)

<a id="修复-2"></a>

#### Fixes

- **IM-Fix.11** Restored the previously verified image hover appearance by darkening the internal visual overlay instead of relying on `brightness` on the image node.

<a id="v112-2026-03-10"></a>

### v1.1.2 (2026-03-10)

<a id="修复-3"></a>

#### Fixes

- **IM-Fix.10** Image hover now targets both the visual layer and actual `media` node, eliminating lost hover feedback across image sources.

<a id="v111-2026-03-10"></a>

### v1.1.1 (2026-03-10)

<a id="修复-4"></a>

#### Fixes

- **IM-Fix.9** Image hover now targets the actual `media` node, fixing missing hover feedback for resource images.

<a id="v110-2026-03-10"></a>

### v1.1.0 (2026-03-10)

<a id="调整-8"></a>

#### Changes

- **IM-Adjust.2** Moved the `Image` hover selector into `src/styles/layout.css` to share the hover rule with `Avatar`.

<a id="v109-2026-03-10"></a>

### v1.0.9 (2026-03-10)

<a id="修复-5"></a>

#### Fixes

- **IM-Fix.8** Added a lightweight hover fallback layer for `resource-svelte` images to restore visible hover feedback.

<a id="v108-2026-03-10"></a>

### v1.0.8 (2026-03-10)

<a id="修复-6"></a>

#### Fixes

- **IM-Fix.7** Strengthened image hover targeting: under the retained `brightness(0.85)` approach, the image node also changes brightness so hover remains visible.

<a id="v107-2026-03-10"></a>

### v1.0.7 (2026-03-10)

<a id="修复-7"></a>

#### Fixes

- **IM-Fix.6** Aligned `Image` hover fully with `Avatar`: removed the image overlay and restored `brightness(0.85)` on the visual layer when an image is present.

<a id="v105-2026-03-10"></a>

### v1.0.5 (2026-03-10)

<a id="修复-8"></a>

#### Fixes

- **IM-Fix.4** Matched the `Avatar` hover layers: darken the visual layer for images; for placeholders, transition the background from `--black-4` to `--black-10`.

<a id="v104-2026-03-10"></a>

### v1.0.4 (2026-03-10)

<a id="修复-9"></a>

#### Fixes

- **IM-Fix.3** The `as="icon"` host style now centers content only; it no longer stretches child components such as `Button` with `inset: 0`.

<a id="v103-2026-03-10"></a>

### v1.0.3 (2026-03-10)

<a id="调整-9"></a>

#### Changes

- **IM-Adjust.1** Added fixed size-to-radius mapping for `Image`: `12/16/20→4px`, `24/28/32→8px`, `40/48→12px`, `80→20px`.

<a id="v102-2026-03-10"></a>

### v1.0.2 (2026-03-10)

<a id="修复-10"></a>

#### Fixes

- **IM-Fix.2** Removed duplicate `--black-4` layers on the container and background; the default placeholder uses one background layer.

<a id="v101-2026-03-10"></a>

### v1.0.1 (2026-03-10)

<a id="修复-11"></a>

#### Fixes

- **IM-Fix.1** Changed the default placeholder to a single `--black-4` background, removing the overly dark appearance caused by stacked layers.

<a id="v100-2026-03-10"></a>

### v1.0.0 (2026-03-10)

<a id="新功能-2"></a>

#### New features

- **IM-Feat.1** Added `Image` with support for string images and `resource-svelte` image components.
- **IM-Feat.2** Added a default placeholder that displays a `--black-4` background when no asset is supplied.
- **IM-Feat.3** Added positioning protocols for `as="badge"` and `as="icon"` composition.
- **IM-Feat.4** Added `openable` activation with click and Space-key preview opening.

[Component guide](../image.md) · [Full reference](./reference.md)
