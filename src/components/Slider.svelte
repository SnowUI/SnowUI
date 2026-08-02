<!--
  Slider 滑动输入组件
  v1.1.1

  文档: ./Slider.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Text from "./Text.svelte";
    import {
        resolveSnowUIColor,
        type SnowUIColor,
    } from "../lib/color";
    import { splitFrameHostProps } from "../logic/frame-prop-filter";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    type SliderOrientation = "horizontal" | "vertical";

    interface Props extends Omit<FrameProps, "children"> {
        value?: number | number[];
        minValue?: number;
        maxValue?: number;
        step?: number;
        orientation?: SliderOrientation;
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
        showSteps = false,
        showLabel = false,
        thickness = 4,
        background = "Black4",
        color = "Primary",
        thumbColor = "StaticWhite100",
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
            `--snowui-slider-thickness: ${toCssLength(thickness)}`,
            `--snowui-slider-background: ${resolveSnowUIColor(background)}`,
            `--snowui-slider-color: ${resolveSnowUIColor(color)}`,
            `--snowui-slider-thumb-color: ${resolveSnowUIColor(thumbColor)}`,
            `--snowui-slider-label-gap: ${toFrameGap(gap)}`,
            `--snowui-slider-start: ${startPercent}%`,
            `--snowui-slider-end: ${endPercent}%`,
            `--snowui-slider-step-percent: ${stepPercent}%`,
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
            label.textContent = String(
                resolvedValues[index] ?? resolvedValues[0] ?? minValue,
            );
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
    class={["snowui-slider", userClass].filter(Boolean).join(" ")}
    style={sliderStyle}
    data-orientation={orientation}
    data-range={isRange || undefined}
    data-hairline={thickness === 1 || undefined}
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
        {#if children || showLabel}
            <div bind:this={labelsRef} class="snowui-slider-labels">
                {#if children}
                    {@render children()}
                {:else}
                    {#each resolvedValues as _, index (`label-${index}`)}
                        <Text {...parts?.Text} as="label" />
                    {/each}
                {/if}
            </div>
        {/if}

        <div class="snowui-slider-track" aria-hidden="true">
            <div class="snowui-slider-fill"></div>
        </div>

        {#each resolvedValues as resolvedValue, index}
            <div
                class="snowui-slider-thumb"
                data-index={index}
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

    :global(:where(.snowui-slider-control)) {
        position: relative;
        display: block;
        width: 100%;
        min-height: calc(var(--size-4) * 0.875);
        touch-action: none;
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
        transform: translateY(-50%)
            scaleY(var(--snowui-slider-hairline-scale, 1));
        transform-origin: center;
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
        transform: translateX(-50%)
            scaleX(var(--snowui-slider-hairline-scale, 1));
        transform-origin: center;
    }

    :global(:where(.snowui-slider[data-hairline="true"])) {
        --snowui-slider-hairline-scale: 0.5;
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

    :global(:where(.snowui-slider[data-show-steps="true"] .snowui-slider-track)) {
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

    :global(:where(.snowui-slider[data-orientation="vertical"][data-show-steps="true"] .snowui-slider-track)) {
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
            var(--snowui-slider-thumb-color, var(--static-white-100, #ffffff))
        );
        box-shadow: var(
            --snowui-slider-thumb-shadow-override,
            0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.4)
        );
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

    :global(:where(.snowui-slider:not([data-disabled="true"]):hover .snowui-slider-thumb)),
    :global(:where(.snowui-slider:focus-within .snowui-slider-thumb)),
    :global(:where(.snowui-slider[data-dragging="true"] .snowui-slider-thumb)) {
        opacity: 1;
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

    :global(:where(.snowui-slider[data-range="true"]) .snowui-slider-labels > :first-child) {
        inset-inline-start: var(--snowui-slider-start, 0%);
    }

    :global(:where(.snowui-slider:dir(rtl)) .snowui-slider-labels > *) {
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

    :global(:where(.snowui-slider:not([data-disabled="true"]):hover) .snowui-slider-labels > *) {
        opacity: 1;
    }

    @media (hover: none) {
        :global(:where(.snowui-slider-thumb)) {
            opacity: 1;
        }
    }
</style>
