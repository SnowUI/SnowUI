<!-- OSS 语义表格根。宽表参与页面固有宽度计算，角色列支持列内/覆盖两种布局。文档: ./Table.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import type { ResourceSize } from "../context";
    import { getTableContext, provideTableContext, type TableColumnRegistration } from "../lib/table-context.svelte";
    import { createEdgeFadeMaskImage } from "../lib/edge-fade";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import { TableTruncationManager } from "../lib/table-truncation";
    interface Props extends Omit<FrameProps, "children"> {
        columnWidths?: Record<string, number>;
        minWidth?: number | string;
        ariaLabel?: string;
        loadingSpinnerSize?: ResourceSize;
        onColumnWidthsChange?: (widths: Record<string, number>) => void;
        children?: Snippet;
        [key: string]: any;
    }
    let {
        columnWidths = $bindable({}),
        minWidth = undefined,
        ariaLabel = undefined,
        loadingSpinnerSize = 16,
        onColumnWidthsChange,
        children,
        class: userClass = "",
        style: userStyle = "",
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    // Column registrations are identity-based handles. Keep their original
    // identity so unregister can remove the exact object without comparing a
    // deep-state proxy against its source object.
    let registeredColumns = $state.raw<TableColumnRegistration[]>([]);
    let tableElement = $state<HTMLElement>();
    let viewportElement = $state<HTMLElement>();
    let horizontalTrackElement = $state<HTMLElement>();
    let autoLockedColumnWidths = $state<Record<string, number>>({});
    let hasAutoLockedColumnWidths = $state(false);
    const parentTable = getTableContext();
    const defaultColumnWidths = new Map<string, number>();
    const truncationManager = new TableTruncationManager();
    const horizontalScrollbar = useOverlayScrollbar(
        () => viewportElement,
        () => horizontalTrackElement,
        "horizontal",
    );

    function syncHorizontalThumb(node: HTMLElement) {
        $effect(() => {
            node.style.width = `${horizontalScrollbar.thumbSize}px`;
            node.style.transform = `translate3d(${horizontalScrollbar.thumbOffset}px,0,0)`;
        });
    }

    function columnCells(columnId: string) {
        return [...(tableElement?.querySelectorAll<HTMLElement>(".snowui-table-head, .snowui-table-cell") ?? [])]
            .filter(cell => cell.dataset.columnId === columnId);
    }

    function setColumnWidth(columnId: string, width: number) {
        if (!defaultColumnWidths.has(columnId)) {
            defaultColumnWidths.set(columnId, columnWidths[columnId]
                ?? autoLockedColumnWidths[columnId]
                ?? columnCells(columnId)[0]?.getBoundingClientRect().width ?? width);
        }
        columnWidths = { ...columnWidths, [columnId]: Math.round(width) };
        onColumnWidthsChange?.(columnWidths);
        truncationManager.schedule();
    }

    function fitColumnWidth(columnId: string, min: number, max: number) {
        const cells = columnCells(columnId);
        if (!cells.length) return;
        const wraps = cells.some(cell => cell.querySelector<HTMLElement>(".snowui-table-cell-content")?.dataset.nowrap === "false");
        let preferred = defaultColumnWidths.get(columnId)
            ?? columnWidths[columnId] ?? autoLockedColumnWidths[columnId]
            ?? cells[0].getBoundingClientRect().width;
        if (!wraps) {
            preferred = 0;
            for (const cell of cells) {
                const content = cell.querySelector<HTMLElement>(".snowui-table-cell-content, .snowui-table-head-content");
                if (!content) continue;
                const copy = content.cloneNode(true) as HTMLElement;
                copy.setAttribute("aria-hidden", "true");
                copy.inert = true;
                Object.assign(copy.style, {
                    position: "fixed", visibility: "hidden", pointerEvents: "none",
                    width: "max-content", minWidth: "0", maxWidth: "none",
                    whiteSpace: "nowrap", flexWrap: "nowrap", overflow: "visible",
                    display: content.dataset.row === "true" ? "inline-flex" : "inline-block",
                    webkitLineClamp: "unset", maskImage: "none",
                });
                cell.append(copy);
                const style = getComputedStyle(cell);
                const sortIcon = cell.querySelector(".snowui-table-sort")
                    ? Math.max(12, parseFloat(getComputedStyle(document.documentElement).fontSize)) : 0;
                preferred = Math.max(preferred, copy.getBoundingClientRect().width
                    + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + sortIcon);
                copy.remove();
            }
        }
        setColumnWidth(columnId, Math.max(min, Math.min(max, Math.ceil(preferred))));
    }

    provideTableContext({
        getColumnWidth: (columnId) =>
            columnWidths[columnId]
            ?? autoLockedColumnWidths[columnId]
            ?? parentTable.getColumnWidth(columnId),
        setColumnWidth,
        fitColumnWidth,
        getLoadingSpinnerSize: () => loadingSpinnerSize,
        registerColumn: (column) => {
            registeredColumns = [...registeredColumns, column];
            const unregisterParent = parentTable.registerColumn(column);
            return () => {
                registeredColumns = registeredColumns.filter((item) => item !== column);
                unregisterParent();
            };
        },
        getColumns: () => registeredColumns,
        registerTruncationTarget: (node, target) =>
            truncationManager.register(node, target),
        requestTruncationMeasure: () => truncationManager.schedule(),
    });

    $effect(() => {
        if (!viewportElement || !tableElement) return;
        return truncationManager.observe(viewportElement, tableElement);
    });
    $effect(() => () => truncationManager.destroy());

    // 增量加载第一次开始前锁定当前自然列宽。后续新行即使出现更宽内容，也只在已有列宽内
    // 截断，不再触发原生 table-layout:auto 重新分配整表列宽并带动已有行横向晃动。
    // 外部 columnWidths 与用户拖动列宽始终优先；自动锁定只补齐尚未显式设置的普通数据列。
    $effect(() => {
        if (!parentTable.getLoadingMore() || hasAutoLockedColumnWidths || !tableElement) return;
        const next: Record<string, number> = {};
        const heads = (tableElement as HTMLTableElement).tHead?.querySelectorAll<HTMLElement>("th") ?? [];
        for (const head of heads) {
            const columnId = head.dataset.columnId;
            if (!columnId || columnId.startsWith("__") || columnWidths[columnId] !== undefined) continue;
            const width = head.getBoundingClientRect().width;
            if (Number.isFinite(width) && width > 0) next[columnId] = width;
        }
        if (Object.keys(next).length === 0) return;
        autoLockedColumnWidths = next;
        hasAutoLockedColumnWidths = true;
    });
    const tableStyle = $derived(
        `${minWidth !== undefined ? `min-width:${typeof minWidth === "number" ? `${minWidth}px` : minWidth}` : ""};${userStyle}`,
    );

    // 内容边缘渐隐遮罩（overlay 角色列）：复用 OSS edge-fade 通用能力生成固定参数的
    // selection / head mask，存到表格根供 TableCell / TableHead 消费。依赖行级实测宽度的
    // actions mask 必须在 TableCell 自身作用域生成（详见 ./Table.md、../lib/edge-fade.md）。
    const selectionFadeMask = createEdgeFadeMaskImage({
        direction: "to right",
        fadeStart: "var(--snowui-table-selection-fade-start-override, var(--size-4, 1rem))",
        fadeEnd: "var(--snowui-table-selection-fade-end-override, calc((var(--size-14, 3.5rem) + var(--size-16, 4rem)) / 2))",
    });
    const headFadeMask = createEdgeFadeMaskImage({
        direction: "to right",
        fadeStart: "var(--snowui-table-head-fade-start-override, calc((var(--size-3, .75rem) + var(--size-4, 1rem)) / 2))",
        fadeEnd: "var(--snowui-table-head-fade-end-override, calc((var(--size-6, 1.5rem) + var(--size-7, 1.75rem)) / 2))",
    });
    const fadeMaskVars =
        `--snowui-table-selection-fade-mask:${selectionFadeMask};` +
        `--snowui-table-head-fade-mask:${headFadeMask};`;

</script>

<Frame
    class={`snowui-table-viewport snowui-overlay-scrollbar-host ${userClass}`}
    data-role-layout={parentTable.isDataTable() ? parentTable.getRoleLayout() : undefined}
    data-axis="horizontal"
    data-horizontal-track-position={horizontalScrollbar.hasOverflow ? "viewport" : undefined}
    style={fadeMaskVars}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    {...rest}
>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        bind:this={viewportElement}
        class="snowui-table-scroll-viewport snowui-overlay-scrollbar-viewport"
        data-scroll-axis="horizontal"
        role="region"
        aria-label={ariaLabel ? `${ariaLabel} horizontal scroll` : "Scrollable table"}
        tabindex="0"
    >
        <Frame
            tag="table"
            bind:element={tableElement}
            class="snowui-table"
            style={tableStyle}
            aria-label={ariaLabel}
            enableAutoLayout={false}
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
        >
            {#if children}{@render children()}{/if}
        </Frame>
    </div>
    <div
        bind:this={horizontalTrackElement}
        class="snowui-table-scrollbar snowui-overlay-scrollbar"
        data-axis="horizontal"
        data-visible={horizontalScrollbar.hasOverflow ? "true" : undefined}
        aria-hidden="true"
    >
        <div use:syncHorizontalThumb class="snowui-overlay-scrollbar-thumb"></div>
    </div>
</Frame>

<style>
    :global(:where(.snowui-table-viewport)) {
        width: 100%;
        min-width: 0;
        position: relative;
        overflow: visible;
        container-type: inline-size;
        --snowui-table-responsive-cell-padding-inline: clamp(
            calc(var(--padding-1) / 2),
            calc((100cqi - (var(--size-16) * 7)) / 16),
            var(--padding-3)
        );
    }
    :global(:where(.snowui-table-scroll-viewport)) {
        width: 100%;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
    }
    :global(:where(.snowui-table-scrollbar)) {
        /* Continuous Hover 会将 table 提升到 z-index: 1；轨道必须稳定处于
         * 内容层之上，否则吸底到数据行上时可见但无法接收指针。 */
        z-index: 2;
    }
    :global(:where(.snowui-table-scroll-viewport[data-continuous-hover-overlay-host="true"] .snowui-table)) {
        position: relative;
        z-index: 1;
    }
    :global(:where(.snowui-table)) {
        width: 100%;
        min-width: min-content;
        border-spacing: 0;
        border-collapse: separate;
        table-layout: auto;
        color: var(--black-100, #000);
        font-size: var(--snowui-table-font-size-override, var(--text-12, 0.75rem));
        line-height: var(--snowui-table-line-height-override, var(--leading-12, 1rem));
    }
</style>
