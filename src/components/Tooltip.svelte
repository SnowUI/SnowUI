<!--
 Tooltip 文字提示组件 v1.7.0

 继承 Frame.svelte 的通用能力 (交互、动效、响应式)。
 变更 (2026-07-28): 默认感知触发元素及祖先的几何动效，并在首帧位移前立即关闭。
 变更 (2026-07-28): Tooltip 默认外观变体由 dark 改为 light。
 变更 (2026-06-06): Tooltip 首次定位使用测量后的目标宽高计算坐标，避免第一次出现时与触发按钮间距偏小。
 变更 (2026-06-06): Tooltip 尺寸 shell 改用静态 transform 负责锚点居中，避免多次切换时 translate 过渡残留导致位置偏移。
 变更 (2026-06-06): Tooltip Portal 层移除 Frame Active 全属性 transition，避免 snap 定位仍被 top/left 过渡影响。
 变更 (2026-06-06): Tooltip 近距离移动新增同排/同轴限制，跨上下两排快速切换时直接定位到新触发器，避免移动中位置偏离当前按钮。
 变更 (2026-06-18): Tooltip 出现/消失动效改为引用 TOOLTIP_APPEAR_MOTION / TOOLTIP_DISAPPEAR_MOTION。
 变更 (2026-06-18): Tooltip / Popover 共享首次 hover 延迟由 overlay trigger timing token 管理。
 变更 (2026-06-06): Tooltip 出现动效时长从 150ms 调整为 100ms。
 变更 (2026-06-06): Tooltip 出现/消失动效参考 HeroUI：出现为 150ms 淡入 + 90% 缩放 + placement 反向轻微滑入，消失为 100ms 淡出 + 缩到 95%。
 变更 (2026-06-06): Tooltip 出现/消失改为 150ms Frame fade-only 生命周期动效，首帧定位完成后再渐显，避免从页面左上角或旧位置移入。
 变更 (2026-06-06): Tooltip 出现和消失接入 Frame 默认 whileAppear / whileDisappear 渐现渐隐动效，退出动画完成后再卸载外框。
 变更 (2026-06-06): Tooltip 外框隐藏后再次出现会重置运动基线，首帧直接定位到当前触发器，不继承上一轮位移或宽度动效。
 变更 (2026-06-06): Tooltip 改为锚点居中定位，宽度变化、对齐偏移与移动使用同一 150ms Frame motion timing。
 变更 (2026-06-06): Tooltip 外框宽高变化动效加快一倍，尺寸 shell 使用 150ms Frame size motion。
 变更 (2026-06-06): Tooltip 尺寸动画改为外框自身形态变化，避免遮罩裁切长外框的视觉。
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
    const TOOLTIP_MOVE_MAX_CROSS_AXIS_PX = 48;

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
    import { tick, onMount, onDestroy } from "svelte";
    import { getText, getSkeleton, getSize } from "../context";
    import { resizeManager } from "../logic/observer.svelte";
    import type { CoreState } from "../logic/frame-types";
    import { MORPH_MOTION } from "../motion/morph";
    import {
        TOOLTIP_APPEAR_MOTION,
        TOOLTIP_APPEAR_TOTAL_MS,
        TOOLTIP_DISAPPEAR_MOTION,
        TOOLTIP_DISAPPEAR_TOTAL_MS,
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
    let overlayVisible = $derived(isOverlayHost && renderedOverlay !== null);
    let portalLifecycleState = $state<CoreState>("Idle");
    let coords = $state({ top: 0, left: 0 });
    let finalPosition: "top" | "bottom" | "left" | "right" = $state("top");
    let moveMode: "snap" | "move" = $state("snap");
    let measuredSize = $state({ width: 0, height: 0 });
    let hasMeasuredPosition = false;
    let lastPositionTooltipId: string | undefined;
    let overlayWasVisible = false;
    let portalReady = $state(false);
    let portalMotionReady = $state(false);
    let sizeMotionEnabled = $state(false);
    let hoverShowTimer: number | undefined;
    let overlayAppearTimer: number | undefined;
    let overlayDisappearTimer: number | undefined;
    let sizeMotionTimer: number | undefined;
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
        if (!measuredSize.width || !measuredSize.height) return undefined;

        return [
            `width: ${measuredSize.width}px`,
            `height: ${measuredSize.height}px`,
        ].join("; ");
    });
    const effectivePortalLifecycleState = $derived<CoreState>(
        tooltipBehavior.lifecycleMotion && portalMotionReady
            ? portalLifecycleState
            : "Idle",
    );
    const effectivePortalAppearMotion = $derived(
        tooltipBehavior.lifecycleMotion ? TOOLTIP_APPEAR_MOTION : false,
    );
    const effectivePortalDisappearMotion = $derived(
        tooltipBehavior.lifecycleMotion ? TOOLTIP_DISAPPEAR_MOTION : false,
    );
    const effectiveSizeMotion = $derived(
        tooltipBehavior.sizeMotion ? TOOLTIP_SYNC_MOTION : false,
    );
    const tooltipTransformOrigin = $derived.by(() => {
        if (finalPosition === "top") return "0% 100%";
        if (finalPosition === "left") return "100% 0%";
        return "0% 0%";
    });

    function resetMotionBaseline() {
        portalReady = false;
        portalMotionReady = false;
        sizeMotionEnabled = false;
        hasMeasuredPosition = false;
        lastPositionTooltipId = undefined;
        moveMode = "snap";
        measuredSize = { width: 0, height: 0 };
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
    }

    $effect(() => {
        const overlayState = currentOverlay;
        const dismissRevision = immediateDismissRevision;

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
                renderedOverlay
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
        if (!dismissOnMotion || currentOverlay?.id !== tooltipId || !triggerEl) {
            return;
        }

        return registerTooltipMotionDismiss({
            id: tooltipId,
            triggerEl,
            onDismiss: () => {
                clearHoverShowTimer();
                dismissTooltipOverlayImmediately(tooltipId);
                scheduleTooltipWarmupReset();
            },
        });
    });

    $effect(() => {
        const overlayId = currentOverlay?.id;
        const overlayContent = currentOverlay?.fallbackContent;
        const tooltipWidth = measuredSize.width;
        const tooltipHeight = measuredSize.height;
        void overlayId;
        void overlayContent;
        void tooltipWidth;
        void tooltipHeight;

        finalPosition = position;
        if (controlledVisible || (overlayVisible && currentOverlay)) {
            tick().then(updatePosition);
        }
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

            measuredSize = {
                width: Math.ceil((borderBox?.inlineSize ?? el.offsetWidth) + paddingX),
                height: Math.ceil(
                    (borderBox?.blockSize ?? el.offsetHeight) + paddingY,
                ),
            };
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
        const overlayState = currentOverlay ?? renderedOverlay;
        const activeTriggerEl = overlayState?.triggerEl ?? triggerEl;
        if (!activeTriggerEl) return;

        const activePosition = (overlayState?.position ?? position) as FloatingSide;
        const activeOffset = overlayState?.offset ?? offset;
        const triggerRect = activeTriggerEl.getBoundingClientRect();
        const tooltipRect = tooltipRef.getBoundingClientRect();
        const tooltipWidth = measuredSize.width || tooltipRect.width;
        const tooltipHeight = measuredSize.height || tooltipRect.height;
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

        finalPosition = bestPos;
        const distance = Math.hypot(
            bestCoords.top - coords.top,
            bestCoords.left - coords.left,
        );
        const maxMoveDistance = Math.min(
            TOOLTIP_MOVE_MAX_DISTANCE_PX,
            Math.min(viewportWidth, viewportHeight) * TOOLTIP_MOVE_MAX_VIEWPORT_RATIO,
        );
        const activeTooltipId = overlayState?.id ?? tooltipId;
        const isSwitchingTooltip =
            lastPositionTooltipId !== undefined &&
            lastPositionTooltipId !== activeTooltipId;
        const crossAxisDistance =
            bestPos === "top" || bestPos === "bottom"
                ? Math.abs(bestCoords.top - coords.top)
                : Math.abs(bestCoords.left - coords.left);
        const canSmoothMove =
            tooltipBehavior.smoothMove &&
            distance <= maxMoveDistance &&
            crossAxisDistance <= TOOLTIP_MOVE_MAX_CROSS_AXIS_PX;

        if (!hasMeasuredPosition) {
            moveMode = "snap";
        } else if (isSwitchingTooltip) {
            moveMode = canSmoothMove ? "move" : "snap";
        }
        hasMeasuredPosition = true;
        lastPositionTooltipId = activeTooltipId;
        coords = bestCoords;
        portalReady = true;
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

    function clearHoverShowTimer() {
        if (hoverShowTimer !== undefined) {
            window.clearTimeout(hoverShowTimer);
            hoverShowTimer = undefined;
        }
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
            tick().then(updatePosition);
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
            triggerEl = placeholderRef.parentElement;
        }

        if (triggerEl) {
            // 保存原始 cursor 并设置 pointer
            originalCursor = triggerEl.style.cursor;
            triggerEl.style.cursor = "pointer";
            triggerEl.addEventListener("mouseenter", handleMouseEnter);
            triggerEl.addEventListener("mouseleave", handleMouseLeave);
        }

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);
    });

    onDestroy(() => {
        clearHoverShowTimer();
        clearOverlayLifecycleTimers();
        const wasActive = currentOverlay?.id === tooltipId;
        hideTooltipOverlay(tooltipId);
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
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
    });

    // Portal 定位样式 (fixed + px，与 getBoundingClientRect 坐标保持同一单位)
    const portalStyle = $derived(
        `--snowui-tooltip-top: ${coords.top}px; --snowui-tooltip-left: ${coords.left}px; top: var(--snowui-tooltip-top-override, var(--snowui-tooltip-top)); left: var(--snowui-tooltip-left-override, var(--snowui-tooltip-left)); transform-origin: ${tooltipTransformOrigin};`,
    );
