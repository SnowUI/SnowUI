<!--
  AccordionItem 组件：Accordion 内部单个折叠项容器
  v1.2.2

  外层 AccordionItem 负责一整项的背景、圆角、分隔线与展开高度。
  内部通过直系 Frame as="title" / Frame as="content" 承载标题与内容三槽位布局。

  文档: ./AccordionItem.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import { getAllContexts, mount, onDestroy, onMount, tick, unmount } from "svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getAccordion } from "../context";
    import { resizeManager } from "../logic/observer.svelte";

    interface Props extends Omit<FrameProps, "children" | "value" | "size"> {
        value: string;
        disabled?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        value,
        disabled = false,
        children,
        class: className = "",
        enableAutoLayout = true,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        ...rest
    }: Props = $props();

    const accordion = getAccordion();
    const iconContexts = getAllContexts();
    const indicatorIcons = new Map<HTMLElement, Record<string, any>>();
    const frameRest = $derived.by(() => {
        const next = { ...rest };
        delete next["siz" + "e"];
        return next;
    });

    let itemElement = $state<HTMLElement | undefined>(undefined);
    let titleElement = $state<HTMLElement | null>(null);
    let contentElement = $state<HTMLElement | null>(null);
    let contentBlockSize = $state(0);

    const open = $derived(accordion?.isOpen(value) ?? false);
    const itemDisabled = $derived(disabled || accordion?.disabled === true);
    const triggerId = $derived(
        accordion?.getTriggerId(value) ?? `accordion-${value}-trigger`,
    );
    const contentId = $derived(
        accordion?.getContentId(value) ?? `accordion-${value}-content`,
    );

    function getDirectRoleElement(role: "title" | "content") {
        if (!itemElement) return null;
        return itemElement.querySelector(
            `:scope > [data-as="${role}"]`,
        ) as HTMLElement | null;
    }

    function hasCustomTrailing(title: HTMLElement) {
        return !!title.querySelector(
            ':scope > [data-as="trailing"]:not(.snowui-accordion-default-indicator)',
        );
    }

    function ensureDefaultIndicator(title: HTMLElement) {
        let indicator = title.querySelector(
            ":scope > .snowui-accordion-default-indicator",
        ) as HTMLElement | null;

        if (hasCustomTrailing(title)) {
            if (indicator) {
                const instance = indicatorIcons.get(indicator);
                if (instance) void unmount(instance);
                indicatorIcons.delete(indicator);
                indicator.remove();
            }
            return;
        }

        const iconName = open ? "minus" : "plus";
        if (!indicator) {
            indicator = document.createElement("span");
            indicator.className =
                "snowui-accordion-default-indicator snowui-accordion-indicator";
            indicator.dataset.as = "trailing";
            indicator.setAttribute("aria-hidden", "true");
            title.append(indicator);
        }
        if (indicator.dataset.iconName === iconName) return;

        const previous = indicatorIcons.get(indicator);
        if (previous) void unmount(previous);
        indicator.replaceChildren();
        indicator.dataset.iconName = iconName;
        const instance = mount(ResourceIcon, {
            target: indicator,
            context: iconContexts,
            props: { name: iconName, size: 16, "aria-hidden": "true" },
        });
        indicatorIcons.set(indicator, instance);
    }

    function updateContentBlockSize() {
        if (!contentElement) return;
        contentBlockSize = contentElement.scrollHeight;
    }

    function syncRoleElements() {
        titleElement = getDirectRoleElement("title");
        contentElement = getDirectRoleElement("content");

        titleElement?.classList.add("snowui-accordion-title-item");
        contentElement?.classList.add("snowui-accordion-content");

        if (titleElement) {
            ensureDefaultIndicator(titleElement);
            titleElement.id = triggerId;
            titleElement.setAttribute("role", "button");
            titleElement.setAttribute("tabindex", itemDisabled ? "-1" : "0");
            titleElement.setAttribute("aria-expanded", open ? "true" : "false");
            titleElement.setAttribute("aria-controls", contentId);
            titleElement.setAttribute(
                "aria-disabled",
                itemDisabled ? "true" : "false",
            );
            titleElement.dataset.open = open ? "true" : "false";
            titleElement.dataset.disabled = itemDisabled ? "true" : "false";
        }

        if (contentElement) {
            contentElement.id = contentId;
            contentElement.setAttribute("role", "region");
            contentElement.setAttribute("aria-labelledby", triggerId);
            contentElement.setAttribute("aria-hidden", open ? "false" : "true");
            contentElement.dataset.open = open ? "true" : "false";
            contentElement.style.setProperty(
                "--snowui-accordion-item-content-block-size",
                `${contentBlockSize}px`,
            );
        }
    }

    function isTitleEventTarget(target: EventTarget | null) {
        if (!itemElement || !target) return false;
        const title = (target as Element).closest?.('[data-as="title"]');
        return title === titleElement && title?.parentElement === itemElement;
    }

    function toggle() {
        if (itemDisabled) return;
        accordion?.toggle(value);
    }

    function handleClick(event: MouseEvent) {
        if (!isTitleEventTarget(event.target)) return;
        toggle();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!isTitleEventTarget(event.target)) return;
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
    }

    onMount(() => {
        syncRoleElements();
        updateContentBlockSize();
        if (!contentElement) return;
        return resizeManager.watch(contentElement, updateContentBlockSize);
    });

    onDestroy(() => {
        for (const instance of indicatorIcons.values()) void unmount(instance);
        indicatorIcons.clear();
    });

    $effect(() => {
        value;
        open;
        itemDisabled;
        triggerId;
        contentId;
        syncRoleElements();
        tick().then(() => {
            updateContentBlockSize();
            syncRoleElements();
        });
    });
