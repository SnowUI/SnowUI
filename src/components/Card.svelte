<!--
  Card 组件：通用容器外壳
  v1.0.0

  职责：
  - 只负责容器视觉、内容排列、Pin 承载和溢出滚动。
  - 内容完全自定义；三槽内容使用现有 Frame row / column 组合。
  - Pin 仅采用 as="pin-*" 协议。

  文档: ./Card.md
-->

<script lang="ts">
    import { onDestroy, onMount, tick, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import { resizeManager } from "../logic/observer.svelte";

    interface Props extends Omit<FrameProps, "children"> {
        row?: boolean;
        column?: boolean;
        wrap?: boolean;
        contentFill?: boolean;
        contentHug?: boolean;
        selected?: boolean;
        active?: boolean;
        interactive?: boolean;
        scrollable?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        row = false,
        column = undefined,
        wrap = false,
        contentFill = false,
        contentHug = false,
        selected = false,
        active = false,
        interactive = false,
        scrollable = true,
        disabled = false,
        pinOffset = 12,
        class: userClass = "",
        style: userStyle = "",
        children,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    let rootElement = $state<HTMLElement | undefined>(undefined);
    let viewportElement = $state<HTMLElement | undefined>(undefined);
    let scrollbarElement = $state<HTMLElement | undefined>(undefined);
    let viewportMaxBlockSize = $state<string | undefined>(undefined);
    let pinObserver: MutationObserver | undefined;

    const isRow = $derived(row === true);
    const isColumn = $derived(!isRow);
    const isActive = $derived(active || selected);
    const resolvedDisabled = $derived(disabled === true);
    const resolvedContentWidth = $derived(
        contentFill ? "fill" : contentHug ? "hug" : hasExplicitFillWidth() ? "fill" : "hug",
    );
    const rootStyle = $derived(
        [userStyle].filter(Boolean).join("; ") || undefined,
    );
    const cardRenderHints = $derived(
        userRenderHints ?? {
            variant: "rect",
            radius: "var(--radius-4)",
        },
    );

    const scrollbar = useOverlayScrollbar(
        () => (scrollable ? viewportElement : undefined),
        () => (scrollable ? scrollbarElement : undefined),
    );

    function isPinElement(element: Element): element is HTMLElement {
        return (
            element instanceof HTMLElement &&
            !!element.dataset.as &&
            element.dataset.as.startsWith("pin-")
        );
    }

    function hasExplicitFillWidth() {
        const width = (rest as { width?: unknown }).width;
        if (width !== undefined && width !== null) {
            const value = String(width).trim();
            return (
                value !== "" &&
                value !== "auto" &&
                value !== "hug" &&
                value !== "fit-content"
            );
        }

        const style = typeof userStyle === "string" ? userStyle : "";
        if (/(^|;)\s*(width|inline-size)\s*:/.test(style)) return true;

        const className = typeof userClass === "string" ? userClass : "";
        return /\b(?:w|size)-(?:full|fill|screen|\d|[0-9]+\/[0-9]+|[0-9]+p|[0-9]+px|[0-9]+rem)\b/.test(
            className,
        );
    }

    function hasExplicitBlockConstraint() {
        const height = (rest as { height?: unknown }).height;
        if (height !== undefined && height !== null) {
            const value = String(height).trim();
            if (value !== "" && value !== "auto" && value !== "hug") return true;
        }

        const style = typeof userStyle === "string" ? userStyle : "";
        if (/(^|;)\s*(height|max-height|block-size|max-block-size)\s*:/.test(style)) {
            return true;
        }

        const className = typeof userClass === "string" ? userClass : "";
        return /\b(?:h|max-h|size)-(?:full|fill|screen|\d|[0-9]+\/[0-9]+|[0-9]+p|[0-9]+px|[0-9]+rem)\b/.test(
            className,
        );
    }


    function syncPinnedChildren() {
        if (!rootElement || !viewportElement) return;

        const pins = Array.from(viewportElement.children).filter(isPinElement);
        for (const pin of pins) {
            rootElement.appendChild(pin);
        }
        scrollbar.refresh();
    }

    function updateViewportMaxBlockSize() {
        if (!rootElement || !hasExplicitBlockConstraint()) {
            viewportMaxBlockSize = undefined;
            return;
        }

        const style = getComputedStyle(rootElement);
        const paddingBlock =
            (parseFloat(style.paddingTop) || 0) +
            (parseFloat(style.paddingBottom) || 0);
        const borderBlock =
            (parseFloat(style.borderTopWidth) || 0) +
            (parseFloat(style.borderBottomWidth) || 0);

        const explicitHeight =
            style.height !== "auto" ? parseFloat(style.height) : Number.NaN;
        const explicitMaxHeight =
            style.maxHeight !== "none" ? parseFloat(style.maxHeight) : Number.NaN;
        const constrainedBlockSize = Number.isFinite(explicitMaxHeight)
            ? explicitMaxHeight
            : Number.isFinite(explicitHeight)
                ? explicitHeight
                : Number.NaN;

        viewportMaxBlockSize = Number.isFinite(constrainedBlockSize)
            ? `${Math.max(0, constrainedBlockSize - paddingBlock - borderBlock)}px`
            : undefined;
        scrollbar.refresh();
    }

    $effect(() => {
        userStyle;
        userClass;
        rest;
        rootElement;
        updateViewportMaxBlockSize();
    });

    $effect(() => {
        if (!viewportElement) return;
        pinObserver?.disconnect();
        pinObserver = new MutationObserver(() => {
            void tick().then(syncPinnedChildren);
        });
        pinObserver.observe(viewportElement, { childList: true });
        void tick().then(syncPinnedChildren);

        return () => {
            pinObserver?.disconnect();
            pinObserver = undefined;
        };
    });

    onMount(() => {
        updateViewportMaxBlockSize();
        if (!rootElement) return;

        const unwatch = resizeManager.watch(rootElement, updateViewportMaxBlockSize);
        window.addEventListener("resize", updateViewportMaxBlockSize);

        return () => {
            unwatch();
            window.removeEventListener("resize", updateViewportMaxBlockSize);
        };
    });

    onDestroy(() => {
        pinObserver?.disconnect();
    });
</script>

<Frame
    bind:element={rootElement}
    row={isRow}
    column={isColumn}
    class={[
        "snowui-card",
        "snowui-rounded-rectangle",
        scrollable ? "snowui-overlay-scrollbar-host" : "",
        isRow ? "snowui-card-row" : "snowui-card-column",
        interactive ? "snowui-card-interactive" : "",
        interactive && !resolvedDisabled ? "snowui-hoverable" : "",
        isActive ? "snowui-card-active" : "",
        userClass,
    ]
        .filter(Boolean)
        .join(" ")}
    data-active={isActive ? "true" : undefined}
    data-interactive={interactive ? "true" : undefined}
    data-disabled={resolvedDisabled ? "true" : undefined}
    data-wrap={wrap ? undefined : "false"}
    data-scrollable={scrollable ? "true" : "false"}
    {disabled}
    {pinOffset}
    style={rootStyle}
    renderHints={cardRenderHints}
    enableAutoLayout={true}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    {...rest}
>
    <div
        bind:this={viewportElement}
        class={[
            "snowui-card-viewport",
            scrollable ? "snowui-overlay-scrollbar-viewport" : "",
        ]
            .filter(Boolean)
            .join(" ")}
        data-direction={isRow ? "row" : "column"}
        data-wrap={wrap ? undefined : "false"}
        data-content-width={resolvedContentWidth}
        style={viewportMaxBlockSize ? `max-block-size: ${viewportMaxBlockSize};` : undefined}
    >
        {@render children?.()}
    </div>

    {#if scrollable}
        <div
            bind:this={scrollbarElement}
            class="snowui-card-scrollbar snowui-overlay-scrollbar"
            data-visible={scrollbar.hasOverflow ? "true" : undefined}
            aria-hidden="true"
        >
            <div
                class="snowui-overlay-scrollbar-thumb"
                style="height: {scrollbar.thumbHeight}px; transform: translate3d(0, {scrollbar.thumbY}px, 0);"
            ></div>
        </div>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-card)) {
        --snowui-card-background: var(
            --surface-1,
            rgba(255, 255, 255, 0.8)
        );
        --snowui-card-padding-y: var(--padding-3);
        --snowui-card-padding-x: var(--padding-4);
        --snowui-card-radius: var(--radius-4);
        --snowui-card-row-gap: var(--gap-2);
        --snowui-card-column-gap: var(--gap-1);
        --snowui-card-pin-offset: var(--padding-3);
        --snowui-card-hover-border-color: var(
            --black-40,
            rgba(0, 0, 0, 0.4)
        );
        --snowui-card-active-border-color: var(--primary, #000);
        --snowui-card-border-shadow: none;
        --pin-offset: var(
            --snowui-card-pin-offset-override,
            var(--snowui-card-pin-offset)
        );

        position: relative;
        box-sizing: border-box;
        min-height: 0;
        padding: var(
                --snowui-card-padding-y-override,
                var(--snowui-card-padding-y)
            )
            var(
                --snowui-card-padding-x-override,
                var(--snowui-card-padding-x)
            );
        border-radius: var(
            --snowui-card-radius-override,
            var(--snowui-card-radius)
        );
        background: var(
            --snowui-card-background-override,
            var(--snowui-card-background)
        );
        box-shadow: var(--snowui-card-border-shadow);
        overflow: hidden;
        --snowui-frame-component-transition:
            box-shadow var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            background-color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(
            :where(.snowui-card-interactive:hover:not(.snowui-disabled):not([data-disabled="true"]))
        ) {
        --snowui-card-border-shadow: inset 0 0 0 0.03125rem
            var(
                --snowui-card-hover-border-color-override,
                var(--snowui-card-hover-border-color)
            );
    }

    :global(:where(.snowui-card-active)),
    :global(:where(.snowui-card[data-state="Active"])) {
        --snowui-card-border-shadow: inset 0 0 0 0.0625rem
            var(
                --snowui-card-active-border-color-override,
                var(--snowui-card-active-border-color)
            );
    }

    :global(:where(.snowui-card-viewport)) {
        display: flex;
        flex: 1 1 auto;
        min-height: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-card-viewport[data-direction="column"])) {
        flex-direction: column;
        gap: var(
            --snowui-card-gap-column-override,
            var(--snowui-card-column-gap)
        );
    }

    :global(:where(.snowui-card-viewport[data-direction="column"][data-content-width="fill"] > *)) {
        width: 100%;
    }

    :global(:where(.snowui-card-viewport[data-direction="column"][data-content-width="hug"] > *)) {
        width: fit-content;
        align-self: flex-start;
    }

    :global(:where(.snowui-card-viewport[data-direction="row"])) {
        flex-direction: row;
        gap: var(--snowui-card-gap-row-override, var(--snowui-card-row-gap));
    }

    :global(:where(.snowui-card-viewport[data-direction="row"][data-content-width="fill"] > *)) {
        flex: 1 1 0;
        min-width: 0;
    }

    :global(:where(.snowui-card-viewport[data-direction="row"][data-content-width="hug"] > *)) {
        flex: 0 0 auto;
        min-width: 0;
    }

    :global(:where(.snowui-card-viewport[data-wrap="false"])) {
        flex-wrap: nowrap;
    }

    :global(:where(.snowui-card-viewport:not([data-wrap="false"]))) {
        flex-wrap: wrap;
    }

    :global(:where(.snowui-card[data-scrollable="false"] > .snowui-card-viewport)) {
        overflow: visible;
    }

    :global(:where(.snowui-card-scrollbar)) {
        top: var(
            --snowui-card-padding-y-override,
            var(--snowui-card-padding-y)
        );
        bottom: var(
            --snowui-card-padding-y-override,
            var(--snowui-card-padding-y)
        );
        right: var(--snowui-scrollbar-edge-gap, 4px);
        z-index: 2;
    }
</style>
