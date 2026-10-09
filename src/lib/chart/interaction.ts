import type { ChartGroupContext } from "./group-context";

export function resolveEffectiveActiveCellIndex(
    controlledIndex: number | null | undefined,
    chartGroup: ChartGroupContext | undefined,
    internalIndex: number | null,
) {
    return controlledIndex !== undefined
        ? controlledIndex
        : (chartGroup?.activeCellIndex() ?? internalIndex);
}

export function showChartCellHover(
    index: number,
    chartGroup: ChartGroupContext | undefined,
    onCellHoverChange: ((index: number | null) => void) | undefined,
) {
    chartGroup?.setActiveCellIndex(index);
    onCellHoverChange?.(index);
    return index;
}

export function hideChartCellHover(
    index: number,
    activeIndex: number | null | undefined,
    chartGroup: ChartGroupContext | undefined,
    onCellHoverChange: ((index: number | null) => void) | undefined,
) {
    if (activeIndex !== index) return undefined;
    chartGroup?.setActiveCellIndex(null);
    onCellHoverChange?.(null);
    return null;
}
