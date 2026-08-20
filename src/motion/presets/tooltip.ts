import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_TOOLTIP_APPEAR_MS,
    MOTION_DURATION_TOOLTIP_DISAPPEAR_MS,
    MOTION_EASING_TOOLTIP,
    MOTION_SCALE_TOOLTIP_APPEAR_FROM,
    MOTION_SCALE_TOOLTIP_APPEAR_TO,
    MOTION_SCALE_TOOLTIP_DISAPPEAR_FROM,
    MOTION_SCALE_TOOLTIP_DISAPPEAR_TO,
} from "../tokens";
import { getMotionTotalDurationMs } from "./utils";

export const TOOLTIP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [MOTION_SCALE_TOOLTIP_APPEAR_FROM, MOTION_SCALE_TOOLTIP_APPEAR_TO],
    duration: MOTION_DURATION_TOOLTIP_APPEAR_MS,
    easing: MOTION_EASING_TOOLTIP,
};

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
