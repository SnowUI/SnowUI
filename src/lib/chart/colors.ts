import {
    resolveSnowUIColor,
    type SnowUIColor,
} from "@snowui-design-system/components";

export type ChartColor = SnowUIColor | string | ChartGradient;
export type ChartColorMode = "sequence" | "monochromeFade" | "monochrome";

export interface ChartGradient {
    type?: "linear";
    angle?: number;
    stops: (string | ChartGradientStop)[];
}

export interface ChartGradientStop {
    color: SnowUIColor | string;
    offset?: number | string;
    opacity?: number;
}

export const DEFAULT_CHART_COLORS = [
    "var(--primary, #111111)",
    "var(--secondary-purple, #B899EB)",
    "var(--secondary-cyan, #A0BCE8)",
    "var(--secondary-mint, #6BE6D3)",
    "var(--secondary-green, #71DD8C)",
    "var(--secondary-indigo, #ADADFB)",
    "var(--secondary-blue, #7DBBFF)",
    "var(--secondary-yellow, #FFCC00)",
    "var(--secondary-orange, #FFB55B)",
    "var(--secondary-red, #FF4747)",
] as const;

export const DEFAULT_CHART_MONOCHROME_COLOR = "var(--primary, #111111)";
export const DEFAULT_CHART_MUTED_MONOCHROME_COLOR = "var(--black-4, #0000000a)";

export interface ResolveChartColorOptions {
    mode?: ChartColorMode;
    count?: number;
    color?: ChartColor;
    monochromeColor?: ChartColor;
    mutedMonochromeColor?: ChartColor;
}

export function resolveChartColor(
    itemColor: ChartColor | undefined,
    palette: (ChartColor | undefined)[] | undefined,
    index: number,
    options: ResolveChartColorOptions = {},
): ChartColor {
    const color =
        itemColor ?? palette?.[index] ?? resolveModeColor(index, options);
    return typeof color === "string" ? resolveSnowUIColor(color) : color;
}

function resolveModeColor(index: number, options: ResolveChartColorOptions) {
    const mode = options.mode ?? "sequence";
    if (mode === "monochrome") {
        return (
            options.color ??
            options.mutedMonochromeColor ??
            DEFAULT_CHART_MUTED_MONOCHROME_COLOR
        );
    }
    if (mode === "monochromeFade") {
        return resolveMonochromeFadeColor(
            options.color ??
                options.monochromeColor ??
                DEFAULT_CHART_MONOCHROME_COLOR,
            index,
            options.count,
        );
    }
    return DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length];
}

export function resolveMonochromeFadeColor(
    color: ChartColor,
    index: number,
    count = 1,
): ChartColor {
    if (typeof color !== "string") return color;
    const opacity = resolveMonochromeFadeOpacity(index, count);
    return `color-mix(in srgb, ${resolveSnowUIColor(color)} ${opacity}%, transparent)`;
}

export function resolveMonochromeFadeOpacity(index: number, count = 1) {
    const safeCount = Math.max(1, Math.floor(count));
    if (safeCount <= 1) return 100;
    const safeIndex = Math.min(Math.max(0, index), safeCount - 1);
    return Math.max(20, 100 - (80 * safeIndex) / (safeCount - 1));
}

const TRANSLUCENT_THEME_TOKEN =
    /--(?:static-)?(?:black|white)-(?:80|40|20|10|4)\b/i;

function functionalColorHasAlpha(value: string) {
    const match = value.match(
        /(?:rgba?|hsla?)\([^)]*(?:,|\/)\s*(\d*\.?\d+)(%)?\s*\)/i,
    );
    if (!match) return false;
    const alpha = Number(match[1]);
    return Number.isFinite(alpha) && (match[2] ? alpha < 100 : alpha < 1);
}

function hexColorHasAlpha(value: string) {
    const matches = value.matchAll(/#([\da-f]{4}|[\da-f]{8})\b/gi);
    for (const match of matches) {
        const hex = match[1];
        const alpha = hex.length === 4 ? hex[3] + hex[3] : hex.slice(6);
        if (Number.parseInt(alpha, 16) < 255) return true;
    }
    return false;
}

/** True when applying a same-color SVG seam stroke would compound alpha. */
export function chartColorUsesTransparency(color: ChartColor): boolean {
    if (typeof color !== "string") {
        return color.stops.some((stop) => {
            if (typeof stop === "string") {
                return chartColorUsesTransparency(stop);
            }
            return (
                (typeof stop.opacity === "number" && stop.opacity < 1) ||
                chartColorUsesTransparency(stop.color)
            );
        });
    }

    const resolved = resolveSnowUIColor(color).trim();
    return (
        /\btransparent\b/i.test(resolved) ||
        TRANSLUCENT_THEME_TOKEN.test(resolved) ||
        functionalColorHasAlpha(resolved) ||
        hexColorHasAlpha(resolved)
    );
}
