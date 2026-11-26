# ScrambleText types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="scrambletext-类型与状态"></a>

# ScrambleText types and states

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance: `Omit<FrameProps, "children">`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../scramble-text.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="scrambletextcharset"></a>

## ScrambleTextCharset

Source: src/components/ScrambleText.svelte

```ts
export type ScrambleTextCharset = "glyphs" | "symbols" | "numbers";
```

<a id="scrambletextmode"></a>

## ScrambleTextMode

Source: src/components/ScrambleText.svelte

```ts
export type ScrambleTextMode = "scramble" | "cascade";
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
