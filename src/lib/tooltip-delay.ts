/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * Tooltip hover 延迟协调器。
 *
 * 首个 Tooltip 使用 warmup 延迟；任一 Tooltip 成功显示后，在 cooldown
 * 窗口内切换到其他 Tooltip 时立即显示。
 */

import {
    OVERLAY_TRIGGER_HOVER_DELAY_MS,
    OVERLAY_TRIGGER_SKIP_DELAY_DURATION_MS,
} from "./overlay-trigger-timing";

export const TOOLTIP_HOVER_SHOW_DELAY_MS = OVERLAY_TRIGGER_HOVER_DELAY_MS;
export const TOOLTIP_SKIP_DELAY_DURATION_MS =
    OVERLAY_TRIGGER_SKIP_DELAY_DURATION_MS;

let isTooltipWarm = false;
let cooldownTimer: ReturnType<typeof setTimeout> | undefined;

function clearCooldownTimer(): void {
    if (cooldownTimer !== undefined) {
        clearTimeout(cooldownTimer);
        cooldownTimer = undefined;
    }
}

export function getTooltipHoverShowDelay(): number {
    return isTooltipWarm ? 0 : TOOLTIP_HOVER_SHOW_DELAY_MS;
}

export function markTooltipShown(): void {
    clearCooldownTimer();
    isTooltipWarm = true;
}

export function scheduleTooltipWarmupReset(): void {
    if (!isTooltipWarm) return;

    clearCooldownTimer();
    cooldownTimer = setTimeout(() => {
        cooldownTimer = undefined;
        isTooltipWarm = false;
    }, TOOLTIP_SKIP_DELAY_DURATION_MS);
}

export function resetTooltipDelayState(): void {
    clearCooldownTimer();
    isTooltipWarm = false;
}
