# Progress 类型与状态

必填属性：无具名必填属性。

可双向绑定：本组件未声明具名双向绑定属性；状态更新通过公开回调或所属宿主处理。

继承声明：`Omit<FrameProps, "children" | "size">`。继承能力以基类公开文档为准；Omit 中的字段已排除，不能按基类原样使用。

[共享 Frame API](../frame/api.md) · [返回 API](./api.md)

以下为公开属性实际引用的类型声明，来自源码；Svelte Snippet 表示内容片段，ComponentProps 表示对应组件的 Props。

## ProgressVariant

来源：src/components/Progress.svelte

```ts
type ProgressVariant = "line" | "circle";
```

## SnowUIColor

来源：src/lib/color.ts

```ts
export type SnowUIColor = keyof typeof SNOWUI_COLOR_TOKENS;
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

## ComponentPartsOf

来源：src/logic/component-parts.svelte.ts

```ts
export type ComponentPartsOf<
    T extends Record<string, Component<any>>,
> = {
    [K in keyof T]?: ConfigurableComponentPartProps<T[K]>;
};
```

## ConfigurableComponentPartProps

来源：src/logic/component-parts.svelte.ts

```ts
export type ConfigurableComponentPartProps<C extends Component<any>> = Partial<
    Omit<ComponentProps<C>, ComponentPartControlledKey>
>;
```

## ComponentPartControlledKey

来源：src/logic/component-parts.svelte.ts

```ts
export type ComponentPartControlledKey =
    | "children"
    | "as"
    | "value"
    | "defaultValue"
    | "open"
    | "selected"
    | "checked"
    | "disabled"
    | "readonly"
    | "id"
    | `on${string}`
    | `aria-${string}`;
```
