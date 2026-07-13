/**
 * fade-out.ts
 * v1.0.0
 * 默认消失动效：渐隐。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_STANDARD_DISAPPEAR_MS, MOTION_EASING_STANDARD } from "./tokens";

export const FADE_OUT_MOTION: MotionConfig = {
    opacity: [1, 0],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};
