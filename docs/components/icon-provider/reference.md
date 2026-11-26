# IconProvider full reference

Reviewed against Chinese source SHA-256 `8b1bfb6a8cb8085657699c4e9f1427a2b5af7ecb4acd6d5c6b050bb13245b777`.

<a id="iconprovider"></a>

# IconProvider

<a id="组件介绍"></a>

## Overview

Replace SnowUI’s built-in functional icons across an application or local subtree. Unconfigured icons keep their component defaults.

<a id="使用选择"></a>

## When to use it

Use IconProvider to share icon configuration with descendants. It renders no visible icon; Icon or an icon resource component still renders the actual graphic.

- `icons` maps names to components; `resolver` resolves an icon by name.
- It affects icon resolution only in its descendant subtree and renders `children` unchanged. It adds no visible graphic or layout wrapper.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { ColorSchemeButton, CopyButton, IconProvider } from '@snowui-design-system/components';
	import { createSnowUIComponentIconResolver } from '@snowui-design-system/resource-svelte';
	const resolver = createSnowUIComponentIconResolver({ collection: 'phosphor', fallbackCollections: ['snowui'] });
</script>

<IconProvider resolver={resolver}>
<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--gap-4) var(--gap-3); max-width: 100%;">
    <CopyButton text="pnpm add @snowui-design-system/components">Copy install command</CopyButton>
    <ColorSchemeButton applyToDocument={false} ariaLabel="Preview theme" />
</div>
</IconProvider>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| icons | `ComponentIconMap` | `{}` | Maps stable semantic names to external Svelte icon components. |
| resolver | `ComponentIconResolver` | — | Resolves an icon from `{ name, weight }`; takes precedence over `icons` at the same provider level. |
| children | `Snippet` | — | The child subtree, rendered unchanged. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="概览与选择边界"></a>

<a id="概览与选择边界-1"></a>

### Overview and selection boundaries

`IconProvider` is a nonvisual context provider. Without one, components use the default functional icons bundled with the Components package. With `icons` or `resolver`, built-in icons in the subtree use the configured external icon library unless an instance Snippet or named role explicitly replaces them.

It does not replace `<Icon>` elements, resource icons, or ordinary children explicitly supplied by the caller. Use a component’s public Icon Snippet or named role to replace one instance; use IconProvider to switch the icon library for an entire application subtree.

<a id="import"></a>

<a id="import-1"></a>

### Import

```svelte
<script lang="ts">
    import { IconProvider } from "@snowui-design-system/components";
</script>
```

<a id="api-1"></a>

### API

At one provider level, resolution tries `resolver` before `icons`. On a miss it checks the next outer provider, then falls back to the component’s built-in default icon. Changing the `resolver` or `icons` Prop updates the current subtree. External icon components receive standardized rendering parameters including `size`, `color`, `weight`, `class`, `data-as`, and ARIA attributes.

<a id="示例"></a>

<a id="示例-1"></a>

### Examples

```svelte
<script lang="ts">
    import { IconProvider, CopyButton } from "@snowui-design-system/components";
    import { Copy, Check } from "my-icon-library";

    const appIcons = { copy: Copy, check: Check };
</script>

<IconProvider icons={appIcons}>
    <CopyButton text="SnowUI" />
</IconProvider>
```

<a id="无障碍与组合边界"></a>

<a id="无障碍与组合边界-1"></a>

### Accessibility and composition boundaries

IconProvider creates no DOM node. The component that owns an action remains responsible for its functional name, a Button’s `aria-label`, hit area, and state. External icons replace graphics only; they do not take over events or accessible names.

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
