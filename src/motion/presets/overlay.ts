/* SnowUI source notice | LICENSE 2.2.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    MOTION_EASING_STANDARD,
} from "../tokens";

export const DROPDOWN_OVERLAY_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const DROPDOWN_OVERLAY_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};
