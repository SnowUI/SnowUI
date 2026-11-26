# Radio changelog

Reviewed against Chinese source SHA-256 `ca50587a314bb48e185efa1f243ef70558758154d5579bb9e398c158517568f5`. For version differences, check the installed package as well.

<a id="v140-2026-10-23"></a>

### v1.4.0 (2026-10-23)

- Labels use the shared single-line preset while preserving their original snippet. Constrained labels can shrink; complex multiline content can explicitly opt out. Shared gap resolution retains at least 4 CSS px for zero or font/gap scaling and preserves larger preferred gaps, control geometry and transparent inset proportions.
- Keep the existing deselection behavior without canceling the native click state commit. Fixes a canceled bound value leaving the native input checked. Space still prevents duplicate browser activation.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- **Radio-Docs.2026-05-25** Archived the historical changelog at the top of the source file. Subsequent changes go in this document’s changelog; the source header retains only responsibilities, current key architecture, and the documentation path.

<a id="v1317-2026-08-20"></a>

### v1.3.17 (2026-08-20)

- **RD-Hover.5** Filled selected hover adds `20%` Static White only to the thick black selected ring; the center white hole is unchanged. Outline selected hover mixes the Dot with `20%` Static White over primary color and adds another `20%` black to the base outer ring.

<a id="v1316-2026-08-20"></a>

### v1.3.16 (2026-08-20)

- **RD-Hover.4** By user decision, raised the unchecked-border hover overlay from `4%` to `20%` black. The base border remains one `20%` black layer, yielding roughly `36%` black when combined; fill is unchanged. This value and separate overlay are registered as a scoped `StyleSpec §2.4.3` exception.

<a id="v1315-2026-08-20"></a>

### v1.3.15 (2026-08-20)

- **RD-Hover.3** Hover now uses a separate overlay above the base border and selected ring. This avoids flicker from interpolating a translucent `box-shadow` and no longer rewrites the selected ring color after a click.
- **RD-Ring.1** The unchecked state draws only one `20%` black base border. The separate selected ring starts at zero width and expands over `150ms` only when Filled is selected, avoiding stacked base borders.

<a id="v1314-2026-08-20"></a>

### v1.3.14 (2026-08-20)

- **RD-Hover.2** Unchecked hover keeps fill unchanged and layers `4%` primary over the base `20%` black border, using the same border-darkening rule as Checkbox.

<a id="v1313-2026-08-20"></a>

### v1.3.13 (2026-08-20)

- **RD-Hover.1** Hover color covers fill, base inset border, and the Filled selected ring. Selected and unselected states each use their existing hover fill color across the whole visual surface.

<a id="v1312-2026-08-20"></a>

### v1.3.12 (2026-08-20)

- **RD-Size.1** Clarified that `size` is the outer visual dimension including the inset border, and fixed this boundary with `border-box`.
- **RD-Motion.1** Dot, base border, and Filled selected ring now use the same `150ms ease-out` as ordinary Checkbox states instead of the old 300ms default.

<a id="v1311-2026-08-20"></a>

### v1.3.11 (2026-08-20)

- **RD-Scale.1** The unchecked border scales proportionally by `size × 0.0625` from the Workshop `14756:16934` baseline of 32px / 2px. The public border-width override still wins; Filled ring structure and animation are unchanged.

<a id="v1310-2026-04-28"></a>

### v1.3.10 (2026-04-28)

<a id="调整"></a>

#### Changes

- **RD-Layout.1** Registered Radio as an inline-shell layout under `LayoutProtocol.md`, documented the visual + label boundary, and consolidated gap through `--snowui-radio-gap` / `--snowui-radio-gap-override`.

<a id="v139-2026-03-10"></a>

### v1.3.9 (2026-03-10)

<a id="调整-1"></a>

#### Changes

- **RD-Adjust.8** Reversed the experiment with a single border becoming thicker directly, restoring a persistent thin border plus a separate selected-ring layer. This preserves the previous border structure and animation path.

<a id="v138-2026-03-10"></a>

