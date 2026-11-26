# Switch full reference

Reviewed against Chinese source SHA-256 `33c046faff32afece8eb605114b79a415b7fba99ede9746c35e6bd34795f98e9`.

<a id="switch"></a>

# Switch

<a id="组件介绍"></a>

## Overview

Toggle between on and off for settings and features that take effect immediately.

<a id="使用选择"></a>

## When to use it

Use it for an immediate two-state setting. Use Checkbox for multiple form selections, and Radio or Segmented for mutually exclusive options.

- `bind:checked` synchronizes the on/off state. `value` only sets the internal input value; it does not determine whether the switch is on.
- Currently `name` and `form` are not forwarded to the internal input. To submit through a native form, explicitly synchronize the field at the form layer. Provide a readable label.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Switch } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Switch bind:checked={subscribed}>Email me product updates</Switch>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | On/off state; supports `bind:checked`. Clicking the label or pressing Space while focused toggles it. The bound variable, visible track, and native input remain synchronized. User interaction cannot change it while disabled. |
| value | `any` | — | Value passed to the internal native checkbox. It neither determines on/off state nor creates a selection group. Other attributes such as `name` and `form` currently go to the outer label, not the internal input; setting `value` alone does not create a named form submission. |
| size | `ResourceSize \| number` | — | Visible track height. Numeric values are nominal px at a 16px root font size; outer transparent space is additional. Supports 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 80 and other finite positive numbers. When omitted, uses the parent size Context’s `iconSize`, then `size`, then 16. Invalid numbers fall back to the default size Token. Explicit values take precedence and scale with root font size. |
| required | `boolean` | `false` | Whether this control must be selected. Empty submission only pulses its red border briefly, without text. |
| name | `string` | — | Native input field name; Radio uses matching names for native groups. |
| form | `string` | — | The id of the associated form element. |
| disabled | `boolean` | `false` | Disables the native input and user toggling while retaining the current value and label; removes it from Tab order. External code may still update `checked`. |
| singleLine | `boolean` | `true` | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} when a full-text tooltip is needed. |
| gap | `number` | — | Inherited Frame gap token index. Omit it for the existing component gap; an explicit value overrides the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| children | `Snippet` | — | Optional no-argument label content after the track. Its text also provides the internal switch’s accessible name; a content Snippet can compose that text. |
| enableResponsive | `boolean` | `false` | Passed to the root Frame to enable container-content adaptation observation. It does not change Switch’s standard size value range. See [Frame capability switches](../frame/reference.md). |
| enableContext | `boolean` | `false` | Passed to the root Frame to control Context for descendants, including state, loading, and motion. It does not control Switch reading the parent size Context. See [Frame capability switches](../frame/reference.md). |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Primary layout model: **inline shell layout**. See `../../../docs/standards/LayoutProtocol.md` §12.4.

Switch is the “control body + label” subtype of inline shell layout:

- The root remains `inline-flex`, and the full content hugs its contents.
- `.snowui-switch-track` is the control body with fixed, content-hugging size.
- `.snowui-switch-label` is an optional label. It hugs its contents when there is room and can shrink with a single-line ellipsis when constrained. Original content and the complete native accessible name are preserved.
- track and label spacing uses `--snowui-switch-gap`. Set a preferred value with gap or `--snowui-switch-gap-override`; effective spacing stays at least 4 CSS px.
- `size` is visible track height. Transparent hit-area space on each side is `size / 14`; occupied height is `size × 8 / 7`, and occupied width is `size × (1.8 + 1 / 7)`. At `size={28}`, the track is 50.4×28px with 2px on each side, for a 54.4×32px occupied area.
- Transparent space, track, and thumb scale together with `size`, root font size, and size Tokens. The transparent space remains clickable; the label is outside that shell.

---

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<script>
  import { Switch } from '@snowui-design-system/components';
  let checked = $state(false);
</script>


<Switch bind:checked>Switch</Switch>


<Switch bind:checked size={20}>Large switch</Switch>


<Switch checked disabled>Disabled switch</Switch>
```

<a id="状态"></a>

<a id="状态-1"></a>

### States

- **unchecked**: off state with a gray track
- **checked**: on state with a brand-color track
- **disabled**: unavailable with reduced opacity

<a id="无障碍性"></a>

<a id="无障碍性-1"></a>

### Accessibility

- Uses a native `<input type="checkbox">` for keyboard navigation
- Can receive focus with Tab
- Toggles with Space
- Uses `tabindex=-1` while disabled

<a id="必填反馈"></a>

### Required feedback

With required, empty submission focuses the first invalid field and briefly pulses its red border, keeping the original ring color. It restores the original state without empty-field text. Reduced motion only focuses the field. Browser bubbles are suppressed while invalid submissions remain blocked. Nonempty format and business errors retain text; editing or reset clears feedback.

`required` (boolean, false by default), `name` (string), and `form` (string) reach the native input. Optional controls may remain unchecked. Only require a switch when the action explicitly requires it to be on; ordinary settings remain optional.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
