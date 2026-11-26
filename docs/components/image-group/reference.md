# ImageGroup full reference

Reviewed against Chinese source SHA-256 `b8e1598c87a224cc62af2aee207bae56df52b4647517eb596904e44f9a09f9a3`.

<a id="imagegroup"></a>

# ImageGroup

<a id="组件介绍"></a>

## Overview

Give multiple images a shared size and layout, with group previews for galleries, attachments, and image collections.

<a id="使用选择"></a>

## When to use it

Use ImageGroup to organize images under shared settings. Pair it with ImageViewer for full-screen viewing, zoom, or group navigation; express layout and loading state through public APIs.

- Choose the group layout with `layout` and share image dimensions with `size`.
- Image children join the media group automatically. Explicit child `size` or `previewMode` overrides the group default.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Image, ImageGroup } from '@snowui-design-system/components';
	import { ImageViewer } from '@snowui-design-system/components';
	import cover01 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-01-1024.jpg';
	import cover02 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-02-1024.jpg';
	import cover03 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-03-1024.jpg';
	import cover04 from '@snowui-design-system/resource-base/assets/backgrounds/gradient-04-1024.jpg';
</script>

<ImageGroup size={80} style="flex-wrap: wrap; max-width: 100%;">
<Image src={cover01} alt="SnowUI gradient resource 1"  />
<Image src={cover02} alt="SnowUI gradient resource 2"  />
<Image src={cover03} alt="SnowUI gradient resource 3"  />
<Image src={cover04} alt="SnowUI gradient resource 4"  />
</ImageGroup>
<ImageViewer />
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| size | `ImageGroupSize` | — | Set a shared size for images in the group. |
| layout | `ImageGroupLayout` | `"row"` | Layout mode |
| previewMode | `PreviewMode` | — | Default preview mode for child Images. When omitted, the presence of a shared page-level Viewer determines the mode. |
| enableResponsive | `boolean` | `true` | Enable the Frame responsive ability and adjust the collection layout according to the public responsive configuration. |
| enableContext | `boolean` | `true` | Whether to provide general Frame context to children. Image group sizing and preview policy still use a dedicated group context. |
| children | `Snippet` | — | Images in the group register their media automatically and inherit group sizing and preview policy; explicit child settings take precedence. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: managed composite layout.

- The regional structure of ImageGroup is group root / media item collection / preview registration.
- Image children retain intrinsic atomic layout. ImageGroup manages only row/column/grid arrangement, shared size context, and Viewer registration.
- `previewMode` is a collection preview strategy that does not change the internal layout model of the sub-item Image.
- ImageGroup does not embed ImageViewer. A separate page-level Viewer consumes its registered group list.

<a id="功能概览-user"></a>

<a id="功能概览-user-1"></a>

### User-facing features

- Share image size within the group.
- Support `row` / `column` / `grid` layouts.
- Use a fixed default gap of 4px.
- Provide a multi-image preview index to a page-level ImageViewer.
- Collect child Image media automatically for the page-level Viewer.

<a id="api-参考-user"></a>

<a id="2-视觉规则"></a>

### 2. Visual rules

1. All three layouts (`row`, `column`, and `grid`) use a fixed 4px gap (`var(--gap-1)`); no `gap` prop is exposed.
2. `stack` is not supported; layouts are limited to linear and grid arrangements.
3. Images inherit group `size` by default; an explicit child `size` takes precedence.
4. `grid` defaults to two columns so it does not appear as a single row without another column definition.
5. Each child Image registers its `src` and `alt` for the page’s single ImageViewer to open and navigate.
6. At Viewer opening, pass the group-list snapshot by stable reference without copying the array again.
7. The group media registry uses in-place `push` / `splice` to reduce short-lived allocations during mount and unmount.
8. `previewMode` is passed down as the default for child Images; an explicit child setting takes priority. If both omit it, join a shared page Viewer when available, otherwise fall back to `window`.

<a id="3-使用示例"></a>

### 3. Examples

```svelte
<ImageGroup size={48}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image />
</ImageGroup>
```

```svelte
<ImageGroup layout="grid" size={80}>
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
    <Image src={Image01} />
</ImageGroup>
```

- ImageGroup does not expose a `gap` prop; spacing is fixed at 4px.
- If gallery selection is added later, keep group-provided shared sizing as the primary path.
- ImageGroup does not embed ImageViewer. With one automatic Viewer at the page root, groups without explicit `previewMode` share it.

---

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
