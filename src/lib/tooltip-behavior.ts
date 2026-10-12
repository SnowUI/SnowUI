/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
