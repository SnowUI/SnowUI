# Popover types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="popover-类型与状态"></a>

# Popover type and status

Required Props: no named required Props.

Two-way binding: `bind:open`.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../popover.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="popoversize"></a>

## PopoverSize

Source: src/logic/popover.svelte.ts

```ts
export type PopoverSize = "sm" | "md" | "lg";
```

<a id="popovertrigger"></a>

## PopoverTrigger

Source: src/logic/popover.svelte.ts

```ts
export type PopoverTrigger = "click" | "hover";
```

<a id="popoverplacement"></a>

## PopoverPlacement

Source: src/logic/popover.svelte.ts

```ts
export type PopoverPlacement = "top" | "bottom" | "left" | "right";
```

<a id="popoverclosemode"></a>

## PopoverCloseMode

Source: src/logic/popover.svelte.ts

```ts
export type PopoverCloseMode = "outside" | "manual";
```

[API](./api.md) · [Full reference](./reference.md)
