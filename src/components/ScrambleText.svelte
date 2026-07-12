<!--
  ScrambleText 代码文字扰动动效组件
  v1.0.0

  职责：提供 PRO 级字符扰动后归位的文本动效。
  文档：./ScrambleText.md
-->

<script module lang="ts">
    import {
        animateTextMotionColor,
        cancelTextMotionColor,
    } from "../lib/text-motion/color";
    import { shouldReduceTextMotion } from "../lib/text-motion/preference";

    export type ScrambleTextCharset = "glyphs" | "symbols" | "numbers";
    export type ScrambleTextMode = "scramble" | "cascade";
    export type ScrambleTextAlign = "left" | "center" | "right" | "justify";

    export const MAX_CUSTOM_SEQUENCE_LENGTH = 64;

    const CHARSETS: Record<ScrambleTextCharset, string> = {
        glyphs: "a_&ぅ*@#$%お",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
        numbers: "0123456789",
    };
    const DEFAULT_DURATION = 800;
    const DEFAULT_DELAY = 0;
    const DEFAULT_SETTLE_DURATION = 250;
    const DEFAULT_SETTLE_RATE = 30;
    export const DEFAULT_CASCADE_SPEED = 90;
    export const DEFAULT_CASCADE_DELAY = 30;
    const BROWSER = typeof window !== "undefined";
    const ServerSafeHTMLElement = BROWSER
        ? HTMLElement
        : (class {} as typeof HTMLElement);
    const segmenter =
        BROWSER && "Segmenter" in Intl
            ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
            : undefined;

    function splitGraphemes(value: string) {
        if (!segmenter) return Array.from(value);
        return Array.from(segmenter.segment(value), (item) => item.segment);
    }

    function createRng(seed: number) {
        let s = seed | 0;
        return () => {
            s = (s + 0x6d2b79f5) | 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function randomChar(sequence: string[], rng: () => number) {
        return sequence[Math.floor(rng() * sequence.length)] ?? "";
    }

    interface ScrambleElementOptions {
        charset: ScrambleTextCharset;
        customSequence?: string;
        mode: ScrambleTextMode;
        cascadeSpeed: number;
        cascadeDelay: number;
        respectMotionPreference: boolean;
        motionColor: string;
    }

    class SnowUIScrambleTextElement extends ServerSafeHTMLElement {
        private value = "";
        private display = "";
        private rafId = 0;
        private runId = 0;
        private options: ScrambleElementOptions = {
            charset: "glyphs",
            mode: "cascade",
            cascadeSpeed: DEFAULT_CASCADE_SPEED,
            cascadeDelay: DEFAULT_CASCADE_DELAY,
            respectMotionPreference: false,
            motionColor: "",
        };

        connectedCallback() {
            if (!this.textContent && this.value) this.textContent = this.value;
        }

        disconnectedCallback() {
            this.cancel();
        }

        setOptions(options: ScrambleElementOptions) {
            const changed =
                this.options.charset !== options.charset ||
                this.options.customSequence !== options.customSequence ||
                this.options.mode !== options.mode ||
                this.options.cascadeSpeed !== options.cascadeSpeed ||
                this.options.cascadeDelay !== options.cascadeDelay ||
                this.options.respectMotionPreference !==
                    options.respectMotionPreference ||
                this.options.motionColor !== options.motionColor;
            this.options = options;
            return changed;
        }

        update(nextValue: string, animate: boolean, force = false) {
            const next = String(nextValue ?? "");
            if (!force && next === this.value && this.display === next) return;
            const fromText = this.display || this.value || next;
            this.value = next;

            if (!animate || this.shouldReduceMotion()) {
                this.cancel();
                this.display = next;
                this.textContent = next;
                return;
            }

            this.play(fromText, next);
        }

        replay() {
            this.play(this.value, this.value);
        }

        private shouldReduceMotion() {
            return shouldReduceTextMotion(
                this.options.respectMotionPreference,
            );
        }

        private cancel() {
            if (this.rafId) window.cancelAnimationFrame(this.rafId);
            cancelTextMotionColor(this);
            this.rafId = 0;
            this.runId += 1;
        }

        private resolveSequence() {
            const raw =
                this.options.customSequence ||
                CHARSETS[this.options.charset] ||
                CHARSETS.glyphs;
            const chars = splitGraphemes(raw).slice(
                0,
                MAX_CUSTOM_SEQUENCE_LENGTH,
            );
            return chars.length ? chars : splitGraphemes(CHARSETS.glyphs);
        }

        private renderText(value: string) {
            this.replaceChildren(document.createTextNode(value));
        }

        private play(fromText: string, toText: string) {
            if (this.options.mode === "cascade") {
                this.playCascade(fromText, toText);
                return;
            }

            this.cancel();

            const currentRun = this.runId;
            const seed = Math.floor(Math.random() * 2147483647) + currentRun;
            const rng = createRng(seed);
            const fromChars = splitGraphemes(fromText);
            const toChars = splitGraphemes(toText);
            const maxLen = Math.max(fromChars.length, toChars.length);
            const order = Array.from({ length: maxLen }, (_, index) => index);
            const ranks: number[] = [];
            order.forEach((index, rank) => {
                ranks[index] = rank;
            });

            const sequence = this.resolveSequence();
            const duration = DEFAULT_DURATION;
            const delay = DEFAULT_DELAY;
            const settleDuration = DEFAULT_SETTLE_DURATION;
            const settleRate = DEFAULT_SETTLE_RATE;
            const revealSpan = Math.max(0, duration - settleDuration);
            const revealInterval =
                maxLen > 1 ? revealSpan / Math.max(1, maxLen - 1) : 0;
            const startedAt = window.performance.now();
            animateTextMotionColor(
                this,
                this.options.motionColor,
                duration,
            );

            const tick = (now: number) => {
                if (currentRun !== this.runId) return;

                const elapsed = now - startedAt - delay;
                if (elapsed < 0) {
                    this.rafId = window.requestAnimationFrame(tick);
                    return;
                }

                const progress =
                    duration > 0
                        ? Math.min(Math.max(elapsed / duration, 0), 1)
                        : 1;
                const activeMs = progress * duration;

                if (progress >= 1) {
                    this.display = toText;
                    this.renderText(toText);
                    this.rafId = 0;
                    return;
                }

                const chars: string[] = [];
                for (let i = 0; i < maxLen; i += 1) {
                    const rank = ranks[i] ?? i;
                    const revealAt = revealInterval * rank;
                    const settleProgress = activeMs - revealAt;

                    if (settleProgress >= settleDuration) {
                        chars.push(toChars[i] ?? "");
                    } else if (settleProgress >= 0) {
                        const settleStep = Math.floor(
                            settleProgress / settleRate,
                        );
                        if (settleStep > 0) {
                            chars.push(randomChar(sequence, rng));
                        } else {
                            chars.push(
                                fromChars[i] ?? randomChar(sequence, rng),
                            );
                        }
                    } else if (progress === 0 && fromText) {
                        chars.push(fromChars[i] ?? "");
                    } else {
                        chars.push(randomChar(sequence, rng));
                    }
                }

                this.display = chars.join("");
                this.renderText(this.display);
                this.rafId = window.requestAnimationFrame(tick);
            };

            this.rafId = window.requestAnimationFrame(tick);
        }

        private playCascade(fromText: string, toText: string) {
            this.cancel();

            const currentRun = this.runId;
            const fromChars = splitGraphemes(fromText);
            const toChars = splitGraphemes(toText);
            const maxLen = Math.max(fromChars.length, toChars.length);
            const sequence = this.resolveSequence();
            const speedValue = Number(this.options.cascadeSpeed);
            const delayValue = Number(this.options.cascadeDelay);
            const speed = Math.max(
                1,
                Number.isFinite(speedValue)
                    ? speedValue
                    : DEFAULT_CASCADE_SPEED,
            );
            const delay = Math.max(
                0,
                Number.isFinite(delayValue)
                    ? delayValue
                    : DEFAULT_CASCADE_DELAY,
            );

            if (maxLen === 0) {
                this.display = "";
                this.renderText("");
                return;
            }

            const sequenceLength = sequence.length;
            const duration =
                sequenceLength * speed + Math.max(0, maxLen - 1) * delay;
            const startedAt = window.performance.now();
            animateTextMotionColor(
                this,
                this.options.motionColor,
                duration,
            );

            const tick = (now: number) => {
                if (currentRun !== this.runId) return;

                const elapsed = now - startedAt;
                if (elapsed >= duration) {
                    this.display = toText;
                    this.renderText(toText);
                    this.rafId = 0;
                    return;
                }

                const chars: string[] = [];
                for (let index = 0; index < maxLen; index += 1) {
                    const localElapsed = elapsed - index * delay;
                    if (localElapsed < 0) {
                        chars.push(fromChars[index] ?? "");
                        continue;
                    }

                    const sequenceIndex = Math.floor(localElapsed / speed);
                    if (sequenceIndex >= sequenceLength) {
                        chars.push(toChars[index] ?? "");
                    } else {
                        chars.push(sequence[sequenceIndex] ?? "");
                    }
                }

                this.display = chars.join("");
                this.renderText(this.display);
                this.rafId = window.requestAnimationFrame(tick);
            };

            this.rafId = window.requestAnimationFrame(tick);
        }
    }

    if (BROWSER && !customElements.get("snowui-scramble-text")) {
        customElements.define(
            "snowui-scramble-text",
            SnowUIScrambleTextElement,
        );
    }

    export type ScrambleTextElement = SnowUIScrambleTextElement;
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import type { SnowUIColor } from "@snowui-design-system/components/lib/color";
    import type { FrameProps } from "@snowui-design-system/components/logic/frame-types";
    import {
        DEFAULT_TEXT_MOTION_COLOR,
        type TextMotionAlign,
    } from "../lib/text-motion/types";
    import {
        createTextMotionTypographyStyle,
        resolveTextMotionColor,
    } from "../lib/text-motion/typography";
    import FramePro from "./FramePro.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        text?: string | number;
        charset?: ScrambleTextCharset;
        customSequence?: string;
        mode?: ScrambleTextMode;
        respectMotionPreference?: boolean;
        font?: string;
        size?: string | number;
        weight?: string | number;
        color?: SnowUIColor | string;
        lineHeight?: string | number;
        align?: TextMotionAlign;
        motionColor?: SnowUIColor | string;
        [key: string]: any;
    }

    let {
        text = "",
        charset = "glyphs",
        customSequence = undefined,
        mode = "cascade",
        respectMotionPreference = false,
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

    let hasMounted = $state(false);
    let scrambleElement = $state<ScrambleTextElement | undefined>(undefined);

    const displayText = $derived(String(text ?? ""));
    const rootStyle = $derived.by(() => {
        return createTextMotionTypographyStyle(
            "scramble-text",
            { font, size, weight, color, lineHeight, align, motionColor },
            userStyle,
        );
    });

    onMount(() => {
        hasMounted = true;
        scrambleElement?.replay();
    });

    $effect(() => {
        if (!scrambleElement) return;
        const optionsChanged = scrambleElement.setOptions({
            charset,
            customSequence,
            mode,
            cascadeSpeed: DEFAULT_CASCADE_SPEED,
            cascadeDelay: DEFAULT_CASCADE_DELAY,
            respectMotionPreference,
            motionColor: resolveTextMotionColor(motionColor),
        });
        scrambleElement.update(displayText, hasMounted, optionsChanged);
    });
</script>

<FramePro
    {tag}
    class={["snowui-scramble-text", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    data-align={align}
    role="img"
    aria-label={displayText}
    enableAutoLayout={false}
    {enableResponsive}
    {enableContext}
    {enableScaleObserver}
    {enableDefaultMotion}
    {...rest}
>
    <svelte:element
        this={"snowui-scramble-text"}
        bind:this={scrambleElement}
        class="snowui-scramble-text-output"
        aria-hidden="true"
    >
        {displayText}
    </svelte:element>
</FramePro>

<style>
    :global(:where(.snowui-scramble-text)) {
        display: inline-flex;
        max-width: 100%;
        min-width: 0;
        font-family: var(--snowui-scramble-text-font, inherit);
        font-size: var(--snowui-scramble-text-size, inherit);
        font-weight: var(--snowui-scramble-text-weight, inherit);
        color: var(--snowui-scramble-text-color, inherit);
        line-height: var(--snowui-scramble-text-line-height, inherit);
        letter-spacing: inherit;
        white-space: pre-wrap;
        vertical-align: baseline;
        justify-content: flex-start;
        text-align: var(--snowui-scramble-text-align, inherit);
    }

    :global(:where(.snowui-scramble-text[data-align="center"])) {
        justify-content: center;
        text-align: center;
    }

    :global(:where(.snowui-scramble-text[data-align="right"])) {
        justify-content: flex-end;
        text-align: right;
    }

    :global(:where(.snowui-scramble-text[data-align="justify"])) {
        justify-content: stretch;
        text-align: justify;
    }

    :global(:where(.snowui-scramble-text-output)) {
        display: inline;
        min-width: 0;
        font: inherit;
        color: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        white-space: inherit;
    }
</style>
