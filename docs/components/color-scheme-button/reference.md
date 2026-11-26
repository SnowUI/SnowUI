# ColorSchemeButton full reference

Reviewed against Chinese source SHA-256 `0631aaf6b40ec3f6f8df018571eb6a5e93041d804ca74440f4a663ef088674b9`.

<a id="colorschemebutton"></a>

# ColorSchemeButton

<a id="组件介绍"></a>

## Overview

Switch between light and dark themes, with an icon showing the current scheme; suitable for a website or application theme control.

<a id="使用选择"></a>

## When to use it

Use to switch between light and dark schemes. New code uses this name; ThemeButton is a compatibility export. Use StyleButton to change visual style.

- Sync light/dark state through `bind:scheme` or onSchemeChange; defaultScheme supplies the default scheme.
- By default, sync the document theme. For local control, set `applyToDocument={false}`. Without children, use an icon-only layout.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { ColorSchemeButton } from '@snowui-design-system/components';
</script>

<ColorSchemeButton />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| scheme | `ColorScheme` | — | Current color scheme with bind:scheme. With systemPreference=false it takes priority over defaultScheme on mount; clicks and observed document changes update it. |
| defaultScheme | `ColorScheme` | — | Uncontrolled initial value with systemPreference=false. scheme takes priority; otherwise reads the document root, or light when applyToDocument=false. |
| applyToDocument | `boolean` | `true` | Synchronize the document root theme. false disables document attribute reads, writes and observation. systemPreference separately controls system preferences and cookies. |
| systemPreference | `boolean` | `true` | By default follow the operating system without a valid manual cookie. Save manual choices for 365 days and resume system following on expiry. Cookie/system values override initial values. false disables system and preference cookie access. |
| ariaLabel | `string` | — | Overrides the accessible button name. The default describes the state a click will switch to and follows LocaleProvider. |
| lightIcon | `Snippet` | `— (built-in graphic)` | Replaces the Sun icon shown in the light state. Only the graphic changes; switch logic stays with the component. |
| darkIcon | `Snippet` | `— (built-in graphic)` | Replaces the Moon icon shown in the dark state. Only the graphic changes; switch logic stays with the component. |
| children | `Snippet` | — | Custom content shown after the state graphic. Without it, the host Button uses an iconOnly layout. |
| disabled | `boolean` | `false` | Disables button interaction but does not stop sync from an external bound value or page attribute. |
| onSchemeChange | `(scheme: ColorScheme) => void` | — | Receives the new value after a user click. Initialization, external assignments, and observed page-attribute changes do not call it. |
| onclick | `(event: MouseEvent) => void` | — | Called before the state switch on a valid click. The current implementation does not let preventDefault() cancel the subsequent switch. Not called when disabled. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="使用"></a>

<a id="使用-1"></a>

### Usage

```svelte
<script lang="ts">
  import { ColorSchemeButton } from "@snowui-design-system/components";
</script>

<ColorSchemeButton bare />
```

ColorSchemeButton inherits Button visual Props and sizes. With systemPreference=false it reads the document root: theme="dark" selects dark, otherwise light. Without children the Button uses iconOnly. Icons follow Button sizes: sm/md/lg use 16/20/24px; bare sizes use 12/16/20px.

The public instance method toggleScheme() uses the same toggle, disabled and persistence logic as a click, including external menu actions. System detection uses prefers-color-scheme on macOS and Windows. Blocked cookies cannot persist choices between visits. Test and standalone examples use systemPreference={false}.

The old name `ThemeButton` remains only as a deprecated compatibility alias; new code should use ColorSchemeButton.

Changes apply immediately. A manual choice is saved in a one-year cookie by default; systemPreference={false} disables preference access. Icon replacement takes 150ms; no whole-page transition is added. applyToDocument={false} leaves the theme target to the caller.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
