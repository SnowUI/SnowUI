// 内容边缘渐隐遮罩（Edge Fade Mask）共享能力。
//
// 用途：当“悬浮操作层”（覆盖在内容之上的按钮 / 复选框 / 操作块）浮在内容之上时，
// 让其下方内容朝控件一侧渐隐到透明，保证浮层控件清晰可读，又不出现硬切边。
// 典型消费者：Table overlay 角色列（checkbox 列、actions 列、表头第一列），
// 以及后续任何“内容朝某条边缘渐隐”的场景（滚动区边缘、轮播边缘等）。
//
// 该能力只负责生成 `mask-image` 的 linear-gradient 字符串（纯函数、不读 DOM、
// 不绑定 Svelte 生命周期），渐隐的触发时机（hover / focus / 选中）与“完全透明区宽度”
// 的来源（百分比 / 实测像素 / CSS 变量）都由消费方决定。

export type EdgeFadeDirection = "to left" | "to right" | "to top" | "to bottom";

export interface EdgeFadeMaskOptions {
    /** 渐隐方向；内容朝该方向（该条边缘）渐隐到透明。 */
    direction: EdgeFadeDirection;
    /**
     * 完全透明（内容隐藏）区的终点：从该边缘到此位置内容完全透明（用于盖住浮层控件）。
     * 接受任意 CSS 长度 / 百分比 / `var()` / `calc()`，例如 `"15%"`、`"var(--w)"`。
     */
    fadeStart: string;
    /**
     * 完全不透明（内容清晰）区的起点：从此位置起内容完全可见；
     * `fadeStart` → `fadeEnd` 之间为柔和过渡。须在视觉上位于 `fadeStart` 之后。
     */
    fadeEnd: string;
    /** 可见区使用的颜色（mask 只取 alpha 通道），默认 `#000`。 */
    visibleColor?: string;
}

const DEFAULT_VISIBLE_COLOR = "#000";

/**
 * 生成 edge fade 的 `linear-gradient(...)` 字符串。
 * 结构固定为：`linear-gradient(<direction>, transparent <fadeStart>, <visibleColor> <fadeEnd>)`。
 */
export function createEdgeFadeMaskImage(options: EdgeFadeMaskOptions): string {
    const {
        direction,
        fadeStart,
        fadeEnd,
        visibleColor = DEFAULT_VISIBLE_COLOR,
    } = options;
    return `linear-gradient(${direction}, transparent ${fadeStart}, ${visibleColor} ${fadeEnd})`;
}

/**
 * 生成可直接拼进内联 `style` 的声明串：同时输出 `-webkit-mask-image` 与 `mask-image`。
 * 适用于把渐隐直接挂在元素上的场景；hover 等需要按状态切换的场景，
 * 建议把 `createEdgeFadeMaskImage` 的结果存到一个 CSS 变量上，再由消费方的状态规则消费。
 */
export function createEdgeFadeMaskStyle(options: EdgeFadeMaskOptions): string {
    const image = createEdgeFadeMaskImage(options);
    return `-webkit-mask-image:${image};mask-image:${image};`;
}
