<!--
 Image 图片组件
  v1.4.0
-->

<script lang="ts">
    import { setContext, type Component, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Skeleton from "./Skeleton.svelte";
    import {
        IMAGE_CONTEXT_KEY,
        getImageGroup,
        getSizeContext,
        getSize,
        type ResourceSize as BaseResourceSize,
    } from "../context";
    import {
        getImageViewerPresenceEventName,
        hasImageViewer,
        openImageMediaInNewWindow,
        openImagePreview,
        type PreviewMode,
    } from "../logic/image-preview";

    type ImageSize = BaseResourceSize | 56 | 64 | 72;

    interface Props extends FrameProps {
        src?: string | Component;
        size?: ImageSize;
        alt?: string;
        previewMode?: PreviewMode;
        onOpen?: (event?: MouseEvent | KeyboardEvent) => void;
        badgePosition?: "top" | "bottom";
        children?: Snippet;
        [key: string]: any;
    }

    let {
        src = undefined,
        size = undefined,
        alt = undefined,
        previewMode = undefined,
        onOpen = undefined,
        badgePosition = "top",
        disabled = false,
        tabindex = undefined,
        role = undefined,
        "aria-label": ariaLabel = undefined,
        onclick: userOnClick,
        onkeydown: userOnKeyDown,
        onmouseenter: userOnMouseEnter,
        onmouseleave: userOnMouseLeave,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        children,
        ...rest
    }: Props = $props();

    // 过滤掉已移除的 Props 和组件内部逻辑 Props，避免透传到 DOM
    // 对齐 Avatar / Frame 的过滤规范
    const cleanRest = $derived.by(() => {
        const {
            alt: _alt,
            previewMode: _previewMode,
            onOpen: _oo,
            badgePosition: _bp,
            variant: _variant,
            ...forwardedProps
        } = rest as Record<string, any>;
        return forwardedProps;
    });

    getSize();
    const sizeCtx = getSizeContext();
    const imageGroupCtx = getImageGroup();

    const contextSize = $derived(
        imageGroupCtx?.size !== undefined ? imageGroupCtx.size : sizeCtx?.size,
    );

    const DEFAULT_SIZE_VAL: ImageSize = 16;
    const sizeMap: Record<ImageSize, string> = {
        12: "var(--size-3)",
        16: "var(--size-4)",
        20: "var(--size-5)",
        24: "var(--size-6)",
        28: "var(--size-7)",
        32: "var(--size-8)",
        40: "var(--size-10)",
        48: "var(--size-12)",
        56: "var(--size-14)",
        64: "var(--size-16)",
        72: "var(--size-18)",
        80: "var(--size-20)",
    };

    const resolvedSize = $derived(size ?? contextSize ?? DEFAULT_SIZE_VAL);
    const videoPattern = /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i;
    const isStringVideo = $derived(
        typeof src === "string" ? videoPattern.test(src) : false,
    );
    const resolvedSizeToken = $derived.by(() => {
        if (typeof resolvedSize === "number") {
            return sizeMap[resolvedSize as ImageSize]
                ? sizeMap[resolvedSize as ImageSize]
                : `calc(var(--size-4) * ${resolvedSize} / 16)`;
        }
        return sizeMap[DEFAULT_SIZE_VAL];
    });
    const radiusMap: Record<ImageSize, string> = {
        12: "var(--radius-1)",
        16: "var(--radius-1)",
        20: "var(--radius-1)",
        24: "var(--radius-2)",
        28: "var(--radius-2)",
        32: "var(--radius-2)",
        40: "var(--radius-3)",
        48: "var(--radius-3)",
        56: "var(--radius-4)",
        64: "var(--radius-5)",
        72: "var(--radius-5)",
        80: "var(--radius-5)",
    };
    const resolvedRadiusToken = $derived.by(() => {
        if (
            typeof resolvedSize === "number" &&
            radiusMap[resolvedSize as ImageSize]
        ) {
            return radiusMap[resolvedSize as ImageSize];
        }
        return radiusMap[DEFAULT_SIZE_VAL];
    });

    const DEFAULT_SIZE_TOKEN = sizeMap[DEFAULT_SIZE_VAL];
    const DEFAULT_RADIUS_TOKEN = radiusMap[DEFAULT_SIZE_VAL];
    const rootStyle = $derived.by(() => {
        const styles = [
            resolvedSizeToken !== DEFAULT_SIZE_TOKEN
                ? `--snowui-image-size-default: ${resolvedSizeToken}`
                : "",
            resolvedRadiusToken !== DEFAULT_RADIUS_TOKEN
                ? `--snowui-image-radius-default: ${resolvedRadiusToken}`
                : "",
            userStyle,
        ]
            .filter(Boolean)
            .join("; ");
        return styles || undefined;
    });

    let imageStatus = $state<"idle" | "loading" | "loaded" | "error">("idle");
    let videoRef = $state<HTMLVideoElement>();
    let viewerAvailable = $state(false);
    let previewRegistration: {
        dispose: () => void;
        getIndex: () => number;
    } | null = null;

    $effect(() => {
        if (typeof window === "undefined") return;
        viewerAvailable = hasImageViewer();

        const handlePresence = (
            event: Event,
        ) => {
            const detail = (event as CustomEvent<{ active?: boolean }>).detail;
            viewerAvailable = detail?.active ?? hasImageViewer();
        };

        window.addEventListener(
            getImageViewerPresenceEventName(),
            handlePresence,
        );
        return () => {
            window.removeEventListener(
                getImageViewerPresenceEventName(),
                handlePresence,
            );
        };
    });

    $effect(() => {
        previewRegistration?.dispose();
        previewRegistration = null;
        if (!imageGroupCtx?.registerPreviewItem || !src) return;
        previewRegistration = imageGroupCtx.registerPreviewItem({
            src,
            alt,
        });
        return () => {
            previewRegistration?.dispose();
            previewRegistration = null;
        };
    });

    $effect(() => {
        if (!src) {
            imageStatus = "error";
            return;
        }

        if (typeof src !== "string") {
            imageStatus = "loaded";
            return;
        }

        imageStatus = "loading";
    });

    const resolvedPreviewMode = $derived.by(() => {
        return (
            previewMode ??
            imageGroupCtx?.previewMode ??
            (viewerAvailable ? "viewer" : "window")
        );
    });
    const canRenderMedia = $derived(!!src && imageStatus !== "error");
    const hasLoadedMedia = $derived(imageStatus === "loaded" && !!src);
    const showLoadingSkeleton = $derived(
        typeof src === "string" && imageStatus === "loading",
    );
    const canOpenInViewer = $derived(
        resolvedPreviewMode === "viewer" && viewerAvailable,
    );
    const canOpenInWindow = $derived(
        resolvedPreviewMode === "window" && typeof src === "string",
    );
    const resolvedCanOpen = $derived(
        !!src && !disabled && (!!onOpen || canOpenInViewer || canOpenInWindow),
    );
    /* resolvedInteractive 表达"有点击交互意图",用于决定是否挂 .snowui-media-hoverable
       (cursor + hover 反馈)。
       默认 previewMode="window" → 用户期望"图片可被点击"(即使 src 是 Component 不能真在新窗口
       打开,UI 视觉上也应表达可交互);
       previewMode="none" 且无 onclick → 显式 opt-out,无 hover、无 cursor。
       实际是否能"打开"由 resolvedCanOpen 决定,与本变量分离。 */
    const resolvedInteractive = $derived(
        !!src && !disabled && (resolvedPreviewMode !== "none" || !!userOnClick),
    );
    const resolvedTabindex = $derived(
        resolvedInteractive ? (tabindex ?? 0) : tabindex,
    );
    const resolvedRole = $derived(
        resolvedInteractive ? (role ?? "button") : role,
    );
    const resolvedAriaLabel = $derived(
        ariaLabel ??
            alt ??
            (resolvedCanOpen ? "Open image preview" : undefined),
    );
    const imageRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? resolvedSizeToken,
        height: userRenderHints?.height ?? resolvedSizeToken,
        radius: userRenderHints?.radius ?? resolvedRadiusToken,
    });

    function openFromPreviewIntent(event?: MouseEvent | KeyboardEvent) {
        if (!src) return;
        if (onOpen) {
            onOpen(event);
            return;
        }

        if (resolvedPreviewMode === "none") {
            return;
        }

        if (resolvedPreviewMode === "window") {
            openImageMediaInNewWindow(src);
            return;
        }

        if (resolvedPreviewMode !== "viewer" || !hasImageViewer()) {
            return;
        }

        const previewIndex = previewRegistration?.getIndex?.() ?? -1;
        const previewItems = imageGroupCtx?.getPreviewItems?.() ?? [];
        if (previewIndex >= 0 && previewItems.length > 0) {
            openImagePreview(previewItems, previewIndex);
            return;
        }

        openImagePreview(
            [
                {
                    src,
                    alt,
                },
            ],
            0,
        );
    }

    function handleClick(event: MouseEvent) {
        userOnClick?.(event);
        if (event.defaultPrevented) return;
        if (!resolvedCanOpen) return;
        openFromPreviewIntent(event);
    }

    function handleKeyDown(event: KeyboardEvent) {
        userOnKeyDown?.(event);
        if (event.defaultPrevented) return;
        if (!resolvedCanOpen) return;
        const isSpace = event.key === " " || event.code === "Space";
        const isEnter = event.key === "Enter";
        if (!isSpace && !isEnter) return;
        event.preventDefault();
        openFromPreviewIntent(event);
    }

    function handleMouseEnter(event: MouseEvent) {
        userOnMouseEnter?.(event);
        if (disabled || !isStringVideo || !videoRef) return;
        void videoRef.play().catch(() => {});
    }

    function handleMouseLeave(event: MouseEvent) {
        userOnMouseLeave?.(event);
        if (disabled || !isStringVideo || !videoRef) return;
        videoRef.pause();
        videoRef.currentTime = 0;
    }

    function handleStringMediaError() {
        imageStatus = "error";
    }

    function handleStringImageLoad() {
        imageStatus = "loaded";
    }

    function handleStringVideoLoad() {
        imageStatus = "loaded";
    }

    setContext(IMAGE_CONTEXT_KEY, {
        get badgeStyle() {
            return "--pin-offset: var(--padding-1); z-index: 3;";
        },
        get badgeAs() {
            return badgePosition === "bottom"
                ? "pin-bottom-right"
                : "pin-top-right";
        },
        get iconStyle() {
            return "z-index: 2;";
        },
        get iconAs() {
            return "pin-center";
        },
    });
