/**
 * Frame Scale Observer
 * 统一监听容器宽高并写入运行时 CSS 变量，供 scale.css 作为默认值回退使用。
 *
 * 设计目标：
 * - 不覆盖外部 class 显式设置的 `--snowui-scale-height` / `--snowui-scale-width`
 * - 写入 `--snowui-scale-height-runtime` / `--snowui-scale-width-runtime` / `--snowui-scale-aspect-ratio-runtime`
 * - 基于共享 ResizeObserver 管理器，避免重复观察器开销
 */

import { resizeManager } from "./observer.svelte";

export interface ScaleObserverOptions {
    heightVar?: string;
    widthVar?: string;
    aspectRatioVar?: string;
    sizeVar?: string;
    target?: "self" | "parent";
    basis?: "height" | "width" | "mixed" | "aspect";
    mixHeightWeight?: number;
    aspectBaseRatio?: number;
    sizeRatio?: number;
    onResize?: (width: number, height: number, size: number) => void;
}

export function frameScaleObserver(
    node: HTMLElement,
    options: ScaleObserverOptions | undefined,
) {
    const heightVar = options?.heightVar || "--snowui-scale-height-runtime";
    const widthVar = options?.widthVar || "--snowui-scale-width-runtime";
    const aspectRatioVar =
        options?.aspectRatioVar || "--snowui-scale-aspect-ratio-runtime";
    const sizeVar = options?.sizeVar || "--snowui-scale-size-runtime";
    const target = options?.target || "self";
    const basis = options?.basis || "height";
    const mixHeightWeight =
        options?.mixHeightWeight !== undefined ? options.mixHeightWeight : 0.5;
    const aspectBaseRatio =
        options?.aspectBaseRatio !== undefined ? options.aspectBaseRatio : 1;
    const sizeRatio = options?.sizeRatio !== undefined ? options.sizeRatio : 1;
    const onResize = options?.onResize;

    const getTarget = () =>
        target === "parent" ? (node.parentElement || node) : node;

    const apply = (width: number, height: number) => {
        const el = getTarget();
        if (
            !el ||
            !Number.isFinite(height) ||
            !Number.isFinite(width) ||
            width <= 0 ||
            height <= 0
        )
            return;
        el.style.setProperty(heightVar, `${height}px`);
        el.style.setProperty(widthVar, `${width}px`);
        const aspectRatio = width / height;
        el.style.setProperty(aspectRatioVar, `${aspectRatio}`);

        let basisSize = height;
        if (basis === "width") {
            basisSize = width;
        } else if (basis === "mixed") {
            const hWeight = Math.min(Math.max(mixHeightWeight, 0), 1);
            const wWeight = 1 - hWeight;
            basisSize = height * hWeight + width * wWeight;
        } else if (basis === "aspect") {
            const safeBaseRatio = aspectBaseRatio > 0 ? aspectBaseRatio : 1;
            basisSize = height * (aspectRatio / safeBaseRatio);
        }

        const resolvedSize = basisSize * sizeRatio;
        el.style.setProperty(sizeVar, `${resolvedSize}px`);

        // Callback for Orchestration
        if (onResize) onResize(width, height, resolvedSize);
    };

    const watchTarget = getTarget();
    const unwatch = resizeManager.watch(watchTarget, (entry) => {
        apply(entry.contentRect.width, entry.contentRect.height);
    });

    const rect = watchTarget.getBoundingClientRect();
    apply(rect.width, rect.height);

    return {
        update(next?: ScaleObserverOptions) {
            // 当前版本以首次挂载参数为准，避免频繁重绑观察器
            if (!next) return;
        },
        destroy() {
            unwatch?.();
        },
    };
}
