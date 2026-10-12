/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { ChartColor, ChartGradient, ChartGradientStop } from "./colors";
import { resolveSnowUIColor } from "../../index";

export function parseLinearGradient(value: string) {
    const trimmed = value.trim();
    const match = trimmed.match(/^linear-gradient\((.*)\)$/i);
    if (!match) return undefined;
    const parts = splitGradientArgs(match[1]);
    if (parts.length < 2) return undefined;
    let angle = 135;
    let stopStartIndex = 0;
    const first = parts[0].trim();
    const angleMatch = first.match(/^(-?\d+(?:\.\d+)?)deg$/i);
    if (angleMatch) {
        angle = Number(angleMatch[1]);
        stopStartIndex = 1;
    }
    return {
        type: "linear" as const,
        angle,
        stops: parts.slice(stopStartIndex),
    };
}

export function splitGradientArgs(value: string) {
    const parts: string[] = [];
    let current = "";
    let depth = 0;
    for (const char of value) {
        if (char === "(") depth += 1;
        if (char === ")") depth = Math.max(0, depth - 1);
        if (char === "," && depth === 0) {
            parts.push(current.trim());
            current = "";
            continue;
        }
        current += char;
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
}

export function parseGradientStop(value: string): ChartGradientStop {
    const trimmed = value.trim();
    const stopMatch = trimmed.match(
        /^(.*?)(?:\s+(-?\d+(?:\.\d+)?%?))?$/,
    );
    const color = stopMatch?.[1]?.trim() || trimmed;
    const offset = stopMatch?.[2];
    return { color: resolveSnowUIColor(color), offset };
}

export function normalizeGradientStops(
    stops: ChartGradient["stops"],
): ChartGradientStop[] {
    const safeStops = stops.length > 0 ? stops : ["currentColor"];
    const lastIndex = Math.max(1, safeStops.length - 1);
    return safeStops.map((stop, index) => {
        const parsed = typeof stop === "string" ? parseGradientStop(stop) : stop;
        return {
            color: resolveSnowUIColor(parsed.color),
            offset: parsed.offset ?? `${Math.round((index / lastIndex) * 100)}%`,
            opacity: parsed.opacity,
        };
    });
}

export function resolveLinearGradientCoordinates(
    angle: number,
    width: number,
    height = width,
) {
    const radians = ((angle - 90) * Math.PI) / 180;
    const dx = Math.cos(radians);
    const dy = Math.sin(radians);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return {
        x1: halfWidth - dx * halfWidth,
        y1: halfHeight - dy * halfHeight,
        x2: halfWidth + dx * halfWidth,
        y2: halfHeight + dy * halfHeight,
    };
}

export function resolveColorGradient(
    color: ChartColor,
    index: number,
    idPrefix: string,
    width: number,
    height = width,
) {
    const gradient = typeof color === "string" ? parseLinearGradient(color) : color;
    if (!gradient || typeof gradient === "string") return undefined;
    const angle = gradient.angle ?? 135;
    return {
        id: `${idPrefix}-${index}`,
        coordinates: resolveLinearGradientCoordinates(angle, width, height),
        stops: normalizeGradientStops(gradient.stops),
    };
}
