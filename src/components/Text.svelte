<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
     Text 组件：智能文本显示与截断组件 v3.5.2

 文档: ./Text.md
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { getContext, setContext, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import Tooltip from "./Tooltip.svelte";
    import { ComponentIcon } from "../internal/component-icon/index";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import { fitTextToElement } from "../lib/truncate";
    import { TextTruncation } from "../logic/frame-truncation.svelte";
    import {
        collapse,
        findConstraintHost,
    } from "../logic/text-collapse.svelte";
    import {
        FRAME_CONTEXT_KEY,
        SKELETON_CONTEXT_KEY,
        TRUNCATION_CONTEXT_KEY,
    } from "../keys";
    import type { StateValueMap } from "../logic/frame-types";
    import {
        resolveParentStateValue,
        type ParentFrameStateContext,
    } from "../logic/frame-state-value";
    import { useOverlayScrollbar } from "../lib/overlay-scrollbar.svelte";
    import { resizeManager } from "../logic/observer.svelte";

    type TooltipProp = boolean | string | Snippet | Record<string, any>;

    const isTooltipConfigObject = (
        value: TooltipProp | undefined,
    ): value is Record<string, any> => {
        return (
            typeof value === "object" &&
            value !== null &&
            typeof value !== "function"
        );
    };

    interface Props extends FrameProps {
        tag?: string;
        stateText?: StateValueMap<string | number>;
        /** 交互开关：默认 false；显式 true 时启用 Text 的 hover 动效。 */
        interactive?: boolean;
        lines?: 0 | 1 | 2 | 3;
        /** lines=0 时是否生成内置展开按钮；默认 false。 */
        more?: boolean;
        tooltip?: TooltipProp;
        onTruncate?: (isTruncated: boolean) => void;
        children?: Snippet<[any]>;
        parts?: ComponentPartsOf<{
            Button: typeof Button;
            Tooltip: typeof Tooltip;
        }>;
        [key: string]: any;
    }

    let {
        tag: tagProp = undefined,
        stateText = undefined,
        interactive = false,
        lines = undefined,
        more = false,
        tooltip: tooltipProp = undefined,
        onTruncate = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: className = "",
        style: userStyle = "",
        use: userActions = [],
        renderHints: userRenderHints = undefined,
        element = $bindable(),
        parts = undefined,
        children,
        ...rest
    }: Props = $props();

    const parentSkeletonContext = getContext<
        { loading: boolean; skeleton?: boolean } | undefined
    >(SKELETON_CONTEXT_KEY);
    const parentFrameCtx = getContext<ParentFrameStateContext | undefined>(
        FRAME_CONTEXT_KEY,
    );

    let singleLineMeasureElement = $state<HTMLElement>();
    let multiLineContentElement = $state<HTMLElement>();
    const truncationElement = $derived(
        lines === 1
            ? singleLineMeasureElement
            : lines === 2 || lines === 3
              ? multiLineContentElement
              : element,
    );
    function createTruncation() {
        return new TextTruncation(
            lines,
            () => truncationElement,
            onTruncate,
        );
    }

    function resolveInitialMoreState() {
        return more;
    }

    const truncation = createTruncation();
    let isExpanding = $state(false);
    let truncateWrapperElement = $state<HTMLElement>();
    let scrollbarElement = $state<HTMLDivElement>();
    let hasMoreButton = $state(resolveInitialMoreState());
    let showTopFade = $state(false);
    let showBottomFade = $state(false);
    const scrollMode = $derived(lines === 0 && !hasMoreButton);
    const scrollbar = useOverlayScrollbar(
        () => (scrollMode ? truncateWrapperElement : undefined),
        () => (scrollMode ? scrollbarElement : undefined),
    );

    function resolveScrollMask(showTop: boolean, showBottom: boolean) {
        if (showTop && showBottom) return "both";
        if (showTop) return "top";
        if (showBottom) return "bottom";
        return undefined;
    }

    function updateScrollFade() {
        if (!truncateWrapperElement || !scrollMode) {
            showTopFade = false;
            showBottomFade = false;
            return;
        }
        const { scrollTop, clientHeight, scrollHeight } =
            truncateWrapperElement;
        showTopFade = scrollTop > 1;
        showBottomFade =
            scrollTop + clientHeight < scrollHeight - 1;
        scrollbar.refresh();
    }

    setContext(TRUNCATION_CONTEXT_KEY, {
        get isTruncated(): boolean {
            return truncation.isTruncated;
        },
        get isCollapsed(): boolean {
            return truncation.isTruncated && !truncation.isExpanded;
        },
        get isExpanded(): boolean {
            return truncation.isExpanded;
        },
        get fullText(): string {
            return truncation.fullText;
        },
        handleExpand: () => {
            if (lines !== 0 || truncation.isExpanded || isExpanding) return 0;
            if (!element) {
                truncation.isExpanded = true;
                return 0;
            }
            return animateExpandHost(element as HTMLElement, () => {
                truncation.isExpanded = true;
                isExpanding = false;
            });
        },
        handleCollapse: () => {
            if (lines !== 0) return;
            isExpanding = false;
            truncation.isExpanded = false;
        },
    });

    $effect(() => {
        truncation.update(lines, onTruncate);
    });

    const shouldTruncate = $derived(typeof lines === "number");
    const resolvedTag = $derived(tagProp ?? (lines === 0 ? "div" : "span"));

    const INLINE_TAGS = new Set([
        "span",
        "a",
        "strong",
        "b",
        "em",
        "i",
        "small",
        "sub",
        "sup",
        "label",
        "abbr",
        "cite",
        "q",
        "time",
        "var",
        "mark",
        "code",
    ]);
    const isInlineBlockLayout = $derived(INLINE_TAGS.has(resolvedTag));

    const tooltipConfig = $derived.by(() => {
        if (isTooltipConfigObject(tooltipProp)) return tooltipProp;
        return {};
    });

    const tooltipContent = $derived.by(() => {
        if (tooltipProp === false) return undefined;

        if (typeof tooltipProp === "string") return tooltipProp;
        if (typeof tooltipProp === "function") return tooltipProp;
        if (!shouldTruncate) return undefined;

        if (tooltipProp === undefined || isTooltipConfigObject(tooltipProp)) {
            if (lines === 0) return undefined;
            return truncation.isTruncated ? truncation.fullText : undefined;
        }

        if (tooltipProp === true) {
            if (lines === 0) return truncation.fullText || undefined;
            return truncation.isTruncated ? truncation.fullText : undefined;
        }

        return undefined;
    });

    const needTooltip = $derived.by(() => {
        if (tooltipContent === undefined || tooltipContent === null)
            return false;
        if (typeof tooltipContent === "string")
            return tooltipContent.length > 0;
        return true;
    });
    const singleLineVisibleText = $derived.by(() => {
        if (!singleLineMeasureElement) return "";
        if (!truncation.isTruncated) return truncation.fullText;
        return fitTextToElement(
            truncation.fullText,
            truncation.availableWidth,
            singleLineMeasureElement,
        );
    });
    const resolvedStateText = $derived(
        resolveParentStateValue(stateText, parentFrameCtx),
    );
    const collapseMotionEnabled = $derived(truncation.shouldCollapse);
    const hoverEnabled = $derived(interactive === true);

    const showFadeMask = $derived.by(() => {
        return lines === 0 && truncation.isTruncated && !truncation.isExpanded;
    });

    const finalOuterClasses = $derived(
        [
            "snowui-text",
            resolvedTag === "li"
                ? "snowui-text-li"
                : isInlineBlockLayout
                  ? "snowui-text-inline-block"
                  : "snowui-text-block",
            collapseMotionEnabled ? "snowui-text-collapse-motion-enabled" : "",
            hoverEnabled ? "snowui-text-hover-enabled" : "",
            lines === 0 ? "snowui-truncate-container" : "",
            scrollMode ? "snowui-overlay-scrollbar-host" : "",
            lines === 0 && truncation.isTruncated && !truncation.isExpanded
                ? "snowui-truncate-collapsed"
                : "",
            lines === 1 ? "snowui-line-clamp-1" : "",
            lines === 2 || lines === 3
                ? "snowui-text-multi-line-host"
                : "",
            needTooltip && lines === 1
                ? "snowui-text-trigger-inline snowui-text-tooltip-anchor-hug"
                : "",
            needTooltip ? "snowui-text-tooltip-enabled" : "",
            className,
        ]
            .filter(Boolean)
            .join(" "),
    );

    const finalStyle = $derived.by(() => {
        const styleParts = [
            shouldTruncate && lines !== 2 && lines !== 3
                ? truncation.styleString
                : "",
            userStyle || "",
        ].filter(Boolean);
        return styleParts.join(";") || undefined;
    });
    const multiLineStyle = $derived(
        lines === 2 || lines === 3 ? truncation.styleString : undefined,
    );

    const finalUse = $derived.by(() => {
        const normalizedUse = Array.isArray(userActions) ? userActions : [];
        if (!shouldTruncate || lines === 2 || lines === 3)
            return normalizedUse;
        return [...normalizedUse, ...truncation.actions];
    });
    const inheritedLoading = $derived(parentSkeletonContext?.loading ?? false);
    const inheritedSkeleton = $derived(parentSkeletonContext?.skeleton ?? true);
    const explicitLoading = $derived(rest.loading === true);
    const explicitSkeleton = $derived(rest.skeleton);
    const shouldAnalyzeSkeleton = $derived(
        (inheritedLoading || explicitLoading) &&
            (explicitSkeleton ?? inheritedSkeleton),
    );
    const BLOCK_TEXT_TAGS = new Set([
        "P",
        "DIV",
        "LI",
        "BLOCKQUOTE",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
    ]);
    let skeletonProbe = $state<HTMLElement>();
    let skeletonRows = $state(1);

    function countSkeletonRows(node?: HTMLElement): number {
        if (!node) return 1;
        let rows = 0;
        let hasInlineText = false;

        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                if (child.textContent?.trim()) {
                    hasInlineText = true;
                }
                continue;
            }

            if (!(child instanceof HTMLElement)) continue;
            if (child.dataset.snowuiFrame === "true") continue;

            const childText = child.textContent?.trim() ?? "";
            if (!childText) continue;

            if (BLOCK_TEXT_TAGS.has(child.tagName)) {
                rows += 1;
            } else {
                hasInlineText = true;
            }
        }

        return Math.max(1, rows + (hasInlineText ? 1 : 0));
    }

    function resolveCollapseHost(root: HTMLElement) {
        const ownStyleHeight = root.style.height;
        const ownStyleMaxHeight = root.style.maxHeight;

        root.style.height = "100%";
        const host = findConstraintHost(root, "100%");
        root.style.height = ownStyleHeight;
        root.style.maxHeight = ownStyleMaxHeight;

        return host ?? root.parentElement ?? root;
    }

    function cssTimeToMs(value: string) {
        const first = value.split(",")[0]?.trim() ?? "";
        const number = Number.parseFloat(first);
        if (!Number.isFinite(number) || number <= 0) return 300;
        return first.endsWith("ms") ? number : number * 1000;
    }

    function animateExpandHost(root: HTMLElement, onComplete: () => void) {
        const host = resolveCollapseHost(root);
        const wrapper = root.querySelector(
            ":scope > .snowui-text-truncate-wrapper",
        ) as HTMLElement | null;
        if (!host || !wrapper) {
            onComplete();
            return 0;
        }

        const startHeight = host.getBoundingClientRect().height;
        const contentOverflow = Math.max(
            0,
            wrapper.scrollHeight - wrapper.clientHeight,
        );
        const targetHeight = startHeight + contentOverflow;

        if (!Number.isFinite(startHeight) || !Number.isFinite(targetHeight)) {
            onComplete();
            return 0;
        }
        if (targetHeight <= startHeight + 1) {
            onComplete();
            return 0;
        }

        const computed = getComputedStyle(root);
        const rawDuration =
            computed
                .getPropertyValue("--snowui-frame-size-motion-duration")
                .trim() || "0.3s";
        const easing =
            computed
                .getPropertyValue("--snowui-frame-size-motion-easing")
                .trim() || "ease-out";
        const durationMs = cssTimeToMs(rawDuration);
        const duration = durationMs === 300 && rawDuration === "0s" ? "0.3s" : rawDuration;
        const previous = {
            height: host.style.height,
            maxHeight: host.style.maxHeight,
            overflow: host.style.overflow,
            transition: host.style.transition,
        };

        isExpanding = true;
        host.style.overflow = "hidden";
        host.style.height = `${startHeight}px`;
        host.style.transition = [
            `height ${duration} ${easing}`,
            `max-height ${duration} ${easing}`,
        ].join(", ");

        requestAnimationFrame(() => {
            host.style.height = `${targetHeight}px`;
            host.style.maxHeight = `${targetHeight}px`;
        });

        window.setTimeout(() => {
            onComplete();
            host.style.height = "auto";
            host.style.maxHeight = previous.maxHeight;
            host.style.overflow = previous.overflow;
            host.style.transition = previous.transition;
        }, durationMs + 40);

        return durationMs + 40;
    }

    $effect(() => {
        if (lines !== 0 || !element) return;

        const root = element as HTMLElement;
        const syncMoreButton = () => {
            const wrapper = root.querySelector(
                ":scope > .snowui-text-truncate-wrapper",
            );
            const buttons = wrapper?.querySelectorAll(
                ":scope > .snowui-text-expand-button",
            );
            buttons?.forEach((button) => root.appendChild(button));
            hasMoreButton =
                root.querySelector(":scope > .snowui-text-expand-button") !==
                null;
        };

        syncMoreButton();

        const observer = new MutationObserver(syncMoreButton);
        observer.observe(root, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    });

    $effect(() => {
        more;
        const wrapper = truncateWrapperElement;
        if (!wrapper || !scrollMode) return;
        updateScrollFade();
        wrapper.addEventListener("scroll", updateScrollFade);
        const unwatch = resizeManager.watch(wrapper, updateScrollFade);
        return () => {
            wrapper.removeEventListener("scroll", updateScrollFade);
            unwatch();
        };
    });

    $effect(() => {
        if (lines !== 0 || !element || !isExpanding) return;

        const root = element as HTMLElement;
        let visibleButton: HTMLElement | undefined;
        const keepExpandButtonVisible = () => {
            const button = root.querySelector(".snowui-text-expand-button");
            if (button instanceof HTMLElement) {
                visibleButton = button;
                button.style.display = "flex";
            }
        };

        keepExpandButtonVisible();
        const timer = window.setInterval(keepExpandButtonVisible, 16);

        return () => {
            window.clearInterval(timer);
            if (visibleButton?.style.display === "flex") {
                visibleButton.style.removeProperty("display");
            }
        };
    });


    $effect(() => {
        if (!shouldAnalyzeSkeleton || !skeletonProbe) {
            skeletonRows = 1;
            return;
        }

        const updateRows = () => {
            skeletonRows = countSkeletonRows(skeletonProbe);
        };

        updateRows();

        const observer = new MutationObserver(() => {
            updateRows();
        });

        observer.observe(skeletonProbe, {
            childList: true,
            subtree: false,
            characterData: true,
        });

        return () => {
            observer.disconnect();
        };
    });
    const textRenderHints = $derived({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? "100%",
        height: userRenderHints?.height ?? "1.25rem",
        rows: userRenderHints?.rows ?? skeletonRows,
    });
</script>

{#if shouldAnalyzeSkeleton && children}
    <div bind:this={skeletonProbe} aria-hidden="true" style="display: none;">
        {@render children({ breakpoint: "md" })}
    </div>
{/if}

<Frame
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    tag={resolvedTag}
    style={finalStyle}
    use={finalUse}
    renderHints={textRenderHints}
    componentParts={parts}
    bind:element={element}
    class={finalOuterClasses}
    data-lines={shouldTruncate ? String(lines) : undefined}
    data-truncated={shouldTruncate
        ? truncation.isTruncated
            ? "true"
            : "false"
        : undefined}
    data-expanded={lines === 0
        ? truncation.isExpanded
            ? "true"
            : "false"
        : undefined}
    data-expanding={lines === 0 ? (isExpanding ? "true" : "false") : undefined}
    data-scroll-mode={scrollMode ? "true" : undefined}
    {...rest}
>
    {#snippet children({ breakpoint })}
        {#if lines === 0}
            <div
                bind:this={truncateWrapperElement}
                class={`snowui-text-truncate-wrapper snowui-scroll-mask${scrollMode ? " snowui-overlay-scrollbar-viewport" : ""}`}
                data-scroll-mask={scrollMode
                    ? resolveScrollMask(showTopFade, showBottomFade)
                    : showFadeMask
                      ? "bottom"
                      : undefined}
            >
                {#if resolvedStateText !== undefined}
                    {resolvedStateText}
                {:else if children}
                    {@render children({ breakpoint })}
                {/if}
                {#if more}
                    <Button
                        {...parts?.Button}
                        as="more"
                        iconOnly
                        aria-label="展开"
                        backgroundBlur
                        class="snowui-text-built-in-more"
                    >
                        <ComponentIcon
                            name="arrow-line-down"

                            aria-hidden="true"
                        />
                    </Button>
                {/if}
            </div>
            {#if scrollMode}
                <div
                    bind:this={scrollbarElement}
                    class="snowui-text-scrollbar snowui-overlay-scrollbar"
                    data-visible={scrollbar.hasOverflow ? "true" : undefined}
                    aria-hidden="true"
                >
                    <div
                        class="snowui-overlay-scrollbar-thumb"
                        style="height: {scrollbar.thumbHeight}px; transform: translate3d(0, {scrollbar.thumbY}px, 0);"
                    ></div>
                </div>
            {/if}
        {:else if lines === 1}
            <span class="snowui-text-single-line-label">
                <span
                    bind:this={singleLineMeasureElement}
                    class="snowui-text-single-line-measure"
                    aria-hidden="true"
                >
                    {#if resolvedStateText !== undefined}
                        {resolvedStateText}
                    {:else if children}
                        {@render children({ breakpoint })}
                    {/if}
                </span>
                <span class="snowui-text-single-line-visible">
                    {singleLineVisibleText}{#if truncation.isTruncated}<span
                            class="snowui-text-single-line-ellipsis"
                            aria-hidden="true">…</span
                        >{/if}
                </span>
            </span>
        {:else if lines === 2 || lines === 3}
            <span
                bind:this={multiLineContentElement}
                class={`snowui-text-multi-line-content snowui-line-clamp-${lines}`}
                style={multiLineStyle}
                use:collapse={truncation.collapseOptions}
            >
                {#if resolvedStateText !== undefined}
                    {resolvedStateText}
                {:else if children}
                    {@render children({ breakpoint })}
                {/if}
            </span>
        {:else if resolvedStateText !== undefined}
            {resolvedStateText}
        {:else if children}
            {@render children({ breakpoint })}
        {/if}

        {#if needTooltip}
            <Tooltip {...tooltipConfig}>
                {#if typeof tooltipContent === "string"}
                    {tooltipContent}
                {:else if typeof tooltipContent === "function"}
                    {@render tooltipContent()}
                {/if}
            </Tooltip>
        {/if}
    {/snippet}
</Frame>

<style>
    :global(:where(.snowui-text)) {
        box-sizing: border-box;
        position: relative;
        min-width: 0;
        max-width: 100%;
        --snowui-text-style-override-bridge: var(
            --snowui-text-style-override,
            initial
        );
        --snowui-text-hover-transition-default:
            transform 1000ms ease-out;
        --snowui-frame-component-transform: translate(
                calc(
                    var(--snowui-parallax-x, 0px) +
                        var(--snowui-text-hover-shift-x, 0px)
                ),
                var(--snowui-parallax-y, 0px)
            )
            scale(var(--snowui-parallax-scale, 1));
        opacity: var(
            --snowui-button-group-content-opacity,
            var(--snowui-state-opacity, var(--snowui-parallax-opacity, 1))
        );
        /* transition: transform 0.1s linear, opacity 0.1s linear; (被禁用，以免阻塞 WAAPI 动效) */
    }

    :global(:where(.snowui-text:is(p, h1, h2, h3, h4, h5, h6))) {
        overflow-wrap: break-word;
    }

    :global(:where(.snowui-text-single-line-label)) {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-text-single-line-measure)),
    :global(:where(.snowui-text-single-line-visible)) {
        grid-column: 1;
        grid-row: 1;
        min-width: 0;
        overflow: hidden;
        font-size: inherit;
        line-height: inherit;
        white-space: nowrap;
    }

    :global(:where(.snowui-text-single-line-measure)) {
        visibility: hidden;
    }

    :global(:where(.snowui-text-tooltip-enabled)) {
        cursor: var(--snowui-state-cursor, pointer);
    }

    :global(:where(.snowui-text).snowui-text-multi-line-host) {
        display: block;
    }

    :global(:where(.snowui-text-block)) {
        display: block;
    }

    :global(:where(.snowui-text-li)) {
        display: list-item;
    }

    :global(:where(.snowui-text-inline-block)) {
        display: inline-block;
        max-width: 100%;
    }

    :global(:where(.snowui-text-trigger-inline)) {
        display: inline-flex;
        min-width: 0;
        max-width: 100%;
    }

    :global(:where(.snowui-text-tooltip-anchor-hug)) {
        width: fit-content;
        max-width: 100%;
        align-self: flex-start;
    }

    :global(:where(li.snowui-text-block)) {
        display: list-item;
    }

    :global(:where(.snowui-text-collapse-motion-enabled)) {
        --snowui-text-collapse-transition-default:
            max-height 1000ms ease-out,
            min-height 1000ms ease-out,
            height 1000ms ease-out,
            var(
                --snowui-text-hover-transition-override,
                var(--snowui-text-hover-transition-default)
            );
        --snowui-text-collapse-transition: var(
            --snowui-text-collapse-transition-override,
            var(--snowui-text-collapse-transition-default)
        );
    }

    :global(:where(.snowui-text-hover-enabled)) {
        --snowui-frame-component-transition: var(
            --snowui-text-hover-transition-override,
            var(--snowui-text-hover-transition-default)
        );
    }

    :global(:where(.snowui-text-hover-enabled:hover:not(.snowui-disabled):not(:disabled))) {
        --snowui-text-hover-shift-x: 0.285em;
    }

    :global(:where(.snowui-text-truncate-wrapper)) {
        width: 100%;
        height: 100%;
    }

    :global(
            :where(
                    .snowui-truncate-container[data-lines="0"][data-expanded="false"]:not([data-scroll-mode="true"])
                )
                > .snowui-text-truncate-wrapper
        ) {
        overflow: hidden;
    }

    :global(
            :where(
                    .snowui-truncate-container[data-lines="0"][data-scroll-mode="true"]
                )
                > .snowui-text-truncate-wrapper
        ) {
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-gutter: auto;
    }

    /* lines=0 渐隐提示：接入「内容渐隐层」通用能力的 CSS 静态形态（.snowui-scroll-mask，见 lib/edge-fade.md）。 */
    :global(:where(.snowui-text-truncate-wrapper.snowui-scroll-mask)) {
        --snowui-text-mask-height: var(
            --snowui-text-mask-height-override,
            2em
        );
    }

    /* 当 Button as="more" 在 Text 内容中定义时：
       Button 会声明为 pin-bottom-right，Text 只负责层级与折叠态显隐。 */
    :global(:where(.snowui-truncate-container) .snowui-text-expand-button) {
        z-index: 3;
    }

    :global(
            :where(
                    .snowui-truncate-container:has(
                            > .snowui-text-expand-button:not(
                                    .snowui-text-built-in-more
                                )
                        )
                )
                > .snowui-text-built-in-more
        ) {
        display: none;
    }

    /* 轨道定位归 Text；视觉与交互算法复用共享 overlay scrollbar。 */
    :global(:where(.snowui-text-scrollbar)) {
        top: var(--padding-1);
        right: 0;
        bottom: var(--padding-1);
        z-index: 3;
    }

    :global(
            :where(
                    .snowui-truncate-container[data-lines="0"][data-expanding="true"]
                )
                .snowui-text-expand-button
        ) {
        display: flex;
    }

    :global(
            :where(
                    .snowui-truncate-container[data-lines="0"][data-expanded="true"]
                )
                .snowui-text-expand-button
        ),
    :global(
            :where(
                    .snowui-truncate-container[data-lines="0"][data-truncated="false"]
                )
                .snowui-text-expand-button
        ) {
        display: none;
    }

    /* 多行截断兜底：
       避免 .snowui-text-block 的 display:block 在层叠顺序上覆盖 line-clamp 所需 display:-webkit-box。 */
    :global(:where(.snowui-text-multi-line-content).snowui-line-clamp-2),
    :global(:where(.snowui-text-multi-line-content).snowui-line-clamp-3) {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        /* 行框会把 leading 平分到文字上下两侧，而字体的 ascent / descent
           又不一定视觉对称。只修剪末行下方的 half-leading，避免看起来像
           多出 padding-bottom，同时保留下沉字符所需的 text-under 空间。 */
        text-box-trim: trim-end;
        text-box-edge: text;
    }

    :global(:where(.snowui-text-multi-line-content).snowui-line-clamp-2) {
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    :global(:where(.snowui-text-multi-line-content).snowui-line-clamp-3) {
        -webkit-line-clamp: 3;
        line-clamp: 3;
    }
</style>
