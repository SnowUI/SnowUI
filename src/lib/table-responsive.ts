import { createResponsiveExit } from "./responsive-exit";
import { createTableColumnMotion } from "./table-column-motion";
import { resizeManager } from "../logic/observer.svelte";
import type { TableRoleLayout } from "./table-context.svelte";

interface Options {
    horizontalScroll: boolean;
    roleLayout: TableRoleLayout;
    actionsWidth: number;
    onLayout: (layout: "column" | "overlay", actionsWidth: number) => void;
}
interface Column {
    role: boolean;
    hideable: boolean;
    preferred: number;
    minimum: number;
}

/** 表格私有响应式控制器；每表统一测量，不为各 Cell 创建 Observer。 */
export function observeTableResponsive(table: HTMLTableElement, viewport: HTMLElement, initial: Options) {
    let options = initial;
    const columnMotion = createTableColumnMotion(table);
    let previousHidden: string | undefined;
    let frame = 0;
    let disposed = false;
    let columns: Column[] | undefined;
    let preferredPadding = 0;
    let minimumPadding = 0;
    let fadeDistance = 0;
    let fadedCells: HTMLTableCellElement[] = [];
    const exit = createResponsiveExit(opacity => {
        for (const cell of fadedCells) {
            if (opacity < 1) cell.style.setProperty('--snowui-table-responsive-column-opacity', opacity.toFixed(4));
            else cell.style.removeProperty('--snowui-table-responsive-column-opacity');
        }
    });
    let measuredActionsWidth = 0;
    let complexGrid = false;
    const originalSpans = new WeakMap<HTMLTableCellElement, number>();
    const renderedSpans = new WeakMap<HTMLTableCellElement, number>();
    const rows = () => Array.from(table.rows).filter(row => row.closest('table') === table);

    function measureColumns() {
        // 隐藏列仍用完整内容测量，避免 display:none 使恢复阈值丢失。
        // 副本只在失效后存在于当前测量帧，inert + aria-hidden，不复制事件或组件实例。
        const copy = table.cloneNode(true) as HTMLTableElement;
        copy.inert = true;
        copy.classList.remove('snowui-table-responsive-text-fit');
        copy.setAttribute('aria-hidden', 'true');
        Object.assign(copy.style, { position: 'absolute', visibility: 'hidden', pointerEvents: 'none', width: '1px', minWidth: '0', maxWidth: 'none', top: '0', left: '0' });
        copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
        copy.querySelectorAll('.snowui-table-responsive-hidden').forEach(node => node.classList.remove('snowui-table-responsive-hidden'));
        // colspan 的运行时收缩不能污染原始列模型。
        const sourceRows = rows();
        Array.from(copy.rows).forEach((row, index) => Array.from(row.cells).forEach((cell, cellIndex) => {
            const source = sourceRows[index]?.cells[cellIndex];
            if (source) cell.colSpan = originalSpans.get(source) ?? source.colSpan;
        }));
        copy.querySelectorAll<HTMLElement>('[data-as="selection"], [data-as="actions"]').forEach(cell => {
            cell.dataset.roleLayout = 'column';
            const width = cell.dataset.as === 'actions' ? `${options.actionsWidth}px` : 'var(--size-10)';
            Object.assign(cell.style, { position: 'static', width, minWidth: width, maxWidth: 'none' });
        });
        copy.querySelectorAll<HTMLElement>('.snowui-table-selection-control, .snowui-table-cell-content[data-actions="true"]').forEach(control => {
            Object.assign(control.style, { position: 'relative', inset: 'auto', width: 'max-content', maxWidth: 'none', height: 'auto' });
        });
        // 测量完整列集的真实外缘，不继承收列后的首尾标记。
        for (const row of Array.from(copy.rows)) {
            for (const cell of Array.from(row.cells)) cell.classList.remove('snowui-table-cell-visible-first', 'snowui-table-cell-visible-last');
            row.cells[0]?.classList.add('snowui-table-cell-visible-first');
            row.cells[row.cells.length - 1]?.classList.add('snowui-table-cell-visible-last');
        }
        viewport.append(copy);
        const probe = document.createElement('span');
        probe.style.paddingLeft = 'var(--padding-3)';
        probe.style.paddingRight = 'var(--padding-1)';
        probe.style.width = 'var(--size-5)';
        probe.style.display = 'block';
        copy.append(probe);
        preferredPadding = parseFloat(getComputedStyle(probe).paddingLeft);
        minimumPadding = parseFloat(getComputedStyle(probe).paddingRight);
        fadeDistance = parseFloat(getComputedStyle(probe).width);
        probe.remove();
        const heads = Array.from(copy.tHead?.rows[0]?.cells ?? copy.rows[0]?.cells ?? []);
        copy.style.setProperty('--snowui-table-responsive-cell-padding-inline', `${preferredPadding}px`);
        measuredActionsWidth = options.actionsWidth;
        copy.querySelectorAll<HTMLElement>('.snowui-table-cell[data-as="actions"]').forEach(cell => {
            const controls = cell.querySelector<HTMLElement>('.snowui-table-role-overlay-controls');
            const style = getComputedStyle(cell);
            measuredActionsWidth = Math.max(measuredActionsWidth, (controls?.getBoundingClientRect().width ?? 0) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
        });
        const preferred = heads.map(head => head.dataset.as === 'actions' ? measuredActionsWidth : head.getBoundingClientRect().width);
        copy.style.setProperty('--snowui-table-responsive-cell-padding-inline', `${minimumPadding}px`);
        const minimum = heads.map(head => head.dataset.as === 'actions' ? measuredActionsWidth : head.getBoundingClientRect().width);
        // 复杂表头 / 跨行单元格不能按扁平列猜测对应关系，保留局部滚动。
        complexGrid = (copy.tHead?.rows.length ?? 0) > 1 || heads.some(head => head.colSpan > 1)
            || Array.from(copy.rows).some(row => Array.from(row.cells).some(cell => cell.rowSpan > 1));
        let firstData = true;
        columns = heads.map((head, index) => {
            const role = head.dataset.as === 'selection' || head.dataset.as === 'actions';
            const hideable = !complexGrid && !role && !firstData && head.dataset.responsiveHide !== 'false' && head.colSpan === 1;
            if (!role) firstData = false;
            return { role, hideable, preferred: preferred[index], minimum: minimum[index] };
        });
        copy.remove();
    }

    function flush() {
        frame = 0;
        if (disposed || !table.isConnected || viewport.clientWidth <= 0) return;
        if (!columns) measureColumns();
        const measured = columns!;
        // clientWidth 会取整；慢速拖动时会让 padding 与渐隐每隔 1px 才跳一次。
        // 内部 viewport 无边框及 padding，计算样式保留未受 transform 影响的 CSS 小数宽度。
        const available = parseFloat(getComputedStyle(viewport).width) || viewport.clientWidth;
        const full = measured.reduce((sum, column) => sum + column.preferred, 0);
        const layout = options.roleLayout === 'auto' ? (full <= available + 0.5 ? 'column' : 'overlay') : options.roleLayout;
        const included = measured.filter(column => layout === 'column' || !column.role);
        const preferred = included.reduce((sum, column) => sum + column.preferred, 0);
        // 角色列转浮层后，普通首尾列接管外缘，每侧至少 8px。
        const edgeExtra = layout === 'overlay'
            ? [measured[0], measured.at(-1)].filter(column => column?.role).length * minimumPadding : 0;
        const minimum = included.reduce((sum, column) => sum + column.minimum, 0) + edgeExtra;
        // 与常驻 / 收列判断共用半像素容限，容纳原生布局的亚像素误差。
        // 否则恰好放下的固定列会因极小误差把 padding 直接压到最小值。
        const ratio = preferred <= available + 0.5 ? 1
            : preferred > minimum ? Math.max(0, Math.min(1, (available - minimum) / (preferred - minimum))) : 0;
        let required = minimum;
        const hidden = new Set<number>();
        if (!options.horizontalScroll && required > available + 0.5) {
            for (let index = measured.length - 1; index >= 0 && required > available + 0.5; index--) {
                if (!measured[index].hideable) continue;
                hidden.add(index);
                required -= measured[index].minimum;
                // 原末列隐藏后，新末列接管额外的 4px 外缘留白。
                if (index === measured.length - 1 && !measured[index].role) required += minimumPadding;
            }
        }
        // 拖动时宽度驱动渐隐；停留时恢复，重新拖动从当前透明度接续。
        let fadingIndex = -1;
        let fadeOpacity = 1;
        if (!options.horizontalScroll && !complexGrid) {
            for (let index = measured.length - 1; index >= 0; index--) {
                if (!hidden.has(index) && measured[index].hideable) {
                    fadingIndex = index;
                    break;
                }
            }
        }
        fadeOpacity = exit.update(available + 0.5, required, fadeDistance, fadingIndex < 0 ? '' : String(fadingIndex));
        fadedCells = [];
        const remainingData = measured.map((column, index) => ({column, index})).filter(({column, index}) => !column.role && !hidden.has(index));
        // 只对最终单列的文本布局收缩。保护列、硬尺寸、合并网格和控件仍滚动兜底，不能裁掉操作。
        const lastIndex = remainingData[0]?.index;
        const textCells = rows().flatMap(row => Array.from(row.cells).filter((_, index) => index === lastIndex));
        const textFit = !complexGrid && !options.horizontalScroll && required > available + 0.5 && remainingData.length === 1
            && (layout === 'overlay' || !measured.some(column => column.role)) && !table.style.minWidth && available > minimumPadding * 4
            && textCells.length > 0 && textCells.every(cell => cell.colSpan === 1 && cell.rowSpan === 1
                && !cell.style.width && !cell.style.minWidth
                && (cell.tagName === 'TH' || !cell.querySelector('button, input, select, textarea, img, svg, canvas, video, iframe, [role="button"], [contenteditable="true"]')));
        const hiddenKey = [...hidden].join(',');
        const animate = previousHidden !== undefined && hiddenKey !== previousHidden;
        const before = animate ? columnMotion.capture() : undefined;
        // 同一可见列集合内继续拖动时保留正在播放的插值，不逐帧重启 easing。
        if (animate) columnMotion.finish();
        previousHidden = hiddenKey;
        table.classList.toggle('snowui-table-responsive-text-fit', textFit);
        // 容器改变时由同一次 CSS 布局同步调整 padding，不能等尺寸回调再补一次位移。
        // 显式固定列宽可能使首选与最小宽度相等，此时保留原来的边界选择。
        const padding = preferred > minimum
            ? `clamp(${minimumPadding}px, calc(${minimumPadding}px + (100cqw - ${minimum}px) * ${(preferredPadding - minimumPadding) / (preferred - minimum)}), ${preferredPadding}px)`
            : `${minimumPadding + (preferredPadding - minimumPadding) * ratio}px`;
        const paddingProperty = '--snowui-table-responsive-cell-padding-inline';
        if (table.style.getPropertyValue(paddingProperty) !== padding) table.style.setProperty(paddingProperty, padding);
        table.dataset.responsiveLayout = layout;
        options.onLayout(layout, measuredActionsWidth);
        for (const row of rows()) {
            let index = 0;
            const visible: HTMLTableCellElement[] = [];
            for (const cell of Array.from(row.cells)) {
                const span = originalSpans.get(cell) ?? cell.colSpan;
                originalSpans.set(cell, span);
                const remaining = Array.from({ length: span }, (_, offset) => index + offset).filter(column => !hidden.has(column)).length;
                const hide = remaining === 0;
                if (hide && cell.contains(document.activeElement)) viewport.focus({ preventScroll: true });
                cell.classList.toggle('snowui-table-responsive-hidden', hide);
                // 合并单元格不随其中某一列淡出；只同步一一对应的表头和数据 Cell。
                if (span === 1 && index === fadingIndex) fadedCells.push(cell);
                const opacity = span === 1 && index === fadingIndex ? fadeOpacity : 1;
                const property = '--snowui-table-responsive-column-opacity';
                if (opacity < 1) {
                    const value = opacity.toFixed(4);
                    if (cell.style.getPropertyValue(property) !== value) cell.style.setProperty(property, value);
                } else if (cell.style.getPropertyValue(property)) cell.style.removeProperty(property);
                if (span > 1) cell.colSpan = Math.max(1, remaining);
                renderedSpans.set(cell, cell.colSpan);
                cell.classList.remove('snowui-table-cell-visible-first');
                cell.classList.remove('snowui-table-cell-visible-last');
                if (!hide && !(layout === 'overlay' && (cell.dataset.as === 'selection' || cell.dataset.as === 'actions'))) visible.push(cell);
                index += span;
            }
            visible[0]?.classList.add('snowui-table-cell-visible-first');
            visible.at(-1)?.classList.add('snowui-table-cell-visible-last');
        }
        if (before) columnMotion.play(before);
    }
    function schedule() {
        if (!disposed && !frame) frame = requestAnimationFrame(flush);
    }
    function refresh() { columns = undefined; schedule(); }
    const unwatch = resizeManager.watch(viewport, () => {
        // 共享观察器已在动画帧批量交付；直接计算，避免再排一帧让间距落后于布局。
        if (frame) cancelAnimationFrame(frame);
        flush();
    });
    const tokenProbe = document.createElement('span');
    tokenProbe.setAttribute('aria-hidden', 'true');
    Object.assign(tokenProbe.style, { position: 'fixed', visibility: 'hidden', pointerEvents: 'none', width: 'var(--size-10)', height: '0' });
    viewport.append(tokenProbe);
    const unwatchTokens = resizeManager.watch(tokenProbe, refresh);
    const observer = new MutationObserver(records => {
        if (records.some(record => {
            if (record.attributeName === 'class' && record.target instanceof Element) {
                const owned = new Set(['snowui-table-responsive-hidden', 'snowui-table-cell-visible-first', 'snowui-table-cell-visible-last', 'snowui-table-responsive-text-fit']);
                const authored = (value: string | null) => (value ?? '').split(/\s+/).filter(name => !owned.has(name)).join(' ');
                // 组件动态 class 更新可能重写 className；恢复布局标记，但忽略自己的写入。
                return authored(record.oldValue) !== authored(record.target.getAttribute('class'));
            }
            if (record.attributeName === 'style' && record.target instanceof HTMLTableCellElement) {
                const authored = (value: string | null) => (value ?? '').replace(/--snowui-table-responsive-column-opacity\s*:[^;]*(;|$)/g, '').replace(/\s/g, '');
                return authored(record.oldValue) !== authored(record.target.getAttribute('style'));
            }
            if (record.attributeName === 'colspan'  && record.target instanceof HTMLTableCellElement) {
                if (renderedSpans.get(record.target) === record.target.colSpan) return false;
                originalSpans.set(record.target, record.target.colSpan);
                return true;
            }
            return record.type !== 'attributes' || record.attributeName !== 'style' || (record.target instanceof Element && record.target.matches('th, td'));
        })) refresh();
    });
    observer.observe(table, { childList: true, characterData: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ['data-responsive-hide', 'data-column-id', 'style', 'colspan', 'rowspan', 'class'] });
    window.addEventListener('resize', refresh);
    table.addEventListener('load', refresh, true);
    document.fonts?.addEventListener('loadingdone', refresh);
    schedule();
    return {
        update(next: Options) { options = next; refresh(); },
        destroy() {
            disposed = true;
            exit.destroy();
            if (frame) cancelAnimationFrame(frame);
            observer.disconnect();
            columnMotion.destroy();
            unwatch();
            unwatchTokens();
            tokenProbe.remove();
            window.removeEventListener('resize', refresh);
            table.removeEventListener('load', refresh, true);
            document.fonts?.removeEventListener('loadingdone', refresh);
            for (const row of rows()) for (const cell of Array.from(row.cells)) {
                const span = originalSpans.get(cell);
                if (span !== undefined) cell.colSpan = span;
                cell.classList.remove('snowui-table-responsive-hidden', 'snowui-table-cell-visible-first', 'snowui-table-cell-visible-last');
                cell.style.removeProperty('--snowui-table-responsive-column-opacity');
            }
            table.style.removeProperty('--snowui-table-responsive-cell-padding-inline');
            delete table.dataset.responsiveLayout;
            table.classList.remove('snowui-table-responsive-text-fit');
        },
    };
}