</script>

<Frame
    bind:element={itemElement}
    tag="div"
    column
    data-as={typeof frameRest.as === "string" ? frameRest.as : undefined}
    class={[
        "snowui-accordion-item",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-open={open ? "true" : "false"}
    data-disabled={itemDisabled ? "true" : undefined}
    onclick={handleClick}
    onkeydown={handleKeydown}
    contentFill
    enableAutoLayout={enableAutoLayout === false ? true : enableAutoLayout}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={true}
    {...frameRest}
    renderHints={{
        variant: frameRest.renderHints?.variant ?? "rect",
        width: frameRest.renderHints?.width ?? "100%",
        height: frameRest.renderHints?.height ?? "var(--leading-14)",
        radius: frameRest.renderHints?.radius,
        rows: frameRest.renderHints?.rows ?? 3,
    }}
>
    {@render children?.()}
</Frame>

<style>
    :global(:where(.snowui-accordion-item)) {
        overflow: hidden;
        border-radius: var(
            --snowui-accordion-radius-override,
            var(--snowui-accordion-radius)
        );
        background-color: var(
            --snowui-accordion-background-override,
            var(--snowui-accordion-item-bg)
        );
        gap: 0;
        box-shadow: var(
            --snowui-accordion-shadow-override,
            var(--snowui-accordion-item-shadow)
        );
        transition:
            background-color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            box-shadow var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-accordion > .snowui-accordion-item:last-child)) {
        box-shadow: none;
    }

    :global(:where(.snowui-accordion-item[data-disabled="true"])) {
        opacity: 0.2;
    }

    :global(:where(.snowui-accordion-title-item)) {
        appearance: none;
        width: 100%;
        border: 0;
        margin: 0;
        padding: var(
                --snowui-accordion-padding-y-override,
                var(--snowui-accordion-padding-y)
            )
            var(
                --snowui-accordion-padding-x-override,
                var(--snowui-accordion-padding-x)
            );
        align-items: center;
        gap: var(
            --snowui-accordion-trigger-gap-override,
            var(--snowui-accordion-trigger-gap)
        );
        font: inherit;
        font-size: var(
            --snowui-accordion-font-size-override,
            var(--snowui-accordion-font-size)
        );
        line-height: var(
            --snowui-accordion-line-height-override,
            var(--snowui-accordion-line-height)
        );
        text-align: left;
        background-color: transparent;
        user-select: none;
        cursor: pointer;
    }

    :global(:where(.snowui-accordion-title-item[data-disabled="true"])) {
        cursor: default;
    }

    :global(:where(.snowui-accordion-title-item > :not([data-as]))),
    :global(:where(.snowui-accordion-content > :not([data-as]))) {
        min-width: 0;
    }

    :global(:where(.snowui-accordion-indicator)) {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(
            --snowui-accordion-icon-size-override,
            var(--snowui-accordion-icon-size)
        );
        height: var(
            --snowui-accordion-icon-size-override,
            var(--snowui-accordion-icon-size)
        );
        color: var(--black-100, #000000ff);
        opacity: var(--snowui-state-opacity, 0.4);
        transform: rotate(0deg);
        transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            transform var(--snowui-frame-control-motion-duration, 0.3s)
                var(--snowui-frame-control-motion-easing, ease-out);
    }

    :global(:where(.snowui-accordion-item[data-open="true"]) .snowui-accordion-indicator) {
        transform: rotate(180deg);
    }

    :global(:where(.snowui-accordion-title-item[data-disabled="false"]:hover) .snowui-accordion-indicator) {
        opacity: var(--snowui-state-opacity, 1);
    }

    :global(:where(.snowui-accordion-content)) {
        width: 100%;
        box-sizing: border-box;
        max-block-size: 0;
        padding: 0
            var(
                --snowui-accordion-content-padding-x-override,
                var(--snowui-accordion-content-padding-x)
            );
        gap: var(
            --snowui-accordion-trigger-gap-override,
            var(--snowui-accordion-trigger-gap)
        );
        font-size: var(
            --snowui-accordion-content-font-size-override,
            var(--snowui-accordion-content-font-size)
        );
        line-height: var(
            --snowui-accordion-content-line-height-override,
            var(--snowui-accordion-content-line-height)
        );
        opacity: 0;
        pointer-events: none;
        overflow: hidden;
        background-color: transparent;
        box-shadow: none;
        transition:
            max-block-size var(--snowui-frame-size-motion-duration, 0.3s)
                var(--snowui-frame-size-motion-easing, ease-out),
            padding-block var(--snowui-frame-size-motion-duration, 0.3s)
                var(--snowui-frame-size-motion-easing, ease-out),
            opacity var(--snowui-frame-size-motion-duration, 0.3s)
                var(--snowui-frame-size-motion-easing, ease-out);
        will-change: max-block-size;
    }

    :global(:where(.snowui-accordion-content[data-open="true"])) {
        max-block-size: var(
            --snowui-accordion-item-content-block-size-override,
            var(
                --snowui-accordion-content-max-block-size-override,
                var(--snowui-accordion-item-content-block-size, 100vh)
            )
        );
        padding-bottom: var(
            --snowui-accordion-content-padding-y-override,
            var(--snowui-accordion-content-padding-y)
        );
        opacity: 1;
        pointer-events: auto;
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-accordion-content)) {
            transition: none;
            will-change: auto;
        }
    }
</style>
