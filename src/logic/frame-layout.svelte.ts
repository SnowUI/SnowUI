import type { FrameProps } from "./frame-types";

import type { FrameResponsive } from "./frame-responsive.svelte";

/*
 * Log (2026-02-23): 修复 enableResponsive=false 语义。
 * 无 responsive 实例时不再应用断点覆写（xs/sm/md...），仅保留基础方向（row/column/grid）。
 */
const BREAKPOINTS = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export class FrameLayout {
    #props: FrameProps;
    #responsive: FrameResponsive | null;

    constructor(props: FrameProps, responsive: FrameResponsive | null) {
        this.#props = props;
        this.#responsive = responsive;
    }

    get direction() {
        // 1. 获取基础方向
        let activeDir = this.#getBaseDirection();

        // 2. 能力开关关闭时，不应用任何断点覆写
        if (!this.#responsive) {
            return activeDir;
        }

        // 3. 获取当前断点索引
        const currentBp = this.#responsive.breakpoint ?? 'md';
        const currentIndex = BREAKPOINTS.indexOf(currentBp as typeof BREAKPOINTS[number]);
        if (currentIndex < 0) {
            return activeDir;
        }

        // 4. 级联覆盖 (Mobile First)
        // 从 xs 遍历到当前断点，如果有定义则覆盖
        for (let i = 0; i <= currentIndex; i++) {
            const bp = BREAKPOINTS[i];
            const val = this.#props[bp];
            if (val) {
                activeDir = val;
            }
        }

        return activeDir;
    }

    #getBaseDirection() {
        const { row, column, grid, reverse } = this.#props;
        if (row && reverse) return "row-reverse";
        if (row) return "row";
        if (column && reverse) return "column-reverse";
        if (column) return "column";
        if (grid && reverse) return "grid-reverse";
        if (grid) return "grid";
        return undefined;
    }
}

/**
 * Layout Transition (FLIP)
 * 用于处理布局变化的平滑过渡
 */
export function createLayoutTransition() {
    let rect: DOMRect | null = null;

    return {
        // First: 记录初始状态
        capture(element: HTMLElement) {
            rect = element.getBoundingClientRect();
        },
        // Last -> Invert -> Play: 记录结束状态，计算差异，并播放动画
        play(element: HTMLElement, options: { duration?: number } = {}) {
            if (!rect) return;

            const newRect = element.getBoundingClientRect();
            const dx = rect.left - newRect.left;
            const dy = rect.top - newRect.top;
            const dw = rect.width / newRect.width;
            const dh = rect.height / newRect.height;

            // 如果没有变化，不执行动画
            if (dx === 0 && dy === 0 && dw === 1 && dh === 1) {
                return;
            }

            // Invert: 瞬间应用逆变换，使元素看起来还在原来的位置
            element.style.transform = `translate(${dx}px, ${dy}px) scale(${dw}, ${dh})`;
            element.style.transformOrigin = 'top left'; // 确保缩放原点正确
            element.style.transition = 'none';

            // Play: 下一帧移除变换，让元素过渡到新位置
            requestAnimationFrame(() => {
                // 强制重绘
                element.getBoundingClientRect();

                element.style.transform = '';
                element.style.transition = `transform ${options.duration || 300}ms ease`;

                // 动画结束后清理
                const cleanup = () => {
                    element.style.transition = '';
                    element.style.transformOrigin = '';
                    element.removeEventListener('transitionend', cleanup);
                };
                element.addEventListener('transitionend', cleanup);
            });
        }
    };
}
