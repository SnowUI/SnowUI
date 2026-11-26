# Textarea full reference

Reviewed against Chinese source SHA-256 `f413d97d6f8f9b74f95f9b1da90ae0d3c5d77cd8ebe4b0d8d5c78523333ac249`.

<a id="textarea"></a>

# Textarea

<a id="组件介绍"></a>

## Overview

Edit multiline text with native form attributes and Field feedback, suitable for descriptions, notes, and longer content.

<a id="使用选择"></a>

## When to use it

Use Textarea for multiline input and Input for one line. Compose labels, help, and errors with Field. Do not use a read-only input to lay out ordinary display text.

- `bind:value` synchronizes text. `defaultValue` is only a fallback while `value` is undefined; a controlled form must restore its bound value on reset.
- `resize` selects allowed resize directions. `readonly`, `disabled`, and `resize="none"` suppress the handle. `name` identifies the submitted form field.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Textarea } from '@snowui-design-system/components';
</script>

<Textarea placeholder="Share feedback on the SnowUI docs…" aria-label="Documentation feedback" style="width: min(100%, 22.5rem); min-width: 0;" />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| value | `string` | — | The current text supports `bind:value`. The explicit value takes precedence over the defaultValue; when entering and changing, the binding value is synchronized first, and then the corresponding event callback is called. |
| defaultValue | `string` | — | Fallback text when `value` is undefined. After first input, `value` takes over. This is not a separate native reset protocol; restore the bound initial value in `onreset` for controlled forms. |
| placeholder | `string` | — | Multi-line prompts for empty values can include line changes; they cannot replace accessible labels. |
| maxCount | `number` | — | Suggested character limit. It drives the counter and `exceeded` without blocking input. Count uses JavaScript `string.length` (UTF-16 code units). Hover shows the count; values strictly over the limit stay visible in red. Use a positive integer. Set `maxlength` separately for a hard input limit. |
| exceeded | `boolean` | `false` | Computed from whether current text length strictly exceeds `maxCount`; supports `bind:exceeded` for reading. With no `maxCount`, it is false. Computation overwrites a passed value and does not set `invalid` automatically. |
| name | `string` | — | The field name of the native form, read the text by this name when submitting; the disabled field does not enter FormData. |
| disabled | `boolean` | `false` | Disable editing, form submission, and Tab focus while retaining visible content; hide the resize handle. |
| readonly | `boolean` | `false` | Read-only, keep focus, selection, copy and named form submission; turn off the zoom handle, ignore rows, and use read-only content layout. |
| required | `boolean` | `false` | Enables native required validation. Empty submission only pulses a red border briefly, without text, then restores the original state. Use error for business messages. |
| rows | `number` | `2` | The visible line number prompt passed to the native textarea uses positive integers; it is not passed when readonly. When components are mounted, input and external values change, they will also measure height by content, so it does not lock the final height. |
| cols | `number` | — | The number of character columns passed to the native textarea prompts, using positive integers; the component occupies the full container width by default, so it does not directly determine the width of the shell. With wrap="hard", it can affect the line change at the time of submission. |
| minlength | `number` | — | Native minimum length in UTF-16 code units; does not block input. Empty values need required. Native invalid events automatically feed the component error state. |
| maxlength | `number` | — | The native maximum input length constraint is counted by UTF-16 code unit; the browser usually restricts users from continuing to input, but does not cut off the text externally assigned to value / defaultValue. Control the input limit and count prompts separately with maxCount. |
| wrap | `HTMLTextareaAttributes["wrap"]` | — | Native wrapping: `soft` wraps visually without inserting newlines on submit; `hard` may add them according to `cols`; `off` disables automatic wrapping. The browser default is `soft`. Textarea has no horizontal scrollbar, so prefer `soft` for long-line editing. |
| spellcheck | `boolean` | — | Pass the browser's spelling check switch; it is not set to follow the browser and inherit the environment, and the actual dictionary is provided by the browser. |
| autocomplete | `HTMLTextareaAttributes["autocomplete"]` | — | Native auto-fill prompts, such as street-address; candidates depend on the data saved by the browser and are not provided by components. |
| enterkeyhint | `HTMLTextareaAttributes["enterkeyhint"]` | — | Enter key label prompts on the mobile terminal, such as done / enter / next; do not bind the submission or jump action, and the presentation is determined by the input method. |
| inputmode | `HTMLTextareaAttributes["inputmode"]` | — | Soft keyboard mode prompts, such as text / numeric; do not change the string value type, and do not automatically check the input format. |
| form | `string` | — | Associate the native form of the specified id in the same document, so that the text domain outside the form DOM still participates in the form submission. |
| autofocus | `boolean` | — | The automatic focus request sent to the native textarea; whether to execute is up to the browser. It is recommended to use it when the user actively opens the editing area. |
| tabindex | `number` | — | Native Tab order; 0 uses natural order, -1 skips sequential navigation but allows active focus, and the positive number specifies the priority. It is recommended to keep the natural order of ordinary forms. |
| title | `string` | — | Native prompt text; the browser decides how to display, not replacing visible labels or error messages. |
| id | `string` | — | The id of the internal native textarea is used for label for and ARIA references; it remains unique in the same document. |
| resize | `"none" \| "vertical" \| "horizontal" \| "both"` | `"both"` | Resize direction: `none` hides the handle, `vertical` changes height, `horizontal` changes width, and `both` changes both. Readonly or disabled forces `none`. The handle defaults to minimum width 120px and height 60px. Manual height adjustment stops content-based auto-sizing. |
| invalid | `boolean` | `false` | Business error state combined with aria-invalid and native validation feedback. Setting this prop alone does not validate or move focus. maxCount does not trigger native validation. Field owns the combined visual feedback when embedded. |
| error | `string` | — | Business error text displayed below the textarea with invalid. Native validation feedback is automatic. |
| parts | `ComponentPartsOf<{ Indicator: typeof Indicator }>` | — | Configure the built-in Indicator, such as step / largeStep keyboard step length, maxWidth / maxHeight boundary and ariaLabel. It only works on the handle generated by the component; there is no handle to be configured when resize=none, readonly or disabled. |
| onclick | `(event: MouseEvent) => void` | — | Triggered when the internal native text domain is clicked. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| ondblclick | `(event: MouseEvent) => void` | — | Triggered when double-clicking the internal native text domain. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| oninput | `(event: Event) => void` | — | Triggered when the user inputs to change the content; the value has been synchronously bound before the call. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onchange | `(event: Event) => void` | — | Triggered when the user submits this edit, it is usually out of focus after the value changes; the value has been synchronously bound before the call. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onfocus | `(event: FocusEvent) => void` | — | Triggered when the internal text domain is focused. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onblur | `(event: FocusEvent) => void` | — | Triggered when the internal text domain loses focus. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onkeydown | `(event: KeyboardEvent) => void` | — | Triggered when the keyboard key is pressed, key and other fields can be read. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onkeyup | `(event: KeyboardEvent) => void` | — | Triggered when the keyboard key is released, key and other fields can be read. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onkeypress | `(event: KeyboardEvent) => void` | — | Triggered when the browser distributes the old keypress; this native event has been deprecated, and the new code uses onkeydown first. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| onpaste | `(event: ClipboardEvent) => void` | — | Triggered when pasting, the clipboard content can be read through clipboardData. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| oncopy | `(event: ClipboardEvent) => void` | — | Triggered when copying selected text, you can set the copy content through clipboardData. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |
| oncut | `(event: ClipboardEvent) => void` | — | Triggered when the selected text is cut, the cut content can be set through clipboardData. The parameter is the native event, and the currentTarget is the internal textarea; the return value is ignored, and event.preventDefault() is called when the default behavior that can be canceled is canceled. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="原生表单校验反馈"></a>