### v1.3.8 (2026-03-10)

<a id="调整-2"></a>

#### Changes

- **RD-Adjust.7** Experimented with a single Filled border thickening/thinning directly and removing the separate selected-ring layer. This approach was later reversed.

<a id="v137-2026-03-10"></a>

### v1.3.7 (2026-03-10)

<a id="调整-3"></a>

#### Changes

- **RD-Adjust.6** The Filled selected ring no longer approximates thickness change through scale + fade. A persistent selected-ring layer now transitions border width and color directly, restoring a real thickness animation without a layer-switch discontinuity at the end.

<a id="v136-2026-03-10"></a>

### v1.3.6 (2026-03-10)

<a id="调整-4"></a>

#### Changes

- **RD-Adjust.5** Changed the Filled selected ring from opacity-only fade to scale + fade to restore the appearance of a thick-to-thin border while still avoiding flicker from inset-width interpolation at small sizes.

<a id="v135-2026-03-10"></a>

### v1.3.5 (2026-03-10)

<a id="修复"></a>

#### Fixes

- **RD-Fix.16** On deselection at small sizes, Filled no longer interpolates thick inset-border width. A stable thin border persists while the separate thick selected ring changes only opacity, avoiding a sudden drop to the unselected appearance near the end.

<a id="v134-2026-03-10"></a>

### v1.3.4 (2026-03-10)

<a id="修复-1"></a>

#### Fixes

- **RD-Fix.15** During deselection in the default Filled variant, the thin border remains and the thick selected border retracts as a separate inner layer, avoiding a sudden switch to the unselected visual at a particular width.

<a id="v133-2026-03-10"></a>

### v1.3.3 (2026-03-10)

<a id="修复-2"></a>

#### Fixes

- **RD-Fix.14** Unchecked hover in the default Filled variant stopped using a separate overlay layer. Border and background variables now transition directly on `.snowui-radio-visual`, removing a flash of a new layer after the thick ring retracts.

<a id="v132-2026-03-10"></a>

### v1.3.2 (2026-03-10)

<a id="修复-3"></a>

#### Fixes

- **RD-Fix.13** Restored unchecked hover in the default Filled variant to a persistent 0% overlay baseline; hover changes only its opacity, further reducing flicker on checked → unchecked.

<a id="v131-2026-03-10"></a>

### v1.3.1 (2026-03-10)

<a id="修复-4"></a>

#### Fixes

- **RD-Fix.12** Added a `background-color` transition to the visual layer during deselection, preventing the hover background from jumping instantly on checked → unchecked.

<a id="v130-2026-03-10"></a>

### v1.3.0 (2026-03-10)

<a id="新功能"></a>

#### New features

- **RD-Behavior.1** Radio can now be deselected by clicking its currently selected option. Keyboard `Space` follows the same behavior.
- **RD-Behavior.2** When using `bind:group`, deselecting the current item clears `group` to `undefined` while keeping subsequent group updates working.
- **RD-Fix.11** Removed `cursor: default` from the checked state because the selection can now be cancelled.

<a id="v1215-2026-03-10"></a>

### v1.2.15 (2026-03-10)

<a id="新功能-1"></a>

#### New features

- **RD-Role.1** Added Radio’s `as="badge"` role for composition as a top-right badge in an Image host.

<a id="v1214-2026-03-06"></a>

### v1.2.14 (2026-03-06)

<a id="调整-5"></a>

#### Changes

- **RD-Bridge.1** Radio Dot and Filled ring transitions now consume Frame’s shared timing bridge variables. The component defines only final ring thickness, not an independent default duration or easing.

<a id="v1213-2026-02-23"></a>

### v1.2.13 (2026-02-23)

<a id="修复-5"></a>

#### Fixes

- **RD-Fix.10** Fixed checked cursor semantics: the selected item emits `data-checked="true"` and sets `cursor: default` at component level to avoid a misleading pointer on hover.

<a id="v1212-2026-02-18"></a>

### v1.2.12 (2026-02-18)

