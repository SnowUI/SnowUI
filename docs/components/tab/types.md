# Tab types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="tab-类型与状态"></a>

# Tab type and status

Required Props: no named required Props.

Two-way binding: `bind:value`.

Inheritance statement: `Omit<FrameProps, "children" | "value">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../tab.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="tabvariant"></a>

## TabVariant

Source: src/components/Tab.svelte

```ts
export type TabVariant = "pill" | "solid" | "underline" | "icon-toggle" | "bare";
```

<a id="tabsize"></a>

## TabSize

Source: src/components/Tab.svelte

```ts
export type TabSize = "sm" | "md" | "lg";
```

<a id="tabitem"></a>

## TabItem

Source: src/components/Tab.svelte

```ts
export interface TabItem {
        value: string;
        label: string;
        icon?: Component;
        disabled?: boolean;
    }
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
