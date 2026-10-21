/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export const TEXT_MOTION_STAGGER_MS = 25;
export const TEXT_MOTION_SPACE = "\u00A0";
export const TEXT_MOTION_STAGGER_RATIO = 0.3;

export function isTextMotionSpace(value: string | null | undefined) {
    return value === " " || value === TEXT_MOTION_SPACE;
}

export function getTextMotionStagger(duration: number, values: Array<string | null | undefined>) {
    const animatingCount = values.filter((value) => !isTextMotionSpace(value)).length;
    return (duration * TEXT_MOTION_STAGGER_RATIO) / (animatingCount || 1);
}

export function createTextMotionOrder(
    indices: number[],
    direction: "left-to-right" | "right-to-left",
) {
    const ordered = direction === "right-to-left" ? [...indices].reverse() : indices;
    return new Map(ordered.map((index, order) => [index, order]));
}

export function getTextMotionDelay(order: number | undefined) {
    return Math.max(0, order ?? 0) * TEXT_MOTION_STAGGER_MS;
}
