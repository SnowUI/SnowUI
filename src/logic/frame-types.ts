/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { Snippet } from "svelte";
import type { MotionConfig, ScrollConfig } from "./motion-config";
import type { ComponentParts } from "./component-parts.svelte";

export type LoopMotionPreset = "rotateClockwise";

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

/**
 * 核心状态类型
 */
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
    | (string & {}); // Support custom states

/**
 * 状态转变配置：目标状态，可选 'auto' 表示动效完成后自动转变
 * 支持回调函数：
 * - 纯回调: (e?: any) => void
 * - 组合: { next?: CoreState, auto?: boolean, run?: (e?: any) => void }
 */
export type StateTransition =
    | CoreState
    | [CoreState, "auto"]
    | ((e?: any) => void)
    | { next?: CoreState; auto?: boolean; run?: (e?: any) => void };

/**
 * 通用状态值映射
 * 按 currentState 解析值，未命中时回退 Idle
 */
export type StateValueMap<T = any> = Partial<Record<CoreState, T>>;

/**
 * 联动控制配置
 * 用于控制其他组件的动效
 */
export interface LinkageControl {
    target: string | object; // Support object ref (component instance)
    action: "play" | "reset" | "pause"; // 动作类型
    reverse?: boolean; // 是否反向执行
    stop?: boolean; // Stop propagation
    prevent?: boolean; // Prevent default
}

/**
 * 事件触发配置：可以是状态转变，也可以是联动控制，或者是回调函数
 */
export type EventTrigger =
    | CoreState
    | LinkageControl
    | ((e?: any) => void)
    | { run?: (e?: any) => void; stop?: boolean; prevent?: boolean; next?: CoreState; state?: CoreState;[key: string]: any }
    | Partial<Record<CoreState, any>>;

/**
 * Frame 组件 Props 接口
 * 所有关键字严格按照 Frame.md 文档定义
 */
export type FrameScope = 'self' | 'children' | 'descendants' | 'explicit';
export type FrameAccess = 'readonly' | 'writeable';
export type SkeletonRenderVariant = "line" | "circle" | "rect";

export interface RenderHints {
    variant?: SkeletonRenderVariant;
    width?: string | number;
    height?: string | number;
    radius?: string | number;
    rows?: number;
}

export type FrameResponsiveDirection =
    | "row"
    | "column"
    | "row-reverse"
    | "column-reverse";

export type FrameResponsiveAlignment = "start" | "center" | "end" | "stretch";

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

/**
 * Frame 的内容适配规则。
 *
 * 不使用设备断点；当首选布局在当前容器宽度内放不下时自动启用，
 * 宽度恢复后自动回到首选布局。
 */
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

export interface FrameProps {
    /**
     * 复合组件内部专用：为该 Frame 直接承载的子组件建立 parts 边界。
     * 普通消费方不应直接使用；由复合组件的公开 parts Prop 映射。
     */
    componentParts?: ComponentParts;
    // === 0. 能力开关 (Capability Switches) ===
    /**
     * 响应式监听能力 (默认: true)
     * 控制 FrameResponsive 初始化和 ResizeObserver
     */
    enableResponsive?: boolean;

    /**
     * 上下文提供能力 (默认: true)
     * 控制 FramePerception Context 提供
     */
    enableContext?: boolean;

    /**
     * 尺寸比例监听能力 (默认: false)
     * 控制 frameScaleObserver 是否写入运行时宽高与高宽比变量
     */
    enableScaleObserver?: boolean;

    /**
     * 默认动效开关 (默认: true)
     * 设为 false 时，该 Frame 的所有 while* 不自动注入默认动效。
     * 用户显式传入的 while* 配置不受影响。
     */
    enableDefaultMotion?: boolean;

    /**
     * 自动布局协议开关 (默认: true)
     * 当 Frame 声明了 row / column 方向时默认激活，在根 DOM 上输出 data-auto-layout 属性，
     * 继承 auto-layout.css 的三槽位感知、Wrap、Gap 等规则。
     * 设为 false 可关闭（退回基础方向类，不注入协议规则）。
     */
    enableAutoLayout?: boolean;

    /**
     * 普通内容子项宽度填满 Frame 内容区。
     * 与 contentHug 同时传入时，contentFill 优先。
     */
    contentFill?: boolean;

    /**
     * 普通内容子项宽度按内容收缩。
     */
    contentHug?: boolean;

    /**
     * Pin 布局统一偏移。数字会转为 px，字符串按原值输出。
     */
    pinOffset?: number | string;

    /**
     * Pin 布局水平偏移，优先级高于 pinOffset。
     */
    pinOffsetX?: number | string;

    /**
     * Pin 布局垂直偏移，优先级高于 pinOffset。
     */
    pinOffsetY?: number | string;

    /**
     * 运行时高度变量名 (默认: --snowui-scale-height-runtime)
     */
    scaleHeightVar?: string;

    /**
     * 运行时宽度变量名 (默认: --snowui-scale-width-runtime)
     */
    scaleWidthVar?: string;

