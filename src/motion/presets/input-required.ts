import { MOTION_DURATION_EMPHASIS_MS, MOTION_EASING_STANDARD } from "../tokens";

const active = "inset 0 0 0 var(--snowui-field-border-width, 0.03125rem) var(--secondary-red, #ff4747ff), 0 0 0 var(--snowui-field-focus-ring-width, 0.25rem) var(--snowui-field-focus-ring-color, var(--black-4, #0000000a))";
const idle = "inset 0 0 0 var(--snowui-field-border-width, 0.03125rem) var(--secondary-red, #ff4747ff), 0 0 0 0 transparent";

export const INPUT_REQUIRED_KEYFRAMES: Keyframe[] = [
    { boxShadow: active },
    { boxShadow: idle },
    { boxShadow: active },
];
export const INPUT_REQUIRED_TIMING: KeyframeAnimationOptions = {
    duration: MOTION_DURATION_EMPHASIS_MS * 2,
    easing: MOTION_EASING_STANDARD,
};
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../../LICENSE) */
