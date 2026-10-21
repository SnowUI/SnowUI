/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import {
    MOTION_DURATION_TAB_INDICATOR_MS,
    MOTION_EASING_STANDARD,
} from "../tokens";
import { motionMsVar } from "./utils";

export const TAB_INDICATOR_MOTION: MotionConfig = {
    duration: MOTION_DURATION_TAB_INDICATOR_MS,
    easing: MOTION_EASING_STANDARD,
};

/** Tab indicator 同时改变位置与尺寸，统一注入 control / size 两组 Frame bridge。 */
export const TAB_INDICATOR_MOTION_STYLE = [
    `--snowui-frame-control-motion-duration: ${motionMsVar(TAB_INDICATOR_MOTION.duration, MOTION_DURATION_TAB_INDICATOR_MS)}`,
    `--snowui-frame-control-motion-easing: ${TAB_INDICATOR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
    `--snowui-frame-size-motion-duration: ${motionMsVar(TAB_INDICATOR_MOTION.duration, MOTION_DURATION_TAB_INDICATOR_MS)}`,
    `--snowui-frame-size-motion-easing: ${TAB_INDICATOR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
].join("; ");
