/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * while-reload.ts
 * v1.0.0
 * whileReload 默认动效：复用顺时针旋转。
 */

import type { MotionConfig } from "../logic/motion-config";
import { ROTATE_CLOCKWISE_MOTION } from "./rotate";

export const WHILE_RELOAD_DEFAULT_MOTION: MotionConfig = {
    ...ROTATE_CLOCKWISE_MOTION,
};
