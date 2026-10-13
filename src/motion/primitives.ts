/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
