/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * rotate.ts
 * v1.0.1
 * 旋转类默认动效：顺时针旋转与翻转。
 * 2026-03-03: FLIP 默认动效改为 rotateY，避免与平面旋转混淆。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const ROTATE_CLOCKWISE_MOTION: MotionConfig = {
    rotate: [0, 360],
    duration: MOTION_DURATION_BASE_MS,
    easing: "linear",
};

export const FLIP_MOTION: MotionConfig = {
    rotateY: [0, 180],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeInOut",
};
