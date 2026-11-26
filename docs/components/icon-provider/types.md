# IconProvider types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="iconprovider-类型与状态"></a>

# IconProvider types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inherited declaration: none. Consult the relevant base component’s public documentation for any capabilities it exposes; omitted fields cannot be used as if they were inherited.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../icon-provider.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="componenticonmap"></a>

## ComponentIconMap

Source: src/logic/component-icon.ts

```ts
export type ComponentIconMap = Record<string, ComponentIconComponent | undefined>;
```

<a id="componenticoncomponent"></a>

## ComponentIconComponent

Source: src/logic/component-icon.ts

```ts
export type ComponentIconComponent = Component<ComponentIconRenderProps>;
```

<a id="componenticonrenderprops"></a>

## ComponentIconRenderProps

Source: src/logic/component-icon.ts

```ts
export interface ComponentIconRenderProps {
    size?: number | string;
    color?: string;
    weight?: ComponentIconWeight;
    class?: string;
    [key: string]: unknown;
}
```

<a id="componenticonweight"></a>

## ComponentIconWeight

Source: src/logic/component-icon.ts

```ts
export type ComponentIconWeight =
    | "regular"
    | "thin"
    | "light"
    | "bold"
    | "fill"
    | "duotone";
```

<a id="componenticonresolver"></a>

## ComponentIconResolver

Source: src/logic/component-icon.ts

```ts
export type ComponentIconResolver = (
    request: ComponentIconRequest,
) => ComponentIconComponent | undefined;
```

<a id="componenticonrequest"></a>

## ComponentIconRequest

Source: src/logic/component-icon.ts

```ts
export interface ComponentIconRequest {
    name: string;
    weight: ComponentIconWeight;
    /** Optional hint for existing explicit resource APIs; built-in functional icons must not depend on it. */
    collection?: string;
}
```

[API](./api.md) · [Full reference](./reference.md)
