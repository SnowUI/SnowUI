<!-- SnowUI source notice | LICENSE 2.3.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  Breadcrumb 组件：页面层级路径导航容器
  v1.2.0

  职责：
  - 默认 items 生成真实 Button／分隔 Text；显式 children 替代默认内容。
  - 识别直系 data-as="item" / data-as="separator" 子级。
  - 将最后一个 item 标记为当前页，并让当前页不可 hover / 点击 / 聚焦。

  文档: ./Breadcrumb.md
-->

<script lang="ts">
    import {contentLineGap} from "../logic/content-line";
    import { useLocale } from "../i18n/locale.svelte";
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import { setContext, type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Button from "./Button.svelte";
    import Text from "./Text.svelte";
    import type { ComponentPartsOf } from "../logic/component-parts.svelte";
    import ComponentPartsBoundary from "../logic/ComponentPartsBoundary.svelte";
    import {
        BREADCRUMB_CONTEXT_KEY,
        BUTTON_COLLECTION_CONTEXT_KEY,
        type BreadcrumbContext,
        type BreadcrumbVariant,
    } from "../context";

    export interface BreadcrumbItem {
        label: string;
        href?: string;
        disabled?: boolean;
    }

    const localeContext = useLocale();

    interface Props extends Omit<FrameProps, "children"> {
        ariaLabel?: string;
        gap?: number;
        variant?: BreadcrumbVariant;
        children?: Snippet;
        items?: BreadcrumbItem[];
        separator?: string;
        parts?: ComponentPartsOf<{ Button: typeof Button; Text: typeof Text }>;
        [key: string]: any;
    }

    let {
        ariaLabel = undefined,
        gap = undefined,
        variant = "borderless",
        children,
        items = [],
        separator = "/",
        parts = undefined,
        enableResponsive = false,
        enableContext = true,
        enableScaleObserver = false,
        class: userClass = "",
        style: userStyle = "",
        use: userActions = [],
        ...rest
    }: Props = $props();

    const rootStyle = $derived([
        gap !== undefined ? `--snowui-breadcrumb-row-gap-override: ${contentLineGap(gap)}; --snowui-breadcrumb-column-gap-override: ${contentLineGap(gap)}` : "",
        userStyle,
    ].filter(Boolean).join("; ") || undefined);

    setContext<BreadcrumbContext>(BREADCRUMB_CONTEXT_KEY, {
        present: true,
        get variant() {
            return variant;
        },
    });
    setContext(BUTTON_COLLECTION_CONTEXT_KEY, { scaleOnHover: false });

    type ManagedSnapshot = {
        ariaCurrent: string | null;
        dataCurrent: string | null;
        tabIndexAttr: string | null;
        ariaHidden: string | null;
        buttonOpacity: string;
    };

    const managedSnapshots = new WeakMap<HTMLElement, ManagedSnapshot>();
    const inactiveOpacityValue =
        "var(--snowui-breadcrumb-inactive-opacity-override, var(--snowui-breadcrumb-inactive-opacity, 0.4))";
    const inactiveHoverOpacityValue =
        "var(--snowui-breadcrumb-inactive-hover-opacity-override, var(--snowui-breadcrumb-inactive-hover-opacity, 1))";

    function snapshotElement(element: HTMLElement) {
        if (managedSnapshots.has(element)) return;
        managedSnapshots.set(element, {
            ariaCurrent: element.getAttribute("aria-current"),
            dataCurrent: element.getAttribute("data-current"),
            tabIndexAttr: element.getAttribute("tabindex"),
            ariaHidden: element.getAttribute("aria-hidden"),
            buttonOpacity: element.style.getPropertyValue(
                "--snowui-button-opacity",
            ),
        });
    }

    function restoreElement(element: HTMLElement) {
        const snapshot = managedSnapshots.get(element);
        if (!snapshot) return;

        restoreAttribute(element, "aria-current", snapshot.ariaCurrent);
        restoreAttribute(element, "data-current", snapshot.dataCurrent);
        restoreAttribute(element, "tabindex", snapshot.tabIndexAttr);
        restoreAttribute(element, "aria-hidden", snapshot.ariaHidden);
        if (snapshot.buttonOpacity) {
            element.style.setProperty("--snowui-button-opacity", snapshot.buttonOpacity);
        } else {
            element.style.removeProperty("--snowui-button-opacity");
        }
        element.classList.remove("snowui-breadcrumb-item");
        element.classList.remove("snowui-breadcrumb-current");
        element.classList.remove("snowui-breadcrumb-separator");
        managedSnapshots.delete(element);
    }

    function restoreAttribute(
        element: HTMLElement,
        name: string,
        value: string | null,
    ) {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
    }

    function getRoleChildren(node: HTMLElement, role: "item" | "separator") {
        return Array.from(node.children).filter(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && child.dataset.as === role,
        );
    }

    function syncBreadcrumbChildren(node: HTMLElement) {
        const directChildren = Array.from(node.children).filter(
            (child): child is HTMLElement => child instanceof HTMLElement,
        );
        const items = getRoleChildren(node, "item");
        const separators = getRoleChildren(node, "separator");
        const currentItem = items[items.length - 1];
        const roleChildren = new Set<HTMLElement>([...items, ...separators]);

        for (const child of directChildren) {
            if (!roleChildren.has(child) && managedSnapshots.has(child)) {
                restoreElement(child);
            }
        }

        for (const item of items) {
            snapshotElement(item);
            item.classList.add("snowui-breadcrumb-item");
            item.classList.remove("snowui-breadcrumb-separator");
            if (item === currentItem) {
                item.classList.add("snowui-breadcrumb-current");
                item.setAttribute("aria-current", "page");
                item.setAttribute("data-current", "page");
                item.setAttribute("tabindex", "-1");
                item.style.setProperty("--snowui-button-opacity", "1");
            } else {
                const snapshot = managedSnapshots.get(item);
                item.classList.remove("snowui-breadcrumb-current");
                restoreAttribute(item, "aria-current", snapshot?.ariaCurrent ?? null);
                restoreAttribute(item, "data-current", snapshot?.dataCurrent ?? null);
                restoreAttribute(item, "tabindex", snapshot?.tabIndexAttr ?? null);
                item.style.setProperty("--snowui-button-opacity", inactiveOpacityValue);
            }
        }

        for (const separator of separators) {
            snapshotElement(separator);
            separator.classList.add("snowui-breadcrumb-separator");
            separator.classList.remove("snowui-breadcrumb-item");
            separator.setAttribute("aria-hidden", "true");
        }
    }

    function breadcrumbChildren(node: HTMLElement) {
        const onClickCapture = (event: MouseEvent) => {
            stopCurrentItemEvent(event);
        };
        const onKeydownCapture = (event: KeyboardEvent) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            stopCurrentItemEvent(event);
        };
        const onMouseOver = (event: MouseEvent) => {
            const item = getInactiveItemTarget(event);
            item?.style.setProperty(
                "--snowui-button-opacity",
                inactiveHoverOpacityValue,
            );
        };
        const onMouseOut = (event: MouseEvent) => {
            const item = getInactiveItemTarget(event);
            if (!item) return;
            if (
                event.relatedTarget instanceof Node &&
                item.contains(event.relatedTarget)
            ) {
                return;
            }
            item.style.setProperty("--snowui-button-opacity", inactiveOpacityValue);
        };

        syncBreadcrumbChildren(node);
        const observer = new MutationObserver(() => syncBreadcrumbChildren(node));
        observer.observe(node, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ["data-as"],
        });
        node.addEventListener("click", onClickCapture, { capture: true });
        node.addEventListener("keydown", onKeydownCapture, { capture: true });
        node.addEventListener("mouseover", onMouseOver);
        node.addEventListener("mouseout", onMouseOut);

        return {
            destroy() {
                observer.disconnect();
                node.removeEventListener("click", onClickCapture, { capture: true });
                node.removeEventListener("keydown", onKeydownCapture, {
                    capture: true,
                });
                node.removeEventListener("mouseover", onMouseOver);
                node.removeEventListener("mouseout", onMouseOut);
                for (const child of Array.from(node.children)) {
                    if (child instanceof HTMLElement) restoreElement(child);
                }
            },
        };
    }

    function isCurrentItemTarget(event: Event) {
        if (!(event.target instanceof HTMLElement)) return false;
        const current = event.target.closest(".snowui-breadcrumb-current");
        return current instanceof HTMLElement;
    }

    function getInactiveItemTarget(event: Event) {
        if (!(event.target instanceof HTMLElement)) return null;
        const item = event.target.closest(".snowui-breadcrumb-item");
        if (!(item instanceof HTMLElement)) return null;
        if (item.classList.contains("snowui-breadcrumb-current")) return null;
        return item;
    }

    function stopCurrentItemEvent(event: Event) {
        if (!isCurrentItemTarget(event)) return;
        event.preventDefault();
        event.stopPropagation();
    }

    const finalUse = $derived.by(() => {
        const normalized = Array.isArray(userActions) ? userActions : [];
        return [breadcrumbChildren, ...normalized];
    });
