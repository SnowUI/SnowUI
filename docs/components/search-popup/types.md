# SearchPopup types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="searchpopup-类型与状态"></a>

# SearchPopup types and states

Required Props: no named required Props.

Two-way binding: `bind:open`, `bind:value`.

Inherited declaration: `Omit<ComponentProps<typeof Popover>, "children" | "title" | "value" | "parts">`. Consult the base component’s public documentation for inherited capabilities; fields excluded by `Omit` cannot be used as if inherited unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../search-popup.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="backdropvariant"></a>

## BackdropVariant

Source: src/lib/backdrop.ts

```ts
export type BackdropVariant = "opaque" | "blur" | "transparent";
```

<a id="searchpopupitem"></a>

## SearchPopupItem

Source: src/blocks/SearchPopup.svelte

```ts
export type SearchPopupItem = { value: string; label: string; href: string; group?: string; disabled?: boolean };
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
