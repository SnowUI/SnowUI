# NumericText types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="numerictext-类型与状态"></a>

# NumericText types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../numeric-text.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="numerictextvalue"></a>

## NumericTextValue

Source: src/components/NumericText.svelte

```ts
export type NumericTextValue = string | number;
```

<a id="numerictexttrend"></a>

## NumericTextTrend

Source: src/components/NumericText.svelte

```ts
export type NumericTextTrend = TextMotionTrend;
```

<a id="textmotiontrend"></a>

## TextMotionTrend

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionTrend = -1 | 0 | 1;
```

<a id="numerictextdirection"></a>

## NumericTextDirection

Source: src/components/NumericText.svelte

```ts
export type NumericTextDirection = "normal" | "reverse";
```

<a id="textmotionrole"></a>

## TextMotionRole

Source: src/lib/text-motion/types.ts

```ts
export type TextMotionRole = "auto" | "text" | "number" | "timer" | "countdown";
```

<a id="textmotiontransition"></a>

## TextMotionTransition

Source: src/lib/text-motion/layout.ts

```ts
export interface TextMotionTransition {
    duration: number;
    easing: string;
    layoutDuration?: number;
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
