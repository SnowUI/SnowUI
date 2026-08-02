<!-- 默认单行截断、接受任意内容的表格单元格。文档: ./TableCell.md -->
<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Tooltip from "./Tooltip.svelte";
    import Checkbox from "./Checkbox.svelte";
    import Skeleton from "./Skeleton.svelte";
    import { TruncationController } from "../logic/frame-truncation.svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import { getTableContext, type TableRoleLayout } from "../lib/table-context.svelte";
    import { getTableRowContext } from "../lib/table-row-context.svelte";
    import { createEdgeFadeMaskImage } from "../lib/edge-fade";
    import { createProgressiveBlurStyles, createUniformBlurStyles, type ProgressiveBlurDirection } from "../lib/progressive-blur";
    import {
        mergeComponentPartProps,
        useComponentPart,
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";
    type TooltipProp = boolean | string | Snippet;
    interface Props extends Omit<FrameProps, "children"> {
        columnId?: string;
        lines?: false | 1 | 2 | 3;
        tooltip?: TooltipProp;
        onTruncate?: (isTruncated: boolean) => void;
        align?: "start" | "center" | "end";
        roleLayout?: TableRoleLayout;
        nowrap?: boolean;
        skeleton?: boolean;
        children?: Snippet;
        parts?: ComponentPartsOf<{
            Tooltip: typeof Tooltip;
            Checkbox: typeof Checkbox;
        }>;
        [key: string]: any;
    }
    const inheritedTableCellPart = useComponentPart<Props>("TableCell");
    let explicitProps: Props = $props();
    let { columnId, as: role = undefined, lines = 1, tooltip = true, onTruncate = undefined, align = "start", roleLayout = undefined, row = false, gap = 2, nowrap = false, skeleton = false, children, parts = undefined, whileAppear: userWhileAppear = undefined, currentState: userCurrentState = undefined, class: userClass = "", style: userStyle = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $derived(mergeComponentPartProps(inheritedTableCellPart.current, explicitProps));
    let contentElement = $state<HTMLElement>();
    let roleOverlayElement = $state<HTMLElement>();
    let hasNestedTruncationOwner = $state(false);
    const table = getTableContext();
    const rowContext = getTableRowContext();
    const rowId = $derived(rowContext?.getRowId());
    const selectionEnabled = $derived(table.isSelectionEnabled());
    const actionsEnabled = $derived(table.isActionsEnabled());
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
    const isSelected = $derived(rowId !== undefined && table.isRowSelected(rowId));
    const tableVariant = $derived(table.getVariant());
    const resolvedRoleLayout = $derived(roleLayout ?? table.getRoleLayout());
    const width = $derived(resolvedColumnId ? table.getColumnWidth(resolvedColumnId) : undefined);
    const resolvedLines = $derived(skeleton || isSelectionRole || isActionsRole || lines === false ? undefined : lines);
    const contextRowAppearMotion = $derived(
        !skeleton && !isSelectionRole && !isActionsRole && rowId !== undefined
            ? table.getRowAppearMotion(rowId)
            : undefined,
    );
    const resolvedWhileAppear = $derived(userWhileAppear ?? contextRowAppearMotion);
    const resolvedCurrentState = $derived(
        userCurrentState ?? (resolvedWhileAppear === undefined ? undefined : "Appear"),
    );
    // Table rows are replaced as keyed units during pagination, so cell text is
    // static for the lifetime of a mounted cell. Avoid one MutationObserver per
    // cell; resize-based truncation detection remains shared through resizeManager.
    const truncation = new TruncationController(
        undefined,
        () => contentElement,
        undefined,
        { observeTextMutations: false },
    );
    $effect(() => truncation.update(resolvedLines, onTruncate));
    $effect(() => {
        if (!contentElement) return;
        const sync = () => {
            hasNestedTruncationOwner = Boolean(
                contentElement?.querySelector(':scope > [data-as="truncation-owner"]'),
            );
        };
        sync();
    });
    $effect(() => {
        const node = roleOverlayElement;
        if (!node || resolvedRoleLayout !== "overlay" || (!isSelectionRole && !isActionsRole)) return;
        const selected = isSelected;
        let frame = 0;
        const rowElement = node.closest<HTMLElement>(".snowui-table-row");
        const layoutElement = rowElement?.closest<HTMLElement>(".snowui-data-table")
            ?? rowElement?.closest<HTMLElement>(".snowui-table");
        let unwatchRow: (() => void) | undefined;
        let unwatchLayout: (() => void) | undefined;
        let active = false;
        const reset = () => {
            Object.assign(node.style, {
                position: "",
                top: "",
                left: "",
                right: "",
                width: "",
                height: "",
                zIndex: "",
            });
            if (isActionsRole) rowElement?.style.removeProperty("--snowui-table-role-overlay-content-width");
        };
        const updatePosition = () => {
            frame = 0;
            if (!rowElement) {
                reset();
                return;
            }
            const rowRect = rowElement.getBoundingClientRect();
            node.style.position = "fixed";
            node.style.top = `${rowRect.top}px`;
            node.style.left = `${rowRect.left}px`;
            node.style.right = "";
            node.style.width = isSelectionRole ? "var(--size-10, 2.5rem)" : `${rowRect.width}px`;
            node.style.height = `${rowRect.height}px`;
            node.style.zIndex = isSelectionRole ? "2147483647" : "20";
            if (isActionsRole) {
                // 测量实际按钮组的占用宽度（从行右边缘到最左按钮左边缘 = 按钮 + 左右内边距），
                // 写到行级 CSS 变量，供相邻内容单元格的边缘渐隐按真实按钮宽度收缩（无需逐表设置列宽）。
                const controls = node.querySelector<HTMLElement>(".snowui-table-role-overlay-controls");
                if (controls) {
                    const controlsRect = controls.getBoundingClientRect();
                    const extent = Math.max(0, rowRect.right - controlsRect.left);
                    rowElement.style.setProperty("--snowui-table-role-overlay-content-width", `${extent}px`);
                }
            }
        };
        const schedule = () => {
            if (frame) return;
            frame = requestAnimationFrame(updatePosition);
        };
        const activate = () => {
            if (active || !rowElement) return;
            active = true;
            unwatchRow = resizeManager.watch(rowElement, schedule);
            if (layoutElement && layoutElement !== rowElement) {
                unwatchLayout = resizeManager.watch(layoutElement, schedule);
            }
            window.addEventListener("scroll", schedule, true);
            window.addEventListener("resize", schedule);
            updatePosition();
        };
        const shouldStayActive = () =>
            Boolean(
                selected ||
                rowElement?.matches(
                    ':hover, [data-force-hover="true"]',
                ) || rowElement?.contains(document.activeElement),
            );
        const deactivate = () => {
            if (!active || shouldStayActive()) return;
            active = false;
            if (frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
            unwatchRow?.();
            unwatchRow = undefined;
            unwatchLayout?.();
            unwatchLayout = undefined;
            window.removeEventListener("scroll", schedule, true);
            window.removeEventListener("resize", schedule);
        };
        const scheduleDeactivate = () => requestAnimationFrame(deactivate);
        rowElement?.addEventListener("pointerenter", activate);
        rowElement?.addEventListener("pointerleave", scheduleDeactivate);
        rowElement?.addEventListener("focusin", activate);
        rowElement?.addEventListener("focusout", scheduleDeactivate);
        // 空闲行不做同步布局测量；hover / focus / selected / force-hover 时再激活。
        // selected 直接消费 Svelte 派生状态，不再为每个角色单元格创建 MutationObserver。
        // 激活后额外监听 DataTable/Table 容器尺寸，覆盖内置工具栏出现/消失导致的整表位移。
        if (shouldStayActive()) activate();
        return () => {
            if (frame) cancelAnimationFrame(frame);
            unwatchRow?.();
            unwatchLayout?.();
            window.removeEventListener("scroll", schedule, true);
            window.removeEventListener("resize", schedule);
            rowElement?.removeEventListener("pointerenter", activate);
            rowElement?.removeEventListener("pointerleave", scheduleDeactivate);
            rowElement?.removeEventListener("focusin", activate);
            rowElement?.removeEventListener("focusout", scheduleDeactivate);
            reset();
        };
    });
    const finalStyle = $derived(`${width ? `--snowui-table-cell-width-runtime:${width}px;width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime));min-width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime));max-width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime))` : ""};text-align:${align};${userStyle}`);
    // actions 的遮罩依赖每行实测后写入的宽度变量，必须在内容单元格自身计算。
    // 若把这条表达式定义在 Table 根上，根节点无法读取后代行上的变量，整条 mask 会失效。
    const actionsFadeMask = createEdgeFadeMaskImage({
        direction: "to left",
        fadeStart: "var(--snowui-table-cell-actions-fade-width)",
        fadeEnd: "calc(var(--snowui-table-cell-actions-fade-width) * var(--snowui-table-actions-fade-feather-override, 3))",
    });
    const contentStyle = $derived(
        `${gap === undefined
            ? ""
            : `gap:${typeof gap === "number" ? `var(--gap-${gap}, calc(var(--gap-1) * ${gap}))` : gap};`}` +
        `--snowui-table-cell-actions-fade-mask:${actionsFadeMask};`,
    );
    function buildRoleOverlayBlur(direction: ProgressiveBlurDirection) {
        const options = {
            direction,
            layerCount: table.getRoleOverlayLayers(),
            width: "var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3))",
            sampleExtension: "var(--snowui-table-role-overlay-sample-extension-override, 4rem)",
            maxBlur: "var(--snowui-table-role-overlay-blur-override, 0rem)",
            minBlur: "0rem",
            leadWidthRatio: 0.1,
            endRatio: 0.72,
            featherRatio: 2.8,
            tailOpacity: 0,
            edgeFeatherRatio: table.getRoleOverlayUniformFeather(),
            tintColor: "#ffffff",
            tintOpacity: "var(--snowui-table-role-overlay-tint-opacity-override, 0%)",
        };
        return table.getRoleOverlayBlurMode() === "uniform"
            ? createUniformBlurStyles(options)
            : createProgressiveBlurStyles(options);
    }
    const selectionBlur = $derived(buildRoleOverlayBlur("left-to-right"));
    const actionsBlur = $derived(buildRoleOverlayBlur("right-to-left"));
