<!-- Table 行；圆角由首尾单元格自动完成。文档: ./TableRow.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getTableContext } from "../lib/table-context.svelte";
    import { provideTableRowContext } from "../lib/table-row-context.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";
    interface Props extends Omit<FrameProps, "children"> { rowId?: string | number; active?: boolean; children?: Snippet; onclick?: (event: MouseEvent) => void; [key: string]: any; }
    const inheritedTableRowPart = useComponentPart<Props>("TableRow");
    let explicitProps: Props = $props();
    let { rowId, active = false, children, onclick, whileAppear: userWhileAppear = undefined, currentState: userCurrentState = undefined, class: userClass = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $derived(mergeComponentPartProps(inheritedTableRowPart.current, explicitProps));
    const table = getTableContext();
    const isSelected = $derived(rowId !== undefined && table.isRowSelected(rowId));
    const resolvedWhileAppear = $derived(userWhileAppear);
    // DataTable 内部的新行动效由普通 TableCell 消费，避免整行 opacity 压暗 overlay 控件。
    // TableRow 仅保留使用方显式声明的行级 whileAppear。
    const resolvedCurrentState = $derived(
        userCurrentState ?? (resolvedWhileAppear === undefined ? undefined : "Appear"),
    );
    provideTableRowContext({ getRowId: () => rowId });
    $effect(() => {
        if (rowId === undefined || !table.isSelectionEnabled()) return;
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
<Frame tag="tr" data-row-id={rowId} data-active={active ? "true" : undefined} data-selected={isSelected ? "true" : undefined} class={`snowui-table-row ${userClass}`} onclick={handleClick} whileAppear={resolvedWhileAppear} currentState={resolvedCurrentState} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} {...rest} data-skeleton={rest["data-skeleton"]} data-loading-spinner={rest["data-loading-spinner"]}>
    {#if children}{@render children()}{/if}
</Frame>
<style>
    :global(:where(.snowui-table-row[data-skeleton="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-row[data-loading-spinner="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-row[data-active="true"])) {
        --snowui-table-row-active-background: var(--snowui-table-row-hover-background-override, var(--black-4, #0000000a));
        --snowui-table-row-active-leading-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem));
        --snowui-table-row-active-trailing-radius: 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0;
    }
    :global(:where(.snowui-table-row) > :is(.snowui-table-cell, .snowui-table-head)) { transition: none; }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"]):not([data-loading-spinner="true"])):is(:hover, [data-active="true"], [data-force-hover="true"]) > .snowui-table-cell:first-child) { border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"]):not([data-loading-spinner="true"])):is(:hover, [data-active="true"], [data-force-hover="true"]) > .snowui-table-cell:last-child) { border-radius: 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0; }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"])[data-active="true"]) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"])[data-active="true"])) > .snowui-table-cell) { border-bottom-color: transparent; }
</style>