</script>

<!-- 占位符 -->
{#if finalDisabled && effectiveSkeleton}
    <Skeleton componentClass="snowui-tooltip" renderHints={renderHints} />
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
            currentState={effectivePortalLifecycleState}
            whileAppear={effectivePortalAppearMotion}
            whileDisappear={effectivePortalDisappearMotion}
            use={[portal]}
            bind:element={tooltipRef}
            loopMotion={renderedOverlay.loopMotion}
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
                data-variant={renderedOverlay.variant}
                data-size-motion={sizeMotionEnabled}
                class={[
                    "snowui-tooltip-content",
                    "snowui-tooltip-size-shell",
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
                <Frame
                    enableResponsive={false}
                    enableContext={false}
                    enableScaleObserver={false}
                    bind:element={sizeContentRef}
                    class="snowui-tooltip-inner"
                >
                    {#if renderedOverlay.children}
                        {@render renderedOverlay.children()}
                    {:else if renderedOverlay.fallbackContent}
                        {renderedOverlay.fallbackContent}
                    {/if}
                </Frame>
            </Frame>
        </Frame>
    {/if}

    <!-- 受控 open 模式：保留本地 Portal，不参与共享 hover 协调。 -->
    {#if controlledVisible && !finalDisabled}
        <Frame
            enableResponsive={false}
            enableContext={false}
            enableDefaultMotion={false}
            enableScaleObserver={false}
            currentState={tooltipBehavior.lifecycleMotion ? "Appear" : "Idle"}
            whileAppear={effectivePortalAppearMotion}
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

    :global(:where(.snowui-tooltip-portal)[data-move-mode="move"]) {
        transition:
            top var(--snowui-tooltip-move-duration, 150ms)
                var(--snowui-tooltip-move-easing, ease-out),
            left var(--snowui-tooltip-move-duration, 150ms)
                var(--snowui-tooltip-move-easing, ease-out);
    }

    :global(:where(.snowui-tooltip-size-shell)) {
        display: inline-block;
        box-sizing: border-box;
        overflow: hidden;
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
        background:
            linear-gradient(
                0deg,
                var(--static-white-10, #ffffff1a),
                var(--static-white-10, #ffffff1a)
            ),
            var(--static-black-80, #000000cc);
        color: var(--static-white-100, #ffffffff);
        backdrop-filter: blur(1.25rem);
        -webkit-backdrop-filter: blur(1.25rem);
        white-space: nowrap;
        pointer-events: none;
    }

    :global(:where(.snowui-tooltip-content)[data-variant="light"]) {
        background: var(--black-4, #0000000a);
        color: var(--black-100, #000000ff);
    }

    :global(:where(.snowui-tooltip-inner)) {
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: var(--snowui-tooltip-gap-override, var(--snowui-tooltip-gap));
        white-space: nowrap;
        pointer-events: none;
    }
</style>
