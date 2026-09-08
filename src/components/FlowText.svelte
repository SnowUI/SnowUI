<!--
  FlowText unified flowing text motion.
  Character recomposition is shared; this component only owns the
  number-flow vertical digit flow and AnimatePresence opacity visual.
-->

<script module lang="ts">
    import type { TextMotionTrend } from "../lib/text-motion/types";

    export type FlowTextValue = string | number;
    export type FlowTextTrend = TextMotionTrend;
    export type FlowTextRollDirection = "normal" | "reverse";
    export interface FlowTextTransition {
        duration?: number;
        layoutDuration?: number;
        opacityDuration?: number;
        deformDuration?: number;
        stagger?: number;
        easing?: string;
        deformEasing?: string;
    }
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import { Skeleton } from "@snowui-design-system/components";
    import { getSkeleton } from "@snowui-design-system/components/context";
    import type { SnowUIColor } from "@snowui-design-system/components/lib/color";
    import type {
        FrameProps,
        RenderHints,
    } from "@snowui-design-system/components/logic/frame-types";
    import {
        registerTextMotionCharacterElement,
        TEXT_MOTION_CHARACTER_TAG,
        type TextMotionCharacterAnimationContext,
        type TextMotionCharacterElement,
    } from "../lib/text-motion/character";
    import { formatTextMotionValue } from "../lib/text-motion/format";
    import type { TextMotionTransition } from "../lib/text-motion/layout";
    import {
        extractTextMotionNumber,
        mapDigitToSignedAxis,
        resolveTextMotionModuloTrend,
        resolveTextMotionTrend,
    } from "../lib/text-motion/numeric";
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

    const FLOW_TEXT_LAYOUT_TRANSITION: TextMotionTransition = {
        duration: 900,
        easing: "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)",
    };
    const FLOW_TEXT_MOTION_DURATION = 900;
    const FLOW_TEXT_OPACITY_DURATION = 450;
    const FLOW_TEXT_DEFORM_DURATION = 100;
    const FLOW_TEXT_DEFORM_EASING = "linear";
    const FLOW_TEXT_STAGGER = 25;
    const FLOW_TEXT_EDGE_SCALE_Y = 1;
    const FLOW_TEXT_CHARACTER_GLYPH_CLASS = "snowui-flow-text-character-glyph";
    const FLOW_TEXT_CHARACTER_SOURCE_CLASS =
        "snowui-flow-text-character-source";
    const FLOW_TEXT_CHARACTER_VIEWPORT_CLASS =
        "snowui-flow-text-character-viewport";
    const FLOW_TEXT_Y_VAR = "--snowui-flow-text-y";
    const FLOW_TEXT_SCALE_Y_VAR = "--snowui-flow-text-scale-y";
    const FLOW_TEXT_WHEEL_VALUE_VAR = "--snowui-flow-text-wheel-v";
    const FLOW_TEXT_WHEEL_CURRENT_VAR = "--snowui-flow-text-wheel-current";
    const FLOW_TEXT_WHEEL_LENGTH_VAR = "--snowui-flow-text-wheel-length";
    const FLOW_TEXT_WHEEL_DIR_VAR = "--snowui-flow-text-wheel-dir";
    const FLOW_TEXT_WHEEL_N_VAR = "--snowui-flow-text-wheel-n";
    const FLOW_TEXT_WHEEL_C_VAR = "--snowui-flow-text-wheel-c";
    const FLOW_TEXT_WHEEL_CLASS = "snowui-flow-text-wheel";
    const FLOW_TEXT_WHEEL_DIGIT_CLASS = "snowui-flow-text-wheel-digit";
    const FLOW_TEXT_MASK_IMAGE =
        "linear-gradient(to right, transparent 0, black var(--snowui-flow-text-mask-width), black calc(100% - var(--snowui-flow-text-mask-width)), transparent 100%), linear-gradient(to bottom, transparent 0, black var(--snowui-flow-text-mask-height), black calc(100% - var(--snowui-flow-text-mask-height)), transparent 100%), radial-gradient(at bottom right, black 0, transparent 71%), radial-gradient(at bottom left, black 0, transparent 71%), radial-gradient(at top left, black 0, transparent 71%), radial-gradient(at top right, black 0, transparent 71%)";
    const FLOW_TEXT_MASK_SIZE =
        "100% calc(100% - var(--snowui-flow-text-mask-height) * 2), calc(100% - var(--snowui-flow-text-mask-width) * 2) 100%, var(--snowui-flow-text-mask-width) var(--snowui-flow-text-mask-height), var(--snowui-flow-text-mask-width) var(--snowui-flow-text-mask-height), var(--snowui-flow-text-mask-width) var(--snowui-flow-text-mask-height), var(--snowui-flow-text-mask-width) var(--snowui-flow-text-mask-height)";
    const FLOW_TEXT_MASK_POSITION =
        "center, center, top left, top right, bottom right, bottom left";
    let flowTextMotionPropertiesRegistered = false;
    interface FlowTextWheelState {
        currentDigit: number | null;
        currentWheelValue: number | null;
        currentLength: number;
        previousRawValue: number | null;
        axisDirection: -1 | 1;
        axisOffset: number;
    }
    interface FlowTextWheelRuntime {
        cancel: () => void;
    }
    interface FlowTextGlyphRuntime {
        cancel: () => void;
    }
    const flowTextWheelStates = new WeakMap<HTMLElement, FlowTextWheelState>();
    const flowTextWheelRuntimes = new WeakMap<
        HTMLElement,
        FlowTextWheelRuntime
    >();
    const flowTextGlyphRuntimes = new WeakMap<
        HTMLElement,
        FlowTextGlyphRuntime
    >();

    function registerFlowTextMotionProperties() {
        if (
            flowTextMotionPropertiesRegistered ||
            typeof CSS === "undefined" ||
            typeof CSS.registerProperty !== "function"
        ) {
            return;
        }
        flowTextMotionPropertiesRegistered = true;
        try {
            CSS.registerProperty({
                name: FLOW_TEXT_Y_VAR,
                syntax: "<length-percentage>",
                inherits: false,
                initialValue: "0%",
            });
        } catch {
            // The property may already be registered by another FlowText instance.
        }
        try {
            CSS.registerProperty({
                name: FLOW_TEXT_SCALE_Y_VAR,
                syntax: "<number>",
                inherits: false,
                initialValue: "1",
            });
        } catch {
            // The property may already be registered by another FlowText instance.
        }
        try {
            CSS.registerProperty({
                name: FLOW_TEXT_WHEEL_VALUE_VAR,
                syntax: "<number>",
                inherits: true,
                initialValue: "0",
            });
        } catch {
            // The property may already be registered by another FlowText instance.
        }
    }

    function isFlowTextNumericContent(value: string) {
        const withoutClock = value.replace(/\d+(?:[:：]\d+){1,}/g, "");
        const withoutNumbers = withoutClock.replace(
            /[-+]?[\d,，]+(?:[.．]\d+)?|[-+]?[.．]\d+/g,
            "",
        );
        return !/[A-Za-z\p{L}]/u.test(withoutNumbers);
    }

    interface Props extends Omit<FrameProps, "children"> {
        value: FlowTextValue;
        locales?: string;
        format?: Intl.NumberFormatOptions;
        trend?: FlowTextTrend;
        motionRole?: TextMotionRole;
        transition?: FlowTextTransition;
        digits?: Record<number, { max?: number }>;
        textPosition?: "left" | "right";
        rollDirection?: FlowTextRollDirection;
        loading?: boolean;
        skeleton?: boolean;
        renderHints?: RenderHints;
        respectMotionPreference?: boolean;
        font?: string;
        size?: string | number;
        weight?: string | number;
        lineHeight?: string | number;
        color?: SnowUIColor | string;
        align?: TextMotionAlign;
        motionColor?: TextMotionColor;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        value,
        locales = "en-US",
        format = undefined,
        trend = 0,
        motionRole = "auto",
        transition = undefined,
        digits = undefined,
        textPosition = "right",
        rollDirection = "normal",
        loading = undefined,
        skeleton = undefined,
        renderHints = undefined,
        respectMotionPreference = false,
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
        children,
        ...rest
    }: Props = $props();

    const skeletonContext = getSkeleton();
    const effectiveLoading = $derived(loading || skeletonContext?.loading);
    const effectiveSkeleton = $derived(
        skeleton ?? skeletonContext?.skeleton ?? false,
    );
    const displayValue = $derived(
        formatTextMotionValue(value, locales, format),
    );
    const numericVariant = $derived(
        motionRole === "number" ||
            motionRole === "timer" ||
            motionRole === "countdown" ||
            (motionRole === "auto" && isFlowTextNumericContent(displayValue))
            ? "tabular"
            : "normal",
    );
    const rootStyle = $derived(
        createTextMotionTypographyStyle(
            "flow-text",
            { font, size, weight, lineHeight, color, align, motionColor },
            userStyle,
        ),
    );
    const flowTextRenderHints = $derived.by(() => ({
        variant: renderHints?.variant ?? "line",
        width:
            renderHints?.width ??
            `calc(${Math.max(displayValue.length, 3)}ch + 0.5rem)`,
        height: renderHints?.height ?? "1.25rem",
    }));
    const flowTextTransition = $derived({
        duration:
            transition?.layoutDuration ??
            transition?.duration ??
            FLOW_TEXT_MOTION_DURATION,
        easing: transition?.easing ?? FLOW_TEXT_LAYOUT_TRANSITION.easing,
    });
    const flowTextMotionDuration = $derived(
        transition?.duration ?? FLOW_TEXT_MOTION_DURATION,
    );
    const flowTextOpacityDuration = $derived(
        transition?.opacityDuration ?? FLOW_TEXT_OPACITY_DURATION,
    );
    const flowTextDeformDuration = $derived(
        transition?.deformDuration ?? FLOW_TEXT_DEFORM_DURATION,
    );
    const flowTextDeformEasing = $derived(
        transition?.deformEasing ?? FLOW_TEXT_DEFORM_EASING,
    );
    const flowTextStagger = $derived(transition?.stagger ?? FLOW_TEXT_STAGGER);

    let hasMounted = false;
    let previousDisplayValue = "";
    let characterElement = $state<TextMotionCharacterElement | undefined>();

    function fitCharacterMask(
        element: HTMLElement,
        source: HTMLElement,
        viewport: HTMLElement,
        glyph: HTMLElement,
    ) {
        // 隐藏的 inline 字符提供实际字体边界；不修改继承的字号、行高或占位。
        // 将宿主缩放后的测量换回局部坐标，渐隐区只放在字形边界之外。
        const box = element.getBoundingClientRect();
        const text = source.getBoundingClientRect();
        const scale = element.offsetHeight > 0 ? box.height / element.offsetHeight : 1;
        const top = Math.max(0, (box.top - text.top) / (scale || 1));
        const bottom = Math.max(0, (text.bottom - box.bottom) / (scale || 1));
        const start = `calc(${top}px + var(--snowui-flow-text-mask-height))`;
        const end = `calc(${bottom}px + var(--snowui-flow-text-mask-height))`;
        viewport.style.insetBlockStart = `calc(-1 * ${start})`;
        viewport.style.insetBlockEnd = `calc(-1 * ${end})`;
        // 动效字形保持 1em 行盒，通过半行距抵消回到静态文字基线。
        const leading = (box.height / (scale || 1) - parseFloat(getComputedStyle(element).fontSize)) / 2;
        glyph.style.insetBlockStart = `calc(${start} + ${leading}px)`;
    }

    function createFlowTextCharacterAnimator(
        opacityDuration: number,
        deformDuration: number,
        deformEasing: string,
    ) {
        function getCharacterViewport(element: HTMLElement) {
            const label =
                element.getAttribute("data-text-motion-label") ??
                element.textContent ??
                "";
            const existingViewport = Array.from(element.children).find(
                (child) =>
                    child instanceof HTMLElement &&
                    child.classList.contains(
                        FLOW_TEXT_CHARACTER_VIEWPORT_CLASS,
                    ),
            );
            const existingGlyph = existingViewport?.firstElementChild;
            if (
                existingViewport instanceof HTMLElement &&
                existingGlyph instanceof HTMLElement &&
                existingGlyph.classList.contains(
                    FLOW_TEXT_CHARACTER_GLYPH_CLASS,
                )
            ) {
                const existingSource = Array.from(element.children).find(
                    (child) =>
                        child instanceof HTMLElement &&
                        child.classList.contains(
                            FLOW_TEXT_CHARACTER_SOURCE_CLASS,
                        ),
                );
                if (existingSource instanceof HTMLElement) {
                    existingSource.textContent = label;
                    fitCharacterMask(element, existingSource, existingViewport, existingGlyph);
                }
                return { viewport: existingViewport, glyph: existingGlyph };
            }

            const source = document.createElement("span");
            source.className = FLOW_TEXT_CHARACTER_SOURCE_CLASS;
            source.setAttribute("aria-hidden", "true");
            source.textContent = label;
            source.style.visibility = "hidden";
            source.style.lineHeight = "inherit";

            const viewport = document.createElement("span");
            viewport.className = FLOW_TEXT_CHARACTER_VIEWPORT_CLASS;
            viewport.setAttribute("aria-hidden", "true");
            viewport.style.position = "absolute";
            viewport.style.insetBlock =
                "calc(-1 * var(--snowui-flow-text-mask-offset))";
            viewport.style.insetInline =
                "calc(-1 * var(--snowui-flow-text-mask-width))";
            viewport.style.display = "block";
            viewport.style.lineHeight = "inherit";
            viewport.style.pointerEvents = "none";
            viewport.style.overflow = "visible";
            viewport.style.contain = "paint";

            const glyph = document.createElement("span");
            glyph.className = FLOW_TEXT_CHARACTER_GLYPH_CLASS;
            glyph.setAttribute("aria-hidden", "true");
            glyph.textContent = label;
            glyph.style.lineHeight = "1";
            glyph.style.position = "absolute";
            glyph.style.insetBlockStart = "var(--snowui-flow-text-mask-offset)";
            glyph.style.insetInlineStart = "var(--snowui-flow-text-mask-width)";
            glyph.style.pointerEvents = "none";

            element.setAttribute("data-text-motion-label", label);
            element.textContent = "";
            element.style.position = "relative";
            element.style.display = "inline-block";
            element.style.overflow = "visible";
            viewport.appendChild(glyph);
            element.append(source, viewport);
            fitCharacterMask(element, source, viewport, glyph);
            return { viewport, glyph };
        }

        function showCharacterMask(
            element: HTMLElement,
            viewport: HTMLElement,
        ) {
            element.setAttribute("data-flow-text-mask", "active");
            viewport.style.overflow = "hidden";
            viewport.style.setProperty(
                "-webkit-mask-image",
                FLOW_TEXT_MASK_IMAGE,
            );
            viewport.style.setProperty(
                "-webkit-mask-size",
                FLOW_TEXT_MASK_SIZE,
            );
            viewport.style.setProperty(
                "-webkit-mask-position",
                FLOW_TEXT_MASK_POSITION,
            );
            viewport.style.setProperty("-webkit-mask-repeat", "no-repeat");
            viewport.style.maskImage = FLOW_TEXT_MASK_IMAGE;
            viewport.style.maskSize = FLOW_TEXT_MASK_SIZE;
            viewport.style.maskPosition = FLOW_TEXT_MASK_POSITION;
            viewport.style.maskRepeat = "no-repeat";
        }

        function restoreCharacter(element: HTMLElement) {
            const label =
                element.getAttribute("data-text-motion-label") ??
                element.textContent ??
                "";
            element.removeAttribute("data-flow-text-mask");
            element.removeAttribute("data-text-motion-label");
            element.textContent = label;
            element.style.position = "";
            element.style.display = "";
            element.style.overflow = "";
        }

        function settleWheelCharacter(
            element: HTMLElement,
            viewport: HTMLElement,
        ) {
            const glyph = viewport.firstElementChild as HTMLElement | null;
            element.removeAttribute("data-flow-text-mask");
            if (glyph) {
                flowTextGlyphRuntimes.get(glyph)?.cancel();
                flowTextGlyphRuntimes.delete(glyph);
                glyph.style.transition = "";
                glyph.style.opacity = "";
                glyph.style.transform = "translateY(0%) scaleY(1)";
            }
            viewport.style.overflow = "visible";
            viewport.style.removeProperty("-webkit-mask-image");
            viewport.style.removeProperty("-webkit-mask-size");
            viewport.style.removeProperty("-webkit-mask-position");
            viewport.style.removeProperty("-webkit-mask-repeat");
            viewport.style.maskImage = "";
            viewport.style.maskSize = "";
            viewport.style.maskPosition = "";
            viewport.style.maskRepeat = "";
        }

        function normalizeWheelLength(length: number | undefined) {
            const parsed = Number.isFinite(length) ? Math.floor(length!) : 10;
            return Math.max(1, parsed);
        }

        function getDigitPositionFromRight(
            text: string | undefined,
            characterIndex: number | undefined,
        ) {
            if (text === undefined || characterIndex === undefined) {
                return undefined;
            }
            let position = 0;
            for (
                let index = Math.min(characterIndex + 1, text.length) - 1;
                index < text.length;
                index += 1
            ) {
                if (/^\d$/.test(text[index] ?? "")) position += 1;
            }
            return Math.max(0, position - 1);
        }

        function getWheelLengthForCharacter(
            text: string | undefined,
            characterIndex: number | undefined,
        ) {
            const position = getDigitPositionFromRight(text, characterIndex);
            const max =
                position === undefined ? undefined : digits?.[position]?.max;
            const normalizedMax = Number.isFinite(max)
                ? Math.max(0, Math.floor(max!))
                : 9;
            return normalizedMax + 1;
        }

        function modBy(value: number, length: number) {
            return ((value % length) + length) % length;
        }

        function parseWheelDigit(value: string, length: number) {
            const parsed = Number.parseInt(value, 10);
            if (Number.isNaN(parsed)) return null;
            return modBy(parsed, length);
        }

        function toTrendSign(value: number) {
            if (value > 0) return 1 as const;
            if (value < 0) return -1 as const;
            return 0 as const;
        }

        function getPreferredWheelSign(currentTrend: number) {
            return toTrendSign(currentTrend);
        }

        function resolveRawWheelTrend(
            previousValue: string | undefined,
            nextValue: string | undefined,
        ) {
            const previousNumber = previousValue
                ? extractTextMotionNumber(previousValue)
                : undefined;
            const nextNumber = nextValue
                ? extractTextMotionNumber(nextValue)
                : undefined;
            return (
                trend ||
                resolveTextMotionModuloTrend(
                    previousNumber,
                    nextNumber,
                    getDigitsModulo(),
                    motionRole,
                ) ||
                resolveTextMotionTrend(
                    previousValue ?? "",
                    nextValue ?? "",
                    0,
                    motionRole,
                ).trend
            );
        }

        function resolveWheelAxisDirection(
            previousValue: string | undefined,
            nextValue: string | undefined,
            preferredSign: -1 | 0 | 1,
        ): -1 | 1 {
            const rawTrend = toTrendSign(
                resolveRawWheelTrend(previousValue, nextValue),
            );
            return rawTrend !== 0 &&
                preferredSign !== 0 &&
                rawTrend !== preferredSign
                ? -1
                : 1;
        }

        function mapFlowTextDigitAxis(
            digit: number,
            length: number,
            numericValue: number | null | undefined,
            axisDirection: -1 | 1,
            axisOffset = 0,
        ) {
            const normalizedLength = Math.max(1, Math.floor(length));
            const normalizedDigit =
                ((digit % normalizedLength) + normalizedLength) %
                normalizedLength;
            const signedAxis = mapDigitToSignedAxis(
                normalizedDigit,
                normalizedLength,
                numericValue,
            );
            const signAxis =
                signedAxis === normalizedDigit
                    ? 1
                    : -1;
            const shouldReverse = signAxis !== axisDirection;
            const axisValue = shouldReverse
                ? modBy(-normalizedDigit, normalizedLength)
                : normalizedDigit;
            return modBy(axisValue + axisOffset, normalizedLength);
        }

        function crossesNegativeToNonNegative(
            previousNumber: number | null | undefined,
            nextNumber: number | null | undefined,
        ) {
            return (
                typeof previousNumber === "number" &&
                typeof nextNumber === "number" &&
                previousNumber < 0 &&
                nextNumber >= 0
            );
        }

        function crossesNonNegativeToNegative(
            previousNumber: number | null | undefined,
            nextNumber: number | null | undefined,
        ) {
            return (
                typeof previousNumber === "number" &&
                typeof nextNumber === "number" &&
                previousNumber >= 0 &&
                nextNumber < 0
            );
        }

        function resolveTargetWheelValue(
            currentTrackValue: number,
            targetDigit: number,
            length: number,
            preferredSign: -1 | 0 | 1,
        ) {
            const baseCycle = Math.round(
                (currentTrackValue - targetDigit) / length,
            );
            const candidates = [
                targetDigit + (baseCycle - 2) * length,
                targetDigit + (baseCycle - 1) * length,
                targetDigit + baseCycle * length,
                targetDigit + (baseCycle + 1) * length,
                targetDigit + (baseCycle + 2) * length,
            ];
            const signedCandidates =
                preferredSign === 0
                    ? candidates
                    : candidates.filter(
                          (candidate) =>
                              toTrendSign(candidate - currentTrackValue) ===
                              preferredSign,
                      );
            const selectableCandidates =
                signedCandidates.length > 0 ? signedCandidates : candidates;

            return selectableCandidates.reduce((best, candidate) => {
                const bestDistance = Math.abs(best - currentTrackValue);
                const candidateDistance = Math.abs(
                    candidate - currentTrackValue,
                );
                return candidateDistance < bestDistance ? candidate : best;
            });
        }

        function readFlowTextWheelTrackValue(glyph: HTMLElement) {
            const wheel = glyph.querySelector(
                `.${FLOW_TEXT_WHEEL_CLASS}`,
            ) as HTMLElement | null;
            if (!wheel) return null;

            const raw = getComputedStyle(wheel).getPropertyValue(
                FLOW_TEXT_WHEEL_VALUE_VAR,
            );
            const parsed = Number.parseFloat(raw);
            return Number.isFinite(parsed) ? parsed : null;
        }

        function startFlowTextWheelValueAnimation(
            wheel: HTMLElement,
            from: number,
            to: number,
            options: {
                duration: number;
                delay: number;
            },
        ) {
            flowTextWheelRuntimes.get(wheel)?.cancel();
            jumpFlowTextWheelValue(wheel, from);

            let frame: number | undefined;
            let cancelled = false;
            const startTime =
                (typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now()) + options.delay;
            const distance = to - from;
            const readNow = () =>
                typeof performance !== "undefined"
                    ? performance.now()
                    : Date.now();
            const tick = () => {
                if (cancelled) return;
                const now = readNow();
                const elapsed = Math.max(0, now - startTime);
                const progress =
                    options.duration <= 0
                        ? 1
                        : Math.min(1, elapsed / options.duration);
                const eased = easeFlowTextWheelProgress(progress);
                wheel.style.setProperty(
                    FLOW_TEXT_WHEEL_VALUE_VAR,
                    String(from + distance * eased),
                );
                if (progress < 1) {
                    frame = window.setTimeout(tick, 16);
                    return;
                }
                wheel.style.setProperty(FLOW_TEXT_WHEEL_VALUE_VAR, String(to));
            };

            const cancel = () => {
                cancelled = true;
                if (frame !== undefined) window.clearTimeout(frame);
            };
            flowTextWheelRuntimes.set(wheel, { cancel });
            frame = window.setTimeout(tick, 16);
            return cancel;
        }

        function getFlowTextWheelDuration(duration: number) {
            return duration;
        }

        function jumpFlowTextWheelValue(wheel: HTMLElement, value: number) {
            wheel.style.transition = "none";
            wheel.style.setProperty(FLOW_TEXT_WHEEL_VALUE_VAR, String(value));
            wheel.offsetHeight;
        }

        function easeFlowTextWheelProgress(progress: number) {
            const t = Math.max(0, Math.min(1, progress));
            return 1 - (1 - t) ** 4;
        }

        function startEdgeWheelExitTransition(
            glyph: HTMLElement,
            edgeY: string,
            duration: number,
            easing: string,
            delay: number,
        ) {
            flowTextGlyphRuntimes.get(glyph)?.cancel();
            glyph.style.transition = "none";
            glyph.style.transform = "translateY(0%) scaleY(1)";
            glyph.style.opacity = "1";
            glyph.offsetHeight;
            const timer = window.setTimeout(() => {
                glyph.style.transition = [
                    `transform ${duration}ms ${easing}`,
                    `opacity ${duration}ms ${easing}`,
                ].join(", ");
                glyph.style.transform = `translateY(${edgeY}) scaleY(1)`;
                glyph.style.opacity = "0.001";
            }, delay);
            flowTextGlyphRuntimes.set(glyph, {
                cancel: () => window.clearTimeout(timer),
            });
        }

        function startEdgeWheelEnterTransition(
            glyph: HTMLElement,
            edgeY: string,
            duration: number,
            easing: string,
            delay: number,
        ) {
            flowTextGlyphRuntimes.get(glyph)?.cancel();
            glyph.style.transition = "none";
            glyph.style.transform = `translateY(${edgeY}) scaleY(1)`;
            glyph.style.opacity = "1";
            glyph.offsetHeight;
            const timer = window.setTimeout(() => {
                glyph.style.transition = `transform ${duration}ms ${easing}`;
                glyph.style.transform = "translateY(0%) scaleY(1)";
                glyph.style.opacity = "1";
            }, delay);
            flowTextGlyphRuntimes.set(glyph, {
                cancel: () => window.clearTimeout(timer),
            });
        }

        function createWheelDigit(
            digit: number,
            activeDigit: number,
            length: number,
            numericValue: number | null | undefined,
            axisDirection: -1 | 1,
            axisOffset = 0,
        ) {
            const digitElement = document.createElement("span");
            digitElement.className = FLOW_TEXT_WHEEL_DIGIT_CLASS;
            digitElement.textContent = String(digit);
            digitElement.setAttribute(
                "aria-hidden",
                String(digit !== activeDigit),
            );
            digitElement.style.display = "inline-flex";
            digitElement.style.alignItems = "center";
            digitElement.style.justifyContent = "center";
            digitElement.style.height = "1em";
            digitElement.style.lineHeight = "1";
            digitElement.style.setProperty(
                FLOW_TEXT_WHEEL_N_VAR,
                String(
                    mapFlowTextDigitAxis(
                        digit,
                        length,
                        numericValue,
                        axisDirection,
                        axisOffset,
                    ),
                ),
            );
            digitElement.style.setProperty(
                "--snowui-flow-text-wheel-offset-raw",
                `mod(var(${FLOW_TEXT_WHEEL_LENGTH_VAR}) + var(${FLOW_TEXT_WHEEL_N_VAR}) - mod(var(${FLOW_TEXT_WHEEL_C_VAR}), var(${FLOW_TEXT_WHEEL_LENGTH_VAR})), var(${FLOW_TEXT_WHEEL_LENGTH_VAR}))`,
            );
            digitElement.style.setProperty(
                "--snowui-flow-text-wheel-offset",
                `calc(var(--snowui-flow-text-wheel-offset-raw) - var(${FLOW_TEXT_WHEEL_LENGTH_VAR}) * round(down, var(--snowui-flow-text-wheel-offset-raw) / (var(${FLOW_TEXT_WHEEL_LENGTH_VAR}) / 2), 1))`,
            );
            digitElement.style.setProperty(
                "--snowui-flow-text-wheel-y",
                `clamp(-100%, calc(var(--snowui-flow-text-wheel-offset) * var(${FLOW_TEXT_WHEEL_DIR_VAR}, 1) * 100%), 100%)`,
            );
            digitElement.style.setProperty(
                "--snowui-flow-text-wheel-offset-abs",
                "max(var(--snowui-flow-text-wheel-offset), calc(var(--snowui-flow-text-wheel-offset) * -1))",
            );
            digitElement.style.setProperty(
                "--snowui-flow-text-wheel-visibility",
                "clamp(0, calc((1.15 - var(--snowui-flow-text-wheel-offset-abs)) * 8), 1)",
            );
            digitElement.style.opacity =
                "var(--snowui-flow-text-wheel-visibility)";
            digitElement.style.transform =
                "translate3d(0, var(--snowui-flow-text-wheel-y), 0)";
            digitElement.style.backfaceVisibility = "hidden";
            digitElement.style.willChange = "transform, opacity";
            updateWheelDigitActiveState(digitElement, digit, activeDigit);
            return digitElement;
        }

        function updateWheelDigitActiveState(
            digitElement: HTMLElement,
            digit: number,
            activeDigit: number,
        ) {
            const isActive = digit === activeDigit;
            digitElement.setAttribute("aria-hidden", String(!isActive));
            digitElement.style.position = isActive ? "" : "absolute";
            digitElement.style.top = isActive ? "" : "0";
            digitElement.style.left = isActive ? "" : "0";
            digitElement.style.width = isActive ? "" : "100%";
        }

        function updateWheelActiveDigit(
            wheel: HTMLElement,
            activeDigit: number,
            length: number,
            numericValue: number | null | undefined,
            axisDirection: -1 | 1,
            axisOffset = 0,
        ) {
            for (const child of Array.from(wheel.children)) {
                if (!(child instanceof HTMLElement)) continue;
                const digit = Number.parseInt(child.textContent ?? "", 10);
                if (!Number.isInteger(digit)) continue;
                child.style.setProperty(
                    FLOW_TEXT_WHEEL_N_VAR,
                    String(
                        mapFlowTextDigitAxis(
                            digit,
                            length,
                            numericValue,
                            axisDirection,
                            axisOffset,
                        ),
                    ),
                );
                child.style.opacity =
                    "var(--snowui-flow-text-wheel-visibility)";
                updateWheelDigitActiveState(child, digit, activeDigit);
            }
        }

        function updateWheelInactiveDigitAxis(
            wheel: HTMLElement,
            activeDigit: number,
            length: number,
            numericValue: number | null | undefined,
            activeAxisValue: number,
            axisDirection: -1 | 1,
            axisOffset = 0,
        ) {
            const normalizedActiveAxis = modBy(activeAxisValue, length);
            for (const child of Array.from(wheel.children)) {
                if (!(child instanceof HTMLElement)) continue;
                const digit = Number.parseInt(child.textContent ?? "", 10);
                if (!Number.isInteger(digit)) continue;
                const axisValue =
                    digit === activeDigit
                        ? normalizedActiveAxis
                        : mapFlowTextDigitAxis(
                              digit,
                              length,
                              numericValue,
                              axisDirection,
                              axisOffset,
                          );
                child.style.setProperty(
                    FLOW_TEXT_WHEEL_N_VAR,
                    String(axisValue),
                );
                child.style.opacity =
                    digit !== activeDigit && axisValue === normalizedActiveAxis
                        ? "0"
                        : "var(--snowui-flow-text-wheel-visibility)";
                updateWheelDigitActiveState(child, digit, activeDigit);
            }
        }

        function hasCompleteWheelDigits(wheel: HTMLElement, length: number) {
            if (wheel.children.length < length) return false;
            const digits = new Set<number>();
            for (const child of Array.from(wheel.children)) {
                const digit = Number.parseInt(child.textContent ?? "", 10);
                if (Number.isInteger(digit)) digits.add(modBy(digit, length));
            }
            for (let digit = 0; digit < length; digit += 1) {
                if (!digits.has(digit)) return false;
            }
            return true;
        }

        function renderCompleteWheelDigits(
            wheel: HTMLElement,
            activeDigit: number,
            length: number,
            numericValue: number | null | undefined,
            axisDirection: -1 | 1,
            axisOffset = 0,
        ) {
            wheel.replaceChildren(
                ...Array.from({ length }, (_, digit) =>
                    createWheelDigit(
                        digit,
                        activeDigit,
                        length,
                        numericValue,
                        axisDirection,
                        axisOffset,
                    ),
                ),
            );
        }

        function getReusableFlowTextWheel(
            glyph: HTMLElement,
            length: number,
        ) {
            const wheel = glyph.querySelector(
                `.${FLOW_TEXT_WHEEL_CLASS}`,
            ) as HTMLElement | null;
            if (!wheel) return null;

            const previousLength = Number.parseInt(
                wheel.style.getPropertyValue(FLOW_TEXT_WHEEL_LENGTH_VAR),
                10,
            );
            return previousLength === length ? wheel : null;
        }

        function renderFlowTextWheel(
            element: HTMLElement,
            glyph: HTMLElement,
            previousLabel: string,
            nextLabel: string,
            currentTrend: number,
            previousValue: string | undefined,
            nextValue: string | undefined,
            characterIndex: number | undefined,
            isOut: boolean,
        ) {
            const length = normalizeWheelLength(
                getWheelLengthForCharacter(
                    isOut ? previousValue : nextValue,
                    characterIndex,
                ),
            );
            const previousDigit = parseWheelDigit(previousLabel, length);
            const nextDigit = parseWheelDigit(nextLabel, length);
            if (previousDigit === null || nextDigit === null) return null;

            const previousNumber = previousValue
                ? extractTextMotionNumber(previousValue)
                : undefined;
            const nextNumber = nextValue
                ? extractTextMotionNumber(nextValue)
                : undefined;
            const isNegativeSignExit = crossesNegativeToNonNegative(
                previousNumber,
                nextNumber,
            );
            const isNegativeSignEnter = crossesNonNegativeToNegative(
                previousNumber,
                nextNumber,
            );
            const preferredSign = getPreferredWheelSign(currentTrend);
            const axisDirection = resolveWheelAxisDirection(
                previousValue,
                nextValue,
                preferredSign,
            );
            const storedState = isNegativeSignExit
                ? undefined
                : flowTextWheelStates.get(element);
            const state =
                storedState?.currentLength === length ? storedState : undefined;
            const axisOffset = isNegativeSignEnter
                ? 0
                : (state?.axisOffset ?? 0);
            const axisPreviousNumber = isNegativeSignExit
                ? undefined
                : previousNumber;
            const axisNextNumber =
                isNegativeSignExit || isNegativeSignEnter
                    ? axisPreviousNumber
                    : nextNumber;
            const previousAxisValue = mapFlowTextDigitAxis(
                previousDigit,
                length,
                axisPreviousNumber,
                axisDirection,
                axisOffset,
            );
            const targetAxisValue = mapFlowTextDigitAxis(
                nextDigit,
                length,
                axisNextNumber,
                axisDirection,
                axisOffset,
            );
            const previousRawValue =
                state?.previousRawValue ?? axisPreviousNumber ?? null;
            const currentDigit = state?.currentDigit ?? previousDigit;
            const currentAxisValue = mapFlowTextDigitAxis(
                currentDigit,
                length,
                previousRawValue,
                axisDirection,
                axisOffset,
            );
            const canReuseTrack =
                !isNegativeSignExit &&
                state?.axisDirection === axisDirection &&
                state?.axisOffset === axisOffset;
            const currentTrackValue =
                (canReuseTrack ? readFlowTextWheelTrackValue(glyph) : null) ??
                (canReuseTrack ? state?.currentWheelValue : null) ??
                currentAxisValue ??
                previousAxisValue;
            const preservesCurrentDigit = currentAxisValue === targetAxisValue;
            const targetWheelValue = preservesCurrentDigit
                ? state?.currentWheelValue ?? currentTrackValue
                : resolveTargetWheelValue(
                      currentTrackValue,
                      targetAxisValue,
                      length,
                      preferredSign,
                  );
            flowTextWheelStates.set(element, {
                currentDigit: nextDigit,
                currentWheelValue: targetWheelValue,
                currentLength: length,
                previousRawValue: axisNextNumber ?? null,
                axisDirection,
                axisOffset,
            });
            const reusableWheel = getReusableFlowTextWheel(glyph, length);
            const wheel = reusableWheel ?? document.createElement("span");
            if (!reusableWheel) {
                wheel.className = FLOW_TEXT_WHEEL_CLASS;
                wheel.style.display = "inline-flex";
                wheel.style.alignItems = "center";
                wheel.style.justifyContent = "center";
                wheel.style.position = "relative";
                wheel.style.width = "100%";
                wheel.style.height = "1em";
                wheel.style.clipPath = "inset(0)";
                wheel.style.lineHeight = "1";
                wheel.style.verticalAlign = "baseline";
                wheel.style.fontVariantNumeric = "tabular-nums";
            }
            wheel.style.setProperty(FLOW_TEXT_WHEEL_LENGTH_VAR, String(length));
            wheel.style.setProperty(FLOW_TEXT_WHEEL_DIR_VAR, "1");
            wheel.style.setProperty(
                FLOW_TEXT_WHEEL_CURRENT_VAR,
                String(targetAxisValue),
            );
            wheel.style.setProperty(
                FLOW_TEXT_WHEEL_C_VAR,
                `var(${FLOW_TEXT_WHEEL_VALUE_VAR}, var(${FLOW_TEXT_WHEEL_CURRENT_VAR}, 0))`,
            );
            jumpFlowTextWheelValue(wheel, currentTrackValue);

            if (reusableWheel) {
                if (hasCompleteWheelDigits(wheel, length)) {
                    updateWheelActiveDigit(
                        wheel,
                        nextDigit,
                        length,
                        axisNextNumber,
                        axisDirection,
                        axisOffset,
                    );
                } else {
                    renderCompleteWheelDigits(
                        wheel,
                        nextDigit,
                        length,
                        axisNextNumber,
                        axisDirection,
                        axisOffset,
                    );
                }
            } else {
                renderCompleteWheelDigits(
                    wheel,
                    nextDigit,
                    length,
                    axisNextNumber,
                    axisDirection,
                    axisOffset,
                );
                glyph.textContent = "";
                glyph.appendChild(wheel);
            }

            glyph.style.lineHeight = "1";
            return {
                wheel,
                previousAxisValue: currentTrackValue,
                targetWheelValue,
                preserveWheelRuntime: preservesCurrentDigit,
                finalizeWheel: isNegativeSignEnter
                    ? () => {
                          const settledAxisValue = mapFlowTextDigitAxis(
                              nextDigit,
                              length,
                              nextNumber,
                              axisDirection,
                          );
                          const settledAxisOffset = modBy(
                              targetWheelValue - settledAxisValue,
                              length,
                          );
                          wheel.style.setProperty(
                              FLOW_TEXT_WHEEL_CURRENT_VAR,
                              String(targetWheelValue),
                          );
                          updateWheelInactiveDigitAxis(
                              wheel,
                              nextDigit,
                              length,
                              nextNumber,
                              targetWheelValue,
                              axisDirection,
                              settledAxisOffset,
                          );
                          flowTextWheelStates.set(element, {
                              currentDigit: nextDigit,
                              currentWheelValue: targetWheelValue,
                              currentLength: length,
                              previousRawValue: nextNumber ?? null,
                              axisDirection,
                              axisOffset: settledAxisOffset,
                          });
                      }
                    : undefined,
            };
        }

        function renderFlowTextEdgeWheel(
            element: HTMLElement,
            glyph: HTMLElement,
            label: string,
            currentTrend: number,
            value: string | undefined,
            characterIndex: number | undefined,
            isOut: boolean,
        ) {
            const length = normalizeWheelLength(
                getWheelLengthForCharacter(value, characterIndex),
            );
            const digit = parseWheelDigit(label, length);
            if (digit === null) return null;

            const numericValue = value
                ? extractTextMotionNumber(value)
                : undefined;
            const preferredSign = getPreferredWheelSign(currentTrend) || 1;
            const axisDirection = resolveWheelAxisDirection(
                isOut ? value : undefined,
                isOut ? undefined : value,
                preferredSign,
            );
            const axisValue = mapFlowTextDigitAxis(
                digit,
                length,
                numericValue,
                axisDirection,
            );
            const previousAxisValue = isOut ? axisValue : axisValue;
            const targetWheelValue = isOut
                ? axisValue + preferredSign
                : axisValue;
            const activeDigit = digit;
            flowTextWheelStates.set(element, {
                currentDigit: isOut ? activeDigit : digit,
                currentWheelValue: targetWheelValue,
                currentLength: length,
                previousRawValue: numericValue ?? null,
                axisDirection,
                axisOffset: 0,
            });
            const wheel = document.createElement("span");
            wheel.className = FLOW_TEXT_WHEEL_CLASS;
            wheel.style.display = "inline-flex";
            wheel.style.alignItems = "center";
            wheel.style.justifyContent = "center";
            wheel.style.position = "relative";
            wheel.style.width = "100%";
            wheel.style.height = "1em";
                wheel.style.clipPath = "inset(0)";
            wheel.style.lineHeight = "1";
            wheel.style.verticalAlign = "baseline";
            wheel.style.fontVariantNumeric = "tabular-nums";
            wheel.style.setProperty(FLOW_TEXT_WHEEL_LENGTH_VAR, String(length));
            wheel.style.setProperty(FLOW_TEXT_WHEEL_DIR_VAR, "1");
            wheel.style.setProperty(
                FLOW_TEXT_WHEEL_CURRENT_VAR,
                String(axisValue),
            );
            wheel.style.setProperty(
                FLOW_TEXT_WHEEL_C_VAR,
                `var(${FLOW_TEXT_WHEEL_VALUE_VAR}, var(${FLOW_TEXT_WHEEL_CURRENT_VAR}, 0))`,
            );
            jumpFlowTextWheelValue(wheel, previousAxisValue);

            const wheelDigits = isOut
                ? [digit, modBy(digit + preferredSign, length)]
                : [digit];
            for (const nextDigit of wheelDigits) {
                wheel.appendChild(
                    createWheelDigit(
                        nextDigit,
                        activeDigit,
                        length,
                        numericValue,
                        axisDirection,
                    ),
                );
            }

            glyph.textContent = "";
            glyph.style.lineHeight = "1";
            glyph.appendChild(wheel);
            return {
                wheel,
                previousAxisValue,
                targetWheelValue,
                preserveWheelRuntime: false,
                finalizeWheel: undefined,
            };
        }

        return function animateFlowTextCharacter({
            element,
            isOut,
            trend,
            delay,
            duration,
            easing,
            label,
            previousLabel,
            previousValue,
            nextValue,
            characterIndex,
            isNumericArithmetic,
        }: TextMotionCharacterAnimationContext) {
            registerFlowTextMotionProperties();
            const previousNumber = previousValue
                ? extractTextMotionNumber(previousValue)
                : undefined;
            const nextNumber = nextValue
                ? extractTextMotionNumber(nextValue)
                : undefined;
            const waitsForNegativeSignExit =
                !isOut &&
                /^\d$/.test(label) &&
                crossesNegativeToNonNegative(previousNumber, nextNumber);
            const motionDelay = waitsForNegativeSignExit
                ? delay + FLOW_TEXT_STAGGER
                : delay;
            const allowsNumericWheel =
                motionRole === "number" ||
                motionRole === "timer" ||
                motionRole === "countdown" ||
                (motionRole === "auto" &&
                    (previousNumber !== undefined ||
                        nextNumber !== undefined));
            const canUseWheel =
                (isNumericArithmetic || allowsNumericWheel) &&
                /^\d$/.test(label) &&
                (previousLabel === undefined || /^\d$/.test(previousLabel));
            const direction = isOut ? -trend : trend;
            const edgeY = `calc(${direction} * 1em)`;
            const edgeExitY =
                direction >= 0 ? "100%" : "-100%";
            const edgeEnterY = direction >= 0 ? "100%" : "-100%";
            const startY = isOut ? "0%" : edgeY;
            const endY = isOut ? edgeY : "0%";
            const startScaleY = isOut ? "1" : String(FLOW_TEXT_EDGE_SCALE_Y);
            const endScaleY = isOut ? String(FLOW_TEXT_EDGE_SCALE_Y) : "1";
            const { viewport, glyph } = getCharacterViewport(element);
            const motionId = String(
                Number(element.dataset.flowTextMotionId ?? "0") + 1,
            );
            element.dataset.flowTextMotionId = motionId;
            for (const animation of glyph.getAnimations({ subtree: true })) {
                animation.cancel();
            }

            glyph.style.display = "inline-block";
            glyph.style.lineHeight = "1";
            glyph.style.transform = `translateY(var(${FLOW_TEXT_Y_VAR}, 0%)) scaleY(var(${FLOW_TEXT_SCALE_Y_VAR}, 1))`;
            glyph.style.setProperty(FLOW_TEXT_Y_VAR, startY);
            glyph.style.setProperty(FLOW_TEXT_SCALE_Y_VAR, startScaleY);
            const wheelMotion = canUseWheel
                ? previousLabel !== undefined
                    ? renderFlowTextWheel(
                          element,
                          glyph,
                          previousLabel,
                          label,
                          trend,
                          previousValue,
                          nextValue,
                          characterIndex,
                          isOut,
                      )
                    : renderFlowTextEdgeWheel(
                          element,
                          glyph,
                          label,
                          trend,
                          isOut ? previousValue : nextValue,
                          characterIndex,
                          isOut,
                      )
                : null;
            const isEdgeWheelExit =
                Boolean(wheelMotion) &&
                (isOut || element.parentElement?.hasAttribute("inert"));
            const isEdgeWheelEnter =
                Boolean(wheelMotion) && !isOut && previousLabel === undefined;
            if (wheelMotion) {
                glyph.style.setProperty(FLOW_TEXT_Y_VAR, "0%");
                glyph.style.setProperty(FLOW_TEXT_SCALE_Y_VAR, "1");
            }
            const maskTimer =
                motionDelay > 0
                    ? window.setTimeout(() => {
                          if (element.dataset.flowTextMotionId === motionId) {
                              showCharacterMask(element, viewport);
                          }
                      }, motionDelay)
                    : undefined;
            if (!maskTimer) showCharacterMask(element, viewport);

            const flowAnimation = wheelMotion
                ? (() => {
                      const wheelDuration = getFlowTextWheelDuration(
                          duration,
                      );
                      if (!wheelMotion.preserveWheelRuntime) {
                          startFlowTextWheelValueAnimation(
                              wheelMotion.wheel,
                              wheelMotion.previousAxisValue,
                              wheelMotion.targetWheelValue,
                              {
                                  duration: wheelDuration,
                                  delay: motionDelay,
                              },
                          );
                      }
                      if (isEdgeWheelExit) {
                          startEdgeWheelExitTransition(
                              glyph,
                              edgeExitY,
                              wheelDuration,
                              easing,
                              motionDelay,
                          );
                      } else if (isEdgeWheelEnter) {
                          startEdgeWheelEnterTransition(
                              glyph,
                              edgeEnterY,
                              wheelDuration,
                              easing,
                              motionDelay,
                          );
                      }
                      return wheelMotion.wheel.animate(
                          { opacity: [1, 0.999999, 1] },
                          {
                              duration: wheelDuration,
                              easing: "linear",
                              fill: "both",
                              delay: motionDelay,
                          },
                      );
                  })()
                : glyph.animate(
                      { [FLOW_TEXT_Y_VAR]: [startY, endY] },
                      {
                          duration,
                          easing,
                          fill: "both",
                          delay: motionDelay,
                      },
                  );
            const cleanupDuration = wheelMotion
                ? getFlowTextWheelDuration(duration)
                : duration;
            if (!wheelMotion) {
                glyph.animate(
                    { [FLOW_TEXT_SCALE_Y_VAR]: [startScaleY, endScaleY] },
                    {
                        duration: deformDuration,
                        easing: deformEasing,
                        fill: "both",
                        delay: motionDelay,
                    },
                );
                glyph.animate(
                    { opacity: isOut ? [1, 0.001] : [0.0001, 1] },
                    {
                        duration: opacityDuration,
                        easing: "ease-out",
                        fill: "both",
                        delay: motionDelay,
                    },
                );
            }
            let maskCleaned = false;
            const cleanupMask = () => {
                if (maskCleaned) return;
                if (element.dataset.flowTextMotionId !== motionId) return;
                maskCleaned = true;
                if (maskTimer) window.clearTimeout(maskTimer);
                window.clearTimeout(maskCleanupTimer);
                delete element.dataset.flowTextMotionId;
                if (wheelMotion) {
                    wheelMotion.finalizeWheel?.();
                    settleWheelCharacter(element, viewport);
                } else {
                    restoreCharacter(element);
                }
            };
            const maskCleanupTimer = window.setTimeout(
                cleanupMask,
                motionDelay + cleanupDuration + 50,
            );
            flowAnimation.addEventListener("finish", cleanupMask, {
                once: true,
            });
            flowAnimation.addEventListener("cancel", cleanupMask, {
                once: true,
            });
            return flowAnimation;
        };
    }

    $effect(() => {
        const host = characterElement;
        if (!host || typeof ResizeObserver === "undefined") return;
        // 容器排版变化时，仅重新定位仍保留的临时滚轮与遮罩，不修改外层排版。
        const observer = new ResizeObserver(() => {
            host.shadowRoot?.querySelectorAll<HTMLElement>(
                `.${FLOW_TEXT_CHARACTER_SOURCE_CLASS}`,
            ).forEach((source) => {
                const element = source.parentElement;
                const viewport = element?.querySelector<HTMLElement>(
                    `.${FLOW_TEXT_CHARACTER_VIEWPORT_CLASS}`,
                );
                const glyph = viewport?.firstElementChild;
                if (element && viewport && glyph instanceof HTMLElement) {
                    fitCharacterMask(element, source, viewport, glyph);
                }
            });
        });
        observer.observe(host);
        return () => observer.disconnect();
    });

    function getDigitsModulo() {
        if (!digits) return undefined;
        const positions = Object.keys(digits)
            .map((key) => Number.parseInt(key, 10))
            .filter((position) => Number.isInteger(position) && position >= 0);
        if (!positions.length) return undefined;

        let modulo = 1;
        for (
            let position = 0;
            position <= Math.max(...positions);
            position += 1
        ) {
            const max = digits[position]?.max;
            modulo *= Number.isFinite(max)
                ? Math.max(1, Math.floor(max!) + 1)
                : 10;
        }
        return modulo > 1 ? modulo : undefined;
    }

    function resolveFlowTrend(previous: string, next: string): FlowTextTrend {
        const previousNumber = extractTextMotionNumber(previous);
        const nextNumber = extractTextMotionNumber(next);
        const moduloTrend = resolveTextMotionModuloTrend(
            previousNumber,
            nextNumber,
            getDigitsModulo(),
            motionRole,
        );
        let resolved =
            trend ||
            moduloTrend ||
            resolveTextMotionTrend(previous, next, 0, motionRole).trend;

        const baseTrend = resolved || 1;
        if (rollDirection === "reverse")
            return (-baseTrend) as FlowTextTrend;
        return baseTrend;
    }

    $effect(() => {
        if (!characterElement) return;
        const resolvedTrend = resolveFlowTrend(
            previousDisplayValue,
            displayValue,
        );
        characterElement.setOptions({
            trend: resolvedTrend,
            motionRole,
            transition: flowTextTransition,
            motionDuration: flowTextMotionDuration,
            stagger: flowTextStagger,
            numericStaggerDirection: "right-to-left",
            animatePreservedNumericSignChange: true,
            respectMotionPreference,
            motionColor:
                typeof motionColor === "function"
                    ? motionColor
                    : resolveTextMotionColor(motionColor),
            animator: createFlowTextCharacterAnimator(
                flowTextOpacityDuration,
                flowTextDeformDuration,
                flowTextDeformEasing,
            ),
        });
        characterElement.update(displayValue, hasMounted);
        previousDisplayValue = displayValue;
        hasMounted = true;
    });