### Native form validation feedback

Native validation failures suppress browser bubbles and still block invalid submission. Empty required fields only pulse a red border briefly, show no text, and return to their original state. Nonempty type, length, and format errors display validationMessage below the component. Focus goes to the first invalid field; editing updates feedback and reset clears it. Business validation uses invalid and error; native errors take precedence. Native message language is controlled by the browser. Client validity does not imply server acceptance.

<a id="尺寸边界"></a>

### Sizing boundaries

The layout minimum is one character (1em) plus left and right padding. Drag-resize limits are separate. Narrow hosts must reflow or provide horizontal scrolling.

<a id="内置组件双模式"></a>

<a id="内置组件双模式-1"></a>

### Built-in component dual mode

- `parts.Indicator`: The built-in Indicator in the unified configuration resize mode.
- Textarea value, invalid, disabled and input events are parent component controlled protocols.

**2026-04-04 Supplement**: Refer to Figma `10109:19152`, `Textarea` is a single exception in the form series: when used alone, the default content is left blank as `top 12 / right 16 / bottom 24 / left 16`. After entering `Field`, just look at whether there is `as="segment"`; when `segment` is not marked, the outer layer `Field` handles the default `12 / 16` and `gap = 8`, `Textarea` removes the component's own padding, but retains its own gap; when `segment` is marked, the `Textarea` own padding and gap are retained. The lower right corner uses the unified `Indicator appearance="corner"`; the character counter is not displayed by default. After passing to `maxCount`, the count is displayed when hovering to the component, and it continues to be displayed when the limit is exceeded. **2026-04-09 Supplement**: `Textarea` The reserved area in the lower right corner (including zoom icons and counters) always exists; the default requirements are `right = 16px`, `bottom = 0`, and the edge is not allowed. **2026-04-24 Supplement**: `Textarea` uses a custom floating scroll bar consistent with `Listbox`: the native scroll bar is hidden, the thumb is over the content, and the layout width is not occupied; the default width is 4px, and the hover to thumb changes from right to left to 8px, the right edge is 4px from the right border of the container, the track is transparent and supports dragging. **2026-05-26 Supplement**: The top/bottom scroll fade of `Textarea` is changed to the general ability of `.snowui-scroll-mask` of `layout.css` (that is, the CSS static form of the basic sharing ability of the "content fade layer", the overview of the ability is seen in `../lib/edge-fade.md`), and `mask-image` is driven by `data-scroll-mask` on the native `<textarea>`, and the visible gradient color block is no longer drawn.

