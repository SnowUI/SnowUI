/**
 * Frame 逻辑通用工具函数
 * v1.1.3
 * 2026-03-07: 新增 loading / skeleton 过滤与动效识别支持，释放 whileLoad 关键字回归纯动效。
 * 2026-03-03: 修复 transform 数组配置仅取终值的问题，支持 from->to 动画（用于 morph 自动动效）
 * 2026-03-03: 补齐 rotateY 变换输出，支持 Flip 默认动效走 3D 翻转。
 */
import type { FrameProps } from "./frame-types";
import type { MotionConfig } from "./motion-config";
import { resolveSnowUIColor } from "../lib/color";
import { resolveMotionCssTiming } from "../motion/spring";

/**
 * 检查是否包含动效配置
 * 用于判断是否需要生成 ID 或注册到动效编排器
 */
export function hasMotionConfig(props: FrameProps): boolean {
    return (
        !!props.orchestrate ||
        // 事件/状态触发器会激活默认 while* 动效
        !!props.Click ||
        !!props.Drag ||
        !!props.Hover ||
        !!props.Focus ||
        !!props.Key ||
        !!props.Scroll ||
        !!props.StartLoad ||
        !!props.Load ||
        !!props.Reload ||
        !!props.Appear ||
        !!props.Disappear ||
        !!props.Idle ||
        !!props.Active ||
        !!props.Disabled ||
        !!props.Validating ||
        !!props.Uploading ||
        !!props.Editing ||
        !!props.loading ||
        !!props.whileLoad ||
        !!props.whileReload ||
        !!props.whileAppear ||
        !!props.whileDisappear ||
        !!props.whileIdle ||
        !!props.whileActive ||
        !!props.whileDisabled ||
        !!props.whileClick ||
        !!props.whileDrag ||
        !!props.whileHover ||
        !!props.whileFocus ||
        !!props.whileKey ||
        !!props.whileScroll ||
        !!props.whileValidating ||
        !!props.whileUploading ||
        !!props.whileEditing ||
        !!props.whileCollapsed ||
        !!props.whileExpanded ||
        !!props.whileXs ||
        !!props.whileSm ||
        !!props.whileMd ||
        !!props.whileLg ||
        !!props.whileXl ||
        !!props.while2xl ||
        !!props.timeline ||
        !!props.variants ||
        !!props.scroll ||
        !!props.layoutId ||
        !!props.itemId
    );
}

