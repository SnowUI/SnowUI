/* SnowUI source notice | LICENSE 2.2.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import type { SnowUIColor } from "../color";

export type TextMotionAlign = "left" | "center" | "right" | "justify";
export type TextMotionTrend = -1 | 0 | 1;
export type TextMotionRole = "auto" | "text" | "number" | "timer" | "countdown";
export type TextMotionColorResolver = (index: number, total: number) => string;
export type TextMotionColor = SnowUIColor | string | TextMotionColorResolver;

export interface TextMotionTypographyProps {
    font?: string;
    size?: string | number;
    weight?: string | number;
    lineHeight?: string | number;
    color?: SnowUIColor | string;
    align?: TextMotionAlign;
    motionColor?: TextMotionColor;
}

export const DEFAULT_TEXT_MOTION_COLOR: undefined = undefined;
