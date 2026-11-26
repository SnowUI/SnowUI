# Accordion types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="accordion-类型与状态"></a>

# Accordion type and status

Required Props: no named required Props.

Two-way binding: `bind:value`.

Inheritance statement: `Omit<FrameProps, "children" | "value">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../accordion.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="accordiontype"></a>

## AccordionType

Source: src/context.ts

```ts
export type AccordionType = "single" | "multiple";
```

<a id="accordionvalue"></a>

## AccordionValue

Source: src/context.ts

```ts
export type AccordionValue = string | string[];
```

<a id="accordionvariant"></a>

## AccordionVariant

Source: src/components/Accordion.svelte

```ts
type AccordionVariant = "filled" | "divided";
```

<a id="accordionsize"></a>

## AccordionSize

Source: src/components/Accordion.svelte

```ts
type AccordionSize = "sm" | "md" | "lg";
```

<a id="accordionentry"></a>

## AccordionEntry

Source: src/components/Accordion.svelte

```ts
export interface AccordionEntry {
        title: string;
        content: string;
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