</script>

<Frame
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    class={[
        "snowui-image",
        "snowui-rounded-rectangle",
        resolvedInteractive ? "snowui-media-hoverable" : "",
        resolvedInteractive && hasLoadedMedia ? "snowui-media-hoverable-has-visual" : "",
        hasLoadedMedia ? "snowui-image-has-media" : "",
        resolvedInteractive ? "snowui-image-openable" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    style={rootStyle}
    renderHints={imageRenderHints}
    {disabled}
    tabindex={resolvedTabindex}
    role={resolvedRole}
    aria-label={resolvedAriaLabel}
    data-snowui-image-viewer-mode={previewMode}
    onclick={handleClick}
    onkeydown={handleKeyDown}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    {...cleanRest}
>
    {#snippet children()}
        <div class="snowui-image-container">
            <div class="snowui-image-background snowui-media-hoverable-background" aria-hidden="true"></div>
            {#if canRenderMedia}
                <div
                    class={[
                        "snowui-image-visual",
                        "snowui-media-hoverable-visual",
                        showLoadingSkeleton
                            ? "snowui-image-visual-loading"
                            : "",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                >
                    {#if typeof src === "string"}
                        {#if isStringVideo}
                            <video
                                bind:this={videoRef}
                                {src}
                                class="snowui-image-media"
                                aria-label={alt ?? undefined}
                                muted
                                playsinline
                                preload="metadata"
                                loop
                                onloadeddata={handleStringVideoLoad}
                                onloadedmetadata={handleStringVideoLoad}
                                onerror={handleStringMediaError}
                            ></video>
                        {:else}
                            <img
                                {src}
                                alt={alt ?? ""}
                                class="snowui-image-media"
                                loading="lazy"
                                onload={handleStringImageLoad}
                                onerror={handleStringMediaError}
                            />
                        {/if}
                    {:else}
                        <!-- svelte-ignore svelte_component_deprecated -->
                        <svelte:component
                            this={src}
                            width="100%"
                            height="100%"
                            {alt}
                            class="snowui-image-media"
                        />
                    {/if}
                </div>
            {/if}
            {#if showLoadingSkeleton}
                <div class="snowui-image-loading-layer" aria-hidden="true">
                    <Skeleton
                        componentClass="snowui-image"
                        renderHints={imageRenderHints}
                    />
                </div>
            {/if}
        </div>
        {#if children}
            {@render children({})}
        {/if}
    {/snippet}
</Frame>

<style>
    :global(:where(.snowui-image)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: visible;
        flex-shrink: 0;
        box-sizing: border-box;
        user-select: none;
        border-radius: var(
            --snowui-image-radius-override,
            var(--snowui-image-radius-default, var(--radius-1))
        );
        background-color: transparent;
        --snowui-image-size-default: var(--size-4);
        --snowui-image-radius-default: var(--radius-1);
        width: var(
            --snowui-image-size-override,
            var(--snowui-image-size-default)
        );
        height: var(
            --snowui-image-size-override,
            var(--snowui-image-size-default)
        );
    }

    :global(:where(.snowui-image-container)) {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        corner-shape: inherit;
        overflow: hidden;
        isolation: isolate;
    }

    :global(:where(.snowui-image-background)) {
        position: absolute;
        inset: 0;
        background-color: var(--black-4, #0000000a);
        border-radius: inherit;
        corner-shape: inherit;
        z-index: 0;
        /* filter / transition 由 .snowui-media-hoverable-background 工具类提供 */
    }

    :global(
            :where(.snowui-image.snowui-image-has-media)
                .snowui-image-background
        ) {
        opacity: 0;
        background-color: transparent;
    }

    :global(:where(.snowui-image-visual)) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
        /* filter / transition 由 .snowui-media-hoverable-visual 工具类提供(仅有图态生效) */
    }

    :global(:where(.snowui-image-visual-loading)) {
        opacity: 0;
    }

    :global(:where(.snowui-image-media)) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
        corner-shape: inherit;
        display: block;
    }

    :global(:where(.snowui-image-loading-layer)) {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: block;
        border-radius: inherit;
        corner-shape: inherit;
        overflow: hidden;
        pointer-events: none;
    }

    /* hover 反馈全部由 .snowui-media-hoverable 工具类家族接管:
       - hasLoadedMedia → 根挂 .snowui-media-hoverable-has-visual → visual 层 brightness 压暗
       - 空 fallback → 根无标志 → background 层 background-color 加深
       详见 components/src/styles/layout.css §"Media Hoverable 工具类"。 */

    /* Image 的设计不显示焦点外环；由组件自身确权，不依赖应用级 focus reset。 */
    :global(:where(.snowui-image:focus-visible)) {
        outline: none;
        box-shadow: none;
    }
</style>
