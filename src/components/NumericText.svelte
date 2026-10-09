<!--
  NumericText 文字与数字过渡动效组件
  v1.7.1

  职责：提供 SwiftUI numericText 风格的单行动效文本。
  内容标准化、字符 diff、节点重组与区段 FLIP 复用 text-motion 公共能力。
  组件只保留垂直位移 + 模糊 + 透明度的字符出现 / 消失视觉。
  文档：./NumericText.md
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { TextMotionTrend } from "../lib/text-motion/types";

    export type NumericTextValue = string | number;
    export type NumericTextTrend = TextMotionTrend;
    export type NumericTextDirection = "normal" | "reverse";
</script>

<script lang="ts">
    import type { SnowUIColor } from "../lib/color";
    import type { FrameProps } from "../logic/frame-types";
    import {
        registerTextMotionCharacterElement,
        TEXT_MOTION_CHARACTER_TAG,
        type TextMotionCharacterAnimationContext,
        type TextMotionCharacterElement,
    } from "../lib/text-motion/character";
    import { createTextMotionFormatter } from "../lib/text-motion/format";
    import {
        TEXT_MOTION_LAYOUT_TRANSITION,
        type TextMotionTransition,
    } from "../lib/text-motion/layout";
    import { resolveTextMotionTrend } from "../lib/text-motion/numeric";
    import {
        DEFAULT_TEXT_MOTION_COLOR,
        type TextMotionAlign,
        type TextMotionColor,
        type TextMotionRole,
    } from "../lib/text-motion/types";
    import {
        createTextMotionTypographyStyle,
        resolveTextMotionColor,
    } from "../lib/text-motion/typography";
    import FramePro from "./FramePro.svelte";

    registerTextMotionCharacterElement();

    const NUMERIC_TEXT_CHARACTER_OFFSET_EM = 0.35;
    const NUMERIC_TEXT_CHARACTER_SCALE = 0.6;
    const NUMERIC_TEXT_CHARACTER_BLUR_EM = 0.1;
    const NUMERIC_TEXT_CHARACTER_ROTATE_DEG = 2;
    const NUMERIC_TEXT_MOTION_DURATION = 550;

    const replacementCleanups = new WeakMap<HTMLElement, () => void>();

    function animateNumericTextCharacter({
        element,
        isOut,
        trend,
        delay,
        duration,
        easing,
        label,
        previousLabel,
        onCleanup,
    }: TextMotionCharacterAnimationContext) {
        const direction = isOut ? -1 : 1;
        const transform = `translateY(${direction * trend * NUMERIC_TEXT_CHARACTER_OFFSET_EM}em) scale(${NUMERIC_TEXT_CHARACTER_SCALE}) rotateZ(${NUMERIC_TEXT_CHARACTER_ROTATE_DEG}deg)`;
        const blur = `blur(${NUMERIC_TEXT_CHARACTER_BLUR_EM}em)`;

        if (!isOut && previousLabel !== undefined && previousLabel !== label) {
            replacementCleanups.get(element)?.();
            const motionId = String(
                Number(element.dataset.numericTextMotionId ?? "0") + 1,
            );
            element.dataset.numericTextMotionId = motionId;

            const sizer = document.createElement("span");
            sizer.textContent = label;
            sizer.style.display = "inline-block";
            sizer.style.visibility = "hidden";
            sizer.style.whiteSpace = "pre";
            sizer.style.font = "inherit";
            sizer.style.lineHeight = "inherit";

            const oldFace = document.createElement("span");
            oldFace.textContent = previousLabel;
            const newFace = document.createElement("span");
            newFace.textContent = label;
            for (const face of [oldFace, newFace]) {
                face.style.position = "absolute";
                face.style.inset = "0";
                face.style.display = "inline-flex";
                face.style.alignItems = "center";
                face.style.justifyContent = "center";
                face.style.whiteSpace = "pre";
                face.style.font = "inherit";
                face.style.color = "inherit";
                face.style.lineHeight = "inherit";
                face.style.fontVariantNumeric = "inherit";
                face.style.transformOrigin = "50% 50%";
                face.style.willChange = "transform, opacity, filter";
            }

            element.textContent = "";
            element.style.position = "relative";
            element.style.display = "inline-block";
            element.append(sizer, oldFace, newFace);

            const exitTransform = `translateY(${-trend * NUMERIC_TEXT_CHARACTER_OFFSET_EM}em) scale(${NUMERIC_TEXT_CHARACTER_SCALE}) rotateZ(${NUMERIC_TEXT_CHARACTER_ROTATE_DEG}deg)`;
            const enterTransform = `translateY(${trend * NUMERIC_TEXT_CHARACTER_OFFSET_EM}em) scale(${NUMERIC_TEXT_CHARACTER_SCALE}) rotateZ(${NUMERIC_TEXT_CHARACTER_ROTATE_DEG}deg)`;
            const oldAnimation = oldFace.animate(
                {
                    opacity: [1, 0],
                    transform: ["", exitTransform],
                    filter: ["", blur],
                },
                { duration, easing, fill: "both", delay },
            );
            const animation = newFace.animate(
                {
                    opacity: [0, 1],
                    transform: [enterTransform, ""],
                    filter: [blur, ""],
                },
                { duration, easing, fill: "both", delay },
            );
            let timer: number;
            const dispose = () => {
                window.clearTimeout(timer);
                animation.removeEventListener("finish", cleanup);
                animation.removeEventListener("cancel", cleanup);
                oldAnimation.cancel();
                animation.cancel();
                release();
                replacementCleanups.delete(element);
            };
            const cleanup = () => {
                dispose();
                if (element.dataset.numericTextMotionId !== motionId) return;
                delete element.dataset.numericTextMotionId;
                element.textContent = label;
                element.style.position = "";
                element.style.display = "";
            };
            const release = onCleanup(dispose);
            replacementCleanups.set(element, dispose);
            animation.addEventListener("finish", cleanup, { once: true });
            animation.addEventListener("cancel", cleanup, { once: true });
            timer = window.setTimeout(cleanup, delay + duration + 50);
            return animation;
        }

        return element.animate(
            {
                opacity: isOut ? 0 : [0, 1],
                transform: isOut ? transform : [transform, ""],
                filter: isOut ? blur : [blur, ""],
            },
            { duration, easing, fill: "both", delay },
        );
    }

    interface Props extends Omit<FrameProps, "children"> {
        value?: NumericTextValue;
        locales?: string;
        format?: Intl.NumberFormatOptions;
        animated?: boolean;
        trend?: NumericTextTrend;
        direction?: NumericTextDirection;
        motionRole?: TextMotionRole;
        transition?: Partial<TextMotionTransition>;
        respectMotionPreference?: boolean;
        font?: string;
        size?: string | number;
        weight?: string | number;
        lineHeight?: string | number;
        color?: SnowUIColor | string;
        align?: TextMotionAlign;
        motionColor?: TextMotionColor;
        [key: string]: any;
    }

    let {
        value = "",
        locales = "en-US",
        format = undefined,
        animated = true,
        trend = 0,
        direction = "normal",
        motionRole = "auto",
        transition = undefined,
        respectMotionPreference = true,
        font = undefined,
        size = undefined,
        weight = undefined,
        lineHeight = undefined,
        color = undefined,
        align = undefined,
        motionColor = DEFAULT_TEXT_MOTION_COLOR,
        tag = "span",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        class: userClass = "",
        style: userStyle = "",
        ...rest
    }: Props = $props();

    let hasMounted = false;
    let previousDisplayValue = "";
    let numericElement = $state<TextMotionCharacterElement | undefined>();

    const formatValue = $derived(createTextMotionFormatter(locales, format));
    const displayValue = $derived(formatValue(value));
    const numericVariant = $derived(
        motionRole === "number" ||
            motionRole === "timer" ||
            motionRole === "countdown" ||
            (motionRole === "auto" && !/[A-Za-z\p{L}]/u.test(displayValue))
            ? "tabular"
            : "normal",
    );
    const rootStyle = $derived(
        createTextMotionTypographyStyle(
            "numeric-text",
            { font, size, weight, lineHeight, color, align, motionColor },
            userStyle,
        ),
    );
    const numericTextLayoutTransition = $derived({
        ...TEXT_MOTION_LAYOUT_TRANSITION,
        ...transition,
        duration:
            transition?.layoutDuration ??
            TEXT_MOTION_LAYOUT_TRANSITION.duration,
    });
    const numericTextMotionDuration = $derived(
        transition?.duration ?? NUMERIC_TEXT_MOTION_DURATION,
    );
    const resolvedNumericTextTrend = $derived.by(() => {
        const autoTrend = resolveTextMotionTrend(
            previousDisplayValue,
            displayValue,
            trend,
            motionRole,
        ).trend;
        const baseTrend = autoTrend || 1;
        if (direction === "reverse") return (-baseTrend) as NumericTextTrend;
        return baseTrend;
    });

    $effect(() => {
        if (!numericElement) return;
        numericElement.setOptions({
            trend: resolvedNumericTextTrend,
            motionRole,
            transition: numericTextLayoutTransition,
            motionDuration: numericTextMotionDuration,
            colorAllCharacters: true,
            respectMotionPreference,
            motionColor:
                typeof motionColor === "function"
                    ? motionColor
                    : resolveTextMotionColor(motionColor),
            animator: animateNumericTextCharacter,
        });
        numericElement.update(displayValue, hasMounted && animated);
        previousDisplayValue = displayValue;
        hasMounted = true;
    });
