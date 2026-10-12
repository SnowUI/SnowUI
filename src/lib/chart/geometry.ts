/* SnowUI source notice | LICENSE 2.1.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export interface ChartPoint {
    x: number;
    y: number;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function toNumber(value: number | string, fallback: number): number {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : fallback;
    }
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

export function toCssLength(value: number | string): string {
    if (typeof value === "number") return `${value / 16}rem`;
    return value;
}

export function resolveScaledGeometryValue(
    value: number | string | "auto",
    actualSize: number,
    baseSize: number,
    baseFallback: number,
): number {
    const baseValue =
        value === "auto" ? baseFallback : toNumber(value, baseFallback);
    return baseValue * (actualSize / baseSize);
}

export function normalizePositiveAngle(angle: number) {
    const full = Math.PI * 2;
    return ((angle % full) + full) % full;
}

export function normalizeAngle(angle: number) {
    return normalizePositiveAngle(angle);
}

export function polarPoint(
    cx: number,
    cy: number,
    radius: number,
    angle: number,
): ChartPoint {
    return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
    };
}

export function formatPoint(point: ChartPoint) {
    return `${point.x.toFixed(3)} ${point.y.toFixed(3)}`;
}
