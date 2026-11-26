# Badge types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="badge-类型与状态"></a>

# Badge type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `FrameProps`. Consult the public Frame documentation for inherited capabilities.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../badge.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

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

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

[API](./api.md) · [Full reference](./reference.md)
