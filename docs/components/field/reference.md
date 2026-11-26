# Field full reference

Reviewed against Chinese source SHA-256 `f8272cba2eb7692836c6df167277c2d5cdfced89330a811447d1611e37ee38b7`.

<a id="field"></a>

# Field

<a id="组件介绍"></a>

## Overview

Combine input controls, labels, icons, and validation feedback into a complete form field with consistent appearance and spacing.

<a id="使用选择"></a>

## When to use it

Use Field to combine labels, controls, help text, and errors. Inside Field, Input, Select, and Textarea share one visual surface; mark connected input sections with `as="segment"` so borders and error regions are not duplicated.

- `label` and `error` supply default text; `invalid` and `readonly` express field state.
- Use `children` to compose Input, Select, Textarea, and accessories. `parts` configures generated label and error Text; configure explicit children directly.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Frame, Input, Select } from '@snowui-design-system/components';
	import { Field } from '@snowui-design-system/components';
</script>

<Field
	style="width: min(100%, 22.5rem); min-width: 0; overflow: hidden; gap: 0;"
	column
>
	<Select
		as="segment"
		defaultValue="us"
		name="addressCountry"
		aria-label="addressCountry"
		options={[
			{ value: "us", label: "United States" },
			{ value: "cn", label: "China" },
			{ value: "jp", label: "Japan" },
		]}
	/>
	<Input
		as="segment"
		name="addressLine1"
		placeholder="Address"
		aria-label="addressLine1"
	/>
	<Select
		as="segment"
		defaultValue="ca"
		name="addressState"
		aria-label="addressState"
		options={[
			{ value: "ca", label: "State" },
			{ value: "ny", label: "New York" },
			{ value: "tx", label: "Texas" },
		]}
	/>
	<Frame as="segment" row gap={0} width="100%">
		<Input as="segment" name="city" placeholder="City" aria-label="city" />
		<Input as="segment" name="zip" placeholder="ZIP" aria-label="zip" />
	</Frame>
</Field>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| invalid | `boolean` | `false` | Container-level invalid state; forces the error border. |
| readonly | `boolean` | `false` | Container-level read-only state. |
| label | `string \| Snippet` | — | Generate a `<Text as="label">`; omitted by default. |
| error | `string \| Snippet` | — | Generate a `<Text as="error">` when `invalid=true`; omitted by default. |
| parts | `ComponentPartsOf<{ Text: typeof Text }>` | — | Configure generated label and error Text. |
| children | `Snippet` | — | Explicitly composed field content. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="2026-04-04-表单样式规则"></a>

<a id="表单组合与间距"></a>

### Form composition and spacing

- Default rhythm: Field padding is 12px vertical / 16px horizontal; gap is 8px.
- Standalone Input, Select, and Textarea each have their own 12px / 16px padding and 8px gap.
- Inside Field, first decide whether a child has `as="segment"`.
- Without `as="segment"`, Field owns 12px / 16px padding and 8px gap. Input, Select, or Textarea drops its own padding but keeps its internal gap.
- With `as="segment"`, the child is part of a connected field surface and retains its own padding and gap.
- The final position of the icon in `Input` is controlled by `Input` itself; `Field` does not add new offset rules to the icon.
- For `Input as="segment"`, the icon remains 16px from the nearest border or divider.
- Adjacent segments receive a vertical divider in a row or a horizontal divider in a column.
- Draw only one divider between adjacent segments.
- `label` and `description` are content only; they do not own padding, gaps, or dividers.
- A segmented Field’s shared error appears beneath the whole input surface, outside segment and divider layout.
- Input, Select, or Textarea segments declare `invalid`; Field owns the shared `error` text.
- The `label + host + error` pattern describes content; it does not decide padding or gap.
- For connected inputs in `Field row` or `Field column`, mark each child explicitly with `as="segment"`.

<a id="组件定位"></a>

<a id="组件定位-1"></a>

### Component role

Field is the form system’s surface container:

- It owns the field’s background, radius, border, focus ring, and dividers.
- It combines Input, Select, Textarea, Icon, Text, Checkbox, or Switch into one field surface.
- It owns padding and gaps for ordinary fields, and dividers between connected segments.

This means that:

- Input, Select, and Textarea remain interactive field hosts.
- Field provides the shared visual container.
- Declare structure explicitly: place a standard host inside Field, or mark connected hosts with `as="segment"`.

<a id="frame-能力继承"></a>

