export type ChartHoverPanelVariant = "dark" | "light" | "surface";

export type ChartHoverPanelPlacement =
    | "anchor-top"
    | "anchor-side"
    | "pointer"
    | "pin-top-left"
    | "pin-top"
    | "pin-top-right"
    | "pin-right"
    | "pin-bottom-right"
    | "pin-bottom"
    | "pin-bottom-left"
    | "pin-left"
    | "pin-center";

export type ChartHoverPanelAnchorYAlign = "top" | "center";

export interface ChartHoverPanelRow {
    name: string;
    value: string;
    color: string;
    opacity?: number;
}

export interface ChartHoverPanelData {
    label?: string;
    rows: ChartHoverPanelRow[];
    x: number;
    y: number;
    anchorBounds?: ChartHoverPanelBounds;
    anchorYAlign?: ChartHoverPanelAnchorYAlign;
    bounds?: ChartHoverPanelBounds;
    placement: ChartHoverPanelPlacement;
    showLabel: boolean;
}

export interface ChartHoverPanelBounds {
    left: number;
    top: number;
    width: number;
    height: number;
}

export function shouldRenderChartHoverLabel(
    showHoverLabel: boolean | undefined,
    showHoverPanel: boolean,
) {
    return showHoverLabel ?? !showHoverPanel;
}

export function describeChartHoverPanelData(
    label: string | undefined,
    rows: ChartHoverPanelRow[],
) {
    if (label && rows.length === 1 && rows[0].name === label) {
        return `${rows[0].name}: ${rows[0].value}`;
    }
    const segments = [
        label,
        ...rows.map((row) => `${row.name}: ${row.value}`),
    ].filter(Boolean);
    return segments.join("; ");
}
