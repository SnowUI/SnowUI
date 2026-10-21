<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- OverflowActions 的专用真实 Button 子项。文档：./OverflowAction.md -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
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
        iconOnly?: boolean;
        onclick?: (event?: MouseEvent) => void;
        children?: Snippet;
        control?: Snippet<[(event?: MouseEvent) => void, boolean]>;
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
        iconOnly = false,
        onclick = undefined,
        children = undefined,
        control = undefined,
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
    let visualElement = $state<HTMLElement | undefined>(undefined);
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
            get target() { return rest.target; },
            get rel() { return rest.rel; },
            execute(event) { onclick?.(event); },
            getElement: () => rootElement,
            getWidth(mode) {
                const hidden = rootElement?.dataset.overflowMode === "hidden";
                if (hidden && rootElement) rootElement.style.display = "inline-flex";
                try {
                    const element = control ? visualElement : mode === "compact" ? compactMeasureElement : fullMeasureElement;
                    return element?.getBoundingClientRect().width ?? 0;
                } finally {
                    if (hidden && rootElement) rootElement.style.removeProperty("display");
                }
            },
        });
    });

    $effect(() => {
        id;
        label;
        icon;
        disabled;
        href;
        iconOnly;
        control;
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
    {:else if iconOnly}
        {@render renderIcon()}
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
    <span bind:this={visualElement} class="snowui-overflow-action-visual" style:visibility={mode === "hidden" ? "hidden" : undefined}>
        {#if control}
            {@render control(execute, resolvedDisabled)}
        {:else if mode === "compact"}
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
                {iconOnly}
                aria-label={iconOnly ? label : undefined}
                disabled={resolvedDisabled}
                {href}
                onclick={execute}
            >
                {@render renderFull()}
            </Button>
        {/if}

    </span>

    {#if !control}<span class="snowui-overflow-action-measure" aria-hidden="true" inert>
        <span bind:this={fullMeasureElement}>
            <Button {...resolvedButtonProps} {iconOnly} aria-label={iconOnly ? label : undefined} tabindex={-1}>
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
    </span>{/if}
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

    :global(:where(.snowui-overflow-action-measure)) {
        position: absolute;
        inset: 0 auto auto 0;
        display: inline-flex;
        visibility: hidden;
        pointer-events: none;
        contain: layout style;
        white-space: nowrap;
    }

    :global(:where(.snowui-overflow-action[data-overflow-mode="hidden"])) {
        display: none;
    }
</style>
