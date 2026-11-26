# Skeleton 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：无接口继承。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## SkeletonVariant

来源：src/logic/skeleton-layouts.ts

```ts
export type SkeletonVariant =
    | "line"
    | "circle"
    | "rect"
    | "text"
    | "circular"
    | "rectangular";
```

## RenderHints

来源：src/logic/frame-types.ts

```ts
export interface RenderHints {
    variant?: SkeletonRenderVariant;
    width?: string | number;
    height?: string | number;
    radius?: string | number;
    rows?: number;
}
```

## SkeletonRenderVariant

来源：src/logic/frame-types.ts

```ts
export type SkeletonRenderVariant = "line" | "circle" | "rect";
```

## ResponsiveConfig

来源：src/logic/responsive.svelte.ts

```ts
export type ResponsiveConfig = Partial<Record<Breakpoint, ResponsiveRule>>;
```

## Breakpoint

来源：src/logic/responsive.svelte.ts

```ts
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

## ResponsiveRule

来源：src/logic/responsive.svelte.ts

```ts
export interface ResponsiveRule {
    collapsed?: boolean;
    expanded?: boolean;
    style?: string;
    class?: string;
    props?: Record<string, any>;
}
```
