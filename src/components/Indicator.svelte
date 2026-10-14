<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 通用可交互尺寸指示手柄；支持局部命中，重叠时优先调整尺寸。文档: ./Indicator.md -->
<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    export type IndicatorAxis = "width" | "height" | "both";
    export type IndicatorEdge = "start" | "end" | "top" | "bottom";
    export type IndicatorAppearance = "line" | "corner";
    let indicatorSeed = 0;
</script>

<script lang="ts">
    import ComponentIcon from "../internal/component-icon/ComponentIcon.svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { resizable, type ResizableOptions } from "../lib/resizable";
    import { untrack } from "svelte";
    import { useLocale } from "../i18n/locale.svelte";
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
    const localeContext = useLocale();
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
    let resizeActions: ReturnType<typeof resizable>[] = [];

    const resolvedAxis = $derived(
        axis ?? (appearance === "corner" ? "both" : "width"),
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
        pinOffset ?? "var(--padding-1)",
    );
    const resolvedTarget = $derived(target ?? element?.parentElement ?? undefined);
    const resolvedRevealTarget = $derived(revealTarget ?? resolvedTarget);
    const isVisible = $derived(hostHovered || focused || dragging);
    const resolvedAriaLabel = $derived(
        ariaLabel ??
            localeContext.t(resolvedAxis === "width"
                ? "indicator.resizeWidth"
                : resolvedAxis === "height"
                  ? "indicator.resizeHeight"
                  : "indicator.resizeBoth"),
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
     * 视觉条外缘距宿主边缘 pinOffset（默认 4px），加粗时向内生长。
     */
    const lineEdgeStyle = $derived.by(() => {
        if (resolvedAppearance !== "line" || resolvedAxis === "both") return "";
        const offset = toCssLength(resolvedPinOffset);
        const grab = "var(--size-2, 0.5rem)";
        // 保留旧 Prop 的输入兼容；线形始终覆盖所在整条边。
        if (resolvedAxis === "width") {
            return [
                "position:absolute", "top:0", "bottom:0", "height:auto",
                `width:calc(${offset} + ${grab})`,
                resolvedEdge === "start" ? "left:0" : "right:0",
                "translate:none",
                `--snowui-indicator-visual-inset:${offset}`,
            ].join(";");
        }
        return [
            "position:absolute", "left:0", "right:0", "width:auto",
            `height:calc(${offset} + ${grab})`,
            resolvedEdge === "top" ? "top:0" : "bottom:0",
            "translate:none",
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
    data-dragging={dragging ? "true" : undefined}
    data-disabled={disabled ? "true" : undefined}
    role="separator"
    aria-label={resolvedAriaLabel}
    aria-orientation={resolvedAxis === "width"
        ? "vertical"
        : resolvedAxis === "height"
          ? "horizontal"
          : undefined}
    tabindex={disabled ? -1 : 0}
    enableAutoLayout={false}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
>
    <span class="snowui-indicator-visual" aria-hidden="true" style={`--snowui-indicator-paint: url(#${indicatorId}-paint)`}>
        {#if resolvedAppearance === "corner"}
            <svg data-indicator-filter aria-hidden="true" style="position: absolute; width: 0; height: 0; overflow: hidden;">
                <defs>
                    <filter id={`${indicatorId}-paint`} x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                        <feFlood flood-color="currentColor" />
                        <feComposite in2="SourceAlpha" operator="in" />
                    </filter>
                </defs>
            </svg>
            <ComponentIcon name="rounded-corner" size="var(--size-4)" />
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
        /* visual 自己拥有颜色，避免 Frame 根层的 color: inherit 受加载顺序影响。 */
        color: var(--snowui-indicator-color-override, var(--black-10, #0000001a));
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
        transform: translateY(-50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-width.snowui-indicator-edge-end) > .snowui-indicator-visual) {
        top: 50%;
        right: var(--snowui-indicator-visual-inset, 0);
        left: auto;
        width: calc(var(--size-3) / 6);
        height: var(--snowui-indicator-visual-length, var(--size-4));
        transform: translateY(-50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height.snowui-indicator-edge-top) > .snowui-indicator-visual) {
        top: var(--snowui-indicator-visual-inset, 0);
        left: 50%;
        width: var(--snowui-indicator-visual-length, var(--size-4));
        height: calc(var(--size-3) / 6);
        transform: translateX(-50%);
    }

    :global(:where(.snowui-indicator-line.snowui-indicator-height.snowui-indicator-edge-bottom) > .snowui-indicator-visual) {
        bottom: var(--snowui-indicator-visual-inset, 0);
        top: auto;
        left: 50%;
        width: var(--snowui-indicator-visual-length, var(--size-4));
        height: calc(var(--size-3) / 6);
        transform: translateX(-50%);
    }

    :global(:where(.snowui-indicator[data-visible="true"]) > .snowui-indicator-visual) {
        opacity: 1;
    }

    :global(:where(.snowui-indicator:hover) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator:focus-visible) > .snowui-indicator-visual),
    :global(:where(.snowui-indicator[data-dragging="true"]) > .snowui-indicator-visual) {
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
        z-index: 6;
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

    :global(:where(.snowui-indicator-corner) > .snowui-indicator-visual svg:not([data-indicator-filter])) {
        display: block;
        width: 100%;
        height: 100%;
        /* 先合并不透明的填充与描边，再统一着色，避免透明颜色叠加。 */
        filter: var(--snowui-indicator-paint);
        /* 原资源在 16px 外框下为 1px 笔画；沿轮廓扩展至 2px / 4px。 */
        stroke: rgb(from currentColor r g b / 1);
        stroke-width: var(--snowui-indicator-corner-stroke, calc(var(--size-3) / 6));
        stroke-linejoin: round;
        transition: stroke-width var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-indicator-corner) > .snowui-indicator-visual svg:not([data-indicator-filter]) path) {
        fill: rgb(from currentColor r g b / 1);
    }

    :global(:where(.snowui-indicator-corner:hover)),
    :global(:where(.snowui-indicator-corner:focus-visible)),
    :global(:where(.snowui-indicator-corner[data-dragging="true"])) {
        --snowui-indicator-corner-stroke: calc(var(--size-3) / 2);
    }

    :global(:where(.snowui-indicator[data-disabled="true"])) {
        cursor: default;
        pointer-events: none;
    }

</style>
