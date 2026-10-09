import type { AdaptiveContrastSurface } from "../adaptive-contrast";
import type { ChartHoverPanelData } from "./hover-panel";
import type { ChartHoverPanelPlacement } from "./hover-panel";

export type ChartGroupHoverMode = "item" | "cell";
export type ChartGroupXAxisMode = "edge" | "cell";


export interface ChartGroupContext {
    adaptiveContrast?: () => boolean;
    contrastSurfaces?: () => AdaptiveContrastSurface[];
    setContrastSurfaces?: (source: string, surfaces: AdaptiveContrastSurface[] | null) => void;
    hoverMode: () => ChartGroupHoverMode;
    activeCellIndex: () => number | null;
    setActiveCellIndex: (index: number | null) => void;
    xLabels: () => string[];
    yMin: () => number | undefined;
    yMax: () => number | undefined;
    yTicks: () => number[] | undefined;
    yTickCount: () => number;
    yTickFormatter: () => ((value: number) => string) | undefined;
    showXAxis: () => boolean;
    showYAxis: () => boolean;
    showGrid: () => boolean;
    showGuides: () => boolean;
    xAxisMode: () => ChartGroupXAxisMode;
    xLabelAutoCull: () => boolean;
    xMaxLabelCount: () => number | undefined;
    yLabelAutoCull: () => boolean;
    yMaxLabelCount: () => number | undefined;
    plotTopInset: () => number;
    registerPlotTopInset?: (
        source: string,
        resolveInset: () => number,
    ) => () => void;
    showHoverPanel?: () => boolean;
    showHoverLabel?: () => boolean | undefined;
    alwaysShowHoverLabel?: () => boolean;
    hoverPanelPlacement?: () => ChartHoverPanelPlacement;
    setHoverPanelData?: (
        source: string,
        data: ChartHoverPanelData | null,
    ) => void;
}

export const CHART_GROUP_CONTEXT_KEY = Symbol("snowui-chart-group");
