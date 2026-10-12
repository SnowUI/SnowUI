/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * scale-in.ts
 * v1.0.0
 * 默认缩放进入原子动效：只负责由小变大。
 */

import type { MotionConfig } from "../logic/motion-config";
import {
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_EASING_STANDARD,
    MOTION_SCALE_GENERIC_APPEAR_FROM,
    MOTION_SCALE_GENERIC_APPEAR_TO,
} from "./tokens";

export const SCALE_IN_MOTION: MotionConfig = {
    scale: [MOTION_SCALE_GENERIC_APPEAR_FROM, MOTION_SCALE_GENERIC_APPEAR_TO],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};
