import type { FrameProps } from "./frame-types";

/** 单行组合复用现有Frame自动布局；显式关闭协议时一并关闭预设。 */
export function isSingleLineLayout(props: FrameProps) {
    return props.singleLine === true && props.enableAutoLayout !== false;
}

/** 间距仍消费原Token，只对显式单行组合应用Owner要求的4 CSS px下限。 */
export function contentLineGap(value: number | string | undefined, singleLine = false) {
    if (value === undefined || value === null) return undefined;
    const preferred = value === 0 || value === "0" ? "0px" : typeof value === "number"
        ? `var(--gap-${value}, calc(4px * ${value} * var(--gap-scale, 1)))`
        : String(value);
    return singleLine ? `max(var(--snowui-single-line-gap-floor, 4px), ${preferred})` : preferred;
}
/*! @license SnowUI-Commercial-2.4.0 https://snowui.dev/LICENSE (../../LICENSE) */
