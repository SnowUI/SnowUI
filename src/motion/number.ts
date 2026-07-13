/**
 * number.ts
 * v1.1.0
 * 默认数字变化动效配置（OSS 版）。
 * OSS 不捆绑 FlowText 组件；PRO 包会在运行时注入 component 字段。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const NUMBER_MOTION_PROGRESS_POWER = 2;

export const NUMBER_MOTION: MotionConfig = {
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
    component: undefined,
};

/** PRO 包会将此替换为实际的 FlowText 组件引用 */
export let NUMBER_MOTION_COMPONENT: unknown = undefined;

export function interpolateNumberMotionValue(
    from: number,
    to: number,
    progress: number,
) {
    const safeProgress = Math.min(1, Math.max(0, progress));
    const easedProgress = Math.pow(safeProgress, NUMBER_MOTION_PROGRESS_POWER);
    return from + (to - from) * easedProgress;
}
