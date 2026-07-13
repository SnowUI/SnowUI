/**
 * while-hover.ts
 * v1.1.0
 * whileHover 默认动效：提供颜色过渡时序，由组件通过 FRAME_COLOR_MOTION_BRIDGE 的 CSS 变量消费。
 * 不直接设置颜色属性値，只注入时序参数的 CSS 变量。
 */

import type { MotionConfig } from "../logic/motion-config";

export const WHILE_HOVER_DEFAULT_MOTION: MotionConfig = {
    duration: 150,
    easing: "easeOut",
};
