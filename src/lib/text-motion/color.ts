/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { getTextMotionStagger } from "./sequence";
import { resolveTextMotionColor } from "./typography";
import type {
    TextMotionColor,
    TextMotionColorResolver,
} from "./types";

const colorAnimations = new WeakMap<HTMLElement, Animation>();
const chromaticOptions = new WeakMap<
    TextMotionColorResolver,
    Required<ChromaticOptions>
>();

export const TEXT_MOTION_COLOR_FADE_MS = 280;
export const TEXT_MOTION_COLOR_DURATION_MS = 550;

export interface ChromaticOptions {
    from?: number;
    spread?: number;
    saturation?: number;
    lightness?: number;
}

export function chromatic({
    from = 0,
    spread = 320,
    saturation = 92,
    lightness = 60,
}: ChromaticOptions = {}): TextMotionColorResolver {
    const resolver: TextMotionColorResolver = (index, total) => {
        const progress = total <= 1 ? 0 : index / (total - 1);
        return `hsl(${(from + progress * spread) % 360} ${saturation}% ${lightness}%)`;
    };
    chromaticOptions.set(resolver, { from, spread, saturation, lightness });
    return resolver;
}

/** Returns the five stops for one continuous slice of a chromatic resolver. */
export function resolveChromaticTextMotionColors(
    color: TextMotionColor | undefined,
    index: number,
    total: number,
) {
    if (typeof color !== "function") return undefined;
    const options = chromaticOptions.get(color);
    if (!options) return undefined;

    const count = Math.max(1, total);
    const start = index / count;
    const end = (index + 1) / count;
    return Array.from({ length: 5 }, (_, stopIndex) => {
        const localProgress = stopIndex / 4;
        const progress = start + (end - start) * localProgress;
        const hue = (options.from + progress * options.spread) % 360;
        return `hsl(${hue} ${options.saturation}% ${options.lightness}%)`;
    });
}

export function resolveTextMotionColorAt(
    color: TextMotionColor | undefined,
    index: number,
    total: number,
) {
    const value = typeof color === "function" ? color(index, total) : color;
    return typeof value === "string" ? resolveTextMotionColor(value) : "";
}

export function cancelTextMotionColor(element: HTMLElement) {
    colorAnimations.get(element)?.cancel();
    colorAnimations.delete(element);
}

export function animateSettledTextMotionColor(
    element: HTMLElement,
    motionColor: TextMotionColor,
    motionDuration: number,
    startDelay = 0,
    index = 0,
    total = 1,
    fadeDuration = TEXT_MOTION_COLOR_FADE_MS,
) {
    cancelTextMotionColor(element);
    const resolvedColor = resolveTextMotionColorAt(motionColor, index, total);
    if (!resolvedColor || motionDuration < 0) return undefined;
    const restingColor = getComputedStyle(element).color;
    const animation = element.animate(
        { color: [resolvedColor, restingColor] },
        {
            duration: fadeDuration,
            delay: startDelay + motionDuration,
            easing: "linear",
            fill: "backwards",
        },
    );
    colorAnimations.set(element, animation);
    // 旧动画的异步结束事件不能清除连续更新后登记的新动画。
    const release = () => {
        if (colorAnimations.get(element) === animation) colorAnimations.delete(element);
    };
    animation.onfinish = release;
    animation.oncancel = release;
    return animation;
}

/** 目标全文共享一个颜色序列，字符是否位移不影响其颜色顺序。 */
export function animateTextMotionColorSequence(
    elements: HTMLElement[],
    motionColor: TextMotionColor,
    labels: string[],
    options: {
        duration: number;
        layoutDuration?: number;
        stagger?: number;
        fadeDuration?: number;
    },
) {
    const stagger = options.stagger ?? getTextMotionStagger(options.layoutDuration ?? options.duration, labels);
    const fade = options.fadeDuration ?? TEXT_MOTION_COLOR_FADE_MS;
    let end = 0;
    elements.forEach((element, index) => {
        const delay = index * stagger;
        const animation = animateSettledTextMotionColor(element, motionColor, options.duration, delay, index, labels.length, fade);
        if (animation) end = Math.max(end, options.duration + delay + fade);
    });
    return end;
}
