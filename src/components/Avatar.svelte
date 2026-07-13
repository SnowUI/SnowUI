<!--
 Avatar 头像组件
  v2.4.19

 1. 核心能力 (Features):
    - 多样形态: 支持 circular, rounded, square 三种形状
    - 智能回退: 支持 src 图片加载，失败时自动回退到 alt 文字或默认图标
    - 默认头像组件: 支持 fallback 组件作为无图默认头像视觉层
    - 角色化组合 (Role-based Composition):
        - `as="badge"`: 内部 Badge 自动定位到头像角落。
    - True Cutout (Masking): 使用 CSS Mask 实现背景透视切割，支持任意背景色。
    - 属性透传与原生支持: 完整支持原生事件绑定与自定义属性
    - 样式扩展 (Styling): 支持通过 class 传入外部工具类

 2. 交互集成 (Interaction):
    - 逻辑委托给 Frame 组件
    - 内部布局控制: 通过 AVATAR_CONTEXT_KEY 为子组件提供定位协议
 -->

<script lang="ts">
    import { setContext, type Component, type Snippet } from "svelte";
    import { Icon as ResourceIcon } from "@snowui-design-system/resource-svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import {
        AVATAR_CONTEXT_KEY,
        getSizeContext,
        getSize,
        type ResourceSize,
    } from "../context";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    interface Props extends FrameProps {
        src?: string | Component;
        size?: ResourceSize;
        fallback?: Component;
        fallbackText?: string;
        children?: Snippet;
        badgePosition?: "top" | "bottom";
        [key: string]: any;
    }

    const inheritedAvatarPart = useComponentPart<Props>("Avatar");
    let explicitProps: Props = $props();
    let {
        src = undefined,
        size = undefined,
        fallback = undefined,
        fallbackText = undefined,
        badgePosition = "top",
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        children,
        ...rest
    }: Props = $derived(
        mergeComponentPartProps(inheritedAvatarPart.current, explicitProps),
    );

    // 读取父级尺寸上下文（如 AvatarGroup 提供）
    getSize(); // Linter requirement
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.avatarSize !== undefined ? sizeCtx.avatarSize : sizeCtx?.size,
    );

    // 比例常量：文字/图标相对于头像大小的比例 (32px 头像 ≈ 12px 文本)
    const INNER_RATIO = 0.375;

    // 默认尺寸与 size 映射基准
    const DEFAULT_SIZE_VAL: ResourceSize = 16;
    const DEFAULT_CONTAINER_UNIT_FACTOR = DEFAULT_SIZE_VAL / 4;
    const DEFAULT_TEXT_UNIT_FACTOR = (DEFAULT_SIZE_VAL * INNER_RATIO) / 16;

    // 优先使用 prop size，其次使用 context size，最后回落默认值
    const resolvedSize = $derived(size ?? contextSize ?? DEFAULT_SIZE_VAL);
    const resolvedContainerSize = $derived(
        typeof resolvedSize === "number" ? resolvedSize : DEFAULT_SIZE_VAL,
    );
    const containerUnitFactor = $derived(resolvedContainerSize / 4);
    const textUnitFactor = $derived((resolvedContainerSize * INNER_RATIO) / 16);
    // 1. 图片加载逻辑
    let imageStatus = $state<"idle" | "loading" | "loaded" | "error">("idle");
    let showFallback = $state(false);

    $effect(() => {
        if (src) {
            if (typeof src === "string") {
                imageStatus = "loading";
                const img = new Image();
                img.src = src;
                img.onload = () => (imageStatus = "loaded");
                img.onerror = () => (imageStatus = "error");
            } else {
                imageStatus = "loaded";
            }
        } else {
            imageStatus = "error";
        }
    });

    // 延迟显示回退，避免闪烁
    const FALLBACK_DELAY_MS = 600;
    $effect(() => {
        if (imageStatus === "loading") {
            const timer = setTimeout(
                () => (showFallback = true),
                FALLBACK_DELAY_MS,
            );
            return () => clearTimeout(timer);
        } else {
            showFallback = true;
        }
    });

    // 1.1 首字母回退规则（无图片时）
    const labelSource = $derived(
        (rest["aria-label"] || rest["data-name"] || rest.title || "") as string,
    );
    const explicitFallbackText = $derived(
        typeof fallbackText === "string" ? fallbackText.trim() : "",
    );
    const hasExplicitFallbackText = $derived(explicitFallbackText.length > 0);
    const initials = $derived.by(() => {
        if (hasExplicitFallbackText) return "";
        const text = labelSource.trim();
        if (!text) return "";
        const parts = text.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || "";
        return first.toUpperCase().slice(0, 1);
    });

    const secondaryColors = [
        "var(--secondary-purple, #7c3aed)",
        "var(--secondary-indigo, #4f46e5)",
        "var(--secondary-blue, #3b82f6)",
        "var(--secondary-cyan, #06b6d4)",
        "var(--secondary-mint, #10b981)",
        "var(--secondary-green, #22c55e)",
        "var(--secondary-yellow, #eab308)",
        "var(--secondary-orange, #f97316)",
        "var(--secondary-red, #ef4444)",
    ];
    const initialsBg = $derived.by(() => {
        if (!initials) return "";
        let hash = 0;
        for (let i = 0; i < labelSource.length; i += 1) {
            hash = (hash * 31 + labelSource.charCodeAt(i)) | 0;
        }
        const index = Math.abs(hash) % secondaryColors.length;
        return secondaryColors[index];
    });

    // State for Component Types
    let badgeType = $state<"dot" | "content" | "icon" | undefined>(undefined);

    // 3. 样式尺寸计算 (Token 体系)
    let rootStyleVars = $derived.by(() => {
        return [
            containerUnitFactor !== DEFAULT_CONTAINER_UNIT_FACTOR
                ? `--snowui-avatar-container-unit-factor: ${containerUnitFactor}`
                : "",
            textUnitFactor !== DEFAULT_TEXT_UNIT_FACTOR
                ? `--snowui-avatar-text-unit-factor: ${textUnitFactor}`
                : "",
        ]
            .filter(Boolean)
            .join("; ");
    });
    let rootStyleFinal = $derived.by(() => {
        const styles = [rootStyleVars, userStyle].filter(Boolean).join("; ");
        return styles || undefined;
    });

    // Calculate em-based values
    // Badge Dot Size Ratio: 基于头像容器尺寸等比缩放
    // 基准：16px 头像时 dot
    const DOT_SIZE_RATIO = 0.28;
    // 边框厚度比例：对齐旧版关系
    const DOT_BORDER_RATIO = 0.1;

    // Badge Positioning Offset (Right/Bottom or Top)
    // Aligns the CUTOUT border edge to Avatar Edge.
    // Offset = 0 (Edge align)

    // Context for Children
    setContext(AVATAR_CONTEXT_KEY, {
        get badgeStyle() {
            // Position Badge relative to Container Edge
            // To align the OUTSIDE cutout border edge to avatar edge:
            // inset 使用 dot 边框厚度（与 dot 尺寸同比缩放）
            const borderSize = `calc(var(--snowui-avatar-size-step) * var(--snowui-avatar-container-unit-factor) * ${DOT_SIZE_RATIO} * ${DOT_BORDER_RATIO})`;
            let posStyle = `right: ${borderSize};`;

            if (badgePosition === "bottom") {
                posStyle += `bottom: ${borderSize}; top: auto;`;
            } else {
                posStyle += `top: ${borderSize}; bottom: auto;`;
            }
            return `position: absolute; ${posStyle} z-index: 10;`;
        },
        get badgeSize() {
            // Dot 按头像容器尺寸等比缩放
            return `calc(var(--snowui-avatar-size-step) * var(--snowui-avatar-container-unit-factor) * ${DOT_SIZE_RATIO})`;
        },
        registerBadgeType: (t: "dot" | "content" | "icon") => {
            badgeType = t;
        },
    });

    // Mask Generation
    // Uses standard CSS Mask with calc() strings.
    let maskStyle = $derived.by(() => {
        if (!children || badgeType !== "dot") return "";

        // 1. Dot 尺寸（按头像容器尺寸等比）
        const dotSize = `calc(var(--snowui-avatar-size-step) * var(--snowui-avatar-container-unit-factor) * ${DOT_SIZE_RATIO})`;
        const borderSize = `calc(${dotSize} * ${DOT_BORDER_RATIO})`;

        // 2. Cutout Radius = BadgeRadius + Border
        const badgeRadius = `calc(${dotSize} / 2)`;
        const cutoutRadius = `calc(${badgeRadius} + ${borderSize})`;

        // 3. Position:
        // Badge is inset by borderSize.
        // Center of Badge is borderSize + badgeRadius from avatar edge.
        const centerDist = `calc(${badgeRadius} + ${borderSize})`;
        const xOffset = centerDist;
        const yOffset = centerDist;

        let pos = "";
        if (badgePosition === "bottom") {
            pos = `at right ${xOffset} bottom ${yOffset}`;
        } else {
            pos = `at right ${xOffset} top ${yOffset}`;
        }

        // 4. Generate Mask
        const radStr = cutoutRadius;
        const cutout = `radial-gradient(circle ${pos}, black 0, black ${radStr}, transparent calc(${radStr} + 0.03125rem))`;
        const full = `linear-gradient(black, black)`;

        return `
            mask-image: ${cutout}, ${full};
            mask-composite: exclude;
            -webkit-mask-image: ${cutout}, ${full};
            -webkit-mask-composite: destination-out;
        `;
    });

    // 判断是否显示彩色背景（图片或Initials）
    let hasComponentFallback = $derived(
        !!fallback && !(imageStatus === "loaded" && src),
    );
    let isColored = $derived(!!(imageStatus === "loaded" && src) || hasComponentFallback);
    let isImageMode = $derived(!!(imageStatus === "loaded" && src));
    let hasInitials = $derived(!!initials && !isImageMode && !hasComponentFallback);

    // Container Style (Background, Mask, etc.)
    let containerStyle = $derived.by(() => {
        const styles = [maskStyle].filter(Boolean);
        const joined = styles.join("; ");
        return joined ? joined : undefined;
    });
    const avatarRenderHints = $derived({
        variant: userRenderHints?.variant ?? "circle",
        width: userRenderHints?.width ?? resolvedContainerSize,
        height: userRenderHints?.height ?? resolvedContainerSize,
    });

    // 过滤掉已移除的 Props，避免透传到 DOM
    const cleanRest = $derived.by(() => {
        const {
            alt: _alt,
            fallback: _fallback,
            delayMs: _delayMs,
            variant: _variant,
            ...filtered
        } = rest as Record<string, any>;
        return filtered;
    });
    // Avatar 默认是点击语义组件;非 disabled 时挂 .snowui-media-hoverable(layout.css)
    // 一次性获得 cursor: pointer + 子层 hover 反馈(图片 brightness 压暗 / initials 背景
    // brightness 压暗 / 空 fallback 背景色加深),不再在组件内重复定义 hover 选择器。
    // disabled 时由 .snowui-disabled / [data-disabled] / :disabled 全局规则把 cursor 重置为 default。
    const isInteractive = $derived(!cleanRest.disabled);
