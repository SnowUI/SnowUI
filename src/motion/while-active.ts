/**
 * while-active.ts
 * v1.0.0
 * whileActive 默认动效：复用 morph（形态变化平滑过渡）。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MORPH_MOTION } from "./morph";

export const WHILE_ACTIVE_DEFAULT_MOTION: MotionConfig = {
    ...MORPH_MOTION,
};
