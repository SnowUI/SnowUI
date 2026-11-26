# SelectButton types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="selectbutton-类型与状态"></a>

# SelectButton types and states

Required Props: no named required Props.

Two-way binding: `bind:value`.

Inherited declaration: `Omit<ButtonProps, ControlledButtonKeys>`. Consult the base component’s public documentation for inherited capabilities; fields excluded by `Omit` cannot be used as if inherited unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../select-button.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="selectvalue"></a>

## SelectValue

Source: src/components/Select.svelte

```ts
export type SelectValue = string | number | undefined;
```

<a id="selectoption"></a>

## SelectOption

Source: src/components/Select.svelte

```ts
export type SelectOption = ListboxItem;
```

<a id="listboxitem"></a>

## ListboxItem

Source: src/components/Listbox.svelte

```ts
export interface ListboxItem {
        value: string;
        label: string;
        disabled?: boolean;
    }
```

<a id="selectbuttonlabelcontext"></a>

## SelectButtonLabelContext

Source: src/components/SelectButton.svelte

```ts
export interface SelectButtonLabelContext {
        value: SelectValue;
        option: SelectOption | undefined;
        label: string;
        placeholder: string | undefined;
    }
```

<a id="selectbuttonindicatorcontext"></a>

## SelectButtonIndicatorContext

Source: src/components/SelectButton.svelte

```ts
export interface SelectButtonIndicatorContext {
        open: boolean;
        disabled: boolean;
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

<a id="buttonprops"></a>

## ButtonProps

Source: src/components/SelectButton.svelte

```ts
type ButtonProps = ComponentProps<typeof Button>;
```

<a id="controlledbuttonkeys"></a>

## ControlledButtonKeys

Source: src/components/SelectButton.svelte

```ts
type ControlledButtonKeys =
        | "children"
        | "as"
        | "value"
        | "defaultValue"
        | "disabled"
        | "readonly"
        | "id"
        | "onclick"
        | "onkeydown"
        | "aria-label"
        | "aria-haspopup"
        | "aria-expanded"
        | "aria-controls"
        | "aria-activedescendant";
```

[API](./api.md) · [Full reference](./reference.md)
