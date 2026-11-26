# Frame types and states

These declarations come from the reviewed component reference for this source version. Check the installed version before using them.

<a id="frame-类型与状态"></a>

# Frame type and status

Required Props: no named required Props.

Two-way binding: `bind:element`.

Inheritance: `FrameProps`. Consult the base class public documentation; fields excluded by Omit cannot be passed through unchanged.

[Share Frame API](./reference.md#api) · [Return API](./reference.md#api)

The following type declarations are actually referenced by public Props and come from source. A Svelte Snippet denotes a content fragment; ComponentProps denotes the Props of the corresponding component.

<a id="componentparts"></a>

## ComponentParts

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentParts = Record<string, ComponentPartProps | undefined>;
```

<a id="componentpartprops"></a>

## ComponentPartProps

Source: src/logic/component-parts.svelte.ts

```ts
export type ComponentPartProps = Record<string, unknown>;
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

<a id="corestate"></a>

## CoreState

Source: src/logic/frame-types.ts

```ts
export type CoreState =
    | "StartLoad"
    | "Load"
    | "Reload"
    | "Appear"
    | "Disappear"
    | "Idle"
    | "Active"
    | "Disabled"
    | "Validating"
    | "Uploading"
    | "Editing"
    | (string & {});
```

<a id="statetransition"></a>

## StateTransition

Source: src/logic/frame-types.ts

```ts
export type StateTransition =
    | CoreState
    | [CoreState, "auto"]
    | ((e?: any) => void)
    | { next?: CoreState; auto?: boolean; run?: (e?: any) => void };
```

<a id="statevaluemap"></a>

## StateValueMap

Source: src/logic/frame-types.ts

```ts
export type StateValueMap<T = any> = Partial<Record<CoreState, T>>;
```

<a id="eventtrigger"></a>

## EventTrigger

Source: src/logic/frame-types.ts

```ts
export type EventTrigger =
    | CoreState
    | LinkageControl
    | ((e?: any) => void)
    | { run?: (e?: any) => void; stop?: boolean; prevent?: boolean; next?: CoreState; state?: CoreState;[key: string]: any }
    | Partial<Record<CoreState, any>>;
```

<a id="linkagecontrol"></a>

## LinkageControl

Source: src/logic/frame-types.ts

```ts
export interface LinkageControl {
    target: string | object; // Support object ref (component instance)
    action: "play" | "reset" | "pause"; // Action type
    reverse?: boolean; // Whether to run in reverse
    stop?: boolean; // Stop propagation
    prevent?: boolean; // Prevent default
}
```

<a id="frameresponsiveprops"></a>

## FrameResponsiveProps

Source: src/logic/frame-types.ts

```ts
export interface FrameResponsiveProps {
    /** Layout direction when content does not fit. Omission keeps the current direction. */
    direction?: FrameResponsiveDirection;
    /** Cross-axis alignment when content does not fit. */
    align?: FrameResponsiveAlignment;
    /** Main-axis alignment when content does not fit. */
    justify?: "start" | "center" | "end" | "between";
    /** When content does not fit, ordinary direct children shrink to content or fill the container. */
    childrenWidth?: "hug" | "fill";
    /** Minimum width of ordinary direct children when content does not fit; numbers are px. */
    childrenMinWidth?: number | string;
    /** Responsive minimum gap; numbers are px, default 4px. */
    minGap?: number;
    /**
     * Responsive minimum padding; a number applies to all four sides, while an object supports all / x / y / individual-side overrides,
     * all numbers are px, default 4px.
     */
    minPadding?: number | FrameResponsivePaddingMinimum;
}
```

<a id="frameresponsivedirection"></a>

## FrameResponsiveDirection

Source: src/logic/frame-types.ts

```ts
export type FrameResponsiveDirection =
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse";
```

<a id="frameresponsivealignment"></a>

## FrameResponsiveAlignment

Source: src/logic/frame-types.ts

```ts
export type FrameResponsiveAlignment = "start" | "center" | "end" | "stretch";
```

<a id="frameresponsivepaddingminimum"></a>

## FrameResponsivePaddingMinimum

Source: src/logic/frame-types.ts

```ts
export interface FrameResponsivePaddingMinimum {
    /** Shared minimum for all four sides. */
    all?: number;
    /** Shared minimum for left and right. */
    x?: number;
    /** Shared minimum for top and bottom. */
    y?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
```

<a id="motionconfig"></a>

## MotionConfig

Source: src/logic/motion-config.ts

```ts
export interface MotionConfig {
    // === Transform properties ===
    /** Scale factor (1 = 100%) */
    scale?: number | [number, number];
    /** Horizontal displacement (px or a unit-bearing string) */
    x?: number | string | [number | string, number | string];
    /** Vertical displacement (px or a unit-bearing string) */
    y?: number | string | [number | string, number | string];
    /** Rotation angle (degrees) */
    rotate?: number | [number, number];
    /** Y-axis rotation (degrees) for front/back flips */
    rotateY?: number | [number, number];
    /** Opacity (0–1) */
    opacity?: number | [number, number];
    /** Blur radius (numbers are px) */
    blur?: number | string | [number | string, number | string];
    /** Height (supports relative syntax such as "+20px") */
    height?: number | string;
    /** Width */
    width?: number | string;
    /** Background color */
    backgroundColor?: SnowUIColor | string;
    /** Foreground (text/icon) color for color transitions */
    color?: SnowUIColor | string;

    // === Timing options ===
    /** Delay (ms) */
    delay?: number;
    /** Duration (ms) */
    duration?: number;
    /** Easing function */
    easing?: EasingFunction;

    // === Physics simulation ===
    /** Motion type */
    type?: 'spring' | 'tween';
    /** Spring stiffness (higher is stiffer) */
    stiffness?: number;
    /** Spring damping (higher stops sooner) */
    damping?: number;
    /** Spring mass */
    mass?: number;
    /** Spring velocity threshold (below this counts as stopped) */
    velocity?: number;

    // === Component reference ===
    /** Use a custom component as the motion carrier (such as FlowText or Spin) */
    component?: any;

    // === Orchestration controls ===
    /** Whether to join parent orchestration */
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

<a id="loopmotionconfig"></a>

## LoopMotionConfig

Source: src/logic/frame-types.ts

```ts
export interface LoopMotionConfig {
    /** Loop preset (enables full looping motion on the Frame root) */
    preset?: LoopMotionPreset;
    /** Loop duration (ms) */
    duration?: number;
    /** Loop easing function */
    easing?: MotionConfig["easing"];
    /** Loop count (default infinite) */
    iterationCount?: number | "infinite" | (string & {});
    /** Loop direction (default normal) */
    direction?:
        | "normal"
        | "reverse"
        | "alternate"
        | "alternate-reverse";
    /** Playback state (default running) */
    playState?: "running" | "paused";
}
```

<a id="loopmotionpreset"></a>

## LoopMotionPreset

Source: src/logic/frame-types.ts

```ts
export type LoopMotionPreset = "rotateClockwise";
```

<a id="scrollconfig"></a>

## ScrollConfig

Source: src/logic/motion-config.ts

```ts
export interface ScrollConfig {
    /** Scroll range ["start center", "end center"] */
    offset?: [string, string];
    /** Vertical displacement mapping */
    y?: [number, number];
    /** Horizontal displacement mapping */
    x?: [number, number];
    /** Opacity mapping */
    opacity?: [number, number];
    /** Scale mapping */
    scale?: [number, number];
    /** Vertical displacement mapping (alias for y) */
    translateY?: [number, number];
    /** Horizontal displacement mapping (alias for x) */
    translateX?: [number, number];
    /** Rotation mapping */
    rotate?: [number, number];
}
```

<a id="framescope"></a>

## FrameScope

Source: src/logic/frame-types.ts

```ts
export type FrameScope = 'self' | 'children' | 'descendants' | 'explicit';
```

<a id="frameaccess"></a>

## FrameAccess

Source: src/logic/frame-types.ts

```ts
export type FrameAccess = 'readonly' | 'writeable';
```

[API](./api.md) · [Full reference](./reference.md)
