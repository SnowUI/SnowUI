<!--
  SlotText 槽位滚动文字动效组件
  v1.11.1

  职责：提供逐字符纵向 slot roll 文本切换动效，并统一数字趋势与数位顺序。
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { animateTextMotionFace, animateTextMotionOpacity } from "../lib/text-motion/animation";
    import {
        TEXT_MOTION_COLOR_FADE_MS,
        animateTextMotionColorSequence,
    } from "../lib/text-motion/color";
    import {
        captureTextMotionRects,
        flipTextMotionElement,
        playTextMotionLayout,
        splitTextMotionGraphemes,
        type TextMotionTransition,
    } from "../lib/text-motion/layout";
    import { shouldReduceTextMotion } from "../lib/text-motion/preference";
    import {
        resolveTextMotionTrend,
    } from "../lib/text-motion/numeric";
    import {
        createTextMotionOrder,
    } from "../lib/text-motion/sequence";
    import {
        commitTextMotionTimeline,
        createTextMotionTimelinePlan,
    } from "../lib/text-motion/timeline";
    import type {
        TextMotionColor as TextMotionColorValue,
        TextMotionRole as TextMotionRoleValue,
        TextMotionTrend,
    } from "../lib/text-motion/types";

    export type SlotTextDirection = "normal" | "reverse";
    export type SlotTextTrend = TextMotionTrend;
    export interface SlotTextTransition {
        stagger?: number;
        duration?: number;
        layoutDuration?: number;
        exitOffset?: number;
        colorFade?: number;
    }

    interface ResolvedSlotTextOptions {
        direction: SlotTextDirection;
        trend: SlotTextTrend;
        motionRole: TextMotionRoleValue;
        stagger: number;
        duration: number;
        layoutDuration: number;
        exitOffset: number;
        easing: string;
        bounce: number;
        colorFade: number;
        motionColor: TextMotionColorValue;
        skipUnchanged: boolean;
        interrupt: boolean;
        animated: boolean;
        respectMotionPreference: boolean;
    }

    const BROWSER = typeof window !== "undefined";
    const NBSP = "\u00A0";
    const ServerSafeHTMLElement = BROWSER
        ? HTMLElement
        : (class {} as typeof HTMLElement);

    const DEFAULT_OPTIONS: ResolvedSlotTextOptions = {
        direction: "normal",
        trend: 0,
        motionRole: "auto",
        stagger: 45,
        duration: 300,
        layoutDuration: 900,
        exitOffset: 50,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        bounce: 0.6,
        colorFade: TEXT_MOTION_COLOR_FADE_MS,
        motionColor: "",
        skipUnchanged: true,
        interrupt: true,
        animated: true,
        respectMotionPreference: false,
    };

    function glyph(char: string) {
        return char === " " ? NBSP : char;
    }

    function clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }

    function isSlotTextNumericContent(value: string) {
        const withoutClock = value.replace(/\d+(?:[:：]\d+){1,}/g, "");
        const withoutNumbers = withoutClock.replace(
            /[-+]?[\d,，]+(?:[.．]\d+)?|[-+]?[.．]\d+/g,
            "",
        );
        return !/[A-Za-z\p{L}]/u.test(withoutNumbers);
    }

    function getSlotTextTransition(options: ResolvedSlotTextOptions): TextMotionTransition {
        return {
            duration: options.layoutDuration,
            easing: options.easing,
        };
    }

    function makeFace(char: string) {
        const face = document.createElement("span");
        face.className = "snowui-slot-text-face";
        face.textContent = glyph(char);
        return face;
    }

    function buildSlot(char: string) {
        const slot = document.createElement("span");
        slot.className = "snowui-slot-text-slot";
        slot.dataset.char = char;

        const sizer = document.createElement("span");
        sizer.className = "snowui-slot-text-sizer";
        sizer.textContent = glyph(char);

        slot.append(sizer, makeFace(char));
        return slot;
    }

    interface SlotState {
        timer?: number;
        end: number;
        exiting: Set<HTMLElement>;
        target: string;
        pending?: { text: string; options: ResolvedSlotTextOptions };
    }

    const states = new WeakMap<HTMLElement, SlotState>();

    function buildSlotText(container: HTMLElement, text: string) {
        container.replaceChildren(...splitTextMotionGraphemes(text).map(buildSlot));
    }

    function createNumericSlotPairing(
        oldSlots: HTMLElement[],
        newSlots: HTMLElement[],
    ) {
        const oldDigitIndexes = oldSlots
            .map((slot, index) => (/^\d$/.test(slot.dataset.char ?? "") ? index : -1))
            .filter((index) => index >= 0);
        const newDigitIndexes = newSlots
            .map((slot, index) => (/^\d$/.test(slot.dataset.char ?? "") ? index : -1))
            .filter((index) => index >= 0);
        const pairCount = Math.min(oldDigitIndexes.length, newDigitIndexes.length);
        const oldOffset = oldDigitIndexes.length - pairCount;
        const newOffset = newDigitIndexes.length - pairCount;
        const oldToNewIndexes = new Map<number, number>();

        for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
            oldToNewIndexes.set(
                oldDigitIndexes[oldOffset + pairIndex],
                newDigitIndexes[newOffset + pairIndex],
            );
        }

        return oldToNewIndexes;
    }

    function settle(container: HTMLElement) {
        const state = states.get(container);
        if (!state) return;
        window.clearTimeout(state.timer);
        states.delete(container);
        for (const animation of container.getAnimations({ subtree: true })) animation.cancel();
        buildSlotText(container, state.target);
    }

    function animateSlotText(
        container: HTMLElement,
        toText: string,
        options: ResolvedSlotTextOptions,
    ) {
        if (
            !options.animated ||
            shouldReduceTextMotion(options.respectMotionPreference)
        ) {
            settle(container);
            buildSlotText(container, toText);
            return;
        }

        const running = states.get(container);
        if (running && !options.interrupt) {
            if (toText !== running.target) running.pending = { text: toText, options };
            return;
        }

        // 保留旧画面和旧动画，新的差值叠加到当前轨迹。
        if (running) window.clearTimeout(running.timer);

        if (!container.querySelector(".snowui-slot-text-slot")) {
            buildSlotText(container, toText);
            return;
        }

        const slots = Array.from(
            container.querySelectorAll<HTMLElement>(".snowui-slot-text-slot:not([data-exiting])"),
        );
        const fromText = slots.map((slot) => slot.dataset.char ?? "").join("");
        if (!options.interrupt && fromText === toText) return;

        const toChars = splitTextMotionGraphemes(toText);
        const {
            trend: numericTrend,
            isNumericArithmetic: resolvedNumericArithmetic,
        } = resolveTextMotionTrend(
            fromText,
            toText,
            options.trend,
            options.motionRole,
        );
        const isNumericArithmetic =
            resolvedNumericArithmetic &&
            (
                options.motionRole !== "auto" ||
                (
                    isSlotTextNumericContent(fromText) &&
                    isSlotTextNumericContent(toText)
                )
            );
        const tailSlots = slots.slice(toChars.length);
        const recompositionSlots = slots.slice(0, toChars.length);
        const timeline = createTextMotionTimelinePlan(
            recompositionSlots,
            toChars,
            (slot) => slot.dataset.char ?? "",
            buildSlot,
        );
        const {
            prefixCount,
            oldMiddleNodes: recompositionExitingSlots,
            newMiddleNodes: newMiddleSlots,
            nextNodes: nextSlots,
            preservedNodes: preservedSlots,
        } = timeline;
        const exitCandidates = [...recompositionExitingSlots, ...tailSlots];
        const exitOpacities = new Map(exitCandidates.map(slot => {
            const face = slot.querySelector<HTMLElement>(".snowui-slot-text-face");
            return [slot, face ? Number.parseFloat(getComputedStyle(face).opacity) : 0];
        }));
        // 尚未显现的旧目标无需再做退场，避免快速更新积累不可见动画。
        const exitingSlots = exitCandidates.filter(slot => (exitOpacities.get(slot) ?? 0) > 0.001);
        const discardedSlots = exitCandidates.filter(slot => !exitingSlots.includes(slot));
        const numericExitPairing = isNumericArithmetic
            ? createNumericSlotPairing(recompositionExitingSlots, newMiddleSlots)
            : new Map<number, number>();
        const effectiveNumericTrend =
            options.direction === "reverse"
                ? -numericTrend
                : numericTrend;
        const textTrend = options.direction === "reverse" ? -1 : 1;
        const effectiveDirection =
            isNumericArithmetic
                ? effectiveNumericTrend > 0
                    ? "up"
                    : "down"
                : textTrend > 0
                  ? "up"
                  : "down";
        const enterOrderByIndex = createTextMotionOrder(
            Array.from({ length: newMiddleSlots.length }, (_, index) => index),
            isNumericArithmetic ? "right-to-left" : "left-to-right",
        );
        const exitOrderByIndex = createTextMotionOrder(
            Array.from(
                { length: recompositionExitingSlots.length },
                (_, index) => index,
            ),
            isNumericArithmetic ? "right-to-left" : "left-to-right",
        );

        const previousExits = [...(running?.exiting ?? [])];
        const state: SlotState = running ?? { end: 0, exiting: new Set(), target: toText };
        state.target = toText;
        state.pending = undefined;
        const now = performance.now();
        states.set(container, state);

        const outY = effectiveDirection === "down" ? 1 : -1;
        const inStart = -outY;
        const layoutTransition = getSlotTextTransition(options);
        const wobble = (index: number, salt: number) => {
            const n = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
            return (n - Math.floor(n)) * 2 - 1;
        };

        let maxEnd = Math.max(0, state.end - now);
        const enterPlans = new Map<
            HTMLElement,
            {
                base: number;
                duration: number;
                tilt: number;
            }
        >();
        for (let index = 0; index < newMiddleSlots.length; index += 1) {
            const slot = newMiddleSlots[index];
            const charIndex = prefixCount + index;
            const face = slot.querySelector<HTMLElement>(".snowui-slot-text-face");
            if (!face) continue;

            const bounce = clamp(options.bounce, 0, 1);
            const duration = Math.max(
                0,
                Math.round(
                    options.duration *
                        (1 + bounce * 0.45 * wobble(charIndex, 1)),
                ),
            );
            const order = enterOrderByIndex.get(index) ?? index;
            const staggerIndex = isNumericArithmetic ? order : index;
            const base = Math.round(
                staggerIndex *
                    options.stagger *
                    (1 + bounce * 0.25 * wobble(charIndex, 2)),
            );
            const tilt = (bounce * 5 * wobble(charIndex, 3)).toFixed(2);
            const tint = typeof options.motionColor === "function"
                ? options.motionColor(charIndex, toChars.length) : options.motionColor;
            face.style.transform = `translateY(${inStart}em) rotate(${tilt}deg)`;
            face.style.opacity = "0";
            if (tint) face.style.color = tint;
            enterPlans.set(face, { base, duration, tilt: Number(tilt) });

            maxEnd = Math.max(
                maxEnd,
                base +
                    options.exitOffset +
                    duration +
                    (options.motionColor ? options.colorFade : 0),
            );
        }

        commitTextMotionTimeline({
            plan: timeline,
            capture: () => ({
                containerRect: container.getBoundingClientRect(),
                exitingRects: captureTextMotionRects(exitingSlots),
                preservedRects: captureTextMotionRects(preservedSlots),
                exitPositions: new Map([...previousExits, ...exitingSlots].map(slot => [slot, slot.offsetLeft])),
            }),
            commit: (_, snapshot) => {
                for (const slot of discardedSlots) {
                    for (const animation of slot.getAnimations({ subtree: true })) animation.cancel();
                    slot.remove();
                }
                for (const slot of exitingSlots) {
                    const rect = snapshot.exitingRects.get(slot);
                    if (!rect) continue;
                    slot.dataset.exiting = "";
                    state.exiting.add(slot);
                    slot.style.position = "absolute";
                    slot.style.left = `${snapshot.exitPositions.get(slot)}px`;
                    slot.style.top = "0px";
                    slot.style.width = `${rect.width}px`;
                    slot.style.height = `${rect.height}px`;
                    slot.style.zIndex = "2";
                    slot.style.pointerEvents = "none";
                }
                container.replaceChildren(...nextSlots, ...previousExits, ...exitingSlots);
            },
            playLayout: (_, snapshot) => {
                const nextContainerRect = container.getBoundingClientRect();
                const targetRects = captureTextMotionRects(newMiddleSlots);
                for (const slot of [...previousExits, ...exitingSlots]) {
                    slot.style.left = `${(snapshot.exitPositions.get(slot) ?? 0) + snapshot.containerRect.left - nextContainerRect.left}px`;
                }
                playTextMotionLayout(
                    preservedSlots,
                    snapshot.preservedRects,
                    layoutTransition,
                    true,
                );
                if (isNumericArithmetic) {
                    for (const [oldIndex, newIndex] of numericExitPairing) {
                        const slot = recompositionExitingSlots[oldIndex];
                        const targetSlot = newMiddleSlots[newIndex];
                        const previousRect = snapshot.exitingRects.get(slot);
                        if (!slot || !targetSlot || !previousRect) continue;
                        const targetRect = targetRects.get(targetSlot)!;
                        const nextLeft = targetRect.left - nextContainerRect.left;
                        const nextTop = targetRect.top - nextContainerRect.top;
                        slot.style.left = `${nextLeft}px`;
                        slot.style.top = `${nextTop}px`;
                        flipTextMotionElement(
                            slot,
                            (snapshot.exitPositions.get(slot) ?? 0) + snapshot.containerRect.left - targetRect.left,
                            layoutTransition,
                            true,
                        );
                    }
                }
            },
        });
        maxEnd = Math.max(
            maxEnd,
            layoutTransition.layoutDuration ?? layoutTransition.duration,
        );

        for (const [face, plan] of enterPlans) {
            const timing = { duration: plan.duration, easing: options.easing, delay: plan.base + options.exitOffset };
            animateTextMotionFace(face, inStart, 0, plan.tilt, 0, timing);
            animateTextMotionOpacity(face, 1, timing, 0);
            face.style.color = "";
        }

        const colorFaces = nextSlots.map(slot => slot.querySelector<HTMLElement>(".snowui-slot-text-face")!);
        maxEnd = Math.max(maxEnd, animateTextMotionColorSequence(colorFaces, options.motionColor, toChars, {
            duration: options.duration + options.exitOffset,
            stagger: options.stagger,
            fadeDuration: options.colorFade,
        }));

        const exitingPlans = exitingSlots.map((slot) => {
            const recompositionIndex = recompositionExitingSlots.indexOf(slot);
            const isTail = recompositionIndex === -1;
            const charIndex = isTail
                ? slots.indexOf(slot)
                : prefixCount + recompositionIndex;
            return {
                slot,
                isTail,
                charIndex,
                localIndex: Math.max(0, recompositionIndex),
            };
        });
        for (const { slot, isTail, charIndex, localIndex } of exitingPlans) {
            const oldFace = slot.querySelector<HTMLElement>(".snowui-slot-text-face");
            if (!oldFace) {
                slot.remove();
                continue;
            }

            const bounce = clamp(options.bounce, 0, 1);
            const duration = Math.max(
                0,
                Math.round(
                    options.duration *
                        (isTail ? 0.75 : 1) *
                        (1 + bounce * 0.45 * wobble(charIndex, 1)),
                ),
            );
            const order = exitOrderByIndex.get(localIndex) ?? localIndex;
            const tailIndex = Math.max(0, charIndex - toChars.length);
            const staggerIndex = isTail
                ? toChars.length * 0.5 + tailIndex * 0.25
                : isNumericArithmetic
                  ? order
                  : localIndex;
            const base = Math.round(
                staggerIndex *
                    options.stagger *
                    (1 + bounce * 0.25 * wobble(charIndex, 2)),
            );
            const tilt = (bounce * 5 * wobble(charIndex, 3)).toFixed(2);
            maxEnd = Math.max(maxEnd, base + duration);
            const timing = { duration, easing: options.easing, delay: base };
            const motion = animateTextMotionFace(oldFace, 0, outY, 0, -Number(tilt), timing);
            animateTextMotionOpacity(oldFace, 0, timing, exitOpacities.get(slot));
            motion.onfinish = () => {
                for (const animation of slot.getAnimations({ subtree: true })) animation.cancel();
                state.exiting.delete(slot);
                slot.remove();
            };
        }

        state.end = now + maxEnd;
        state.timer = window.setTimeout(() => {
            if (states.get(container) !== state) return;
            const pending = state.pending;
            for (const slot of state.exiting) slot.remove();
            states.delete(container);
            if (pending) animateSlotText(container, pending.text, pending.options);
        }, maxEnd + 80);
    }

    class SnowUISlotTextElement extends ServerSafeHTMLElement {
        private value = "";
        private options: ResolvedSlotTextOptions = DEFAULT_OPTIONS;

        disconnectedCallback() {
            if (BROWSER) settle(this);
        }

        setOptions(options: Partial<ResolvedSlotTextOptions>) {
            this.options = { ...DEFAULT_OPTIONS, ...options };
        }

        update(nextValue: string | number, animate: boolean) {
            const next = String(nextValue ?? "");
            if (next === this.value && this.querySelector(".snowui-slot-text-slot")) {
                return;
            }
            this.value = next;
            animateSlotText(this, next, { ...this.options, animated: animate });
        }

        replay(fromText?: string) {
            const current = this.value;
            const source =
                fromText ??
                splitTextMotionGraphemes(current)
                    .map(() => " ")
                    .join("");
            settle(this);
            buildSlotText(this, source);
            animateSlotText(this, current, this.options);
        }
    }

    if (BROWSER && !customElements.get("snowui-slot-text")) {
        customElements.define("snowui-slot-text", SnowUISlotTextElement);
    }

    export type SlotTextElement = SnowUISlotTextElement;
