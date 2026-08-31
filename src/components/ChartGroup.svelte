<!--
  ChartGroup 图表组合容器 (PRO)
  v0.1.1 (2026-08-31)

  职责:协调多个 Chart 原子组件的共享分类单元格 hover 与叠加画布。
  文档: ./ChartGroup.md
-->

<script lang="ts">
    import { onDestroy, setContext, type Snippet } from "svelte";
    import { Frame, type FrameProps, type RenderHints } from "@snowui-design-system/components";
    import ChartHoverPanel from "../lib/chart/ChartHoverPanel.svelte";
    import {
        CHART_PLOT_TOP_INSET,
        CHART_X_AXIS_RESERVED_HEIGHT,
        resolveVisibleXIndexes,
    } from "../lib/chart/axis";
    import { toCssLength, toNumber } from "../lib/chart/geometry";
    import {
        CHART_GROUP_CONTEXT_KEY,
        type ChartGroupContext,
        type ChartGroupHoverMode,
        type ChartGroupXAxisMode,
    } from "../lib/chart/group-context";
    import type {
        ChartHoverPanelData,
        ChartHoverPanelPlacement,
        ChartHoverPanelVariant,
    } from "../lib/chart/hover-panel";

    export interface ChartGroupPlotBounds {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }

    interface Props extends Omit<FrameProps, "children"> {
        width?: number | string;
        height?: number | string;
        xLabels?: string[];
        yMin?: number;
        yMax?: number;
        yTicks?: number[];
        yTickCount?: number;
        yTickFormatter?: (value: number) => string;
        showXAxis?: boolean;
        showYAxis?: boolean;
        showGrid?: boolean;
        showGuides?: boolean;
        xAxisMode?: ChartGroupXAxisMode;
        xLabelAutoCull?: boolean;
        xMaxLabelCount?: number;
        yLabelAutoCull?: boolean;
        yMaxLabelCount?: number;
        plotBounds?: ChartGroupPlotBounds;
        hoverMode?: ChartGroupHoverMode;
        activeCellIndex?: number | null;
        defaultActiveCellIndex?: number | null;
        onCellHoverChange?: (index: number | null) => void;
        showHitLayer?: boolean;
        showHoverPanel?: boolean;
        showHoverLabel?: boolean;
        alwaysShowHoverLabel?: boolean;
        hoverPanelVariant?: ChartHoverPanelVariant;
        hoverPanelPlacement?: ChartHoverPanelPlacement;
        showHoverPanelLabel?: boolean;
        children?: Snippet;
        class?: string;
        style?: string;
        renderHints?: RenderHints;
        enableResponsive?: boolean;
        enableContext?: boolean;
        enableScaleObserver?: boolean;
        enableDefaultMotion?: boolean;
        [key: string]: any;
    }

    const DEFAULT_PLOT_BOUNDS = {
        top: CHART_PLOT_TOP_INSET,
        right: 0,
        bottom: CHART_X_AXIS_RESERVED_HEIGHT,
        left: 0,
    };

    let {
        width = 800,
        height = 400,
        xLabels = [],
        yMin = undefined,
        yMax = undefined,
        yTicks = undefined,
        yTickCount = 6,
        yTickFormatter = undefined,
        showXAxis = true,
        showYAxis = false,
        showGrid = false,
        showGuides = false,
        xAxisMode = "edge",
        xLabelAutoCull = true,
        xMaxLabelCount = undefined,
        yLabelAutoCull = true,
        yMaxLabelCount = undefined,
        plotBounds = DEFAULT_PLOT_BOUNDS,
        hoverMode = "cell",
        activeCellIndex = undefined,
        defaultActiveCellIndex = null,
        onCellHoverChange,
        showHitLayer = true,
        showHoverPanel = false,
        showHoverLabel = undefined,
        alwaysShowHoverLabel = false,
        hoverPanelVariant = "light",
        hoverPanelPlacement = "anchor-side",
        showHoverPanelLabel = false,
        children,
        class: userClass = "",
        style = "",
        loading = undefined,
        skeleton = undefined,
        renderHints = undefined,
        enableResponsive = true,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();

    function resolveInitialActiveCellIndex() {
        return defaultActiveCellIndex;
    }

    let internalActiveCellIndex = $state<{ value: number | null }>({
        value: resolveInitialActiveCellIndex(),
    });
    let hoverPanelEntries = $state<Record<string, ChartHoverPanelData>>({});
    let hoverPanelPointer = $state({ x: 0, y: 0 });
    let rootElement = $state<HTMLElement>();
    let hoverPanelPointerFrame: number | null = null;
    let pendingHoverPanelPointer: { x: number; y: number } | null = null;

    const numericWidth = $derived(toNumber(width, 800));
    const numericHeight = $derived(toNumber(height, 400));
    const resolvedBounds = $derived({
        top: plotBounds.top ?? DEFAULT_PLOT_BOUNDS.top,
        right: plotBounds.right ?? DEFAULT_PLOT_BOUNDS.right,
        bottom: plotBounds.bottom ?? DEFAULT_PLOT_BOUNDS.bottom,
        left: plotBounds.left ?? DEFAULT_PLOT_BOUNDS.left,
    });
    const plotWidth = $derived(
        Math.max(1, numericWidth - resolvedBounds.left - resolvedBounds.right),
    );
    const plotHeight = $derived(
        Math.max(
            1,
            numericHeight - resolvedBounds.top - resolvedBounds.bottom,
        ),
    );
    const visibleXIndexes = $derived(
        resolveVisibleXIndexes(
            xLabels,
            plotWidth,
            xAxisMode,
            xLabelAutoCull,
            xMaxLabelCount,
        ),
    );
    const visibleXLabels = $derived(
        visibleXIndexes.map((index) => xLabels[index] ?? String(index + 1)),
    );
    const cellCount = $derived(Math.max(1, visibleXLabels.length));
    const cellWidth = $derived(plotWidth / cellCount);
    const controlledActiveCellIndex = $derived(
        activeCellIndex !== undefined,
    );
    const effectiveActiveCellIndex = $derived.by(() =>
        controlledActiveCellIndex
            ? activeCellIndex!
            : internalActiveCellIndex.value,
    );
    const rootStyle = $derived(
        [
            `--snowui-chart-group-width: ${toCssLength(width)}`,
            `--snowui-chart-group-height: ${toCssLength(height)}`,
            style,
        ]
            .filter(Boolean)
            .join("; "),
    );
    const chartGroupRenderHints = $derived({
        variant: renderHints?.variant ?? "rect",
        width: renderHints?.width ?? toCssLength(width),
        height: renderHints?.height ?? toCssLength(height),
        radius: renderHints?.radius ?? "0.75rem",
    });
    const plotAnchorBounds = $derived({
        left: resolvedBounds.left,
        top: resolvedBounds.top,
        width: plotWidth,
        height: plotHeight,
    });
    const groupHoverPanelData = $derived.by<ChartHoverPanelData | null>(() => {
        const entries = Object.values(hoverPanelEntries);
        if (entries.length === 0 || !showHoverPanel) return null;
        const activeLabel =
            typeof effectiveActiveCellIndex === "number"
                ? visibleXLabels[effectiveActiveCellIndex]
                : undefined;
        const resolvedAnchor = resolveGroupHoverPanelAnchor(entries);
        return {
            ...entries[0],
            rows: entries.flatMap((entry) => entry.rows),
            label: activeLabel ?? entries[0].label,
            x: resolvedAnchor.x,
            y: resolvedAnchor.y,
            anchorBounds: resolvedAnchor.anchorBounds,
            bounds: plotAnchorBounds,
            placement: hoverPanelPlacement,
            showLabel: showHoverPanelLabel,
        };
    });

    function resolveGroupHoverPanelAnchor(entries: ChartHoverPanelData[]) {
        if (hoverPanelPlacement === "pointer") {
            return {
                x: hoverPanelPointer.x,
                y: hoverPanelPointer.y,
                anchorBounds: undefined,
            };
        }
        if (hoverPanelPlacement === "anchor-top") {
            const highestEntry = entries.reduce((highest, entry) =>
                entry.y < highest.y ? entry : highest,
            );
            return {
                x: highestEntry.x,
                y: highestEntry.y,
                anchorBounds: undefined,
            };
        }
        if (hoverPanelPlacement === "anchor-side") {
            const resolveEntryTop = (entry: ChartHoverPanelData) =>
                entry.anchorBounds?.top ?? entry.y;
            const resolveEntryAlignedY = (entry: ChartHoverPanelData) =>
                entry.anchorYAlign === "center" ? entry.y : resolveEntryTop(entry);
            const highestEntry = entries.reduce((highest, entry) =>
                resolveEntryTop(entry) < resolveEntryTop(highest)
                    ? entry
                    : highest,
            );
            const widestEntry = entries.reduce((widest, entry) => {
                const widestWidth = widest.anchorBounds?.width ?? 0;
                const entryWidth = entry.anchorBounds?.width ?? 0;
                if (entryWidth !== widestWidth) {
                    return entryWidth > widestWidth ? entry : widest;
                }
                const widestArea =
                    (widest.anchorBounds?.width ?? 0) *
                    (widest.anchorBounds?.height ?? 0);
                const entryArea =
                    (entry.anchorBounds?.width ?? 0) *
                    (entry.anchorBounds?.height ?? 0);
                return entryArea > widestArea ? entry : widest;
            });
            const sideAnchorEntry =
                entries.length === 1 ? widestEntry : highestEntry;
            const sideY =
                entries.length === 1
                    ? widestEntry.y
                    : resolveEntryAlignedY(highestEntry);
            const anchorBounds = sideAnchorEntry.anchorBounds;
            if (anchorBounds) {
                return {
                    x: anchorBounds.left,
                    y: sideY,
                    anchorBounds,
                };
            }
            return {
                x: sideAnchorEntry.x,
                y: sideY,
                anchorBounds: undefined,
            };
        }
        return {
            x: resolvedBounds.left,
            y: resolvedBounds.top,
            anchorBounds: undefined,
        };
    }

    function setActiveCellIndex(index: number | null) {
        const next =
            typeof index === "number" && Number.isFinite(index)
                ? Math.max(0, Math.min(cellCount - 1, index))
                : null;
        if (effectiveActiveCellIndex === next) return;
        if (!controlledActiveCellIndex) {
            internalActiveCellIndex.value = next;
        }
        onCellHoverChange?.(next);
    }

    function isSameHoverPanelData(
        a: ChartHoverPanelData | undefined,
        b: ChartHoverPanelData,
    ) {
        if (!a) return false;
        if (
            a.label !== b.label ||
            a.x !== b.x ||
            a.y !== b.y ||
            a.anchorYAlign !== b.anchorYAlign ||
            a.placement !== b.placement ||
            a.showLabel !== b.showLabel ||
            a.rows.length !== b.rows.length
        ) {
            return false;
        }
        const sameBounds =
            (!a.bounds && !b.bounds) ||
            (Boolean(a.bounds) &&
                Boolean(b.bounds) &&
                a.bounds!.left === b.bounds!.left &&
                a.bounds!.top === b.bounds!.top &&
                a.bounds!.width === b.bounds!.width &&
                a.bounds!.height === b.bounds!.height);
        if (!sameBounds) return false;
        const sameAnchorBounds =
            (!a.anchorBounds && !b.anchorBounds) ||
            (Boolean(a.anchorBounds) &&
                Boolean(b.anchorBounds) &&
                a.anchorBounds!.left === b.anchorBounds!.left &&
                a.anchorBounds!.top === b.anchorBounds!.top &&
                a.anchorBounds!.width === b.anchorBounds!.width &&
                a.anchorBounds!.height === b.anchorBounds!.height);
        if (!sameAnchorBounds) return false;
        return a.rows.every((row, index) => {
            const nextRow = b.rows[index];
            return (
                row.name === nextRow.name &&
                row.value === nextRow.value &&
                row.color === nextRow.color &&
                row.opacity === nextRow.opacity
            );
        });
    }

    function setHoverPanelData(source: string, data: ChartHoverPanelData | null) {
        if (data) {
            if (isSameHoverPanelData(hoverPanelEntries[source], data)) return;
            hoverPanelEntries = {
                ...hoverPanelEntries,
                [source]: data,
            };
            return;
        }
        if (!(source in hoverPanelEntries)) return;
        const nextEntries = { ...hoverPanelEntries };
        delete nextEntries[source];
        hoverPanelEntries = nextEntries;
    }

    function cellHit(node: SVGRectElement, index: number) {
        const activate = () => {
            setActiveCellIndex(index);
        };
        const deactivate = () => {
            setActiveCellIndex(null);
        };
        node.addEventListener("pointerenter", activate);
        node.addEventListener("pointermove", activate);
        node.addEventListener("focus", activate);
        node.addEventListener("blur", deactivate);
        return {
            update(nextIndex: number) {
                index = nextIndex;
            },
            destroy() {
                node.removeEventListener("pointerenter", activate);
                node.removeEventListener("pointermove", activate);
                node.removeEventListener("focus", activate);
                node.removeEventListener("blur", deactivate);
            },
        };
    }

    function resolveCellCenter(index: number) {
        return resolvedBounds.left + cellWidth * (index + 0.5);
    }

    function resolveCellStart(index: number) {
        return resolveCellCenter(index) - cellWidth / 2;
    }

    function scheduleHoverPanelPointer(x: number, y: number) {
        pendingHoverPanelPointer = { x, y };
        if (hoverPanelPointerFrame !== null) return;
        hoverPanelPointerFrame = requestAnimationFrame(() => {
            hoverPanelPointerFrame = null;
            if (!pendingHoverPanelPointer) return;
            hoverPanelPointer = pendingHoverPanelPointer;
            pendingHoverPanelPointer = null;
        });
    }

    function handleGroupPointerMove(event: PointerEvent) {
        if (!showHoverPanel || hoverMode !== "cell" || !rootElement) return;
        const rect = rootElement.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        const insidePlot =
            localX >= resolvedBounds.left &&
            localX <= resolvedBounds.left + plotWidth &&
            localY >= resolvedBounds.top &&
            localY <= resolvedBounds.top + plotHeight;
        if (!insidePlot) {
            setActiveCellIndex(null);
            return;
        }
        scheduleHoverPanelPointer(localX, localY);
        const nextIndex = Math.floor((localX - resolvedBounds.left) / cellWidth);
        setActiveCellIndex(nextIndex);
    }

    function handleGroupPointerLeave() {
        if (!showHoverPanel) return;
        clearHoverPanelPointerFrame();
        setActiveCellIndex(null);
        hoverPanelEntries = {};
    }

    onDestroy(() => {
        clearHoverPanelPointerFrame();
    });

    function clearHoverPanelPointerFrame() {
        pendingHoverPanelPointer = null;
        if (hoverPanelPointerFrame === null) return;
        cancelAnimationFrame(hoverPanelPointerFrame);
        hoverPanelPointerFrame = null;
    }

    const context: ChartGroupContext = {
        hoverMode: () => hoverMode,
        activeCellIndex: () => effectiveActiveCellIndex,
        setActiveCellIndex,
        xLabels: () => visibleXLabels,
        yMin: () => yMin,
        yMax: () => yMax,
        yTicks: () => yTicks,
        yTickCount: () => yTickCount,
        yTickFormatter: () => yTickFormatter,
        showXAxis: () => showXAxis,
        showYAxis: () => showYAxis,
        showGrid: () => showGrid,
        showGuides: () => showGuides,
        xAxisMode: () => xAxisMode,
        xLabelAutoCull: () => xLabelAutoCull,
        xMaxLabelCount: () => xMaxLabelCount,
        yLabelAutoCull: () => yLabelAutoCull,
        yMaxLabelCount: () => yMaxLabelCount,
        showHoverPanel: () => showHoverPanel,
        showHoverLabel: () => showHoverLabel,
        alwaysShowHoverLabel: () => alwaysShowHoverLabel,
        hoverPanelPlacement: () => hoverPanelPlacement,
        setHoverPanelData,
    };

    setContext(CHART_GROUP_CONTEXT_KEY, context);
</script>

<Frame
    bind:element={rootElement}
    class={["snowui-chart-group", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    role="group"
    aria-label="组合图表"
    {loading}
    {skeleton}
    renderHints={chartGroupRenderHints}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    onpointermove={handleGroupPointerMove}
    onpointerleave={handleGroupPointerLeave}
    {...rest}
>
    {@render children?.()}

    {#if showHitLayer && hoverMode === "cell" && !showHoverPanel}
        <svg
            class="snowui-chart-group-hit-layer"
            viewBox={`0 0 ${numericWidth} ${numericHeight}`}
            width={numericWidth}
            height={numericHeight}
            role="group"
            aria-label="组合图表数据单元格"
            onpointerleave={() => setActiveCellIndex(null)}
        >
            {#each Array(cellCount) as _, index}
                <rect
                    class="snowui-chart-group-cell-hit-area"
                    data-active={effectiveActiveCellIndex === index
                        ? "true"
                        : undefined}
                    x={resolveCellStart(index)}
                    y={resolvedBounds.top}
                    width={cellWidth}
                    height={plotHeight}
                    tabindex="0"
                    role="button"
                    aria-label={visibleXLabels[index] ?? `Cell ${index + 1}`}
                    use:cellHit={index}
                />
            {/each}
        </svg>
    {/if}

    <ChartHoverPanel
        visible={Boolean(groupHoverPanelData)}
        rows={groupHoverPanelData?.rows ?? []}
        label={groupHoverPanelData?.label ?? ""}
        showLabel={groupHoverPanelData?.showLabel ?? false}
        x={groupHoverPanelData?.x ?? 0}
        y={groupHoverPanelData?.y ?? 0}
        anchorBounds={groupHoverPanelData?.anchorBounds}
        bounds={groupHoverPanelData?.bounds}
        placement={groupHoverPanelData?.placement ?? hoverPanelPlacement}
        variant={hoverPanelVariant}
        animated={false}
    />
</Frame>

<style>
    :global(:where(.snowui-chart-group)) {
        position: relative;
        display: block;
        flex: none;
        width: var(
            --snowui-chart-group-width-override,
            var(--snowui-chart-group-width)
        );
        height: var(
            --snowui-chart-group-height-override,
            var(--snowui-chart-group-height)
        );
        overflow: visible;
    }

    :global(:where(.snowui-chart-group-hit-layer)) {
        position: absolute;
        inset: 0;
        z-index: 20;
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
    }

    :global(:where(.snowui-chart-group-cell-hit-area)) {
        fill: transparent;
        outline: none;
        pointer-events: all;
        cursor: pointer;
    }

    :global(:where(.snowui-chart-group-cell-hit-area:focus-visible)) {
        stroke: var(--focus, var(--primary, #111111));
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
    }
</style>
