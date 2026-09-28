<!--
 Icon 图标组件
  v2.3.3

 1. 核心能力 (Features):
    - 统一尺寸: 默认 16px。支持 16, 20, 24, 28, 32, 40, 48, 80 八种标准尺寸。
    - 智能回退: 支持 src 图片加载（失败时由外部内容兜底）。
    - 角色化组合 (Role-based Composition):
        - `as="badge"`: 作为 Avatar Badge 时，自动消耗 Context 尺寸（除非显式指定 size），并支持背景切割。
        - `badge={...}`: 支持作为 Host 挂载 Badge，并提供 Context 和 Mask 切割能力。

 2. 视觉样式 (Visual):
    - `background`: boolean, 开启时提供 padding 和圆角背景。背景色需通过 class 指定 (如 `bg-black-4`).
    - `weight`: 图标权重 (font-weight).
    - `color`: 移除属性，请使用 CSS class (如 `text-black-100`).

 3. 交互集成 (Interaction):
    - 逻辑委托给 Frame 组件。
 -->

<script lang="ts">
    import { getContext, setContext, type Component, type Snippet } from "svelte";
    import { OPTIONAL_RESOURCE_ICON_CONTEXT_KEY } from "../logic/component-icon";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { FRAME_CONTEXT_KEY } from "../keys";
    import type { StateValueMap } from "../logic/frame-types";
    import {
        resolveParentStateValue,
        type ParentFrameStateContext,
    } from "../logic/frame-state-value";
    import {
        ICON_CONTEXT_KEY,
        getAvatar,
        getAccordion,
        getIcon,
        getImage,
        getImageViewer,
        getSizeContext,
        getSize,
    } from "../context";
    import {
        DEFAULT_RESOURCE_SIZE_TOKEN,
        resolveResourceSizeRemValue,
        resolveResourceSizeToken,
    } from "../logic/resource-size";

    export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 80;

    interface Props extends FrameProps {
        src?: string;
        icon?: Component<any>;
        stateIcon?: StateValueMap<Component<any> | null>;
        size?: IconSize;
        // color removed
        background?: boolean;
        weight?: string;
        as?:
            | "badge"
            | "icon"
            | "prev"
            | "next"
            | "close"
            | (string & {});
        children?: Snippet;
        badgePosition?: "top" | "bottom";
        [key: string]: any;
    }

    let {
        src = undefined,
        icon = undefined,
        stateIcon = undefined,
        size = undefined,
        // color removed
        background = false,
        weight = undefined,
        class: className = "",
        style: userStyle = "",
        renderHints: userRenderHints = undefined,
        as = "icon",
        badgePosition = "top",
        children,
        ...rest
    }: Props = $props();

    // Contexts
    const avatarCtx = getAvatar();
    const accordionCtx = getAccordion();
    const iconCtx = getIcon();
    const imageCtx = getImage();
    const imageViewerCtx = getImageViewer();
    const parentFrameCtx = getContext<ParentFrameStateContext | undefined>(
        FRAME_CONTEXT_KEY,
    );
    let childSize = $state<number | string | undefined>(undefined);

    // 读取父级尺寸上下文（如 AvatarGroup 提供）
    getSize(); // Linter requirement
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined ? sizeCtx.iconSize : sizeCtx?.size,
    );

    setContext(OPTIONAL_RESOURCE_ICON_CONTEXT_KEY, {
        size: "100%",
        get weight() {
            return weight;
        },
        registerChildSize: (next?: number | string) => {
            childSize = next;
        },
    });
    const isBadgeRole = $derived(as === "badge");

    // Calculate em-based values (Matching Avatar)
    const DOT_SIZE_EM = 0.25;

    // Calculate Styles
    const accordionLeadingSize = $derived(
        accordionCtx && as === "leading"
            ? "var(--snowui-accordion-icon-size-override, var(--snowui-accordion-icon-size))"
            : undefined,
    );
    let effectiveSize = $derived(size ?? accordionLeadingSize ?? contextSize ?? childSize ?? 16);
    const DEFAULT_ICON_SIZE_TOKEN = DEFAULT_RESOURCE_SIZE_TOKEN;
    let sizeRem = $derived(resolveResourceSizeToken(effectiveSize));

    // Background mapping based on IconSize (Token-only, aligned with FigmaToSnowUI)
    const bgMapping: Record<IconSize, { radius: string; padding: string }> = {
        12: {
            radius: "var(--radius-2)",
            padding: "var(--padding-1)",
        },
        16: {
            radius: "var(--radius-2)",
            padding: "var(--padding-1)",
        },
        20: {
            radius: "var(--radius-2)",
            padding: "var(--padding-1)",
        },
        24: {
            radius: "var(--radius-3)",
            padding: "var(--padding-1)",
        },
        28: {
            radius: "var(--radius-3)",
            padding: "var(--padding-1)",
        },
        32: {
            radius: "var(--radius-3)",
            padding: "var(--padding-1)",
        },
        40: {
            radius: "var(--radius-4)",
            padding: "var(--padding-2)",
        },
        48: {
            radius: "var(--radius-5)",
            padding: "var(--padding-2)",
        },
        80: {
            radius: "var(--radius-7)",
            padding: "var(--padding-3)",
        },
    };

    // Background config (Padding and Radius calculation)
    let bgConfig = $derived.by(() => {
        if (!background)
            return { padding: "var(--padding-0)", radius: "var(--radius-0)" };
        const currentSize =
            typeof effectiveSize === "number" ? effectiveSize : size || 16;
        return bgMapping[currentSize as IconSize] || bgMapping[16];
    });

    // Host Badge Style (For the Child Badge)
    let myHostBadgeStyle = $derived.by(() => {
        const offset = `calc(${sizeRem} * 0.04)`;
        let posStyle = `right: ${offset};`;

        if (badgePosition === "bottom") {
            posStyle += `bottom: ${offset}; top: auto;`;
        } else {
            posStyle += `top: ${offset}; bottom: auto;`;
        }
        return `position: absolute; ${posStyle} z-index: 10;`;
    });

    // Context Provider
    setContext(ICON_CONTEXT_KEY, {
        get badgeStyle() {
            return myHostBadgeStyle;
        },
        get badgeSize() {
            // Dot 尺寸随当前 Icon 尺寸等比缩放
            return `calc(${sizeRem} * ${DOT_SIZE_EM})`;
        },
        registerBadgeSize: () => {
            // Icon no longer needs customBadgeSize for its own cutout rule,
            // as it only cutouts standard dots.
        },
        registerBadgeType: () => {},
        registerBadgeGeometry: () => {},
    });

    // Register custom size and type if needed
    $effect(() => {
        if (isBadgeRole && size !== undefined) {
            // Register Type 'icon'
            if (avatarCtx && avatarCtx.registerBadgeType) {
                avatarCtx.registerBadgeType("icon");
            }
            if (iconCtx && iconCtx.registerBadgeType) {
                iconCtx.registerBadgeType("icon");
            }

            // Register size to Avatar Context
            const remVal = resolveResourceSizeRemValue(size);
            if (remVal && avatarCtx && avatarCtx.registerBadgeSize) {
                avatarCtx.registerBadgeSize(remVal);
            }
        }
    });

    // Wrapper 仅负责 badge 定位
    let wrapperStyle = $derived.by(() => {
        if (as === "prev" && imageViewerCtx) {
            return imageViewerCtx.prevStyle || "";
        }
        if (as === "next" && imageViewerCtx) {
            return imageViewerCtx.nextStyle || "";
        }
        if (as === "close" && imageViewerCtx) {
            return imageViewerCtx.closeStyle || "";
        }
        if (as === "icon" && imageCtx) {
            return imageCtx.iconStyle || "";
        }
        if (isBadgeRole && imageCtx) {
            return imageCtx.badgeStyle || "";
        }
        const ctx = avatarCtx || iconCtx;
        if (isBadgeRole && ctx) {
            return ctx.badgeStyle || "";
        }
        return "";
    });
    let wrapperDataAs = $derived.by(() => {
        if (as === "prev" && imageViewerCtx) return imageViewerCtx.prevAs || as;
        if (as === "next" && imageViewerCtx) return imageViewerCtx.nextAs || as;
        if (as === "close" && imageViewerCtx) return imageViewerCtx.closeAs || as;
        if (as === "icon" && imageCtx) return imageCtx.iconAs || as;
        if (isBadgeRole && imageCtx) return imageCtx.badgeAs || as;
        return as;
    });

    // Icon 单层尺寸控制：尺寸变量直接注入到 Frame(.snowui-icon)
    let iconStyle = $derived.by(() => {
        const styles = [
            sizeRem !== DEFAULT_ICON_SIZE_TOKEN
                ? `--snowui-icon-size-default: ${sizeRem}`
                : "",
            background ? `--snowui-icon-padding: ${bgConfig.padding}` : "",
            background ? `--snowui-icon-radius: ${bgConfig.radius}` : "",
            weight ? `--snowui-icon-font-weight: ${weight}` : "",
            userStyle,
        ];

        return styles.filter(Boolean).join("; ");
    });
    const iconSkeletonSize = $derived.by(() => {
        if (!background) return sizeRem;
        return `calc(${sizeRem} + (${bgConfig.padding} * 2))`;
    });
    const iconRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? iconSkeletonSize,
        height: userRenderHints?.height ?? iconSkeletonSize,
        radius: userRenderHints?.radius ?? bgConfig.radius,
    });
    const resolvedIcon = $derived(
        resolveParentStateValue(stateIcon, parentFrameCtx, icon),
    );
    const isStateIconHidden = $derived(
        stateIcon !== undefined && resolvedIcon === null,
    );
