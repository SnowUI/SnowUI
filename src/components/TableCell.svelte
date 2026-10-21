<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- 默认单行截断、接受任意内容的表格单元格。文档: ./TableCell.md -->
<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { createEdgeFadeMaskImage } from "../lib/edge-fade";

    const actionsFadeMask = createEdgeFadeMaskImage({
        direction: "to left",
        fadeStart: "calc(var(--snowui-table-cell-actions-fade-width) - var(--snowui-table-cell-actions-edge-offset, 0px))",
        fadeEnd: "calc(var(--snowui-table-cell-actions-fade-width) + var(--snowui-table-cell-actions-legacy-tail, var(--size-5)) - var(--snowui-table-cell-actions-edge-offset, 0px))",
    });
</script>
<script lang="ts">
    import { getContext, setContext, type Snippet } from "svelte";
    import { OVERFLOW_ACTIONS_LAYOUT_CONTEXT_KEY, type OverflowActionsLayoutContext } from "../logic/overflow-actions.svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Tooltip from "./Tooltip.svelte";
    import Checkbox from "./Checkbox.svelte";
    import Skeleton from "./Skeleton.svelte";
    import OverflowActions from "./OverflowActions.svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import { getTableContext, type TableRoleLayout } from "../lib/table-context.svelte";
    import { getTableRowContext } from "../lib/table-row-context.svelte";
    import { SKELETON_CONTEXT_KEY } from "../keys";
    import { tableSelectionFade } from "../lib/table-selection-fade";
    import { getTableRoleBlurStyles } from "../lib/table-role-blur";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import { useLocale } from "../i18n/locale.svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";
    const localeContext = useLocale();
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
    let { columnId, as: role = undefined, lines = 1, tooltip = true, onTruncate = undefined, align = "start", roleLayout = undefined, row = false, gap = 2, nowrap: explicitNowrap = undefined, skeleton = false, children, parts = undefined, whileAppear: userWhileAppear = undefined, currentState: userCurrentState = undefined, class: userClass = "", style: userStyle = "", enableResponsive = false, enableContext = false, enableScaleObserver = false, ...rest }: Props = $derived(mergeComponentPartProps(inheritedTableCellPart.current, explicitProps));
    const nowrap = $derived(explicitNowrap ?? (lines !== 2 && lines !== 3));
    let roleOverlayElement = $state<HTMLElement>();
    let hasNestedTruncationOwner = $state(false);
    const table = getTableContext();
    const rowContext = getTableRowContext();
    const parentSkeletonContext = getContext(SKELETON_CONTEXT_KEY);
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
    const resolvedRoleLayout = $derived(roleLayout && roleLayout !== "auto" ? roleLayout : table.getRoleLayout());
    const hasActionsOverlay = $derived(
        table.isDataTable() && actionsEnabled && resolvedRoleLayout === "overlay",
    );
    const width = $derived(resolvedColumnId ? table.getColumnWidth(resolvedColumnId) : undefined);
    const defaultActions = $derived(
        isActionsRole && rowId !== undefined ? table.getRowActions(rowId) : [],
    );
    const actionsAvailableWidth = $derived(
        table.getActionsContentWidth() ?? Math.max(0, (width ?? table.getActionsColumnWidth()) - 24),
    );
    setContext<OverflowActionsLayoutContext>(OVERFLOW_ACTIONS_LAYOUT_CONTEXT_KEY, {
        get availableWidth() { return isActionsRole ? actionsAvailableWidth : undefined; },
        get maxVisible() { return isActionsRole ? table.getActionsMaxVisible() : undefined; },
        get overflow() { return isActionsRole ? table.getActionsOverflow() : undefined; },
    });
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
    let isTruncated = $state(false);
    let fullText = $state("");
    function registerTruncation(
        node: HTMLElement,
        initial: { enabled: boolean; onChange?: (isTruncated: boolean) => void },
    ) {
        let options = initial;
        const cleanup = table.registerTruncationTarget(node, {
            isEnabled: () => options.enabled,
            notify: (result) => {
                if (result.isTruncated !== isTruncated) {
                    isTruncated = result.isTruncated;
                    options.onChange?.(result.isTruncated);
                }
                if (result.fullText !== fullText) fullText = result.fullText;
                if (result.hasNestedOwner !== hasNestedTruncationOwner) {
                    hasNestedTruncationOwner = result.hasNestedOwner;
                }
            },
        });
        return {
            update(next: typeof initial) {
                const wasEnabled = options.enabled;
                const previousOnChange = options.onChange;
                options = next;
                if (!next.enabled && wasEnabled) {
                    if (isTruncated) previousOnChange?.(false);
                    isTruncated = false;
                    fullText = "";
                    hasNestedTruncationOwner = false;
                }
                table.requestTruncationMeasure();
            },
            destroy: cleanup,
        };
    }
    $effect(() => {
        const node = roleOverlayElement;
        if (!node || (!isSelectionRole && !isActionsRole)) return;
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
        if (resolvedRoleLayout !== "overlay") {
            reset();
            return;
        }
        const updatePosition = () => {
            frame = 0;
            if (!rowElement) {
                reset();
                return;
            }
            const rowRect = rowElement.getBoundingClientRect();
            const viewportRect = rowElement.closest<HTMLElement>(".snowui-table-scroll-viewport")?.getBoundingClientRect();
            // fixed 浮层不会被滚动视口裁切，操作区必须锚定当前可见的行边缘。
            const overlayLeft = isActionsRole && viewportRect ? Math.max(rowRect.left, viewportRect.left) : rowRect.left;
            const overlayRight = isActionsRole && viewportRect ? Math.min(rowRect.right, viewportRect.right) : rowRect.right;
            node.style.position = "fixed";
            node.style.top = `${rowRect.top}px`;
            node.style.left = `${overlayLeft}px`;
            node.style.right = "";
            node.style.width = isSelectionRole ? "var(--size-10, 2.5rem)" : `${Math.max(0, overlayRight - overlayLeft)}px`;
            node.style.height = `${rowRect.height}px`;
            node.style.zIndex = isSelectionRole ? "2147483647" : "20";
            if (isActionsRole) {
                // 所有普通内容共用可见右边缘；先批量读取坐标，再写入各自的渐隐偏移。
                // 这样窄列、横向滚动或按钮跨列时不会在单元格边界重新开始渐隐。
                const controls = node.querySelector<HTMLElement>(".snowui-table-role-overlay-controls");
                if (controls) {
                    const controlsRect = controls.getBoundingClientRect();
                    const extent = Math.max(0, overlayRight - controlsRect.left);
                    const contents = Array.from(rowElement.querySelectorAll<HTMLElement>(
                        ':scope > .snowui-table-cell:not([data-as="selection"]):not([data-as="actions"]) > .snowui-table-cell-content',
                    ));
                    const offsets = contents.map(content => overlayRight - content.getBoundingClientRect().right);
                    rowElement.style.setProperty("--snowui-table-role-overlay-content-width", `${extent}px`);
                    contents.forEach((content, index) => {
                        content.style.setProperty("--snowui-table-cell-actions-edge-offset", `${offsets[index]}px`);
                    });
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
            // Keep the last fixed geometry through the opacity exit. Resetting here
            // on selection changes moves the fading control back to its sticky cell.
        };
    });
    const runtimeWidth = $derived(
        (isSelectionRole || isActionsRole) && resolvedRoleLayout === "overlay"
            ? undefined
            : width,
    );
    const finalStyle = $derived(`${runtimeWidth ? `--snowui-table-cell-width-runtime:${runtimeWidth}px;width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime));min-width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime));max-width:var(--snowui-table-cell-width-override,var(--snowui-table-cell-width-runtime))` : ""};text-align:${align};${userStyle}`);
    // actions 的遮罩依赖每行实测后写入的宽度变量，必须在内容单元格自身计算。
    // 若把这条表达式定义在 Table 根上，根节点无法读取后代行上的变量，整条 mask 会失效。
    const contentStyle = $derived(
        `${gap === undefined
            ? ""
            : `gap:${typeof gap === "number" ? `var(--gap-${gap}, calc(var(--gap-1) * ${gap}))` : gap};`}` +
        `${hasActionsOverlay ? `--snowui-table-cell-actions-fade-mask:${actionsFadeMask};--snowui-table-role-overlay-width-override:${width ?? table.getActionsColumnWidth()}px;` : ""}`,
    );
    const selectionBlur = $derived(getTableRoleBlurStyles(table, "left-to-right"));
    const actionsBlur = $derived(getTableRoleBlurStyles(table, "right-to-left"));
    const selectionCheckboxSizeStyle = $derived(
        parts?.Checkbox?.size === undefined
            ? "--snowui-checkbox-size-override: var(--snowui-table-selection-checkbox-size-override, calc(var(--size-4, 1rem) + 0.0625rem))"
            : undefined,
    );
    const useSemanticFastPath = $derived(
        !skeleton
        && !isSelectionRole
        && !isActionsRole
        && resolvedWhileAppear === undefined
        && userCurrentState === undefined
        && parts === undefined
        && parentSkeletonContext === undefined
        && !enableResponsive
        && !enableContext
        && !enableScaleObserver
        && Object.keys(rest).length === 0,
    );
