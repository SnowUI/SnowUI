<!--
 SplitText 文字拆分组件
 v2.0.0
 
 职责：只负责拆分文本，输出元素数组，编排和动效由 Motion 系统控制。
-->

<script lang="ts">
    import { onMount } from "svelte";

    /**
     * 拆分结果接口
     */
    export interface SplitResult {
        /** 所有字符元素 */
        chars: HTMLElement[];
        /** 所有单词元素 */
        words: HTMLElement[];
        /** 所有行元素 (如果 by="lines") */
        lines?: HTMLElement[];
        /** 容器元素 */
        container: HTMLElement | null;
    }

    interface Props {
        /** 要拆分的文本 */
        text: string;
        /** 拆分模式 */
        by?: "chars" | "words" | "lines";
        /** 容器 CSS 类名 */
        class?: string;
        /** 字符元素类名 */
        charClass?: string;
        /** 单词元素类名 */
        wordClass?: string;
        /** 绑定输出结果 */
        result?: SplitResult;
    }

    let {
        text,
        by = "chars",
        class: className = "",
        charClass = "split-char",
        wordClass = "split-word",
        result = $bindable(),
    }: Props = $props();

    let containerRef = $state<HTMLElement | null>(null);

    /**
     * 将文本拆分为单词和字符
     */
    function splitText(input: string): { words: string[]; chars: string[][] } {
        const words = input.split(/\s+/).filter(Boolean);
        const chars = words.map((word) => [...word]); // 支持 Unicode
        return { words, chars };
    }

    // 计算拆分数据
    const splitData = $derived(
        (() => {
            void by; // 防止 unused warning
            return splitText(text);
        })(),
    );
    const totalChars = $derived(
        splitData.chars.reduce((sum, word) => sum + word.length, 0),
    );
    const totalWords = $derived(splitData.words.length);

    // 挂载后收集元素引用
    onMount(() => {
        if (!containerRef) return;

        const charElements = Array.from(
            containerRef.querySelectorAll(`.${charClass}`),
        ) as HTMLElement[];
        const wordElements = Array.from(
            containerRef.querySelectorAll(`.${wordClass}`),
        ) as HTMLElement[];

        result = {
            chars: charElements,
            words: wordElements,
            container: containerRef,
        };
    });
</script>

<span
    bind:this={containerRef}
    class={["split-text", className].filter(Boolean).join(" ")}
    style="--char-total: {totalChars}; --word-total: {totalWords};"
    aria-label={text}
>
    {#each splitData.words as word, wordIndex}
        {@const charOffset = splitData.chars
            .slice(0, wordIndex)
            .reduce((sum, w) => sum + w.length, 0)}
        <span class={wordClass} style="--word-index: {wordIndex};">
            {#each [...word] as char, charIndex}
                <span
                    class={charClass}
                    style="--char-index: {charOffset + charIndex};"
                >
                    {char}
                </span>
            {/each}
        </span>
        {#if wordIndex < splitData.words.length - 1}
            <!-- 单词间空格 -->
            <span class="split-space"> </span>
        {/if}
    {/each}
</span>

<style>
    :global(:where(.split-text)) {
        display: inline;
    }

    :global(:where(.split-word)) {
        display: inline-block;
        white-space: nowrap;
    }

    :global(:where(.split-char)) {
        display: inline-block;
    }

    :global(:where(.split-space)) {
        display: inline;
        width: 0.25em;
    }
</style>