export function motionConfigToStyle(
    config: MotionConfig | undefined,
    animationName = "snowui-frame-transform-motion",
): string {
    if (!config || typeof config !== "object") return "";
    const styles: string[] = [];
    const toTransforms: string[] = [];
    const fromTransforms: string[] = [];
    let hasTransformFromState = false;
    let hasOpacityFromState = false;
    let hasBlurFromState = false;

    const toUnitValue = (value: string | number) =>
        typeof value === "number" ? `${value}px` : value;

    if (config.scale !== undefined) {
        if (Array.isArray(config.scale)) {
            const from = config.scale[0];
            const to = config.scale[1];
            fromTransforms.push(`scale(${from})`);
            toTransforms.push(`scale(${to})`);
            hasTransformFromState = true;
        } else {
            toTransforms.push(`scale(${config.scale})`);
        }
    }
    if (config.opacity !== undefined) {
        if (Array.isArray(config.opacity)) {
            const from = config.opacity[0];
            const to = config.opacity[1];
            styles.push(`--snowui-frame-opacity-from: ${from}`);
            styles.push(`--snowui-frame-opacity-to: ${to}`);
            styles.push("--su-motion-opacity: var(--snowui-frame-opacity-to)");
            hasOpacityFromState = true;
        } else {
            styles.push(`--su-motion-opacity: ${config.opacity}`);
            styles.push(`--snowui-frame-opacity-static: ${config.opacity}`);
        }
    }
    if (config.blur !== undefined) {
        if (Array.isArray(config.blur)) {
            const from = toUnitValue(config.blur[0]);
            const to = toUnitValue(config.blur[1]);
            styles.push(`--snowui-frame-blur-from: blur(${from})`);
            styles.push(`--snowui-frame-blur-to: blur(${to})`);
            hasBlurFromState = true;
        } else {
            styles.push(`filter: blur(${toUnitValue(config.blur)})`);
        }
    }

    // Width 和 Height 通常属于排版级，非动效强占对象，但若存在配置，也可以代理或保持内联。
    // 为保持重构极简与最大向后兼容，宽高变形等暂时保留原样，重点降权 transform 和背景、透明度。
    if (config.height !== undefined) {
        const h = config.height;
        if (typeof h === "string" && h.startsWith("+")) {
            styles.push(`margin-top: -${h.slice(1)}`);
            styles.push(`padding-bottom: ${h.slice(1)}`);
        } else if (typeof h === "string" && h.startsWith("-")) {
            styles.push(`margin-top: ${h.slice(1)}`);
            styles.push(`padding-bottom: -${h.slice(1)}`);
        } else {
            styles.push(`height: ${h}`);
        }
    }
    if (config.width !== undefined) {
        styles.push(
            `width: ${typeof config.width === "number" ? `${config.width}px` : config.width}`,
        );
    }

    if (config.backgroundColor !== undefined) {
        styles.push(`--su-motion-bg: ${resolveSnowUIColor(config.backgroundColor)}`);
    }
    if (config.color !== undefined) {
        styles.push(`--su-motion-color: ${resolveSnowUIColor(config.color)}`);
    }
    if (config.y !== undefined) {
        if (Array.isArray(config.y)) {
            const from = config.y[0];
            const to = config.y[1];
            fromTransforms.push(`translateY(${toUnitValue(from)})`);
            toTransforms.push(`translateY(${toUnitValue(to)})`);
            hasTransformFromState = true;
        } else {
            toTransforms.push(`translateY(${toUnitValue(config.y)})`);
        }
    }
    if (config.x !== undefined) {
        if (Array.isArray(config.x)) {
            const from = config.x[0];
            const to = config.x[1];
            fromTransforms.push(`translateX(${toUnitValue(from)})`);
            toTransforms.push(`translateX(${toUnitValue(to)})`);
            hasTransformFromState = true;
        } else {
            toTransforms.push(`translateX(${toUnitValue(config.x)})`);
        }
    }
    if (config.rotate !== undefined) {
        if (Array.isArray(config.rotate)) {
            const from = config.rotate[0];
            const to = config.rotate[1];
            fromTransforms.push(`rotate(${from}deg)`);
            toTransforms.push(`rotate(${to}deg)`);
            hasTransformFromState = true;
        } else {
            toTransforms.push(`rotate(${config.rotate}deg)`);
        }
    }
    if (config.rotateY !== undefined) {
        if (Array.isArray(config.rotateY)) {
            const from = config.rotateY[0];
            const to = config.rotateY[1];
            fromTransforms.push(`rotateY(${from}deg)`);
            toTransforms.push(`rotateY(${to}deg)`);
            hasTransformFromState = true;
        } else {
            toTransforms.push(`rotateY(${config.rotateY}deg)`);
        }
    }

    if (toTransforms.length > 0) {
        if (hasTransformFromState) {
            const from = fromTransforms.length
                ? fromTransforms.join(" ")
                : "none";
            const to = toTransforms.join(" ");
            styles.push(`--snowui-frame-transform-from: ${from}`);
            styles.push(`--snowui-frame-transform-to: ${to}`);
            // 解除硬编码 transform
            styles.push("--su-motion-transform: var(--snowui-frame-transform-to)");
            const timing = resolveMotionCssTiming(config);
            const delay = config.delay ?? 0;
            // 动画本身由于需要挂载 keyframes 仍保留直写，但这里最好也转变量委派，
            // 考虑 keyframes 可以作用于内联和代理的 transform 属性冲突情况，这里暂时保持 animation 实体
            styles.push(
                `animation: ${animationName} ${timing.duration}ms ${timing.easing} ${delay}ms both`,
            );
        } else {
            styles.push(`--su-motion-transform: ${toTransforms.join(" ")}`);
        }
    } else if (hasOpacityFromState || hasBlurFromState) {
        const timing = resolveMotionCssTiming(config);
        const delay = config.delay ?? 0;
        styles.push(
            `animation: ${animationName} ${timing.duration}ms ${timing.easing} ${delay}ms both`,
        );
    }

    if (
        (config.duration !== undefined || config.easing !== undefined) &&
        !hasTransformFromState &&
        !hasOpacityFromState &&
        !hasBlurFromState
    ) {
        const timing = resolveMotionCssTiming(config);
        styles.push(
            `--su-motion-transition: all ${timing.duration}ms ${timing.easing}`,
        );
    }

    return styles.join("; ");
}

/**
 * 创建 readonly 模式的事件阻断处理器
 * @param access - 访问权限
 * @returns 事件处理器或 undefined
 */
export function createReadonlyHandler(access: string | undefined) {
    if (access !== "readonly") return undefined;
    return (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
    };
}

/**
 * 需要从 props 中过滤掉的属性键列表
 * 这些属性不应透传到 DOM 元素
 */
export const FILTERED_PROP_KEYS = [
    // 组件内部属性
    "loading", "disabled", "skeleton", "renderHints",
    // 动效属性
    "whileHover", "whileClick", "whileFocus", "whileDrag", "whileScroll",
    "whileKey", "whileLoad", "whileReload", "whileActive", "whileDisabled",
    "whileAppear", "whileDisappear", "whileIdle", "whileValidating",
    "whileUploading", "whileEditing", "whileXs", "whileSm", "whileMd",
    "whileLg", "whileXl", "while2xl", "variants", "scroll", "timeline",
    "orchestrate", "orchestrateMode", "orchestrateDelay", "orchestrateOrder",
    "orchestrateGroup", "orchestrateTrigger", "orchestrateTarget",
    "loopMotion",
    // Frame 特有属性
    "morph", "tag", "as", "use", "scope", "access",
    // 状态机属性
    "Click", "Hover", "Focus", "Key", "Active", "Load", "Reload",
    "Drag", "Scroll", "StartLoad", "Appear", "Disappear", "Idle", "Disabled",
    "Validating", "Uploading", "Editing", "onReload",
    // 布局属性
    "row", "column", "grid", "reverse", "collapsed", "expanded",
    // 响应式布局
    "xs", "sm", "md", "lg", "xl", "2xl",
    // 其他
    "layoutId", "customStates", "whileCollapsed", "whileExpanded", "itemId",
    "responsive", "children"
] as const;
