/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { Snippet } from "svelte";
import { writable } from "svelte/store";
import { TOOLTIP_SKIP_DELAY_DURATION_MS } from "./tooltip-delay";

export const TOOLTIP_OVERLAY_SWITCH_HIDE_DELAY_MS =
    TOOLTIP_SKIP_DELAY_DURATION_MS;

export interface TooltipOverlayState {
    id: string;
    triggerEl: HTMLElement;
    position: "top" | "bottom" | "left" | "right";
    offset: number;
    maxWidth?: number;
    variant: "dark" | "light";
    className: string;
    style?: string;
    children?: Snippet;
    fallbackContent: string;
    dismissOnMotion: boolean;
    widthRebound: boolean;
    rapidRetarget: boolean;
    continuousMotion?: boolean;
    loopMotion?: any;
    rest: Record<string, any>;
}

export const tooltipOverlay = writable<TooltipOverlayState | null>(null);
export const tooltipOverlayImmediateDismissRevision = writable(0);

let activeTooltipId: string | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function clearHideTimer(): void {
    if (hideTimer !== undefined) {
        clearTimeout(hideTimer);
        hideTimer = undefined;
    }
}

export function showTooltipOverlay(state: TooltipOverlayState): void {
    clearHideTimer();
    activeTooltipId = state.id;
    tooltipOverlay.set(state);
}

export function updateTooltipOverlay(state: TooltipOverlayState): void {
    if (activeTooltipId !== state.id) return;
    tooltipOverlay.set(state);
}

export function scheduleTooltipOverlayHide(id: string, delayMs = TOOLTIP_OVERLAY_SWITCH_HIDE_DELAY_MS): void {
    if (activeTooltipId !== id) return;
    clearHideTimer();
    if (delayMs <= 0) {
        activeTooltipId = undefined;
        tooltipOverlay.set(null);
        return;
    }
    hideTimer = setTimeout(() => {
        hideTimer = undefined;
        if (activeTooltipId !== id) return;
        activeTooltipId = undefined;
        tooltipOverlay.set(null);
    }, delayMs);
}

export function hideTooltipOverlay(id: string): boolean {
    if (activeTooltipId !== id) return false;
    clearHideTimer();
    activeTooltipId = undefined;
    tooltipOverlay.set(null);
    return true;
}

export function dismissTooltipOverlayImmediately(id: string): void {
    if (activeTooltipId !== id) return;
    clearHideTimer();
    activeTooltipId = undefined;
    tooltipOverlayImmediateDismissRevision.update((revision) => revision + 1);
    tooltipOverlay.set(null);
}

export function keepTooltipOverlayOpen(id: string): void {
    if (activeTooltipId === id) clearHideTimer();
}
