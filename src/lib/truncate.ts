/* SnowUI source notice | LICENSE 2.1.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
/**
 * 文本截断 Action (Truncate Action)
 * 
 * 该文件实现了一个 Svelte Action，用于检测和处理文本截断逻辑。
 * 主要功能：
 * 1. 自动检测文本是否因容器限制而被截断。
 * 2. 支持多行截断 (line-clamp) 的模拟计算。
 * 3. 支持“展开/收起”模式下的高度计算。
 * 4. 自动监听容器尺寸变化并重新计算截断状态。
 */
import { resizeManager } from "../logic/observer.svelte";

export type TruncateLines = number;

export interface TruncateInfo {
	isTruncated: boolean;
	fontSizePx: number | null;
	lineHeightPx: number | null;
	constraintHeightPx: number | null;
}

export interface TruncateOptions {
	lines?: TruncateLines;
	expandedLines?: number;
	onUpdate?: (info: TruncateInfo) => void;
}

export interface FitTextOptions {
	locale?: string | string[];
	/** 末尾省略符；仅用于宽度预算，不会拼接到返回文本。 */
	ellipsis?: string;
}

let textMeasureCanvas: HTMLCanvasElement | undefined;

function segmentText(text: string, granularity: "word" | "grapheme", locale?: string | string[]) {
	if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
		const segmenter = new Intl.Segmenter(locale, { granularity });
		return Array.from(segmenter.segment(text), ({ segment }) => segment);
	}
	return Array.from(text);
}

function createElementTextMeasurer(element: HTMLElement) {
	if (typeof document === "undefined") return (value: string) => value.length;
	textMeasureCanvas ??= document.createElement("canvas");
	const context = textMeasureCanvas.getContext("2d");
	const style = getComputedStyle(element);
	if (context) context.font = style.font;
	const letterSpacing = Number.parseFloat(style.letterSpacing || "0") || 0;
	const graphemeSegmenter =
		typeof Intl !== "undefined" && "Segmenter" in Intl
			? new Intl.Segmenter(undefined, { granularity: "grapheme" })
			: undefined;

	return (value: string) => {
		const baseWidth = context?.measureText(value).width ?? value.length;
		if (!letterSpacing || value.length < 2) return baseWidth;
		const count = graphemeSegmenter
			? Array.from(graphemeSegmenter.segment(value)).length
			: Array.from(value).length;
		return baseWidth + Math.max(0, count - 1) * letterSpacing;
	};
}

/** 按目标元素的实际字体、字距测量文本宽度。 */
export function measureTextForElement(value: string, element: HTMLElement) {
	return createElementTextMeasurer(element)(value);
}

function longestFittingPrefix(
	segments: string[],
	maxWidth: number,
	measure: (value: string) => number,
) {
	let low = 0;
	let high = segments.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		const candidate = segments.slice(0, middle).join("").trimEnd();
		if (measure(candidate) <= maxWidth) low = middle;
		else high = middle - 1;
	}
	return segments.slice(0, low).join("").trimEnd();
}

/**
 * 按实际字体宽度返回可见前缀。优先保留完整单词；中日韩文字在完整词组
 * 放不下时可降级到 Unicode 字素边界，避免汉字与组合字符被切成半个。
 */
export function fitTextToElement(
	text: string,
	maxWidth: number,
	element: HTMLElement,
	options: FitTextOptions = {},
) {
	if (!text || maxWidth <= 0) return "";
	const measure = createElementTextMeasurer(element);
	const availableWidth = Math.max(
		0,
		maxWidth - measure(options.ellipsis ?? "…"),
	);
	if (measure(text) <= maxWidth) return text;

	const words = segmentText(text, "word", options.locale);
	const wordPrefix = longestFittingPrefix(words, availableWidth, measure);
	if (wordPrefix) return wordPrefix;

	// 拉丁、阿拉伯等以完整单词为阅读单元的文字宁可只显示省略符，
	// 也不从单词中间截断。中日韩文字则可安全降级到完整字素边界。
	const canFallbackToGrapheme =
		/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(
			text,
		);
	if (!canFallbackToGrapheme) return "";

	return longestFittingPrefix(
		segmentText(text, "grapheme", options.locale),
		availableWidth,
		measure,
	);
}

const EPS = 1;

function measureLineHeight(cs: CSSStyleDeclaration) {
	if (typeof document === "undefined") return NaN;
	const probe = document.createElement("span");
	probe.textContent = "Hg";
	probe.style.position = "fixed";
	probe.style.left = "-99999px";
	probe.style.top = "-99999px";
	probe.style.visibility = "hidden";
	probe.style.whiteSpace = "nowrap";
	probe.style.padding = "0";
	probe.style.border = "0";
	probe.style.margin = "0";
	probe.style.fontFamily = cs.fontFamily;
	probe.style.fontSize = cs.fontSize;
	probe.style.fontWeight = cs.fontWeight;
	probe.style.fontStyle = cs.fontStyle;
	probe.style.letterSpacing = cs.letterSpacing;
	probe.style.lineHeight = cs.lineHeight;
	document.body.appendChild(probe);
	const h = probe.getBoundingClientRect().height;
	probe.remove();
	return h;
}

function findConstraintHost(el: HTMLElement) {
	let p: HTMLElement | null = el.parentElement;
	let depth = 0;
	while (p && depth < 2) {
		const cs = getComputedStyle(p);
		const fixedHeight = cs.height !== "auto" && cs.height !== "" && cs.height !== "0px";
		const maxH = (cs.maxHeight || "").trim();
		const minH = (cs.minHeight || "").trim();
		const hasMaxHeight = maxH !== "" && maxH !== "none" && maxH !== "0px";
		const hasMinHeight = minH !== "" && minH !== "0px";
		if ((fixedHeight || hasMaxHeight || hasMinHeight) && p.clientHeight > 0) return p;
		p = p.parentElement;
		depth += 1;
	}
	return null;
}

