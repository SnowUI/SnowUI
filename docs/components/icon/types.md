# Icon types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="icon-类型与状态"></a>

# Icon type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `FrameProps`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../icon.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="statevaluemap"></a>

## StateValueMap

Source: src/logic/frame-types.ts

```ts
export type StateValueMap<T = any> = Partial<Record<CoreState, T>>;
```

<a id="corestate"></a>

## CoreState

Source: src/logic/frame-types.ts

```ts
export type CoreState =
    | "StartLoad"
    | "Load"
    | "Reload"
    | "Appear"
    | "Disappear"
    | "Idle"
    | "Active"
    | "Disabled"
    | "Validating"
    | "Uploading"
    | "Editing"
    | (string & {});
```

<a id="iconsize"></a>

## IconSize

Source: src/components/Icon.svelte

```ts
export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

[API](./api.md) · [Full reference](./reference.md)
