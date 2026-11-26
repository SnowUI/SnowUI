# Skeleton API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `SkeletonVariant` | — | Explicit skeleton shape. Aliases normalize to line, circle, or rect. |
| `width` | `string \| number` | — | Explicit width. Numeric values are converted to rem automatically. |
| `height` | `string \| number` | — | Explicit height. Numeric values are converted to rem automatically. |
| `componentClass` | `string` | — | Compatibility entry for older callers. Matches historic default layouts only when renderHints is absent. New components must not register through it. |
| `renderHints` | `FrameRenderHints` | — | Component registration protocol supporting variant, width, height, radius, and rows. |
| `loading` | `boolean` | true | Whether to show the skeleton. false reveals children; group mode preserves their mounted state. |
| `group` | `boolean` | false | Keep children mounted and represent the entire region with one loading surface. |
| `responsive` | `ResponsiveConfig` | — | Responsive width and height overrides. |
| `class` | `string` | "" | External class name. Applied to the layout container for multiple skeleton items or the block itself for a single item. |
| `style` | `string` | "" | Inline style. Applied to the layout container for multiple skeleton items or the block itself for a single item. |
| `children` | `Snippet` | — | Real child content without parameters. Mounted only when ready by default, or continuously in group mode. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
