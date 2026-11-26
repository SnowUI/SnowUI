# Select full reference

Reviewed against Chinese source SHA-256 `ea14782b407c41a1cd0253a90f79ad3c7ebfd7a7b26ae28aeae4c4b2268a5a91`.

<a id="select"></a>

# Select

<a id="组件介绍"></a>

## Overview

Choose one option from a dropdown. Generate options from data or compose custom options, with search and keyboard support.

<a id="使用选择"></a>

## When to use it

Use Select for a dropdown single choice. By default, `options` generates Listbox and MenuItem; explicit children replace that panel. For command-style actions, use action mode.

- `options` generates the default list. Explicit Listbox and MenuItem children replace it.
- `persistent` stores the selection; `action` calls `onAction` and closes without storing it. Generated children use `parts`; explicit children use their own props.
- After the list closes with Escape, field and buttonTrigger/SelectButton modes restore focus to the real trigger button. The shared Listbox handles closing from its search header.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Select, Listbox, MenuItem, Text, Button } from '@snowui-design-system/components';
</script>

<Select placeholder="Select a city" style="width: 20rem; max-width: 100%;">
    <Listbox>
        <MenuItem as="item" value="shanghai">Shanghai</MenuItem>
        <MenuItem as="item" value="hangzhou">Hangzhou</MenuItem>
        <MenuItem as="item" value="shenzhen">Shenzhen</MenuItem>
    </Listbox>
</Select>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| gap | `number` | — | Inherited Frame gap token index. Omit it to retain the original preferred gap. Explicit values override the preference; effective graphics/text spacing remains at least 4 CSS px, including zero, root font scaling and gap scaling. |
| value | `SelectValue` | — | Current value, support `bind:value` |
| defaultValue | `SelectValue` | — | Initial value |
| placeholder | `string` | — | Placeholder shown in the trigger when no option is selected. |
| name | `string` | — | Form submission field name |
| disabled | `boolean` | `false` | Disabled state. |
| readonly | `boolean` | `false` | Read-only status |
| required | `boolean` | `false` | Required status |
| form | `string` | — | Specify the external form attribution |
| autofocus | `boolean` | — | The first rendering of autofocus |
| tabindex | `number` | — | Tab order |
| title | `string` | — | Native tooltip. |
| id | `string` | — | Native id |
| invalid | `boolean` | `false` | Invalid state at the component level |
| children | `Snippet` | — | `<Listbox>` + `<MenuItem>` Combination content |
| options | `SelectOption[]` | `[]` | Built-in list data using ListboxItem fields. Explicit children suppress the generated list. |
| triggerContent | `Snippet<[SelectTriggerContext]>` | — | Replace the content of the trigger button when buttonTrigger is turned on; receive value, option, label, placeholder, open, disabled. |
| buttonTrigger | `boolean` | `false` | Use Button instead of field triggers; keep the expansion, selection and focus recovery protocols. |
| buttonBare | `boolean` | `true` | It only takes effect in buttonTrigger mode to control whether the built-in Button is shellless bare appearance. |
| selectionMode | `"persistent" \| "action"` | `"persistent"` | `persistent` stores a selected value. `action` only calls `onAction`, closes the panel, and restores trigger focus without storing a value. |
| onAction | `(value: string) => void` | — | The action mode is called after selecting the option, and the parameter is the string option value; at this time, the panel is closed, and the return value does not participate in the selection. |
| parts | `SelectParts` | — | Configure the built-in Listbox, Input, MenuItem, Tooltip, and button trigger. Explicit children do not consume parent parts. |
| ariaLabel | `string` | — | The accessible name of the trigger; the button trigger mode is also used as a backup display content when there is no customized content. |
| onclick | `(event: MouseEvent) => void` | — | The non-disabled and non-readonly trigger is called after clicking to switch the expansion state to receive the original MouseEvent. |
| oninput | `(event: Event) => void` | — | The persistent mode calls when a different value is selected to receive the change Event distributed by the hidden form input; the actual new value is read from the binding value, which is not the native text input process. |
| onchange | `(event: Event) => void` | — | The persistent mode is called after the selection value is changed, and the same change Event is received; the same value and action mode are not triggered. |
| onfocus | `(event: FocusEvent) => void` | — | The field trigger is called when the focus is obtained and receives FocusEvent; the button trigger mode does not use this direct processor. |
| onblur | `(event: FocusEvent) => void` | — | The field trigger is called when the focus is lost and receives FocusEvent; the button trigger mode does not use this direct processor. |
| onkeydown | `(event: KeyboardEvent) => void` | — | The built-in arrow keys, Enter/Space and Escape of the trigger are called after processing, and KeyboardEvent is received; the processed action cannot be undone. |
| onkeyup | `(event: KeyboardEvent) => void` | — | The field trigger is called when the key is released to receive the KeyboardEvent; the button trigger mode does not use this direct processor. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="尺寸边界"></a>

