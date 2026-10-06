<!-- 可排序、可调整列宽的表头单元格。文档: ./TableHead.md -->
<script lang="ts">
     import { untrack, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Indicator from "./Indicator.svelte";
    import Checkbox from "./Checkbox.svelte";
    import { getTableContext, type TableColumnRegistration, type TableRoleLayout } from "../lib/table-context.svelte";
    import { tableSelectionFade } from "../lib/table-selection-fade";
    import { getTableRoleBlurStyles } from "../lib/table-role-blur";
    import {
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";
    function columnScope(node: HTMLElement) {
        node.setAttribute("scope", "col");
    }
    interface Props extends Omit<FrameProps, "children"> {
        responsiveHide?: boolean;
        columnId?: string;
        label?: string;
        sortDirection?: "ascending" | "descending";
        defaultSort?: "ascending" | "descending";
        defaultSortActive?: boolean;
        roleLayout?: TableRoleLayout;
        onSortChange?: (direction: "ascending" | "descending" | undefined) => void;
        resizable?: boolean;
        minWidth?: number;
        maxWidth?: number;
        align?: "start" | "center" | "end";
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Indicator: typeof Indicator;
            Checkbox: typeof Checkbox;
        }>;
        [key: string]: any;
    }
    let { responsiveHide = true, columnId = undefined, label = undefined, as: role = undefined, sortDirection = undefined, defaultSort = undefined, defaultSortActive = false, roleLayout = undefined, onSortChange = undefined, resizable: explicitResizable = undefined, minWidth = 64, maxWidth = Infinity, align = "start", children, parts = undefined, class: userClass = "", style: userStyle = "", use: userActions = [], enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $props();
    const table = getTableContext();
    const canResize = $derived(explicitResizable ?? table.isDataTable());
    const selectionEnabled = $derived(table.isSelectionEnabled());
    const actionsEnabled = $derived(table.isActionsEnabled());
    /** DataTable 关闭对应角色列时，markup 中的 as=selection/actions 整列不渲染 */
    const isRoleColumnHidden = $derived(
        table.isDataTable()
            && ((role === "selection" && !selectionEnabled)
                || (role === "actions" && !actionsEnabled)),
    );
    const isSelectionRole = $derived(
        table.isDataTable() && role === "selection" && selectionEnabled,
    );
    const isActionsRole = $derived(
        table.isDataTable() && role === "actions" && actionsEnabled,
    );
    const resolvedColumnId = $derived(
        isSelectionRole ? "__selection" : isActionsRole ? "__actions" : columnId,
    );
    const columnRegistration: TableColumnRegistration = {
        get columnId() { return resolvedColumnId; },
        get label() { return label ?? columnId; },
        get sortable() { return isSortable; },
        get role() { return isSelectionRole ? "selection" : isActionsRole ? "actions" : undefined; },
        get align() { return align; },
    };
    // registerColumn 会读写 registeredColumns；必须 untrack，否则 $effect 自触发死循环
    $effect(() => {
        if (isRoleColumnHidden) return;
        return untrack(() => table.registerColumn(columnRegistration));
    });
    const tableVariant = $derived(table.getVariant());
    const resolvedRoleLayout = $derived(roleLayout && roleLayout !== "auto" ? roleLayout : table.getRoleLayout());
    const hasSelectionOverlay = $derived(
        table.isDataTable() && selectionEnabled && resolvedRoleLayout === "overlay",
    );
    const hasActionsOverlay = $derived(
        table.isDataTable() && actionsEnabled && resolvedRoleLayout === "overlay",
    );
    const width = $derived(resolvedColumnId ? table.getColumnWidth(resolvedColumnId) : undefined);
    const resolvedMinWidth = $derived(isActionsRole ? table.getActionsMinWidth() : minWidth);
    const resolvedMaxWidth = $derived(isActionsRole ? table.getActionsMaxWidth() : maxWidth);
    const isResizeEnabled = $derived(
        canResize
        && !!resolvedColumnId
        && !isSelectionRole
        && (!isActionsRole || (
            table.isActionsResizable()
            && resolvedRoleLayout === "column"
        )),
    );
    const sort = $derived(table.getSort());
    const selectionState = $derived(table.getSelectionState());
    const contextDefaultSort = $derived(table.getDefaultSort());
    const contextDefaultSortActive = $derived(table.getDefaultSortActive());
    const isSortable = $derived(
        !isSelectionRole
        && !isActionsRole
        && columnId !== undefined
        && (defaultSort !== undefined
        || sortDirection !== undefined
        || onSortChange !== undefined
        || table.isSortable(columnId)),
    );
    const direction = $derived(sortDirection ?? (columnId && sort?.columnId === columnId ? sort.direction : undefined));
    const isDefaultSortColumn = $derived(contextDefaultSort?.columnId === columnId);
    const isDefaultColumnBaseline = $derived(
        isDefaultSortColumn && direction === contextDefaultSort?.direction,
    );
    const isSortActive = $derived(
        direction !== undefined
        && (!isDefaultColumnBaseline || contextDefaultSortActive),
    );
    const finalUse = $derived([
        ...(Array.isArray(userActions) ? userActions : []),
        columnScope,
    ]);
    const runtimeWidth = $derived(
        (isSelectionRole || isActionsRole) && resolvedRoleLayout === "overlay"
            ? undefined
            : width,
    );
    const finalStyle = $derived(`${runtimeWidth ? `--snowui-table-head-width-runtime:${runtimeWidth}px;width:var(--snowui-table-head-width-override,var(--snowui-table-head-width-runtime));min-width:var(--snowui-table-head-width-override,var(--snowui-table-head-width-runtime));max-width:var(--snowui-table-head-width-override,var(--snowui-table-head-width-runtime))` : ""};${hasActionsOverlay ? `--snowui-table-role-overlay-width-override:${(isActionsRole ? width : undefined) ?? table.getActionsColumnWidth()}px;` : ""}text-align:${align};justify-content:${align};${userStyle}`);
    $effect(() => {
        const declaredDefaultSort = defaultSort;
        const declaredColumnId = columnId;
        const declaredDefaultSortActive = defaultSortActive;
        if (!declaredDefaultSort || !declaredColumnId || isSelectionRole || isActionsRole) return;
        return untrack(() =>
            table.registerDefaultSort(
                declaredColumnId,
                declaredDefaultSort,
                declaredDefaultSortActive,
            ),
        );
    });
    function toggleSort() {
        if (!columnId) return;
        if (onSortChange) {
            onSortChange(direction === undefined ? "ascending" : direction === "ascending" ? "descending" : undefined);
            return;
        }
        table.toggleSort(columnId);
    }
    const selectionBlur = $derived(getTableRoleBlurStyles(table, "left-to-right"));
    const actionsBlur = $derived(getTableRoleBlurStyles(table, "right-to-left"));
    const selectionContentBlur = $derived(getTableRoleBlurStyles(table, "left-to-right"));
    const actionsContentBlur = $derived(getTableRoleBlurStyles(table, "right-to-left"));
    const selectionCheckboxSizeStyle = $derived(
        parts?.Checkbox?.size === undefined
            ? "--snowui-checkbox-size-override: var(--snowui-table-selection-checkbox-size-override, calc(var(--size-4, 1rem) + 0.0625rem))"
            : undefined,
    );
</script>

{#if !isRoleColumnHidden}
<Frame tag="th" aria-sort={!isSelectionRole && !isActionsRole ? direction ?? (isSortable ? "none" : undefined) : undefined} data-responsive-hide={responsiveHide ? undefined : "false"} data-column-id={resolvedColumnId} data-sort={direction} data-selected={selectionState.some || selectionState.all ? "true" : undefined} data-table-variant={tableVariant} data-role-layout={isSelectionRole || isActionsRole ? resolvedRoleLayout : undefined} as={isSelectionRole || isActionsRole ? role : undefined} class={`snowui-table-head ${userClass}`} style={finalStyle} use={finalUse} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {#if isSelectionRole}
        <span
            class="snowui-table-selection-control"
            use:tableSelectionFade={{ enabled: resolvedRoleLayout === "overlay", selected: selectionState.some || selectionState.all }}
            style={selectionCheckboxSizeStyle}
        >
            <span class="snowui-table-role-blur-layer" style={selectionBlur.containerStyle} aria-hidden="true">
                {#each selectionBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
            <Checkbox
                checked={selectionState.all}
                indeterminate={selectionState.some}
                ariaLabel="选择全部当前行"
                onCheckedChange={(checked) => table.setAllRowsSelected(checked)}
            />
        </span>
    {:else if isActionsRole}
        {#if children}<span class="snowui-table-head-content snowui-table-head-content-static">
            <span class="snowui-table-role-blur-layer" style={actionsBlur.containerStyle} aria-hidden="true">
                {#each actionsBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
            {@render children()}
        </span>{/if}
    {:else if isSortable}
        <button class="snowui-table-sort" type="button" data-active={isSortActive ? "true" : undefined} onclick={toggleSort}>
            <span class="snowui-table-head-content">{#if children}{@render children()}{/if}</span>
            {#if isSortActive && direction === "ascending"}
                <ComponentIcon name="arrows-up" class="snowui-table-sort-icon" size="var(--size-4)" aria-hidden="true" />
            {:else if isSortActive && direction === "descending"}
                <ComponentIcon name="arrows-down" class="snowui-table-sort-icon" size="var(--size-4)" aria-hidden="true" />
            {/if}
        </button>
    {:else}
        <span class="snowui-table-head-content snowui-table-head-content-static">{#if children}{@render children()}{/if}</span>
    {/if}
    {#if !isSelectionRole && !isActionsRole}
        {#if hasSelectionOverlay}
            <span class="snowui-table-head-selection-blur-proxy" style={selectionContentBlur.containerStyle} aria-hidden="true">
                {#each selectionContentBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
        {/if}
        {#if hasActionsOverlay}
            <span class="snowui-table-head-actions-blur-proxy" style={actionsContentBlur.containerStyle} aria-hidden="true">
                {#each actionsContentBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
        {/if}
    {/if}
    {#if isResizeEnabled && resolvedColumnId}
        <Indicator
            class="snowui-table-head-indicator"
            axis="width"
            value={width}
            minSize={resolvedMinWidth}
            maxSize={resolvedMaxWidth}
            applySize={false}
            ondblclick={(event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                table.fitColumnWidth(resolvedColumnId, resolvedMinWidth, resolvedMaxWidth);
            }}
            ariaLabel={`调整 ${resolvedColumnId} 列宽`}
            onSizeChange={(next) => table.setColumnWidth(resolvedColumnId, next)}
        />
    {/if}
</Frame>
{/if}

<style>
    :global(:where(.snowui-table-head.snowui-table-cell-visible-first)) { --snowui-table-head-padding-start: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); }
    :global(:where(.snowui-table-head.snowui-table-cell-visible-last)) { --snowui-table-head-padding-end: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); }

    :global(:where(.snowui-table-head)) { position: relative; box-sizing: border-box; height: var(--size-10, 2.5rem); padding: var(--snowui-table-head-padding-override, var(--padding-2) var(--snowui-table-head-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-head-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); border-bottom: var(--border-1, .5px) solid var(--black-20, #0003); color: var(--black-100, #000); font-size: var(--text-12, .75rem); line-height: var(--leading-12, 1rem); font-weight: 400; vertical-align: middle; overflow: visible; }
    :global(:where(.snowui-table-head[data-as="selection"])) { width: var(--size-10); padding: var(--snowui-table-head-selection-padding-override, var(--padding-2) var(--snowui-table-head-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-head-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); }
    :global(:where(.snowui-table-head[data-as="actions"])) { width: var(--size-10); padding: var(--snowui-table-head-actions-padding-override, var(--padding-2) var(--snowui-table-head-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-head-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); text-align: end; }
    :global(:where(.snowui-table-selection-control)) { display: flex; width: 100%; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-head[data-as="selection"]:not([data-role-layout="overlay"]):hover, .snowui-table-head[data-as="selection"]:not([data-role-layout="overlay"]):has(:focus-visible)) .snowui-table-selection-control) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"])),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"])) { position: sticky; width: 0; min-width: 0; max-width: 0; padding: 0; overflow: visible; background: transparent; z-index: 4; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"])) { left: 0; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"])) { right: 0; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-selection-control)),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"] .snowui-table-head-content-static)) { position: absolute; inset-block: 0 calc(-1 * var(--border-1, .5px)); display: flex; width: var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3)); align-items: center; overflow: visible; pointer-events: none; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-selection-control)) { width: var(--size-10, 2.5rem); inset-inline-start: 0; justify-content: flex-start; padding-inline: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); }
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"] .snowui-table-head-content-static)) { inset-inline-end: 0; justify-content: flex-end; padding-inline: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); border-radius: 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-selection-control)),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"] .snowui-table-head-content-static)) { opacity: 1; pointer-events: none; transition: none; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-role-blur-layer)) { opacity: 0; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-header:hover) .snowui-table-head[data-role-layout="overlay"] .snowui-table-role-blur-layer) { opacity: 0; }
    :global(:where(.snowui-table-head-selection-blur-proxy)),
    :global(:where(.snowui-table-head-actions-blur-proxy)) { display: none; opacity: 0; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    /* Only the cells adjacent to role overlays own blur sampling geometry.
       Invisible proxies in other columns must not extend scrollable overflow. */
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"] + .snowui-table-head) .snowui-table-head-selection-blur-proxy),
    :global(:where(.snowui-table-head:has(+ .snowui-table-head[data-role-layout="overlay"][data-as="actions"])) .snowui-table-head-actions-blur-proxy) { display: block; }
    :global(:where(.snowui-table-header:hover) .snowui-table-head[data-role-layout="overlay"][data-as="selection"] + .snowui-table-head .snowui-table-head-selection-blur-proxy),
    :global(:where(.snowui-table-header:hover) .snowui-table-head:has(+ .snowui-table-head[data-role-layout="overlay"][data-as="actions"]) .snowui-table-head-actions-blur-proxy) { opacity: 1; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"] .snowui-table-head-content-static) > :not(.snowui-table-role-blur-layer)) { position: relative; z-index: 1; }
    :global(:where(.snowui-table-head[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="actions"] .snowui-table-head-content-static) > :not(.snowui-table-role-blur-layer)) { opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    /* overlay 全选 Checkbox 只在 hover 第一列可见表头时显示；直接 hover / 聚焦
       Checkbox 浮层时继续保持显示，避免指针从标题移入控件时闪退。 */
    :global(:where(.snowui-table-header .snowui-table-row:has(> .snowui-table-head[data-role-layout="overlay"][data-as="selection"] + .snowui-table-head:hover)) .snowui-table-head[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"]:hover, .snowui-table-head[data-role-layout="overlay"][data-as="selection"]:has(:focus-visible)) .snowui-table-selection-control > :not(.snowui-table-role-blur-layer)) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-sort)) { display: flex; width: 100%; min-width: 0; align-items: center; justify-content: inherit; gap: 0; padding: 0; border: 0; color: inherit; font: inherit; text-align: inherit; background: transparent; opacity: calc(.4 * var(--snowui-table-responsive-column-opacity, 1)); cursor: pointer; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-sort:hover)),
    :global(:where(.snowui-table-sort:focus-visible)),
    :global(:where(.snowui-table-sort[data-active="true"])) { opacity: var(--snowui-table-responsive-column-opacity, 1); }
    :global(:where(.snowui-table-head-content)) { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    :global(:where(.snowui-table-head:not([data-as]) > .snowui-table-head-content-static:has(> *))) { display: inline-block; max-width: 100%; vertical-align: middle; }
    :global(:where(.snowui-table-head-content-static)) { opacity: calc(.4 * var(--snowui-table-responsive-column-opacity, 1)); }
    :global(:where(.snowui-table-sort-icon)) { display: block; flex: 0 0 auto; width: var(--size-4, 1rem); height: var(--size-4, 1rem); color: inherit; }
    /* 列宽手柄复用 Indicator 的整边命中与统一状态视觉。 */
    :global(:where(.snowui-table-head > .snowui-table-head-indicator)) {
        z-index: 1;
    }

    :global(:where(.snowui-table-head[data-table-variant="striped"])) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-header:has(+ .snowui-table-body > .snowui-table-row:first-child:not([aria-hidden="true"]):hover), .snowui-table-header:has(+ .snowui-table-body > .snowui-table-row:first-child:not([aria-hidden="true"])[data-active="true"]), .snowui-table-header:has(+ .snowui-table-body > .snowui-table-row:first-child:not([aria-hidden="true"])[data-force-hover="true"])) .snowui-table-head:not([data-table-variant="striped"])) { border-bottom-color: transparent; }
    /* 表头内容渐隐过渡（mask-image），触发条件见下方规则。 */
    :global(:where(.snowui-table-head-content)) {
        transition:
            -webkit-mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out),
            mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out);
    }
    /* overlay 模式下，第一列标题的渐隐与全选 Checkbox 使用同一触发条件。 */
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"] + .snowui-table-head:hover) .snowui-table-head-content),
    :global(:where(.snowui-table-head[data-role-layout="overlay"][data-as="selection"]:hover, .snowui-table-head[data-role-layout="overlay"][data-as="selection"]:has(:focus-visible)) + .snowui-table-head .snowui-table-head-content) {
        -webkit-mask-image: var(--snowui-table-head-fade-mask);
        mask-image: var(--snowui-table-head-fade-mask);
    }

    /* 与首列标题遮罩同步退出，保留进入渐显与键盘聚焦入口。 */
    :global(:where(.snowui-table-header .snowui-table-row:not(:has(> .snowui-table-head[data-role-layout="overlay"][data-as="selection"] + .snowui-table-head:hover)):not(:has(> .snowui-table-head[data-role-layout="overlay"][data-as="selection"]:hover)):not(:has(> .snowui-table-head[data-role-layout="overlay"][data-as="selection"] :focus-visible))) > .snowui-table-head[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control > *) { transition: none; }
    :global(:where(.snowui-table-header:not(:hover)) .snowui-table-head-selection-blur-proxy) { transition: none; }

    :global(:where(.snowui-table-head[data-role-layout="column"]) .snowui-table-selection-control) { opacity: 1; pointer-events: auto; }
    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-table-head-content-static, .snowui-table-sort)) { opacity: .4; }
        :global(:where(.snowui-table-sort:hover, .snowui-table-sort:focus-visible, .snowui-table-sort[data-active="true"])) { opacity: 1; }
    }
</style>
