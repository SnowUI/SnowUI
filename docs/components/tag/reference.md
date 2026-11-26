# Tag full reference

Reviewed against Chinese source SHA-256 `dd09efc9d963b6ac470e47e390f3bf974307f1dec90f9ce1b4f7ad2b24fce077`.

<a id="tag"></a>

# Tag

The tag root uses Frame singleLine by default and retains its internal zero-gap exception. External icon-label combinations still use the general 4 CSS px minimum.

<a id="组件介绍"></a>

## Overview

Use interactive tags for labels, filters, or path segments to organize content and narrow a selection.

<a id="使用选择"></a>

## When to use it

Use Tag for bounded label content and its public close action. Closing and selection have different meanings; use a dedicated button or selection control when needed.

- `closable` shows the close action, and `onClose` tells the page to remove the data. Closing does not change the page’s list automatically.
- `variant`, `shape`, and `toggle` control appearance, shape, and toggle behavior. `parts` configures only the generated close button.
- The built-in close button name follows LocaleProvider and supports Provider messages overrides. The caller still owns tag content and removal after onClose.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Tag, Button, Frame, ScrollArea } from '@snowui-design-system/components';
</script>

<ScrollArea axis="horizontal" horizontalTrackPosition="viewport" style="max-width: 100%;"><Frame singleLine gap={3} width="max-content" minWidth="100%" class="justify-center">
	<Tag toggle>Design</Tag>
	<Tag toggle>Engineering</Tag>
	<Tag toggle>Product</Tag>
</Frame></ScrollArea>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | Configure the generated close Button without affecting buttons explicitly supplied in `children`. |
| variant | `"default" \| "active"` | `"default"` | Visual variant. `default` = Black/4% background; `active` = Brand 10% background + Brand text |
| toggle | `boolean` | `false` | Shorthand for toggle mode. Internally injects `Click={{ Idle: "Active", Active: "Idle" }}` and `whileClick=false`. Frame’s `data-state="Active"` triggers the Brand active style, and `aria-pressed` is emitted automatically. Consumers can explicitly override `Click` and `whileClick`. |
| closable | `boolean` | `false` | Show the built-in close X, which becomes visible on Tag hover. |
| shape | `"default" \| "left-arrow" \| "right-arrow"` | `"default"` | Shell shape, used for path / breadcrumb fragment |
| onClose | `(event: MouseEvent) => void` | — | Called when X is clicked. Tag is not destroyed automatically; the consumer decides how to remove it. |
| children | `Snippet` | — | The label display content is undertaken by the children rendering protocol of Frame; the close button is managed separately by the component. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="设计形态"></a>

<a id="设计形态-1"></a>

### Design forms

The Tag forms in the design are composed from these capabilities:

| Form | Component composition | Description |
| --- | --- | --- |
| `Tag` | `<Tag>Label</Tag>` | Text only |
| `Tag ×` | `<Tag closable>Label</Tag>` | Text with built-in close X |
| `● Tag` | External `<Icon as="leading">` + Tag | The leading dot is not built in; consumers add it explicitly. |
| `● Tag ×` | External leading Icon + `closable` | Icon, text, X follow the same inline shell layout |
| Brand color `● Tag ×` | `variant="active"` or `toggle` switches to Active. | Brand activation state |
| `< Tag` | `shape="left-arrow"` | Path / Breadcrumb fragment |
| `Tag >` | `shape="right-arrow"` | Path / Breadcrumb fragment |

The leading dot in the design is composition only; Tag has no built-in leading Icon. `closable` supplies X. X touches the text in the design, so the default `gap` is 0. Overriding `--snowui-tag-gap` or passing `gap` changes spacing among Icon, text, and X together.

<a id="与-chip-badge-的区分"></a>

<a id="与-chip-badge-的区分-1"></a>

### Tag compared with Chip and Badge

