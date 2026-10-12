<!-- SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Slider 滑动输入组件
  v1.4.2

  文档: ./Slider.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Text from "./Text.svelte";
    import {resolveSnowUIColor, type SnowUIColor} from "../lib/color";
    import {splitFrameHostProps} from "../logic/frame-prop-filter";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import {GENERIC_DISAPPEAR_MOTION, GENERIC_SCALE_APPEAR_MOTION} from "../motion/presets/generic";
    import {motionMsVar} from "../motion/presets/utils";
    import {MOTION_DURATION_STANDARD_APPEAR_MS, MOTION_DURATION_STANDARD_DISAPPEAR_MS, MOTION_EASING_STANDARD} from "../motion/tokens";

    type SliderOrientation = "horizontal" | "vertical";
    type SliderVariant = "default" | "solid" | "soft";

    interface Props extends Omit<FrameProps, "children"> {
        value?: number | number[];
        minValue?: number;
        maxValue?: number;
        step?: number;
        orientation?: SliderOrientation;
        variant?: SliderVariant;
        title?: string;
        showSteps?: boolean;
        showLabel?: boolean;
        thickness?: number | string;
        background?: SnowUIColor | string;
        color?: SnowUIColor | string;
        thumbColor?: SnowUIColor | string;
        disabled?: boolean;
        name?: string;
        ariaLabel?: string | string[];
        oninput?: (event: Event) => void;
        onchange?: (event: Event) => void;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Text: typeof Text }>;
        [key: string]: any;
    }

    let {
        value = $bindable(0),
        minValue = 0,
        maxValue = 100,
        step = 1,
        orientation = "horizontal",
        variant = "default",
        title = "Text",
        showSteps = false,
        showLabel = false,
        thickness = undefined,
        background = "Black4",
        color = undefined,
        thumbColor = "StaticWhite80",
        disabled = false,
        name = undefined,
        ariaLabel = undefined,
        oninput: userOnInput = undefined,
        onchange: userOnChange = undefined,
        class: userClass = "",
        style: userStyle = "",
        gap = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        parts = undefined,
        children,
        ...rest
    }: Props = $props();

    let controlRef = $state<HTMLElement>();
    let labelsRef = $state<HTMLElement>();
    let activeIndex = $state(0);
    let dragging = $state(false);

    function toCssLength(value: number | string) {
        return typeof value === "number" ? `${value}px` : value;
    }

    function toFrameGap(value: FrameProps["gap"]) {
        if (value === undefined) return "calc(var(--gap-1) / 2)";
        return typeof value === "number"
            ? `calc(var(--gap-1) * ${value})`
            : value;
    }

    function clamp(nextValue: number) {
        const minimum = Math.min(minValue, maxValue);
        const maximum = Math.max(minValue, maxValue);
        return Math.min(maximum, Math.max(minimum, nextValue));
    }

    function snap(nextValue: number) {
        if (!Number.isFinite(nextValue)) return clamp(minValue);
        if (!Number.isFinite(step) || step <= 0) return clamp(nextValue);
        const snapped =
            minValue + Math.round((nextValue - minValue) / step) * step;
        return clamp(Number(snapped.toFixed(10)));
    }

    function normalizeRange(nextValue: number | number[]) {
        const values = Array.isArray(nextValue)
            ? nextValue.slice(0, 2)
            : [nextValue];
        if (values.length < 2) values.push(values[0] ?? minValue);
        return values.map((item) => snap(Number(item))).sort((a, b) => a - b);
    }

    function toPercent(nextValue: number) {
        const range = maxValue - minValue;
        if (!Number.isFinite(range) || range === 0) return 0;
        return Math.min(
            100,
            Math.max(0, ((nextValue - minValue) / range) * 100),
        );
    }

    const splitProps = $derived.by(() => splitFrameHostProps(rest));
    const isRange = $derived(Array.isArray(value));
    const resolvedValues = $derived(
        isRange ? normalizeRange(value) : [snap(Number(value))],
    );
    const startPercent = $derived(
        isRange ? toPercent(resolvedValues[0] ?? minValue) : 0,
    );
    const endPercent = $derived(
        toPercent(resolvedValues[isRange ? 1 : 0] ?? minValue),
    );
    const stepPercent = $derived(
        Number.isFinite(step) && step > 0 && maxValue !== minValue
            ? Math.min(100, Math.abs((step / (maxValue - minValue)) * 100))
            : 100,
    );
    const isBarVariant = $derived(variant === "solid" || variant === "soft");
    const combinedRangeLabel = $derived(isBarVariant && orientation === "horizontal" && isRange && !children);
    const resolvedColor = $derived(
        color ?? (variant === "soft" ? "Black10" : "Primary"),
    );
    const barStepPositions = $derived.by(() => {
        if (
            !isBarVariant ||
            !showSteps ||
            !Number.isFinite(step) ||
            step <= 0 ||
            maxValue === minValue
        ) {
            return [];
        }

        const count = Math.floor(Math.abs((maxValue - minValue) / step));
        if (count > 100) return [];

        return Array.from({ length: count + 1 }, (_, index) =>
            Math.min(100, index * stepPercent),
        ).filter((position) => position > 0 && position < 100);
    });
    const resolvedThickness = $derived(
        thickness ?? (isBarVariant ? 32 : 4),
    );
    const barIndicatorMotionStyle = [
        `--snowui-slider-indicator-appear-duration: ${motionMsVar(GENERIC_SCALE_APPEAR_MOTION.duration, MOTION_DURATION_STANDARD_APPEAR_MS)}`,
        `--snowui-slider-indicator-appear-easing: ${GENERIC_SCALE_APPEAR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
        `--snowui-slider-indicator-disappear-duration: ${motionMsVar(GENERIC_DISAPPEAR_MOTION.duration, MOTION_DURATION_STANDARD_DISAPPEAR_MS)}`,
        `--snowui-slider-indicator-disappear-easing: ${GENERIC_DISAPPEAR_MOTION.easing ?? MOTION_EASING_STANDARD}`,
    ].join("; ");
    const resolvedAriaLabels = $derived(
        Array.isArray(ariaLabel)
            ? ariaLabel
            : [
                  ariaLabel ?? splitProps.hostProps["aria-label"],
                  ariaLabel ?? splitProps.hostProps["aria-label"],
              ],
    );
    const sliderStyle = $derived(
        [
            `--snowui-slider-thickness: ${toCssLength(resolvedThickness)}`,
            `--snowui-slider-background: ${resolveSnowUIColor(background)}`,
            `--snowui-slider-color: ${resolveSnowUIColor(resolvedColor)}`,
            `--snowui-slider-thumb-color: ${resolveSnowUIColor(thumbColor)}`,
            `--snowui-slider-label-gap: ${toFrameGap(gap)}`,
            `--snowui-slider-start: ${startPercent}%`,
            `--snowui-slider-end: ${endPercent}%`,
            `--snowui-slider-step-percent: ${stepPercent}%`,
            isBarVariant ? barIndicatorMotionStyle : "",
            userStyle,
        ]
            .filter(Boolean)
            .join("; "),
    );

    $effect(() => {
        if (!labelsRef) return;
        const labels = Array.from(labelsRef.children) as HTMLElement[];
        labels.forEach((label, index) => {
            if (
                label.dataset.snowuiSliderAutoLabel !== "true" &&
                label.textContent?.trim()
            ) {
                return;
            }
            label.dataset.snowuiSliderAutoLabel = "true";
            const resolvedValue =
                resolvedValues[index] ?? resolvedValues[0] ?? minValue;
            label.textContent = combinedRangeLabel
                ? resolvedValues.map(item => `${Math.round(toPercent(item))}%`).join("–")
                : isBarVariant
                    ? `${Math.round(toPercent(resolvedValue))}%`
                    : String(resolvedValue);
        });
    });

    function commitValue(index: number, nextValue: number) {
        const next = snap(nextValue);
        if (!isRange) {
            value = next;
            return;
        }

        const nextRange = [...resolvedValues];
        nextRange[index] = next;
        value = normalizeRange(nextRange);
        activeIndex = nextRange[0] <= nextRange[1] ? index : index === 0 ? 1 : 0;
    }

    function handleInput(event: Event, index: number) {
        const input = event.currentTarget as HTMLInputElement;
        commitValue(index, Number(input.value));
        userOnInput?.(event);
    }

    function handleChange(event: Event) {
        userOnChange?.(event);
    }

    function valueFromPointer(event: PointerEvent) {
        if (!controlRef) return minValue;
        const rect = controlRef.getBoundingClientRect();
        const ratio =
            orientation === "vertical"
                ? (rect.bottom - event.clientY) / rect.height
                : (event.clientX - rect.left) / rect.width;
        const direction =
            orientation === "horizontal" &&
            getComputedStyle(controlRef).direction === "rtl"
                ? 1 - ratio
                : ratio;
        return snap(minValue + Math.min(1, Math.max(0, direction)) * (maxValue - minValue));
    }

    function nearestThumbIndex(nextValue: number) {
        if (!isRange) return 0;
        return Math.abs(nextValue - resolvedValues[0]) <=
            Math.abs(nextValue - resolvedValues[1])
            ? 0
            : 1;
    }

    function handlePointerDown(event: PointerEvent) {
        if (disabled || event.button !== 0) return;
        const nextValue = valueFromPointer(event);
        activeIndex = nearestThumbIndex(nextValue);
        dragging = true;
        controlRef?.setPointerCapture(event.pointerId);
        controlRef
            ?.querySelectorAll<HTMLInputElement>(".snowui-slider-input")
            [activeIndex]?.focus();
        commitValue(activeIndex, nextValue);
        userOnInput?.(event);
    }

    function handlePointerMove(event: PointerEvent) {
        if (!dragging || disabled) return;
        commitValue(activeIndex, valueFromPointer(event));
        userOnInput?.(event);
    }

    function handlePointerUp(event: PointerEvent) {
        if (!dragging) return;
        dragging = false;
        if (controlRef?.hasPointerCapture(event.pointerId)) {
            controlRef.releasePointerCapture(event.pointerId);
        }
        userOnChange?.(event);
    }
</script>

<Frame
    class={[
        "snowui-slider",
        isBarVariant ? "snowui-slider-bar" : "",
        variant === "solid" ? "snowui-slider-solid" : "",
        variant === "soft" ? "snowui-slider-soft" : "",
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    style={sliderStyle}
    data-orientation={orientation}
    data-variant={variant}
    data-range={isRange || undefined}
    data-show-steps={showSteps || undefined}
    data-dragging={dragging || undefined}
    data-disabled={disabled ? "true" : undefined}
    {disabled}
    {gap}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    {...splitProps.frameProps}
>
    <div
        bind:this={controlRef}
        class="snowui-slider-control"
        role="group"
        onpointerdown={handlePointerDown}
        onpointermove={handlePointerMove}
        onpointerup={handlePointerUp}
        onpointercancel={handlePointerUp}
    >
        {#if isBarVariant && title}
            <Text class="snowui-slider-title">{title}</Text>
        {/if}

        {#if children || showLabel}
            <div bind:this={labelsRef} class="snowui-slider-labels">
                {#if children}
                    {@render children()}
                {:else}
                    {#each (combinedRangeLabel ? [resolvedValues[0]] : resolvedValues) as _, index (`label-${index}`)}
                        <Text {...parts?.Text} as="label" />
                    {/each}
                {/if}
            </div>
        {/if}

        <div class="snowui-slider-track" aria-hidden="true">
            <div class="snowui-slider-fill"></div>
        </div>

        {#if isBarVariant && showSteps}
            <div class="snowui-slider-step-markers" aria-hidden="true">
                {#each barStepPositions as position}
                    <span
                        style={`--snowui-slider-step-position: ${position}%`}
                    ></span>
                {/each}
            </div>
        {/if}

        {#each resolvedValues as resolvedValue, index}
            <div
                class="snowui-slider-thumb"
                data-index={index}
                data-at-start={toPercent(resolvedValue) <= 0 || undefined}
                aria-hidden="true"
                style={`--snowui-slider-thumb-position: ${toPercent(resolvedValue)}%`}
            ></div>
            <input
                {...splitProps.hostProps}
                class="snowui-slider-input"
                type="range"
                value={resolvedValue}
                min={Math.min(minValue, maxValue)}
                max={Math.max(minValue, maxValue)}
                {step}
                {name}
                {disabled}
                id={isRange && splitProps.hostProps.id
                    ? `${splitProps.hostProps.id}-${index}`
                    : splitProps.hostProps.id}
                aria-label={resolvedAriaLabels[index]}
                data-index={index}
                tabindex={disabled ? -1 : 0}
                oninput={(event) => handleInput(event, index)}
                onchange={handleChange}
            />
        {/each}
    </div>
</Frame>

<style>
    :global(:where(.snowui-slider)) {
        position: relative;
        box-sizing: border-box;
        display: inline-flex;
        width: 100%;
        min-width: 0;
        vertical-align: middle;
        cursor: var(--snowui-state-cursor, pointer);
        user-select: none;
    }

    :global(:where(.snowui-slider[data-orientation="vertical"])) {
        width: auto;
        height: 100%;
        min-height: 0;
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"])) {
        height: var(
            --snowui-slider-thickness-override,
            var(--snowui-slider-thickness, var(--size-8))
        );
        min-height: var(
            --snowui-slider-thickness-override,
            var(--snowui-slider-thickness, var(--size-8))
        );
        overflow: hidden;
        border-radius: var(
            --snowui-slider-bar-radius-override,
            var(--radius-2)
        );
        background-color: var(
            --snowui-slider-background-override,
            var(--snowui-slider-background, var(--black-4, #0000000a))
        );
    }

    :global(:where(.snowui-slider-soft)) {
        --snowui-slider-covered-foreground: var(--black-100, #000000);
        --snowui-slider-indicator-foreground: var(--black-100, #000000);
    }

    :global(:where(.snowui-slider-control)) {
        position: relative;
        display: block;
        width: 100%;
        min-height: calc(var(--size-4) * 0.875);
        touch-action: none;
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"] .snowui-slider-control)) {
        height: 100%;
        min-height: 0;
    }

    :global(:where(.snowui-slider[data-orientation="vertical"] .snowui-slider-control)) {
        width: var(--size-5);
        height: 100%;
    }

    :global(:where(.snowui-slider-track)) {
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        display: block;
        height: var(
            --snowui-slider-thickness-override,
            var(--snowui-slider-thickness, calc(var(--size-4) / 4))
        );
        overflow: hidden;
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-slider-background-override,
            var(--snowui-slider-background, var(--black-4, #0000000a))
        );
        transform: translateY(-50%);
    }

    :global(:where(.snowui-slider[data-orientation="vertical"] .snowui-slider-track)) {
        top: 0;
        right: auto;
        bottom: 0;
        left: 50%;
        width: var(
            --snowui-slider-thickness-override,
            var(--snowui-slider-thickness, calc(var(--size-4) / 4))
        );
        height: auto;
        transform: translateX(-50%);
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"] .snowui-slider-track)) {
        inset: 0;
        height: 100%;
        border-radius: var(
            --snowui-slider-bar-radius-override,
            var(--radius-2)
        );
        transform: none;
    }

    :global(:where(.snowui-slider-fill)) {
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-start: var(--snowui-slider-start, 0%);
        display: block;
        width: calc(var(--snowui-slider-end, 0%) - var(--snowui-slider-start, 0%));
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-slider-color-override,
            var(--snowui-slider-color, var(--primary, #000000))
        );
    }

    :global(:where(.snowui-slider[data-orientation="vertical"] .snowui-slider-fill)) {
        top: auto;
        right: 0;
        bottom: var(--snowui-slider-start, 0%);
        left: 0;
        width: auto;
        height: calc(var(--snowui-slider-end, 0%) - var(--snowui-slider-start, 0%));
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"] .snowui-slider-fill)) {
        border-radius: var(
            --snowui-slider-bar-radius-override,
            var(--radius-2)
        );
    }

    :global(:where(.snowui-slider:not(.snowui-slider-bar)[data-show-steps="true"] .snowui-slider-track)) {
        mask-image:
            linear-gradient(
                to right,
                transparent calc(100% - 1px),
                #000 calc(100% - 1px)
            ),
            repeating-linear-gradient(
                to right,
                #000 0 calc(var(--snowui-slider-step-percent) - 1px),
                transparent calc(var(--snowui-slider-step-percent) - 1px)
                    var(--snowui-slider-step-percent)
            );
    }

    :global(:where(.snowui-slider:not(.snowui-slider-bar)[data-orientation="vertical"][data-show-steps="true"] .snowui-slider-track)) {
        mask-image:
            linear-gradient(
                to top,
                transparent calc(100% - 1px),
                #000 calc(100% - 1px)
            ),
            repeating-linear-gradient(
                to top,
                #000 0 calc(var(--snowui-slider-step-percent) - 1px),
                transparent calc(var(--snowui-slider-step-percent) - 1px)
                    var(--snowui-slider-step-percent)
            );
    }

    :global(:where(.snowui-slider-thumb)) {
        position: absolute;
        top: 50%;
        inset-inline-start: var(--snowui-slider-thumb-position);
        z-index: 2;
        display: block;
        width: var(--size-5);
        height: calc(var(--size-4) * 0.875);
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-slider-thumb-color-override,
            var(--snowui-slider-thumb-color, var(--static-white-80, #ffffffcc))
        );
        box-shadow:
            inset 0 0 0 var(--border-1) var(--static-white-100, #ffffff),
            var(
                --snowui-slider-thumb-shadow-override,
                0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.4)
            );
        backdrop-filter: blur(calc(var(--size-4) / 8));
        -webkit-backdrop-filter: blur(calc(var(--size-4) / 8));
        opacity: 0;
        transform: translate(-50%, -50%);
        transition:
            opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
        pointer-events: none;
    }

    :global(:where(.snowui-slider[data-orientation="vertical"] .snowui-slider-thumb)) {
        top: auto;
        bottom: var(--snowui-slider-thumb-position);
        left: 50%;
        transform: translate(-50%, 50%);
        transition:
            opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"] .snowui-slider-thumb)) {
        inset-inline-start: max(
            var(--padding-1),
            calc(var(--snowui-slider-thumb-position) - var(--padding-1))
        );
        z-index: 4;
        width: calc(var(--size-4) / 8);
        height: calc(var(--size-4) / 2);
        border-radius: var(--radius-full);
        background-color: var(
            --snowui-slider-indicator-foreground,
            var(--static-white-100, #ffffff)
        );
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5, 0.5);
        transform-origin: center center;
        transition:
            opacity
                var(--snowui-slider-indicator-disappear-duration, 0.15s)
                var(
                    --snowui-slider-indicator-disappear-easing,
                    cubic-bezier(0.22, 1, 0.36, 1)
                ),
            transform
                var(--snowui-slider-indicator-disappear-duration, 0.15s)
                var(
                    --snowui-slider-indicator-disappear-easing,
                    cubic-bezier(0.22, 1, 0.36, 1)
                );
    }

    /* 区间标识向填充内部偏移，并始终保留轨道两端的标准留白。 */
    :global(:where(.snowui-slider-bar[data-orientation="horizontal"][data-range="true"] .snowui-slider-thumb)) {
        --snowui-slider-range-inset: min(var(--padding-1), calc((var(--snowui-slider-end) - var(--snowui-slider-start)) / 2));
        inset-inline-start: clamp(var(--padding-1), calc(var(--snowui-slider-thumb-position) - var(--snowui-slider-range-inset)), calc(100% - var(--padding-1)));
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"][data-range="true"] .snowui-slider-thumb[data-index="0"])) {
        inset-inline-start: clamp(var(--padding-1), calc(var(--snowui-slider-thumb-position) + var(--snowui-slider-range-inset)), calc(100% - var(--padding-1)));
    }

    :global(:where(.snowui-slider-solid[data-orientation="horizontal"] .snowui-slider-thumb[data-at-start="true"])) {
        background-color: var(--black-40, #00000066);
    }

    :global(:where(.snowui-slider:not([data-disabled="true"]):hover .snowui-slider-thumb)),
    :global(:where(.snowui-slider:focus-within .snowui-slider-thumb)),
    :global(:where(.snowui-slider[data-dragging="true"] .snowui-slider-thumb)) {
        opacity: 1;
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"]:not([data-disabled="true"]):hover .snowui-slider-thumb)),
    :global(:where(.snowui-slider-bar[data-orientation="horizontal"]:focus-within .snowui-slider-thumb)),
    :global(:where(.snowui-slider-bar[data-orientation="horizontal"][data-dragging="true"] .snowui-slider-thumb)) {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1, 1);
        transition-duration: var(
            --snowui-slider-indicator-appear-duration,
            0.25s
        );
        transition-timing-function: var(
            --snowui-slider-indicator-appear-easing,
            cubic-bezier(0.22, 1, 0.36, 1)
        );
    }

    :global(:where(.snowui-slider-input)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        pointer-events: none;
    }

    :global(:where(.snowui-slider[data-orientation="vertical"] .snowui-slider-input)) {
        writing-mode: vertical-lr;
        direction: rtl;
    }

    :global(:where(.snowui-slider-labels)) {
        position: absolute;
        inset: 0;
        z-index: 3;
        display: block;
        pointer-events: none;
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"] .snowui-slider-labels)) {
        inset: 0;
        z-index: 3;
        min-width: 0;
        overflow: hidden;
    }

    :global(:where(.snowui-slider) .snowui-slider-labels > *) {
        position: absolute;
        bottom: calc(
            50% + (var(--size-4) * 0.875) / 2 +
                var(
                    --snowui-slider-label-gap-override,
                    var(--snowui-slider-label-gap, calc(var(--gap-1) / 2))
                )
        );
        inset-inline-start: var(--snowui-slider-end, 0%);
        opacity: 0;
        font-size: var(--text-12);
        line-height: var(--leading-12);
        translate: -50% 0;
        transition:
            opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"]) .snowui-slider-labels > *) {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        height: 100%;
        padding-inline: var(--padding-2);
        overflow: hidden;
        opacity: 0.4;
        color: transparent;
        background-image: linear-gradient(
            to right,
            var(
                    --snowui-slider-covered-foreground,
                    var(--static-white-100, #ffffff)
                )
                0
                var(--snowui-slider-end, 0%),
            var(--black-100, #000000) var(--snowui-slider-end, 0%) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-overflow: ellipsis;
        white-space: nowrap;
        translate: none;
        transition: opacity
            var(--snowui-frame-color-motion-duration, 0.15s)
            var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-slider-bar[data-orientation="horizontal"]:dir(rtl)) .snowui-slider-labels > *) {
        background-image: linear-gradient(
            to left,
            var(
                    --snowui-slider-covered-foreground,
                    var(--static-white-100, #ffffff)
                )
                0
                var(--snowui-slider-end, 0%),
            var(--black-100, #000000) var(--snowui-slider-end, 0%) 100%
        );
    }

    :global(:where(.snowui-slider:not(.snowui-slider-bar)[data-range="true"]) .snowui-slider-labels > :first-child) {
        inset-inline-start: var(--snowui-slider-start, 0%);
    }

    :global(:where(.snowui-slider:not(.snowui-slider-bar):dir(rtl)) .snowui-slider-labels > *) {
        translate: 50% 0;
    }

    :global(:where(.snowui-slider[data-orientation="vertical"]) .snowui-slider-labels > *) {
        right: calc(
            50% + var(--size-5) / 2 + var(--size-4) / 8 +
                var(
                    --snowui-slider-label-gap-override,
                    var(--snowui-slider-label-gap, calc(var(--gap-1) / 2))
                )
        );
        bottom: var(--snowui-slider-end, 0%);
        left: auto;
        inset-inline-start: auto;
        width: max-content;
        max-width: none;
        text-align: right;
        translate: 0 50%;
        transition:
            opacity
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-slider[data-orientation="vertical"][data-range="true"]) .snowui-slider-labels > :first-child) {
        bottom: var(--snowui-slider-start, 0%);
    }

    :global(:where(.snowui-slider:not(.snowui-slider-bar):not([data-disabled="true"]):hover) .snowui-slider-labels > *) {
        opacity: 1;
    }

    :global(:where(.snowui-slider-title)) {
        position: absolute;
        inset: 0;
        z-index: 3;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-inline: var(--padding-2);
        overflow: hidden;
        color: transparent;
        background-image: linear-gradient(
            to right,
            var(
                    --snowui-slider-covered-foreground,
                    var(--static-white-100, #ffffff)
                )
                0
                var(--snowui-slider-end, 0%),
            var(--black-100, #000000) var(--snowui-slider-end, 0%) 100%
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: var(--text-12);
        line-height: var(--leading-12);
        text-overflow: ellipsis;
        white-space: nowrap;
        pointer-events: none;
    }

    :global(:where(.snowui-slider-bar:dir(rtl) .snowui-slider-title)) {
        background-image: linear-gradient(
            to left,
            var(
                    --snowui-slider-covered-foreground,
                    var(--static-white-100, #ffffff)
                )
                0
                var(--snowui-slider-end, 0%),
            var(--black-100, #000000) var(--snowui-slider-end, 0%) 100%
        );
    }

    :global(:where(.snowui-slider-bar:not([data-disabled="true"]):hover) .snowui-slider-labels > *),
    :global(:where(.snowui-slider-bar:focus-within) .snowui-slider-labels > *),
    :global(:where(.snowui-slider-bar[data-dragging="true"]) .snowui-slider-labels > *) {
        opacity: 0.8;
    }

    :global(:where(.snowui-slider-step-markers)) {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
    }

    :global(:where(.snowui-slider-step-markers > span)) {
        position: absolute;
        top: 50%;
        inset-inline-start: var(--snowui-slider-step-position);
        width: calc(var(--size-4) / 8);
        height: calc(var(--size-4) / 8);
        border-radius: var(--radius-full);
        background-color: var(--black-10, #0000001a);
        transform: translate(-50%, -50%);
    }

    @media (hover: none) {
        :global(:where(.snowui-slider:not(.snowui-slider-bar) .snowui-slider-thumb)) {
            opacity: 1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-slider-bar .snowui-slider-thumb)) {
            transform: translate(-50%, -50%) scale(1, 1);
            transition: none;
        }
    }
</style>
