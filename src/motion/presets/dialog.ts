/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_STANDARD_APPEAR_MS,
    MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    MOTION_EASING_STANDARD,
    MOTION_SCALE_DIALOG_APPEAR_FROM,
    MOTION_SCALE_DIALOG_APPEAR_TO,
    MOTION_SCALE_DIALOG_DISAPPEAR_FROM,
    MOTION_SCALE_DIALOG_DISAPPEAR_TO,
} from "../tokens";
import { motionMsVar } from "./utils";

export const MODAL_DIALOG_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    scale: [MOTION_SCALE_DIALOG_APPEAR_FROM, MOTION_SCALE_DIALOG_APPEAR_TO],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const MODAL_DIALOG_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    scale: [
        MOTION_SCALE_DIALOG_DISAPPEAR_FROM,
        MOTION_SCALE_DIALOG_DISAPPEAR_TO,
    ],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const DIALOG_BACKDROP_APPEAR_MOTION: MotionConfig = {
    opacity: [0, 1],
    duration: MOTION_DURATION_STANDARD_APPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const DIALOG_BACKDROP_DISAPPEAR_MOTION: MotionConfig = {
    opacity: [1, 0],
    duration: MOTION_DURATION_STANDARD_DISAPPEAR_MS,
    easing: MOTION_EASING_STANDARD,
};

export const DIALOG_BACKDROP_MOTION_STYLE = [
    `--snowui-dialog-backdrop-appear-duration: ${motionMsVar(DIALOG_BACKDROP_APPEAR_MOTION.duration, MOTION_DURATION_STANDARD_APPEAR_MS)}`,
    `--snowui-dialog-backdrop-appear-easing: ${DIALOG_BACKDROP_APPEAR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
    `--snowui-dialog-backdrop-disappear-duration: ${motionMsVar(DIALOG_BACKDROP_DISAPPEAR_MOTION.duration, MOTION_DURATION_STANDARD_DISAPPEAR_MS)}`,
    `--snowui-dialog-backdrop-disappear-easing: ${DIALOG_BACKDROP_DISAPPEAR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
].join("; ");
