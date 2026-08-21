<!--
 Tooltip 文字提示组件 v1.19.5

 继承 Frame.svelte 的通用能力 (交互、动效、响应式)。
 变更 (2026-08-21): 快速重定向不再切换速率；宽度弹簧统一为 1000ms，并继承上一段的实时速度。
 变更 (2026-08-21): 宽度越界进一步收敛到约 3%，稳定 / 重定向弹性放慢至 1000ms / 640ms。
 变更 (2026-08-21): 宽度越界收敛到约 5%，稳定 / 重定向弹性放慢至 900ms / 560ms。
 变更 (2026-08-21): 宽度弹性越界提高到约 7%，并明确保持变宽上冲、变窄下冲的双向物理方向。
 变更 (2026-08-21): 宽度回弹拆为 800ms 独立时间线，重定向为 480ms；位置和内容先行收敛，宽度按 placement 保持触发器侧锚点。
 变更 (2026-08-21): 连续切换的宽度使用独立欠阻尼曲线，快速接近目标后轻微回弹；位置、高度和内容时间线保持不变。
 变更 (2026-08-21): 连续裁切内容带的新旧内容投影间距由 4px 增加为 16px；是否允许拼接的目标 Tooltip 距离门槛仍为 4px。
 变更 (2026-08-21): 出现动效以 110ms 从 94% 放大到 100%，并按最终 placement 从触发器方向反向滑入 2px。
 变更 (2026-08-21): 连续裁切揭示调整为最初版本约 0.75 倍速度，稳定段 180–360ms、重定向段 90–160ms，外框、尺寸与内容保持原协调关系。
 变更 (2026-08-21): 全局定位、媒体查询、Overlay 响应与动效关闭监听收敛到唯一共享 Portal host，定位刷新合并为每帧最多一次。
 变更 (2026-08-21): 组合在 Link / Button 内部包装层时优先使用最近交互祖先作为触发器，避免折叠导航隐藏 label 后 Tooltip 失去 hover 命中区。
 变更 (2026-08-21): 稳定切换收敛为 140–280ms，进行中改目标使用 70–120ms cubic ease-out，避免侧边栏短距离切换仍被最慢时长钳制。
 变更 (2026-08-21): 删除按含 padding 图层计算的二次 mask；真实内容矩形保持 4px 投影间距，圆角外框成为唯一裁切窗口。
 变更 (2026-08-21): 连续裁切改为有界协调时间线；外框平滑加减速，内容以轻微相位滞后同步收敛，打断时直接从当前画面重定向。
 变更 (2026-08-20): 连续 Tooltip 成为 OSS 默认能力；共享圆角外框支持任意二维方向移动，并以裁切窗口揭示新旧内容。
 变更 (2026-08-20): Button hover 伪元素 transition 不再被误判为触发器锚点运动。
 变更 (2026-08-12): 相邻 Tooltip 的外框保留时间对齐 300ms skip-delay 窗口，避免穿过按钮 gap 时先消失再出现。
 变更 (2026-08-12): 毛玻璃 Backdrop 与 opacity/scale Foreground 分层，恢复 Tooltip 渐显且不再削弱首帧背景模糊。
 变更 (2026-08-12): 毛玻璃 Portal 显示前保留一个不可见预绘制帧，且出现时不再执行 transform，避免实际滤镜像素晚于 Tooltip。
 变更 (2026-08-12): 出现 preset 不再对毛玻璃 Portal 做 opacity 渐显，使背景模糊与 Tooltip 在同一可见首帧生效。
 变更 (2026-08-12): 后代 Logo / Icon 的装饰性 animation 不再误触发动效关闭；触发器、祖先及后代几何 transition 规则保持。
 变更 (2026-08-12): Styles 根节点隔离规则不再误命中 Portal，恢复默认 light 毛玻璃对应用内容的真实背景采样。
 变更 (2026-07-28): 默认感知触发元素及祖先的几何动效，并在首帧位移前立即关闭。
 变更 (2026-07-28): Tooltip 默认外观变体由 dark 改为 light。
 变更 (2026-06-06): Tooltip 首次定位使用测量后的目标宽高计算坐标，避免第一次出现时与触发按钮间距偏小。
 变更 (2026-06-06): Tooltip 尺寸 shell 改用静态 transform 负责锚点居中，避免多次切换时 translate 过渡残留导致位置偏移。
 变更 (2026-06-06): Tooltip Portal 层移除 Frame Active 全属性 transition，避免 snap 定位仍被 top/left 过渡影响。
 变更 (2026-06-06): Tooltip 近距离移动曾新增同排/同轴限制；该限制已在 v1.8.0 被二维裁切窗口替代。
 变更 (2026-06-18): Tooltip 出现/消失动效改为引用 TOOLTIP_APPEAR_MOTION / TOOLTIP_DISAPPEAR_MOTION。
 变更 (2026-06-18): Tooltip / Popover 共享首次 hover 延迟由 overlay trigger timing token 管理。
 变更 (2026-06-06): Tooltip 出现动效时长从 150ms 调整为 100ms。
 变更 (2026-06-06): Tooltip 出现/消失动效参考 HeroUI：出现为 150ms 淡入 + 90% 缩放 + placement 反向轻微滑入，消失为 100ms 淡出 + 缩到 95%。
 变更 (2026-06-06): Tooltip 出现/消失改为 150ms Frame fade-only 生命周期动效，首帧定位完成后再渐显，避免从页面左上角或旧位置移入。
 变更 (2026-06-06): Tooltip 出现和消失接入 Frame 默认 whileAppear / whileDisappear 渐现渐隐动效，退出动画完成后再卸载外框。
 变更 (2026-06-06): Tooltip 外框隐藏后再次出现会重置运动基线，首帧直接定位到当前触发器，不继承上一轮位移或宽度动效。
 变更 (2026-06-06): Tooltip 改为锚点居中定位，宽度变化、对齐偏移与移动使用同一 150ms Frame motion timing。
 变更 (2026-06-06): Tooltip 外框宽高变化动效加快一倍，尺寸 shell 使用 150ms Frame size motion。
 变更 (2026-06-06): Tooltip 尺寸动画曾改为仅做外框形态变化；该规则已在 v1.8.0 被连续裁切揭示替代。
 变更 (2026-06-06): Tooltip 外框宽高变化改为明确尺寸 shell，并消费 Frame size motion bridge。
 变更 (2026-06-06): 共享 Portal 切换触发器时增加近距平滑移动 / 远距直接定位规则。
 变更 (2026-06-06): 非受控 hover 模式改为页面级共享 Portal，连续切换触发器时复用同一个 Tooltip 外框，仅更新内容与定位。
 变更 (2026-06-02): hover 时序改为共享 warmup/cooldown：首次延迟 600ms，成功显示后 300ms 内切换其他 Tooltip 立即显示。
 变更 (2026-05-15): 移除 Tooltip 自定义 Idle/Active 缩放淡入动效，统一改用 Frame 默认 whileAppear，与 Popover 一致马上显示。
 变更 (2026-03-07): 释放 whileLoad 关键字；Tooltip 改用 loading 作为禁用触发入口，并将 whileLoad 透传回 Frame 作为加载态动效配置。
 变更 (2026-02-26): 移除 content prop，统一使用 Tooltip 子内容作为提示文案。
 变更 (2026-02-26): hover 进入延迟 0.5s 后出现；移出立即消失（无淡出）。
 变更 (2026-02-26): Tooltip 视觉升级为 Figma 对齐样式，支持 `variant="dark|light"`（默认 dark）。
 变更 (2026-02-26): 移除 Tooltip 投影效果（box-shadow）。
 变更 (2026-02-26): Tooltip 外观开关从 `theme` 调整为 `variant`。
 变更 (2026-02-26): 移除 `theme` 兼容逻辑，仅保留 `variant`。
 变更 (2026-03-03): Tooltip 自身进入动效改为默认动效链路（Idle -> Active 自动触发）。
 变更 (2026-03-06): Portal 外层改为 Frame 承接 `loopMotion`，使可见浮层能响应连续旋转默认能力。
 详见：Tooltip.md
-->

