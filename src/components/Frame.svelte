<!--
  Frame OSS v1.3.1
  职责：自包含 Frame 容器（作用半径 = 1 个 Frame）。
  能力：状态机、JS 动效执行、自身 FLIP、Scale Observer、Perception、Skeleton、stateContent Grid Stacking。
  边界：不含跨组件协调（§7.7 编排模式 / §8 联动控制 / §10 样式编排），那些能力在 FramePro。
  关键字定义：./Frame.md（本目录，OSS 版规范）；全量关键字 API 见仓库根 ../../../Frame.md。

  v1.0.0 (2026-05-06): OSS / PRO 切割线重构。OSS Frame 接入完整状态机、动效执行、FLIP、Scale Observer、Perception、stateContent。
                       详见 /Frame-Refactor-Plan.md。
  v1.3.1 (2026-08-17): Responsive 与 Scale Observer 统一复用 SSR-safe、按帧交付的共享 resizeManager。
  v0.1.0 (起点): OSS 仅做 props 归一化、CSS class 拼装、bridge 变量、skeleton 渲染。
-->

<script module lang="ts">
    export * from "../logic/frame-types";
</script>

<script lang="ts">
    import "../motion/rotate.css";
    import { setContext, getContext } from "svelte";
    import { SIZE_CONTEXT_KEY, SKELETON_CONTEXT_KEY } from "../keys";
    import type { FrameProps } from "../logic/frame-types";
    import { Identity } from "../logic/frame-identity.svelte";
    import { FrameState } from "../logic/frame-state.svelte";
    import { FrameLayout } from "../logic/frame-layout.svelte";
    import { FrameResponsive } from "../logic/frame-responsive.svelte";
    import { FrameMotion } from "../logic/frame-motion.svelte";
    import { FramePerception } from "../logic/frame-perception.svelte";
    import { frameScaleObserver } from "../logic/frame-scale-observer.svelte";
    import { resolveScaleObserverOptions } from "../logic/frame-scale-resolver.svelte";
    import {
        buildFrameActions,
        mountFrameActions,
    } from "../logic/frame-actions.svelte";
    import { FRAME_MOTION_DEFAULTS } from "../logic/frame-motion-defaults";
    import { createFrameInlineStyleRuntime } from "../logic/frame-inline-style.svelte";
    import { createFrameDomRuntime } from "../logic/frame-dom-runtime.svelte";
    import { createFrameSkeletonRuntime } from "../logic/frame-skeleton-runtime.svelte";
    import { createFrameClassStateRuntime } from "../logic/frame-class-state.svelte";
    import { provideComponentParts } from "../logic/component-parts.svelte";
    import Skeleton from "./Skeleton.svelte";

    interface Props extends FrameProps {
        [key: string]: any;
    }

    let { element = $bindable(), ...rawProps }: Props = $props();

    // === 0. Props ===
    const frameProps = $derived(rawProps);
    provideComponentParts(() => frameProps.componentParts);

    // === 0.1 能力开关 ===
    const enableResponsive = $derived(frameProps.enableResponsive ?? true);
    const enableContext = $derived(frameProps.enableContext ?? true);
    const enableScaleObserver = $derived(frameProps.enableScaleObserver ?? false);

    // === 1. 身份 (Identity) ===
    // svelte-ignore state_referenced_locally
    const identity = new Identity(frameProps);

    // === 2. 响应式 (Responsive) ===
    // OSS 不支持 orchestrate*，所以 needsResponsive 仅依赖 frameProps.responsive
    const needsResponsive = $derived(
        enableResponsive && frameProps.responsive !== undefined,
    );
    // svelte-ignore state_referenced_locally
    const responsive = needsResponsive ? new FrameResponsive() : null;

    // === 3. 布局 (Layout) ===
    // svelte-ignore state_referenced_locally
    const layout = new FrameLayout(frameProps, responsive);

    // === 4. 状态 (State) ===
    // OSS 不接受 motion 参数（PRO 用它做 §8 联动控制；OSS 不支持联动）
    const parentSkeletonContext = getContext<
        { loading: boolean; skeleton?: boolean } | undefined
    >(SKELETON_CONTEXT_KEY);
    // svelte-ignore state_referenced_locally
    const frameState = new FrameState(frameProps);

    // === 5. 动效 (Motion) ===
    // OSS FrameMotion 仅承担：自身 FLIP 进场（layoutId/itemId）+ whileScroll 监听
    // 状态驱动的视觉动效由 frame-inline-style 注入 CSS bridge 变量，由浏览器 transition 完成
    // svelte-ignore state_referenced_locally
    const motion = new FrameMotion(
        frameProps,
        frameState,
        () => identity.id,
        () => element,
    );

    // === 6. 加载 / Skeleton 状态 ===
    const inheritedLoading = $derived(parentSkeletonContext?.loading ?? false);
    const inheritedSkeleton = $derived(parentSkeletonContext?.skeleton ?? true);
    const explicitLoading = $derived(frameProps.loading === true);
    const explicitSkeleton = $derived(frameProps.skeleton);
    const stateLoading = $derived(
        frameState.currentState === "StartLoad" ||
            frameState.currentState === "Load",
    );
    const effectiveLoading = $derived(
        inheritedLoading || explicitLoading || stateLoading,
    );
    const effectiveSkeleton = $derived(explicitSkeleton ?? inheritedSkeleton);

    // === 7. 感知 (Perception) ===
    // svelte-ignore state_referenced_locally
    if (enableContext) {
        new FramePerception(
            frameProps,
            frameState,
            layout,
            responsive,
            () => effectiveLoading,
            () => effectiveSkeleton,
        );
        // svelte-ignore state_referenced_locally
        if (frameProps.size !== undefined) {
            setContext(SIZE_CONTEXT_KEY, {
                get size() {
                    return frameProps.size as number;
                },
            });
        }
    }

    // === 8. Scale Observer ===
    // OSS 版：不向 orchestrator 上报 width/height/size（无 orchestrator）
    const scaleObserverOptions = $derived(resolveScaleObserverOptions(frameProps));
    const hasScaleApplyConfig = $derived(
        frameProps.sizeRatio !== undefined ||
            frameProps.iconSizeRatio !== undefined ||
            frameProps.avatarSizeRatio !== undefined,
    );

    // === 9. 多指令 (FrameActions) ===
    function multiuse(node: HTMLElement, actions: any[] | undefined) {
        const allActions = buildFrameActions({
            userActions: actions,
            scaleAction: enableScaleObserver
                ? [frameScaleObserver, scaleObserverOptions]
                : null,
            responsiveAction: responsive?.resizeObserver ?? null,
        });
        return mountFrameActions(node, allActions);
    }

    // === 10. State-driven class/style/content ===
    const classStateRuntime = createFrameClassStateRuntime({
        getFrameProps: () => frameProps,
        frameState,
        layout,
        responsive,
        getEffectiveLoading: () => effectiveLoading,
        getElement: () => element,
    });
    const resolvedStateStyle = $derived(classStateRuntime.resolvedStateStyle);
    const computedClass = $derived(classStateRuntime.computedClass);
    const childrenRenderContext = $derived(classStateRuntime.childrenRenderContext);

    // === 11. Skeleton ===
    let skeletonProbe = $state<HTMLElement>();
    const skeletonRuntime = createFrameSkeletonRuntime({
        getFrameProps: () => frameProps,
        getEffectiveLoading: () => effectiveLoading,
        getEffectiveSkeleton: () => effectiveSkeleton,
        getProbeHost: () => skeletonProbe,
    });
    const shouldRenderSkeleton = $derived(skeletonRuntime.shouldRenderSkeleton);
    const needsSkeletonProbe = $derived(skeletonRuntime.needsSkeletonProbe);
    const shouldRenderProbedChildSkeletons = $derived(
        skeletonRuntime.shouldRenderProbedChildSkeletons,
    );
    const shouldRenderDirectSkeleton = $derived(
        skeletonRuntime.shouldRenderDirectSkeleton,
    );
    const probedSkeletonChildren = $derived(skeletonRuntime.probedSkeletonChildren);

    // === 12. Inline Style（含 while* bridge 变量）===
    // OSS：getOrchestratedStyle 始终返回空字符串（OSS 无 §10 样式编排）
    const inlineStyleRuntime = createFrameInlineStyleRuntime({
        getFrameProps: () => frameProps,
        frameState,
        motion,
        getIdentityId: () => identity.id,
        getEffectiveLoading: () => effectiveLoading,
        getShouldRenderSkeleton: () => shouldRenderSkeleton,
        getResolvedStateStyle: () => resolvedStateStyle,
        getOrchestratedStyle: () => "",
    });
    const computedStyle = $derived(inlineStyleRuntime.computedStyle);

    // === 13. DOM runtime ===
    const domRuntime = createFrameDomRuntime({
        getFrameProps: () => frameProps,
        frameState,
        getEffectiveLoading: () => effectiveLoading,
        getHasScaleApplyConfig: () => hasScaleApplyConfig,
    });
    const resolvedTag = $derived(domRuntime.resolvedTag);
    const domPropsWithAccessibility = $derived(domRuntime.domProps);
    const captureHandlers = $derived(domRuntime.captureHandlers);
    const nativeHandlers = $derived(domRuntime.nativeHandlers);
    const runtimeDataAttrs = $derived(domRuntime.dataAttrs);

    // === 14. Controller（OSS 仅暴露 FLIP 自身转场方法）===
    export function getController() {
        return motion.controller;
    }
