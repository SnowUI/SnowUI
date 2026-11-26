# SearchInput types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="searchinput-类型与状态"></a>

# SearchInput types and states

Required Props: no named required Props.

Two-way binding: `bind:value`, `bind:element`.

Inherited declaration: `Omit<InputProps, ControlledInputKeys>`. Consult the base component’s public documentation for inherited capabilities; fields excluded by `Omit` cannot be used as if inherited unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../search-input.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="inputprops"></a>

## InputProps

Source: src/components/SearchInput.svelte

```ts
type InputProps = ComponentProps<typeof Input>;
```

<a id="controlledinputkeys"></a>

## ControlledInputKeys

Source: src/components/SearchInput.svelte

```ts
type ControlledInputKeys =
        | "value"
        | "defaultValue"
        | "type"
        | "as"
        | "class"
        | "element"
        | "children";
```

[API](./api.md) · [Full reference](./reference.md)
