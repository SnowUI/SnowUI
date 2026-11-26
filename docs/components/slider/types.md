# Slider types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="slider-类型与状态"></a>

# Slider type and status

Required Props: no named required Props.

Two-way binding: `bind:value`.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../slider.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="sliderorientation"></a>

## SliderOrientation

Source: src/components/Slider.svelte

```ts
type SliderOrientation = "horizontal" | "vertical";
```

<a id="slidervariant"></a>

## SliderVariant

Source: src/components/Slider.svelte

```ts
type SliderVariant = "default" | "solid" | "soft";
```

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
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
