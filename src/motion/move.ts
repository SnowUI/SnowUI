/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * move.ts
 * v1.1.0
 * 默认位移动效：轻微位移后回到目标位置。
 */

import type { MotionConfig } from "../logic/motion-config";
import {
    MOTION_DURATION_BASE_MS,
    MOTION_DURATION_MOVE_MS,
    MOTION_SPRING_MOVE_DAMPING,
    MOTION_SPRING_MOVE_MASS,
    MOTION_SPRING_MOVE_STIFFNESS,
} from "./tokens";
import {
    composeMotionConfigs,
    createFadeMotion,
    createSlideYMotion,
} from "./primitives";

export const MOVE_MOTION: MotionConfig = {
    y: [8, 0],
    duration: MOTION_DURATION_MOVE_MS,
    type: "spring",
    stiffness: MOTION_SPRING_MOVE_STIFFNESS,
    damping: MOTION_SPRING_MOVE_DAMPING,
    mass: MOTION_SPRING_MOVE_MASS,
};

export const MOVE_RIGHT_MOTION: MotionConfig = {
    ...MOVE_MOTION,
    x: [0, 160],
    y: undefined,
};

export const MOVE_LEFT_MOTION: MotionConfig = {
    ...MOVE_MOTION,
    x: [0, -160],
    y: undefined,
};

export const MOVE_DOWN_MOTION: MotionConfig = {
    ...MOVE_MOTION,
    y: [0, 100],
};

export const SLIDE_FROM_TOP_MOTION: MotionConfig = composeMotionConfigs(
    createSlideYMotion(["-100%", 0]),
    createFadeMotion([0.8, 1]),
    { duration: MOTION_DURATION_BASE_MS, easing: "ease" },
);

export const SLIDE_FROM_BOTTOM_MOTION: MotionConfig = composeMotionConfigs(
    createSlideYMotion(["100%", 0]),
    createFadeMotion([0.8, 1]),
    { duration: MOTION_DURATION_BASE_MS, easing: "ease" },
);

export const SLIDE_TO_TOP_MOTION: MotionConfig = composeMotionConfigs(
    createSlideYMotion([0, "calc(-100% - var(--snowui-toast-exit-offset, 16px))"]),
    createFadeMotion([1, 0.8]),
    { duration: MOTION_DURATION_BASE_MS, easing: "ease" },
);

export const SLIDE_TO_BOTTOM_MOTION: MotionConfig = composeMotionConfigs(
    createSlideYMotion([0, "calc(100% + var(--snowui-toast-exit-offset, 16px))"]),
    createFadeMotion([1, 0.8]),
    { duration: MOTION_DURATION_BASE_MS, easing: "ease" },
);

export const SLIDE_STACK_MOTION: MotionConfig = {
    duration: MOTION_DURATION_BASE_MS,
    easing: "ease",
};
