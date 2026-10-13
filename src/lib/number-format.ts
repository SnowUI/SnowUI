/* SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export const DEFAULT_NUMBER_VALUE_LABEL_FRACTION_DIGITS = 2;
export const DEFAULT_NUMBER_PERCENT_FRACTION_DIGITS = 1;
export const DEFAULT_NUMBER_COMPACT_THRESHOLD = 1_000_000;
export const DEFAULT_NUMBER_EMPTY_VALUE = "—";
export const DEFAULT_NUMBER_LOCALE = "en-US";

export type NumberNotation = "standard" | "compact" | "auto";

export interface NumberFormatOptions {
    fractionDigits?: number;
    valueLabelFractionDigits?: number;
    percentFractionDigits?: number;
    preserveTrailingZeros?: boolean;
    useGrouping?: boolean;
    emptyValue?: string;
    locale?: string;
    notation?: NumberNotation;
    compactThreshold?: number;
    compactFractionDigits?: number;
}

const ENGLISH_COMPACT_UNITS = [
    { value: 1_000_000_000_000, suffix: "t" },
    { value: 1_000_000_000, suffix: "b" },
    { value: 1_000_000, suffix: "m" },
    { value: 1_000, suffix: "k" },
] as const;

function normalizeNumber(value: number) {
    return Math.abs(value) < 1e-9 ? 0 : Number(value.toPrecision(12));
}

function clampFractionDigits(value: number | undefined, fallback: number) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(20, Math.max(0, Math.floor(Number(value))));
}

export function mergeNumberFormatOptions(
    ...options: (NumberFormatOptions | undefined)[]
): NumberFormatOptions {
    return Object.assign({}, ...options.filter(Boolean));
}

function shouldUseCompactNotation(
    value: number,
    notation: NumberNotation,
    threshold: number,
) {
    if (notation === "compact") return Math.abs(value) >= 1_000;
    if (notation === "auto") return Math.abs(value) >= threshold;
    return false;
}

function formatCompactNumber(value: number, options: NumberFormatOptions) {
    const absValue = Math.abs(value);
    const unit = ENGLISH_COMPACT_UNITS.find((item) => absValue >= item.value);
    if (!unit) return undefined;

    const fractionDigits = clampFractionDigits(
        options.compactFractionDigits ??
            options.fractionDigits ??
            options.valueLabelFractionDigits,
        DEFAULT_NUMBER_VALUE_LABEL_FRACTION_DIGITS,
    );
    const scaledValue = normalizeNumber(value / unit.value);
    const formatted = scaledValue.toLocaleString(
        options.locale ?? DEFAULT_NUMBER_LOCALE,
        {
            useGrouping: false,
            minimumFractionDigits: 0,
            maximumFractionDigits: fractionDigits,
        },
    );
    return `${formatted}${unit.suffix}`;
}

export function formatNumberLabel(
    value: number | null | undefined,
    options: NumberFormatOptions = {},
): string {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return options.emptyValue ?? DEFAULT_NUMBER_EMPTY_VALUE;
    }

    const normalizedValue = normalizeNumber(value);
    const notation = options.notation ?? "standard";
    const compactThreshold =
        typeof options.compactThreshold === "number"
            ? Math.max(1_000, options.compactThreshold)
            : DEFAULT_NUMBER_COMPACT_THRESHOLD;

    if (shouldUseCompactNotation(normalizedValue, notation, compactThreshold)) {
        const compactValue = formatCompactNumber(normalizedValue, options);
        if (compactValue) return compactValue;
    }

    const fractionDigits = clampFractionDigits(
        options.fractionDigits ?? options.valueLabelFractionDigits,
        DEFAULT_NUMBER_VALUE_LABEL_FRACTION_DIGITS,
    );
    const preserveTrailingZeros = options.preserveTrailingZeros ?? true;
    const hasExplicitFractionDigits =
        options.fractionDigits !== undefined ||
        options.valueLabelFractionDigits !== undefined;
    const isInteger = Number.isInteger(normalizedValue);

    return normalizedValue.toLocaleString(
        options.locale ?? DEFAULT_NUMBER_LOCALE,
        {
            useGrouping: options.useGrouping ?? true,
            minimumFractionDigits:
                preserveTrailingZeros &&
                (hasExplicitFractionDigits || !isInteger)
                    ? fractionDigits
                    : 0,
            maximumFractionDigits: fractionDigits,
        },
    );
}

export function formatPercentLabel(
    value: number | null | undefined,
    options: NumberFormatOptions = {},
): string {
    return `${formatNumberLabel(value, {
        ...options,
        fractionDigits:
            options.fractionDigits ??
            options.percentFractionDigits ??
            DEFAULT_NUMBER_PERCENT_FRACTION_DIGITS,
    })}%`;
}
