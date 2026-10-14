<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  LineChart 折线图组件
  v1.6.1 (2026-09-05)

  职责:渲染带横坐标、纵坐标、网格、实线/虚线、面积填充、圆角转折线与可定制节点点样式的折线图。
  文档: ./LineChart.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { AdaptiveContrastMask } from "../lib/adaptive-contrast-renderer";
    import { getAdaptiveContrastColor, isAdaptiveContrastMonochrome } from "../lib/adaptive-contrast";
    import type { Snippet } from "svelte";
    import { getContext, onDestroy, onMount, tick } from "svelte";
    import {
        Frame,
        formatNumberLabel,
        getNumberFormat,
        mergeNumberFormatOptions,
        resizeManager,
        type NumberFormatOptions,
    } from "../index";
    import { getSkeleton } from "../context";
    import type { MotionConfig } from "../logic/motion-config";
    import ChartHoverPanel from "../lib/chart/ChartHoverPanel.svelte";
    import {
        resolveChartColor,
        type ChartColor,
        type ChartColorMode,
        type ChartGradient,
        type ChartGradientStop,
    } from "../lib/chart/colors";
    import {
        resolveAppearanceTimelineDuration,
        resolveSegmentAppearanceTimelines,
    } from "../lib/chart/appearance-timeline";
    import { resolveColorGradient } from "../lib/chart/gradients";
    import {
        CHART_AXIS_LABEL_HEIGHT,
        CHART_X_AXIS_LABEL_GAP,
        CHART_X_AXIS_RESERVED_HEIGHT,
        CHART_Y_AXIS_LABEL_GAP,
        createNiceTicks,
        estimateLabelWidth,
        formatAxisTick,
        measureRenderedAxisLabelWidth,
        measureRenderedAxisLabelWidths,
        normalizeTickValue,
        resolveCartesianChartTopInset,
        resolveIndexedLabels,
        resolveVisibleXIndexes,
        resolveVisibleYTicks,
        resolveYTickTargetCount,
    } from "../lib/chart/axis";
    import { clamp, toCssLength, toNumber } from "../lib/chart/geometry";
    import {
        resolveAppearanceViewportGeometry,
        resolveAppearanceViewportWindows,
    } from "../lib/chart/appearance-viewport";
    import {
        resolveCartesianChartSize,
        watchCartesianChartSize,
    } from "../lib/chart/size";
    import {
        addHoverLabelKey,
        hideHoverLabelKeyState,
        isHoverLabelKeyVisible,
        removeHoverLabelKey,
        shouldRenderHoverLabelKey,
        showHoverLabelKeyState,
    } from "../lib/chart/hover-label";
    import {
        hideChartCellHover,
        resolveEffectiveActiveCellIndex,
        showChartCellHover,
    } from "../lib/chart/interaction";
    import {
        CHART_GROUP_CONTEXT_KEY,
        type ChartGroupContext,
        type ChartGroupHoverMode,
    } from "../lib/chart/group-context";
    import {
        shouldRenderChartHoverLabel,
        describeChartHoverPanelData,
        type ChartHoverPanelData,
        type ChartHoverPanelPlacement,
        type ChartHoverPanelRow,
        type ChartHoverPanelVariant,
    } from "../lib/chart/hover-panel";
    import { createChartPointerFrameScheduler } from "../lib/chart/pointer";

    export type LineChartColor = ChartColor;
    export type LineChartColorMode = ChartColorMode;
    export type LineChartGradient = ChartGradient;
    export type LineChartGradientStop = ChartGradientStop;
    export type LineChartStrokeStyle = "solid" | "dashed";
    export type LineChartXAxisMode = "cell" | "edge";
    type AnchorPoint = "top" | "center" | "bottom";

    export interface LineChartMarkerConfig {
        size?: number | string;
        color?: LineChartColor | "line";
    }

    export interface LineChartPointMarkerConfig {
        size?: number | string;
    }

    export interface LineChartPoint {
        label?: string;
        value: number;
        marker?: boolean | LineChartPointMarkerConfig;
        valueFormat?: NumberFormatOptions;
    }

    export interface LineChartSeries {
        name: string;
        data: (number | LineChartPoint)[];
        color?: LineChartColor;
        strokeWidth?: number | string;
        strokeStyle?: LineChartStrokeStyle;
        cornerRadius?: number | string;
        markers?: boolean | LineChartMarkerConfig;
        guides?: boolean;
        area?: boolean;
        valueFormat?: NumberFormatOptions;
    }

    interface NormalizedPoint {
        label: string;
        value: number;
        marker?: boolean | LineChartPointMarkerConfig;
        valueFormat?: NumberFormatOptions;
        x: number;
        y: number;
    }

    interface NormalizedSeries {
        name: string;
        color: LineChartColor;
        stroke: string;
        gradientId?: string;
        area?: NormalizedArea;
        strokeWidth: number;
        strokeStyle: LineChartStrokeStyle;
        markers: boolean | LineChartMarkerConfig;
        guides: boolean;
        points: NormalizedPoint[];
        path: string;
    }

    interface NormalizedArea {
        fill: string;
        gradientId?: string;
        gradient?: NormalizedGradient;
        opacity: number;
        path: string;
    }

    interface NormalizedGradient {
        id: string;
        coordinates: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };
        stops: ChartGradientStop[];
    }

    interface AxisBounds {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }

    interface Props {
        series?: LineChartSeries[];
        xLabels?: string[];
        width?: number | string;
        height?: number | string;
        yMin?: number;
        yMax?: number;
        yTicks?: number[];
        yTickCount?: number;
        yTickFormatter?: (value: number) => string;
        showXAxis?: boolean;
        showYAxis?: boolean;
        showGrid?: boolean;
        showGuides?: boolean;
        showHoverLabel?: boolean;
        alwaysShowHoverLabel?: boolean;
        adaptiveContrast?: boolean;
        showHoverPanel?: boolean;
        hoverPanelVariant?: ChartHoverPanelVariant;
        hoverPanelPlacement?: ChartHoverPanelPlacement;
        showHoverPanelLabel?: boolean;
        hoverMode?: ChartGroupHoverMode;
        activeCellIndex?: number | null;
        onCellHoverChange?: (index: number | null) => void;
        valueFormat?: NumberFormatOptions;
        labelFormatter?: (
            value: number,
            context: {
                series: LineChartSeries;
                point: NormalizedPoint;
                seriesIndex: number;
                pointIndex: number;
            },
        ) => string;
        xAxisMode?: LineChartXAxisMode;
        xLabelAutoCull?: boolean;
        xMaxLabelCount?: number;
        yLabelAutoCull?: boolean;
        yMaxLabelCount?: number;
        cornerRadius?: number | string;
        colors?: (LineChartColor | undefined)[];
        colorMode?: LineChartColorMode;
        color?: LineChartColor;
        monochromeColor?: LineChartColor;
        mutedMonochromeColor?: LineChartColor;
        showBaseLayer?: boolean;
        appearMotion?: boolean;
        appearOnView?: boolean;
        appearanceProgress?: number;
        defaultAppearanceProgress?: number;
        appearanceDuration?: number;
        appearAnchorId?: string;
        appearAnchorPoint?: AnchorPoint;
        appearViewportPoint?: number | "top" | "center" | "bottom";
        scrollAppearance?: boolean | { distance?: number | string };
        scrollAppearanceDistance?: number | string;
        onAppearanceProgressChange?: (progress: number) => void;
        loading?: boolean;
        children?: Snippet;
        class?: string;
        style?: string;
        enableResponsive?: boolean;
        enableContext?: boolean;
        enableScaleObserver?: boolean;
        enableDefaultMotion?: boolean;
        [key: string]: any;
    }

    const DEFAULT_BOUNDS: AxisBounds = {
        top: 0,
        right: 0,
        bottom: CHART_X_AXIS_RESERVED_HEIGHT,
        left: 0,
    };
    const LINE_CHART_SERIES_APPEARANCE_DURATION = 600;
    const LINE_CHART_APPEARANCE_EASE_OUT_POWER = 2;
    const SERIES_APPEARANCE_STAGGER_DELAY = 360;
    const SERIES_CLIP_X_PADDING = 16;
    const SERIES_CLIP_Y_PADDING = 16;
    const LINE_CHART_HOVER_LABEL_MOTION_DURATION = 200;
    const LINE_CHART_HOVER_LABEL_SLIDE_DISTANCE = 2;
    const LINE_CHART_HOVER_LABEL_APPEAR_MOTION: MotionConfig = {
        opacity: [0, 1],
        y: [LINE_CHART_HOVER_LABEL_SLIDE_DISTANCE, 0],
        duration: LINE_CHART_HOVER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const LINE_CHART_HOVER_LABEL_DISAPPEAR_MOTION: MotionConfig = {
        opacity: [1, 0],
        y: [0, LINE_CHART_HOVER_LABEL_SLIDE_DISTANCE],
        duration: LINE_CHART_HOVER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const LINE_CHART_HOVER_LABEL_WIDTH = 80;
    const LINE_CHART_HOVER_LABEL_HEIGHT = 16;
    const paintUid = Math.random().toString(36).slice(2, 9);

    let {
        series = [],
        xLabels = undefined,
        width = 800,
        height = 400,
        yMin = undefined,
        yMax = undefined,
        yTicks = undefined,
        yTickCount = undefined,
        yTickFormatter = undefined,
        showXAxis = undefined,
        showYAxis = undefined,
        showGrid = undefined,
        showGuides = undefined,
        showHoverLabel = undefined,
        alwaysShowHoverLabel = false,
        adaptiveContrast = undefined,
        showHoverPanel = true,
        hoverPanelVariant = "light",
        hoverPanelPlacement = "pointer",
        showHoverPanelLabel = false,
        hoverMode = undefined,
        activeCellIndex = undefined,
        onCellHoverChange = undefined,
        valueFormat = undefined,
        labelFormatter = undefined,
        xAxisMode = undefined,
        xLabelAutoCull = undefined,
        xMaxLabelCount = undefined,
        yLabelAutoCull = undefined,
        yMaxLabelCount = undefined,
        cornerRadius = 8,
        colors = undefined,
        colorMode = "sequence",
        color = undefined,
        monochromeColor = "Primary",
        mutedMonochromeColor = "Black4",
        showBaseLayer = false,
        appearMotion = true,
        appearOnView = true,
        appearanceProgress = undefined,
        defaultAppearanceProgress = 0,
        appearanceDuration = undefined,
        appearAnchorId = undefined,
        appearAnchorPoint = "top",
        appearViewportPoint = 0.7,
        scrollAppearance = false,
        scrollAppearanceDistance = 320,
        onAppearanceProgressChange,
        loading = undefined,
        children,
        class: userClass = "",
        style = "",
        enableResponsive = true,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();

    let rootElement = $state<HTMLElement>();
    let yAxisMeasureGroup = $state<SVGGElement>();
    let xAxisMeasureGroup = $state<SVGGElement>();
    let yAxisLabelWidth = $state(0);
    let measuredWidth = $state(0);
    let measuredHeight = $state(0);
    let measuredXLabelWidths = $state<number[]>([]);
    let internalAppearanceProgress = $state(0);
    let hasSyncedDefaultAppearanceProgress = $state(false);
    let appearanceFrame = $state<number | null>(null);
    let scrollFrame = $state<number | null>(null);
    let hasAutoPlayed = $state(false);
    let wasEffectivelyLoading = $state(false);
    let prefersReducedAppearanceMotion = false;
    let pointerHoverLabelKeys = $state<string[]>([]);
    let focusHoverLabelKeys = $state<string[]>([]);
    let mountedHoverLabelKeys = $state<string[]>([]);
    let internalActiveCellIndex = $state<number | null>(null);
    let lastActiveCellIndex = $state<number | null>(null);
    let hoverPanelPointer = $state({ x: 0, y: 0 });
    const hoverPanelPointerScheduler = createChartPointerFrameScheduler(
        () => rootElement,
        (position) => {
            hoverPanelPointer = position;
        },
    );
    const hoverLabelUnmountTimers = new Map<
        string,
        ReturnType<typeof setTimeout>
    >();
    const numberFormatContext = getNumberFormat();
    const chartGroup = getContext<ChartGroupContext | undefined>(
        CHART_GROUP_CONTEXT_KEY,
    );
    const effectiveAdaptiveContrast = $derived(adaptiveContrast ?? chartGroup?.adaptiveContrast?.() ?? true);
    const contrastMaskId = `chart-contrast-${paintUid}`;
    const contrastSurfaces = $derived(chartGroup?.contrastSurfaces?.() ?? []);

    $effect(() => {
        const root = rootElement;
        if (!root) return;
        return watchCartesianChartSize(root, ({ width, height }) => {
            if (Math.abs(width - measuredWidth) > 0.01) measuredWidth = width;
            if (Math.abs(height - measuredHeight) > 0.01) measuredHeight = height;
        });
    });

    const numericWidth = $derived(
        resolveCartesianChartSize(measuredWidth, width, 800),
    );
    const numericHeight = $derived(
        resolveCartesianChartSize(measuredHeight, height, 400),
    );
    const effectiveXLabels = $derived(xLabels ?? chartGroup?.xLabels() ?? []);
    const effectiveYMin = $derived(yMin ?? chartGroup?.yMin());
    const effectiveYMax = $derived(yMax ?? chartGroup?.yMax());
    const effectiveYTicks = $derived(yTicks ?? chartGroup?.yTicks());
    const effectiveYTickCount = $derived(
        yTickCount ?? chartGroup?.yTickCount() ?? 6,
    );
    const effectiveYTickFormatter = $derived(
        yTickFormatter ?? chartGroup?.yTickFormatter(),
    );
    const effectiveShowXAxis = $derived(
        showXAxis ?? chartGroup?.showXAxis() ?? true,
    );
    const effectiveShowYAxis = $derived(
        showYAxis ?? chartGroup?.showYAxis() ?? false,
    );
    const effectiveShowGrid = $derived(
        showGrid ?? chartGroup?.showGrid() ?? false,
    );
    const effectiveShowGuides = $derived(
        showGuides ?? chartGroup?.showGuides() ?? false,
    );
    const effectiveXAxisMode = $derived(
        xAxisMode ?? chartGroup?.xAxisMode() ?? "edge",
    );
    const effectiveXLabelAutoCull = $derived(
        xLabelAutoCull ?? chartGroup?.xLabelAutoCull() ?? true,
    );
    const effectiveXMaxLabelCount = $derived(
        xMaxLabelCount ?? chartGroup?.xMaxLabelCount(),
    );
    const effectiveYLabelAutoCull = $derived(
        yLabelAutoCull ?? chartGroup?.yLabelAutoCull() ?? true,
    );
    const effectiveYMaxLabelCount = $derived(
        yMaxLabelCount ?? chartGroup?.yMaxLabelCount(),
    );
    const effectiveShowHoverLabel = $derived(
        shouldRenderChartHoverLabel(
            chartGroup?.showHoverLabel?.() ?? showHoverLabel,
            showHoverPanel || Boolean(chartGroup?.showHoverPanel?.()),
        ),
    );
    const topMarkExtent = $derived(resolveLineTopMarkExtent(series));
    const ownPlotTopInset = $derived(
        resolveCartesianChartTopInset({
            showYAxis: effectiveShowYAxis,
            markExtent: topMarkExtent,
        }),
    );
    const effectivePlotTopInset = $derived(
        chartGroup?.plotTopInset() ?? ownPlotTopInset,
    );

    $effect(() =>
        chartGroup?.registerPlotTopInset?.(
            `line-chart-top-${paintUid}`,
            () => ownPlotTopInset,
        ),
    );
    const bounds = $derived(
        resolveBounds(
            effectiveShowXAxis,
            effectiveShowYAxis,
            yAxisLabelWidth,
            effectivePlotTopInset,
        ),
    );
    const plotWidth = $derived(
        Math.max(1, numericWidth - bounds.left - bounds.right),
    );
    const plotHeight = $derived(
        Math.max(1, numericHeight - bounds.top - bounds.bottom),
    );
    const resolvedColors = $derived(colors);
    const rawXCellCount = $derived(
        Math.max(
            effectiveXLabels.length,
            ...series.map((item) => item.data.length),
            1,
        ),
    );
    const rawXLabels = $derived(
        resolveIndexedLabels(effectiveXLabels, rawXCellCount),
    );
    const xLabelWidths = $derived(
        rawXLabels.map(
            (label, index) =>
                measuredXLabelWidths[index] ?? estimateLabelWidth(label) + 4,
        ),
    );
    const visibleXIndexes = $derived(
        resolveVisibleXIndexes(
            rawXLabels,
            plotWidth,
            effectiveXAxisMode,
            effectiveXLabelAutoCull,
            effectiveXMaxLabelCount,
            xLabelWidths,
            4,
        ),
    );
    const xCellCount = $derived(Math.max(rawXCellCount, 1));
    const yDomain = $derived(
        resolveYDomain(
            series,
            effectiveYMin,
            effectiveYMax,
            effectiveYTicks,
            resolveYTickTargetCount(
                effectiveYTickCount,
                effectiveYMaxLabelCount,
            ),
        ),
    );
    const safeYMin = $derived(yDomain.min);
    const safeYMax = $derived(yDomain.max);
    const resolvedYTicks = $derived(
        resolveVisibleYTicks(
            yDomain.ticks,
            plotHeight,
            effectiveYLabelAutoCull,
            effectiveYMaxLabelCount,
        ),
    );
    const yAxisLabels = $derived(
        effectiveShowYAxis
            ? resolvedYTicks.map((tick) =>
                  (effectiveYTickFormatter ?? formatAxisTick)(tick),
              )
            : [],
    );

    $effect(() => {
        const group = xAxisMeasureGroup;
        const labels = rawXLabels;
        if (!effectiveShowXAxis || labels.length === 0) {
            measuredXLabelWidths = [];
            return;
        }
        if (!group) return;

        const updateWidths = () => {
            const nextWidths = measureRenderedAxisLabelWidths(group).map(
                (value) => value + 4,
            );
            if (
                nextWidths.length !== measuredXLabelWidths.length ||
                nextWidths.some(
                    (value, index) =>
                        Math.abs(value - (measuredXLabelWidths[index] ?? 0)) >
                        0.01,
                )
            ) {
                measuredXLabelWidths = nextWidths;
            }
        };
        let active = true;
        const stopWatching = resizeManager.watch(group, updateWidths);
        void tick().then(() => {
            if (active) updateWidths();
        });
        return () => {
            active = false;
            stopWatching();
        };
    });

    $effect(() => {
        const group = yAxisMeasureGroup;
        const labels = yAxisLabels;
        if (!effectiveShowYAxis || labels.length === 0) {
            yAxisLabelWidth = 0;
            return;
        }
        if (!group) return;

        const updateWidth = () => {
            const nextWidth = measureRenderedAxisLabelWidth(group);
            if (Math.abs(nextWidth - yAxisLabelWidth) > 0.01) {
                yAxisLabelWidth = nextWidth;
            }
        };
        let active = true;
        const stopWatching = resizeManager.watch(group, updateWidth);
        void tick().then(() => {
            if (active) updateWidth();
        });
        return () => {
            active = false;
            stopWatching();
        };
    });
    const gridYTicks = $derived(
        effectiveShowXAxis
            ? resolvedYTicks.filter((tick) => Math.abs(tick - safeYMin) > 1e-9)
            : resolvedYTicks,
    );
    const rootStyle = $derived(
        [
            `--snowui-line-chart-width: ${toCssLength(width)}`,
            `--snowui-line-chart-height: ${toCssLength(height)}`,
            style,
        ]
            .filter(Boolean)
            .join("; "),
    );
    const normalizedSeries = $derived(
        normalizeSeries(
            series,
            rawXLabels,
            resolvedColors,
            paintUid,
            numericWidth,
            numericHeight,
            bounds,
            plotWidth,
            plotHeight,
            xCellCount,
            effectiveXAxisMode,
            safeYMin,
            safeYMax,
            cornerRadius,
            colorMode,
            color,
            monochromeColor,
            mutedMonochromeColor,
        ),
    );
    const effectiveHoverMode = $derived(
        hoverMode ?? chartGroup?.hoverMode() ?? "cell",
    );
    const effectiveActiveCellIndex = $derived(
        resolveEffectiveActiveCellIndex(
            activeCellIndex,
            chartGroup,
            internalActiveCellIndex,
        ),
    );
    const effectiveAlwaysShowHoverLabel = $derived(
        alwaysShowHoverLabel || Boolean(chartGroup?.alwaysShowHoverLabel?.()),
    );
    const effectiveHoverPanelPlacement = $derived(
        chartGroup?.showHoverPanel?.()
            ? (chartGroup.hoverPanelPlacement?.() ?? hoverPanelPlacement)
            : hoverPanelPlacement,
    );
    const parentLoadingContext = getSkeleton();
    const effectiveLoading = $derived(
        Boolean(loading) || Boolean(parentLoadingContext?.loading),
    );
    const controlledAppearanceProgress = $derived(
        typeof appearanceProgress === "number",
    );
    const effectiveAppearanceProgress = $derived(
        effectiveLoading
            ? 0
            : appearMotion
            ? clamp(
                  controlledAppearanceProgress
                      ? (appearanceProgress as number)
                      : internalAppearanceProgress,
                  0,
                  1,
              )
            : 1,
    );
    const seriesAppearanceTimelines = $derived(
        resolveSegmentAppearanceTimelines(
            normalizedSeries.length,
            0,
            effectiveAppearanceProgress,
            {
                startDelay: SERIES_APPEARANCE_STAGGER_DELAY,
                durationMode: "fixed",
                fillDuration: LINE_CHART_SERIES_APPEARANCE_DURATION,
                localEasing: "easeOut",
                localEasingPower: LINE_CHART_APPEARANCE_EASE_OUT_POWER,
                opacityMode: "fill",
            },
        ),
    );
    const gradients = $derived(
        [
            ...normalizedSeries.map((item, index) =>
                resolveColorGradient(
                    item.color,
                    index,
                    `snowui-line-chart-${paintUid}`,
                    numericWidth,
                    numericHeight,
                ),
            ),
            ...normalizedSeries.map((item) => item.area?.gradient),
        ].filter((gradient): gradient is NonNullable<typeof gradient> => Boolean(gradient)),
    );
    const hoverPanelRows = $derived(resolveHoverPanelRows());
    const hoverPanelAnchor = $derived(resolveHoverPanelAnchor());
    const hoverPanelData = $derived<ChartHoverPanelData | null>(
        resolveHoverPanelData(),
    );
    const hoverPanelSourceId = `line-chart-${paintUid}`;

    $effect(() => () => {
        if (appearanceFrame !== null) cancelAnimationFrame(appearanceFrame);
        if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    });

    onDestroy(() => {
        hoverLabelUnmountTimers.forEach((timer) => clearTimeout(timer));
        hoverLabelUnmountTimers.clear();
        clearHoverPanelPointerFrame();
    });

    $effect(() => {
        if (hasSyncedDefaultAppearanceProgress) return;
        internalAppearanceProgress = clamp(defaultAppearanceProgress, 0, 1);
        hasSyncedDefaultAppearanceProgress = true;
    });

    function updateAppearanceFromViewport() {
        if (effectiveLoading || scrollFrame !== null) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = null;
            if (effectiveLoading) return;
            if (!appearMotion || prefersReducedAppearanceMotion) {
                setInternalAppearanceProgress(1);
                return;
            }
            if (scrollAppearance) {
                setInternalAppearanceProgress(resolveScrollProgress());
                return;
            }
            if (appearOnView && !hasAutoPlayed && isAnchorTriggered()) {
                hasAutoPlayed = true;
                playAppearance();
            }
        });
    }

    $effect(() => {
        if (effectiveLoading) {
            wasEffectivelyLoading = true;
            hasAutoPlayed = false;
            if (appearanceFrame !== null) {
                cancelAnimationFrame(appearanceFrame);
                appearanceFrame = null;
            }
            if (internalAppearanceProgress !== 0) {
                setInternalAppearanceProgress(0);
            }
            return;
        }
        if (!wasEffectivelyLoading) return;
        wasEffectivelyLoading = false;
        void tick().then(updateAppearanceFromViewport);
    });

    onMount(() => {
        prefersReducedAppearanceMotion = Boolean(
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        );
        updateAppearanceFromViewport();
        const viewportWindows = resolveAppearanceViewportWindows();
        viewportWindows.forEach((viewportWindow) => {
            viewportWindow.addEventListener("scroll", updateAppearanceFromViewport, {
                passive: true,
            });
            viewportWindow.addEventListener("resize", updateAppearanceFromViewport);
        });

        return () => {
            viewportWindows.forEach((viewportWindow) => {
                viewportWindow.removeEventListener("scroll", updateAppearanceFromViewport);
                viewportWindow.removeEventListener("resize", updateAppearanceFromViewport);
            });
        };
    });

    export function replay() {
        if (!appearMotion) return;
        setInternalAppearanceProgress(0);
        hasAutoPlayed = true;
        animateAppearanceTo(1);
    }

    export function resetAppearance() {
        setInternalAppearanceProgress(0);
        hasAutoPlayed = false;
    }

    export function reverseAppearance() {
        if (!appearMotion) return;
        hasAutoPlayed = true;
        if (internalAppearanceProgress < 0.999) {
            setInternalAppearanceProgress(1);
        }
        animateAppearanceTo(0);
    }

    function setInternalAppearanceProgress(value: number) {
        const next = clamp(value, 0, 1);
        internalAppearanceProgress = next;
        onAppearanceProgressChange?.(next);
    }

    function getAppearanceDuration() {
        if (typeof appearanceDuration === "number") return appearanceDuration;
        return resolveAppearanceTimelineDuration(normalizedSeries.length, {
            startDelay: SERIES_APPEARANCE_STAGGER_DELAY,
            durationMode: "fixed",
            fillDuration: LINE_CHART_SERIES_APPEARANCE_DURATION,
            localEasing: "easeOut",
            localEasingPower: LINE_CHART_APPEARANCE_EASE_OUT_POWER,
            opacityMode: "fill",
        });
    }

    function playAppearance() {
        if (controlledAppearanceProgress) return;
        animateAppearanceTo(1);
    }

    function animateAppearanceTo(target: number) {
        if (controlledAppearanceProgress) return;
        if (appearanceFrame !== null) cancelAnimationFrame(appearanceFrame);

        const startValue = internalAppearanceProgress;
        const nextTarget = clamp(target, 0, 1);
        const distance = nextTarget - startValue;
        if (Math.abs(distance) < 0.001) {
            setInternalAppearanceProgress(nextTarget);
            return;
        }

        const duration = getAppearanceDuration();
        const startedAt = performance.now();
        const step = (now: number) => {
            const progress =
                duration <= 0 ? 1 : Math.min(1, (now - startedAt) / duration);
            setInternalAppearanceProgress(startValue + distance * progress);
            if (progress < 1) {
                appearanceFrame = requestAnimationFrame(step);
                return;
            }
            appearanceFrame = null;
            setInternalAppearanceProgress(nextTarget);
        };

        appearanceFrame = requestAnimationFrame(step);
    }

    function getAnchorElement() {
        if (appearAnchorId) return document.getElementById(appearAnchorId);
        return rootElement;
    }

    function getViewportPoint() {
        if (appearViewportPoint === "top") return 0;
        if (appearViewportPoint === "center") return 0.5;
        if (appearViewportPoint === "bottom") return 1;
        return clamp(appearViewportPoint, 0, 1);
    }

    function getAnchorCoordinate(rect: { top: number; bottom: number; height: number }) {
        if (appearAnchorPoint === "center") return rect.top + rect.height / 2;
        if (appearAnchorPoint === "bottom") return rect.bottom;
        return rect.top;
    }

    function isAnchorTriggered() {
        const anchor = getAnchorElement();
        if (!anchor) return false;
        const rect = resolveAppearanceViewportGeometry(anchor);
        if (rect.appearanceReleased) return true;
        const triggerLine = rect.viewportHeight * getViewportPoint();
        return getAnchorCoordinate(rect) <= triggerLine && rect.bottom >= 0;
    }

    function getScrollDistance() {
        const configDistance =
            typeof scrollAppearance === "object"
                ? scrollAppearance.distance
                : undefined;
        return toNumber(configDistance ?? scrollAppearanceDistance, 320);
    }

    function resolveScrollProgress() {
        const anchor = getAnchorElement();
        if (!anchor) return internalAppearanceProgress;
        const rect = resolveAppearanceViewportGeometry(anchor);
        const triggerLine = rect.viewportHeight * getViewportPoint();
        const distance = Math.max(1, getScrollDistance());
        return clamp(
            (triggerLine - getAnchorCoordinate(rect)) / distance,
            0,
            1,
        );
    }

    function resolveBounds(
        showXAxis: boolean,
        showYAxis: boolean,
        measuredYAxisWidth: number,
        plotTopInset: number,
    ): AxisBounds {
        return {
            top: plotTopInset,
            right: DEFAULT_BOUNDS.right,
            bottom: showXAxis ? DEFAULT_BOUNDS.bottom : 0,
            left: showYAxis
                ? measuredYAxisWidth + CHART_Y_AXIS_LABEL_GAP
                : DEFAULT_BOUNDS.left,
        };
    }

    function normalizeSeries(
        input: LineChartSeries[],
        labels: string[],
        palette: (LineChartColor | undefined)[] | undefined,
        uid: string,
        width: number,
        height: number,
        chartBounds: AxisBounds,
        chartPlotWidth: number,
        chartPlotHeight: number,
        cellCount: number,
        xMode: LineChartXAxisMode,
        minValue: number,
        maxValue: number,
        defaultCornerRadius: number | string,
        colorModeValue: LineChartColorMode,
        mainColor: LineChartColor | undefined,
        singleColor: LineChartColor,
        mutedSingleColor: LineChartColor,
    ): NormalizedSeries[] {
        const safeSeries = input;
        const labelCount = Math.max(cellCount, 1);
        const resolvedLabels = resolveIndexedLabels(labels, labelCount);

        return safeSeries.map((item, seriesIndex) => {
            const color = resolveChartColor(item.color, palette, seriesIndex, {
                mode: colorModeValue,
                count: safeSeries.length,
                color: mainColor,
                monochromeColor: singleColor,
                mutedMonochromeColor: mutedSingleColor,
            });
            const gradient = resolveColorGradient(
                color,
                seriesIndex,
                `snowui-line-chart-${uid}`,
                width,
                height,
            );
            const stroke =
                typeof color === "string" ? color : `url(#${gradient?.id})`;
            const points = item.data
                .map((rawPoint, index) =>
                    normalizePoint(
                        rawPoint,
                        resolvedLabels[index] ?? String(index + 1),
                        item.valueFormat,
                    ),
                )
                .filter((point) => Number.isFinite(point.value))
                .map((point, index) => ({
                    ...point,
                    x: scaleX(
                        index,
                        labelCount,
                        chartBounds.left,
                        chartPlotWidth,
                        xMode,
                    ),
                    y: scaleY(
                        point.value,
                        minValue,
                        maxValue,
                        chartBounds.top,
                        chartPlotHeight,
                    ),
                }));
            const seriesCornerRadius = toNumber(
                item.cornerRadius ?? defaultCornerRadius,
                8,
            );
            const path = createSeriesPath(
                points,
                seriesCornerRadius,
                chartBounds.top,
                chartBounds.top + chartPlotHeight,
            );
            const area = resolveArea(
                item.area,
                color,
                seriesIndex,
                uid,
                width,
                height,
                points,
                seriesCornerRadius,
                minValue,
                maxValue,
                chartBounds.top,
                chartPlotHeight,
            );

            return {
                name: item.name,
                color,
                stroke,
                gradientId: gradient?.id,
                area,
                strokeWidth: toNumber(item.strokeWidth ?? 1, 1),
                strokeStyle: item.strokeStyle ?? "solid",
                markers: item.markers ?? false,
                guides: item.guides ?? seriesIndex === 0,
                points,
                path,
            };
        });
    }

    function normalizePoint(
        rawPoint: number | LineChartPoint,
        fallbackLabel: string,
        seriesValueFormat: NumberFormatOptions | undefined,
    ) {
        if (typeof rawPoint === "number") {
            return {
                label: fallbackLabel,
                value: rawPoint,
                valueFormat: seriesValueFormat,
            };
        }
        return {
            label: rawPoint.label ?? fallbackLabel,
            value: rawPoint.value,
            marker: rawPoint.marker,
            valueFormat: mergeNumberFormatOptions(
                seriesValueFormat,
                rawPoint.valueFormat,
            ),
        };
    }

    function scaleX(
        index: number,
        count: number,
        left: number,
        chartPlotWidth: number,
        mode: LineChartXAxisMode,
    ) {
        const safeCount = Math.max(1, count);
        if (safeCount === 1) return left + chartPlotWidth / 2;
        if (mode === "edge") {
            return left + (chartPlotWidth / (safeCount - 1)) * index;
        }
        const cellWidth = chartPlotWidth / safeCount;
        return left + cellWidth * (index + 0.5);
    }

    function resolveXHoverCellWidth(
        count: number,
        chartPlotWidth: number,
        mode: LineChartXAxisMode,
    ) {
        const safeCount = Math.max(1, count);
        if (mode === "edge" && safeCount > 1) {
            return chartPlotWidth / (safeCount - 1);
        }
        return chartPlotWidth / safeCount;
    }

    function resolveXHoverCellCenter(index: number) {
        return scaleX(
            index,
            xCellCount,
            bounds.left,
            plotWidth,
            effectiveXAxisMode,
        );
    }

    function resolveXHoverCellStart(index: number) {
        return (
            resolveXHoverCellCenter(index) -
            resolveXHoverCellWidth(xCellCount, plotWidth, effectiveXAxisMode) /
                2
        );
    }

    function scaleY(
        value: number,
        minValue: number,
        maxValue: number,
        top: number,
        chartPlotHeight: number,
    ) {
        const percent = (value - minValue) / (maxValue - minValue || 1);
        return top + chartPlotHeight - chartPlotHeight * percent;
    }

    function resolveXLabelCellX(
        center: number,
        labelWidth: number,
        count: number,
        left: number,
        chartPlotWidth: number,
        mode: LineChartXAxisMode,
    ) {
        void count;
        void mode;
        return clamp(
            center - labelWidth / 2,
            left,
            left + chartPlotWidth - labelWidth,
        );
    }

    function createLinearPath(points: NormalizedPoint[]) {
        if (points.length === 0) return "";
        return points
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x.toFixed(3)} ${point.y.toFixed(3)}`,
            )
            .join(" ");
    }

    function createSeriesPath(
        points: NormalizedPoint[],
        cornerRadius: number,
        top: number = Number.NEGATIVE_INFINITY,
        bottom: number = Number.POSITIVE_INFINITY,
    ) {
        return clipPointSegmentsToYRange(points, top, bottom)
            .map((segment) => createRoundedPath(segment, cornerRadius))
            .join(" ");
    }

    function createRoundedPath(
        points: NormalizedPoint[],
        cornerRadius: number,
    ) {
        if (points.length < 3 || cornerRadius <= 0)
            return createLinearPath(points);
        let path = `M ${points[0].x.toFixed(3)} ${points[0].y.toFixed(3)}`;

        for (let index = 1; index < points.length - 1; index += 1) {
            const previous = points[index - 1];
            const current = points[index];
            const next = points[index + 1];
            const previousVector = {
                x: previous.x - current.x,
                y: previous.y - current.y,
            };
            const nextVector = {
                x: next.x - current.x,
                y: next.y - current.y,
            };
            const previousLength = Math.hypot(
                previousVector.x,
                previousVector.y,
            );
            const nextLength = Math.hypot(nextVector.x, nextVector.y);
            if (previousLength <= 0 || nextLength <= 0) {
                path += ` L ${current.x.toFixed(3)} ${current.y.toFixed(3)}`;
                continue;
            }

            const radius = Math.min(
                cornerRadius,
                previousLength / 2,
                nextLength / 2,
            );
            const entry = {
                x: current.x + (previousVector.x / previousLength) * radius,
                y: current.y + (previousVector.y / previousLength) * radius,
            };
            const exit = {
                x: current.x + (nextVector.x / nextLength) * radius,
                y: current.y + (nextVector.y / nextLength) * radius,
            };
            path += ` L ${entry.x.toFixed(3)} ${entry.y.toFixed(3)} Q ${current.x.toFixed(3)} ${current.y.toFixed(3)} ${exit.x.toFixed(3)} ${exit.y.toFixed(3)}`;
        }

        const last = points[points.length - 1];
        return `${path} L ${last.x.toFixed(3)} ${last.y.toFixed(3)}`;
    }

    function createAreaPath(
        points: NormalizedPoint[],
        cornerRadius: number,
        baselineY: number,
        top: number,
        bottom: number,
    ) {
        if (points.length === 0) return "";
        return clipPointSegmentsToYRange(points, top, bottom)
            .map((segment) => {
                const linePath = createRoundedPath(segment, cornerRadius);
                const first = segment[0];
                const last = segment[segment.length - 1];
                return `${linePath} L ${last.x.toFixed(3)} ${baselineY.toFixed(3)} L ${first.x.toFixed(3)} ${baselineY.toFixed(3)} Z`;
            })
            .join(" ");
    }

    function clipPointSegmentsToYRange(
        points: NormalizedPoint[],
        top: number,
        bottom: number,
    ) {
        if (points.length === 0) return [];
        if (!Number.isFinite(top) || !Number.isFinite(bottom)) return [points];

        const segments: NormalizedPoint[][] = [];
        let currentSegment: NormalizedPoint[] = [];
        for (let index = 0; index < points.length - 1; index += 1) {
            const clipped = clipLineSegmentToYRange(
                points[index],
                points[index + 1],
                top,
                bottom,
            );
            if (!clipped) {
                if (currentSegment.length > 0) {
                    segments.push(currentSegment);
                    currentSegment = [];
                }
                continue;
            }

            const [start, end] = clipped;
            if (currentSegment.length === 0) {
                currentSegment.push(start);
            } else if (
                !isSamePoint(currentSegment[currentSegment.length - 1], start)
            ) {
                segments.push(currentSegment);
                currentSegment = [start];
            }
            if (!isSamePoint(currentSegment[currentSegment.length - 1], end)) {
                currentSegment.push(end);
            }
        }
        if (currentSegment.length > 0) segments.push(currentSegment);
        return segments.filter((segment) => segment.length > 1);
    }

    function clipLineSegmentToYRange(
        start: NormalizedPoint,
        end: NormalizedPoint,
        top: number,
        bottom: number,
    ): [NormalizedPoint, NormalizedPoint] | undefined {
        const dy = end.y - start.y;
        let tStart = 0;
        let tEnd = 1;

        if (dy === 0) {
            if (start.y < top || start.y > bottom) return undefined;
            return [start, end];
        }

        const topT = (top - start.y) / dy;
        if (dy > 0) tStart = Math.max(tStart, topT);
        else tEnd = Math.min(tEnd, topT);

        const bottomT = (bottom - start.y) / dy;
        if (dy > 0) tEnd = Math.min(tEnd, bottomT);
        else tStart = Math.max(tStart, bottomT);

        if (tStart > tEnd || tEnd < 0 || tStart > 1) return undefined;
        return [
            interpolatePoint(start, end, clamp(tStart, 0, 1)),
            interpolatePoint(start, end, clamp(tEnd, 0, 1)),
        ];
    }

    function interpolatePoint(
        start: NormalizedPoint,
        end: NormalizedPoint,
        t: number,
    ): NormalizedPoint {
        return {
            ...start,
            value: start.value + (end.value - start.value) * t,
            x: start.x + (end.x - start.x) * t,
            y: start.y + (end.y - start.y) * t,
        };
    }

    function isSamePoint(a: NormalizedPoint, b: NormalizedPoint) {
        return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001;
    }

    function resolveArea(
        area: boolean | undefined,
        seriesColor: LineChartColor,
        seriesIndex: number,
        uid: string,
        width: number,
        height: number,
        points: NormalizedPoint[],
        cornerRadius: number,
        minValue: number,
        maxValue: number,
        top: number,
        chartPlotHeight: number,
    ): NormalizedArea | undefined {
        if (!area) return undefined;
        const fillColor = resolveChartColor(
            seriesColor,
            undefined,
            seriesIndex,
        );
        const opacity = 0.04;
        const gradient = resolveAreaGradient(
            fillColor,
            seriesIndex,
            uid,
            width,
            height,
            opacity,
        );
        const fill = gradient
            ? `url(#${gradient.id})`
            : resolveAreaSolidFill(fillColor);
        const baselineY = scaleY(
            minValue,
            minValue,
            maxValue,
            top,
            chartPlotHeight,
        );
        const bottom = top + chartPlotHeight;

        return {
            fill,
            gradientId: gradient?.id,
            gradient,
            opacity: 1,
            path: createAreaPath(points, cornerRadius, baselineY, top, bottom),
        };
    }

    function resolveAreaGradient(
        fillColor: LineChartColor,
        seriesIndex: number,
        uid: string,
        width: number,
        height: number,
        opacity: number,
    ): NormalizedGradient | undefined {
        const explicitGradient = resolveColorGradient(
            fillColor,
            seriesIndex,
            `snowui-line-chart-area-${uid}`,
            width,
            height,
        );
        if (explicitGradient) return explicitGradient;
        if (typeof fillColor !== "string") return undefined;

        return {
            id: `snowui-line-chart-area-${uid}-${seriesIndex}`,
            coordinates: {
                x1: width / 2,
                y1: 0,
                x2: width / 2,
                y2: height,
            },
            stops: [
                {
                    color: fillColor,
                    offset: "0%",
                    opacity,
                },
                {
                    color: fillColor,
                    offset: "100%",
                    opacity: 0,
                },
            ],
        };
    }

    function resolveAreaSolidFill(fillColor: LineChartColor) {
        return typeof fillColor === "string" ? fillColor : "currentColor";
    }

    function resolveYDomain(
        input: LineChartSeries[],
        explicitMin: number | undefined,
        explicitMax: number | undefined,
        explicitTicks: number[] | undefined,
        targetTickCount: number,
    ) {
        if (explicitTicks && explicitTicks.length > 0) {
            const tickValues = explicitTicks.filter(Number.isFinite);
            if (tickValues.length === 0) {
                return resolveYDomain(
                    input,
                    explicitMin,
                    explicitMax,
                    undefined,
                    targetTickCount,
                );
            }
            const min = Number.isFinite(explicitMin)
                ? Number(explicitMin)
                : Math.min(...tickValues);
            const max = Number.isFinite(explicitMax)
                ? Number(explicitMax)
                : Math.max(...tickValues);
            return {
                min,
                max: max > min ? max : min + 1,
                ticks: tickValues.length > 0 ? tickValues : [min, min + 1],
            };
        }

        const values = resolveSeriesValues(input);
        const dataMin = values.length > 0 ? Math.min(...values) : 0;
        const dataMax = values.length > 0 ? Math.max(...values) : 1;
        const minSeed = Number.isFinite(explicitMin)
            ? Number(explicitMin)
            : dataMin >= 0
              ? 0
              : dataMin;
        const maxSeed = Number.isFinite(explicitMax)
            ? Number(explicitMax)
            : dataMax;
        const domainMax = maxSeed > minSeed ? maxSeed : minSeed + 1;
        const ticks = createNiceTicks(minSeed, domainMax, targetTickCount);
        return {
            min: ticks[0] ?? minSeed,
            max: domainMax,
            ticks,
        };
    }

    function resolveSeriesValues(input: LineChartSeries[]) {
        return input
            .flatMap((item) =>
                item.data.map((point) =>
                    typeof point === "number" ? point : point.value,
                ),
            )
            .filter(Number.isFinite);
    }

    function formatValue(
        value: number,
        seriesItem: LineChartSeries,
        point: NormalizedPoint,
        seriesIndex: number,
        pointIndex: number,
    ) {
        const normalizedValue = normalizeTickValue(value);
        if (labelFormatter) {
            return labelFormatter(normalizedValue, {
                series: seriesItem,
                point,
                seriesIndex,
                pointIndex,
            });
        }
        return formatNumberLabel(
            normalizedValue,
            mergeNumberFormatOptions(
                numberFormatContext,
                valueFormat,
                seriesItem.valueFormat,
                point.valueFormat,
            ),
        );
    }

    function hoverLabelKey(seriesIndex: number, pointIndex: number) {
        return `${seriesIndex}:${pointIndex}`;
    }

    function clearHoverLabelUnmount(key: string) {
        const timer = hoverLabelUnmountTimers.get(key);
        if (timer === undefined) return;
        clearTimeout(timer);
        hoverLabelUnmountTimers.delete(key);
    }

    function isHoverLabelVisible(key: string) {
        return isHoverLabelKeyVisible(
            key,
            pointerHoverLabelKeys,
            focusHoverLabelKeys,
            effectiveAlwaysShowHoverLabel,
        );
    }

    function isPointCellActive(pointIndex: number) {
        return (
            effectiveHoverMode === "cell" &&
            effectiveActiveCellIndex === pointIndex
        );
    }

    function isPointHoverLabelVisible(key: string, pointIndex: number) {
        return isHoverLabelVisible(key) || isPointCellActive(pointIndex);
    }

    function isPointInteractionActive(key: string, pointIndex: number) {
        return (
            pointerHoverLabelKeys.includes(key) ||
            focusHoverLabelKeys.includes(key) ||
            isPointCellActive(pointIndex)
        );
    }

    function shouldRenderHoverLabel(key: string) {
        return shouldRenderHoverLabelKey(
            key,
            mountedHoverLabelKeys,
            effectiveAlwaysShowHoverLabel,
        );
    }

    function shouldRenderPointHoverLabel(key: string, pointIndex: number) {
        return shouldRenderHoverLabel(key) || isPointCellActive(pointIndex);
    }

    function resolveHoverLabelBoxX(point: NormalizedPoint) {
        return point.x - LINE_CHART_HOVER_LABEL_WIDTH / 2;
    }

    function resolveHoverLabelBoxY(point: NormalizedPoint, markerRadius: number) {
        return (
            point.y -
            markerRadius -
            4 -
            LINE_CHART_HOVER_LABEL_HEIGHT
        );
    }

    function showHoverLabelKey(key: string, source: "pointer" | "focus") {
        clearHoverLabelUnmount(key);
        const next = showHoverLabelKeyState(
            key,
            source,
            pointerHoverLabelKeys,
            focusHoverLabelKeys,
            mountedHoverLabelKeys,
        );
        pointerHoverLabelKeys = next.pointerKeys;
        focusHoverLabelKeys = next.focusKeys;
        mountedHoverLabelKeys = next.mountedKeys;
    }

    function showPointHoverLabel(
        key: string,
        pointIndex: number,
        source: "pointer" | "focus",
    ) {
        showHoverLabelKey(key, source);
        internalActiveCellIndex = showChartCellHover(
            pointIndex,
            chartGroup,
            onCellHoverChange,
        );
    }

    function hideHoverLabelKey(key: string, source: "pointer" | "focus") {
        const next = hideHoverLabelKeyState(
            key,
            source,
            pointerHoverLabelKeys,
            focusHoverLabelKeys,
        );
        pointerHoverLabelKeys = next.pointerKeys;
        focusHoverLabelKeys = next.focusKeys;

        clearHoverLabelUnmount(key);
        hoverLabelUnmountTimers.set(
            key,
            setTimeout(() => {
                if (!isHoverLabelVisible(key)) {
                    mountedHoverLabelKeys = removeHoverLabelKey(
                        mountedHoverLabelKeys,
                        key,
                    );
                }
                hoverLabelUnmountTimers.delete(key);
            }, LINE_CHART_HOVER_LABEL_MOTION_DURATION),
        );
    }

    function hidePointHoverLabel(
        key: string,
        pointIndex: number,
        source: "pointer" | "focus",
    ) {
        if (source === "pointer") clearHoverPanelPointerFrame();
        hideHoverLabelKey(key, source);
        const next = hideChartCellHover(
            pointIndex,
            effectiveActiveCellIndex,
            chartGroup,
            onCellHoverChange,
        );
        if (next !== undefined) internalActiveCellIndex = next;
    }

    function showCellHover(index: number) {
        if (effectiveActiveCellIndex === index) return;
        internalActiveCellIndex = showChartCellHover(
            index,
            chartGroup,
            onCellHoverChange,
        );
    }

    function hideCellHover(index: number) {
        clearHoverPanelPointerFrame();
        const next = hideChartCellHover(
            index,
            effectiveActiveCellIndex,
            chartGroup,
            onCellHoverChange,
        );
        if (next !== undefined) internalActiveCellIndex = next;
    }

    function keepActiveCellHoverLabelsMounted() {
        if (effectiveHoverMode !== "cell") return;

        const activeIndex = effectiveActiveCellIndex;
        if (typeof activeIndex === "number") {
            normalizedSeries.forEach((item, seriesIndex) => {
                if (!item.points[activeIndex]) return;
                const key = hoverLabelKey(seriesIndex, activeIndex);
                clearHoverLabelUnmount(key);
                mountedHoverLabelKeys = addHoverLabelKey(
                    mountedHoverLabelKeys,
                    key,
                );
            });
        }

        if (
            typeof lastActiveCellIndex === "number" &&
            lastActiveCellIndex !== activeIndex
        ) {
            normalizedSeries.forEach((item, seriesIndex) => {
                if (!item.points[lastActiveCellIndex!]) return;
                const key = hoverLabelKey(seriesIndex, lastActiveCellIndex!);
                if (
                    isHoverLabelVisible(key) ||
                    isPointCellActive(lastActiveCellIndex!)
                ) {
                    return;
                }
                clearHoverLabelUnmount(key);
                hoverLabelUnmountTimers.set(
                    key,
                    setTimeout(() => {
                        if (!isHoverLabelVisible(key)) {
                            mountedHoverLabelKeys = removeHoverLabelKey(
                                mountedHoverLabelKeys,
                                key,
                            );
                        }
                        hoverLabelUnmountTimers.delete(key);
                    }, LINE_CHART_HOVER_LABEL_MOTION_DURATION),
                );
            });
        }

        lastActiveCellIndex =
            typeof activeIndex === "number" ? activeIndex : null;
    }

    $effect(() => {
        keepActiveCellHoverLabelsMounted();
    });

    function resolveDashArray(style: LineChartStrokeStyle) {
        if (style === "dashed") return "2 4";
        return undefined;
    }

    function resolveSeriesClipId(index: number) {
        return `snowui-line-chart-reveal-${paintUid}-${index}`;
    }

    function resolveSeriesRevealWidth(index: number) {
        return (
            plotWidth * (seriesAppearanceTimelines[index]?.fillProgress ?? 1)
        );
    }

    function resolveSeriesOpacity(index: number) {
        return seriesAppearanceTimelines[index]?.opacityProgress ?? 1;
    }

    function isPointRevealed(point: NormalizedPoint, seriesIndex: number) {
        const revealRight =
            bounds.left +
            resolveSeriesRevealWidth(seriesIndex) +
            SERIES_CLIP_X_PADDING;
        return point.x <= revealRight + 0.001;
    }

    function isPointInYDomain(point: NormalizedPoint) {
        return point.value >= safeYMin && point.value <= safeYMax;
    }

    function resolveMarkerConfig(
        seriesItem: NormalizedSeries,
        point: NormalizedPoint,
        options: { ignoreVisibility?: boolean } = {},
    ) {
        const pointConfig = point.marker;
        const size = resolveMarkerSize(
            seriesItem.markers,
            pointConfig,
            options.ignoreVisibility,
        );
        if (size === 0) return undefined;
        const seriesConfig =
            seriesItem.markers && seriesItem.markers !== true
                ? seriesItem.markers
                : {};
        const markerColor = resolveMarkerPaint(
            seriesConfig.color === "line"
                ? seriesItem.color
                : (seriesConfig.color ?? "var(--black-100)"),
            "var(--black-100)",
        );

        return {
            lowerRadius: size * 0.5,
            upperRadius: size * 0.25,
            lowerFill: markerColor,
            upperFill: "var(--white-100)",
            hitRadius: Math.max(size * 0.5 + 6, 12),
        };
    }

    function resolveMarkerSize(
        seriesConfig: boolean | LineChartMarkerConfig,
        pointConfig: boolean | LineChartPointMarkerConfig | undefined,
        ignoreVisibility = false,
    ) {
        if (!ignoreVisibility && pointConfig === false) return 0;
        const baseConfig = pointConfig ?? seriesConfig;
        if (!ignoreVisibility && !baseConfig) return 0;
        const seriesSize =
            typeof seriesConfig === "object" ? seriesConfig.size : undefined;
        const pointSize =
            typeof pointConfig === "object" ? pointConfig.size : undefined;
        return Math.max(1, toNumber(pointSize ?? seriesSize ?? 8, 8));
    }

    function resolveLineTopMarkExtent(input: LineChartSeries[]) {
        let extent = 0;
        for (const seriesItem of input) {
            extent = Math.max(
                extent,
                Math.max(0, toNumber(seriesItem.strokeWidth ?? 1, 1)) / 2,
            );
            for (const rawPoint of seriesItem.data) {
                const pointConfig =
                    typeof rawPoint === "number" ? undefined : rawPoint.marker;
                const markerSize = resolveMarkerSize(
                    seriesItem.markers ?? false,
                    pointConfig,
                    true,
                );
                extent = Math.max(extent, markerSize / 2);
            }
        }
        return extent;
    }

    function resolveHoverMarkerConfig(
        seriesItem: NormalizedSeries,
        point: NormalizedPoint,
    ) {
        return resolveMarkerConfig(seriesItem, point, {
            ignoreVisibility: true,
        });
    }

    function resolveMarkerPaint(color: LineChartColor, fallback: string) {
        const resolved = resolveChartColor(color, undefined, 0);
        return typeof resolved === "string" ? resolved : fallback;
    }

    function resolveHoverPanelColor(item: NormalizedSeries) {
        if (typeof item.stroke === "string" && !item.stroke.startsWith("url(")) {
            return item.stroke;
        }
        if (typeof item.color === "string") return item.color;
        return "var(--black-40, #00000066)";
    }

    function resolveHoverPanelRowsForIndex(index: number): ChartHoverPanelRow[] {
        return normalizedSeries
            .map((item, seriesIndex) => {
                const point = item.points[index];
                const sourceSeries = series[seriesIndex];
                if (!point || !sourceSeries) return undefined;
                return {
                    name: item.name,
                    value: formatValue(
                        point.value,
                        sourceSeries,
                        point,
                        seriesIndex,
                        index,
                    ),
                    color: resolveHoverPanelColor(item),
                };
            })
            .filter(Boolean) as ChartHoverPanelRow[];
    }

    function resolveHoverPanelRows(): ChartHoverPanelRow[] {
        if (typeof effectiveActiveCellIndex !== "number") return [];
        return resolveHoverPanelRowsForIndex(effectiveActiveCellIndex);
    }

    function describeHoverPanelCell(index: number, label: string) {
        const rows = resolveHoverPanelRowsForIndex(index);
        return describeChartHoverPanelData(label, rows) || label;
    }

    function describeHoverPanelPoint(
        item: NormalizedSeries,
        point: NormalizedPoint,
        seriesIndex: number,
        pointIndex: number,
    ) {
        const sourceSeries = series[seriesIndex];
        const value = sourceSeries
            ? formatValue(point.value, sourceSeries, point, seriesIndex, pointIndex)
            : `${point.value}`;
        return describeChartHoverPanelData(point.label, [
            {
                name: item.name,
                value,
                color: resolveHoverPanelColor(item),
            },
        ]);
    }

    function resolveHoverPanelSvgOffset() {
        const svgElement = rootElement?.querySelector(".snowui-line-chart-svg");
        if (!rootElement || !svgElement) return { x: 0, y: 0 };
        const rootRect = rootElement.getBoundingClientRect();
        const svgRect = svgElement.getBoundingClientRect();
        return {
            x: svgRect.left - rootRect.left,
            y: svgRect.top - rootRect.top,
        };
    }

    function offsetHoverPanelBounds(
        source: { left: number; top: number; width: number; height: number },
        offset: { x: number; y: number },
    ) {
        return {
            left: source.left + offset.x,
            top: source.top + offset.y,
            width: source.width,
            height: source.height,
        };
    }

    function resolveHoverPanelData(): ChartHoverPanelData | null {
        if (hoverPanelRows.length === 0 || !hoverPanelAnchor) return null;
        const svgOffset = resolveHoverPanelSvgOffset();
        const anchorOffset =
            effectiveHoverPanelPlacement === "pointer"
                ? { x: 0, y: 0 }
                : svgOffset;
        const anchorBounds =
            "anchorBounds" in hoverPanelAnchor && hoverPanelAnchor.anchorBounds
                ? offsetHoverPanelBounds(
                      hoverPanelAnchor.anchorBounds as {
                          left: number;
                          top: number;
                          width: number;
                          height: number;
                      },
                      svgOffset,
                  )
                : undefined;
        return {
            label:
                typeof effectiveActiveCellIndex === "number"
                    ? rawXLabels[effectiveActiveCellIndex]
                    : undefined,
            rows: hoverPanelRows,
            x: hoverPanelAnchor.x + anchorOffset.x,
            y: hoverPanelAnchor.y + anchorOffset.y,
            anchorBounds,
            anchorYAlign: "center",
            bounds: offsetHoverPanelBounds(
                {
                    left: bounds.left,
                    top: bounds.top,
                    width: plotWidth,
                    height: plotHeight,
                },
                svgOffset,
            ),
            placement: effectiveHoverPanelPlacement,
            showLabel: showHoverPanelLabel,
        };
    }

    function resolveHoverPanelAnchor() {
        if (effectiveHoverPanelPlacement === "pointer") return hoverPanelPointer;
        if (effectiveHoverPanelPlacement.startsWith("pin-")) {
            return { x: bounds.left, y: bounds.top };
        }
        if (typeof effectiveActiveCellIndex !== "number") return undefined;
        if (effectiveHoverPanelPlacement === "anchor-side") {
            return resolveHoverPanelMarkerSideAnchor(effectiveActiveCellIndex);
        }
        return resolveHoverPanelMarkerAnchor(effectiveActiveCellIndex);
    }

    function resolveHoverPanelMarkerAnchor(pointIndex: number) {
        return normalizedSeries
            .map((item) => {
                const point = item.points[pointIndex];
                if (!point || !isPointInYDomain(point)) return undefined;
                const marker = resolveHoverMarkerConfig(item, point);
                if (!marker) return undefined;
                return {
                    x: point.x,
                    y: point.y - marker.lowerRadius,
                };
            })
            .filter((item): item is { x: number; y: number } => Boolean(item))
            .reduce<{ x: number; y: number } | undefined>(
                (highest, item) =>
                    !highest || item.y < highest.y ? item : highest,
                undefined,
            );
    }

    function resolveHoverPanelMarkerSideAnchor(pointIndex: number) {
        return normalizedSeries
            .map((item) => {
                const point = item.points[pointIndex];
                if (!point || !isPointInYDomain(point)) return undefined;
                const marker = resolveHoverMarkerConfig(item, point);
                if (!marker) return undefined;
                const sideRadius = marker.lowerRadius;
                const size = sideRadius * 2;
                const anchorBounds = {
                    left: point.x - sideRadius,
                    top: point.y - sideRadius,
                    width: size,
                    height: size,
                };
                return {
                    x: anchorBounds.left,
                    y: point.y,
                    anchorBounds,
                };
            })
            .filter(
                (
                    item,
                ): item is {
                    x: number;
                    y: number;
                    anchorBounds: {
                        left: number;
                        top: number;
                        width: number;
                        height: number;
                    };
                } => Boolean(item),
            )
            .reduce<
                | {
                      x: number;
                      y: number;
                      anchorBounds: {
                          left: number;
                          top: number;
                          width: number;
                          height: number;
                      };
                  }
                | undefined
            >(
                (highest, item) =>
                    !highest || item.anchorBounds.top < highest.anchorBounds.top
                        ? item
                        : highest,
                undefined,
            );
    }

    function updateHoverPanelPointer(event: PointerEvent | MouseEvent) {
        hoverPanelPointerScheduler.schedule(event);
    }

    function clearHoverPanelPointerFrame() {
        hoverPanelPointerScheduler.clear();
    }

    $effect(() => {
        chartGroup?.setHoverPanelData?.(hoverPanelSourceId, hoverPanelData);
    });
</script>

<Frame
    bind:element={rootElement}
    class={["snowui-line-chart", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    role="group"
    aria-label="折线图"
    {...rest}
    {loading}
    skeleton={false}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
>
    {@render children?.()}

    <svg
        class="snowui-line-chart-svg"
        viewBox={`0 0 ${numericWidth} ${numericHeight}`}
        width={numericWidth}
        height={numericHeight}
    >
        {#if effectiveShowXAxis}
            <g
                bind:this={xAxisMeasureGroup}
                class="snowui-line-chart-axis-labels"
                visibility="hidden"
                pointer-events="none"
                aria-hidden="true"
            >
                {#each rawXLabels as label}
                    <text data-snowui-axis-measure-label>{label}</text>
                {/each}
            </g>
        {/if}

        {#if effectiveShowYAxis}
            <g
                bind:this={yAxisMeasureGroup}
                class="snowui-line-chart-axis-labels"
                visibility="hidden"
                pointer-events="none"
                aria-hidden="true"
            >
                {#each yAxisLabels as label}
                    <text data-snowui-axis-measure-label>{label}</text>
                {/each}
            </g>
        {/if}

        {#if effectiveAdaptiveContrast}
            <AdaptiveContrastMask id={contrastMaskId} width={numericWidth} height={numericHeight} surfaces={contrastSurfaces} />
        {/if}
        <defs>
            {#each gradients as gradient}
                <linearGradient
                    id={gradient.id}
                    gradientUnits="userSpaceOnUse"
                    x1={gradient.coordinates.x1}
                    y1={gradient.coordinates.y1}
                    x2={gradient.coordinates.x2}
                    y2={gradient.coordinates.y2}
                >
                    {#each gradient.stops as stop}
                        <stop
                            offset={stop.offset}
                            stop-color={stop.color}
                            stop-opacity={stop.opacity ?? 1}
                        />
                    {/each}
                </linearGradient>
            {/each}
            {#each normalizedSeries as _item, index}
                <clipPath id={resolveSeriesClipId(index)}>
                    <rect
                        x={bounds.left - SERIES_CLIP_X_PADDING}
                        y={bounds.top - SERIES_CLIP_Y_PADDING}
                        width={resolveSeriesRevealWidth(index) +
                            SERIES_CLIP_X_PADDING * 2}
                        height={plotHeight + SERIES_CLIP_Y_PADDING * 2}
                    />
                </clipPath>
            {/each}
        </defs>

        {#if effectiveShowGrid}
            <g class="snowui-line-chart-grid">
                {#each gridYTicks as tick}
                    {@const y = scaleY(
                        tick,
                        safeYMin,
                        safeYMax,
                        bounds.top,
                        plotHeight,
                    )}
                    <line
                        x1={bounds.left}
                        y1={y}
                        x2={numericWidth - bounds.right}
                        y2={y}
                    />
                {/each}
            </g>
        {/if}

        {#if effectiveShowXAxis}
            <line
                class="snowui-line-chart-axis-line"
                x1={bounds.left}
                y1={bounds.top + plotHeight}
                x2={numericWidth - bounds.right}
                y2={bounds.top + plotHeight}
            />
        {/if}

        {#if showBaseLayer}
            <g class="snowui-line-chart-base-layer" aria-hidden="true">
                {#each normalizedSeries as item, seriesIndex}
                    {#if item.area}
                        <path
                            class="snowui-line-chart-area-base"
                            d={item.area.path}
                            fill={item.area.gradientId
                                ? `url(#${item.area.gradientId})`
                                : item.area.fill}
                            fill-opacity="0.04"
                            clip-path={`url(#${resolveSeriesClipId(seriesIndex)})`}
                            pointer-events="none"
                        />
                    {/if}
                    <path
                        class="snowui-line-chart-series-base"
                        d={item.path}
                        fill="none"
                        stroke={item.gradientId
                            ? `url(#${item.gradientId})`
                            : item.stroke}
                        stroke-width={item.strokeWidth}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-dasharray={resolveDashArray(item.strokeStyle)}
                        stroke-opacity="0.04"
                        clip-path={`url(#${resolveSeriesClipId(seriesIndex)})`}
                        pointer-events="none"
                    />
                {/each}
            </g>
        {/if}

        <g class="snowui-line-chart-area-layer">
            {#each normalizedSeries as item, seriesIndex}
                {#if item.area}
                    <path
                        class="snowui-line-chart-area"
                        d={item.area.path}
                        fill={item.area.gradientId
                            ? `url(#${item.area.gradientId})`
                            : item.area.fill}
                        fill-opacity={item.area.opacity *
                            resolveSeriesOpacity(seriesIndex)}
                        clip-path={`url(#${resolveSeriesClipId(seriesIndex)})`}
                    />
                {/if}
            {/each}
        </g>

        {#if effectiveShowGuides}
            <g class="snowui-line-chart-guides">
                {#each normalizedSeries as item, seriesIndex}
                    {#if item.guides}
                        {#each item.points as point}
                            {#if isPointRevealed(point, seriesIndex) && isPointInYDomain(point)}
                                <line
                                    x1={point.x}
                                    y1={point.y}
                                    x2={point.x}
                                    y2={bounds.top + plotHeight}
                                    opacity={resolveSeriesOpacity(seriesIndex)}
                                />
                            {/if}
                        {/each}
                    {/if}
                {/each}
            </g>
        {/if}

        <g class="snowui-line-chart-series-layer">
            {#each normalizedSeries as item, seriesIndex}
                <path
                    class="snowui-line-chart-series"
                    d={item.path}
                    fill="none"
                    stroke={effectiveAdaptiveContrast && !item.gradientId && isAdaptiveContrastMonochrome(item.stroke) ? getAdaptiveContrastColor() : item.gradientId
                        ? `url(#${item.gradientId})`
                        : item.stroke}
                    stroke-width={item.strokeWidth}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-dasharray={resolveDashArray(item.strokeStyle)}
                    stroke-opacity={resolveSeriesOpacity(seriesIndex)}
                    clip-path={`url(#${resolveSeriesClipId(seriesIndex)})`}
                />
                {#if effectiveAdaptiveContrast && !item.gradientId && isAdaptiveContrastMonochrome(item.stroke)}
                    <path
                        class="snowui-line-chart-series-contrast"
                        mask={`url(#${contrastMaskId})`}
                        d={item.path}
                        fill="none"
                        stroke={getAdaptiveContrastColor(true)}
                        stroke-width={item.strokeWidth}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-dasharray={resolveDashArray(item.strokeStyle)}
                        stroke-opacity={resolveSeriesOpacity(seriesIndex)}
                        clip-path={`url(#${resolveSeriesClipId(seriesIndex)})`}
                    />
                {/if}
            {/each}
        </g>

        {#if effectiveHoverMode === "cell"}
            <g
                class="snowui-line-chart-cell-hit-layer"
                role="group"
                aria-label="折线图数据单元格"
                onpointerleave={() => hideCellHover(effectiveActiveCellIndex ?? -1)}
            >
                {#each rawXLabels as label, index}
                    {@const hoverCellWidth = resolveXHoverCellWidth(
                        xCellCount,
                        plotWidth,
                        effectiveXAxisMode,
                    )}
                    <rect
                        class="snowui-line-chart-cell-hit-area"
                        data-active={effectiveActiveCellIndex === index
                            ? "true"
                            : undefined}
                        x={resolveXHoverCellStart(index)}
                        y={bounds.top}
                        width={hoverCellWidth}
                        height={plotHeight}
                        fill="transparent"
                        tabindex="0"
                        role="button"
                        aria-label={showHoverPanel || Boolean(chartGroup?.showHoverPanel?.())
                            ? describeHoverPanelCell(index, label)
                            : label}
                        onpointerenter={() => showCellHover(index)}
                        onpointermove={(event) => {
                            showCellHover(index);
                            updateHoverPanelPointer(event);
                        }}
                        onfocus={() => showCellHover(index)}
                        onblur={() => hideCellHover(index)}
                    />
                {/each}
            </g>
        {/if}

        <g class="snowui-line-chart-marker-layer">
            {#each normalizedSeries as item, seriesIndex}
                {#each item.points as point, pointIndex}
                    {@const marker = resolveMarkerConfig(item, point)}
                    {@const hoverMarker = resolveHoverMarkerConfig(item, point)}
                    {@const labelKey = hoverLabelKey(seriesIndex, pointIndex)}
                    {#if hoverMarker && isPointRevealed(point, seriesIndex) && isPointInYDomain(point)}
                        <g
                            class="snowui-line-chart-marker"
                            data-active={isPointCellActive(pointIndex)
                                ? "true"
                                : undefined}
                            tabindex="0"
                            role="button"
                            aria-label={showHoverPanel ||
                            Boolean(chartGroup?.showHoverPanel?.())
                                ? describeHoverPanelPoint(
                                      item,
                                      point,
                                      seriesIndex,
                                      pointIndex,
                                  )
                                : `${item.name} ${point.label}: ${formatValue(point.value, series[seriesIndex], point, seriesIndex, pointIndex)}`}
                            data-series-index={seriesIndex}
                            data-point-index={pointIndex}
                            onfocus={() =>
                                showPointHoverLabel(
                                    labelKey,
                                    pointIndex,
                                    "focus",
                                )}
                            onblur={() =>
                                hidePointHoverLabel(
                                    labelKey,
                                    pointIndex,
                                    "focus",
                                )}
                        >
                            <circle
                                class="snowui-line-chart-marker-hit-area"
                                cx={point.x}
                                cy={point.y}
                                r={hoverMarker.hitRadius}
                                role="presentation"
                                onpointerenter={() =>
                                    showPointHoverLabel(
                                        labelKey,
                                        pointIndex,
                                        "pointer",
                                    )}
                                onpointermove={updateHoverPanelPointer}
                                onpointerleave={() =>
                                    hidePointHoverLabel(
                                        labelKey,
                                        pointIndex,
                                        "pointer",
                                    )}
                            />
                            <line
                                class="snowui-line-chart-marker-hover-line"
                                x1={point.x}
                                y1={bounds.top}
                                x2={point.x}
                                y2={bounds.top + plotHeight}
                            />
                            {#if marker || isPointInteractionActive(labelKey, pointIndex)}
                                {@const visualMarker = marker ?? hoverMarker}
                                {@const contrastMarker = effectiveAdaptiveContrast && isAdaptiveContrastMonochrome(visualMarker.lowerFill) && isAdaptiveContrastMonochrome(visualMarker.upperFill)}
                                {#snippet contrastDot(inverse: boolean)}
                                    <g class="snowui-line-chart-marker-visual" mask={inverse ? `url(#${contrastMaskId})` : undefined}>
                                        <circle
                                            class="snowui-line-chart-marker-lower"
                                            cx={point.x}
                                            cy={point.y}
                                            r={visualMarker.lowerRadius}
                                            fill={visualMarker.lowerFill}
                                            style={contrastMarker ? `fill: ${getAdaptiveContrastColor(isPointInteractionActive(labelKey, pointIndex) !== inverse)}` : undefined}
                                        />
                                        <circle
                                            class="snowui-line-chart-marker-upper"
                                            cx={point.x}
                                            cy={point.y}
                                            r={visualMarker.upperRadius}
                                            fill={visualMarker.upperFill}
                                            style={contrastMarker ? `fill: ${getAdaptiveContrastColor(isPointInteractionActive(labelKey, pointIndex) === inverse)}` : undefined}
                                        />
                                    </g>
                                {/snippet}
                                {@render contrastDot(false)}
                                {#if contrastMarker}{@render contrastDot(true)}{/if}
                            {/if}
                            {#if effectiveShowHoverLabel && shouldRenderPointHoverLabel(labelKey, pointIndex)}
                                {#snippet contrastLabel(inverse: boolean)}
                                    <foreignObject
                                        mask={inverse ? `url(#${contrastMaskId})` : undefined}
                                        aria-hidden={inverse ? "true" : undefined}
                                        x={resolveHoverLabelBoxX(point)}
                                        y={resolveHoverLabelBoxY(
                                            point,
                                            hoverMarker.lowerRadius,
                                        )}
                                        width={LINE_CHART_HOVER_LABEL_WIDTH}
                                        height={LINE_CHART_HOVER_LABEL_HEIGHT}
                                        pointer-events="none"
                                        overflow="visible"
                                    >
                                        <Frame
                                            class="snowui-line-chart-hover-label"
                                            style={effectiveAdaptiveContrast ? `color: ${getAdaptiveContrastColor(inverse)};` : undefined}
                                            currentState={isPointHoverLabelVisible(
                                                labelKey,
                                                pointIndex,
                                            )
                                                ? "Appear"
                                                : "Disappear"}
                                            whileAppear={LINE_CHART_HOVER_LABEL_APPEAR_MOTION}
                                            whileDisappear={LINE_CHART_HOVER_LABEL_DISAPPEAR_MOTION}
                                            enableResponsive={false}
                                            enableContext={false}
                                            enableScaleObserver={false}
                                            enableDefaultMotion={false}
                                            loading={false}
                                            skeleton={false}
                                            pointer-events="none"
                                            aria-hidden="true"
                                        >
                                            {formatValue(
                                                point.value,
                                                series[seriesIndex],
                                                point,
                                                seriesIndex,
                                                pointIndex,
                                            )}
                                        </Frame>
                                    </foreignObject>
                                {/snippet}
                                {@render contrastLabel(false)}
                                {#if effectiveAdaptiveContrast}
                                    {@render contrastLabel(true)}
                                {/if}
                            {/if}
                        </g>
                    {/if}
                {/each}
            {/each}
        </g>

        <g class="snowui-line-chart-axis-labels">
            {#if effectiveShowYAxis}
                {#each resolvedYTicks as tick, index}
                    {@const y = scaleY(
                        tick,
                        safeYMin,
                        safeYMax,
                        bounds.top,
                        plotHeight,
                    )}
                    <text
                        class="snowui-line-chart-y-label"
                        x={bounds.left - CHART_Y_AXIS_LABEL_GAP}
                        {y}
                        text-anchor="end"
                        dominant-baseline="middle"
                    >
                        {yAxisLabels[index]}
                    </text>
                {/each}
            {/if}

            {#if effectiveShowXAxis}
                {#each visibleXIndexes as originalIndex}
                    {@const label = rawXLabels[originalIndex] ?? String(originalIndex + 1)}
                    {@const cellCenter = scaleX(
                        originalIndex,
                        xCellCount,
                        bounds.left,
                        plotWidth,
                        effectiveXAxisMode,
                    )}
                    {@const cellX = resolveXLabelCellX(
                        cellCenter,
                        Math.min(
                            plotWidth,
                            Math.max(1, xLabelWidths[originalIndex] ?? 0),
                        ),
                        xCellCount,
                        bounds.left,
                        plotWidth,
                        effectiveXAxisMode,
                    )}
                    {@const labelWidth = Math.min(
                        plotWidth,
                        Math.max(1, xLabelWidths[originalIndex] ?? 0),
                    )}
                    <foreignObject
                        class="snowui-line-chart-x-label-cell"
                        x={cellX}
                        y={bounds.top +
                            plotHeight +
                            CHART_X_AXIS_LABEL_GAP}
                        width={labelWidth}
                        height={CHART_AXIS_LABEL_HEIGHT}
                    >
                        <div class="snowui-line-chart-x-label-content">
                            {label}
                        </div>
                    </foreignObject>
                {/each}
            {/if}
        </g>
    </svg>

    <ChartHoverPanel
        visible={showHoverPanel &&
            !chartGroup?.showHoverPanel?.() &&
            Boolean(hoverPanelData)}
        rows={hoverPanelData?.rows ?? []}
        label={hoverPanelData?.label ?? ""}
        showLabel={hoverPanelData?.showLabel ?? false}
        x={hoverPanelData?.x ?? 0}
        y={hoverPanelData?.y ?? 0}
        anchorBounds={hoverPanelData?.anchorBounds}
        bounds={hoverPanelData?.bounds}
        placement={hoverPanelData?.placement ?? hoverPanelPlacement}
        variant={hoverPanelVariant}
        animated={hoverPanelPlacement === "anchor-top" ||
            hoverPanelPlacement === "pointer"}
    />
</Frame>

<style>
    :global(:where(.snowui-line-chart)) {
        --snowui-line-chart-axis-font-size: 12px;
        --snowui-line-chart-axis-line-height: 16px;
        --snowui-line-chart-axis-color: var(--black-40);
        --snowui-line-chart-grid-color: var(--black-10);
        --snowui-line-chart-guide-color: var(--black-10);
        --snowui-line-chart-axis-line-color: var(--black-40);
        --snowui-line-chart-hover-label-color: var(
            --snowui-line-chart-hover-label-color-override,
            var(--black-100, #000000)
        );
        --snowui-line-chart-stroke-width: 1;
        --snowui-line-chart-marker-size: 8;

        position: relative;
        display: block;
        flex: none;
        width: var(
            --snowui-line-chart-width-override,
            var(--snowui-line-chart-width)
        );
        height: var(
            --snowui-line-chart-height-override,
            var(--snowui-line-chart-height)
        );
        color: var(
            --snowui-line-chart-axis-color-override,
            var(--snowui-line-chart-axis-color)
        );
    }

    :global(:where(.snowui-line-chart-svg)) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    :global(:where(.snowui-line-chart-grid line)) {
        stroke: var(
            --snowui-line-chart-grid-color-override,
            var(--snowui-line-chart-grid-color)
        );
        stroke-width: 0.5;
    }

    :global(:where(.snowui-line-chart-guides line)) {
        stroke: var(--snowui-line-chart-guide-color);
        stroke-width: 0.5;
    }

    :global(:where(.snowui-line-chart-axis-line)) {
        stroke: var(
            --snowui-line-chart-axis-line-color-override,
            var(--snowui-line-chart-axis-line-color)
        );
        stroke-width: 0.5;
    }

    :global(:where(.snowui-line-chart-series)),
    :global(:where(.snowui-line-chart-series-contrast)),
    :global(:where(.snowui-line-chart-series-base)) {
        vector-effect: non-scaling-stroke;
    }

    :global(:where(.snowui-line-chart-area)),
    :global(:where(.snowui-line-chart-area-base)) {
        pointer-events: none;
    }

    :global(:where(.snowui-line-chart-marker)) {
        cursor: pointer;
        outline: none;
    }

    :global(:where(.snowui-line-chart-marker-hit-area)) {
        fill: transparent;
        pointer-events: all;
    }

    :global(:where(.snowui-line-chart-marker-visual)),
    :global(:where(.snowui-line-chart-marker-lower)),
    :global(:where(.snowui-line-chart-marker-upper)) {
        pointer-events: none;
    }

    :global(:where(.snowui-line-chart-cell-hit-area)) {
        fill: transparent;
        outline: none;
        pointer-events: all;
        cursor: pointer;
    }

    :global(:where(.snowui-line-chart-cell-hit-area:focus-visible)) {
        stroke: var(--focus, var(--primary, #111111));
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
    }

    :global(:where(.snowui-line-chart-marker-hover-line)) {
        stroke: var(--black-100);
        stroke-width: 0.5;
        stroke-linecap: round;
        opacity: 0;
        pointer-events: none;
        vector-effect: non-scaling-stroke;
        transition: opacity var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-line-chart-marker-lower)),
    :global(:where(.snowui-line-chart-marker-upper)) {
        transition: fill var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(
            :where(.snowui-line-chart-marker:hover)
                .snowui-line-chart-marker-hover-line
        ),
    :global(
            :where(.snowui-line-chart-marker:focus-visible)
                .snowui-line-chart-marker-hover-line
        ),
    :global(
            :where(.snowui-line-chart-marker[data-active="true"])
                .snowui-line-chart-marker-hover-line
        ) {
        opacity: 1;
    }

    :global(
            :where(.snowui-line-chart-marker:hover)
                .snowui-line-chart-marker-lower
        ),
    :global(
            :where(.snowui-line-chart-marker:focus-visible)
                .snowui-line-chart-marker-lower
        ),
    :global(
            :where(.snowui-line-chart-marker[data-active="true"])
                .snowui-line-chart-marker-lower
        ) {
        fill: var(--white-100);
    }

    :global(
            :where(.snowui-line-chart-marker:hover)
                .snowui-line-chart-marker-upper
        ),
    :global(
            :where(.snowui-line-chart-marker:focus-visible)
                .snowui-line-chart-marker-upper
        ),
    :global(
            :where(.snowui-line-chart-marker[data-active="true"])
                .snowui-line-chart-marker-upper
        ) {
        fill: var(--black-100);
    }

    :global(
            :where(.snowui-line-chart-marker:focus-visible)
                .snowui-line-chart-marker-lower
        ) {
        stroke: var(--focus, var(--primary, #111111));
        stroke-width: 2;
    }

    :global(:where(.snowui-line-chart-hover-label)) {
        color: var(--snowui-line-chart-hover-label-color);
        fill: var(--snowui-line-chart-hover-label-color);
        font-family: var(--font, Inter), sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 1;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
        height: 100%;
        white-space: nowrap;
        pointer-events: none;
        text-align: center;
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }

    :global(:where(.snowui-line-chart-axis-labels text)) {
        font-family: var(--font, Inter), sans-serif;
        font-size: var(
            --snowui-line-chart-axis-font-size-override,
            var(--snowui-line-chart-axis-font-size)
        );
        font-weight: 400;
        line-height: var(--snowui-line-chart-axis-line-height);
        fill: var(
            --snowui-line-chart-axis-color-override,
            var(--snowui-line-chart-axis-color)
        );
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }

    :global(:where(.snowui-line-chart-x-label-cell)) {
        overflow: hidden;
    }

    :global(:where(.snowui-line-chart-x-label-content)) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        font-family: var(--font, Inter), sans-serif;
        font-size: var(
            --snowui-line-chart-axis-font-size-override,
            var(--snowui-line-chart-axis-font-size)
        );
        font-weight: 400;
        line-height: var(--snowui-line-chart-axis-line-height);
        color: var(
            --snowui-line-chart-axis-color-override,
            var(--snowui-line-chart-axis-color)
        );
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }
</style>
