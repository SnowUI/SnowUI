# Input changelog

Reviewed against Chinese source SHA-256 `c8f34c6a11acbad5eff4f0d4199ab9ee2ef3f4948859cfd617aac66e40f1ffc6`. For version differences, check the installed package as well.

<a id="v120-2026-10-23"></a>

### v1.2.0 (2026-10-23)

- 2026-10-23: Updated complex accessory icon/label examples to reuse Frame `singleLine` and Text truncation; documentation-only update with host, clear, and selection protocols unchanged.
- Resolve internal single-line graphics/text spacing in both regular and embedded Field hosts. Explicit zero and scaling retain a 4 CSS px floor; date-segment and drawing internals keep their spacing.
- Input provides the actual content state for SearchInput collapse. Clear-button availability still independently respects disabled, readonly and clearable.

<a id="v115-2026-09-27"></a>

### v1.1.5 (2026-09-27)

- 2026-10-05: Date-segment focus and selection backgrounds now use Brand 40%, matching global text and input selections while retaining existing foreground colors and interactions.
- Readonly and disabled inputs no longer enter clear-button takeover state, preventing focus on a readonly input from hiding a custom trailing copy button.
- 2026-09-21: Aligned the usage guide, source Prop table, and Site / AI reading entry. Documentation only; component behavior is unchanged.

<a id="v114-2026-09-12"></a>

### v1.1.4 (2026-09-12)

- Fixed an Input with attachments being vertically high within a fixed height: the single-row Grid uses `align-content: center`, inherited by SearchInput. Default auto height is unchanged.

<a id="v113-2026-08-12"></a>

### v1.1.3 (2026-08-12)

- Corrected the documented standard standalone Input padding to the actual source value, `12px / 16px`; component behavior did not change.

<a id="v112-2026-08-10"></a>

### v1.1.2 (2026-08-10)

- Exposed the Frame-inherited `bind:element` root host reference so specialized hosts such as SearchInput can reuse root sizing without a wrapper or private DOM query.
- The stable width rule for a normal Input's clear + leading layout now withdraws when SearchInput has an empty icon state, avoiding the old hidden-clear gap to the Icon's right. Focus or a value restores the previous layout.

<a id="v111-2026-07-05"></a>

### v1.1.1 (2026-07-05)

<a id="修复"></a>

#### Fixes

- Fixed a valued Input changing width in a shrink-to-fit host when focus reveals the clear X.
- The built-in clear X shares a grid column with the control, so showing it adds no track. Existing text fade and clear-button overlay remain.

<a id="v110-2026-07-05"></a>

### v1.1.0 (2026-07-05)

<a id="新功能"></a>

#### New features

- Added an `error` built-in mode, off by default. Only when invalid does it show `<Text as="error">` with red 12px/16px styling and an 8px gap.
- Added `parts.Text`; explicit `<Text as="error">` mode is unchanged.

<a id="v1044-2026-05-09"></a>

### v1.0.44 (2026-05-09)

- Font size and line height on the inner control now inherit settings from outer `.snowui-input`. An outer utility such as `class="text-18"` scales placeholder and input text together. `--snowui-input-font-size-override` and `--snowui-input-line-height-override` remain consumed by the outer element.

- **v1.0.36**: Default `type="color"` display now matches Figma's color dot + # + HEX layer; the color value updates with the native color picker.
- **v1.0.35**: `readonly` now consistently uses a non-editable appearance. Standalone and `Field` container modes both use a `Background/2` background and no border.

<a id="v1043-2026-05-09"></a>

### v1.0.43 (2026-05-09)

<a id="调整"></a>

#### Changes

- **INP-Overlay.1** Extended search-input styles in Listbox / QuickAction into shared overlay-search rules covering SearchInput inside SearchPopup, and consistently removed the outward focus ring.

<a id="v1042-2026-04-25"></a>

### v1.0.42 (2026-04-25)

<a id="修复-1"></a>

#### Fixes

- **INP-Fix.8** Fixed an extra `8px` of space at the right of a valued standalone `Input` when not hovered. With only the built-in clear button, the hidden state no longer reserves a grid gap; the button-column gap returns when hover reveals X.

<a id="v1040-2026-04-02"></a>

### v1.0.40 (2026-04-02)

<a id="调整-1"></a>

#### Changes

- **INP-Doc.1** Documented the host rule when `Input` is inside `Field`: outer Field controls padding, border, background, radius, and `label` spacing; Input becomes the input host.
- **INP-Doc.2** Updated recommended `leading / trailing` composition: simple accessory layouts use `Field > leading + Input + trailing` directly; this is not a segmented input with dividers.

<a id="v1036-2026-03-25"></a>

### v1.0.36 (2026-03-25)

<a id="样式"></a>

#### Styles

