# Field changelog

Reviewed against Chinese source SHA-256 `17ae011d35e63d51536928c5eefafa495025c0e8f1f6100b1919320fa629242a`. For version differences, check the installed package as well.

<a id="v143-2026-11-25"></a>

### v1.4.3 (2026-11-25)

- `fieldFocusForward` excludes overlay scrollbars (`.snowui-overlay-scrollbar`) and resize handles (`[data-resize-handle]`), preventing scrollbar or resize-handle release on an embedded `Textarea` from refocusing the control and snapping scroll position back to the caret end.

<a id="v142-2026-11-23"></a>

### v1.4.2 (2026-11-23)

- Aligned the embedded `Textarea` padding override inside default `Field` (with label / without segments) to `0` to match `Input` and `Select`: label-to-content spacing uses `Field` default `var(--gap-2)` (8px), and horizontal/bottom insets (16px / 12px) match standalone unlabeled `Textarea`. `FieldContext` now exposes the outer element and `setWidth` so dragging an embedded `Textarea` resize handle resizes the outer `Field` border.

<a id="v141-2026-10-23"></a>

### v1.4.1 (2026-10-23)

- Do not treat the internal row direction of Input or Select as a full-width Field layout container. Preserve external graphic/control/action column placement while each control keeps its internal single-line owner. Segment layout and label/description stacking are unchanged.

<a id="v140-2026-10-23"></a>

### v1.4.0 (2026-10-23)

- Retain field surfaces, dividers, external regions and continuous segments without overwriting the display, alignment or internal gap of existing single-line content owners.
- Explicit single-line Fields and direct attachments retain at least 4 CSS px. Ordinary multiline content and structural zero gaps are preserved.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

- **Field-Motion.2026-06-18** Added default shake feedback for errors. The entire Field animates when `Field invalid` or an internal host is invalid; consumers need no manual class name or state.
- **Field-Docs.2026-05-25** Archived the historical changelog at the top of the source file. Subsequent changes go in this document’s changelog; the source header retains only responsibilities, current key architecture, and the documentation path.

<a id="v130-2026-07-05"></a>

### v1.3.0 (2026-07-05)

<a id="调整"></a>

#### Changes

- Moved built-in error text for segmented Fields below the continuous input surface, using a normal-flow surface + error layout.
- Field.error now owns the error message in segmented layouts. Internal Input / Select / Textarea hosts declare only invalid and no longer create repeated errors inside each segment.

<a id="v120-2026-07-05"></a>

### v1.2.0 (2026-07-05)

<a id="新功能"></a>

#### New features

- Added the built-in error mode, off by default. It creates the F-02 style <Text as="error"> only when invalid.
- parts.Text configures both built-in label and error. The explicit composition mode is unchanged.

<a id="v110-2026-07-05"></a>

### v1.1.0 (2026-07-05)

<a id="新功能-1"></a>

#### New features

- **FD-BuiltIn.1** Added the built-in label mode, off by default. It accepts a string or Snippet and creates the existing <Text as="label"> styling.
- **FD-BuiltIn.2** Added the parts.Text configuration entry point. Existing explicit <Text as="label"> composition is unchanged.

<a id="v1014-2026-05-06"></a>

### v1.0.14 (2026-05-06)

<a id="修复"></a>

#### Fixes

- **FD-Fix.3** Fixed a later nested-host rule zeroing the padding of a horizontal segmented Field row > Input/Select as="segment" host, causing text in the F-04 two-input example to touch the edge. Direct segment hosts now keep their own 12 / 16 content inset; outer containers still own padding for hosts nested inside a segment container.

<a id="v1013-2026-04-25"></a>

### v1.0.13 (2026-04-25)

<a id="修复-1"></a>

#### Fixes

- **FD-Fix.2** Fixed excessive right spacing for a non-segment Textarea inside Field. The outer Field already supplies 16px of right padding, so the Textarea control no longer adds more right padding; it retains only the bottom resize/footer area.

