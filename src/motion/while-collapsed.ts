/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