- **INP-Style.5** Upgraded the default `type="color"` display to Figma's color dot + # + HEX structure. The dot and HEX text share Input's default 14 / 20 typography, 8 gap, and 12/16 padding.

<a id="交互"></a>

#### Interactions

- **INP-Interaction.1** Retained a hidden native `<input type="color">` as the real host for form ownership, focus, keyboard interaction, and `bind:value`; the visible layer handles appearance only.

<a id="v1035-2026-03-19"></a>

### v1.0.35 (2026-03-19)

<a id="样式-1"></a>

#### Styles

- **INP-Style.4** Unified the `readonly` non-editable appearance: standalone and `Field` container modes both use a `Background/2` background without the default border.

<a id="v1034-2026-03-19"></a>

### v1.0.34 (2026-03-19)

<a id="修复-2"></a>

#### Fixes

- **INP-Fix.7** Strengthened the browser fallback for hiding native `type="number"` steppers with `opacity: 0` and `pointer-events: none`, and explicitly set the host input appearance to `textfield` so native steppers do not reappear in Playground.

<a id="v1033-2026-03-19"></a>

### v1.0.33 (2026-03-19)

<a id="重构"></a>

#### Refactoring

- **INP-Refactor.7** Aligned `enableResponsive=true` with the component guideline default and passed all three Frame capability switches explicitly, keeping code and standards checks consistent.

<a id="样式-2"></a>

#### Styles

- **INP-Style.3** Consolidated stepper selectors under `:global(:where())`, removed forced specificity, added theme Token fallbacks, and moved component geometry styles into the `--snowui-input-*` namespace.

<a id="v1031-2026-03-16"></a>

### v1.0.31 (2026-03-16)

<a id="重构-1"></a>

#### Refactoring

- **INP-Refactor.6** A historical custom visible editing layer aligned selection appearance for ordinary text, input text, and date segments. Currently only `date` retains custom `year/month/day` segment editing; `text` has returned to native `<input>`.

<a id="v1030-2026-03-16"></a>

### v1.0.30 (2026-03-16)

<a id="调整-2"></a>

#### Changes

- **INP-Adjust.8** Corrected the Chrome date-segment highlight: removed ineffective `::-webkit-datetime-edit-*::selection` and ordinary input `::selection` approaches, and applied shared `Black/4% + Black/100% + 8px` highlight variables to focused `year/month/day-field` segments.

<a id="v1029-2026-03-16"></a>

### v1.0.29 (2026-03-16)

<a id="调整-3"></a>

#### Changes

- **INP-Adjust.7** Unified field text selection: `layout.css` adds shared selection variables for the field-bordered utility with a `Black/4%` background, `Black/100%` text, and `8px` radius. `Input.svelte` gives private date `year/month/day` pseudo-elements matching `::selection` styles.

<a id="v1028-2026-03-16"></a>

### v1.0.28 (2026-03-16)

<a id="修复-3"></a>

#### Fixes

- **INP-Fix.6** Added `Black/20%` text color to the normal input itself under `:placeholder-shown`, following the successful empty-date fix so placeholders do not appear as body text when the browser misses `::placeholder`.

<a id="v1027-2026-03-16"></a>

### v1.0.27 (2026-03-16)

<a id="修复-4"></a>

#### Fixes

- **IN-Date.8** Applied the successful placeholder fix to empty `date input` text itself, setting it to `Black/20%` rather than relying solely on internal browser field pseudo-elements.

<a id="v1026-2026-03-16"></a>

### v1.0.26 (2026-03-16)

<a id="修复-5"></a>

#### Fixes

- **IN-Date.7** Empty `type="date"` now also renders internal browser date placeholder text in `Black/20%`, matching ordinary placeholders.

<a id="v1025-2026-03-16"></a>

### v1.0.25 (2026-03-16)

<a id="修复-6"></a>

#### Fixes

- **IN-Date.6** Without a custom trailing button, `type="date"` restores native browser appearance and its default date icon. Only detection of `Button as="trailing"` switches to the custom hiding path.

<a id="v1024-2026-03-16"></a>

### v1.0.24 (2026-03-16)

<a id="修复-7"></a>

#### Fixes

- **IN-Date.5** Restored the `::-webkit-calendar-picker-indicator` hiding branch. Together with the host's right-side mask, it forms the date-icon fix; removing either branch makes the default icon reappear in some browsers.

<a id="v1023-2026-03-16"></a>

### v1.0.23 (2026-03-16)

<a id="清理"></a>

#### Cleanup

- **IN-Date.5 rollback** The previous release incorrectly judged `::-webkit-calendar-picker-indicator` ineffective; regression testing showed it remained necessary, so v1.0.24 restored it.

<a id="v1022-2026-03-16"></a>

### v1.0.22 (2026-03-16)

<a id="修复-8"></a>

#### Fixes

- **IN-Date.4** Date input hides the native calendar icon with two safeguards: first hide `::-webkit-calendar-picker-indicator`, then cover the default icon area with a right-side host mask where a browser ignores that hiding rule.

