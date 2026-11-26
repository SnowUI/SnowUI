# ButtonGroup full reference

Reviewed against Chinese source SHA-256 `6c458d4df4a3c570d1e931d3d91300d5eb04ec03abba90e441420d607a8fffa9`.

<a id="buttongroup"></a>

# ButtonGroup

<a id="组件介绍"></a>

## Overview

Group related buttons into one control with built-in separators, suitable for split actions and compact toolbars.

<a id="使用选择"></a>

## When to use it

Use ButtonGroup to arrange related buttons as one control. Use OverflowActions when actions must move into a More menu as space narrows.

- Place Button children directly to form a group; `showSeparator` controls the built-in dividers.
- The group uniformly provides variant / size / disabled and other configurations; the explicit size of the sub-Button can overwrite the group size.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Button, ButtonGroup } from '@snowui-design-system/components';
	import { BookOpen, FigmaLogo, GithubLogo } from '@snowui-design-system/resource-svelte';
</script>

<ButtonGroup aria-label="Button component resources">
	<Button as="item"><BookOpen />Docs</Button>
	<Button as="item"><GithubLogo />Source</Button>
	<Button as="item"><FigmaLogo />Figma</Button>
</ButtonGroup>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `ButtonGroupVariant` | `"gray"` | Shell visual variant |
| size | `ButtonGroupSize` | — | Controls the density of the shell and embedded Buttons. An explicit size wins, then the parent size context, then `sm`. A child Button can override the inherited size. |
| disabled | `boolean` | `false` | Disable the entire ButtonGroup and pass it to the internal embedded button. |
| showSeparator | `boolean` | `true` | Show decorative dividers between adjacent Button cells. `false` hides every divider without changing actions or group layout. |
| children | `Snippet` | — | Place independently actionable Buttons directly. Each direct child becomes a group cell and inherits group settings; ButtonGroup draws the dividers, so no manual Separator is needed. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="组件边界"></a>

<a id="组件边界-1"></a>

### Component boundary

- ButtonGroup is a component whose scope is its own Frame container; it does not rely on cross-Frame orchestration by the professional coordination module.
- `variant` follows Button’s `gray`, `filled`, `outline`, and `borderless` variants. `link` is unavailable because its lack of a stable button shell makes it unsuitable for dividers.
- ButtonGroup does not include Popover or Menu behavior. For a menu, place a Popover trigger or menu icon inside one Button cell.
- ButtonGroup has no separate Cell component. Cells reuse Button and its events, links, states, icon sizing, and accessibility behavior.
- ButtonGroup preserves Button’s shell-free `bare` behavior. Button still handles a lone Icon’s size context and transparent hit area.
- Buttons in a group form a composite control. Items default to `scaleOnHover=false` so adjacent cells do not overlap; a child Button can explicitly enable `scaleOnHover={true}`.

<a id="结构规则"></a>

<a id="结构规则-1"></a>

### Structural rules

Cells use `Button` directly, and decorative dividing lines are drawn by ButtonGroup between adjacent items by default:

```svelte
<ButtonGroup>
  <Button as="item" onclick={copy}>
    <Icon><Copy /></Icon>
    <Text>Copy</Text>
  </Button>
  <Button as="item" onclick={openMore}>
    <Icon><ChevronDown /></Icon>
    <Text>More</Text>
  </Button>
</ButtonGroup>
```

Turn off the built-in display when there is no need for dividing lines:

```svelte
<ButtonGroup showSeparator={false}>
  <Button as="item">Previous</Button>
  <Button as="item">Next</Button>
</ButtonGroup>
```

The direct `Separator as="separator"` in the old code will be hidden by ButtonGroup to avoid duplication with the built-in dividing line after upgrading; these manual Separators should be deleted during migration. Other explicit content is still rendered according to the content of ordinary containers and will not be treated as ButtonGroup items.

The internal Button automatically enters the embedded state as a direct sub-item of ButtonGroup:

- Retain independent `onclick` / `href` / state machine / dynamic effect / barrier-free ability.
- Remove the Button’s own background, border, and radius while retaining the cell padding assigned by ButtonGroup.
- Keep your own content layout and gap in the cell.
- Inherit ButtonGroup’s `size`, `variant`, and `disabled` by default. Explicit child values can override size and variant.
- ButtonGroup will automatically mark the cell position of the direct Button: `only` / `first` / `middle` / `last`, and the consumer does not need to handwrite `as="first"` / `as="last"`.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: **inline shell layout**. See `docs/standards/LayoutProtocol.md` §12.4.

- ButtonGroup root layer manages shell rounded corners, background, border and cropping; visual padding is transferred to embedded Button to ensure that the hover/click hot area of each cell covers its own complete cell.
- ButtonGroup root layer explicitly closes Auto Layout; the layout gap between Button cells is always `0`, and the visual distance from the content to the built-in dividing line is only expressed by the inner padding of the adjacent Button. The Button hover box must be continuous with the dividing line boundary.
- If the consumer adds padding to the ButtonGroup root layer (such as `class="p-40"` or inline `padding`), ButtonGroup will map the root padding to the extension area covered by the head and tail cell hover; hover still responds independently by cell and is cropped by the root corner.
- ButtonGroup shares Button’s visual tokens: `--snowui-button-padding-block`, `--snowui-button-padding-inline`, `--snowui-button-radius`, `--snowui-button-background`, `--snowui-button-color`, `--snowui-button-border-*`, `--snowui-button-font-size`, and `--snowui-button-line-height`. Only group-specific inner spacing, Separator length, and outer-padding expansion variables belong to ButtonGroup.
- Button manages the gap of Icon / Text / Spinner inside the cell.
- The built-in dividing line does not occupy the layout and does not express the spacing through margin; the space from the cell to the dividing line is borne by the cell padding of the embedded state Button.
- The outer padding is the distance between the cell content and the edge of ButtonGroup, using the padding-x of Button; the inner padding is the distance between the cell content and the Separator, using the gap of ButtonGroup.
- The outer padding is used on the left side of the first cell, and the inner padding is used on the right side; the outer padding is used on the right side of the tail cell, and the inner padding is used on the left side; inner padding is used on both sides of the middle cell. Multiple cells are automatically applied in DOM order.
- The root defaults to `width: max-content` and `align-self: flex-start` so a parent such as `flex-col` does not stretch it horizontally.
- Cells hug their content by default; they are not stretched to equal widths.
- The Hover state is responded by each internal Button cell separately, and the ButtonGroup shell does not change the whole hover color; the cell hover color rule is consistent with the button corresponding variant.
- The ButtonGroup shell applies `opacity: 0.2` when disabled. Embedded Buttons inherit disabled semantics without reducing opacity again.
- The content does not use three-slot semantics; `as="leading"` / `as="trailing"` only represents the accessory role of ButtonGroup as the outer host, and does not change the internal arrangement of ButtonGroup.

<a id="验收覆盖"></a>

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
