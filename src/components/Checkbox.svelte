<!-- 
 Checkbox 组件：复选框控件
 v1.2.19

 1. 核心能力:
    - 支持选中、未选中、不确定三种状态
    - 双向绑定 checked 和 indeterminate 状态
    - 支持自定义尺寸
    - 支持禁用状态
    - 继承 Frame 组件的通用能力

 2. 视觉设计:
    - 方形外框 + 内部图标（勾选/横线）
    - Hover 状态反馈
    - 平滑的选中动画
    - 补齐 Frame 能力开关显式传参
    - 内部变量命名对齐 snowui 规范
 -->

<script lang="ts">
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSizeContext, getSize, type ResourceSize } from "../context";
    import {
        DEFAULT_RESOURCE_SIZE_TOKEN,
        resolveResourceSizeToken,
    } from "../logic/resource-size";
    import type { Snippet } from "svelte";
    import {
        mergeComponentPartProps,
        useComponentPart,
    } from "../logic/component-parts.svelte";

    interface Props extends Omit<FrameProps, "size"> {
        checked?: boolean;
        group?: any[];
        value?: any;
        size?: ResourceSize | number;
        disabled?: boolean;
        indeterminate?: boolean;
        onCheckedChange?: (checked: boolean) => void;
        ariaLabel?: string;
        children?: Snippet;
        enableResponsive?: boolean;
        enableContext?: boolean;
        [key: string]: any;
    }

    const inheritedCheckboxPart = useComponentPart<Props>("Checkbox");
    let {
        checked = $bindable(false),
        group = $bindable(),
        indeterminate = $bindable(false),
        ...explicitProps
    }: Props = $props();
    let {
        // Component props
        value,
        size = undefined,
        disabled = false,
        onCheckedChange,
        ariaLabel = undefined,
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
    }: Omit<Props, "checked" | "group" | "indeterminate"> = $derived(
        mergeComponentPartProps(
            inheritedCheckboxPart.current as Partial<
                Omit<Props, "checked" | "group" | "indeterminate">
            >,
            explicitProps,
        ),
    );

    // 读取父级尺寸上下文
    getSize();
    const sizeCtx = getSizeContext();
    const contextSize = $derived(
        sizeCtx?.iconSize !== undefined ? sizeCtx.iconSize : sizeCtx?.size,
    );
    // 优先使用 prop size，其次使用 context size
    const resolvedSize = $derived(size ?? contextSize ?? 16);
    const resolvedSizeToken = $derived(resolveResourceSizeToken(resolvedSize));
    const DEFAULT_CHECKBOX_SIZE_TOKEN = DEFAULT_RESOURCE_SIZE_TOKEN;
    const checkboxSizeStyle = $derived(
        resolvedSizeToken !== DEFAULT_CHECKBOX_SIZE_TOKEN
            ? `--snowui-checkbox-size: ${resolvedSizeToken}`
            : "",
    );
    const checkboxRootStyle = $derived(
        [checkboxSizeStyle, userStyle].filter(Boolean).join("; ") || undefined,
    );
    const checkboxRenderHints = $derived({
        variant: userRenderHints?.variant ?? "rect",
        width: userRenderHints?.width ?? resolvedSizeToken,
        height: userRenderHints?.height ?? resolvedSizeToken,
        radius:
            userRenderHints?.radius ??
            `calc(${resolvedSizeToken} * 0.3125)`,
    });

    // Group Management: 从 group 同步到 checked
    $effect(() => {
        if (group !== undefined) {
            if (Array.isArray(group)) {
                checked = group.includes(value);
            }
        }
    });

    // Group Management: 从 checked 同步到 group
    $effect(() => {
        if (group !== undefined && Array.isArray(group)) {
            if (checked) {
                if (!group.includes(value)) {
                    group = [...group, value];
                }
            } else {
                group = group.filter((v: any) => v !== value);
            }
        }
    });

    // 处理用户点击 - 主要用于 group 同步和 indeterminate 清除
    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        // 同步回 prop (对于 bind:checked 场景)
        checked = target.checked;
        onCheckedChange?.(checked);
        // 清除 indeterminate
        if (indeterminate) {
            indeterminate = false;
        }
    }

</script>

<Frame
    tag="label"
    class={`snowui-checkbox${userClass ? ` ${userClass}` : ""}`}
    data-disabled={disabled ? "true" : undefined}
    {disabled}
    style={checkboxRootStyle}
    enableResponsive={enableResponsive}
    enableContext={enableContext}
    enableScaleObserver={false}
    renderHints={checkboxRenderHints}
    {...rest}
