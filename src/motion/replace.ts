/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * replace.ts
 * v1.0.0
 * 同位替换默认动效：旧元素缩小渐隐，新元素渐现变大。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const REPLACE_IN_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [0.88, 1],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};

export const REPLACE_OUT_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [1, 0.88],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};
