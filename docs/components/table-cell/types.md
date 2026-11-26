# TableCell types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="tablecell-类型与状态"></a>

# TableCell type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `Omit<FrameProps, "children">`. Consult the public Frame documentation; omitted fields cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../table-cell.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="tooltipprop"></a>

## TooltipProp

Source: src/components/TableCell.svelte

```ts
type TooltipProp = boolean | string | Snippet;
```

<a id="tablerolelayout"></a>

## TableRoleLayout

Source: src/lib/table-context.svelte.ts

```ts
export type TableRoleLayout = "auto" | "column" | "overlay";
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
