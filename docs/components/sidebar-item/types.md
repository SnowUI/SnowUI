# SidebarItem types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="sidebaritem-类型与状态"></a>

# SidebarItem types and states

Required Props: `id` and `label`.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inherited declaration: `Omit<FrameProps, "children" | "id">`. Consult the base component’s public documentation for inherited capabilities; fields excluded by `Omit` cannot be used as if inherited unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../sidebar-item.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="sidebaractiondata"></a>

## SidebarActionData

Source: src/blocks/sidebar-context.svelte.ts

```ts
export interface SidebarActionData {
    id: string;
    icon: string;
    iconCollection?: string;
    label: string;
    disabled?: boolean;
    onSelect?: (ownerId: string) => void;
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
