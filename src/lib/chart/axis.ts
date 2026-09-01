export type ChartXAxisMode = "edge" | "cell";

export const CHART_Y_AXIS_LABEL_GAP = 12;
export const CHART_AXIS_LABEL_HEIGHT = 16;
export const CHART_X_AXIS_LABEL_GAP = 8;
export const CHART_X_AXIS_RESERVED_HEIGHT =
    CHART_X_AXIS_LABEL_GAP + CHART_AXIS_LABEL_HEIGHT;
export const CHART_PLOT_EDGE_GAP = 8;
export const CHART_HOVER_LABEL_GAP = 4;
export const CHART_HOVER_LABEL_HEIGHT = 16;

export interface CartesianChartTopInsetOptions {
    showYAxis?: boolean;
    showHoverLabel?: boolean;
    markExtent?: number;
}

/**
 * Resolve the smallest safe top inset for Cartesian chart content.
 *
 * The inset is content-aware: ordinary marks keep an 8px edge gap, the
 * highest Y-axis label reserves half of its 16px line box plus that gap, and
 * a value label additionally reserves its 16px line box and 4px mark gap.
 */
export function resolveCartesianChartTopInset({
    showYAxis = false,
    showHoverLabel = false,
    markExtent = 0,
}: CartesianChartTopInsetOptions = {}) {
    const safeMarkExtent = Number.isFinite(markExtent)
        ? Math.max(0, Number(markExtent))
        : 0;
    const markInset = CHART_PLOT_EDGE_GAP + safeMarkExtent;
    const yAxisInset = showYAxis
        ? CHART_PLOT_EDGE_GAP + CHART_AXIS_LABEL_HEIGHT / 2
        : 0;
    const hoverLabelInset = showHoverLabel
        ? CHART_PLOT_EDGE_GAP +
          CHART_HOVER_LABEL_HEIGHT +
          CHART_HOVER_LABEL_GAP +
          safeMarkExtent
        : 0;
    return Math.ceil(Math.max(markInset, yAxisInset, hoverLabelInset));
}

export function resolveCategoryLabels(
    fallbackLabels: string[],
    overrideLabels: string[],
) {
    return fallbackLabels.map(
        (label, index) => overrideLabels[index] ?? label ?? String(index + 1),
    );
}

export function resolveIndexedLabels(labels: string[], count: number) {
    return Array.from(
        { length: Math.max(1, count) },
        (_, index) => labels[index] ?? String(index + 1),
    );
}

export function resolveXLabelCellWidth(
    plotWidth: number,
    count: number,
    mode: ChartXAxisMode,
    minWidth = 20,
) {
    const safeCount = Math.max(1, count);
    if (mode === "edge" && safeCount > 1) {
        return Math.max(minWidth, plotWidth / (safeCount - 1));
    }
    return Math.max(minWidth, plotWidth / safeCount);
}

export function resolveVisibleCategoryIndexes(
    labels: string[],
    availableSize: number,
    autoCull: boolean,
    maxLabelCount: number | undefined,
    measuredWidths?: number[],
    minGap = 4,
) {
    const count = labels.length;
    if (count === 0) return [];
    const explicitMaxCount = resolveMaxLabelCount(maxLabelCount, count);
    let indexes = sampleIndexes(count, explicitMaxCount);
    if (!autoCull) return indexes;
    if (measuredWidths?.length === count) {
        for (let iteration = 0; iteration < count; iteration += 1) {
            if (
                canFitCategoryLabels(
                    indexes,
                    measuredWidths,
                    availableSize,
                    count,
                    minGap,
                )
            ) {
                return indexes;
            }
            if (indexes.length <= 2) return [];
            const nextIndexes = sampleIndexes(count, indexes.length - 1);
            if (isSameIndexes(indexes, nextIndexes)) return [];
            indexes = nextIndexes;
        }
        return [];
    }
    if (count <= 2) return indexes;
    for (let iteration = 0; iteration < count; iteration += 1) {
        const cellSize = availableSize / Math.max(1, indexes.length);
        const maxLabelWidth = resolveMaxLabelWidth(labels, indexes);
        if (Math.max(20, maxLabelWidth) <= cellSize || indexes.length <= 2) {
            return indexes;
        }
        const nextIndexes = sampleIndexes(
            count,
            Math.max(
                2,
                Math.floor(availableSize / Math.max(20, maxLabelWidth)),
            ),
        );
        if (isSameIndexes(indexes, nextIndexes)) return indexes;
        indexes = nextIndexes;
    }
    return indexes;
}

