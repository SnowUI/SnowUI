# Frame changelog

Reviewed against Chinese source SHA-256 `b9ef9f6a681e5af6bd4b366f2a0ed6ff161187bab001886f5554a520d8a4a178`. For version differences, check the installed package as well.

<a id="v510-2026-10-22"></a>

### v5.1.0 (2026-10-22)

- Added the explicit `singleLine` composition preset while preserving ordinary wrapping, `firstLine` multiline prose alignment, and `Text` truncation ownership.

<a id="v501-2026-10-18"></a>

### v5.0.1 (2026-10-18)

- Event wrappers now read disabled and loading state from stable sources. This fixes the development warning caused when the same event continued bubbling after a Frame was synchronously unmounted, while preserving blocking when a capture handler changes state during that event.

<a id="v500-2026-10-09"></a>

### v5.0.0 (2026-10-09)

- Consolidated the implementation into a single Frame component while retaining its basic host and cross-component coordination capabilities. The public API, documentation, Test, and Site now use the same entry point.

<a id="v4x-v3x-演进摘要"></a>

### v4.x - v3.x evolution summary

- **v3.8.7**: `control / border / appear` motion timing bridge variables are now emitted on demand without injecting redundant inline variables into the DOM when unconfigured.
- **v3.8.0**: `loading` became the unified loading state entry, `whileLoad` returned to pure loading-motion configuration, and `skeleton` independently controls skeleton rendering.
- **v3.6.0**: Migrated motion primitives and presets to `components/src/motion/`, adding `enableDefaultMotion` and `stateContent` cross-fade support.
- **v3.5.0**: Moved text truncation (`lines` / `onTruncate`) from `Frame` to `Text`.
- **v3.2.0**: Added `height / width / mixed / aspect` basis modes and runtime CSS variable output for `Scale`.
- **v1.3.0**: Decoupled CSS behavioral helpers from `FrameProps` into shared `.snowui-hoverable` / `.snowui-field-bordered` classes and added `scope` and `access` context boundaries.

[Component guide](../frame.md) · [Full reference](./reference.md)
