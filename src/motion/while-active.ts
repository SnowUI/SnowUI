/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * while-active.ts
 * v1.0.0
 * whileActive 默认动效：复用 morph（形态变化平滑过渡）。
 */

import type { MotionConfig } from "../logic/motion-config";
import { MORPH_MOTION } from "./morph";

export const WHILE_ACTIVE_DEFAULT_MOTION: MotionConfig = {
    ...MORPH_MOTION,
};
