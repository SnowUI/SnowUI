/* SnowUI source notice | LICENSE 2.2.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_RESIZE_MS,
    MOTION_EASING_STANDARD,
} from "../tokens";
import { motionMsVar } from "./utils";

export const RESIZE_MOTION: MotionConfig = {
    duration: MOTION_DURATION_RESIZE_MS,
    easing: MOTION_EASING_STANDARD,
};

export const RESIZE_MOTION_STYLE = [
    `--snowui-frame-size-motion-duration: ${motionMsVar(RESIZE_MOTION.duration, MOTION_DURATION_RESIZE_MS)}`,
    `--snowui-frame-size-motion-easing: ${RESIZE_MOTION.easing ?? MOTION_EASING_STANDARD}`,
].join("; ");
