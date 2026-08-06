<!-- OSS 语义表格根。宽表参与页面固有宽度计算，角色列支持列内/覆盖两种布局。文档: ./Table.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import type { ResourceSize } from "../context";
    import { getTableContext, provideTableContext, type TableColumnRegistration } from "../lib/table-context.svelte";
    import { createEdgeFadeMaskImage } from "../lib/edge-fade";
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
    let autoLockedColumnWidths = $state<Record<string, number>>({});
    let hasAutoLockedColumnWidths = $state(false);
    const parentTable = getTableContext();
    const truncationManager = new TableTruncationManager();

    provideTableContext({
        getColumnWidth: (columnId) => columnWidths[columnId] ?? autoLockedColumnWidths[columnId],
        setColumnWidth: (columnId, width) => {
            columnWidths = { ...columnWidths, [columnId]: Math.round(width) };
            onColumnWidthsChange?.(columnWidths);
            truncationManager.schedule();
        },
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
    bind:element={viewportElement}
    class={`snowui-table-viewport ${userClass}`}
    data-role-layout={parentTable.isDataTable() ? parentTable.getRoleLayout() : undefined}
    style={fadeMaskVars}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    {...rest}
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
</Frame>

<style>
    :global(:where(.snowui-table-viewport)) {
        width: 100%;
        min-width: 0;
        overflow: visible;
    }
    :global(:where(.snowui-table-viewport[data-continuous-hover-overlay-host="true"] > .snowui-table)) {
        position: relative;
        z-index: 1;
    }
    :global(:where(.snowui-table)) {
        width: max-content;
        min-width: 100%;
        border-spacing: 0;
        border-collapse: separate;
        table-layout: auto;
        color: var(--black-100, #000);
        font-size: var(--snowui-table-font-size-override, var(--text-12, 0.75rem));
        line-height: var(--snowui-table-line-height-override, var(--leading-12, 1rem));
    }
</style>
