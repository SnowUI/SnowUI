/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { MotionConfig } from "../../logic/motion-config";
import { GENERIC_SCALE_APPEAR_MOTION } from "./generic";

export const REPLACEMENT_APPEAR_MOTION: MotionConfig = {
    ...GENERIC_SCALE_APPEAR_MOTION,
};

export const CONTROL_BUTTON_MOTION_DURATION_MS = 150;

/** 轻量状态按钮与 Checkbox / Switch 对齐的切换节奏。 */
export const CONTROL_BUTTON_REPLACEMENT_MOTION: MotionConfig = {
    ...REPLACEMENT_APPEAR_MOTION,
    duration: CONTROL_BUTTON_MOTION_DURATION_MS,
};


/** 将专用状态按钮的时长接入 Button 背景动效宿主。 */
export function controlButtonMotionStyle(duration: string): string {
    return `--snowui-button-hover-motion-duration: ${duration};`;
}
