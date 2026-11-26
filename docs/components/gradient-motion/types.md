# GradientMotion types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="gradientmotion-类型与状态"></a>

# GradientMotion type and status

Required Props: no named required Props.

Bindable Props: this component declares no named two-way binding; handle state updates through public callbacks or its host.

Inheritance declaration: `Omit<FrameProps, "size" | "width" | "height" | "radius">`. The inheritance ability is subject to the public document of the base class; the fields in Omit have been excluded and cannot be used as they are according to the base class.

[Share Frame API](../frame/reference.md#api) · [Return API](../gradient-motion.md)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="gradientmotionvariant"></a>

## GradientMotionVariant

Source: src/components/GradientMotion.svelte

```ts
export type GradientMotionVariant =
        | "prism"
        | "berry"
        | "lagoon"
        | "citrus"
        | "azure"
        | "ember"
        | "avatar"
        | "random"
        | "cosmic"
        | "matrix"
        | "electric"
        | "inferno"
        | "mystic"
        | "cyber"
        | "neon"
        | "plasma"
        | "neatBlob";
```

<a id="gradientmotiondirection"></a>

## GradientMotionDirection

Source: src/components/GradientMotion.svelte

```ts
export type GradientMotionDirection = "ltr" | "rtl" | "ttb" | "btt";
```

<a id="gradientmotioncolors"></a>

## GradientMotionColors

Source: src/components/GradientMotion.svelte

```ts
export type GradientMotionColors = readonly [string, string, string, string];
```

<a id="loopmotionconfig"></a>

## LoopMotionConfig

Source: src/logic/frame-types.ts

```ts
export interface LoopMotionConfig {
    /** Default loop preset (animates the entire Frame root) */
    preset?: LoopMotionPreset;
    /** Loop duration (milliseconds) */
    duration?: number;
    /** Loop easing function */
    easing?: MotionConfig["easing"];
    /** Iteration count (infinite by default) */
    iterationCount?: number | "infinite" | (string & {});
    /** Loop direction (normal by default) */
    direction?:
        | "normal"
        | "reverse"
        | "alternate"
        | "alternate-reverse";
    /** Playback state (running by default) */
    playState?: "running" | "paused";
}
```

<a id="loopmotionpreset"></a>

## LoopMotionPreset

Source: src/logic/frame-types.ts

```ts
export type LoopMotionPreset = "rotateClockwise";
```

<a id="motionconfig"></a>

## MotionConfig

Source: src/logic/motion-config.ts

```ts
export interface MotionConfig {
    // === Transform properties ===
    /** Scale (1 = 100%) */
    scale?: number | [number, number];
    /** Horizontal offset (px or a CSS length) */
    x?: number | string | [number | string, number | string];
    /** Vertical offset (px or a CSS length) */
    y?: number | string | [number | string, number | string];
    /** Rotation (degrees) */
    rotate?: number | [number, number];
    /** Y-axis rotation (degrees), for front/back flips */
    rotateY?: number | [number, number];
    /** Opacity (0–1) */
    opacity?: number | [number, number];
    /** Blur radius (numbers are px) */
    blur?: number | string | [number | string, number | string];
    /** Height (supports incremental "+20px" syntax) */
    height?: number | string;
    /** Width */
    width?: number | string;
    /** Background color */
    backgroundColor?: SnowUIColor | string;
    /** Foreground color (text/icons), for color transitions */
    color?: SnowUIColor | string;

    // === Timing parameters ===
    /** Delay (milliseconds) */
    delay?: number;
    /** Duration (milliseconds) */
    duration?: number;
    /** Easing function */
    easing?: EasingFunction;

    // === Physics simulation ===
    /** Motion type */
    type?: 'spring' | 'tween';
    /** Spring stiffness (higher is stiffer) */
    stiffness?: number;
    /** Spring damping (higher stops faster) */
    damping?: number;
    /** Spring mass */
    mass?: number;
    /** Spring velocity threshold (stops below this value) */
    velocity?: number;

    // === Component reference ===
    /** Use a custom component as the motion carrier (such as FlowText or Spin) */
    component?: any;

    // === Orchestration ===
    /** Whether to participate in parent orchestration */
    orchestrate?: boolean;
}
```

<a id="snowuicolor"></a>

## SnowUIColor

Source: src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

<a id="easingfunction"></a>

## EasingFunction

Source: src/logic/motion-config.ts

```ts
export type EasingFunction =
    | 'linear'
    | 'easeIn' | 'easeOut' | 'easeInOut'
    | 'cubicIn' | 'cubicOut' | 'cubicInOut'
    | 'quadIn' | 'quadOut' | 'quadInOut'
    | 'quartIn' | 'quartOut' | 'quartInOut'
    | 'quintIn' | 'quintOut' | 'quintInOut'
    | 'sineIn' | 'sineOut' | 'sineInOut'
    | 'expoIn' | 'expoOut' | 'expoInOut'
    | 'circIn' | 'circOut' | 'circInOut'
    | 'backIn' | 'backOut' | 'backInOut'
    | 'elasticIn' | 'elasticOut' | 'elasticInOut'
    | 'bounceIn' | 'bounceOut' | 'bounceInOut'
    | (string & {});
```

[API](./api.md) · [Full reference](./reference.md)
