<!--
  CircularChart 圆形图表组件 (PRO)
  v1.4.2 (2026-09-05)

  职责:渲染可调圆角、环厚、隔断、尺寸的圆环/饼形比例图。
  Hover:当前扇区仅向外增厚,不位移;中心标签显示当前项。
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
    } from "@snowui-design-system/components";
    import { getSkeleton } from "@snowui-design-system/components/context";
    import type { MotionConfig } from "@snowui-design-system/components/logic/motion-config";
    import { SECTOR_CHART_MIN_WIDTH, watchSectorChartSize, type SectorChartSize } from "../lib/chart/size";
    import ChartHoverPanel from "../lib/chart/ChartHoverPanel.svelte";
    import { buildArcPath } from "../lib/chart/arc-path";
    import {
        resolveChartColor,
        type ChartColor,
        type ChartColorMode,
        type ChartGradient,
        type ChartGradientStop,
    } from "../lib/chart/colors";
    import {
        buildOpacityMaskColor,
        resolveSegmentAppearanceTimelines,
    } from "../lib/chart/appearance-timeline";
    import {
        resolveAppearanceViewportGeometry,
        resolveAppearanceViewportWindows,
    } from "../lib/chart/appearance-viewport";
    import { resolveColorGradient as resolveSharedColorGradient } from "../lib/chart/gradients";
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
    import { createChartPointerFrameScheduler } from "../lib/chart/pointer";

    export type CircularChartColor = ChartColor;
    export type CircularChartColorMode = ChartColorMode;
    export type CircularChartGradient = ChartGradient;
    export type CircularChartGradientStop = ChartGradientStop;

    export interface CircularChartItem {
        name: string;
        value: number;
        color?: CircularChartColor;
        percentFormat?: NumberFormatOptions;
    }

    type StartDirection =
        | "top"
        | "top-right"
        | "right"
        | "bottom-right"
        | "bottom"
        | "bottom-left"
        | "left"
        | "top-left";

    type AnchorPoint = "top" | "center" | "bottom";
    type ChartHoverMode = "item" | "cell";

    interface Props {
        data?: CircularChartItem[];
        size?: number | string;
        minWidth?: number | string;
        ringThickness?: number | string;
        cornerRadius?: number | string | "auto";
        separatorWidth?: number | string | "auto";
        colors?: (CircularChartColor | undefined)[];
        colorMode?: CircularChartColorMode;
        color?: CircularChartColor;
        monochromeColor?: CircularChartColor;
        mutedMonochromeColor?: CircularChartColor;
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
        /** @deprecated 请使用 hoverThicknessGrowth */
        hoverScaleSize?: number | string;
        maxItems?: number;
        showCenterLabel?: boolean;
        hoverMode?: ChartHoverMode;
        showHoverPanel?: boolean;
        hoverPanelVariant?: ChartHoverPanelVariant;
        hoverPanelPlacement?: ChartHoverPanelPlacement;
        showHoverPanelLabel?: boolean;
        percentFormat?: NumberFormatOptions;
        labelFormatter?: (item: CircularChartItem, percent: number) => string;
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

    const DEFAULT_DATA: CircularChartItem[] = [
        { name: "Search Engine", value: 1048 },
        { name: "Direct", value: 735 },
        { name: "Email", value: 580 },
        { name: "Union Ads", value: 484 },
        { name: "Video Ads", value: 300 },
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
    const CIRCULAR_CHART_APPEARANCE_DURATION = 1000;
    const BASE_GEOMETRY_SIZE = 160;
    const DEFAULT_BASE_CORNER_RADIUS = 4;
    const DEFAULT_BASE_SEPARATOR_WIDTH = 2;
    const CUSTOM_LABEL_SELECTOR =
        '.snowui-circular-chart-center > [data-as="segment-value"], .snowui-circular-chart-center > [data-as="segment-name"]';
    const STATIC_CENTER_LABEL_SELECTOR =
        '.snowui-circular-chart-center > [data-as="center-label"]';
    const paintUid = Math.random().toString(36).slice(2, 9);

    let {
        data = DEFAULT_DATA,
        size = 240,
        minWidth = `${SECTOR_CHART_MIN_WIDTH}px`,
        ringThickness = 32,
        cornerRadius = "auto",
        separatorWidth = "auto",
        colors = undefined,
        colorMode = "sequence",
        color = undefined,
        monochromeColor = "Primary",
        mutedMonochromeColor = "Black4",
        hoverThicknessGrowth = undefined,
        startDirection = "top",
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
        hoverScaleSize = undefined,
        maxItems = 10,
        showCenterLabel = true,
        hoverMode = "cell",
        showHoverPanel = true,
        hoverPanelVariant = "light",
        hoverPanelPlacement = "pointer",
        showHoverPanelLabel = false,
        percentFormat = undefined,
        labelFormatter,
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
    let bodyElement = $state<HTMLElement>();
    let displaySize = $state<SectorChartSize>({ width: 0, height: 0, scale: 1 });
    let centerElement = $state<HTMLElement>();
    let hoveredIndex = $state<number | null>(null);
    let focusedIndex = $state<number | null>(null);
    let animatedGrowths = $state<number[]>([]);
    let activeAnimationIndexes = $state<number[]>([]);
    let internalAppearanceProgress = $state(0);
    let hasSyncedDefaultAppearanceProgress = $state(false);
    let appearanceFrame = $state<number | null>(null);
    let scrollFrame = $state<number | null>(null);
    let hasAutoPlayed = $state(false);
    let wasEffectivelyLoading = $state(false);
    let prefersReducedAppearanceMotion = false;
    let hasCustomCenterLabel = $state(false);
    let hasStaticCenterLabel = $state(false);
    let hoverPanelPointer = $state({ x: 0, y: 0 });
    let mountedCenterLabelLines = $state({ value: "", name: "" });
    let centerLabelUnmountTimer: ReturnType<typeof setTimeout> | null = null;
    const hoverPanelPointerScheduler = createChartPointerFrameScheduler(
        () => rootElement,
        (position) => {
            hoverPanelPointer = { x: position.x, y: position.y };
            if (hoverMode === "cell") {
                setHoveredSegmentIndex(resolvePointerSegmentIndex(position));
            }
        },
    );
    const animationFrames = new Map<number, number>();
    const numberFormatContext = getNumberFormat();

    const numericSize = $derived(toNumber(size, 240));
    const numericRingThickness = $derived(toNumber(ringThickness, 32));
    const numericCornerRadius = $derived(
        resolveScaledGeometryValue(
            cornerRadius,
            numericSize,
            BASE_GEOMETRY_SIZE,
            DEFAULT_BASE_CORNER_RADIUS,
        ),
    );
    const numericSeparatorWidth = $derived(
        resolveScaledGeometryValue(
            separatorWidth,
            numericSize,
            BASE_GEOMETRY_SIZE,
            DEFAULT_BASE_SEPARATOR_WIDTH,
        ),
    );
    const numericHoverThicknessGrowth = $derived(
        toNumber(hoverThicknessGrowth ?? hoverScaleSize ?? 4, 4),
    );
    const center = $derived(numericSize / 2);
    const outerRadius = $derived(
        numericSize / 2 - numericHoverThicknessGrowth - 1,
    );
    const innerRadius = $derived(
        Math.max(0, outerRadius - numericRingThickness),
    );
    const chartData = $derived(normalizeData(data, maxItems));
    const total = $derived(
        chartData.reduce((sum, item) => sum + item.value, 0),
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
        if (!showCenterLabel || hasStaticCenterLabel || !activeItem) {
            return { value: "", name: "" };
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
    const segments = $derived(
        buildSegments(
            chartData,
            total,
            center,
            outerRadius,
            innerRadius,
            numericCornerRadius,
            segmentGrowths,
            activeAnimationIndexes,
            effectiveAppearanceProgress,
            startDirection,
            numericSeparatorWidth,
            colors,
            colorMode,
            color,
            monochromeColor,
            mutedMonochromeColor,
        ),
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
                      ? (0.5) * (displaySize.width || numericSize)
                      : hoverPanelPointer.x,
                  y: hoveredIndex === null && focusedIndex !== null
                      ? (0.5) * (displaySize.height || numericSize)
                      : hoverPanelPointer.y,
                  bounds: {
                      left: 0,
                      top: 0,
                      width: displaySize.width || numericSize,
                      height: displaySize.height || numericSize,
                  },
                  placement: hoverPanelPlacement,
                  showLabel: showHoverPanelLabel,
              },
    );
    const segmentPaints = $derived(
        segments.map((segment, index) => resolveSegmentPaint(segment, index)),
    );
    const rootStyle = $derived(
        [
            `--snowui-circular-chart-size: ${toCssLength(size)}`,
            `--snowui-circular-chart-ring-thickness: ${toCssLength(ringThickness)}`,
            `--snowui-circular-chart-corner-radius: ${toCssLength(numericCornerRadius)}`,
            `--snowui-circular-chart-separator-width: ${toCssLength(numericSeparatorWidth)}`,
            `--snowui-circular-chart-hover-thickness-growth: ${toCssLength(hoverThicknessGrowth ?? hoverScaleSize ?? 4)}`,
            `--snowui-circular-chart-label-scale: ${numericSize / BASE_GEOMETRY_SIZE}`,
            `--snowui-circular-chart-responsive-scale: ${displaySize.scale}`,
            `--snowui-circular-chart-max-width: ${enableResponsive ? "100%" : "none"}`,
            `--snowui-circular-chart-min-width: ${enableResponsive ? toCssLength(minWidth) : "0px"}`,
            `--snowui-circular-chart-flex-shrink: ${enableResponsive ? 1 : 0}`,
            style,
        ]
            .filter(Boolean)
            .join(";"),
    );

    function formatPercentLabel(
        item: CircularChartItem,
        percent: number,
    ) {
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
        const hasVisibleLabel =
            Boolean(activeItem) &&
            (Boolean(centerLabelLines.value) || Boolean(centerLabelLines.name));
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
        return CIRCULAR_CHART_APPEARANCE_DURATION;
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

    function normalizeData(items: CircularChartItem[], limit: number) {
        const safeLimit = Math.min(Math.max(1, Math.floor(limit || 10)), 10);
        const validItems = items
            .filter((item) => Number.isFinite(item.value) && item.value > 0)
            .slice(0, safeLimit);
        return validItems;
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
        items: CircularChartItem[],
        sum: number,
        centerPoint: number,
        outer: number,
        inner: number,
        corner: number,
        hoverGrowthSizes: number[],
        activeIndexes: number[],
        appearProgress: number,
        direction: StartDirection,
        separator: number,
        palette: (CircularChartColor | undefined)[] | undefined,
        mode: CircularChartColorMode,
        mainColor: CircularChartColor | undefined,
        singleColor: CircularChartColor,
        mutedSingleColor: CircularChartColor,
    ) {
        if (sum <= 0) return [];
        let cursor = -Math.PI / 2;
        const rawSegments = items.map((item, index) => {
            const rawSpan = (item.value / sum) * Math.PI * 2;
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
                rawStart: cursor,
                rawEnd: cursor + rawSpan,
                rawSpan,
                color,
                percent: (item.value / sum) * 100,
                strokeWidth: items.length > 1 ? Math.max(0, separator) : 0,
            };
            cursor += rawSpan;
            return segment;
        });
        const startIndex = resolveStartSegmentIndex(rawSegments, direction);
        const localTimelines = resolveSegmentAppearanceTimelines(
            rawSegments.length,
            startIndex,
            appearProgress,
            {
                totalDuration: CIRCULAR_CHART_APPEARANCE_DURATION,
                opacityMode: "fill",
            },
        );

        return rawSegments.map((segment, index) => {
            const hoverGrowthSize = hoverGrowthSizes[index] ?? 0;
            const isActive =
                activeIndexes.includes(index) || hoverGrowthSize > 0.001;
            const outerSize = isActive ? outer + hoverGrowthSize : outer;
            const path = buildArcPath(
                centerPoint,
                centerPoint,
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
            const fillEnd =
                segment.start + (segment.end - segment.start) * localProgress;
            const scanEnd = Math.max(segment.start + 0.001, fillEnd);
            const revealPath =
                localProgress <= 0.001
                    ? ""
                    : buildArcPath(
                          centerPoint,
                          centerPoint,
                          outerSize,
                          inner,
                          segment.start,
                          Math.max(segment.start + 0.001, fillEnd),
                          resolveAppearanceCorner(corner, localProgress),
                      );
            const opacityGradient = buildSegmentGradientCoordinates(
                centerPoint,
                centerPoint,
                Math.max(1, (inner + outerSize) / 2),
                segment.start,
                scanEnd,
            );
            return {
                item: segment.item,
                path,
                fillPath: path,
                revealPath,
                color: segment.color,
                strokeWidth: segment.strokeWidth,
                basePath: path,
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
                localProgress,
                seamStrokeWidth:
                    rawSegments.length > 1 &&
                    segment.strokeWidth <= 0
                        ? 0.5
                        : 0,
                rawStart: segment.rawStart,
                rawEnd: segment.rawEnd,
            };
        });
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

    function directionToAngle(direction: StartDirection) {
        const map: Record<StartDirection, number> = {
            top: -Math.PI / 2,
            "top-right": -Math.PI / 4,
            right: 0,
            "bottom-right": Math.PI / 4,
            bottom: Math.PI / 2,
            "bottom-left": (Math.PI * 3) / 4,
            left: Math.PI,
            "top-left": (-Math.PI * 3) / 4,
        };
        return normalizeAngle(map[direction] ?? map.top);
    }

    function resolveSegmentPaint(
        segment: {
            color: CircularChartColor;
            opacityGradient: { x1: number; y1: number; x2: number; y2: number };
            opacityTailColor: string;
            opacityMidColor: string;
        },
        index: number,
    ) {
        const colorGradient = resolveSharedColorGradient(
            segment.color,
            index,
            `snowui-circular-chart-color-gradient-${paintUid}`,
            numericSize,
        );
        const opacityGradientId = `snowui-circular-chart-opacity-gradient-${paintUid}-${index}`;
        const opacityMaskId = `snowui-circular-chart-opacity-mask-${paintUid}-${index}`;
        const basePaintMaskId = `snowui-circular-chart-base-paint-mask-${paintUid}-${index}`;
        const fillPaintMaskId = `snowui-circular-chart-fill-paint-mask-${paintUid}-${index}`;
        return {
            fill: colorGradient
                ? `url(#${colorGradient.id})`
                : (segment.color as string),
            colorGradient,
            opacityGradientId,
            opacityMaskId,
            basePaintMaskId,
            fillPaintMaskId,
            opacityCoordinates: segment.opacityGradient,
            opacityTailColor: segment.opacityTailColor,
            opacityMidColor: segment.opacityMidColor,
        };
    }

    function isAngleInArc(angle: number, start: number, end: number) {
        // 完整圆周归一化后起止角相同，但所有方向都属于这个扇区。
        if (end - start >= Math.PI * 2) return true;
        const normalizedAngle = normalizeAngle(angle);
        const normalizedStart = normalizeAngle(start);
        const normalizedEnd = normalizeAngle(end);
        if (normalizedStart <= normalizedEnd) {
            return (
                normalizedAngle >= normalizedStart &&
                normalizedAngle <= normalizedEnd
            );
        }
        return (
            normalizedAngle >= normalizedStart ||
            normalizedAngle <= normalizedEnd
        );
    }

    function resolveStartSegmentIndex(
        items: { rawStart: number; rawEnd: number }[],
        direction: StartDirection,
    ) {
        const angle = directionToAngle(direction);
        const matched = items.find((item) =>
            isAngleInArc(angle, item.rawStart, item.rawEnd),
        );
        return matched ? items.indexOf(matched) : 0;
    }

    function resolveHoverPanelColorForSegment(
        index: number,
        item?: CircularChartItem,
    ) {
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
        item: CircularChartItem,
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
        hoverPanelPointerScheduler.schedule(event);
    }

    function resolvePointerSegmentIndex(position: {
        x: number;
        y: number;
        width: number;
        height: number;
    }) {
        const scaleX = numericSize / position.width;
        const scaleY = numericSize / position.height;
        const localX = position.x * scaleX;
        const localY = position.y * scaleY;
        const dx = localX - center;
        const dy = localY - center;
        const radius = Math.hypot(dx, dy);
        const outerHitRadius = outerRadius + numericHoverThicknessGrowth + 1;
        if (radius < innerRadius || radius > outerHitRadius) return null;
        const angle = Math.atan2(dy, dx);
        const matched = segments.find((segment) =>
            isAngleInArc(angle, segment.rawStart, segment.rawEnd),
        );
        return matched ? segments.indexOf(matched) : null;
    }

    function handleCellPointerMove(event: PointerEvent) {
        updateHoverPanelPointer(event);
    }

    onDestroy(() => {
        clearHoverPanelPointerFrame();
    });

    function clearHoverPanelPointerFrame() {
        hoverPanelPointerScheduler.clear();
    }
</script>

<Frame
    bind:element={rootElement}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {...rest}
    {loading}
    skeleton={false}
    class={["snowui-circular-chart", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    role="img"
    aria-label="圆形图表"
>
    <div bind:this={bodyElement} class="snowui-circular-chart-body">
        <svg
            class="snowui-circular-chart-svg"
            viewBox={`0 0 ${numericSize} ${numericSize}`}
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
                        <stop
                            offset="0%"
                            stop-color={paint.opacityTailColor}
                            stop-opacity="1"
                        />
                        <stop
                            offset="72%"
                            stop-color={paint.opacityMidColor}
                            stop-opacity="1"
                        />
                        <stop
                            offset="100%"
                            stop-color="white"
                            stop-opacity="1"
                        />
                    </linearGradient>
                    <mask id={paint.opacityMaskId} maskUnits="userSpaceOnUse">
                        <path
                            d={segments[index].revealPath}
                            fill={`url(#${paint.opacityGradientId})`}
                        />
                    </mask>
                    {#if segments[index].seamStrokeWidth > 0}
                        <mask
                            id={paint.basePaintMaskId}
                            maskUnits="userSpaceOnUse"
                            style="mask-type: alpha"
                        >
                            <path
                                d={segments[index].basePath}
                                fill="white"
                                stroke="white"
                                stroke-width={segments[index].seamStrokeWidth}
                            />
                            <path
                                class="snowui-circular-chart-segment-seam-blur"
                                d={segments[index].basePath}
                                fill="none"
                                stroke="white"
                                stroke-width={segments[index].seamStrokeWidth}
                                style="filter: blur(0.5px)"
                            />
                        </mask>
                        <mask
                            id={paint.fillPaintMaskId}
                            maskUnits="userSpaceOnUse"
                            style="mask-type: alpha"
                        >
                            {#if innerRadius <= 0.001}
                                <path
                                    d={segments[index].revealPath}
                                    fill="white"
                                    stroke="white"
                                    stroke-width={segments[index].seamStrokeWidth}
                                />
                                <path
                                    class="snowui-circular-chart-segment-seam-blur"
                                    d={segments[index].revealPath}
                                    fill="none"
                                    stroke="white"
                                    stroke-width={segments[index].seamStrokeWidth}
                                    style="filter: blur(0.5px)"
                                />
                            {:else}
                                <g mask={`url(#${paint.opacityMaskId})`}>
                                    <path
                                        d={segments[index].fillPath}
                                        fill="white"
                                        stroke="white"
                                        stroke-width={segments[index].seamStrokeWidth}
                                    />
                                    <path
                                        class="snowui-circular-chart-segment-seam-blur"
                                        d={segments[index].fillPath}
                                        fill="none"
                                        stroke="white"
                                        stroke-width={segments[index].seamStrokeWidth}
                                        style="filter: blur(0.5px)"
                                    />
                                </g>
                            {/if}
                        </mask>
                    {/if}
                {/each}
            </defs>
            {#if showBaseLayer}
                <g class="snowui-circular-chart-base-layer" aria-hidden="true">
                    {#each segments as segment, index}
                        {#if segment.seamStrokeWidth > 0}
                            <path
                                class="snowui-circular-chart-segment-base"
                                d={segment.basePath}
                                fill="transparent"
                                fill-opacity="0.04"
                                stroke="none"
                                pointer-events="none"
                            />
                            <rect
                                class="snowui-circular-chart-segment-base-paint"
                                x="0"
                                y="0"
                                width={numericSize}
                                height={numericSize}
                                fill={segmentPaints[index].fill}
                                fill-opacity="0.04"
                                mask={`url(#${segmentPaints[index].basePaintMaskId})`}
                                pointer-events="none"
                            />
                        {:else}
                            <path
                                class="snowui-circular-chart-segment-base"
                                d={segment.basePath}
                                fill={segmentPaints[index].fill}
                                fill-opacity="0.04"
                                stroke="none"
                                pointer-events="none"
                            />
                        {/if}
                    {/each}
                </g>
            {/if}
            <g class="snowui-circular-chart-fill-layer">
                {#each segments as segment, index}
                    {#if segment.visible}
                        {#if segment.seamStrokeWidth > 0}
                            <path
                                class={[
                                    "snowui-circular-chart-segment",
                                    "snowui-circular-chart-segment-fill",
                                    segment.active
                                        ? "snowui-circular-chart-segment-active"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                                d={segment.fillPath}
                                fill="transparent"
                                stroke="none"
                                pointer-events="none"
                            />
                            <rect
                                class="snowui-circular-chart-segment-paint"
                                x="0"
                                y="0"
                                width={numericSize}
                                height={numericSize}
                                fill={segmentPaints[index].fill}
                                mask={`url(#${segmentPaints[index].fillPaintMaskId})`}
                                pointer-events="none"
                            />
                        {:else}
                            {#if innerRadius <= 0.001}
                                <path
                                    class={[
                                        "snowui-circular-chart-segment",
                                        "snowui-circular-chart-segment-fill",
                                        segment.active
                                            ? "snowui-circular-chart-segment-active"
                                            : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    d={segment.revealPath}
                                    fill={segmentPaints[index].fill}
                                    stroke="none"
                                    pointer-events="none"
                                />
                            {:else}
                                <path
                                    class={[
                                        "snowui-circular-chart-segment",
                                        "snowui-circular-chart-segment-fill",
                                        segment.active
                                            ? "snowui-circular-chart-segment-active"
                                            : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    d={segment.fillPath}
                                    fill={segmentPaints[index].fill}
                                    stroke="none"
                                    mask={`url(#${segmentPaints[index].opacityMaskId})`}
                                    pointer-events="none"
                                />
                            {/if}
                        {/if}
                    {/if}
                {/each}
            </g>
            {#if hoverMode === "cell"}
                <rect
                    class="snowui-circular-chart-cell-hit-area"
                    x="0"
                    y="0"
                    width={numericSize}
                    height={numericSize}
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
                    class="snowui-circular-chart-segment-hit-area"
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
                class="snowui-circular-chart-center"
                data-visible={activeItem || hasStaticCenterLabel ? "true" : "false"}
                currentState={activeItem || hasStaticCenterLabel
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
                        <span data-role="value">{mountedCenterLabelLines.value}</span>
                        <span data-role="name">{mountedCenterLabelLines.name}</span>
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
    :global(:where(.snowui-circular-chart)) {
        --snowui-circular-chart-size-default: var(--size-20);
        --snowui-circular-chart-ring-thickness-default: var(--size-6);
        --snowui-circular-chart-corner-radius-default: var(--radius-3);
        --snowui-circular-chart-separator-width-default: var(--border-4);
        --snowui-circular-chart-hover-thickness-growth-default: var(
            --padding-1
        );
        --snowui-circular-chart-label-color: var(
            --snowui-circular-chart-label-color-override,
            var(--black-100)
        );
        --snowui-circular-chart-label-muted-color: var(
            --snowui-circular-chart-label-muted-color-override,
            var(--black-40, rgba(0, 0, 0, 0.4))
        );
        --snowui-circular-chart-label-value-font-size: calc(
            0.875rem * var(--snowui-circular-chart-label-scale, 1)
        );
        --snowui-circular-chart-label-name-font-size: calc(
            0.75rem * var(--snowui-circular-chart-label-scale, 1)
        );
        --snowui-circular-chart-label-gap: calc(
            0.125rem * var(--snowui-circular-chart-label-scale, 1)
        );

        position: relative;
        display: inline-grid;
        flex: 0 var(--snowui-circular-chart-flex-shrink, 1) auto;
        place-items: center;
        --snowui-circular-chart-body-width: var(
            --snowui-circular-chart-size-override,
            var(
                --snowui-circular-chart-size,
                var(--snowui-circular-chart-size-default)
            )
        );
        --snowui-circular-chart-body-height: var(
            --snowui-circular-chart-size-override,
            var(
                --snowui-circular-chart-size,
                var(--snowui-circular-chart-size-default)
            )
        );
        width: var(--snowui-circular-chart-body-width);
        height: calc(var(--snowui-circular-chart-body-height) * var(--snowui-circular-chart-responsive-scale, 1));
        min-width: var(--snowui-circular-chart-min-width);
        min-height: calc(var(--snowui-circular-chart-body-height) * var(--snowui-circular-chart-responsive-scale, 1));
        max-width: var(--snowui-circular-chart-max-width, 100%);
        color: var(--snowui-circular-chart-label-color);
        line-height: 1;
    }

    :global(:where(.snowui-circular-chart-body)) {
        position: absolute;
        top: 0;
        left: 0;
        display: grid;
        place-items: center;
        width: var(--snowui-circular-chart-body-width);
        height: var(--snowui-circular-chart-body-height);
        transform: scale(var(--snowui-circular-chart-responsive-scale, 1));
        transform-origin: top left;
    }

    :global(:where(.snowui-circular-chart-svg)) {
        grid-area: 1 / 1;
        width: 100%;
        height: 100%;
        overflow: visible;
    }

    :global(:where(.snowui-circular-chart-segment)) {
        cursor: pointer;
        outline: none;
        transform-box: fill-box;
        transform-origin: center;
        filter: brightness(1);
        transition: filter var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-circular-chart-segment-hit-area)) {
        cursor: pointer;
        outline: none;
    }

    :global(:where(.snowui-circular-chart-segment-active)) {
        filter: brightness(1.04);
    }

    :global(:where(.snowui-circular-chart-segment:focus-visible)),
    :global(:where(.snowui-circular-chart-segment-hit-area:focus-visible)) {
        filter: brightness(1.08);
    }

    :global(:where(.snowui-circular-chart-center)) {
        grid-area: 1 / 1;
        pointer-events: none;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--snowui-circular-chart-label-gap);
        max-width: 56%;
        color: var(--snowui-circular-chart-label-color);
        text-align: center;
    }

    :global(:where(.snowui-circular-chart-center [data-role="value"])) {
        color: var(--snowui-circular-chart-label-color);
        font-size: var(
            --snowui-circular-chart-label-font-size-override,
            var(--snowui-circular-chart-label-value-font-size)
        );
        line-height: 1;
        font-weight: var(
            --snowui-circular-chart-label-font-weight-override,
            600
        );
    }

    :global(:where(.snowui-circular-chart-center [data-role="name"])) {
        color: var(--snowui-circular-chart-label-muted-color);
        font-size: var(--snowui-circular-chart-label-name-font-size);
        line-height: 1;
        font-weight: var(
            --snowui-circular-chart-label-muted-font-weight-override,
            400
        );
    }

    :global(:where(.snowui-circular-chart-center > [data-as="center-label"]:has(> [data-as="segment-value"], > [data-as="segment-name"]))) {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: inherit;
        text-align: center;
    }

    :global(
        :where(.snowui-circular-chart-center > [data-as="segment-value"], .snowui-circular-chart-center > [data-as="center-label"] > [data-as="segment-value"])
    ) {
        order: 0;
        align-self: center;
        text-align: center;
        color: var(--snowui-circular-chart-label-color);
        font-size: var(
            --snowui-circular-chart-label-font-size-override,
            var(--snowui-circular-chart-label-value-font-size)
        );
        font-weight: var(
            --snowui-circular-chart-label-font-weight-override,
            600
        );
        line-height: 1;
    }

    :global(:where(.snowui-circular-chart-center > [data-as="segment-name"], .snowui-circular-chart-center > [data-as="center-label"] > [data-as="segment-name"])) {
        order: 1;
        align-self: center;
        text-align: center;
        color: var(--snowui-circular-chart-label-muted-color);
        font-size: var(--snowui-circular-chart-label-name-font-size);
        font-weight: var(
            --snowui-circular-chart-label-muted-font-weight-override,
            400
        );
        line-height: 1;
    }

</style>
