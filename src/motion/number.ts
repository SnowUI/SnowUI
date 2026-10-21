/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * number.ts
 * v1.1.0
 * 默认数字变化动效配置。
 * 不捆绑 FlowText 组件；调用方可在运行时注入 component 字段。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const NUMBER_MOTION_PROGRESS_POWER = 2;

export const NUMBER_MOTION: MotionConfig = {
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
    component: undefined,
};

/** 调用方可将此替换为实际的 FlowText 组件引用 */
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
