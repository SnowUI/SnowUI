/* SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
export interface FloatingBounds {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface FloatingPoint {
    left: number;
    top: number;
}

export type FloatingSide = "top" | "bottom" | "left" | "right";

export const DEFAULT_FLOATING_EDGE_GAP = 8;

export function clampFloatingValue(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function clampFloatingPosition(
    point: FloatingPoint,
    size: { width: number; height: number },
    bounds: FloatingBounds,
    edgeGap = DEFAULT_FLOATING_EDGE_GAP,
) {
    const minLeft = bounds.left + edgeGap;
    const minTop = bounds.top + edgeGap;
    const maxLeft = bounds.left + bounds.width - size.width - edgeGap;
    const maxTop = bounds.top + bounds.height - size.height - edgeGap;

    return {
        left: clampFloatingValue(
            point.left,
            minLeft,
            Math.max(minLeft, maxLeft),
        ),
        top: clampFloatingValue(point.top, minTop, Math.max(minTop, maxTop)),
    };
}

export function getFloatingVisualBounds(
    side: FloatingSide,
    point: FloatingPoint,
    size: { width: number; height: number },
): FloatingBounds {
    return {
        top:
            side === "left" || side === "right"
                ? point.top - size.height / 2
                : point.top,
        left:
            side === "top" || side === "bottom"
                ? point.left - size.width / 2
                : point.left,
        width: size.width,
        height: size.height,
    };
}

export function hasFloatingCollision(
    floating: FloatingBounds,
    boundary: FloatingBounds,
) {
    return (
        floating.top < boundary.top ||
        floating.left < boundary.left ||
        floating.top + floating.height > boundary.top + boundary.height ||
        floating.left + floating.width > boundary.left + boundary.width
    );
}

export function constrainFloatingAnchor(
    side: FloatingSide,
    point: FloatingPoint,
    size: { width: number; height: number },
    bounds: FloatingBounds,
    edgeGap = DEFAULT_FLOATING_EDGE_GAP,
) {
    if (side === "top" || side === "bottom") {
        const minLeft = bounds.left + edgeGap + size.width / 2;
        const maxLeft =
            bounds.left + bounds.width - size.width / 2 - edgeGap;
        return {
            left: clampFloatingValue(
                point.left,
                minLeft,
                Math.max(minLeft, maxLeft),
            ),
            top: point.top,
        };
    }

    const minTop = bounds.top + edgeGap + size.height / 2;
    const maxTop = bounds.top + bounds.height - size.height / 2 - edgeGap;
    return {
        left: point.left,
        top: clampFloatingValue(point.top, minTop, Math.max(minTop, maxTop)),
    };
}

export function getOppositeFloatingSide(side: FloatingSide): FloatingSide {
    if (side === "top") return "bottom";
    if (side === "bottom") return "top";
    if (side === "left") return "right";
    return "left";
}
