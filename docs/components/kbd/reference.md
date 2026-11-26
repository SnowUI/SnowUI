# Kbd full reference

Reviewed against Chinese source SHA-256 `ca2ab9d29dbf5ffa77ab6ca45501195a489428783a634435466c2285fb26999d`.

<a id="kbd"></a>

# Kbd

<a id="组件介绍"></a>

## Overview

Show a compact keycap label for a shortcut or keyboard operation so users can quickly recognize an available action.

<a id="使用选择"></a>

## When to use it

Show a keyboard key or shortcut hint. Kbd does not register the shortcut; the component or page that owns the action handles keyboard events.

- children contains only the key label; variant selects an outlined or filled appearance.
- Place the shortcut hint beside its action. Register shortcut events in the page or component that owns that action.
- When several keys form one shortcut, use Frame singleLine to keep them on one line with at least 4 CSS px between them. An outer horizontal ScrollArea retains the complete keys in very narrow containers.

<a id="快速开始"></a>

## Quick start

This example shows the recommended basic composition. See the sections below for more cases and composition limits.

```svelte
<script lang="ts">
	import { Frame, Kbd, ScrollArea } from '@snowui-design-system/components';
</script>

<div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--gap-4) var(--gap-3);">
	<Kbd variant="border">⌘K</Kbd>
	<Kbd variant="solid">⌘K</Kbd>
	<ScrollArea axis="horizontal" ariaLabel="Shift plus K" style="width: max-content; max-width: 100%;">
		<Frame singleLine gap={1} style="width: max-content;">
		<Kbd style="font-size: var(--text-18); line-height: var(--leading-18);">Shift</Kbd>
		<span aria-hidden="true">+</span>
		<Kbd style="font-size: var(--text-18); line-height: var(--leading-18);">K</Kbd>
		</Frame>
	</ScrollArea>
</div>
```

<a id="api"></a>

## API

| Keyword | Type | Default | Description |
| --- | --- | --- | --- |
| variant | `"border" \| "solid"` | `"border"` | Style A (outline) or style B (solid fill). |
| children | `Snippet` | — | Key label. |

See the base component documentation for inherited capabilities not redeclared here. This table lists only named public Props declared by this component.

<a id="使用边界与详细说明"></a>

## Usage boundaries and details

<a id="功能概览"></a>

<a id="功能概览-1"></a>

### Feature overview

- Two visual styles: outline (`border`) and solid fill (`solid`), selected with `variant`.
- Renders a semantic `<kbd>` element.
- An inline element that fits within any text flow.

---

<a id="api-参考"></a>

<a id="基础用法样式-a-描边"></a>

#### Basic usage (style A: outline)

```svelte
<Kbd>⌘K</Kbd>
<Kbd>Ctrl</Kbd>
<Kbd>Enter</Kbd>
```

<a id="样式-b实心底色"></a>

#### Style B (solid fill)

```svelte
<Kbd variant="solid">⌘K</Kbd>
<Kbd variant="solid">Ctrl</Kbd>
```

<a id="组合键"></a>

#### Key combinations

```svelte
<ScrollArea axis="horizontal" ariaLabel="Command plus K" style="width: max-content; max-width: 100%;">
    <Frame singleLine gap={1} style="width: max-content;">
        <Kbd>⌘</Kbd>
        <span aria-hidden="true">+</span>
        <Kbd>K</Kbd>
    </Frame>
</ScrollArea>
```

---

[Styles](./styles.md) · [Types](./types.md) · [API](./api.md)