### Sizing boundaries

Minimum width includes at least one character (1em), accessories, gaps and padding. Long options remain truncated. Narrow hosts must reflow or provide horizontal scrolling.

<a id="默认内置模式-显式组合模式"></a>

<a id="默认内置模式-显式组合模式-1"></a>

### Default built-in mode / explicit combination mode

- Built-in mode (recommended): Pass `options` and Select generates Listbox and MenuItem automatically; search is off by default and enabled via `parts={{ Listbox: { search: true } }}`, with `parts.Button`, `parts.Listbox`, `parts.Input`, and `parts.MenuItem` configuring built-in parts.
- When an entry’s `label` or `disabled` state changes for the same `value` in `options`, the selected display label, search filtering, and keyboard navigation update accordingly.
- Explicit composition mode: Declare `<Listbox>`, `<Input as="search">`, and `<MenuItem>` directly for custom item layouts; explicit `children` replace the built-in Listbox rather than merging both. An embedded `<Input as="search" allowCustomValue />` enables adding custom options (`allowCustomValue` belongs to `Input`).
- `buttonTrigger` switches the field trigger to a real `Button` (preferring `triggerContent`, then selected label, `placeholder`, and `ariaLabel`), preserving `aria-haspopup="listbox"`, `aria-expanded`, keyboard navigation, and focus restoration without rendering an outer field border.

```svelte
<Select options={[{ value: "a", label: "A" }]} />
```

<a id="布局模型与槽位组合"></a>

### Layout model and slot composition

Primary layout model: **slot host layout**. Standard field mode uses a single-line `Frame row` grid (`leading: auto`, `trigger: minmax(0, 1fr)`, `trailing: auto`) with at least `4 CSS px` effective gap and hides the default chevron when a direct custom `as="trailing"` child is present.

<a id="field-嵌入与留白规则"></a>

### Field embedding and padding rules

- **Standalone usage**: Select provides its own `12px / 16px` padding and `8px` gap.
- **Embedded in `Field` (without `as="segment"`)**: The outer `Field` owns the `12px / 16px` padding and border while Select removes its own outer border and padding and keeps internal slot gaps.
- **Segmented fields (`Select as="segment"`)**: Keeps Select’s own `12px / 16px` padding and shares a single divider with adjacent segments.
- **Placeholder and optional clearing**: `placeholder` renders only on the trigger when no value is selected and does not create a Listbox item; provide an explicit empty-value option in `options` or `MenuItem` when an optional field needs a clear choice.

<a id="必填与错误反馈"></a>

### Required validation and error feedback

With `required`, persistent selection mode focuses the first invalid control and briefly flashes a red border on empty submit without browser tooltips or empty-value copy; `action` mode does not participate in required value validation. `invalid` / `aria-invalid` triggers error shake on standalone Select or on the outer `Field` when embedded.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte

<Field>
  <Select placeholder="Select status">
    <Listbox>
      <MenuItem value="todo">To do</MenuItem>
      <MenuItem value="doing">In progress</MenuItem>
      <MenuItem value="done">Done</MenuItem>
    </Listbox>
  </Select>
</Field>


<Select placeholder="Select or type">
  <Listbox>
    <Input as="search" allowCustomValue placeholder="Search or add option..." />
    <MenuItem value="tag-a">Tag A</MenuItem>
    <MenuItem value="tag-b">Tag B</MenuItem>
  </Listbox>
</Select>


<ScrollArea axis="horizontal" ariaLabel="Select with attachments" width="100%">
<Select minWidth={240} placeholder="Tags">
  <Frame as="leading" singleLine>
    <Icon as="leading" icon={Resource.Tag} />
    <Text lines={1}>Tags</Text>
  </Frame>
  <Frame as="trailing" singleLine>
    <Text class="text-black-40" lines={1}>Multi-Select</Text>
    <Icon as="trailing" icon={Resource.CaretRight} class="text-black-20" />
  </Frame>
  <Listbox>
    <MenuItem as="item" value="design">Design</MenuItem>
    <MenuItem as="item" value="code">Code</MenuItem>
  </Listbox>
</Select>
</ScrollArea>
```

<a id="无障碍建议"></a>

### Accessibility guidelines

- The trigger uses `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`; Listbox uses `role="listbox"`, options use `role="option"` with `aria-selected`, and native form submission bridges through an internal `<input type="hidden">`.
- Keyboard interaction supports `ArrowUp` / `ArrowDown` to move focus, `Enter` / `Space` to confirm, and `Escape` / `Tab` to close; enable search filtering via `Listbox search` or an embedded `<Input as="search" />`.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
