# AvatarGroup types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="avatargroup-类型与状态"></a>

# AvatarGroup type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `FrameProps`. Consult the public Frame documentation for inherited capabilities.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../avatar-group.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="avatargrouplayout"></a>

## AvatarGroupLayout

Source: src/components/AvatarGroup.svelte

```ts
type AvatarGroupLayout = "row" | "stack";
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

[API](./api.md) · [Full reference](./reference.md)
