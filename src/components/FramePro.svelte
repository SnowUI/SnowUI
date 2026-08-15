<!--
  FramePro 组件：OSS Frame 的超集（v1.0.0 切割线变更后）
  v4.0.0
  职责：在 OSS Frame 全部能力之上叠加跨组件协调（§7.7 编排模式 / §8 联动控制 / §10 样式编排）
  与 OSS Frame 的差异（v1.0.0）：
    - PRO 自有 FrameState（含 linkageControl 调用 Motion.Play(target)，§8 联动控制）
    - PRO 自有 FrameMotion（向 Motion 编排器注册 + orchestrate 触发，§7.7 编排模式）
    - 提供 frame-orchestrator（§10 样式编排：styles 跨组件 ID 寻址 + 表达式求值）
    - 接入 Motion 编排器上下文（MOTION_ORCHESTRATOR_CONTEXT_KEY）
  共享于 OSS 的能力（A 类，从 @snowui-design-system/components 导入）：
    - frame-perception / frame-scale-observer / frame-scale-resolver
    - frame-actions / frame-inline-style / frame-class-state
    - motion-engine（仅 PRO 内部 motion.svelte 与 motion-orchestration 使用）
  关键字定义：./FramePro.md（PRO 专属能力）；OSS 能力详见 @snowui-design-system/components/components/Frame.md
  全量 API 速查：仓库根 /Frame.md
  架构变更详见：/Frame-Refactor-Plan.md

  Log:
  - [2026-05-06] **v4.0.0 重大重构**: OSS / PRO 切割线按"作用半径"重画。原 FramePro 包揽的状态机 / 动效执行 / FLIP / Scale Observer / Perception / FrameActions 等"自包含能力"全部迁入 OSS。FramePro 保留：PRO 专属的 FrameState（linkageControl）+ FrameMotion（orchestrator 集成）+ frame-orchestrator + Motion 上下文。详见 /Frame-Refactor-Plan.md。
  - [2026-05-02] Feature: Frame controller 新增 captureLayout / playLayoutTo，提供通用共享元素 FLIP 布局转场。
  - [2026-03-09] Refactor: 抽离 frame-class-state.svelte.ts，统一承接 stateVars/stateClass/stateStyle、childrenRenderContext 与 computedClass 组装。
  - [2026-03-09] Refactor: 抽离 frame-skeleton-runtime.svelte.ts，统一承接 Skeleton probe、首层子骨架探测与默认加载协议的渲染前判定。
  - [2026-03-09] Refactor: 抽离 frame-dom-runtime.svelte.ts，统一承接 DOM props 过滤后补齐、readonly capture、原生事件包装与 data-* 运行时属性组装。
  - [2026-03-09] Refactor: 抽离 frame-inline-style.svelte.ts，统一承接 computedStyle、while* 内联样式、时序桥接与 Orchestration 暴露变量拼装。
  - [2026-03-07] Refactor: 释放 whileLoad 关键字，新增 loading / skeleton 协议分层；whileLoad 回归纯加载动效配置。
  - [2026-03-07] Chore: 新增稳定根类名 `.snowui-frame`，供 Skeleton 覆盖协议与 standards 检查统一识别。
  - [2026-03-07] Feature: loading + skeleton 默认进入骨架加载协议；支持父级 loading 继承，组件无需逐个声明骨架结构。
  - [2026-03-06] Feature: loopMotion 新增 preset 入口，Frame 可声明式开启完整连续循环默认动效（当前提供 rotateClockwise）。
  - [2026-03-06] Refactor: 通用动效桥接层抽离到 src/motion/bridge.ts，Frame 仅保留桥接消费与状态拼装。
  - [2026-03-06] Feature: 新增 loopMotion 循环动画桥接，供 Spinner 等持续循环组件统一消费 Frame 侧时序变量。
  - [2026-03-06] Feature: 新增 control / border / appear 通用动效时序桥接变量，供控制类组件复用 Frame 默认动效时间曲线。
  - [2026-03-03] Fix: 补齐 transform 数组动效关键帧，确保 morph/rotate 等 from->to 过程可见。
  - [2026-01-26] Refactor: Filtered internal frameProps (enable*, lines, etc.) to prevent DOM leakage. optimized computedStyle to avoid empty CSS variables. Ref: logs/2026-01-26.md
  - [2026-02-03] Fix: while* 动效配置类型收敛与 state_referenced_locally 警告处理。
  - [2026-02-04] Fix: while* 动效 CSS 变量名回退为编排器可识别的标准格式。
  - [2026-02-07] Feature: 新增 Scale Observer 能力开关（enableScaleObserver / scaleHeightVar / scaleObserverTarget）。
  - [2026-02-07] Feature: Scale 支持 width/mixed/aspect 计算依据与运行时宽度监听。
  - [2026-02-07] Feature: Scale 升级统一尺寸链路（scaleSizeVar / sizeRatio / iconSizeRatio / avatarSizeRatio）与 class>props>default 覆盖规则。
  - [2026-02-22] Docs: Surface hover 覆写能力收敛为单变量入口（--snowui-frame-hover-image-override），示例改为一行声明式覆盖。
  - [2026-02-23] Fix: enableResponsive=false 时禁用断点布局覆写，恢复基础方向语义（row/column/grid）。
  - [2026-02-23] Refactor: 截断能力迁移至 Text 组件，Frame 不再初始化 FrameTruncation，也不再消费 enableTruncation/lines。
  - [2026-02-26] Feature: 新增通用状态变量机制（stateVars/stateClass/stateStyle），支持任意变量按状态解析并透传给 children。
