# Indicator changelog

Reviewed against Chinese source SHA-256 `5a25c8c54fee9397a477ac0563765ed561b45cc6580b8f4300e7535ade1f0829`. For version differences, check the installed package as well.

<a id="v140-2026-09-28"></a>

### v1.4.0 (2026-09-28)

- The line variant now uses the whole edge as its hit area; the old hitAreaPadding no longer narrows it. The corner variant still has a local corner hit area and resizes along both axes by default.
- The corner and line variants now share Black/10 → Black/20 color and 2px → 4px size states. The source asset path and outer frame do not scale.

- 2026-09-21: Unified the usage guide, source property table, and Site / AI reading entry points. Documentation only; component behavior is unchanged.

<a id="v130-2026-09-15"></a>

### v1.3.0 (2026-09-15)

- Resize now takes priority as requested; scrollbar overlap detection and its observers were removed. The scrollbar-priority rules described in older versions below have been superseded.

<a id="v121-2026-08-16"></a>

### v1.2.1 (2026-08-16)

- Moved ownership of the default Black/10 and interactive Black/20 colors to the actual visual layer, preventing `color: inherit` on the Frame root from overriding handle colors due to style load order.
- The existing `--snowui-indicator-color-override` and `--snowui-indicator-active-color-override` remain available.

<a id="v120-2026-07-28"></a>

### v1.2.0 (2026-07-28)

- Hovering anywhere in the reveal host continues to show the Indicator.
- Overlap detection changed from the entire scrollbar track to the actual Thumb, and now responds to ScrollArea hover, scrolling, Thumb dragging, and opacity transitions.
- When the Indicator overlaps a visible Thumb, it leaves pointer, hover, drag, and keyboard hit testing entirely, giving the scrollbar sole interaction priority.

<a id="v110-2026-07-28"></a>

### v1.1.0 (2026-07-28)

- Added `hitAreaPadding` to the line variant so consumers could narrow the full-edge hit band to an area around the visible bar.
- The Indicator automatically hid and stopped intercepting the pointer when it overlapped a visible SnowUI overlay scrollbar within the same resize target.

<a id="v101-2026-07-12"></a>

### v1.0.1 (2026-07-12)

- The line hit band now fills the full height (width control) or width (height control) of its edge by default. It uses absolute positioning against top/bottom or left/right instead of centered pin positioning; the short visual bar is separate from the hit band.

<a id="v100-2026-06-21"></a>

### v1.0.0 (2026-06-21)

- Merged WidthIndicator, HeightIndicator, and ResizeHandle.
- Added host-hover reveal, line / corner visuals, and complete pointer, keyboard, and ARIA behavior.

[Component guide](../indicator.md) · [Full reference](./reference.md)
