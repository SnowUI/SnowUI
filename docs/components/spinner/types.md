# Spinner types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="spinner-类型与状态"></a>

# Spinner type and status

Required props: no named required props.

Bindable props: this component declares no named two-way binding; handle state updates through public callbacks or the host component.

Inheritance: `FrameProps`. Consult the public Frame documentation for inherited capabilities.

[Shared Frame API](../frame/reference.md#api) · [Back to API](../spinner.md)

The following source type declarations are referenced by public props. Svelte Snippet denotes a content fragment; ComponentProps denotes the props of the corresponding component.

<a id="spinnervariant"></a>

## SpinnerVariant

Source: src/components/Spinner.svelte

```ts
type SpinnerVariant = "circle" | "spokes" | "pills";
```

<a id="resourcesize"></a>

## ResourceSize

Source: src/context.ts

```ts
export type ResourceSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;
```

<a id="loopmotionconfig"></a>

## LoopMotionConfig

Source: src/logic/frame-types.ts

```ts
export interface LoopMotionConfig {
    /** Loop preset (enables the full root Frame loop animation) */
    preset?: LoopMotionPreset;
    /** Loop duration (milliseconds) */
    duration?: number;
    /** Loop easing function */
    easing?: MotionConfig["easing"];
    /** Iteration count (default: infinite) */
    iterationCount?: number | "infinite" | (string & {});
    /** Direction (default: normal) */
    direction?:
        | "normal"
        | "reverse"
        | "alternate"
        | "alternate-reverse";
    /** Playback state (default: running) */
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
    /** Horizontal translation (px or a dimension string) */
    x?: number | string | [number | string, number | string];
    /** Vertical translation (px or a dimension string) */
    y?: number | string | [number | string, number | string];
    /** Rotation angle (degrees) */
    rotate?: number | [number, number];
    /** Y-axis rotation (degrees), for front/back flipping */
    rotateY?: number | [number, number];
    /** Opacity (0–1) */
    opacity?: number | [number, number];
    /** Blur radius (numeric values are px) */
    blur?: number | string | [number | string, number | string];
    /** Height (supports "+20px" relative syntax) */
    height?: number | string;
    /** Width */
    width?: number | string;
    /** Background color */
    backgroundColor?: SnowUIColor | string;
    /** Foreground/text/icon color for color transitions */
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
    /** Spring velocity threshold (lower is stopped) */
    velocity?: number;

    // === Component reference ===
    /** Use a custom component as the motion carrier (for example, FlowText or Spin) */
    component?: any;

    // === Orchestration control ===
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
