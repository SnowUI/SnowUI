import { RESIZE_MOTION } from '../motion/presets/resize';

type Geometry = { x: number; width: number; visibleWidth: number };
const contentSelector = ':scope > .snowui-table-cell-content, :scope > .snowui-table-head-content, :scope > .snowui-table-sort';

/** 原生网格始终保持自然布局，只有内容层做 FLIP 位移和宽度揭示。 */
export function createTableColumnMotion(table: HTMLTableElement) {
    let animations: Animation[] = [];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cells = () => Array.from(table.rows).flatMap(row => Array.from(row.cells));
    function capture() {
        const result = new Map<HTMLTableCellElement, Geometry>();
        for (const cell of cells()) {
            if (cell.dataset.as) continue;
            const content = cell.querySelector<HTMLElement>(contentSelector);
            if (!content) continue;
            const rect = content.getBoundingClientRect();
            const style = getComputedStyle(content);
            // 中途反向时读取正在显示的裁切边界，避免回到上一次动画的端点。
            const inset = style.clipPath.match(/^inset\(0px ([\d.]+)px 0px 0px\)$/);
            result.set(cell, { x: rect.x, width: rect.width,
                visibleWidth: Math.max(0, rect.width - Number(inset?.[1] ?? 0)) });
        }
        return result;
    }
    function finish() {
        for (const animation of animations) animation.cancel();
        animations = [];
    }
    function play(before: Map<HTMLTableCellElement, Geometry>) {
        if (media.matches || !table.animate) return;
        const all = cells();
        if (all.some(cell => cell.colSpan !== 1 || cell.rowSpan !== 1)) return;
        const after = capture();
        const options: KeyframeAnimationOptions = {
            duration: RESIZE_MOTION.duration, easing: RESIZE_MOTION.easing as string, fill: 'both',
        };
        for (const cell of all) {
            const from = before.get(cell);
            const to = after.get(cell);
            const content = cell.querySelector<HTMLElement>(contentSelector);
            if (!from || !to || !content || !from.width || !to.width) continue;
            const x = from.x - to.x;
            const clipped = Math.max(0, to.width - from.visibleWidth);
            if (Math.abs(x) < .01 && clipped < .01) continue;
            // 透明度仅由响应宽度驱动；换行造成的纵向布局不叠加平移动画。
            // 不动画 td/th、圆角或 table-layout，不让视觉插值反馈到原生列宽算法。
            // 裁切只限制尚未展开的内容区域；结束后移除，恢复消费者原有溢出规则。
            const frames: Keyframe[] = [
                { translate: `${x}px 0px`, ...(clipped > 0 ? {clipPath: `inset(0 ${clipped}px 0 0)`} : {}) },
                { translate: '0px 0px', ...(clipped > 0 ? {clipPath: 'inset(0 0px 0 0)'} : {}) },
            ];
            animations.push(content.animate(frames, options));
        }
        const current = animations;
        Promise.all(current.map(animation => animation.finished)).then(() => {
            if (animations === current) finish();
        }).catch(() => {});
    }
    media.addEventListener('change', finish);
    return { capture, play, finish,
        destroy() { finish(); media.removeEventListener('change', finish); } };
}
