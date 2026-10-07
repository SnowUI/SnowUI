<!-- BlurText 逐字模糊揭示组件 v1.0.0；文档：./BlurText.md -->
<script lang="ts">
    import { onMount, onDestroy, tick, untrack } from "svelte";
    import type { FrameProps } from "@snowui-design-system/components/logic/frame-types";
    import type { SnowUIColor } from "@snowui-design-system/components/lib/color";
    import FramePro from "./FramePro.svelte";
    import { splitTextMotionGraphemes } from "../lib/text-motion/layout";
    import { createTextMotionTypographyStyle } from "../lib/text-motion/typography";
    import { animateTextMotionColorSequence, cancelTextMotionColor } from "../lib/text-motion/color";
    import { shouldReduceTextMotion } from "../lib/text-motion/preference";
    import { observeAppearanceRelease } from "../lib/chart/appearance-viewport";
    import type { TextMotionAlign, TextMotionColor } from "../lib/text-motion/types";

    interface Props extends Omit<FrameProps, "children"> {
        text?: string | number;
        animated?: boolean;
        speed?: number;
        playOnMount?: boolean;
        replayKey?: string | number;
        respectMotionPreference?: boolean;
        font?: string;
        size?: string | number;
        weight?: string | number;
        lineHeight?: string | number;
        color?: SnowUIColor | string;
        align?: TextMotionAlign;
        motionColor?: TextMotionColor;
    }
    let { text = "", animated = true, speed = 1.5, playOnMount = true, replayKey = 0,
        respectMotionPreference = true, font, size, weight, lineHeight, color, align, motionColor,
        tag = "span", enableContext = true, enableDefaultMotion = true,
        class: userClass = "", style: userStyle = "", ...rest }: Props = $props();
    const content = $derived(String(text ?? ""));
    const tokens = $derived((content.match(/\S+|\s+/gu) ?? []).map(value => ({
        value, space: /^\s+$/u.test(value),
        word: /^[\x21-\x7e]+$/.test(value),
        characters: splitTextMotionGraphemes(value),
    })));
    const typography = $derived(createTextMotionTypographyStyle("blur-text",
        { font, size, weight, lineHeight, color, align, motionColor }, userStyle));
    let output: HTMLSpanElement;
    let ready = $state(false);
    let initialized = false;
    let lastText = "";
    let lastReplay: string | number = 0;
    const active = new Map<HTMLElement, Animation[]>();
    let painted: HTMLElement[] = [];
    let frame = 0;
    let entrance: Animation | undefined;
    const duration = 600;
    function clear() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        entrance?.cancel();
        entrance = undefined;
        for (const [node, animations] of active) {
            animations.forEach(animation => animation.cancel());
            node.style.transform = "none";
        }
        active.clear();
        painted.forEach(cancelTextMotionColor);
        painted = [];
    }
    function reveal(restart: boolean, animate: boolean, tint: TextMotionColor | undefined, speed: number) {
        const rate = Number.isFinite(speed) && speed > 0 ? speed : 1.5;
        const stagger = 30 / rate;
        const nodes = [...output.querySelectorAll<HTMLElement>("[data-blur-character]")];
        // 仅在重定向时批量采样，逐帧不读取布局。
        const starts = nodes.map(node => {
            if (!restart && active.has(node)) {
                const style = getComputedStyle(node);
                return { opacity: style.opacity, filter: style.filter,
                    y: style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42 };
            }
            return { opacity: "0", filter: "blur(12px)", y: 10 };
        });
        clear();
        if (!animate || typeof output.animate !== "function") return;
        painted = nodes;
        if (tint) animateTextMotionColorSequence(nodes, tint, nodes.map(n => n.textContent ?? ""), { duration, stagger });
        if (restart) {
            entrance = output.animate({ opacity: [0, 1] }, { duration: 300, easing: "cubic-bezier(0.25, 0.1, 0.35, 1)", fill: "both" });
            const current = entrance;
            current.onfinish = () => { if (entrance === current) { current.cancel(); entrance = undefined; } };
        }
        nodes.forEach((node, index) => {
            const options = { duration, delay: index * stagger, easing: "ease-out", fill: "both" as const };
            // 与参考运行时一致：透明度、滤镜独立，位移由主线程更新真实字符。
            const opacity = node.animate({ opacity: [starts[index].opacity, "1"] }, options);
            const filter = node.animate({ filter: [starts[index].filter, "blur(0px)"] }, options);
            node.style.transform = `translateY(${starts[index].y}px)`;
            active.set(node, [opacity, filter]);
        });
        const draw = () => {
            nodes.forEach((node, index) => {
                const animations = active.get(node);
                if (!animations) return;
                const progress = animations[0].effect?.getComputedTiming().progress ?? 0;
                node.style.transform = progress === 1 ? "none" : `translateY(${starts[index].y * (1 - progress)}px)`;
                if (progress === 1) {
                    animations.forEach(animation => animation.cancel());
                    active.delete(node);
                }
            });
            frame = active.size ? requestAnimationFrame(draw) : 0;
        };
        frame = requestAnimationFrame(draw);
    }
    onMount(() => {
        if (!animated) { ready = true; return; }
        return observeAppearanceRelease(output, () => { ready = true; });
    });
    onDestroy(clear);
    $effect(() => {
        if (!animated || !respectMotionPreference || typeof window.matchMedia !== "function") return;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const settle = () => { if (preference.matches) clear(); };
        preference.addEventListener("change", settle);
        return () => preference.removeEventListener("change", settle);
    });
    $effect(() => {
        const next = { ready, content, replayKey, animated, playOnMount, respectMotionPreference, motionColor, speed };
        if (!next.ready) return;
        let cancelled = false;
        untrack(() => {
            void tick().then(() => {
                if (cancelled) return;
                const first = !initialized;
                const changed = lastText !== next.content;
                const replay = lastReplay !== next.replayKey;
                initialized = true;
                lastText = next.content;
                lastReplay = next.replayKey;
                const animate = next.animated && !(typeof window.matchMedia === "function" && shouldReduceTextMotion(next.respectMotionPreference));
                if (!animate) { clear(); return; }
                if (first ? next.playOnMount : changed || replay) reveal(first || replay, true, next.motionColor, next.speed);
            });
        });
        return () => { cancelled = true; };
    });
