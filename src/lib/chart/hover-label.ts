/* SnowUI source notice | LICENSE 2.2.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export type ChartHoverLabelSource = "pointer" | "focus";

export function addHoverLabelKey(list: string[], key: string) {
    return list.includes(key) ? list : [...list, key];
}

export function removeHoverLabelKey(list: string[], key: string) {
    return list.filter((item) => item !== key);
}

export function isHoverLabelKeyVisible(
    key: string,
    pointerKeys: string[],
    focusKeys: string[],
    alwaysShow = false,
) {
    return alwaysShow || pointerKeys.includes(key) || focusKeys.includes(key);
}

export function shouldRenderHoverLabelKey(
    key: string,
    mountedKeys: string[],
    alwaysShow = false,
) {
    return alwaysShow || mountedKeys.includes(key);
}

export function showHoverLabelKeyState(
    key: string,
    source: ChartHoverLabelSource,
    pointerKeys: string[],
    focusKeys: string[],
    mountedKeys: string[],
) {
    return {
        pointerKeys:
            source === "pointer" ? addHoverLabelKey(pointerKeys, key) : pointerKeys,
        focusKeys: source === "focus" ? addHoverLabelKey(focusKeys, key) : focusKeys,
        mountedKeys: addHoverLabelKey(mountedKeys, key),
    };
}

export function hideHoverLabelKeyState(
    key: string,
    source: ChartHoverLabelSource,
    pointerKeys: string[],
    focusKeys: string[],
) {
    return {
        pointerKeys:
            source === "pointer"
                ? removeHoverLabelKey(pointerKeys, key)
                : pointerKeys,
        focusKeys:
            source === "focus" ? removeHoverLabelKey(focusKeys, key) : focusKeys,
    };
}

export function resolveHoverLabelDecimalSeparator(locale = "en-US") {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    return parts.find((part) => part.type === "decimal")?.value ?? ".";
}

export function countHoverLabelFractionDigits(
    label: string,
    locale = "en-US",
) {
    const decimalSeparator = resolveHoverLabelDecimalSeparator(locale);
    const decimalIndex = label.lastIndexOf(decimalSeparator);
    if (decimalIndex < 0) return 0;
    const fraction = label.slice(decimalIndex + decimalSeparator.length);
    const match = fraction.match(/^\d+/);
    return match?.[0].length ?? 0;
}

export function createHoverLabelFractionFormat(label: string, locale = "en-US") {
    const fractionDigits = countHoverLabelFractionDigits(label, locale);
    return {
        fractionDigits,
        preserveTrailingZeros: fractionDigits > 0,
    };
}
