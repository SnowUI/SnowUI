# Card full reference

Reviewed against Chinese source SHA-256 `16ea03a4fd39f64201b0ae6dc6dcdf0ac11fff490161bd2367564cfe182c5d1c`.

<a id="card"></a>

# Card

<a id="组件介绍"></a>

## Overview

Card provides a consistent surface for related content. Combine text, media, and actions freely, with support for pinned items and scrolling content.

<a id="使用选择"></a>

## When to use it

Use Card for content with its own information hierarchy. The page layout handles the overall grid and spacing; avoid wrapping every nested level in another card.

- Choose the main layout with row or column, and control how content takes up space with contentFill or contentHug.
- Selected, active and interactive express selection, activation and interaction respectively; the content is provided by children, and Card does not generate business information.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Card, Frame, Text } from '@snowui-design-system/components';
</script>

<div style="display: flex; justify-content: center; width: 100%;">
	<Card style="background-color: var(--background-1);" padding={4} radius={5} width={286} height={84}>
		<Frame singleLine>
			<Text lines={1} style="font-size: var(--text-14); line-height: var(--leading-14); color: var(--black-100);">Component views</Text>
			<Text lines={1} as="trailing" style="font-size: var(--text-14); line-height: var(--leading-14); color: var(--black-100);">+11.01%</Text>
		</Frame>
		<Text style="font-size: var(--text-18); line-height: var(--leading-18); font-weight: 600; color: var(--black-100);">7,265</Text>
	</Card>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| row | `boolean` | `false` | Arranges direct content children horizontally, using the same syntax as Frame. |
| column | `boolean` | — | Arranges content vertically. If omitted, it takes the opposite value of row; row wins when both are true. |
| wrap | `boolean` | `false` | Allows content to wrap; disabled by default. |
| contentFill | `boolean` | `false` | Makes content children fill the Card content area; takes precedence over contentHug. |
| contentHug | `boolean` | `false` | Sizes content children to fit their contents. |
| selected | `boolean` | `false` | Activated state semantic alias; the function and effect are the same as `active` |
| active | `boolean` | `false` | Whether to use the active state appearance |
| interactive | `boolean` | `false` | Adds interactive appearance, a pointer cursor, and a hover border. The caller remains responsible for click effects; Card does not navigate, select, or add button keyboard behavior automatically. |
| scrollable | `boolean` | `true` | Enables internal scrolling when content overflows. Without a height constraint, content expands the Card naturally. |
| children | `Snippet` | — | Any custom content |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="关键字速查"></a>

<a id="外观"></a>

### Outward appearance

The default appearance of Card comes from the Figma Card component:

| State | Backdrop | Built-in border |
| --- | --- | --- |
| Default | `surface/1` | None |
| Hover | `surface/1` | `0.5px black/40%` |
| Active | `surface/1` | `1px primary` |

The border uses the inset `box-shadow` specified for inner borders in StyleSpec, so it does not affect layout size. Card does not stack an inner shadow on top. Activated states include:

- `active={true}`
- `selected={true}`
- Frame state machine output `data-state="Active"`

The priority of the activation state is higher than hover, and the color of the activation state border is fixed to `Primary`.

---

<a id="布局"></a>

<a id="布局-1"></a>

### Layout

Card uses `row` / `column`, which is unified with the Frame direction keyword.

```svelte
<Card>
  <Text>First row</Text>
  <Text>Second row</Text>
</Card>

<Card row>
  <Text>First column</Text>
  <Text>Second column</Text>
</Card>
```

Content width strategy:

- Automatic default: when Card has an explicit width (for example, `style="width:..."`, a width class, `w-full`, or `size-full`), regular content fills the available width. When Card hugs its content, its children hug their content too.
- `contentFill` makes both the content viewport and ordinary children fill the Card content area, preventing the viewport itself from shrinking to its contents.
- `contentHug` forces regular content to hug its contents.
- `contentFill` takes precedence when both `contentFill` and `contentHug` are set.

Default `column`:

- Gap: `4px`
- Fill child: `width: 100%`
- Hug child: `width: fit-content; max-width: 100%`

`row`：

- Gap: `8px`
- Fill child: `flex: 1 1 0; min-width: 0`
- Hug child: `flex: 0 0 auto; min-width: 0`

When `row` and `column` are passed in at the same time, `row` is given priority according to the current resolution rule of Frame.

Card does not wrap by default. Set `wrap` explicitly when items should move to another line.

---

<a id="三槽内容"></a>

<a id="三槽内容-1"></a>

### Three-slot content

Card has no `CardItem` child component. Use Frame when you need leading, content, and trailing slots:

```svelte
<Card>
  <Frame singleLine>
    <Icon as="leading">...</Icon>
    <Text lines={1}>Title</Text>
    <Button as="trailing" bare>...</Button>
  </Frame>
</Card>
```

This reuses SnowUI’s existing three-slot, Fill / Hug, gap, wrap and external-slot replacement protocols. Use singleLine for names, dates, statuses and independent text elements on one line. Effective spacing remains at least 4 CSS px when the container or root font shrinks. Declare attachments as leading / trailing to retain their size, and use Text lines={1} for truncation and full-text access. Addresses, prose, grouped statistics and wrapping card collections keep their own layout; do not force the whole Card onto one line.

---

<a id="pin"></a>

<a id="pin-1"></a>

### Pin

Card uses only the `as="pin-*"` protocol; it does not offer a `position` prop or an object-based pin configuration.

```svelte
<Card>
  <Icon as="pin-top-right">...</Icon>
  <Text>Content</Text>
</Card>
```

Nine pin positions are supported:

| Position | Syntax |
| --- | --- |
| top-left | `as="pin-top-left"` |
| top | `as="pin-top"` |
| top-right | `as="pin-top-right"` |
| left | `as="pin-left"` |
| center | `as="pin-center"` |
| right | `as="pin-right"` |
| bottom-left | `as="pin-bottom-left"` |
| bottom | `as="pin-bottom"` |
| bottom-right | `as="pin-bottom-right"` |

The default Pin offset is `12px`.

---

<a id="内容滚动"></a>

<a id="内容滚动-1"></a>

### Content scrolling

`scrollable=true` is the default. Without a height or maximum-height constraint, content expands Card naturally and no scrollbar appears.

When an external `height`, `max-height`, or class constrains Card and the content exceeds the visible area, the internal scrollbar appears automatically. It hides when content fits.

The scrollbar reuses the shared `.snowui-overlay-scrollbar*` classes from `useOverlayScrollbar` and `scrollbar.css`. Card positions the track but does not duplicate the scrollbar’s visual CSS.

Pinned content stays outside the regular content scrolling flow and remains positioned relative to the Card root.

---

<a id="样式变量"></a>

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
