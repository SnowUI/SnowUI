<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- Table 行；圆角由首尾单元格自动完成。文档: ./TableRow.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { getContext, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getTableContext } from "../lib/table-context.svelte";
    import { provideTableRowContext } from "../lib/table-row-context.svelte";
    import { SKELETON_CONTEXT_KEY } from "../keys";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";
    interface Props extends Omit<FrameProps, "children"> { rowId?: string | number; active?: boolean; children?: Snippet; onclick?: (event: MouseEvent) => void; [key: string]: any; }
    const inheritedTableRowPart = useComponentPart<Props>("TableRow");
    let explicitProps: Props = $props();
    let { rowId, active = false, children, onclick, whileAppear: userWhileAppear = undefined, currentState: userCurrentState = undefined, class: userClass = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $derived(mergeComponentPartProps(inheritedTableRowPart.current, explicitProps));
    const table = getTableContext();
    const parentSkeletonContext = getContext(SKELETON_CONTEXT_KEY);
    const selectionEnabled = $derived(table.isSelectionEnabled());
    const isSelected = $derived(
        selectionEnabled && rowId !== undefined && table.isRowSelected(rowId),
    );
    const resolvedWhileAppear = $derived(userWhileAppear);
    // DataTable 内部的新行动效由普通 TableCell 消费，避免整行 opacity 压暗 overlay 控件。
    // TableRow 仅保留使用方显式声明的行级 whileAppear。
    const resolvedCurrentState = $derived(
        userCurrentState ?? (resolvedWhileAppear === undefined ? undefined : "Appear"),
    );
    const useSemanticFastPath = $derived(
        resolvedWhileAppear === undefined
        && userCurrentState === undefined
        && parentSkeletonContext === undefined
        && !enableResponsive
        && !enableContext
        && !enableScaleObserver
        && Object.keys(rest).length === 0,
    );
    provideTableRowContext({ getRowId: () => rowId });
    $effect(() => {
        if (rowId === undefined || !selectionEnabled) return;
        return table.registerRow(rowId);
    });
    function handleClick(event: MouseEvent) {
        onclick?.(event);
        if (event.defaultPrevented || rowId === undefined) return;
        const rowRect = event.currentTarget instanceof Element
            ? event.currentTarget.getBoundingClientRect()
            : undefined;
        const isSelectionOverlayHit =
            rowRect !== undefined
            && event.clientX >= rowRect.left
            && event.clientX <= rowRect.left + 32;
        if (isSelectionOverlayHit) {
            event.preventDefault();
            table.setRowSelected(rowId, !isSelected);
            return;
        }
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (
            target.closest(
                'a, button, input, label, select, textarea, [role="button"], [role="checkbox"]',
            )
        ) return;
        if (table.hasRowPreview()) {
            event.preventDefault();
            table.openRowPreview(rowId, event);
        }
    }
</script>
{#if useSemanticFastPath}
<tr
    data-row-id={rowId}
    data-active={active ? "true" : undefined}
    data-selected={isSelected ? "true" : undefined}
    class={`snowui-frame snowui-table-row ${userClass}`}
    data-snowui-frame="true"
    data-content-width="hug"
    data-state="Idle"
    onclick={handleClick}
>
    {#if children}{@render children()}{/if}
</tr>
{:else}
<Frame tag="tr" data-row-id={rowId} data-active={active ? "true" : undefined} data-selected={isSelected ? "true" : undefined} class={`snowui-table-row ${userClass}`} onclick={handleClick} whileAppear={resolvedWhileAppear} currentState={resolvedCurrentState} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} {...rest} data-skeleton={rest["data-skeleton"]} data-loading-spinner={rest["data-loading-spinner"]}>
    {#if children}{@render children()}{/if}
</Frame>
{/if}
<style>
    :global(:where(.snowui-table-row[data-skeleton="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-row[data-loading-spinner="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-row[data-active="true"])) {
        --snowui-table-row-active-background: var(--snowui-table-row-hover-background-override, var(--black-4, #0000000a));
    }
    :global(:where(.snowui-table-row) > :is(.snowui-table-cell, .snowui-table-head)) { transition: none; }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"])[data-active="true"]) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"])[data-active="true"])) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"]):not([data-loading-spinner="true"]):is(:hover, [data-active="true"], [data-force-hover="true"]))) { --snowui-table-row-corner-radius: var(--snowui-table-row-radius-override, var(--radius-3)); }
</style>
