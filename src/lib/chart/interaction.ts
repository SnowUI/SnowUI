/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
