# Form composition

<a id="表单组合指南"></a>

# Form composition guide

<a id="使用选择"></a>

## When to use it

Form is a composition guide, not a public component. Use a native `<form>`, Field for each field, and choose Input, Select, Textarea, Checkbox, Radio, or Switch according to input semantics.

<a id="快速开始"></a>

## Quick start

```svelte
<script lang="ts">
  import { Field, Input, Button } from '@snowui-design-system/components';
  let email = $state('');
</script>

<form style="display: flex; flex-direction: column; gap: var(--gap-4);">
  <Field label="Email address">
    <Input type="email" name="email" bind:value={email} required />
  </Field>
  <Button type="submit">Save</Button>
</form>
```

<a id="布局与样式"></a>

## Layout and styling

- For a regular field, use a label, input, and error. Field owns outer spacing; embedded Input / Select / Textarea remove duplicate inner padding. Do not override internal nodes from the page.
- For continuous input surfaces such as addresses or card numbers, set `as="segment"` on each input segment. The components retain segment spacing and draw adjacent separators.
- `Field row` lays fields out horizontally, while `Field column` lays them out vertically. Only continuous input segments need segment mode; Checkbox rows and single-input error states do not.
- Labels, descriptions, and errors provide content only. Do not add a second surface, padding, or separator to them.
- Default component padding is 12 / 16 and gap is 8. To adjust them, first use public Props or registered overrides with the corresponding padding / gap tokens.

<a id="值提交与校验"></a>

## Values, submission, and validation

- Sync input values through public `bind:value`, `bind:checked`, or `bind:group` as specified by each component API.
- Input / Select / Textarea use name to join native form submission. Not every input-like component forwards form attributes: for example, Switch does not forward name to its internal input, so the form layer must include that value in submission.
- When resetting a controlled form, restore the initial application-bound values in the native form onreset handler. Do not assume defaultValue manages application state.
- Show errors through Field invalid / error. The application owns validation rules, submission requests, and request results.

<a id="相关组件"></a>

## Related components

- [Field](../components/field/reference.md): label, surface, and error.
- [Input](../components/input/reference.md): single-line input and native input types.
- [Select](../components/select/reference.md): single selected value and dropdown options.
- [Textarea](../components/textarea/reference.md): multiline text and resizing.
- [Checkbox](../components/checkbox/reference.md), [Radio](../components/radio/reference.md), [Switch](../components/switch/reference.md): selections and toggles.