<a id="frame-能力继承-1"></a>

### Inherited Frame capabilities

Field is built on Frame and retains:

- `responsive / stateStyle / customStates / variants / styles`
- `Hover / Click / Focus / whileAppear / timeline / orchestrate`
- `loading / skeleton / renderHints`
- `as / use / layoutId / itemId / scope / access`

Field is a Frame container with field semantics, not a static form box.

<a id="关键字-keyword"></a>

<a id="容器协议"></a>

### Container protocol

Field exposes a context marker indicating that a host is inside a field container.

- When Input, Select, or Textarea detects that marker, it yields its outer surface to Field.
- The host gains `.snowui-field-host`; Field supplies shared padding, dividers, background, and focus ring.
- `invalid`, `readonly`, or `disabled` may be declared on Field or the host. Field aggregates these states with `:has()`.

This keeps a single visual field surface while each host retains its input behavior and internal rules.

<a id="错误反馈-shake"></a>

### Error feedback and shake

`Field invalid` shows a stable error border, error region, and combined state of child hosts. A submission or input error also triggers the built-in one-shot shake; consumers need no extra Prop or private CSS class.

Declare the ordinary invalid state; Field then supplies the surface feedback:

```svelte
<Field label="Email" error="Enter a valid email address." invalid>
    <Input type="email" invalid placeholder="name@example.com" />
</Field>
```

If an inner Input, Select, or Textarea becomes invalid without explicit `Field invalid`, Field also enters the shared invalid state and shakes once. The embedded host does not shake separately.

Invalid styling and shake do not focus an input or simulate `focus-within`. Focus comes only from actual user focus, `autofocus`, or an explicit application call to `focus()`.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **slot host layout**. See LayoutProtocol §12.3 (`docs/standards/LayoutProtocol.md`).

Field owns external Leading / Content / Trailing regions, continuous surfaces and dividers. Input, Select and explicit singleLine content rows retain their internal layout, alignment and spacing. A singleLine Field or direct leading/trailing attachments retain at least 4 CSS px; ordinary row, col and segment structural zero gaps and multiline descriptions are preserved.

Field specializes the slot host layout for a form surface:

- The root fixes `enableAutoLayout={true}`; ordinary callers cannot disable Field’s three-slot protocol.
- Without `error`, Frame remains the only root. With `error`, the visual-free `.snowui-field-error-layout` wraps the real Field Frame surface and an external error Text. The wrapper owns no border, background, or interaction styling.
- `leading`, `host`, and `trailing` map to Leading, Content, and Trailing. The host fills available space with `min-width: 0`.
- `label`, `description`, `error`, `row`, `col`, and `segment` are Field regions outside the generic three-slot core.
- For connected segments, Field owns the common surface, divider, and corner clipping; these rules stay in Field rather than generic `auto-layout.css`.
- Inside Field, Input, Select, and Textarea become `.snowui-field-host`; `as="segment"` determines whether each keeps its own padding.

<a id="角色协议-as"></a>

<a id="角色协议-as-1"></a>

### Child role contract (`as`)

`Field` itself does not limit the subcomponent type, but identifies different parts through the `as` role.

| Role | Recommended components | Description |
| --- | --- | --- |
| `label` | `Text` / `Frame` | Field label. |
| `description` | `Text` / `Frame` | Supporting description. |
| `error` | `Text` / `Frame` | Error message. |
| `row` | `Frame` | One-row composition for icon + input, paired inputs, segmented cards, and similar layouts. |
| `col` | `Frame` | Column composition for local vertical groups and segmented field blocks. |
| `segment` | `Frame` | Explicit connected section within a field surface. |
| `leading` | `Icon` / `Button` / `Frame` | Leading content in the current row. |
| `trailing` | `Icon` / `Button` / `Frame` | Trailing content in the current row. |

<a id="推荐组合规则"></a>

### Recommended composition

