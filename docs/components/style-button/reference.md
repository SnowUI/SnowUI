# StyleButton full reference

Reviewed against Chinese source SHA-256 `2ebc5cadc35077fe89990837c5901ae5777e0f0fa411b6857648e34f8e225447`.

<a id="stylebutton"></a>

# StyleButton

<a id="组件介绍"></a>

## Overview

Switch between SnowUI and Apple visual styles, suitable as an interface style control.

<a id="使用选择"></a>

## When to use it

Use to switch between supported visual styles. Use ColorSchemeButton for light and dark mode. This button does not permit arbitrary changes to private component styles.

- Sync the style through bind:mode; defaultMode supplies the initial mode.
- By default the mode is applied to the document. For local control set applyToDocument=false. Without children, the button uses an icon-only layout.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { StyleButton } from '@snowui-design-system/components';
</script>

<StyleButton />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| mode | `SnowUIStyleMode` | — | Current visual style; supports bind:mode. Takes precedence over defaultMode on mount. Clicks update this value, and it follows root attribute changes when document sync is enabled. |
| defaultMode | `SnowUIStyleMode` | — | Uncontrolled initial value on mount; mode takes precedence. If neither is provided, reads the page root; with applyToDocument=false, falls back to snowui. |
| applyToDocument | `boolean` | `true` | Synchronize the current state to document.documentElement and body: set mode="ios" for Apple and remove mode for SnowUI. false disables reading, writing, and observing page attributes; the caller manages the theme target. Does not write storage. |
| ariaLabel | `string` | — | Overrides the accessible button name. The default describes the state a click will switch to and follows LocaleProvider. |
| snowuiLogo | `Snippet` | `— (built-in graphic)` | Replaces the SnowUI Logo shown in the snowui state. Only the graphic changes; switch logic stays with the component. |
| appleLogo | `Snippet` | `— (built-in graphic)` | Replaces the Apple Logo shown in the apple state. Only the graphic changes; switch logic stays with the component. |
| children | `Snippet` | — | Custom content shown after the state graphic. Without it, the host Button uses an iconOnly layout. |
| disabled | `boolean` | `false` | Disables button interaction but does not stop sync from an external bound value or page attribute. |
| onModeChange | `(mode: SnowUIStyleMode) => void` | — | Receives the new value after a user click. Initialization, external assignments, and observed page-attribute changes do not call it. |
| onclick | `(event: MouseEvent) => void` | — | Called before the state switch on a valid click. The current implementation does not let preventDefault() cancel the subsequent switch. Not called when disabled. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="使用"></a>

<a id="使用-1"></a>

### Usage

```svelte
<script lang="ts">
  import { StyleButton } from "@snowui-design-system/components";
</script>

<StyleButton bare />
```

StyleButton forwards compatible Button Props and supports all variants and sizes. By default it reads `document.documentElement`: `mode="ios"` means Apple style and no mode attribute means SnowUI style. The SnowUI state uses `SnowUILogo variant="icon"`; the Apple state uses the Apple brand logo vector, not an Apple icon from the icon library. Without additional children, StyleButton explicitly sets `iconOnly=true` on Button, preserving native four-sided Button padding of `4 / 8 / 12px` at `sm / md / lg`.

A click switches immediately. It does not write storage or add an icon-replacement or style-switch transition. With `applyToDocument={false}`, it maintains only controlled state, suitable when a host such as Test or an iframe manages the actual style target.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
