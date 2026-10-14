<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Frame：统一布局、状态、加载、动效与按需跨组件协调宿主。 -->
<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    export * from "../logic/frame-types";
</script>

<script lang="ts">
    import "../motion/rotate.css";
    import {getContext, setContext, untrack} from "svelte";
    import {MOTION_ORCHESTRATOR_CONTEXT_KEY, SIZE_CONTEXT_KEY, SKELETON_CONTEXT_KEY} from "../keys";
    import type { Motion } from "../logic/motion.svelte";

    import type { FrameProps } from "../logic/frame-types";
    import {Identity} from "../logic/frame-identity.svelte";
    import {FrameState} from "../logic/frame-state.svelte";
    import {FrameLayout} from "../logic/frame-layout.svelte";
    import {FrameResponsive} from "../logic/frame-responsive.svelte";
    import {FrameMotion} from "../logic/frame-motion.svelte";
    import {FramePerception} from "../logic/frame-perception.svelte";
    import {frameScaleObserver} from "../logic/frame-scale-observer.svelte";
    import {resolveScaleObserverOptions} from "../logic/frame-scale-resolver.svelte";
    import {buildFrameActions, mountFrameActions} from "../logic/frame-actions.svelte";
    import {FRAME_MOTION_DEFAULTS} from "../logic/frame-motion-defaults";
    import {createFrameInlineStyleRuntime} from "../logic/frame-inline-style.svelte";
    import {createFrameDomRuntime} from "../logic/frame-dom-runtime.svelte";
    import {createFrameSkeletonRuntime} from "../logic/frame-skeleton-runtime.svelte";
    import {createFrameClassStateRuntime} from "../logic/frame-class-state.svelte";
    import {provideComponentParts} from "../logic/component-parts.svelte";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import {initOrchestrator, getOrchestrator} from "../logic/frame-orchestrator.svelte";
    import Skeleton from "./Skeleton.svelte";

    interface Props extends FrameProps {
        [key: string]: any;
    }

    let { element = $bindable(), ...rawProps }: Props = $props();

    // === 0. Props ===
    const frameProps = $derived(rawProps);
    provideComponentParts(() => frameProps.componentParts);

    // === 0.1 能力开关推导 ===
    // 默认全部开启，组件或用户可显式关闭
    const enableResponsive = $derived(frameProps.enableResponsive ?? true);
    const enableContext = $derived(frameProps.enableContext ?? true);
    const enableScaleObserver = $derived(
        frameProps.enableScaleObserver ?? false,
    );

    // === Orchestration Setup ===
    // If 'styles' is provided, we act as a root orchestrator provider
    function resolveInitialOrchestrator() {
        if (rawProps.styles) {
            return initOrchestrator();
        }
        return getOrchestrator();
    }

    const orchestrator = resolveInitialOrchestrator();

    // Sync rules if this is the root
    $effect(() => {
        if (rawProps.styles && orchestrator) {
            orchestrator.setRules(rawProps.styles);
        }
    });

    // === 1. 身份 (Identity) ===
    // svelte-ignore state_referenced_locally
    const identity = new Identity(frameProps);

    // === 2. 响应式 (Responsive) ===
    // 根据开关决定是否启用
    const needsResponsive = $derived(
        enableResponsive,
    );
    // svelte-ignore state_referenced_locally
    const responsive = needsResponsive ? new FrameResponsive(() => frameProps) : null;

    // === 3. 布局 (Layout) ===
    // svelte-ignore state_referenced_locally
    const layout = new FrameLayout(frameProps, responsive);

    // === 4. 状态 (State) ===
    // 获取 motion 实例用于联动控制
    const motionInstance = getContext<Motion | undefined>(
        MOTION_ORCHESTRATOR_CONTEXT_KEY,
    );
    const parentSkeletonContext = getContext<
        { loading: boolean; skeleton?: boolean } | undefined
    >(SKELETON_CONTEXT_KEY);
    // svelte-ignore state_referenced_locally
    const frameState = new FrameState(frameProps, motionInstance);

    // === 5. 动效 (Motion) ===
    // 动效能力始终可用（内置组件也需要）
    // svelte-ignore state_referenced_locally
    const motion = new FrameMotion(
        frameProps,
        motionInstance,
        frameState,
        responsive,
        () => identity.id,
        () => element,
    );

    // === 6. 感知 (Perception) ===
    // 根据开关决定是否提供 Context
    // svelte-ignore state_referenced_locally
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

    // svelte-ignore state_referenced_locally
    if (enableContext) {
        // svelte-ignore state_referenced_locally
        new FramePerception(
            frameProps,
            frameState,
            layout,
            responsive,
            () => effectiveLoading,
            () => effectiveSkeleton,
        );
        // 提供尺寸上下文给子组件（如资源组件选择正确分辨率）
        // svelte-ignore state_referenced_locally
        if (frameProps.size !== undefined) {
            setContext(SIZE_CONTEXT_KEY, {
                get size() {
                    return frameProps.size as number;
                },
            });
        }
    }

    // === Orchestration Registration & Monitoring ===
    // Register self if ID is present
    $effect(() => {
        const id = identity.id;
        if (id && orchestrator) {
            const registration = {
                id,
                padding: frameProps.padding,
                gap: frameProps.gap,
                radius: frameProps.radius,
                fontSize: frameProps.fontSize,
                size: frameProps.size,
                minWidth: frameProps.minWidth,
                minHeight: frameProps.minHeight,
                width: frameProps.width,
                height: frameProps.height,
                opacity: frameProps.opacity,
            } as Record<string, unknown>;
            registration["border"] = frameProps.border;
            registration.innerBorder = frameProps.innerBorder;
            untrack(() => orchestrator.register(id, registration));
        }
    });

    const scaleObserverOptions = $derived({
        ...resolveScaleObserverOptions(frameProps),
        onResize: (width: number, height: number, size: number) => {
            const id = identity.id;
            if (id && orchestrator) {
                orchestrator.updateState(id, { width, height, size });
            }
        },
    });
    const hasScaleApplyConfig = $derived(
        frameProps.sizeRatio !== undefined ||
            frameProps.iconSizeRatio !== undefined ||
            frameProps.avatarSizeRatio !== undefined,
    );

    // === 辅助逻辑 ===
    // 多指令支持
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
    const probedSkeletonChildren = $derived(
        skeletonRuntime.probedSkeletonChildren,
    );

    const inlineStyleRuntime = createFrameInlineStyleRuntime({
        getFrameProps: () => frameProps,
        frameState,
        motion,
        getIdentityId: () => identity.id,
        getEffectiveLoading: () => effectiveLoading,
        getShouldRenderSkeleton: () => shouldRenderSkeleton,
        getResolvedStateStyle: () => resolvedStateStyle,
        getOrchestratedStyle: () =>
            identity.id && orchestrator ? orchestrator.getStyle(identity.id) : "",
    });
    const childrenRenderContext = $derived(
        classStateRuntime.childrenRenderContext,
    );

    const computedStyle = $derived(inlineStyleRuntime.computedStyle);
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
        <!-- stateContent: 使用 Grid Stacking 确保切换时尺寸不跳动且互相堆叠 -->
        <div
            style="display: grid; align-items: inherit; justify-content: inherit; gap: inherit; width: 100%; height: 100%;"
        >
            {#each Object.entries(frameProps.stateContent) as [contentState, snippet]}
                <div
                    class="snowui-frame-state-content-layer"
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
                        <ComponentPartsBoundary>{@render snippet()}</ComponentPartsBoundary>
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
