# DataTable 类型与状态

必填属性：无具名必填属性。

可双向绑定：`bind:sort`、`bind:query`、`bind:filters`、`bind:page`、`bind:pageSize`、`bind:state`、`bind:selectedRowIds`。

继承声明：`Omit<FrameProps, "children" | "variant">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## DataTableMode

来源：src/components/DataTable.svelte

```ts
export type DataTableMode = "client" | "server";
```

## Sorter

来源：src/components/DataTable.svelte

```ts
type Sorter<T> = (row: T) => unknown;
```

## Searcher

来源：src/components/DataTable.svelte

```ts
type Searcher<T> = (row: T, query: string) => boolean;
```

## Filterer

来源：src/components/DataTable.svelte

```ts
type Filterer<T> = (row: T, filters: Record<string, unknown>) => boolean;
```

## TableSortState

来源：src/lib/table-context.svelte.ts

```ts
export interface TableSortState {
    columnId: string;
    direction: TableSortDirection;
}
```

## TableSortDirection

来源：src/lib/table-context.svelte.ts

```ts
export type TableSortDirection = "ascending" | "descending";
```

## DataTableLoadMore

来源：src/components/DataTable.svelte

```ts
export type DataTableLoadMore<T> = (
        request: DataTableLoadMoreRequest,
    ) => DataTableLoadMoreSource<T> | Promise<DataTableLoadMoreSource<T>>;
```

## DataTableLoadMoreRequest

来源：src/components/DataTable.svelte

```ts
export interface DataTableLoadMoreRequest {
        offset: number;
        limit: number;
        signal: AbortSignal;
    }
```

## DataTableLoadMoreSource

来源：src/components/DataTable.svelte

```ts
export type DataTableLoadMoreSource<T> = Iterable<T> | AsyncIterable<T>;
```

## DataTableLoadMoreMode

来源：src/components/DataTable.svelte

```ts
export type DataTableLoadMoreMode = "manual" | "auto";
```

## DataTableRenderState

来源：src/components/DataTable.svelte

```ts
export interface DataTableRenderState<T = unknown> {
        rows: T[];
        sourceRows: T[];
        query: string;
        sort?: TableSortState;
        page: number;
        pageSize: number;
        totalRows: number;
        totalPages: number;
        loading: boolean;
        refreshing: boolean;
        loadingMore: boolean;
        hasMore: boolean;
        loadMoreSize: number;
        filters: Record<string, unknown>;
        error?: unknown;
        getRowKey: (row: T, index: number) => string | number;
        loadMore: () => Promise<void>;
    }
```

## DataTableVariant

来源：src/components/DataTable.svelte

```ts
export type DataTableVariant = "striped" | "divided";
```

## DataTableActionsConfig

来源：src/components/DataTable.svelte

```ts
export interface DataTableActionsConfig<T> {
        items: (row: T, state: DataTableRenderState<T>) => DataTableActionsItem[];
        onAction?: (event: DataTableActionEvent<T>) => void;
        compact?: "auto" | "none";
        overflow?: "all" | "progressive";
        overflowFrom?: "start" | "end";
        width?: number;
        minWidth?: number;
        maxWidth?: number;
        resizable?: boolean;
        maxVisible?: number;
        buttonProps?: ComponentProps<typeof OverflowActions>["buttonProps"];
        parts?: ComponentProps<typeof OverflowActions>["parts"];
        moreLabel?: string;
    }
```

## DataTableActionsItem

来源：src/components/DataTable.svelte

```ts
export type DataTableActionsItem =
        | DataTableActionItem
        | DataTableActionSeparatorItem;
```

## DataTableActionItem

来源：src/components/DataTable.svelte

```ts
export interface DataTableActionItem extends OverflowActionsActionItem {
        type?: "action";
        id: string;
        label: string;
        icon?: string | Snippet;
        disabled?: boolean;
        href?: string;
        onAction?: () => void;
    }
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

## DataTableActionSeparatorItem

来源：src/components/DataTable.svelte

```ts
export interface DataTableActionSeparatorItem {
        type: "separator";
        id: string;
    }
```

## TableRoleLayout

来源：src/lib/table-context.svelte.ts

```ts
export type TableRoleLayout = "auto" | "column" | "overlay";
```

## TableRoleOverlayBlurMode

来源：src/lib/table-context.svelte.ts

```ts
export type TableRoleOverlayBlurMode = "progressive" | "uniform";
```