-->

<script module lang="ts">
    export * from "@snowui-design-system/components/logic/frame-types";
</script>

<script lang="ts">
    import "@snowui-design-system/components/motion/rotate.css";
    import { getContext, setContext } from "svelte";
    import {
        MOTION_ORCHESTRATOR_CONTEXT_KEY,
        SIZE_CONTEXT_KEY,
        SKELETON_CONTEXT_KEY,
    } from "@snowui-design-system/components/keys";
    import type { Motion } from "../logic/motion.svelte";

    import type { FrameProps } from "@snowui-design-system/components/logic/frame-types";
    import { Identity } from "@snowui-design-system/components/logic/frame-identity.svelte";
    import { FrameState } from "../logic/frame-state.svelte";
    import { FrameLayout } from "@snowui-design-system/components/logic/frame-layout.svelte";
    import { FrameResponsive } from "@snowui-design-system/components/logic/frame-responsive.svelte";
    import { FrameMotion } from "../logic/frame-motion.svelte";
    // 以下 5 个模块已迁入 OSS（v1.0.0 切割线变更，2026-05-06）
    import { FramePerception } from "@snowui-design-system/components/logic/frame-perception.svelte";
    import { frameScaleObserver } from "@snowui-design-system/components/logic/frame-scale-observer.svelte";
    import {
        resolveScaleObserverOptions,
    } from "@snowui-design-system/components/logic/frame-scale-resolver.svelte";
    import {
        buildFrameActions,
        mountFrameActions,
    } from "@snowui-design-system/components/logic/frame-actions.svelte";
    import { FRAME_MOTION_DEFAULTS } from "@snowui-design-system/components/logic/frame-motion-defaults";
    import { createFrameInlineStyleRuntime } from "@snowui-design-system/components/logic/frame-inline-style.svelte";
    import { createFrameDomRuntime } from "@snowui-design-system/components/logic/frame-dom-runtime.svelte";
    import { createFrameSkeletonRuntime } from "@snowui-design-system/components/logic/frame-skeleton-runtime.svelte";
    import { createFrameClassStateRuntime } from "@snowui-design-system/components/logic/frame-class-state.svelte";
    import { provideComponentParts } from "@snowui-design-system/components/logic/component-parts.svelte";
    import {
        initOrchestrator,
        getOrchestrator,
    } from "../logic/frame-orchestrator.svelte";
    import { Skeleton } from "@snowui-design-system/components";

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
        enableResponsive &&
            (frameProps.responsive !== undefined ||
                frameProps.orchestrateOrder?.startsWith("visual-")),
    );
    // svelte-ignore state_referenced_locally
    const responsive = needsResponsive ? new FrameResponsive() : null;

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
            orchestrator.register(id, registration);
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
        // 兼容当前已安装的 OSS 类型；v1.1 runtime 不再读取 class key。
        getSkeletonComponentKey: () => undefined,
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
