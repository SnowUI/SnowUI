<!-- SnowUI source notice | LICENSE 2.2.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<script lang="ts">
    import { onDestroy, tick } from "svelte";
    import { Frame } from "../../index";
    import { clampFloatingPosition } from "../floating-position";
    import type { CoreState } from "../../logic/frame-types";
    import type {
        ChartHoverPanelBounds,
        ChartHoverPanelPlacement,
        ChartHoverPanelRow,
        ChartHoverPanelVariant,
    } from "./hover-panel";

    interface Props {
        visible?: boolean;
        rows?: ChartHoverPanelRow[];
        label?: string;
        showLabel?: boolean;
        x?: number;
        y?: number;
        anchorBounds?: ChartHoverPanelBounds;
        bounds?: ChartHoverPanelBounds;
        placement?: ChartHoverPanelPlacement;
        variant?: ChartHoverPanelVariant;
        animated?: boolean;
    }

    let {
        visible = false,
        rows = [],
        label = "",
        showLabel = false,
        x = 0,
        y = 0,
        anchorBounds = undefined,
        bounds = undefined,
        placement = "anchor-top",
        variant = "light",
        animated = false,
    }: Props = $props();

    let panelElement = $state<HTMLElement>();
    let left = $state(0);
    let top = $state(0);
    let rendered = $state(false);
    let lifecycleState = $state<CoreState>("Appear");
    let renderedRows = $state<ChartHoverPanelRow[]>([]);
    let renderedLabel = $state("");
    let renderedShowLabel = $state(false);
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let positionFrame: number | undefined;
    let measurementDirty = true;
    let cachedPanelWidth = 0;
    let cachedPanelHeight = 0;
    let cachedHostRect:
        | {
              left: number;
              top: number;
              width: number;
              height: number;
          }
        | undefined;

    const CHART_HOVER_PANEL_GAP = 4;
    const CHART_HOVER_PANEL_EDGE_GAP = 8;
    const CHART_HOVER_PANEL_POINTER_OFFSET = 12;
    const APPEAR_DURATION = 100;
    const DISAPPEAR_DURATION = 100;
    const SLIDE_DISTANCE = 4;

    const appearMotion = $derived(resolvePanelMotion("appear"));
    const disappearMotion = $derived(resolvePanelMotion("disappear"));

    function resolvePanelMotion(type: "appear" | "disappear") {
        const from = type === "appear";
        const motion: Record<string, any> = {
            opacity: from ? [0, 1] : [1, 0],
            duration: from ? APPEAR_DURATION : DISAPPEAR_DURATION,
            easing: "easeOut",
        };
        const distance = SLIDE_DISTANCE;
        const start = from ? distance : 0;
        const end = from ? 0 : distance;
        const reverseStart = from ? -distance : 0;
        const reverseEnd = from ? 0 : -distance;

        if (placement === "anchor-top") {
            motion.y = [start, end];
        } else if (placement === "anchor-side") {
            const panelWidth = panelElement?.offsetWidth ?? 0;
            const anchorCenterX = anchorBounds
                ? anchorBounds.left + anchorBounds.width / 2
                : x;
            const isLeftSide = left + panelWidth / 2 < anchorCenterX;
            motion.x = isLeftSide ? [start, end] : [reverseStart, reverseEnd];
        } else if (placement === "pointer") {
            motion.x = [reverseStart, reverseEnd];
            motion.y = [reverseStart, reverseEnd];
        }

        return motion;
    }

    function clearHideTimer() {
        if (hideTimer === undefined) return;
        clearTimeout(hideTimer);
        hideTimer = undefined;
    }

    function clearPositionFrame() {
        if (positionFrame === undefined) return;
        cancelAnimationFrame(positionFrame);
        positionFrame = undefined;
    }

    function schedulePositionUpdate() {
        if (!visible || !rendered) {
            clearPositionFrame();
            return;
        }
        if (positionFrame !== undefined) return;
        positionFrame = requestAnimationFrame(() => {
            positionFrame = undefined;
            void updatePosition();
        });
    }

    function markMeasurementDirty() {
        measurementDirty = true;
    }

    function resolvePinPosition(
        panelWidth: number,
        panelHeight: number,
        hostWidth: number,
        hostHeight: number,
    ) {
        const areaLeft = bounds?.left ?? 0;
        const areaTop = bounds?.top ?? 0;
        const areaWidth = bounds?.width ?? hostWidth;
        const areaHeight = bounds?.height ?? hostHeight;
        const minX = areaLeft + CHART_HOVER_PANEL_EDGE_GAP;
        const minY = areaTop + CHART_HOVER_PANEL_EDGE_GAP;
        const maxX =
            areaLeft + areaWidth - panelWidth - CHART_HOVER_PANEL_EDGE_GAP;
        const maxY =
            areaTop + areaHeight - panelHeight - CHART_HOVER_PANEL_EDGE_GAP;
        switch (placement) {
            case "pin-top-left":
                return { x: minX, y: minY };
            case "pin-top":
                return { x: areaLeft + (areaWidth - panelWidth) / 2, y: minY };
            case "pin-top-right":
                return { x: maxX, y: minY };
            case "pin-right":
                return {
                    x: maxX,
                    y: areaTop + (areaHeight - panelHeight) / 2,
                };
            case "pin-bottom-right":
                return { x: maxX, y: maxY };
            case "pin-bottom":
                return { x: areaLeft + (areaWidth - panelWidth) / 2, y: maxY };
            case "pin-bottom-left":
                return { x: minX, y: maxY };
            case "pin-left":
                return {
                    x: minX,
                    y: areaTop + (areaHeight - panelHeight) / 2,
                };
            case "pin-center":
                return {
                    x: areaLeft + (areaWidth - panelWidth) / 2,
                    y: areaTop + (areaHeight - panelHeight) / 2,
                };
            default:
                return { x, y };
        }
    }

    function resolveViewportBounds(hostRect: ChartHoverPanelBounds | undefined) {
        if (!hostRect || typeof window === "undefined") {
            return undefined;
        }
        return {
            left: -hostRect.left,
            top: -hostRect.top,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    async function updatePosition() {
        if (!panelElement || !visible) return;
        if (measurementDirty || cachedPanelWidth <= 0 || !cachedHostRect) {
            await tick();
            if (!panelElement || !visible) return;
            const host = panelElement.parentElement;
            const hostRect = host?.getBoundingClientRect();
            cachedPanelWidth = panelElement.offsetWidth;
            cachedPanelHeight = panelElement.offsetHeight;
            cachedHostRect = hostRect
                ? {
                      left: hostRect.left,
                      top: hostRect.top,
                      width: hostRect.width,
                      height: hostRect.height,
                  }
                : undefined;
            measurementDirty = false;
        }
        const panelWidth = cachedPanelWidth;
        const panelHeight = cachedPanelHeight;
        const hostWidth = cachedHostRect?.width ?? 0;
        const hostHeight = cachedHostRect?.height ?? 0;
        const viewportBounds = resolveViewportBounds(cachedHostRect);
        const activeBounds = viewportBounds ?? {
            left: 0,
            top: 0,
            width: hostWidth,
            height: hostHeight,
        };

        let nextLeft = x;
        let nextTop = y;

        if (placement.startsWith("pin-")) {
            const pin = resolvePinPosition(
                panelWidth,
                panelHeight,
                hostWidth,
                hostHeight,
            );
            nextLeft = pin.x;
            nextTop = pin.y;
        } else if (placement === "anchor-top") {
            nextLeft = x - panelWidth / 2;
            nextTop = y - panelHeight - CHART_HOVER_PANEL_GAP;
            if (nextTop < activeBounds.top + CHART_HOVER_PANEL_EDGE_GAP) {
                nextTop = y + CHART_HOVER_PANEL_GAP;
            }
        } else if (placement === "anchor-side") {
            const sideAnchor = anchorBounds ?? {
                left: x,
                top: y,
                width: 0,
                height: 0,
            };
            const sideCenterY = sideAnchor.top + sideAnchor.height / 2;
            const hasCustomSideY = Math.abs(y - sideCenterY) > 0.001;
            nextLeft =
                sideAnchor.left +
                sideAnchor.width +
                CHART_HOVER_PANEL_GAP;
            nextTop =
                (hasCustomSideY ? y : sideCenterY) - panelHeight / 2;
            if (nextTop < activeBounds.top + CHART_HOVER_PANEL_EDGE_GAP) {
                nextTop = activeBounds.top + CHART_HOVER_PANEL_EDGE_GAP;
            }
            if (
                nextTop + panelHeight >
                activeBounds.top +
                    activeBounds.height -
                    CHART_HOVER_PANEL_EDGE_GAP
            ) {
                nextTop =
                    activeBounds.top +
                    activeBounds.height -
                    panelHeight -
                    CHART_HOVER_PANEL_EDGE_GAP;
            }
            if (
                nextLeft + panelWidth >
                activeBounds.left + activeBounds.width - CHART_HOVER_PANEL_EDGE_GAP
            ) {
                nextLeft =
                    sideAnchor.left - panelWidth - CHART_HOVER_PANEL_GAP;
            }
        } else {
            nextLeft = x + CHART_HOVER_PANEL_POINTER_OFFSET;
            nextTop = y + CHART_HOVER_PANEL_POINTER_OFFSET;
            if (
                nextLeft + panelWidth >
                activeBounds.left + activeBounds.width - CHART_HOVER_PANEL_EDGE_GAP
            ) {
                nextLeft = x - panelWidth - CHART_HOVER_PANEL_POINTER_OFFSET;
            }
            if (
                nextTop + panelHeight >
                activeBounds.top + activeBounds.height - CHART_HOVER_PANEL_EDGE_GAP
            ) {
                nextTop = y - panelHeight - CHART_HOVER_PANEL_POINTER_OFFSET;
            }
        }

        const collisionBounds = placement.startsWith("pin-")
            ? { left: 0, top: 0, width: hostWidth, height: hostHeight }
            : viewportBounds;

        if (
            collisionBounds &&
            collisionBounds.width > 0 &&
            collisionBounds.height > 0
        ) {
            const clamped = clampFloatingPosition(
                { left: nextLeft, top: nextTop },
                { width: panelWidth, height: panelHeight },
                collisionBounds,
                CHART_HOVER_PANEL_EDGE_GAP,
            );
            nextLeft = clamped.left;
            nextTop = clamped.top;
        }

        left = nextLeft;
        top = nextTop;
    }

    $effect(() => {
        const shouldRender = visible && rows.length > 0;
        if (shouldRender) {
            clearHideTimer();
            markMeasurementDirty();
            renderedRows = rows;
            renderedLabel = label;
            renderedShowLabel = showLabel;
            rendered = true;
            lifecycleState = "Appear";
        } else if (rendered) {
            if (animated) {
                lifecycleState = "Disappear";
                clearHideTimer();
                hideTimer = setTimeout(() => {
                    hideTimer = undefined;
                    rendered = false;
                    renderedRows = [];
                }, DISAPPEAR_DURATION);
            } else {
                clearHideTimer();
                rendered = false;
                renderedRows = [];
            }
        }
    });

    $effect(() => {
        rendered;
        visible;
        rows;
        label;
        showLabel;
        x;
        y;
        anchorBounds;
        bounds;
        placement;
        schedulePositionUpdate();
    });

    $effect(() => {
        variant;
        markMeasurementDirty();
        schedulePositionUpdate();
    });

    onDestroy(() => {
        clearHideTimer();
        clearPositionFrame();
    });
</script>

{#if rendered}
    <Frame
        bind:element={panelElement}
        class="snowui-chart-hover-panel"
        data-variant={variant}
        style={`--snowui-chart-hover-panel-x: ${left}px; --snowui-chart-hover-panel-y: ${top}px;`}
        currentState={lifecycleState}
        whileAppear={animated ? appearMotion : undefined}
        whileDisappear={animated ? disappearMotion : undefined}
        enableResponsive={false}
        enableContext={false}
        enableScaleObserver={false}
        enableDefaultMotion={false}
        loading={false}
        skeleton={false}
        aria-hidden="true"
    >
        {#if renderedShowLabel && renderedLabel}
            <div class="snowui-chart-hover-panel-label">{renderedLabel}</div>
        {/if}
        <div class="snowui-chart-hover-panel-rows">
            {#each renderedRows as row}
                <div class="snowui-chart-hover-panel-row">
                    <span
                        class="snowui-chart-hover-panel-dot"
                        style={`--snowui-chart-hover-panel-dot-color: ${row.color}; --snowui-chart-hover-panel-dot-opacity: ${row.opacity ?? 1};`}
                    ></span>
                    <span class="snowui-chart-hover-panel-name">{row.name}</span>
                    <span class="snowui-chart-hover-panel-value">{row.value}</span>
                </div>
            {/each}
        </div>
    </Frame>
{/if}

<style>
    :global(:where(.snowui-chart-hover-panel)) {
        position: absolute;
        left: 0;
        top: 0;
        translate: var(--snowui-chart-hover-panel-x)
            var(--snowui-chart-hover-panel-y);
        z-index: 30;
        display: inline-flex;
        flex-direction: column;
        gap: calc(var(--gap-1) / 2);
        padding: calc(var(--padding-1) * 1.5) var(--padding-2);
        border: none;
        outline: none;
        border-radius: var(--radius-3);
        font-size: var(--text-12);
        line-height: var(--leading-12);
        font-weight: 400;
        pointer-events: none;
        contain: layout style paint;
        will-change: translate, opacity;
        white-space: nowrap;
        background:
            linear-gradient(
                0deg,
                var(--static-white-10, #ffffff1a),
                var(--static-white-10, #ffffff1a)
            ),
            var(--static-black-80, #000000cc);
        color: var(--static-white-100, #ffffffff);
        backdrop-filter: blur(1.25rem);
        -webkit-backdrop-filter: blur(1.25rem);
        box-shadow: none;
    }

    :global(:where(.snowui-chart-hover-panel)[data-variant="light"]) {
        background: var(--black-4, #0000000a);
        color: var(--black-100, #000000ff);
        border: none;
        box-shadow: none;
    }

    :global(:where(.snowui-chart-hover-panel)[data-variant="surface"]) {
        background: var(--snowui-background-quick-action);
        color: var(--black-100, #000000ff);
        backdrop-filter: var(--snowui-backdrop-quick-action);
        -webkit-backdrop-filter: var(--snowui-backdrop-quick-action);
        border: none;
        box-shadow: var(--snowui-shadow-quick-action);
    }

    :global(:where(.snowui-chart-hover-panel-label)) {
        color: var(--snowui-chart-hover-panel-label-color);
    }

    :global(:where(.snowui-chart-hover-panel)[data-variant="dark"]) {
        --snowui-chart-hover-panel-label-color: var(
            --static-white-100,
            #ffffffff
        );
        --snowui-chart-hover-panel-name-color: var(
            --static-white-40,
            #ffffff66
        );
        --snowui-chart-hover-panel-value-color: var(
            --static-white-100,
            #ffffffff
        );
    }

    :global(:where(.snowui-chart-hover-panel)[data-variant="light"]),
    :global(:where(.snowui-chart-hover-panel)[data-variant="surface"]) {
        --snowui-chart-hover-panel-label-color: var(--black-100, #000000ff);
        --snowui-chart-hover-panel-name-color: var(--black-40, #00000066);
        --snowui-chart-hover-panel-value-color: var(--black-100, #000000ff);
    }

    :global(:where(.snowui-chart-hover-panel-rows)) {
        display: grid;
        grid-template-columns: max-content max-content max-content;
        column-gap: 0;
        row-gap: calc(var(--gap-1) / 2);
        align-items: center;
    }

    :global(:where(.snowui-chart-hover-panel-row)) {
        display: contents;
    }

    :global(:where(.snowui-chart-hover-panel-dot)) {
        width: calc(var(--size-4) * 3 / 8);
        height: calc(var(--size-4) * 3 / 8);
        border-radius: 9999px;
        background: var(--snowui-chart-hover-panel-dot-color);
        opacity: var(--snowui-chart-hover-panel-dot-opacity);
        margin-right: var(--gap-1);
    }

    :global(:where(.snowui-chart-hover-panel-name)) {
        color: var(--snowui-chart-hover-panel-name-color);
    }

    :global(:where(.snowui-chart-hover-panel-value)) {
        color: var(--snowui-chart-hover-panel-value-color);
        text-align: right;
        margin-left: var(--gap-2);
    }
</style>
