# Checkbox full reference

Reviewed against Chinese source SHA-256 `31af6f5026094d8e4c6356dc1bd3e24726dbf891b9fb195cf8fbe1437899f9c6`.

<a id="checkbox"></a>

# Checkbox

<a id="组件介绍"></a>

## Overview

Choose independent options with checked, unchecked, and mixed states, suitable for forms and batch selection.

<a id="使用选择"></a>

## When to use it

Use Checkbox for independent choices or multi-selection. Use Radio for mutually exclusive choices and Switch for an immediately applied setting.

- Independent Boolean states use `bind:checked`; multiple arrays use `bind:group` and provide stable value for each item.
- Indeterminate means partially selected; managed separately from checked. Provide labels or ariaLabel, and disable disabled.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Checkbox } from '@snowui-design-system/components';
	let subscribed = $state(false);
</script>

<Checkbox bind:checked={subscribed}>Email me product updates</Checkbox>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| checked | `boolean` | `false` | Selected status (two-way binding) |
| group | `any[]` | — | Multiple choice value array, with value two-way binding |
| value | `any` | — | Form value |
| size | `ResourceSize \| number` | — | Component size (pixels, gradient is consistent with Icon: 12/16/20/24/28/32/40/48/80) |
| required | `boolean` | `false` | Whether this control must be selected. Empty submission only pulses its red border briefly, without text. |
| name | `string` | — | Native input field name; Radio uses matching names for native groups. |
| form | `string` | — | The id of the associated form element. |
| disabled | `boolean` | `false` | Disabted status |
| indeterminate | `boolean` | `false` | Uncertain state (two-way binding) |
| onCheckedChange | `(checked: boolean) => void` | — | Callback after the change of the native re-selection state |
| ariaLabel | `string` | — | Barrier-free name when there is no visible label |
| singleLine | `boolean` | `true` | Labels and controls use one line by default, with stable attachments. A constrained label may show an ellipsis while retaining its complete accessible name and original children. Set false for complex multiline content. Compose Text lines={1} when a full-text tooltip is needed. |
| gap | `number` | — | Inherited Frame gap token index. Omit it for the existing component gap; an explicit value overrides the preferred gap. Effective spacing stays at least 4 CSS px, including zero and root-font or gap-scale reductions. Larger preferred gaps are preserved. |
| children | `Snippet` | — | Label content |
| enableResponsive | `boolean` | `false` | Enable responsiveness |
| enableContext | `boolean` | `false` | Enable the context |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **Inline shell layout**. See the definition.. /.. /../docs/standards/LayoutProtocol.md §12.4.

Checkbox belongs to the inline shell subclass of "control visual body + label":

- The root node keeps `inline-flex`, and the content is Hug as a whole.
- `.snowui-checkbox-visual` is the control visual body of fixed Hug.
- `.snowui-checkbox-label` is an optional label. It hugs its contents when there is room and can shrink with a single-line ellipsis when constrained. Original content and the complete native accessible name are preserved.
- visual and label spacing uses `--snowui-checkbox-gap`. Set a preferred value with gap or `--snowui-checkbox-gap-override`; effective spacing stays at least 4 CSS px.
- `size` indicates the space size of the control containing transparent white space, which does not change the layout strategy of the label.
- The white space around is `size / 16`, and the width and height of the visible graphic are `size × 0.875`; for example, `size={32}` occupies 32×32px, the graphic is 28×28px, and the four sides are 2px each. The white and graphics are scaled with the size, root font size and size Token, and the white white can still be clicked.
- The white space is held by the shared control shell, and the label is located outside the shell; the inner frame continues to be calculated according to the nominal size of `0.0625`, and the rounded corners, Dot and selected rings are calculated according to the visible graphic size.

---

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<script>
  import { Checkbox } from '@snowui-design-system/components';
  let checked = $state(false);
  let indeterminate = $state(false);
</script>



<Checkbox bind:checked>Checkbox</Checkbox>


<Checkbox bind:indeterminate>Mixed state</Checkbox>


<Checkbox bind:checked size={24}>Large checkbox (24px)</Checkbox>


<Checkbox checked disabled>Disabled checkbox</Checkbox>
```

<a id="状态"></a>

<a id="unchecked未选中"></a>

### Unchecked (unchecked)

- Empty box
- Gray border

<a id="checked选中"></a>

### Checked (selected)

- Display the check icon
- Theme color background and border

<a id="indeterminate不确定"></a>

### Indeterminate (uncertain)

- Display the horizontal line icon
- Theme color background and border
- It is often used in the "select all" scene.

<a id="图标"></a>

<a id="图标-1"></a>

### Icon

- **Tck the icon**: The selected status is displayed
- **Horizontal icon**: Uncertain status display
- Draw with 28×28 SVG stroke path, scale with component size and inherit selected state color

<a id="无障碍性"></a>

<a id="无障碍性-1"></a>

### Accessibility

- Use the native `<input type="checkbox">` to ensure keyboard navigation
- Support Tab key focus
- Support Space key switching
- Support `indeterminate` attribute
- In the disabled state, `tabindex=-1`

<a id="典型场景"></a>

<a id="单个复选框"></a>

### Single checkbox

```svelte
<script lang="ts">
  import { Checkbox } from '@snowui-design-system/components';
  let checked = $state(false);
