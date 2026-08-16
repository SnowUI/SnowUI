<!-- ExpandButton：以真实 Button 为宿主的展开 / 收起按钮。 -->
<script lang="ts">
    import type { ComponentProps, Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Button from "./Button.svelte";
    import Frame from "./Frame.svelte";
    import { REPLACEMENT_APPEAR_MOTION } from "../motion/presets/replacement";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    type ButtonProps = ComponentProps<typeof Button>;
    interface Props extends Omit<ButtonProps, "children" | "onclick" | "aria-expanded"> {
        expanded?: boolean;
        defaultExpanded?: boolean;
        ariaLabel?: string;
        collapseAriaLabel?: string;
        icon?: Snippet;
        collapseIcon?: Snippet;
        children?: Snippet;
        onExpandedChange?: (expanded: boolean) => void;
        onclick?: (event: MouseEvent) => void;
        [key: string]: any;
    }

    const inheritedExpandButtonPart = useComponentPart<Props>("ExpandButton");
    let { expanded = $bindable(), ...explicitProps }: Props = $props();
    let {
        defaultExpanded = false,
        ariaLabel = "展开",
        collapseAriaLabel = "收起",
        icon,
        collapseIcon,
        children,
        disabled = false,
        onExpandedChange,
        onclick,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(
            inheritedExpandButtonPart.current,
            explicitProps,
        ),
    );

    const resolvedExpanded = $derived(expanded ?? defaultExpanded);
    const iconFrameProps = {
        tag: "span" as const,
        enableResponsive: false,
        enableContext: false,
        enableScaleObserver: false,
        "aria-hidden": "true" as const,
    };

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        const next = !resolvedExpanded;
        expanded = next;
        onExpandedChange?.(next);
        onclick?.(event);
    }
</script>

<Button
    {...rest}
    iconOnly={!children}
    {disabled}
    aria-expanded={resolvedExpanded}
    aria-label={resolvedExpanded ? collapseAriaLabel : ariaLabel}
    data-expanded={resolvedExpanded ? "true" : "false"}
    onclick={handleClick}
>
    {#if resolvedExpanded}
        <Frame
            {...iconFrameProps}
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
            whileAppear={REPLACEMENT_APPEAR_MOTION}
        >
            {#if collapseIcon}
                {@render collapseIcon()}
            {:else}
                <ComponentIcon name="arrows-in-simple" size={16} aria-hidden="true" />
            {/if}
        </Frame>
    {:else}
        <Frame
            {...iconFrameProps}
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
            whileAppear={REPLACEMENT_APPEAR_MOTION}
        >
            {#if icon}
                {@render icon()}
            {:else}
                <ComponentIcon name="arrows-out-simple" size={16} aria-hidden="true" />
            {/if}
        </Frame>
    {/if}
    {@render children?.()}
</Button>
