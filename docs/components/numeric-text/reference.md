# NumericText full reference

Reviewed against Chinese source SHA-256 `63705b6fd0eb47188a76f3cb6ebd8e3b51cec6144303516ec89afd66d20c5c77`.

<a id="numerictext"></a>

# NumericText

<a id="组件介绍"></a>

## Overview

Animate the parts of text or numbers that change while preserving unchanged content, suitable for short status, values, and time displays.

<a id="使用选择"></a>

## When to use it

Use it for number transitions. Use FlowText or SlotText for replacing whole text; configure appearance and formatting through public APIs.

- Update the number with `value`; control formatting with `locales` and `format`. Set `animated={false}` to show the result immediately.
- Reduced-motion preferences are honored by default. `direction` and `trend` control transition direction; use the system typography and color Props.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Button, Text } from '@snowui-design-system/components';
	import { NumericText, chromatic } from '@snowui-design-system/components';
	const headlines = ['Build with SnowUI', 'Ship components', 'Write better docs'];
	let headlineIndex = $state(0);
</script>

<div style="display: flex; flex-direction: column; align-items: center; gap: var(--gap-4);">
	<NumericText value={headlines[headlineIndex]} motionRole="text" motionColor={chromatic()} size="--text-32" lineHeight="--leading-32" weight={600} />
	<Button onclick={() => headlineIndex = (headlineIndex + 1) % headlines.length}>Next headline</Button>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| value | `NumericTextValue` | `""` | Displayed content |
| locales | `string` | `"en-US"` | Locale for number formatting |
| format | `Intl.NumberFormatOptions` | — | Number formatting options |
| animated | `boolean` | `true` | Whether to animate content changes |
| trend | `NumericTextTrend` | `0` | Decreasing, automatic, or increasing trend |
| direction | `NumericTextDirection` | `"normal"` | Semantic direction. `normal` uses the shared trend; `reverse` reverses the direction for text, numbers, timers, and countdowns. |
| motionRole | `TextMotionRole` | `"auto"` | Content semantics. `text` explicitly disables number inference; other values designate ordinary numbers, timers, or countdowns. |
| transition | `Partial<TextMotionTransition>` | — | Motion timing entry matching `numeric-text-main`. Demo Slow Mode uses `{ duration: 550, easing: reference }` by default. |
| respectMotionPreference | `boolean` | `true` | Matches `numeric-text-main`; honors the system reduced-motion setting by default. |
| font | `string` | — | Font family |
| size | `string \| number` | — | Font size |
| weight | `string \| number` | — | Font weight |
| lineHeight | `string \| number` | — | Line height |
| color | `SnowUIColor \| string` | — | Final text color |
| align | `TextMotionAlign` | — | Alignment; inherits from the parent by default |
| motionColor | `TextMotionColor` | — | Temporary color as target characters settle from left to right. Colors stay unchanged by default; supports a per-character `chromatic()` gradient. |

Host inheritance: Inherits `tag` (default `"span"`), `class`, `style`, and shared state/motion capabilities from [Frame](../frame/reference.md); this table lists only the component’s own named public props.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字"></a>

<a id="关键字-1"></a>

### Keyword

All six typography defaults inherit from the parent. SnowUI Tokens and PascalCase semantic colors such as `color="Primary"` are supported.

Numbers and time text use the shared trend protocol. Ordinary numbers compare actual result values; a negative sign does not change increase/decrease semantics. Multiplication and division use the larger or smaller result, not the operator, to choose Up or Down. Complete time strings use circular base-60 differences for `mm:ss` or `HH:mm:ss`. A single `00..59` segment also uses base-60 units when `motionRole="timer"` or `"countdown"`. An increasing timer uses Up; a decreasing countdown uses Down. `trend={1|-1}` explicitly overrides automatic inference. `direction="reverse"` flips the final trend. `motionRole="text"` uses default trend `1` when no trend can be inferred, so reverse also affects plain text.

```svelte
<NumericText
    value={12840}
    format={{ style: "currency", currency: "USD" }}
    size="--text-24"
    weight={600}
    color="Primary"
    motionColor="Indigo"
/>
```

---

<a id="实现约束"></a>

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
