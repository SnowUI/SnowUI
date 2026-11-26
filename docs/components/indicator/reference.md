# Indicator full reference

Reviewed against Chinese source SHA-256 `429d0af2eb39a9eb6073688d43ea4302577ecc02eed9bcf836c6ebf5c7babda9`.

<a id="indicator"></a>

# Indicator

<a id="组件介绍"></a>

## Overview

A draggable resize handle for panels and content areas, operable with a pointer or keyboard.

<a id="使用选择"></a>

## When to use it

Use Indicator for a component’s public visual indicator or drag-resize behavior. In application pages, first use Sidebar, SidePanel, or table columns that already provide it rather than copying their drag logic.

- `target` defaults to the direct parent but can refer to any other element. `minSize` / `maxSize` constrain the size.
- `applySize` controls whether Indicator writes the size directly; `onSizeChange` reports updates. Use `step` / `largeStep` for keyboard increments.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Button, Frame, Indicator, Text } from '@snowui-design-system/components';
	let width = $state(280);
</script>

<Frame style="position: relative; box-sizing: border-box; width: 280px; max-width: 100%; min-height: 120px; padding: var(--padding-6); border-radius: var(--radius-4); background: var(--background-1);"><Text>SnowUI documentation preview</Text><Indicator axis="width" minWidth={200} maxWidth={520} onSizeChange={(next) => width = next} ariaLabel="Resize documentation preview" /></Frame>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| axis | `IndicatorAxis` | `"width"` for line; `"both"` for corner | Resize host width, height, or both. `both` is available only for `corner`. |
| edge | `IndicatorEdge` | `Derived from axis` | Drag direction and default positioning edge |
| appearance | `IndicatorAppearance` | `"line"` | Line or icon visual in the lower right corner |
| hitAreaPadding | `number \| string` | — | Accepted for compatibility, but no longer narrows the hit area; a line always spans its entire edge. |
| target | `HTMLElement` | `Direct parent element` | Resize target. It can be any element on the page; Indicator need not be its DOM descendant. |
| revealTarget | `HTMLElement` | `target` | Hover host controlling visibility |
| value | `number` | `Measured target size` | Baseline for the currently controlled size, also exposed as the current ARIA value. |
| minSize | `number` | `0` | The minimum size allowed by the current adjustment axis is px. |
| maxSize | `number` | `Infinity` | The maximum size allowed by the current adjustment axis is px. |
| minWidth | `number` | — | The lower limit of the width of width / both takes precedence over minSize. |
| maxWidth | `number` | — | The upper limit of width / both takes precedence over maxSize. |
| minHeight | `number` | — | The lower height limit of height / both takes precedence over minSize. |
| maxHeight | `number` | — | The upper limit of height / both takes precedence over maxSize. |
| step | `number` | `8` | The number of pixels adjusted by the arrow keys each time. |
| largeStep | `number` | `32` | The number of pixels adjusted each time the arrow key is adjusted when holding down Shift. |
| applySize | `boolean` | `true` | Whether to write width / height directly to `target`. |
| disabled | `boolean` | `false` | Disable pointer and keyboard resizing. |
| ariaLabel | `string` | `LocaleProvider` | Accessible name; defaults follow `axis` and LocaleProvider. In English: Resize width / Resize height / Resize width and height. |
| onResizeStart | `(value: number, axis: "width" \| "height") => void` | — | Resize-start callback |
| onSizeChange | `(value: number, axis: "width" \| "height") => void` | — | Size-change callback |
| onResizeEnd | `(value: number, axis: "width" \| "height") => void` | — | Resize-end callback |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="api-参考"></a>

<a id="api-参考-1"></a>

### API reference

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `pinOffset` | `number \| string` | `var(--padding-1)` | Distance between the visible line’s outer edge and the host’s physical edge. The handle grows inward on hover, focus, and drag, keeping that gap. `corner` retains Pin corner-offset semantics. |
| `enableResponsive` | `boolean` | `false` | Enable the root Frame responsive ability; turn it off by default to maintain the geometry of the handle. |
| `enableContext` | `boolean` | `false` | Whether to provide Frame general context to sub-content. |
| `enableScaleObserver` | `boolean` | `false` | Whether to enable root Frame size observation; no new observation is added by default. |
| `enableDefaultMotion` | `boolean` | `true` | Enable the Frame default interaction effect; the handle color is still reused to share the color effect. |
| `...rest` | `FrameProps` | - | Forwarded to the root Frame. |

<a id="视觉状态"></a>

<a id="视觉状态-1"></a>

### Visual state

- Colors match the overlay scrollbar thumb: `Black/10` by default and `Black/20` on hover, focus, or drag.
- Line + width: the hit band spans the parent’s full height and extends `pinOffset + 8px` from the edge (`top/bottom: 0`). The visible handle is 2px × **16px**, growing to 4px wide on hover, focus, or drag. Override its length along the edge with `--snowui-indicator-visual-length`.
- Line + height: the hit band spans the parent’s full width and extends `pinOffset + 8px` from the edge (`left/right: 0`). The visible handle is **16px** × 2px, growing to 4px high on hover, focus, or drag. The same variable controls length along the edge.
- Line and Scrollbar are consistent with the actual width / height change instead of transform scaling, using `var(--radius-full, 9999px)`, and the endpoint is always a complete capsule rounded corner.
- Corner: use 1rem visual box and reuse rounded-corner through ComponentIcon; the ratio of graphics and outer frame shall be subject to raw-assets/icons/snowui/RoundedCorner.svg. It is Black/10 when displayed, and Black/20 when hovering / focus-visible / dragging; keep the original path and viewBox, and draw along the outline according to the special case of the indicator confirmed by the user: normal total stroke 2px, hover / focus / dragging total stroke 4px, do not scale the outer frame.
- Corner is fixed in the lower right corner and only activated near the corner point; the default is `axis="both"`, and the width and height are adjusted at the same time.
- Corner uses `nwse-resize` diagonal double arrow by default; use the corresponding direction cursor when explicitly setting the single axis.
- Positioning: `line` absolutely positions itself against the edge without centering via `pin`; `corner` defaults to `as="pin-bottom-right"`, `pinOffset="var(--padding-1)"`, and `z-index: 6`.
- Hidden by default; shown on host hover, focus-visible, or dragging. When it overlaps a visible overlay scrollbar thumb in the same target, it is hidden and removed from pointer and keyboard hit testing.
- The visual handle and hit area are separate layers; a line hit band spans the full edge height or width.
- Motion uses the same Frame color motion bridge as the overlay scrollbar.

<a id="示例"></a>

<a id="示例-1"></a>

### Examples

```svelte
<Frame style="position: relative; width: 16rem; height: 10rem;">
    Content
    <Indicator axis="width" />
</Frame>
```

```svelte
<script lang="ts">
  import { Frame, Indicator } from '@snowui-design-system/components';
  let panel = $state<HTMLElement>();
</script>

<Frame bind:element={panel} style="position: relative;">
    Content
    <Indicator
        target={panel}
        axis="height"
        appearance="corner"
        minSize={60}
    />
</Frame>
```

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