<script module lang="ts">
    const TOOLTIP_MOVE_MAX_DISTANCE_PX = 240;
    const TOOLTIP_MOVE_MAX_VIEWPORT_RATIO = 0.25;
    const TOOLTIP_CONTENT_TRACK_GAP_PX = 16;
    const TOOLTIP_CONTENT_TRACK_MAX_TARGET_GAP_PX = 4;
    let nextTooltipId = 0;
    let overlayHost: { id: string; setHost: (value: boolean) => void } | undefined;
    const overlayHostCandidates = new Set<{
        id: string;
        setHost: (value: boolean) => void;
    }>();

    function createTooltipId() {
        nextTooltipId += 1;
        return `snowui-tooltip-${nextTooltipId}`;
    }

    function registerOverlayHostCandidate(
        id: string,
        setHost: (value: boolean) => void,
    ) {
        const candidate = { id, setHost };
        overlayHostCandidates.add(candidate);

        if (!overlayHost) {
            overlayHost = candidate;
            setHost(true);
        }

        return () => {
            overlayHostCandidates.delete(candidate);
            if (overlayHost !== candidate) return;

            candidate.setHost(false);
            overlayHost = overlayHostCandidates.values().next().value;
            overlayHost?.setHost(true);
        };
    }
</script>

<script lang="ts">
    import { type Snippet } from "svelte";
    import { tick, onMount, onDestroy, untrack } from "svelte";
    import { getText, getSkeleton, getSize } from "../context";
    import { resizeManager } from "../logic/observer.svelte";
    import type { CoreState } from "../logic/frame-types";
    import { MORPH_MOTION } from "../motion/morph";
    import {
        TOOLTIP_APPEAR_TOTAL_MS,
        TOOLTIP_CONTINUOUS_BASE_DURATION_MS,
        TOOLTIP_CONTINUOUS_CONTENT_LAG,
        TOOLTIP_CONTINUOUS_DURATION_PER_PX_MS,
        TOOLTIP_CONTINUOUS_MAX_DURATION_MS,
        TOOLTIP_CONTINUOUS_MIN_DURATION_MS,
        TOOLTIP_CONTINUOUS_RETARGET_BASE_DURATION_MS,
        TOOLTIP_CONTINUOUS_RETARGET_CONTENT_LAG,
        TOOLTIP_CONTINUOUS_RETARGET_DURATION_PER_PX_MS,
        TOOLTIP_CONTINUOUS_RETARGET_MAX_DURATION_MS,
        TOOLTIP_CONTINUOUS_RETARGET_MIN_DURATION_MS,
        TOOLTIP_CONTINUOUS_WIDTH_SPRING_DURATION_MS,
        TOOLTIP_DISAPPEAR_MOTION,
        TOOLTIP_DISAPPEAR_TOTAL_MS,
        getTooltipAppearMotion,
        getTooltipWidthSpringState,
    } from "../motion/presets/tooltip";
    import {
        getTooltipHoverShowDelay,
        markTooltipShown,
        scheduleTooltipWarmupReset,
    } from "../lib/tooltip-delay";
    import {
        constrainFloatingAnchor,
        getFloatingVisualBounds,
        getOppositeFloatingSide,
        hasFloatingCollision,
        type FloatingSide,
    } from "../lib/floating-position";
    import { getTooltipBehaviorEnhancement } from "../lib/tooltip-behavior";
    import {
        dismissTooltipOverlayImmediately,
        hideTooltipOverlay,
        scheduleTooltipOverlayHide,
        showTooltipOverlay,
        tooltipOverlay,
        tooltipOverlayImmediateDismissRevision,
        type TooltipOverlayState,
    } from "../lib/tooltip-overlay";
    import { registerTooltipMotionDismiss } from "../lib/tooltip-motion-dismiss";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Skeleton from "./Skeleton.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    const TOOLTIP_SYNC_MOTION = {
        duration:
            typeof MORPH_MOTION.duration === "number"
                ? MORPH_MOTION.duration / 2
                : 150,
        easing: MORPH_MOTION.easing,
    };
    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    }

    interface Props extends FrameProps {
        position?: "top" | "bottom" | "left" | "right";
        open?: boolean;
        offset?: number;
        variant?: "dark" | "light";
        dismissOnMotion?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    interface TooltipVisualRect {
        left: number;
        top: number;
        width: number;
        height: number;
    }

    const inheritedTooltipPart = useComponentPart<Props>("Tooltip");
    let {
        open = $bindable(undefined),
        ...explicitProps
    }: Props = $props();
    let {
        position = "top",
        offset = 4,
        variant = "light",
        dismissOnMotion = true,
        class: className = "",
        style: userStyle = "",
        as = undefined,
        loopMotion = undefined,
        loading = undefined,
        renderHints = undefined,
        children: tooltipChildren,
        ...rest
    }: Omit<Props, "open"> = $derived(
        mergeComponentPartProps(
            inheritedTooltipPart.current as Partial<Omit<Props, "open">>,
            explicitProps,
        ),
    );

    // 上下文感知
    const textCtx = getText();
    const skeletonCtx = getSkeleton();
    const contextSize = getSize();
    void contextSize;

    // 状态推导
    let finalDisabled = $derived(skeletonCtx?.loading || loading);
    let effectiveSkeleton = $derived.by(() => {
        const explicitSkeleton = (rest as Record<string, any>).skeleton;
        return explicitSkeleton ?? skeletonCtx?.skeleton ?? false;
    });
    let finalVariant = $derived(variant ?? "light");

    // 自动内容逻辑
    let fallbackContent = $state("");

    // 截断逻辑
    const MAX_LENGTH = 300;
    let displayContent = $derived.by(() => {
        const raw = fallbackContent;
        if (typeof raw === "string" && raw.length > MAX_LENGTH) {
            return raw.slice(0, MAX_LENGTH) + "...";
        }
        return raw;
    });

    // Portal 逻辑
    let tooltipRef = $state<HTMLElement>();
    let sizeShellRef = $state<HTMLElement>();
    let incomingLayerRef = $state<HTMLElement>();
    let sizeContentRef = $state<HTMLElement>();
    let placeholderRef = $state<HTMLElement>();
    let triggerEl: HTMLElement | null = null;
    let tooltipId = createTooltipId();
    let isOverlayHost = $state(false);
    let controlledVisible = $derived(open !== undefined ? open : false);
    let currentOverlay = $derived($tooltipOverlay);
    let immediateDismissRevision = $derived(
        $tooltipOverlayImmediateDismissRevision,
    );
    let handledImmediateDismissRevision = 0;
    let renderedOverlay = $state<TooltipOverlayState | null>(null);
    let outgoingOverlay = $state<TooltipOverlayState | null>(null);
    let overlayVisible = $derived(isOverlayHost && renderedOverlay !== null);
    let portalLifecycleState = $state<CoreState>("Idle");
    let coords = $state({ top: 0, left: 0 });
    let finalPosition: "top" | "bottom" | "left" | "right" = $state("top");
    let moveMode: "snap" | "frame" = $state("snap");
    let switchPhase: "idle" | "prepare" | "moving" = $state("idle");
    let switchRetargeting = $state(false);
    let pendingSwitchRetarget = false;
    let measuredSize = $state({ width: 0, height: 0 });
    let pendingMeasuredSize = { width: 0, height: 0 };
    let measuredOverlayId: string | undefined;
    let activeTargetRect: TooltipVisualRect | undefined;
    let outgoingTargetRect: TooltipVisualRect | undefined;
    let outgoingAlignedRect: TooltipVisualRect | undefined;
    let outgoingContentRect: TooltipVisualRect | undefined;
    let switchStartRect: TooltipVisualRect | undefined;
    let shellMotionOffset = $state({ x: 0, y: 0 });
    let incomingLayerOffset = $state({ x: 0, y: 0 });
    let incomingLayerReady = $state(false);
    let outgoingLayerOffset = $state({ x: 0, y: 0 });
    let outgoingLayerSize = $state({ width: 0, height: 0 });
    let hasMeasuredPosition = false;
    let lastPositionTooltipId: string | undefined;
    let overlayWasVisible = false;
    let portalReady = $state(false);
    let portalReadyFrame: number | undefined;
    let portalMotionReady = $state(false);
    let sizeMotionEnabled = $state(false);
    let hoverShowTimer: number | undefined;
    let overlayAppearTimer: number | undefined;
    let overlayDisappearTimer: number | undefined;
    let sizeMotionTimer: number | undefined;
    let positionUpdateFrame: number | undefined;
    let switchMotionFrame: number | undefined;
    let animatedShellSize = $state<{ width: number; height: number }>();
    let switchWidthVelocityPxPerSecond = 0;
    let switchShellDurationMs = $state(0);
    let switchWidthDurationMs = $state(0);
    let switchContentDurationMs = $state(0);
    let switchShellDistancePx = $state(0);
    let switchContentDistancePx = $state(0);
    let switchContentSpeedProfile = $state("coordinated-ease(0.08)");
    let switchMotionRevision = 0;
    let prefersReducedMotion = $state(false);
    let reducedMotionMedia: MediaQueryList | undefined;
    let unregisterOverlayHost: (() => void) | undefined;
    const tooltipBehavior = getTooltipBehaviorEnhancement();

    const forwardedRest = $derived.by(() => {
        const {
            class: _class,
            style: _style,
            ...others
        } = rest as Record<string, any>;
        return others;
    });

    const tooltipFrameStyle = $derived(
        [userStyle].filter(Boolean).join("; ") || undefined,
    );
    const sizeShellStyle = $derived.by(() => {
        const shellSize = animatedShellSize ?? measuredSize;
        if (!shellSize.width || !shellSize.height) return undefined;

        return [
            `--snowui-tooltip-measured-width: ${shellSize.width}px`,
            `--snowui-tooltip-measured-height: ${shellSize.height}px`,
        ].join("; ");
    });
    const motionShellStyle = $derived(
        `--snowui-tooltip-motion-x: ${shellMotionOffset.x}px; --snowui-tooltip-motion-y: ${shellMotionOffset.y}px;`,
    );
    const incomingLayerStyle = $derived(
        `--snowui-tooltip-layer-width: ${measuredSize.width}px; --snowui-tooltip-layer-height: ${measuredSize.height}px; --snowui-tooltip-layer-x: ${incomingLayerOffset.x}px; --snowui-tooltip-layer-y: ${incomingLayerOffset.y}px;`,
    );
    const outgoingLayerStyle = $derived(
        `--snowui-tooltip-layer-width: ${outgoingLayerSize.width}px; --snowui-tooltip-layer-height: ${outgoingLayerSize.height}px; --snowui-tooltip-layer-x: ${outgoingLayerOffset.x}px; --snowui-tooltip-layer-y: ${outgoingLayerOffset.y}px;`,
    );
    const effectivePortalLifecycleState = $derived<CoreState>(
        tooltipBehavior.lifecycleMotion && portalMotionReady
            ? portalLifecycleState
            : "Idle",
    );
    const effectivePortalAppearMotion = $derived(
        tooltipBehavior.lifecycleMotion && !prefersReducedMotion
            ? getTooltipAppearMotion(finalPosition)
            : false,
    );
    const effectivePortalDisappearMotion = $derived(
        tooltipBehavior.lifecycleMotion && !prefersReducedMotion
            ? TOOLTIP_DISAPPEAR_MOTION
            : false,
    );
    const effectiveSizeMotion = $derived(
        tooltipBehavior.sizeMotion ? TOOLTIP_SYNC_MOTION : false,
    );
    const tooltipTransformOrigin = $derived.by(() => {
        if (finalPosition === "top") return "50% 100%";
        if (finalPosition === "bottom") return "50% 0%";
        if (finalPosition === "left") return "100% 50%";
        return "0% 50%";
    });

    function resetMotionBaseline() {
        if (portalReadyFrame !== undefined) {
            window.cancelAnimationFrame(portalReadyFrame);
            portalReadyFrame = undefined;
        }
        portalReady = false;
        portalMotionReady = false;
        sizeMotionEnabled = false;
        hasMeasuredPosition = false;
        lastPositionTooltipId = undefined;
        moveMode = "snap";
        switchPhase = "idle";
        switchRetargeting = false;
        pendingSwitchRetarget = false;
        animatedShellSize = undefined;
        switchWidthVelocityPxPerSecond = 0;
        switchShellDurationMs = 0;
        switchWidthDurationMs = 0;
        switchContentDurationMs = 0;
        switchShellDistancePx = 0;
        switchContentDistancePx = 0;
        switchContentSpeedProfile = "coordinated-ease(0.08)";
        measuredSize = { width: 0, height: 0 };
        pendingMeasuredSize = { width: 0, height: 0 };
        measuredOverlayId = undefined;
        activeTargetRect = undefined;
        outgoingTargetRect = undefined;
        outgoingAlignedRect = undefined;
        outgoingContentRect = undefined;
        switchStartRect = undefined;
        shellMotionOffset = { x: 0, y: 0 };
        incomingLayerOffset = { x: 0, y: 0 };
        incomingLayerReady = false;
        outgoingLayerOffset = { x: 0, y: 0 };
        outgoingLayerSize = { width: 0, height: 0 };
        outgoingOverlay = null;
        cancelSwitchMotion();
    }

    function cancelSwitchMotion() {
        switchMotionRevision += 1;
        if (switchMotionFrame !== undefined) {
            window.cancelAnimationFrame(switchMotionFrame);
            switchMotionFrame = undefined;
        }
    }

    function readVisualRect(element: HTMLElement | undefined): TooltipVisualRect | undefined {
        if (!element) return undefined;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return undefined;
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
        };
    }

    function finishSwitchMotion(revision: number) {
        if (revision !== switchMotionRevision) return;
        animatedShellSize = undefined;
        switchWidthVelocityPxPerSecond = 0;
        switchShellDurationMs = 0;
        switchWidthDurationMs = 0;
        switchContentDurationMs = 0;
        switchShellDistancePx = 0;
        switchContentDistancePx = 0;
        switchContentSpeedProfile = "coordinated-ease(0.08)";
        outgoingOverlay = null;
        outgoingTargetRect = undefined;
        outgoingAlignedRect = undefined;
        outgoingContentRect = undefined;
        switchStartRect = undefined;
        shellMotionOffset = { x: 0, y: 0 };
        incomingLayerOffset = { x: 0, y: 0 };
        outgoingLayerOffset = { x: 0, y: 0 };
        moveMode = "snap";
        switchPhase = "idle";
        switchRetargeting = false;
    }

    function getMovementUnit(
        startRect: TooltipVisualRect,
        targetRect: TooltipVisualRect,
    ) {
        let dx =
            targetRect.left + targetRect.width / 2 -
            (startRect.left + startRect.width / 2);
        let dy =
            targetRect.top + targetRect.height / 2 -
            (startRect.top + startRect.height / 2);
        let length = Math.hypot(dx, dy);
        if (length <= 0.5) {
            dx = targetRect.left - startRect.left;
            dy = targetRect.top - startRect.top;
            length = Math.hypot(dx, dy);
        }
        if (length <= 0.5) return { x: 1, y: 0 };

        return { x: dx / length, y: dy / length };
    }

    function getRectCenterDistance(
        startRect: TooltipVisualRect,
        targetRect: TooltipVisualRect,
    ) {
        return Math.hypot(
            targetRect.left + targetRect.width / 2 -
                (startRect.left + startRect.width / 2),
            targetRect.top + targetRect.height / 2 -
                (startRect.top + startRect.height / 2),
        );
    }

    function getMotionProgress(elapsed: number, duration: number) {
        if (duration <= 0) return 1;
        return Math.min(elapsed / duration, 1);
    }

    type TooltipMotionTuning = {
        baseDuration: number;
        minDuration: number;
        maxDuration: number;
        durationPerPixel: number;
        contentLag: number;
    };

    function readPositiveNumber(style: CSSStyleDeclaration, name: string, fallback: number) {
        const value = Number.parseFloat(style.getPropertyValue(name));
        return Number.isFinite(value) && value > 0 ? value : fallback;
    }

    function readUnitNumber(style: CSSStyleDeclaration, name: string, fallback: number) {
        const value = Number.parseFloat(style.getPropertyValue(name));
        return Number.isFinite(value) && value >= 0 && value <= 1
            ? value
            : fallback;
    }

    function readMotionTuning(): TooltipMotionTuning {
        const style = sizeShellRef ? getComputedStyle(sizeShellRef) : undefined;
        if (!style) {
            return {
                baseDuration: TOOLTIP_CONTINUOUS_BASE_DURATION_MS,
                minDuration: TOOLTIP_CONTINUOUS_MIN_DURATION_MS,
                maxDuration: TOOLTIP_CONTINUOUS_MAX_DURATION_MS,
                durationPerPixel: TOOLTIP_CONTINUOUS_DURATION_PER_PX_MS,
                contentLag: TOOLTIP_CONTINUOUS_CONTENT_LAG,
            };
        }

        const minDuration = readPositiveNumber(
            style,
            "--snowui-tooltip-test-min-duration",
            TOOLTIP_CONTINUOUS_MIN_DURATION_MS,
        );
        return {
            baseDuration: readPositiveNumber(
                style,
                "--snowui-tooltip-test-base-duration",
                TOOLTIP_CONTINUOUS_BASE_DURATION_MS,
            ),
            minDuration,
            maxDuration: Math.max(
                minDuration,
                readPositiveNumber(
                    style,
                    "--snowui-tooltip-test-max-duration",
                    TOOLTIP_CONTINUOUS_MAX_DURATION_MS,
                ),
            ),
            durationPerPixel: readPositiveNumber(
                style,
                "--snowui-tooltip-test-duration-per-pixel",
                TOOLTIP_CONTINUOUS_DURATION_PER_PX_MS,
            ),
            contentLag: readUnitNumber(
                style,
                "--snowui-tooltip-test-content-lag",
                TOOLTIP_CONTINUOUS_CONTENT_LAG,
            ),
        };
    }

    function getContinuousDuration(
        distance: number,
        tuning: TooltipMotionTuning,
        retargeting: boolean,
    ) {
        if (retargeting) {
            return Math.min(
                TOOLTIP_CONTINUOUS_RETARGET_MAX_DURATION_MS,
                Math.max(
                    TOOLTIP_CONTINUOUS_RETARGET_MIN_DURATION_MS,
                    TOOLTIP_CONTINUOUS_RETARGET_BASE_DURATION_MS +
                        distance * TOOLTIP_CONTINUOUS_RETARGET_DURATION_PER_PX_MS,
                ),
            );
        }
        return Math.min(
            tuning.maxDuration,
            Math.max(
                tuning.minDuration,
                tuning.baseDuration + distance * tuning.durationPerPixel,
            ),
        );
    }

    function getCoordinatedProgress(progress: number, retargeting: boolean) {
        if (retargeting) return 1 - Math.pow(1 - progress, 3);
        return (1 - Math.cos(Math.PI * progress)) / 2;
    }

    function getContentProgress(shellProgress: number, lag: number) {
        if (shellProgress >= 1) return 1;
        return Math.pow(shellProgress, 1 + lag);
    }

    function interpolate(start: number, end: number, progress: number) {
        return start + (end - start) * progress;
    }

    function getWidthAnchoredLeft(
        startRect: TooltipVisualRect,
        targetRect: TooltipVisualRect,
        width: number,
        progress: number,
        position: FloatingSide,
    ) {
        if (position === "left") {
            return (
                interpolate(
                    startRect.left + startRect.width,
                    targetRect.left + targetRect.width,
                    progress,
                ) - width
            );
        }
        if (position === "right") {
            return interpolate(startRect.left, targetRect.left, progress);
        }
        return (
            interpolate(
                startRect.left + startRect.width / 2,
                targetRect.left + targetRect.width / 2,
                progress,
            ) -
            width / 2
        );
    }

    function concatenateContentRect(
        oldRect: TooltipVisualRect,
        newSize: { width: number; height: number },
        direction: { x: number; y: number },
    ): TooltipVisualRect {
        const oldProjectionRadius =
            (oldRect.width * Math.abs(direction.x) +
                oldRect.height * Math.abs(direction.y)) /
            2;
        const newProjectionRadius =
            (newSize.width * Math.abs(direction.x) +
                newSize.height * Math.abs(direction.y)) /
            2;
        const centerDistance =
            oldProjectionRadius +
            TOOLTIP_CONTENT_TRACK_GAP_PX +
            newProjectionRadius;
        const centerX =
            oldRect.left + oldRect.width / 2 + direction.x * centerDistance;
        const centerY =
            oldRect.top + oldRect.height / 2 + direction.y * centerDistance;

        return {
            left: centerX - newSize.width / 2,
            top: centerY - newSize.height / 2,
            width: newSize.width,
            height: newSize.height,
        };
    }

    function getRectDistance(
        first: TooltipVisualRect,
        second: TooltipVisualRect,
    ) {
        const gapX = Math.max(
            first.left - (second.left + second.width),
            second.left - (first.left + first.width),
            0,
        );
        const gapY = Math.max(
            first.top - (second.top + second.height),
            second.top - (first.top + first.height),
            0,
        );
        return Math.hypot(gapX, gapY);
    }

    function clearOverlayLifecycleTimers() {
        if (overlayAppearTimer !== undefined) {
            window.clearTimeout(overlayAppearTimer);
            overlayAppearTimer = undefined;
        }
        if (overlayDisappearTimer !== undefined) {
            window.clearTimeout(overlayDisappearTimer);
            overlayDisappearTimer = undefined;
        }
        if (sizeMotionTimer !== undefined) {
            window.clearTimeout(sizeMotionTimer);
            sizeMotionTimer = undefined;
        }
        cancelSwitchMotion();
    }

    $effect(() => {
        if (!isOverlayHost) return;

        const overlayState = currentOverlay;
        const dismissRevision = immediateDismissRevision;
        const previousRenderedOverlay = untrack(() => renderedOverlay);

        if (dismissRevision !== handledImmediateDismissRevision) {
            handledImmediateDismissRevision = dismissRevision;
            clearOverlayLifecycleTimers();
            overlayWasVisible = false;
            renderedOverlay = null;
            portalLifecycleState = "Idle";
            resetMotionBaseline();
            return;
        }

        if (!overlayState) {
            if (
                tooltipBehavior.lifecycleMotion &&
                overlayWasVisible &&
                previousRenderedOverlay
            ) {
                overlayWasVisible = false;
                portalLifecycleState = "Disappear";
                portalMotionReady = true;
                sizeMotionEnabled = false;
                if (overlayAppearTimer !== undefined) {
                    window.clearTimeout(overlayAppearTimer);
                    overlayAppearTimer = undefined;
                }
                if (overlayDisappearTimer !== undefined) {
                    window.clearTimeout(overlayDisappearTimer);
                }
                overlayDisappearTimer = window.setTimeout(() => {
                    overlayDisappearTimer = undefined;
                    renderedOverlay = null;
                    portalLifecycleState = "Idle";
                    resetMotionBaseline();
                }, TOOLTIP_DISAPPEAR_TOTAL_MS);
                return;
            }

            overlayWasVisible = false;
            renderedOverlay = null;
            portalLifecycleState = "Idle";
            resetMotionBaseline();
            return;
        }

        if (overlayDisappearTimer !== undefined) {
            window.clearTimeout(overlayDisappearTimer);
            overlayDisappearTimer = undefined;
        }
        if (
            previousRenderedOverlay &&
            previousRenderedOverlay.id !== overlayState.id
        ) {
            const wasSwitching = switchPhase !== "idle";
            cancelSwitchMotion();
            if (overlayState.continuousMotion === false) {
                pendingSwitchRetarget = false;
                switchStartRect = undefined;
                outgoingOverlay = null;
                outgoingAlignedRect = undefined;
                outgoingContentRect = undefined;
                outgoingTargetRect = undefined;
            } else {
                pendingSwitchRetarget = wasSwitching;
                switchStartRect = readVisualRect(sizeShellRef);
                outgoingOverlay = previousRenderedOverlay;
                outgoingAlignedRect = activeTargetRect ?? switchStartRect;
                outgoingContentRect = readVisualRect(sizeContentRef);
                outgoingTargetRect =
                    readVisualRect(incomingLayerRef) ??
                    outgoingAlignedRect ??
                    switchStartRect;
                if (outgoingTargetRect) {
                    outgoingLayerSize = {
                        width: outgoingTargetRect.width,
                        height: outgoingTargetRect.height,
                    };
                }
            }
            measuredOverlayId = undefined;
            incomingLayerReady = false;
        }
        renderedOverlay = overlayState;

        if (!overlayWasVisible) {
            resetMotionBaseline();
            portalLifecycleState = "Appear";
            if (overlayAppearTimer !== undefined) {
                window.clearTimeout(overlayAppearTimer);
                overlayAppearTimer = undefined;
            }
        }
        overlayWasVisible = true;
    });

    $effect(() => {
        if (!isOverlayHost) return;
        const overlayState = currentOverlay;
        if (!overlayState?.dismissOnMotion) return;

        return registerTooltipMotionDismiss({
            id: overlayState.id,
            triggerEl: overlayState.triggerEl,
            onDismiss: () => {
                dismissTooltipOverlayImmediately(overlayState.id);
                scheduleTooltipWarmupReset();
            },
        });
    });

    $effect(() => {
        const tooltipWidth = measuredSize.width;
        const tooltipHeight = measuredSize.height;
        void tooltipWidth;
        void tooltipHeight;

        finalPosition = position;
        if (controlledVisible) {
            tick().then(schedulePositionUpdate);
            return;
        }

        if (!isOverlayHost) return;
        const overlayState = currentOverlay;
        void overlayState?.id;
        void overlayState?.fallbackContent;
        if (overlayVisible && overlayState) tick().then(schedulePositionUpdate);
    });

    $effect(() => {
        const el = sizeContentRef;
        if (!el) return;

        const updateMeasuredSize = (entry?: ResizeObserverEntry) => {
            const borderBox = entry?.borderBoxSize?.[0];
            const shellStyle = sizeShellRef
                ? getComputedStyle(sizeShellRef)
                : undefined;
            const paddingX =
                parseFloat(shellStyle?.paddingLeft ?? "0") +
                parseFloat(shellStyle?.paddingRight ?? "0");
            const paddingY =
                parseFloat(shellStyle?.paddingTop ?? "0") +
                parseFloat(shellStyle?.paddingBottom ?? "0");

            pendingMeasuredSize = {
                width: Math.ceil((borderBox?.inlineSize ?? el.offsetWidth) + paddingX),
                height: Math.ceil(
                    (borderBox?.blockSize ?? el.offsetHeight) + paddingY,
                ),
            };
            measuredOverlayId = renderedOverlay?.id ?? tooltipId;
            tick().then(schedulePositionUpdate);
        };

        updateMeasuredSize();
        const unwatch = resizeManager.watch(el, updateMeasuredSize);

        return () => {
            unwatch();
        };
    });

    function getPositionCoords(
        pos: string,
        triggerRect: DOMRect,
        tooltipSize: { width: number; height: number },
        off: number,
    ) {
        const width = tooltipSize.width;
        const height = tooltipSize.height;
        const centerX = triggerRect.left + triggerRect.width / 2;
        const centerY = triggerRect.top + triggerRect.height / 2;
        let top = 0;
        let left = 0;

        switch (pos) {
            case "top":
                top = triggerRect.top - height - off;
                left = centerX;
                break;
            case "bottom":
                top = triggerRect.bottom + off;
                left = centerX;
                break;
            case "left":
                top = centerY;
                left = triggerRect.left - width - off;
                break;
            case "right":
                top = centerY;
                left = triggerRect.right + off;
                break;
        }
        return { top, left };
    }

    function updatePosition() {
        if (!tooltipRef) return;
        const overlayState =
            isOverlayHost && overlayVisible
                ? (currentOverlay ?? renderedOverlay)
                : null;
        const activeTriggerEl = overlayState?.triggerEl ?? triggerEl;
        if (!activeTriggerEl) return;
        const activeTooltipId = overlayState?.id ?? tooltipId;
        if (
            currentOverlay &&
            renderedOverlay?.id === activeTooltipId &&
            measuredOverlayId !== activeTooltipId
        ) {
            return;
        }

        const activePosition = (overlayState?.position ?? position) as FloatingSide;
        const activeOffset = overlayState?.offset ?? offset;
        const triggerRect = activeTriggerEl.getBoundingClientRect();
        const tooltipRect = tooltipRef.getBoundingClientRect();
        const targetSize =
            measuredOverlayId === activeTooltipId &&
            pendingMeasuredSize.width &&
            pendingMeasuredSize.height
                ? pendingMeasuredSize
                : measuredSize;
        const tooltipWidth = targetSize.width || tooltipRect.width;
        const tooltipHeight = targetSize.height || tooltipRect.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportPadding = 8;

        const viewportBounds = {
            left: 0,
            top: 0,
            width: viewportWidth,
            height: viewportHeight,
        };

        const positions: FloatingSide[] = [
            activePosition,
            getOppositeFloatingSide(activePosition),
            ...(activePosition === "top" || activePosition === "bottom"
                ? (["left", "right"] as const)
                : (["top", "bottom"] as const)),
        ];

        let bestPos = positions[0];
        let bestCoords = { top: 0, left: 0 };

        for (const pos of positions) {
            let { top, left } = getPositionCoords(
                pos,
                triggerRect,
                { width: tooltipWidth, height: tooltipHeight },
                activeOffset,
            );

            ({ top, left } = constrainFloatingAnchor(
                pos,
                { top, left },
                { width: tooltipWidth, height: tooltipHeight },
                viewportBounds,
                viewportPadding,
            ));

            const bounds = getFloatingVisualBounds(
                pos,
                { top, left },
                { width: tooltipWidth, height: tooltipHeight },
            );

            if (!hasFloatingCollision(bounds, viewportBounds)) {
                bestPos = pos;
                bestCoords = { top, left };
                break;
            }

            if (pos === positions[0]) {
                bestCoords = { top, left };
            }
        }

        const targetBounds = getFloatingVisualBounds(
            bestPos,
            bestCoords,
            { width: tooltipWidth, height: tooltipHeight },
        );
        const targetRect: TooltipVisualRect = {
            left: targetBounds.left,
            top: targetBounds.top,
            width: tooltipWidth,
            height: tooltipHeight,
        };
        const startRect = switchStartRect ?? readVisualRect(sizeShellRef);
        const distance = startRect
            ? Math.hypot(
                  targetRect.top - startRect.top,
                  targetRect.left - startRect.left,
              )
            : 0;
        const maxMoveDistance = Math.min(
            TOOLTIP_MOVE_MAX_DISTANCE_PX,
            Math.min(viewportWidth, viewportHeight) * TOOLTIP_MOVE_MAX_VIEWPORT_RATIO,
        );
        const isSwitchingTooltip =
            lastPositionTooltipId !== undefined &&
            lastPositionTooltipId !== activeTooltipId;
        const canSmoothMove =
            tooltipBehavior.smoothMove &&
            overlayState?.continuousMotion !== false &&
            !prefersReducedMotion &&
            distance <= maxMoveDistance &&
            startRect !== undefined &&
            outgoingOverlay !== null &&
            outgoingTargetRect !== undefined;

        if (!hasMeasuredPosition) {
            moveMode = "snap";
        } else if (isSwitchingTooltip) {
            moveMode = canSmoothMove ? "frame" : "snap";
        }
        if (
            measuredSize.width !== tooltipWidth ||
            measuredSize.height !== tooltipHeight
        ) {
            measuredSize = { width: tooltipWidth, height: tooltipHeight };
        }
        finalPosition = bestPos;
        coords = bestCoords;

        if (isSwitchingTooltip && canSmoothMove && startRect && outgoingTargetRect) {
            const oldTarget = outgoingTargetRect;
            const previousAlignedRect = outgoingAlignedRect ?? oldTarget;
            const canJoinContentTrack =
                getRectDistance(previousAlignedRect, targetRect) <=
                TOOLTIP_CONTENT_TRACK_MAX_TARGET_GAP_PX;
            const direction = getMovementUnit(startRect, targetRect);
            const renderedIncomingLayerRect = readVisualRect(incomingLayerRef);
            const renderedIncomingContentRect = readVisualRect(sizeContentRef);
            const incomingContentInset = {
                x:
                    renderedIncomingLayerRect && renderedIncomingContentRect
                        ? renderedIncomingContentRect.left -
                          renderedIncomingLayerRect.left
                        : 0,
                y:
                    renderedIncomingLayerRect && renderedIncomingContentRect
                        ? renderedIncomingContentRect.top -
                          renderedIncomingLayerRect.top
                        : 0,
            };
            const incomingContentTrackRect = canJoinContentTrack
                ? concatenateContentRect(
                      outgoingContentRect ?? oldTarget,
                      renderedIncomingContentRect ?? targetRect,
                      direction,
                  )
                : targetRect;
            const incomingTrackRect = canJoinContentTrack
                ? {
                      left:
                          incomingContentTrackRect.left -
                          incomingContentInset.x,
                      top:
                          incomingContentTrackRect.top -
                          incomingContentInset.y,
                      width: targetRect.width,
                      height: targetRect.height,
                  }
                : targetRect;
            const initialBaseBounds = sizeMotionEnabled
                ? getFloatingVisualBounds(
                      bestPos,
                      bestCoords,
                      { width: startRect.width, height: startRect.height },
                  )
                : targetRect;
            const motionTuning = readMotionTuning();
            const shellDistance = getRectCenterDistance(startRect, targetRect);
            const isRetargeting = pendingSwitchRetarget;
            pendingSwitchRetarget = false;
            const contentLag = isRetargeting
                ? TOOLTIP_CONTINUOUS_RETARGET_CONTENT_LAG
                : motionTuning.contentLag;
            const motionDuration = getContinuousDuration(
                shellDistance,
                motionTuning,
                isRetargeting,
            );
            const alignment = canJoinContentTrack
                ? {
                      x: targetRect.left - incomingTrackRect.left,
                      y: targetRect.top - incomingTrackRect.top,
                  }
                : { x: 0, y: 0 };
            const contentDistance = canJoinContentTrack
                ? Math.hypot(alignment.x, alignment.y)
                : 0;
            const shellDuration = motionDuration;
            const initialWidthVelocityPxPerSecond = isRetargeting
                ? switchWidthVelocityPxPerSecond
                : 0;
            const widthDuration =
                Math.abs(targetRect.width - startRect.width) > 0.5 ||
                Math.abs(initialWidthVelocityPxPerSecond) > 1
                    ? TOOLTIP_CONTINUOUS_WIDTH_SPRING_DURATION_MS
                    : motionDuration;
            const contentDuration = canJoinContentTrack ? motionDuration : 0;
            const totalDuration = Math.max(motionDuration, widthDuration);
            const revision = ++switchMotionRevision;
            moveMode = "snap";
            switchPhase = "prepare";
            switchRetargeting = isRetargeting;
            animatedShellSize = {
                width: startRect.width,
                height: startRect.height,
            };
            switchShellDurationMs = shellDuration;
            switchWidthDurationMs = widthDuration;
            switchContentDurationMs = contentDuration;
            switchShellDistancePx = shellDistance;
            switchContentDistancePx = contentDistance;
            switchContentSpeedProfile = isRetargeting
                ? `retarget-ease-out(${contentLag})`
                : `coordinated-ease(${contentLag})`;
            shellMotionOffset = {
                x: startRect.left - initialBaseBounds.left,
                y: startRect.top - initialBaseBounds.top,
            };
            incomingLayerOffset = {
                x: canJoinContentTrack
                    ? incomingTrackRect.left - startRect.left
                    : 0,
                y: canJoinContentTrack
                    ? incomingTrackRect.top - startRect.top
                    : 0,
            };
            outgoingLayerOffset = {
                x: oldTarget.left - startRect.left,
                y: oldTarget.top - startRect.top,
            };
            if (!canJoinContentTrack) {
                outgoingOverlay = null;
                outgoingTargetRect = undefined;
                outgoingAlignedRect = undefined;
                outgoingContentRect = undefined;
                outgoingLayerOffset = { x: 0, y: 0 };
            }

            tick().then(() => {
                if (revision !== switchMotionRevision) return;
                switchMotionFrame = window.requestAnimationFrame(() => {
                    if (revision !== switchMotionRevision) return;
                    moveMode = "frame";
                    switchPhase = "moving";
                    const startedAt = performance.now();
                    let contentSettled = false;

                    const animate = (now: number) => {
                        if (revision !== switchMotionRevision) return;
                        const elapsed = now - startedAt;
                        const timelineProgress = getMotionProgress(
                            elapsed,
                            motionDuration,
                        );
                        const shellProgress = getCoordinatedProgress(
                            timelineProgress,
                            isRetargeting,
                        );
                        const widthState = getTooltipWidthSpringState(
                            startRect.width,
                            targetRect.width,
                            initialWidthVelocityPxPerSecond,
                            elapsed,
                        );
                        switchWidthVelocityPxPerSecond =
                            widthState.velocityPxPerSecond;
                        const contentProgress = getContentProgress(
                            shellProgress,
                            contentLag,
                        );
                        const currentSize = {
                            width: widthState.width,
                            height: interpolate(
                                startRect.height,
                                targetRect.height,
                                shellProgress,
                            ),
                        };
                        animatedShellSize = currentSize;
                        const currentBaseBounds = getFloatingVisualBounds(
                            bestPos,
                            bestCoords,
                            currentSize,
                        );
                        const currentShell = {
                            left: getWidthAnchoredLeft(
                                startRect,
                                targetRect,
                                currentSize.width,
                                shellProgress,
                                bestPos,
                            ),
                            top: interpolate(
                                startRect.top,
                                targetRect.top,
                                shellProgress,
                            ),
                        };
                        shellMotionOffset = {
                            x: currentShell.left - currentBaseBounds.left,
                            y: currentShell.top - currentBaseBounds.top,
                        };

                        if (canJoinContentTrack) {
                            const contentShift = {
                                x: alignment.x * contentProgress,
                                y: alignment.y * contentProgress,
                            };
                            incomingLayerOffset = {
                                x:
                                    incomingTrackRect.left +
                                    contentShift.x -
                                    currentShell.left,
                                y:
                                    incomingTrackRect.top +
                                    contentShift.y -
                                    currentShell.top,
                            };
                            outgoingLayerOffset = {
                                x:
                                    oldTarget.left +
                                    contentShift.x -
                                    currentShell.left,
                                y:
                                    oldTarget.top +
                                    contentShift.y -
                                    currentShell.top,
                            };
                        } else {
                            incomingLayerOffset = { x: 0, y: 0 };
                        }

                        if (!contentSettled && elapsed >= motionDuration) {
                            contentSettled = true;
                            outgoingOverlay = null;
                            outgoingTargetRect = undefined;
                            outgoingAlignedRect = undefined;
                            outgoingContentRect = undefined;
                            outgoingLayerOffset = { x: 0, y: 0 };
                            incomingLayerOffset = { x: 0, y: 0 };
                        }

                        if (elapsed >= totalDuration) {
                            switchMotionFrame = undefined;
                            finishSwitchMotion(revision);
                            return;
                        }
                        switchMotionFrame = window.requestAnimationFrame(animate);
                    };

                    animate(startedAt);
                });
            });
        } else if (isSwitchingTooltip) {
            cancelSwitchMotion();
            shellMotionOffset = { x: 0, y: 0 };
            incomingLayerOffset = { x: 0, y: 0 };
            outgoingLayerOffset = { x: 0, y: 0 };
            outgoingOverlay = null;
            outgoingTargetRect = undefined;
            outgoingAlignedRect = undefined;
            outgoingContentRect = undefined;
            switchStartRect = undefined;
            moveMode = "snap";
            switchPhase = "idle";
            switchRetargeting = false;
            pendingSwitchRetarget = false;
            animatedShellSize = undefined;
            switchWidthVelocityPxPerSecond = 0;
            switchShellDurationMs = 0;
            switchWidthDurationMs = 0;
            switchContentDurationMs = 0;
            switchShellDistancePx = 0;
            switchContentDistancePx = 0;
            switchContentSpeedProfile = "coordinated-ease(0.08)";
        }

        incomingLayerReady = true;

        hasMeasuredPosition = true;
        lastPositionTooltipId = activeTooltipId;
        activeTargetRect = targetRect;
        if (!portalReady && portalReadyFrame === undefined) {
            const readyTooltipId = activeTooltipId;
            portalReadyFrame = window.requestAnimationFrame(() => {
                portalReadyFrame = undefined;
                if ((currentOverlay?.id ?? tooltipId) !== readyTooltipId) return;
                portalReady = true;
            });
        }
        if (
            tooltipBehavior.lifecycleMotion &&
            !portalMotionReady &&
            portalLifecycleState === "Appear"
        ) {
            const readyTooltipId = activeTooltipId;
            window.requestAnimationFrame(() => {
                if ((currentOverlay?.id ?? tooltipId) !== readyTooltipId) return;
                portalMotionReady = true;
                if (overlayAppearTimer !== undefined) {
                    window.clearTimeout(overlayAppearTimer);
                }
                overlayAppearTimer = window.setTimeout(() => {
                    overlayAppearTimer = undefined;
                    if ((currentOverlay?.id ?? tooltipId) !== readyTooltipId) return;
                    portalLifecycleState = "Active";
                }, TOOLTIP_APPEAR_TOTAL_MS);
            });
        } else if (!tooltipBehavior.lifecycleMotion) {
            portalMotionReady = false;
            portalLifecycleState = "Idle";
        }
        if (
            tooltipBehavior.sizeMotion &&
            !sizeMotionEnabled &&
            measuredSize.width &&
            measuredSize.height
        ) {
            const readyTooltipId = activeTooltipId;
            if (sizeMotionTimer !== undefined) {
                window.clearTimeout(sizeMotionTimer);
            }
            sizeMotionTimer = window.setTimeout(() => {
                sizeMotionTimer = undefined;
                if ((currentOverlay?.id ?? tooltipId) !== readyTooltipId) return;
                sizeMotionEnabled = true;
            }, TOOLTIP_APPEAR_TOTAL_MS);
        } else if (!tooltipBehavior.sizeMotion) {
            sizeMotionEnabled = false;
        }
    }

    function cancelPositionUpdate() {
        if (positionUpdateFrame === undefined) return;
        window.cancelAnimationFrame(positionUpdateFrame);
        positionUpdateFrame = undefined;
    }

    function schedulePositionUpdate() {
        if (positionUpdateFrame !== undefined) return;
        positionUpdateFrame = window.requestAnimationFrame(() => {
            positionUpdateFrame = undefined;
            updatePosition();
        });
    }

    function clearHoverShowTimer() {
        if (hoverShowTimer !== undefined) {
            window.clearTimeout(hoverShowTimer);
            hoverShowTimer = undefined;
        }
    }

    function resolveTriggerElement(placeholder: HTMLElement) {
        const parent = placeholder.parentElement;
        if (!parent) return null;

        return (
            parent.closest<HTMLElement>(
                'button, a, [role="button"], [role="link"]',
            ) ?? parent
        );
    }

    function createOverlayState(): TooltipOverlayState {
        return {
            id: tooltipId,
            triggerEl: triggerEl as HTMLElement,
            position,
            offset,
            variant: finalVariant,
            className,
            style: tooltipFrameStyle,
            children: tooltipChildren,
            fallbackContent: displayContent,
            get dismissOnMotion() {
                return dismissOnMotion;
            },
            loopMotion,
            rest: forwardedRest,
        };
    }

    function handleMouseEnter() {
        if (finalDisabled) return;
        if (open !== undefined) return;
        // 仅 role 模式（as="tooltip"）受 Text 截断状态约束。
        if (as === "tooltip" && textCtx && !textCtx.isCollapsed) return;

        if (!tooltipChildren && triggerEl) {
            fallbackContent = triggerEl.innerText || "";
        } else {
            fallbackContent = "";
        }

        clearHoverShowTimer();
        const showTooltip = () => {
            hoverShowTimer = undefined;
            if (finalDisabled) return;
            markTooltipShown();
            showTooltipOverlay(createOverlayState());
        };
        const showDelay = getTooltipHoverShowDelay();
        if (showDelay === 0) {
            showTooltip();
        } else {
            hoverShowTimer = window.setTimeout(showTooltip, showDelay);
        }
    }

    function handleMouseLeave() {
        clearHoverShowTimer();
        if (open !== undefined) return;
        scheduleTooltipOverlayHide(tooltipId, tooltipBehavior.switchHideDelayMs);
        scheduleTooltipWarmupReset();
    }

    let originalCursor = "";

    onMount(() => {
        unregisterOverlayHost = registerOverlayHostCandidate(tooltipId, (value) => {
            isOverlayHost = value;
        });

        if (placeholderRef) {
            triggerEl = resolveTriggerElement(placeholderRef);
        }

        if (triggerEl) {
            // 保存原始 cursor 并设置 pointer
            originalCursor = triggerEl.style.cursor;
            triggerEl.style.cursor = "pointer";
            triggerEl.addEventListener("mouseenter", handleMouseEnter);
            triggerEl.addEventListener("mouseleave", handleMouseLeave);
        }

    });

    $effect(() => {
        if (!isOverlayHost && !controlledVisible) return;

        reducedMotionMedia = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        const updateReducedMotion = () => {
            prefersReducedMotion = reducedMotionMedia?.matches ?? false;
            if (prefersReducedMotion && outgoingOverlay) {
                cancelSwitchMotion();
                outgoingOverlay = null;
                outgoingTargetRect = undefined;
                outgoingAlignedRect = undefined;
                outgoingContentRect = undefined;
                switchStartRect = undefined;
                shellMotionOffset = { x: 0, y: 0 };
                incomingLayerOffset = { x: 0, y: 0 };
                outgoingLayerOffset = { x: 0, y: 0 };
                moveMode = "snap";
                switchPhase = "idle";
                switchRetargeting = false;
                pendingSwitchRetarget = false;
                animatedShellSize = undefined;
                switchWidthVelocityPxPerSecond = 0;
                switchShellDurationMs = 0;
                switchWidthDurationMs = 0;
                switchContentDurationMs = 0;
                switchShellDistancePx = 0;
                switchContentDistancePx = 0;
                switchContentSpeedProfile = "coordinated-ease(0.08)";
            }
        };
        updateReducedMotion();
        reducedMotionMedia?.addEventListener("change", updateReducedMotion);
        window.addEventListener("scroll", schedulePositionUpdate, true);
        window.addEventListener("resize", schedulePositionUpdate);

        return () => {
            reducedMotionMedia?.removeEventListener("change", updateReducedMotion);
            reducedMotionMedia = undefined;
            window.removeEventListener("scroll", schedulePositionUpdate, true);
            window.removeEventListener("resize", schedulePositionUpdate);
            cancelPositionUpdate();
        };
    });

    onDestroy(() => {
        clearHoverShowTimer();
        clearOverlayLifecycleTimers();
        cancelPositionUpdate();
        const wasActive = hideTooltipOverlay(tooltipId);
        unregisterOverlayHost?.();
        if (open === undefined && wasActive) {
            scheduleTooltipWarmupReset();
        }
        if (triggerEl) {
            // 恢复原始 cursor
            triggerEl.style.cursor = originalCursor;
            triggerEl.removeEventListener("mouseenter", handleMouseEnter);
            triggerEl.removeEventListener("mouseleave", handleMouseLeave);
        }
    });

    // Portal 定位样式 (fixed + px，与 getBoundingClientRect 坐标保持同一单位)
    const portalStyle = $derived(
        `--snowui-tooltip-top: ${coords.top}px; --snowui-tooltip-left: ${coords.left}px; top: var(--snowui-tooltip-top-override, var(--snowui-tooltip-top)); left: var(--snowui-tooltip-left-override, var(--snowui-tooltip-left));`,
    );
    const foregroundStyle = $derived(
        `transform-origin: ${tooltipTransformOrigin};`,
    );
