/**
 * Motion 配置类型定义
 * v1.0.1
 * 
 * 定义动效配置的完整接口，替代原有的 any 类型
 */
import type { SnowUIColor } from "../lib/color";

/**
 * 动效缓动函数类型
 */
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
    | (string & {}); // 允许自定义 CSS 缓动函数

/**
 * 动效配置接口
 * 用于 whileHover, whileClick, whileActive 等属性
 */
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

/**
 * 显式 while* 对象只继承默认时序 / 动力学参数。
 * 视觉通道、component 视觉载体与 orchestrate 控制必须由对象完整声明。
 */
export const INHERITABLE_MOTION_TIMING_KEYS = [
    "delay",
    "duration",
    "easing",
    "type",
    "stiffness",
    "damping",
    "mass",
    "velocity",
] as const satisfies readonly (keyof MotionConfig)[];

function pickDefaultMotionTiming(
    defaultConfig: MotionConfig | undefined,
): MotionConfig {
    if (!defaultConfig) return {};

    const timing: MotionConfig = {};
    for (const key of INHERITABLE_MOTION_TIMING_KEYS) {
        const value = defaultConfig[key];
        if (value !== undefined) {
            (timing as Record<string, unknown>)[key] = value;
        }
    }
    return timing;
}

/** 解析 boolean / 显式对象形式的 while* 值，并统一执行完整视觉通道语义。 */
export function mergeWhileMotionConfig(
    defaultConfig: MotionConfig | undefined,
    userValue: MotionConfig | boolean | undefined,
): MotionConfig | undefined {
    if (userValue === false) return undefined;
    if (userValue === true) return defaultConfig;
    if (userValue && typeof userValue === "object") {
        return { ...pickDefaultMotionTiming(defaultConfig), ...userValue };
    }
    return defaultConfig;
}

/**
 * 滚动联动配置
 */
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
