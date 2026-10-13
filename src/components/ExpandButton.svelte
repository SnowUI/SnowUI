<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!-- ExpandButton：以真实 Button 为宿主的展开 / 收起按钮。 -->
<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import type { ComponentProps, Snippet } from "svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import Button from "./Button.svelte";
    import { CONTROL_BUTTON_REPLACEMENT_MOTION, CONTROL_BUTTON_MOTION_DURATION_MS, controlButtonMotionStyle } from "../motion/presets/replacement";
    import Frame from "./Frame.svelte";
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
        style: userStyle = "",
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
    style={`${controlButtonMotionStyle(`var(--snowui-expand-button-motion-duration-override, ${CONTROL_BUTTON_MOTION_DURATION_MS}ms)`)} ${userStyle}`}
    iconOnly={!rest.bare && !children}
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
            currentState="Appear" whileAppear={CONTROL_BUTTON_REPLACEMENT_MOTION}
        >
            {#if collapseIcon}
                {@render collapseIcon()}
            {:else}
                <ComponentIcon name="arrows-in-simple" aria-hidden="true" />
            {/if}
        </Frame>
    {:else}
        <Frame
            {...iconFrameProps}
            enableResponsive={false}
            enableContext={false}
            enableScaleObserver={false}
            currentState="Appear" whileAppear={CONTROL_BUTTON_REPLACEMENT_MOTION}
        >
            {#if icon}
                {@render icon()}
            {:else}
                <ComponentIcon name="arrows-out-simple" aria-hidden="true" />
            {/if}
        </Frame>
    {/if}
    {@render children?.()}
</Button>
