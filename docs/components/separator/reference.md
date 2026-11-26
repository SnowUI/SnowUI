# Separator full reference

Reviewed against Chinese source SHA-256 `755874c9faba9a8c52d61676da7f7414f6fc0746a6460a54d18e1317661f1e05`.

<a id="separator"></a>

# Separator

<a id="组件介绍"></a>

## Overview

Separate content and action regions with horizontal or vertical rules to establish a clear information hierarchy.

<a id="使用选择"></a>

## When to use it

Use for horizontal or vertical separation between UI regions. It is not a general drawing component for chart axes, activity tracks, or decorative paths.

- Choose orientation with row / column, and set length / thickness with the corresponding system tokens.
- Keep decorative separators decorative. Add accessible semantics only when the line conveys a real content division.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Separator } from '@snowui-design-system/components';
</script>

<div style="width: min(100%, 24rem); display: flex; flex-direction: column; gap: var(--gap-4);">
	<p>SnowUI brings components, layout, and motion together for Svelte applications.</p>
	<Separator />
	<p>Start with the installation guide, then explore the component documentation.</p>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| row | `boolean` | `false` | Horizontal separator, consistent with Frame syntax. |
| column | `boolean` | `false` | Vertical separator, consistent with Frame syntax. |
| length | `string \| number` | — | Main-axis length; numeric values are treated as px. |
| thickness | `string \| number` | — | Line thickness; defaults to 0.5px (equivalent to `var(--border-1)`). |
| rounded | `boolean` | `true` | Whether the line ends are rounded; rounded by default. |
| decorative | `boolean` | `true` | Whether the separator is decorative; defaults to `aria-hidden="true"`. |
| children | `Snippet` | — | Reserved for separators with text. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="命名边界"></a>

<a id="命名边界-1"></a>

### Naming boundary

The official component name is `Separator`, not `Line`. `Separator` expresses separation between UI regions or items. Chart axes, grid lines, and line-chart paths should use future chart-domain components such as `ChartLine` / `GridLine` / `AxisLine`.

If application code prefers a shorter `<Line />` name, alias `Separator as Line` locally in that application file. The library does not export an official `Line` component, avoiding confusion with chart lines, text lines, and paths.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Primary layout model: **intrinsic atomic layout**. See ../../../docs/standards/LayoutProtocol.md §12.7.

Separator size comes from `row` / `column`, `length`, `thickness`, and parent context variables. It does not arrange child elements.

Default appearance:

- Thickness: 0.5px, equivalent to `var(--border-1)`.
- Color: `var(--black-10)`.
- Rounded ends: enabled, using `var(--radius-full)`.

Since v1.2.0, ButtonGroup draws its own decorative separators between adjacent Buttons. Callers no longer need to insert Separator. Existing ButtonGroup Context parsing remains only for compatibility with older code and is not the new usage pattern.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte
<Separator />

<Separator column length="1rem" />

<Separator rounded={false} thickness="1px" />
```

---

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
