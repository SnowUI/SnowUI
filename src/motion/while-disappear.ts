/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * while-disappear.ts
 * v1.0.0
 * whileDisappear 默认动效：由 fadeOut + scaleOut 原子动效组合得到。
 */

import type { MotionConfig } from "../logic/motion-config";
import { GENERIC_DISAPPEAR_MOTION } from "./presets/generic";

export const WHILE_DISAPPEAR_DEFAULT_MOTION: MotionConfig = GENERIC_DISAPPEAR_MOTION;
