<!--
  Progress 进度组件
  v1.1.2

  文档: ./Progress.md
-->

<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import Frame, {
        type FrameProps,
        type LoopMotionConfig,
    } from "./Frame.svelte";
    import Text from "./Text.svelte";
    import {
        resolveSnowUIColor,
        type SnowUIColor,
    } from "../lib/color";
    import { getSize } from "../context";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    type ProgressVariant = "line" | "circle";

    interface Props extends Omit<FrameProps, "children" | "size"> {
        value?: number;
        variant?: ProgressVariant;
        size?: number | string;
        thickness?: number | string;
        background?: SnowUIColor | string;
        color?: SnowUIColor | string;
        isIndeterminate?: boolean;
        showLabel?: boolean;
        loopMotion?: LoopMotionConfig;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Text: typeof Text }>;
        [key: string]: any;
    }

    let {
        value = 0,
        variant = "line",
        size = 16,
        thickness = undefined,
        background = "Black4",
        color = "Primary",
        isIndeterminate = false,
        showLabel = false,
        loopMotion = undefined,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        parts = undefined,
        children,
        ...rest
    }: Props = $props();

    let prefersReducedMotion = $state(false);
    let progressElement = $state<HTMLElement>();

    getSize();

    onMount(() => {
        const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mediaQuery) return;
        const update = () => {
            prefersReducedMotion = mediaQuery.matches;
        };
        update();
        mediaQuery.addEventListener?.("change", update);
        return () => mediaQuery.removeEventListener?.("change", update);
    });

    function toCssLength(value: number | string) {
        return typeof value === "number" ? `${value}px` : value;
    }

    function toPositiveNumber(value: number | string, fallback: number) {
        const numeric = typeof value === "number" ? value : Number.parseFloat(value);
        return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
    }

    const safeValue = $derived(
        Number.isFinite(Number(value))
            ? Math.min(100, Math.max(0, Number(value)))
            : 0,
    );
    const resolvedSize = $derived(size ?? 16);
    const numericSize = $derived(toPositiveNumber(resolvedSize, 16));
    // circle / 不确定态对齐 Spinner：环宽 = 直径 × 15%；line 确定态默认 4px
    const resolvedThickness = $derived(
        thickness ??
            (variant === "circle" || isIndeterminate
                ? numericSize * 0.15
                : 4),
    );
    const numericThickness = $derived(
        Math.min(toPositiveNumber(resolvedThickness, 4), numericSize),
    );
    const circleStrokeWidth = $derived((numericThickness / numericSize) * 100);
    const circleRadius = $derived(Math.max(0, 50 - circleStrokeWidth / 2));
    const circumference = $derived(2 * Math.PI * circleRadius);
    const circleDashOffset = $derived(
        circumference * (1 - (isIndeterminate ? 25 : safeValue) / 100),
    );

    const defaultLoopMotion = $derived<LoopMotionConfig>({
        duration: variant === "circle" ? 1000 : 1500,
        easing:
            variant === "circle"
                ? "linear"
                : "cubic-bezier(0.65, 0, 0.35, 1)",
        iterationCount: "infinite",
        direction: "normal",
        playState: "running",
    });
    const resolvedLoopMotion = $derived(
        isIndeterminate
            ? {
                  ...defaultLoopMotion,
                  ...(loopMotion ?? {}),
                  playState: prefersReducedMotion
                      ? "paused"
                      : (loopMotion?.playState ?? "running"),
              }
            : undefined,
    );
    const timingLoopMotion = $derived.by(() => {
        if (!resolvedLoopMotion) return undefined;

        const { preset: _preset, ...timing } = resolvedLoopMotion;
        return timing;
    });
    const circleLoopMotion = $derived(
        timingLoopMotion
            ? {
                  preset: "rotateClockwise" as const,
                  ...timingLoopMotion,
              }
            : undefined,
    );
    const progressStyle = $derived(
        [
            `--snowui-progress-size: ${toCssLength(resolvedSize)}`,
            `--snowui-progress-thickness: ${toCssLength(resolvedThickness)}`,
            `--snowui-progress-background: ${resolveSnowUIColor(background)}`,
            `--snowui-progress-color: ${resolveSnowUIColor(color)}`,
            `--snowui-progress-value: ${safeValue}%`,
            userStyle,
        ]
            .filter(Boolean)
            .join("; "),
    );
    const progressRenderHints = $derived({
        variant: userRenderHints?.variant ?? (variant === "circle" ? "circle" : "line"),
        width: userRenderHints?.width ?? (variant === "circle" ? toCssLength(resolvedSize) : "100%"),
        height: userRenderHints?.height ?? toCssLength(variant === "circle" ? resolvedSize : resolvedThickness),
        radius: userRenderHints?.radius ?? "var(--radius-full)",
    });

    $effect(() => {
        if (!progressElement) return;
        const labels = progressElement.querySelectorAll<HTMLElement>(
            ":scope > [data-as='label']",
        );
        labels.forEach((label) => {
            if (
                label.dataset.snowuiProgressAutoLabel !== "true" &&
                label.textContent?.trim()
            ) {
                return;
            }
            label.dataset.snowuiProgressAutoLabel = "true";
            label.textContent = String(safeValue);
        });
    });
