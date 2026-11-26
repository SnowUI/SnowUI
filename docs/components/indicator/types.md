# Indicator types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="indicator-类型与状态"></a>

# Indicator type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../indicator.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="indicatoraxis"></a>

## IndicatorAxis

Source: src/components/Indicator.svelte

```ts
export type IndicatorAxis = "width" | "height" | "both";
```

<a id="indicatoredge"></a>

## IndicatorEdge

Source: src/components/Indicator.svelte

```ts
export type IndicatorEdge = "start" | "end" | "top" | "bottom";
```

<a id="indicatorappearance"></a>

## IndicatorAppearance

Source: src/components/Indicator.svelte

```ts
export type IndicatorAppearance = "line" | "corner";
```

[API](./api.md) · [Full reference](./reference.md)
