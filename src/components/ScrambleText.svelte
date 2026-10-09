<!--
  ScrambleText 代码文字扰动动效组件
  v1.4.0

  职责：提供 PRO 级字符扰动后归位的文本动效。
  文档：./ScrambleText.md
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import {
        animateTextMotionColorSequence,
        cancelTextMotionColor,
    } from "../lib/text-motion/color";
    import { shouldReduceTextMotion } from "../lib/text-motion/preference";
    import type { TextMotionColor } from "../lib/text-motion/types";

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
    import { splitTextMotionGraphemes as splitGraphemes } from "../lib/text-motion/layout";

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
        motionColor?: TextMotionColor;
    }

    interface ScrambleCharacter {
        source: string;
        target: string;
        current: string;
        start: number;
        reveal: number;
        end: number;
        step: number;
    }

    class SnowUIScrambleTextElement extends ServerSafeHTMLElement {
        private value = "";
        private display = "";
        private rafId = 0;
        private characters: ScrambleCharacter[] = [];
        private textNode: Text | undefined;
        private colorNodes: HTMLElement[] = [];
        private sequence: string[] = [];
        private rng = createRng(1);
        private options: ScrambleElementOptions = {
            charset: "glyphs", mode: "cascade",
            cascadeSpeed: DEFAULT_CASCADE_SPEED,
            cascadeDelay: DEFAULT_CASCADE_DELAY,
            respectMotionPreference: false, motionColor: undefined,
        };

        connectedCallback() {
            this.renderText(this.value);
        }

        disconnectedCallback() { this.cancel(); }

        setOptions(options: Partial<ScrambleElementOptions>) {
            const next = { ...this.options, ...options };
            const changed = (Object.keys(next) as (keyof ScrambleElementOptions)[])
                .some(key => next[key] !== this.options[key]);
            if (next.charset !== this.options.charset || next.customSequence !== this.options.customSequence) this.sequence = [];
            this.options = next;
            return changed;
        }

        update(nextValue: string | number, animate: boolean, force = false) {
            const next = String(nextValue ?? "");
            // Svelte 的初始文本也可能更新；立即恢复当前画面，不能短暂暴露最终值。
            if (!force && next === this.value) {
                this.renderText(this.display);
                return;
            }
            const from = this.display || this.value || next;
            this.value = next;
            if (!animate || shouldReduceTextMotion(this.options.respectMotionPreference)) {
                this.cancel(); this.display = next; this.renderText(next); return;
            }
            this.play(from, next, force);
        }

        replay() { this.play(this.value, this.value, true); }

        private cancel() {
            if (this.rafId) window.cancelAnimationFrame(this.rafId);
            this.rafId = 0;
            this.characters = [];
            this.colorNodes.forEach(cancelTextMotionColor);
        }

        private renderText(value: string) {
            if (this.options.motionColor) {
                const labels = this.characters.length ? this.characters.map(char => char.current) : splitGraphemes(value);
                while (this.colorNodes.length > labels.length) {
                    const node = this.colorNodes.pop()!;
                    cancelTextMotionColor(node);
                    node.remove();
                }
                while (this.colorNodes.length < labels.length) {
                    const node = document.createElement("span");
                    node.className = "snowui-scramble-text-character";
                    node.setAttribute("aria-hidden", "true");
                    this.colorNodes.push(node);
                }
                if (this.firstChild !== this.colorNodes[0] || this.childNodes.length !== this.colorNodes.length) this.replaceChildren(...this.colorNodes);
                labels.forEach((label, index) => {
                    if (this.colorNodes[index].textContent !== label) this.colorNodes[index].textContent = label;
                });
                return;
            }
            this.colorNodes.forEach(cancelTextMotionColor);
            this.colorNodes = [];
            // 复用同一 Text 节点。cascade 两次换字之间不产生 DOM 写入。
            if (this.textNode?.parentNode !== this) {
                this.textNode = this.firstChild instanceof Text ? this.firstChild : document.createTextNode(value);
                if (this.childNodes.length !== 1 || this.firstChild !== this.textNode) this.replaceChildren(this.textNode);
            }
            if (this.textNode.data !== value) this.textNode.data = value;
        }

        private play(from: string, to: string, restart = false) {
            if (shouldReduceTextMotion(this.options.respectMotionPreference)) {
                this.cancel(); this.display = to; this.renderText(to); return;
            }
            if (restart) this.cancel();
            const running = Boolean(this.rafId);
            const now = performance.now();
            const old = this.characters;
            const source = splitGraphemes(from);
            const target = splitGraphemes(to);
            const length = Math.max(source.length, target.length, running ? old.length : 0);
            if (!this.sequence.length) this.sequence = splitGraphemes(this.options.customSequence || CHARSETS[this.options.charset]).slice(0, MAX_CUSTOM_SEQUENCE_LENGTH);
            const cascade = this.options.mode === "cascade";
            const speed = Math.max(1, Number.isFinite(this.options.cascadeSpeed) ? this.options.cascadeSpeed : DEFAULT_CASCADE_SPEED);
            const delay = Math.max(0, Number.isFinite(this.options.cascadeDelay) ? this.options.cascadeDelay : DEFAULT_CASCADE_DELAY);
            const interval = length <= 1 ? 0 : (DEFAULT_DURATION - DEFAULT_SETTLE_DURATION) / (length - 1);
            this.characters = Array.from({length}, (_, index) => {
                const previous = running ? old[index] : undefined;
                if (previous && (now < previous.end || previous.target === (target[index] ?? ""))) {
                    // 重定向只改终点，正在播放或等待的字符延续自己的时钟。
                    previous.target = target[index] ?? "";
                    return previous;
                }
                const start = now + (running && previous ? 0 : cascade ? index * delay : DEFAULT_DELAY);
                return { source: previous?.current ?? source[index] ?? "", current: previous?.current ?? source[index] ?? "",
                    target: target[index] ?? "", start,
                    reveal: start + (cascade ? 0 : index * interval),
                    end: start + (cascade ? this.sequence.length * speed : index * interval + DEFAULT_SETTLE_DURATION), step: -1 };
            });
            this.display = from;
            this.renderText(from);
            const end = Math.max(now, ...this.characters.map(char => char.end));
            const motionColor = this.options.motionColor;
            if (motionColor) {
                animateTextMotionColorSequence(this.colorNodes.slice(0, target.length), motionColor, target, {
                    duration: end - now,
                });
            }
            if (!running) {
                this.rng = createRng(Math.floor(Math.random() * 0x7fffffff));
                this.rafId = window.requestAnimationFrame(this.tick);
            }
        }

        private tick = (now: number) => {
            let active = false;
            const cascade = this.options.mode === "cascade";
            const speed = Math.max(1, Number.isFinite(this.options.cascadeSpeed) ? this.options.cascadeSpeed : DEFAULT_CASCADE_SPEED);
            for (const char of this.characters) {
                if (now >= char.end) { char.current = char.target; continue; }
                active = true;
                if (now < char.start) continue;
                const step = Math.floor((now - char.start) / (cascade ? speed : DEFAULT_SETTLE_RATE));
                if (step === char.step) continue;
                char.step = step;
                char.current = cascade ? this.sequence[step] ?? char.target :
                    now >= char.reveal && now < char.reveal + DEFAULT_SETTLE_RATE ? char.source : randomChar(this.sequence, this.rng);
            }
            this.display = active ? this.characters.map(char => char.current).join("") : this.value;
            if (!active) this.characters = [];
            this.renderText(this.display);
            this.rafId = active ? window.requestAnimationFrame(this.tick) : 0;
        };
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
    import { observeAppearanceRelease } from "../lib/chart/appearance-viewport";
    import type { SnowUIColor } from "../lib/color";
    import type { FrameProps } from "../logic/frame-types";
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
        motionColor?: TextMotionColor;
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
        if (!scrambleElement) return;
        return observeAppearanceRelease(scrambleElement, (controlled) => {
            hasMounted = true;
            if (!(controlled && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) scrambleElement?.replay();
        });
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
            motionColor: typeof motionColor === "function"
                ? motionColor
                : resolveTextMotionColor(motionColor),
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
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? `calc(${Math.max(1, Array.from(displayText).length)}ch + 0.5rem)`,
        height: rest.renderHints?.height ?? "1.25rem",
        radius: rest.renderHints?.radius,
        rows: rest.renderHints?.rows,
    }}
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
