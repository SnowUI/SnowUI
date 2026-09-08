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
