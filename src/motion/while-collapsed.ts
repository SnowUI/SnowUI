/**
 * while-collapsed.ts
 * v1.1.0
 * whileCollapsed 默认动效：收起离场（scale 1→0.95 + 渐隐）。
 */

import { EXPAND_OUT_MOTION } from "./expand";
import type { MotionConfig } from "../logic/motion-config";

export const WHILE_COLLAPSED_DEFAULT_MOTION: MotionConfig = {
    ...EXPAND_OUT_MOTION,
};
