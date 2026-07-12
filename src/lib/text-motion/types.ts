import type { SnowUIColor } from "@snowui-design-system/components/lib/color";

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