| Dimension | Tag | Chip | Badge |
| --- | --- | --- | --- |
| Built-in leading dot | No | Yes | — |
| Close X | Built-in (`closable`) | No | — |
| Active state | Built-in (`variant="active"`) | No (external class controls color) | — |
| Arrow shell | Built-in (`shape`) | No | — |
| Size options | Single size | sm / lg | Multiple sizes |
| Primary purpose | User label / filter / path segment | Status / Classification Display | Count / dot badge |
| Layout | Inline shell (same as Button) | Three slots | Inline shell |

<a id="组件特有属性-component-specific-props"></a>

<a id="组件特有属性-component-specific-props-1"></a>

### Component-specific props

> **No `size` prop**: the design has one size.

<a id="关键字-keyword"></a>

<a id="关键字-keyword-1"></a>

### Keywords

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| as | `'leading' \| 'trailing'` | - | Role as a slot in an external container such as Field. |

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **inline shell** (as in Button). See `docs/standards/LayoutProtocol.md` §12.4.

- Children are laid out with `gap`. Override `--snowui-tag-gap` or pass `gap` to change spacing among all children, including the built-in X and text or an external Icon and text.
- **No built-in leading Icon**; consumers add a dot explicitly with `<Icon as="leading">`.
- `closable={true}` renders X at the end. Its visuals and hover use `Button bare emphasis="muted"` (the default icon is Components’ semantic `close`, whose packaged shape snapshot comes from `close-regular.svg`). It occupies no space by default (`width: 0; min-width: 0`), appears when Tag is hovered, and reaches full opacity when X itself is hovered. In the active state, X uses Brand at 40% opacity, rising to 100% on X hover.
- **Padding depends on edge content** (matching Figma): text has 8px from the edge; Icon/X has 4px. A MutationObserver checks the actual first and last nodes, including text nodes, and sets `data-edge-left` / `data-edge-right` to `"icon"` or `"text"`. CSS `[data-edge-*="icon"]` reduces the relevant side from 8px to 4px. CSS `:first-child` / `:last-child` sees elements only, so it cannot detect trailing text. The generated X is excluded from edge detection; `[data-closable]:hover` separately controls right padding.
- Arrow shapes (`left-arrow` / `right-arrow`) use a private SVG background path outside child layout. ResizeObserver reads current width and height to generate the full outline, rounding every corner with quadratic Bézier curves to approximate Workshop `node-id=11951-40471`.

<a id="无障碍-accessibility"></a>

<a id="无障碍-accessibility-1"></a>

### Accessibility

Consistent with Button, automatically output `aria-pressed`:

- When `variant="active"` maps to `currentState="Active"`, or `toggle` / `Click={{ Idle: "Active", Active: "Idle" }}` switches to Active, the root emits `aria-pressed="true"`; in Idle it emits `aria-pressed="false"`.
- Explicit consumer `aria-pressed` or `aria-selected` values take precedence. Use `aria-selected` in list selection contexts.
- The close X is a real button with type="button". Its built-in name follows LocaleProvider (default Chinese or English "Close tag"); it remains keyboard accessible.
- Clicking X calls `stopPropagation()` so it does not trigger the Tag root’s `onclick`. The consumer still decides removal in `onClose`.

<a id="布局变量链"></a>

<a id="布局变量链-1"></a>

### Layout variable chain

<a id="用法示例"></a>

<a id="用法示例-1"></a>

### Usage examples

```svelte

<Tag>Label</Tag>


<Tag closable onClose={() => remove('foo')}>Label</Tag>


<Tag>
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Label
</Tag>


<Tag variant="active" closable>
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Filtered
</Tag>


<Tag toggle>Filter</Tag>


<Tag closable style="--snowui-tag-gap: 4px;">
    <Icon as="leading"><DotCircle Weight="fill" /></Icon>
    Label
</Tag>


<Tag shape="right-arrow">Home</Tag>
<Tag shape="left-arrow">Settings</Tag>


<Tag shape="right-arrow" closable>Filters</Tag>


<Tag whileClick={false} Click={{ Idle: "Active", Active: "Idle" }}>
    Label
</Tag>


<Tag aria-selected={isSelected} variant={isSelected ? "active" : "default"}>
    Label
</Tag>
```

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
