# Radio full reference

Reviewed against Chinese source SHA-256 `befb7032cc46ec5c1be8a9e560b19e3cf69fc2126afd311eecdb7f77608d2e10`.

<a id="radio"></a>

# Radio

<a id="组件介绍"></a>

## Overview

Choose one option from a mutually exclusive set, suitable for form settings where every option should be visible.

<a id="使用选择"></a>

## When to use it

Use Radio for a single choice among visible options. Use Checkbox for independent choices and Segmented for compact mode selection. Give the group and each option accessible names.

- Bind the same `group` state across options and give each option a distinct, stable `value`. Use `null` for an initially unselected group.
- Clicking the selected option again can clear the selection to `undefined`. Do not assume a radio choice is irrevocable; provide readable labels.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Radio } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Radio bind:checked={subscribed}>Email me product updates</Radio>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | Standalone state supports `bind:checked`. Clicking or pressing Space toggles it, including clearing an existing selection. |
| group | `any` | — | Bind the same group state across Radio items with distinct values. Set the initial group to the chosen value, or `null` for no selection. Clicking the selected option again clears it. |
| value | `any` | — | The value corresponding to the current option should be strictly equal to the group; the same group should use a unique and stable value. |
| size | `ResourceSize \| number` | — | Control size including transparent hit space. Supports 12/16/20/24/28/32/40/48/80 and custom values; inherits size context when omitted, otherwise defaults to 16. |
| required | `boolean` | `false` | Whether this control must be selected. Empty submission only pulses its red border briefly, without text. |
| name | `string` | — | Native input field name; Radio uses matching names for native groups. |
| form | `string` | — | The id of the associated form element. |
| disabled | `boolean` | `false` | Prevent pointer and keyboard changes and remove the option from tab order while preserving its current selection state. |
| variant | `"outline" \| "filled"` | `"filled"` | Filled uses the coarse selection of the middle ring, and outline uses the thin outer frame and center point; both have the same selection behavior. |
| singleLine | `boolean` | `true` | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} when a full-text tooltip is needed. |
| gap | `number` | — | Inherited Frame gap token index. Omit it for the existing component gap; an explicit value overrides the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| children | `Snippet` | — | The label displayed next to the circular control can combine the title and description; it is recommended to always provide readable labels. |
| enableResponsive | `boolean` | `false` | The responsive capability switch passed to Frame; process the layout according to the responsive configuration of Frame. |
| enableContext | `boolean` | `false` | Forward the general context capability switch to Frame. It does not control Radio’s own size-context or Image badge-context reading. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字"></a>

<a id="关键字-1"></a>

### Keyword

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `'badge'` | - | Role: Image corner badge. |

Wrap a group in a labeled `role="radiogroup"`. Tab focuses and Space toggles; values are managed through bindings, without group arrow-key navigation. Use matching native names and `bind:group` to synchronize group values.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **inline shell layout**. See `docs/standards/LayoutProtocol.md` §12.4.

Radio belongs to the inline shell subcategory of "control visual body + label":

- The root node keeps `inline-flex`, and the content is Hug as a whole.
- `.snowui-radio-visual` is the control visual body of fixed Hug.
- `.snowui-radio-label` is an optional label. It hugs its contents when there is room and can shrink with a single-line ellipsis when constrained. Original content and the complete native accessible name are preserved.
- visual and label spacing uses `--snowui-radio-gap`. Set a preferred value with gap or `--snowui-radio-gap-override`; effective spacing stays at least 4 CSS px.
- `size` indicates the space size of the control containing transparent white space, which does not change the layout strategy of the label.
- The white space around is `size / 16`, and the width and height of the visible graphic are `size × 0.875`; for example, `size={32}` occupies 32×32px, the graphic is 28×28px, and the four sides are 2px each. The white and graphics are scaled with the size, root font size and size Token, and the white white can still be clicked.
- The white space is held by the shared control shell, and the label is located outside the shell; the inner frame continues to be calculated according to the nominal size of `0.0625`, and the rounded corners, Dot and selected rings are calculated according to the visible graphic size.
- `as="badge"` only means that Radio is the corner pendant of Image, and does not change the internal layout model of Radio.

---

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<script lang="ts">
  let checked = $state(false);
  import { Radio } from '@snowui-design-system/components';
  let selected = $state('option1');
</script>


<Radio bind:checked>Single option</Radio>


<Radio bind:group={selected} value="option1">Option 1</Radio>
<Radio bind:group={selected} value="option2">Option 2</Radio>
<Radio bind:group={selected} value="option3">Option 3</Radio>


<Radio bind:group={selected} value="filled" variant="filled">Filled style</Radio>


<Radio bind:checked size={20}>Large radio</Radio>
```

<a id="变体"></a>

<a id="outline"></a>

### Outline

- Not selected: gray border, transparent background
- Select: theme color dots, gray border

<a id="filled默认"></a>

### Filled (default)

- Not selected: gray border, transparent background
- Select: theme color background, white dots

<a id="状态"></a>

<a id="状态-1"></a>

### State

- **Unchecked**: Unchecked status
- **Checked**: Selected status
- **Disabled**: Disabled status

<a id="分组行为"></a>

<a id="分组行为-1"></a>

### Group behavior

When using the `group` attribute:

- Automatically manage the single-choice logic in the same group
- Selecting one will automatically cancel other options.
- Clicking the currently selected item again will uncheck it.
- After canceling the current selection, the `group` value will be cleared to `undefined`
- The value of `group` is equal to the `value` of the selected item.

<a id="无障碍性"></a>

<a id="无障碍性-1"></a>

### Accessibility

- Use the native `<input type="radio">` as the basic semantics, and add the "click again to cancel" logic in the component.
- Support Tab key focus
- Support Space key selection and cancellation
- Group selection uses bindings. The component does not currently provide arrow-key navigation within the group.
- In the disabled state, `tabindex=-1`

<a id="必填反馈"></a>

### Required feedback

With required, empty submission focuses the first invalid field and briefly pulses its red border, keeping the original ring color. It restores the original state without empty-field text. Reduced motion only focuses the field. Browser bubbles are suppressed while invalid submissions remain blocked. Nonempty format and business errors retain text; editing or reset clears feedback.

`required` (boolean, false by default), `name` (string), and `form` (string) reach the native input. Optional controls may remain unchecked. Radios sharing a name satisfy the required constraint when any group item is selected.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
