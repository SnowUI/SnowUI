/**
 * while-disabled.ts
 * v1.0.0
 * whileDisabled 默认动效：透明度渐变至 0.2。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const WHILE_DISABLED_DEFAULT_MOTION: MotionConfig = {
    opacity: [1, 0.2],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};
