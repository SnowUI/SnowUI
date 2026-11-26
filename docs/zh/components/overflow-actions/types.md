# OverflowActions 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：`Omit<FrameProps, "children">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## OverflowActionsItem

来源：src/components/OverflowActions.svelte

```ts
export type OverflowActionsItem =
        | OverflowActionsActionItem
        | OverflowActionsSeparatorItem;
```

## OverflowActionsActionItem

来源：src/components/OverflowActions.svelte

```ts
export interface OverflowActionsActionItem {
        type?: "action";
        id: string;
        label: string;
        icon?: OverflowActionIcon;
        disabled?: boolean;
        href?: string;
        target?: string;
        rel?: string;
        tooltip?: TooltipProp;
        onAction?: () => void;
        buttonProps?: GlobalButtonProps;
        parts?: ComponentProps<typeof OverflowAction>["parts"];
    }
```

## OverflowActionIcon

来源：src/logic/overflow-actions.svelte.ts

```ts
export type OverflowActionIcon = string | Snippet;
```

## TooltipProp

来源：src/logic/tooltip-prop.ts

```ts
export type TooltipProp = boolean | string | Snippet | Record<string, any>;
```

## GlobalButtonProps

来源：src/components/OverflowActions.svelte

```ts
export type GlobalButtonProps = Omit<ButtonProps, ControlledGlobalButtonKeys>;
```

## ButtonProps

来源：src/components/OverflowActions.svelte

```ts
type ButtonProps = ComponentProps<typeof Button>;
```

## ControlledGlobalButtonKeys

来源：src/components/OverflowActions.svelte

```ts
type ControlledGlobalButtonKeys =
        | "children"
        | "as"
        | "iconOnly"
        | "disabled"
        | "href"
        | "onclick"
        | "aria-label"
        | "title";
```

## OverflowActionsSeparatorItem

来源：src/components/OverflowActions.svelte

```ts
export interface OverflowActionsSeparatorItem {
        type: "separator";
        id: string;
    }
```

## Parts

来源：src/components/OverflowActions.svelte

```ts
type Parts = ComponentPartsOf<{
        Button: typeof Button;
        SelectButton: typeof SelectButtonType;
        Listbox: typeof ListboxType;
        MenuItem: typeof MenuItemType;
        Separator: typeof Separator;
        Tooltip: typeof Tooltip;
    }>;
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