</script>

<Checkbox bind:checked>Agree to terms</Checkbox>
```

<a id="全选部分选中"></a>

### Select all/select partially

```svelte
<script>
  import { Checkbox, Frame } from '@snowui-design-system/components';

  let items = $state([
    { id: 1, checked: false },
    { id: 2, checked: false },
    { id: 3, checked: false }
  ]);

  let allChecked = $derived(items.every(item => item.checked));
  let someChecked = $derived(items.some(item => item.checked) && !allChecked);
</script>


<Frame class="flex flex-col gap-2 p-4">
  <Checkbox
    checked={allChecked}
    indeterminate={someChecked}
    onclick={() => {
      const newState = !allChecked;
      items.forEach(item => item.checked = newState);
    }}
  >
    Select all
  </Checkbox>

  <Frame class="flex flex-col gap-2 pl-6 border-l border-black-10">
    {#each items as item}
      <Checkbox bind:checked={item.checked}>Option {item.id}</Checkbox>
    {/each}
  </Frame>
</Frame>
```

<a id="样式规则-style-spec"></a>

<a id="样式规则-style-spec-1"></a>

### Style Rules (Style Spec)

| Attribute | Value | Description |
| --- | --- | --- |
| **Class** | `.snowui-checkbox` | Component root class name |
| **CSS behavior** | Self-management of components | Hover vision is declared by the internal selector of the component |
| **Tag** | `label` | Semantic label, click area contains text |

<a id="2-默认样式-defaults"></a>

### 2. Default style (Defaults)

- **Display**: `inline-flex`, `align-items: center`
- **Gap**: Prefer `var(--gap-1)` and retain at least 4 CSS px after scaling or an explicit zero.
- **Cursor**: `pointer` (Disabled is `default`)
- **Font**: `var(--text-14)` (14px), `line-height: var(--leading-14)` (20px)

<a id="3-css-变量-variables"></a>

### 3. CSS Variables (Variables)

Components use CSS variables to achieve equal scaling:

```css
--snowui-checkbox-size: var(--size-4); /* 16px baseline */
--snowui-checkbox-size-resolved: var(--snowui-checkbox-size-override, var(--snowui-checkbox-size));
--snowui-checkbox-radius: calc(var(--snowui-checkbox-visual-size) * 0.3125); /* 31.25% of visible size */
--snowui-checkbox-radius-resolved: var(--snowui-checkbox-radius-override, var(--snowui-checkbox-radius));
--snowui-checkbox-border-width: calc(var(--snowui-checkbox-size-resolved) * 0.0625); /* 1px at 16px, 2px at 32px */
--snowui-checkbox-border-width-resolved: var(--snowui-checkbox-border-width-override, var(--snowui-checkbox-border-width));
--primary: var(--primary, var(--black-100, #000000)); /* Use global Primary token (black by default) */
```

<a id="unchecked"></a>

#### Unchecked

- **Visual**: Transparent background + `var(--black-20)` border
- **Icon**: The check and the horizontal line are not visible.
- **Hover**: The filling remains unchanged; the independent inset coverage is superimposed on the basic **20%** black border **20%** black, the default equivalent is about **36%** black; only this state applies to `StyleSpec §2.4.3` exception

<a id="checked-indeterminate"></a>

#### Checked / Indeterminate

- **Trigger**: `:checked` / `:indeterminate` of native input is driven by sibling selector
- **Visual**: `var(--primary)` background + border
- **Icon**: color: `var(--static-white-100)`; checked uses path drawing, indeterminate retains scaling / transparency transition
- **Hover**: Fill and inset border uniformly mixed on the main color **20%** Static White

<a id="disabled"></a>

#### Disabled

- **Attr**: `[data-disabled="true"]`
- **Style**: `opacity: 0.5`, `pointer-events: none`, `cursor: default`

<a id="5-交互细节"></a>

### 5. Details of interaction

- **Click area**: Native `<input>` uses `position: absolute; inset: 0` to cover the entire label area to ensure that the click response is sensitive.
- **Focus**: Support keyboard navigation, and display `20% primary` Ring when focusing.
- **Animation**:
  - Container: hover filling and inset border use the same color and timing
  - Checked: Refer to the pathLength semantics of Fluid Functionalism, and use `200ms ease-out` to draw; when unselecting, use the regular `150ms ease-out` to fade out with the background color, and do not draw in reverse.
  - Indeterminate horizontal line: consistent with Radio state dynamic effect, using `150ms ease-out`
  - `prefers-reduced-motion: reduce`: Cancel the visual body, check the transition with the horizontal line, and directly display the final state

<a id="必填反馈"></a>

### Required feedback

With required, empty submission focuses the first invalid field and briefly pulses its red border, keeping the original ring color. It restores the original state without empty-field text. Reduced motion only focuses the field. Browser bubbles are suppressed while invalid submissions remain blocked. Nonempty format and business errors retain text; editing or reset clears feedback.

`required` (boolean, false by default), `name` (string), and `form` (string) reach the native input. Optional controls may remain unchecked. Checkbox required applies to this checkbox, not to any one item in a multiple-selection group.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