- Simple field: `Field > Input`.
- For a horizontal whole-field layout: `Field row > host + host`.
- For a vertical whole-field layout: `Field column > host + row`.
- Label and error: `Field > label + host + error`.
- For content before and after the host: `Field > leading + host + trailing`.
- For a local vertical group: `Field > col > host / row / description`.
- A simple `Field > host + trailing` is also supported.
- Connected inputs: `Field > row > segment + segment`.
- `label + host + error` describes a single control’s error content; it does not itself change padding, gap, or require `segment`.
- Only multiple hosts or explicit segments sharing one surface need a divider. Do not add dividers around accessories of a single host.
- `as="segment"` explicitly marks a connected field surface, assigning padding and dividers without guessing from DOM shape.
- Without segments, Field owns 12px / 16px padding and 8px gap; the host drops its padding but keeps its internal gap.
- Segments retain their own padding and gap and participate in the common dividers.
- `label`, `description`, and `error` are content, not padding or divider owners.
- `FM-01` address fields are vertical connected sections. Each owns its side borders and required rounded corners, with exactly one shared divider between neighbors.
- `FM-02` credit-card fields are horizontal explicit segments. Field owns the full surface; internal dividers separate segments.
- In a horizontal `Frame as="segment" row`, content and inline elements align vertically. After responsive padding compression, MM/YY remains centered with its neighboring Input segment.
- `FM-03` notification methods are side-by-side content rows under a label. Field owns the shell; inner Frame uses its explicit `gap` without dividers.

`leading` and `trailing` are not restricted to Icon. Any Frame-based component can participate when marked with the corresponding `as` role.

<a id="trailing-在复杂结构中的用法"></a>

### Using `trailing` in complex layouts

- `as="trailing"` marks the end of the current local row, not one global slot.
- For `Field > Input + Button as="trailing"`, Field places the children in one row.
- For complex layouts, introduce an explicit local container such as `Frame as="row"`; do not rely on an arbitrary `div` to infer the trailing role.
- For nested vertical grouping, use `Frame as="col" column`.
- A date-picker button can still use `as="trailing"` inside a complex local container; its role is inferred there without an extra Prop.

<a id="根节点-row-column-简写"></a>

### Root `row` and `column` shorthand

- `Field row` is shorthand for whole-field horizontal composition, such as paired controls or host + trailing.
- `Field column` is shorthand for whole-field vertical composition, such as a host above a row.
- Prefer `Field row` or `Field column` when the layout applies to the whole root.
- Use `Frame as="row"` or `Frame as="col"` for a local subgroup within Field.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte

<Field>
  <Input placeholder="Enter content" />
</Field>


<Field label="Email" invalid>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">Enter a valid email address.</Text>
</Field>


<Field invalid>
  <Text as="label">Email</Text>
  <Input type="email" placeholder="name@example.com" />
  <Text as="error">Enter a valid email address.</Text>
</Field>


<Field>
  <Text as="label">Country</Text>
  <Select defaultValue="us">
    <option value="us">United States</option>
    <option value="cn">China</option>
  </Select>
</Field>


<Field>
  <Input type="date" />
  <Button bare iconOnly as="trailing" aria-label="Open date picker">
    <ArrowLineDown size={16} />
  </Button>
</Field>


<Field>
  <Frame as="row" row>
    <Input type="date" />
    <Button bare iconOnly as="trailing" aria-label="Open date picker">
      <ArrowLineDown size={16} />
    </Button>
  </Frame>
</Field>


<Field row>
  <Input as="segment" placeholder="City" />
  <Input as="segment" placeholder="ZIP" />
</Field>


<Field column>
  <Input placeholder="First Name" />
  <Frame as="row" row>
    <Input as="segment" placeholder="City" />
    <Input as="segment" placeholder="ZIP" />
  </Frame>
</Field>
```

<a id="状态与交互边界"></a>

<a id="状态与交互边界-1"></a>

### Status and interaction boundaries

- Field owns surface states: default, hover, focus-within, invalid, disabled, and readonly.
- The host owns values, native input events, and browser validation details.
- Field can display error text but does not create it; get messages from native validation, form state, or application validation.

<a id="焦点触发区域规范"></a>

### Focus target area

- **The whole Field container is a focus target area**, not just the inner control.
- Clicking label text, padding, or border forwards focus to the first focusable control (`<input>`, `<textarea>`, or Select trigger), unless the clicked target is already focusable.
- After forwarding, real `:focus-within` activates the Field focus ring.
- Clicking a focusable Input, Select, or Textarea keeps its native browser focus behavior.
- No forwarding occurs when Field is disabled.

<a id="无障碍与表单建议"></a>

<a id="无障碍与表单建议-1"></a>

### Accessibility and form guidance

- Let the host carry native attributes such as `id`, `name`, `aria-*`, and `form`.
- For errors, point the host’s `aria-describedby` to the Field error or description node.
- Field does not replace `<label>` semantics; render `Text as="label"` or native `<label>` explicitly when needed.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
