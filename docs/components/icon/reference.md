# Icon full reference

Reviewed against Chinese source SHA-256 `6d94ceb86532232611d2b5c5d283ad6703a4149f8baf6ab83fdb10a626728402`.

<a id="icon"></a>

# Icon

<a id="组件介绍"></a>

## Overview

Display SVG icons with consistent size and color in buttons, navigation, and content.

<a id="使用选择"></a>

## When to use it

Use Icon as a consistent host for icons and sizing. Prefer SnowUI resource icons. For an action, place Icon inside Button and give the button an accessible name.

- Prefer resource icons. Render `children` only when neither `src` nor a resolved `icon` is available.
- Size can inherit the parent size; the corner label uses Badge as="badge". The interaction name should be provided to the button that owns the operation.
- The `Icon as="leading"` in Accordion inherits the Accordion icon size when `size` is not explicitly specified: sm/md/lg are 16/20/24 respectively; Icon that does not declare leading does not participate in this inheritance, and the explicit `size` takes precedence.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Icon } from '@snowui-design-system/components';
	import { IconSet } from '@snowui-design-system/resource-svelte';
	const sizes = [12, 16, 20, 24, 28, 32, 40, 48, 80] as const;
</script>

<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--gap-4) var(--gap-3); max-width: 100%;">
{#each sizes as size}
    <Icon icon={IconSet} {size} aria-label={`Component icon, size ${size}`} />
{/each}
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| src | `string` | — | Icon picture URL |
| icon | `Component<any>` | — | Directly render the resource-svelte icon component. |
| stateIcon | `StateValueMap<Component<any> \| null>` | — | Resolve the icon from the nearest parent Frame’s `currentState`. Fall back to `Idle`, then to `icon`, `src`, or `children`. |
| size | `IconSize` | — | Icon size. When not explicitly set, it automatically inherits the parent `Frame` to provide the size context. |
| background | `boolean` | `false` | Whether to display the background |
| weight | `string` | — | Visual weight passed to the icon resource: thin, light, regular, bold, fill, or duotone when supported. If omitted, the host context determines it. |
| as | `\| "badge" \| "icon" \| "prev" \| "next" \| "close" \| (string & {})` | `"icon"` | Role: as an independent icon, logo, picture center icon or Viewer control icon |
| children | `Snippet` | — | The icon content is combined with the corner mark; it is rendered only when both src and the parsed icon are not hit; the resource icon and Badge as="badge" can be put in at the same time, and the corner mark is positioned by the host. |
| badgePosition | `"top" \| "bottom"` | `"top"` | The position as the host of the corner mark: top is the upper right, and the bottom is the lower right. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

String icon sources automatically show a Skeleton at the registered size while loading. The Skeleton exits on success or failure without a page-authored placeholder. Set `skeleton={false}` to disable it.

<a id="布局模型"></a>

<a id="布局模型-1"></a>

### Layout model

Main layout model: internal atomic layout.

- The root node of Icon is an inner box jointly determined by `size`, `background` padding and icon resources, which is expressed as Hug as other layout sub-items.
- `as="leading" / "trailing" / "icon" / "badge" / "prev" / "next" / "close"` only declares the role of Icon in the external host; when entering the Image / ImageViewer host, it will be translated by the host context to the corresponding `pin-*` direction.
- Background, empty space, badge overlay, and resource rendering are Icon’s private layout; Icon does not expose general slots.
- When icons and text are required externally, the host components such as Button, MenuItem and Frame should be responsible for gap / padding / alignment.

<a id="stateicon-解析规则"></a>

### `stateIcon` Parsing rules

1. `Icon` reads the `currentState` of the recent parent Frame Context.
2. Use this icon when the current state hits `stateIcon[currentState]`.
3. If the current state has no match, fall back to `stateIcon.Idle`.
4. If still unresolved, use the normal `icon`, `src`, or `children` rule.
5. Setting a state entry to `null` hides the Icon for stable state flows such as no icon in `Idle` and a `Spinner` in `Pending`.
6. `stateIcon` affects only the Icon’s own rendering and does not mutate parent Frame state.

> `Load` is reserved for Frame’s loading / skeleton protocol. Prefer `Pending` when a button action is in progress and should display a live Spinner.

<a id="使用示例"></a>

<a id="使用示例-1"></a>

### Usage examples

```svelte

<Icon src="/bell.svg" size={24} />


<Icon size={24}>
    <Bell />
</Icon>


<Icon size={32} background class="bg-black-4">
    <Badge as="badge" dot />
    <Bell />
</Icon>


<Button Click="Active" Active={["Idle", "auto"]} whileActive={{ duration: 2000 }}>
    <Icon stateIcon={{ Idle: Paperclip, Active: Check }} />
    <Text stateText={{ Idle: "Copy", Active: "Copied" }} />
</Button>


<Button
    Click={{ Idle: "Pending", Active: "Idle" }}
    Pending={["Active", "auto"]}
>
    <Icon stateIcon={{ Idle: null, Pending: Spinner, Active: Check }} />
    <Text stateText={{ Idle: "Ready", Pending: "Loading...", Active: "Completed" }} />
</Button>


<Avatar size={40}>
    <Icon as="badge" background class="bg-blue text-white">
        <Check />
    </Icon>
</Avatar>
```

<a id="子组件上下文-context"></a>

<a id="子组件上下文-context-1"></a>

### Subcomponent context (Context)

Icon provides an adaptive positioning context for children such as `Badge`: `badgeStyle` positions badges in `em` units aligned to the outer corner, `badgeSize` defaults dots to `0.25em`, and `size` and `weight` propagate to child icons.

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
