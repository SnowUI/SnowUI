# Skeleton types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="skeleton-类型与状态"></a>

# Skeleton type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: no interface inheritance.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../skeleton.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="skeletonvariant"></a>

## SkeletonVariant

Source: src/logic/skeleton-layouts.ts

```ts
export type SkeletonVariant =
    | "line"
    | "circle"
    | "rect"
    | "text"
    | "circular"
    | "rectangular";
```

<a id="renderhints"></a>

## RenderHints

Source: src/logic/frame-types.ts

```ts
export interface RenderHints {
    variant?: SkeletonRenderVariant;
    width?: string | number;
    height?: string | number;
    radius?: string | number;
    rows?: number;
}
```

<a id="skeletonrendervariant"></a>

## SkeletonRenderVariant

Source: src/logic/frame-types.ts

```ts
export type SkeletonRenderVariant = "line" | "circle" | "rect";
```

<a id="responsiveconfig"></a>

## ResponsiveConfig

Source: src/logic/responsive.svelte.ts

```ts
export type ResponsiveConfig = Partial<Record<Breakpoint, ResponsiveRule>>;
```

<a id="breakpoint"></a>

## Breakpoint

Source: src/logic/responsive.svelte.ts

```ts
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
```

<a id="responsiverule"></a>

## ResponsiveRule

Source: src/logic/responsive.svelte.ts

```ts
export interface ResponsiveRule {
    collapsed?: boolean;
    expanded?: boolean;
    style?: string;
    class?: string;
    props?: Record<string, any>;
}
```

[API](./api.md) · [Full reference](./reference.md)
