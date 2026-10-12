/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * while-appear.ts
 * v1.2.0
 * whileAppear 默认动效：仅渐显；缩放必须由消费方或组件族 preset 显式声明。
 */

import type { MotionConfig } from "../logic/motion-config";
import { GENERIC_APPEAR_MOTION } from "./presets/generic";

export const WHILE_APPEAR_DEFAULT_MOTION: MotionConfig = GENERIC_APPEAR_MOTION;