<a id="v1021-2026-03-16"></a>

### v1.0.21 (2026-03-16)

<a id="修复-9"></a>

#### Fixes

- **IN-Date.3** Input runtime now detects a direct trailing Button inside the same local container as the date trigger and writes `data-has-date-trigger` on itself, avoiding misses from a complex structural selector.

<a id="v1020-2026-03-16"></a>

### v1.0.20 (2026-03-16)

<a id="调整-4"></a>

#### Changes

- **IN-Date.2** Removed the `control="date-picker"` dependency. A custom date trigger is again detected automatically as `Button as="trailing"` in the local container.

<a id="v1019-2026-03-15"></a>

### v1.0.19 (2026-03-15)

<a id="新功能-1"></a>

#### New features

- **IN-Date.1** Added a custom date-trigger bridge: when a Button within `Field / row / local container` is bound as the date-picker trigger, `Input type="date"` hides the native icon and delegates interaction to that external composed Button.

<a id="v1018-2026-03-15"></a>

### v1.0.18 (2026-03-15)

<a id="重构-2"></a>

#### Refactoring

- **INP-Refactor.1** Returned default input borders to `.snowui-field-bordered` in `layout.css`: base `Black/20%`, focus `Black/40% + Black/4% ring`; only input-specific states such as `invalid / disabled / readonly` remain in the component.
- **INP-Fix.1** Split placeholder pseudo-element selectors into separate standard, WebKit, Mozilla, and MS rules to render `Black/20%` reliably.
- **INP-Refactor.2** Prioritized the component's role as a field host and recommended composition with `Field.svelte`; in a Field context, it renders only an unwrapped input host.

<a id="v1017-2026-03-14"></a>

### v1.0.17 (2026-03-14)

<a id="重构-3"></a>

#### Refactoring

- **INP-Refactor.5** Restored default Input focus variables to the shared field-bordered utility: focus now uses a `Black/40%` inner border and `Black/4%` outer 4px ring.

<a id="v1016-2026-03-14"></a>

### v1.0.16 (2026-03-14)

<a id="修复-10"></a>

#### Fixes

- **INP-Fix.5** Finalized placeholder repair by splitting standard and browser-private pseudo-element selectors and setting `color / -webkit-text-fill-color / opacity` separately to consistently render `Black/20%`.

<a id="v109-2026-03-14"></a>

### v1.0.9 (2026-03-14)

<a id="清理-1"></a>

#### Cleanup

- **INP-Cleanup.1** Removed the placeholder overlay, focus visibility state, and special cursor fallback added for a pointer issue; returned to minimal native `<input>` plus the field-bordered utility.

<a id="v103-2026-03-14"></a>

### v1.0.3 (2026-03-14)

<a id="重构-4"></a>

#### Refactoring

- **INP-Refactor.2** Extracted field-host bridging into `../logic/frame-field-control.ts` to handle `value/defaultValue`, `invalid/aria-invalid`, and the value synchronization exemption for `input[type="file"]` consistently.
- **INP-Refactor.3** Removed duplicate default hover/focus rules from the component and used shared `.snowui-field-bordered` behavior directly; removed the redundant `data-disabled` marker chain.

<a id="v104-2026-03-14"></a>

### v1.0.4 (2026-03-14)

<a id="重构-5"></a>

#### Refactoring

- **INP-Refactor.4** Default Input border, hover, focus, and text cursor now bridge through `.snowui-field-bordered` variables in `layout.css`, aligning baseline interaction across input components.

<a id="v102-2026-03-14"></a>

### v1.0.2 (2026-03-14)

<a id="重构-6"></a>

#### Refactoring

- **INP-Refactor.1** Replaced the inline `Frame prop` allowlist with the shared prop distributor in `../logic/frame-prop-filter.ts`, avoiding duplicated maintenance of Frame's DOM filtering.

<a id="v101-2026-03-14"></a>

### v1.0.1 (2026-03-14)

<a id="样式-3"></a>

#### Styles

- **INP-Style.1** Updated Input defaults from Figma: 14 font size, 12/16 padding, 8 gap, 16 radius, a 0.5px `Black/20%` inner border, and `Background/3` background.
- **INP-Style.2** Set the default minimum height to a derived `44px` and synchronized Skeleton height and focus appearance.

<a id="v100-2026-03-13"></a>

### v1.0.0 (2026-03-13)

<a id="新功能-2"></a>

#### New features

- **INP-Feat.1** Added a Frame-based single-line input with passthrough native `<input>` attributes, `bind:value`, Skeleton, and responsive behavior.
- **INP-Feat.2** Added baseline style paths for invalid / readonly / file / datalist and restricted `Input` to the atomic input control itself.

[Component guide](../input.md) · [Full reference](./reference.md)
