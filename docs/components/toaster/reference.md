# Toaster full reference

Reviewed against Chinese source SHA-256 `d1cd4d090af1cbe5207a4c2e6af64927dbdbfbeca0896688dd517447dc5f49b8`.

<a id="toaster"></a>

# Toaster

<a id="组件介绍"></a>

## Overview

Display global notifications created with `toast()` in one host. Six screen positions, stacking motion, and a visible-item limit keep successive feedback orderly.

<a id="使用选择"></a>

## When to use it

Use it as the display host for Toast, coordinating the notification queue and layout. Keep a page’s persistent notification history in the application rather than turning every past message into a transient Toast.

- Mount the notification host and create messages with `toast()`. `maxVisible` limits how many are shown at once.
- Notifications created in one runtime share a queue. Mount one Toaster at the application root and reuse it across page regions; multiple hosts display duplicate copies of the same notification.
- offset and gap control position and stacking spacing. parts configures generated Toasts and Text labels for string notifications; explicit appearance on one message takes priority.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Button } from '@snowui-design-system/components';
	import { Toaster, toast, dismissAllToasts } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: var(--gap-4) var(--gap-3);">
	<Button onclick={() => toast({ text: "Changes saved", positive: true })}>Save changes</Button>
	<Button onclick={() => toast({ text: "Connection lost", positive: false })}>Connection error</Button>
</div>
<Toaster />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| offset | `number` | `16` | Distance from the viewport edge to the Toast region, in px |
| maxVisible | `number` | `3` | Maximum visible layers per position. This limits visible layers, not the number of messages queued by `toast()`; a new Toast pushes out the last visible layer at the limit. |
| gap | `number` | `8` | Visual offset between Toasts at the same position, in px |
| scaleStep | `number` | `0.05` | Scale reduction per stacked layer; the layer at `index=1` scales to `0.95` by default |
| stackOpacityStep | `number` | `0.2` | Opacity reduction per stacked layer; the second and third layers default to `0.8` and `0.6` |
| stackMinOpacity | `number` | `0.6` | Minimum opacity for stacked items |
| stackDuration | `number` | `300` | Duration of stack transition, in ms |
| stackEasing | `string` | `"ease"` | Easing for stack transition |
| width | `number \| string` | — | Width of the Toast region. Content determines width by default; a supplied width fixes it. On narrow screens it is capped at `calc(100vw - 2rem)`. |
| parts | `ComponentPartsOf<{ Toast: typeof Toast; Text: typeof Text }>` | — | Configure generated Toast appearance and Text labels for text strings. Text defaults to lines=1; explicit children do not read parts.Text. Toaster retains queue data, position, and dismissal behavior; explicit notification Props take priority. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Built-in component modes

- `parts.Toast` configures all Toasts directly created by Toaster. `parts.Text` configures only labels generated from text strings, which default to a single line with full-text truncation hints.
- Toaster controls Toast queue data, `position`, close events, and stacking motion; a part cannot override them.
- Parts apply only to Toasts and text labels created by Toaster. They do not recurse into Toast internals or configure explicit leading, children, or trailing content.
- Explicit Props on a Toast instance take precedence over `parts.Toast`. Classes merge; styles merge with parts first and the explicit style last.

<a id="示例"></a>

<a id="示例-1"></a>

### Examples

```svelte
<Toaster
    parts={{
        Toast: {
            variant: "rich",
            size: "md",
        },
    }}
/>
```

For the full Toast API, see [Toast](../toast/reference.md).

<a id="定位规则"></a>

<a id="定位规则-1"></a>

### Positioning rules

- The `top` and `bottom` regions span the available width between the viewport’s left and right offsets. Notifications center within the region at the width set by their content or `width`.
- The region does not depend on absolutely positioned children for intrinsic width. This prevents a notification from growing rightward from the viewport center when an empty region would otherwise have zero width.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