</script>

<FramePro {...rest} {tag} {enableContext} {enableDefaultMotion}
    enableAutoLayout={false} enableResponsive={false} enableScaleObserver={false}
    class={["snowui-blur-text", userClass].filter(Boolean).join(" ")} style={typography}
    role={rest.role ?? (tag === "span" ? "img" : undefined)} aria-label={rest["aria-label"] ?? content}
    renderHints={{ variant: "line", height: "1lh", ...rest.renderHints }}>
    <span bind:this={output} aria-hidden="true">{#each tokens as token, index (index)}{#if token.space}{#if token.value.includes("\n")}{token.value}{:else}<span data-blur-character class="snowui-blur-text-character snowui-blur-text-space">{token.value}</span>{/if}{:else}<span class:snowui-blur-text-word={token.word}>{#each token.characters as character, characterIndex (characterIndex)}<span data-blur-character={character} class="snowui-blur-text-character">{character}</span>{/each}</span>{/if}{/each}</span>
</FramePro>

<style>
    :global(:where(.snowui-blur-text)) {
        display: inline-block;
        max-width: 100%;
        min-width: 0;
        font-family: var(--snowui-blur-text-font, inherit);
        font-size: var(--snowui-blur-text-size, inherit);
        font-weight: var(--snowui-blur-text-weight, inherit);
        line-height: var(--snowui-blur-text-line-height, inherit);
        color: var(--snowui-blur-text-color, inherit);
        text-align: var(--snowui-blur-text-align, inherit);
        letter-spacing: inherit;
        white-space: pre-wrap;
        vertical-align: baseline;
    }
    :global(:where(.snowui-blur-text-word)) {
        display: inline-block;
        white-space: nowrap;
    }
    :global(:where(.snowui-blur-text-character)) {
        display: inline-block;
        font: inherit;
        letter-spacing: inherit;
        filter: blur(0px);
        transform: none;
    }
    :global(:where(.snowui-blur-text-space)) {
        white-space: pre;
    }
</style>
