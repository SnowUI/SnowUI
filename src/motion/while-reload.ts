/**
 * while-reload.ts
 * v1.0.0
 * whileReload 默认动效：复用顺时针旋转。
 */

import type { MotionConfig } from "../logic/motion-config";
import { ROTATE_CLOCKWISE_MOTION } from "./rotate";

export const WHILE_RELOAD_DEFAULT_MOTION: MotionConfig = {
    ...ROTATE_CLOCKWISE_MOTION,
};
