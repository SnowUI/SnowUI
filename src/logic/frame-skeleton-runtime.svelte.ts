/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * frame-skeleton-runtime.svelte.ts
 * v1.1.0
 * 职责：统一处理 Frame 的 Skeleton probe、子骨架探测与加载渲染前判定。
 *
 * Log:
 * - [2026-08-15] Change: `renderHints` 改为组件自注册信号；首层 probe 只收集已注册 child，不再依赖集中 class key。
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
    /** @deprecated v1.1 起不再读取；仅保留跨包类型兼容。 */
    getSkeletonComponentKey?: () => string | undefined;
    getProbeHost: () => HTMLElement | undefined;
}

function parseSkeletonChildHints(node: HTMLElement): RenderHints | undefined {
    const variant = node.dataset.renderHintVariant;
    const width = node.dataset.renderHintWidth;
    const height = node.dataset.renderHintHeight;
    const radius = node.dataset.renderHintRadius;
    const rowsValue = node.dataset.renderHintRows;
    const rows =
        rowsValue !== undefined
            ? Number.parseInt(rowsValue, 10)
            : undefined;

    if (
        variant === undefined &&
        width === undefined &&
        height === undefined &&
        radius === undefined &&
        rowsValue === undefined
    ) {
        return undefined;
    }

    return {
        variant: variant as RenderHints["variant"],
        width,
        height,
        radius,
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
                child.dataset.skeletonRegistered === "true",
        )
        .map((child) => ({
            componentClass: child.className,
            renderHints: parseSkeletonChildHints(child),
        }));
}

export function createFrameSkeletonRuntime(
    options: FrameSkeletonRuntimeOptions,
) {
    let probedSkeletonChildren = $state<ProbedSkeletonChild[]>([]);
    let skeletonProbeResolved = $state(false);

    const shouldRenderSkeleton = $derived(
        options.getEffectiveLoading() &&
            options.getEffectiveSkeleton() &&
            !options.getFrameProps().stateContent,
    );
    const needsSkeletonProbe = $derived(
        shouldRenderSkeleton &&
            options.getFrameProps().renderHints === undefined &&
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
                "data-skeleton-registered",
                "data-render-hint-variant",
                "data-render-hint-width",
                "data-render-hint-height",
                "data-render-hint-radius",
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