</script>

{#if !isRoleColumnHidden}
<Frame tag="td" data-column-id={resolvedColumnId} data-table-variant={tableVariant} data-role-layout={isSelectionRole || isActionsRole ? resolvedRoleLayout : undefined} data-skeleton={skeleton ? "true" : undefined} as={isSelectionRole || isActionsRole ? role : undefined} class={`snowui-table-cell ${userClass}`} style={finalStyle} whileAppear={resolvedWhileAppear} currentState={resolvedCurrentState} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {#if skeleton}
        <span class="snowui-table-cell-content snowui-table-cell-skeleton" aria-hidden="true">
            {#if !isSelectionRole && !isActionsRole}
                <Skeleton variant="line" width="var(--snowui-table-cell-skeleton-width, var(--snowui-table-body-skeleton-width, 62%))" height="var(--size-3, .75rem)" />
            {/if}
        </span>
    {:else if isSelectionRole}
        <span
            bind:this={roleOverlayElement}
            class="snowui-table-selection-control"
            data-selected={isSelected ? "true" : undefined}
        >
            <span class="snowui-table-role-blur-layer" style={selectionBlur.containerStyle} aria-hidden="true">
                {#each selectionBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
            <Checkbox
                size={16}
                checked={isSelected}
                ariaLabel="选择当前行"
                onclick={(event: MouseEvent) => event.stopPropagation()}
                onCheckedChange={(checked) => {
                    if (rowId !== undefined) table.setRowSelected(rowId, checked);
                }}
            />
        </span>
    {:else if isActionsRole}<span bind:this={roleOverlayElement} class="snowui-table-cell-content" data-row="true" data-actions="true" data-nowrap="true" style={contentStyle}>
            <span class="snowui-table-role-blur-layer" style={actionsBlur.containerStyle} aria-hidden="true">
                {#each actionsBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
        <span class="snowui-table-role-overlay-controls">{#if children}{@render children()}{/if}</span>
    </span>
    {:else}<span bind:this={contentElement} class={`snowui-table-cell-content ${resolvedLines ? `snowui-line-clamp-${resolvedLines}` : ""}`} data-row={row ? "true" : undefined} data-nowrap={nowrap ? "true" : undefined} data-lines={resolvedLines} data-truncated={truncation.isTruncated ? "true" : "false"} style={contentStyle}>
        {#if children}{@render children()}{/if}
        {#if tooltip && !hasNestedTruncationOwner && truncation.isTruncated && truncation.fullText}
            <Tooltip>
                {#if typeof tooltip === "string"}{tooltip}{:else if typeof tooltip === "function"}{@render tooltip()}{:else}{truncation.fullText}{/if}
            </Tooltip>
        {/if}
    </span>{/if}
</Frame>
{/if}

<style>
    :global(:where(.snowui-table-cell)) { position: relative; box-sizing: border-box; height: var(--size-10, 2.5rem); padding: var(--snowui-table-cell-padding-override, var(--padding-2, .5rem) var(--padding-3, .75rem)); border-bottom: var(--border-1, .5px) solid var(--black-10, #0000001a); font-size: var(--text-12, .75rem); line-height: var(--leading-12, 1rem); vertical-align: middle; }
    :global(:where(.snowui-table-cell[data-as="selection"])) { width: var(--size-10); padding: var(--snowui-table-cell-selection-padding-override, var(--padding-2) var(--padding-3)); }
    :global(:where(.snowui-table-cell[data-as="actions"])) { width: var(--size-10); padding: var(--snowui-table-cell-actions-padding-override, var(--padding-2) var(--padding-3)); }
    :global(:where(.snowui-table-cell[data-skeleton="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-cell-skeleton)) { display: flex; width: 100%; align-items: center; }
    :global(:where(.snowui-table-cell[data-as="selection"] .snowui-table-selection-control)),
    :global(:where(.snowui-table-cell-content[data-actions="true"])) { opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-as="selection"] .snowui-table-selection-control),
    :global(:where(.snowui-table-cell[data-as="selection"] .snowui-table-selection-control[data-selected="true"])) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"]) .snowui-table-cell:not([data-role-layout="overlay"]) .snowui-table-cell-content[data-actions="true"]) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"])),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { position: sticky; width: 0; min-width: 0; max-width: 0; padding: 0; overflow: visible; background: transparent; z-index: 3; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"])) { left: 0; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { right: 0; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control)) { position: absolute; inset-block: 0 calc(-1 * var(--border-1, .5px)); inset-inline-start: 0; box-sizing: border-box; display: flex; width: var(--size-10, 2.5rem); align-items: center; justify-content: center; overflow: visible; padding: var(--padding-2, 0.5rem) var(--padding-3, 0.75rem); border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); background: transparent; z-index: 2147483647; pointer-events: auto; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"])) { opacity: 1; pointer-events: none; transition: none; }
    :global(:where(.snowui-table-body .snowui-table-row:hover, .snowui-table-body .snowui-table-row[data-force-hover="true"]) > .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] + .snowui-table-cell) { border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); }
    :global(:where(.snowui-table-body .snowui-table-row:hover, .snowui-table-body .snowui-table-row[data-force-hover="true"]) > .snowui-table-cell:has(+ .snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { border-radius: 0 var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)) 0; }
    :global(:where(.snowui-table-body .snowui-table-row:last-child) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-cell-content)) { position: relative; display: block; min-width: 0; max-width: 100%; overflow: hidden; --snowui-table-cell-actions-fade-width: calc(var(--snowui-table-role-overlay-content-width, var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3))) * var(--snowui-table-actions-fade-coverage-override, 0.9)); }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-1)) { white-space: nowrap; text-overflow: ellipsis; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-2)),
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-3)) { display: -webkit-box; -webkit-box-orient: vertical; white-space: normal; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-2)) { -webkit-line-clamp: 2; line-clamp: 2; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-3)) { -webkit-line-clamp: 3; line-clamp: 3; }
    :global(:where(.snowui-table-cell-content[data-row="true"])) { display: inline-flex; align-items: center; flex-wrap: wrap; }
    :global(:where(.snowui-table-cell-content[data-nowrap="true"])) { white-space: nowrap; }
    :global(:where(.snowui-table-cell-content[data-row="true"][data-nowrap="true"])) { flex-wrap: nowrap; }
    :global(:where(.snowui-table-cell-content[data-actions="true"])) { display: flex; width: 100%; align-items: center; justify-content: flex-end; gap: var(--snowui-table-cell-actions-gap-override, var(--gap-2)); }
    :global(:where(.snowui-table-cell-content[data-actions="true"] .snowui-table-role-overlay-controls)) { display: flex; align-items: center; justify-content: flex-end; gap: var(--snowui-table-cell-actions-gap-override, var(--gap-2)); }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"])) { position: absolute; inset-block: 0 calc(-1 * var(--border-1, .5px)); inset-inline-end: 0; display: flex; width: var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3)); max-width: none; align-items: center; justify-content: flex-end; overflow: hidden; padding-inline: var(--padding-3); border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-role-blur-layer)) { opacity: 0; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-role-layout="overlay"] .snowui-table-role-blur-layer) { opacity: 1; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"]) > :not(.snowui-table-role-blur-layer)) { position: relative; z-index: 2; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"]) > :not(.snowui-table-role-blur-layer)) { opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control[data-selected="true"]) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"]) .snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"] > :not(.snowui-table-role-blur-layer)) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-cell[data-table-variant="striped"])) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:nth-child(odd)) > .snowui-table-cell[data-table-variant="striped"]) { background: var(--surface-3, #f7f7f7); }
    :global(:where(.snowui-table-body .snowui-table-row:nth-child(even)) > .snowui-table-cell[data-table-variant="striped"]) { background: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-table-variant="striped"]:first-child) { border-radius: var(--radius-3) 0 0 var(--radius-3); }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-table-variant="striped"]:last-child) { border-radius: 0 var(--radius-3) var(--radius-3) 0; }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] + .snowui-table-cell[data-table-variant="striped"]) { border-radius: var(--radius-3) 0 0 var(--radius-3); }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-table-variant="striped"]:has(+ .snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { border-radius: 0 var(--radius-3) var(--radius-3) 0; }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"]):hover, .snowui-table-body .snowui-table-row:not([data-skeleton="true"])[data-force-hover="true"]) > .snowui-table-cell) { background: var(--snowui-table-row-hover-background-override, var(--black-4, #0000000a)); border-bottom-color: transparent; }
    :global(:where(.snowui-table-body[data-continuous-hover-enabled="true"] .snowui-table-row:not([data-force-hover="true"]):hover) > .snowui-table-cell) { background: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"]):hover), .snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"])[data-force-hover="true"])) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-role-layout="overlay"]) { background: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:hover) > .snowui-table-cell[data-role-layout="overlay"]) { background: transparent; }
    /* overlay 模式 hover 边缘渐进式透明（复用 OSS edge-fade 通用能力 ../lib/edge-fade.ts；详见 Table.md）。
       selection mask 由 Table 根生成；actions mask 依赖行级实测宽度，由内容 TableCell 在自身作用域生成。
       此处状态规则只消费对应 CSS 变量，未触发时无 mask。紧邻 selection / actions 覆盖块的单元格内容在行 hover 时从靠控件一侧渐隐到清晰：
       - checkbox 侧（to right）：Fade start / end 使用固定宽度（默认约 16px → 60px），不随内容单元格宽度变化；
       - actions 侧（to left）：完全透明（遮住按钮）区域宽度 = 实测按钮组宽度（含右侧内边距，由 JS 写入行级变量 `--snowui-table-role-overlay-content-width`）× `--snowui-table-actions-fade-coverage-override`（默认 0.9）；柔和尾巴终点 = 该宽度 × `--snowui-table-actions-fade-feather-override`（默认 3，尾巴长度 = 透明区的两倍）。coverage 越小整条遮罩越窄、feather 越大过渡越缓；coverage 低于按钮实际占比时宽按钮如 Edit 会透出内容。中间量 `--snowui-table-cell-actions-fade-width`（= 实测宽度 × coverage）让宽度只写一处。
       这些变量与表头渐隐（--snowui-table-head-fade-*-override）相互独立，可在 Table / 容器上单独设置覆盖。
       mask 只改变视觉，不影响指针事件，单元格内链接/按钮点击不受影响。
       data-force-hover="true" 可让某一行静态呈现 hover 态（用于演示 / 视觉走查）。 */
    :global(:where(.snowui-table-cell-content)) {
        transition:
            -webkit-mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out),
            mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"]) .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] + .snowui-table-cell .snowui-table-cell-content) {
        -webkit-mask-image: var(--snowui-table-selection-fade-mask);
        mask-image: var(--snowui-table-selection-fade-mask);
    }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"]) .snowui-table-cell:has(+ .snowui-table-cell[data-role-layout="overlay"][data-as="actions"]) .snowui-table-cell-content) {
        -webkit-mask-image: var(--snowui-table-cell-actions-fade-mask);
        mask-image: var(--snowui-table-cell-actions-fade-mask);
    }
</style>