</script>

<Frame
    enableResponsive={false}
    enableContext={false}
    enableScaleObserver={false}
    class={[
        "snowui-avatar",
        isInteractive ? "snowui-media-hoverable" : "",
        isInteractive && (isImageMode || hasComponentFallback) ? "snowui-media-hoverable-has-visual" : "",
        isInteractive && hasInitials && !isImageMode ? "snowui-media-hoverable-tinted-bg" : "",
        isImageMode ? "snowui-avatar-image-mode" : "",
        hasInitials ? "snowui-avatar-has-initials" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-disabled={cleanRest.disabled ? "true" : undefined}
    style={rootStyleFinal}
    renderHints={avatarRenderHints}
    {...cleanRest}
>
    {#snippet children()}
        <!-- Container applies mask if children exist (assuming children = badge) -->
        <div
            class={[
                "snowui-avatar-container",
                isColored ? "snowui-avatar-has-image" : "",
                hasInitials ? "snowui-avatar-has-initials" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={containerStyle}
        >
            <div
                class="snowui-avatar-background snowui-media-hoverable-background"
                aria-hidden="true"
                style={initialsBg
                    ? `--snowui-avatar-bg: ${initialsBg};`
                    : undefined}
            ></div>
            {#if imageStatus === "loaded" && src}
                <div class="snowui-avatar-visual snowui-media-hoverable-visual">
                    {#if typeof src === "string"}
                        <img {src} alt="" class="snowui-avatar-visual-media" />
                    {:else}
                        <!-- svelte-ignore svelte_component_deprecated -->
                        <svelte:component
                            this={src}
                            size={typeof resolvedSize === "number"
                                ? Math.round(resolvedSize)
                                : resolvedSize}
                            class="snowui-avatar-visual-media"
                            width="100%"
                            height="100%"
                        />
                    {/if}
                </div>
            {:else if hasComponentFallback && fallback}
                <div class="snowui-avatar-visual snowui-media-hoverable-visual">
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component
                        this={fallback}
                        as="avatar-image"
                        seed={labelSource || explicitFallbackText}
                        size="100%"
                        radius="inherit"
                        class="snowui-avatar-visual-media"
                    />
                </div>
            {:else if showFallback}
                <div class="snowui-avatar-visual">
                    {#if hasExplicitFallbackText}
                        <span class="snowui-avatar-text"
                            >{explicitFallbackText}</span
                        >
                    {:else if initials}
                        <span class="snowui-avatar-initials">{initials}</span>
                    {:else}
                        <span class="snowui-avatar-fallback">
                            <ResourceIcon
                                name="user"
                                size="1em"
                                class="snowui-avatar-default-icon"
                                aria-hidden="true"
                            />
                        </span>
                    {/if}
                </div>
            {/if}
        </div>
        <!-- Children (Badge/Icon) rendered OUTSIDE masked container -->
        {#if children}
            {@render children({})}
        {/if}
    {/snippet}
</Frame>

<style>
    :global(:where(.snowui-avatar)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: visible;
        background-color: transparent;
        user-select: none;
        flex-shrink: 0;
        border-radius: var(--radius-full, 9999px);
        box-sizing: border-box;
        font-size: var(--text-16);
        line-height: 1;
        --snowui-avatar-size-step: calc(var(--size-4) / 4);
        --snowui-avatar-container-unit-factor: 4;
        --snowui-avatar-text-unit-factor: 0.375;
        width: var(
            --snowui-avatar-size-override,
            calc(
                var(--snowui-avatar-size-step) *
                    var(--snowui-avatar-container-unit-factor)
            )
        );
        height: var(
            --snowui-avatar-size-override,
            calc(
                var(--snowui-avatar-size-step) *
                    var(--snowui-avatar-container-unit-factor)
            )
        );
    }

    :global(:where(.snowui-avatar-container)) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: inherit; /* Inherit from Root */
        overflow: hidden;
        position: relative;
        isolation: isolate;
        color: currentColor;
    }

    :global(:where(.snowui-avatar-container).snowui-avatar-has-image) {
        background-color: transparent;
    }

    :global(:where(.snowui-avatar-background)) {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-color: var(--snowui-avatar-bg, var(--black-4, #0000000a));
        z-index: 0;
        /* filter / transition 由 .snowui-media-hoverable-background 工具类提供 */
    }

    :global(
            :where(.snowui-avatar-container.snowui-avatar-has-image)
                .snowui-avatar-background
        ) {
        opacity: 0;
        background-color: transparent;
    }

    :global(:where(.snowui-avatar-visual)) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: inherit;
        z-index: 1;
        /* filter / transition 由 .snowui-media-hoverable-visual 工具类提供(仅有图态生效) */
        /* 继承根部 font-size，此处无需重复计算 */
    }

    :global(:where(.snowui-avatar-visual-media)) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
        display: block;
    }

    /* hover 反馈全部由 .snowui-media-hoverable 工具类家族接管:
       - imageMode → 根挂 .snowui-media-hoverable-has-visual → visual 层 brightness 压暗
       - hasInitials → 根挂 .snowui-media-hoverable-tinted-bg → background 层 brightness 压暗
       - 空 fallback → 根无标志 → background 层 background-color 加深
       详见 components/src/styles/layout.css §"Media Hoverable 工具类"。 */

    :global(:where(.snowui-avatar-fallback)) {
        display: flex; /* Ensure centralized internal content */
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: calc(var(--text-16) * var(--snowui-avatar-text-unit-factor));
        line-height: 1;
    }

    :global(:where(.snowui-avatar-initials)) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--static-white-100, #ffffff);
        text-transform: uppercase;
        font-size: calc(var(--text-16) * var(--snowui-avatar-text-unit-factor));
        line-height: 1;
    }

    :global(:where(.snowui-avatar-text)) {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: currentColor;
        font-size: calc(var(--text-16) * var(--snowui-avatar-text-unit-factor));
        line-height: 1;
    }

    :global(:where(.snowui-avatar-default-icon)) {
        width: var(
            --snowui-avatar-default-icon-size-override,
            var(
                --snowui-avatar-default-icon-size,
                calc(var(--size-4) * var(--snowui-avatar-text-unit-factor))
            )
        );
        height: var(
            --snowui-avatar-default-icon-size-override,
            var(
                --snowui-avatar-default-icon-size,
                calc(var(--size-4) * var(--snowui-avatar-text-unit-factor))
            )
        );
    }

    :global(:where(.snowui-avatar > .snowui-gradient-motion)) {
        position: absolute;
        inset: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        overflow: hidden;
    }
</style>
