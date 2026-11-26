# SlotText types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="slottext-类型与状态"></a>

# SlotText types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../slot-text.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="slottextdirection"></a>

## SlotTextDirection

Source: src/components/SlotText.svelte

```ts
export type SlotTextDirection = "normal" | "reverse";
```

<a id="slottexttrend"></a>

## SlotTextTrend

Source: src/components/SlotText.svelte

```ts
export type SlotTextTrend = TextMotionTrend;
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

<a id="slottexttransition"></a>

## SlotTextTransition

Source: src/components/SlotText.svelte

```ts
export interface SlotTextTransition {
        stagger?: number;
        duration?: number;
        layoutDuration?: number;
        exitOffset?: number;
        colorFade?: number;
    }
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
