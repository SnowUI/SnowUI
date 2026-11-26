# ButtonGroup types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="buttongroup-类型与状态"></a>

# ButtonGroup type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "size">`. Consult the public Frame documentation; fields excluded by Omit are unavailable here.

[Share Frame API](../frame/reference.md#api) · [Return API](../button-group.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="buttongroupvariant"></a>

## ButtonGroupVariant

Source: src/components/ButtonGroup.svelte

```ts
type ButtonGroupVariant = "gray" | "filled" | "outline" | "borderless";
```

<a id="buttongroupsize"></a>

## ButtonGroupSize

Source: src/components/ButtonGroup.svelte

```ts
type ButtonGroupSize = "sm" | "md" | "lg";
```

[API](./api.md) · [Full reference](./reference.md)
