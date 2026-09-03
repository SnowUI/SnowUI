<!--
  GaugeChart 仪表图组件 (PRO)
  v1.7.0 (2026-09-04)

  职责:渲染具备同色占位层、透明间隔、渐变填充与顺序出现动效的半圆仪表比例图。
  Hover:每个扇区独立完成向外增厚与复位动效;中心标签显示当前项。
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { onDestroy, onMount, tick } from "svelte";
    import { cubicOut } from "svelte/easing";
    import {
        Frame,
        formatPercentLabel as formatSharedPercentLabel,
        getNumberFormat,
        mergeNumberFormatOptions,
        type NumberFormatOptions,
        type RenderHints,
    } from "@snowui-design-system/components";
    import type { MotionConfig } from "@snowui-design-system/components/logic/motion-config";
    import { SECTOR_CHART_MIN_WIDTH, watchSectorChartSize, type SectorChartSize } from "../lib/chart/size";
    import ChartHoverPanel from "../lib/chart/ChartHoverPanel.svelte";
    import { buildArcPath } from "../lib/chart/arc-path";
    import {
        resolveChartColor,
        type ChartColor,
        type ChartColorMode,
        type ChartGradient,
    } from "../lib/chart/colors";
    import {
        buildOpacityMaskColor,
        resolveSegmentAppearanceTimelines,
    } from "../lib/chart/appearance-timeline";
    import { resolveColorGradient } from "../lib/chart/gradients";
    import {
        clamp,
        normalizeAngle,
        polarPoint,
        resolveScaledGeometryValue,
        toCssLength,
        toNumber,
    } from "../lib/chart/geometry";
    import {
        describeChartHoverPanelData,
        type ChartHoverPanelData,
        type ChartHoverPanelPlacement,
        type ChartHoverPanelRow,
        type ChartHoverPanelVariant,
    } from "../lib/chart/hover-panel";

    export type GaugeChartColor = ChartColor;
    export type GaugeChartColorMode = ChartColorMode;
    export type GaugeChartGradient = ChartGradient;

    export interface GaugeChartItem {
        name: string;
        value: number;
        color?: GaugeChartColor;
        percentFormat?: NumberFormatOptions;
    }

    type StartDirection = "left" | "right";
    type AnchorPoint = "top" | "center" | "bottom";
    type ChartHoverMode = "item" | "cell";

    interface Props {
        data?: GaugeChartItem[];
        width?: number | string;
        minWidth?: number | string;
        height?: number | string;
        ringThickness?: number | string;
        cornerRadius?: number | string | "auto";
        separatorWidth?: number | string | "auto";
        colors?: (GaugeChartColor | undefined)[];
        colorMode?: GaugeChartColorMode;
        color?: GaugeChartColor;
        monochromeColor?: GaugeChartColor;
        mutedMonochromeColor?: GaugeChartColor;
        hoverThicknessGrowth?: number | string;
        startDirection?: StartDirection;
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
        maxItems?: number;
        showCenterLabel?: boolean;
        centerTitle?: string;
        centerSubtitle?: string;
        hoverMode?: ChartHoverMode;
        showHoverPanel?: boolean;
        hoverPanelVariant?: ChartHoverPanelVariant;
        hoverPanelPlacement?: ChartHoverPanelPlacement;
        showHoverPanelLabel?: boolean;
        percentFormat?: NumberFormatOptions;
        labelFormatter?: (item: GaugeChartItem, percent: number) => string;
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

    const DEFAULT_DATA: GaugeChartItem[] = [
        { name: "Primary", value: 32 },
        { name: "Growth", value: 24 },
        { name: "Support", value: 18 },
        { name: "Explore", value: 14 },
        { name: "Other", value: 12 },
    ];

    const HOVER_MOTION_DURATION = 300;
    const CENTER_LABEL_MOTION_DURATION = 200;
    const CENTER_LABEL_APPEAR_MOTION: MotionConfig = {
        opacity: [0, 1],
        duration: CENTER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const CENTER_LABEL_DISAPPEAR_MOTION: MotionConfig = {
        opacity: [1, 0],
        duration: CENTER_LABEL_MOTION_DURATION,
        easing: "easeOut",
    };
    const GAUGE_CHART_APPEARANCE_DURATION = 1000;
    const BASE_GEOMETRY_WIDTH = 320;
    const DEFAULT_BASE_CORNER_RADIUS = 4;
    const DEFAULT_BASE_SEPARATOR_WIDTH = 2;
    const CUSTOM_LABEL_SELECTOR =
        '.snowui-gauge-chart-center > [data-as="segment-value"], .snowui-gauge-chart-center > [data-as="segment-name"]';
    const STATIC_CENTER_LABEL_SELECTOR =
        '.snowui-gauge-chart-center > [data-as="center-label"]';
    const paintUid = Math.random().toString(36).slice(2, 9);

    let {
        data = DEFAULT_DATA,
        width = 320,
        minWidth = `${SECTOR_CHART_MIN_WIDTH}px`,
        height = 160,
        ringThickness = 32,
        cornerRadius = "auto",
        separatorWidth = "auto",
        colors = undefined,
        colorMode = "sequence",
        color = undefined,
        monochromeColor = "Primary",
        mutedMonochromeColor = "Black4",
        hoverThicknessGrowth = 4,
        startDirection = "left",
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
        maxItems = 10,
        showCenterLabel = true,
        centerTitle = "",
        centerSubtitle = "",
        hoverMode = "cell",
        showHoverPanel = true,
        hoverPanelVariant = "light",
        hoverPanelPlacement = "pointer",
        showHoverPanelLabel = false,
        percentFormat = undefined,
        labelFormatter,
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
    let bodyElement = $state<HTMLElement>();
    let centerElement = $state<HTMLElement>();
    let displaySize = $state<SectorChartSize>({ width: 0, height: 0, scale: 1 });
    let hoveredIndex = $state<number | null>(null);
    let focusedIndex = $state<number | null>(null);
    let animatedGrowths = $state<number[]>([]);
    let activeAnimationIndexes = $state<number[]>([]);
    let internalAppearanceProgress = $state(0);
    let hasSyncedDefaultAppearanceProgress = $state(false);
    let appearanceFrame = $state<number | null>(null);
    let scrollFrame = $state<number | null>(null);
    let hasAutoPlayed = $state(false);
    let hasCustomCenterLabel = $state(false);
    let hasStaticCenterLabel = $state(false);
    let hoverPanelPointer = $state({ x: 0, y: 0 });
    let mountedCenterLabelLines = $state({ value: "", name: "" });
    let centerLabelUnmountTimer: ReturnType<typeof setTimeout> | null = null;
    let hoverPanelPointerFrame: number | null = null;
    let pendingHoverPanelPointer: { x: number; y: number } | null = null;
    const animationFrames = new Map<number, number>();
    const numberFormatContext = getNumberFormat();

    const numericWidth = $derived(toNumber(width, 320));
    const numericHeight = $derived(toNumber(height, 160));
    const numericRingThickness = $derived(toNumber(ringThickness, 32));
    const numericCornerRadius = $derived(
        resolveScaledGeometryValue(
            cornerRadius,
            numericWidth,
            BASE_GEOMETRY_WIDTH,
            DEFAULT_BASE_CORNER_RADIUS,
        ),
    );
    const numericSeparatorWidth = $derived(
        resolveScaledGeometryValue(
            separatorWidth,
            numericWidth,
            BASE_GEOMETRY_WIDTH,
            DEFAULT_BASE_SEPARATOR_WIDTH,
        ),
    );
    const numericHoverThicknessGrowth = $derived(
        toNumber(hoverThicknessGrowth, 4),
    );
    const centerX = $derived(numericWidth / 2);
    const centerY = $derived(numericHeight - 1);
    const outerRadius = $derived(
        Math.max(
            1,
            Math.min(numericWidth / 2, numericHeight) -
                numericHoverThicknessGrowth -
                1,
        ),
    );
    const innerRadius = $derived(
        Math.max(0, outerRadius - numericRingThickness),
    );
    const chartData = $derived(normalizeData(data, maxItems));
    const total = $derived(chartData.reduce((sum, item) => sum + item.value, 0));
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
    const segmentGrowths = $derived(
        chartData.map((_, index) => animatedGrowths[index] ?? 0),
    );
    const activeIndex = $derived(hoveredIndex ?? focusedIndex);
    const activeItem = $derived(
        activeIndex === null ? undefined : chartData[activeIndex],
    );
    const activePercent = $derived(
        activeItem && total > 0 ? (activeItem.value / total) * 100 : 0,
    );
    const centerLabelLines = $derived.by(() => {
        if (!showCenterLabel || hasStaticCenterLabel) {
            return { value: "", name: "" };
        }
        if (!activeItem) {
            return { value: centerTitle, name: centerSubtitle };
        }
        if (labelFormatter) {
            const [value = "", name = ""] = labelFormatter(
                activeItem,
                activePercent,
            ).split("\n");
            return { value, name };
        }
        return {
            value: formatPercentLabel(activeItem, activePercent),
            name: activeItem.name,
        };
    });
    const hasCenterLabelContent = $derived(
        Boolean(centerLabelLines.value || centerLabelLines.name),
    );
    const segments = $derived(
        buildSegments(
            chartData,
            total,
            centerX,
            centerY,
            outerRadius,
            innerRadius,
            numericCornerRadius,
            numericSeparatorWidth,
            segmentGrowths,
            activeAnimationIndexes,
            effectiveAppearanceProgress,
            startDirection,
            colors,
            colorMode,
            color,
            monochromeColor,
            mutedMonochromeColor,
        ),
    );
    const segmentPaints = $derived(
        segments.map((segment, index) => resolveSegmentPaint(segment, index)),
    );
    const effectiveShowHoverPanel = $derived(
        showHoverPanel || hasStaticCenterLabel,
    );
    const hoverPanelRows = $derived(resolveHoverPanelRows());
    const hoverPanelData = $derived<ChartHoverPanelData | null>(
        !effectiveShowHoverPanel || hoverPanelRows.length === 0
            ? null
            : {
                  label: activeItem?.name,
                  rows: hoverPanelRows,
                  x: hoveredIndex === null && focusedIndex !== null
                      ? (centerX / numericWidth) * (displaySize.width || numericWidth)
                      : hoverPanelPointer.x,
                  y: hoveredIndex === null && focusedIndex !== null
                      ? ((centerY - outerRadius / 2) / numericHeight) * (displaySize.height || numericHeight)
                      : hoverPanelPointer.y,
                  bounds: {
                      left: 0,
                      top: 0,
                      width: displaySize.width || numericWidth,
                      height: displaySize.height || numericHeight,
                  },
                  placement: hoverPanelPlacement,
                  showLabel: showHoverPanelLabel,
              },
    );
    const rootStyle = $derived(
        [
            `--snowui-gauge-chart-width: ${toCssLength(width)}`,
            `--snowui-gauge-chart-height: ${toCssLength(height)}`,
            `--snowui-gauge-chart-ring-thickness: ${toCssLength(ringThickness)}`,
            `--snowui-gauge-chart-corner-radius: ${toCssLength(numericCornerRadius)}`,
            `--snowui-gauge-chart-separator-width: ${toCssLength(numericSeparatorWidth)}`,
            `--snowui-gauge-chart-hover-thickness-growth: ${toCssLength(hoverThicknessGrowth)}`,
            `--snowui-gauge-chart-label-scale: ${numericWidth / BASE_GEOMETRY_WIDTH}`,
            `--snowui-gauge-chart-responsive-scale: ${displaySize.scale}`,
            `--snowui-gauge-chart-max-width: ${enableResponsive ? "100%" : "none"}`,
            `--snowui-gauge-chart-min-width: ${enableResponsive ? toCssLength(minWidth) : "0px"}`,
            `--snowui-gauge-chart-flex-shrink: ${enableResponsive ? 1 : 0}`,
            style,
        ]
            .filter(Boolean)
            .join(";"),
    );
    const gaugeChartRenderHints = $derived({
        variant: renderHints?.variant ?? "rect",
        width: renderHints?.width ?? toCssLength(width),
        height: renderHints?.height ?? toCssLength(height),
        radius: renderHints?.radius ?? "9999px",
    });

    function formatPercentLabel(item: GaugeChartItem, percent: number) {
        return formatSharedPercentLabel(
            percent,
            mergeNumberFormatOptions(
                numberFormatContext,
                percentFormat,
                item.percentFormat,
            ),
        );
    }

    $effect(() => {
        if (!rootElement || !bodyElement) return;
        return watchSectorChartSize(rootElement, bodyElement, (next) => {
            displaySize = next;
        });
    });

    $effect(() => () => {
        animationFrames.forEach((frame) => cancelAnimationFrame(frame));
        animationFrames.clear();
        if (appearanceFrame !== null) cancelAnimationFrame(appearanceFrame);
        if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
        if (centerLabelUnmountTimer !== null) {
            clearTimeout(centerLabelUnmountTimer);
        }
    });

    $effect(() => {
        const hasVisibleLabel = hasCenterLabelContent;
        if (centerLabelUnmountTimer !== null) {
            clearTimeout(centerLabelUnmountTimer);
            centerLabelUnmountTimer = null;
        }
        if (hasVisibleLabel) {
            mountedCenterLabelLines = centerLabelLines;
            return;
        }
        centerLabelUnmountTimer = setTimeout(() => {
            if (!activeItem) {
                mountedCenterLabelLines = { value: "", name: "" };
            }
            centerLabelUnmountTimer = null;
        }, CENTER_LABEL_MOTION_DURATION);
    });

    $effect(() => {
        if (hasSyncedDefaultAppearanceProgress) return;
        internalAppearanceProgress = clamp(defaultAppearanceProgress, 0, 1);
        hasSyncedDefaultAppearanceProgress = true;
    });

    $effect(() => {
        rootElement;
        centerElement;
        children;
        showCenterLabel;
        mountedCenterLabelLines.value;
        mountedCenterLabelLines.name;
        scheduleCustomCenterLabelSync();
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

    function scheduleCustomCenterLabelSync() {
        tick().then(syncCustomCenterLabel);
    }

    function syncCustomCenterLabel() {
        if (!rootElement || !showCenterLabel) {
            hasCustomCenterLabel = false;
            hasStaticCenterLabel = false;
            return;
        }
        const customLabels = Array.from(
            rootElement.querySelectorAll<HTMLElement>(CUSTOM_LABEL_SELECTOR),
        );
        hasStaticCenterLabel = Boolean(
            rootElement.querySelector(STATIC_CENTER_LABEL_SELECTOR),
        );
        hasCustomCenterLabel = customLabels.length > 0;
        for (const label of customLabels) {
            label.classList.add("snowui-chart-center-custom-label");
            const role = label.dataset.as;
            if (role === "segment-value") {
                label.textContent = mountedCenterLabelLines.value;
            }
            if (role === "segment-name") {
                label.textContent = mountedCenterLabelLines.name;
            }
        }
    }

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
        return GAUGE_CHART_APPEARANCE_DURATION;
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

    function normalizeData(items: GaugeChartItem[], limit: number) {
        const safeLimit = Math.min(Math.max(1, Math.floor(limit || 10)), 10);
        const validItems = items
            .filter((item) => Number.isFinite(item.value) && item.value > 0)
            .slice(0, safeLimit);
        return validItems.length > 0 ? validItems : DEFAULT_DATA;
    }

    function setSegmentGrowth(index: number, value: number) {
        animatedGrowths[index] = value;
    }

    function addActiveAnimationIndex(index: number) {
        if (activeAnimationIndexes.includes(index)) return;
        activeAnimationIndexes = [...activeAnimationIndexes, index];
    }

    function removeActiveAnimationIndex(index: number) {
        activeAnimationIndexes = activeAnimationIndexes.filter(
            (item) => item !== index,
        );
    }

    function animateSegmentGrowth(index: number, target: number) {
        // 每个扇区只有一个有效帧链，新目标直接接管当前画面。
        const previousFrame = animationFrames.get(index);
        if (previousFrame !== undefined) cancelAnimationFrame(previousFrame);
        animationFrames.delete(index);
        const startValue = animatedGrowths[index] ?? 0;
        const distance = target - startValue;
        if (target > 0) addActiveAnimationIndex(index);

        const finish = () => {
            setSegmentGrowth(index, target);
            animationFrames.delete(index);
            if (target <= 0) removeActiveAnimationIndex(index);
        };
        if (
            Math.abs(distance) < 0.001 ||
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ) {
            finish();
            return;
        }

        const startedAt = performance.now();
        const step = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / HOVER_MOTION_DURATION);
            setSegmentGrowth(index, startValue + distance * cubicOut(progress));
            if (progress < 1) {
                animationFrames.set(index, requestAnimationFrame(step));
            } else {
                finish();
            }
        };
        animationFrames.set(index, requestAnimationFrame(step));
    }

    function updateActiveSegmentGrowth(previousIndex: number | null) {
        const nextIndex = hoveredIndex ?? focusedIndex;
        if (previousIndex === nextIndex) return;
        if (previousIndex !== null) animateSegmentGrowth(previousIndex, 0);
        if (nextIndex !== null) {
            animateSegmentGrowth(nextIndex, numericHoverThicknessGrowth);
        }
    }

    function handleSegmentEnter(index: number) {
        setHoveredSegmentIndex(index);
    }

    function handleSegmentLeave(index: number) {
        clearHoverPanelPointerFrame();
        if (hoveredIndex === index) setHoveredSegmentIndex(null);
    }

    function handleSegmentFocus(index: number) {
        const previousIndex = hoveredIndex ?? focusedIndex;
        focusedIndex = index;
        updateActiveSegmentGrowth(previousIndex);
    }

    function handleSegmentBlur(index: number) {
        const previousIndex = hoveredIndex ?? focusedIndex;
        if (focusedIndex === index) focusedIndex = null;
        updateActiveSegmentGrowth(previousIndex);
    }

    function setHoveredSegmentIndex(index: number | null) {
        updateChartCursor(index);
        if (hoveredIndex === index) return;
        const previousIndex = hoveredIndex ?? focusedIndex;
        hoveredIndex = index;
        updateActiveSegmentGrowth(previousIndex);
    }

    function updateChartCursor(index: number | null) {
        if (!rootElement) return;
        rootElement.style.cursor = index === null ? "" : "pointer";
    }

    function buildSegments(
        items: GaugeChartItem[],
        sum: number,
        cx: number,
        cy: number,
        outer: number,
        inner: number,
        corner: number,
        separator: number,
        hoverGrowthSizes: number[],
        activeIndexes: number[],
        appearProgress: number,
        direction: StartDirection,
        palette: (GaugeChartColor | undefined)[] | undefined,
        mode: GaugeChartColorMode,
        mainColor: GaugeChartColor | undefined,
        singleColor: GaugeChartColor,
        mutedSingleColor: GaugeChartColor,
    ) {
        if (sum <= 0) return [];
        let cursor = -Math.PI;
        const rawSegments = items.map((item, index) => {
            const rawSpan = (item.value / sum) * Math.PI;
            const start = cursor;
            const end = cursor + rawSpan;
            const color = resolveChartColor(item.color, palette, index, {
                mode,
                count: items.length,
                color: mainColor,
                monochromeColor: singleColor,
                mutedMonochromeColor: mutedSingleColor,
            });
            const segment = {
                item,
                index,
                start,
                end: Math.max(start + 0.001, end),
                rawStart: start,
                rawEnd: end,
                rawSpan,
                color,
                percent: (item.value / sum) * 100,
                strokeWidth: items.length > 1 ? Math.max(0, separator) : 0,
            };
            cursor += rawSpan;
            return segment;
        });
        const localTimelines = resolveGaugeAppearanceTimelines(
            rawSegments.length,
            appearProgress,
            direction,
        );

        return rawSegments.map((segment, index) => {
            const hoverGrowthSize = hoverGrowthSizes[index] ?? 0;
            const isActive =
                activeIndexes.includes(index) || hoverGrowthSize > 0.001;
            const outerSize = isActive ? outer + hoverGrowthSize : outer;
            const path = buildArcPath(
                cx,
                cy,
                outerSize,
                inner,
                segment.start,
                segment.end,
                corner,
                segment.strokeWidth,
            );
            const localTimeline = localTimelines[index] ?? {
                fillProgress: 1,
                opacityProgress: 1,
            };
            const localProgress = localTimeline.fillProgress;
            const reverse = direction === "right";
            const fillStart = reverse
                ? segment.end - (segment.end - segment.start) * localProgress
                : segment.start;
            const fillEnd = reverse
                ? segment.end
                : segment.start + (segment.end - segment.start) * localProgress;
            const scanStart = Math.min(fillStart, fillEnd - 0.001);
            const scanEnd = Math.max(fillStart + 0.001, fillEnd);
            const revealPath =
                localProgress <= 0.001
                    ? ""
                    : buildArcPath(
                          cx,
                          cy,
                          outerSize,
                          inner,
                          scanStart,
                          scanEnd,
                          resolveAppearanceCorner(corner, localProgress),
                      );
            const opacityGradient = buildSegmentGradientCoordinates(
                cx,
                cy,
                Math.max(1, (inner + outerSize) / 2),
                reverse ? segment.end : segment.start,
                reverse ? scanStart : scanEnd,
            );
            return {
                item: segment.item,
                path,
                basePath: path,
                fillPath: path,
                revealPath,
                color: segment.color,
                strokeWidth: segment.strokeWidth,
                opacityGradient,
                opacityTailColor: buildOpacityMaskColor(
                    localTimeline.opacityProgress,
                    0,
                ),
                opacityMidColor: buildOpacityMaskColor(
                    localTimeline.opacityProgress,
                    0.62,
                ),
                percent: segment.percent,
                active: isActive,
                visible: localProgress > 0.001,
                seamStrokeWidth:
                    rawSegments.length > 1 && segment.strokeWidth <= 0
                        ? 0.5
                        : 0,
                rawStart: segment.rawStart,
                rawEnd: segment.rawEnd,
            };
        });
    }

    function resolveGaugeAppearanceTimelines(
        count: number,
        progress: number,
        direction: StartDirection,
    ) {
        const timelineOptions = {
            totalDuration: GAUGE_CHART_APPEARANCE_DURATION,
            opacityMode: "fill" as const,
        };
        if (direction === "left") {
            return resolveSegmentAppearanceTimelines(
                count,
                0,
                progress,
                timelineOptions,
            );
        }
        const ordered = resolveSegmentAppearanceTimelines(
            count,
            0,
            progress,
            timelineOptions,
        );
        return ordered.map((_, index) => ordered[count - index - 1]);
    }

    function buildSegmentGradientCoordinates(
        cx: number,
        cy: number,
        radius: number,
        start: number,
        end: number,
    ) {
        const from = polarPoint(cx, cy, radius, start);
        const to = polarPoint(cx, cy, radius, end);
        return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    }

    function resolveAppearanceCorner(corner: number, progress: number) {
        if (progress >= 0.08) return corner;
        return corner * clamp(progress / 0.08, 0, 1);
    }

    function resolveSegmentPaint(
        segment: {
            color: GaugeChartColor;
            opacityGradient: { x1: number; y1: number; x2: number; y2: number };
            opacityTailColor: string;
            opacityMidColor: string;
        },
        index: number,
    ) {
        const colorGradient = resolveColorGradient(
            segment.color,
            index,
            `snowui-gauge-chart-color-gradient-${paintUid}`,
            numericWidth,
            numericHeight,
        );
        const opacityGradientId = `snowui-gauge-chart-opacity-gradient-${paintUid}-${index}`;
        const opacityMaskId = `snowui-gauge-chart-opacity-mask-${paintUid}-${index}`;
        return {
            fill: colorGradient
                ? `url(#${colorGradient.id})`
                : (segment.color as string),
            colorGradient,
            opacityGradientId,
            opacityMaskId,
            opacityCoordinates: segment.opacityGradient,
            opacityTailColor: segment.opacityTailColor,
            opacityMidColor: segment.opacityMidColor,
        };
    }

    function resolveHoverPanelColorForSegment(index: number, item?: GaugeChartItem) {
        const fill = segmentPaints[index]?.fill;
        if (typeof fill === "string" && !fill.startsWith("url(")) return fill;
        const itemColor = item?.color ?? activeItem?.color;
        if (typeof itemColor === "string") return itemColor;
        return "var(--black-40, #00000066)";
    }

    function resolveHoverPanelColor(index: number) {
        return resolveHoverPanelColorForSegment(index);
    }

    function resolveHoverPanelRows(): ChartHoverPanelRow[] {
        if (!activeItem || activeIndex === null) return [];
        return [
            {
                name: activeItem.name,
                value: formatPercentLabel(activeItem, activePercent),
                color: resolveHoverPanelColor(activeIndex),
            },
        ];
    }

    function describeSegmentHoverPanel(
        item: GaugeChartItem,
        percent: number,
        index: number,
    ) {
        return describeChartHoverPanelData(item.name, [
            {
                name: item.name,
                value: formatPercentLabel(item, percent),
                color: resolveHoverPanelColorForSegment(index, item),
            },
        ]);
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

    function resolvePointerSegmentIndex(event: PointerEvent | MouseEvent) {
        const rect = rootElement?.getBoundingClientRect();
        if (!rect) return null;
        const scaleX = numericWidth / rect.width;
        const scaleY = numericHeight / rect.height;
        const localX = (event.clientX - rect.left) * scaleX;
        const localY = (event.clientY - rect.top) * scaleY;
        const dx = localX - centerX;
        const dy = localY - centerY;
        const radius = Math.hypot(dx, dy);
        const outerHitRadius = outerRadius + numericHoverThicknessGrowth + 1;
        if (radius < innerRadius || radius > outerHitRadius) return null;
        let angle = normalizeAngle(Math.atan2(dy, dx));
        if (angle > 0) angle -= Math.PI * 2;
        const matched = segments.find(
            (segment) => angle >= segment.rawStart && angle <= segment.rawEnd,
        );
        return matched ? segments.indexOf(matched) : null;
    }

    function handleCellPointerMove(event: PointerEvent) {
        updateHoverPanelPointer(event);
        setHoveredSegmentIndex(resolvePointerSegmentIndex(event));
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
</script>

<Frame
    bind:element={rootElement}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {loading}
    {skeleton}
    renderHints={gaugeChartRenderHints}
    class={["snowui-gauge-chart", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    role="img"
    aria-label="仪表图"
    {...rest}
>
    <div bind:this={bodyElement} class="snowui-gauge-chart-body">
        <svg
            class="snowui-gauge-chart-svg"
            viewBox={`0 0 ${numericWidth} ${numericHeight}`}
            aria-hidden="true"
        >
            <defs>
                {#each segmentPaints as paint, index}
                    {#if paint.colorGradient}
                        <linearGradient
                            id={paint.colorGradient.id}
                            gradientUnits="userSpaceOnUse"
                            x1={paint.colorGradient.coordinates.x1}
                            y1={paint.colorGradient.coordinates.y1}
                            x2={paint.colorGradient.coordinates.x2}
                            y2={paint.colorGradient.coordinates.y2}
                        >
                            {#each paint.colorGradient.stops as stop}
                                <stop
                                    offset={stop.offset}
                                    stop-color={stop.color}
                                    stop-opacity={stop.opacity ?? 1}
                                />
                            {/each}
                        </linearGradient>
                    {/if}
                    <linearGradient
                        id={paint.opacityGradientId}
                        gradientUnits="userSpaceOnUse"
                        x1={paint.opacityCoordinates.x1}
                        y1={paint.opacityCoordinates.y1}
                        x2={paint.opacityCoordinates.x2}
                        y2={paint.opacityCoordinates.y2}
                    >
                        <stop offset="0%" stop-color={paint.opacityTailColor} />
                        <stop offset="72%" stop-color={paint.opacityMidColor} />
                        <stop offset="100%" stop-color="white" />
                    </linearGradient>
                    <mask id={paint.opacityMaskId} maskUnits="userSpaceOnUse">
                        <path
                            d={segments[index].revealPath}
                            fill={`url(#${paint.opacityGradientId})`}
                        />
                    </mask>
                {/each}
            </defs>
            {#if showBaseLayer}
                <g class="snowui-gauge-chart-base-layer" aria-hidden="true">
                    {#each segments as segment, index}
                        <path
                            class="snowui-gauge-chart-segment-base"
                            d={segment.basePath}
                            fill={segmentPaints[index].fill}
                            fill-opacity="0.04"
                            stroke={segment.seamStrokeWidth > 0
                                ? segmentPaints[index].fill
                                : "none"}
                            stroke-width={segment.seamStrokeWidth}
                            stroke-opacity="0.04"
                            pointer-events="none"
                        />
                        {#if segment.seamStrokeWidth > 0}
                            <path
                                class="snowui-gauge-chart-segment-seam-blur"
                                d={segment.basePath}
                                fill="none"
                                stroke={segmentPaints[index].fill}
                                stroke-width={segment.seamStrokeWidth}
                                stroke-opacity="0.04"
                                style="filter: blur(0.5px)"
                                pointer-events="none"
                            />
                        {/if}
                    {/each}
                </g>
            {/if}
            <g class="snowui-gauge-chart-fill-layer">
                {#each segments as segment, index}
                    {#if segment.visible}
                        <path
                            class={[
                                "snowui-gauge-chart-segment",
                                "snowui-gauge-chart-segment-fill",
                                segment.active
                                    ? "snowui-gauge-chart-segment-active"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            d={segment.fillPath}
                            fill={segmentPaints[index].fill}
                            stroke={segment.seamStrokeWidth > 0
                                ? segmentPaints[index].fill
                                : "none"}
                            stroke-width={segment.seamStrokeWidth}
                            mask={`url(#${segmentPaints[index].opacityMaskId})`}
                            pointer-events="none"
                        />
                        {#if segment.seamStrokeWidth > 0}
                            <path
                                class="snowui-gauge-chart-segment-seam-blur"
                                d={segment.fillPath}
                                fill="none"
                                stroke={segmentPaints[index].fill}
                                stroke-width={segment.seamStrokeWidth}
                                style="filter: blur(0.5px)"
                                mask={`url(#${segmentPaints[index].opacityMaskId})`}
                                pointer-events="none"
                            />
                        {/if}
                    {/if}
                {/each}
            </g>
            {#if hoverMode === "cell"}
                <rect
                    class="snowui-gauge-chart-cell-hit-area"
                    x="0"
                    y="0"
                    width={numericWidth}
                    height={numericHeight}
                    fill="transparent"
                    pointer-events="all"
                    role="presentation"
                    onpointerenter={handleCellPointerMove}
                    onpointermove={handleCellPointerMove}
                    onpointerleave={() => setHoveredSegmentIndex(null)}
                />
            {/if}
            {#each segments as segment, index}
                <path
                    class="snowui-gauge-chart-segment-hit-area"
                    d={segment.path}
                    fill="transparent"
                    pointer-events={hoverMode === "item" ? "all" : "none"}
                    style="cursor: pointer;"
                    tabindex="0"
                    role="button"
                    aria-label={effectiveShowHoverPanel
                        ? describeSegmentHoverPanel(
                              segment.item,
                              segment.percent,
                              index,
                          )
                        : `${segment.item.name}: ${formatPercentLabel(segment.item, segment.percent)}`}
                    onpointerenter={(event) => {
                        updateHoverPanelPointer(event);
                        handleSegmentEnter(index);
                    }}
                    onpointermove={updateHoverPanelPointer}
                    onpointerleave={() => handleSegmentLeave(index)}
                    onfocus={() => handleSegmentFocus(index)}
                    onblur={() => handleSegmentBlur(index)}
                />
            {/each}
        </svg>

        {#if showCenterLabel}
            <Frame
                bind:element={centerElement}
                class="snowui-gauge-chart-center"
                data-visible={hasCenterLabelContent || hasStaticCenterLabel ? "true" : "false"}
                currentState={hasCenterLabelContent || hasStaticCenterLabel
                    ? "Appear"
                    : "Disappear"}
                whileAppear={CENTER_LABEL_APPEAR_MOTION}
                whileDisappear={CENTER_LABEL_DISAPPEAR_MOTION}
                enableResponsive={false}
                enableContext={false}
                enableScaleObserver={false}
                enableDefaultMotion={false}
                loading={false}
                skeleton={false}
                aria-live="polite"
            >
                {@render children?.()}
                {#if !hasCustomCenterLabel && !hasStaticCenterLabel}
                    {#if mountedCenterLabelLines.value || mountedCenterLabelLines.name}
                        {#if mountedCenterLabelLines.value}
                            <span data-role="value">{mountedCenterLabelLines.value}</span>
                        {/if}
                        {#if mountedCenterLabelLines.name}
                            <span data-role="name">{mountedCenterLabelLines.name}</span>
                        {/if}
                    {/if}
                {/if}
            </Frame>
        {/if}
    </div>

    <ChartHoverPanel
        visible={Boolean(hoverPanelData)}
        rows={hoverPanelData?.rows ?? []}
        label={hoverPanelData?.label ?? ""}
        showLabel={hoverPanelData?.showLabel ?? false}
        x={hoverPanelData?.x ?? 0}
        y={hoverPanelData?.y ?? 0}
        bounds={hoverPanelData?.bounds}
        placement={hoverPanelData?.placement ?? hoverPanelPlacement}
        variant={hoverPanelVariant}
        animated={hoverPanelPlacement === "pointer" ||
            hoverPanelPlacement === "anchor-top"}
    />
</Frame>

<style>
    :global(:where(.snowui-gauge-chart)) {
        --snowui-gauge-chart-width-default: 20rem;
        --snowui-gauge-chart-height-default: 10rem;
        --snowui-gauge-chart-ring-thickness-default: 2rem;
        --snowui-gauge-chart-label-color: var(
            --snowui-gauge-chart-label-color-override,
            var(--black-100)
        );
        --snowui-gauge-chart-label-muted-color: var(
            --snowui-gauge-chart-label-muted-color-override,
            var(--black-40, rgba(0, 0, 0, 0.4))
        );
        --snowui-gauge-chart-label-value-font-size: calc(
            1.125rem * var(--snowui-gauge-chart-label-scale, 1)
        );
        --snowui-gauge-chart-label-name-font-size: calc(
            0.875rem * var(--snowui-gauge-chart-label-scale, 1)
        );
        --snowui-gauge-chart-label-gap: calc(
            0.125rem * var(--snowui-gauge-chart-label-scale, 1)
        );
        --snowui-gauge-chart-label-bottom-offset: 20%;

        position: relative;
        display: inline-grid;
        flex: 0 var(--snowui-gauge-chart-flex-shrink, 1) auto;
        place-items: center;
        --snowui-gauge-chart-body-width: var(
            --snowui-gauge-chart-width-override,
            var(
                --snowui-gauge-chart-width,
                var(--snowui-gauge-chart-width-default)
            )
        );
        --snowui-gauge-chart-body-height: var(
            --snowui-gauge-chart-height-override,
            var(
                --snowui-gauge-chart-height,
                var(--snowui-gauge-chart-height-default)
            )
        );
        width: var(--snowui-gauge-chart-body-width);
        height: calc(var(--snowui-gauge-chart-body-height) * var(--snowui-gauge-chart-responsive-scale, 1));
        min-width: var(--snowui-gauge-chart-min-width);
        min-height: calc(var(--snowui-gauge-chart-body-height) * var(--snowui-gauge-chart-responsive-scale, 1));
        max-width: var(--snowui-gauge-chart-max-width, 100%);
        color: var(--snowui-gauge-chart-label-color);
        line-height: 1;
    }

    :global(:where(.snowui-gauge-chart-body)) {
        position: absolute;
        top: 0;
        left: 0;
        display: grid;
        place-items: center;
        width: var(--snowui-gauge-chart-body-width);
        height: var(--snowui-gauge-chart-body-height);
        transform: scale(var(--snowui-gauge-chart-responsive-scale, 1));
        transform-origin: top left;
    }

    :global(:where(.snowui-gauge-chart-svg)) {
        grid-area: 1 / 1;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    :global(:where(.snowui-gauge-chart-segment)) {
        cursor: pointer;
        outline: none;
        filter: brightness(1);
        transition:
            filter var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-gauge-chart-segment-hit-area)) {
        cursor: pointer;
        outline: none;
    }

    :global(:where(.snowui-gauge-chart-segment-active)) {
        filter: brightness(1.04);
    }

    :global(:where(.snowui-gauge-chart-segment:focus-visible)),
    :global(:where(.snowui-gauge-chart-segment-hit-area:focus-visible)) {
        filter: brightness(1.08);
    }

    :global(:where(.snowui-gauge-chart-center)) {
        grid-area: 1 / 1;
        position: absolute;
        left: 0;
        right: 0;
        bottom: var(--snowui-gauge-chart-label-bottom-offset);
        width: max-content;
        margin-inline: auto;
        pointer-events: none;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--snowui-gauge-chart-label-gap);
        max-width: 56%;
        color: var(--snowui-gauge-chart-label-color);
        text-align: center;
    }

    :global(:where(.snowui-gauge-chart-center [data-role="value"])) {
        color: var(--snowui-gauge-chart-label-color);
        font-size: var(
            --snowui-gauge-chart-label-font-size-override,
            var(--snowui-gauge-chart-label-value-font-size)
        );
        line-height: 1;
        font-weight: var(--snowui-gauge-chart-label-font-weight-override, 700);
    }

    :global(:where(.snowui-gauge-chart-center [data-role="name"])) {
        color: var(--snowui-gauge-chart-label-muted-color);
        font-size: var(--snowui-gauge-chart-label-name-font-size);
        line-height: 1;
        font-weight: var(
            --snowui-gauge-chart-label-muted-font-weight-override,
            400
        );
    }

    :global(:where(.snowui-gauge-chart-center > [data-as="segment-value"])) {
        order: 0;
        color: var(--snowui-gauge-chart-label-color);
        font-size: var(
            --snowui-gauge-chart-label-font-size-override,
            var(--snowui-gauge-chart-label-value-font-size)
        );
        font-weight: var(--snowui-gauge-chart-label-font-weight-override, 700);
        line-height: 1;
    }

    :global(:where(.snowui-gauge-chart-center > [data-as="segment-name"])) {
        order: 1;
        color: var(--snowui-gauge-chart-label-muted-color);
        font-size: var(--snowui-gauge-chart-label-name-font-size);
        font-weight: var(
            --snowui-gauge-chart-label-muted-font-weight-override,
            400
        );
        line-height: 1;
    }

</style>