**Inheritance**: Reuse all the general capabilities of Frame.svelte (state, dynamic, responsive, skeleton, style arrangement). **Recommended container**: `Field.svelte`. **Default capability switch**: `enableResponsive=false`, `enableContext=true`, `enableScaleObserver=false`.

The native `<textarea>` uses `.snowui-native-control` from `layout.css` only for box sizing, margin reset, and inherited font/color. Textarea’s own font size, line height, padding, border, and state appearance do not depend on optional `snowui-base.css`.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: composite management layout.

- The area structure of Textarea is root host / native control / footer / Indicator corner / counter / overlay scrollbar.
- When entering Field, Textarea only participates in the slot host layout of Field as a multi-line input host; its own footer, counter, resize and scrollbar are still privately managed by Textarea.
- `as="segment"` only affects the continuous field surface relationship between Textarea and Field, and does not transform Textarea into a general slot container.
- The footer counter and Indicator prefer gap-1 on the same row, with a 4 CSS px floor and larger tokens preserved. A single attachment creates no empty slot. Multiline input, counter visibility, and intrinsic handle dimensions keep their existing contracts.
- The footer uses internal Pin layout at `pin-bottom-right`. Standalone offset is `var(--padding-1)`; inside Field, negative `--pin-offset-x/y` values compensate for Field padding.
- The custom floating scroll bar reuses `useOverlayScrollbar`, but the scroll bar positioning and the lower right corner reserved area belong to the private area structure of Textarea.

<a id="2026-04-04-表单样式规则"></a>

<a id="表单组合与间距"></a>

### Form combination and spacing

