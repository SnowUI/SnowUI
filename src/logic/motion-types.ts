/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Motion System Types
 */

import { cubicOut } from "svelte/easing";

/**
 * 缓动函数类型
 * 直接复用 svelte/easing 的函数签名
 */
export type EasingFunction = (t: number) => number;

/**
 * 动效执行参数 (5.1 基础参数)
 * 这些参数适用于所有 while* 触发器
 */
export interface MotionExecutionParams {
    /** 延迟执行时间 (ms)，默认 0 */
    delay?: number;
    /** 动画持续时间 (ms)，默认 300 */
    duration?: number;
    /** 缓动函数，默认 cubicOut */
    easing?: EasingFunction;
    /** 动效类型: 'tween' (默认) | 'spring' */
    type?: "tween" | "spring";
    /** 弹簧刚度 (默认 170) */
    stiffness?: number;
    /** 弹簧阻尼 (默认 26) */
    damping?: number;
    /** 弹簧质量 (默认 1) */
    mass?: number;
}

/**
 * 默认动效执行参数
 */
export const DEFAULT_MOTION_PARAMS: Required<MotionExecutionParams> = {
    delay: 0,
    duration: 300,
    easing: cubicOut,
    type: "tween",
    stiffness: 170,
    damping: 26,
    mass: 1,
};

/**
 * 动效事件类型
 * 严格按照 motion.md 文档定义
 */
export type MotionEvent =
    // 1. 事件驱动动效
    | "whileLoad"
    | "whileReload"
    | "whileAppear"
    | "whileDisappear"
    | "whileIdle"
    | "whileActive"
    | "whileDisabled"
    | "whileClick"
    | "whileDrag"
    | "whileHover"
    | "whileFocus"
    | "whileKey"
    | "whileScroll"
    | "whileValidating"
    | "whileUploading"
    | "whileEditing"
    // 2. 形态驱动动效
    | "whileCollapsed"
    | "whileExpanded"
    // 3. 响应式驱动动效
    | "whileXs"
    | "whileSm"
    | "whileMd"
    | "whileLg"
    | "whileXl"
    | "while2xl";

export interface MotionRegistration {
    id: string;
    element?: HTMLElement;
    timeline?: string; // e.g., "intro:1, hover:2"
    scroll?: Record<string, any>; // 滚动联动配置
    layoutId?: string; // 共享元素转场 ID
    scope?: "self" | "children" | "descendants" | "explicit"; // 能力作用域
    /** 动效执行参数 */
    params?: MotionExecutionParams;
    onEvent?: (event: MotionEvent, payload?: any) => void;
}

export interface LayoutTransitionOptions {
    /** 动画持续时间 (ms)，默认读取 Frame appear bridge */
    duration?: number;
    /** CSS 缓动函数，默认读取 Frame appear bridge */
    easing?: string;
    /** 动效完成回调 */
    onComplete?: () => void;
}

/**
 * 元素组注册选项 (用于调用方提供的元素组)
 */
export interface RegisterGroupOptions {
    /** 编排模式 */
    orchestrateMode?: "sequential" | "random" | "parallel";
    /** 间隔延迟 (ms) */
    orchestrateDelay?: number;
    /** 顺序：ltr (从左到右), rtl, center, random */
    orchestrateOrder?: "ltr" | "rtl" | "center" | "random";
    /** 动效定义 */
    whileAppear?: Record<string, any>;
    /** 动效开始回调 */
    onStart?: () => void;
    /** 动效完成回调 (所有元素完成后触发) */
    onComplete?: () => void;
    /** 单个元素完成回调 */
    onElementComplete?: (element: HTMLElement, index: number) => void;
}
