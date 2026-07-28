<!-- 通用可交互尺寸指示手柄；支持局部命中与滚动条重叠避让。文档: ./Indicator.md -->
<script module lang="ts">
    export type IndicatorAxis = "width" | "height" | "both";
    export type IndicatorEdge = "start" | "end" | "top" | "bottom";
    export type IndicatorAppearance = "line" | "corner";
    let indicatorSeed = 0;
</script>

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { resizable, type ResizableOptions } from "../lib/resizable";
    import { untrack } from "svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        axis?: IndicatorAxis;
        edge?: IndicatorEdge;
        appearance?: IndicatorAppearance;
        hitAreaPadding?: number | string;
        target?: HTMLElement;
        revealTarget?: HTMLElement;
        value?: number;
        minSize?: number;
        maxSize?: number;
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        step?: number;
        largeStep?: number;
        applySize?: boolean;
        disabled?: boolean;
        ariaLabel?: string;
        onResizeStart?: (value: number, axis: "width" | "height") => void;
        onSizeChange?: (value: number, axis: "width" | "height") => void;
        onResizeEnd?: (value: number, axis: "width" | "height") => void;
        [key: string]: any;
    }

    const inheritedIndicatorPart = useComponentPart<Props>("Indicator");
    let explicitProps: Props = $props();
    let {
        axis,
        edge,
        appearance = "line",
        hitAreaPadding = undefined,
        target,
        revealTarget,
        value,
        minSize = 0,
        maxSize = Infinity,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        step = 8,
        largeStep = 32,
        applySize = true,
        disabled = false,
        ariaLabel,
        onResizeStart,
        onSizeChange,
        onResizeEnd,
        as: userAs,
        pinOffset,
        pinOffsetX,
        pinOffsetY,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = false,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedIndicatorPart.current, explicitProps),
    );

    const indicatorId = `snowui-indicator-${++indicatorSeed}`;
    let element = $state<HTMLElement>();
    let hostHovered = $state(false);
    let focused = $state(false);
    let dragging = $state(false);
    let overlapsScrollbar = $state(false);
    let resizeActions: ReturnType<typeof resizable>[] = [];

    const resolvedAxis = $derived(
        axis ?? (appearance === "corner" ? "height" : "width"),
    );

    const resolvedEdge = $derived(
        edge ?? (resolvedAxis === "width" ? "end" : "bottom"),
    );
    const resolvedAppearance = $derived(appearance ?? "line");
    const resolvedAs = $derived.by(() => {
        if (userAs) return userAs;
        // line 不用 pin 居中（会与全高/全宽命中带冲突）；corner 仍用 pin 角点
        if (appearance === "corner") return "pin-bottom-right";
        return undefined;
    });
    const resolvedPinOffset = $derived(
        pinOffset ?? (resolvedAppearance === "corner" ? "var(--padding-1)" : 0),
    );
    const resolvedTarget = $derived(target ?? element?.parentElement ?? undefined);
    const resolvedRevealTarget = $derived(revealTarget ?? resolvedTarget);
    const shouldReveal = $derived(hostHovered || focused || dragging);
    const isVisible = $derived(shouldReveal && !overlapsScrollbar);
    const resolvedAriaLabel = $derived(
        ariaLabel ??
            (resolvedAxis === "width"
                ? "调整宽度"
                : resolvedAxis === "height"
                  ? "调整高度"
                  : "调整宽度和高度"),
    );
    const rootClass = $derived(
        [
            "snowui-indicator",
            `snowui-indicator-${resolvedAxis}`,
            `snowui-indicator-${resolvedAppearance}`,
            `snowui-indicator-edge-${resolvedEdge}`,
            userClass,
        ]
            .filter(Boolean)
            .join(" "),
    );

    function toCssLength(value: number | string | undefined): string {
        if (value === undefined || value === null) return "0";
        return typeof value === "number" ? `${value}px` : String(value);
    }

    /**
     * line 命中带：从物理边缘 0 起算，覆盖边框；宽度/高度 = pinOffset + 抓取厚度。
     * 视觉条中心落在 pinOffset（默认 4px）处，不随命中带居中。
     */
    const lineEdgeStyle = $derived.by(() => {
        if (resolvedAppearance !== "line" || resolvedAxis === "both") return "";
        const offset = toCssLength(resolvedPinOffset);
        const grab = "var(--size-2, 0.5rem)";
        const alongPadding =
            hitAreaPadding === undefined
                ? undefined
                : toCssLength(hitAreaPadding);
        if (resolvedAxis === "width") {
            const side = resolvedEdge === "start" ? "left:0" : "right:0";
            return [
                "position:absolute",
                alongPadding ? "top:50%" : "top:0",
                alongPadding ? "bottom:auto" : "bottom:0",
                alongPadding
                    ? `height:calc(var(--snowui-indicator-visual-length, var(--size-4)) + ${alongPadding} + ${alongPadding})`
                    : "height:auto",
                `width:calc(${offset} + ${grab})`,
                side,
                alongPadding ? "translate:0 -50%" : "translate:none",
                `--snowui-indicator-visual-inset:${offset}`,
            ].join(";");
        }
        const side = resolvedEdge === "top" ? "top:0" : "bottom:0";
        return [
            "position:absolute",
            alongPadding ? "left:50%" : "left:0",
            alongPadding ? "right:auto" : "right:0",
            alongPadding
                ? `width:calc(var(--snowui-indicator-visual-length, var(--size-4)) + ${alongPadding} + ${alongPadding})`
                : "width:auto",
            `height:calc(${offset} + ${grab})`,
            side,
            alongPadding ? "translate:-50% 0" : "translate:none",
            `--snowui-indicator-visual-inset:${offset}`,
        ].join(";");
    });
    const rootStyle = $derived(
        [lineEdgeStyle, userStyle].filter(Boolean).join("; ") || undefined,
    );

    function getResizeOptions(resizeAxis: "width" | "height"): ResizableOptions {
        return {
            axis: resizeAxis === "width" ? "horizontal" : "vertical",
            edge:
                resolvedAxis === "both"
                    ? resizeAxis === "width"
                        ? "end"
                        : "bottom"
                    : resolvedEdge,
            size: resolvedAxis === "both" ? undefined : value,
            minSize:
                resizeAxis === "width" ? minWidth ?? minSize : minHeight ?? minSize,
            maxSize:
                resizeAxis === "width" ? maxWidth ?? maxSize : maxHeight ?? maxSize,
            step,
            largeStep,
            applySize,
            disabled,
            handle: element,
            handleSelector: `[data-indicator-id="${indicatorId}"]`,
            onResizeStart(next) {
                dragging = true;
                onResizeStart?.(next, resizeAxis);
            },
            onSizeChange(next) {
                onSizeChange?.(next, resizeAxis);
            },
            onResizeEnd(next) {
                dragging = false;
                onResizeEnd?.(next, resizeAxis);
            },
        };
    }

    function syncScrollbarOverlap() {
        const handle = element;
        const resizeTarget = resolvedTarget;
        if (!handle || !resizeTarget || !shouldReveal) {
            overlapsScrollbar = false;
            return;
        }

        const handleRect = handle.getBoundingClientRect();
        const scrollbars = resizeTarget.querySelectorAll<HTMLElement>(
            '.snowui-overlay-scrollbar[data-visible="true"]',
        );
        overlapsScrollbar = Array.from(scrollbars).some((scrollbar) => {
            const style = getComputedStyle(scrollbar);
            const scrollbarHost = scrollbar.closest(
                ".snowui-overlay-scrollbar-host",
            );
            const isRendered =
                style.display !== "none" &&
                style.visibility !== "hidden" &&
                (scrollbar.dataset.axis === "horizontal" ||
                    scrollbarHost?.matches(":hover") ||
                    Number(style.opacity) > 0);
            if (!isRendered) return false;

            const scrollbarRect = scrollbar.getBoundingClientRect();
            return (
                handleRect.left < scrollbarRect.right &&
                handleRect.right > scrollbarRect.left &&
                handleRect.top < scrollbarRect.bottom &&
                handleRect.bottom > scrollbarRect.top
            );
        });
    }

    $effect(() => {
        const node = element;
        if (!node) return;
        const onFocus = () => (focused = true);
        const onBlur = () => (focused = false);
        node.addEventListener("focus", onFocus);
        node.addEventListener("blur", onBlur);
        return () => {
            node.removeEventListener("focus", onFocus);
            node.removeEventListener("blur", onBlur);
        };
    });

    $effect(() => {
        const host = resolvedRevealTarget;
        if (!host) return;
        const onEnter = () => (hostHovered = true);
        const onLeave = () => (hostHovered = false);
        host.addEventListener("pointerenter", onEnter);
        host.addEventListener("pointerleave", onLeave);
        return () => {
            host.removeEventListener("pointerenter", onEnter);
            host.removeEventListener("pointerleave", onLeave);
            hostHovered = false;
        };
    });

    $effect(() => {
        const handle = element;
        const resizeTarget = resolvedTarget;
        if (!handle || !resizeTarget || !shouldReveal) {
            overlapsScrollbar = false;
            return;
        }

        let frame = 0;
        const scheduleSync = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(syncScrollbarOverlap);
        };
        const mutationObserver = new MutationObserver(scheduleSync);
        const scrollbars = resizeTarget.querySelectorAll<HTMLElement>(
            ".snowui-overlay-scrollbar",
        );
        const resizeCleanups = [
            resizeManager.watch(handle, scheduleSync),
            resizeManager.watch(resizeTarget, scheduleSync),
            ...Array.from(scrollbars, (scrollbar) =>
                resizeManager.watch(scrollbar, scheduleSync),
            ),
        ];

        mutationObserver.observe(resizeTarget, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["data-visible"],
        });
        syncScrollbarOverlap();

        return () => {
            cancelAnimationFrame(frame);
            resizeCleanups.forEach((cleanup) => cleanup());
            mutationObserver.disconnect();
            overlapsScrollbar = false;
        };
    });

    $effect(() => {
        const host = resolvedTarget;
        const handle = element;
        if (!host || !handle) return;
        const axes: ("width" | "height")[] =
            resolvedAxis === "both" ? ["width", "height"] : [resolvedAxis];
        resizeActions = axes.map((resizeAxis) =>
            resizable(
                host,
                untrack(() => getResizeOptions(resizeAxis)),
            ),
        );
        return () => {
            resizeActions.forEach((action) => action.destroy());
            resizeActions = [];
            dragging = false;
        };
    });

    $effect(() => {
        resolvedAxis;
        resolvedEdge;
        value;
        minSize;
        maxSize;
        minWidth;
        maxWidth;
        minHeight;
        maxHeight;
        step;
        largeStep;
        applySize;
        disabled;
        onResizeStart;
        onSizeChange;
        onResizeEnd;
        if (resolvedAxis === "both") {
            resizeActions[0]?.update(getResizeOptions("width"));
            resizeActions[1]?.update(getResizeOptions("height"));
        } else {
            resizeActions[0]?.update(getResizeOptions(resolvedAxis));
        }
    });
