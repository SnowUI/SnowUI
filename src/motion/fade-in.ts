/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