export function resolveVisibleXIndexes(
    labels: string[],
    plotWidth: number,
    mode: ChartXAxisMode,
    autoCull: boolean,
    maxLabelCount: number | undefined,
    measuredWidths?: number[],
    minGap = 4,
) {
    const count = labels.length;
    if (count === 0) return [];

    const explicitMaxCount = resolveMaxLabelCount(maxLabelCount, count);
    let indexes = sampleIndexes(count, explicitMaxCount);
    if (!autoCull) return indexes;

    for (let iteration = 0; iteration < count; iteration += 1) {
        if (
            canFitXLabels(
                labels,
                indexes,
                plotWidth,
                mode,
                count,
                minGap,
                measuredWidths,
            )
        ) {
            return indexes;
        }
        if (indexes.length <= 2) return [];
        const nextIndexes = sampleIndexes(count, indexes.length - 1);
        if (isSameIndexes(indexes, nextIndexes)) return [];
        indexes = nextIndexes;
    }
    return [];
}

export function resolveVisibleYTicks(
    ticks: number[],
    plotHeight: number,
    autoCull: boolean,
    maxLabelCount: number | undefined,
) {
    if (ticks.length <= 2) return ticks;
    const explicitMaxCount = resolveMaxLabelCount(maxLabelCount, ticks.length);
    const heightMaxCount = autoCull
        ? Math.max(2, Math.floor(plotHeight / 16) + 1)
        : ticks.length;
    const visibleIndexes = sampleIndexes(
        ticks.length,
        Math.min(explicitMaxCount, heightMaxCount),
    );
    return visibleIndexes.map((index) => ticks[index]).filter(Number.isFinite);
}

export function resolveYTickTargetCount(
    targetTickCount: number,
    maxLabelCount: number | undefined,
) {
    const fallback = Number.isFinite(targetTickCount)
        ? Math.max(2, Math.floor(Number(targetTickCount)))
        : 6;
    return resolveMaxLabelCount(maxLabelCount, fallback);
}

export function createNiceTicks(
    minValue: number,
    maxValue: number,
    count: number,
) {
    const safeCount = Math.max(2, Math.floor(count));
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue))
        return [0, 1];
    if (minValue === maxValue) {
        const padding = Math.abs(minValue || 1) * 0.1;
        minValue -= padding;
        maxValue += padding;
    }
    const step = niceNumber((maxValue - minValue) / (safeCount - 1), true);
    const niceMin = Math.floor(minValue / step) * step;
    const niceMax = Math.floor(maxValue / step) * step;
    const ticks: number[] = [];
    for (let value = niceMin; value <= niceMax + step / 2; value += step) {
        ticks.push(normalizeTickValue(value));
    }
    return ticks.length >= 2
        ? ticks
        : [niceMin, normalizeTickValue(maxValue)];
}

export function normalizeTickValue(value: number) {
    return Math.abs(value) < 1e-9 ? 0 : Number(value.toPrecision(12));
}

