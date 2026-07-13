/**
 * content-crossfade.ts
 * v1.0.0
 * 状态内容切换自动补间动效：旧内容渐隐（前150ms），新内容渐现（后150ms），总时长300ms
 */

import type { MotionConfig } from "../logic/motion-config";

export const CONTENT_CROSSFADE_OUT_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [1, 0.01],
    duration: 150,
    easing: "linear",
};

export const CONTENT_CROSSFADE_IN_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [0.01, 1],
    duration: 150,
    delay: 150,
    easing: "ease",
};
