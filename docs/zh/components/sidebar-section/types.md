# SidebarSection 类型与状态

必填属性：`id`。

可双向绑定：`bind:collapsed`。

继承声明：`Omit<FrameProps, "children" | "id">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## SidebarActionData

来源：src/blocks/sidebar-context.svelte.ts

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