    /**
     * 运行时高宽比变量名 (默认: --snowui-scale-aspect-ratio-runtime)
     */
    scaleAspectRatioVar?: string;

    /**
     * 运行时统一尺寸变量名 (默认: --snowui-scale-size-runtime)
     * 该值由 scaleBasis + sizeRatio 计算后写入
     */
    scaleSizeVar?: string;

    /**
     * 尺寸监听目标
     * - self: 监听组件自身
     * - parent: 监听父级容器
     */
    scaleObserverTarget?: "self" | "parent";

    /**
     * Scale 计算依据 (默认: height)
     * - height: 仅基于高度
     * - width: 仅基于宽度
     * - mixed: 高宽混合
     * - aspect: 基于高宽比
     */
    scaleBasis?: "height" | "width" | "mixed" | "aspect";

    /**
     * mixed 模式下高度权重 (默认: 0.5)
     * 宽度权重 = 1 - scaleMixHeightWeight
     */
    scaleMixHeightWeight?: number;

    /**
     * aspect 模式下的参考高宽比 (默认: 1)
     */
    scaleAspectBaseRatio?: number;

    /**
     * 统一尺寸比例 (默认: 1)
     * 用于将 basis 尺寸映射到统一尺寸系统
     */
    sizeRatio?: number;

    /**
     * Icon 比例 (默认: 跟随 sizeRatio)
     * 可用于局部覆盖 Icon 的尺寸比例
     */
    iconSizeRatio?: number;

    /**
     * Avatar 比例 (默认: 跟随 sizeRatio)
     * 可用于局部覆盖 Avatar 的尺寸比例
     */
    avatarSizeRatio?: number;

    // === 1. 基础属性 (Base Props) ===
    class?: string;
    style?: string;
    children?: Snippet<[any]>;
    as?: string;
    tag?: string;
    id?: string;
    element?: HTMLElement;
    use?: any[];
    /**
     * 组件尺寸（用于传递给子组件，如资源组件选择正确分辨率）
     */
    size?: number;
    /**
     * Icon 独立尺寸（Context 传递）
     */
    iconSize?: number;
    /**
     * Avatar 独立尺寸（Context 传递）
     */
    avatarSize?: number;
    /**
     * 是否进入加载态
     * 仅表示状态，不定义加载态具体视觉
     */
    loading?: boolean;
    /**
     * 加载态是否渲染骨架
     * 默认 true，可通过父级上下文继承
     */
    skeleton?: boolean;
    /**
     * 组件向 Frame/Skeleton 提供的渲染提示桥
     * 当前用于传递骨架形态与尺寸信息
     */
    renderHints?: RenderHints;
    // ...rest 通过 [key: string]: any 实现

    // === 1.1 Custom States ===
    /**
     * 外部受控核心状态。
     * 用于 Portal / Toast 等由父级生命周期管理的场景，把 Appear / Disappear / Active
     * 等状态交给 Frame 默认动效系统统一解析。
     */
    currentState?: CoreState;
    customStates?: string[];

    // === 2.1 核心状态链式转变 (Core State Transitions) ===
    StartLoad?: StateTransition;
    Load?: StateTransition;
    Reload?: StateTransition;
    Appear?: StateTransition;
    Disappear?: StateTransition;
    Idle?: StateTransition;
    Active?: StateTransition;
    Disabled?: StateTransition;

    // === 2.1.1 扩展状态 (Extended States) ===
    Validating?: StateTransition;
    Uploading?: StateTransition;
    Editing?: StateTransition;

    // === 2.1.1 Reload 回调 ===
    onReload?: () => Promise<void>;

    // === 2.1.2 通用状态变量映射 (Generic State Variables) ===
    /**
     * 允许声明任意“按状态切换的变量”
     * 例如：
     * stateVars={{
     *   stateText: { Idle: "Ready", Pending: "Loading..." },
     *   buttonIcon: { Idle: ArrowLineDown, Pending: Spinner }
     * }}
     */
    stateVars?: Record<string, StateValueMap<any>>;
    /**
     * 按状态切换 class（追加到组件 class）
     */
    stateClass?: StateValueMap<string>;
    /**
     * 按状态切换 style（支持 style 字符串）
     */
    stateStyle?: StateValueMap<string | Record<string, string | number>>;
    /**
     * 按状态切换子内容（Snippet），Frame 自动处理内容切换的补间动效（crossfade）
     */
    stateContent?: StateValueMap<any>;

    // === 2.3 事件驱动状态转变 / 联动控制 (Event-Driven State Transitions / Linkage Control) ===
    Click?: EventTrigger;
    Drag?: EventTrigger;
    Hover?: EventTrigger;
    Focus?: EventTrigger;
    Key?:
    | { key: string; state: CoreState }
    | {
        key: string;
        target: string;
        action: string;
        reverse?: boolean;
    }
    | { key: string; run: (e?: any) => void };
    Scroll?: EventTrigger;

    // === 2.2 形态 (Morphology) ===
    collapsed?: boolean;
    expanded?: boolean;

