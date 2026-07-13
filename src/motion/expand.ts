/**
 * expand.ts
 * v1.0.0
 * 展开/收起场景的默认动效配置：元素从收起态放大出现，或从展开态缩小消失。
 * 适用于全屏放大、抽屉展开、面板弹出等场景。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const EXPAND_IN_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};

export const EXPAND_OUT_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [1, 0.95],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};
