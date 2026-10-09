<!-- 
 Switch 组件：开关切换控件
 v1.1.17

 1. 核心能力:
    - 双向绑定 checked 状态
    - 支持自定义尺寸（通过 size 属性）
    - 支持禁用状态
    - 继承 Frame 组件的通用能力

 2. 视觉设计:
    - 轨道 + 滑块结构
    - 平滑的切换动画
    - Hover 状态反馈
    - 补齐 Frame 能力开关显式传参
    - 内部变量命名对齐 snowui 规范
-->

<script lang="ts">
  // SnowUI 许可入口：首次阅读源码请先读 ../../LICENSE；访问文件不代表获得修改或移植权，官方维护授权及同任务去重见该文件。
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSizeContext, getSize, type ResourceSize } from "../context";
    import {
        DEFAULT_RESOURCE_SIZE_TOKEN,
        resolveResourceSizeToken,
    } from "../logic/resource-size";
    import type { Snippet } from "svelte";

    interface Props extends Omit<FrameProps, "size"> {
        checked?: boolean;
        value?: any;
        size?: ResourceSize | number;
        disabled?: boolean;
        children?: Snippet;
        enableResponsive?: boolean;
        enableContext?: boolean;
        [key: string]: any;
    }

    let {
        // Component props
        checked = $bindable(false),
        value,
        size = undefined,
        disabled = false,
        children,

        // Capability Props
        enableResponsive = false,
        enableContext = false,

        // 提取 class 和 style 以便手动合并
        class: userClass,
        style: userStyle,
        renderHints: userRenderHints = undefined,

        // Rest props
        ...rest
    }: Props = $props();

    // 读取父级尺寸上下文
    getSize();
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined ? sizeCtx.iconSize : sizeCtx?.size,
    );
    // 优先使用 prop size，其次使用 context size
    const resolvedSize = $derived(size ?? contextSize ?? 16);
    const resolvedSizeToken = $derived(resolveResourceSizeToken(resolvedSize));
    const DEFAULT_TOGGLE_SIZE_TOKEN = DEFAULT_RESOURCE_SIZE_TOKEN;
    const toggleSizeStyle = $derived(
        resolvedSizeToken !== DEFAULT_TOGGLE_SIZE_TOKEN
            ? `--snowui-switch-size: ${resolvedSizeToken}`
            : "",
    );
    const toggleRootStyle = $derived(
        [toggleSizeStyle, userStyle].filter(Boolean).join("; ") || undefined,
    );
    const toggleRenderHints = $derived({
        variant: userRenderHints?.variant ?? "line",
        width: userRenderHints?.width ?? `calc(${resolvedSizeToken} * (1.8 + 1 / 7))`,
        height: userRenderHints?.height ?? `calc(${resolvedSizeToken} * 8 / 7)`,
        radius: userRenderHints?.radius ?? "var(--radius-full, 9999px)",
    });

    // 手动同步 checked 到 DOM input (参考 Radio 实现)
    let inputRef = $state<HTMLInputElement>();
    $effect(() => {
        if (inputRef) {
            inputRef.checked = checked;
        }
    });

    function handleClick() {
        if (disabled) return;
        checked = !checked;
    }
</script>

<Frame
    tag="label"
    class={`snowui-switch${userClass ? ` ${userClass}` : ""}`}
    data-disabled={disabled ? "true" : undefined}
    {disabled}
    style={toggleRootStyle}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
    renderHints={toggleRenderHints}
    {...rest}
