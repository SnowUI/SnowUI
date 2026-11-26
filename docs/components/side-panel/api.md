# SidePanel API

These are named public Props; inherited capabilities belong to their own public API.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | false | Whether the panel is visible; supports bind:open. |
| `placement` | `SidePanelPlacement` | "floating" | Show as a floating layer or inline on the right side of the page; supports bind:placement. |
| `width` | `number` | 460 | Panel width; supports bind:width. |
| `minWidth` | `number` | 320 | Minimum width allowed when dragging the panel edge. |
| `maxWidth` | `number` | 720 | Maximum width allowed when dragging the panel edge. |
| `inlineMotionOwner` | `"component" \| "layout"` | "component" | Owner of inline placement motion. The component fallback is component. For the floating-to-docked layout integration described here, set layout and use the layout helper with a persistent rail. |
| `showTopToolbar` | `boolean` | true | Whether to show the fixed top toolbar; its built-in buttons cannot be replaced individually. |
| `editable` | `boolean` | false | Whether content is editable. true shows the default bottom toolbar buttons. |
| `showBottomToolbar` | `boolean` | — | Explicitly show or hide the bottom toolbar. By default it appears when editable or when any bottom toolbar customization is supplied. |
| `bottomLeading` | `Snippet` | — | Replace the entire left group of the bottom toolbar. Supplying it also shows the toolbar. |
| `bottomTrailing` | `Snippet` | — | Replace the entire right group of the bottom toolbar. Supplying it also shows the toolbar. |
| `bottomLeadingActions` | `SidePanelToolbarAction[]` | — | Built-in action data for the left group. Supplying it shows the bottom toolbar. Ignored when bottomLeading is provided. In editable mode, the default actions are Copy and Delete. |
| `bottomTrailingActions` | `SidePanelToolbarAction[]` | — | Built-in action data for the right group. Supplying it shows the bottom toolbar. Ignored when bottomTrailing is provided. In editable mode, the default actions are Cancel and Save. |
| `title` | `string` | — | Top-toolbar title and panel accessible name. When omitted, sidePanel.title provides the localized title (“Details” in en-US). An explicit empty string is preserved. |
| `showTitle` | `boolean` | false | Whether to display the toolbar title. Hiding it preserves the accessible name and toolbar buttons. |
| `backdrop` | `DialogBackdrop \| false` | false | Floating backdrop shared with Dialog; ignored in inline mode. |
| `closeOnEscape` | `boolean` | true | Close the panel when Escape is pressed. |
| `closeOnOutside` | `boolean` | true | Close the panel when clicking outside SidePanel. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback after the open state changes. |
| `onPlacementChange` | `(placement: SidePanelPlacement) => void` | — | Callback after switching between floating and inline placement. |
| `onPrevious` | `() => void \| Promise<void>` | — | Callback after the Previous action in the top toolbar. |
| `onNext` | `() => void \| Promise<void>` | — | Callback after the Next action in the top toolbar. |
| `onCopy` | `() => void \| Promise<void>` | — | Callback after the default Copy action in the bottom toolbar. |
| `onDelete` | `() => void \| Promise<void>` | — | Callback after the default Delete action in the bottom toolbar. |
| `onClose` | `() => void \| Promise<void>` | — | Callback before the panel closes. |
| `children` | `Snippet` | — | Scrollable panel content, supplied by the caller for details or editing. |
| `parts` | `ComponentPartsOf<{ Button: typeof Button; Indicator: typeof Indicator; }>` | — | Configure the built-in toolbar Button and full-edge resize handle. Full part Props, including class and style, reach default instances; explicit children, bottomLeading, and bottomTrailing content does not inherit them. |

[Types](./types.md) · [Full reference](./reference.md) · [Styles](./styles.md)
