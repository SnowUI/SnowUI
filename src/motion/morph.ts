/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * morph.ts
 * v1.0.0
 * 默认形态变化动效：用于宽高/尺寸变化时的平滑过渡。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MOTION_DURATION_BASE_MS } from "./tokens";

export const MORPH_MOTION: MotionConfig = {
    scale: [0.98, 1],
    duration: MOTION_DURATION_BASE_MS,
    easing: "easeOut",
};