</script>

<script lang="ts">
    import type { SnowUIColor } from "@snowui-design-system/components/lib/color";
    import type { FrameProps } from "@snowui-design-system/components/logic/frame-types";
    import {
        DEFAULT_TEXT_MOTION_COLOR,
        type TextMotionAlign,
        type TextMotionColor,
        type TextMotionRole as SlotTextMotionRole,
    } from "../lib/text-motion/types";
    import {
        createTextMotionTypographyStyle,
        resolveTextMotionColor,
    } from "../lib/text-motion/typography";
    import FramePro from "./FramePro.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        text?: string | number;
        direction?: SlotTextDirection;
        trend?: SlotTextTrend;
        motionRole?: SlotTextMotionRole;
        skipUnchanged?: boolean;
        interrupt?: boolean;
        replayKey?: string | number;
        playOnMount?: boolean;
        animated?: boolean;
        respectMotionPreference?: boolean;
        transition?: Partial<SlotTextTransition>;
        font?: string;
        size?: string | number;
        weight?: string | number;
        color?: SnowUIColor | string;
        lineHeight?: string | number;
        align?: TextMotionAlign;
        motionColor?: TextMotionColor;
        [key: string]: any;
    }

    let {
        text = "",
        direction: directionProp = undefined,
        trend = DEFAULT_OPTIONS.trend,
        motionRole = DEFAULT_OPTIONS.motionRole,
        skipUnchanged = DEFAULT_OPTIONS.skipUnchanged,
        interrupt = DEFAULT_OPTIONS.interrupt,
        replayKey = 0,
        playOnMount = false,
        animated = true,
        respectMotionPreference = false,
        transition = undefined,
        font = undefined,
        size = undefined,
        weight = undefined,
        color = undefined,
        lineHeight = undefined,
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
    let slotElement = $state<SlotTextElement | undefined>(undefined);
    let previousReplayKey = $state<string | number | undefined>(undefined);
    let replayText = "";

    const displayText = $derived(String(text ?? ""));
    const direction = $derived(directionProp ?? DEFAULT_OPTIONS.direction);
    const numericVariant = $derived(
        motionRole === "number" ||
            motionRole === "timer" ||
            motionRole === "countdown" ||
            (motionRole === "auto" && isSlotTextNumericContent(displayText))
            ? "tabular"
            : "normal",
    );
    const rootStyle = $derived.by(() => {
        return createTextMotionTypographyStyle(
            "slot-text",
            { font, size, weight, color, lineHeight, align, motionColor },
            userStyle,
        );
    });

    $effect(() => {
        if (!slotElement) return;
        const shouldAnimate = hasMounted && animated;
        slotElement.setOptions({
            direction,
            trend,
            motionRole,
            stagger: transition?.stagger ?? DEFAULT_OPTIONS.stagger,
            duration: transition?.duration ?? DEFAULT_OPTIONS.duration,
            layoutDuration:
                transition?.layoutDuration ?? DEFAULT_OPTIONS.layoutDuration,
            exitOffset: transition?.exitOffset ?? DEFAULT_OPTIONS.exitOffset,
            easing: DEFAULT_OPTIONS.easing,
            bounce: DEFAULT_OPTIONS.bounce,
            colorFade: transition?.colorFade ?? DEFAULT_OPTIONS.colorFade,
            motionColor:
                typeof motionColor === "function"
                    ? motionColor
                    : resolveTextMotionColor(motionColor),
            skipUnchanged,
            interrupt,
            animated,
            respectMotionPreference,
        });
        slotElement.update(displayText, shouldAnimate);
        if (!hasMounted) {
            hasMounted = true;
            previousReplayKey = replayKey;
            replayText = displayText;
            if (playOnMount) {
                window.requestAnimationFrame(() => slotElement?.replay());
            }
        }
    });

    $effect(() => {
        if (!slotElement || !hasMounted) return;
        if (previousReplayKey === undefined) {
            previousReplayKey = replayKey;
            replayText = displayText;
            return;
        }
        if (displayText !== replayText) {
            previousReplayKey = replayKey;
            replayText = displayText;
            return;
        }
        if (replayKey === previousReplayKey) return;
        previousReplayKey = replayKey;
        window.requestAnimationFrame(() => slotElement?.replay());
    });
</script>

<FramePro
    {tag}
    class={["snowui-slot-text", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    data-align={align}
    data-numeric-variant={numericVariant}
    role="img"
    aria-label={displayText}
    enableAutoLayout={false}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? `calc(${Math.max(1, Array.from(displayText).length)}ch + 0.5rem)`,
        height: rest.renderHints?.height ?? "1.25rem",
        radius: rest.renderHints?.radius,
        rows: rest.renderHints?.rows,
    }}
>
    <svelte:element
        this={"snowui-slot-text"}
        bind:this={slotElement}
        class="snowui-slot-text-output"
        aria-hidden="true"
    >
        {displayText}
    </svelte:element>
</FramePro>

<style>
    :global(:where(.snowui-slot-text)) {
        display: inline-flex;
        max-width: 100%;
        min-width: 0;
        font-family: var(--snowui-slot-text-font, inherit);
        font-size: var(--snowui-slot-text-size, inherit);
        font-weight: var(--snowui-slot-text-weight, inherit);
        color: var(--snowui-slot-text-color, inherit);
        line-height: var(--snowui-slot-text-line-height, inherit);
        font-variant-numeric: normal;
        letter-spacing: inherit;
        white-space: pre;
        vertical-align: baseline;
        justify-content: flex-start;
        text-align: var(--snowui-slot-text-align, inherit);
    }

    :global(:where(.snowui-slot-text[data-align="center"])) {
        justify-content: center;
        text-align: center;
    }

    :global(:where(.snowui-slot-text[data-align="right"])) {
        justify-content: flex-end;
        text-align: right;
    }

    :global(:where(.snowui-slot-text[data-align="justify"])) {
        justify-content: stretch;
        text-align: justify;
    }

    :global(:where(.snowui-slot-text-output)) {
        position: relative;
        display: inline-flex;
        min-width: 0;
        flex: none;
        font: inherit;
        color: inherit;
        line-height: inherit;
        font-variant-numeric: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        white-space: inherit;
    }

    :global(:where(.snowui-slot-text-slot)) {
        position: relative;
        display: inline-flex;
        flex: none;
        justify-content: center;
        overflow: visible;
        clip-path: inset(calc((100% - 1em) / 2 - 0.2em) -1em);
        line-height: inherit;
        vertical-align: bottom;
    }

    :global(:where(.snowui-slot-text-sizer)) {
        visibility: hidden;
        white-space: pre;
        font: inherit;
        font-variant-numeric: inherit;
        line-height: inherit;
    }

    :global(:where(.snowui-slot-text-face)) {
        position: absolute;
        inset-inline: 0;
        top: 50%;
        margin-top: -0.5em;
        height: 1em;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: pre;
        font: inherit;
        color: inherit;
        font-variant-numeric: inherit;
        line-height: 1;
        will-change: transform, opacity;
    }

    :global(:where(.snowui-slot-text[data-numeric-variant="tabular"])) {
        font-variant-numeric: tabular-nums;
    }
</style>
