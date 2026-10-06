<!-- OverflowActions 的专用真实 Button 子项。文档：./OverflowAction.md -->
<script lang="ts">
    import { onMount, type ComponentProps, type Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Frame from "./Frame.svelte";
    import Button from "./Button.svelte";
    import {
        mergeComponentPartProps,
        type ComponentPartsOf,
    } from "../logic/component-parts.svelte";
    import {
        getOverflowActionsContext,
        type OverflowActionIcon,
    } from "../logic/overflow-actions.svelte";

    type ButtonProps = ComponentProps<typeof Button>;
    type ControlledButtonKeys =
        | "children"
        | "as"
        | "iconOnly"
        | "disabled"
        | "href"
        | "onclick"
        | "aria-label"
        | "title";

    interface Props extends Omit<ButtonProps, ControlledButtonKeys> {
        id: string;
        label: string;
        icon?: OverflowActionIcon;
        disabled?: boolean;
        href?: string;
        onclick?: (event?: MouseEvent) => void;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        as?: string;
        [key: string]: any;
    }

    let {
        id,
        label,
        icon = undefined,
        disabled = false,
        href = undefined,
        onclick = undefined,
        children = undefined,
        parts = undefined,
        as = undefined,
        ...rest
    }: Props = $props();

    const owner = getOverflowActionsContext();
    const resolvedButtonProps = $derived(
        mergeComponentPartProps(
            mergeComponentPartProps(
                owner?.buttonProps,
                parts?.Button ?? {},
            ),
            rest,
        ),
    );
    let rootElement = $state<HTMLElement | undefined>(undefined);
    let fullMeasureElement = $state<HTMLElement | undefined>(undefined);
    let compactMeasureElement = $state<HTMLElement | undefined>(undefined);
    const mode = $derived(owner?.getMode(id) ?? "full");
    const resolvedDisabled = $derived(disabled || owner?.disabled === true);
    // Button 仍接收完整兼容 Props；透明测量外壳只同步公开 data-* 标记，
    // 避免把 onclick / motion 等交互能力重复绑定到两层宿主。
    const frameRestProps = $derived.by(() => Object.fromEntries(
        Object.entries(rest).filter(([key]) => key.startsWith("data-")),
    ));

    function execute(event?: MouseEvent) {
        if (resolvedDisabled) return;
        if (owner) owner.invoke(id, event);
        else onclick?.(event);
    }

    onMount(() => {
        if (as !== "item" || !owner) {
            if (import.meta.env.DEV && as === "item" && !owner) {
                console.warn(
                    `[SnowUI OverflowAction] id="${id}" requires an OverflowActions parent.`,
                );
            }
            return;
        }

        return owner.register({
            get id() { return id; },
            get label() { return label; },
            get icon() { return icon; },
            get disabled() { return disabled; },
            get href() { return href; },
            execute(event) { onclick?.(event); },
            getElement: () => rootElement,
            getFullMeasureElement: () => fullMeasureElement,
            getCompactMeasureElement: () => compactMeasureElement,
        });
    });

    $effect(() => {
        id;
        label;
        icon;
        disabled;
        href;
        resolvedButtonProps;
        owner?.requestLayout();
    });
</script>

{#snippet renderIcon()}
    {#if typeof icon === "string"}
        <ComponentIcon name={icon} aria-hidden="true" />
    {:else if icon}
        {@render icon()}
    {/if}
{/snippet}

{#snippet renderFull()}
    {#if children}
        {@render children()}
    {:else}
        {@render renderIcon()}
        {label}
    {/if}
{/snippet}

<Frame
    bind:element={rootElement}
    tag="span"
    class="snowui-overflow-action"
    data-overflow-action-id={id}
    data-overflow-mode={mode}
    data-as={as}
    enableAutoLayout={false}
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    enableDefaultMotion={false}
    {...frameRestProps}
>
    <span class="snowui-overflow-action-visual">
        {#if mode === "compact"}
            <Button
                {...resolvedButtonProps}
                iconOnly
                aria-label={label}
                title={label}
                disabled={resolvedDisabled}
                {href}
                onclick={execute}
            >
                {@render renderIcon()}
            </Button>
        {:else}
            <Button
                {...resolvedButtonProps}
                disabled={resolvedDisabled}
                {href}
                onclick={execute}
            >
                {@render renderFull()}
            </Button>
        {/if}

    </span>

    <span class="snowui-overflow-action-measure" aria-hidden="true" inert>
        <span bind:this={fullMeasureElement}>
            <Button {...resolvedButtonProps} tabindex={-1}>
                {@render renderFull()}
            </Button>
        </span>
        {#if icon}
            <span bind:this={compactMeasureElement}>
                <Button {...resolvedButtonProps} iconOnly tabindex={-1} aria-label={label}>
                    {@render renderIcon()}
                </Button>
            </span>
        {/if}
    </span>
</Frame>

<style>
    :global(:where(.snowui-overflow-action-visual)) {
        display: inline-flex;
        opacity: var(--snowui-responsive-exit-opacity, 1);
    }
    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-overflow-action-visual)) { opacity: 1; }
    }

    :global(:where(.snowui-overflow-action)) {
        position: relative;
        display: inline-flex;
        flex: 0 0 auto;
        min-width: 0;
        font-size: inherit;
        line-height: inherit;
    }

    :global(:where(.snowui-overflow-action[data-overflow-mode="hidden"])) {
        position: absolute;
        visibility: hidden;
        pointer-events: none;
    }

    :global(:where(.snowui-overflow-action-measure)) {
        position: absolute;
        inset: 0 auto auto 0;
        display: inline-flex;
        visibility: hidden;
        pointer-events: none;
        contain: layout style;
        white-space: nowrap;
    }
</style>
