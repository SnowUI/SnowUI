import type { MotionConfig } from "../../logic/motion-config";
import { MOVE_LEFT_MOTION, MOVE_RIGHT_MOTION } from "../move";
import {
    MOTION_BLUR_PAGE_PX,
    MOTION_BLUR_SMALL_PX,
    MOTION_DISTANCE_AVATAR_LIFT_Y_PX,
    MOTION_DISTANCE_NUMBER_POP_Y_PX,
    MOTION_DISTANCE_PAGE_SLIDE_X_PX,
    MOTION_DISTANCE_PANEL_REVEAL_Y_PX,
    MOTION_DISTANCE_TEXT_REVEAL_Y_PX,
    MOTION_DISTANCE_TEXT_SWAP_Y_PX,
    MOTION_DURATION_AVATAR_HOVER_MS,
    MOTION_DURATION_EMPHASIS_MS,
    MOTION_DURATION_PANEL_APPEAR_MS,
    MOTION_DURATION_PANEL_DISAPPEAR_MS,
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    MOTION_EASING_BOUNCE_NUMBER,
    MOTION_EASING_IN_OUT,
    MOTION_EASING_STANDARD,
    MOTION_SCALE_HOVER_FROM,
    MOTION_SCALE_HOVER_TO,
    MOTION_SCALE_ICON_SWAP_FROM,
} from "../tokens";

/** hover 时轻微放大；来源：transitions.dev Avatar group hover。 */
export const HOVER_SCALE_UP_MOTION: MotionConfig = {
    scale: [MOTION_SCALE_HOVER_FROM, MOTION_SCALE_HOVER_TO],
    duration: MOTION_DURATION_AVATAR_HOVER_MS,
    easing: MOTION_EASING_STANDARD,
};

export const HOVER_LIFT_MOTION: MotionConfig = {
    ...HOVER_SCALE_UP_MOTION,
    y: [0, MOTION_DISTANCE_AVATAR_LIFT_Y_PX],
};

export const NUMBER_POP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    y: [MOTION_DISTANCE_NUMBER_POP_Y_PX, 0],
    blur: [MOTION_BLUR_SMALL_PX, 0],
    duration: MOTION_DURATION_EMPHASIS_MS,
    easing: MOTION_EASING_BOUNCE_NUMBER,
};

export const TEXT_SWAP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    y: [MOTION_DISTANCE_TEXT_SWAP_Y_PX, 0],
    blur: [MOTION_BLUR_SMALL_PX, 0],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_IN_OUT,
};

export const ICON_SWAP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [MOTION_SCALE_ICON_SWAP_FROM, 1],
    blur: [MOTION_BLUR_SMALL_PX, 0],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_IN_OUT,
};

export const PANEL_REVEAL_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    y: [MOTION_DISTANCE_PANEL_REVEAL_Y_PX, 0],
    blur: [MOTION_BLUR_SMALL_PX, 0],
    duration: MOTION_DURATION_PANEL_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const PANEL_REVEAL_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    y: [0, MOTION_DISTANCE_PANEL_REVEAL_Y_PX],
    blur: [0, MOTION_BLUR_SMALL_PX],
    duration: MOTION_DURATION_PANEL_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const PAGE_SLIDE_FROM_RIGHT_MOTION: MotionConfig = {
    opacity: [0, 1],
    x: [MOTION_DISTANCE_PAGE_SLIDE_X_PX, 0],
    blur: [MOTION_BLUR_PAGE_PX, 0],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const PAGE_SLIDE_FROM_LEFT_MOTION: MotionConfig = {
    ...PAGE_SLIDE_FROM_RIGHT_MOTION,
    x: [-MOTION_DISTANCE_PAGE_SLIDE_X_PX, 0],
};

/** 右侧抽屉 / SidePanel 浮层与内嵌模式：复用 Frame 默认位移动效时序。 */
export const SIDE_PANEL_APPEAR_MOTION: MotionConfig = {
    ...MOVE_LEFT_MOTION,
    x: ["calc(100% + var(--padding-4))", 0],
    duration: MOVE_LEFT_MOTION.duration ?? MOTION_DURATION_PANEL_APPEAR_MS,
};

/** 右侧抽屉 / SidePanel 浮层与内嵌模式：复用 Frame 默认位移动效时序。 */
export const SIDE_PANEL_DISAPPEAR_MOTION: MotionConfig = {
    ...MOVE_RIGHT_MOTION,
    x: [0, "calc(100% + var(--padding-4))"],
    duration: MOVE_RIGHT_MOTION.duration ?? MOTION_DURATION_PANEL_DISAPPEAR_MS,
};

export const TEXT_REVEAL_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    y: [MOTION_DISTANCE_TEXT_REVEAL_Y_PX, 0],
    blur: [MOTION_BLUR_PAGE_PX, 0],
    duration: MOTION_DURATION_EMPHASIS_MS,
    easing: MOTION_EASING_STANDARD,
};
