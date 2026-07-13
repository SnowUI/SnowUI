/**
 * frame-skeleton-runtime.svelte.ts
 * v1.0.0
 * 职责：统一处理 Frame 的 Skeleton probe、子骨架探测与加载渲染前判定。
 *
 * Log:
 * - [2026-03-09] Init: 从 Frame.svelte 抽离 Skeleton probe、首层子骨架收集、renderHints 解析与 shouldRenderSkeleton 等渲染前判定。
 */

import type { FrameProps, RenderHints } from "./frame-types";

export type ProbedSkeletonChild = {
    componentClass: string;
    renderHints?: RenderHints;
};

export interface FrameSkeletonRuntimeOptions {
    getFrameProps: () => FrameProps;
    getEffectiveLoading: () => boolean;
    getEffectiveSkeleton: () => boolean;
    getSkeletonComponentKey: () => string | undefined;
    getProbeHost: () => HTMLElement | undefined;
}

function parseSkeletonChildHints(node: HTMLElement): RenderHints | undefined {
    const variant = node.dataset.renderHintVariant;
    const width = node.dataset.renderHintWidth;
    const height = node.dataset.renderHintHeight;
    const rowsValue = node.dataset.renderHintRows;
    const rows =
        rowsValue !== undefined
            ? Number.parseInt(rowsValue, 10)
            : undefined;

    if (
        variant === undefined &&
        width === undefined &&
        height === undefined &&
        rowsValue === undefined
    ) {
        return undefined;
    }

    return {
        variant: variant as RenderHints["variant"],
        width,
        height,
        rows: Number.isFinite(rows) ? rows : undefined,
    };
}

function collectFirstLayerSkeletonChildren(
    host?: HTMLElement,
): ProbedSkeletonChild[] {
    if (!host) return [];

    return Array.from(host.children)
        .filter(
            (child): child is HTMLElement =>
                child instanceof HTMLElement &&
                child.dataset.snowuiFrame === "true",
        )
        .map((child) => ({
            componentClass: child.className,
            renderHints: parseSkeletonChildHints(child),
        }))
        .filter((child) => child.componentClass.trim().length > 0);
}

export function createFrameSkeletonRuntime(
    options: FrameSkeletonRuntimeOptions,
) {
    let probedSkeletonChildren = $state<ProbedSkeletonChild[]>([]);
    let skeletonProbeResolved = $state(false);

    const shouldRenderSkeleton = $derived(
        options.getEffectiveLoading() &&
            options.getEffectiveSkeleton() &&
            !options.getFrameProps().stateContent &&
            (options.getSkeletonComponentKey() !== undefined ||
                !options.getFrameProps().children),
    );
    const needsSkeletonProbe = $derived(
        shouldRenderSkeleton &&
            options.getSkeletonComponentKey() === "frame" &&
            !!options.getFrameProps().children,
    );
    const shouldRenderProbedChildSkeletons = $derived(
        needsSkeletonProbe &&
            skeletonProbeResolved &&
            probedSkeletonChildren.length > 0,
    );
    const shouldRenderDirectSkeleton = $derived(
        shouldRenderSkeleton &&
            (!needsSkeletonProbe ||
                (skeletonProbeResolved &&
                    probedSkeletonChildren.length === 0)),
    );

    $effect(() => {
        if (!needsSkeletonProbe) {
            probedSkeletonChildren = [];
            skeletonProbeResolved = false;
            return;
        }

        const probeHost = options.getProbeHost();
        if (!probeHost) {
            return;
        }

        const updateProbedChildren = () => {
            probedSkeletonChildren =
                collectFirstLayerSkeletonChildren(probeHost);
            skeletonProbeResolved = true;
        };

        updateProbedChildren();

        const observer = new MutationObserver(() => {
            updateProbedChildren();
        });

        observer.observe(probeHost, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                "class",
                "data-snowui-frame",
                "data-render-hint-variant",
                "data-render-hint-width",
                "data-render-hint-height",
                "data-render-hint-rows",
            ],
        });

        return () => {
            observer.disconnect();
        };
    });

    return {
        get probedSkeletonChildren() {
            return probedSkeletonChildren;
        },
        get shouldRenderSkeleton() {
            return shouldRenderSkeleton;
        },
        get needsSkeletonProbe() {
            return needsSkeletonProbe;
        },
        get shouldRenderProbedChildSkeletons() {
            return shouldRenderProbedChildSkeletons;
        },
        get shouldRenderDirectSkeleton() {
            return shouldRenderDirectSkeleton;
        },
    };
}
