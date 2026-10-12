<!-- SnowUI source notice | LICENSE 2.0.0: ../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 -->
<!--
  AvatarGroup 组件：头像组组件
  v1.8.7
-->

<script module lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    let avatarGroupInstanceSeed = 0;
</script>

<script lang="ts">
    import { type Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import Avatar from "./Avatar.svelte";
    import { getSizeContext, getSize, type ResourceSize } from "../context";
    import { resizeManager } from "../logic/observer.svelte";

    type AvatarGroupLayout = "row" | "stack";
    type StackPosition = {
        item: HTMLElement;
        x: number;
        y: number;
        zIndex: number;
    };

    interface Props extends FrameProps {
        max?: number;
        layout?: AvatarGroupLayout;
        size?: ResourceSize;
        enableResponsive?: boolean;
        enableContext?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        class: className = "",
        style: userStyle = "",
        children,
        max = undefined,
        layout = "row",
        size = undefined,
        enableResponsive = true,
        enableContext = true,
        renderHints: userRenderHints = undefined,
        ...rest
    }: Props = $props();

    getSize();
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.avatarSize !== undefined ? sizeCtx.avatarSize : sizeCtx?.size,
    );
    const resolvedLayout = $derived(layout ?? "row");
    const DEFAULT_AVATAR_SIZE_VAL: ResourceSize = 16;
    // 尺寸处理逻辑
    const effectiveSize = $derived(size ?? contextSize);

    const finalGroupSize = $derived.by(() => {
        if (effectiveSize === undefined) return undefined;
        return effectiveSize;
    });

    const finalAvatarSize = $derived.by(() => {
        if (effectiveSize === undefined) return undefined;

        if (resolvedLayout === "stack") {
            const baseMax =
                typeof max === "number" ? Math.max(0, Math.floor(max)) : 3;
            const stackRatio = baseMax <= 2 ? 1.8 : baseMax === 3 ? 2 : 2.2;
            return effectiveSize / stackRatio;
        }

        return effectiveSize;
    });

    const resolvedSizeContext = $derived(finalAvatarSize);

    // 尺寸上下文由 Frame 的 size prop 提供（通过 enableContext）

    let element = $state<HTMLElement>();
    let overflowCount = $state(0);
    const avatarGroupInstanceId = `snowui-avatar-group-${++avatarGroupInstanceSeed}`;
    let stackStyleElement: HTMLStyleElement | null = null;

    const sizeMap: Record<ResourceSize, string> = {
        12: "calc(var(--size-4) * 3 / 4)",
        16: "calc(var(--size-4) * 4 / 4)",
        20: "calc(var(--size-4) * 5 / 4)",
        24: "calc(var(--size-4) * 6 / 4)",
        28: "calc(var(--size-4) * 7 / 4)",
        32: "calc(var(--size-4) * 8 / 4)",
        40: "calc(var(--size-4) * 10 / 4)",
        48: "calc(var(--size-4) * 12 / 4)",
        80: "calc(var(--size-4) * 20 / 4)",
    };

    const sizeRemMap: Record<ResourceSize, number> = {
        12: 0.75,
        16: 1,
        20: 1.25,
        24: 1.5,
        28: 1.75,
        32: 2,
        40: 2.5,
        48: 3,
        80: 5,
    };

    const stackAngles: Record<number, number[]> = {
        1: [-90],
        2: [-45, 135],
        3: [-90, 150, 30],
        4: [-45, -135, 135, 45],
    };
    const STACK_CUTOUT_BORDER_RATIO = 0.04;
    const STACK_CUTOUT_FEATHER_PX = 0.5;

    function getSizeCssValue(value?: number) {
        if (value === undefined) return "";
        const mapped = sizeMap[value as ResourceSize];
        if (mapped) return mapped;
        return `${value / 16}em`;
    }

    function getSizeRemValue(value?: number) {
        if (value === undefined) return undefined;
        const mapped = sizeRemMap[value as ResourceSize];
        if (mapped) return mapped;
        return value / 16;
    }

    // 取不受 transform 影响的布局尺寸（优先 offsetWidth）
    function getLayoutWidth(node?: HTMLElement | null) {
        if (!node) return 0;
        if (node.offsetWidth > 0) return node.offsetWidth;
        const cssWidth = parseFloat(getComputedStyle(node).width || "0");
        if (cssWidth > 0) return cssWidth;
        return node.getBoundingClientRect().width || 0;
    }

    function getLayoutHeight(node?: HTMLElement | null) {
        if (!node) return 0;
        if (node.offsetHeight > 0) return node.offsetHeight;
        const cssHeight = parseFloat(getComputedStyle(node).height || "0");
        if (cssHeight > 0) return cssHeight;
        return node.getBoundingClientRect().height || 0;
    }

    const overflowText = $derived(
        overflowCount > 99
            ? "+99"
            : overflowCount > 0
              ? `+${overflowCount}`
              : "",
    );

    const overflowBg = $derived(overflowCount > 0 ? "#EDEDED" : "");

    const itemSizeStyle = $derived.by(() => {
        if (finalAvatarSize === undefined) return "";
        const value = getSizeCssValue(finalAvatarSize);
        return value ? `--snowui-avatar-group-item-size: ${value};` : "";
    });

    const groupSizeStyle = $derived.by(() => {
        if (finalGroupSize === undefined) return "";
        const value = getSizeCssValue(finalGroupSize);
        return value ? `--snowui-avatar-group-size: ${value};` : "";
    });

    const combinedStyle = $derived.by(() => {
        const countBgStyle = overflowBg
            ? `--snowui-avatar-group-count-bg: ${overflowBg};`
            : "";
        const styles = [userStyle, itemSizeStyle, groupSizeStyle, countBgStyle]
            .filter(Boolean)
            .join("; ");
        return styles || undefined;
    });

    function ensureStackStyleElement() {
        if (typeof document === "undefined") return null;
        if (stackStyleElement?.isConnected) return stackStyleElement;

        stackStyleElement = document.createElement("style");
        stackStyleElement.dataset.snowuiAvatarGroupStyle =
            avatarGroupInstanceId;
        document.head.appendChild(stackStyleElement);
        return stackStyleElement;
    }

    function clearStackStyleRules() {
        if (stackStyleElement) {
            stackStyleElement.textContent = "";
        }
    }

    function removeStackAttributes(item: HTMLElement) {
        item.removeAttribute("data-snowui-avatar-group-id");
        item.removeAttribute("data-snowui-avatar-group-stack-index");
    }

    function clearLegacyStackInlineStyles(item: HTMLElement) {
        item.style.removeProperty("left");
        item.style.removeProperty("top");
        item.style.removeProperty("position");
        item.style.removeProperty("margin-left");
        item.style.removeProperty("mask-image");
        item.style.removeProperty("-webkit-mask-image");
        item.style.removeProperty("mask-composite");
        item.style.removeProperty("-webkit-mask-composite");
        item.style.removeProperty("z-index");
    }

    function applyStackLayout(
        visibleItems: HTMLElement[],
        countElement: HTMLElement | null,
        itemSizePx: number,
        groupSizePx: number,
    ): StackPosition[] {
        const avatarCount = visibleItems.length;
        const hasCount = Boolean(countElement);
        const totalItems = avatarCount + (hasCount ? 1 : 0);

        const angles =
            stackAngles[Math.min(totalItems, 4)] || stackAngles[3] || [];

        const radius = Math.max(0, (groupSizePx - itemSizePx) / 2);
        const center = groupSizePx / 2;
        const allItems: HTMLElement[] = [];
        if (countElement) {
            allItems.push(countElement);
        }
        allItems.push(...visibleItems);

        return allItems.map((item, index) => {
            const angle = angles[index % angles.length];
            const rad = (Math.PI / 180) * angle;
            const x = center + radius * Math.cos(rad) - itemSizePx / 2;
            const y = center - radius * Math.sin(rad) - itemSizePx / 2;
            return { item, x, y, zIndex: index + 1 };
        });
    }

    function syncStackStyleRules(
        positions: StackPosition[],
        itemSizePx: number,
    ) {
        const styleElement = ensureStackStyleElement();
        if (!styleElement || !element) return;

        element.dataset.snowuiAvatarGroupId = avatarGroupInstanceId;

        // 与文档保持一致：stack 切割边框厚度固定为头像尺寸的 0.04 倍。
        const borderPx = itemSizePx * STACK_CUTOUT_BORDER_RATIO;
        const cutoutRadiusPx = itemSizePx / 2 + borderPx;
        const rules: string[] = [];

        positions.forEach((position, index) => {
            const item = position.item;
            item.dataset.snowuiAvatarGroupId = avatarGroupInstanceId;
            item.dataset.snowuiAvatarGroupStackIndex = String(index);

            const masks: string[] = [];

            positions.forEach((other) => {
                if (other.item === item || other.zIndex <= position.zIndex) {
                    return;
                }

                const dx = other.x - position.x;
                const dy = other.y - position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < itemSizePx + borderPx) {
                    const cx = dx + itemSizePx / 2;
                    const cy = dy + itemSizePx / 2;
                    masks.push(
                        `radial-gradient(circle at ${cx}px ${cy}px, transparent 0, transparent ${cutoutRadiusPx}px, black ${cutoutRadiusPx + STACK_CUTOUT_FEATHER_PX}px)`,
                    );
                }
            });

            const maskRule =
                masks.length > 0
                    ? `
                mask-image: ${masks.join(", ")};
                -webkit-mask-image: ${masks.join(", ")};
                mask-composite: intersect;
                -webkit-mask-composite: source-in;`
                    : "";

            rules.push(`
                [data-snowui-avatar-group-id="${avatarGroupInstanceId}"] > [data-snowui-avatar-group-stack-index="${index}"] {
                    position: absolute;
                    margin-left: 0;
                    left: ${position.x}px;
                    top: ${position.y}px;
                    z-index: ${position.zIndex};
                    ${maskRule}
                }
            `);
        });

        styleElement.textContent = rules.join("\n");
    }

    function updateItems() {
        if (!element) return;

        const items = Array.from(element.children).filter(
            (child): child is HTMLElement =>
                child instanceof HTMLElement && child.dataset.as === "item",
        );

        const maxValue =
            typeof max === "number" ? Math.max(0, Math.floor(max)) : undefined;
        const totalCount = items.length;

        let visibleCount = totalCount;
        if (resolvedLayout === "stack") {
            const capacity = Math.min(maxValue ?? 4, 4);
            if (totalCount > capacity) {
                visibleCount = Math.max(0, capacity - 1);
            } else {
                visibleCount = Math.min(totalCount, capacity);
            }
        } else if (maxValue !== undefined) {
            visibleCount = Math.max(0, Math.min(totalCount, maxValue));
        }

        overflowCount = Math.max(0, totalCount - visibleCount);

        const rootFontSize = parseFloat(
            getComputedStyle(document.documentElement).fontSize || "16",
        );
        const visibleItems = items.filter((_, index) => index < visibleCount);
        const baseItem = visibleItems[0] || items[0];
        const measuredItemSize = getLayoutWidth(baseItem);
        const itemRemValue = getSizeRemValue(finalAvatarSize);
        const fallbackItemSizePx =
            itemRemValue !== undefined
                ? itemRemValue * rootFontSize
                : rootFontSize * 1.5; // Default 1.5rem
        const itemSizePx =
            measuredItemSize > 0 ? measuredItemSize : fallbackItemSizePx;

        if (finalAvatarSize === undefined) {
            const baseItemSize = getLayoutWidth(baseItem);

            if (baseItemSize > 0) {
                element.style.setProperty(
                    "--snowui-avatar-group-item-size",
                    `${baseItemSize}px`,
                );
            } else {
                element.style.removeProperty("--snowui-avatar-group-item-size");
            }
        }

        const countEl = element.querySelector<HTMLElement>(
            ".snowui-avatar-group-count",
        );
        const countElement = overflowCount > 0 ? countEl : null;

        items.forEach((item, index) => {
            const isHidden = index >= visibleCount;

            // row 模式使用 index + 1，stack 模式在 applyStackLayout 中设置
            if (resolvedLayout === "row") {
                item.style.zIndex = String(index + 1);
            }
            item.hidden = isHidden;
            if (isHidden) {
                item.setAttribute("aria-hidden", "true");
            } else {
                item.removeAttribute("aria-hidden");
            }

            if (resolvedLayout === "stack") {
                clearLegacyStackInlineStyles(item);
            } else {
                removeStackAttributes(item);
                item.style.removeProperty("left");
                item.style.removeProperty("top");
                item.style.removeProperty("position");
                item.style.removeProperty("margin-left");
            }
        });

        if (countEl) {
            if (resolvedLayout === "stack") {
                clearLegacyStackInlineStyles(countEl);
            } else {
                removeStackAttributes(countEl);
                countEl.style.removeProperty("position");
                countEl.style.removeProperty("margin-left");
                countEl.style.removeProperty("left");
                countEl.style.removeProperty("top");
                countEl.style.zIndex = String(items.length + 1);
            }
        }

        // Apply Layout and Masking
        if (resolvedLayout === "stack") {
            const measuredGroupWidth = getLayoutWidth(element);
            const measuredGroupHeight = getLayoutHeight(element);
            const measuredGroupSize = Math.max(
                measuredGroupWidth,
                measuredGroupHeight,
            );
            const groupRemValue = getSizeRemValue(finalGroupSize);
            const fallbackGroupSizePx =
                groupRemValue !== undefined
                    ? groupRemValue * rootFontSize
                    : itemSizePx;
            const groupSizePx =
                measuredGroupSize > 0 ? measuredGroupSize : fallbackGroupSizePx;
            const effectiveGroupSize = Math.max(groupSizePx, itemSizePx);

            if (effectiveGroupSize) {
                element.style.setProperty(
                    "--snowui-avatar-group-size",
                    `${effectiveGroupSize}px`,
                );
            }

            const positions = applyStackLayout(
                visibleItems,
                countElement,
                itemSizePx,
                effectiveGroupSize,
            );
            syncStackStyleRules(positions, itemSizePx);
        } else {
            element.removeAttribute("data-snowui-avatar-group-id");
            element.style.removeProperty("--snowui-avatar-group-size");
            clearStackStyleRules();

            // Clear any lingering absolute positioning or masks from stack mode
            items.forEach((item) => {
                removeStackAttributes(item);
                item.style.removeProperty("left");
                item.style.removeProperty("top");
                item.style.removeProperty("position");
                item.style.removeProperty("margin-left");
                item.style.removeProperty("mask-image");
                item.style.removeProperty("-webkit-mask-image");
                item.style.removeProperty("mask-composite");
                item.style.removeProperty("-webkit-mask-composite");
                item.style.removeProperty("z-index");
            });

            // Row Masking 由 CSS 规则承接（见组件 style 块中的 data-layout="row" 规则）
            // 无需 JS 内联样式，避免被 Frame 响应式 style 更新清除
        }
    }

    $effect(() => {
        if (!element) return;
        const host = element;
        updateItems();

        let rafId: number | null = null;
        const scheduleUpdate = () => {
            if (rafId !== null) return;
            rafId = requestAnimationFrame(() => {
                rafId = null;
                updateItems();
            });
        };

        const resizeCleanup = new Set<() => void>();
        const bindResizeObservers = () => {
            resizeCleanup.forEach((off) => off());
            resizeCleanup.clear();

            resizeCleanup.add(resizeManager.watch(host, scheduleUpdate));
            Array.from(host.children).forEach((child) => {
                resizeCleanup.add(resizeManager.watch(child, scheduleUpdate));
            });
        };

        bindResizeObservers();

        const observer = new MutationObserver(() => {
            scheduleUpdate();
            bindResizeObservers();
        });
        observer.observe(host, { childList: true });

        return () => {
            observer.disconnect();
            resizeCleanup.forEach((off) => off());
            resizeCleanup.clear();
            clearStackStyleRules();
            stackStyleElement?.remove();
            stackStyleElement = null;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    });

    $effect(() => {
        max;
        layout;
        size;
        updateItems();
    });

    const avatarGroupRenderHints = $derived.by(() => {
        return {
            variant: userRenderHints?.variant ?? "circle",
            width:
                userRenderHints?.width ??
                finalAvatarSize ??
                DEFAULT_AVATAR_SIZE_VAL,
            height:
                userRenderHints?.height ??
                finalAvatarSize ??
                DEFAULT_AVATAR_SIZE_VAL,
        };
    });
</script>

<Frame
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
    size={resolvedSizeContext}
    class={["snowui-avatar-group", className].filter(Boolean).join(" ")}
    style={combinedStyle}
    renderHints={avatarGroupRenderHints}
    data-layout={resolvedLayout}
    role="group"
    bind:element
    {...rest}
>
    {#snippet children()}
        {#if children}
            {@render children({})}
        {/if}
        {#if overflowCount > 0}
            <Avatar
                as="count"
                class="snowui-avatar-group-count"
                fallbackText={overflowText}
                aria-label={overflowText}
            />
        {/if}
    {/snippet}
</Frame>

<style>
    :global(:where(.snowui-avatar-group)) {
        display: inline-flex;
        align-items: center;
        flex-direction: row;
        vertical-align: top;
        /* 统一尺寸基准，确保 +N 与 Avatar 子项的尺寸梯度 token 计算一致 */
        font-size: var(--text-16);
        line-height: 1;
        --snowui-avatar-group-item-size-resolved: var(
            --snowui-avatar-group-item-size-override,
            var(--snowui-avatar-group-item-size, calc(var(--size-4) * 6 / 4))
        );
        --snowui-avatar-group-size-resolved: var(
            --snowui-avatar-group-size-override,
            var(
                --snowui-avatar-group-size,
                var(--snowui-avatar-group-item-size-resolved)
            )
        );
        --snowui-avatar-group-overlap: calc(
            var(--snowui-avatar-group-item-size-resolved) * 0.25
        );
    }

    :global(:where(.snowui-avatar-group)[data-layout="stack"]) {
        display: inline-block;
        position: relative;
        width: var(
            --snowui-avatar-group-size-resolved,
            var(--snowui-avatar-group-item-size-resolved)
        );
        height: var(
            --snowui-avatar-group-size-resolved,
            var(--snowui-avatar-group-item-size-resolved)
        );
    }

    :global(:where(.snowui-avatar-group) > [data-as="item"]),
    :global(:where(.snowui-avatar-group) > [data-as="count"]) {
        margin-inline-start: calc(var(--snowui-avatar-group-overlap) * -1);
        box-sizing: border-box;
        position: relative;
        flex-shrink: 0;
    }

    :global(:where(.snowui-avatar-group)[data-layout="stack"] > [data-as="item"]),
    :global(:where(.snowui-avatar-group)[data-layout="stack"] > [data-as="count"]) {
        margin-inline-start: 0;
    }

    :global(:where(.snowui-avatar-group) > [data-as="item"]:first-child) {
        margin-inline-start: 0;
    }

    :global(:where(.snowui-avatar-group) > [hidden]) {
        display: none;
    }

    :global(:where(.snowui-avatar-group-count)) {
        position: relative;
        flex-shrink: 0;
        color: var(--static-black-100, #000000);
    }

    :global(:where(.snowui-avatar-group-count) .snowui-avatar-background) {
        background-color: var(--snowui-avatar-group-count-bg, #ededed);
    }

    /*
     * Row 模式切割遮罩（CSS 实现）
     * 选择所有可见且后方还有可见兄弟的子项，为它们切掉右侧与下一项重叠的圆弧。
     * 使用 :has(~ *:not([hidden])) 精确定位"最后可见项之前的所有可见项"，
     * 避免对最后可见项施加多余切割。
     * 此规则替代原 JS 内联 mask-image 注入，防止被 Frame 响应式 style 更新清除。
     */
    :global(
        :where(.snowui-avatar-group)[data-layout="row"]
            > *:not([hidden]):has(~ *:not([hidden]))
    ) {
        --_sg-s: var(--snowui-avatar-group-item-size-resolved);
        --_sg-border: calc(var(--_sg-s) * 0.04);
        --_sg-r: calc(var(--_sg-s) / 2 + var(--_sg-border));
        /* center-x = size * 0.75 + size * 0.5 = size * 1.25 */
        --_sg-cx: calc(var(--_sg-s) * 1.25);
        mask-image: radial-gradient(
            circle at var(--_sg-cx) 50%,
            transparent 0,
            transparent var(--_sg-r),
            black calc(var(--_sg-r) + 0.5px)
        );
        -webkit-mask-image: radial-gradient(
            circle at var(--_sg-cx) 50%,
            transparent 0,
            transparent var(--_sg-r),
            black calc(var(--_sg-r) + 0.5px)
        );
    }
</style>