</script>

<div
        class={[
            "snowui-icon-wrapper",
            isStateIconHidden ? "snowui-icon-wrapper-state-hidden" : "",
            isBadgeRole ? "snowui-icon-wrapper-badge" : "",
            as === "icon" ? "snowui-icon-wrapper-role-icon" : "",
            as === "leading" ? "snowui-icon-wrapper-role-leading" : "",
            as === "trailing" ? "snowui-icon-wrapper-role-trailing" : "",
            as === "prev" ? "snowui-icon-wrapper-role-prev" : "",
            as === "next" ? "snowui-icon-wrapper-role-next" : "",
            as === "close" ? "snowui-icon-wrapper-role-close" : "",
        ]
            .filter(Boolean)
            .join(" ")}
    data-as={wrapperDataAs || undefined}
    style={wrapperStyle || undefined}
>
    <Frame
        enableResponsive={false}
        enableContext={false}
        enableScaleObserver={false}
        class={[
            "snowui-icon",
            background ? "snowui-icon-background" : "",
            background ? "snowui-rounded-rectangle" : "",
            isBadgeRole ? "snowui-icon-role-badge" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ")}
        style={iconStyle || undefined}
        renderHints={iconRenderHints}
        {...rest}
    >
        {#snippet children({ responsive })}
            <div class="snowui-icon-content">
                {#if src}
                    <img {src} alt="" class="snowui-icon-image" />
                {:else if resolvedIcon}
                    <!-- svelte-ignore svelte_component_deprecated -->
                    <svelte:component
                        this={resolvedIcon}
                        size={typeof effectiveSize === "number"
                            ? Math.round(effectiveSize)
                            : effectiveSize}
                        width="100%"
                        height="100%"
                    />
                {:else if children}
                    {@render children({ responsive })}
                {:else}
                    <div class="snowui-icon-default snowui-rounded-rectangle"></div>
                {/if}
            </div>
        {/snippet}
    </Frame>
</div>

<style>
    :global(:where(.snowui-icon)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        vertical-align: middle;
        user-select: none;
        box-sizing: border-box;
        position: relative; /* Ensure absolute badge is relative to Icon */
        --snowui-icon-size-default: var(--size-4);
        --snowui-icon-width: var(
            --snowui-icon-size-override,
            var(
                --snowui-button-icon-size-override,
                var(--snowui-icon-size-default)
            )
        );
        --snowui-icon-height: var(
            --snowui-icon-size-override,
            var(
                --snowui-button-icon-size-override,
                var(--snowui-icon-size-default)
            )
        );
        --snowui-icon-min-width: 12px;
        --snowui-icon-min-height: 12px;
        width: var(--snowui-icon-width-override, var(--snowui-icon-width));
        height: var(--snowui-icon-height-override, var(--snowui-icon-height));
        min-width: var(
            --snowui-icon-min-width-override,
            var(--snowui-icon-min-width)
        );
        min-height: var(
            --snowui-icon-min-height-override,
            var(--snowui-icon-min-height)
        );
        font-size: var(--snowui-icon-font-size-override, inherit);
        line-height: var(--snowui-icon-line-height-override, inherit);
        font-weight: var(
            --snowui-icon-font-weight-override,
            var(--snowui-icon-font-weight, inherit)
        );
    }

    :global(:where(.snowui-icon).snowui-icon-role-badge) {
        --snowui-icon-width: var(
            --snowui-icon-size-override,
            var(--snowui-icon-size-default)
        );
        --snowui-icon-height: var(
            --snowui-icon-size-override,
            var(--snowui-icon-size-default)
        );
        --snowui-icon-min-width: 12px;
        --snowui-icon-min-height: 12px;
    }

    :global(:where(.snowui-icon-background)) {
        --snowui-icon-background: var(--black-4, #0000000a);
        /* size 表示内容区尺寸；背景 padding 额外叠加到外框 */
        box-sizing: content-box;
        background-color: var(
            --snowui-icon-background-override,
            var(--snowui-icon-background)
        );
        padding: var(
            --snowui-icon-padding-override,
            var(--snowui-icon-padding, var(--padding-0))
        );
        border-radius: var(
            --snowui-icon-radius-override,
            var(--snowui-icon-radius, var(--radius-0))
        );
    }

    :global(:where(.snowui-icon-content)) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    :global(:where(.snowui-icon-wrapper)) {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
        flex-shrink: 0;
        box-sizing: border-box;
    }

    :global(:where(.snowui-icon-wrapper-state-hidden)) {
        display: none;
    }

    :global(:where(.snowui-icon-wrapper[data-as^="pin-"])) {
        position: absolute;
    }

    :global(:where(.snowui-icon-wrapper-badge)) {
        margin: 0;
    }

    :global(:where(.snowui-icon-image)),
    :global(:where(.snowui-icon-content > svg)) {
        display: block;
        width: 100%;
        height: 100%;
        max-width: 100%;
    }

    :global(:where(.snowui-icon-image)) {
        object-fit: contain;
    }

    :global(:where(.snowui-icon-default)) {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: var(--radius-1);
        border: var(--border-1) dashed var(--black-80, #000000cc);
        background: var(--black-4, #0000000a);
    }
</style>
