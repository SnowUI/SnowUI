import type { MotionConfig } from "../logic/motion-config";

type MotionTiming = Pick<MotionConfig, "delay" | "duration" | "easing" | "type" | "stiffness" | "damping" | "mass" | "velocity">;

export function composeMotionConfigs(
    ...configs: Array<MotionConfig | undefined | null | false>
): MotionConfig {
    const composed: MotionConfig = {};
    for (const config of configs) {
        if (!config || typeof config !== "object") continue;
        Object.assign(composed, config);
    }
    return composed;
}

function withTiming(config: MotionConfig, timing?: MotionTiming): MotionConfig {
    return timing ? composeMotionConfigs(config, timing) : config;
}

export function createFadeMotion(
    opacity: MotionConfig["opacity"],
    timing?: MotionTiming,
): MotionConfig {
    return withTiming({ opacity }, timing);
}

export function createScaleMotion(
    scale: MotionConfig["scale"],
    timing?: MotionTiming,
): MotionConfig {
    return withTiming({ scale }, timing);
}

export function createSlideYMotion(
    y: MotionConfig["y"],
    timing?: MotionTiming,
): MotionConfig {
    return withTiming({ y }, timing);
}

export function createStackTranslateMotion(
    y: MotionConfig["y"],
    timing?: MotionTiming,
): MotionConfig {
    return withTiming({ y }, timing);
}
