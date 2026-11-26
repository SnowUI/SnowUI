# ImageGroup types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="imagegroup-类型与状态"></a>

# ImageGroup type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `Omit<FrameProps, "gap">`. Consult the public Frame documentation; omitted fields cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../image-group.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="imagegroupsize"></a>

## ImageGroupSize

Source: src/components/ImageGroup.svelte

```ts
type ImageGroupSize = BaseResourceSize | 56 | 64 | 72;
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

<a id="imagegrouplayout"></a>

## ImageGroupLayout

Source: src/components/ImageGroup.svelte

```ts
type ImageGroupLayout = "row" | "column" | "grid";
```

<a id="previewmode"></a>

## PreviewMode

Source: src/logic/image-preview.ts

```ts
export type PreviewMode = "viewer" | "window" | "none";
```

[API](./api.md) · [Full reference](./reference.md)