>
    <input
        type="checkbox"
        class="snowui-checkbox-sr-only"
        bind:checked
        bind:indeterminate
        {value}
        {disabled}
        onchange={handleChange}
        tabindex={disabled ? -1 : 0}
        aria-label={ariaLabel}
    />
    <div class="snowui-checkbox-visual snowui-rounded-rectangle">
        <svg
            class="snowui-checkbox-icon"
            viewBox="2 2 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {#if indeterminate}
                <!-- Minus Icon (圆角) - 从32x32缩放到16x16 -->
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.75 8C4.75 7.586 5.086 7.25 5.5 7.25H10.5C10.914 7.25 11.25 7.586 11.25 8C11.25 8.414 10.914 8.75 10.5 8.75H5.5C5.086 8.75 4.75 8.414 4.75 8Z"
                    fill="currentColor"
                />
            {:else if checked}
                <!-- Check Icon (圆角) - 从32x32缩放到16x16 -->
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.009 6.199C11.313 6.480 11.332 6.954 11.051 7.259L8.240 10.304C7.836 10.741 7.144 10.732 6.752 10.285L5.186 8.494C4.913 8.182 4.944 7.708 5.256 7.436C5.568 7.163 6.042 7.194 6.314 7.506L7.515 8.878L9.949 6.241C10.230 5.937 10.704 5.918 11.009 6.199Z"
                    fill="currentColor"
                />
            {/if}
        </svg>
    </div>
    {#if children}
        <span class="snowui-checkbox-label">
            {@render children()}
        </span>
    {/if}
</Frame>

<style>
    /* 原生 input 覆盖整个 label 区域，透明但可点击 */
    :global(:where(.snowui-checkbox-sr-only)) {
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

    /* Level 2: Component Base (降权为 0) */
    :global(:where(.snowui-checkbox)) {
        display: inline-flex;
        align-items: center;
        gap: var(
            --snowui-checkbox-gap-override,
            var(--snowui-checkbox-gap, var(--gap-1))
        );
        vertical-align: middle;
        user-select: none;
        cursor: var(--snowui-state-cursor, pointer);
        position: relative;

        /* Defaults - 16px 基准尺寸 */
        --snowui-checkbox-gap: var(--gap-1);
        --snowui-checkbox-size: var(--size-4);
        --snowui-checkbox-size-resolved: var(
            --snowui-checkbox-size-override,
            var(--snowui-checkbox-size)
        );
        --snowui-checkbox-radius: calc(
            var(--snowui-checkbox-size-resolved) * 0.3125
        ); /* 5px at 16px */
        --snowui-checkbox-radius-resolved: var(
            --snowui-checkbox-radius-override,
            var(--snowui-checkbox-radius)
        );
        --snowui-checkbox-border-width: var(--border-2);
        --snowui-checkbox-border-width-resolved: var(
            --snowui-checkbox-border-width-override,
            var(--snowui-checkbox-border-width)
        );
        --snowui-checkbox-color: var(--primary, var(--black-100, #000));
        --snowui-checkbox-color-resolved: var(
            --snowui-checkbox-color-override,
            var(--snowui-checkbox-color)
        );
        --snowui-checkbox-primary: var(
            --snowui-checkbox-primary-override,
            currentColor
        );
        --snowui-checkbox-overlay-color: currentColor;
        --snowui-checkbox-overlay-color-resolved: var(
            --snowui-checkbox-overlay-color-override,
            var(--snowui-checkbox-overlay-color)
        );
        --snowui-checkbox-overlay-opacity: 0%;
        --snowui-checkbox-overlay-opacity-resolved: var(
            --snowui-checkbox-overlay-opacity-override,
            var(--snowui-checkbox-overlay-opacity)
        );
        --snowui-checkbox-motion-duration: var(
            --snowui-frame-control-motion-duration,
            300ms
        );
        --snowui-checkbox-motion-duration-resolved: var(
            --snowui-checkbox-motion-duration-override,
            var(--snowui-checkbox-motion-duration)
        );
        --snowui-checkbox-motion-easing: var(
            --snowui-frame-control-motion-easing,
            ease-out
        );
        --snowui-checkbox-motion-easing-resolved: var(
            --snowui-checkbox-motion-easing-override,
            var(--snowui-checkbox-motion-easing)
        );
        color: var(--snowui-checkbox-color-resolved);
    }

    :global(:where(.snowui-checkbox-visual)) {
        width: var(--snowui-checkbox-size-resolved);
        height: var(--snowui-checkbox-size-resolved);
        border-radius: var(--snowui-checkbox-radius-resolved);
        /* 内边框: 使用 box-shadow: inset 替代 border */
        box-shadow: inset 0 0 0 var(--snowui-checkbox-border-width-resolved)
            color-mix(in srgb, var(--black-100, #000) 20%, transparent);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        /* 未选中态背景: Background/3 */
        background-color: var(--background-3, #fff);
        background-image: none;
        flex-shrink: 0;
        transition: background-color var(--snowui-frame-color-motion-duration, 0.15s) var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* Level 4: Component States (标准权重胜过 Utilities) */

    /* Checked State - 使用 sibling 选择器，避免 :has() 触发闪动 */
    :global(.snowui-checkbox-sr-only:checked + .snowui-checkbox-visual) {
        background-color: var(--snowui-checkbox-primary);
        box-shadow: inset 0 0 0 var(--snowui-checkbox-border-width-resolved)
            var(--snowui-checkbox-primary);
    }

    /* Indeterminate State - 使用 sibling 选择器，避免 :has() 触发闪动 */
    :global(:where(.snowui-checkbox-sr-only):indeterminate + .snowui-checkbox-visual) {
        background-color: var(--snowui-checkbox-primary);
        box-shadow: inset 0 0 0 var(--snowui-checkbox-border-width-resolved)
            var(--snowui-checkbox-primary);
    }

    /* Level 2 Extension: Internal icons */
    :global(:where(.snowui-checkbox-icon)) {
        width: 100%;
        height: 100%;
        display: block;
        color: currentColor;
        opacity: 0;
        transform: scale(0.5);
        transition:
            opacity var(--snowui-checkbox-motion-duration-resolved)
                var(--snowui-checkbox-motion-easing-resolved),
            transform var(--snowui-checkbox-motion-duration-resolved)
                var(--snowui-checkbox-motion-easing-resolved);
    }

    /* Icon 可见 (Level 4 Trigger) */
    :global(
            .snowui-checkbox-sr-only:checked
                + .snowui-checkbox-visual
                .snowui-checkbox-icon
        ),
    :global(
            .snowui-checkbox-sr-only:indeterminate
                + .snowui-checkbox-visual
                .snowui-checkbox-icon
        ) {
        color: var(--static-white-100, #fff);
        opacity: 1;
        transform: scale(1);
    }
    :global(
            .snowui-checkbox-sr-only:checked
                + .snowui-checkbox-visual
                .snowui-checkbox-icon
                path
        ),
    :global(
            .snowui-checkbox-sr-only:indeterminate
                + .snowui-checkbox-visual
                .snowui-checkbox-icon
                path
        ) {
        fill: var(--static-white-100, #fff);
    }

    /* ========== Hover State (Level 2 Extension) ========== */
    /* Unchecked Hover - 直接背景混色 4% currentColor */
    :global(.snowui-checkbox:not([data-disabled="true"]):hover)
        :global(
            .snowui-checkbox-sr-only:not(:checked):not(:indeterminate)
                + .snowui-checkbox-visual
        ) {
        background-color: color-mix(
            in srgb,
            var(--snowui-checkbox-primary) 4%,
            transparent
        );
    }

    /* Checked/Indeterminate Hover - primary 上叠加 20% static white */
    :global(.snowui-checkbox:not([data-disabled="true"]):hover)
        :global(.snowui-checkbox-sr-only:checked + .snowui-checkbox-visual),
    :global(.snowui-checkbox:not([data-disabled="true"]):hover)
        :global(
            .snowui-checkbox-sr-only:indeterminate + .snowui-checkbox-visual
        ) {
        background-color: color-mix(
            in srgb,
            var(--static-white-100, #fff) 20%,
            var(--snowui-checkbox-primary)
        );
    }

    /* Focus Visible */
    :global(:where(.snowui-checkbox-sr-only)):focus-visible
        + :global(:where(.snowui-checkbox-visual)) {
        box-shadow: 0 0 0 var(--border-8)
            color-mix(in srgb, var(--snowui-checkbox-primary) 20%, transparent);
    }

    /* Label Styling */
    :global(:where(.snowui-checkbox-label)) {
        font-size: var(--snowui-checkbox-label-font-size-override, inherit);
        line-height: var(--snowui-checkbox-label-line-height-override, inherit);
    }
</style>
