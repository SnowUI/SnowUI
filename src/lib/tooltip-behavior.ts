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
    smoothMove: false,
    sizeMotion: false,
    switchHideDelayMs: 0,
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
