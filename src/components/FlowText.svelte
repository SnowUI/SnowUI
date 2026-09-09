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
    import { onDestroy, type Snippet } from "svelte";
    import { animateTextMotionDelta, animateTextMotionOpacity } from "../lib/text-motion/animation";
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
    import { createTextMotionFormatter } from "../lib/text-motion/format";
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
        duration: 550,
        easing: "linear(0,.005,.019,.039,.066,.096,.129,.165,.202,.24,.278,.316,.354,.39,.426,.461,.494,.526,.557,.586,.614,.64,.665,.689,.711,.731,.751,.769,.786,.802,.817,.831,.844,.856,.867,.877,.887,.896,.904,.912,.919,.925,.931,.937,.942,.947,.951,.955,.959,.962,.965,.968,.971,.973,.976,.978,.98,.981,.983,.984,.986,.987,.988,.989,.99,.991,.992,.992,.993,.994,.994,.995,.995,.996,.996,.9963,.9967,.9969,.9972,.9975,.9977,.9979,.9981,.9982,.9984,.9985,.9987,.9988,.9989,1)",
    };
    const FLOW_TEXT_MOTION_DURATION = 550;
    const FLOW_TEXT_OPACITY_DURATION = 275;
    const FLOW_TEXT_DEFORM_DURATION = 100;
    const FLOW_TEXT_DEFORM_EASING = "linear";
    const FLOW_TEXT_SIGN_EXIT_DELAY = 25;
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
    const flowTextWheelStates = new WeakMap<HTMLElement, FlowTextWheelState>();
    const flowTextMaskCleanups = new WeakMap<HTMLElement, () => void>();
    const FLOW_TEXT_WHEEL_EASING = "linear(" + Array.from({ length: 101 }, (_, i) => 1 - (1 - i / 100) ** 4).join(",") + ")";
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
                syntax: "<number>",
                inherits: false,
                initialValue: "0",
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
    const formatValue = $derived(createTextMotionFormatter(locales, format));
    const displayValue = $derived(formatValue(value));
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
    // 未覆盖时由共享字符运行时按 NumericText 的比例计算逐位延迟。
    const flowTextStagger = $derived(transition?.stagger);

    let hasMounted = false;
    let previousDisplayValue = "";
    let characterElement = $state<TextMotionCharacterElement | undefined>();

    const pendingMasks = new Map<HTMLElement, { source: HTMLElement; viewport: HTMLElement; glyph: HTMLElement }>();
    let maskFrame = 0;
    onDestroy(() => {
        if (maskFrame) cancelAnimationFrame(maskFrame);
        pendingMasks.clear();
    });

    function fitCharacterMask(element: HTMLElement, source: HTMLElement, viewport: HTMLElement, glyph: HTMLElement) {
        pendingMasks.set(element, { source, viewport, glyph });
        if (maskFrame) return;
        maskFrame = requestAnimationFrame(() => {
            maskFrame = 0;
            // 所有字形先测量，再写入遮罩，避免每个位数都触发布局刷新。
            const measurements = [...pendingMasks].filter(([element]) => element.isConnected).map(([element, parts]) => {
                const box = element.getBoundingClientRect();
                const text = parts.source.getBoundingClientRect();
                const height = element.offsetHeight;
                const scale = (height > 0 ? box.height / height : 1) || 1;
                return { ...parts, top: Math.max(0, (box.top - text.top) / scale),
                    bottom: Math.max(0, (text.bottom - box.bottom) / scale),
                    leading: (box.height / scale - parseFloat(getComputedStyle(element).fontSize)) / 2 };
            });
            pendingMasks.clear();
            for (const { viewport, glyph, top, bottom, leading } of measurements) {
                const start = `calc(${top}px + var(--snowui-flow-text-mask-height))`;
                viewport.style.insetBlockStart = `calc(-1 * ${start})`;
                viewport.style.insetBlockEnd = `calc(-1 * (${bottom}px + var(--snowui-flow-text-mask-height)))`;
                glyph.style.insetBlockStart = `calc(${start} + ${leading}px)`;
            }
        });
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
                    if (existingSource.textContent !== label) existingSource.textContent = label;
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

        function startFlowTextWheelValueAnimation(
            wheel: HTMLElement,
            from: number,
            to: number,
            options: {
                duration: number;
                delay: number;
            },
        ) {
            return animateTextMotionDelta(wheel, FLOW_TEXT_WHEEL_VALUE_VAR, from, to, {
                ...options, easing: FLOW_TEXT_WHEEL_EASING,
            });
        }

        function getFlowTextWheelDuration(duration: number) { return duration; }

        function jumpFlowTextWheelValue(wheel: HTMLElement, value: number) {
            wheel.style.setProperty(FLOW_TEXT_WHEEL_VALUE_VAR, String(value));
        }

        function startEdgeWheelExitTransition(glyph: HTMLElement, edge: number, duration: number, easing: string, delay: number) {
            animateTextMotionDelta(glyph, FLOW_TEXT_Y_VAR, 0, edge, { duration, easing, delay });
            animateTextMotionOpacity(glyph, 0.001, { duration, easing, delay });
        }

        function startEdgeWheelEnterTransition(glyph: HTMLElement, edge: number, duration: number, easing: string, delay: number) {
            animateTextMotionDelta(glyph, FLOW_TEXT_Y_VAR, edge, 0, { duration, easing, delay });
            glyph.style.opacity = "1";
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
            // 首次由 updateWheelDigitActiveState 同时初始化语义与定位，
            // 不能预设 aria-hidden 而误触发“状态未变”的快速返回。
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
            if (digitElement.getAttribute("aria-hidden") === String(!isActive)) return;
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
            const preferredSign = getPreferredWheelSign(currentTrend);
            const stored = flowTextWheelStates.get(element);
            const state = stored?.currentLength === length ? stored : undefined;
            const reusableWheel = getReusableFlowTextWheel(glyph, length);
            const requestedAxisDirection = resolveWheelAxisDirection(previousValue, nextValue, preferredSign);
            let axisDirection = state?.axisDirection ?? requestedAxisDirection;
            let axisOffset = state?.axisOffset ?? 0;
            // 零在正负轴上是同一个锚点；首次从零减小也应直接进入负轴。
            let axisNextNumber = state?.previousRawValue ?? (previousDigit === 0 ? nextNumber : previousNumber);
            const currentTrackValue = state?.currentWheelValue ?? mapFlowTextDigitAxis(previousDigit, length, axisNextNumber, axisDirection, axisOffset);
            const switchesZeroAxis = previousDigit === 0 && ((axisNextNumber ?? 0) < 0) !== ((nextNumber ?? 0) < 0);
            const switchesDirection = axisDirection !== requestedAxisDirection;
            if (state && reusableWheel && (switchesZeroAxis || switchesDirection) &&
                !reusableWheel.getAnimations().some(animation => animation.playState === "running" || animation.playState === "paused")) {
                // 静止时只重排不可见数字，并保留中心字符的位置。播放中的轨道继续重定向。
                axisDirection = requestedAxisDirection;
                axisNextNumber = nextNumber;
                axisOffset = modBy(currentTrackValue - mapFlowTextDigitAxis(previousDigit, length, axisNextNumber, axisDirection), length);
            }
            const targetAxisValue = mapFlowTextDigitAxis(nextDigit, length, axisNextNumber, axisDirection, axisOffset);
            const preservesCurrentDigit = state?.currentDigit === nextDigit;
            const targetWheelValue = preservesCurrentDigit ? currentTrackValue : resolveTargetWheelValue(currentTrackValue, targetAxisValue, length, preferredSign);
            flowTextWheelStates.set(element, {
                currentDigit: nextDigit, currentWheelValue: targetWheelValue,
                currentLength: length, previousRawValue: axisNextNumber ?? null,
                axisDirection, axisOffset,
            });
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
            if (!reusableWheel) jumpFlowTextWheelValue(wheel, currentTrackValue);

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
                finalizeWheel: () => {
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
                      },
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
            const existing = getReusableFlowTextWheel(glyph, length);
            if (existing && isOut) {
                const current = Number.parseFloat(existing.style.getPropertyValue(FLOW_TEXT_WHEEL_VALUE_VAR));
                return { wheel: existing, previousAxisValue: current, targetWheelValue: current, preserveWheelRuntime: true, finalizeWheel: undefined };
            }
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
            onCleanup,
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
                ? delay + FLOW_TEXT_SIGN_EXIT_DELAY
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
            const edgeY = direction;
            const edgeExitY = direction >= 0 ? 1 : -1;
            const edgeEnterY = edgeExitY;
            const startY = isOut ? 0 : edgeY;
            const endY = isOut ? edgeY : 0;
            const startScaleY = isOut ? "1" : String(FLOW_TEXT_EDGE_SCALE_Y);
            const endScaleY = isOut ? String(FLOW_TEXT_EDGE_SCALE_Y) : "1";
            const hadViewport = Boolean(element.querySelector(`.${FLOW_TEXT_CHARACTER_VIEWPORT_CLASS}`));
            flowTextMaskCleanups.get(element)?.();
            const { viewport, glyph } = getCharacterViewport(element);
            const motionId = String(
                Number(element.dataset.flowTextMotionId ?? "0") + 1,
            );
            element.dataset.flowTextMotionId = motionId;

            glyph.style.display = "inline-block";
            glyph.style.lineHeight = "1";
            glyph.style.transform = `translateY(calc(var(${FLOW_TEXT_Y_VAR}, 0) * 1em)) scaleY(var(${FLOW_TEXT_SCALE_Y_VAR}, 1))`;
            if (!hadViewport) glyph.style.setProperty(FLOW_TEXT_Y_VAR, String(startY));
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
            if (wheelMotion && !hadViewport) {
                glyph.style.setProperty(FLOW_TEXT_Y_VAR, isEdgeWheelEnter ? String(edgeEnterY) : "0");
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
                      let wheelAnimation: Animation | undefined;
                      if (!wheelMotion.preserveWheelRuntime) {
                          wheelAnimation = startFlowTextWheelValueAnimation(
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
                      return wheelAnimation ?? wheelMotion.wheel.animate(
                          [],
                          {
                              duration: wheelDuration,
                              easing: "linear",
                              fill: "none",
                              delay: motionDelay,
                          },
                      );
                  })()
                : animateTextMotionDelta(glyph, FLOW_TEXT_Y_VAR, startY, endY, {
                      duration, easing, delay: motionDelay,
                  });
            const cleanupDuration = wheelMotion
                ? getFlowTextWheelDuration(duration)
                : duration;
            if (!wheelMotion) {
                if (startScaleY !== endScaleY) glyph.animate(
                    { [FLOW_TEXT_SCALE_Y_VAR]: [startScaleY, endScaleY] },
                    { duration: deformDuration, easing: deformEasing, fill: "backwards", delay: motionDelay },
                );
                animateTextMotionOpacity(glyph, isOut ? 0.001 : 1,
                    { duration: opacityDuration, easing: "ease-out", delay: motionDelay },
                    hadViewport ? undefined : isOut ? 1 : 0.0001);
            }
            let maskCleaned = false;
            const cleanupMask = () => {
                if (maskCleaned) return;
                if (element.dataset.flowTextMotionId !== motionId) return;
                maskCleaned = true;
                dispose();
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
            const dispose = () => {
                if (maskTimer) window.clearTimeout(maskTimer);
                window.clearTimeout(maskCleanupTimer);
                flowAnimation.removeEventListener("finish", cleanupMask);
                flowAnimation.removeEventListener("cancel", cleanupMask);
                flowTextMaskCleanups.delete(element);
                release();
            };
            const release = onCleanup(dispose);
            flowTextMaskCleanups.set(element, dispose);
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
            colorAllCharacters: true,
            accumulateLayout: true,
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