<a id="修复-6"></a>

#### Fixes

- **RD-Fix.9** Fixed hover flicker with the previous stable strategy: unchecked hover changes only the mixed background, not the border.
- **RD-Adj.4** Preserved the default Filled active-state border-thickening transition, applying the border animation only when checked.

<a id="v1211-2026-02-18"></a>

### v1.2.11 (2026-02-18)

<a id="修复-7"></a>

#### Fixes

- **RD-Fix.8** Further fixed hover flicker by removing the visual `background-image` overlay chain and mixing colors through `background-color` directly.

<a id="v1210-2026-02-18"></a>

### v1.2.10 (2026-02-18)

<a id="修复-8"></a>

#### Fixes

- **RD-Fix.7** Fixed hover flicker by changing state and hover selectors from `:has(...)` to the sibling chain (`input + visual`).

<a id="v129-2026-02-18"></a>

### v1.2.9 (2026-02-18)

<a id="修复-9"></a>

#### Fixes

- **RD-Fix.6** Fixed missing active animation in the default Filled variant by adding a smooth transition for its thicker selected border.
- **RD-Adj.3** Aligned animation duration and easing with Checkbox/Switch (`0.2s` and `cubic-bezier(0.4, 0, 0.2, 1)`).

<a id="v128-2026-02-18"></a>

### v1.2.8 (2026-02-18)

<a id="调整-6"></a>

#### Changes

- **RD-Adj.2** Changed the default color chain to primary: without a color class, the active state uses `--primary`, matching Filled Button behavior.

<a id="v127-2026-02-18"></a>

### v1.2.7 (2026-02-18)

<a id="修复-10"></a>

#### Fixes

- **RD-Fix.5** Further fixed hover flicker by removing visual-layer color transitions that jittered during interpolation.

<a id="v126-2026-02-18"></a>

### v1.2.6 (2026-02-18)

<a id="修复-11"></a>

#### Fixes

- **RD-Fix.4** Fixed disappearing flicker on hover entry and exit by keeping a fixed gradient overlay and changing opacity through a variable rather than swapping `background-image`.

<a id="v125-2026-02-18"></a>

### v1.2.5 (2026-02-18)

<a id="修复-12"></a>

#### Fixes

- **RD-Fix.3** Fixed hover flicker with a persistent 0% overlay baseline on the visual; hover changes only overlay strength. Transitioned properties were narrowed to avoid repaint jitter.

<a id="v124-2026-02-18"></a>

### v1.2.4 (2026-02-18)

<a id="调整-7"></a>

#### Changes

- **RD-Color.1** Unified component color under the `currentColor` chain so `class="text-*"` can override the entire component.
- **RD-Color.2** Replaced gray-scale layers with same-color alpha layers (20%/40%) for one color system across active and inactive states.

<a id="v123-2026-02-18"></a>

### v1.2.3 (2026-02-18)

<a id="调整-8"></a>

#### Changes

- **RD-Adj.1** Changed the default `variant` from `outline` to `filled`.

<a id="v122-2026-02-18"></a>

### v1.2.2 (2026-02-18)

<a id="优化"></a>

#### Improvements

- **RD-Opt.1** Aligned the size scale with Icon: `16/20/24/28/32/40/48/80`.
- **RD-Opt.2** Rewrote the size chain with `--size-*` Tokens and completed the `override -> internal -> token` variable bridge.

<a id="v121-2026-02-18"></a>

### v1.2.1 (2026-02-18)

<a id="修复-13"></a>

#### Fixes

- **RD-Fix.2** Removed the component’s `cursor: pointer`. Disabled cursor behavior now uses the shared Frame `Surface` + `.snowui-disabled` chain.

<a id="v120-2026-02-03"></a>

### v1.2.0 (2026-02-03)

<a id="修复-14"></a>

#### Fixes

- **RD-Fix.1** Completed explicit Frame capability-switch forwarding and aligned internal variable names with project conventions.

---

---

[Component guide](../radio.md) · [Full reference](./reference.md)
