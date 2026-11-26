# Skeleton full reference

Reviewed against Chinese source SHA-256 `d403e4c56e80291f8ef7f118ede9932b32a5d7c9489ff19f58c37ec8a28feca9`.

<a id="skeleton"></a>

# Skeleton

<a id="组件介绍"></a>

## Overview

Show placeholder shapes while content loads so users can anticipate the page structure and the layout stays stable.

<a id="使用选择"></a>

## When to use it

Use Skeleton for loading placeholders. If a component already supports `loading` / `skeleton`, set that state and let the component provide its own shape instead of redrawing it on the page.

- `loading=false` renders real `children`; while loading, use `variant` / `width` / `height` or `renderHints` to define the placeholder.
- Prefer the host component’s `loading` placeholder. Standalone skeleton dimensions and radii still use design-system tokens.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the following sections for more scenarios and composition limits.

```svelte
<script lang="ts">
	import { Skeleton, Frame } from '@snowui-design-system/components';
</script>

<Frame row enableAutoLayout={false} style="width: min(100%, 20rem); display: flex; align-items: center; gap: var(--gap-3);">
	<Skeleton variant="circle" width={48} height={48} />
	<Frame column enableAutoLayout={false} style="flex: 1; min-width: 0; gap: var(--gap-2);"><Skeleton variant="line" width="42%" height={14} /><Skeleton variant="line" width="92%" height={12} /><Skeleton variant="line" width="68%" height={12} /></Frame>
	<Skeleton variant="rect" width={72} height={32} />
</Frame>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `SkeletonVariant` | — | The skeleton shape is explicitly specified; the alias will be normalized to `line / circle / rect` |
| width | `string \| number` | — | Explicit width; numeric values are converted to `rem`. |
| height | `string \| number` | — | The explicit height; the number will be automatically converted to `rem` |
| componentClass | `string` | — | Compatibility input for older callers. Historical defaults apply only without `renderHints`; new components must not register through this prop. |
| renderHints | `FrameRenderHints` | — | Component self-registration protocol supporting `variant` / `width` / `height` / `radius` / `rows`. |
| group | `boolean` | `false` | Represent children as one loading surface. Keep their layout and mounted state while hiding content and interaction; reveal them in place when ready. |
| loading | `boolean` | `true` | Whether to show the placeholder. false reveals children; group mode preserves their mounted state. |
| responsive | `ResponsiveConfig` | — | Responsive width and height overrides. |
| class | `string` | `""` | External class; applied to the layout container for multiple skeletons or the block itself for one skeleton. |
| style | `string` | `""` | Inline style; applied to the layout container for multiple skeletons or the block itself for one skeleton. |
| children | `Snippet` | — | Real child content without parameters. Mounted only when ready by default, or continuously in group mode. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only the named public props declared in this component’s source.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

- Server-rendered content that is ready is shown directly. Skeleton represents actual pending loading and does not cover all components merely because the page refreshed.
- Avatar, Image and Icon track string media sources and show placeholders while loading; they exit on success or failure. Component resources and ready content do not simulate loading.
- Account, list and other business-data loading states come from the data source through the existing loading protocol; pages do not handwrite Skeleton graphics. Component mounting or a URL alone cannot identify when arbitrary business requests finish.

<a id="布局模型"></a>

<a id="整体分组"></a>

### Grouped loading

Use `<Skeleton group loading={pending}>...</Skeleton>` to represent a background and multiple elements as one loading region. It displays one rectangular placeholder while keeping children mounted and preserving their input and component state. The caller controls loading from actual readiness; the group does not automatically wait for child components or network requests.

Groups fill the available width and derive height from content. Reserve space with height or a min-height style before asynchronous content exists. renderHints.radius controls the group radius; class and style apply to its root. variant, rows, and legacy componentClass do not split the surface. Groups stay in normal flow and do not clip overlays. Portals moved outside the group are outside its hiding boundary. Nested loading groups display only the outermost loading surface.

<a id="布局模型-1"></a>

### Layout model

Main layout model: intrinsic atomic layout.

- As a placeholder primitive, Skeleton takes dimensions first from the component’s `renderHints`. Explicit `variant` / `width` / `height` override those hints; legacy `componentClass` mappings are compatibility only. As a child of an external layout, it hugs content or uses the caller’s fixed dimensions.
- Multiple text lines and overlapping avatar-group placeholders are private Skeleton layouts that mimic the target component. They do not expose a general-purpose region protocol.
- Skeleton does not output `data-auto-layout`; Frame's loading protocol is responsible for deciding whether to render Skeleton, and Skeleton itself does not take over the host layout.

<a id="1-适用范围"></a>

<a id="适用范围"></a>

### Scope of application

- Render Skeleton explicitly in a test or demo to inspect its defaults.
- Frame calls it internally as the default placeholder in the `loading + skeleton` protocol.
- Use component `renderHints` to supply final skeleton dimensions and row counts.

<a id="2-输入协议"></a>

<a id="22-renderhints-规则"></a>

### 2.2 `renderHints` rules

Percentage width and height for a single skeleton resolve against its outer host. The internal layout provides a containing block so percentage dimensions do not collapse inside flex controls. Fixed-size Hug behavior is unchanged.

| Field | Type | Description |
| --- | --- | --- |
| `variant` | `"line" \| "circle" \| "rect"` | Override the default skeleton shape |
| `width` | `string \| number` | Override the default width |
| `height` | `string \| number` | Override the default height |
| `radius` | `string \| number` | Override skeleton radius; numbers become `rem` using a nominal 16px base. |
| `rows` | `number` | Values above `1` expand into multiple `line` placeholders; the last line is 30% of the container width. |

Without `radius`, a non-circular Skeleton uses `var(--radius-3, 0.75rem)`; `circle` always uses `50%`. Legacy Icon class mappings retain a compatible `rect + 50%` appearance.

<a id="3-解析顺序"></a>

<a id="解析顺序"></a>

### Resolution order

Skeleton resolves its layout in this order:

1. With `renderHints`, the component is considered self-registered and the layout uses those hints; explicit `variant` / `width` / `height` override individual fields.
2. Without hints, explicit `variant` / `width` / `height` render a single skeleton.
3. Only legacy callers without hints or explicit geometry use the historical `componentClass` layout.
4. If nothing matches, fall back to a generic `rect` skeleton.

<a id="4-默认样式规则"></a>

<a id="41-通用样式"></a>

### 4.1 General style

| Rule | Value |
| --- | --- |
| Background color | `var(--black-10, #0000001a)` |
| Animation | `snowui-skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` |
| Interaction | `pointer-events: none; user-select: none;` |
| Display | `display: block` |

<a id="42-布局容器样式"></a>

### 4.2 Layout container style

Supplementary rules:

- `.snowui-skeleton-layout-single` will cut back to `display: block`.
- `.snowui-skeleton-layout-text` will change to vertical layout: `width: 100%; flex-direction: column; align-items: stretch;`
- `.snowui-skeleton-layout-avatar-group` Keep `gap: 0`.

<a id="43-形状默认值"></a>

### 4.3 Shape default value

| Shape | Default width | Default height | Default radius |
| --- | --- | --- | --- |
| `line` | `6rem` | `1.25rem` | `var(--radius-3, 0.75rem)` |
| `circle` | `2.5rem` | `2.5rem` | `50%` |
| `rect` | `6rem` | `3rem` | `var(--radius-3, 0.75rem)` |

Supplementary rules:

- The default rounded corners of `line` and `rect` are unified as `12px`.
- `circle` always uses `border-radius: 50%`.
- `line`, `circle`, and `rect` all use `max-width: 100%; max-height: 100%` as a fallback.

<a id="5-组件自注册规则"></a>

<a id="文本骨架规则"></a>

### Text skeleton rules

Any registered component can be expanded into multiple text skeletons with `renderHints.rows`; Text will automatically calculate the number of lines according to the content.

<a id="61-行数来源"></a>

### 6.1 Source of the number of lines

- `Text` itself will count the number of first-level block-level text paragraph nodes in the skeleton state.
- The following tags are counted:
  - `div`
  - `p`
  - `li`
  - `blockquote`
  - `h1-h6`
- Direct text at the first level adds one more row.
- At least one row is rendered.

<a id="62-多条文字骨架布局"></a>

### 6.2 Multi-text skeleton layout

| Rule | Value |
| --- | --- |
| Layout direction | Stacked vertically |
| Container width | `renderHints.width` / The width of the first line; `100%` when not provided |
| Earlier row widths | `100%` |
| The width of the last line | `30%` |
| Single-line height | `1.25rem` |

<a id="7-第一层渲染规则"></a>

<a id="第一层渲染规则"></a>

### The rendering rules of the first layer

Skeleton does not recursively inspect the whole component tree; it examines only the first level.

- When a component itself enters `loading + skeleton`, render its own Skeleton first.
- Do not continue to expand subcomponents such as `Icon / Text / Avatar` inside the component.
- When `Frame` enters `loading + skeleton`:
  - If first-level direct children are self-registered components, render only their corresponding Skeletons.
  - If there are no components at the first level, Frame falls back to a text-shaped Skeleton.

<a id="8-尺寸规则"></a>

<a id="尺寸规则"></a>

### Size rules

- The number `width / height` will be converted to `rem`.
- `Skeleton` gives priority to the final geometry provided by the component through `renderHints.width / height / radius / rows`.
- When a component provides size hints, its rounded-rectangle Skeleton follows the final component width and height instead of falling back to a generic short width.
- Ordinary placeholders do not measure the DOM. Groups follow the layout of continuously mounted children without reproducing their internal shapes.

<a id="9-上下文与协议关系"></a>

<a id="使用示例"></a>

### Usage examples

```svelte

<div class="flex flex-col gap-8">
    <Skeleton variant="text" width="12rem" />
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="rectangular" width="16rem" height="6rem" />
</div>


<Frame loading={pageLoading}>
    <Button>Submit</Button>
    <Text>Loading text</Text>
</Frame>


<Frame loading skeleton>
    <Button variant="filled">
        <Icon />
        <Text>Search</Text>
    </Button>
</Frame>


<Text loading skeleton class="w-full">
    <div>Paragraph one</div>
    <div>Paragraph two</div>
    <div>Paragraph three</div>
</Text>


<Frame
    loading={pageLoading}
    skeleton={false}
    whileLoad={{ opacity: 0.6, scale: 0.98 }}
>
    <Button>Submit</Button>
</Frame>
```

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
