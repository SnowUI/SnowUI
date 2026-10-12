<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
 Badge 组件：徽标组件 v1.3.3

 继承 Frame.svelte 的通用能力 (交互、动效、响应式)。
 详见：Badge.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { getContext, onMount, untrack, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { FRAME_CONTEXT_KEY } from "../keys";
    import {
        getIcon,
        getAvatar,
        getImage,
        getSkeleton,
        getSizeContext,
        getSize,
        type ResourceSize,
    } from "../context";
    import { resizeManager } from "../logic/observer.svelte";
    import {
        resolveResourceSizeRemValue,
        resolveResourceSizeToken,
    } from "../logic/resource-size";
    import type { CoreState } from "../logic/frame-types";
    import type { StateValueMap } from "../logic/frame-types";
    import {
        resolveParentStateValue,
        type ParentFrameStateContext,
    } from "../logic/frame-state-value";
    import {
        mergeWhileMotionConfig,
        type MotionConfig,
    } from "../logic/motion-config";
    import {
        resolveSnowUIColor,
        type SnowUIColor,
    } from "../lib/color";

    const BADGE_APPEAR_DURATION = 260;
    const BADGE_DISAPPEAR_DURATION = 180;
    const BADGE_APPEAR_MOTION: MotionConfig = {
        opacity: [1, 1],
        scale: [1, 1],
        x: ["var(--snowui-badge-motion-offset-x, -8.2px)", "0px"],
        y: ["var(--snowui-badge-motion-offset-y, 12.4px)", "0px"],
        duration: BADGE_APPEAR_DURATION,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    };
    const BADGE_DISAPPEAR_MOTION: MotionConfig = {
        opacity: [1, 1],
        scale: [1, 1],
        duration: BADGE_DISAPPEAR_DURATION,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    };

    type BadgePresenceState = "BeforeAppear" | "Appear" | "Idle" | "Disappear";

    function mergeBadgeMotion(
        defaultMotion: MotionConfig,
        userMotion: MotionConfig | boolean | undefined,
    ): MotionConfig | boolean {
        return mergeWhileMotionConfig(defaultMotion, userMotion) ?? false;
    }

    function getMotionDuration(
        motion: MotionConfig | boolean,
        fallback: number,
    ) {
        return motion && typeof motion === "object" && typeof motion.duration === "number"
            ? motion.duration
            : fallback;
    }

    interface Props extends FrameProps {
        variant?: "filled" | "border";
        count?: number | string;
        stateCount?: StateValueMap<number | string>;
        dot?: boolean;
        max?: number;
        showZero?: boolean;
        color?: SnowUIColor | string;
        size?: ResourceSize; // Added size prop
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = "filled",
        count = undefined,
        stateCount = undefined,
        dot = undefined,
        max = 99,
        showZero = false,
        color = "Brand",
        size = undefined, // Default undefined
        class: className = "",
        style: userStyle = "",
        children,
        as = undefined,
        loading = undefined,
        currentState: userCurrentState = undefined,
        whileAppear: userWhileAppear = undefined,
        whileDisappear: userWhileDisappear = undefined,
        responsive = undefined,
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    // 上下文感知 (仅保留必要的)
    const iconCtx = getIcon();
    const avatarCtx = getAvatar();
    const imageCtx = getImage();
    const skeletonCtx = getSkeleton();
    const parentFrameCtx = getContext<ParentFrameStateContext | undefined>(
        FRAME_CONTEXT_KEY,
    );

    // 读取父级尺寸上下文
    getSize();
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined
            ? sizeCtx.iconSize
            : (sizeCtx?.avatarSize ?? sizeCtx?.size),
    );
    // 优先使用 prop size，其次使用 context size
    const resolvedSize = $derived(size ?? contextSize);

    // Register badge size if provided and as="badge"
    $effect(() => {
        if (as === "badge") {
            // Register Role/Type
            // If explicit dot or inferred dot -> 'dot'
            // Else 'content'
            const typeValue = effectiveDot ? "dot" : "content";
            if (avatarCtx && avatarCtx.registerBadgeType) {
                avatarCtx.registerBadgeType(typeValue);
            }
            if (iconCtx && iconCtx.registerBadgeType) {
                iconCtx.registerBadgeType(typeValue);
            }

            if (resolvedSize !== undefined) {
                const remVal = resolveResourceSizeRemValue(
                    resolvedSize as ResourceSize | number,
                );
                if (!remVal) return;
                // Register to Avatar Context
                if (avatarCtx && avatarCtx.registerBadgeSize) {
                    avatarCtx.registerBadgeSize(remVal);
                }
                // Register to Icon Context (if hosting)
                if (iconCtx && iconCtx.registerBadgeSize) {
                    iconCtx.registerBadgeSize(remVal);
                }
            }
        }
    });

    // Register badge volume/geometry if provided and as="badge"
    let clientWidth = $state(0);
    let clientHeight = $state(0);

    let element = $state<HTMLElement>();

    $effect(() => {
        if (as !== "badge" || !element) return;

        const unwatch = resizeManager.watch(
            element,
            (entry: ResizeObserverEntry) => {
                if (entry.contentBoxSize) {
                    clientWidth = entry.contentBoxSize[0].inlineSize;
                    clientHeight = entry.contentBoxSize[0].blockSize;
                    return;
                }
                clientWidth = entry.contentRect.width;
                clientHeight = entry.contentRect.height;
            },
        );

        return () => {
            unwatch();
        };
    });

    $effect(() => {
        if (as === "badge" && clientWidth && clientHeight) {
            // 将尺寸换算为 rem（按 1rem=16 的比例）
            const wRem = clientWidth / 16;
            const hRem = clientHeight / 16;

            // Radius Logic:
            // Dots are circular (50%).
            // Content badges are capsules (radius-80 = 5rem).
            const rRem = effectiveDot ? hRem / 2 : 5;

            if (avatarCtx && avatarCtx.registerBadgeGeometry) {
                avatarCtx.registerBadgeGeometry(wRem, hRem, rRem);
            }
            if (iconCtx && iconCtx.registerBadgeGeometry) {
                iconCtx.registerBadgeGeometry(wRem, hRem, rRem);
            }
        }
    });

    // 自动内容抓取
    let placeholderRef = $state<HTMLElement>();
    let fallbackContent = $state<string>("");
    let prefersReducedMotion = $state(false);

    onMount(() => {
        if (
            placeholderRef &&
            placeholderRef.parentElement &&
            !effectiveCount &&
            !children
        ) {
            fallbackContent =
                placeholderRef.parentElement.innerText?.trim() || "";
        }

        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const syncReducedMotion = () => {
            prefersReducedMotion = media.matches;
        };

        syncReducedMotion();
        media.addEventListener("change", syncReducedMotion);

        return () => {
            media.removeEventListener("change", syncReducedMotion);
        };
    });

    // 角色化逻辑
    const isBadgeRole = $derived(as === "badge");
    const effectiveCount = $derived(
        resolveParentStateValue(stateCount, parentFrameCtx, count),
    );

    // 计算生效的值 (响应式由 Frame 处理)
    let effectiveDot = $derived(dot ?? (effectiveCount === undefined && !children));

    // 自动内容格式化
    let displayCount = $derived.by(() => {
        const val = effectiveCount ?? fallbackContent;
        if (typeof val === "number") {
            return val > max ? `${max}+` : val;
        }
        return val;
    });

    // 状态推导
    let finalLoading = $derived(loading || skeletonCtx?.loading);

    // 隐藏条件
    let isBadgeHidden = $derived(
        !finalLoading &&
            !effectiveDot &&
            !showZero &&
            (effectiveCount === 0 ||
                effectiveCount === "0" ||
                (!effectiveCount && !children && !fallbackContent)),
    );

    const effectiveWhileAppear = $derived(
        prefersReducedMotion
            ? false
            : mergeBadgeMotion(BADGE_APPEAR_MOTION, userWhileAppear),
    );
    const effectiveWhileDisappear = $derived(
        prefersReducedMotion
            ? false
            : mergeBadgeMotion(BADGE_DISAPPEAR_MOTION, userWhileDisappear),
    );
    const badgeAppearDuration = $derived(
        prefersReducedMotion
            ? 0
            : getMotionDuration(effectiveWhileAppear, BADGE_APPEAR_DURATION),
    );
    const badgeDisappearDuration = $derived(
        prefersReducedMotion
            ? 0
            : getMotionDuration(effectiveWhileDisappear, BADGE_DISAPPEAR_DURATION),
    );

    let shouldRenderBadge = $state(false);
    let badgePresenceState = $state<BadgePresenceState>("Idle");
    let renderedDisplayCount = $state<number | string>("");
    let previousHidden: boolean | undefined;

    $effect(() => {
        if (isBadgeHidden || effectiveDot || children) return;
        renderedDisplayCount = displayCount;
    });

    $effect(() => {
        const hidden = isBadgeHidden;
        const appearDuration = badgeAppearDuration;
        const disappearDuration = badgeDisappearDuration;
        const wasRendered = untrack(() => shouldRenderBadge);

        if (previousHidden === hidden) return;
        previousHidden = hidden;

        if (hidden) {
            if (!wasRendered) {
                shouldRenderBadge = false;
                badgePresenceState = "Idle";
                return;
            }

            badgePresenceState = "Disappear";
            const timer = setTimeout(() => {
                shouldRenderBadge = false;
                badgePresenceState = "Idle";
            }, disappearDuration);
            return () => clearTimeout(timer);
        }

        shouldRenderBadge = true;
        badgePresenceState = "BeforeAppear";

        if (typeof window === "undefined") {
            badgePresenceState = "Appear";
            return;
        }

        let timer: ReturnType<typeof setTimeout> | undefined;
        const frame = window.requestAnimationFrame(() => {
            badgePresenceState = "Appear";
            timer = setTimeout(() => {
                badgePresenceState = "Idle";
            }, appearDuration);
        });

        return () => {
            window.cancelAnimationFrame(frame);
            if (timer) clearTimeout(timer);
        };
    });

    const badgeFrameState = $derived.by<CoreState>(() => {
        if (userCurrentState) return userCurrentState;
        if (badgePresenceState === "Appear") return "Appear";
        if (badgePresenceState === "Disappear") return "Disappear";
        return "Idle";
    });

    const badgeFixedSizeToken = $derived.by(() => {
        if (variant === "border") return undefined;
        // Resolve Size:
        // If it's a badge role (inside Avatar/Icon), we don't want the parent Group's size as our FIXED size
        // unless it's explicitly passed as a prop.
        const sizeToUse = size ?? (isBadgeRole ? undefined : contextSize);
        const mappedSize = sizeToUse
            ? resolveResourceSizeToken(sizeToUse)
            : undefined;
        if (mappedSize) return mappedSize;
        if (
            effectiveDot &&
            isBadgeRole &&
            (iconCtx?.badgeSize || avatarCtx?.badgeSize)
        ) {
            return iconCtx?.badgeSize || avatarCtx?.badgeSize;
        }
        return undefined;
    });
    const shouldForceBadgeFontInherit = $derived(
        !size &&
            effectiveDot &&
            isBadgeRole &&
            !!(iconCtx?.badgeSize || avatarCtx?.badgeSize),
    );
    const shouldBindBadgeFixedSize = $derived(!!badgeFixedSizeToken);

    let effectiveStyle = $derived.by(() => {
        const dimStyle = badgeFixedSizeToken
            ? `--snowui-badge-fixed-size: var(--snowui-badge-size-override, ${badgeFixedSizeToken});`
            : "";
        const fontInheritStyle = shouldForceBadgeFontInherit
            ? "--snowui-badge-font-size: inherit;"
            : "";
        return [
            isBadgeRole
                ? imageCtx?.badgeStyle ||
                    iconCtx?.badgeStyle ||
                    avatarCtx?.badgeStyle
                : "",
            dimStyle,
            fontInheritStyle,
            variant !== "border" || effectiveDot
                ? `--snowui-badge-background: ${resolveSnowUIColor(color)}`
                : "",
            userStyle,
        ]
            .filter(Boolean)
            .join(";");
    });
    const layoutAs = $derived(
        isBadgeRole && imageCtx ? imageCtx.badgeAs || as : as,
    );
    const badgeRenderHints = $derived.by(() => {
        const base = (() => {
            if (variant === "border") {
                return {
                    variant: "line" as const,
                    height: "var(--leading-12)",
                    radius: "calc(var(--radius-1) * 1.5)",
                };
            }
            if (effectiveDot) {
                const dotSize = badgeFixedSizeToken ??
                    "calc(var(--size-4) * 1.5 / 4)";
                return {
                    variant: "circle" as const,
                    width: dotSize,
                    height: dotSize,
                    radius: "var(--radius-full, 9999px)",
                };
            }
            if (badgeFixedSizeToken) {
                return {
                    variant: "line" as const,
                    width: badgeFixedSizeToken,
                    height: badgeFixedSizeToken,
                    radius: "calc(var(--radius-1) * 20)",
                };
            }
            if (resolvedSize !== undefined) {
                const mappedSize = resolveResourceSizeToken(resolvedSize);
                if (mappedSize) {
                    return {
                        variant: "line" as const,
                        height: mappedSize,
                        radius: "calc(var(--radius-1) * 20)",
                    };
                }
            }
            return undefined;
        })();
        if (!base) return userRenderHints;
        return {
            variant: userRenderHints?.variant ?? base.variant,
            width: userRenderHints?.width ?? base.width,
            height: userRenderHints?.height ?? base.height,
            radius: userRenderHints?.radius ?? base.radius,
        };
    });
</script>

{#if shouldRenderBadge}
    <Frame
        enableResponsive={false}
        enableContext={false}
        enableScaleObserver={false}
        bind:element
        class={[
            "snowui-badge",
            className,
            isBadgeRole ? "snowui-badge-role" : "",
            effectiveDot ? "snowui-badge-dot" : "",
            variant === "border" && !effectiveDot
                ? "snowui-badge-border"
                : "",
            "snowui-badge-motion",
            shouldBindBadgeFixedSize ? "snowui-badge-size-bound" : "",
        ]
            .filter(Boolean)
            .join(" ")}
        style={effectiveStyle}
        as={layoutAs}
        currentState={badgeFrameState}
        whileAppear={effectiveWhileAppear}
        whileDisappear={effectiveWhileDisappear}
        loading={finalLoading}
        renderHints={badgeRenderHints}
        aria-hidden={isBadgeHidden ? "true" : undefined}
        data-badge-motion-state={badgePresenceState}
        {responsive}
        {...rest}
    >
        {#snippet children()}
            <div class={variant === "border" && !effectiveDot
                ? "snowui-badge-surface snowui-rounded-rectangle"
                : "snowui-badge-surface"}>
                <!-- 占位符 -->
                <span
                    bind:this={placeholderRef}
                    class="snowui-badge-placeholder"
                    aria-hidden="true">&#8203;</span
                >

                <div class="snowui-morph-container">
                    <div class="snowui-morph-item">
                        {#if children}
                            {@render children({})}
                        {:else if !effectiveDot}
                            {renderedDisplayCount}
                        {/if}
                    </div>
                </div>
            </div>
        {/snippet}
    </Frame>
{/if}

<style>
    /* Level 2: Component Base (降权为 0) */
    :global(:where(.snowui-badge)) {
        display: inline-flex;
        flex-shrink: 0;
        position: relative;
        vertical-align: middle;
        box-sizing: border-box;
        z-index: 10;
        width: fit-content;
        height: auto;

        --snowui-badge-padding: calc(var(--padding-1) * 0.75)
            calc(var(--padding-1) * 1.5);
        --snowui-badge-radius: var(--radius-full);
        --snowui-badge-font-size: var(--text-12);
        --snowui-badge-line-height: 1;
        --snowui-badge-foreground: var(--static-white-100, #ffffffff);
        --snowui-badge-shadow: none;

    }

    :global(:where(.snowui-badge-surface)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        background-color: var(
            --snowui-badge-background,
            var(--brand, #33D1FFFF)
        );
        color: var(--snowui-badge-foreground);
        width: fit-content;
        height: auto;
        min-width: var(
            --snowui-badge-min-width-override,
            var(--snowui-badge-min-width, 0)
        );
        padding: var(
            --snowui-badge-padding-override,
            var(--snowui-badge-padding)
        );
        font-size: var(
            --snowui-badge-font-size-override,
            var(--snowui-badge-font-size)
        );
        line-height: var(
            --snowui-badge-line-height-override,
            var(--snowui-badge-line-height)
        );
        border-radius: var(
            --snowui-badge-radius-override,
            var(--snowui-badge-radius)
        );
        box-shadow: var(--snowui-badge-shadow);
        white-space: nowrap;
    }

    /* Level 4: Border 变体确权（与 Kbd 默认 border 视觉一致，仅更新变量） */
    :global(:where(.snowui-badge).snowui-badge-border) {
        --snowui-badge-padding: var(--padding-0) var(--padding-1);
        --snowui-badge-radius: calc(var(--radius-1) * 1.5);
        --snowui-badge-font-size: var(--text-12);
        --snowui-badge-line-height: var(--leading-12);
        --snowui-badge-background: transparent;
        --snowui-badge-foreground: inherit;
        --snowui-badge-shadow: inset 0 0 0 var(--border-1)
            var(--black-10, rgba(0, 0, 0, 0.1));
    }

    /* Border 文本层继承 16px 行高，避免通用 morph-item 的紧凑 line-height: 1 将高度压回 12px。 */
    :global(:where(.snowui-badge-border) .snowui-morph-item) {
        line-height: inherit;
    }

    /* transitions.dev Notification badge：Frame 根层滑动，视觉 surface 整体 pop。 */
    :global(:where(.snowui-badge-motion > .snowui-badge-surface)) {
        transform-origin: center;
        transform: scale(0);
        opacity: 0;
        filter: blur(var(--snowui-badge-motion-blur, 2px));
        transition:
            transform var(--snowui-badge-motion-pop-duration, 500ms)
                var(
                    --snowui-badge-motion-pop-easing,
                    cubic-bezier(0.34, 1.36, 0.64, 1)
                ),
            opacity var(--snowui-badge-motion-fade-duration, 400ms)
                var(
                    --snowui-badge-motion-pop-easing,
                    cubic-bezier(0.34, 1.36, 0.64, 1)
                ),
            filter var(--snowui-badge-motion-pop-duration, 500ms)
                var(
                    --snowui-badge-motion-pop-easing,
                    cubic-bezier(0.34, 1.36, 0.64, 1)
                );
        will-change: transform, opacity, filter;
    }

    :global(:where(.snowui-badge-motion[data-badge-motion-state="Appear"] > .snowui-badge-surface)),
    :global(:where(.snowui-badge-motion[data-badge-motion-state="Idle"] > .snowui-badge-surface)) {
        transform: scale(1);
        opacity: 1;
        filter: blur(0);
    }

    :global(:where(.snowui-badge-motion[data-badge-motion-state="Disappear"] > .snowui-badge-surface)) {
        transform: scale(0);
        opacity: 0;
        filter: blur(var(--snowui-badge-motion-blur, 2px));
        transition:
            transform var(--snowui-badge-motion-pop-close-duration, 180ms)
                var(
                    --snowui-badge-motion-close-easing,
                    cubic-bezier(0.4, 0, 0.2, 1)
                ),
            opacity var(--snowui-badge-motion-fade-close-duration, 180ms)
                var(
                    --snowui-badge-motion-close-easing,
                    cubic-bezier(0.4, 0, 0.2, 1)
                ),
            filter var(--snowui-badge-motion-pop-close-duration, 180ms)
                var(
                    --snowui-badge-motion-close-easing,
                    cubic-bezier(0.4, 0, 0.2, 1)
                );
    }

    :global(:where(.snowui-badge[data-as^="pin-"])) {
        position: absolute;
    }

    :global(:where(.snowui-badge-role > .snowui-badge-surface)) {
        border: 0;
    }

    /* 点模式样式 */
    :global(:where(.snowui-badge-dot > .snowui-badge-surface)) {
        --snowui-badge-dot-size: calc(var(--size-4) * 1.5 / 4);
        width: var(
            --snowui-badge-width-override,
            var(--snowui-badge-dot-size-override, var(--snowui-badge-dot-size))
        );
        height: var(
            --snowui-badge-height-override,
            var(--snowui-badge-dot-size-override, var(--snowui-badge-dot-size))
        );
        min-width: var(
            --snowui-badge-min-width-override,
            var(--snowui-badge-dot-size-override, var(--snowui-badge-dot-size))
        );
        padding: 0;
        border-radius: var(--radius-full, 9999px);
        color: var(
            --snowui-badge-background,
            var(--brand, #33D1FFFF)
        );
        background-color: currentColor;
    }

    :global(:where(.snowui-badge).snowui-badge-size-bound) {
        width: var(
            --snowui-badge-width-override,
            var(--snowui-badge-fixed-size)
        );
        height: var(
            --snowui-badge-height-override,
            var(--snowui-badge-fixed-size)
        );
        min-width: var(
            --snowui-badge-min-width-override,
            var(--snowui-badge-fixed-size)
        );
    }

    :global(:where(.snowui-badge).snowui-badge-size-bound > .snowui-badge-surface) {
        width: 100%;
        height: 100%;
        min-width: 100%;
    }

    :global(:where(.snowui-badge-placeholder)) {
        display: none;
    }

    /* 布局稳定性：Grid Stacking */
    :global(:where(.snowui-morph-container)) {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr);
        place-items: start;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        border-radius: inherit;
        corner-shape: inherit;
    }

    :global(:where(.snowui-morph-item)) {
        grid-area: 1 / 1 / 2 / 2;
        display: flex;
        align-items: center;
        justify-content: center;
        justify-self: start;
        align-self: start;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: max-content;
        height: max-content;
        min-width: 0;
        line-height: 1;
        text-align: center;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-badge-motion > .snowui-badge-surface)) {
            transition: none;
            filter: none;
        }
    }
</style>
