# NumberFlow types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="numberflow-类型与状态"></a>

# NumberFlow type and status

Required attribute: `value`.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](../frame/reference.md#api) · [Return API](../number-flow.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="trendresolver"></a>

## TrendResolver

Source: src/components/NumberFlow.svelte

```ts
type TrendResolver = TextMotionTrend;
```

<a id="textmotiontrend"></a>

## TextMotionTrend

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionTrend = -1 | 0 | 1;
```

<a id="textmotionrole"></a>

## TextMotionRole

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionRole = "auto" | "text" | "number" | "timer" | "countdown";
```

<a id="numberflowtransition"></a>

## NumberFlowTransition

Source: src/components/NumberFlow.svelte

```ts
interface NumberFlowTransition {
        duration?: number;
    }
```

<a id="rolldirection"></a>

## RollDirection

Source: src/components/NumberFlow.svelte

```ts
type RollDirection = "normal" | "reverse";
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

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

<a id="textmotionalign"></a>

## TextMotionAlign

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionAlign = "left" | "center" | "right" | "justify";
```

<a id="textmotioncolor"></a>

## TextMotionColor

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionColor = SnowUIColor | string | TextMotionColorResolver;
```

<a id="textmotioncolorresolver"></a>

## TextMotionColorResolver

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionColorResolver = (index: number, total: number) => string;
```

[API](./api.md) · [Full reference](./reference.md)
