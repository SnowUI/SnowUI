/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_CONTINUOUS_HOVER_MS,
    MOTION_DURATION_CONTINUOUS_HOVER_RESPONSE_MS,
    MOTION_EASING_STANDARD,
} from "../tokens";
import { motionMsVar } from "./utils";

export const CONTINUOUS_HOVER_MOTION: MotionConfig = {
    duration: MOTION_DURATION_CONTINUOUS_HOVER_MS,
    easing: MOTION_EASING_STANDARD,
};

export const CONTINUOUS_HOVER_MOTION_STYLE = [
    `--snowui-continuous-hover-motion-duration: ${motionMsVar(CONTINUOUS_HOVER_MOTION.duration, MOTION_DURATION_CONTINUOUS_HOVER_MS)}`,
    `--snowui-continuous-hover-motion-easing: ${CONTINUOUS_HOVER_MOTION.easing ?? MOTION_EASING_STANDARD}`,
    `--snowui-continuous-hover-response-duration: ${MOTION_DURATION_CONTINUOUS_HOVER_RESPONSE_MS}ms`,
].join("; ");
