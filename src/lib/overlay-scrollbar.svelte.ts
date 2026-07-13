/**
 * 自建滚动条共享运行时：计算 Thumb、同步滚动并处理拖动。
 * 文档: ./overlay-scrollbar.md
 */
import { onDestroy, tick } from "svelte";
import { resizeManager } from "../logic/observer.svelte";

type ElementGetter<T extends HTMLElement = HTMLElement> = () => T | undefined | null;

export interface OverlayScrollbarState {
    readonly hasOverflow: boolean;
    readonly thumbSize: number;
    readonly thumbOffset: number;
    readonly thumbHeight: number;
    readonly thumbY: number;
    refresh: () => void;
}

export type OverlayScrollbarAxis = "vertical" | "horizontal";

export function useOverlayScrollbar(
    getViewport: ElementGetter,
    getScrollbar: ElementGetter,
    axis: OverlayScrollbarAxis = "vertical",
): OverlayScrollbarState {
    let hasOverflow = $state(false);
    let thumbHeight = $state(0);
    let thumbY = $state(0);

    let cleanupViewportResize: (() => void) | undefined;
    let cleanupScrollbarResize: (() => void) | undefined;
    let viewportMutationObserver: MutationObserver | undefined;
    let boundViewport: HTMLElement | undefined;
    let boundScrollbar: HTMLElement | undefined;
    let boundThumb: HTMLElement | undefined;
    let cleanupThumbDrag: (() => void) | undefined;

    function compute() {
        const viewport = getViewport();
        const scrollbar = getScrollbar();
        if (!viewport || !scrollbar) {
            hasOverflow = false;
            thumbHeight = 0;
            thumbY = 0;
            return;
        }

        const scrollSize = axis === "vertical" ? viewport.scrollHeight : viewport.scrollWidth;
        const clientSize = axis === "vertical" ? viewport.clientHeight : viewport.clientWidth;
        const trackSize = axis === "vertical" ? scrollbar.clientHeight : scrollbar.clientWidth;
        const scrollOffset = axis === "vertical" ? viewport.scrollTop : viewport.scrollLeft;
        const overflow = scrollSize > clientSize + 1 && trackSize > 0;

        hasOverflow = overflow;
        if (!overflow) {
            thumbHeight = 0;
            thumbY = 0;
            return;
        }

        const ratio = clientSize / scrollSize;
        const nextThumbHeight = Math.max(24, Math.round(trackSize * ratio));
        const maxThumbY = Math.max(0, trackSize - nextThumbHeight);
        const maxScrollTop = Math.max(1, scrollSize - clientSize);

        thumbHeight = Math.min(trackSize, nextThumbHeight);
        thumbY = Math.min(maxThumbY, (scrollOffset / maxScrollTop) * maxThumbY);
    }

    function refresh() {
        void tick().then(compute);
    }

    function scrollToThumbClientPosition(clientPosition: number, thumbGrabOffset: number) {
        const viewport = getViewport();
        const scrollbar = getScrollbar();
        if (!viewport || !scrollbar || !hasOverflow) return;

        const trackRect = scrollbar.getBoundingClientRect();
        const trackStart = axis === "vertical" ? trackRect.top : trackRect.left;
        const trackSize = axis === "vertical" ? trackRect.height : trackRect.width;
        const scrollSize = axis === "vertical" ? viewport.scrollHeight : viewport.scrollWidth;
        const clientSize = axis === "vertical" ? viewport.clientHeight : viewport.clientWidth;
        const maxThumbY = Math.max(1, trackSize - thumbHeight);
        const maxScrollTop = Math.max(1, scrollSize - clientSize);
        const nextThumbY = Math.max(
            0,
            Math.min(maxThumbY, clientPosition - trackStart - thumbGrabOffset),
        );

        if (axis === "vertical") {
            viewport.scrollTop = (nextThumbY / maxThumbY) * maxScrollTop;
        } else {
            viewport.scrollLeft = (nextThumbY / maxThumbY) * maxScrollTop;
        }
        compute();
    }

    function bindThumbDrag() {
        const scrollbar = getScrollbar() ?? undefined;
        const thumb = scrollbar?.querySelector<HTMLElement>(
            ".snowui-overlay-scrollbar-thumb",
        ) ?? undefined;

        if (thumb === boundThumb) return;

        cleanupThumbDrag?.();
        boundThumb = thumb;

        if (!boundThumb) {
            cleanupThumbDrag = undefined;
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (event.button !== 0 || !hasOverflow) return;
            event.preventDefault();
            event.stopPropagation();

            const thumbRect = boundThumb!.getBoundingClientRect();
            const thumbGrabOffset = axis === "vertical"
                ? event.clientY - thumbRect.top
                : event.clientX - thumbRect.left;
            boundThumb!.setPointerCapture(event.pointerId);
            boundThumb!.dataset.dragging = "true";

            const handlePointerMove = (moveEvent: PointerEvent) => {
                moveEvent.preventDefault();
                scrollToThumbClientPosition(
                    axis === "vertical" ? moveEvent.clientY : moveEvent.clientX,
                    thumbGrabOffset,
                );
            };

            const handlePointerEnd = (endEvent: PointerEvent) => {
                boundThumb?.releasePointerCapture(endEvent.pointerId);
                if (boundThumb) delete boundThumb.dataset.dragging;
                boundThumb?.removeEventListener("pointermove", handlePointerMove);
                boundThumb?.removeEventListener("pointerup", handlePointerEnd);
                boundThumb?.removeEventListener("pointercancel", handlePointerEnd);
            };

            boundThumb!.addEventListener("pointermove", handlePointerMove);
            boundThumb!.addEventListener("pointerup", handlePointerEnd);
            boundThumb!.addEventListener("pointercancel", handlePointerEnd);
        };

        boundThumb.addEventListener("pointerdown", handlePointerDown);
        cleanupThumbDrag = () => {
            boundThumb?.removeEventListener("pointerdown", handlePointerDown);
        };
    }

    function bindElements() {
        const viewport = getViewport() ?? undefined;
        const scrollbar = getScrollbar() ?? undefined;

        if (viewport !== boundViewport) {
            cleanupViewportResize?.();
            viewportMutationObserver?.disconnect();
            boundViewport?.removeEventListener("scroll", compute);
            boundViewport = viewport;
            if (boundViewport) {
                boundViewport.addEventListener("scroll", compute, { passive: true });
                cleanupViewportResize = resizeManager.watch(boundViewport, compute);
                viewportMutationObserver = new MutationObserver(refresh);
                viewportMutationObserver.observe(boundViewport, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                });
            } else {
                cleanupViewportResize = undefined;
                viewportMutationObserver = undefined;
            }
        }

        if (scrollbar !== boundScrollbar) {
            cleanupScrollbarResize?.();
            boundScrollbar = scrollbar;
            cleanupScrollbarResize = boundScrollbar
                ? resizeManager.watch(boundScrollbar, compute)
                : undefined;
        }

        bindThumbDrag();
        compute();
    }

    $effect(() => {
        bindElements();
    });

    onDestroy(() => {
        cleanupViewportResize?.();
        cleanupScrollbarResize?.();
        viewportMutationObserver?.disconnect();
        cleanupThumbDrag?.();
        boundViewport?.removeEventListener("scroll", compute);
    });

    return {
        get hasOverflow() {
            return hasOverflow;
        },
        get thumbHeight() {
            return thumbHeight;
        },
        get thumbY() {
            return thumbY;
        },
        get thumbSize() {
            return thumbHeight;
        },
        get thumbOffset() {
            return thumbY;
        },
        refresh,
    };
}