</script>

<Frame
    {...rest}
    bind:element
    tag="span"
    as={resolvedAs}
    pinOffset={resolvedPinOffset}
    {pinOffsetX}
    {pinOffsetY}
    class={rootClass}
    style={rootStyle}
    data-resize-handle
    data-indicator-id={indicatorId}
    data-axis={resolvedAxis}
    data-appearance={resolvedAppearance}
    data-visible={isVisible ? "true" : undefined}
    data-overlaps-scrollbar={overlapsScrollbar ? "true" : undefined}
    data-dragging={dragging ? "true" : undefined}
    data-disabled={disabled ? "true" : undefined}
    role="separator"
    aria-label={resolvedAriaLabel}
    aria-orientation={resolvedAxis === "width"
        ? "vertical"
        : resolvedAxis === "height"
          ? "horizontal"
          : undefined}
    tabindex={disabled || overlapsScrollbar ? -1 : 0}
    aria-hidden={overlapsScrollbar ? "true" : undefined}
    enableAutoLayout={false}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
>
    <span class="snowui-indicator-visual" aria-hidden="true">
        {#if resolvedAppearance === "corner"}
            <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9 23h4c5.523 0 10-4.477 10-10V9" />
            </svg>
        {/if}
    </span>
</Frame>

<style>
    :global(:where(.snowui-indicator)) {
        display: block;
        box-sizing: border-box;
        flex: 0 0 auto;
        font-size: var(--text-12);
        line-height: var(--leading-12);
        /* 与 overlay 滚动条 thumb 一致：默认 Black/10，hover Black/20 */
        color: var(--snowui-indicator-color-override, var(--black-10, #0000001a));
        outline: none;
        touch-action: none;
        user-select: none;
        pointer-events: auto;
    }

    /* line 父级：与 pin 一样激活定位上下文，供 absolute 命中带参照 */
    :global(:where(:has(> .snowui-indicator-line))) {
        position: relative;
    }

    /*
     * line 命中带：根节点 absolute 铺满边缘（尺寸由 inline style 的 top/bottom 或 left/right 保证）。
     * 视觉层保持短条。corner 仍用 pin + 局部放大命中。
     */
    :global(:where(.snowui-indicator-line)) {
        z-index: 5;
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-width)) {
        cursor: col-resize;
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height)) {
        cursor: row-resize;
    }

    :global(:where(.snowui-indicator-corner)::before) {
        content: "";
        position: absolute;
        inset: calc(var(--size-3) / -4);
    }

    :global(:where(.snowui-indicator-visual)) {
        position: absolute;
        display: block;
        border-radius: var(--radius-full, 9999px);
        background-color: currentColor;
        opacity: 0;
        transition:
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            width var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            height var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /*
     * 视觉条：贴 pinOffset（--snowui-indicator-visual-inset），不随命中带中心。
     * 沿边缘方向长度默认 16px，可用 --snowui-indicator-visual-length 覆盖。
     */
    :global(:where(.snowui-indicator-line.snowui-indicator-width.snowui-indicator-edge-start) > .snowui-indicator-visual) {
        top: 50%;
        left: var(--snowui-indicator-visual-inset, 0);
        width: calc(var(--size-3) / 6);
        height: var(--snowui-indicator-visual-length, var(--size-4));
        transform: translate(-50%, -50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-width.snowui-indicator-edge-end) > .snowui-indicator-visual) {
        top: 50%;
        right: var(--snowui-indicator-visual-inset, 0);
        left: auto;
        width: calc(var(--size-3) / 6);
        height: var(--snowui-indicator-visual-length, var(--size-4));
        transform: translate(50%, -50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height.snowui-indicator-edge-top) > .snowui-indicator-visual) {
        top: var(--snowui-indicator-visual-inset, 0);
        left: 50%;
        width: var(--snowui-indicator-visual-length, var(--size-4));
        height: calc(var(--size-3) / 6);
        transform: translate(-50%, -50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height.snowui-indicator-edge-bottom) > .snowui-indicator-visual) {
        bottom: var(--snowui-indicator-visual-inset, 0);
        top: auto;
        left: 50%;
        width: var(--snowui-indicator-visual-length, var(--size-4));
        height: calc(var(--size-3) / 6);
        transform: translate(-50%, 50%);
    }

    :global(:where(.snowui-indicator[data-visible="true"]) > .snowui-indicator-visual) {
        opacity: 1;
    }

    :global(:where(.snowui-indicator:hover)),
    :global(:where(.snowui-indicator:focus-visible)),
    :global(:where(.snowui-indicator[data-dragging="true"])) {
        color: var(--snowui-indicator-active-color-override, var(--black-20, #00000033));
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-width:hover) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator-line.snowui-indicator-width:focus-visible) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator-line.snowui-indicator-width[data-dragging="true"]) > .snowui-indicator-visual) {
        width: calc(var(--size-3) / 3);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height:hover) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator-line.snowui-indicator-height:focus-visible) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator-line.snowui-indicator-height[data-dragging="true"]) > .snowui-indicator-visual) {
        height: calc(var(--size-3) / 3);
    }

    :global(:where(.snowui-indicator-corner)) {
        width: var(--size-4);
        height: var(--size-4);
        color: var(--snowui-indicator-color-override, var(--black-10, #0000001a));
        z-index: 4;
    }

    :global(:where(.snowui-indicator-corner.snowui-indicator-width)) {
        cursor: ew-resize;
    }

    :global(:where(.snowui-indicator-corner.snowui-indicator-height)) {
        cursor: ns-resize;
    }

    :global(:where(.snowui-indicator-corner.snowui-indicator-both)) {
        cursor: nwse-resize;
    }

    :global(:where(.snowui-indicator-corner) > .snowui-indicator-visual) {
        position: static;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0;
        background: transparent;
        transform: none;
    }

    :global(:where(.snowui-indicator-corner) > .snowui-indicator-visual svg) {
        display: block;
        width: 100%;
        height: 100%;
    }

    :global(:where(.snowui-indicator-corner) > .snowui-indicator-visual path) {
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        shape-rendering: geometricPrecision;
        transition: stroke-width var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-indicator-corner:hover) > .snowui-indicator-visual path),
    :global(:where(.snowui-indicator-corner:focus-visible) > .snowui-indicator-visual path),
    :global(:where(.snowui-indicator-corner[data-dragging="true"]) > .snowui-indicator-visual path) {
        stroke-width: 4;
    }

    :global(:where(.snowui-indicator[data-disabled="true"])) {
        cursor: default;
        pointer-events: none;
    }

    :global(:where(.snowui-indicator[data-overlaps-scrollbar="true"])) {
        visibility: hidden;
        pointer-events: none;
    }
</style>
