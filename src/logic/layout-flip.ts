/**
 * layout-flip.ts
 * v1.1.0
 * 模块级 FLIP 布局转场工具。
 * 独立于 Motion 编排上下文，无需 initMotion() 即可使用。
 * Frame controller 通过此模块暴露 captureFlip / playFlipTo 能力，
 * 供全屏放大、抽屉展开、列表↔详情等共享元素转场场景复用。
 */

export interface FlipTransitionOptions {
    duration?: number;
    easing?: string;
    /**
     * transform：默认高性能 FLIP，使用 translate + scale。
     * layout：实际过渡位置与尺寸，内容不会随容器缩放，适合文字排版需要保持字号的场景。
     */
    strategy?: "transform" | "layout";
    onComplete?: () => void;
}

const FLIP_DURATION = 300;
const FLIP_EASING = "ease-out";

/** 模块级 DOMRect 注册表，键为 layoutId，无需 initMotion 上下文。 */
const flipRegistry = new Map<string, DOMRect>();

const LAYOUT_STYLE_PROPERTIES = [
    "inset",
    "top",
    "right",
    "bottom",
    "left",
    "width",
    "height",
    "transition",
    "transform",
    "transform-origin",
    "will-change",
] as const;

type InlineStyleSnapshot = Map<
    (typeof LAYOUT_STYLE_PROPERTIES)[number],
    { value: string; priority: string }
>;

function captureInlineStyles(element: HTMLElement): InlineStyleSnapshot {
    return new Map(
        LAYOUT_STYLE_PROPERTIES.map((property) => [
            property,
            {
                value: element.style.getPropertyValue(property),
                priority: element.style.getPropertyPriority(property),
            },
        ]),
    );
}

function restoreInlineStyles(
    element: HTMLElement,
    snapshot: InlineStyleSnapshot,
) {
    for (const [property, { value, priority }] of snapshot) {
        if (value) {
            element.style.setProperty(property, value, priority);
        } else {
            element.style.removeProperty(property);
        }
    }
}

function setLayoutRect(element: HTMLElement, rect: DOMRect) {
    element.style.setProperty("inset", "auto");
    element.style.setProperty("top", `${rect.top}px`);
    element.style.setProperty("left", `${rect.left}px`);
    element.style.setProperty("right", "auto");
    element.style.setProperty("bottom", "auto");
    element.style.setProperty("width", `${rect.width}px`);
    element.style.setProperty("height", `${rect.height}px`);
}

function layoutTransitionValue(duration: number, easing: string) {
    return [
        `top ${duration}ms ${easing}`,
        `left ${duration}ms ${easing}`,
        `width ${duration}ms ${easing}`,
        `height ${duration}ms ${easing}`,
    ].join(", ");
}

function waitForTransition(
    element: HTMLElement,
    duration: number,
    properties: ReadonlySet<string>,
    onComplete: () => void,
) {
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        element.removeEventListener("transitionend", onEnd);
        clearTimeout(fallback);
        onComplete();
    };
    const onEnd = (event: TransitionEvent) => {
        if (event.target === element && properties.has(event.propertyName)) {
            finish();
        }
    };
    const fallback = setTimeout(finish, Math.max(0, duration) + 50);
    element.addEventListener("transitionend", onEnd);
    return finish;
}

function beginLayoutEnter(
    element: HTMLElement,
    fromRect: DOMRect,
    toRect: DOMRect,
    options?: FlipTransitionOptions,
) {
    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    const previousStyles = captureInlineStyles(element);

    element.style.setProperty("transition", "none");
    element.style.setProperty("transform", "none");
    element.style.setProperty("will-change", "top, left, width, height");
    setLayoutRect(element, fromRect);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const finish = waitForTransition(
                element,
                duration,
                new Set(["top", "left", "width", "height"]),
                () => {
                    restoreInlineStyles(element, previousStyles);
                    options?.onComplete?.();
                },
            );
            element.style.setProperty(
                "transition",
                layoutTransitionValue(duration, easing),
            );
            setLayoutRect(element, toRect);
            if (duration <= 0) finish();
        });
    });
}

function applyLayoutExit(
    element: HTMLElement,
    fromRect: DOMRect,
    toRect: DOMRect,
    options?: FlipTransitionOptions,
) {
    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    const previousStyles = captureInlineStyles(element);

    element.style.setProperty("transition", "none");
    element.style.setProperty("transform", "none");
    element.style.setProperty("will-change", "top, left, width, height");
    setLayoutRect(element, fromRect);
    // 固化退出起点，避免同一任务内写入终点时浏览器合并两次布局。
    element.getBoundingClientRect();

    const finish = waitForTransition(
        element,
        duration,
        new Set(["top", "left", "width", "height"]),
        () => {
            restoreInlineStyles(element, previousStyles);
            options?.onComplete?.();
        },
    );
    element.style.setProperty(
        "transition",
        layoutTransitionValue(duration, easing),
    );
    setLayoutRect(element, toRect);
    if (duration <= 0) finish();
}

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
export function beginFlipEnter(
    id: string,
    element: HTMLElement,
    options?: FlipTransitionOptions,
): boolean {
    const fromRect = flipRegistry.get(id);
    if (!fromRect) return false;
    flipRegistry.delete(id);

    const toRect = element.getBoundingClientRect();
    if (toRect.width <= 0 || toRect.height <= 0) return false;

    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    if (options?.strategy === "layout") {
        beginLayoutEnter(element, fromRect, toRect, options);
        return true;
    }
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
    const toRect =
        target instanceof HTMLElement ? target.getBoundingClientRect() : target;
    if (fromRect.width <= 0 || toRect.width <= 0) {
        options?.onComplete?.();
        return;
    }

    const duration = options?.duration ?? FLIP_DURATION;
    const easing = options?.easing ?? FLIP_EASING;
    if (options?.strategy === "layout") {
        applyLayoutExit(element, fromRect, toRect, options);
        return;
    }
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
    const onEnd = (event: TransitionEvent) => {
        if (event.target === element && event.propertyName === "transform") {
            finish();
        }
    };

    element.style.transformOrigin = "top left";
    element.style.willChange = "transform";
    element.style.transition = `transform ${duration}ms ${easing}`;
    element.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    element.addEventListener("transitionend", onEnd);
    setTimeout(finish, duration + 50);
}
