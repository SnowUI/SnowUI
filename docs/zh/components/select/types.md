# Select 类型与状态

必填属性：无具名必填属性。

可双向绑定：`bind:value`。

继承声明：`Omit<FrameProps, "children" | "tag">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## SelectValue

来源：src/components/Select.svelte

```ts
export type SelectValue = string | number | undefined;
```

## SelectOption

来源：src/components/Select.svelte

```ts
export type SelectOption = ListboxItem;
```

## ListboxItem

来源：src/components/Listbox.svelte

```ts
export interface ListboxItem {
        value: string;
        label: string;
        disabled?: boolean;
    }
```

## SelectTriggerContext

来源：src/components/Select.svelte

```ts
export interface SelectTriggerContext {
        value: SelectValue;
        option: SelectOption | undefined;
        label: string | undefined;
        placeholder: string | undefined;
        open: boolean;
        disabled: boolean;
    }
```

## SelectParts

来源：src/components/Select.svelte

```ts
type SelectParts = ComponentPartsOf<{
        Listbox: typeof Listbox;
        Input: typeof Input;
        MenuItem: typeof MenuItem;
        Tooltip: typeof Tooltip;
    }> & {
        Button?: Omit<
            ComponentProps<typeof Button>,
            "children" | "onclick" | "onkeydown" | "disabled"
        >;
    };
```

## ComponentPartsOf

来源：src/logic/component-parts.svelte.ts

```ts
export type ComponentPartsOf<
    T extends Record<string, Component<any>>,
> = {
    [K in keyof T]?: ConfigurableComponentPartProps<T[K]>;
};
```

## ConfigurableComponentPartProps

来源：src/logic/component-parts.svelte.ts

```ts
export type ConfigurableComponentPartProps<C extends Component<any>> = Partial<
    Omit<ComponentProps<C>, ComponentPartControlledKey>
>;
```

## ComponentPartControlledKey

来源：src/logic/component-parts.svelte.ts

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
