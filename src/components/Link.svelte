<!--
  Link 组件：正文、说明与导航中的文字链接

  布局模型：槽位宿主布局（三槽位：leading / content / trailing）
  默认样式迁移自 Button 的旧 link 变体；arrow / external 对齐 Workshop Link 样式 2 / 样式 3。

  文档：./Link.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Tooltip from "./Tooltip.svelte";
    import { resolveSnowUIColor, type SnowUIColor } from "../lib/color";
    import {
        fitTextToElement,
        measureTextForElement,
    } from "../lib/truncate";
    import { TruncationController } from "../logic/frame-truncation.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";

    type LinkVariant = "default" | "arrow" | "external";
    type LinkUnderline = "none" | "always" | "hover";
    type TooltipProp = boolean | string | Snippet | Record<string, any>;

    const isTooltipConfigObject = (
        value: TooltipProp | undefined,
    ): value is Record<string, any> =>
        typeof value === "object" && value !== null && typeof value !== "function";

    interface Props extends Omit<FrameProps, "children" | "tag"> {
        variant?: LinkVariant;
        href?: string;
        target?: string;
        rel?: string;
        disabled?: boolean;
        hoverColor?: SnowUIColor | string | false;
        underline?: LinkUnderline;
        lines?: false | 1;
        tooltip?: TooltipProp;
        onTruncate?: (isTruncated: boolean) => void;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Tooltip: typeof Tooltip }>;
        [key: string]: any;
    }

    let {
        variant = "default",
        href = undefined,
        target = undefined,
        rel = undefined,
        disabled = false,
        hoverColor = undefined,
        underline = "none",
        lines = false,
        tooltip: tooltipProp = undefined,
        parts = undefined,
        onTruncate = undefined,
        onclick: userOnClick = undefined,
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        class: userClass = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        children,
        ...rest
    }: Props = $props();

    let hostElement = $state<HTMLElement>();
    let contentElement = $state<HTMLElement>();
    let hasCustomTrailing = $state(false);
    const truncation = new TruncationController(
        undefined,
        () => contentElement,
    );
    const resolvedLines = $derived(lines === false ? undefined : lines);

    $effect(() => {
        truncation.update(resolvedLines, onTruncate);
    });

    const tooltipConfig = $derived.by(() =>
        isTooltipConfigObject(tooltipProp) ? tooltipProp : {},
    );
    const tooltipContent = $derived.by(() => {
        if (tooltipProp === false || resolvedLines !== 1 || !truncation.isTruncated) {
            return undefined;
        }
        if (typeof tooltipProp === "string" || typeof tooltipProp === "function") {
            return tooltipProp;
        }
        return truncation.fullText || undefined;
    });
    const needTooltip = $derived(
        typeof tooltipContent === "string"
            ? tooltipContent.length > 0
            : tooltipContent !== undefined && tooltipContent !== null,
    );
    const linkTextAvailableWidth = $derived.by(() => {
        const observedWidth = truncation.availableWidth;
        if (!hostElement) return observedWidth;
        const style = getComputedStyle(hostElement);
        const maxWidth = Number.parseFloat(style.maxWidth);
        if (!Number.isFinite(maxWidth)) return observedWidth;
        const slots = Array.from(
            hostElement.querySelectorAll<HTMLElement>(
                ':scope > [data-as="leading"], :scope > [data-as="trailing"]',
            ),
        );
        const slotWidth = slots.reduce(
            (total, slot) => total + slot.getBoundingClientRect().width,
            0,
        );
        const gap = Number.parseFloat(style.columnGap || style.gap) || 0;
        return Math.max(0, maxWidth - slotWidth - gap * slots.length);
    });
    const visibleText = $derived.by(() => {
        if (!contentElement) return "";
        if (!truncation.isTruncated) return truncation.fullText;
        return fitTextToElement(
            truncation.fullText,
            linkTextAvailableWidth,
            contentElement,
        );
    });
    const truncatedContentStyle = $derived.by(() => {
        if (
            resolvedLines !== 1 ||
            !truncation.isTruncated ||
            !contentElement
        ) {
            return undefined;
        }
        const width = measureTextForElement(`${visibleText}…`, contentElement);
        return `--snowui-link-truncated-content-width:${width}px`;
    });

    $effect(() => {
        if (!hostElement) return;
        const host = hostElement;
        const update = () => {
            const content = host.querySelector(
                ":scope > .snowui-link-content",
            );
            if (content) {
                const label = content.querySelector(
                    ":scope > .snowui-link-label > .snowui-link-label-text",
                );
                if (label) {
                    label
                        .querySelectorAll(':scope > [data-as="leading"]')
                        .forEach((slot) => {
                            const next = slot.nextSibling;
                            if (next?.nodeType === Node.TEXT_NODE) {
                                next.textContent = next.textContent?.replace(/^\s+/, "") ?? "";
                            }
                            host.insertBefore(slot, content);
                        });
                    label
                        .querySelectorAll(':scope > [data-as="trailing"]')
                        .forEach((slot) => {
                            const previous = slot.previousSibling;
                            if (previous?.nodeType === Node.TEXT_NODE) {
                                previous.textContent = previous.textContent?.replace(/\s+$/, "") ?? "";
                            }
                            host.append(slot);
                        });
                }
            }
            hasCustomTrailing = !!host.querySelector(
                ':scope > [data-as="trailing"]:not(.snowui-link-default-trailing)',
            );
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(host, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    const internalStyle = $derived.by(() => {
        if (hoverColor === undefined) return "";
        if (hoverColor === false) {
            return "--snowui-link-hover-color: var(--snowui-link-color);";
        }
        return `--snowui-link-hover-color: ${resolveSnowUIColor(hoverColor)};`;
    });

    const linkStyle = $derived(
        [internalStyle, userStyle].filter(Boolean).join("; ") || undefined,
    );

    function handleClick(event: MouseEvent) {
        if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        userOnClick?.(event);
    }
</script>

<Frame
    bind:element={hostElement}
    tag="a"
    row
    {href}
    {target}
    {rel}
    {disabled}
    aria-disabled={disabled || undefined}
    data-variant={variant}
    data-underline={underline}
    data-lines={resolvedLines}
    data-truncated={resolvedLines === 1
        ? truncation.isTruncated
            ? "true"
            : "false"
        : undefined}
    componentParts={parts}
    class={[
        "snowui-link",
        `snowui-link-${variant}`,
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    style={linkStyle}
    onclick={handleClick}
    enableAutoLayout={enableAutoLayout}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    renderHints={{
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "4rem",
        height: userRenderHints?.height ?? "var(--leading-14)",
        radius: userRenderHints?.radius,
    }}
    {...rest}
>
    <span class="snowui-link-content" style={truncatedContentStyle}>
        <span class="snowui-link-label" data-lines={resolvedLines}>
            {#if resolvedLines === 1}
                <span
                    bind:this={contentElement}
                    class="snowui-link-label-text snowui-link-label-measure"
                    aria-hidden="true"
                >
                    {@render children?.()}
                </span>
                <span class="snowui-link-label-visible">
                    {visibleText}{#if truncation.isTruncated}<span
                            class="snowui-link-ellipsis"
                            aria-hidden="true">…</span
                        >{/if}
                </span>
            {:else}
                <span bind:this={contentElement} class="snowui-link-label-text">
                    {@render children?.()}
                </span>
            {/if}
        </span>

        {#if needTooltip}
            <Tooltip {...tooltipConfig}>
                {#if typeof tooltipContent === "string"}
                    {tooltipContent}
                {:else if typeof tooltipContent === "function"}
                    {@render tooltipContent()}
                {/if}
            </Tooltip>
        {/if}
    </span>

    {#if variant === "arrow" && !hasCustomTrailing}
        <span
            class="snowui-link-default-trailing"
            data-as="trailing"
            aria-hidden="true"
        >
            <ResourceIcon name="arrow-up-right" class="snowui-link-default-icon" size={12} aria-hidden="true" />
        </span>
    {:else if variant === "external" && !hasCustomTrailing}
        <span
            class="snowui-link-default-trailing"
            data-as="trailing"
            aria-hidden="true"
        >
            <ResourceIcon name="arrow-square-out" class="snowui-link-default-icon" size={12} aria-hidden="true" />
        </span>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-link)) {
        --snowui-link-font-size: var(--text-14);
        --snowui-link-line-height: var(--leading-14);
        --snowui-link-gap: calc(var(--gap-1) / 2);
        --snowui-link-icon-size: var(--size-3);
        --snowui-link-color: var(--secondary-indigo, #adadfbff);
        --snowui-link-hover-color: color-mix(
            in srgb,
            var(--secondary-indigo, #adadfbff),
            var(--black-80, #000000cc)
        );
        --snowui-link-decoration-opacity: var(--snowui-state-opacity, 0.4);
        --snowui-link-decoration-hover-opacity: var(--snowui-state-opacity, 1);

        color: var(--snowui-link-color-override, var(--snowui-link-color));
        text-decoration: none;
        width: fit-content;
        max-width: 100%;
        gap: var(--snowui-link-gap-override, var(--snowui-link-gap));
        font-size: var(
            --snowui-link-font-size-override,
            var(--snowui-link-font-size)
        );
        line-height: var(
            --snowui-link-line-height-override,
            var(--snowui-link-line-height)
        );
        cursor: var(--snowui-state-cursor, pointer);
        transition:
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-link)[data-auto-layout]) {
        gap: var(--snowui-link-gap-override, var(--snowui-link-gap));
    }

    :global(:where(.snowui-link).snowui-link-arrow),
    :global(:where(.snowui-link).snowui-link-external) {
        --snowui-link-color: var(--black-100, #000000ff);
        --snowui-link-hover-color: var(--secondary-indigo, #adadfbff);
    }

    :global(:where(.snowui-link):hover:not(.snowui-disabled)),
    :global(:where(.snowui-link):active:not(.snowui-disabled)) {
        color: var(--snowui-link-hover-color);
    }

    :global(:where(.snowui-link):focus-visible) {
        outline: var(--border-1) solid currentColor;
        outline-offset: var(--border-2);
    }

    :global(:where(.snowui-link-content)) {
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-link)[data-lines="1"] > .snowui-link-content) {
        width: var(--snowui-link-truncated-content-width, auto);
        overflow: hidden;
    }

    :global(:where(.snowui-link)[data-lines="1"]) {
        width: fit-content;
    }

    :global(:where(.snowui-link-label)) {
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-link-label)[data-lines="1"]) {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
    }

    :global(:where(.snowui-link-label-text)) {
        display: block;
        min-width: 0;
        max-width: 100%;
        text-decoration-line: none;
        text-decoration-color: currentColor;
    }

    :global(:where(.snowui-link-label)[data-lines="1"] > .snowui-link-label-text) {
        grid-column: 1;
        grid-row: 1;
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
    }

    :global(:where(.snowui-link-label-measure)) {
        visibility: hidden;
    }

    :global(:where(.snowui-link-label-visible)) {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
    }

    :global(:where(.snowui-link-ellipsis)) {
        text-decoration: none;
    }

    :global(:where(.snowui-link)[data-underline="always"] > .snowui-link-content > .snowui-link-label > .snowui-link-label-text),
    :global(:where(.snowui-link)[data-underline="always"] > .snowui-link-content > .snowui-link-label > .snowui-link-label-visible),
    :global(:where(.snowui-link)[data-underline="hover"]:hover:not(.snowui-disabled) > .snowui-link-content > .snowui-link-label > .snowui-link-label-text),
    :global(:where(.snowui-link)[data-underline="hover"]:hover:not(.snowui-disabled) > .snowui-link-content > .snowui-link-label > .snowui-link-label-visible) {
        text-decoration-line: underline;
    }

    :global(:where(.snowui-link > [data-as="leading"])),
    :global(:where(.snowui-link > [data-as="trailing"])) {
        display: inline-flex;
        align-items: inherit;
        text-decoration: none;
    }

    :global(:where(.snowui-link > [data-as="trailing"]:not(.snowui-link-default-trailing))) {
        color: currentColor;
        opacity: var(
            --snowui-link-decoration-opacity-override,
            var(--snowui-link-decoration-opacity)
        );
        text-decoration: none;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-link-default-trailing)) {
        display: inline-flex;
        flex-shrink: 0;
        color: currentColor;
        opacity: var(
            --snowui-link-decoration-opacity-override,
            var(--snowui-link-decoration-opacity)
        );
        text-decoration: none;
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-link):hover:not(.snowui-disabled) > .snowui-link-default-trailing),
    :global(:where(.snowui-link):active:not(.snowui-disabled) > .snowui-link-default-trailing),
    :global(:where(.snowui-link):hover:not(.snowui-disabled) > [data-as="trailing"]:not(.snowui-link-default-trailing)),
    :global(:where(.snowui-link):active:not(.snowui-disabled) > [data-as="trailing"]:not(.snowui-link-default-trailing)) {
        opacity: var(
            --snowui-link-decoration-hover-opacity-override,
            var(--snowui-link-decoration-hover-opacity)
        );
    }

    :global(:where(.snowui-link-default-icon)) {
        --snowui-icon-size-override: var(
            --snowui-link-icon-size-override,
            var(--snowui-link-icon-size)
        );
    }
</style>
