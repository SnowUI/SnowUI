/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { onDestroy } from "svelte";
import {
    DROPDOWN_OVERLAY_APPEAR_MOTION,
    DROPDOWN_OVERLAY_DISAPPEAR_MOTION,
} from "../motion/presets/overlay";
import { getMotionTotalDurationMs } from "../motion/presets/utils";

export const OVERLAY_OPEN_DURATION_MS = getMotionTotalDurationMs(
    DROPDOWN_OVERLAY_APPEAR_MOTION,
);
export const OVERLAY_CLOSE_DURATION_MS = getMotionTotalDurationMs(
    DROPDOWN_OVERLAY_DISAPPEAR_MOTION,
);

export interface OverlayPresenceState {
    readonly present: boolean;
    readonly closing: boolean;
    readonly state: "open" | "closing";
}

export function useOverlayPresence(
    isOpen: () => boolean,
    closeDurationMs = OVERLAY_CLOSE_DURATION_MS,
): OverlayPresenceState {
    let present = $state(isOpen());
    let closing = $state(false);
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    function clearCloseTimer() {
        if (closeTimer === undefined) return;
        clearTimeout(closeTimer);
        closeTimer = undefined;
    }

    $effect(() => {
        if (isOpen()) {
            clearCloseTimer();
            present = true;
            closing = false;
            return;
        }

        if (!present) {
            closing = false;
            return;
        }

        closing = true;
        clearCloseTimer();
        closeTimer = setTimeout(() => {
            closeTimer = undefined;
            if (isOpen()) return;
            present = false;
            closing = false;
        }, closeDurationMs);
    });

    onDestroy(clearCloseTimer);

    return {
        get present() {
            return present;
        },
        get closing() {
            return closing;
        },
        get state() {
            return closing ? "closing" : "open";
        },
    };
}
