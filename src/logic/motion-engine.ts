/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { resolveMotionCssTiming } from "../motion/spring";

/**
 * Motion Engine
 * 负责具体的动画执行逻辑 (Tween, Spring)
 * 2026-02-19: 统一读取 --snowui-frame-while-* 命名，保持与组件变量规范一致。
 */

/**
 * 从元素获取动画配置 (优先 whileAppear，其次 whileIdle，再次 whileHover)
 */
export function getAnimationConfig(element: HTMLElement): any {
    // 仅从内联样式获取，避免 CSS 变量继承导致子元素也被选中
    // 这确保只有显式配置了动效属性的组件(Frame)会被编排器识别
    // Frame 动效变量统一命名：--snowui-frame-while-*
    const cssVars = [
        '--snowui-frame-while-appear',
        '--snowui-frame-while-idle',
        '--snowui-frame-while-hover',
    ];

    for (const varName of cssVars) {
        const configStr = element.style.getPropertyValue(varName);
        if (configStr && configStr.trim()) {
            try {
                return JSON.parse(configStr.trim());
            } catch (e) {
                // 忽略解析错误
                console.warn('[Motion] Failed to parse config:', varName, configStr, e);
            }
        }
    }
    return null;
}

// 保留旧方法名兼容
export function getWhileAppearConfig(element: HTMLElement): any {
    return getAnimationConfig(element);
}

/**
 * 应用 appear 动效到元素
 */
export function applyAppearAnimation(element: HTMLElement, config: any) {
    const timing = resolveMotionCssTiming(config);
    const duration = timing.duration;
    const initialHeightKey = 'snowuiMotionInitialHeight';
    const hadInlineTransform = !!element.style.transform;
    const hadInlineOpacity = !!element.style.opacity;
    const hadInlineFilter = !!element.style.filter;
    const hadInlineTransition = !!element.style.transition;
    const computedTransform =
        typeof window !== "undefined"
            ? window.getComputedStyle(element).transform
            : "";
    const baseTransform =
        element.style.transform ||
        (computedTransform && computedTransform !== "none"
            ? computedTransform
            : "");
    const computedFilter =
        typeof window !== "undefined"
            ? window.getComputedStyle(element).filter
            : "";
    const baseFilter =
        element.style.filter ||
        (computedFilter && computedFilter !== "none" ? computedFilter : "");

    // 临时禁用 transition 以确保初始状态瞬间应用
    // 防止组件自带的 CSS transition (如 Button) 导致初始状态设置变成过渡动画
    element.style.transition = 'none';

    // 收集初始状态的 transform 值
    const fromTransforms: string[] = [];
    const toTransforms: string[] = [];

    // 解析增量值（如 '+20px' 或 '-10px'）
    const parseIncrementalValue = (value: string, currentValue: number): number => {
        if (typeof value === 'string') {
            if (value.startsWith('+')) {
                return currentValue + parseFloat(value.slice(1));
            } else if (value.startsWith('-')) {
                return currentValue - parseFloat(value.slice(1).replace('px', ''));
            }
        }
        return parseFloat(String(value).replace('px', ''));
    };

    // 设置初始状态
    if (config.opacity !== undefined) {
        const [from] = Array.isArray(config.opacity) ? config.opacity : [0, config.opacity];
        element.style.opacity = String(from);
    }
    if (config.blur !== undefined) {
        const [from] = Array.isArray(config.blur) ? config.blur : [config.blur];
        element.style.filter = [baseFilter, `blur(${typeof from === "number" ? `${from}px` : from})`]
            .filter(Boolean)
            .join(" ");
    }
    if (config.scale !== undefined) {
        const [from, to] = Array.isArray(config.scale) ? config.scale : [0.5, config.scale];
        fromTransforms.push(`scale(${from})`);
        toTransforms.push(`scale(${to})`);
    }
    const toUnit = (value: string | number) =>
        typeof value === "number" ? `${value}px` : value;
    if (config.x !== undefined) {
        const [from, to] = Array.isArray(config.x) ? config.x : [0, config.x];
        fromTransforms.push(`translateX(${toUnit(from)})`);
        toTransforms.push(`translateX(${toUnit(to)})`);
    }
    if (config.y !== undefined) {
        const [from, to] = Array.isArray(config.y) ? config.y : [0, config.y];
        fromTransforms.push(`translateY(${toUnit(from)})`);
        toTransforms.push(`translateY(${toUnit(to)})`);
    }
    if (config.rotate !== undefined) {
        const [from, to] = Array.isArray(config.rotate) ? config.rotate : [0, config.rotate];
        fromTransforms.push(`rotate(${from}deg)`);
        toTransforms.push(`rotate(${to}deg)`);
    }

    // 处理 height 属性（支持增量语法如 '+20px'）
    let targetHeight: string | null = null;
    if (config.height !== undefined) {
        const currentHeight = element.offsetHeight;
        // 记录首次播放前高度，供 reset 回到动效前状态
        if (!element.dataset[initialHeightKey]) {
            element.dataset[initialHeightKey] = `${currentHeight}px`;
        }
        if (typeof config.height === 'string' && (config.height.startsWith('+') || config.height.startsWith('-'))) {
            // 增量高度
            const newHeight = parseIncrementalValue(config.height, currentHeight);
            targetHeight = `${newHeight}px`;
        } else {
            // 绝对高度
            targetHeight = typeof config.height === 'number' ? `${config.height}px` : config.height;
        }
    }

    // 应用初始 transform
    if (fromTransforms.length > 0) {
        element.style.transform = [baseTransform, ...fromTransforms]
            .filter(Boolean)
            .join(' ');
    }

    // 使用双重 requestAnimationFrame 确保初始状态被渲染
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // 检查是否使用弹簧动画
            if (config.type === "spring") {
                runSpringAnimation(element, config, toTransforms, targetHeight, baseTransform);
            } else {
                // 默认 Tween 动画
                element.style.transition = `all ${duration}ms ${timing.easing}`;

                if (config.opacity !== undefined) {
                    const to = Array.isArray(config.opacity)
                        ? config.opacity[1]
                        : config.opacity;
                    element.style.opacity = String(to);
                }
                if (config.blur !== undefined) {
                    const to = Array.isArray(config.blur) ? config.blur[1] : config.blur;
                    element.style.filter = [baseFilter, `blur(${typeof to === "number" ? `${to}px` : to})`]
                        .filter(Boolean)
                        .join(" ");
                }
                if (toTransforms.length > 0) {
                    element.style.transform = [baseTransform, ...toTransforms]
                        .filter(Boolean)
                        .join(" ");
                }
                if (targetHeight !== null) {
                    element.style.height = targetHeight;
                }
                window.setTimeout(() => {
                    if (!hadInlineTransform) element.style.transform = "";
                    if (!hadInlineOpacity) element.style.opacity = "";
                    if (!hadInlineFilter) element.style.filter = "";
                    if (!hadInlineTransition) element.style.transition = "";
                }, duration + 50);
            }
        });
    });
}