</script>

<svelte:element
    this={resolvedTag}
    {...domPropsWithAccessibility}
    id={identity.id}
    data-snowui-frame={true}
    use:multiuse={frameProps.use || []}
    class={computedClass}
    bind:this={element}
    onclickcapture={captureHandlers.onclickcapture}
    onmousedowncapture={captureHandlers.onmousedowncapture}
    ontouchstartcapture={captureHandlers.ontouchstartcapture}
    onkeydowncapture={captureHandlers.onkeydowncapture}
    onclick={nativeHandlers.onclick}
    ondblclick={nativeHandlers.ondblclick}
    oncontextmenu={nativeHandlers.oncontextmenu}
    onmouseenter={nativeHandlers.onmouseenter}
    onmouseleave={nativeHandlers.onmouseleave}
    onmousemove={nativeHandlers.onmousemove}
    onmousedown={nativeHandlers.onmousedown}
    onmouseup={nativeHandlers.onmouseup}
    ontouchstart={nativeHandlers.ontouchstart}
    ontouchend={nativeHandlers.ontouchend}
    ontouchmove={nativeHandlers.ontouchmove}
    ontouchcancel={nativeHandlers.ontouchcancel}
    onfocus={nativeHandlers.onfocus}
    onblur={nativeHandlers.onblur}
    onkeydown={nativeHandlers.onkeydown}
    onkeyup={nativeHandlers.onkeyup}
    onkeypress={nativeHandlers.onkeypress}
    oninput={nativeHandlers.oninput}
    onchange={nativeHandlers.onchange}
    onsubmit={nativeHandlers.onsubmit}
    onscroll={nativeHandlers.onscroll}
    ondragstart={nativeHandlers.ondragstart}
    ondrag={nativeHandlers.ondrag}
    ondragend={nativeHandlers.ondragend}
    style={computedStyle}
    {...runtimeDataAttrs}
