# ScrollArea types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="scrollarea-类型与状态"></a>

# ScrollArea type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `Omit<FrameProps, "children" | "enableAutoLayout">`. Consult the public Frame documentation; omitted fields cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../scroll-area.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="scrollareaaxis"></a>

## ScrollAreaAxis

Source: src/components/ScrollArea.svelte

```ts
export type ScrollAreaAxis = "vertical" | "horizontal" | "both";
```

<a id="scrollareahorizontaltrackposition"></a>

## ScrollAreaHorizontalTrackPosition

Source: src/components/ScrollArea.svelte

```ts
export type ScrollAreaHorizontalTrackPosition = "container" | "viewport";
```

[API](./api.md) · [Full reference](./reference.md)