</script>

<!-- 占位符 -->
{#if finalDisabled && effectiveSkeleton}
    <Skeleton
        componentClass="snowui-tooltip"
        renderHints={{
            variant: renderHints?.variant ?? "rect",
            width: renderHints?.width ?? "4.5rem",
            height: renderHints?.height ?? "2rem",
            radius: renderHints?.radius ?? "var(--radius-3)",
            rows: renderHints?.rows,
        }}
    />
{:else}
    <span bind:this={placeholderRef} class="snowui-tooltip-placeholder" style="display: none;" aria-hidden="true"
        >&#8203;</span
    >

    <!-- 非受控 hover 模式：页面级共享 Portal，切换触发器时复用同一个外框。 -->
    {#if overlayVisible && renderedOverlay && !finalDisabled}
        <Frame
            enableResponsive={false}
            enableContext={false}
            enableDefaultMotion={false}
            enableScaleObserver={false}
            use={[portal]}
            bind:element={tooltipRef}
            loopMotion={renderedOverlay.loopMotion}
            class="snowui-tooltip-portal"
            style={portalStyle}
            data-ready={portalReady}
        >
            <div
                class="snowui-tooltip-motion-shell"
                data-move-mode={moveMode}
                data-switch-phase={switchPhase}
                data-retargeting={switchRetargeting}
                data-shell-duration={switchShellDurationMs}
                data-width-duration={switchWidthDurationMs}
                data-content-duration={switchContentDurationMs}
                data-shell-distance={switchShellDistancePx}
                data-content-distance={switchContentDistancePx}
                data-content-speed-profile={switchContentSpeedProfile}
                style={motionShellStyle}
            >
                <Frame
                    enableResponsive={false}
                    enableContext={false}
                    enableScaleObserver={false}
                    whileActive={effectiveSizeMotion}
                    bind:element={sizeShellRef}
                    data-variant={renderedOverlay.variant}
                    data-size-motion={sizeMotionEnabled && animatedShellSize === undefined}
                    class={[
                        "snowui-tooltip-content",
                        "snowui-tooltip-size-shell",
                        "snowui-rounded-rectangle",
                        `snowui-tooltip-pos-${finalPosition}`,
                        renderedOverlay.className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={[sizeShellStyle, renderedOverlay.style]
                        .filter(Boolean)
                        .join("; ")}
                    role="tooltip"
                    {...renderedOverlay.rest}
                >
                    <span class="snowui-tooltip-backdrop" aria-hidden="true"></span>
                    <Frame
                        enableResponsive={false}
                        enableContext={false}
                        enableDefaultMotion={false}
                        enableScaleObserver={false}
                        currentState={effectivePortalLifecycleState}
                        whileAppear={effectivePortalAppearMotion}
                        whileDisappear={effectivePortalDisappearMotion}
                        class="snowui-tooltip-foreground snowui-tooltip-shared-foreground"
                        style={foregroundStyle}
                    >
                        {#if outgoingOverlay}
                            <span
                                class="snowui-tooltip-content-layer"
                                data-tooltip-layer="outgoing"
                                data-move-mode={moveMode}
                                style={outgoingLayerStyle}
                                aria-hidden="true"
                            >
                                <span class="snowui-tooltip-inner">
                                    {#if outgoingOverlay.children}
                                        {@render outgoingOverlay.children()}
                                    {:else if outgoingOverlay.fallbackContent}
                                        {outgoingOverlay.fallbackContent}
                                    {/if}
                                </span>
                            </span>
                        {/if}
                        <span
                            bind:this={incomingLayerRef}
                            class="snowui-tooltip-content-layer"
                            data-tooltip-layer="incoming"
                            data-move-mode={moveMode}
                            data-layer-ready={incomingLayerReady}
                            style={incomingLayerStyle}
                        >
                            <span bind:this={sizeContentRef} class="snowui-tooltip-inner">
                                {#if renderedOverlay.children}
                                    {@render renderedOverlay.children()}
                                {:else if renderedOverlay.fallbackContent}
                                    {renderedOverlay.fallbackContent}
                                {/if}
                            </span>
                        </span>
                    </Frame>
                </Frame>
            </div>
        </Frame>
    {/if}

    <!-- 受控 open 模式：保留本地 Portal，不参与共享 hover 协调。 -->
    {#if controlledVisible && !finalDisabled}
        <Frame
            enableResponsive={false}
            enableContext={false}
            enableDefaultMotion={false}
            enableScaleObserver={false}
            use={[portal]}
            bind:element={tooltipRef}
            loopMotion={loopMotion}
            class="snowui-tooltip-portal"
            style={portalStyle}
            data-move-mode={moveMode}
            data-ready={portalReady}
        >
            <Frame
                enableResponsive={false}
                enableContext={false}
                enableScaleObserver={false}
                whileActive={effectiveSizeMotion}
                bind:element={sizeShellRef}
                data-variant={finalVariant}
                data-size-motion={sizeMotionEnabled}
                class={[
                    "snowui-tooltip-content",
                    "snowui-tooltip-size-shell",
                    "snowui-rounded-rectangle",
                    `snowui-tooltip-pos-${finalPosition}`,
                    className,
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={[sizeShellStyle, tooltipFrameStyle]
                    .filter(Boolean)
                    .join("; ")}
                role="tooltip"
                {...forwardedRest}
            >
                <span class="snowui-tooltip-backdrop" aria-hidden="true"></span>
                <Frame
                    enableResponsive={false}
                    enableContext={false}
                    enableDefaultMotion={false}
                    enableScaleObserver={false}
                    currentState={tooltipBehavior.lifecycleMotion ? "Appear" : "Idle"}
                    whileAppear={effectivePortalAppearMotion}
                    class="snowui-tooltip-foreground"
                    style={foregroundStyle}
                >
                    <Frame
                        enableResponsive={false}
                        enableContext={false}
                        enableScaleObserver={false}
                        bind:element={sizeContentRef}
                        class="snowui-tooltip-inner"
                    >
                        {#if tooltipChildren}
                            {@render tooltipChildren()}
                        {:else if typeof displayContent === "string" && displayContent}
                            {displayContent}
                        {/if}
                    </Frame>
                </Frame>
            </Frame>
        </Frame>
    {/if}
{/if}

<style>
    :global(:where(.snowui-tooltip-portal)) {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
    }

    :global(:where(.snowui-tooltip-portal)[data-ready="false"]) {
        opacity: 0;
    }

    :global(:where(.snowui-tooltip-motion-shell)) {
        position: relative;
        transform: translate3d(
            var(--snowui-tooltip-motion-x, 0),
            var(--snowui-tooltip-motion-y, 0),
            0
        );
    }

    :global(:where(.snowui-tooltip-motion-shell)[data-switch-phase="moving"]) {
        will-change: transform;
    }

    :global(
        :where(.snowui-tooltip-motion-shell)[data-switch-phase="moving"]
            :where(.snowui-tooltip-size-shell)
    ) {
        will-change: width, height;
    }

    :global(
        :where(.snowui-tooltip-motion-shell)[data-switch-phase="moving"]
            :where(.snowui-tooltip-content-layer)
    ) {
        will-change: transform;
    }

    :global(:where(.snowui-tooltip-size-shell)) {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        width: var(--snowui-tooltip-measured-width);
        height: var(--snowui-tooltip-measured-height);
        transition:
            width var(--snowui-frame-size-motion-duration, 300ms)
                var(--snowui-frame-size-motion-easing, ease-out),
            height var(--snowui-frame-size-motion-duration, 300ms)
                var(--snowui-frame-size-motion-easing, ease-out);
    }

    :global(:where(.snowui-tooltip-size-shell)[data-size-motion="false"]) {
        transition: none;
    }

    :global(:where(.snowui-tooltip-size-shell).snowui-tooltip-pos-top),
    :global(:where(.snowui-tooltip-size-shell).snowui-tooltip-pos-bottom) {
        transform: translateX(-50%);
    }

    :global(:where(.snowui-tooltip-size-shell).snowui-tooltip-pos-left),
    :global(:where(.snowui-tooltip-size-shell).snowui-tooltip-pos-right) {
        transform: translateY(-50%);
    }

    :global(:where(.snowui-tooltip-content)) {
        --snowui-tooltip-padding: var(--padding-1) var(--padding-2);
        --snowui-tooltip-gap: var(--gap-2);
        --snowui-tooltip-radius: var(--radius-3);
        --snowui-tooltip-font-size: var(--text-12);
        --snowui-tooltip-line-height: var(--leading-12);

        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-tooltip-gap-override, var(--snowui-tooltip-gap));
        padding: var(
            --snowui-tooltip-padding-override,
            var(--snowui-tooltip-padding)
        );
        border-radius: var(
            --snowui-tooltip-radius-override,
            var(--snowui-tooltip-radius)
        );
        font-size: var(
            --snowui-tooltip-font-size-override,
            var(--snowui-tooltip-font-size)
        );
        line-height: var(
            --snowui-tooltip-line-height-override,
            var(--snowui-tooltip-line-height)
        );
        color: var(--static-white-100, #ffffffff);
        white-space: nowrap;
        pointer-events: none;
    }

    :global(:where(.snowui-tooltip-content)[data-variant="light"]) {
        color: var(--black-100, #000000ff);
    }

    :global(:where(.snowui-tooltip-backdrop)),
    :global(:where(.snowui-tooltip-foreground)) {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        corner-shape: inherit;
        pointer-events: none;
    }

    :global(:where(.snowui-tooltip-backdrop)) {
        z-index: 0;
        backdrop-filter: blur(1.25rem);
        -webkit-backdrop-filter: blur(1.25rem);
        will-change: backdrop-filter;
    }

    :global(:where(.snowui-tooltip-foreground)) {
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        padding: inherit;
        background:
            linear-gradient(
                0deg,
                var(--static-white-10, #ffffff1a),
                var(--static-white-10, #ffffff1a)
            ),
            var(--static-black-80, #000000cc);
        color: inherit;
        will-change: opacity, transform;
    }

    :global(:where(.snowui-tooltip-shared-foreground)) {
        display: block;
        padding: 0;
    }

    :global(:where(.snowui-tooltip-content-layer)) {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        width: var(--snowui-tooltip-layer-width);
        height: var(--snowui-tooltip-layer-height);
        padding: var(
            --snowui-tooltip-padding-override,
            var(--snowui-tooltip-padding)
        );
        color: inherit;
        white-space: nowrap;
        pointer-events: none;
        transform: translate3d(
            var(--snowui-tooltip-layer-x, 0),
            var(--snowui-tooltip-layer-y, 0),
            0
        );
    }

    :global(
        :where(.snowui-tooltip-content-layer)[data-layer-ready="false"]
    ) {
        visibility: hidden;
    }

    :global(
        :where(.snowui-tooltip-content)[data-variant="light"]
            :where(.snowui-tooltip-foreground)
    ) {
        background: var(--black-4, #0000000a);
    }

    :global(:where(.snowui-tooltip-inner)) {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-tooltip-gap-override, var(--snowui-tooltip-gap));
        white-space: nowrap;
        pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-tooltip-motion-shell)),
        :global(:where(.snowui-tooltip-content-layer)),
        :global(:where(.snowui-tooltip-size-shell)) {
            transition: none;
        }
    }
</style>