</script>

{#snippet renderCellContent()}
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
            use:tableSelectionFade={{ enabled: resolvedRoleLayout === "overlay", selected: isSelected }}
            data-selected={isSelected ? "true" : undefined}
            style={selectionCheckboxSizeStyle}
        >
            <span class="snowui-table-role-blur-layer" style={selectionBlur.containerStyle} aria-hidden="true">
                {#each selectionBlur.layers as layer (layer.index)}
                    <span style={layer.style}></span>
                {/each}
            </span>
            <Checkbox
                checked={isSelected}
                ariaLabel={localeContext.t("tableCell.selectRow")}
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
        <span class="snowui-table-role-overlay-controls">{#if children}
            <ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>
        {:else if rowId !== undefined && defaultActions.length > 0}
            <OverflowActions
                {...table.getActionsProps()}
                items={defaultActions}
                maxVisible={table.getActionsMaxVisible()}
                compact={table.getActionsCompact()}
                overflow={table.getActionsOverflow()}
                overflowFrom={table.getActionsOverflowFrom()}
                availableWidth={actionsAvailableWidth}
                onAction={({ id, item }) => table.runRowAction({
                    rowId,
                    actionId: id,
                    item,
                })}
            />
        {/if}</span>
    </span>
    {:else}<span use:registerTruncation={{ enabled: resolvedLines === 1 || nowrap, onChange: onTruncate }} class={`snowui-table-cell-content ${resolvedLines ? `snowui-line-clamp-${resolvedLines}` : ""}`} data-row={row ? "true" : undefined} data-nowrap={nowrap ? "true" : "false"} data-lines={resolvedLines ?? "none"} data-truncated={isTruncated ? "true" : "false"} style={contentStyle}>
        {#if children}<ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>{/if}
        {#if tooltip && !hasNestedTruncationOwner && isTruncated && fullText}
            <Tooltip>
                {#if typeof tooltip === "string"}{tooltip}{:else if typeof tooltip === "function"}<ComponentPartsBoundary>{@render tooltip()}</ComponentPartsBoundary>{:else}{fullText}{/if}
            </Tooltip>
        {/if}
    </span>{/if}
{/snippet}

{#if !isRoleColumnHidden}
{#if useSemanticFastPath}
<td
    data-column-id={resolvedColumnId}
    data-table-variant={tableVariant}
    class={`snowui-frame snowui-table-cell ${userClass}`}
    data-snowui-frame="true"
    data-content-width="hug"
    data-state="Idle"
    style={finalStyle}
>
    {@render renderCellContent()}
</td>
{:else}
<Frame tag="td" data-column-id={resolvedColumnId} data-table-variant={tableVariant} data-role-layout={isSelectionRole || isActionsRole ? resolvedRoleLayout : undefined} data-skeleton={skeleton ? "true" : undefined} as={isSelectionRole || isActionsRole ? role : undefined} class={`snowui-table-cell ${userClass}`} style={finalStyle} whileAppear={resolvedWhileAppear} currentState={resolvedCurrentState} enableAutoLayout={false} enableResponsive={enableResponsive} enableContext={enableContext} enableScaleObserver={enableScaleObserver} componentParts={parts} {...rest}>
    {@render renderCellContent()}
</Frame>
{/if}
{/if}

<style>
    :global(:where(.snowui-table-cell.snowui-table-cell-visible-first)) { --snowui-table-cell-padding-start: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); }
    :global(:where(.snowui-table-cell.snowui-table-cell-visible-last)) { --snowui-table-cell-padding-end: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); }

    :global(:where(.snowui-table-cell)) { position: relative; box-sizing: border-box; height: var(--size-10, 2.5rem); padding: var(--snowui-table-cell-padding-override, var(--padding-2) var(--snowui-table-cell-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-cell-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); border-bottom: var(--border-1, .5px) solid var(--black-10, #0000001a); background: var(--snowui-table-row-active-background, transparent); font-size: var(--text-12, .75rem); line-height: var(--leading-12, 1rem); vertical-align: middle; }
    :global(:where(.snowui-table-cell[data-as="selection"])) { width: var(--size-10); padding: var(--snowui-table-cell-selection-padding-override, var(--padding-2) var(--snowui-table-cell-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-cell-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); }
    :global(:where(.snowui-table-cell[data-as="actions"])) { width: var(--size-10); padding: var(--snowui-table-cell-actions-padding-override, var(--padding-2) var(--snowui-table-cell-padding-end, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))) var(--padding-2) var(--snowui-table-cell-padding-start, var(--snowui-table-responsive-cell-padding-inline, var(--padding-3)))); }
    :global(:where(.snowui-table-cell[data-skeleton="true"])) { pointer-events: none; }
    :global(:where(.snowui-table-cell-skeleton)) { display: flex; width: 100%; align-items: center; }
    :global(:where(.snowui-table-cell[data-as="selection"] .snowui-table-selection-control)),
    :global(:where(.snowui-table-cell-content[data-actions="true"])) { opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-as="selection"] .snowui-table-selection-control),
    :global(:where(.snowui-table-cell[data-as="selection"] .snowui-table-selection-control[data-selected="true"])) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row:has(.snowui-select-button-trigger[aria-expanded="true"])) .snowui-table-cell:not([data-role-layout="overlay"]) .snowui-table-cell-content[data-actions="true"]) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"])),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { position: sticky; width: 0; min-width: 0; max-width: 0; padding: 0; overflow: visible; background: transparent; z-index: 3; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"])) { left: 0; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="actions"])) { right: 0; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control)) { position: absolute; inset-block: 0 calc(-1 * var(--border-1, .5px)); inset-inline-start: 0; box-sizing: border-box; display: flex; width: var(--size-10, 2.5rem); align-items: center; justify-content: center; overflow: visible; padding-block: var(--padding-2); padding-inline: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); background: transparent; z-index: 2147483647; pointer-events: auto; }
    /* 内容 mask 退出是离散切换；同步撤去整个操作浮层，避免淡出按钮叠在已恢复的文字上。 */
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"])) { opacity: 1; visibility: hidden; pointer-events: none; transition: none; }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row:has(.snowui-select-button-trigger[aria-expanded="true"])) .snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"]) { visibility: visible; }
    :global(:where(.snowui-table-body .snowui-table-row:last-child) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-cell-content)) { position: relative; display: block; min-width: 0; max-width: 100%; overflow: hidden; --snowui-table-cell-actions-legacy-tail: calc(var(--snowui-table-cell-actions-fade-width) * (var(--snowui-table-actions-fade-feather-override) - 1)); --snowui-table-cell-actions-fade-width: calc(var(--snowui-table-role-overlay-content-width, var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3))) * var(--snowui-table-actions-fade-coverage-override, 1)); }
    /* 关闭截断的普通内容保留子组件外扩；角色浮层和 Skeleton 仍使用各自裁切。 */
    :global(:where(.snowui-table-cell-content[data-lines="none"])) { overflow: visible; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-1)) { white-space: nowrap; text-overflow: ellipsis; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-2)),
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-3)) { display: -webkit-box; -webkit-box-orient: vertical; white-space: normal; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-2)) { -webkit-line-clamp: 2; line-clamp: 2; }
    :global(:where(.snowui-table-cell-content.snowui-line-clamp-3)) { -webkit-line-clamp: 3; line-clamp: 3; }
    :global(:where(.snowui-table-cell-content[data-row="true"])) { display: inline-flex; vertical-align: middle; align-items: center; flex-wrap: wrap; }
    :global(:where(.snowui-table-cell-content[data-nowrap="true"])) { white-space: nowrap; }
    :global(:where(.snowui-table-cell-content[data-row="true"][data-nowrap="true"])) { flex-wrap: nowrap; }
    :global(:where(.snowui-table-cell-content[data-actions="true"])) { display: flex; overflow: visible; width: 100%; align-items: center; justify-content: flex-end; gap: var(--snowui-table-cell-actions-gap-override, var(--gap-2)); }
    :global(:where(.snowui-table-cell-content[data-actions="true"] .snowui-table-role-overlay-controls)) { display: flex; align-items: center; justify-content: flex-end; gap: var(--snowui-table-cell-actions-gap-override, var(--gap-2)); }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"])) { position: absolute; inset-block: 0 calc(-1 * var(--border-1, .5px)); inset-inline-end: 0; display: flex; width: var(--snowui-table-role-overlay-width-override, calc((var(--size-12, 3rem) + var(--size-14, 3.5rem)) / 3)); max-width: none; align-items: center; justify-content: flex-end; overflow: hidden; padding-inline: max(var(--padding-2), var(--snowui-table-responsive-cell-padding-inline, var(--padding-3))); border-radius: var(--snowui-table-row-radius-override, var(--radius-3, 0.75rem)); }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-role-blur-layer)) { opacity: 0; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-role-layout="overlay"] .snowui-table-role-blur-layer) { opacity: 1; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"]) > :not(.snowui-table-role-blur-layer)) { position: relative; z-index: 2; }
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-selection-control) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"]) > :not(.snowui-table-role-blur-layer)) { opacity: 0; pointer-events: none; transition: opacity var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out); }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row[data-selected="true"]) .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control[data-selected="true"]) > :not(.snowui-table-role-blur-layer)),
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row:has(.snowui-select-button-trigger[aria-expanded="true"])) .snowui-table-cell[data-role-layout="overlay"] .snowui-table-cell-content[data-actions="true"] > :not(.snowui-table-role-blur-layer)) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-cell[data-table-variant="striped"])) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:nth-child(odd of :not(:has(> .snowui-table-loading-cell)))) > .snowui-table-cell[data-table-variant="striped"]) { background: var(--snowui-table-row-active-background, var(--surface-3, #f7f7f7)); }
    :global(:where(.snowui-table-body .snowui-table-row:nth-child(even of :not(:has(> .snowui-table-loading-cell)))) > .snowui-table-cell[data-table-variant="striped"]) { background: var(--snowui-table-row-active-background, transparent); }
    :global(:where(.snowui-table-body[data-continuous-hover-enabled="true"] .snowui-table-row:hover) > .snowui-table-cell[data-table-variant="striped"]) { background: var(--snowui-table-row-active-background, transparent); }
    :global(:where(.snowui-table-body .snowui-table-row[data-force-hover="true"]) > .snowui-table-cell:not([data-role-layout="overlay"])) { background: var(--snowui-table-row-hover-background-override, var(--black-4, #0000000a)); }
    :global(:where(.snowui-table-body .snowui-table-row:not([data-skeleton="true"]):hover, .snowui-table-body .snowui-table-row:not([data-skeleton="true"])[data-force-hover="true"]) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"]):hover), .snowui-table-body .snowui-table-row:has(+ .snowui-table-row:not([data-skeleton="true"])[data-force-hover="true"])) > .snowui-table-cell) { border-bottom-color: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row) > .snowui-table-cell[data-role-layout="overlay"]) { background: transparent; }
    :global(:where(.snowui-table-body .snowui-table-row:hover) > .snowui-table-cell[data-role-layout="overlay"]) { background: transparent; }
    /* overlay 模式 hover 边缘渐进式透明（复用 edge-fade 通用能力 ../lib/edge-fade.ts；详见 Table.md）。
       selection mask 按 Checkbox 实际右边缘在内容节点生成；actions mask 依赖行级实测宽度，由内容 TableCell 在自身作用域生成，并按内容右边缘到可见行右边缘的实测距离平移。
       此处状态规则只消费对应 CSS 变量，未触发时无 mask。selection 的内容遮罩与 Checkbox 可见条件一致（hover、键盘 focus、选中或 force-hover）；actions 保持行 hover 时触发。相邻内容从靠控件一侧渐隐到清晰：
       - checkbox 侧（to right）：透明区覆盖到 Checkbox 实际右边缘，再向右使用固定 --size-5（名义 20px）过渡；
       - actions 侧（to left）：透明区默认覆盖到最左按钮实际左边缘，向左以 --size-5（名义 20px）固定长度过渡到清晰，不随按钮组宽度或响应式间距变化。
       coverage 默认 1；显式旧 feather override 仍按倍数计算尾巴，未设置时旧表达式无效，自动回退固定 Token 长度。
       这些变量与表头渐隐（--snowui-table-head-fade-*-override）相互独立，可在 Table / 容器上单独设置覆盖。
       mask 只改变视觉，不影响指针事件，单元格内链接/按钮点击不受影响。
       data-force-hover="true" 可让某一行静态呈现 hover 态（用于演示 / 视觉走查）。 */
    :global(:where(.snowui-table-cell-content)) {
        transition:
            -webkit-mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out),
            mask-image var(--snowui-frame-color-motion-duration, .15s) var(--snowui-frame-color-motion-easing, ease-out);
    }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row[data-selected="true"]) > .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] + .snowui-table-cell > .snowui-table-cell-content) {
        --snowui-table-cell-active-selection-mask: var(--snowui-table-selection-fade-mask);
        -webkit-mask-image: var(--snowui-table-cell-active-selection-mask), var(--snowui-table-cell-active-actions-mask, linear-gradient(#000, #000));
        mask-image: var(--snowui-table-cell-active-selection-mask), var(--snowui-table-cell-active-actions-mask, linear-gradient(#000, #000));
        mask-composite: intersect;
    }
    :global(:where(.snowui-table-row:hover, .snowui-table-row[data-force-hover="true"], .snowui-table-row:has(:focus-visible), .snowui-table-row:has([data-as="actions"] :focus), .snowui-table-row:has(.snowui-select-button-trigger[aria-expanded="true"])) > .snowui-table-cell:not([data-as="selection"]):has(~ .snowui-table-cell[data-role-layout="overlay"][data-as="actions"]) > .snowui-table-cell-content) {
        --snowui-table-cell-active-actions-mask: var(--snowui-table-cell-actions-fade-mask);
        -webkit-mask-image: var(--snowui-table-cell-active-selection-mask, linear-gradient(#000, #000)), var(--snowui-table-cell-active-actions-mask);
        mask-image: var(--snowui-table-cell-active-selection-mask, linear-gradient(#000, #000)), var(--snowui-table-cell-active-actions-mask);
        mask-composite: intersect;
    }

    /* 遮罩退出时 Checkbox 同帧消失；不隐藏 DOM，保留键盘聚焦入口。 */
    :global(:where(.snowui-table-row:not(:hover):not([data-force-hover="true"]):not(:has(:focus-visible)):not([data-selected="true"])) > .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control:not([data-selected="true"])),
    :global(:where(.snowui-table-row:not(:hover):not([data-force-hover="true"]):not(:has(:focus-visible)):not([data-selected="true"])) > .snowui-table-cell[data-role-layout="overlay"][data-as="selection"] .snowui-table-selection-control:not([data-selected="true"]) > *) { transition: none; }

    :global(:where(.snowui-table-cell)) { border-radius: var(--snowui-table-cell-leading-radius, 0) var(--snowui-table-cell-trailing-radius, 0) var(--snowui-table-cell-trailing-radius, 0) var(--snowui-table-cell-leading-radius, 0); }
    :global(:where(.snowui-table-cell-visible-first)) { --snowui-table-cell-leading-radius: var(--snowui-table-cell-corner-radius, var(--snowui-table-row-corner-radius, 0)); }
    :global(:where(.snowui-table-cell-visible-last)) { --snowui-table-cell-trailing-radius: var(--snowui-table-cell-corner-radius, var(--snowui-table-row-corner-radius, 0)); }
    :global(:where(.snowui-table-cell[data-table-variant="striped"])) { --snowui-table-cell-corner-radius: var(--snowui-table-row-radius-override, var(--radius-3)); }
    :global(:where(.snowui-table-cell[data-role-layout="column"]) .snowui-table-selection-control),
    :global(:where(.snowui-table-cell[data-role-layout="column"]) .snowui-table-cell-content[data-actions="true"]) { opacity: 1; pointer-events: auto; }
    :global(:where(.snowui-table-responsive-text-fit .snowui-table-cell-content[data-nowrap="true"]:not([data-actions="true"]))) { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    :global(:where(.snowui-table-responsive-text-fit .snowui-table-cell-content[data-nowrap="false"])) { overflow-wrap: anywhere; }
    :global(:where(.snowui-table-cell:not([data-as]) > .snowui-table-cell-content)) { opacity: var(--snowui-table-responsive-column-opacity, 1); }
    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-table-cell:not([data-as]) > .snowui-table-cell-content)) { opacity: 1; }
    }
</style>
