<!-- Table 表体语义容器。文档: ./TableBody.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import TableRow from "./TableRow.svelte";
    import TableCell from "./TableCell.svelte";
    import Spinner from "./Spinner.svelte";
    import { getTableContext, type TableColumnRegistration } from "../lib/table-context.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import { ContinuousHoverController } from "../logic/continuous-hover.svelte";
    import { CONTINUOUS_HOVER_MOTION_STYLE } from "../motion/presets/continuous-hover";
    interface Props extends Omit<FrameProps, "children"> {
        loading?: boolean;
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
    let { loading = undefined, loadingSpinner = undefined, continuousHover = true, children, parts = undefined, class: userClass = "", style: userStyle = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $props();
    const table = getTableContext();
    const fallbackColumns: readonly TableColumnRegistration[] = [{ align: "start" }];
    const resolvedLoading = $derived(loading ?? table.getLoading());
    const resolvedLoadingSpinner = $derived(
        loadingSpinner ?? table.getLoadingSpinner(),
    );
    const resolvedLoadingRowCount = $derived(
        Math.max(1, Math.floor(Number(table.getLoadingRowCount()) || 10)),
    );
    const skeletonColumns = $derived(
        table.getColumns().length > 0 ? table.getColumns() : fallbackColumns,
    );
    const skeletonWidths = ["62%", "76%", "54%", "68%"];
    let bodyElement = $state<HTMLElement | undefined>(undefined);
    let continuousHoverController: ContinuousHoverController | undefined;
    $effect(() => {
        if (!bodyElement || !continuousHover) return;
        const overlayHost = bodyElement.closest<HTMLElement>(".snowui-table-viewport");
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
        {#if children}{@render children()}{/if}
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
