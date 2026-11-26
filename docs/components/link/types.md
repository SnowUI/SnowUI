# Link types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="link-类型与状态"></a>

# Link types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inherited declaration: `Omit<FrameProps, "children" | "tag">`. See Frame’s public API; omitted fields are unavailable here.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../link.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="linkvariant"></a>

## LinkVariant

Source: src/components/Link.svelte

```ts
type LinkVariant = "default" | "arrow" | "external";
```

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

<a id="linkunderline"></a>

## LinkUnderline

Source: src/components/Link.svelte

```ts
type LinkUnderline = "none" | "always" | "hover" | "until-hover";
```

<a id="tooltipprop"></a>

## TooltipProp

Source: src/components/Link.svelte

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
