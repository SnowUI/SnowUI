export type ChartXAxisMode = "edge" | "cell";

export const CHART_Y_AXIS_LABEL_GAP = 12;
export const CHART_AXIS_LABEL_HEIGHT = 16;
export const CHART_X_AXIS_LABEL_GAP = 8;
export const CHART_X_AXIS_RESERVED_HEIGHT =
    CHART_X_AXIS_LABEL_GAP + CHART_AXIS_LABEL_HEIGHT;
export const CHART_PLOT_TOP_INSET = 0;

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
) {
    const count = labels.length;
    if (count <= 2)
        return Array.from({ length: count }, (_, index) => index);
    const explicitMaxCount = resolveMaxLabelCount(maxLabelCount, count);
    let indexes = sampleIndexes(count, explicitMaxCount);
    if (!autoCull) return indexes;
    for (let iteration = 0; iteration < count; iteration += 1) {
        const cellSize = availableSize / Math.max(1, indexes.length);
        const maxLabelWidth = resolveMaxLabelWidth(labels, indexes);
        if (maxLabelWidth <= Math.max(20, cellSize) || indexes.length <= 2) {
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
) {
    const count = labels.length;
    if (count <= 2)
        return Array.from({ length: count }, (_, index) => index);

    const explicitMaxCount = resolveMaxLabelCount(maxLabelCount, count);
    let indexes = sampleIndexes(count, explicitMaxCount);
    if (!autoCull) return indexes;

    for (let iteration = 0; iteration < count; iteration += 1) {
        if (canFitXLabels(labels, indexes, plotWidth, mode) || indexes.length <= 2) {
            return indexes;
        }

        const maxVisibleCount = Math.min(
            indexes.length - 1,
            resolveMaxVisibleXLabelCount(
                plotWidth,
                resolveMaxLabelWidth(labels, indexes),
                mode,
                count,
            ),
        );
        const nextIndexes = sampleIndexes(count, maxVisibleCount);
        if (isSameIndexes(indexes, nextIndexes)) return indexes;
        indexes = nextIndexes;
    }
    return indexes;
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
    const range = niceNumber(maxValue - minValue, false);
    const step = niceNumber(range / (safeCount - 1), true);
    const niceMin = Math.floor(minValue / step) * step;
    const niceMax = Math.ceil(maxValue / step) * step;
    const ticks: number[] = [];
    for (let value = niceMin; value <= niceMax + step / 2; value += step) {
        ticks.push(normalizeTickValue(value));
    }
    return ticks.length >= 2 ? ticks : [niceMin, niceMax];
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

function canFitXLabels(
    labels: string[],
    indexes: number[],
    plotWidth: number,
    mode: ChartXAxisMode,
) {
    if (indexes.length <= 1) return true;
    const labelCellWidth = resolveXLabelCellWidth(
        plotWidth,
        indexes.length,
        mode,
    );
    return indexes.every((index) => {
        const label = labels[index] ?? "";
        return estimateLabelWidth(label) <= labelCellWidth;
    });
}

function resolveMaxLabelWidth(labels: string[], indexes: number[]) {
    return Math.max(
        ...indexes.map((index) => estimateLabelWidth(labels[index] ?? "")),
        1,
    );
}

function resolveMaxVisibleXLabelCount(
    plotWidth: number,
    requiredLabelWidth: number,
    mode: ChartXAxisMode,
    totalCount: number,
) {
    const safeLabelWidth = Math.max(20, requiredLabelWidth);
    const visibleCount =
        mode === "edge"
            ? Math.floor(plotWidth / safeLabelWidth) + 1
            : Math.floor(plotWidth / safeLabelWidth);
    return Math.min(totalCount, Math.max(2, visibleCount));
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
