# Gradient types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="gradient-类型与状态"></a>

# Gradient type and state

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "children" | "size" | "width" | "height" | "radius" | "enableDefaultMotion">`. Consult Frame’s public documentation; omitted fields are unavailable here.

[Share Frame API](../frame/reference.md#api) · [Return API](../gradient.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="gradientvariant"></a>

## GradientVariant

Source: src/logic/gradient-static.ts

```ts
export type GradientVariant =
    | "blue"
    | "cyan"
    | "green"
    | "red"
    | "orange"
    | "purple";
```

[API](./api.md) · [Full reference](./reference.md)
