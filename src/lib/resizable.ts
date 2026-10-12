/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 通用尺寸拖动 action。
 * TableHead、普通容器和 分栏均可复用同一套 pointer / keyboard / clamp 协议。
 */
export type ResizeAxis = "horizontal" | "vertical";
export type ResizeEdge = "start" | "end" | "top" | "bottom";

export interface ResizableOptions {
    axis?: ResizeAxis;
    edge?: ResizeEdge;
    size?: number;
    minSize?: number;
    maxSize?: number;
    step?: number;
    largeStep?: number;
    disabled?: boolean;
    applySize?: boolean;
    handle?: HTMLElement;
    handleSelector?: string;
    onResizeStart?: (size: number) => void;
    onSizeChange?: (size: number) => void;
    onResizeEnd?: (size: number) => void;
}

export const clampResizableSize = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

export function resizable(node: HTMLElement, initial: ResizableOptions = {}) {
    let options = initial;
    let currentSize = Number(options.size) || 0;
    let pointerId: number | undefined;
    let startPoint = 0;
    let startSize = 0;
    let pendingSize: number | undefined;
    let pendingFrame: number | undefined;
    let interactionTarget: HTMLElement = options.handle ?? node;

    const resolved = () => ({
        axis: options.axis ?? "horizontal",
        edge: options.edge ?? (options.axis === "vertical" ? "bottom" : "end"),
        min: Number.isFinite(options.minSize) ? Number(options.minSize) : 0,
        max: Number.isFinite(options.maxSize) ? Number(options.maxSize) : Infinity,
        step: Number.isFinite(options.step) ? Math.max(1, Number(options.step)) : 8,
        largeStep: Number.isFinite(options.largeStep)
            ? Math.max(1, Number(options.largeStep))
            : 32,
        selector: options.handleSelector ?? "[data-resize-handle]",
    });

    const measure = () => {
        const rect = node.getBoundingClientRect();
        return resolved().axis === "horizontal" ? rect.width : rect.height;
    };

    const apply = (next: number) => {
        const config = resolved();
        currentSize = clampResizableSize(next, config.min, config.max);
        if (options.applySize !== false) {
            node.style.setProperty(
                config.axis === "horizontal" ? "width" : "height",
                `${currentSize}px`,
            );
        }
        syncHandle();
        options.onSizeChange?.(currentSize);
    };

    const flush = () => {
        if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
        pendingFrame = undefined;
        if (pendingSize === undefined) return;
        const next = pendingSize;
        pendingSize = undefined;
        apply(next);
    };

    const commit = (next: number) => {
        pendingSize = next;
        if (pendingFrame !== undefined) return;
        pendingFrame = requestAnimationFrame(() => {
            pendingFrame = undefined;
            if (pendingSize === undefined) return;
            const value = pendingSize;
            pendingSize = undefined;
            apply(value);
        });
    };

    const syncHandle = () => {
        const config = resolved();
        const handle = options.handle ?? node.querySelector<HTMLElement>(config.selector);
        if (!handle) return;
        handle.setAttribute("role", "separator");
        handle.setAttribute(
            "aria-orientation",
            config.axis === "horizontal" ? "vertical" : "horizontal",
        );
        handle.setAttribute("aria-valuemin", String(config.min));
        if (Number.isFinite(config.max)) {
            handle.setAttribute("aria-valuemax", String(config.max));
        } else {
            handle.removeAttribute("aria-valuemax");
        }
        handle.setAttribute("aria-valuenow", String(Math.round(currentSize || measure())));
        handle.tabIndex = options.disabled ? -1 : 0;
    };

    const direction = () => {
        const edge = resolved().edge;
        return edge === "start" || edge === "top" ? -1 : 1;
    };

    const onPointerDown = (event: PointerEvent) => {
        const config = resolved();
        const target = event.target as HTMLElement | null;
        const handle = options.handle ?? target?.closest<HTMLElement>(config.selector);
        if (options.handle && target !== handle && !handle?.contains(target)) return;
        if (options.disabled || !handle) return;
        event.preventDefault();
        pointerId = event.pointerId;
        startPoint = config.axis === "horizontal" ? event.clientX : event.clientY;
        startSize = Number(options.size) || currentSize || measure();
        currentSize = startSize;
        try {
            handle.setPointerCapture(event.pointerId);
        } catch {
            // 某些测试环境不实现 pointer capture，window capture 仍可完成拖动。
        }
        window.addEventListener("pointermove", onPointerMove, true);
        window.addEventListener("pointerup", finish, true);
        window.addEventListener("pointercancel", finish, true);
        options.onResizeStart?.(startSize);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;
        const point = resolved().axis === "horizontal" ? event.clientX : event.clientY;
        commit(startSize + (point - startPoint) * direction());
    };

    const finish = (event: PointerEvent) => {
        if (pointerId !== event.pointerId) return;
        const handle = options.handle ?? node.querySelector<HTMLElement>(resolved().selector);
        flush();
        window.removeEventListener("pointermove", onPointerMove, true);
        window.removeEventListener("pointerup", finish, true);
        window.removeEventListener("pointercancel", finish, true);
        try {
            if (handle?.hasPointerCapture(event.pointerId)) {
                handle.releasePointerCapture(event.pointerId);
            }
        } catch {
            // 与 setPointerCapture 的兼容回退保持一致。
        }
        pointerId = undefined;
        options.onResizeEnd?.(currentSize || measure());
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const config = resolved();
        const target = event.target as HTMLElement | null;
        const handle = options.handle ?? target?.closest<HTMLElement>(config.selector);
        if (options.handle && target !== handle && !handle?.contains(target)) return;
        if (options.disabled || !handle) return;
        const negative = config.axis === "horizontal" ? "ArrowLeft" : "ArrowUp";
        const positive = config.axis === "horizontal" ? "ArrowRight" : "ArrowDown";
        if (event.key !== negative && event.key !== positive) return;
        event.preventDefault();
        const delta = (event.shiftKey ? config.largeStep : config.step) *
            (event.key === positive ? 1 : -1) * direction();
        options.onResizeStart?.(currentSize || measure());
        apply((Number(options.size) || currentSize || measure()) + delta);
        options.onResizeEnd?.(currentSize);
    };

    const bindInteractionTarget = (target: HTMLElement) => {
        target.addEventListener("pointerdown", onPointerDown);
        target.addEventListener("keydown", onKeyDown);
    };

    const unbindInteractionTarget = (target: HTMLElement) => {
        target.removeEventListener("pointerdown", onPointerDown);
        target.removeEventListener("keydown", onKeyDown);
    };

    bindInteractionTarget(interactionTarget);
    currentSize = Number(options.size) || measure();
    syncHandle();

    return {
        update(next: ResizableOptions) {
            const nextInteractionTarget = next.handle ?? node;
            if (nextInteractionTarget !== interactionTarget) {
                unbindInteractionTarget(interactionTarget);
                interactionTarget = nextInteractionTarget;
                bindInteractionTarget(interactionTarget);
            }
            options = next;
            if (Number.isFinite(next.size)) currentSize = Number(next.size);
            syncHandle();
        },
        destroy() {
            if (pendingFrame !== undefined) cancelAnimationFrame(pendingFrame);
            window.removeEventListener("pointermove", onPointerMove, true);
            window.removeEventListener("pointerup", finish, true);
            window.removeEventListener("pointercancel", finish, true);
            pointerId = undefined;
            unbindInteractionTarget(interactionTarget);
        },
    };
}
