<!--
  BarChart 柱状图组件 (PRO)
  v1.1.0 (2026-09-01)

  职责:渲染支持纵向/横向、多段、相叠、多柱并排与坐标轴的柱状图。
  文档: ./BarChart.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { getContext, onDestroy, onMount, tick } from "svelte";
    import {
        Frame,
        formatNumberLabel,
        getNumberFormat,
        mergeNumberFormatOptions,
        resizeManager,
        type NumberFormatOptions,
        type RenderHints,
    } from "@snowui-design-system/components";
    import type { MotionConfig } from "@snowui-design-system/components/logic/motion-config";
    import ChartHoverPanel from "../lib/chart/ChartHoverPanel.svelte";
    import {
        resolveChartColor,
        resolveMonochromeFadeColor,
        resolveMonochromeFadeOpacity,
        type ChartColor,
        type ChartColorMode,
        type ChartGradient,
        type ChartGradientStop,
    } from "../lib/chart/colors";
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
        resolveCategoryLabels as resolveSharedCategoryLabels,
        resolveVisibleCategoryIndexes,
        resolveVisibleXIndexes,
        resolveVisibleYTicks,
        resolveYTickTargetCount,
    } from "../lib/chart/axis";
    import { clamp, toCssLength, toNumber } from "../lib/chart/geometry";
    import {
        resolveCartesianChartSize,
        watchCartesianChartSize,
    } from "../lib/chart/size";
    import {
        addHoverLabelKey,
        createHoverLabelFractionFormat,
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

    export type BarChartColor = ChartColor;
    export type BarChartColorMode = ChartColorMode;
    export type BarChartGradient = ChartGradient;
    export type BarChartGradientStop = ChartGradientStop;
    export type BarChartOrientation = "vertical" | "horizontal";
    export type BarChartMode = "single" | "stack" | "overlay" | "group";
    type AnchorPoint = "top" | "center" | "bottom";

    export interface BarChartSegment {
        name?: string;
        value: number;
        color?: BarChartColor;
        valueFormat?: NumberFormatOptions;
    }

    export interface BarChartBar {
        name?: string;
        value: number;
        color?: BarChartColor;
        valueFormat?: NumberFormatOptions;
    }

    export interface BarChartItem {
        name: string;
        value?: number;
        color?: BarChartColor;
        valueFormat?: NumberFormatOptions;
        segments?: BarChartSegment[];
        bars?: BarChartBar[];
        backgroundValue?: number;
    }

    export interface BarChartValueLabelContext {
        item: BarChartItem;
        unit: BarChartBar | BarChartSegment;
        groupIndex: number;
        barIndex: number;
        mode: BarChartMode;
        orientation: BarChartOrientation;
        progress: number;
    }

    interface AxisBounds {
        top: number;
        right: number;
        bottom: number;
        left: number;
    }

    interface NormalizedBar {
        item: BarChartItem;
        groupIndex: number;
        barIndex: number;
        segmentIndex: number;
        name: string;
        value: number;
        startValue: number;
        endValue: number;
        color: BarChartColor;
        fill: string;
        gradientId?: string;
        gradient?: ReturnType<typeof resolveColorGradient>;
        opacity: number;
        hoverOverlayColor: string;
        hoverOverlayOpacity: string;
        path: string;
        fullPath: string;
        hitPath: string;
        labelText: string;
        finalLabelText: string;
        labelColor: string;
        labelX: number;
        labelY: number;
        boundsX: number;
        boundsY: number;
        boundsWidth: number;
        boundsHeight: number;
        ariaLabel: string;
    }

    interface Props {
        data?: BarChartItem[];
        orientation?: BarChartOrientation;
        mode?: BarChartMode;
        width?: number | string;
        height?: number | string;
        barWidth?: number | string;
        barGap?: number | string;
        groupGap?: number | string;
        segmentGap?: number | string;
        cornerRadius?: number | string;
        roundedStart?: boolean;
        roundedEnd?: boolean;
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
        showHoverLabel?: boolean;
        alwaysShowHoverLabel?: boolean;
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
            context: BarChartValueLabelContext,
        ) => string;
        xLabelAutoCull?: boolean;
        xMaxLabelCount?: number;
        valueLabelAutoCull?: boolean;
        valueMaxLabelCount?: number;
        yLabelAutoCull?: boolean;
        yMaxLabelCount?: number;
        colors?: (BarChartColor | undefined)[];
        colorMode?: BarChartColorMode;
        color?: BarChartColor;
        monochromeColor?: BarChartColor;
        mutedMonochromeColor?: BarChartColor;
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
        skeleton?: boolean;
        renderHints?: RenderHints;
        children?: Snippet;
        class?: string;
        style?: string;
        enableResponsive?: boolean;
        enableContext?: boolean;
        enableScaleObserver?: boolean;
        enableDefaultMotion?: boolean;
        [key: string]: any;
    }

    const DEFAULT_DATA: BarChartItem[] = [
        { name: "Mon", value: 42 },
        { name: "Tue", value: 64 },
        { name: "Wed", value: 38 },
        { name: "Thu", value: 78 },
        { name: "Fri", value: 56 },
        { name: "Sat", value: 92 },
    ];
    const DEFAULT_BOUNDS: AxisBounds = {
        top: 0,
        right: 0,
        bottom: CHART_X_AXIS_RESERVED_HEIGHT,
        left: 0,
    };
    // 初始高度比例。0.8 表示所有柱子从 80% 高度开始。
    const BAR_CHART_INITIAL_APPEARANCE_SCALE = 0.8;
    // 每个单元格启动间隔。现在是 50ms。想让柱子一个接一个更快启动，就改小；更慢就改大。
    const BAR_CHART_APPEARANCE_STAGGER = 50;
    // 整条 BarChart 时间轴的 easeOut。值越大，整体越前快后慢。
    const BAR_CHART_APPEARANCE_TIMELINE_POWER = 2;
    // 每个柱子自身变高的 easeOut。值越大，单根柱子越前快后慢；想更线性就接近 1。
    const BAR_CHART_EASE_OUT_POWER = 2;
    // 越靠右的柱子时长拉长比例。0.3 表示最后一个柱子比第一个慢 30%。设为 0 就所有柱子升高时长一样。
    const BAR_CHART_RISE_TAIL_STRETCH = 0.3;
    // 第一根柱子的升高基础时长。现在是 600ms。想整体慢一点，先改这里。
    const BAR_CHART_RISE_DURATION = 600;
    const BAR_CHART_HOVER_LABEL_MOTION_DURATION = 200;
    const BAR_CHART_HOVER_LABEL_SLIDE_DISTANCE = 2;
    const BAR_CHART_HOVER_LABEL_APPEAR_MOTION: MotionConfig = {
        opacity: [0, 1],
        y: [BAR_CHART_HOVER_LABEL_SLIDE_DISTANCE, 0],
        duration: BAR_CHART_HOVER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const BAR_CHART_HOVER_LABEL_DISAPPEAR_MOTION: MotionConfig = {
        opacity: [1, 0],
        y: [0, BAR_CHART_HOVER_LABEL_SLIDE_DISTANCE],
        duration: BAR_CHART_HOVER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const BAR_CHART_HOVER_LABEL_WIDTH = 120;
    const BAR_CHART_HOVER_LABEL_HEIGHT = 16;
    const paintUid = Math.random().toString(36).slice(2, 9);

    let {
        data = DEFAULT_DATA,
        orientation = "vertical",
        mode = "single",
        width = 800,
        height = 400,
        barWidth = 32,
        barGap = 4,
        groupGap = 20,
        segmentGap = 0,
        cornerRadius = 8,
        roundedStart = true,
        roundedEnd = true,
        xLabels = undefined,
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
        showHoverPanel = false,
        hoverPanelVariant = "light",
        hoverPanelPlacement = "anchor-top",
        showHoverPanelLabel = false,
        hoverMode = undefined,
        activeCellIndex = undefined,
        onCellHoverChange = undefined,
        valueFormat = undefined,
        labelFormatter = undefined,
        xLabelAutoCull = undefined,
        xMaxLabelCount = undefined,
        valueLabelAutoCull = true,
        valueMaxLabelCount = undefined,
        yLabelAutoCull = undefined,
        yMaxLabelCount = undefined,
        colors = undefined,
        colorMode = "sequence",
        color = undefined,
        monochromeColor = "Primary",
        mutedMonochromeColor = "Black4",
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
        skeleton = undefined,
        renderHints = undefined,
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
    let measuredWidth = $state(0);
    let measuredHeight = $state(0);
    let yAxisMeasureGroup = $state<SVGGElement>();
    let xAxisMeasureGroup = $state<SVGGElement>();
    let xValueAxisMeasureGroup = $state<SVGGElement>();
    let yAxisLabelWidth = $state(0);
    let measuredCategoryLabelWidths = $state<number[]>([]);
    let measuredValueTickWidths = $state<number[]>([]);
    let internalAppearanceProgress = $state(0);
    let hasSyncedDefaultAppearanceProgress = $state(false);
    let appearanceFrame = $state<number | null>(null);
    let scrollFrame = $state<number | null>(null);
    let hasAutoPlayed = $state(false);
    let pointerHoverLabelKeys = $state<string[]>([]);
    let focusHoverLabelKeys = $state<string[]>([]);
    let mountedHoverLabelKeys = $state<string[]>([]);
    let internalActiveCellIndex = $state<number | null>(null);
    let lastActiveCellIndex = $state<number | null>(null);
    let hoverPanelPointer = $state({ x: 0, y: 0 });
    let hoverPanelPointerFrame: number | null = null;
    let pendingHoverPanelPointer: { x: number; y: number } | null = null;
    const hoverLabelUnmountTimers = new Map<
        string,
        ReturnType<typeof setTimeout>
    >();
    const numberFormatContext = getNumberFormat();
    const chartGroup = getContext<ChartGroupContext | undefined>(
        CHART_GROUP_CONTEXT_KEY,
    );

    $effect(() => {
        const root = rootElement;
        if (!root) return;
        return watchCartesianChartSize(root, ({ width, height }) => {
            const nextWidth = width;
            const nextHeight = height;
            if (Math.abs(nextWidth - measuredWidth) > 0.01) {
                measuredWidth = nextWidth;
            }
            if (Math.abs(nextHeight - measuredHeight) > 0.01) {
                measuredHeight = nextHeight;
            }
        });
    });

    const numericWidth = $derived(
        resolveCartesianChartSize(measuredWidth, width, 800),
    );
    const numericHeight = $derived(
        resolveCartesianChartSize(measuredHeight, height, 400),
    );
    const numericBarWidth = $derived(Math.max(2, toNumber(barWidth, 32)));
    const numericBarGap = $derived(Math.max(4, toNumber(barGap, 4)));
    const numericGroupGap = $derived(Math.max(4, toNumber(groupGap, 20)));
    const numericSegmentGap = $derived(Math.max(0, toNumber(segmentGap, 0)));
    const numericCornerRadius = $derived(
        Math.max(0, toNumber(cornerRadius, 8)),
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
    const ownPlotTopInset = $derived(
        resolveCartesianChartTopInset({
            showYAxis: orientation === "vertical" && effectiveShowYAxis,
            showHoverLabel:
                orientation === "vertical" && effectiveShowHoverLabel,
        }),
    );
    const effectivePlotTopInset = $derived(
        chartGroup?.plotTopInset() ?? ownPlotTopInset,
    );

    $effect(() =>
        chartGroup?.registerPlotTopInset?.(
            `bar-chart-top-${paintUid}`,
            () => ownPlotTopInset,
        ),
    );
    const chartData = $derived(normalizeData(data));
    const categoryLabels = $derived(
        resolveSharedCategoryLabels(
            chartData.map((item) => item.name ?? ""),
            effectiveXLabels,
        ),
    );
    const categoryLabelWidths = $derived(
        categoryLabels.map(
            (label, index) =>
                measuredCategoryLabelWidths[index] ??
                estimateLabelWidth(label) + 2,
        ),
    );
    const bounds = $derived(
        resolveBounds(
            effectiveShowXAxis,
            effectiveShowYAxis,
            orientation,
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
    const visibleCategoryLabelIndexes = $derived(
        resolveVisibleCategoryIndexes(
            categoryLabels,
            orientation === "vertical" ? plotWidth : plotHeight,
            effectiveXLabelAutoCull,
            effectiveXMaxLabelCount,
            orientation === "vertical"
                ? categoryLabelWidths
                : categoryLabels.map(() => CHART_AXIS_LABEL_HEIGHT),
            4,
        ),
    );
    const visibleCategoryLabels = $derived(
        visibleCategoryLabelIndexes.map(
            (index) => categoryLabels[index] ?? String(index + 1),
        ),
    );
    const domain = $derived(
        resolveValueDomain(
            chartData,
            mode,
            effectiveYMin,
            effectiveYMax,
            effectiveYTicks,
            resolveYTickTargetCount(
                effectiveYTickCount,
                effectiveYMaxLabelCount,
            ),
        ),
    );
    const safeMin = $derived(domain.min);
    const safeMax = $derived(domain.max);
    const formattedDomainTickLabels = $derived(
        domain.ticks.map((tick) =>
            (effectiveYTickFormatter ?? formatAxisTick)(tick),
        ),
    );
    const visibleTicks = $derived(
        orientation === "vertical"
            ? resolveVisibleYTicks(
                  domain.ticks,
                  plotHeight,
                  effectiveYLabelAutoCull,
                  effectiveYMaxLabelCount,
              )
            : resolveVisibleXIndexes(
                  formattedDomainTickLabels,
                  plotWidth,
                  "edge",
                  effectiveYLabelAutoCull,
                  effectiveYMaxLabelCount,
                  measuredValueTickWidths,
                  4,
              )
                  .map((index) => domain.ticks[index])
                  .filter(Number.isFinite),
    );
    const yAxisLabels = $derived(
        !effectiveShowYAxis
            ? []
            : orientation === "vertical"
              ? visibleTicks.map((tick) =>
                    (effectiveYTickFormatter ?? formatAxisTick)(tick),
                )
              : visibleCategoryLabels,
    );

    $effect(() => {
        const group = xValueAxisMeasureGroup;
        const labels = formattedDomainTickLabels;
        if (
            !effectiveShowXAxis ||
            orientation !== "horizontal" ||
            labels.length === 0
        ) {
            measuredValueTickWidths = [];
            return;
        }
        if (!group) return;

        const updateWidths = () => {
            const nextWidths = measureRenderedAxisLabelWidths(group).map(
                (value) => value + 2,
            );
            if (
                nextWidths.length !== measuredValueTickWidths.length ||
                nextWidths.some(
                    (value, index) =>
                        Math.abs(
                            value - (measuredValueTickWidths[index] ?? 0),
                        ) > 0.01,
                )
            ) {
                measuredValueTickWidths = nextWidths;
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
        const group = xAxisMeasureGroup;
        const labels = categoryLabels;
        if (
            !effectiveShowXAxis ||
            orientation !== "vertical" ||
            labels.length === 0
        ) {
            measuredCategoryLabelWidths = [];
            return;
        }
        if (!group) return;

        const updateWidths = () => {
            const nextWidths = measureRenderedAxisLabelWidths(group).map(
                (value) => value + 2,
            );
            if (
                nextWidths.length !== measuredCategoryLabelWidths.length ||
                nextWidths.some(
                    (value, index) =>
                        Math.abs(
                            value - (measuredCategoryLabelWidths[index] ?? 0),
                        ) > 0.01,
                )
            ) {
                measuredCategoryLabelWidths = nextWidths;
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
    const gridTicks = $derived(
        effectiveShowXAxis
            ? visibleTicks.filter((tick) => Math.abs(tick - safeMin) > 1e-9)
            : visibleTicks,
    );
    const controlledAppearanceProgress = $derived(
        typeof appearanceProgress === "number",
    );
    const effectiveAppearanceProgress = $derived(
        appearMotion
            ? clamp(
                  controlledAppearanceProgress
                      ? (appearanceProgress as number)
                      : internalAppearanceProgress,
                  0,
                  1,
              )
            : 1,
    );
    const appearanceTimelines = $derived(
        resolveBarChartAppearanceTimelines(
            chartData.length,
            effectiveAppearanceProgress,
        ),
    );
    const bars = $derived(
        buildBars(
            chartData,
            mode,
            orientation,
            numericWidth,
            numericHeight,
            bounds,
            plotWidth,
            plotHeight,
            numericBarWidth,
            numericBarGap,
            numericGroupGap,
            numericSegmentGap,
            numericCornerRadius,
            roundedStart,
            roundedEnd,
            safeMin,
            safeMax,
            colors,
            colorMode,
            color,
            monochromeColor,
            mutedMonochromeColor,
            appearanceTimelines,
        ),
    );
    const valueLabelCategoryTexts = $derived(
        categoryLabels.map((label, groupIndex) => {
            const groupLabels = bars
                .filter((item) => item.groupIndex === groupIndex)
                .map((item) => item.finalLabelText);
            return groupLabels.reduce(
                (widest, candidate) =>
                    estimateLabelWidth(candidate) > estimateLabelWidth(widest)
                        ? candidate
                        : widest,
                label,
            );
        }),
    );
    const visibleValueLabelIndexes = $derived(
        resolveVisibleCategoryIndexes(
            valueLabelCategoryTexts,
            orientation === "vertical" ? plotWidth : plotHeight,
            valueLabelAutoCull,
            valueMaxLabelCount,
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
    const hoverPanelRows = $derived(resolveHoverPanelRows());
    const hoverPanelAnchor = $derived(resolveHoverPanelAnchor());
    const hoverPanelData = $derived<ChartHoverPanelData | null>(
        resolveHoverPanelData(),
    );
    const gradients = $derived(
        bars.map((item) => item.gradient).filter(Boolean),
    );
    const rootStyle = $derived(
        [
            `--snowui-bar-chart-width: ${toCssLength(width)}`,
            `--snowui-bar-chart-height: ${toCssLength(height)}`,
            `--snowui-bar-chart-bar-width: ${toCssLength(numericBarWidth)}`,
            `--snowui-bar-chart-bar-gap: ${toCssLength(numericBarGap)}`,
            `--snowui-bar-chart-group-gap: ${toCssLength(numericGroupGap)}`,
            `--snowui-bar-chart-segment-gap: ${toCssLength(segmentGap)}`,
            `--snowui-bar-chart-corner-radius: ${toCssLength(cornerRadius)}`,
            style,
        ]
            .filter(Boolean)
            .join("; "),
    );
    const barChartRenderHints = $derived({
        variant: renderHints?.variant ?? "rect",
        width: renderHints?.width ?? toCssLength(width),
        height: renderHints?.height ?? toCssLength(height),
        radius: renderHints?.radius ?? "0.75rem",
    });
    const hoverPanelSourceId = `bar-chart-${paintUid}`;

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

    onMount(() => {
        const mediaQuery = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)",
        );
        if (!appearMotion || mediaQuery?.matches) {
            setInternalAppearanceProgress(1);
            return;
        }

        const updateFromScroll = () => {
            if (scrollFrame !== null) return;
            scrollFrame = requestAnimationFrame(() => {
                scrollFrame = null;
                if (scrollAppearance) {
                    setInternalAppearanceProgress(resolveScrollProgress());
                    return;
                }
                if (appearOnView && !hasAutoPlayed && isAnchorTriggered()) {
                    hasAutoPlayed = true;
                    playAppearance();
                }
            });
        };

        updateFromScroll();
        window.addEventListener("scroll", updateFromScroll, { passive: true });
        window.addEventListener("resize", updateFromScroll);

        return () => {
            window.removeEventListener("scroll", updateFromScroll);
            window.removeEventListener("resize", updateFromScroll);
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
        return resolveBarChartAppearanceDuration(chartData.length);
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

    function getAnchorCoordinate(rect: DOMRect) {
        if (appearAnchorPoint === "center") return rect.top + rect.height / 2;
        if (appearAnchorPoint === "bottom") return rect.bottom;
        return rect.top;
    }

    function isAnchorTriggered() {
        const anchor = getAnchorElement();
        if (!anchor) return false;
        const rect = anchor.getBoundingClientRect();
        const triggerLine = window.innerHeight * getViewportPoint();
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
        const rect = anchor.getBoundingClientRect();
        const triggerLine = window.innerHeight * getViewportPoint();
        const distance = Math.max(1, getScrollDistance());
        return clamp(
            (triggerLine - getAnchorCoordinate(rect)) / distance,
            0,
            1,
        );
    }

    function normalizeData(items: BarChartItem[]) {
        const validItems = items.filter((item) => item && item.name);
        return validItems.length > 0 ? validItems : DEFAULT_DATA;
    }

    function resolveBounds(
        hasXAxis: boolean,
        hasYAxis: boolean,
        chartOrientation: BarChartOrientation,
        measuredYAxisWidth: number,
        plotTopInset: number,
    ): AxisBounds {
        const needsLeft =
            hasYAxis || (chartOrientation === "horizontal" && hasYAxis);
        return {
            top: plotTopInset,
            right:
                chartOrientation === "horizontal" && hasXAxis
                    ? 16
                    : DEFAULT_BOUNDS.right,
            bottom: hasXAxis ? DEFAULT_BOUNDS.bottom : 0,
            left: needsLeft
                ? measuredYAxisWidth + CHART_Y_AXIS_LABEL_GAP
                : DEFAULT_BOUNDS.left,
        };
    }

    function resolveValueDomain(
        items: BarChartItem[],
        chartMode: BarChartMode,
        explicitMin: number | undefined,
        explicitMax: number | undefined,
        explicitTicks: number[] | undefined,
        targetTickCount: number,
    ) {
        if (explicitTicks && explicitTicks.length > 0) {
            const tickValues = explicitTicks.filter(Number.isFinite);
            if (tickValues.length === 0) {
                return resolveValueDomain(
                    items,
                    chartMode,
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
            return { min, max: max > min ? max : min + 1, ticks: tickValues };
        }

        const values = resolveDomainValues(items, chartMode);
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

    function resolveDomainValues(
        items: BarChartItem[],
        chartMode: BarChartMode,
    ) {
        return items
            .flatMap((item) => {
                if (chartMode === "stack" && item.segments?.length) {
                    return [
                        item.segments.reduce(
                            (sum, segment) => sum + Math.max(0, segment.value),
                            0,
                        ),
                    ];
                }
                if (chartMode === "group" && item.bars?.length) {
                    return item.bars.map((bar) => bar.value);
                }
                if (chartMode === "overlay") {
                    return [
                        item.value ?? 0,
                        item.backgroundValue ?? item.value ?? 0,
                    ];
                }
                return [item.value ?? 0];
            })
            .filter(Number.isFinite);
    }

    function formatBarValueLabel(
        value: number,
        context: BarChartValueLabelContext,
        formatOverride?: NumberFormatOptions,
    ) {
        const normalizedValue = normalizeTickValue(value);
        const formattedValue =
            typeof formatOverride?.fractionDigits === "number"
                ? Number(normalizedValue.toFixed(formatOverride.fractionDigits))
                : normalizedValue;
        if (labelFormatter) return labelFormatter(formattedValue, context);
        return formatNumberLabel(
            formattedValue,
            mergeNumberFormatOptions(
                numberFormatContext,
                valueFormat,
                context.item.valueFormat,
                context.unit.valueFormat,
                formatOverride,
            ),
        );
    }

    function resolveBarValueLabelLocale(
        context: BarChartValueLabelContext,
    ) {
        const options = mergeNumberFormatOptions(
            numberFormatContext,
            valueFormat,
            context.item.valueFormat,
            context.unit.valueFormat,
        );
        return options.locale ?? "en-US";
    }

    function resolveBarChartRiseDuration(order = 0, count = 1) {
        const normalizedOrder = count <= 1 ? 0 : order / (count - 1);
        return (
            BAR_CHART_RISE_DURATION *
            (1 + BAR_CHART_RISE_TAIL_STRETCH * normalizedOrder)
        );
    }

    function easeOut(progress: number) {
        const safeProgress = clamp(progress, 0, 1);
        return 1 - Math.pow(1 - safeProgress, BAR_CHART_EASE_OUT_POWER);
    }

    function easeTimeline(progress: number) {
        const safeProgress = clamp(progress, 0, 1);
        return (
            1 - Math.pow(1 - safeProgress, BAR_CHART_APPEARANCE_TIMELINE_POWER)
        );
    }

    function resolveBarChartStaggerAfter(_order: number, count: number) {
        if (count <= 1) return 0;
        return BAR_CHART_APPEARANCE_STAGGER;
    }

    function resolveBarChartStartOffset(order: number, count: number) {
        let offset = 0;
        for (let index = 0; index < order; index += 1) {
            offset += resolveBarChartStaggerAfter(index, count);
        }
        return offset;
    }

    function resolveBarChartAppearanceDuration(count: number) {
        if (count <= 0) return BAR_CHART_RISE_DURATION;
        const lastOrder = count - 1;
        return (
            resolveBarChartStartOffset(lastOrder, count) +
            resolveBarChartRiseDuration(lastOrder, count)
        );
    }

    function resolveBarChartAppearanceTimelines(
        count: number,
        progress: number,
    ) {
        if (count <= 0) return [];
        const duration = resolveBarChartAppearanceDuration(count);
        const elapsed = easeTimeline(progress) * duration;
        return Array.from({ length: count }, (_, order) => {
            const startOffset = resolveBarChartStartOffset(order, count);
            const riseDuration = resolveBarChartRiseDuration(order, count);
            const localProgress = easeOut(
                (elapsed - startOffset) / Math.max(1, riseDuration),
            );
            const fillProgress =
                BAR_CHART_INITIAL_APPEARANCE_SCALE +
                (1 - BAR_CHART_INITIAL_APPEARANCE_SCALE) * localProgress;
            return {
                fillProgress,
                labelProgress: fillProgress,
                opacityProgress: 1,
            };
        });
    }

    function buildBars(
        items: BarChartItem[],
        chartMode: BarChartMode,
        chartOrientation: BarChartOrientation,
        chartWidth: number,
        chartHeight: number,
        chartBounds: AxisBounds,
        chartPlotWidth: number,
        chartPlotHeight: number,
        thickness: number,
        gap: number,
        categoryGap: number,
        splitGap: number,
        radius: number,
        hasStartRound: boolean,
        hasEndRound: boolean,
        minValue: number,
        maxValue: number,
        palette: (BarChartColor | undefined)[] | undefined,
        modeValue: BarChartColorMode,
        mainColor: BarChartColor | undefined,
        singleColor: BarChartColor,
        mutedSingleColor: BarChartColor,
        timelines: {
            fillProgress: number;
            labelProgress: number;
            opacityProgress: number;
        }[],
    ): NormalizedBar[] {
        return items.flatMap((item, groupIndex) => {
            const progress = timelines[groupIndex]?.fillProgress ?? 1;
            const labelProgress = timelines[groupIndex]?.labelProgress ?? 1;
            const opacity = timelines[groupIndex]?.opacityProgress ?? 1;
            const units = resolveUnitBars(item, chartMode);
            const visibleUnitCount = chartMode === "group" ? units.length : 1;
            const category = resolveCategoryGeometry(
                groupIndex,
                items.length,
                visibleUnitCount,
                chartOrientation,
                chartBounds,
                chartPlotWidth,
                chartPlotHeight,
                thickness,
                gap,
                categoryGap,
            );
            let stackedStart = 0;
            return units.map((unit, unitIndex) => {
                const startValue = chartMode === "stack" ? stackedStart : 0;
                const endValue =
                    chartMode === "stack"
                        ? stackedStart + unit.value
                        : unit.value;
                if (chartMode === "stack") stackedStart = endValue;
                const animatedStartValue =
                    chartMode === "stack" ? startValue * progress : startValue;
                const animatedEndValue =
                    chartMode === "stack" ? endValue * progress : endValue;
                const segmentGaps = resolveBarSegmentGaps(
                    chartMode,
                    unitIndex,
                    units.length,
                    splitGap,
                );
                const colorIndex =
                    chartMode === "stack"
                        ? unitIndex
                        : chartMode === "overlay"
                          ? groupIndex
                          : groupIndex + unitIndex;
                const color = resolveBarColor(
                    unit.color ?? item.color,
                    palette,
                    colorIndex,
                    chartMode,
                    units.length,
                    modeValue,
                    mainColor,
                    singleColor,
                    mutedSingleColor,
                );
                const gradient = resolveColorGradient(
                    color,
                    groupIndex * 16 + unitIndex,
                    `snowui-bar-chart-${paintUid}`,
                    chartWidth,
                    chartHeight,
                );
                const fill = gradient
                    ? `url(#${gradient.id})`
                    : (color as string);
                const rect = resolveBarRect(
                    category,
                    chartOrientation,
                    animatedStartValue,
                    animatedEndValue,
                    chartMode === "stack" ? 1 : progress,
                    minValue,
                    maxValue,
                    chartBounds,
                    chartPlotWidth,
                    chartPlotHeight,
                    chartMode === "group" ? unitIndex : 0,
                    segmentGaps.startGap,
                    segmentGaps.endGap,
                );
                const fullRect = resolveBarRect(
                    category,
                    chartOrientation,
                    startValue,
                    endValue,
                    1,
                    minValue,
                    maxValue,
                    chartBounds,
                    chartPlotWidth,
                    chartPlotHeight,
                    chartMode === "group" ? unitIndex : 0,
                    segmentGaps.startGap,
                    segmentGaps.endGap,
                );
                const cornerFlags = resolveCornerFlags(
                    chartOrientation,
                    hasStartRound,
                    hasEndRound,
                    chartMode,
                    unitIndex,
                    units.length,
                    splitGap,
                );
                const path = roundedRectPath(
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height,
                    radius,
                    cornerFlags,
                );
                const fullPath = roundedRectPath(
                    fullRect.x,
                    fullRect.y,
                    fullRect.width,
                    fullRect.height,
                    radius,
                    cornerFlags,
                );
                const hitPath = roundedRectPath(
                    fullRect.x,
                    fullRect.y,
                    fullRect.width,
                    fullRect.height,
                    radius,
                    cornerFlags,
                );
                const itemOpacity =
                    chartMode === "overlay" && unitIndex === 0 ? 0.1 : opacity;
                const visualOpacity =
                    chartMode === "stack" && !(unit.color ?? item.color)
                        ? resolveMonochromeFadeOpacity(
                              unitIndex,
                              units.length,
                          ) / 100
                        : itemOpacity;
                const labelPosition = resolveBarLabelPosition(
                    rect,
                    chartOrientation,
                );
                const currentLabelValue = unit.value * labelProgress;
                const labelContext: BarChartValueLabelContext = {
                    item,
                    unit,
                    groupIndex,
                    barIndex: unitIndex,
                    mode: chartMode,
                    orientation: chartOrientation,
                    progress: labelProgress,
                };
                const finalLabelContext = {
                    ...labelContext,
                    progress: 1,
                };
                const finalValueLabel = formatBarValueLabel(
                    unit.value,
                    finalLabelContext,
                );
                const labelFractionFormat = createHoverLabelFractionFormat(
                    finalValueLabel,
                    resolveBarValueLabelLocale(finalLabelContext),
                );
                const valueLabel = formatBarValueLabel(
                    currentLabelValue,
                    labelContext,
                    labelFractionFormat,
                );
                return {
                    item,
                    groupIndex,
                    barIndex: unitIndex,
                    segmentIndex: chartMode === "stack" ? unitIndex : 0,
                    name: unit.name ?? item.name,
                    value: unit.value,
                    startValue,
                    endValue,
                    color,
                    fill,
                    gradientId: gradient?.id,
                    gradient,
                    opacity: itemOpacity,
                    hoverOverlayColor:
                        resolveBarHoverOverlayColor(visualOpacity),
                    hoverOverlayOpacity:
                        resolveBarHoverOverlayOpacity(visualOpacity),
                    path,
                    fullPath,
                    hitPath,
                    labelText: valueLabel,
                    finalLabelText: finalValueLabel,
                    labelColor: resolveBarLabelColor(
                        chartMode,
                        unitIndex,
                        units.length,
                    ),
                    labelX: labelPosition.x,
                    labelY: labelPosition.y,
                    boundsX: fullRect.x,
                    boundsY: fullRect.y,
                    boundsWidth: fullRect.width,
                    boundsHeight: fullRect.height,
                    ariaLabel:
                        `${item.name} ${unit.name ?? ""}: ${valueLabel}`.trim(),
                };
            });
        });
    }

    function resolveUnitBars(item: BarChartItem, chartMode: BarChartMode) {
        if (chartMode === "stack" && item.segments?.length) {
            return item.segments.filter(
                (segment) =>
                    Number.isFinite(segment.value) && segment.value >= 0,
            );
        }
        if (chartMode === "group" && item.bars?.length) {
            return item.bars.filter((bar) => Number.isFinite(bar.value));
        }
        if (chartMode === "overlay") {
            const foregroundValue = item.value ?? 0;
            return [
                {
                    name: "Background",
                    value: item.backgroundValue ?? Math.max(foregroundValue, 0),
                    color: item.color,
                    valueFormat: item.valueFormat,
                },
                {
                    name: item.name,
                    value: foregroundValue,
                    color: item.color,
                    valueFormat: item.valueFormat,
                },
            ];
        }
        return [
            {
                name: item.name,
                value: item.value ?? 0,
                color: item.color,
                valueFormat: item.valueFormat,
            },
        ];
    }

    function resolveBarColor(
        itemColor: BarChartColor | undefined,
        palette: (BarChartColor | undefined)[] | undefined,
        index: number,
        chartMode: BarChartMode,
        unitCount: number,
        modeValue: BarChartColorMode,
        mainColor: BarChartColor | undefined,
        singleColor: BarChartColor,
        mutedSingleColor: BarChartColor,
    ) {
        if (itemColor) return resolveChartColor(itemColor, undefined, index);
        if (chartMode === "stack") {
            return resolveMonochromeFadeColor(
                mainColor ?? singleColor,
                index,
                unitCount,
            );
        }
        return resolveChartColor(undefined, palette, index, {
            mode: modeValue,
            count: unitCount,
            color: mainColor,
            monochromeColor: singleColor,
            mutedMonochromeColor: mutedSingleColor,
        });
    }

    function resolveBarHoverOverlayOpacity(opacity: number) {
        return opacity >= 0.4 ? "20%" : "4%";
    }

    function resolveBarHoverOverlayColor(opacity: number) {
        return opacity >= 0.4
            ? "var(--static-white-100, #ffffff)"
            : "var(--black-100, #000000)";
    }

    function hoverLabelKey(item: NormalizedBar) {
        return `${item.groupIndex}:${item.barIndex}:${item.segmentIndex}`;
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
            false,
        );
    }

    function isPersistentValueLabelVisible(item: NormalizedBar) {
        return (
            effectiveAlwaysShowHoverLabel &&
            visibleValueLabelIndexes.includes(item.groupIndex)
        );
    }

    function isBarCellActive(item: NormalizedBar) {
        return (
            effectiveHoverMode === "cell" &&
            effectiveActiveCellIndex === item.groupIndex
        );
    }

    function isBarHoverLabelVisible(item: NormalizedBar, key: string) {
        return (
            isHoverLabelVisible(key) ||
            isBarCellActive(item) ||
            isPersistentValueLabelVisible(item)
        );
    }

    function shouldRenderHoverLabel(key: string) {
        return shouldRenderHoverLabelKey(
            key,
            mountedHoverLabelKeys,
            false,
        );
    }

    function shouldRenderBarHoverLabel(item: NormalizedBar, key: string) {
        return (
            shouldRenderHoverLabel(key) ||
            isBarCellActive(item) ||
            isPersistentValueLabelVisible(item)
        );
    }

    function resolveHoverLabelBoxX(item: NormalizedBar) {
        if (orientation === "horizontal") {
            return item.labelX + 4;
        }
        return item.labelX - BAR_CHART_HOVER_LABEL_WIDTH / 2;
    }

    function resolveHoverLabelBoxY(item: NormalizedBar) {
        if (orientation === "horizontal") {
            return item.labelY - BAR_CHART_HOVER_LABEL_HEIGHT / 2;
        }
        return item.labelY - BAR_CHART_HOVER_LABEL_HEIGHT;
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

    function showBarHoverLabel(item: NormalizedBar, source: "pointer" | "focus") {
        showHoverLabelKey(hoverLabelKey(item), source);
        const nextIndex = item.groupIndex;
        internalActiveCellIndex = nextIndex;
        chartGroup?.setActiveCellIndex(nextIndex);
        onCellHoverChange?.(nextIndex);
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
            }, BAR_CHART_HOVER_LABEL_MOTION_DURATION),
        );
    }

    function hideBarHoverLabel(item: NormalizedBar, source: "pointer" | "focus") {
        if (source === "pointer") clearHoverPanelPointerFrame();
        hideHoverLabelKey(hoverLabelKey(item), source);
        if (effectiveActiveCellIndex === item.groupIndex) {
            internalActiveCellIndex = null;
            chartGroup?.setActiveCellIndex(null);
            onCellHoverChange?.(null);
        }
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
            bars
                .filter((item) => item.groupIndex === activeIndex)
                .forEach((item) => {
                    const key = hoverLabelKey(item);
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
            bars
                .filter((item) => item.groupIndex === lastActiveCellIndex)
                .forEach((item) => {
                    const key = hoverLabelKey(item);
                    if (isHoverLabelVisible(key) || isBarCellActive(item)) return;
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
                        }, BAR_CHART_HOVER_LABEL_MOTION_DURATION),
                    );
                });
        }

        lastActiveCellIndex =
            typeof activeIndex === "number" ? activeIndex : null;
    }

    $effect(() => {
        keepActiveCellHoverLabelsMounted();
    });

    function resolveBarLabelPosition(
        rect: { x: number; y: number; width: number; height: number },
        chartOrientation: BarChartOrientation,
    ) {
        if (chartOrientation === "horizontal") {
            return {
                x: rect.x + rect.width,
                y: rect.y + rect.height / 2,
            };
        }
        return {
            x: rect.x + rect.width / 2,
            y: rect.y - 4,
        };
    }

    function resolveBarLabelColor(
        chartMode: BarChartMode,
        index: number,
        count: number,
    ) {
        if (chartMode === "stack" && index < count - 1) {
            return "var(--static-white-100, #ffffff)";
        }
        return "var(--snowui-bar-chart-hover-label-color)";
    }

    function resolveHoverPanelColor(item: NormalizedBar) {
        if (typeof item.fill === "string" && !item.fill.startsWith("url(")) {
            return item.fill;
        }
        if (typeof item.color === "string") return item.color;
        return "var(--black-40, #00000066)";
    }

    function resolveHoverPanelRowsForIndex(index: number): ChartHoverPanelRow[] {
        return bars
            .filter((item) => item.groupIndex === index)
            .map((item) => ({
                name: item.name,
                value: item.labelText,
                color: resolveHoverPanelColor(item),
                opacity: item.opacity,
            }));
    }

    function resolveHoverPanelRows(): ChartHoverPanelRow[] {
        if (typeof effectiveActiveCellIndex !== "number") return [];
        return resolveHoverPanelRowsForIndex(effectiveActiveCellIndex);
    }

    function resolveHoverPanelSvgOffset() {
        const svgElement = rootElement?.querySelector(".snowui-bar-chart-svg");
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
                ? offsetHoverPanelBounds(hoverPanelAnchor.anchorBounds, svgOffset)
                : undefined;
        return {
            label:
                typeof effectiveActiveCellIndex === "number"
                    ? categoryLabels[effectiveActiveCellIndex]
                    : undefined,
            rows: hoverPanelRows,
            x: hoverPanelAnchor.x + anchorOffset.x,
            y: hoverPanelAnchor.y + anchorOffset.y,
            anchorBounds,
            anchorYAlign: "top",
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

    function describeHoverPanelCell(index: number, label: string) {
        const rows = resolveHoverPanelRowsForIndex(index);
        return describeChartHoverPanelData(label, rows) || label;
    }

    function describeHoverPanelBar(item: NormalizedBar) {
        return describeChartHoverPanelData(undefined, [
            {
                name: item.name,
                value: item.labelText,
                color: resolveHoverPanelColor(item),
                opacity: item.opacity,
            },
        ]) || item.ariaLabel;
    }

    function resolveActiveBarBounds(activeBars: NormalizedBar[]) {
        const minX = Math.min(...activeBars.map((item) => item.boundsX));
        const minY = Math.min(...activeBars.map((item) => item.boundsY));
        const maxX = Math.max(
            ...activeBars.map((item) => item.boundsX + item.boundsWidth),
        );
        const maxY = Math.max(
            ...activeBars.map((item) => item.boundsY + item.boundsHeight),
        );
        return {
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY,
            right: maxX,
            bottom: maxY,
        };
    }

    function resolveLongestActiveBar(activeBars: NormalizedBar[]) {
        return activeBars.reduce((longest, item) =>
            item.boundsWidth > longest.boundsWidth ? item : longest,
        );
    }

    function resolveHoverPanelAnchor() {
        if (effectiveHoverPanelPlacement === "pointer") return hoverPanelPointer;
        if (effectiveHoverPanelPlacement.startsWith("pin-")) {
            return { x: bounds.left, y: bounds.top };
        }
        if (typeof effectiveActiveCellIndex !== "number") return undefined;
        const activeBars = bars.filter(
            (item) => item.groupIndex === effectiveActiveCellIndex,
        );
        if (activeBars.length === 0) return undefined;
        const activeBounds = resolveActiveBarBounds(activeBars);
        if (effectiveHoverPanelPlacement === "anchor-side") {
            const anchorBounds = {
                left: activeBounds.left,
                top: activeBounds.top,
                width: activeBounds.width,
                height: activeBounds.height,
            };
            return {
                x: anchorBounds.left,
                y: anchorBounds.top + anchorBounds.height / 2,
                anchorBounds,
            };
        }
        if (
            effectiveHoverPanelPlacement === "anchor-top" &&
            orientation === "horizontal"
        ) {
            const longestBar = resolveLongestActiveBar(activeBars);
            return {
                x: longestBar.boundsX + longestBar.boundsWidth / 2,
                y: activeBounds.top,
                anchorBounds: {
                    left: activeBounds.left,
                    top: activeBounds.top,
                    width: activeBounds.width,
                    height: activeBounds.height,
                },
            };
        }
        if (
            effectiveHoverPanelPlacement === "anchor-top" &&
            orientation === "vertical" &&
            (mode === "single" ||
                mode === "stack" ||
                mode === "overlay" ||
                mode === "group")
        ) {
            return {
                x: activeBounds.left + activeBounds.width / 2,
                y: activeBounds.top,
                anchorBounds: {
                    left: activeBounds.left,
                    top: activeBounds.top,
                    width: activeBounds.width,
                    height: activeBounds.height,
                },
            };
        }
        const first = activeBars[0];
        return {
            x: first.labelX,
            y: first.labelY,
        };
    }

    function updateHoverPanelPointer(event: PointerEvent | MouseEvent) {
        const rect = rootElement?.getBoundingClientRect();
        if (!rect) return;
        pendingHoverPanelPointer = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
        if (hoverPanelPointerFrame !== null) return;
        hoverPanelPointerFrame = requestAnimationFrame(() => {
            hoverPanelPointerFrame = null;
            if (!pendingHoverPanelPointer) return;
            hoverPanelPointer = pendingHoverPanelPointer;
            pendingHoverPanelPointer = null;
        });
    }

    function clearHoverPanelPointerFrame() {
        pendingHoverPanelPointer = null;
        if (hoverPanelPointerFrame === null) return;
        cancelAnimationFrame(hoverPanelPointerFrame);
        hoverPanelPointerFrame = null;
    }

    $effect(() => {
        chartGroup?.setHoverPanelData?.(hoverPanelSourceId, hoverPanelData);
    });

    function resolveBarSegmentGaps(
        chartMode: BarChartMode,
        index: number,
        count: number,
        splitGap: number,
    ) {
        if (chartMode !== "stack" || splitGap <= 0 || count <= 1) {
            return { startGap: 0, endGap: 0 };
        }
        return {
            startGap: index > 0 ? splitGap / 2 : 0,
            endGap: index < count - 1 ? splitGap / 2 : 0,
        };
    }

    function resolveCategoryGeometry(
        index: number,
        count: number,
        unitCount: number,
        chartOrientation: BarChartOrientation,
        chartBounds: AxisBounds,
        chartPlotWidth: number,
        chartPlotHeight: number,
        thickness: number,
        gap: number,
        categoryGap: number,
    ) {
        const axisLength =
            chartOrientation === "vertical" ? chartPlotWidth : chartPlotHeight;
        const cellSize = axisLength / Math.max(1, count);
        const safeUnitCount = Math.max(1, unitCount);
        const safeThickness = Math.max(2, thickness);
        const safeGap = Math.max(4, gap);
        const safeCategoryGap = Math.max(4, categoryGap);
        const minimumGroupSize =
            safeUnitCount * 2 +
            Math.max(0, safeUnitCount - 1) * safeGap;
        const maxGroupSize = Math.max(
            minimumGroupSize,
            cellSize - safeCategoryGap,
        );
        const groupSize = Math.min(
            maxGroupSize,
            safeUnitCount * safeThickness +
                Math.max(0, safeUnitCount - 1) * safeGap,
        );
        const cellStart =
            (chartOrientation === "vertical"
                ? chartBounds.left
                : chartBounds.top) +
            cellSize * index;
        const groupStart = cellStart + (cellSize - groupSize) / 2;
        return {
            groupStart,
            groupSize,
            unitCount: safeUnitCount,
            thickness: safeThickness,
            gap: safeGap,
        };
    }

    function resolveBarRect(
        category: ReturnType<typeof resolveCategoryGeometry>,
        chartOrientation: BarChartOrientation,
        startValue: number,
        endValue: number,
        progress: number,
        minValue: number,
        maxValue: number,
        chartBounds: AxisBounds,
        chartPlotWidth: number,
        chartPlotHeight: number,
        unitIndex: number,
        startGap: number,
        endGap: number,
    ) {
        const unitThickness = Math.min(
            category.thickness,
            (category.groupSize -
                Math.max(0, category.unitCount - 1) * category.gap) /
                Math.max(1, category.unitCount),
        );
        const unitOffset =
            category.groupStart + unitIndex * (unitThickness + category.gap);
        const startPosition = scaleValue(
            startValue,
            minValue,
            maxValue,
            chartBounds,
            chartPlotWidth,
            chartPlotHeight,
            chartOrientation,
        );
        const endPosition = scaleValue(
            endValue,
            minValue,
            maxValue,
            chartBounds,
            chartPlotWidth,
            chartPlotHeight,
            chartOrientation,
        );
        if (chartOrientation === "horizontal") {
            const currentEnd =
                startPosition + (endPosition - startPosition) * progress;
            const isForward = currentEnd >= startPosition;
            const x =
                Math.min(startPosition, currentEnd) +
                (isForward ? startGap : endGap);
            const width = Math.max(
                0,
                Math.abs(currentEnd - startPosition) - startGap - endGap,
            );
            return {
                x,
                y: unitOffset,
                width,
                height: unitThickness,
            };
        }
        const currentEnd =
            startPosition + (endPosition - startPosition) * progress;
        const isUpward = currentEnd <= startPosition;
        const y =
            Math.min(startPosition, currentEnd) +
            (isUpward ? endGap : startGap);
        const height = Math.max(
            0,
            Math.abs(currentEnd - startPosition) - startGap - endGap,
        );
        return {
            x: unitOffset,
            y,
            width: unitThickness,
            height,
        };
    }

    function scaleValue(
        value: number,
        minValue: number,
        maxValue: number,
        chartBounds: AxisBounds,
        chartPlotWidth: number,
        chartPlotHeight: number,
        chartOrientation: BarChartOrientation,
    ) {
        const percent = (value - minValue) / (maxValue - minValue || 1);
        if (chartOrientation === "horizontal") {
            return chartBounds.left + chartPlotWidth * percent;
        }
        return chartBounds.top + chartPlotHeight - chartPlotHeight * percent;
    }

    function resolveCornerFlags(
        chartOrientation: BarChartOrientation,
        start: boolean,
        end: boolean,
        chartMode: BarChartMode,
        index: number,
        count: number,
        splitGap: number,
    ) {
        const isStack = chartMode === "stack" && splitGap <= 0;
        const startRound = isStack ? index === 0 && start : start;
        const endRound = isStack ? index === count - 1 && end : end;
        if (chartOrientation === "horizontal") {
            return {
                tl: startRound,
                bl: startRound,
                tr: endRound,
                br: endRound,
            };
        }
        return { tl: endRound, tr: endRound, br: startRound, bl: startRound };
    }

    function roundedRectPath(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        corners: { tl: boolean; tr: boolean; br: boolean; bl: boolean },
    ) {
        if (width <= 0 || height <= 0) return "";
        const r = Math.min(radius, width / 2, height / 2);
        const tl = corners.tl ? r : 0;
        const tr = corners.tr ? r : 0;
        const br = corners.br ? r : 0;
        const bl = corners.bl ? r : 0;
        return [
            `M ${x + tl} ${y}`,
            `H ${x + width - tr}`,
            tr
                ? `Q ${x + width} ${y} ${x + width} ${y + tr}`
                : `L ${x + width} ${y}`,
            `V ${y + height - br}`,
            br
                ? `Q ${x + width} ${y + height} ${x + width - br} ${y + height}`
                : `L ${x + width} ${y + height}`,
            `H ${x + bl}`,
            bl
                ? `Q ${x} ${y + height} ${x} ${y + height - bl}`
                : `L ${x} ${y + height}`,
            `V ${y + tl}`,
            tl ? `Q ${x} ${y} ${x + tl} ${y}` : `L ${x} ${y}`,
            "Z",
        ].join(" ");
    }

    function resolveCategoryCenter(index: number) {
        if (orientation === "vertical") {
            return (
                bounds.left +
                (plotWidth / Math.max(1, categoryLabels.length)) * (index + 0.5)
            );
        }
        return (
            bounds.top +
            (plotHeight / Math.max(1, categoryLabels.length)) * (index + 0.5)
        );
    }

    function resolveCategoryCellSize() {
        return (
            (orientation === "vertical" ? plotWidth : plotHeight) /
            Math.max(1, categoryLabels.length)
        );
    }

    function resolveCategoryLabelBox(index: number) {
        const width = Math.min(
            plotWidth,
            Math.max(1, categoryLabelWidths[index] ?? 0),
        );
        const idealX = resolveCategoryCenter(index) - width / 2;
        return {
            x: Math.min(
                Math.max(bounds.left, idealX),
                Math.max(bounds.left, bounds.left + plotWidth - width),
            ),
            width,
        };
    }

    function resolveCategoryYLabelBox(index: number) {
        const height = Math.min(plotHeight, CHART_AXIS_LABEL_HEIGHT);
        const idealY = resolveCategoryCenter(index) - height / 2;
        return {
            y: Math.min(
                Math.max(bounds.top, idealY),
                Math.max(bounds.top, bounds.top + plotHeight - height),
            ),
            height,
        };
    }
</script>

<Frame
    bind:element={rootElement}
    class={["snowui-bar-chart", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    role="img"
    aria-label="柱状图"
    {loading}
    {skeleton}
    renderHints={barChartRenderHints}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {...rest}
>
    {@render children?.()}

    <svg
        class="snowui-bar-chart-svg"
        viewBox={`0 0 ${numericWidth} ${numericHeight}`}
        width={numericWidth}
        height={numericHeight}
    >
        {#if effectiveShowXAxis && orientation === "vertical"}
            <g
                bind:this={xAxisMeasureGroup}
                class="snowui-bar-chart-axis-labels"
                visibility="hidden"
                pointer-events="none"
                aria-hidden="true"
            >
                {#each categoryLabels as label}
                    <text data-snowui-axis-measure-label>{label}</text>
                {/each}
            </g>
        {/if}

        {#if effectiveShowXAxis && orientation === "horizontal"}
            <g
                bind:this={xValueAxisMeasureGroup}
                class="snowui-bar-chart-axis-labels"
                visibility="hidden"
                pointer-events="none"
                aria-hidden="true"
            >
                {#each formattedDomainTickLabels as label}
                    <text data-snowui-axis-measure-label>{label}</text>
                {/each}
            </g>
        {/if}

        {#if effectiveShowYAxis}
            <g
                bind:this={yAxisMeasureGroup}
                class="snowui-bar-chart-axis-labels"
                visibility="hidden"
                pointer-events="none"
                aria-hidden="true"
            >
                {#each yAxisLabels as label}
                    <text data-snowui-axis-measure-label>{label}</text>
                {/each}
            </g>
        {/if}

        <defs>
            {#each gradients as gradient}
                {#if gradient}
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
                {/if}
            {/each}
        </defs>

        {#if effectiveShowGrid}
            <g class="snowui-bar-chart-grid">
                {#each gridTicks as tick}
                    {#if orientation === "vertical"}
                        {@const y = scaleValue(
                            tick,
                            safeMin,
                            safeMax,
                            bounds,
                            plotWidth,
                            plotHeight,
                            orientation,
                        )}
                        <line
                            x1={bounds.left}
                            y1={y}
                            x2={numericWidth - bounds.right}
                            y2={y}
                        />
                    {:else}
                        {@const x = scaleValue(
                            tick,
                            safeMin,
                            safeMax,
                            bounds,
                            plotWidth,
                            plotHeight,
                            orientation,
                        )}
                        <line
                            x1={x}
                            y1={bounds.top}
                            x2={x}
                            y2={bounds.top + plotHeight}
                        />
                    {/if}
                {/each}
            </g>
        {/if}

        {#if effectiveShowXAxis}
            {#if orientation === "vertical"}
                <line
                    class="snowui-bar-chart-axis-line"
                    x1={bounds.left}
                    y1={bounds.top + plotHeight}
                    x2={numericWidth - bounds.right}
                    y2={bounds.top + plotHeight}
                />
            {:else}
                <line
                    class="snowui-bar-chart-axis-line"
                    x1={bounds.left}
                    y1={bounds.top + plotHeight}
                    x2={numericWidth - bounds.right}
                    y2={bounds.top + plotHeight}
                />
            {/if}
        {/if}

        <g class="snowui-bar-chart-base-layer" aria-hidden="true">
            {#each bars as item}
                <path
                    class="snowui-bar-chart-bar-base"
                    d={item.fullPath}
                    fill={item.fill}
                    fill-opacity="0.04"
                    pointer-events="none"
                />
            {/each}
        </g>

        <g class="snowui-bar-chart-series-layer">
            {#each bars as item}
                <path
                    class="snowui-bar-chart-bar"
                    d={item.path}
                    fill={item.fill}
                    fill-opacity={item.opacity}
                    pointer-events="none"
                />
            {/each}
        </g>

        <g class="snowui-bar-chart-hit-layer">
            {#each bars as item}
                {@const labelKey = hoverLabelKey(item)}
                <g class="snowui-bar-chart-bar-interaction">
                    <path
                        class="snowui-bar-chart-bar-hit-area"
                        data-active={isBarCellActive(item)
                            ? "true"
                            : undefined}
                        d={item.hitPath}
                        fill="transparent"
                        pointer-events="all"
                        tabindex="0"
                        role="button"
                        aria-label={showHoverPanel ||
                        Boolean(chartGroup?.showHoverPanel?.())
                            ? describeHoverPanelBar(item)
                            : item.ariaLabel}
                        style={`--snowui-bar-chart-hover-overlay-color: ${item.hoverOverlayColor}; --snowui-bar-chart-hover-overlay-opacity: ${item.hoverOverlayOpacity};`}
                        onpointerenter={() =>
                            showBarHoverLabel(item, "pointer")}
                        onpointermove={updateHoverPanelPointer}
                        onpointerleave={() =>
                            hideBarHoverLabel(item, "pointer")}
                        onmouseover={() =>
                            showBarHoverLabel(item, "pointer")}
                        onmouseout={() =>
                            hideBarHoverLabel(item, "pointer")}
                        onfocus={() => showBarHoverLabel(item, "focus")}
                        onblur={() => hideBarHoverLabel(item, "focus")}
                    />
                    {#if effectiveShowHoverLabel && shouldRenderBarHoverLabel(item, labelKey)}
                        <foreignObject
                            x={resolveHoverLabelBoxX(item)}
                            y={resolveHoverLabelBoxY(item)}
                            width={BAR_CHART_HOVER_LABEL_WIDTH}
                            height={BAR_CHART_HOVER_LABEL_HEIGHT}
                            pointer-events="none"
                            overflow="visible"
                        >
                            <Frame
                                class="snowui-bar-chart-hover-label"
                                data-align={orientation === "horizontal"
                                    ? "start"
                                    : "center"}
                                currentState={isBarHoverLabelVisible(
                                    item,
                                    labelKey,
                                )
                                    ? "Appear"
                                    : "Disappear"}
                                whileAppear={BAR_CHART_HOVER_LABEL_APPEAR_MOTION}
                                whileDisappear={BAR_CHART_HOVER_LABEL_DISAPPEAR_MOTION}
                                enableResponsive={false}
                                enableContext={false}
                                enableScaleObserver={false}
                                enableDefaultMotion={false}
                                loading={false}
                                skeleton={false}
                                pointer-events="none"
                                aria-hidden="true"
                                style={`--snowui-bar-chart-hover-label-fill: ${item.labelColor};`}
                            >
                                {item.labelText}
                            </Frame>
                        </foreignObject>
                    {/if}
                </g>
            {/each}
        </g>

        {#if effectiveHoverMode === "cell"}
            <g
                class="snowui-bar-chart-cell-hit-layer"
                role="group"
                aria-label="柱状图数据单元格"
                onpointerleave={() => hideCellHover(effectiveActiveCellIndex ?? -1)}
            >
                {#each categoryLabels as label, index}
                    {@const cellSize = resolveCategoryCellSize()}
                    <rect
                        class="snowui-bar-chart-cell-hit-area"
                        data-active={effectiveActiveCellIndex === index
                            ? "true"
                            : undefined}
                        x={orientation === "vertical"
                            ? resolveCategoryCenter(index) - cellSize / 2
                            : bounds.left}
                        y={orientation === "vertical"
                            ? bounds.top
                            : resolveCategoryCenter(index) - cellSize / 2}
                        width={orientation === "vertical"
                            ? cellSize
                            : plotWidth}
                        height={orientation === "vertical"
                            ? plotHeight
                            : cellSize}
                        fill="transparent"
                        tabindex="0"
                        role="button"
                        aria-label={showHoverPanel ||
                        Boolean(chartGroup?.showHoverPanel?.())
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

        <g class="snowui-bar-chart-axis-labels">
            {#if effectiveShowYAxis}
                {#if orientation === "vertical"}
                    {#each visibleTicks as tick, index}
                        {@const y = scaleValue(
                            tick,
                            safeMin,
                            safeMax,
                            bounds,
                            plotWidth,
                            plotHeight,
                            orientation,
                        )}
                        <text
                            class="snowui-bar-chart-y-label"
                            x={bounds.left - CHART_Y_AXIS_LABEL_GAP}
                            {y}
                            text-anchor="end"
                            dominant-baseline="middle"
                        >
                            {yAxisLabels[index]}
                        </text>
                    {/each}
                {:else}
                    {#each visibleCategoryLabelIndexes as categoryIndex, labelIndex}
                        {@const labelBox = resolveCategoryYLabelBox(categoryIndex)}
                        <foreignObject
                            class="snowui-bar-chart-y-label-cell"
                            x="0"
                            y={labelBox.y}
                            width={Math.max(
                                0,
                                bounds.left - CHART_Y_AXIS_LABEL_GAP,
                            )}
                            height={labelBox.height}
                        >
                            <div class="snowui-bar-chart-y-label-content">
                                {yAxisLabels[labelIndex]}
                            </div>
                        </foreignObject>
                    {/each}
                {/if}
            {/if}

            {#if effectiveShowXAxis}
                {#if orientation === "vertical"}
                    {#each visibleCategoryLabelIndexes as categoryIndex}
                        {@const label = categoryLabels[categoryIndex] ?? String(categoryIndex + 1)}
                        {@const labelBox = resolveCategoryLabelBox(categoryIndex)}
                        <foreignObject
                            class="snowui-bar-chart-x-label-cell"
                            x={labelBox.x}
                            y={bounds.top +
                                plotHeight +
                                CHART_X_AXIS_LABEL_GAP}
                            width={labelBox.width}
                            height={CHART_AXIS_LABEL_HEIGHT}
                        >
                            <div class="snowui-bar-chart-x-label-content">
                                {label}
                            </div>
                        </foreignObject>
                    {/each}
                {:else}
                    {#each visibleTicks as tick}
                        {@const x = scaleValue(
                            tick,
                            safeMin,
                            safeMax,
                            bounds,
                            plotWidth,
                            plotHeight,
                            orientation,
                        )}
                        <text
                            class="snowui-bar-chart-x-value-label"
                            {x}
                            y={bounds.top +
                                plotHeight +
                                CHART_X_AXIS_LABEL_GAP +
                                CHART_AXIS_LABEL_HEIGHT / 2}
                            text-anchor={tick === safeMin
                                ? "start"
                                : tick === safeMax
                                  ? "end"
                                  : "middle"}
                            dominant-baseline="middle"
                        >
                            {(effectiveYTickFormatter ?? formatAxisTick)(tick)}
                        </text>
                    {/each}
                {/if}
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
    :global(:where(.snowui-bar-chart)) {
        --snowui-bar-chart-axis-font-size: 12px;
        --snowui-bar-chart-axis-line-height: 16px;
        --snowui-bar-chart-axis-color: var(--black-40);
        --snowui-bar-chart-grid-color: var(--black-10);
        --snowui-bar-chart-guide-color: var(--black-10);
        --snowui-bar-chart-axis-line-color: var(--black-40);
        --snowui-bar-chart-hover-label-color: var(
            --snowui-bar-chart-hover-label-color-override,
            var(--black-100)
        );

        position: relative;
        display: block;
        flex: none;
        width: var(
            --snowui-bar-chart-width-override,
            var(--snowui-bar-chart-width)
        );
        height: var(
            --snowui-bar-chart-height-override,
            var(--snowui-bar-chart-height)
        );
        color: var(
            --snowui-bar-chart-axis-color-override,
            var(--snowui-bar-chart-axis-color)
        );
    }

    :global(:where(.snowui-bar-chart-svg)) {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    :global(:where(.snowui-bar-chart-grid line)) {
        stroke: var(
            --snowui-bar-chart-grid-color-override,
            var(--snowui-bar-chart-grid-color)
        );
        stroke-width: 0.5;
    }

    :global(:where(.snowui-bar-chart-axis-line)) {
        stroke: var(
            --snowui-bar-chart-axis-line-color-override,
            var(--snowui-bar-chart-axis-line-color)
        );
        stroke-width: 0.5;
    }

    :global(:where(.snowui-bar-chart-bar)) {
        filter: brightness(1);
        transition: filter var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-bar-chart-bar-hit-area)) {
        --snowui-bar-chart-hover-overlay-color: var(--black-100);
        --snowui-bar-chart-hover-overlay-opacity: 4%;

        cursor: pointer;
        color: var(--snowui-bar-chart-hover-overlay-color);
        fill: color-mix(
            in srgb,
            currentColor var(--snowui-hover-overlay-opacity, 0%),
            transparent
        );
        outline: none;
        transition:
            --snowui-hover-overlay-opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            stroke var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-bar-chart-bar-hit-area:hover)) {
        --snowui-hover-overlay-opacity: var(
            --snowui-bar-chart-hover-overlay-opacity
        );
    }

    :global(:where(.snowui-bar-chart-bar-hit-area[data-active="true"])) {
        --snowui-hover-overlay-opacity: var(
            --snowui-bar-chart-hover-overlay-opacity
        );
    }

    :global(:where(.snowui-bar-chart-bar-hit-area:focus-visible)) {
        --snowui-hover-overlay-opacity: var(
            --snowui-bar-chart-hover-overlay-opacity
        );
        stroke: var(--focus, var(--primary, #111111));
        stroke-width: 2;
    }

    :global(:where(.snowui-bar-chart-cell-hit-area)) {
        fill: transparent;
        outline: none;
        pointer-events: all;
        cursor: pointer;
    }

    :global(:where(.snowui-bar-chart-cell-hit-area:focus-visible)) {
        stroke: var(--focus, var(--primary, #111111));
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
    }

    :global(:where(.snowui-bar-chart-hover-label)) {
        color: var(
            --snowui-bar-chart-hover-label-fill,
            var(--snowui-bar-chart-hover-label-color)
        );
        fill: var(
            --snowui-bar-chart-hover-label-fill,
            var(--snowui-bar-chart-hover-label-color)
        );
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
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }

    :global(:where(.snowui-bar-chart-hover-label[data-align="start"])) {
        align-items: center;
        justify-content: flex-start;
        text-align: left;
    }

    :global(:where(.snowui-bar-chart-axis-labels text)) {
        font-family: var(--font, Inter), sans-serif;
        font-size: var(
            --snowui-bar-chart-axis-font-size-override,
            var(--snowui-bar-chart-axis-font-size)
        );
        font-weight: 400;
        line-height: var(--snowui-bar-chart-axis-line-height);
        fill: var(
            --snowui-bar-chart-axis-color-override,
            var(--snowui-bar-chart-axis-color)
        );
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }

    :global(:where(.snowui-bar-chart-x-label-cell)),
    :global(:where(.snowui-bar-chart-y-label-cell)) {
        overflow: hidden;
    }

    :global(:where(.snowui-bar-chart-x-label-content)),
    :global(:where(.snowui-bar-chart-y-label-content)) {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: var(--font, Inter), sans-serif;
        font-size: var(
            --snowui-bar-chart-axis-font-size-override,
            var(--snowui-bar-chart-axis-font-size)
        );
        font-weight: 400;
        line-height: var(--snowui-bar-chart-axis-line-height);
        color: var(
            --snowui-bar-chart-axis-color-override,
            var(--snowui-bar-chart-axis-color)
        );
        font-feature-settings:
            "ss01" 1,
            "cv01" 1;
    }

    :global(:where(.snowui-bar-chart-y-label-content)) {
        justify-content: flex-end;
        padding-right: 0;
    }
</style>
