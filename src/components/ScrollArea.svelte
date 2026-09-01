<!--
  ScrollArea：SnowUI 自建滚动区域。
  根 Frame 承接组件能力；内部 viewport 保留原生滚动语义并隐藏原生滚动条。
  文档: ./ScrollArea.md
-->

<script module lang="ts">
    export type ScrollAreaAxis = "vertical" | "horizontal" | "both";
    export type ScrollAreaHorizontalTrackPosition = "container" | "viewport";
</script>

<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";

    interface Props
        extends Omit<FrameProps, "children" | "enableAutoLayout"> {
        axis?: ScrollAreaAxis;
        horizontalTrackPosition?: ScrollAreaHorizontalTrackPosition;
        ariaLabel?: string;
        viewport?: HTMLElement;
        onscroll?: (event: Event) => void;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        axis = "vertical",
        horizontalTrackPosition = "container",
        ariaLabel = "Scrollable content",
        viewport = $bindable(),
        onscroll,
        children,
        class: userClass = "",
        enableResponsive = true,
        enableContext = true,
        enableScaleObserver = false,
        enableDefaultMotion = true,
        ...rest
    }: Props = $props();

    let verticalTrack = $state<HTMLElement>();
    let horizontalTrack = $state<HTMLElement>();

    const verticalScrollbar = useOverlayScrollbar(
        () => (axis === "vertical" || axis === "both" ? viewport : undefined),
        () => verticalTrack,
    );
    const horizontalScrollbar = useOverlayScrollbar(
        () => (axis === "horizontal" || axis === "both" ? viewport : undefined),
        () => horizontalTrack,
        "horizontal",
    );

    const rootClass = $derived(
        ["snowui-scroll-area", "snowui-overlay-scrollbar-host", userClass]
            .filter(Boolean)
            .join(" "),
    );

    function syncVerticalThumb(node: HTMLElement) {
        $effect(() => {
            node.style.height = `${verticalScrollbar.thumbSize}px`;
            node.style.transform = `translate3d(0,${verticalScrollbar.thumbOffset}px,0)`;
        });
    }

    function syncHorizontalThumb(node: HTMLElement) {
        $effect(() => {
            node.style.width = `${horizontalScrollbar.thumbSize}px`;
            node.style.transform = `translate3d(${horizontalScrollbar.thumbOffset}px,0,0)`;
        });
    }
</script>

<Frame
    {...rest}
    class={rootClass}
    data-axis={axis}
    data-horizontal-track-position={horizontalTrackPosition}
    enableAutoLayout={false}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableDefaultMotion={enableDefaultMotion}
    renderHints={{
        variant: rest.renderHints?.variant ?? "rect",
        width: rest.renderHints?.width ?? "100%",
        height: rest.renderHints?.height ?? "6rem",
        radius: rest.renderHints?.radius ?? "var(--radius-3)",
        rows: rest.renderHints?.rows,
    }}
>
    <!-- Scroll viewport 必须可聚焦，才能通过方向键与 PageUp/PageDown 操作。 -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        bind:this={viewport}
        class="snowui-scroll-area-viewport snowui-overlay-scrollbar-viewport"
        data-scroll-axis={axis}
        role="region"
        aria-label={ariaLabel}
        tabindex="0"
        {onscroll}
    >
        {@render children?.()}
    </div>

    {#if axis === "vertical" || axis === "both"}
        <div
            bind:this={verticalTrack}
            class="snowui-scroll-area-scrollbar snowui-overlay-scrollbar"
            data-axis="vertical"
            data-visible={verticalScrollbar.hasOverflow ? "true" : undefined}
            aria-hidden="true"
        >
            <div
                use:syncVerticalThumb
                class="snowui-overlay-scrollbar-thumb"
            ></div>
        </div>
    {/if}

    {#if axis === "horizontal" || axis === "both"}
        <div
            bind:this={horizontalTrack}
            class="snowui-scroll-area-scrollbar snowui-overlay-scrollbar"
            data-axis="horizontal"
            data-visible={horizontalScrollbar.hasOverflow ? "true" : undefined}
            aria-hidden="true"
        >
            <div
                use:syncHorizontalThumb
                class="snowui-overlay-scrollbar-thumb"
            ></div>
        </div>
    {/if}
</Frame>

<style>
    :global(:where(.snowui-scroll-area)) {
        position: relative;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
    }

    :global(
        :where(
            .snowui-scroll-area[data-horizontal-track-position="viewport"]
                > .snowui-scroll-area-viewport
        )
    ) {
        height: auto;
    }

    :global(:where(.snowui-scroll-area-viewport)) {
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
    }

    :global(:where(.snowui-scroll-area-viewport[data-scroll-axis="vertical"])) {
        overflow-x: hidden;
        overflow-y: auto;
    }

    :global(:where(.snowui-scroll-area-viewport[data-scroll-axis="horizontal"])) {
        overflow-x: auto;
        overflow-y: hidden;
    }

    :global(:where(.snowui-scroll-area-viewport[data-scroll-axis="both"])) {
        overflow: auto;
    }

    :global(:where(.snowui-scroll-area-scrollbar[data-axis="vertical"])) {
        top: var(--snowui-scrollbar-edge-gap);
        bottom: var(--snowui-scrollbar-edge-gap);
        z-index: 1;
    }

    :global(
        :where(
            .snowui-scroll-area[data-axis="both"]
                > .snowui-scroll-area-scrollbar[data-axis="vertical"]
        )
    ) {
        bottom: calc(
            var(--snowui-overlay-scrollbar-size) +
                var(--snowui-scrollbar-edge-gap) +
                var(--snowui-scrollbar-edge-gap)
        );
    }

    :global(:where(.snowui-scroll-area-scrollbar[data-axis="horizontal"])) {
        z-index: 1;
    }

</style>
