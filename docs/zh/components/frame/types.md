# Frame 类型与状态

必填属性：无具名必填属性。

可双向绑定：`bind:element`。

继承声明：`FrameProps`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](./api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ComponentParts

来源：src/logic/component-parts.svelte.ts

```ts
export type ComponentParts = Record<string, ComponentPartProps | undefined>;
```

## ComponentPartProps

来源：src/logic/component-parts.svelte.ts

```ts
export type ComponentPartProps = Record<string, unknown>;
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

## CoreState

来源：src/logic/frame-types.ts

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

## StateTransition

来源：src/logic/frame-types.ts

```ts
export type StateTransition =
    | CoreState
    | [CoreState, "auto"]
    | ((e?: any) => void)
    | { next?: CoreState; auto?: boolean; run?: (e?: any) => void };
```

## StateValueMap

来源：src/logic/frame-types.ts

```ts
export type StateValueMap<T = any> = Partial<Record<CoreState, T>>;
```

## EventTrigger

来源：src/logic/frame-types.ts

```ts
export type EventTrigger =
    | CoreState
    | LinkageControl
    | ((e?: any) => void)
    | { run?: (e?: any) => void; stop?: boolean; prevent?: boolean; next?: CoreState; state?: CoreState;[key: string]: any }
    | Partial<Record<CoreState, any>>;
```

## LinkageControl

来源：src/logic/frame-types.ts

```ts
export interface LinkageControl {
    target: string | object; // Support object ref (component instance)
    action: "play" | "reset" | "pause"; // 动作类型
    reverse?: boolean; // 是否反向执行
    stop?: boolean; // Stop propagation
    prevent?: boolean; // Prevent default
}
```

## FrameResponsiveProps

来源：src/logic/frame-types.ts

```ts
export interface FrameResponsiveProps {
    /** 放不下时采用的排列方向。未传入时不改变方向。 */
    direction?: FrameResponsiveDirection;
    /** 放不下时的交叉轴对齐。 */
    align?: FrameResponsiveAlignment;
    /** 放不下时的主轴对齐。 */
    justify?: "start" | "center" | "end" | "between";
    /** 放不下时，普通直系子项按内容收缩或填满容器。 */
    childrenWidth?: "hug" | "fill";
    /** 放不下时，普通直系子项的最小宽度；数字按 px 处理。 */
    childrenMinWidth?: number | string;
    /** gap 的响应式下限；数字按 px 处理，默认 4px。 */
    minGap?: number;
    /**
     * padding 的响应式下限；数字同时作用于四边，对象支持 all / x / y / 单边覆盖，
     * 所有数字均按 px 处理，默认 4px。
     */
    minPadding?: number | FrameResponsivePaddingMinimum;
}
```

## FrameResponsiveDirection

来源：src/logic/frame-types.ts

```ts
export type FrameResponsiveDirection =
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse";
```

## FrameResponsiveAlignment

来源：src/logic/frame-types.ts

```ts
export type FrameResponsiveAlignment = "start" | "center" | "end" | "stretch";
```

## FrameResponsivePaddingMinimum

来源：src/logic/frame-types.ts

```ts
export interface FrameResponsivePaddingMinimum {
    /** 四边共同下限。 */
    all?: number;
    /** 左右共同下限。 */
    x?: number;
    /** 上下共同下限。 */
    y?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
```

## MotionConfig

来源：src/logic/motion-config.ts

```ts
export interface MotionConfig {
    // === 变换属性 ===
    /** 缩放比例 (1 = 100%) */
    scale?: number | [number, number];
    /** 水平位移 (px 或带单位字符串) */
    x?: number | string | [number | string, number | string];
    /** 垂直位移 (px 或带单位字符串) */
    y?: number | string | [number | string, number | string];
    /** 旋转角度 (度) */
    rotate?: number | [number, number];
    /** Y 轴旋转角度 (度)，用于正反面翻转 */
    rotateY?: number | [number, number];
    /** 透明度 (0-1) */
    opacity?: number | [number, number];
    /** 模糊半径（数字按 px 处理） */
    blur?: number | string | [number | string, number | string];
    /** 高度 (支持 "+20px" 增量语法) */
    height?: number | string;
    /** 宽度 */
    width?: number | string;
    /** 背景颜色 */
    backgroundColor?: SnowUIColor | string;
    /** 前景色（文字/图标颜色），用于颜色过渡 */
    color?: SnowUIColor | string;

    // === 时间参数 ===
    /** 延迟 (毫秒) */
    delay?: number;
    /** 持续时间 (毫秒) */
    duration?: number;
    /** 缓动函数 */
    easing?: EasingFunction;

    // === 物理模拟 ===
    /** 动效类型 */
    type?: 'spring' | 'tween';
    /** 弹簧刚度 (越大越硬) */
    stiffness?: number;
    /** 弹簧阻尼 (越大越快停止) */
    damping?: number;
    /** 弹簧质量 */
    mass?: number;
    /** 弹簧速度阈值 (低于此值视为停止) */
    velocity?: number;

    // === 组件引用 ===
    /** 使用自定义组件作为动效载体 (如 FlowText, Spin) */
    component?: any;

    // === 编排控制 ===
    /** 是否参与父组件编排 */
    orchestrate?: boolean;
}
```

## SnowUIColor

来源：src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
```

## EasingFunction

来源：src/logic/motion-config.ts

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

## LoopMotionConfig

来源：src/logic/frame-types.ts

```ts
export interface LoopMotionConfig {
    /** 循环默认能力预设（启用 Frame 根节点完整循环动画） */
    preset?: LoopMotionPreset;
    /** 循环动画持续时间 (毫秒) */
    duration?: number;
    /** 循环动画缓动函数 */
    easing?: MotionConfig["easing"];
    /** 循环次数（默认 infinite） */
    iterationCount?: number | "infinite" | (string & {});
    /** 循环方向（默认 normal） */
    direction?:
        | "normal"
        | "reverse"
        | "alternate"
        | "alternate-reverse";
    /** 播放状态（默认 running） */
    playState?: "running" | "paused";
}
```

## LoopMotionPreset

来源：src/logic/frame-types.ts

```ts
export type LoopMotionPreset = "rotateClockwise";
```

## ScrollConfig

来源：src/logic/motion-config.ts

```ts
export interface ScrollConfig {
    /** 滚动范围定义 ["start center", "end center"] */
    offset?: [string, string];
    /** 垂直位移映射 */
    y?: [number, number];
    /** 水平位移映射 */
    x?: [number, number];
    /** 透明度映射 */
    opacity?: [number, number];
    /** 缩放映射 */
    scale?: [number, number];
    /** 垂直位移映射 (alias for y) */
    translateY?: [number, number];
    /** 水平位移映射 (alias for x) */
    translateX?: [number, number];
    /** 旋转映射 */
    rotate?: [number, number];
}
```

## FrameScope

来源：src/logic/frame-types.ts

```ts
export type FrameScope = 'self' | 'children' | 'descendants' | 'explicit';
```

## FrameAccess

来源：src/logic/frame-types.ts

```ts
export type FrameAccess = 'readonly' | 'writeable';
```
