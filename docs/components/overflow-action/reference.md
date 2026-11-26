# OverflowAction full reference

Reviewed against Chinese source SHA-256 `84436fb1cc79e02ce04ee422e186bf330fb7c34e66d05ddf1d38686ad3b78b9a`.

<a id="overflowaction"></a>

# OverflowAction

<a id="组件介绍"></a>

## Overview

Define one button action inside OverflowActions so it can move between the toolbar and the More menu as space changes.

<a id="使用选择"></a>

## When to use it

Use it as an action within OverflowActions with a stable identity. Use Separator for structural division, not as an executable action.

- A direct child must declare `as="item"` and provide a unique `id` and readable `label`.
- `children` replaces only the visible button content. The menu still uses `label` and `icon` when the action overflows.
- For a dedicated control, use the `control` Snippet to replace the visible Button and connect its received `run` callback to the control’s `onclick`. The menu still invokes the action’s `onclick`; update switch state through the dedicated control’s public binding.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { OverflowAction, OverflowActions } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; justify-content: center; width: 100%;">
	<OverflowActions overflow="progressive" overflowFrom="end" availableWidth={250} moreLabel="More component actions" style="justify-content: center;">
		<OverflowAction as="item" id="github" label="SnowUI on GitHub" icon="github-logo" href="https://github.com/SnowUI" />
		<OverflowAction as="item" id="copy-import" label="Copy import" icon="copy" />
		<OverflowAction as="item" id="publish" label="Publish docs" icon="upload" />
	</OverflowActions>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| id | `string` | `required` | Stable, unique action identifier within the group |
| label | `string` | `required` | Button label, menu label, and accessible name in icon-only mode |
| icon | `OverflowActionIcon` | — | Resource icon name or custom icon; the menu reuses it |
| disabled | `boolean` | `false` | Disables the visible button and corresponding MenuItem |
| href | `string` | — | Renders a link while visible; the menu navigates to the same URL |
| iconOnly | `boolean` | `false` | Built-in visible Button shows only the icon, using `label` as its accessible name; the menu still shows `label` |
| tooltip | `TooltipProp` | — | Tooltip toggle or configuration for the built-in Button and descendant Button controls inside `control`. Disabled by default (inherits parent `OverflowActions.tooltip` when omitted); applies to `iconOnly`/`compact` built-in buttons and propagates via shared `ButtonTooltipContext` to any Button-based child control with explicit child props taking priority. |
| onclick | `(event?: MouseEvent) => void` | — | Action callback shared by the visible button and menu execution. |
| children | `Snippet` | — | Overrides visible button content; the menu still uses explicit props (`Icon` plus `label` by default). |
| control | `Snippet<[(event?: MouseEvent) => void, boolean]>` | — | Replaces the visible Button with a dedicated control. Receives the `run` callback and final `disabled` state; wire them to the control’s actual `onclick` and `disabled`. Menu activation still runs `onclick`; the component measures the dedicated control directly without cloning a hidden stateful instance. |
| parts | `ComponentPartsOf<{ Button: typeof Button; Tooltip: typeof Tooltip; }>` | — | Configures this action’s built-in Button and Tooltip (isolated from explicit `control` children via `ComponentPartsBoundary`). Direct props take priority, followed by this setting, then parent group defaults; the parent does not read it to infer the More button style. |
| as | `string` | — | Must be `"item"` when used as a direct child of OverflowActions to register measurement, overflow, and menu execution; unregistered actions cannot participate in parent responsive management. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="api-1"></a>

### API

OverflowAction can only be a direct child of `OverflowActions`. It keeps a transparent measurement wrapper so the parent can measure full and icon-only widths. The interactive host remains the real Button; no second button state machine is created.

`control` mode is for controls such as ColorSchemeButton and StyleButton that already own a Button host; it does not nest the control inside another Button. A click on the visible control calls `run(event)` first to notify the action group, then the control performs its own state change. In the More menu there is no visible-control click event, so `onclick(undefined)` should update state through the same public binding. `icon` and `label` always provide the menu content and readable name. `compact="none"` suits toolbars mixing dedicated controls. The existing control itself is measured. When overflowed it leaves layout and paint; if its width must be checked again, measurement temporarily restores that same control during one calculation without mounting a second control that reads or writes document state.

Links pass through Button’s `target` and `rel`. Visible links remain native. In More, a target other than `_self` opens a new window with forced `noopener`; an explicit `noreferrer` is preserved. Internal links navigate in the same window.

Parent `OverflowActions buttonProps` supplies group-level Button defaults. Direct Button-compatible Props on this OverflowAction take precedence; child `parts.Button` falls between them.

---

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
