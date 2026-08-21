import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_TOOLTIP_APPEAR_MS,
    MOTION_DURATION_TOOLTIP_DISAPPEAR_MS,
    MOTION_DISTANCE_TOOLTIP_APPEAR_PX,
    MOTION_EASING_TOOLTIP,
    MOTION_SCALE_TOOLTIP_APPEAR_FROM,
    MOTION_SCALE_TOOLTIP_APPEAR_TO,
    MOTION_SCALE_TOOLTIP_DISAPPEAR_FROM,
    MOTION_SCALE_TOOLTIP_DISAPPEAR_TO,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_BASE_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_MAX_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_MIN_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_PER_PX_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_BASE_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_MAX_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_MIN_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_PER_PX_MS,
    MOTION_PROGRESS_TOOLTIP_CONTINUOUS_CONTENT_LAG,
    MOTION_PROGRESS_TOOLTIP_CONTINUOUS_RETARGET_CONTENT_LAG,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_WIDTH_SPRING_MS,
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_WIDTH_SPRING_MS,
    MOTION_SPRING_TOOLTIP_WIDTH_DAMPING,
    MOTION_SPRING_TOOLTIP_WIDTH_FREQUENCY,
} from "../tokens";
import { getMotionTotalDurationMs } from "./utils";

export const TOOLTIP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [MOTION_SCALE_TOOLTIP_APPEAR_FROM, MOTION_SCALE_TOOLTIP_APPEAR_TO],
    duration: MOTION_DURATION_TOOLTIP_APPEAR_MS,
    easing: MOTION_EASING_TOOLTIP,
};

export type TooltipMotionPosition = "top" | "bottom" | "left" | "right";

export function getTooltipAppearMotion(
    position: TooltipMotionPosition,
): MotionConfig {
    if (position === "top") {
        return {
            ...TOOLTIP_APPEAR_MOTION,
            y: [MOTION_DISTANCE_TOOLTIP_APPEAR_PX, 0],
        };
    }
    if (position === "bottom") {
        return {
            ...TOOLTIP_APPEAR_MOTION,
            y: [-MOTION_DISTANCE_TOOLTIP_APPEAR_PX, 0],
        };
    }
    if (position === "left") {
        return {
            ...TOOLTIP_APPEAR_MOTION,
            x: [MOTION_DISTANCE_TOOLTIP_APPEAR_PX, 0],
        };
    }
    return {
        ...TOOLTIP_APPEAR_MOTION,
        x: [-MOTION_DISTANCE_TOOLTIP_APPEAR_PX, 0],
    };
}

export const TOOLTIP_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [
        MOTION_SCALE_TOOLTIP_DISAPPEAR_FROM,
        MOTION_SCALE_TOOLTIP_DISAPPEAR_TO,
    ],
    duration: MOTION_DURATION_TOOLTIP_DISAPPEAR_MS,
    easing: MOTION_EASING_TOOLTIP,
};

export const TOOLTIP_APPEAR_TOTAL_MS = getMotionTotalDurationMs(
    TOOLTIP_APPEAR_MOTION,
);
export const TOOLTIP_DISAPPEAR_TOTAL_MS = getMotionTotalDurationMs(
    TOOLTIP_DISAPPEAR_MOTION,
);

export const TOOLTIP_CONTINUOUS_BASE_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_BASE_MS;
export const TOOLTIP_CONTINUOUS_MIN_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_MIN_MS;
export const TOOLTIP_CONTINUOUS_MAX_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_MAX_MS;
export const TOOLTIP_CONTINUOUS_DURATION_PER_PX_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_PER_PX_MS;
export const TOOLTIP_CONTINUOUS_CONTENT_LAG =
    MOTION_PROGRESS_TOOLTIP_CONTINUOUS_CONTENT_LAG;
export const TOOLTIP_CONTINUOUS_RETARGET_BASE_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_BASE_MS;
export const TOOLTIP_CONTINUOUS_RETARGET_MIN_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_MIN_MS;
export const TOOLTIP_CONTINUOUS_RETARGET_MAX_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_MAX_MS;
export const TOOLTIP_CONTINUOUS_RETARGET_DURATION_PER_PX_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_PER_PX_MS;
export const TOOLTIP_CONTINUOUS_RETARGET_CONTENT_LAG =
    MOTION_PROGRESS_TOOLTIP_CONTINUOUS_RETARGET_CONTENT_LAG;
export const TOOLTIP_CONTINUOUS_WIDTH_SPRING_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_WIDTH_SPRING_MS;
export const TOOLTIP_CONTINUOUS_RETARGET_WIDTH_SPRING_DURATION_MS =
    MOTION_DURATION_TOOLTIP_CONTINUOUS_RETARGET_WIDTH_SPRING_MS;

/**
 * Normalized underdamped spring used only for continuous Tooltip width changes.
 * It reaches the target smoothly, overshoots by about 5%, then settles exactly
 * at the end of its independent width timeline.
 */
export function getTooltipWidthSpringProgress(progress: number) {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;

    const response = (value: number) =>
        1 -
        Math.exp(-MOTION_SPRING_TOOLTIP_WIDTH_DAMPING * value) *
            (Math.cos(MOTION_SPRING_TOOLTIP_WIDTH_FREQUENCY * value) +
                (MOTION_SPRING_TOOLTIP_WIDTH_DAMPING /
                    MOTION_SPRING_TOOLTIP_WIDTH_FREQUENCY) *
                    Math.sin(MOTION_SPRING_TOOLTIP_WIDTH_FREQUENCY * value));

    return response(progress) / response(1);
}

/** @deprecated Continuous Tooltip now uses one bounded coordinated timeline. */
export const TOOLTIP_CONTINUOUS_SHELL_SPEED_PX_PER_MS = 0.5;
/** @deprecated Continuous Tooltip now uses one bounded coordinated timeline. */
export const TOOLTIP_CONTINUOUS_CONTENT_SPEED_PX_PER_MS = 0.3;
/** @deprecated Continuous Tooltip now uses one bounded coordinated timeline. */
export const TOOLTIP_CONTINUOUS_CONTENT_END_SPEED_PX_PER_MS = 0.05;
/** @deprecated Continuous Tooltip now uses one bounded coordinated timeline. */
export const TOOLTIP_CONTINUOUS_CONTENT_DECELERATE_FROM = 0.9;
