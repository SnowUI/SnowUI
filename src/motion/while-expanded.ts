/**
 * while-expanded.ts
 * v1.1.0
 * whileExpanded 默认动效：展开进场（scale 0.95→1 + 渐现）。
 */

import { EXPAND_IN_MOTION } from "./expand";
import type { MotionConfig } from "../logic/motion-config";

export const WHILE_EXPANDED_DEFAULT_MOTION: MotionConfig = {
    ...EXPAND_IN_MOTION,
};