- Basic rhythm unification: `Field` default `padding = 12 / 16`, `gap = 8`
- Standalone Textarea content padding defaults to `top 12 / right 16 / bottom 24 / left 16`.
- After putting it into `Field`, first see if there is `as="segment"`
- No `as="segment"`: the outer layer `Field` is responsible for `12 / 16` padding and `8` gap; `Textarea` removes the component's own padding, but keeps its own gap
- There is `as="segment"`: this is a segment on the surface of a continuous field; keep `Textarea`'s own padding and gap
- There is a dividing line between `segment`: the horizontal is the left and right dividing line, and the vertical is the upper and lower dividing line.
- There can only be one dividing line between adjacent `segment`, and the line cannot be repeated.
- `label / description / error` is not responsible for padding, gap and dividing line. They are just content elements.
- General `label + host + error`: not used as the basis for the judgment of padding and gap, only responsible for the text content
- In `Field row` or `Field column`, if it is a continuous input segment, the sub-item should be explicitly written `as="segment"`

<a id="组件定位"></a>

<a id="组件定位-1"></a>

### Component positioning

The recommended usage of `Textarea` is to act as a multi-line host in the `Field` container:

- When used alone, retain the default input appearance for compatibility.
- After entering the `Field` context, when `segment` is not marked, the outer layer `Field` takes over the padding; when `segment` is marked, keep the `Textarea` itself blank.
- Suitable for combination with `Text as="label" / "error"`, `Frame as="row"` and other roles

<a id="frame-能力继承"></a>

<a id="frame-能力继承-1"></a>

### Frame ability inheritance

`Textarea` is still based on `Frame`, so it continues to support:

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

Textarea owns multiline input while retaining Frame’s shared capabilities.

<a id="错误反馈-shake"></a>

### Error feedback Shake

`Textarea invalid / aria-invalid` triggers error shake by default. Standalone Textarea provides its own feedback; inside Field, the embedded Textarea does not shake separately and Field provides combined feedback.

The error state and shake will not automatically focus or simulate `focus-within`; the focus state only comes from the user's real focus, explicit `autofocus` or business code active call `focus()`.

<a id="宿主协议"></a>

<a id="原生能力边界"></a>

### Native ability boundary

`Textarea` is responsible for:

- Forward native `<textarea>` attributes.
- `value / defaultValue` parsing
- `bind:value` synchronization
- `resize` direction control
- Summary of `invalid` and `aria-invalid`

`Textarea` is not responsible for:

- Rich text editor
- Markdown syntax enhancement.
- The automatic height strategy specified by the business; the current component automatically measures the height according to the content, up to about 15 rows of height, and the automatic height measurement stops after manually adjusting the height.
- Business-level verification prompt

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte

<Field>
  <Textarea placeholder="Enter more details" />
</Field>


<Field invalid>
  <Text as="label">Issue description</Text>
  <Textarea rows={6} placeholder="Describe the issue in detail" />
  <Text as="error">At least 20 characters are required.</Text>
</Field>


<Textarea
  name="description"
  rows={6}
  minlength={20}
  maxlength={200}
  maxCount={200}
  placeholder="Describe your issue"
/>


<Textarea
  Click={{ Idle: "Active", Active: "Idle" }}
  stateStyle={{
    Idle: "--snowui-textarea-background: var(--surface-1, #ffffffcc);",
    Active:
      "--snowui-textarea-background: color-mix(in srgb, var(--primary, #000000) 8%, var(--surface-1, #ffffffcc));",
  }}
  defaultValue="Click to change state"
/>
```

<a id="与通用逻辑的关系"></a>

<a id="无障碍与表单建议"></a>

### Accessibility and form guidance

- When you need to specify the label, give priority to explicitly rendering `label` in `Field`
- The error prompt suggests linking to the host through `aria-describedby`
- If you want to make a chat input box, a comment box, and a rich input area with a toolbar, it is recommended to continue to combine in the `Field` container instead of stacking all the UI into the `Textarea` body.

---

<a id="必填反馈"></a>

### Required feedback

With required, empty submission focuses the first invalid field and briefly pulses its red border, keeping the original ring color. It restores the original state without empty-field text. Reduced motion only focuses the field. Browser bubbles are suppressed while invalid submissions remain blocked. Nonempty format and business errors retain text; editing or reset clears feedback.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
