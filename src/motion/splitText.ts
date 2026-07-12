/**
 * splitText Action
 * 用于对已有元素进行文字拆分
 * v1.0.0
 */

export interface SplitTextOptions {
    /** 拆分模式 */
    by?: "chars" | "words" | "lines";
    /** 字符元素类名 */
    charClass?: string;
    /** 单词元素类名 */
    wordClass?: string;
    /** 拆分完成回调，返回拆分结果 */
    onSplit?: (result: SplitTextResult) => void;
}

export interface SplitTextResult {
    chars: HTMLElement[];
    words: HTMLElement[];
    container: HTMLElement;
    /** 还原函数 */
    revert: () => void;
}

/**
 * Svelte Action: 对元素内的文本进行拆分
 */
export function splitText(
    node: HTMLElement,
    options: SplitTextOptions = {},
): { destroy: () => void; update: (opts: SplitTextOptions) => void } {
    const {
        by: _by = "chars",
        charClass = "split-char",
        wordClass = "split-word",
        onSplit,
    } = options;

    // 保存原始内容用于还原
    const originalHTML = node.innerHTML;
    const originalText = node.textContent || "";

    // 执行拆分
    function doSplit() {
        const text = originalText;
        const words = text.split(/\s+/).filter(Boolean);
        const totalChars = words.reduce((sum, w) => sum + [...w].length, 0);
        const totalWords = words.length;

        // 设置容器 CSS 变量
        node.style.setProperty("--char-total", String(totalChars));
        node.style.setProperty("--word-total", String(totalWords));

        // 生成拆分后的 HTML
        let charIndex = 0;
        const html = words
            .map((word, wordIndex) => {
                const chars = [...word]
                    .map((char) => {
                        const span = `<span class="${charClass}" style="--char-index: ${charIndex}; display: inline-block;">${char}</span>`;
                        charIndex++;
                        return span;
                    })
                    .join("");
                return `<span class="${wordClass}" style="--word-index: ${wordIndex}; display: inline-block; white-space: nowrap;">${chars}</span>`;
            })
            .join('<span class="split-space" style="display: inline;"> </span>');

        node.innerHTML = html;

        // 收集元素
        const charElements = Array.from(
            node.querySelectorAll(`.${charClass}`),
        ) as HTMLElement[];
        const wordElements = Array.from(
            node.querySelectorAll(`.${wordClass}`),
        ) as HTMLElement[];

        const result: SplitTextResult = {
            chars: charElements,
            words: wordElements,
            container: node,
            revert: () => {
                node.innerHTML = originalHTML;
                node.style.removeProperty("--char-total");
                node.style.removeProperty("--word-total");
            },
        };

        // 回调
        onSplit?.(result);

        return result;
    }

    const result = doSplit();

    return {
        update(newOptions: SplitTextOptions) {
            // 如果选项变化，重新拆分
            result.revert();
            Object.assign(options, newOptions);
            doSplit();
        },
        destroy() {
            // 组件销毁时还原
            result.revert();
        },
    };
}
