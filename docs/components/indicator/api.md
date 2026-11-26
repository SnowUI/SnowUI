# Indicator API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `axis` | `IndicatorAxis` | width for line; both for corner | Resize the host width, height, or both. both is available only with corner appearance. |
| `edge` | `IndicatorEdge` | Derived from axis | Drag direction and default placement edge. |
| `appearance` | `IndicatorAppearance` | "line" | Line handle or lower-right corner icon. |
| `hitAreaPadding` | `number \| string` | — | Legacy input retained for compatibility; it no longer narrows the hit area. line always covers the full edge. |
| `target` | `HTMLElement` | Direct parent element | Element to resize. It may be any page element; Indicator need not be its DOM descendant. |
| `revealTarget` | `HTMLElement` | target | Host whose hover state controls handle visibility. |
| `value` | `number` | Measured target size | Current controlled size baseline, also reflected as the ARIA current value. |
| `minSize` | `number` | 0 | Minimum size in pixels along the active resize axis. |
| `maxSize` | `number` | Infinity | Maximum size in pixels along the active resize axis. |
| `minWidth` | `number` | — | Minimum width for width or both, taking precedence over minSize. |
| `maxWidth` | `number` | — | Maximum width for width or both, taking precedence over maxSize. |
| `minHeight` | `number` | — | Minimum height for height or both, taking precedence over minSize. |
| `maxHeight` | `number` | — | Maximum height for height or both, taking precedence over maxSize. |
| `step` | `number` | 8 | Pixels adjusted by each arrow-key press. |
| `largeStep` | `number` | 32 | Pixels adjusted by each arrow-key press while Shift is held. |
| `applySize` | `boolean` | true | Write width or height directly to target. |
| `disabled` | `boolean` | false | Disable pointer and keyboard resizing. |
| `ariaLabel` | `string` | LocaleProvider | Accessible handle name. Defaults according to axis and LocaleProvider. |
| `onResizeStart` | `(value: number, axis: "width" \| "height") => void` | — | Callback when resizing starts. |
| `onSizeChange` | `(value: number, axis: "width" \| "height") => void` | — | Callback when the size changes. |
| `onResizeEnd` | `(value: number, axis: "width" \| "height") => void` | — | Callback when resizing ends. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
