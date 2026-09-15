<!--
 ImageViewer 图片预览组件
  ImageViewer 图片预览组件
  v1.4.1
-->

<script lang="ts">
    import { setContext, type Component, type Snippet } from "svelte";
    import {
        Button,
        Frame,
        Skeleton,
        type FrameProps,
    } from "@snowui-design-system/components";
    import { IMAGE_VIEWER_CONTEXT_KEY } from "@snowui-design-system/components/context";
    import type { ComponentPartsOf } from "@snowui-design-system/components/logic/component-parts.svelte";
    import {
        getElementPreviewMode,
        getImagePreviewOpenEventName,
        registerImageViewer,
        markImageViewerClosed,
        openImageMediaInNewWindow,
        resolveDomImagePreviewRequest,
        resolvePreviewImageElement,
    } from "@snowui-design-system/components/logic/image-preview";
    import { ComponentIcon } from "@snowui-design-system/components/internal/component-icon";

    import type { BackdropVariant } from "@snowui-design-system/components/lib/backdrop";

    interface ImageViewerItem {
        src?: string | Component;
        alt?: string;
    }

    interface Props extends FrameProps {
        open?: boolean;
        items?: ImageViewerItem[];
        index?: number;
        dismissMode?: "button" | "backdrop";
        backdrop?: BackdropVariant;
        children?: Snippet;
        parts?: ComponentPartsOf<{ Button: typeof Button }>;
        [key: string]: any;
    }

    let {
        open = undefined,
        items = undefined,
        index = undefined,
        dismissMode = "backdrop",
        backdrop = "opaque",
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        enableResponsive = true,
        enableContext = true,
        enableScaleObserver = false,
        children,
        parts = undefined,
        ...rest
    }: Props = $props();

    const builtInButtonProps = $derived({
        size: "md" as const,
        variant: "gray" as const,
        backgroundBlur: true,
        ...parts?.Button,
    });

    const isAutoMode = $derived(
        items === undefined && open === undefined && index === undefined,
    );
    let autoOpen = $state(false);
    let autoItems = $state<ImageViewerItem[]>([]);
    let autoIndex = $state(0);
    let manualOpen = $state(false);
    let manualIndex = $state(0);
    const resolvedItems = $derived(isAutoMode ? autoItems : (items ?? []));
    const resolvedOpen = $derived(isAutoMode ? autoOpen : manualOpen);
    const resolvedIndex = $derived(isAutoMode ? autoIndex : manualIndex);
    const itemCount = $derived(resolvedItems.length);

    const clampedIndex = $derived.by(() => {
        if (itemCount <= 0) return 0;
        return Math.min(Math.max(resolvedIndex, 0), itemCount - 1);
    });
    const currentItem = $derived(resolvedItems[clampedIndex]);
    const videoPattern = /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i;
    const currentItemIsVideo = $derived(
        typeof currentItem?.src === "string"
            ? videoPattern.test(currentItem.src)
            : false,
    );

    let mediaError = $state(false);
    let mediaLoading = $state(false);
    let unregisterViewer: (() => void) | null = null;
    let prefetchedUrls = new Set<string>();
    let controlsEl = $state<HTMLElement | null>(null);
    let viewerHostEl = $state<HTMLElement | undefined>(undefined);
    let isServiceOwner = $state(false);

    $effect(() => {
        if (!isAutoMode) {
            autoOpen = false;
            autoItems = [];
            autoIndex = 0;
            prefetchedUrls = new Set();
            unregisterViewer?.();
            unregisterViewer = null;
            return;
        }

        const handleOpen = (event: Event) => {
            if (!isServiceOwner) return;
            const detail = (
                event as CustomEvent<{
                    items: ImageViewerItem[];
                    index: number;
                }>
            ).detail;
            if (!detail?.items?.length) return;
            autoItems = detail.items;
            autoIndex = Math.min(
                Math.max(detail.index ?? 0, 0),
                detail.items.length - 1,
            );
            prefetchedUrls = new Set();
            autoOpen = true;
        };

        const handleDomImageClick = (event: MouseEvent) => {
            if (!isServiceOwner) return;
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (target.closest(".snowui-image-viewer")) return;
            if (target.closest(".snowui-image")) return;

            const image = resolvePreviewImageElement(target);
            if (!image) return;

            const previewMode = getElementPreviewMode(image);
            if (!previewMode || previewMode === "none") return;

            if (previewMode === "window") {
                const src = image.currentSrc || image.getAttribute("src");
                if (!src) return;
                event.preventDefault();
                openImageMediaInNewWindow(src);
                return;
            }

            const request = resolveDomImagePreviewRequest(target);
            if (!request) return;
            event.preventDefault();
            autoItems = request.items;
            autoIndex = request.index;
            prefetchedUrls = new Set();
            autoOpen = true;
        };

        unregisterViewer = registerImageViewer((owner) => {
            isServiceOwner = owner;
            if (!owner) autoOpen = false;
        });
        window.addEventListener(getImagePreviewOpenEventName(), handleOpen);
        window.addEventListener("click", handleDomImageClick, true);

        return () => {
            window.removeEventListener(
                getImagePreviewOpenEventName(),
                handleOpen,
            );
            window.removeEventListener("click", handleDomImageClick, true);
            unregisterViewer?.();
            unregisterViewer = null;
        };
    });

    $effect(() => {
        if (isAutoMode) {
            manualOpen = false;
            manualIndex = 0;
            return;
        }
        manualOpen = open ?? false;
        manualIndex = index ?? 0;
    });

    $effect(() => {
        currentItem;
        mediaError = false;
        mediaLoading =
            resolvedOpen &&
            !!currentItem?.src &&
            typeof currentItem.src === "string";
    });

    $effect(() => {
        if (!resolvedOpen || itemCount <= 1 || typeof window === "undefined") {
            return;
        }
        const preloadImageAt = (targetIndex: number) => {
            const item = resolvedItems[targetIndex];
            if (!item?.src || typeof item.src !== "string") return;
            if (
                videoPattern.test(item.src) ||
                typeof window.Image === "undefined" ||
                prefetchedUrls.has(item.src)
            ) {
                return;
            }
            prefetchedUrls.add(item.src);
            const loader = new window.Image();
            loader.src = item.src;
        };

        if (clampedIndex > 0) {
            preloadImageAt(clampedIndex - 1);
        }
        if (clampedIndex < itemCount - 1) {
            preloadImageAt(clampedIndex + 1);
        }
    });

    function showPrev() {
        if (itemCount <= 1) return;
        if (clampedIndex <= 0) return;
        const nextIndex = clampedIndex - 1;
        if (isAutoMode) {
            autoIndex = nextIndex;
            return;
        }
        manualIndex = nextIndex;
    }

    function showNext() {
        if (itemCount <= 1) return;
        if (clampedIndex >= itemCount - 1) return;
        const nextIndex = clampedIndex + 1;
        if (isAutoMode) {
            autoIndex = nextIndex;
            return;
        }
        manualIndex = nextIndex;
    }

    function close() {
        if (isAutoMode) {
            markImageViewerClosed();
            autoOpen = false;
            return;
        }
        manualOpen = false;
    }

    function handleRootClick(event: MouseEvent) {
        if (dismissMode !== "backdrop") return;
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        // 仅在点中真正的图片或视频内容时才阻止关闭
        const isMedia =
            target.tagName === "IMG" ||
            target.tagName === "VIDEO" ||
            target.closest(".snowui-image-viewer-media");

        if (isMedia) return;
        if (controlsEl?.contains(target)) return;
        close();
    }

    function portalToBody(node: HTMLElement) {
        if (typeof document === "undefined") {
            return {};
        }

        document.body.appendChild(node);

        return {
            destroy() {
                node.remove();
            },
        };
    }

    $effect(() => {
        if (!resolvedOpen || !isAutoMode || typeof window === "undefined") {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close();
                return;
            }
            const isPrevKey =
                event.key === "ArrowLeft" ||
                event.key === "ArrowUp" ||
                event.key === "a" ||
                event.key === "A" ||
                event.key === "w" ||
                event.key === "W";
            if (isPrevKey) {
                event.preventDefault();
                showPrev();
                return;
            }
            const isNextKey =
                event.key === "ArrowRight" ||
                event.key === "ArrowDown" ||
                event.key === "d" ||
                event.key === "D" ||
                event.key === "s" ||
                event.key === "S";
            if (isNextKey) {
                event.preventDefault();
                showNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });

    setContext(IMAGE_VIEWER_CONTEXT_KEY, {
        get prevStyle() {
            return itemCount > 1 && clampedIndex > 0
                ? "--pin-offset: var(--snowui-image-viewer-control-margin);"
                : "display: none";
        },
        get prevAs() {
            return "pin-left";
        },
        get nextStyle() {
            return itemCount > 1 && clampedIndex < itemCount - 1
                ? "--pin-offset: var(--snowui-image-viewer-control-margin);"
                : "display: none";
        },
        get nextAs() {
            return "pin-right";
        },
        get closeStyle() {
            return dismissMode === "button"
                ? "--pin-offset: var(--snowui-image-viewer-control-margin);"
                : "display: none";
        },
        get closeAs() {
            return "pin-bottom";
        },
        get showPrev() {
            return showPrev;
        },
        get showNext() {
            return showNext;
        },
        get close() {
            return close;
        },
    });

    function handleStringImageError() {
        mediaError = true;
        mediaLoading = false;
    }

    function handleStringImageLoad() {
        mediaLoading = false;
    }
</script>

{#if resolvedOpen && (!isAutoMode || isServiceOwner)}
    <Frame
        enableResponsive={enableResponsive}
        enableContext={enableContext}
        enableScaleObserver={enableScaleObserver}
        use={[portalToBody]}
        bind:element={viewerHostEl}
        role="dialog"
        aria-modal="true"
        data-backdrop={backdrop}
        class={["snowui-image-viewer", "snowui-backdrop", className].filter(Boolean).join(" ")}
        style={userStyle || undefined}
        onclick={handleRootClick}
        {...rest}
        renderHints={{
            variant: userRenderHints?.variant ?? "rect",
            width: userRenderHints?.width ?? "7rem",
            height: userRenderHints?.height ?? "5rem",
            radius: userRenderHints?.radius ?? "var(--radius-3)",
            rows: userRenderHints?.rows,
        }}
    >
        <div class="snowui-image-viewer-viewport">
            <div class="snowui-image-viewer-media-shell">
                <div class="snowui-image-viewer-media-hitbox">
                    {#if currentItem?.src && !mediaError}
                        {#if currentItemIsVideo && typeof currentItem.src === "string"}
                            <video
                                src={currentItem.src}
                                class="snowui-image-viewer-media"
                                aria-label={currentItem.alt ?? undefined}
                                autoplay
                                muted
                                playsinline
                                loop
                                preload="metadata"
                                onloadeddata={handleStringImageLoad}
                                onerror={handleStringImageError}
                            ></video>
                        {:else if typeof currentItem.src === "string"}
                            <img
                                src={currentItem.src}
                                alt={currentItem.alt ?? ""}
                                class="snowui-image-viewer-media"
                                onload={handleStringImageLoad}
                                onerror={handleStringImageError}
                            />
                        {:else}
                            <!-- svelte-ignore svelte_component_deprecated -->
                            <svelte:component
                                this={currentItem.src}
                                alt={currentItem.alt}
                                class="snowui-image-viewer-media"
                            />
                        {/if}
                    {:else}
                        <div
                            class="snowui-image-viewer-placeholder"
                            aria-hidden="true"
                        ></div>
                    {/if}
                    {#if mediaLoading}
                        <div class="snowui-image-viewer-skeleton-layer">
                            <Skeleton
                                componentClass="snowui-image-viewer"
                                renderHints={{
                                    variant: userRenderHints?.variant ?? "rect",
                                    width: userRenderHints?.width ?? "7rem",
                                    height: userRenderHints?.height ?? "5rem",
                                    radius: userRenderHints?.radius ?? "var(--radius-3)",
                                    rows: userRenderHints?.rows,
                                }}
                            />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        {#if children}
            <div bind:this={controlsEl} class="snowui-image-viewer-controls">
                {@render children()}
            </div>
        {:else}
            <div bind:this={controlsEl} class="snowui-image-viewer-controls">
                <Button
                    {...builtInButtonProps}
                    as="prev"
                    iconOnly
                    aria-label="上一张"
                >
                    <ComponentIcon
                        name="arrow-line-left"

                        aria-hidden="true"
                    />
                </Button>
                <Button
                    {...builtInButtonProps}
                    as="next"
                    iconOnly
                    aria-label="下一张"
                >
                    <ComponentIcon
                        name="arrow-line-right"

                        aria-hidden="true"
                    />
                </Button>
                {#if dismissMode === "button"}
                    <Button
                        {...builtInButtonProps}
                        as="close"
                        iconOnly
                        aria-label="关闭图片预览"
                    >
                        <ComponentIcon name="close" aria-hidden="true" />
                    </Button>
                {/if}
            </div>
        {/if}
    </Frame>
{/if}

<style>
    :global(:where(.snowui-image-viewer)) {
        position: fixed;
        inset: 0;
        z-index: var(
            --snowui-image-viewer-z-index-override,
            var(--snowui-image-viewer-z-index, 9999)
        );
        box-sizing: border-box;

        /* 架构级变量声明 (符合 2.10 规范) */
        --snowui-image-viewer-viewport-padding: 10vh 10vw;
        --snowui-image-viewer-control-margin: 3%;
        --snowui-image-viewer-background: var(--snowui-backdrop-background);
        --snowui-backdrop-background-override: var(--snowui-image-viewer-background-override);

    }

    :global(:where(.snowui-image-viewer-viewport)) {
        position: fixed;
        inset: var(--snowui-image-viewer-viewport-padding);
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        pointer-events: none;
    }

    :global(:where(.snowui-image-viewer-media-shell)) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: visible;
        background-color: transparent;
        pointer-events: none;
    }

    :global(:where(.snowui-image-viewer-media-hitbox)) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        position: relative;
    }

    :global(:where(.snowui-image-viewer-media)) {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        display: block;
        pointer-events: auto;
        object-fit: contain;
    }

    :global(:where(.snowui-image-viewer-placeholder)) {
        width: min(calc(var(--size-4) * 32), 100%);
        height: min(calc(var(--size-4) * 32), 100%);
        max-width: 100%;
        max-height: 100%;
        background-color: transparent;
    }

    :global(:where(.snowui-image-viewer-skeleton-layer)) {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    :global(:where(.snowui-image-viewer-controls)) {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 3;
    }

    /* 角色位置代理 (符合 8 规范) */
    :global(:where(.snowui-image-viewer-controls [class*="-role-prev"])) {
        z-index: 4;
        pointer-events: auto;
    }

    :global(:where(.snowui-image-viewer-controls [class*="-role-next"])) {
        z-index: 4;
        pointer-events: auto;
    }

    :global(:where(.snowui-image-viewer-controls [class*="-role-close"])) {
        z-index: 4;
        pointer-events: auto;
    }

</style>