export function formatAxisTick(value: number) {
    if (value === 0) return "0";
    if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}K`;
    return String(Math.round(value));
}

/**
 * 测量当前实际渲染的轴标签宽度。
 *
 * 标签的字体、字号、字形特性和调用方 override 都由 SVG 的最终计算样式决定，
 * 因此这里不能使用字符数量或固定 bounds 估算。
 */
export function measureRenderedAxisLabelWidth(
    group: SVGGElement | null | undefined,
) {
    if (!group) return 0;
    let width = 0;
    for (const label of group.querySelectorAll<SVGTextElement>(
        "[data-snowui-axis-measure-label]",
    )) {
        try {
            width = Math.max(width, label.getComputedTextLength());
        } catch {
            width = Math.max(width, label.getBBox().width);
        }
    }
    return Number.isFinite(width) ? Math.max(0, width) : 0;
}

export function measureRenderedAxisLabelWidths(
    group: SVGGElement | null | undefined,
) {
    if (!group) return [];
    return Array.from(
        group.querySelectorAll<SVGTextElement>(
            "[data-snowui-axis-measure-label]",
        ),
        (label) => {
            try {
                return label.getComputedTextLength();
            } catch {
                return label.getBBox().width;
            }
        },
    ).map((width) => (Number.isFinite(width) ? Math.max(0, width) : 0));
}

export function sampleIndexes(count: number, maxVisibleCount: number) {
    const safeVisibleCount = Math.min(count, Math.max(2, maxVisibleCount));
    if (safeVisibleCount >= count) {
        return Array.from({ length: count }, (_, index) => index);
    }
    const visibleCount = resolveEqualStepVisibleCount(count, safeVisibleCount);
    const step = (count - 1) / (visibleCount - 1);
    return Array.from({ length: visibleCount }, (_, index) => index * step);
}

export function resolveMaxLabelCount(
    value: number | undefined,
    fallback: number,
) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(fallback, Math.max(2, Math.floor(Number(value))));
}

export function estimateLabelWidth(label: string) {
    let width = 0;
    for (const char of label) {
        width += /[\u2E80-\u9FFF]/.test(char) ? 12 : 6;
    }
    return width;
}

export function isSameIndexes(a: number[], b: number[]) {
    return (
        a.length === b.length && a.every((value, index) => value === b[index])
    );
}

function canFitCategoryLabels(
    indexes: number[],
    widths: number[],
    availableSize: number,
    categoryCount: number,
    minGap: number,
) {
    const safeAvailableSize = Math.max(0, availableSize);
    const safeGap = Math.max(0, minGap);
    const cellSize = safeAvailableSize / Math.max(1, categoryCount);
    let previousEnd = -Infinity;

    for (const index of indexes) {
        const width = Math.max(0, widths[index] ?? 0);
        if (width > safeAvailableSize) return false;
        const center = cellSize * (index + 0.5);
        const start = Math.min(
            Math.max(0, center - width / 2),
            Math.max(0, safeAvailableSize - width),
        );
        if (start < previousEnd + safeGap) return false;
        previousEnd = start + width;
    }
    return true;
}

function canFitXLabels(
    labels: string[],
    indexes: number[],
    plotWidth: number,
    mode: ChartXAxisMode,
    totalCount: number,
    minGap: number,
    measuredWidths?: number[],
) {
    const widths = labels.map(
        (label, index) =>
            measuredWidths?.[index] ?? estimateLabelWidth(label) + 2,
    );
    const safePlotWidth = Math.max(0, plotWidth);
    const safeGap = Math.max(0, minGap);
    let previousEnd = -Infinity;

    for (const index of indexes) {
        const width = Math.max(0, widths[index] ?? 0);
        if (width > safePlotWidth) return false;
        const center =
            mode === "edge"
                ? safePlotWidth * (index / Math.max(1, totalCount - 1))
                : (safePlotWidth / Math.max(1, totalCount)) * (index + 0.5);
        const start = Math.min(
            Math.max(0, center - width / 2),
            Math.max(0, safePlotWidth - width),
        );
        if (start < previousEnd + safeGap) return false;
        previousEnd = start + width;
    }
    return true;
}

function resolveMaxLabelWidth(labels: string[], indexes: number[]) {
    return Math.max(
        ...indexes.map((index) => estimateLabelWidth(labels[index] ?? "")),
        1,
    );
}

function resolveEqualStepVisibleCount(count: number, maxVisibleCount: number) {
    for (
        let visibleCount = maxVisibleCount;
        visibleCount >= 2;
        visibleCount -= 1
    ) {
        if ((count - 1) % (visibleCount - 1) === 0) return visibleCount;
    }
    return 2;
}

function niceNumber(value: number, round: boolean) {
    if (value <= 0 || !Number.isFinite(value)) return 1;
    const exponent = Math.floor(Math.log10(value));
    const fraction = value / 10 ** exponent;
    let niceFraction = 10;
    if (round) {
        if (fraction < 1.5) niceFraction = 1;
        else if (fraction < 3) niceFraction = 2;
        else if (fraction < 7) niceFraction = 5;
    } else if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    return niceFraction * 10 ** exponent;
}