</script>

<FramePro
    {tag}
    class={`snowui-numeric-text${userClass ? ` ${userClass}` : ""}`}
    style={rootStyle}
    data-align={align}
    data-numeric-variant={numericVariant}
    role="img"
    aria-label={displayValue}
    enableAutoLayout={false}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? `calc(${Math.max(1, Array.from(displayValue).length)}ch + 0.5rem)`,
        height: rest.renderHints?.height ?? "1.25rem",
        radius: rest.renderHints?.radius,
        rows: rest.renderHints?.rows,
    }}
>
    <svelte:element
        this={TEXT_MOTION_CHARACTER_TAG}
        bind:this={numericElement}
        class="snowui-numeric-text-element"
        role="img"
        aria-label={displayValue}
    >
        {displayValue}
    </svelte:element>
</FramePro>

<style>
    :global(:where(.snowui-numeric-text)) {
        display: inline-flex;
        max-width: 100%;
        min-width: 0;
        font-family: var(--snowui-numeric-text-font, inherit);
        font-size: var(--snowui-numeric-text-size, inherit);
        font-weight: var(--snowui-numeric-text-weight, inherit);
        color: var(--snowui-numeric-text-color, inherit);
        line-height: var(--snowui-numeric-text-line-height, inherit);
        font-variant-numeric: normal;
        letter-spacing: inherit;
        white-space: nowrap;
        vertical-align: baseline;
        justify-content: flex-start;
        text-align: var(--snowui-numeric-text-align, inherit);
    }

    :global(:where(.snowui-numeric-text[data-align="center"])) {
        justify-content: center;
        text-align: center;
    }

    :global(:where(.snowui-numeric-text[data-align="right"])) {
        justify-content: flex-end;
        text-align: right;
    }

    :global(:where(.snowui-numeric-text[data-align="justify"])) {
        justify-content: stretch;
        text-align: justify;
    }

    :global(:where(.snowui-numeric-text-element)) {
        font: inherit;
        color: inherit;
        line-height: inherit;
        font-variant-numeric: inherit;
        letter-spacing: inherit;
    }

    :global(:where(.snowui-numeric-text[data-numeric-variant="tabular"])) {
        font-variant-numeric: tabular-nums;
    }
</style>