<a id="v1010-2026-04-02"></a>

### v1.0.10 (2026-04-02)

<a id="调整-1"></a>

#### Changes

- **FD-Doc.1** Updated field composition rules: removed the minimum-height claim, defined the default vertical `label → content` gap as 8px, and clarified that the outer Field controls border, background, corners, and padding for nested Text / Input / Frame / Select / Textarea.
- **FD-Doc.2** Narrowed the divider rule: use dividers only when several input hosts or explicit segments form one continuous field surface. Accessory layouts such as leading + Input + trailing do not use dividers. The Select + trailing example was updated.

<a id="v109-2026-03-24"></a>

### v1.0.9 (2026-03-24)

<a id="修复-2"></a>

#### Fixes

- **FD-Fix.1** When the embedded host is Input, Field no longer applies the generic host layout. The embedded Input keeps its own three-column grid, gap, padding, and number-stepper alignment. When it is Field’s only Input host, the Field root becomes a regular block and the host spans the row, making <Field><Input /></Field> match a standalone <Input /> in right spacing and button size.

<a id="v108-2026-03-16"></a>

### v1.0.8 (2026-03-16)

<a id="新功能-2"></a>

#### New features

- **FD-Layout.9** Added row / column shorthand on the root. Field row and Field column now reuse existing local row / col container rules without an extra Frame wrapper.

<a id="v107-2026-03-16"></a>

### v1.0.7 (2026-03-16)

<a id="新功能-3"></a>

#### New features

- **FD-Layout.8** Added the local col container protocol. Field > Frame as="col" column can now be a vertical composition container within the field, reusing host padding, horizontal dividers, and nested row composition.

<a id="v106-2026-03-16"></a>

### v1.0.6 (2026-03-16)

<a id="调整-2"></a>

#### Changes

- **FD-Layout.7** Matched horizontal dividers between multi-segment Field content to the outer Field border color and thickness, avoiding faint inner dividers in complex layouts.

<a id="v105-2026-03-16"></a>

### v1.0.5 (2026-03-16)

<a id="修复-3"></a>

#### Fixes

- **FD-Layout.6** Button bare in leading / trailing roles now uses an outer margin to keep space from the Field border and is explicitly centered vertically, so the button in the date example does not touch the upper-right corner.

<a id="v104-2026-03-16"></a>

### v1.0.4 (2026-03-16)

<a id="修复-4"></a>

#### Fixes

- **FD-Layout.5** Generic sibling dividers within row no longer apply next to Button bare, preventing a border beside a bare trailing button in complex layouts.

<a id="v103-2026-03-16"></a>

### v1.0.3 (2026-03-16)

<a id="修复-5"></a>

#### Fixes

- **FD-Layout.4** Removed the slot divider when a leading / trailing role is Button bare, preventing extra borders around bare buttons in Field examples.

<a id="v102-2026-03-16"></a>

### v1.0.2 (2026-03-16)

<a id="调整-3"></a>

#### Changes

- **FD-Layout.3** The date trigger no longer depends on an additional behavior prop. Date buttons in complex layouts also use only as="trailing" and must sit in a recognizable local container.

<a id="v101-2026-03-15"></a>

### v1.0.1 (2026-03-15)

<a id="新功能-4"></a>

#### New features

- **FD-Layout.1** Added direct composition: Field > host + trailing can now form a one-row field surface without an extra Frame as="row".
- **FD-Layout.2** Upgraded the Field root to a three-column grid: leading / host / trailing. Any complex child block without a declared role spans the full row by default.

<a id="v100-2026-03-15"></a>

### v1.0.0 (2026-03-15)

<a id="新功能-5"></a>

#### New features

- **FD-Feat.1** Added the form field container component to own the field’s visual surface and compositional layout protocol.

[Component guide](../field.md) · [Full reference](./reference.md)