function computeLineMetrics(el: HTMLElement) {
	const cs = getComputedStyle(el);
	const fs = Number.parseFloat(cs.fontSize || "");
	const fontSizePx = Number.isFinite(fs) && fs > 0 ? fs : NaN;
	const lhRaw = cs.lineHeight;
	let lh = Number.parseFloat(lhRaw || "");
	if (!Number.isFinite(lh) || lh <= 0 || lhRaw === "normal") {
		lh = measureLineHeight(cs);
	}
	return {
		fontSizePx: Number.isFinite(fontSizePx) ? fontSizePx : null,
		lineHeightPx: Number.isFinite(lh) && lh > 0 ? lh : null,
	};
}

type RunningState = {
	running: boolean;
	pendingRaf: number | null;
};

function schedule(state: RunningState, fn: () => void) {
	if (state.running) return;
	state.running = true;
	state.pendingRaf = requestAnimationFrame(() => {
		try {
			fn();
		} finally {
			state.running = false;
			state.pendingRaf = null;
		}
	});
}

export default function truncate(node: HTMLElement, options: TruncateOptions = {}) {
	let opts = options;
	let last: TruncateInfo = {
		isTruncated: false,
		fontSizePx: null,
		lineHeightPx: null,
		constraintHeightPx: null,
	};

	const state: RunningState = { running: false, pendingRaf: null };

	let host: HTMLElement | null = null;
	let unwatchHost: (() => void) | null = null;
	let unwatchNode: (() => void) | null = null;

	let lastHost: HTMLElement | null = null;
	let lastAppliedMaxHeight: string | null = null;
	let lastAppliedOverflow: string | null = null;

	const setStyle = (maxHeight: string | null, overflow: string | null) => {
		if (maxHeight !== lastAppliedMaxHeight) {
			if (maxHeight === null) node.style.maxHeight = "";
			else node.style.maxHeight = maxHeight;
			lastAppliedMaxHeight = maxHeight;
		}
		if (overflow !== lastAppliedOverflow) {
			if (overflow === null) node.style.overflow = "";
			else node.style.overflow = overflow;
			lastAppliedOverflow = overflow;
		}
	};

	const apply = () => {
		if (!node.isConnected) return;
		const { fontSizePx, lineHeightPx } = computeLineMetrics(node);
		host = findConstraintHost(node);
		const constraintHeightPx = host ? host.clientHeight : null;

		const expandedLines = opts.expandedLines ?? 0;
		let effectiveLines: TruncateLines | undefined = opts.lines;

		// 切换 host 时，更新 host 监听
		if (host !== lastHost) {
			unwatchHost?.();
			unwatchHost = null;
			lastHost = host;
			if (host) {
				unwatchHost = resizeManager.watch(host, requestApply);
			}
		}

		// 应用截断样式（只由 action 负责写入）
		// 未传 lines：仅当存在“高度约束父级”时按容器高度裁剪
		if (typeof effectiveLines !== "number") {
			if (constraintHeightPx) {
				setStyle(`${Math.max(0, Math.round(constraintHeightPx))}px`, "hidden");
			} else {
				setStyle(null, null);
			}
		} else if (effectiveLines === 0) {
			if (lineHeightPx && constraintHeightPx) {
				const snapped = Math.max(
					lineHeightPx,
					Math.floor((constraintHeightPx + 0.5) / lineHeightPx) * lineHeightPx,
				);
				const next = snapped + expandedLines * lineHeightPx;
				setStyle(`${Math.max(0, Math.round(next))}px`, "hidden");
			} else {
				setStyle(null, null);
			}
		} else if (effectiveLines > 1) {
			if (lineHeightPx && constraintHeightPx) {
				const cap = Math.min(constraintHeightPx, Math.round(lineHeightPx * effectiveLines));
				setStyle(`${cap}px`, "hidden");
			} else {
				setStyle(null, null);
			}
		} else {
			// lines=1：不强制 max-height，由 CSS 单行省略控制
			setStyle(null, null);
		}

		const isTruncated =
			typeof effectiveLines !== "number"
				? constraintHeightPx
					? Math.ceil(node.scrollHeight) > Math.ceil(node.clientHeight + EPS)
					: false
				: effectiveLines === 1
					? Math.ceil(node.scrollWidth) > Math.ceil(node.clientWidth)
					: Math.ceil(node.scrollHeight) > Math.ceil(node.clientHeight + EPS);

		const nextInfo: TruncateInfo = {
			isTruncated,
			fontSizePx,
			lineHeightPx,
			constraintHeightPx,
		};

		const changed =
			nextInfo.isTruncated !== last.isTruncated ||
			nextInfo.fontSizePx !== last.fontSizePx ||
			nextInfo.lineHeightPx !== last.lineHeightPx ||
			nextInfo.constraintHeightPx !== last.constraintHeightPx;

		if (changed) {
			last = nextInfo;
			opts.onUpdate?.(nextInfo);
		}

	};

	const requestApply = () => schedule(state, apply);

	unwatchNode = resizeManager.watch(node, requestApply);

	requestApply();

	return {
		update(next: TruncateOptions) {
			opts = next;
			requestApply();
		},
		destroy() {
			unwatchNode?.();
			unwatchHost?.();
			if (state.pendingRaf !== null) cancelAnimationFrame(state.pendingRaf);
			setStyle(null, null);
		},
	};
}
