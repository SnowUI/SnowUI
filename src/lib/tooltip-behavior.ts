export interface TooltipBehaviorEnhancement {
    lifecycleMotion?: boolean;
    smoothMove?: boolean;
    sizeMotion?: boolean;
    switchHideDelayMs?: number;
}

export interface ResolvedTooltipBehaviorEnhancement {
    lifecycleMotion: boolean;
    smoothMove: boolean;
    sizeMotion: boolean;
    switchHideDelayMs: number;
}

const DEFAULT_TOOLTIP_BEHAVIOR: ResolvedTooltipBehaviorEnhancement = {
    lifecycleMotion: true,
    smoothMove: true,
    sizeMotion: true,
    switchHideDelayMs: TOOLTIP_SKIP_DELAY_DURATION_MS,
};

let tooltipBehavior = DEFAULT_TOOLTIP_BEHAVIOR;

export function registerTooltipBehaviorEnhancement(
    enhancement: TooltipBehaviorEnhancement,
): void {
    tooltipBehavior = {
        ...DEFAULT_TOOLTIP_BEHAVIOR,
        ...enhancement,
    };
}

export function resetTooltipBehaviorEnhancement(): void {
    tooltipBehavior = DEFAULT_TOOLTIP_BEHAVIOR;
}

export function getTooltipBehaviorEnhancement(): ResolvedTooltipBehaviorEnhancement {
    return tooltipBehavior;
}
import { TOOLTIP_SKIP_DELAY_DURATION_MS } from "./tooltip-delay";