>
    {#if needsSkeletonProbe && frameProps.children}
        <div bind:this={skeletonProbe} aria-hidden="true" style="display: none;">
            {@render frameProps.children(childrenRenderContext)}
        </div>
    {/if}
    {#if shouldRenderProbedChildSkeletons}
        {#each probedSkeletonChildren as child}
            <Skeleton
                componentClass={child.componentClass}
                renderHints={child.renderHints}
            />
        {/each}
    {:else if shouldRenderDirectSkeleton}
        <Skeleton
            componentClass={computedClass}
            renderHints={frameProps.renderHints}
        />
    {:else if frameProps.stateContent}
        <!-- stateContent: Grid Stacking 确保切换时尺寸不跳动且互相堆叠 -->
        <div
            style="display: grid; align-items: inherit; justify-content: inherit; gap: inherit; width: 100%; height: 100%;"
        >
            {#each Object.entries(frameProps.stateContent) as [contentState, snippet]}
                <div
                    style="grid-area: 1 / 1; display: flex; flex-direction: inherit; align-items: inherit; justify-content: inherit; gap: inherit; opacity:{frameState.currentState ===
                    contentState
                        ? 1
                        : 0};transform:scale({frameState.currentState ===
                    contentState
                        ? 1
                        : 0.01});transition:all {frameState.currentState ===
                    contentState
                        ? `${FRAME_MOTION_DEFAULTS.contentCrossfadeIn.duration}ms ${FRAME_MOTION_DEFAULTS.contentCrossfadeIn.easing} ${FRAME_MOTION_DEFAULTS.contentCrossfadeIn.delay}ms`
                        : `${FRAME_MOTION_DEFAULTS.contentCrossfadeOut.duration}ms ${FRAME_MOTION_DEFAULTS.contentCrossfadeOut.easing}`};pointer-events:{frameState.currentState ===
                    contentState
                        ? 'auto'
                        : 'none'};"
                >
                    {#if snippet}
                        {@render snippet()}
                    {/if}
                </div>
            {/each}
        </div>
    {:else if frameProps.children}
        {@render frameProps.children(childrenRenderContext)}
    {/if}
</svelte:element>

<style>
    @keyframes -global-snowui-frame-transform-motion {
        from {
            transform: var(--snowui-frame-transform-from, none);
            opacity: var(--snowui-frame-opacity-from, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-from);
        }
        to {
            transform: var(--snowui-frame-transform-to, none);
            opacity: var(--snowui-frame-opacity-to, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-to);
        }
    }

    @keyframes -global-snowui-frame-appear-transform-motion {
        from {
            transform: var(--snowui-frame-transform-from, none);
            opacity: var(--snowui-frame-opacity-from, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-from);
        }
        to {
            transform: var(--snowui-frame-transform-to, none);
            opacity: var(--snowui-frame-opacity-to, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-to);
        }
    }

    @keyframes -global-snowui-frame-disappear-transform-motion {
        from {
            transform: var(--snowui-frame-transform-from, none);
            opacity: var(--snowui-frame-opacity-from, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-from);
        }
        to {
            transform: var(--snowui-frame-transform-to, none);
            opacity: var(--snowui-frame-opacity-to, var(--snowui-frame-opacity-static, 1));
            filter: var(--snowui-frame-blur-to);
        }
    }
</style>