>
    <span class="snowui-control-inset">
        <input
            bind:this={inputRef}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            class="snowui-switch-sr-only"
            {checked}
            {value}
            {disabled}
            onclick={handleClick}
            tabindex={disabled ? -1 : 0}
        />
        <span class="snowui-switch-track">
            <span class="snowui-switch-thumb"></span>
        </span>
    </span>
    {#if children}
        <span class="snowui-switch-label">
            {@render children()}
        </span>
    {/if}
</Frame>

<style>
    /* Level 2: Component Base (降权为 0) */
    :global(:where(.snowui-switch)) {
        display: inline-flex;
        align-items: center;
        gap: var(--snowui-switch-gap-override, var(--snowui-switch-gap));
        vertical-align: middle;
        user-select: none;
        cursor: var(--snowui-state-cursor, pointer);
        position: relative;

        --snowui-switch-gap: var(--gap-1);
        --snowui-switch-size: var(--size-4);
        --snowui-switch-size-resolved: var(
            --snowui-switch-size-override,
            var(--snowui-switch-size)
        );
        --snowui-switch-color: var(--primary, var(--black-100, #000));
        --snowui-switch-color-resolved: var(
            --snowui-switch-color-override,
            var(--snowui-switch-color)
        );
        --snowui-switch-primary: currentColor;
        --snowui-switch-primary-resolved: var(
            --snowui-switch-primary-override,
            var(--snowui-switch-primary)
        );
        --snowui-switch-overlay-color: currentColor;
        --snowui-switch-overlay-color-resolved: var(
            --snowui-switch-overlay-color-override,
            var(--snowui-switch-overlay-color)
        );
        --snowui-switch-overlay-opacity: 0%;
        --snowui-switch-overlay-opacity-resolved: var(
            --snowui-switch-overlay-opacity-override,
            var(--snowui-switch-overlay-opacity)
        );
        --snowui-switch-height: var(--snowui-switch-size-resolved);
        --snowui-switch-height-resolved: var(
            --snowui-switch-height-override,
            var(--snowui-switch-height)
        );
        --snowui-switch-width: calc(var(--snowui-switch-height-resolved) * 1.8);
        --snowui-switch-width-resolved: var(
            --snowui-switch-width-override,
            var(--snowui-switch-width)
        );
        --snowui-control-inset: calc(var(--snowui-switch-height-resolved) / 14);
        --snowui-switch-radius: var(--radius-full);
        --snowui-switch-radius-resolved: var(
            --snowui-switch-radius-override,
            var(--snowui-switch-radius)
        );
        --snowui-switch-thumb-gap: calc(
            var(--snowui-switch-height-resolved) * 0.125
        );
        --snowui-switch-thumb-gap-resolved: var(
            --snowui-switch-thumb-gap-override,
            var(--snowui-switch-thumb-gap)
        );
        --snowui-switch-thumb-size: calc(
            var(--snowui-switch-height-resolved) -
                (var(--snowui-switch-thumb-gap-resolved) * 2)
        );
        --snowui-switch-thumb-size-resolved: var(
            --snowui-switch-thumb-size-override,
            var(--snowui-switch-thumb-size)
        );
        --snowui-switch-motion-duration: min(
            var(--snowui-frame-control-motion-duration, 300ms),
            150ms
        );
        --snowui-switch-motion-duration-resolved: var(
            --snowui-switch-motion-duration-override,
            var(--snowui-switch-motion-duration)
        );
        --snowui-switch-motion-easing: var(
            --snowui-frame-control-motion-easing,
            ease-out
        );
        --snowui-switch-motion-easing-resolved: var(
            --snowui-switch-motion-easing-override,
            var(--snowui-switch-motion-easing)
        );
        color: var(--snowui-switch-color-resolved);
    }

    /* 原生 input 覆盖整个 label 区域，透明但可点击 */
    :global(:where(.snowui-switch-sr-only)) {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        opacity: 0;
        cursor: inherit;
        z-index: 1;
    }

    :global(:where(.snowui-switch-track)) {
        width: var(--snowui-switch-width-resolved);
        height: var(--snowui-switch-height-resolved);
        background-color: color-mix(
            in srgb,
            var(--snowui-switch-primary-resolved) 20%,
            transparent
        );
        border-radius: var(--snowui-switch-radius-resolved);
        position: relative;
        flex-shrink: 0;
        transition: background-color
            var(--snowui-switch-motion-duration-resolved)
            var(--snowui-switch-motion-easing-resolved);
    }

    :global(:where(.snowui-switch-thumb)) {
        width: var(--snowui-switch-thumb-size-resolved);
        height: var(--snowui-switch-thumb-size-resolved);
        background-color: var(--static-white-100, #fff);
        border-radius: var(--snowui-switch-radius-resolved);
        position: absolute;
        top: var(--snowui-switch-thumb-gap-resolved);
        left: var(--snowui-switch-thumb-gap-resolved);
        transition: transform var(--snowui-switch-motion-duration-resolved)
            var(--snowui-switch-motion-easing-resolved);

        box-shadow: 0 calc(var(--padding-1) * 0.5) var(--padding-1) 0
            color-mix(in srgb, currentColor 10%, transparent);
    }

    /* Checked State - 使用 input sibling 选择器，避免 :has 兼容/稳定性问题 */
    :global(.snowui-switch-sr-only:checked + .snowui-switch-track) {
        background-color: var(--snowui-switch-primary-resolved);
        --snowui-switch-overlay-color: var(--static-white-100, #fff);
    }

    :global(
            .snowui-switch-sr-only:checked
                + .snowui-switch-track
                .snowui-switch-thumb
        ) {
        transform: translateX(
            calc(
                var(--snowui-switch-width-resolved) -
                    var(--snowui-switch-thumb-size-resolved) -
                    (var(--snowui-switch-thumb-gap-resolved) * 2)
            )
        );
    }

    /* Hover State - 按 StyleGuide 7.4 使用 background-image 叠加 (Level 2 Extension) */
    /* Unchecked state hover - 20% -> 24% (4% 叠加等价背景混合) */
    :global(.snowui-switch:not([data-disabled="true"]):hover)
        :global(.snowui-switch-sr-only:not(:checked) + .snowui-switch-track) {
        background-color: color-mix(
            in srgb,
            var(--snowui-switch-primary-resolved) 24%,
            transparent
        );
    }

    /* Checked state hover - primary 上叠加 20% static white (Level 4 Extension) */
    :global(.snowui-switch:not([data-disabled="true"]):hover)
        :global(.snowui-switch-sr-only:checked + .snowui-switch-track) {
        background-color: color-mix(
            in srgb,
            var(--static-white-100, #fff) 20%,
            var(--snowui-switch-primary-resolved)
        );
    }

    :global(:where(.snowui-switch-sr-only)):focus-visible
        + :global(:where(.snowui-switch-track)) {
        box-shadow: 0 0 0 var(--border-8)
            color-mix(in srgb, currentColor 4%, transparent);
    }
    /* Label Styling */
    :global(:where(.snowui-switch-label)) {
        font-size: var(--snowui-switch-label-font-size-override, inherit);
        line-height: var(--snowui-switch-label-line-height-override, inherit);
    }

    @media (prefers-reduced-motion: reduce) {
        :global(:where(.snowui-switch)) {
            --snowui-switch-motion-duration-resolved: 0s;
        }
    }
</style>
