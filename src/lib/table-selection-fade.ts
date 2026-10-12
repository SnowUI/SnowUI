/* SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
import { createEdgeFadeMaskImage } from "./edge-fade";
import { resizeManager } from "../logic/observer.svelte";

/** Table 私有布局适配：遮住实际 Checkbox，向内容侧保留固定 Token 长度的过渡。 */
export function tableSelectionFade(node: HTMLElement, options: { enabled: boolean; selected: boolean }) {
    let { enabled, selected } = options;
    const row = node.closest<HTMLElement>(".snowui-table-row");
    const head = Boolean(node.closest("thead"));
    const variable = head ? "--snowui-table-head-fade-mask" : "--snowui-table-selection-fade-mask";
    const startOverride = head ? "--snowui-table-head-fade-start-override" : "--snowui-table-selection-fade-start-override";
    const endOverride = head ? "--snowui-table-head-fade-end-override" : "--snowui-table-selection-fade-end-override";
    const content = node.closest("th, td")?.nextElementSibling?.querySelector<HTMLElement>(
        head ? ".snowui-table-head-content" : ".snowui-table-cell-content",
    );
    const checkbox = node.querySelector<HTMLElement>(".snowui-checkbox");
    const layout = node.closest<HTMLElement>(".snowui-table-scroll-viewport");
    const edge = "--snowui-table-selection-measured-edge";
    const mask = createEdgeFadeMaskImage({
        direction: "to right",
        fadeStart: `var(${startOverride}, var(${edge}))`,
        fadeEnd: `var(${endOverride}, calc(var(${edge}) + var(--size-5)))`,
    });
    let frame = 0;
    let cleanups: (() => void)[] = [];
    const measure = () => {
        frame = 0;
        if (!enabled || !checkbox || !content) return;
        const offset = checkbox.getBoundingClientRect().right - content.getBoundingClientRect().left;
        content.style.setProperty(edge, `${offset}px`);
        // 在内容节点解析变量，才能读取自身的实测边缘，不能在 Table 根提前解析。
        content.style.setProperty(variable, mask);
    };
    const schedule = () => {
        if (!frame) frame = requestAnimationFrame(measure);
    };
    const stop = () => {
        cleanups.forEach(cleanup => cleanup());
        cleanups = [];
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
    };
    const start = () => {
        if (!enabled || cleanups.length || !row || !checkbox) return;
        cleanups = [...new Set([row, checkbox, layout].filter((target): target is HTMLElement => !!target))]
            .map(target => resizeManager.watch(target, schedule));
        window.addEventListener("scroll", schedule, true);
        window.addEventListener("resize", schedule);
        cleanups.push(() => {
            window.removeEventListener("scroll", schedule, true);
            window.removeEventListener("resize", schedule);
        });
        measure();
        // 行内浮层的 fixed 定位可能在同次 pointerenter 中随后更新。
        schedule();
    };
    const leave = () => {
        if (selected || row?.matches(':hover, [data-selected="true"], [data-force-hover="true"]') || row?.contains(document.activeElement)) return;
        stop();
    };
    const blur = (event: FocusEvent) => {
        if (selected || row?.matches(':hover, [data-force-hover="true"]') || (event.relatedTarget instanceof Node && row?.contains(event.relatedTarget))) return;
        stop();
    };
    row?.addEventListener("pointerenter", start);
    row?.addEventListener("pointerleave", leave);
    row?.addEventListener("focusin", start);
    row?.addEventListener("focusout", blur);
    // 空闲行不测量也不持续监听；可见后才激活。
    if (selected || row?.matches(':hover, [data-force-hover="true"]') || row?.contains(document.activeElement)) start();
    return {
        update(next: typeof options) {
            ({ enabled, selected } = next);
            stop();
            if (enabled) {
                start();
                leave();
            }
            else content?.style.removeProperty(variable);
        },
        destroy() {
            stop();
            row?.removeEventListener("pointerenter", start);
            row?.removeEventListener("pointerleave", leave);
            row?.removeEventListener("focusin", start);
            row?.removeEventListener("focusout", blur);
            content?.style.removeProperty(variable);
            content?.style.removeProperty(edge);
        },
    };
}
