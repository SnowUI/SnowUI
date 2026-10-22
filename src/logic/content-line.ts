/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
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
    return singleLine ? `max(4px, ${preferred})` : preferred;
}
