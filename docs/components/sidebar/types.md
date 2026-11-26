# Sidebar types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="sidebar-类型与状态"></a>

# Sidebar type and status

Required Props: no named required Props.

Two-way binding: `bind:collapsed`, `bind:width`.

Inheritance statement: `Omit<FrameProps, "children" | "width">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../sidebar.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="sidebarsectiondata"></a>

## SidebarSectionData

Source: src/blocks/Sidebar.svelte

```ts
export interface SidebarSectionData {
        id: string;
        title?: string;
        collapsible?: boolean;
        defaultCollapsed?: boolean;
        actions?: SidebarActionData[];
        items?: SidebarItemData[];
        content?: Snippet;
    }
```

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

<a id="sidebaritemdata"></a>

## SidebarItemData

Source: src/blocks/sidebar-context.svelte.ts

```ts
export interface SidebarItemData {
    id: string;
    label: string;
    icon?: string | Snippet;
    iconCollection?: string;
    depth?: 0 | 1;
    href?: string;
    disabled?: boolean;
    updated?: boolean;
    tags?: Snippet;
    actions?: SidebarActionData[];
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
