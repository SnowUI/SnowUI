/**
 * layout-flip.ts
 * v1.0.0
 * 模块级 FLIP 布局转场工具。
 * 独立于 Motion 编排上下文，无需 initMotion() 即可使用。
 * Frame controller 通过此模块暴露 captureFlip / playFlipTo 能力，
 * 供全屏放大、抽屉展开、列表↔详情等共享元素转场场景复用。
 */

export interface FlipTransitionOptions {
    duration?: number;
    easing?: string;
    onComplete?: () => void;
}

const FLIP_DURATION = 300;
const FLIP_EASING = "ease-out";

/** 模块级 DOMRect 注册表，键为 layoutId，无需 initMotion 上下文。 */
const flipRegistry = new Map<string, DOMRect>();

/**
 * 捕获元素当前位置并写入注册表，供后续 beginFlipEnter 读取起点。
 */
export function captureFlipRect(id: string, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        flipRegistry.set(id, rect);
    }
}

/**
 * 在目标元素挂载后调用：若注册表中存在该 id 的起点 DOMRect，
 * 则以 FLIP 方式从起点（如卡片位置）动画到元素当前位置（如全屏）。
 * 注册表条目消费后自动删除，重复调用安全。
 * 返回 true 表示找到起点并启动了动效。
 */
export function beginFlipEnter(id: string, element: HTMLElement, options?: FlipTransitionOptions): boolean {
    const fromRect = flipRegistry.get(id);
    if (!fromRect) return false;
    flipRegistry.delete(id);

    const toRect = element.getBoundingClientRect();
    if (toRect.width <= 0 || toRect.height <= 0) return false;

    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    const scaleX = fromRect.width / toRect.width;
    const scaleY = fromRect.height / toRect.height;

    element.style.transformOrigin = "top left";
    element.style.willChange = "transform";
    element.style.transition = "none";
    element.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            element.style.transition = `transform ${duration}ms ${easing}`;
            element.style.transform = "none";
            options?.onComplete?.();
        });
    });

    return true;
}

/**
 * 将元素以 FLIP 方式过渡到目标位置（退出动效）。
 * 动画结束后调用 options.onComplete，通常用于触发元素卸载。
 */
export function applyFlipExit(
    element: HTMLElement,
    target: HTMLElement | DOMRect,
    options?: FlipTransitionOptions,
): void {
    const fromRect = element.getBoundingClientRect();
    const toRect = target instanceof HTMLElement ? target.getBoundingClientRect() : target;
    if (fromRect.width <= 0 || toRect.width <= 0) {
        options?.onComplete?.();
        return;
    }

    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    const dx = toRect.left - fromRect.left;
    const dy = toRect.top - fromRect.top;
    const scaleX = toRect.width / fromRect.width;
    const scaleY = toRect.height / fromRect.height;

    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        element.removeEventListener("transitionend", onEnd);
        options?.onComplete?.();
    };
    const onEnd = (e: TransitionEvent) => {
        if (e.target === element && e.propertyName === "transform") finish();
    };

    element.style.transformOrigin = "top left";
    element.style.willChange = "transform";
    element.style.transition = `transform ${duration}ms ${easing}`;
    element.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    element.addEventListener("transitionend", onEnd);
    setTimeout(finish, duration + 50);
}
