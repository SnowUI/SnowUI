# Breadcrumb full reference

Reviewed against Chinese source SHA-256 `9f76a76f7545d4d4c56469ef9046101e5b01d4ed6cc68edd6ada274767a61421`.

<a id="breadcrumb"></a>

# Breadcrumb

<a id="组件介绍"></a>

## Overview

Show the current page’s hierarchy so users can see where they are and navigate to a parent page.

<a id="使用选择"></a>

## When to use it

Use Breadcrumb for the current page hierarchy. Use Tab to switch content at one level and Sidebar for application navigation. The page handles routing.

- Items generate the path, and the last item automatically becomes the non-interactive current page.
- Explicit children use `Button as="item"` and `Text as="separator"` to replace items; parts only configure the default generated content.
- The default navigation name follows LocaleProvider; an explicit ariaLabel takes priority. Path labels and business content remain unchanged.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Breadcrumb } from '@snowui-design-system/components';
</script>

<Breadcrumb
	ariaLabel="SnowUI component page path"
	items={[
		{ label: 'Components' },
		{ label: 'Navigation' },
		{ label: 'Breadcrumb' }
	]}
/>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| ariaLabel | `string` | `Locale message` | Accessible name for the root navigation. When omitted, follows LocaleProvider; an explicit ariaLabel takes priority. |
| gap | `number` | — | Inherited Frame gap token index for preferred row and column spacing between path elements. Omit it to retain existing preferences. Effective spacing stays at least 4 CSS px, including zero and font/gap scaling. Larger preferences and default single-line layout are preserved. |
| variant | `BreadcrumbVariant` | `"borderless"` | Default variant for internally generated Button as="item" entries. An explicit child Button variant or parts override may take precedence. |
| children | `Snippet` | — | Explicit Button as="item" and Text as="separator" children replace generated items and separators. The last item still becomes the current page. |
| items | `BreadcrumbItem[]` | `[]` | Built-in path entries, each with label and optional href or disabled. Generates Buttons and separator Text. The last entry is the non-interactive current page. Ignored when children is supplied. |
| separator | `string` | `"/"` | Separator text between built-in items. Used only in items mode; explicit composition declares as="separator" itself. |
| parts | `ComponentPartsOf<{ Button: typeof Button; Text: typeof Text }>` | — | Configure generated Buttons and separator Text through parts. Explicit children do not inherit it. Breadcrumb still owns current-page and role semantics. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="功能概览"></a>

<a id="功能概览-1"></a>

### Feature overview

- Default items API + explicit combination advanced API.
- The last `as="item"` is automatically used as the current page.
- The default Button variant can be provided to the internal `Button as="item"` through `variant`.
- Non-current items are 40% opaque by default and return to 100% on hover.
- Items share one navigation composition, so Button hover scaling is off by default. An item can explicitly set scaleOnHover={true}.
- The current page item outputs `aria-current="page"`, which cannot be hovered, clicked, or keyboard activated.
- The separator uses `14px / 20px` and `black/10%` by default.

---

<a id="api-参考"></a>

<a id="子级角色"></a>

### Child roles

| Role | Recommended markup | Description |
| --- | --- | --- |
| item | `<Button as="item">...</Button>` | One item in the breadcrumb path. |
| separator | `<Text as="separator">/</Text>` | Separator. Declare it directly in explicit composition; default items mode also supports the separator prop. |

SnowUI components use `as="item"` / `as="separator"`; native elements use `data-as="item"` / `data-as="separator"`.

<a id="使用示例"></a>

<a id="基础用法"></a>

### Basic usage

```svelte
<Breadcrumb>
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item">Default</Button>
</Breadcrumb>
```

<a id="统一-button-变体"></a>

### Unified Button variant

```svelte
<Breadcrumb variant="borderless">
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item" variant="outline">Custom</Button>
    <Text as="separator">/</Text>
    <Button as="item">Default</Button>
</Breadcrumb>
```

Breadcrumb variant supplies the default for item Buttons without their own variant. An explicit Button variant takes precedence. If Breadcrumb has no variant, each Button uses its own default.

<a id="多级路径"></a>

### Multi-level path

```svelte
<Breadcrumb>
    <Button as="item" href="/">Home</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/dashboards">Dashboards</Button>
    <Text as="separator">/</Text>
    <Button as="item" href="/dashboards/default">Default</Button>
</Breadcrumb>
```

The last item becomes the current page automatically. Even when it has href, clicking it does not navigate.

<a id="行为规则"></a>

<a id="行为规则-1"></a>

### Behavior rules

1. The current page is fixed to the last `as="item"` / `data-as="item"` in Breadcrumb.
2. `currentIndex` is not provided, and it is not supported to specify any item as the current page.
3. The current item automatically sets `aria-current="page"`, `data-current="page"`, `tabindex="-1"`.
4. The current item does not respond to Button hover, click, Enter, or Space.
5. Separator automatically sets `aria-hidden="true"`.
6. Breadcrumb's `variant` only affects the default Button variant of `Button as="item"` and does not override the sub-level explicit `variant`.
7. Breadcrumb provides the default value of `scaleOnHover=false` for item; the explicit value of the sub-level Button takes precedence.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Primary layout model: **inline shell layout**. See ../../../docs/standards/LayoutProtocol.md §12.4.

- Breadcrumb renders a nav root whose content hugs its intrinsic width.
- The root uses inline-flex and does not wrap by default.
- Child Buttons keep their own inline shell layout.
- Child Text keeps its own text-flow layout.
- Breadcrumb only manages the root gap, separator style, non-current transparency and the last current state.
- Effective spacing between path elements stays at least 4 CSS px, including explicit gap=0 and font/gap scaling; larger preferences are retained. The root uses flex-wrap: nowrap by default without automatically collapsing or hiding path items. Button owns its internal single-line content.

Layout variable chain:

---

<a id="2026-11-13-行为同步"></a>

### Behavior updates (2026-11-13)

When Button backdrop blur is configured, inactive items dim only their content, preserving the opacity of the button and blur layer. Hover restores content opacity. Separators use Black 10 without additional opacity.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
