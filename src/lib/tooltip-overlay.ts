import type { Snippet } from "svelte";
import { writable } from "svelte/store";

export const TOOLTIP_OVERLAY_SWITCH_HIDE_DELAY_MS = 80;

export interface TooltipOverlayState {
    id: string;
    triggerEl: HTMLElement;
    position: "top" | "bottom" | "left" | "right";
    offset: number;
    variant: "dark" | "light";
    className: string;
    style?: string;
    children?: Snippet;
    fallbackContent: string;
    loopMotion?: any;
    rest: Record<string, any>;
}

export const tooltipOverlay = writable<TooltipOverlayState | null>(null);

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
    clearHideTimer();
    if (delayMs <= 0) {
        if (activeTooltipId !== id) return;
        activeTooltipId = undefined;
        tooltipOverlay.set(null);
        return;
    }
    hideTimer = setTimeout(() => {
        hideTimer = undefined;
        if (activeTooltipId !== id) return;
        activeTooltipId = undefined;
        tooltipOverlay.set(null);
    }, TOOLTIP_OVERLAY_SWITCH_HIDE_DELAY_MS);
}

export function hideTooltipOverlay(id: string): void {
    if (activeTooltipId !== id) return;
    clearHideTimer();
    activeTooltipId = undefined;
    tooltipOverlay.set(null);
}
