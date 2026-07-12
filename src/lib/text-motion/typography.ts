import { resolveSnowUIColor } from "@snowui-design-system/components/lib/color";
import type { TextMotionTypographyProps } from "./types";

function resolveCssValue(
    value: string | number | undefined,
    numberUnit: "px" | "unitless" = "unitless",
) {
    if (value === undefined || value === null || value === "") return "";
    if (typeof value === "number") {
        return numberUnit === "px" ? `${value}px` : String(value);
    }
    const trimmed = value.trim();
    return trimmed.startsWith("--") ? `var(${trimmed})` : trimmed;
}

export function resolveTextMotionColor(value: string | undefined) {
    return value ? resolveSnowUIColor(value) : "";
}

export function createTextMotionTypographyStyle(
    component: string,
    props: TextMotionTypographyProps,
    userStyle = "",
) {
    const styles = [
        props.font
            ? `--snowui-${component}-font: ${resolveCssValue(props.font)}`
            : "",
        props.size !== undefined
            ? `--snowui-${component}-size: ${resolveCssValue(props.size, "px")}`
            : "",
        props.weight !== undefined
            ? `--snowui-${component}-weight: ${resolveCssValue(props.weight)}`
            : "",
        props.lineHeight !== undefined
            ? `--snowui-${component}-line-height: ${resolveCssValue(props.lineHeight)}`
            : "",
        props.color
            ? `--snowui-${component}-color: ${resolveTextMotionColor(props.color)}`
            : "",
        typeof props.motionColor === "string" && props.motionColor
            ? `--snowui-${component}-motion-color: ${resolveTextMotionColor(props.motionColor)}`
            : "",
        props.align ? `--snowui-${component}-align: ${props.align}` : "",
        userStyle,
    ].filter(Boolean);

    return styles.join("; ") || undefined;
}
