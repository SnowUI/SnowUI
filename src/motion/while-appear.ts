/**
 * while-appear.ts
 * v1.2.0
 * whileAppear 默认动效：仅渐显；缩放必须由消费方或组件族 preset 显式声明。
 */

import type { MotionConfig } from "../logic/motion-config";
import { GENERIC_APPEAR_MOTION } from "./presets/generic";

export const WHILE_APPEAR_DEFAULT_MOTION: MotionConfig = GENERIC_APPEAR_MOTION;
