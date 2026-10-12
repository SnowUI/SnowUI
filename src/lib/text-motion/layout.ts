/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { TEXT_MOTION_SPACE } from "./sequence";

export interface TextMotionTransition {
    duration: number;
    easing: string;
    layoutDuration?: number;
}

export const TEXT_MOTION_LAYOUT_TRANSITION: TextMotionTransition = {
    duration: 550,
    easing: "linear(0,.1052,.3155,.532,.7112,.8414,.9265,.9765,1.0023,1.013,1.0151,1.0133,1.01,1.0068,1.0041,1.0022,1.001,1)",
};

const segmenter =
    typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : undefined;

export function splitTextMotionGraphemes(
    value: string,
    normalizeSpaces = false,
) {
    const graphemes = segmenter
        ? Array.from(segmenter.segment(value), (item) => item.segment)
        : Array.from(value);
    return normalizeSpaces
        ? graphemes.map((char) => (char === " " ? TEXT_MOTION_SPACE : char))
        : graphemes;
}

export function diffTextMotionGraphemes(previous: string[], nextValue: string) {
    const current = splitTextMotionGraphemes(nextValue, true);
    let prefixCount = 0;
    while (
        prefixCount < previous.length &&
        prefixCount < current.length &&
        previous[prefixCount] === current[prefixCount]
    ) {
        prefixCount += 1;
    }

    let suffixCount = 0;
    const maxSuffix = Math.min(
        previous.length - prefixCount,
        current.length - prefixCount,
    );
    while (
        suffixCount < maxSuffix &&
        previous[previous.length - 1 - suffixCount] ===
            current[current.length - 1 - suffixCount]
    ) {
        suffixCount += 1;
    }

    return {
        current,
        prefixCount,
        suffixCount,
        middleLabels: current.slice(prefixCount, current.length - suffixCount),
    };
}

export function cancelTextMotionLayout(element: HTMLElement) {
    for (const animation of element.getAnimations()) animation.cancel();
}

export function flipTextMotionElement(
    element: HTMLElement,
    deltaX: number,
    transition: TextMotionTransition,
    accumulate = false,
) {
    if (!deltaX) return undefined;
    if (!accumulate) cancelTextMotionLayout(element);
    return element.animate(
        { transform: [`translateX(${deltaX}px)`, accumulate ? "translateX(0px)" : ""] },
        {
            duration: transition.layoutDuration ?? transition.duration,
            easing: transition.easing,
            fill: accumulate ? "backwards" : "both",
            composite: accumulate ? "accumulate" : "replace",
        },
    );
}

export function captureTextMotionRects(elements: HTMLElement[]) {
    return new Map(elements.map((element) => [element, element.getBoundingClientRect()]));
}

export function playTextMotionLayout(
    elements: HTMLElement[],
    previousRects: Map<HTMLElement, DOMRect>,
    transition: TextMotionTransition,
    accumulate = false,
) {
    // 同一批先读完，再启动动画，避免每个字符都强制布局。
    const currentRects = captureTextMotionRects(elements);
    for (const element of elements) {
        const previous = previousRects.get(element);
        if (!previous) continue;
        const current = currentRects.get(element)!;
        flipTextMotionElement(element, previous.left - current.left, transition, accumulate);
    }
}
