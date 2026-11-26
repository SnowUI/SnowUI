# Spinner full reference

Reviewed against Chinese source SHA-256 `cc806d87417c600547c07fda3b394d0772d435c577e0c83bd91b4985daca056a`.

<a id="spinner"></a>

# Spinner

<a id="组件介绍"></a>

## Overview

Indicate loading with a continuously rotating ring, spokes, or capsules, suitable for buttons and content areas.

<a id="使用选择"></a>

## When to use it

Use Spinner for ongoing waiting. Use Progress when completion can be measured. Prefer the built-in Spinner in buttons and tables that already provide a loading state.

- `variant` selects the animation shape. `size` takes precedence over the parent size; without a size context it defaults to 16.
- `children` are not rendered; place loading text in an external composition. Use Progress when showing completion percentage.
- The default loading status name follows LocaleProvider; an explicit aria-label takes priority. External loading descriptions remain caller-owned text.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Spinner, Text, Button } from '@snowui-design-system/components';
</script>

<div style="display: flex; align-items: center; gap: var(--gap-3);">
	<Spinner aria-label="Loading components" />
	<Text>Loading components…</Text>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `SpinnerVariant` | `"circle"` | Visual variant style |
| size | `ResourceSize` | — | Size (12, 16, 20, 24, 28, 32, 40, 48, or 80). When omitted, inherits parent `iconSize` / `size` if present, otherwise 16. |
| speed | `number` | `1` | Positive animation speed multiplier. Base periods are 1000ms for `circle` and 800ms for `spokes` / `pills`, divided by this multiplier. Non-finite or non-positive values fall back to 1; explicit `loopMotion` timing takes precedence. |
| loopMotion | `LoopMotionConfig` | — | Override the default looping motion configuration, including timing derived from `speed`. With a `preset`, Spinner consumes only its timing fields so the root Frame does not rotate again. |
| children | `Snippet` | — | Accepted for Frame type compatibility; Spinner renders its own animation, not `children`. Compose text outside it. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: intrinsic atomic layout.

- The root is an intrinsic box sized by `size` and `variant`; it hugs its content when used in another layout.
- The SVG, mask, spoke, and pill animation layers are private Spinner structure; no Leading / Content / Trailing slots are exposed.
- Spinner does not arrange a label. Compose “icon + text” in an external Button, Frame, or Text.
- `loopMotion` changes only internal loop timing, not root layout.

<a id="关键字-keywords"></a>

<a id="关键字-keywords-1"></a>

### Keywords

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `''` | Custom class, for example to change color. |

<a id="note-on-color-label"></a>

### Note on Color & Label

- **Color**: Spinner has no `color` prop. It inherits the current text color (`currentColor`). Change color with a utility class, for example `<Spinner class="snowui-text-blue-500" />`.
- **Label**: Spinner has no `label` prop. Compose text in an external layout.

<a id="变体-variants"></a>

<a id="变体-variants-1"></a>

### Variants

| Variant | Description |
| --- | --- |
| `circle` | (Default) Ring made with **CSS conic-gradient**, fading at its head and tail. |
| `spokes` | Radial spokes with a trailing effect. |
| `pills` | Thick radial capsules with a trailing effect. |

<a id="示例"></a>

<a id="1-基础用法"></a>

### 1. Basic usage

The default is a 16px `circle`.

```svelte
<Spinner />
```

<a id="2-变体-variants"></a>

### 2. Variants

```svelte
<div class="flex gap-4">
    <Spinner variant="circle" />
    <Spinner variant="spokes" />
    <Spinner variant="pills" />
</div>
```

---

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
