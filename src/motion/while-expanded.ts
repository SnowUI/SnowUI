/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
