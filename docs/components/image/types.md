# Image types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="image-类型与状态"></a>

# Image type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `FrameProps`. Consult the public Frame documentation for inherited capabilities.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../image.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="imagesize"></a>

## ImageSize

Source: src/components/Image.svelte

```ts
type ImageSize = BaseResourceSize | 56 | 64 | 72;
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

<a id="medialoading"></a>

## MediaLoading

Source: src/lib/media-loading.ts

```ts
export type MediaLoading = "lazy" | "eager";
```

<a id="previewmode"></a>

## PreviewMode

Source: src/logic/image-preview.ts

```ts
export type PreviewMode = "viewer" | "window" | "none";
```

[API](./api.md) · [Full reference](./reference.md)