</script>

<Frame
    tag="nav"
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={enableScaleObserver}
    enableAutoLayout={false}
    aria-label={ariaLabel ?? localeContext.t("breadcrumb.navigation")}
    class={["snowui-breadcrumb", userClass].filter(Boolean).join(" ")}
    style={rootStyle}
    use={finalUse}
    componentParts={parts}
    {...rest}
    renderHints={{
        variant: rest.renderHints?.variant ?? "line",
        width: rest.renderHints?.width ?? "5rem",
        height: rest.renderHints?.height ?? "1rem",
        radius: rest.renderHints?.radius,
        rows: rest.renderHints?.rows,
    }}
>
    {#if children}
        <ComponentPartsBoundary>{@render children()}</ComponentPartsBoundary>
    {:else}
        {#each items as item, index (`${item.href ?? "current"}:${item.label}:${index}`)}
            {#if index > 0}<Text as="separator">{separator}</Text>{/if}
            <Button as="item" href={item.href} disabled={item.disabled}>{item.label}</Button>
        {/each}
    {/if}
</Frame>

<style>
    :global(:where(.snowui-breadcrumb)) {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        row-gap: max(4px, var(--snowui-breadcrumb-row-gap-override, var(--snowui-breadcrumb-row-gap, var(--gap-1))));
        column-gap: max(4px, var(--snowui-breadcrumb-column-gap-override, var(--snowui-breadcrumb-column-gap, var(--gap-1))));
        box-sizing: border-box;
        max-width: 100%;
    }

    :global(:where(.snowui-breadcrumb-item)) {
        --snowui-frame-component-transition:
            opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            --snowui-hover-overlay-opacity var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    :global(:where(.snowui-breadcrumb-item:not(.snowui-breadcrumb-current))) {
        opacity: var(
            --snowui-breadcrumb-inactive-opacity-override,
            var(--snowui-breadcrumb-inactive-opacity, 0.4)
        );
    }

    :global(:where(.snowui-breadcrumb-item:not(.snowui-breadcrumb-current):hover:not(.snowui-disabled):not(:disabled))) {
        opacity: var(
            --snowui-breadcrumb-inactive-hover-opacity-override,
            var(--snowui-breadcrumb-inactive-hover-opacity, 1)
        );
    }

    :global(:where(.snowui-breadcrumb-current)) {
        opacity: 1;
    }

    :global(:where(.snowui-breadcrumb-separator)) {
        opacity: 0.5;
        color: var(
            --snowui-breadcrumb-separator-color-override,
            var(--snowui-breadcrumb-separator-color, var(--black-10, rgba(0, 0, 0, 0.1)))
        );
        font-size: var(
            --snowui-breadcrumb-separator-font-size-override,
            var(--snowui-breadcrumb-separator-font-size, var(--text-14))
        );
        line-height: var(
            --snowui-breadcrumb-separator-line-height-override,
            var(--snowui-breadcrumb-separator-line-height, var(--leading-14))
        );
        user-select: none;
        pointer-events: none;
    }
</style>