export function runSpringAnimation(
    element: HTMLElement,
    config: any,
    toTransforms: string[],
    targetHeight: string | null,
    baseTransform = "",
) {
    const timing = resolveMotionCssTiming(config);
    element.style.transition = `all ${timing.duration}ms ${timing.easing}`;

    if (config.opacity !== undefined) {
        const to = Array.isArray(config.opacity) ? config.opacity[1] : config.opacity;
        element.style.opacity = String(to);
    }
    if (config.blur !== undefined) {
        const to = Array.isArray(config.blur) ? config.blur[1] : config.blur;
        element.style.filter = `blur(${typeof to === "number" ? `${to}px` : to})`;
    }

    if (toTransforms.length > 0) {
        element.style.transform = [baseTransform, ...toTransforms]
            .filter(Boolean)
            .join(" ");
    }

    if (targetHeight !== null) {
        element.style.height = targetHeight;
    }
}

/**
 * 应用反向动效到元素
 */
export function applyReverseAnimation(element: HTMLElement, config: any) {
    const timing = resolveMotionCssTiming(config);
    const duration = timing.duration;

    // 收集反向的 transform 值
    const toTransforms: string[] = [];

    const toUnit = (value: string | number) =>
        typeof value === "number" ? `${value}px` : value;
    if (config.scale !== undefined) {
        const [from] = Array.isArray(config.scale) ? config.scale : [0.5, config.scale];
        toTransforms.push(`scale(${from})`);
    }
    if (config.x !== undefined) {
        const [from] = Array.isArray(config.x) ? config.x : [0, config.x];
        toTransforms.push(`translateX(${toUnit(from)})`);
    }
    if (config.y !== undefined) {
        const [from] = Array.isArray(config.y) ? config.y : [0, config.y];
        toTransforms.push(`translateY(${toUnit(from)})`);
    }
    if (config.rotate !== undefined) {
        const [from] = Array.isArray(config.rotate) ? config.rotate : [0, config.rotate];
        toTransforms.push(`rotate(${from}deg)`);
    }

    element.style.transition = `all ${duration}ms ${timing.easing}`;

    if (config.opacity !== undefined) {
        const [from] = Array.isArray(config.opacity) ? config.opacity : [0, config.opacity];
        element.style.opacity = String(from);
    }
    if (toTransforms.length > 0) {
        element.style.transform = toTransforms.join(' ');
    }

    // 处理 height 反向
    if (config.height !== undefined) {
        if (typeof config.height === 'string' && config.height.startsWith('+')) {
            // 减去增量高度
            const currentHeight = element.offsetHeight;
            const decrement = parseFloat(config.height.slice(1).replace('px', ''));
            element.style.height = `${currentHeight - decrement}px`;
        } else if (typeof config.height === 'string' && config.height.startsWith('-')) {
            // 加回减少的高度
            const currentHeight = element.offsetHeight;
            const increment = parseFloat(config.height.slice(1).replace('px', ''));
            element.style.height = `${currentHeight + increment}px`;
        }
    }
}
