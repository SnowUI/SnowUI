<!--
  Chip 组件：标签芯片 v1.1.0

  布局模型：槽位宿主布局（三槽位：leading / content / trailing）
  通过 Frame `row` 关键字激活 auto-layout 协议，子元素以 `data-as="leading|trailing"` 声明角色。

  视觉变体：
    - default（默认）：仅文字 + 内置 Dot leading 图标，无背景、无边框、无 padding；
    - background：文字色块背景 + 0.5px 边框，默认不显示 Dot，可通过 showDot 开启。

  尺寸档位：
    - sm（默认）：text-12 / leading-16；background 模式 padding 2px 8px；
    - lg：text-14 / leading-20；background 模式 padding 4px 12px。

  颜色规则：默认继承父容器文字颜色（currentColor）。背景与边框基于 currentColor 透明度
  自动派生（color-mix），改变文字颜色即同步改变背景与边框。

  内置 leading Dot 图标遵循 §2.7.1：当外部传入 `data-as="leading"` 子元素时，
  自动隐藏内置 Dot，由外部图标替换。

  详见：./Chip.md
-->

<script lang="ts">
    import type { Snippet } from "svelte";
    import Frame, { type FrameProps } from "./Frame.svelte";
    import { getSize } from "../context";

    interface Props extends Omit<FrameProps, "size"> {
        variant?: "default" | "background";
        size?: "sm" | "lg";
        showDot?: boolean;
        children?: Snippet;
        [key: string]: any;
    }

    let {
        variant = "default",
        size = undefined,
        showDot = undefined,
        class: className = "",
        children,
        ...rest
    }: Props = $props();

    // 父级尺寸上下文：用于在未显式传 size 时按尺寸基线推导档位
    const contextSize = getSize();
    const resolvedSize = $derived.by<"sm" | "lg">(() => {
        if (size) return size;
        if (typeof contextSize === "number") {
            return contextSize <= 12 ? "sm" : "lg";
        }
        return "sm";
    });
    const resolvedShowDot = $derived(showDot ?? variant === "default");

    // 检测外部 leading 槽位是否存在；存在则隐藏内置 Dot
    let hostElement = $state<HTMLElement>();
    let hasCustomLeading = $state(false);
    let hasLeadingIcon = $state(false);
    let hasTrailingIcon = $state(false);

    $effect(() => {
        if (!hostElement) return;
        const host = hostElement;
        const update = () => {
            hasCustomLeading = !!host.querySelector(
                ':scope > [data-as="leading"]:not(.snowui-chip-default-icon)',
            );
            hasLeadingIcon = !!host.querySelector(
                ':scope > .snowui-chip-default-icon[data-as="leading"], :scope > .snowui-icon-wrapper[data-as="leading"], :scope > svg[data-as="leading"]',
            );
            hasTrailingIcon = !!host.querySelector(
                ':scope > .snowui-icon-wrapper[data-as="trailing"], :scope > svg[data-as="trailing"]',
            );
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(host, { childList: true, subtree: false });
        return () => observer.disconnect();
    });
</script>

<Frame
    bind:element={hostElement}
    row
    enableResponsive={true}
    enableContext={true}
    enableScaleObserver={false}
    enableDefaultMotion={true}
    class={[
        "snowui-chip",
        `snowui-chip-${resolvedSize}`,
        `snowui-chip-${variant}`,
        className,
    ]
        .filter(Boolean)
        .join(" ")}
    data-edge-left={hasLeadingIcon ? "icon" : "text"}
    data-edge-right={hasTrailingIcon ? "icon" : "text"}
    renderHints={{
        variant: "line",
        height: resolvedSize === "lg" ? "var(--leading-14)" : "var(--leading-12)",
    }}
    {...rest}
>
    {#if resolvedShowDot && !hasCustomLeading}
        <!-- 内置默认 Dot 图标，使用 currentColor，可被外部 leading 替换 -->
        <span
            class="snowui-chip-default-icon"
            data-as="leading"
            aria-hidden="true"
        >
            <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
                <circle cx="16" cy="16" r="6" fill="currentColor" />
            </svg>
        </span>
    {/if}
    {@render children?.()}
</Frame>

<style>
    /* Level 2: 组件基类（specificity = 0） */
    :global(:where(.snowui-chip)) {
        --snowui-chip-font-size: var(--text-12);
        --snowui-chip-line-height: var(--leading-12);
        --snowui-chip-gap: 0;
        --snowui-chip-icon-size: calc(var(--size-4) * 3 / 4); /* 12px */
        --snowui-chip-padding: 0;
        --snowui-chip-radius: 0;
        --snowui-chip-bg: transparent;
        /* 描边使用 inset box-shadow，避免占用布局空间且与背景共享圆角 */
        --snowui-chip-shadow: none;

        display: inline-flex;
        flex: 0 0 auto;
        flex-wrap: nowrap;
        align-items: center;
        width: max-content;
        box-sizing: border-box;
        color: inherit;
        font-size: var(
            --snowui-chip-font-size-override,
            var(--snowui-chip-font-size)
        );
        line-height: var(
            --snowui-chip-line-height-override,
            var(--snowui-chip-line-height)
        );
        gap: var(--snowui-chip-gap-override, var(--snowui-chip-gap));
        padding: var(
            --snowui-chip-padding-override,
            var(--snowui-chip-padding)
        );
        border-radius: var(
            --snowui-chip-radius-override,
            var(--snowui-chip-radius)
        );
        background-color: var(
            --snowui-chip-background-override,
            var(--snowui-chip-bg)
        );
        box-shadow: var(
            --snowui-chip-shadow-override,
            var(--snowui-chip-shadow)
        );
        white-space: nowrap;
        --snowui-frame-component-transition:
            background-color
                var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            box-shadow var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out),
            color var(--snowui-frame-color-motion-duration, 0.15s)
                var(--snowui-frame-color-motion-easing, ease-out);
    }

    /* Level 4: 尺寸档位（仅更新变量） */
    :global(:where(.snowui-chip).snowui-chip-lg) {
        --snowui-chip-font-size: var(--text-14);
        --snowui-chip-line-height: var(--leading-14);
        --snowui-chip-icon-size: var(--size-4); /* 16px */
    }

    /* Level 4: background 变体 — 文字色派生背景与边框，胶囊圆角 */
    :global(:where(.snowui-chip).snowui-chip-background) {
        --snowui-chip-padding: 2px var(--padding-2);
        --snowui-chip-radius: 9999px;
        --snowui-chip-bg: color-mix(in srgb, currentColor 10%, transparent);
        --snowui-chip-shadow: inset 0 0 0 0.5px
            color-mix(in srgb, currentColor 20%, transparent);
    }

    :global(
            :where(.snowui-chip).snowui-chip-background.snowui-chip-lg
        ) {
        --snowui-chip-padding: var(--padding-1) var(--padding-3);
    }

    /* background 变体中，有图标的一侧按尺寸收紧：sm 4px，lg 8px。 */
    :global(
            :where(.snowui-chip).snowui-chip-background[data-edge-left="icon"]
        ) {
        padding-left: var(--padding-1);
    }

    :global(
            :where(.snowui-chip).snowui-chip-background[data-edge-right="icon"]
        ) {
        padding-right: var(--padding-1);
    }

    :global(
            :where(.snowui-chip).snowui-chip-background.snowui-chip-lg[data-edge-left="icon"]
        ) {
        padding-left: var(--padding-2);
    }

    :global(
            :where(.snowui-chip).snowui-chip-background.snowui-chip-lg[data-edge-right="icon"]
        ) {
        padding-right: var(--padding-2);
    }

    /* 内置默认 Dot 图标 */
    :global(:where(.snowui-chip-default-icon)) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: var(--snowui-chip-icon-size);
        height: var(--snowui-chip-icon-size);
        color: inherit;
    }

    :global(:where(.snowui-chip-default-icon) > svg) {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
