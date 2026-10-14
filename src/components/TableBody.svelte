<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Table 表体语义容器。文档: ./TableBody.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { untrack, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import TableRow from "./TableRow.svelte";
    import TableCell from "./TableCell.svelte";
    import Spinner from "./Spinner.svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import { getTableContext, type TableColumnRegistration } from "../lib/table-context.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import { ContinuousHoverController } from "../logic/continuous-hover.svelte";
    import { CONTINUOUS_HOVER_MOTION_STYLE } from "../motion/presets/continuous-hover";
    interface Props extends Omit<FrameProps, "children"> {
        loading?: boolean;
        /** 已知的数据行数，用于首次加载占位；0 表示没有数据行。 */
        rowCount?: number;
        loadingSpinner?: boolean;
        /** 数据行之间是否使用容器级连续 hover 背景。 */
        continuousHover?: boolean;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            TableRow: typeof TableRow;
            TableCell: typeof TableCell;
            Spinner: typeof Spinner;
        }>;
        [key: string]: any;
    }
    let { rowCount = undefined, loading = undefined, loadingSpinner = undefined, continuousHover = true, children, parts = undefined, class: userClass = "", style: userStyle = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $props();
    const table = getTableContext();
    const fallbackColumns: readonly TableColumnRegistration[] = [{ align: "start" }];
    const resolvedLoading = $derived(loading ?? table.getLoading());
    const resolvedLoadingSpinner = $derived(
        loadingSpinner ?? table.getLoadingSpinner(),
    );
    let estimatedRowCount = $state(1);
    const resolvedLoadingRowCount = $derived(
        rowCount !== undefined && Number.isFinite(rowCount)
            ? Math.max(0, Math.floor(rowCount))
            : table.isDataTable()
              ? Math.max(0, Math.floor(table.getLoadingRowCount()))
              : estimatedRowCount,
    );
    const skeletonColumns = $derived(
        table.getColumns().length > 0 ? table.getColumns() : fallbackColumns,
    );
    const skeletonWidths = ["62%", "76%", "54%", "68%"];
    let bodyElement = $state<HTMLElement | undefined>(undefined);
    let continuousHoverController: ContinuousHoverController | undefined;
    $effect(() => {
        const body = bodyElement;
        if (!body || !resolvedLoading || rowCount !== undefined || table.isDataTable()) return;
        // 只测量外部滚动边界，不使用由骨架自身撑开的 tbody/table 高度。
        let container: HTMLElement | null = body.parentElement?.parentElement?.parentElement?.parentElement ?? null;
        while (container && container !== document.body) {
            if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(container).overflowY)) break;
            container = container.parentElement;
        }
        const boundary = container && container !== document.body ? container : null;
        const measure = () => {
            const top = body.getBoundingClientRect().top;
            const bottom = boundary
                ? Math.min(window.innerHeight, boundary.getBoundingClientRect().top + boundary.clientTop + boundary.clientHeight)
                : window.innerHeight;
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            estimatedRowCount = Math.max(1, Math.floor(Math.max(0, bottom - Math.max(0, top)) / (2.5 * rem)));
        };
        untrack(measure);
        const unwatch = resizeManager.watch(boundary ?? document.documentElement, measure);
        window.addEventListener("resize", measure);
        return () => { unwatch(); window.removeEventListener("resize", measure); };
    });
    $effect(() => {
        if (!bodyElement || !continuousHover) return;
        const overlayHost = bodyElement.closest<HTMLElement>(".snowui-table-scroll-viewport");
        if (!overlayHost) return;
        continuousHoverController ??= new ContinuousHoverController();
        return continuousHoverController.attach(bodyElement, {
            selector: ":scope > .snowui-table-row",
            layerClass: "snowui-table-continuous-hover-layer",
            axis: "y",
            geometryMode: "direct",
            enabled: true,
            overlayHost,
        });
    });
    function getSkeletonWidth(rowIndex: number, columnIndex: number) {
        return skeletonWidths[(rowIndex + columnIndex * 2) % skeletonWidths.length];
    }
</script>
<Frame bind:element={bodyElement} tag="tbody" data-loading={resolvedLoading ? "true" : undefined} class={`snowui-table-body ${userClass}`} style={[CONTINUOUS_HOVER_MOTION_STYLE, userStyle].filter(Boolean).join("; ")} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {#if resolvedLoading}
        {#each Array(resolvedLoadingRowCount) as _, rowIndex (rowIndex)}
            <TableRow data-skeleton="true" aria-hidden="true">
                {#each skeletonColumns as column, columnIndex (column.columnId ?? columnIndex)}
                    <TableCell
                        columnId={column.columnId}
                        as={column.role}
                        align={column.align}
                        skeleton
                        style={`--snowui-table-body-skeleton-width:var(--snowui-table-body-skeleton-width-override, ${getSkeletonWidth(rowIndex, columnIndex)})`}
                    />
                {/each}
            </TableRow>
        {/each}
    {:else}
        {#if children}<ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>{/if}
        {#if resolvedLoadingSpinner}
            <TableRow data-loading-spinner="true">
                <TableCell
                    class="snowui-table-loading-cell"
                    data-loading-spinner-cell="true"
                    colspan={Math.max(1, skeletonColumns.length)}
                    lines={false}
                    tooltip={false}
                >
                    <span class="snowui-table-loading-indicator">
                        <Spinner size={table.getLoadingSpinnerSize()} />
                    </span>
                </TableCell>
            </TableRow>
        {/if}
    {/if}
</Frame>

<style>
    :global(:where(.snowui-table-loading-cell)) { text-align: center; }
    :global(:where(.snowui-table-loading-indicator)) { display: flex; width: 100%; align-items: center; justify-content: center; font-size: var(--text-12); line-height: var(--leading-12); }
    :global(:where(.snowui-table-row[data-loading-spinner="true"] > .snowui-table-cell)) { border-radius: 0; border-bottom-color: var(--black-10, #0000001a); background: transparent; }
    :global(:where(.snowui-table-continuous-hover-layer)) {
        border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem));
        background: var(--snowui-table-row-hover-background-override, var(--black-4, #0000000a));
    }
</style>
