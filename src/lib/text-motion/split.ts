/* SnowUI source notice | LICENSE 2.3.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { splitTextMotionGraphemes } from "./layout";

/** Split text into word and separator segments without losing whitespace. */
export function splitTextMotionWords(value: string, locale?: string): string[] {
    if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
        return Array.from(segmenter.segment(value), (part) => part.segment);
    }
    return value.match(/\s+|[^\s]+/gu) ?? [];
}

/**
 * Group graphemes of a rendered text node by their actual horizontal layout line.
 * The caller must measure again after text, font, or layout changes.
 */
export function splitTextMotionLines(node: Text): string[] {
    const range = node.ownerDocument.createRange();
    const lines: string[] = [];
    let offset = 0;
    let previousTop: number | undefined;
    let pending = "";

    for (const grapheme of splitTextMotionGraphemes(node.data)) {
        range.setStart(node, offset);
        offset += grapheme.length;
        range.setEnd(node, offset);
        const rect = Array.from(range.getClientRects()).find((item) => item.height > 0);
        if (!rect) {
            pending += grapheme;
            continue;
        }
        if (previousTop === undefined || Math.abs(rect.top - previousTop) > 1) {
            lines.push(pending + grapheme);
            pending = "";
            previousTop = rect.top;
        } else {
            lines[lines.length - 1] += pending + grapheme;
            pending = "";
        }
    }
    range.detach();
    if (pending) {
        if (lines.length) lines[lines.length - 1] += pending;
        else lines.push(pending);
    }
    return lines;
}