</script>

<Frame
    bind:element={progressElement}
    class={["snowui-progress", `snowui-progress-${variant}`, userClass]
        .filter(Boolean)
        .join(" ")}
    style={progressStyle}
    data-variant={variant}
    data-indeterminate={isIndeterminate || undefined}
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={isIndeterminate ? undefined : safeValue}
    loopMotion={variant === "line" ? timingLoopMotion : undefined}
    renderHints={progressRenderHints}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else if variant === "circle" && showLabel && !isIndeterminate}
        <Text {...parts?.Text} as="label" />
    {/if}

    {#if variant === "circle"}
        <Frame
            tag="span"
            class="snowui-progress-circle-motion"
            loopMotion={circleLoopMotion}
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
            enableDefaultMotion={false}
            aria-hidden="true"
        >
            <svg
                class="snowui-progress-circle-track"
                viewBox="0 0 100 100"
                fill="none"
            >
                <circle
                    class="snowui-progress-circle-background"
                    cx="50"
                    cy="50"
                    r={circleRadius}
                    stroke-width={circleStrokeWidth}
                />
                <circle
                    class="snowui-progress-circle-fill"
                    cx="50"
                    cy="50"
                    r={circleRadius}
                    stroke-width={circleStrokeWidth}
                    stroke-dasharray={circumference}
                    stroke-dashoffset={circleDashOffset}
                    transform="rotate(-90 50 50)"
                />
            </svg>
        </Frame>
    {:else}
        <span class="snowui-progress-track" aria-hidden="true">
            <span class="snowui-progress-fill"></span>
        </span>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-progress)) {
        position: relative;
        box-sizing: border-box;
        font-size: var(--text-12);
        line-height: var(--leading-12);
    }

    :global(:where(.snowui-progress-line)) {
        display: flex;
        flex-direction: column;
        gap: var(
            --snowui-progress-gap-override,
            var(--snowui-progress-gap, var(--gap-1))
        );
        width: 100%;
    }

    :global(:where(.snowui-progress-line > :not(.snowui-progress-track))) {
        width: 100%;
        align-self: stretch;
    }

    :global(:where(.snowui-progress-track)) {
        display: block;
        width: 100%;
        height: var(
            --snowui-progress-thickness-override,
            var(--snowui-progress-thickness, calc(var(--size-4) / 4))
        );
        overflow: hidden;
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-progress-background-override,
            var(--snowui-progress-background, var(--black-4, #0000000a))
        );
    }

    :global(:where(.snowui-progress-fill)) {
        display: block;
        width: var(--snowui-progress-value, 0%);
        height: 100%;
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-progress-color-override,
            var(--snowui-progress-color, var(--primary, #000000))
        );
        transition:
            width
            var(--snowui-frame-control-motion-duration, 300ms)
            var(--snowui-frame-control-motion-easing, ease-out);
    }

    :global(:where(.snowui-progress-line[data-indeterminate="true"] .snowui-progress-fill)) {
        width: 40%;
        animation-name: snowui-progress-line-indeterminate;
        animation-duration: var(--snowui-frame-loop-motion-duration, 1.5s);
        animation-timing-function: var(
            --snowui-frame-loop-motion-easing,
            cubic-bezier(0.65, 0, 0.35, 1)
        );
        animation-iteration-count: var(
            --snowui-frame-loop-motion-iteration-count,
            infinite
        );
        animation-direction: var(
            --snowui-frame-loop-motion-direction,
            normal
        );
        animation-play-state: var(
            --snowui-frame-loop-motion-play-state,
            running
        );
    }

    :global(:where(.snowui-progress-circle)) {
        display: inline-flex;
        width: var(--snowui-progress-size, var(--size-4));
        height: var(--snowui-progress-size, var(--size-4));
        align-items: center;
        justify-content: center;
        vertical-align: middle;
    }

    :global(:where(.snowui-progress-circle-motion)),
    :global(:where(.snowui-progress-circle-track)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
    }

    :global(:where(.snowui-progress-circle-background)) {
        stroke: var(
            --snowui-progress-background-override,
            var(--snowui-progress-background, var(--black-4, #0000000a))
        );
    }

    :global(:where(.snowui-progress-circle-fill)) {
        stroke: var(
            --snowui-progress-color-override,
            var(--snowui-progress-color, var(--primary, #000000))
        );
        stroke-linecap: round;
        transition:
            stroke-dashoffset
            var(--snowui-frame-control-motion-duration, 300ms)
            var(--snowui-frame-control-motion-easing, ease-out);
    }

    :global(:where(.snowui-progress-circle > :not(.snowui-progress-circle-motion))) {
        position: relative;
        z-index: 1;
    }

    @keyframes snowui-progress-line-indeterminate {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(350%);
        }
    }
</style>
