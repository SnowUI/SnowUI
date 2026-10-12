/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * bridge.ts
 * v1.1.0
 * Frame 通用动效桥接默认策略：
 * - 将 control / border / appear / loop 的 CSS 变量桥接逻辑从 Frame.svelte 抽离
 * - 统一管理桥接变量前缀与默认回退动效
 */

import type {
    LoopMotionConfig,
    LoopMotionPreset,
} from "../logic/frame-types";
import type { MotionConfig } from "../logic/motion-config";
import { MORPH_MOTION } from "./morph";
import { ROTATE_CLOCKWISE_MOTION } from "./rotate";
import { WHILE_APPEAR_DEFAULT_MOTION } from "./while-appear";

type MotionTimingSource = Partial<Pick<MotionConfig, "duration" | "easing">>;

export interface MotionTimingBridge {
    variablePrefix: string;
    fallback: MotionConfig;
}

export interface LoopMotionBridge {
    variablePrefix: string;
    fallback: MotionConfig;
}

export const FRAME_CONTROL_MOTION_BRIDGE: MotionTimingBridge = {
    variablePrefix: "snowui-frame-control-motion",
    fallback: MORPH_MOTION,
};

export const FRAME_BORDER_MOTION_BRIDGE: MotionTimingBridge = {
    variablePrefix: "snowui-frame-border-motion",
    fallback: MORPH_MOTION,
};

export const FRAME_APPEAR_MOTION_BRIDGE: MotionTimingBridge = {
    variablePrefix: "snowui-frame-appear-motion",
    fallback: WHILE_APPEAR_DEFAULT_MOTION,
};

/**
 * 颜色过渡桥接：用于前景色（color）和背景色（background-color）的 CSS transition 时序管理。
 * CSS 内消费方式：
 *   transition: color var(--snowui-frame-color-motion-duration) var(--snowui-frame-color-motion-easing);
 */
export const FRAME_COLOR_MOTION_BRIDGE: MotionTimingBridge = {
    variablePrefix: "snowui-frame-color-motion",
    fallback: { duration: 150, easing: "easeOut" },
};

/**
 * 尺寸过渡桥接：用于宽高(width / height / min-width / min-height)的 CSS transition 时序管理。
 * 用途场景:Tab/Segmented icon-toggle 子项展开宽度、Chip 折叠展开等"内容驱动尺寸变化"场景。
 * CSS 内消费方式：
 *   transition: width var(--snowui-frame-size-motion-duration) var(--snowui-frame-size-motion-easing);
 */
export const FRAME_SIZE_MOTION_BRIDGE: MotionTimingBridge = {
    variablePrefix: "snowui-frame-size-motion",
    fallback: MORPH_MOTION,
};

export const FRAME_LOOP_MOTION_BRIDGE: LoopMotionBridge = {
    variablePrefix: "snowui-frame-loop-motion",
    fallback: ROTATE_CLOCKWISE_MOTION,
};

const LOOP_MOTION_PRESET_ANIMATION_NAMES: Record<
    LoopMotionPreset,
    string
> = {
    rotateClockwise: "snowui-frame-loop-rotate-clockwise",
};

export function resolveCssEasing(easing: unknown) {
    if (!easing || typeof easing !== "string") return "ease-out";
    const map: Record<string, string> = {
        linear: "linear",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    };
    return map[easing] || easing;
}

export function resolveMotionTiming(
    config: MotionTimingSource | undefined,
    fallback?: MotionTimingSource,
) {
    const fallbackDuration =
        typeof fallback?.duration === "number" ? fallback.duration : 300;
    const duration =
        typeof config?.duration === "number"
            ? config.duration
            : fallbackDuration;
    const easing = resolveCssEasing(config?.easing ?? fallback?.easing);

    return {
        durationCss: `${duration}ms`,
        easing,
        transition: `all ${duration}ms ${easing}`,
    };
}

export function createMotionTimingBridgeStyle(
    bridge: MotionTimingBridge,
    config: MotionConfig | undefined,
) {
    const timing = resolveMotionTiming(config, bridge.fallback);
    return [
        `--${bridge.variablePrefix}-duration: ${timing.durationCss}`,
        `--${bridge.variablePrefix}-easing: ${timing.easing}`,
        `--${bridge.variablePrefix}-transition: ${timing.transition}`,
    ].join(";");
}

function resolveLoopIterationCount(value: LoopMotionConfig["iterationCount"]) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        return String(value);
    }
    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }
    return "infinite";
}

function resolveLoopDirection(value: LoopMotionConfig["direction"]) {
    return value ?? "normal";
}

function resolveLoopPlayState(value: LoopMotionConfig["playState"]) {
    return value ?? "running";
}

export function createLoopMotionBridgeStyle(
    config: LoopMotionConfig | undefined,
    bridge: LoopMotionBridge = FRAME_LOOP_MOTION_BRIDGE,
) {
    if (!config || typeof config !== "object") return "";

    const timing = resolveMotionTiming(config, bridge.fallback);

    return [
        `--${bridge.variablePrefix}-duration: ${timing.durationCss}`,
        `--${bridge.variablePrefix}-easing: ${timing.easing}`,
        `--${bridge.variablePrefix}-iteration-count: ${resolveLoopIterationCount(config.iterationCount)}`,
        `--${bridge.variablePrefix}-direction: ${resolveLoopDirection(config.direction)}`,
        `--${bridge.variablePrefix}-play-state: ${resolveLoopPlayState(config.playState)}`,
    ].join(";");
}

export function resolveLoopMotionPresetName(
    preset: LoopMotionConfig["preset"],
) {
    if (!preset) return undefined;
    return LOOP_MOTION_PRESET_ANIMATION_NAMES[preset];
}

export function createLoopMotionPresetStyle(
    config: LoopMotionConfig | undefined,
    bridge: LoopMotionBridge = FRAME_LOOP_MOTION_BRIDGE,
) {
    if (!config || typeof config !== "object" || !config.preset) return "";

    const animationName = resolveLoopMotionPresetName(config.preset);
    if (!animationName) return "";

    const timing = resolveMotionTiming(config, bridge.fallback);

    return [
        "will-change: transform",
        `animation-name: ${animationName}`,
        `animation-duration: var(--${bridge.variablePrefix}-duration, ${timing.durationCss})`,
        `animation-timing-function: var(--${bridge.variablePrefix}-easing, ${timing.easing})`,
        `animation-iteration-count: var(--${bridge.variablePrefix}-iteration-count, ${resolveLoopIterationCount(config.iterationCount)})`,
        `animation-direction: var(--${bridge.variablePrefix}-direction, ${resolveLoopDirection(config.direction)})`,
        `animation-play-state: var(--${bridge.variablePrefix}-play-state, ${resolveLoopPlayState(config.playState)})`,
    ].join(";");
}
