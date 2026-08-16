<!-- 响应式操作集合。文档：./OverflowActions.md -->
<script lang="ts">
    import {
        onDestroy,
        onMount,
        setContext,
        tick,
        type ComponentProps,
        type Snippet,
    } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import SelectButton from "./SelectButton.svelte";
    import Listbox from "./Listbox.svelte";
    import MenuItem from "./MenuItem.svelte";
    import Separator from "./Separator.svelte";
    import OverflowAction from "./OverflowAction.svelte";
    import { resizeManager } from "../logic/observer.svelte";
    import {
        OVERFLOW_ACTIONS_CONTEXT_KEY,
        type OverflowActionIcon,
        type OverflowActionMode,
        type OverflowActionRegistration,
        type OverflowActionsContext,
    } from "../logic/overflow-actions.svelte";
    import {
        mergeComponentPartProps,
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";

    type ButtonProps = ComponentProps<typeof Button>;
    type ControlledGlobalButtonKeys =
        | "children"
        | "as"
        | "iconOnly"
        | "disabled"
        | "href"
        | "onclick"
        | "aria-label"
        | "title";
    type GlobalButtonProps = Omit<ButtonProps, ControlledGlobalButtonKeys>;

    export interface OverflowActionsActionItem {
        type?: "action";
        id: string;
        label: string;
        icon?: OverflowActionIcon;
        disabled?: boolean;
        href?: string;
        onAction?: () => void;
    }

    export interface OverflowActionsSeparatorItem {
        type: "separator";
        id: string;
    }

    export type OverflowActionsItem =
        | OverflowActionsActionItem
        | OverflowActionsSeparatorItem;

    export interface OverflowActionsActionEvent {
        id: string;
        item?: OverflowActionsActionItem;
        source: "button" | "menu";
        originalEvent?: MouseEvent;
    }

    type Parts = ComponentPartsOf<{
        Button: typeof Button;
        SelectButton: typeof SelectButton;
        Listbox: typeof Listbox;
        MenuItem: typeof MenuItem;
        Separator: typeof Separator;
    }>;

    interface Props extends Omit<FrameProps, "children"> {
        items?: OverflowActionsItem[];
        compact?: "auto" | "none";
        overflow?: "all" | "progressive";
        overflowFrom?: "start" | "end";
        availableWidth?: number;
        moreLabel?: string;
        align?: "start" | "end";
        disabled?: boolean;
        buttonProps?: GlobalButtonProps;
        children?: Snippet;
        parts?: Parts;
        onAction?: (event: OverflowActionsActionEvent) => void;
        [key: string]: any;
    }

    let {
        items = [],
        compact = "auto",
        overflow = "all",
        overflowFrom = "end",
        availableWidth = undefined,
        moreLabel = "更多操作",
        align = "end",
        disabled = false,
        buttonProps = undefined,
        children = undefined,
        parts = undefined,
        onAction = undefined,
        class: userClass = "",
        ...rest
    }: Props = $props();

    let rootElement = $state<HTMLElement | undefined>(undefined);
    let moreMeasureElement = $state<HTMLElement | undefined>(undefined);
    let modes = $state<Record<string, OverflowActionMode>>({});
    let menuEntries = $state<Extract<LayoutEntry, { type: "action" }>[]>([]);
    let hasOverflow = $state(false);
    let layoutFrame = 0;
    let isMounted = false;
    const registrations = new Map<string, OverflowActionRegistration>();

    type LayoutEntry =
        | { type: "action"; action: OverflowActionRegistration }
        | { type: "separator"; element: HTMLElement; index: number };

    const resolvedButtonProps = $derived(
        mergeComponentPartProps(buttonProps, parts?.Button ?? {}),
    );

    const context: OverflowActionsContext = {
        register(action) {
            if (registrations.has(action.id) && import.meta.env.DEV) {
                console.warn(
                    `[SnowUI OverflowActions] duplicate action id="${action.id}".`,
                );
            }
            registrations.set(action.id, action);
            requestLayout();
            return () => {
                if (registrations.get(action.id) === action) {
                    registrations.delete(action.id);
                    requestLayout();
                }
            };
        },
        getMode(id) {
            return modes[id] ?? "full";
        },
        invoke(id, event) {
            runAction(id, "button", event);
        },
        requestLayout,
        get disabled() {
            return disabled;
        },
        get buttonProps() {
            return resolvedButtonProps;
        },
    };

    setContext(OVERFLOW_ACTIONS_CONTEXT_KEY, context);
    function runAction(
        id: string,
        source: "button" | "menu",
        originalEvent?: MouseEvent,
    ) {
        const action = registrations.get(id);
        if (!action || disabled || action.disabled) return;
        action.execute(originalEvent);
        const item = items.find(
            (candidate): candidate is OverflowActionsActionItem =>
                candidate.type !== "separator" && candidate.id === id,
        );
        onAction?.({ id, item, source, originalEvent });
        if (source === "menu" && action.href && typeof window !== "undefined") {
            window.location.assign(action.href);
        }
    }

    function requestLayout() {
        if (!isMounted || layoutFrame) return;
        layoutFrame = requestAnimationFrame(async () => {
            layoutFrame = 0;
            await tick();
            updateLayout();
        });
    }

    function directEntries(): LayoutEntry[] {
        if (!rootElement) return [];
        const entries: LayoutEntry[] = [];
        let separatorIndex = 0;
        for (const node of Array.from(rootElement.children)) {
            if (!(node instanceof HTMLElement)) continue;
            const actionId = node.dataset.overflowActionId;
            if (actionId) {
                const action = registrations.get(actionId);
                if (action) entries.push({ type: "action", action });
                continue;
            }
            if (node.dataset.as === "separator") {
                entries.push({
                    type: "separator",
                    element: node,
                    index: separatorIndex++,
                });
            }
        }
        return entries;
    }

    function normalizeEntries(
        entries: LayoutEntry[],
        actionIds: Set<string>,
    ): LayoutEntry[] {
        const kept: LayoutEntry[] = [];
        let pendingSeparator: LayoutEntry | undefined;
        for (const entry of entries) {
            if (entry.type === "separator") {
                if (kept.some(candidate => candidate.type === "action")) {
                    pendingSeparator = entry;
                }
                continue;
            }
            if (!actionIds.has(entry.action.id)) continue;
            if (pendingSeparator) {
                kept.push(pendingSeparator);
                pendingSeparator = undefined;
            }
            kept.push(entry);
        }
        while (kept.at(-1)?.type === "separator") kept.pop();
        return kept;
    }

    function entryWidth(entry: LayoutEntry, mode: "full" | "compact") {
        if (entry.type === "separator") {
            return entry.element.getBoundingClientRect().width;
        }
        const element = mode === "compact"
            ? entry.action.getCompactMeasureElement()
            : entry.action.getFullMeasureElement();
        return element?.getBoundingClientRect().width ?? 0;
    }

    function totalWidth(
        entries: LayoutEntry[],
        mode: "full" | "compact",
        includeMore: boolean,
        gap: number,
    ) {
        const widths = entries.map(entry => entryWidth(entry, mode));
        if (includeMore) {
            widths.push(moreMeasureElement?.getBoundingClientRect().width ?? 0);
        }
        return widths.reduce((sum, width) => sum + width, 0) +
            Math.max(0, widths.length - 1) * gap;
    }

    function updateLayout() {
        if (!rootElement) return;
        if (rootElement.querySelector('.snowui-select-button-trigger[aria-expanded="true"]')) return;

        const entries = directEntries();
        const actions = entries
            .filter((entry): entry is Extract<LayoutEntry, { type: "action" }> =>
                entry.type === "action",
            )
            .map(entry => entry.action);
        const allIds = new Set(actions.map(action => action.id));
        const normalizedAll = normalizeEntries(entries, allIds);
        const width = Math.max(
            0,
            availableWidth ?? rootElement.getBoundingClientRect().width,
        );
        const computed = getComputedStyle(rootElement);
        const gap = Number.parseFloat(computed.columnGap || computed.gap) || 0;
        const canCompact = compact === "auto" && actions.length > 0 &&
            actions.every(action => !!action.icon);

        let nextModes: Record<string, OverflowActionMode> = Object.fromEntries(
            actions.map(action => [action.id, "full" as OverflowActionMode]),
        );
        let nextMenuEntries: LayoutEntry[] = [];
        let visibleEntries = normalizedAll;

        if (totalWidth(normalizedAll, "full", false, gap) <= width) {
            // Full is the preferred stable state.
        } else if (
            canCompact &&
            totalWidth(normalizedAll, "compact", false, gap) <= width
        ) {
            nextModes = Object.fromEntries(
                actions.map(action => [action.id, "compact" as OverflowActionMode]),
            );
        } else if (overflow === "all") {
            nextModes = Object.fromEntries(
                actions.map(action => [action.id, "hidden" as OverflowActionMode]),
            );
            visibleEntries = [];
            nextMenuEntries = normalizedAll;
        } else {
            const baseMode = canCompact ? "compact" : "full";
            const visibleIds = new Set(allIds);
            const candidates = overflowFrom === "start" ? actions : [...actions].reverse();
            for (const candidate of candidates) {
                const normalizedVisible = normalizeEntries(entries, visibleIds);
                if (totalWidth(normalizedVisible, baseMode, true, gap) <= width) break;
                visibleIds.delete(candidate.id);
            }
            visibleEntries = normalizeEntries(entries, visibleIds);
            const hiddenIds = new Set(
                actions.filter(action => !visibleIds.has(action.id)).map(action => action.id),
            );
            nextMenuEntries = normalizeEntries(entries, hiddenIds);
            nextModes = Object.fromEntries(
                actions.map(action => [
                    action.id,
                    visibleIds.has(action.id) ? baseMode : "hidden",
                ]),
            );
        }

        const visibleSeparators = new Set(
            visibleEntries
                .filter((entry): entry is Extract<LayoutEntry, { type: "separator" }> =>
                    entry.type === "separator",
                )
                .map(entry => entry.element),
        );
        for (const entry of entries) {
            if (entry.type === "separator") {
                entry.element.hidden = !visibleSeparators.has(entry.element);
            }
        }

        modes = nextModes;
        menuEntries = nextMenuEntries.filter(
            (entry): entry is Extract<LayoutEntry, { type: "action" }> =>
                entry.type === "action",
        );
        hasOverflow = menuEntries.length > 0;
    }

    function handleMenuAction(id: string) {
        runAction(id, "menu");
        requestLayout();
    }

    function handleInteractionEnd() {
        requestLayout();
    }

    onMount(() => {
        isMounted = true;
        requestLayout();
    });

    onDestroy(() => {
        isMounted = false;
        if (layoutFrame) cancelAnimationFrame(layoutFrame);
    });

    $effect(() => {
        const node = rootElement;
        if (availableWidth !== undefined || !node) return;
        return resizeManager.watch(node, requestLayout);
    });

    $effect(() => {
        availableWidth;
        compact;
        overflow;
        overflowFrom;
        items;
        buttonProps;
        parts?.Button;
        parts?.SelectButton;
        requestLayout();
    });
</script>

{#snippet renderMenuIcon(icon: OverflowActionIcon | undefined)}
    {#if typeof icon === "string"}
        <ComponentIcon name={icon} size={16} aria-hidden="true" />
    {:else if icon}
        {@render icon()}
    {/if}
{/snippet}

<Frame
    bind:element={rootElement}
    tag="div"
    row
    class={`snowui-overflow-actions${userClass ? ` ${userClass}` : ""}`}
    data-overflow={hasOverflow || undefined}
    enableAutoLayout={false}
    enableResponsive={false}
    enableContext={true}
    enableScaleObserver={false}
    enableDefaultMotion={false}
    onfocusin={handleInteractionEnd}
    onkeyup={handleInteractionEnd}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        {#each items as item (item.id)}
            {#if item.type === "separator"}
                <Separator {...parts?.Separator} as="separator" column />
            {:else}
                <OverflowAction
                    as="item"
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    disabled={item.disabled}
                    href={item.href}
                    onclick={item.onAction}
                />
            {/if}
        {/each}
    {/if}

    {#if hasOverflow}
        <SelectButton
            {...resolvedButtonProps}
            {...parts?.SelectButton}
            iconOnly
            showIndicator={false}
            selectionMode="action"
            ariaLabel={moreLabel}
            title={moreLabel}
            disabled={disabled}
            onAction={handleMenuAction}
            parts={{ Listbox: parts?.Listbox, MenuItem: parts?.MenuItem }}
        >
            {#snippet label()}
                <ComponentIcon name="three-dots" aria-hidden="true" />
            {/snippet}
            <Listbox search={false} showCheck={false} placementMode="bottom" {align}>
                {#each menuEntries as entry}
                    <MenuItem
                        as="item"
                        value={entry.action.id}
                        disabled={disabled || entry.action.disabled}
                    >
                        {#if entry.action.icon}
                            <span data-as="leading">
                                {@render renderMenuIcon(entry.action.icon)}
                            </span>
                        {/if}
                        <span class="snowui-menu-item-label">
                            {entry.action.label}
                        </span>
                    </MenuItem>
                {/each}
            </Listbox>
        </SelectButton>
    {/if}

    <span class="snowui-overflow-actions-more-measure" aria-hidden="true" inert>
        <span bind:this={moreMeasureElement}>
            <Button {...resolvedButtonProps} iconOnly tabindex={-1} aria-label={moreLabel}>
                <ComponentIcon name="three-dots" aria-hidden="true" />
            </Button>
        </span>
    </span>
</Frame>

<style>
    :global(:where(.snowui-overflow-actions)) {
        position: relative;
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: var(--snowui-overflow-actions-gap-override, var(--gap-2, 0.5rem));
        width: 100%;
        min-width: 0;
        max-width: 100%;
        white-space: nowrap;
        font-size: inherit;
        line-height: inherit;
    }

    :global(:where(.snowui-overflow-actions > [data-as="separator"])) {
        height: var(--snowui-overflow-actions-separator-length, var(--size-3));
    }

    :global(:where(.snowui-overflow-actions > [data-as="separator"])[hidden]) {
        display: none;
    }

    :global(:where(.snowui-overflow-actions-more-measure)) {
        position: absolute;
        inset: 0 auto auto 0;
        display: inline-flex;
        visibility: hidden;
        pointer-events: none;
        contain: layout style;
    }
</style>