    // === 3. 响应式能力 (Responsiveness) ===
    /**
     * 基于 Frame 当前容器宽度的内容适配规则。
     * 未传入时不改变布局；所有启用响应能力的 Frame 仍会在必要时把大于 4px 的
     * gap / padding 向下压缩到 4px，原值小于 4px 时保持不变。
     */
    responsive?: FrameResponsiveProps | false;

    // === 3.1 断点触发布局 (Breakpoint Layout) ===
    xs?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";
    sm?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";
    md?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";
    lg?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";
    xl?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";
    "2xl"?: "row" | "column" | "grid" | "row-reverse" | "column-reverse";

    // === 4.1 内部布局控制 ===
    row?: boolean;
    /** Row 附件与正文首行行框居中；正文继承宿主行高，默认关闭。 */
    firstLine?: boolean;
    column?: boolean;
    grid?: boolean;
    reverse?: boolean;

    // === 4.2 布局稳定性 ===
    morph?: boolean;

    // === 5.1 事件驱动动效 (Event-Driven Triggers) ===
    // 支持 MotionConfig 对象或简洁的 boolean 标志
    whileLoad?: MotionConfig | boolean;
    whileReload?: MotionConfig | boolean;
    whileAppear?: MotionConfig | boolean;
    whileDisappear?: MotionConfig | boolean;
    whileIdle?: MotionConfig | boolean;
    whileActive?: MotionConfig | boolean;
    whileDisabled?: MotionConfig | boolean;
    whileClick?: MotionConfig | boolean;
    whileDrag?: MotionConfig | boolean;
    whileHover?: MotionConfig | boolean;
    whileFocus?: MotionConfig | boolean;
    whileKey?: MotionConfig | boolean;
    whileScroll?: MotionConfig | boolean;

    // === 5.1.1 扩展状态动效 (Extended State Triggers) ===
    whileValidating?: MotionConfig | boolean;
    whileUploading?: MotionConfig | boolean;
    whileEditing?: MotionConfig | boolean;

    // === 5.2 形态驱动动效 (Morphology-Driven Triggers) ===
    whileCollapsed?: MotionConfig;
    whileExpanded?: MotionConfig;

    // === 5.3 响应式驱动动效 (Responsive-Driven Triggers) ===
    whileXs?: MotionConfig;
    whileSm?: MotionConfig;
    whileMd?: MotionConfig;
    whileLg?: MotionConfig;
    whileXl?: MotionConfig;
    while2xl?: MotionConfig;

    // === 5.4 动效变体 (Motion Variants) ===
    variants?: Record<string, MotionConfig>;

    // === 5.5 动效执行参数 (Motion Execution Parameters) ===
    delay?: number;
    /**
     * 循环动画桥接配置
     * 用于 Spinner 等持续循环的组件，将 duration / easing / iteration 等统一挂到 Frame CSS 变量桥接层。
     */
    loopMotion?: LoopMotionConfig;

    // === 5.7 滚动联动 (Scroll-Linked Animations) [New in v2.0] ===
    scroll?: ScrollConfig;
    /** 共享元素转场 ID */
    layoutId?: string;
    /**
     * 元素替换锚点 ID（推荐）
     * 与 layoutId 语义一致，但更强调“同一位置元素替换”场景
     */
    itemId?: string;

    // === 5.8 Frame Evolution [New in v1.3] ===
    /** 能力作用域 */
    scope?: FrameScope;
    /** 上下文权限 */
    access?: FrameAccess;

    // === 5.6 高级编排与时间轴 (Advanced Orchestration & Timeline) ===
    timeline?: string;

    // === 5.5 编排模式 (Orchestration) ===
    orchestrate?: boolean;
    orchestrateMode?: "sequential" | "random" | "parallel";
    orchestrateDelay?: number;
    orchestrateOrder?:
    | "visual-row"
    | "visual-column"
    | "visual-row-reverse"
    | "visual-column-reverse"
    | "dom";
    orchestrateGroup?: string;
    orchestrateTrigger?: "appear" | "hover" | "click" | "scroll" | "none";
    orchestrateTarget?: string;

    // === 10. 样式编排 (Style Orchestration) ===
    /**
     * 样式编排配置
     * 键为 ID 选择器 (e.g. "#id")，值为样式对象
     */
    styles?: Record<string, Record<string, string | number>>;

    /** 内边距 (0-12 token) */
    padding?: number;
    /** 间距 (0-12 token) */
    gap?: number;
    /** 圆角 (0-6 token) */
    radius?: number | "full";
    /** 外边框 (1-4 px) */
    border?: number;
    /** 内边框 (box-shadow) */
    innerBorder?: boolean | string;
    /** 字体大小 (1-9 token) */
    fontSize?: number | string;
    /** 最小宽度 */
    minWidth?: number | string;
    /** 最小高度 */
    minHeight?: number | string;
    /** 宽度 */
    width?: number | string;
    /** 高度 */
    height?: number | string;
    /** 透明度 (0-1) */
    opacity?: number;

    // === 属性透传 ===
    [key: string]: any;
}
