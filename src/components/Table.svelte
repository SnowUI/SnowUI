<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 语义表格根。宽表参与页面固有宽度计算，角色列支持列内/覆盖两种布局。文档: ./Table.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { untrack, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import type { ResourceSize } from "../context";
    import { getTableContext, provideTableContext, type TableColumnRegistration, type TableRoleLayout } from "../lib/table-context.svelte";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import { TableTruncationManager } from "../lib/table-truncation";
    import { observeTableResponsive } from "../lib/table-responsive";
    import { useLocale } from "../i18n/locale.svelte";
    interface Props extends Omit<FrameProps, "children"> {
        columnWidths?: Record<string, number>;
        horizontalScroll?: boolean;
        roleLayout?: TableRoleLayout;
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
        horizontalScroll = undefined,
        roleLayout = undefined,
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
    const localeContext = useLocale();
    let measuredActionsWidth = $state(0);
    let actionsContentWidth = $state<number | undefined>(undefined);
    let resolvedRoleLayout = $state<"column" | "overlay">("overlay");
    const requestedRoleLayout = $derived(roleLayout ?? parentTable.getRoleLayout());
    const resolvedHorizontalScroll = $derived(horizontalScroll ?? parentTable.getHorizontalScroll());
    let responsiveController: ReturnType<typeof observeTableResponsive> | undefined;
    $effect(() => {
        if (!tableElement || !viewportElement) return;
        const controller = untrack(() => observeTableResponsive(tableElement as HTMLTableElement, viewportElement!, {
            horizontalScroll: resolvedHorizontalScroll,
            roleLayout: requestedRoleLayout,
            actionsWidth: Math.min(columnWidths.__actions ?? parentTable.getActionsColumnWidth(), parentTable.getActionsMaxWidth()),
            onLayout: (layout, width, contentWidth) => { resolvedRoleLayout = layout; measuredActionsWidth = width; actionsContentWidth = contentWidth; },
        }));
        responsiveController = controller;
        return () => { controller.destroy(); responsiveController = undefined; };
    });
    $effect(() => {
        columnWidths; autoLockedColumnWidths; userStyle;
        // 列宽变化触发统一重测，不增加逐列观察器。
        const options = {
            horizontalScroll: resolvedHorizontalScroll,
            roleLayout: requestedRoleLayout,
            actionsWidth: Math.min(columnWidths.__actions ?? parentTable.getActionsColumnWidth(), parentTable.getActionsMaxWidth()),
            onLayout: (layout: "column" | "overlay", width: number, contentWidth: number) => { resolvedRoleLayout = layout; measuredActionsWidth = width; actionsContentWidth = contentWidth; },
        };
        untrack(() => responsiveController?.update(options));
    });
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
        getActionsColumnWidth: () => measuredActionsWidth || parentTable.getActionsColumnWidth(),
        getActionsContentWidth: () => actionsContentWidth,
        getRoleLayout: () => requestedRoleLayout === "auto" ? resolvedRoleLayout : requestedRoleLayout,
        getHorizontalScroll: () => resolvedHorizontalScroll,
        getColumnWidth: (columnId) => columnId === "__actions" && measuredActionsWidth > 0 ? measuredActionsWidth :
            columnWidths[columnId]
            ?? autoLockedColumnWidths[columnId]
            ?? (columnId === "__actions" && (requestedRoleLayout === "column" || (requestedRoleLayout === "auto" && resolvedRoleLayout === "column"))
                ? Math.max(measuredActionsWidth, parentTable.getActionsColumnWidth())
                : parentTable.getColumnWidth(columnId)),
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


</script>

<Frame
    class={`snowui-table-viewport snowui-overlay-scrollbar-host ${userClass}`}
    data-role-layout={requestedRoleLayout === "auto" ? resolvedRoleLayout : requestedRoleLayout}
    data-axis="horizontal"
    data-horizontal-track-position={horizontalScrollbar.hasOverflow ? "viewport" : undefined}
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
        aria-label={ariaLabel
            ? localeContext.t("table.scrollRegionNamed", { name: ariaLabel })
            : localeContext.t("table.scrollRegion")}
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
    :global(:where(.snowui-table .snowui-table-responsive-hidden)) { display: none; }
    :global(:where(.snowui-table-viewport)) {
        width: 100%;
        min-width: 0;
        position: relative;
        overflow: visible;
        container-type: inline-size;
        --snowui-table-responsive-cell-padding-inline: var(--padding-3);
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
    /* 仅剩一列纯文本时解除 min-content 撑宽；显式尺寸及不可压缩控件由控制器排除。 */
    :global(:where(.snowui-table.snowui-table-responsive-text-fit)) { table-layout: fixed; min-width: 0; }
</style>
