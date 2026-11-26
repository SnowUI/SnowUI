# FlowText 类型与状态

必填属性：`value`。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：`Omit<FrameProps, "children">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## FlowTextValue

来源：src/components/FlowText.svelte

```ts
export type FlowTextValue = string | number;
```

## FlowTextTrend

来源：src/components/FlowText.svelte

```ts
export type FlowTextTrend = TextMotionTrend;
```

## TextMotionTrend

来源：src/lib/text-motion/types.ts

```ts
export type TextMotionTrend = -1 | 0 | 1;
```

## TextMotionRole

来源：src/lib/text-motion/types.ts

```ts
export type TextMotionRole = "auto" | "text" | "number" | "timer" | "countdown";
```

## FlowTextTransition

来源：src/components/FlowText.svelte

```ts
export interface FlowTextTransition {
        duration?: number;
        layoutDuration?: number;
        opacityDuration?: number;
        deformDuration?: number;
        stagger?: number;
        easing?: string;
        deformEasing?: string;
    }
```

## FlowTextRollDirection

来源：src/components/FlowText.svelte

```ts
export type FlowTextRollDirection = "normal" | "reverse";
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

## SnowUIColor

来源：src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

## TextMotionAlign

来源：src/lib/text-motion/types.ts

```ts
export type TextMotionAlign = "left" | "center" | "right" | "justify";
```

## TextMotionColor

来源：src/lib/text-motion/types.ts

```ts
export type TextMotionColor = SnowUIColor | string | TextMotionColorResolver;
```

## TextMotionColorResolver

来源：src/lib/text-motion/types.ts

```ts
export type TextMotionColorResolver = (index: number, total: number) => string;
```
