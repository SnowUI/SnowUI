/**
 * Text 截断模块（历史文件名：frame-truncation.svelte.ts）
 * 由 Text 组件在 lines 存在时启用
 * 
 * v1.4.0
 */
import {
    collapse,
    type CollapseLines,
    type CollapseInfo,
} from "./text-collapse.svelte";
import { resizeManager } from "./observer.svelte";

export class TruncationController {
    lines = $state<0 | 1 | 2 | 3 | undefined>(undefined);
    #element: HTMLElement | undefined;
    #onTruncate: ((isTruncated: boolean) => void) | undefined;

    // 状态
    isTruncated = $state(false);
    isExpanded = $state(false);
    fullText = $state("");
    availableWidth = $state(0);
    collapseStyles = $state<Record<string, string | null>>({});

    constructor(
        lines: 0 | 1 | 2 | 3 | undefined,
        getElement: () => HTMLElement | undefined,
        onTruncate?: (isTruncated: boolean) => void,
        options: { observeTextMutations?: boolean } = {},
    ) {
        this.lines = lines;
        this.#onTruncate = onTruncate;

        // 提取并维护完整文本内容
        $effect(() => {
            const el = getElement();
            if (!el) return;

            this.#element = el;

            const updateFullText = () => {
                const nextText = (el.textContent || "").trim();
                if (nextText !== this.fullText) {
                    this.fullText = nextText;
                }
            };

            updateFullText();
            const frame = requestAnimationFrame(updateFullText);

            if (
                options.observeTextMutations === false ||
                typeof MutationObserver === "undefined"
            ) {
                return () => cancelAnimationFrame(frame);
            }

            const observer = new MutationObserver(() => updateFullText());
            observer.observe(el, {
                childList: true,
                subtree: true,
                characterData: true,
            });
            return () => {
                cancelAnimationFrame(frame);
                observer.disconnect();
            };
        });

        // lines=1 单独的截断检测
        $effect(() => {
            if (this.lines !== 1 || !this.#element) return;

            const detectTruncation = () => {
                if (!this.#element) return;
                const wasTruncated = this.isTruncated;
                this.availableWidth = this.#element.clientWidth;
                this.isTruncated = this.#element.scrollWidth > this.#element.clientWidth;
                if (wasTruncated !== this.isTruncated) {
                    this.#onTruncate?.(this.isTruncated);
                }
            };

            requestAnimationFrame(detectTruncation);

            const unwatch = resizeManager.watch(this.#element, () =>
                requestAnimationFrame(detectTruncation),
            );

            return unwatch;
        });

        // 重置展开状态
        $effect(() => {
            if (this.lines === 0) return;
            if (this.isExpanded) this.isExpanded = false;
        });
    }

    update(
        lines: 0 | 1 | 2 | 3 | undefined,
        onTruncate?: (isTruncated: boolean) => void,
    ) {
        this.lines = lines;
        this.#onTruncate = onTruncate;
        if (this.lines !== 0 && this.isExpanded) {
            this.isExpanded = false;
        }
    }

    // 是否需要 collapse action
    get shouldCollapse() {
        return typeof this.lines === "number" && this.lines !== 1;
    }

    // collapse action 配置
    get collapseOptions() {
        return {
            lines: this.shouldCollapse
                ? (this.lines as CollapseLines)
                : undefined,
            isExpanded: this.lines === 0 ? this.isExpanded : false,
            _trigger: this.isTruncated,
            onUpdate: (info: CollapseInfo) => {
                const wasTruncated = this.isTruncated;
                this.isTruncated = info.isCollapsed;
                this.collapseStyles = info.styles || {};
                if (wasTruncated !== this.isTruncated) {
                    this.#onTruncate?.(this.isTruncated);
                }
            },
        };
    }

    // Text 使用的 actions
    get actions(): any[] {
        return this.shouldCollapse ? [[collapse, this.collapseOptions]] : [];
    }

    // 样式转字符串
    get styleString(): string {
        return Object.entries(this.collapseStyles)
            .filter(([_, v]) => v !== null && v !== undefined && v !== "")
            .map(([k, v]) => `${k}:${v}`)
            .join(";");
    }

    // CSS 类名
    get classes(): string {
        const classes: string[] = [];

        if (this.lines === 0) {
            classes.push("snowui-truncate-container");
            if (this.isTruncated && !this.isExpanded) {
                classes.push("snowui-truncate-collapsed");
            }
        } else if (typeof this.lines === "number" && this.lines > 0) {
            classes.push(`snowui-line-clamp-${this.lines}`);
        }

        return classes.join(" ");
    }

    // 推导 tag (用于 Text 兼容)
    getTag(defaultTag?: string): string {
        return defaultTag || (this.lines === 0 ? "div" : "span");
    }
}

// 兼容旧引用；Text 与 TableCell 实际共享同一控制器。
export { TruncationController as TextTruncation };
export { TruncationController as FrameTruncation };