</script>

{#snippet flowContent()}
    <svelte:element
        this={TEXT_MOTION_CHARACTER_TAG}
        bind:this={characterElement}
        class="snowui-flow-text-element"
        aria-hidden="true"
    >
        {displayValue}
    </svelte:element>
{/snippet}

{#if effectiveLoading && effectiveSkeleton}
    <Skeleton
        componentClass="snowui-flow-text"
        renderHints={flowTextRenderHints}
    />
{:else}
    <FramePro
        {tag}
        class={`snowui-flow-text${userClass ? ` ${userClass}` : ""}`}
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
    >
        <span class="snowui-flow-text-mask" aria-hidden="true">
            <span class="snowui-flow-text-layout">
                {#if textPosition === "left"}
                    {@render flowContent()}
                    {#if children}
                        <span class="snowui-flow-text-extra"
                            >{@render children()}</span
                        >
                    {/if}
                {:else}
                    {#if children}
                        <span class="snowui-flow-text-extra"
                            >{@render children()}</span
                        >
                    {/if}
                    {@render flowContent()}
                {/if}
            </span>
        </span>
    </FramePro>
{/if}

<style>
    :global(:where(.snowui-flow-text)) {
        --snowui-flow-text-mask-height: 0.1em;
        --snowui-flow-text-mask-offset: 0.005em;
        --snowui-flow-text-half-mask-height: calc(
            var(--snowui-flow-text-mask-offset) / 2
        );
        --snowui-flow-text-mask-width: 0.5em;
        display: inline-flex;
        max-width: 100%;
        min-width: 0;
        overflow: visible;
        position: relative;
        white-space: nowrap;
        isolation: isolate;
        vertical-align: baseline;
        font-family: var(--snowui-flow-text-font, inherit);
        font-variant-numeric: normal;
        font-size: var(--snowui-flow-text-size, inherit);
        font-weight: var(--snowui-flow-text-weight, inherit);
        line-height: var(--snowui-flow-text-line-height, inherit);
        color: var(--snowui-flow-text-color, inherit);
        text-align: var(--snowui-flow-text-align, inherit);
        justify-content: flex-start;
    }

    :global(:where(.snowui-flow-text[data-align="center"])) {
        justify-content: center;
        text-align: center;
    }

    :global(:where(.snowui-flow-text[data-align="right"])) {
        justify-content: flex-end;
        text-align: right;
    }

    :global(:where(.snowui-flow-text[data-align="justify"])) {
        justify-content: stretch;
        text-align: justify;
    }

    :global(:where(.snowui-flow-text[data-numeric-variant="tabular"])) {
        font-variant-numeric: tabular-nums;
    }

    :global(:where(.snowui-flow-text-mask)) {
        display: inline-flex;
        align-items: center;
        width: max-content;
        flex: 0 0 auto;
        overflow: visible;
    }

    :global(:where(.snowui-flow-text-layout)) {
        display: inline-flex;
        align-items: baseline;
        width: max-content;
        padding-block: var(--snowui-flow-text-half-mask-height);
        padding-inline: var(--snowui-flow-text-mask-width);
        margin-inline: calc(-1 * var(--snowui-flow-text-mask-width));
    }

    :global(:where(.snowui-flow-text-extra)) {
        display: inline-flex;
        align-items: baseline;
        flex: 0 0 auto;
    }

    :global(:where(.snowui-flow-text-element)) {
        font: inherit;
        color: inherit;
        line-height: inherit;
        letter-spacing: inherit;
    }
</style>
