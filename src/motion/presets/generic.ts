/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import { composeMotionConfigs } from "../primitives";
import { SCALE_IN_MOTION } from "../scale-in";
import {
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    MOTION_EASING_STANDARD,
    MOTION_SCALE_GENERIC_DISAPPEAR_FROM,
    MOTION_SCALE_GENERIC_DISAPPEAR_TO,
} from "../tokens";

export const GENERIC_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

/** 显式 opt-in：完整保留旧 generic appear 的 opacity + scale 组合。 */
export const GENERIC_SCALE_APPEAR_MOTION: MotionConfig = composeMotionConfigs(
    GENERIC_APPEAR_MOTION,
    SCALE_IN_MOTION,
);

export const GENERIC_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [
        MOTION_SCALE_GENERIC_DISAPPEAR_FROM,
        MOTION_SCALE_GENERIC_DISAPPEAR_TO,
    ],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};
