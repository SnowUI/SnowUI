/**
 * fade-in.ts
 * v1.0.0
 * 默认渐显原子动效：只负责透明度进入。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_STANDARD_APPEAR_MS, MOTION_EASING_STANDARD } from "./tokens";

export const FADE_IN_MOTION: MotionConfig = {
    opacity: [0, 1],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};
