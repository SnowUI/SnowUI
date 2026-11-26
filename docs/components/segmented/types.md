# Segmented types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="segmented-类型与状态"></a>

# Segmented Type and Status

Required Props: no named required Props.

Two-way binding: `bind:value`.

Inheritance statement: `Omit<TabProps, ControlledTabKeys>`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../segmented.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

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

<a id="tabprops"></a>

## TabProps

Source: src/components/Segmented.svelte

```ts
type TabProps = ComponentProps<typeof Tab>;
```

<a id="controlledtabkeys"></a>

## ControlledTabKeys

Source: src/components/Segmented.svelte

```ts
type ControlledTabKeys =
        | "value"
        | "children"
        | "role"
        | "itemRole"
        | "selectionFollowsFocus"
        | "class"
        | "parts";
```

[API](./api.md) · [Full reference](./reference.md)
