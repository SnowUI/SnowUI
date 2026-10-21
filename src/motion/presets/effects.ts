/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
    MOTION_DURATION_BUTTON_HOVER_MS,
    MOTION_DURATION_EMPHASIS_MS,
    MOTION_DURATION_PANEL_APPEAR_MS,
    MOTION_DURATION_PANEL_DISAPPEAR_MS,
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    MOTION_EASING_BOUNCE_NUMBER,
    MOTION_EASING_BUTTON_HOVER,
    MOTION_EASING_IN_OUT,
    MOTION_EASING_STANDARD,
    MOTION_SCALE_HOVER_FROM,
    MOTION_SCALE_HOVER_TO,
    MOTION_SCALE_BUTTON_HOVER_TO,
    MOTION_SCALE_BUTTON_BORDERLESS_FROM,
    MOTION_BUTTON_REFERENCE_HEIGHT_PX,
    MOTION_BUTTON_HOVER_MAX_WIDTH_GROWTH_REM,
    MOTION_SCALE_ICON_SWAP_FROM,
} from "../tokens";

/** hover 时轻微放大；来源：transitions.dev Avatar group hover。 */
export const HOVER_SCALE_UP_MOTION: MotionConfig = {
    scale: [MOTION_SCALE_HOVER_FROM, MOTION_SCALE_HOVER_TO],
    duration: MOTION_DURATION_AVATAR_HOVER_MS,
    easing: MOTION_EASING_STANDARD,
};

/** Button 默认 hover 背景与内容整体放大；内容可独立关闭，颜色反馈继续由 Button variant 自己拥有。 */
export const BUTTON_HOVER_SCALE_UP_MOTION: MotionConfig = {
    scale: [MOTION_SCALE_HOVER_FROM, MOTION_SCALE_BUTTON_HOVER_TO],
    duration: MOTION_DURATION_BUTTON_HOVER_MS,
    easing: MOTION_EASING_BUTTON_HOVER,
};

/** 按标准高度反比补偿整段背景运动，保留纵向默认 / sm 的视觉。 */
export function getButtonBackgroundScale(size: keyof typeof MOTION_BUTTON_REFERENCE_HEIGHT_PX) {
    const factor = MOTION_BUTTON_REFERENCE_HEIGHT_PX.sm / MOTION_BUTTON_REFERENCE_HEIGHT_PX[size];
    const hoverTo = MOTION_SCALE_HOVER_FROM
        + (MOTION_SCALE_BUTTON_HOVER_TO - MOTION_SCALE_HOVER_FROM) * factor;
    return {
        hoverTo,
        borderlessFrom: MOTION_SCALE_HOVER_FROM
            + (MOTION_SCALE_BUTTON_BORDERLESS_FROM - MOTION_SCALE_HOVER_FROM) * factor,
        clickTo: (MOTION_SCALE_HOVER_FROM + hoverTo) / 2,
    };
}

/** 横向行程与宽度反比补偿；隐藏起点、hover 与点击共用同一系数。 */
export function getButtonBackgroundWidthFactor(hoverTo: number, width: number, rootFontSize: number) {
    const growth = width * (hoverTo - 1);
    return growth > 0 && rootFontSize > 0
        ? Math.min(1, MOTION_BUTTON_HOVER_MAX_WIDTH_GROWTH_REM * rootFontSize / growth)
        : 1;
}

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
