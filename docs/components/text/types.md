# Text types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="text-类型与状态"></a>

# Text type and status

Required Props: no named required Props.

Two-way binding: `bind:element`.

Inheritance: `FrameProps`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../text.md)

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

<a id="tooltipprop"></a>

## TooltipProp

Source: src/components/Text.svelte

```ts
type TooltipProp = boolean | string | Snippet | Record<string, any>;
```

<a id="componentpartsof"></a>

## ComponentPartsOf

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentPartsOf<
    T extends Record<string, Component<any>>,
> = {
    [K in keyof T]?: ConfigurableComponentPartProps<T[K]>;
};
```

<a id="configurablecomponentpartprops"></a>

## ConfigurableComponentPartProps

Source: src/logic/component-parts.svelte.ts

```ts
export type ConfigurableComponentPartProps<C extends Component<any>> = Partial<
    Omit<ComponentProps<C>, ComponentPartControlledKey>
>;
```

<a id="componentpartcontrolledkey"></a>

## ComponentPartControlledKey

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentPartControlledKey =
    | "children"
    | "as"
    | "value"
    | "defaultValue"
    | "open"
    | "selected"
    | "checked"
    | "disabled"
    | "readonly"
    | "id"
    | `on${string}`
    | `aria-${string}`;
```

[API](./api.md) · [Full reference](./reference.md)
