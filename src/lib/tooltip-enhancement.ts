import { registerTooltipBehaviorEnhancement } from "@snowui-design-system/components/lib/tooltip-behavior";
import { TOOLTIP_SKIP_DELAY_DURATION_MS } from "@snowui-design-system/components/lib/tooltip-delay";

registerTooltipBehaviorEnhancement({
    lifecycleMotion: true,
    smoothMove: true,
    sizeMotion: true,
    switchHideDelayMs: TOOLTIP_SKIP_DELAY_DURATION_MS,
});
