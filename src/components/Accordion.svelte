<!-- SnowUI source notice | LICENSE 2.2.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Accordion 组件：可展开 / 收起的内容容器
  v1.6.2

  布局模型：复合管理布局。根层为 Frame，仅提供分组状态与 AccordionContext。
  内部内容由 AccordionItem 容器组成，单项内部使用 Frame as="title|content"。

  文档: ./Accordion.md
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    let accordionIdSeed = 0;
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import { setContext } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import AccordionItem from "./AccordionItem.svelte";
    import { getSize, type AccordionValue, type AccordionType } from "../context";
    import { ACCORDION_CONTEXT_KEY } from "../keys";
    import { RESIZE_MOTION_STYLE } from "../motion/presets/resize";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    type AccordionVariant = "filled" | "divided";
    type AccordionSize = "sm" | "md" | "lg";

    export interface AccordionEntry {
        title: string;
        content: string;
    }

    interface Props extends Omit<FrameProps, "children" | "value"> {
        type?: AccordionType;
        value?: AccordionValue;
        defaultValue?: AccordionValue;
        collapsible?: boolean;
        variant?: AccordionVariant;
        size?: AccordionSize;
        disabled?: boolean;
        /** @deprecated 保留兼容；Accordion 不再显示 hover 背景。 */
        continuousHover?: boolean;
        indicatorVariant?: "cross" | "minus";
        role?: string;
        items?: AccordionEntry[];
        children?: Snippet;
        parts?: ComponentPartsOf<{
            AccordionItem: typeof AccordionItem;
            Frame: typeof Frame;
        }>;
        onValueChange?: (value: AccordionValue) => void;
        [key: string]: any;
    }

    let {
        type = "single",
        value = $bindable<AccordionValue | undefined>(undefined),
        defaultValue = undefined,
        collapsible = true,
        variant = "filled",
        size = undefined,
        disabled = false,
        continuousHover = false,
        indicatorVariant = "cross",
        role = "presentation",
        items = [],
        children,
        parts = undefined,
        onValueChange,
        class: className = "",
        style,
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    const instanceId = `snowui-accordion-${++accordionIdSeed}`;
    let accordionElement = $state<HTMLElement>();
    const contextSize = getSize();
    const resolvedSize = $derived.by<AccordionSize>(() => {
        if (size) return size;
        if (typeof contextSize === "number") {
            if (contextSize <= 16) return "sm";
            if (contextSize <= 28) return "md";
            return "lg";
        }
        return "md";
    });

    function normalizeValue(input: AccordionValue | undefined): string[] {
        if (input === undefined) return [];
        if (Array.isArray(input)) return input;
        return input ? [input] : [];
    }

    function toOutputValue(values: string[]): AccordionValue {
        return type === "multiple" ? values : (values[0] ?? "");
    }

    function resolveInitialValues() {
        return normalizeValue(defaultValue);
    }

    let internalValues = $state<string[]>(resolveInitialValues());
    const selectedValues = $derived(normalizeValue(value ?? internalValues));

    function isOpen(itemValue: string): boolean {
        return selectedValues.includes(itemValue);
    }

    function toggle(itemValue: string) {
        if (disabled) return;
        const open = selectedValues.includes(itemValue);
        let nextValues: string[];

        if (type === "multiple") {
            nextValues = open
                ? selectedValues.filter((current) => current !== itemValue)
                : [...selectedValues, itemValue];
        } else {
            nextValues = open && collapsible ? [] : [itemValue];
        }

        internalValues = nextValues;
        value = toOutputValue(nextValues);
        onValueChange?.(value);
    }

    function sanitizeId(value: string): string {
        return value.replace(/[^a-zA-Z0-9_-]/g, "-");
    }

    setContext(ACCORDION_CONTEXT_KEY, {
        get accordionId() {
            return instanceId;
        },
        get disabled() {
            return disabled;
        },
        get indicatorVariant() {
            return indicatorVariant;
        },
        get type() {
            return type;
        },
        isOpen,
        toggle,
        getTriggerId(itemValue: string) {
            return `${instanceId}-${sanitizeId(itemValue)}-trigger`;
        },
        getContentId(itemValue: string) {
            return `${instanceId}-${sanitizeId(itemValue)}-content`;
        },
    });
</script>

<Frame
    bind:element={accordionElement}
    column
    enableAutoLayout={false}
    enableResponsive={true}
    enableContext={true}
    enableScaleObserver={false}
    enableDefaultMotion={true}
    class={[
        "snowui-accordion",
        `snowui-accordion-${variant}`,
        `snowui-accordion-${resolvedSize}`,
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    role={role}
    data-disabled={disabled ? "true" : undefined}
    renderHints={{
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height ?? "var(--leading-14)",
        radius: userRenderHints?.radius ?? "var(--radius-4)",
    }}
    {disabled}
    style={[RESIZE_MOTION_STYLE, style]
        .filter(Boolean)
        .join("; ")}
    {...rest}
>
    {#if children}
        {@render children()}
    {:else}
        {#each items as item, index (`${index}:${item.title}`)}
            <AccordionItem {...parts?.AccordionItem} value={String(index)}>
                <Frame
                    {...parts?.Frame}
                    as="title"
                    row
                    enableResponsive={false}
                    enableContext={true}
                    enableScaleObserver={false}
                >
                    {item.title}
                </Frame>
                <Frame
                    {...parts?.Frame}
                    as="content"
                    row
                    enableResponsive={false}
                    enableContext={true}
                    enableScaleObserver={false}
                >
                    {item.content}
                </Frame>
            </AccordionItem>
        {/each}
    {/if}
</Frame>

<style>
    :global(:where(.snowui-accordion)) {
        --snowui-accordion-font-size: var(--text-14);
        --snowui-accordion-line-height: var(--leading-14);
        --snowui-accordion-content-font-size: var(--snowui-accordion-font-size-override, var(--snowui-accordion-font-size));
        --snowui-accordion-content-line-height: var(--snowui-accordion-line-height-override, var(--snowui-accordion-line-height));
        --snowui-accordion-content-color: var(--black-40, #00000066);
        --snowui-accordion-padding-y: var(--padding-2);
        --snowui-accordion-padding-x: var(--padding-2);
        --snowui-accordion-content-padding-y: var(--padding-2);
        --snowui-accordion-content-padding-x: var(--padding-2);
        --snowui-accordion-gap: 0;
        --snowui-accordion-trigger-gap: var(--gap-2);
        --snowui-accordion-radius: var(--radius-0);
        --snowui-accordion-icon-size: var(--size-4);
        --snowui-accordion-item-bg: transparent;
        --snowui-accordion-item-shadow: inset 0 calc(var(--border-1) * -1) 0
            var(--black-10, #0000001a);

        display: flex;
        flex-direction: column;
        align-self: start;
        gap: var(--snowui-accordion-gap-override, var(--snowui-accordion-gap));
        color: inherit;
        font-size: var(
            --snowui-accordion-font-size-override,
            var(--snowui-accordion-font-size)
        );
        line-height: var(
            --snowui-accordion-line-height-override,
            var(--snowui-accordion-line-height)
        );
    }

    :global(:where(.snowui-accordion-sm)) {
        --snowui-accordion-font-size: var(--text-14);
        --snowui-accordion-line-height: var(--leading-14);
        --snowui-accordion-content-font-size: var(--snowui-accordion-font-size-override, var(--snowui-accordion-font-size));
        --snowui-accordion-content-line-height: var(--snowui-accordion-line-height-override, var(--snowui-accordion-line-height));
        --snowui-accordion-padding-y: var(--padding-2);
        --snowui-accordion-padding-x: var(--padding-2);
        --snowui-accordion-content-padding-y: var(--padding-2);
        --snowui-accordion-content-padding-x: var(--padding-2);
        --snowui-accordion-radius: var(--radius-0);
        --snowui-accordion-icon-size: var(--size-4);
    }

    :global(:where(.snowui-accordion-md)) {
        --snowui-accordion-font-size: var(--text-16);
        --snowui-accordion-line-height: var(--leading-16);
        --snowui-accordion-content-font-size: var(--snowui-accordion-font-size-override, var(--snowui-accordion-font-size));
        --snowui-accordion-content-line-height: var(--snowui-accordion-line-height-override, var(--snowui-accordion-line-height));
        --snowui-accordion-padding-y: var(--padding-3);
        --snowui-accordion-padding-x: var(--padding-2);
        --snowui-accordion-content-padding-y: var(--padding-3);
        --snowui-accordion-content-padding-x: var(--padding-2);
        --snowui-accordion-radius: var(--radius-0);
        --snowui-accordion-icon-size: var(--size-5);
    }

    :global(:where(.snowui-accordion-lg)) {
        --snowui-accordion-font-size: var(--text-18);
        --snowui-accordion-line-height: var(--leading-18);
        --snowui-accordion-content-font-size: var(--snowui-accordion-font-size-override, var(--snowui-accordion-font-size));
        --snowui-accordion-content-line-height: var(--snowui-accordion-line-height-override, var(--snowui-accordion-line-height));
        --snowui-accordion-padding-y: var(--padding-4);
        --snowui-accordion-padding-x: var(--padding-2);
        --snowui-accordion-content-padding-y: var(--padding-4);
        --snowui-accordion-content-padding-x: var(--padding-2);
        --snowui-accordion-radius: var(--radius-0);
        --snowui-accordion-icon-size: var(--size-6);
    }

    :global(:where(.snowui-accordion-filled)) {
        --snowui-accordion-gap: var(--gap-1);
        --snowui-accordion-item-bg: var(--black-4, #0000000a);
        --snowui-accordion-item-shadow: none;
    }

    :global(:where(.snowui-accordion-filled.snowui-accordion-sm)) {
        --snowui-accordion-padding-y: var(--padding-2);
        --snowui-accordion-padding-x: var(--padding-3);
        --snowui-accordion-content-padding-y: var(--padding-2);
        --snowui-accordion-content-padding-x: var(--padding-3);
        --snowui-accordion-radius: var(--radius-3);
    }

    :global(:where(.snowui-accordion-filled.snowui-accordion-md)) {
        --snowui-accordion-padding-y: var(--padding-3);
        --snowui-accordion-padding-x: var(--padding-4);
        --snowui-accordion-content-padding-y: var(--padding-3);
        --snowui-accordion-content-padding-x: var(--padding-4);
        --snowui-accordion-radius: var(--radius-4);
    }

    :global(:where(.snowui-accordion-filled.snowui-accordion-lg)) {
        --snowui-accordion-padding-y: var(--padding-4);
        --snowui-accordion-padding-x: var(--padding-5);
        --snowui-accordion-content-padding-y: var(--padding-4);
        --snowui-accordion-content-padding-x: var(--padding-5);
        --snowui-accordion-radius: var(--radius-6);
    }

    :global(:where(.snowui-accordion > .snowui-accordion-item)) {
        position: relative;
        z-index: 1;
    }

    :global(:where(.snowui-accordion-continuous-hover-layer)) {
        border-radius: var(
            --snowui-accordion-radius-override,
            var(--snowui-accordion-radius)
        );
        background: color-mix(
            in srgb,
            currentColor var(--snowui-hover-opacity, 4%),
            transparent
        );
    }

    :global(:where([theme="dark"] .snowui-accordion-continuous-hover-layer)) {
        --snowui-hover-opacity: 10%;
    }
</style>
