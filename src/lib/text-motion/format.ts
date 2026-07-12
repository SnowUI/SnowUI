export type TextMotionFormattableValue = string | number;

export function formatTextMotionValue(
    value: TextMotionFormattableValue,
    locales = "en-US",
    format?: Intl.NumberFormatOptions,
) {
    if (typeof value !== "number") return String(value);
    return new Intl.NumberFormat(locales, format ?? {}).format(value);
}
